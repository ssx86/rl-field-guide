# rl-guide/ 线上站点层（layouts 1 + pages 3 + styles 2）——Astro 静态阅读站

### src/layouts/GuideLayout.astro
- 职责: 基础 Astro HTML 布局——SEO（canonical/hreflang）、theme-color、KaTeX CSS、跳链、无闪主题恢复与主题切换按钮接线的内联脚本。
- 关键: Props（title/description/language/canonicalPath/alternatePath）；import guide-base.css/guide.css/katex；~69 行。
- 坑/价值: 主题持久键 "rl-field-guide-theme"；两个 is:inline 脚本只绑加载时存在的 [data-theme-toggle] 按钮；canonical/alternate 依赖 Astro.site 已设；硬编码主题色须与 CSS 变量同步。
- lastRead: d6f85b0 (2026-10-13)

### src/pages/index.astro
- 职责: 站点根——语言门卡片把访客导入英文课程（单一"Open the complete English course"链到 /en/）；~18 行。
- 坑/价值: 布局 Language 类型里的 zh 路由在此不提供。
- lastRead: d6f85b0 (2026-10-13)

### src/pages/[lang]/index.astro
- 职责: 课程主页——hero、五步阅读法、九部完整路线图章节卡。
- 关键: getStaticPaths 只出 [{lang:"en"}]；CURRICULUM/PARTS；~89 行。
- 坑/价值: partRows 按 part id 过滤派生；章节链硬编 "en" 段——加语言要动 getStaticPaths 与所有硬编码。
- lastRead: d6f85b0 (2026-10-13)

### src/pages/[lang]/learn/[lesson].astro
- 职责: 静态章节阅读页——分部导航轨、导语契约、情境散文、图、算例步进、机制节、KaTeX 方程、边界、来源、前后翻页。
- 关键: getStaticPaths 映射 CURRICULUM；katex.renderToString 服务端渲染（set:html、throwOnError false）；~154 行。
- 坑/价值: 路由查找对 CURRICULUM.find 非空断言——slug 必须与 getChapterArticle 双向同步；前置过滤 .filter(Boolean) 后仍 item! 解引用；内联脚本滚动导航轨当前链入视。
- lastRead: d6f85b0 (2026-10-13)

### src/styles/guide-base.css
- 职责: Astro 页极简 reset + 设计令牌——Tailwind import、明暗变量、@theme 映射、基础元素样式；~68 行。
- 坑/价值: 与 styles.css 令牌段近似重复（多了 Noto Sans SC 字体栈）——调色板须两文件同步；暗色依赖布局内联脚本先设 data-theme。
- lastRead: d6f85b0 (2026-10-13)

### src/styles/guide.css
- 职责: Astro 阅读页全量样式——头、语言门、hero/路线图、课程壳/轨/文章排版、证据步进、公式卡、边界卡、实验测验、知识图变体、响应式与减动效；~519 行。
- 坑/价值: 分层历史——后段"审计后课程行为"与"阅读优先知识图"节有意覆盖早段规则（.roadmap-card 361 行重声明、!important）；粘性偏移（64px 头/124px scroll-margin）与头高耦合。
- lastRead: d6f85b0 (2026-10-13)
