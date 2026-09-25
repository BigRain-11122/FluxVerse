# GDI+ 烘焙配方族（九代实证回写·带 r 号溯源）

配方面正典：一切「程序化自焙」资产的生产技法。表内尺寸律 = px@PPU → 世界 u（48px@PPU24=2u；16px@PPU16=1u）。

## 谱系表（按家族）

| 家族 | 先例 | 配方要点 |
|---|---|---|
| 接地影子 | r87/r97 | 中心 alpha 96 ≥80 门 + 角透明；48×12@PPU24=2.0×0.5u / 32×8=1.33×0.33u（随主体身高选档·r96「48×12 对 1.33u 身偏大」复核先例） |
| 名牌/文本层 | r24/r40/r97 | 像素字三 pass：glow（逐偏移 DrawString SourceOver 累积软晕）→shadow（同字下移 3/2px 近黑冷下影）→fill；月光调色板（标题金暖晕/注记冷蓝晕）；GenericTypographic 实测名宽（估宽必炸·r108 W-8=160 放门先例）；tofu 门（缺字检测）；CJK 主名形律=全名超画布取前导 CJK 段 |
| 身份卡 | r43/r108 | 168×136 律；footer 标记由数据 layer 字段派生（码位构造）；age<0 sentinel=岁行省略（禁为人类锚点发明年龄）；双跑 SHA+逐卡自检+manifest |
| 气泡 | r42/r109 | 池尺寸派生禁钉死（total 门=非空·sorted/h1 门=unique 恒等 $lineMap.Count）；池 append 生长时旧键全存（零 stale 移除） |
| 发光体 | r97 | being-glow：白 RGB 带 reference alpha 70/150/225/245 + sparks 5px；灰阶带需 alpha 时用不透明灰阶带烘焙+消费端 tint 染色（SpriteRenderer tint 无法灰阶→alpha） |
| 结构针 | r132 | 纯白软边条（mid 4×14/side 2×9）；ppu16 默认档零 PpuFor 行 |
| 玻璃拟态 | r140 | 五原子：半透明渐变 85..150 带 + 发光描边 235 + 外发光晕 70 + 高光斜条 + 暗冷基座；谱锚实值取塔面牌 glow（FLUX 96,160,255 / CPH4 64,196,255）；红灯仅警示语义禁入静态 |
| 裁切自焙 | r149 | 六段管线：行门→核心 run→中行 transitions 80% 密窗→窗内两遍色族采样（单遍吃左缘墙色 mauve legitimize 教训）→列预裁→暗周界描边扩展 ≤2 行；整条边饰 trim + 1px 合成框环（c1 主色 45% 调暗=自含框律） |
| 立面微窗皮 | r151/r152 | 规则微窗格 2×3px + 楼层带 8px + 冠线 accent + 暗基带；窗灯中性面（静态零亮窗=禁装饰律·点亮率归热力线）；未亮窗律门=avg>80 唯 accent |
| 水象 | r154 | 倒影=皮面顶带裁切竖翻×0.4（NearestNeighbor 零重采样）；碎光=24×40 确定性逐列 run+外对选位律；泡沫=1px 帧帒×4 与水帒帧同步 |
| 光效 | r157 | bloom px 律=招世界尺寸 ×1.7/×1.6×16；湿路反光 v3 竖纹 hash 去规律化 (x²·31+x·7) mod 11<2 + 亮度 16..30 + 5px 边缘渐隐；星点 1/16 网格 min pair 门 |
| 镜像 | r93/r113 | raw ARGB 列翻转（负宽 DrawImage 镜像）零重采样；非恒等门（对称件拒收）；localScale 1 律禁运行时翻转 |

## 核心律

- **PPU 分档**（r150⑤）：L0 屏幕密度 27px/u → PPU24=1.125× 上采样最优；PPU48=L1 档（L0 下 0.5625× 微窗 shimmer 险·渲染门沙盒证）；导入器 PpuFor 行=首导入即执法（默认 100 显微陷阱·r34）。
- **色谱锚定**：五色律功能色（QUANT 金/GAME 青/MEDIA 品红/治理超体蓝/CEO 纯白）；dusk 锚定族 bins 40,40,80 / 48,48,88 / 56,56,104（art-target-dusk 未亮楼体采样定色——**dusk tint α0.22 恒加 (56,35,24)=任何底 r≥56 硬底**：近黑底结构性到不了锚紫族·皮面须自带锚族基值·r151 根因律）。
- **确定性构造**：禁 [int] 复合舍入（银行家舍入）——px 律唯一正原语 `[math]::Floor(v+0.5)`；双跑 SHA256 幂等门；互异门（同批件间 SHA 必异·pair-dup 证据族=源表同款两画位留痕非假红）。
- **stale 拒写与源只读**：已提交件 SHA 同=跳写（ALREADY CURRENT）；源资产 size+mtime 双不动自证；外置数据件（canopy-sources.txt/landmark-sheets.txt 模式）承 CJK 路径。
- **in-script 自检门电池**（fail-loud）：尺寸界 w/h bounds → 角透明 ×4 → 带位计数（lit/glass/alpha band 各自阈值）→ 互异 → 双跑；全部 print 进报告件（logs/devloop-r<N>-<name>.txt）。

## 验证门六面（r168 定谳序）

A0 烘焙器 ASCII 审计（字节扫描零非 ASCII）→ A1 盘 census+IHDR 精确（PNG 头直读禁猜）→ A2 存量 SHA 对 r 前提交版逐位同+新件 SHA 钉版 → A3 双跑幂等+件间互异 → A4 角透明盘读 → A5 独立 lit/glass 复算（**非信任烘焙打印**——门面自身 bug 会假绿，独立复算面才逮产物面真错·r154 A6b 先例）。
