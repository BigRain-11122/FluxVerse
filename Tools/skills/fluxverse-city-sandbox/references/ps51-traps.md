# PS5.1 陷阱律（harness 动笔前必读·症状 + 修法）

全部本仓实证（TECH §九 r 编号在案）。新坑随代增补本件。

## 编码族

- **默认读 GBK 吞行界**：Get-Content / Select-String 无 `-Encoding UTF8` 读 LF-only UTF-8 CJK 件 → 行数静默塌并（r53/r64）。修：一切读取显式 UTF8。
- **脚本体禁 CJK**：无 BOM UTF-8 脚本被 PS5.1 按 GBK 解析中文面量（P-14 律）。修：ASCII-only 体 + `[char]0x…` 码位构造 + 中文外置 UTF-8 数据件。
- **gitignored 零命中**：glob/grep 对 logs/·world/ 默认跳过 →「不存在」假象（r159b）。修：PS 直读。
- **原生捕获 CP936**：`& git` 等外部程序 stdout 按 [Console]::OutputEncoding 解码 → 乱码（r32）。修：save/swap/restore UTF8Encoding($false) + finally 恢复。
- **`>` 重定向转码二进制**：PS 重定向改字节 → 伪哈希（r119）。修：cmd /c 原字节或 .NET ReadAllBytes。

## 解析族（PS 参数态解析器系统性陷阱）

- **@() 字面量 `+` 拼接拆裂**：`@('a', 'b' + $v)` 元素拆三（r64）；@() 逗号位嵌 `+` 并成单串（r95 k=v 写侧两度中招）。修：拼接元素括号包裹；k=v 多行一律逐行 `$arr += $line` 或 WriteAllText 显式换行。
- **嵌套数组展平**：+= / 管道面保嵌套须一元逗号 `,@(...)`（r65）；hashtable 直赋多包一层逗号炸（r147）。修：直赋去逗号。
- **逗号单参绑定**：`OK '名', (cond)` = 数组字面量单参 → 断言恒假（r159c·48 全 FAIL 根因）。修：两参显式分隔。
- **cmdlet/函数与比较混排吃参**：`(Get-Command x -ne $null)` 比较符被当参数吞（r32）；`((Col-Count) -eq 0)` 函数调用必自括号包裹再比较（r46 A10）。
- **一元 -not 优先级**：`-not $x -match 'y'` 析为 `(-not $x) -match` 恒假（r28）。修：`[regex]::IsMatch` 先入变量再判。
- **单结果 .Count 空险**：Where-Object 单结果非数组 → .Count 假红（r152）。修：@() 包裹。
- **ConvertFrom-Json 小数 = System.Decimal**：IsPrimitive 对 Decimal=false → 数值标量门 10 红全假（r145）。修：ValueType + `^-?\d+(\.\d+)?$` 字符串形态法。
- **2MB ConvertFrom-Json 上限**：大件零全量 parse（r95 transfers 2.35MB 头 40 行正则先例）。
- **$LASTEXITCODE 未设**：纯 cmdlet 链 `if ($LASTEXITCODE -ne 0)` 对 $null 恒真 = 链式门误杀后段（r97）。修：显式置 0 或脚本自身 exit 传播。

## 变量与类型族

- **变量大小写不敏感碰撞**：`foreach ($b in $B)` 首遍把表数组覆写为末位元素 →「自相矛盾红」族（r159a·11 红同源）。修：表变量专名，循环变量禁与任何在册变量同异名。
- **只读自动变量**：`$pid = …` 当场抛错被探针 try/catch 吞 → 整针静默 $null + tick 面 OK 照打（r164·假绿面）。修：局部变量避开 $pid/$input/$args/$host/$error 全族。
- **[int] 强转 = 银行家舍入**：`[int](v+0.5)` 复合双舍入假大（r157a）。修：`[math]::Floor(v+0.5)` 唯一 round-half-up 原语。
- **ETS 行膨胀**：Get-Content 行喂 ConvertTo-Json 每行膨胀 ~2.23MB（r27）。修：`[string]$_` 解包。
- **子进程退出码读空**：Start-Process -PassThru 重定向下 .ExitCode = ''（r66 测量病）。修：.NET Process 类持句柄。
- **Get-Content -Tail 显示塌并假象**：-Tail 40 中文 CRLF 日志显示 1 行 ≠ 文件病（r163）。修：[IO.File]::ReadAllText 归一化复扫再判。

## 工序律（纪律面）

- **门面首红自证**：首跑红先疑 harness 面——三探针：产物独立复算 / 探针行为指纹 / 门面括号 bug（r154 A6b·r168 门面手算基数错同族），禁先怪产物。
- **双 parse 确定性**：同件两读字节等断言标配（防解析器非确定性混入门）。
- **负控 + 正控起火**：门族必须证非空转——已知违例必起火 + 已知净位必过门（r169 A2-ctl）。
- **.done 哨档轮次无关**：resume 律 SKIP 绿证据必须可归因本轮场景态（r162 stale 假绿面）。
