# PS5.1 + GDI+ 陷阱律（烘焙面专用·带 r 号溯源）

烘焙器/harness 全在 PS5.1 + System.Drawing 上跑——以下全部静默或报错离根因极远，首红先对表。

## 舍入与数学

1. **银行家舍入律（r157）**：`[int](v+0.5)` 复合双舍入（16.65→17 假大）；px 律/门律唯一正原语=`[math]::Floor(v+0.5)`（round-half-up）。烘焙与门面双用同式防漂。
2. **[int] 强转族**：凡「四舍五入」意图一律 Floor(v+0.5)；凡截断意图用 [math]::Truncate 显式。

## 数组与参数态（PS 参数态解析器家族）

3. **@() 数组子表达式枚举展平（09-24 部件图集）**：`@( @(a,b), @(c,d) )` 内嵌数组被管道枚举摊平——嵌套保型：每元素加一元逗号 `,@(...)`，或改 hashtable 装部件（值引用保型）。
4. **@() 逗号位嵌 `+` 拼接（r95 伴生）**：`@('k=' + $v, 'k2=' + $v2)` 逗号优先于 + → 数组按 $OFS 字符串化并成单串——k=v 多行写侧一律逐行 `+=` 或 WriteAllText 显式换行。
5. **数组字面量拼接拆裂（r64）**：`@('a', 'b' + $v + 'c')` 元素位含 + 拆成三元素——拼接元素一律括号包裹。
6. **嵌套数组直赋陷阱（r147 伴生）**：hashtable 直赋值多包一层逗号 → op_Subtraction 炸——一元逗号保嵌套只适用 +=/管道面，直赋去逗号。
7. **New-Object 双括号参数拆裂（09-24）**：`New-Object System.Drawing.Bitmap((expr),(expr))` 参数模式逗号成数组再炸——复杂表达式先算入简单变量再传（$mw=…; New-Object …Bitmap($mw,$mh)）。
8. **cmdlet 调用与比较符混排吃参（r32/r28）**：`(Get-Command x -ne $null)` -ne 被吞——子表达式括号包裹再比较；一元 -not 与 -match 优先级同族（先 [regex]::IsMatch 入变量再 if）。
9. **'名', (cond) 逗号=数组字面量单参绑定（r159c）**：断言 helper `OK '名', (cond)` $cond 恒空全 FAIL——实参逗号必为两参传递。

## 变量与自动变量

10. **只读自动变量 $PID 族（r164）**：函数内 `$pid = <expr>` 当场抛错被 try/catch 吞 → 整针静默 return $null（tick 面照打 OK=假绿）；局部变量禁 $pid/$PID/$input/$args/$host/$error（大小写不敏感）。
11. **变量大小写不敏感碰撞（r159a）**：$B 与 $b 同一变量——`foreach ($b in $B)` 首遍覆写表数组；表变量专名+循环变量禁同异名。
12. **$LASTEXITCODE 未设陷阱（r97）**：纯 cmdlet 脚本链 `if ($LASTEXITCODE -ne 0)` 对 $null 恒真=误杀后段；链内门以脚本自身 exit 传播或显式置 0。
13. **别名优先于函数（09-24）**：自定义 function R 被内置别名 r=Invoke-History 抢占——函数命名避开全部内置别名（R/ls/cat/rm/ac/gp/sp）。

## 编码（烘焙面零例外）

14. **GBK 误读族（r53/r63）**：PS5.1 无 BOM UTF-8 脚本按系统码页 GBK 解析（中文注释/字面量必乱码）——烘焙器 ASCII-only；中文路径/文案外置 UTF-8 数据件（canopy-sources.txt 模式），读取一律显式 `-Encoding UTF8`；Select-String 默认编码同病（r64）。gitignored 路径（logs/·world/）rg 零命中=假象（r159b）——PS 直读。
15. **PS5.1 一元 -not 优先级（r28）**：`-not $x -match 'y'` 实析 `(-not $x) -match` 永假。

## GDI+ 专面

16. **ColorMap 按 ARGB 精确匹配（09-24）**：半透明叠画经 alpha 混合后像素≠设计值=remap 表全 miss（「银白方块」症状）——mask 用不透明灰阶带（末值覆盖不混色），alpha 在 remap 时注入（NewColor 携 alpha）。
17. **GDI 与 PNG 行序镜像律（r160）**：Unity/GDI+ 绘制坐标 y=0=图底 vs 盘上 PNG 读取 y=0=顶（EncodeToPNG 已翻显示序）——采样窗/度量窗跨两域必镜像翻转；手算 PNG 几何禁混两套行序。
18. **GenericTypographic 实测名宽（r108）**：文本宽度禁估算——MeasureString with StringFormat.GenericTypographic 实测；画布不足=fail-loud 放门或前导段截取法，禁静默裁字。
19. **镜像翻转**：raw ARGB 列翻转或负宽 DrawImage（NearestNeighbor·零重采样）；对称件非恒等门拒收（r113）。
20. **TODO 哨兵误伤（r170）**：package validator 扫 TODO——模板「轮内填充点」语义本异，标记一律用 FILL。

## 工序律

21. **门面首红自证（r154）**：harness 红先分诊三探针——产物独立复算 / 探针行为指纹（空结果取向分裂=零处理指纹）/ 门面括号 bug；门面红≠产物错。
22. **测量病五案溯源**：Start-Process -PassThru 重定向 .ExitCode 读空串（r66）/ PS `>` 重定向转码二进制（r119·二进制对照用 .NET ReadAllBytes）/ 夹具量级不足灭护栏（r165·撕裂护栏 <1000 对小夹具全红=护栏语义正确）/ 门面手算基数错（r165 Σ）/ 估宽必炸（r108）——首红先归因再修。
