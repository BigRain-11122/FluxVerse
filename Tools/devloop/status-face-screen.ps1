# status-face-screen.ps1 - one definition of the public content screen (r787)
# ---------------------------------------------------------------------------
# WHY (r787): world-public/city-snapshot.json has carried a status_face section
# since r239 (Executive Protocol v1.1 no.3 three-line law) and the exporter
# content-screens all six values (G1 secret / G3 words ASCII+CJK / G5 metadata)
# BEFORE including them: a hit drops the WHOLE section, fail-soft, and prints
# one token string - `status_face=skip-G3cjk`. That is the honest blast-radius
# design, but the note never said WHICH key or WHICH word tripped it, so the
# section could sit absent for rounds with nobody able to bisect it. r787 found
# the live case: the word for "policy" (CJK, two chars) inside a plain sentence
# about log retention tripped the CJK list, and every tick since dropped the
# three lines the CEO is supposed to see.
#
# Two gates, one definition:
#   release gate = Tools\tick\export-public-snapshot.ps1 (still fail-soft: a bad
#                  line must never block the public snapshot)
#   birth gate   = Tools\devloop\write-status-face.ps1 (refuses the write and
#                  names key+token - the r746 bare-name precedent: catch the
#                  disease at the earliest station that can be checked)
# Neither gate owns a copy of the lists; if they did, one side could tighten or
# loosen without the other noticing (the r746 face-path-lint drift).
#
# POLICY NOTE: the word list below is byte-for-byte the one the exporter has
# carried since r239 - this module moves it, it does not edit it. An over-broad
# token is a release-gate policy question (committee), not a devloop decision;
# r787 only made the hit diagnosable and moved the moment of detection.
#
# Get-StatusFaceScreenHit -Value <string> [-Key <string>]
#   returns '' when clean, else 'FACE:token' or 'FACE:key:token' where FACE is
#   one of G1/G3/G3cjk/G5. The token is the pattern or word that tripped, never
#   the surrounding text (a secret hit must not echo the secret).
# ASCII-only body (PS5.1 GBK law); CJK scan words are built from code points.
# ---------------------------------------------------------------------------

function CJK
{
    param([int[]]$cps)
    $s = ''
    foreach ($c in $cps) { $s += [char]$c }
    $s
}

# secret patterns (P0 class): cloud keys, private key headers, platform tokens
$SF_SECRET_PATTERNS = @(
    'AKIA[0-9A-Z]{16}',
    '-----BEGIN [A-Z ]*PRIVATE KEY',
    'ghp_[A-Za-z0-9]{20,}',
    'github_pat_[A-Za-z0-9_]{20,}',
    'sk-[A-Za-z0-9]{20,}',
    'xox[baprs]-[A-Za-z0-9-]{10,}',
    'AIza[0-9A-Za-z_-]{35}'
)

# sensitive-face words (structure net is primary; this is the content net)
$SF_FW_ASCII = @('password','passwd','secret','token','apikey','api_key','private_key','smtp','credential','access_key','net_value','netvalue','profit','drawdown','strategy','factor','balance','equity')
$SF_FW_CJK = @(
    (CJK @(0x5BC6,0x94A5)),      # mi-yao (secret key)
    (CJK @(0x5BC6,0x7801)),      # mi-ma (password)
    (CJK @(0x6388,0x6743,0x7801)), # shou-quan-ma (auth code)
    (CJK @(0x76C8,0x4E8F)),      # ying-kui (profit and loss)
    (CJK @(0x51C0,0x503C)),      # jing-zhi (net value)
    (CJK @(0x4ED3,0x4F4D)),      # cang-wei (position)
    (CJK @(0x7B56,0x7565)),      # ce-lue (strategy)
    (CJK @(0x884C,0x60C5))       # hang-qing (market quotes)
)

# local machine path + username leak patterns (G5, P-66 release gate 3.3):
# 'C:\Users' and 'Desktop\FluxGroup' appear twice - raw values text and the
# JSON-escaped serialized form. 'sjs20' = username net.
$SF_META_PATTERNS = @(
    'C:\Users',
    'C:\\Users',
    'Desktop\FluxGroup',
    'Desktop\\FluxGroup',
    '/home/',
    'sjs20'
)

function Get-StatusFaceScreenHit
{
    param([string]$Value, [string]$Key = '')
    if ([string]::IsNullOrEmpty($Value)) { return '' }
    $face = ''
    $tok = ''
    foreach ($pat in $SF_SECRET_PATTERNS) {
        if ($Value -match $pat) { $face = 'G1'; $tok = $pat; break }
    }
    if (-not $face) {
        foreach ($w in $SF_FW_ASCII) {
            if ($Value -match [regex]::Escape($w)) { $face = 'G3'; $tok = $w; break }
        }
    }
    if (-not $face) {
        foreach ($w in $SF_FW_CJK) {
            if ($Value.Contains($w)) { $face = 'G3cjk'; $tok = $w; break }
        }
    }
    if (-not $face) {
        foreach ($w in $SF_META_PATTERNS) {
            if ($Value -match [regex]::Escape($w)) { $face = 'G5'; $tok = $w; break }
        }
    }
    if (-not $face) { return '' }
    if ([string]::IsNullOrEmpty($Key)) { return ($face + ':' + $tok) }
    return ($face + ':' + $Key + ':' + $tok)
}