# 玩家系统技术选型卡（双调研融合 2026-11-26）

> 委托：CEO 令「好好调研 GitHub，不要闭门造车，准备充分再做」。
> 来源：化身技术调研 + 玩法框架调研两代理实测（星数=当轮抓取或双源核验）。

## 一、化身技术（第一性解=程序化生成赛道）

**主推组合（3-5 天）**：
1. **procedural-animals**（71★ MIT）——24 物种全代码生成（猫/狗/鸟直接命中异化形态！）+ IK 步态无骨骼无动画文件+**seed 捏参**（体型/毛色可复现=源质底稿的现成实现）+AUTHORING.md 可自加「硅基人形」body plan。坑：npm 未发布须 vendor；file:// 传 worker:false 主线程构建；bake 文件路径用 fetch 禁用。
2. **three-player-controller**（322★ MIT）——第一/第三人称切换+FootIK+three-mesh-bvh 碰撞+移动端摇杆；clip 可程序化构造不走 GLB。中文 README。
3. 备选：camera-controls（2.5k★）轻量路线；@drawcall/animate（0★ 新库·peer 恰=three 0.187·目标驱动姿态）观察名单。

**出局**：ReadyPlayerMe（DNS+服务+生物皮三重冲突）/ecctrl（React）/three-vrm（外部资产）/Mixamo GLB（资产红线）。

## 二、玩法框架（设计全可抄，代码大半不搬）

| 层 | 抄谁 | 抄什么 |
|---|---|---|
| 事件总线 | **Space Station 14**（3.9k★ MIT） | RaiseLocalEvent 类型化事件+JobPrototype YAML 职业定义→TS 配置对象 |
| 交互注册 | **A-Frame**（17.7k★ MIT） | raycaster 交互组件+init/tick 生命周期→E 键 Interactable 注册表 |
| 数值三角 | **Bitburner**（≈4.5k★ MIT） | 犯罪概率结算/karma 恶名/帮派 wanted↔respect 数学/离线时间戳补算/prestige=年轮范式 |
| 通缉前科 | **SS14 security records**（MIT） | 记录状态机：无-通缉-收押-释放全程事件化 |
| 对话 | **inkjs**（MIT） | file:// 成熟（Inky 导出自带）；次选自研 JSON 树 |
| 存档 | Bitburner 范式 | localStorage+schema 版本迁移+导出字符串 |

**红线**：tgstation/Elona=AGPL **只抄设计禁抄码**；Decentraland 零代码（禁令）；SS14 C#→TS 只译设计。

## 三、对齐我们的玩法正典（vocation.md 六泳道）

| 泳道 | 用什么轮子 |
|---|---|
| P1 化身 | procedural-animals 人形 body plan（硅基外壳材质替换毛皮）+player-controller |
| P4 形态（猫/狗/鸟） | procedural-animals 直接命中——seed 即源质 |
| P3 职业 | SS14 JobPrototype 式 TS 配置+Bitburner 概率结算 |
| P6 事件 | 自研 50 行 typed EventBus（仿 RaiseLocalEvent） |
| P2 生存 | Bitburner 数值范式（离线补算/prestige 年轮/双轴名声） |
| P5 对话 | inkjs 或自研 JSON 树 |

**总判**：三条硬约束（纯 three/非 React、file:// 禁 fetch、零外部资产）筛完后，A 级轮子恰好集中在「程序化生成+目标驱动姿态」赛道——与我们零资产路线天然同构，无需妥协。异化形态（猫狗鸟）有现成 71★ 轮子直接命中，是最大意外之喜。

## 四、开工顺序（准备充分版）

1. vendor procedural-animals 进仓（worker:false 试点猫形态）
2. three-player-controller 接 walkController 对照（或轻量自研+camera-controls）
3. typed EventBus+PLAYER_ACTION 族上流
4. inkjs 试点 32 席居民对话
5. Bitburner 数值三角移植 lifeState
