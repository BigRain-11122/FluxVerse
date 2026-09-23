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
