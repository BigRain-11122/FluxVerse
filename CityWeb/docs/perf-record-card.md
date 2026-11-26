# CityWeb 性能与录屏双调研落地卡（云端调研代理产出 2026-11-26）

> 委托：CEO 令「本地+云端全面加速建设」。原文全文在会话记录；本卡=可执行摘要。
> 证据缓存：C:\Users\sjs20\.codely-cli\tmp\threejs-research\（r187 源码+manual 章节可复核）。

## 立即执行序

1. **审计闸先行（当天可上）**：renderer.info + rAF 帧时间探针 + CI 预算断言。✅ 已上（c498a051·真值 2944dc/614k tri）。
2. **BatchedMesh 静态合批第一波**：异形静态件（bundRow/blockDetails/metroLine）按「材质×城区」分桶；同款重复件（灯/树/栏杆）留 InstancedMesh 但**分区**。（泳道在飞）
3. **bloom A-B 量化第二波**：threshold 只放黄昏辉光/窗灯/脉冲。
4. **录屏流水线**：Tools/cityweb_cruise_record.py ✅ 管线全通（MP4 产出 1600×900 h264 30fps）——但 **headless SwiftShader 下 captureStream 不产有效帧（实锚：分片空/帧黑）**，CEO 交付必须 `--headed` 系统 Chrome 真机 GPU；QA 取证用 Playwright screenshot 逐帧。

## 关键陷阱判例（必须记住）

- **EffectComposer 陷阱**：`renderer.info.autoReset=true`（默认）时 UnrealBloom 多 pass 每次内部 render 都 reset——HUD 只看到最后 bloom pass 的 4-5 dc，主场景 100+ dc 全清零。正解=帧首手动 `info.reset()` 后再 composer.render()。
- **InstancedMesh 包围球**：r187 引擎不自动重算，setMatrixAt 变换后须手动 computeBoundingSphere，否则整批误剔除。
- **Playwright video 默认缩水**：1600×900 不设 record_video_size 会变 800×450；文件在 context.close() 才落盘。
- **CEO 交付片用路线②**（页内 MediaRecorder+captureStream 只录 canvas 纯净画面 16Mbps VP9）+ ffmpeg 转码收口（libx264 crf18 slow yuv420p faststart）；QA 取证用路线①。
- **巡航必须先 rig.enabled=false**（orbit 覆写判例）+ CatmullRomCurve3 getPointAt 弧长参数化。
- headless SwiftShader 帧时间≠真机；CEO 交付用 --headed 系统 Chrome。

## r187 renderer.info 字段（源码实锚）

calls/triangles/points/lines/frame（render 域）+ geometries/textures（memory 域·reset 不清=泄漏审计用）+ programs 数组（材质差异度指标）。

## 性能预算初值（待基线回填后收紧）

dc ≤60 · tri ≤8M · p95 ≤33.4ms · jank ≤20/300。
