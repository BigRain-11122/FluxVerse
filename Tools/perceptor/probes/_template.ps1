# FluxVerse probe template - copy me to add a new data source
# Contract:
#   1. READ-ONLY: never write to any sibling repo.
#   2. ASCII-only script body (Chinese only inside data files).
#   3. Define function Probe-<FileName> (this file: Probe-_template).
#      Signature: param($ctx) -> return @{ state = @{...} }
#      $ctx.root    = FluxGroup root path
#      $ctx.now     = UTC now string
#      $ctx.cursor  = shared hashtable (persisted plain lines, see scan.ps1)
#      $ctx.worldDir = FluxVerse world dir (own-repo runtime data, read-only here)
#      $ctx.AddEvent = scriptblock: & $ctx.AddEvent 'TYPE' 'actor' 'repo' 'zone' 'summary'
#   4. Self-limit: wrap body in try/catch; on failure return $null (degrade, never block).
#   5. Register: add one line to TECH.md section 9 probe list + events used must exist
#      in schema/events-registry.json.
#   6. Native-capture encoding law (r32): if you call a native tool (& git, & python,
#      ...) whose stdout can carry non-ASCII (UTF-8) bytes, PS5.1 decodes with
#      [Console]::OutputEncoding = system codepage (GBK under the tick console)
#      -> mojibake. Save/swap/restore around the capture, restore in finally:
#        $prevEnc = $null
#        try { $prevEnc = [Console]::OutputEncoding
#              [Console]::OutputEncoding = New-Object System.Text.UTF8Encoding($false) }
#        catch { $prevEnc = $null }
#        try { ...capture... } finally {
#          if ($null -ne $prevEnc) { try { [Console]::OutputEncoding = $prevEnc } catch {} } }
#      See probes/git.ps1 (r32) and TECH.md section 9 law line.
#      Git-specific belt (r92, D-20260925-04): any git call whose output can
#      carry CJK (log/show/diff subjects) ALSO passes
#      -c i18n.logOutputEncoding=UTF-8, e.g.
#        & git -C $d -c i18n.logOutputEncoding=UTF-8 log ...
#      git then re-encodes subjects to UTF-8 no matter what repo/global
#      i18n config says, keeping the byte stream deterministic under the
#      UTF8 console swap (the swap stays the load-bearing decoder fix; the
#      -c closes the hostile-config hole where git would emit GBK bytes and
#      the swap would then mis-decode them).
#   7. Data-file encoding law (r53): every UTF-8 file read MUST carry an explicit
#      -Encoding UTF8. PS5.1 Get-Content without it decodes a no-BOM UTF-8 file
#      as GBK; beyond mojibake, a line whose trailing CJK run has an odd number of
#      bytes gets its LF swallowed by the GBK pair consumer => lines silently
#      MERGE (TECH.md 166 -> 97 lines; odd run merges, even run survives).
#      ASCII-only files are content-immune but keep the flag so a repo-wide grep
#      audit (Get-Content without -Encoding) stays empty. See TECH sec.9 r53.
#   8. world\ measurement law (r63, infra-2 P-43): any read of files under
#      world\ (live stream, archives, state, cursors - for dedup, counts,
#      audits, any measurement) MUST carry an explicit -Encoding UTF8. The
#      infra-2 first quantitative pass read the stream with the PS5.1 default
#      (GBK) and reported 316 phantom PARSE_FAIL rows; a strict UTF-8 re-read
#      found 0. (.NET [System.IO.File]::ReadAllText/ReadAllLines default to
#      UTF-8 detection = safe; the Get-Content default is the trap.) Superset
#      of law 7, kept separate because world\ is the shared bus: one sloppy
#      read poisons the whole measurement, not just one probe's view.

function Probe-_template {
  param($ctx)
  try {
    # ---- read your data source (read-only!) ----
    # $src = Join-Path $ctx.root 'path\to\source'

    # ---- emit events (types must be registered) ----
    # & $ctx.AddEvent 'OS_TICK_DONE' 'actor' 'repo' 'zone' 'summary'

    # ---- update cursor (incremental memory) ----
    # $ctx.cursor['<key>'] = 'value'

    # ---- return state fragment (merged by scan.ps1 assembler) ----
    return @{ state = @{ my_key = 'my_value' } }
  } catch {
    return $null
  }
}
