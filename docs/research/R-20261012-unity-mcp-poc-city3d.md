# R-20261012：unity-mcp POC（City3D 实弹）分层回执

> 派单链：10-02 CEO 收获机制立制令（首例工具工单=unity-mcp POC·A 机 City3D 试点·@CPH4 承接）→ 10-11 23:1x 收获机制落地令 ③（烂库最久件再点名）→ **O-20261011-2333-bm-c 定窗派 bm-a（City3D 实弹+回执 ≤10-13·判负也须回执）** → 本件=FluxVerse DevLoop r350 认领回执（2026-10-12 01:2x 交第一卷·死线前 ~46h）。
> 防饿死律执法：派单在 orders.md 活跃区仅存一行（其载体行正随他窗分卷批入档），City3D 属主 bm-a 窗自领——10-02 起烂库 10 天零收口的starvation面就此接单。

## 0 分层判定（先结论）
- **五门评估判定=采用**（消费径修正：平台已内置·司级零另装并行副本——见 §1 反重复门）。
- **实弹腿①（服务器/工具链）=PASS**（10-12 01:0x 本窗探针实锚·见 §2）。
- **实弹腿②（City3D 编辑器附着）=待窗执行腿**（三硬规让路中·触发器在册·见 §3；死线 10-13 两态安全：解锁窗内腿毕补卷 / 窗不至=判负留痕收口——「判负也须回执」条款两态均满足）。

## 1 五门评估（10-02 立制门序）
| 门 | 判 | 证据 |
|---|---|---|
| 契合 | A 级 | City3D 城建线正用例：48 工具/25 只读资源（场景层级/资产检索/控制台/截图取证）＝main#5 R2 判据帧链与取证配套面直配——DevLoop 承接面（板面/调研/门禁/取证）的核心缺口工具 |
| 反重复 | **关键发现** | **Codely CLI 已原生内置 MCPForUnity 工具链**（本会话 manage_* 48 工具即其正身·服务器=PyPI mcpforunityserver）——司级另装并行副本=重复建设判负；**正解消费径=平台内置工具链+工程侧仅装编辑器桥包**；装包正典位 cph4/skills 面零新件（平台自带不重复入册） |
| 许可 | ✓ | MIT（AGPL 禁入门过·09-28 spike 采行在册） |
| 健康 | ✓ | CoplayDev 14,655★ + 平台随版维护（Codely 随版=最强健康面） |
| 成本 | 注记 | 服务端零成本；编辑器会话=VRAM ~1.5-2GB+RAM 数 GB——**与 CEO 在产 GPU 批（专辑 i2v）互斥窗约束**=排程面非否决面 |

## 2 腿①实弹：服务器/工具链（PASS·10-12 01:0x）
- 探针：`manage_scene get_active` → 回包 `success=false, message="No Unity Editor instances found. Please ensure Unity is running with MCP for Unity bridge.", hint` ——JSON-RPC 语义健康+错误路径文明+发现协议正确。
- 零实例归因实况（探针正确性旁证）：本机双 Tuanjie 进程=Hub 启动器（PID 70908）+metis 编辑器（PID 85516·其本地桥=cn.tuanjie.codely.bridge 非 MCPForUnity·不注册本协议）；City3D 编辑器未开（夜间窗）。
- 先行链在册（P-2026-09-28-10·cph4/research/R-20260928-gh-install-mcp.md）：City 工程已验通 ①UPM 包解析 ✓ ②编译 ✓ ③桥自启 ✓（`[InitializeOnLoadMethod]`→`StdioBridgeHost.StartAutoConnect()`·监听口 6400）——Tuanjie 2022.3 分支兼容=平台级已证（City3D=2022.3.62t15/Tuanjie 1.10.3·同 2022.3 分支）。

## 3 腿②（City3D 编辑器附着）＝待窗执行腿
### 3.1 让路实况（10-12 夜窗三硬规）
1. 交互窗 City3D R2 在飞件族 8 件（staging 3+City3D 5）——r236 禁动定谳：桥包装入=manifest+Assets/Editor 双写 City3D。
2. CEO 裁 A 编辑器纪律（agent 干活不开编辑器·弹窗根治链 10-08 终态）。
3. CEO 专辑 i2v GPU 在产（7.3/12.3GB·41%util·KN 29 单在烧）——编辑器 VRAM 挤占 CEO 令在产批。
### 3.2 解锁触发器（每轮机械探测在跑）
- **main#6 判② 收干**（8 件归零/入库=交互窗里程碑落地）**+GPU 批完成窗**（预计晨间）→ 双条件同现即领执行（main 队列 #8 行）。
### 3.3 执行配方（ready-to-run·五步）
1. UPM 装 MCPForUnity 桥包：`https://github.com/CoplayDev/unity-mcp.git?path=/MCPForUnity#v10.0.0`（锁版与服务器侧一致）——**本地工具依赖律**（metis 判例：manifest/packages-lock 改动永不入 commit·pathspec 永久排除）。
2. City3D/Assets/Editor 丢 autoconnect 引导脚本：`[InitializeOnLoadMethod]` 调 `StdioBridgeHost.StartAutoConnect()`（09-28 spike 件法·监听口 6400；丢 .cs 后须 AppActivate 聚焦编辑器触发编译检测）。
3. 编辑器开法=**tuanjie.exe open CLI 路径**（禁 Start-Process 直启：包安装后自重启即死·09-28 坑律①）。
4. 附着验证：instances 发现→set_active_instance→`get_active` 回读 City3D 场景名。
5. 查询电池+收尾：只读三查（hierarchy paged/console read/asset search 各一）全返回+编辑器控制台零错→本件 §5 收口行回填+HQ-FEEDBACK 补腿行。
### 3.4 判据三条（预注册·机械可验）
- ① 开窗后 instances 注册表见 City3D 实例；
- ② `get_active` 返回 City3D 场景名；
- ③ 只读查询电池三查全返回且零编辑器报错。
- 任一不达=腿②判负留痕（判负也须回执条款收口·负向结论也是产出）。

## 4 Token 三问
**L1**（本件=只读探测+文档·零生成触点·零 API·零 GPU——夜窗 CEO 在产批零挤占）。

## 5 收口行（腿②执行后回填）
- [ ] 腿②执行窗=____；判据①=__ ②=__ ③=__；终态=____（腿毕 PASS / 判负留痕）；回执补卷=HQ-FEEDBACK F-20261012-__。
