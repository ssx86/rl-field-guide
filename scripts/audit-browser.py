import os

from playwright.sync_api import sync_playwright


BASE = os.environ.get("RL_GUIDE_BASE", "http://127.0.0.1:5180/rl-field-guide").rstrip("/")


def assert_no_overflow(page, url: str, width: int) -> None:
    page.set_viewport_size({"width": width, "height": 900})
    page.goto(url, wait_until="networkidle")
    metrics = page.evaluate("({client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth})")
    assert metrics["scroll"] == metrics["client"], (width, url, metrics)


with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 900})
    console_errors: list[str] = []
    page.on("console", lambda message: console_errors.append(message.text) if message.type == "error" else None)

    page.goto(f"{BASE}/", wait_until="networkidle")
    assert page.get_by_role("link", name="Open English course").count() == 1
    assert page.get_by_role("link", name="打开中文课程").count() == 1

    page.goto(f"{BASE}/en/", wait_until="networkidle")
    assert page.locator(".route-stage").count() == 9
    chapter_urls = page.locator(".roadmap-link").evaluate_all("links => links.map(link => link.href)")
    assert len(chapter_urls) == 46
    assert page.get_by_role("link", name="中文").count() == 1

    page.goto(f"{BASE}/zh/", wait_until="networkidle")
    assert page.locator("html").get_attribute("lang") == "zh-CN"
    assert page.locator(".route-stage").count() == 9
    chinese_chapter_urls = page.locator(".roadmap-link").evaluate_all("links => links.map(link => link.href)")
    assert len(chinese_chapter_urls) == 46
    assert page.get_by_role("link", name="English").count() == 1

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
        assert page.locator("astro-island").count() == 0
        assert page.locator(".static-evidence-steps li").count() >= 3
        assert page.locator(".lesson-references a").count() >= 2

    for chapter_url in chinese_chapter_urls:
        page.goto(chapter_url, wait_until="networkidle")
        assert page.locator("html").get_attribute("lang") == "zh-CN"
        assert page.locator("main .knowledge-diagram").count() == 1
        assert page.locator("main .static-evidence").count() == 1
        assert page.locator("main .longform-prose").count() >= 2
        assert page.locator("main button, main input, main select, main textarea").count() == 0
        assert page.locator("astro-island").count() == 0
        assert page.locator(".static-evidence-steps li").count() >= 3
        assert page.locator(".lesson-references a").count() >= 2

    page.goto(f"{BASE}/en/learn/tabular-control/", wait_until="networkidle")
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

    page.goto(f"{BASE}/zh/learn/continuous-control/#mechanism", wait_until="networkidle")
    language_toggle = page.get_by_role("link", name="English")
    assert language_toggle.get_attribute("href").endswith("/en/learn/continuous-control/#mechanism")

    page.goto(f"{BASE}/en/learn/continuous-control/", wait_until="networkidle")
    page.get_by_role("link", name="Mechanism", exact=True).click()
    anchor_metrics = page.evaluate("({top: document.querySelector('#mechanism').getBoundingClientRect().top, navBottom: document.querySelector('.lesson-sections').getBoundingClientRect().bottom})")
    assert anchor_metrics["top"] >= anchor_metrics["navBottom"], anchor_metrics

    for viewport in (320, 375, 390, 768):
        assert_no_overflow(page, f"{BASE}/en/learn/method-selection/", viewport)
        assert_no_overflow(page, f"{BASE}/en/learn/tabular-control/", viewport)
        assert_no_overflow(page, f"{BASE}/zh/learn/method-selection/", viewport)
        assert_no_overflow(page, f"{BASE}/zh/learn/tabular-control/", viewport)

    page.set_viewport_size({"width": 1280, "height": 900})
    page.goto(f"{BASE}/en/", wait_until="networkidle")
    page.locator("body").press("Tab")
    assert page.get_by_role("link", name="Skip to main content").evaluate("el => el === document.activeElement")

    assert not console_errors, console_errors
    print("Browser audit passed: 46 matched English/Chinese chapters, strict bilingual tabular-control formula matrix, 92 diagrams and examples, language-preserving anchors, theme, keyboard, and 4 responsive viewports.")
    browser.close()
