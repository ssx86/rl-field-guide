import os

from playwright.sync_api import sync_playwright


BASE = os.environ.get("RL_GUIDE_BASE", "http://127.0.0.1:5180/rl-field-guide").rstrip("/")


def assert_no_overflow(page, url: str, width: int) -> None:
    page.set_viewport_size({"width": width, "height": 900})
    page.goto(url, wait_until="networkidle")
    metrics = page.evaluate("({client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth})")
    assert metrics["scroll"] == metrics["client"], (width, url, metrics)


def assert_formula_cards_are_readable(page, url: str) -> None:
    page.set_viewport_size({"width": 1440, "height": 900})
    page.goto(url, wait_until="networkidle")
    desktop = page.locator(".formula-render").evaluate_all("""cards => cards.map(card => ({
        client: card.clientWidth,
        scroll: card.scrollWidth,
        errors: card.querySelectorAll('.katex-error').length,
    }))""")
    assert desktop, url
    assert all(card["errors"] == 0 for card in desktop), (url, desktop)
    assert all(card["scroll"] <= card["client"] + 1 for card in desktop), (url, desktop)

    page.set_viewport_size({"width": 390, "height": 900})
    page.goto(url, wait_until="networkidle")
    mobile = page.locator(".formula-render").evaluate_all("""cards => cards.map(card => {
        card.scrollLeft = card.scrollWidth;
        const formula = card.querySelector('.katex');
        const cardBox = card.getBoundingClientRect();
        const formulaBox = formula?.getBoundingClientRect();
        return {
            overflowX: getComputedStyle(card).overflowX,
            lastGlyphVisible: formulaBox ? formulaBox.right <= cardBox.right + 1 : false,
        };
    })""")
    assert all(card["overflowX"] in ("auto", "scroll") for card in mobile), (url, mobile)
    assert all(card["lastGlyphVisible"] for card in mobile), (url, mobile)


with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 900})
    console_errors: list[str] = []
    page.on("console", lambda message: console_errors.append(message.text) if message.type == "error" else None)

    page.goto(f"{BASE}/", wait_until="networkidle")
    assert page.get_by_role("link", name="Open English course").count() == 1
    assert page.get_by_role("link", name="打开中文课程").count() == 1
    assert page.get_by_role("link", name="Open bilingual English and Chinese course").count() == 1

    page.goto(f"{BASE}/en/", wait_until="networkidle")
    assert page.locator(".route-stage").count() == 9
    chapter_urls = page.locator(".roadmap-link").evaluate_all("links => links.map(link => link.href)")
    assert len(chapter_urls) == 46
    assert page.get_by_role("link", name="阅读中文版").count() == 1
    assert page.get_by_role("link", name="Read alternating English and Chinese").count() == 1
    assert page.get_by_role("link", name="Read the panorama first").get_attribute("href").endswith("/en/learn/rl-panorama/")

    page.goto(f"{BASE}/zh/", wait_until="networkidle")
    assert page.locator("html").get_attribute("lang") == "zh-CN"
    assert page.locator(".route-stage").count() == 9
    chinese_chapter_urls = page.locator(".roadmap-link").evaluate_all("links => links.map(link => link.href)")
    assert len(chinese_chapter_urls) == 46
    assert page.get_by_role("link", name="Read in English").count() == 1
    assert page.get_by_role("link", name="先读全景文章").get_attribute("href").endswith("/zh/learn/rl-panorama/")

    page.goto(f"{BASE}/bilingual/", wait_until="networkidle")
    bilingual_chapter_urls = page.locator(".roadmap-link").evaluate_all("links => links.map(link => link.href)")
    assert len(bilingual_chapter_urls) == 46

    page.goto(f"{BASE}/en/learn/rl-panorama/#models", wait_until="networkidle")
    assert page.locator(".panorama-movement").count() == 9
    assert page.locator(".knowledge-link-chapter").count() >= 20
    assert page.locator(".panorama-diagnostic li").count() == 7
    assert page.locator(".panorama-prose > .panorama-turn").count() == 9
    assert page.locator(".panorama-prose > .panorama-coda").count() == 9
    assert page.locator("main table").count() == 0
    assert page.get_by_role("link", name="阅读中文导读").get_attribute("href").endswith("/zh/learn/rl-panorama/#models")

    page.goto(f"{BASE}/zh/learn/rl-panorama/", wait_until="networkidle")
    assert page.locator("html").get_attribute("lang") == "zh-CN"
    assert page.locator(".panorama-movement").count() == 9
    assert page.locator(".panorama-diagnostic li").count() == 7

    page.goto(f"{BASE}/bilingual/learn/rl-panorama/", wait_until="networkidle")
    assert page.locator(".language-pair").count() >= 40
    assert page.locator('[lang="en"]').count() > 20
    assert page.locator('[lang="zh-CN"]').count() > 20
    assert page.locator(".language-marker").count() >= 70

    page.goto(f"{BASE}/en/", wait_until="networkidle")

    theme = page.locator("[data-theme-toggle]")
    assert theme.get_attribute("aria-label") == "Switch to dark"
    theme.click()
    assert theme.get_attribute("aria-label") == "Switch to light"
    assert page.locator('meta[name="theme-color"]').get_attribute("content") == "#111614"

    for chapter_url in chapter_urls:
        page.goto(chapter_url, wait_until="networkidle")
        assert page.locator("main .knowledge-diagram").count() == 1
        assert page.locator("main .static-evidence").count() == 1
        assert page.locator("main .longform-prose").count() >= 2
        assert page.locator("main button, main input, main select, main textarea").count() == 0
        assert page.locator("astro-island").count() == 1
        assert page.locator("[data-knowledge-term]").count() >= 1
        assert page.locator(".knowledge-tip-definition").count() == 1
        assert page.locator("[data-heading-anchor]").count() >= 4
        assert page.locator(".static-evidence-steps li").count() >= 3
        assert page.locator(".lesson-references a").count() >= 2
        assert page.locator("#mechanism .mechanism-passage").count() == 4
        assert page.locator("#mechanism h3, #mechanism .prose-marker, #mechanism .prose-subsection").count() == 0
        assert page.locator(".lesson-transition").count() == 1
        assert page.locator(".lesson-sections").count() == 0
        assert page.locator(".chapter-outline-desktop a").count() >= 5
        assert page.locator(".lesson-next span").count() == 0
        assert page.get_by_text("What the example was really showing", exact=True).count() == 0

    for chapter_url in chinese_chapter_urls:
        page.goto(chapter_url, wait_until="networkidle")
        assert page.locator("html").get_attribute("lang") == "zh-CN"
        assert page.locator(".narrative-section").count() >= 2
        assert page.locator("main .longform-prose").count() >= 2
        assert page.locator("main button, main input, main select, main textarea").count() == 0
        assert page.locator("astro-island").count() == 1
        assert page.locator("[data-knowledge-term]").count() >= 1
        assert page.locator(".knowledge-tip-definition").count() == 1
        assert page.locator("[data-heading-anchor]").count() >= 4
        assert page.locator(".lesson-references a").count() >= 2
        navigation = page.locator(".chapter-outline-desktop a")
        assert navigation.count() >= 4
        targets = navigation.evaluate_all("links => links.map(link => link.hash.slice(1))")
        assert len(targets) == len(set(targets))
        for target in targets:
            assert page.locator(f"#{target}").count() == 1, (chapter_url, target)
        assert page.locator(".lesson-transition").count() == 1
        assert page.locator(".lesson-sections").count() == 0
        assert page.locator(".lesson-next span").count() == 0
        assert page.get_by_text("这个例子真正说明了什么", exact=True).count() == 0

    for chapter_url in bilingual_chapter_urls:
        page.goto(chapter_url, wait_until="networkidle")
        assert page.locator(".bilingual-section").count() >= 5
        assert page.locator(".language-marker").count() >= 10
        assert page.locator('.language-switch [aria-current="page"]').get_attribute("aria-label") == "Read this chapter in alternating English and Chinese"
        assert page.locator(".lesson-sections").count() == 0
        assert page.locator(".chapter-outline-desktop a").count() >= 5
        assert page.locator(".chapter-outline-mobile").count() == 1
        assert page.locator(".katex-error").count() == 0
        assert page.locator("astro-island").count() == 1
        assert page.locator("[data-knowledge-term]").count() >= 2
        assert page.locator(".knowledge-tip-definition").count() == 1
        assert page.locator("[data-heading-anchor]").count() >= 4

    page.goto(f"{BASE}/en/learn/tabular-control/", wait_until="networkidle")
    first_term = page.locator("[data-knowledge-term]").first
    first_term.hover()
    page.locator(".knowledge-hover-card[data-state='open']").wait_for(state="visible")
    assert page.locator(".knowledge-card-definition").count() == 1
    page.locator("h1").hover()
    first_term.focus()
    page.locator(".knowledge-hover-card[data-state='open']").wait_for(state="visible")
    page.keyboard.press("Escape")
    heading_anchor = page.locator("[data-heading-anchor]").first
    heading_anchor.click()
    assert heading_anchor.get_attribute("data-copied") == "true"
    assert page.locator(".diagram-formula-compare .diagram-items > li").count() == 4
    assert page.locator(".diagram-formula-compare .katex-display").count() == 4
    assert page.locator(".diagram-formula-compare .katex-error").count() == 0
    formula_layout = page.evaluate("""(() => {
        const figure = document.querySelector('.diagram-formula-compare');
        const rows = [...document.querySelectorAll('.diagram-formula-compare .diagram-items > li')];
        return {
            pageClient: document.documentElement.clientWidth,
            pageScroll: document.documentElement.scrollWidth,
            figureClient: figure?.clientWidth ?? 0,
            figureScroll: figure?.scrollWidth ?? 0,
            rowWidths: rows.map(row => row.getBoundingClientRect().width),
        };
    })()""")
    assert formula_layout["pageClient"] == formula_layout["pageScroll"], formula_layout
    assert formula_layout["figureClient"] == formula_layout["figureScroll"], formula_layout
    assert min(formula_layout["rowWidths"]) > 700, formula_layout

    page.goto(f"{BASE}/zh/learn/tabular-control/", wait_until="networkidle")
    assert page.locator(".diagram-formula-compare .diagram-items > li").count() == 4
    assert page.locator(".diagram-formula-compare .katex-display").count() == 4
    assert page.locator(".diagram-formula-compare .katex-error").count() == 0
    assert page.evaluate("document.documentElement.scrollWidth === document.documentElement.clientWidth")

    assert_formula_cards_are_readable(page, f"{BASE}/en/learn/method-selection/")
    assert_formula_cards_are_readable(page, f"{BASE}/zh/learn/method-selection/")

    mobile_context = browser.new_context(viewport={"width": 390, "height": 844}, has_touch=True, is_mobile=True)
    mobile_page = mobile_context.new_page()
    mobile_page.goto(f"{BASE}/bilingual/learn/tabular-control/", wait_until="networkidle")
    mobile_page.locator("[data-knowledge-term]").first.click()
    mobile_page.locator(".knowledge-sheet-content[data-state='open']").wait_for(state="visible")
    assert mobile_page.locator(".knowledge-sheet-content .knowledge-card-definition [lang='en']").count() == 1
    assert mobile_page.locator(".knowledge-sheet-content .knowledge-card-definition [lang='zh-CN']").count() == 1
    assert mobile_page.evaluate("document.documentElement.scrollWidth === document.documentElement.clientWidth")
    mobile_context.close()

    page.goto(f"{BASE}/zh/learn/continuous-control/#diagram", wait_until="networkidle")
    language_toggle = page.get_by_role("link", name="Read this chapter in English")
    assert language_toggle.get_attribute("href").endswith("/en/learn/continuous-control/#diagram")

    page.goto(f"{BASE}/zh/learn/continuous-control/#three-ways-to-stabilize", wait_until="networkidle")
    language_toggle = page.get_by_role("link", name="Read this chapter in English")
    assert language_toggle.get_attribute("href").endswith("/en/learn/continuous-control/")

    page.set_viewport_size({"width": 1440, "height": 900})
    page.goto(f"{BASE}/en/learn/continuous-control/", wait_until="networkidle")
    assert page.locator(".lesson-sections").count() == 0
    page.locator('.chapter-outline-desktop a[href="#mechanism"]').click()
    assert page.locator("#mechanism").count() == 1

    for viewport in (320, 375, 390, 768, 1024, 1440):
        assert_no_overflow(page, f"{BASE}/en/learn/rl-panorama/", viewport)
        assert_no_overflow(page, f"{BASE}/zh/learn/rl-panorama/", viewport)
        assert_no_overflow(page, f"{BASE}/bilingual/learn/rl-panorama/", viewport)
        assert_no_overflow(page, f"{BASE}/en/learn/method-selection/", viewport)
        assert_no_overflow(page, f"{BASE}/en/learn/tabular-control/", viewport)
        assert_no_overflow(page, f"{BASE}/zh/learn/method-selection/", viewport)
        assert_no_overflow(page, f"{BASE}/zh/learn/tabular-control/", viewport)
        assert_no_overflow(page, f"{BASE}/bilingual/learn/tabular-control/", viewport)

    page.set_viewport_size({"width": 1280, "height": 900})
    page.goto(f"{BASE}/en/", wait_until="networkidle")
    page.locator("body").press("Tab")
    assert page.get_by_role("link", name="Skip to main content").evaluate("el => el === document.activeElement")

    assert not console_errors, console_errors
    print("Browser audit passed: three reading modes, compact language labels, alternating bilingual prose, rail/mobile chapter outlines, formulas, theme, keyboard, and 6 responsive viewports.")
    browser.close()
