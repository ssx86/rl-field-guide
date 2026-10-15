from __future__ import annotations

import json
from pathlib import Path

from playwright.sync_api import sync_playwright


BASE = "http://127.0.0.1:5180/rl-field-guide"
OUT = Path(__file__).resolve().parent

PAGES = [
    ("panorama", "/zh/learn/rl-panorama/", False),
    ("tabular-control", "/zh/learn/tabular-control/", True),
    ("rlhf-ppo", "/zh/learn/rlhf-ppo/", True),
    ("direct-preference", "/zh/learn/direct-preference/", True),
    ("rlvr-grpo", "/zh/learn/rlvr-grpo/", True),
    ("method-selection", "/zh/learn/method-selection/", True),
]

VIEWPORTS = {
    "desktop": {"width": 1440, "height": 1000},
    "mobile": {"width": 390, "height": 844},
}


def inspect_page(page, name: str, route: str, expects_math: bool, viewport_name: str):
    console_messages: list[dict[str, str]] = []
    page_errors: list[str] = []
    failed_requests: list[str] = []

    page.on(
        "console",
        lambda msg: console_messages.append({"type": msg.type, "text": msg.text})
        if msg.type in {"error", "warning"}
        else None,
    )
    page.on("pageerror", lambda exc: page_errors.append(str(exc)))
    page.on("requestfailed", lambda request: failed_requests.append(request.url))

    response = page.goto(f"{BASE}{route}", wait_until="networkidle")
    page.wait_for_selector("h1")

    metrics = page.evaluate(
        """
        () => {
          const root = document.documentElement;
          const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')]
            .map((node) => ({ level: Number(node.tagName.slice(1)), text: node.textContent.trim() }));
          const headingJumps = [];
          for (let i = 1; i < headings.length; i += 1) {
            if (headings[i].level > headings[i - 1].level + 1) {
              headingJumps.push([headings[i - 1], headings[i]]);
            }
          }
          const math = [...document.querySelectorAll('.katex-display')];
          const formulaOverflows = math.map((node) => {
            let ancestor = node.parentElement;
            while (ancestor && ancestor !== document.body) {
              const style = getComputedStyle(ancestor);
              if (['auto', 'scroll'].includes(style.overflowX)) break;
              ancestor = ancestor.parentElement;
            }
            const box = node.getBoundingClientRect();
            return {
              width: Math.round(box.width),
              left: Math.round(box.left),
              right: Math.round(box.right),
              scrollOwner: ancestor ? ancestor.className : null,
            };
          }).filter((item) => item.left < -1 || item.right > innerWidth + 1);
          const bodyText = document.body.innerText;
          return {
            title: document.title,
            h1: document.querySelector('h1')?.textContent?.trim() || '',
            h1Count: document.querySelectorAll('h1').length,
            headingJumps,
            viewportWidth: root.clientWidth,
            documentWidth: root.scrollWidth,
            pageOverflow: root.scrollWidth > root.clientWidth + 1,
            mathCount: math.length,
            katexErrors: document.querySelectorAll('.katex-error').length,
            formulaOverflows,
            rawLatexMarkers: ['\\\\[', '\\\\]', '\\\\begin{', '\\\\frac{']
              .filter((marker) => bodyText.includes(marker)),
          };
        }
        """
    )

    screenshot = OUT / f"{name}-{viewport_name}.png"
    page.screenshot(path=str(screenshot), full_page=True)

    failures = []
    if response is None or not response.ok:
        failures.append(f"HTTP status {None if response is None else response.status}")
    if metrics["h1Count"] != 1 or not metrics["h1"]:
        failures.append("expected exactly one non-empty h1")
    if metrics["pageOverflow"]:
        failures.append(
            f"document overflows horizontally: {metrics['documentWidth']} > {metrics['viewportWidth']}"
        )
    if metrics["katexErrors"]:
        failures.append(f"KaTeX errors: {metrics['katexErrors']}")
    if metrics["rawLatexMarkers"]:
        failures.append(f"raw LaTeX leaked into body: {metrics['rawLatexMarkers']}")
    if expects_math and metrics["mathCount"] < 2:
        failures.append(f"expected formula rendering, found {metrics['mathCount']} displays")
    if metrics["formulaOverflows"]:
        failures.append(f"formula escaped viewport: {metrics['formulaOverflows']}")
    if metrics["headingJumps"]:
        failures.append(f"heading level jumps: {metrics['headingJumps']}")
    if console_messages:
        failures.append(f"console warnings/errors: {console_messages}")
    if page_errors:
        failures.append(f"page errors: {page_errors}")
    if failed_requests:
        failures.append(f"failed requests: {failed_requests}")

    return {
        "name": name,
        "route": route,
        "viewport": viewport_name,
        "metrics": metrics,
        "screenshot": str(screenshot),
        "failures": failures,
    }


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    results = []

    for viewport_name, viewport in VIEWPORTS.items():
        context = browser.new_context(viewport=viewport, device_scale_factor=1)
        for name, route, expects_math in PAGES:
            page = context.new_page()
            results.append(inspect_page(page, name, route, expects_math, viewport_name))
            page.close()
        context.close()

    context = browser.new_context(viewport=VIEWPORTS["desktop"])
    page = context.new_page()
    page.goto(f"{BASE}/zh/learn/rl-panorama/", wait_until="networkidle")
    internal_links = page.locator("main a[href*='/zh/learn/']").evaluate_all(
        "nodes => [...new Set(nodes.map(node => node.href))]"
    )
    link_results = []
    for url in internal_links:
        response = page.request.get(url)
        link_results.append({"url": url, "status": response.status})
    context.close()

    route_audit = []
    for viewport_name, viewport in VIEWPORTS.items():
        context = browser.new_context(viewport=viewport, device_scale_factor=1)
        page = context.new_page()
        console_messages: list[dict[str, str]] = []
        page_errors: list[str] = []
        page.on(
            "console",
            lambda msg: console_messages.append({"type": msg.type, "text": msg.text})
            if msg.type in {"error", "warning"}
            else None,
        )
        page.on("pageerror", lambda exc: page_errors.append(str(exc)))
        for url in internal_links:
            console_messages.clear()
            page_errors.clear()
            response = page.goto(url, wait_until="networkidle")
            metrics = page.evaluate(
                """
                () => ({
                  h1Count: document.querySelectorAll('h1').length,
                  pageOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
                  katexErrors: document.querySelectorAll('.katex-error').length,
                  mathCount: document.querySelectorAll('.katex-display').length,
                })
                """
            )
            failures = []
            if response is None or not response.ok:
                failures.append(f"HTTP {None if response is None else response.status}")
            if metrics["h1Count"] != 1:
                failures.append(f"h1 count {metrics['h1Count']}")
            if metrics["pageOverflow"]:
                failures.append("horizontal page overflow")
            if metrics["katexErrors"]:
                failures.append(f"KaTeX errors {metrics['katexErrors']}")
            expected_math = 0 if url.endswith("/before-rl/") else 1 if url.endswith("/interaction-loop/") else 2
            if metrics["mathCount"] < expected_math:
                failures.append(
                    f"formula displays {metrics['mathCount']} (expected at least {expected_math})"
                )
            if console_messages:
                failures.append(f"console warnings/errors {console_messages}")
            if page_errors:
                failures.append(f"page errors {page_errors}")
            route_audit.append(
                {
                    "url": url,
                    "viewport": viewport_name,
                    "metrics": metrics,
                    "failures": failures,
                }
            )
        context.close()
    browser.close()

report = {
    "pages": results,
    "internalLinks": link_results,
    "routeAudit": route_audit,
    "failures": [
        failure
        for result in results
        for failure in result["failures"]
    ]
    + [
        f"broken internal link {item['status']}: {item['url']}"
        for item in link_results
        if item["status"] >= 400
    ]
    + [
        f"route audit {item['viewport']} {item['url']}: {failure}"
        for item in route_audit
        for failure in item["failures"]
    ],
}

print(json.dumps(report, ensure_ascii=False, indent=2))
raise SystemExit(1 if report["failures"] else 0)
