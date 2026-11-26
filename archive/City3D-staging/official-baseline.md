# 官方基准档（Top1 施工案 P1·本地 demo 提取·R-city-top1-01 参数权威通道）

## AD-022 CityPack 现代城市
- ambientMode=Skybox ambientLight=#363A42(0.212,0.227,0.259) ambientSky=#363A42(0.212,0.227,0.259) ambientEquator=#1D2022(0.114,0.125,0.133) ambientGround=#0C0B09(0.047,0.043,0.035) ambientInt=1
- fog=False mode=ExponentialSquared color=#808080(0.5,0.5,0.5) density=0.01 linStart=0 linEnd=300
- skybox=Resources/tuanjie_builtin_extra
- sun=Directional Light rot=(50.00, 212.23, 0.00) intensity=1.2 color=#FFF4D6(1,0.957,0.839) shadows=Soft shadowStrength=0.8 bounceIntensity=1
- light[1] name=Directional Light type=Directional rot=(50.00, 212.23, 0.00) intensity=1.2 color=#FFF4D6(1,0.957,0.839) range=10 spot=30 shadows=Soft strength=0.8 layer=0 renderMode=Auto
- volumes: NONE
- cam[1] name=Main Camera fov=53.1 clear=Skybox bg=#314D79(0.192,0.302,0.475) depth=-1 postProcessing=n/a
    pos=(48.05, 17.12, 43.71) rot=(23.76, 209.43, 0.00)
- root_objects=4329

## AD-018 SciFiCity 赛博城
- ambientMode=Skybox ambientLight=#0C1C40(0.046,0.111,0.25) ambientSky=#0C1C40(0.046,0.111,0.25) ambientEquator=#1D2022(0.114,0.125,0.133) ambientGround=#0C0B09(0.047,0.043,0.035) ambientInt=1
- fog=True mode=ExponentialSquared color=#723F4F(0.449,0.247,0.31) density=0.005 linStart=0 linEnd=300
- skybox=Resources/tuanjie_builtin_extra
- sun=Directional light rot=(61.76, 232.99, 303.68) intensity=1 color=#FFFFFF(1,1,1) shadows=Soft shadowStrength=1 bounceIntensity=1
- light[1] name=Directional light type=Directional rot=(61.76, 232.99, 303.68) intensity=1 color=#FFFFFF(1,1,1) range=10 spot=30 shadows=Soft strength=1 layer=0 renderMode=Auto
- volumes: NONE
- cam[1] name=Main Camera fov=41.8 clear=Skybox bg=#314D79(0.192,0.302,0.475) depth=-1 postProcessing=n/a
    pos=(20.06, 24.25, 30.19) rot=(27.54, 232.80, 0.00)
- root_objects=3

## AD-015 Nature 植被地形
- ambientMode=Skybox ambientLight=#363A42(0.212,0.227,0.259) ambientSky=#363A42(0.212,0.227,0.259) ambientEquator=#1D2022(0.114,0.125,0.133) ambientGround=#0C0B09(0.047,0.043,0.035) ambientInt=1
- fog=False mode=ExponentialSquared color=#646574(0.392,0.395,0.456) density=0.0004 linStart=0 linEnd=300
- skybox=Resources/tuanjie_builtin_extra
- sun=Directional Light rot=(46.35, 33.22, 3.00) intensity=0.86 color=#FFF1CA(1,0.945,0.794) shadows=Soft shadowStrength=1 bounceIntensity=1
- light[1] name=Directional Light type=Directional rot=(49.13, 149.39, 62.60) intensity=0.24 color=#99B0E7(0.599,0.689,0.904) range=10 spot=30 shadows=None strength=1 layer=0 renderMode=Auto
- light[2] name=Directional Light type=Directional rot=(46.35, 33.22, 3.00) intensity=0.86 color=#FFF1CA(1,0.945,0.794) range=10 spot=30 shadows=Soft strength=1 layer=0 renderMode=Auto
- volumes: NONE
- cam[1] name=Main Camera fov=36.6 clear=Skybox bg=#314D79(0.192,0.302,0.475) depth=-1 postProcessing=n/a
    pos=(7.61, 2.51, -0.81) rot=(5.36, 89.90, 0.00)
- root_objects=9

## AD-048 Starter 起始包
- ambientMode=Skybox ambientLight=#363A42(0.212,0.227,0.259) ambientSky=#363A42(0.212,0.227,0.259) ambientEquator=#1D2022(0.114,0.125,0.133) ambientGround=#0C0B09(0.047,0.043,0.035) ambientInt=1
- fog=False mode=ExponentialSquared color=#808080(0.5,0.5,0.5) density=0 linStart=0 linEnd=300
- skybox=Resources/tuanjie_builtin_extra
- sun=Directional Light rot=(36.91, 147.74, 293.43) intensity=1 color=#FFF4D6(1,0.957,0.839) shadows=Soft shadowStrength=1 bounceIntensity=1
- light[1] name=Directional Light type=Directional rot=(36.91, 147.74, 293.43) intensity=1 color=#FFF4D6(1,0.957,0.839) range=10 spot=30 shadows=Soft strength=1 layer=0 renderMode=Auto
- light[2] name=Directional Light (1) type=Directional rot=(52.53, 262.25, 112.63) intensity=0.27 color=#CCDDFF(0.801,0.869,1) range=10 spot=30 shadows=None strength=1 layer=0 renderMode=Auto
- volumes: NONE
- cam[1] name=Main Camera fov=60 clear=Skybox bg=#314D79(0.192,0.302,0.475) depth=-1 postProcessing=n/a
    pos=(9.48, 4.12, 17.49) rot=(11.55, 205.92, 0.00)
- root_objects=4

# ProjectURP asset=Assets/Settings/URP-HighFidelity.asset shadowDistance=600 msaa=4 hdr=on
