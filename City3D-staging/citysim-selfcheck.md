# CitySim 自检报告 v0.1（闸3 机检·2026-09-30 15:58）
> 溯源=CEO 令 2026-09-30（T1 代决·A 档物理投影层）·seed=20260930·R0 数据源=td-organic-r0.json
| A1 路网单连通 | reach=575/575 | PASS |
| A2 地块门位全通 | 无门位块=0/16 | PASS |
| A3 基线全量通勤 | agents=504 arrived=504 stuck=0 @T=720 | PASS |
| A4 seed 确定性 | arrived=504/504 topCongNode=0/0 | PASS |
| A5 封桥重路由 | busyBridge=cell(16,21) 基线穿行=136 封后穿行=0 stuck=0 | PASS |

结论：**五断言全绿**·供需连锁可验=是
覆盖统计：RES 地块公共服务覆盖 3/3（半径 120m）
通勤规模：就业人口 504·agent 全量可见（无统计聚合·白盒演示级）
