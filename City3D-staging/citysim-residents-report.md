# CitySim 库内居民启用批 R1 自检（闸3 机检·2026-10-02 23:04）
> 溯源=CEO 令 10-02「居民先自己用资产库的·动作也是能用资产库的就配好」·seed=20261002·census 名册 32 席→AD-042 19 形体确定性映射·Hunyuan walk/idle Human 重定向（团结 t15 改名）
> 库内事实=R-20260929-animation-gap（AD-042 空 Animator 零动画）→ 人形动画走既判解B=generate_motion（Mixamo 系 FBX）
> 职权注记：六 hex 材质映射/换装契约=BigLife 总责（O-2026-0929-020）——本批只做工程装配与动画接线·映射消费位已留（RSlot 六 hex 字段）
| R1 名册可达 | slots=32/32·唯一 id=32·有名=32·有职=32（Assets/CitySim/residents-street.json） | PASS |
| R2 库内形体 | AD-042 实锚 19/19 | PASS |
| R3 动画导入 | walk=SMPLH_Animation@4.97s·idle=SMPLH_Animation@4.97s | PASS |
| R0 形体 Avatar | AD-042 Character.fbx Humanoid 化后 Avatar 未取得 | FAIL |
| R5 生成装配 | 生成=32/32·Animator 全绑（ctrl+avatar）=32/32·ResidentMode=32/32·walkers=16 | PASS |
| R4 重定向实证 | walk 半程姿势差=3.535m（>0.02）·idle 姿势差=0.177m（参照值） | PASS |
| R6 行走位移 | 编辑态推进 5.0s 位移=6.00m（>4） | PASS |
| R7 映射确定性 | 32 席双算对账不一致=0（hash(id) mod 19·确定性 seed） | PASS |

## 名册→形体映射（32 席）
| slot | census id | 名 | 职业 | 种 | 形体 | 态 |
|---|---|---|---|---|---|---|
| 0 | C-02503 | 盛星野 | 防火墙巡林员 | carbon | FireFighter | 行走 |
| 1 | C-02815 | 白嘀嗒 | 巡信使 | sprite | Jock | 待机 |
| 2 | C-03439 | 香侬·丙 | 时空校准师 | silicon | PunkGirl | 行走 |
| 3 | C-03751 | 奚浩宇 | 量化策略研究员 | carbon | Grandma | 待机 |
| 4 | C-04375 | 唐卡佳 | 回测农 | carbon | HipsterGirl | 行走 |
| 5 | C-05311 | 孟根福 | 尾盘茶室老板 | carbon | Grandpa | 待机 |
| 6 | C-05623 | 石诗涵 | 防火墙巡林员 | carbon | Roadworker | 行走 |
| 7 | C-08431 | 席丽 | 大编译调律师 | carbon | Biker | 待机 |
| 8 | C-08743 | 吞吐-8 | 穿城信使 | silicon | Hobo | 行走 |
| 9 | C-01255 | 严志明 | 数据粥铺摊主 | carbon | PunkGirl | 待机 |
| 10 | C-01567 | 邵清晚 | 缓存管理员 | carbon | GamerGirl | 行走 |
| 11 | C-01879 | 北风 | 声景师 | sprite | Paramedic | 待机 |
| 12 | C-03127 | 阿时序-7 | 大编译调律师 | silicon | Gangster | 行走 |
| 13 | C-04999 | 尹梓涵 | 算法调参师 | carbon | Grandpa | 待机 |
| 14 | C-07495 | 田锡金 | 攻略誊写员 | carbon | FastFoodGuy | 行走 |
| 15 | C-09367 | 董雨欣 | 游戏策划 | carbon | Jock | 待机 |
| 16 | C-00943 | 高福生 | 粉丝回信人 | carbon | FastFoodGuy | 行走 |
| 17 | C-02191 | 朱文倩 | 数据清洗工 | carbon | HipsterGirl | 待机 |
| 18 | C-04063 | 阿贪心·新 | 平台对接员 | silicon | SummerGirl | 行走 |
| 19 | C-04687 | 高秀英 | 声优棚掌柜 | carbon | ShopKeeper | 待机 |
| 20 | C-06247 | 严之恒 | 新市民安居顾问 | carbon | SummerGirl | 行走 |
| 21 | C-07807 | 华红 | 视频修复师 | carbon | Roadworker | 待机 |
| 22 | C-08119 | 快照·甲 | 七段街区导游 | silicon | HipsterGuy | 行走 |
| 23 | C-09055 | 袁团团 | 像素小学学生 | carbon | FireFighter | 待机 |
| 24 | C-05935 | 邱涛 | 数据搬运工 | carbon | Grandma | 行走 |
| 25 | C-09679 | 阿哈希-3 | 脑环广场管理员 | silicon | FastFoodGuy | 待机 |
| 26 | C-00001 | 大圣 Dasheng | 城主 | carbon | Gangster | 行走 |
| 27 | C-00319 | 钱子轩 | 防火墙巡林员 | carbon | Biker | 待机 |
| 28 | C-00631 | 快照 | 新市民安居顾问 | silicon | Jock | 行走 |
| 29 | C-06559 | 盛春梅 | 机器站宿舍管理员 | carbon | HipsterGirl | 待机 |
| 30 | C-06871 | 黎承宗 | 旧件修复师 | carbon | Tourist | 行走 |
| 31 | C-07183 | 郁清晚 | 穿城信使 | carbon | Jock | 待机 |
> 非碳基种（sprite/灵族系）暂借人形体——真 3D 形体=48 包零覆盖已知缺口（animation-gap ③·CC0 填库呈报在册）。
| R8 判据帧 | 4/4 帧 → C:\Users\sjs20\Desktop\FluxGroup\gaming\FluxVerse\City3D-staging\shots8 | PASS |

结论：**1 项 FAIL**·residents=32·walkers=16·clips=SMPLH_Animation/SMPLH_Animation
