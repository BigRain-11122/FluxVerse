# UI 自动拼装适配律（双栈）V1.0

> **令源**：CEO 令 2026-09-29「Design/handoff/Unity_UI自动拼装SOP.md 所有涉及2D界面的子公司全部学习这个文档并根据自己的业务迭代改进流程，更加适配自身业务模式和需求。」（orders O-2026-0929-002）。
> **学习对象**：`C:\Users\sjs20\Desktop\FluxGroup\gaming\MiniGame\Design\handoff\Unity_UI自动拼装SOP.md`（集团通用 AI 装配工序基线·Biggame 仓）。
> **定位**：本司双栈（Tuanjie UGUI 引擎面 + HTML 观测窗/看板族面）对集团 SOP 的适配——原则承接+栈映射+既有判例收拢。与 City 3D 世界层不冲突（3D 解禁=P-2026-09-28-12 限世界美术层；操作壳/HUD UI 面=常 2D）。

## 一、总原则（两栈同律·集团 SOP 直承）

1. **禁 free 拖拽/绝对坐标**：布局=锚点+偏移（引擎=RectTransform anchors+anchoredPosition；HTML=固定栏+flex/grid 定位体系）。
2. **禁整图大图当界面**：分层组件化（引擎=Bg/顶带/内容/底带/弹层节点树；HTML=分区 DOM+模板片段复用）。
3. **禁文字烤进图**：一切文字运行时实排（引擎=TextMeshPro/文字实时排；HTML=DOM 文本）。
4. **数字禁写死**：数据外置绑定（引擎=UIManager 字段注入；HTML=data.js+strings.json 策展层——本司既有实践与 SOP Step 5 同构）。
5. **交付前自检截图**：引擎=RT 截图+断言；HTML=无头 Edge 双态截图+多模态核对。

## 二、引擎栈（Tuanjie UGUI·操作壳/HUD）映射

| SOP 条目 | 本栈承接 |
|---|---|
| ScreenRoot 五段模板（Bg/TopBar/Content/BottomBar/Popup） | 操作壳 Canvas 分层照做；多 root 分组参照集团共享正典 MiniGame 17号 §1.2 七组 |
| 预制体五件套（按钮胶囊/卡片/图标钮/进度条/红点） | 先做 prefab 再拼屏，禁逐屏手摆重复结构 |
| 触控热区 88×88 | 承——真工程 88pt（HIG）≈244 ref px 与呈审板级 128 ref px 两制兼容（集团注记） |
| Anchor+Offset 排布+热区与可视分离 | 承——隐形 hitpad 撑 Raycast Target 同律 |
| Step 5 数据绑定禁写死 | 承——世界三流（world-state/world-events/citizen-behavior）只读消费，UI 面数字=运行时注入禁烤死 |

**本司判例收拢（既有·随本律并档）**：UGUI 文字节点禁建同色底（U273·img.enabled=false 或独立无图节点）；WorldSpace 多板渲染板间距 pitch>板含溢出全宽（U274 渗色律）；证据截图 JPEG q88 入仓律。
**施工面**：City3D HUD/驾驶舱操作面板（⬜规划面·design-v4-3d-draft 呈批稿）开工前必读本律+SOP 原文；呈审件过五闸骨架（U288 集团推广位）。

## 三、HTML 栈（观测窗/看板族）映射

- **canonical 正源律不变**：一切展示层改动先改 `gaming/MiniGame/tools/siliconwatch/canonical.html`→sync-template 三拷贝同步+generate 自愈闸（维护面=HQ 观测线·P-59；本律=原则面非改动授权）。
- **排布**：三区制既有定谳（决策与令流区→硅基城区→集团与算力区）；分区模板片段=HTML 侧「预制体」律，禁整页复制改造。
- **数据面**：`硅基生命元宇宙-data.js`+`strings.json`（中文全外置 UTF-8）=SOP Step 5 的 web 同构（既有实践·维持与深化）。
- **自检**：无头 Edge 截图三律（高度钳制 1080/独立 user-data-dir/路径 GBK 外置）+多模态核对=看板族呈审执法面。
- **本司红线叠加**：金融视觉面（K 线/涨跌/汇率/交易日）永不出任何界面（CEO 敏感面律 2026-09-24）——学习件承接时同律执法。

## 四、执法接线

- City3D UI 施工批开工前置读=本律+集团 SOP 原文；观测窗改动=canonical 正源律（既有）。
- 回执面=orders O-2026-0929-002 行；本件随批入 git 分发机队。
