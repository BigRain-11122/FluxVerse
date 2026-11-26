# CityWeb 全上海扩容路线卡（云端调研代理产出 2026-11-26）

> 委托：CEO 令「本地+云端全面加速建设」。全部数字=Overpass/Geofabrik 实测（2026-11-26 10:04 UTC）。

## 核心结论（推翻担忧）

- 中心城区 OSM 建筑实测 **45,611 栋**（bbox 233.7km²）——不是 10 万级。
- 紧凑格式全量 **2.7–3.4MB**（5MB 红线内，单件可整嵌）。
- 三角形 75.3 万=预算 150 万的一半。
- **真问题反着**：OSM 中国覆盖率仅 ~10%（视觉偏空），密度要用 Overture ML 线补（阶段 3c 才触发）。

## 三阶段路线（总 6–8 人日到 3a）

| 阶段 | 范围 | 楼量 | 体积 | 工作量 |
|---|---|---|---|---|
| 1 | 陆家嘴+北外滩全量 17.5km² | 3,808（现 504=13%） | 0.27MB | 2.5–3.5 人日 |
| 2 | 内环 120km² | 2.5–3.2 万 | 1.8–2.4MB | +2.5–3 |
| 3a | 中心城区 233.7km² | 45,611 | 2.7–3.4MB | +1–1.5 |
| 3b（可选） | 外环 820km² | 82,721 | 5–6MB 切片 | +3–4 |
| 3c（可选） | Overture 密度增强 | +20–35 万 ML 足迹 | 20–30MB | +5–8 |

## 硬判例

1. **数据通道（file:// 唯一可用）**：动态 `<script>` 自注册切片（JSONP 式 `window.__citySlice(17,{…})`）——classic script 在 file:// 全浏览器无 CORS 限制。fetch/Worker/importScripts/module/GLTFLoader 全被 opaque-origin 拦（实测）。
2. **主数据源=Geofabrik shanghai-latest.osm.pbf 25MB**（日更）本地 osmium 切；Overpass 只做增量（本机实测：官方/日本镜像 406、kumi 429、**maps.mail.ru 全程可用**——中国网络首选，管线带镜像轮询）。
3. **渲染混合律**：楼=merge 切片 BufferGeometry；重复件（树/灯/车）=InstancedMesh 分区；外环 136.8 万 tri 贴线→**视口半径 8km 裁剪必做**。
4. 高度缺失 90.7%→分档推断（CBD/老城厢/新村）+陆家嘴 645 真值锚。
5. streets.gl 判「参考不引入」（38.9k 行自研 WebGL2+在线瓦片+React，三重 file:// 死结）；抄其 schema 解析/屋顶 straight-skeleton/rbush 索引思想。
6. 交付=「脚印数据+运行时拉伸」禁烘焙几何（体积 4 倍+丢 LOD）；运行时 meshing 全量 1–3s。

## 阶段 1 立即可执行清单

Overpass 拉全量 3,808 栋（maps.mail.ru）→ 差分 int16 量化 emit 自注册切片 JS → realCity 数据源从手拉数组切到 `window.__citySlice` → 地标 30–50 栋校高。
