param (
  [Parameter(ValueFromRemainingArguments = $true)]
  [string[]] $Args
)

function Show-Usage {
  Write-Host "Usage: deno.ps1 <script> [--deno-flags] [--] [script-args...]"
  Write-Host "Example: deno.ps1 main.ts"
  Write-Host "Flags default: --unstable-kv --allow-net --allow-env --allow-read"
  exit 1
}

if (-not $Args -or $Args.Count -eq 0 -or $Args[0] -in @("-h","--help","help")) {
  Show-Usage
}

$defaultFlags = @(
  "--unstable-kv",
  "--allow-net",
  "--allow-env",
  "--allow-read"
)

$allArgs = @("run") + $defaultFlags + $Args

try {
  & deno @allArgs
  $exitCode = $LASTEXITCODE
  exit $exitCode
} catch {
  Write-Error "deno ajur: $_"
  exit 1
}
