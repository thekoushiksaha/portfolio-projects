$envFile = Join-Path $PSScriptRoot ".env"

if(-not (Test-Path $envFile)){
    Write-Error ".env file not found: $envFile"
    exit 1
}

Get-Content $envFile | Where-Object {
    $_.Trim() -ne "" -and
    -not $_.Trim().StartsWith("#") -and
    $_.Contains("=")
} | ForEach-Object {
    $key, $value = $_ -split "=", 2
    [Environment]::SetEnvironmentVariable(
        $key.Trim(),
        $value.Trim().Trim('"').Trim("'"),
        "Process"
    )
}

Write-Host "Environment variables loaded from .env" -ForegroundColor Green

if(-not $env:DB_PASSWORD){
    Write-Error "DB_PASSWORD is missing or empty in .env"
    exit 1
}

if(-not $env:JWT_SECRET){
    Write-Error "JWT_SECRET is missing or empty in .env"
    exit 1
}


if(-not $env:ADMIN_EMAIL){
    Write-Error "ADMIN_EMAIL is missing or empty in .env"
    exit 1
}

if(-not $env:ADMIN_PASSWORD){
    Write-Error "ADMIN_PASSWORD is missing or empty in .env"
    exit 1
}

./mvnw spring-boot:run