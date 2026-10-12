# R-20261012-wowa-godview-camera-feasibility.md — WoW 式上帝俯视角（godview）相机可行性预研

> explore#6 领走件（explore#12 P3 48h 节律·r405 交卷·下次死线 10-14 12:2x）；令源=O-20260930-024 主视角定谳令（CEO 原话锚：「主视角就类似《魔兽世界》那种上帝式俯视角…视角，可以乱自由乱动的视角不用。然后可以推进一点，但是拉到极限也要有一个比较好的观感」）。
> 消费面：city-pc-productization-roadmap §三（O-024 执行面·「俯视角三档参数族合流定稿」输入）+City3D R2+ 运行时相机 rig 实现窗（**现状盘点=City3D/Assets 全域 .cs 零运行时相机脚本**——pitch 命中全在 Editor 构建件〔CityRebuildR2.cs 摆位+ShowcaseShots 实拍/CityAssembler 等〕·Phase 0 三档=b6b0a17 编辑器实拍基线→**godview rig=净新增件**）+zoom 两端观感判据帧五闸预注册（O-023 §二.4）。
> 判据（自设 ≤3 问）=①正主 WoW 相机参数族（zoom/pitch/平滑）有可引源数值②城市观察端（城建相机家族）可迁移机制 ≥2 条③实现路径可判（手写 rig vs Cinemachine）+zoom 两端判据帧可预注册——三条全落才算成件。

## §1 正主参照：WoW 相机机制拆解（数值全引源）

### §1.1 zoom 族
- `cameraDistanceMax`=15yd（默认）·`cameraDistanceMaxZoomFactor`=1.9（默认）·可调 1~2.6 → 乘积 15×2.6=39yd 硬顶（Wowpedia+Warcraft Wiki 双源一致：verbatim「If the product of this value exceeds 39, the max distance will be 39」）。
- Classic 线：factor 可至 4.0 但 50yd 硬顶（Warcraft Wiki 实测注 1.14.4/3.4.3）。
- 近端 0yd=第一人称过渡（WoW 特性·O-024 明令禁第一人称→**近端 0 不取**）。
- **语义判读=「基础距离×用户系数」双变量乘积封顶制**——两端皆有硬门，永不无限外拉。

### §1.2 pitch 族
- `pitchLimit`：俯仰上限以「degrees above your toon」计·verbatim「Setting it higher than about 88 can create very strange camera behavior when you go past vertical」（Wowpedia CVar pitchLimit）——**近垂直可到但永不真 90°**（顶带留余量防顶部穿帮）。
- 下限≈水平（角色背后平视带）→ WoW 俯仰带=水平↔88° 近垂直。
- **语义判读=pitch 锁定区间**——永不解锁全自由旋转=O-024「可以乱自由乱动的视角不用」的同源机制。

### §1.3 平滑/跟随族
- `cameraSmoothStyle` 四态（Wowpedia+Warcraft Wiki 双源）：0=永不自动调整·1=移动中只调水平·2=始终调·4=移动中调。
- 平滑速度族 CVar 群（yaw/pitch/distance 三向 smooth）见 Wowpedia Console variables/Complete list（2023-08 PTR 10.1.7 版注记）。
- **语义判读=「自动回正」可分级**——WoW 的跟随回正语义（面向角色）不可迁移（城市观察无角色跟随轴），**平滑手感可迁移**：城市观察端应取 0 态（用户摆哪停哪）+全链阻尼。

### §1.4 「WoW 手感」本质三律（rig 设计输入）
1. **乘积封顶双变量 zoom**：两端硬门封顶·系数可调=设置面「相机距离」档的现成结构。
2. **pitch 带锁+顶带留余量**：88° 而非 90°=顶部 UI/天空面永不穿帮。
3. **阻尼全链**：zoom/yaw/pitch 全走 smooth·「一步一停」廉价感全靠阻尼消除（非线性几何步进+~0.5s 追随到位）。

## §2 城市观察端参照：城建相机家族（genre-native 补充）

「街机观察端」体裁原生参照=城建/管理游戏观察相机（我方产品动线=逛+看+点·非战斗跟随）：

- **Cities: Skylines II CameraController**（CS2 modding 文档）：职责面=相机位姿/zoom/边缘滚动输入/碰撞调整/地形水面高度采样/音频监听位——城建相机四大件实证=边缘平移+碰撞+地形贴地+zoom（源=ps1ke.github.io CS2 Modding Guide CameraController）。
- **pitch-on-zoom 联动**（C:S 家族标志行为）：拉远=俯角自动加深趋正俯·推近=俯角放平趋街平视——城建/RTS 教程通行做法（佐证=UE4 城建相机教程「Change Camera Pitch On Zoom」范式）。
- **zoom-to-cursor**：滚轮缩放锚=鼠标点而非屏心（城建类标配——看哪推哪）。
- **合成律判读**：CEO 锚=WoW「手感」（阻尼/封顶/pitch 带）·体裁面=城建观察（边缘滚动/zoom-to-cursor/pitch-on-zoom）——**两者不冲突·合成=WoW 手感内核+城建观察输入面**。

## §3 City3D godview 映射草案（纯预研零实现）

### §3.1 参数族候选表（预注册候选·与 Phase 0 三档基线合流定稿）
| 参数 | 候选值 | 依据 |
|---|---|---|
| pitch 带 | 40°~85°（斜俯带·顶带留 5° 余量） | WoW 88° 顶律+O-023「高机位斜俯」+顶部 UI 不穿帮 |
| zoom 带 | 近端 12m ↔ 远端 320m | O-023 zoom 两端判据：近端=细节构图/远端=全景成立（512m 白盒对角 ≈720m·85° 俯+60° FOV 视径 ≈370m 覆全景带） |
| zoom 步进 | 每滚轮档 ×1.25 几何步进+阻尼追随 ~0.5s | §1.4 阻尼全链条 |
| pitch-on-zoom | 远端档位自动趋 80°~85°·近端趋 40°~45°（带内联动·手调覆盖） | §2 C:S 联动律 |
| 输入面 | 滚轮=zoom-to-cursor·MMB 拖=yaw+带内 pitch·边缘滚动=平移（可关） | §2 城建观察四大件 |
| 碰撞 | 近端街谷射线贴地·远端禁碰撞（全景不穿帮） | CS2 collision adjustments 职责面 |
| 边界 | 城界 clamp+远端禁平移出界 | 城建标配 |

### §3.2 实现路径判读
- **手写 rig（推荐）**：单 CameraDriver 组件（焦点 Transform+距离/pitch/yaw 三标量+LateUpdate 阻尼追随）≈150 行·零包依赖·参数族全 Inspector 化——**结构上造不出自由飞行**（无 orbit 全自由态）=契合 O-024「禁自由 3D 相机」硬约束。
- Cinemachine 虚拟相机=可用但过度（Framing/Noise/Blend 全闲置）·FreeLook 类预设自带自由 orbit 气质=红线风险位。
- 判读=手写 rig·Tuanjie/URP 零额外依赖——Token 三问门 **L1 直过**（确定性可解·本地够用·零生成触点零云调用）。

## §4 可行性判读（预注册 ≤3 问收口）
① WoW 参数可引源？——**是**（§1 双源交叉四 CVar 正身）。② 城建观察机制可迁移 ≥2？——**是**（§2 四件：边缘滚动/zoom-to-cursor/pitch-on-zoom/近端碰撞）。③ 实现路径可判+判据帧可预注册？——**是**（§3 手写 rig+参数候选表=五闸预注册素材·O-023 §二.4 两端判据帧对接：近端帧=40°~45° 街景构图成立·远端帧=80°~85° 全景轮廓可读）。
→ **可行性判读=可行**：净新增件·零依赖·本件参数族=R2+ 相机实现窗的直接输入。

## §5 回填行（消费跟踪·被动·explore#61 同式）
- R2+ 相机 rig 实现窗开工首跑：消费 §3.1 参数候选表→与 Phase 0 三档实拍基线（b6b0a17）合流定稿→定稿值回填于此行+zoom 两端判据帧注册引用 §4（五闸预注册面）——判据=实现窗 commit/消息或 TECH 行引用本件。
