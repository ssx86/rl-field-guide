import os

from playwright.sync_api import sync_playwright


BASE = os.environ.get(
    "RL_GUIDE_BASE", "http://127.0.0.1:5180/rl-field-guide"
).rstrip("/")
LESSONS = [
    "before-rl", "interaction-loop", "return-and-time", "bandits", "mdp", "planning",
    "mc-and-td", "control", "deep-value", "policy-learning", "continuous-and-models",
    "llm-post-training", "llm-rlhf", "llm-preference", "llm-reasoning", "real-world-practice",
]


def assert_no_overflow(page, width: int) -> None:
    page.set_viewport_size({"width": width, "height": 900})
    page.goto(f"{BASE}/en/learn/real-world-practice/", wait_until="networkidle")
    metrics = page.evaluate(
        "({client: document.documentElement.clientWidth, scroll: document.documentElement.scrollWidth})"
    )
    assert metrics["scroll"] == metrics["client"], (width, metrics)
    assert page.get_by_text("16 / 16", exact=False).first.is_visible()


with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 900})
    console_errors: list[str] = []
    page.on("console", lambda message: console_errors.append(message.text) if message.type == "error" else None)

    for language in ("en", "zh"):
        for lesson in LESSONS:
            page.goto(f"{BASE}/{language}/learn/{lesson}/", wait_until="networkidle")
            assert page.locator("main .knowledge-diagram").count() == 1
            assert page.locator("main .static-evidence").count() == 1
            assert page.locator("main button, main input, main select, main textarea").count() == 0
            assert page.locator("astro-island").count() == 0
            assert page.locator(".static-evidence-steps li").count() >= 2

    page.goto(f"{BASE}/en/", wait_until="networkidle")
    assert page.locator(".route-stage").count() == 7
    theme = page.locator("[data-theme-toggle]")
    assert theme.get_attribute("aria-label") == "Switch to dark"
    theme.click()
    assert theme.get_attribute("aria-label") == "Switch to light"
    assert page.locator('meta[name="theme-color"]').get_attribute("content") == "#111614"

    page.goto(f"{BASE}/en/learn/llm-rlhf/", wait_until="networkidle")
    page.get_by_role("link", name="中文").click()
    page.wait_for_load_state("networkidle")
    assert "/zh/learn/llm-rlhf/" in page.url

    for viewport in (320, 375, 390, 768):
        assert_no_overflow(page, viewport)

    page.set_viewport_size({"width": 1280, "height": 900})
    page.goto(f"{BASE}/en/", wait_until="networkidle")
    page.locator("body").press("Tab")
    assert page.get_by_role("link", name="Skip to main content").evaluate("el => el === document.activeElement")

    assert not console_errors, console_errors
    print("Browser audit passed: 32 reading pages, 32 diagrams, no lesson controls, theme/language/keyboard, and 4 responsive viewports.")
    browser.close()
