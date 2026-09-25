# 门族常量与实体几何推导（Phase 2）

来源 = TECH §九 r99/r103/r110/r123/r137/r141/r169 十代定谳。**改值必随代勘正**：先复跑邻接证明面（r51 证明基线漂移律），零静默改值。

## 实体世界矩形推导（r169 SeatR 族·正典实现见 scripts/sandbox-harness-template.ps1）

| 类 | 参数 | 式（world u） |
|---|---|---|
| 席位体 | 32×32 @PPU24 | half=32/48=1.333u；b=[x±half, y±half] |
| 席影 | 32×8 @PPU24 | scy = y − half − 0.06（drop）；s=[x±32/48, scy±8/48] |
| 名牌 | 66×20 @PPU24 | pHW=66/48, pHH=20/48；pOff = half + 8/24 + pHH；pcy = y + pOff（头顶上方） |
| 机器人 | 16×16 @PPU32 | robH=16/32=0.5；影 16×6/32·drop 0.06 |
| 车辆 | pxW×pxH @PPU24 | 脚锚：[x−w/2, groundY, x+w/2, groundY+h] |
| 招牌 | pxW×pxH @ppu | 中心锚：[x±w/2, y±h/2] |
| 檐位槽 | 同席位 SeatR | eaveslots-manifest slots[].{id,x,y} |
| 楼/舱/台/管道 | manifest world rect | 直用 [x0,y0,x1,y1] |

**主障碍集 = r169 集合式**：8 楼 + 6 办公 + T1 + 2 大道带（rows 3..14 → world y 3..15）+ 在册 manifest 全件 + 席位×3（体/影/牌）+ 檐位×3 + 机×2（体/影）+ 车 + 招牌 + 锚点（候选禁吞锚）+ props 自由铺装面清点（零假设断言）。**禁漏类**——漏类 = 假净位。

## 物理门（Gate 全套）

- **L0 框**：|x0|,|x1| ≤ 35.256；带界（AmbientTint）y ∈ [−16, +15]；气泡顶 ≤ +15。
- **立足律（sec8）**：足印每胞 = 铺装带（Ground 层非空；Roads/Water 空泡禁立足）+ 非大道列（vcols）+ 出 8 楼足印；feet 胞 x = floor(中心列)、y = RowLo。
- **整数 y**：席位 y 整数行对齐。
- **高度帽**：北岸低伏 top ≤ 13（脑塔 19 唯一豁免·r132）；labs 低伏 top ≤ 12；南岸楼顶行 ≤ −9（零压路零泡江）；南岸天际线序：脑塔 160px > QUANT 128 > MEDIA 96（r131/r147）。
- **净距**：席位↔席位 ≥ 2.2；机 ≥ 2.0；车 ≥ 2.8；招牌挂载包络 1.065 扩展；牌↔牌 2.75；牌↔机（TagProof A2 三面）。
- **招牌挂载语义**（r89/r90 律）：facade 牌 y 域 ⊆ 楼体 + h ≤ 半楼；roof 牌坐檐 + 升幅 ≤ 半；横向 ±0.05 容差全含本楼宽。
- **檐下邻接律**：≥1 立足胞与目标楼体足印全边共边（r123）。
- **MountX 夹持律**（r110）：出 L0 静态窗的席位牌 x 向内滑至窗内（|牌缘| ≤ 28.15 线），y 永不动；窗内席恒不动恒等门 + InView 留任分类器。
- **水带保护**：水 rows −3..2 唯大道可跨（avenue 路胞 under crossing）；vcols 剖窗 = 净跨断源。
- **相异律**：COMMIT 江域 Y±4.6 / TRANSFER 街带 −7.5 / 檐上管道带 y13..13.667 几何域永禁重叠（r114/r141 预埋断言）。
- **排序律**：order 档 = pods 3 / rim 5 / signs 6 / street 7 / tint 8 / band 9 / pulses 10 / drops 12；**同 sortingOrder 内 z 越小越近相机越上层**（CityCamera z −10 朝 +z·r158 勘正）。
- **光效非物理门**：bloom 晕/rim/wet 与候选重叠 = 光层报告面（晕溢被邻楼遮 = 自然物理；如实报、禁静默、禁当门执法——r169 A4b）。

## 判负窗工序（r111/r123 先例）

判负位置三段呈报：①判负位置坐标带 ②具名 blocker（探针起火实证=非空转证）③扩容候选（席位迁移轮/资产线/CEO 选项 F- 件）。缺一段 = 未定谳。
