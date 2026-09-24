# R-20260924-asset-import — 城市资产导入配置审计与正法 v1.0

> 溯源：CEO 令 2026-09-24 ~11:20「继续寻找资源资产，并调研 unity 如何正确配资产的经验，目配资产我感觉问题很大」——**CEO 直觉已被审计证实：当前配置确有系统性问题**。
> 定位：资产导入配置审计（证据=City 工程 .meta 原文）+ Unity 官方正法（引证=官方文档）+ 修复规格（ready-to-paste·P-36 转办 DevLoop 落地）。姊妹件=R-20260923-audio-assets / R-20260923-city-art-assets。

---

## §一 审计发现（证据=meta 文件原文·2026-09-24 实读）

| # | 问题 | 证据（文件原文字段） | 后果 |
|---|---|---|---|
| A1 | **ArtPacks 零消费件全默认导入**（PPU/过滤/压缩全未设） | `ArtPacks/warped-city/sheet-01-sprites.png.meta`：`filterMode: 1`(Bilinear)+`spritePixelsToUnits: 100`+`textureCompression: 1`(Compressed) | 像素画糊+压缩脏点。注：DevLoop 已对**消费件**逐件手工执法「导入器四律」（r34 PPU100 显微陷阱律+r35 native PPU16+r37 PPU24 分档——证明门在册）；但**未消费散件**与未来批次仍以默认值入库=结构性缺口 A5 |
| A2 | **CleanCity 施工面压缩残留** | `Art/CleanCityv3/.../Flag_blue1.png.meta`：`filterMode:0`(Point ✓)+`spritePixelsToUnits:16`(✓)+**`textureCompression: 1`** | 图块正确设了 Point/PPU16 但压缩没关——16px 像素边缘经 DXT 压缩会脏 |
| A3 | **BGM 8 曲全 Decompress On Load** | `music/*.ogg/.mp3.meta` 逐件：`loadType: 0`（8/8 同值实测） | 官方语义（引证 §二）：解压后**整段 PCM 驻内存**——15MB ogg≈100MB+ RAM×8 曲=**内存炸弹**，长曲正法=Streaming（磁盘流式·近零 RAM） |
| A4 | **SFX preloadAudioData=0** | `signature/ceo_order_pulse.wav.meta`：`preloadAudioData: 0` | SFX 不预载=首播触发即时机读盘（首响卡顿）；短音效正法=preload=1 |
| A5 | **无导入管线自动化** | `Assets/Editor/` 目录实测零 Import/Postprocessor 脚本 | 每批新资产（昨夜 ArtPacks 334 件即实证）都会以默认值入库——**问题结构性复发，人工修不可持续** |

## §二 官方正法（引证）

**音频 Load Type**（Unity 2022.3 Scripting API·AudioClipLoadType 官方原文）：
- `DecompressOnLoad`：「The audio data is decompressed when the audio clip is loaded… kept in memory in decompressed form」——解压后整段 PCM 驻内存（RAM=体积×~10）→ **适合短/小/频繁 SFX**（播放零解压开销）。
- `CompressedInMemory`：「kept in memory in compressed form… takes up the least amount of space」——压缩态驻内存（中长循环的折中）。
- `Streaming`：磁盘流式播放（官方语义=按需从盘读）→ **长 BGM 正法**：RAM 近零，代价=播放期小量 I/O+CPU。
- **Preload Audio Data**：加载时机开关——SFX 应开（首播零延迟），Streaming BGM 可关。

**像素纹理导入正法**（Unity 像素游戏通行配置·与 P-17「正交 PPU16 point filter」相机侧规格互补的资产侧规格）：
- `Filter Mode = Point (no filter)`——像素边缘锐利，Bilinear=糊边元凶（A1 实证）；
- `Compression = None`——16px 级像素经 DXT/BC 压缩必脏（A2 实证）；包体敏感时至少对最终图集再议，散件禁压；
- `Mip Maps = Off`（2D 正交相机用不到，白占 33% 内存）；
- `Pixels Per Unit = 16`——全城统一像素比例基准（P-17 相机档/地标比例律同源）；
- `NPOT Scale = None` + `Alpha Is Transparency = On`。

**自动化正法**（Unity Scripting API·AssetPostprocessor 官方范式原文：「Add this function to a subclass to get a notification just before the texture importer is run. This lets you set up default values for the import settings.」）：
- `OnPreprocessTexture()` / `OnPreprocessAudio()` 子类回调=导入前设默认值的官方通道——一次落码，全批受益（治 A5）。

## §三 修复规格（P-36·ready-to-paste·DevLoop 落地）

### 3.1 导入管线脚本（新建 `Assets/Editor/CityImportPostprocessor.cs`）

**先例吸收**：DevLoop 已在消费面逐件手工执法「导入器四律」（point/PPU/透明底/nemip——r34 PPU100 显微陷阱律+r37 PPU24 分档变体实证），本管线=把已证四律**自动化为工程默认**，治 A5（未消费件与未来批次的裸奔面）；PPU 用**分档表**（世界律不动·除数吸收包像素密度——r37 法的正典化）。

```csharp
// FluxVerse asset import pipeline v1 - P-36 (CEO order 2026-09-24)
// Policy: set defaults ONCE at import; userData marker guards manual overrides.
using UnityEditor;
using UnityEngine;

public class CityImportPostprocessor : AssetPostprocessor
{
    const string MARK = "fvimport:v1";

    // PPU tiers (world-law constant: residents 48px/24ppu=2u per r37; default 16)
    static int PpuFor(string path)
    {
        if (path.StartsWith("Assets/ArtPacks/residents-crowd/")) return 24;
        return 16;
    }

    void OnPreprocessTexture()
    {
        if (!(assetPath.StartsWith("Assets/Art/") || assetPath.StartsWith("Assets/ArtPacks/")))
            return;
        var ti = (TextureImporter)assetImporter;
        if (!string.IsNullOrEmpty(ti.userData)) return;   // already configured - respect manual edits
        ti.textureType = TextureImporterType.Sprite;
        ti.spriteImportMode = SpriteImportMode.Single;    // sheets stay whole until deliberately sliced
        ti.filterMode = FilterMode.Point;
        ti.textureCompression = TextureImporterCompression.None;
        ti.mipmapEnabled = false;
        ti.npotScale = TextureImporterNPOTScale.None;
        ti.alphaIsTransparency = true;
        ti.spritePixelsPerUnit = PpuFor(assetPath);
        ti.maxTextureSize = 4096;
        ti.userData = MARK;
    }

    void OnPreprocessAudio()
    {
        if (!assetPath.StartsWith("Assets/Audio/")) return;
        var ai = (AudioImporter)assetImporter;
        if (assetPath.StartsWith("Assets/Audio/music/"))       // long BGM: stream from disc, near-zero RAM
        {
            ai.defaultLoadType = AudioClipLoadType.Streaming;
            ai.preloadAudioData = false;
            ai.loadInBackground = true;
        }
        else                                                    // short SFX/ambience: decompressed PCM, preloaded
        {
            ai.defaultLoadType = AudioClipLoadType.DecompressOnLoad;
            ai.preloadAudioData = true;
            ai.loadInBackground = false;
        }
    }
}
```

### 3.2 存量迁移（分两步·**顺序敏感**）

1. **零手改面=直接重置**：`ArtPacks/**/*.meta`（全默认生成·无手改）与 `Assets/Audio/**/*.meta`（同）——删 meta→Reimport→管线自动赋正法值→提交。音频在此步根治 A3/A4。
2. **有手改面=谨慎过闸**：`Art/CleanCityv3/**`（DevLoop 手设 Point/PPU16 已在）——补 `textureCompression=None` 一项（编辑器批：遍历 importer 改值+SaveAndReimport），**不动其余已设字段**。
3. **⚠️ PPU 迁移风险（关键）**：PPU 从 100→16 = 世界尺寸缩小 6.25×——**已入场景的消费件**（banners r35/skyline r34/robots r36 等）若原地改 PPU 会位移变形。安全序=①先落管线（新导入即正）→②ArtPacks 原库重置（未消费的散件）→③**已消费件由 DevLoop 在场景侧重锚定**（逐件 localScale 复位到 1 后按新 PPU 重新摆位——r44/r45 消费件清单为准）→④每步渲染截图断言防回退。

### 3.3 验收判据（P-36 DoD）

1. meta 全检：`ArtPacks/**`+新导入件 `filterMode:0`+`textureCompression:0`+`spritePixelsToUnits:16`；`music/*.meta` `loadType:2`；SFX `loadType:0`+`preloadAudioData:1`——脚本 grep 全绿；
2. 新件投石：丢一张新像素 PNG 入 ArtPacks → 不动手即得正法值（管线自动性实证）；
3. 渲染断言：warped 霓虹招牌原生比例渲染截图=边缘锐利（对比 bilinear 时代截图）；
4. 内存面：music 全 Streaming 后 play 模式 RAM 对比（Decompress 基线 vs 迁移后）——数字入 §九；
5. 场景零回退：迁移前后城市截图逐位对比（已摆件位置/尺寸不变）。

## §四 补采三包（本令「继续寻找资源」面·全 CC0·已入库）

| 包 | 源 | 验图 | 用途 |
|---|---|---|---|
| warped-city-2/sheet-environment.png（38.4KB） | OGA /content/warped-city-2 · ansimuz · CC0 | **高适配·零污染**（纯赛博像素·霓虹红粉+青·无水印无 SCREENSHOT 残留——多模态验图） | 赛博街区环境拼合参考+素材 |
| city-pixel-tileset/（city.png+city_bg.png·3.3KB） | OGA /content/city-pixel-tileset · software_atelier · CC0 | 图块面小而全 | 城市图块补充池 |
| city-icons/icons_city.png（6.6KB） | OGA /content/city-icons · thekingphoenix · CC0 | 图标 sheet | L3/L4 UI 城市图标（M3 UI 壳候选） |

否决留痕：construction-site-kit（Silverknot CC0）页内仅截图无本体（下载链站外）——弃，施工面维持 S 库线@Biggame；city-decorations（CC-BY）仅带水印预览——弃；roadcollection 与 CleanCity 道路面重复——弃。

## §五 诚实边界

- 本审计读样=Art 1 件+music 8 件+SFX 6 件+ArtPacks 1 件 meta 原文+Editor 目录清点——面覆盖非全件逐读；全件核验由 P-36 判据 1 的 meta 全检脚本完成。
- 官方引证=Unity 2022.3 文档（AudioClipLoadType 两成员原文+AssetPostprocessor 范式原文）；团结 1.10.3=Unity 2022.3 同源（ProjectVersion 2022.3.62t15 实证），Tuanjie 文档站未及单验——以 Unity 同版文档为准，标注同源推定。
- §三 代码为规格件（未编译验证）——落地时由 DevLoop 在编辑器内编译+3.2 顺序执行+3.3 判据收口；凡与本仓 TECH §九 新法冲突者以实证为准。
