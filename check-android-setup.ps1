# Script pentru verificarea configurației Android

Write-Host "🔍 Verificare configurație Android..." -ForegroundColor Cyan

# Verifică ADB
Write-Host "`n📱 Verificare ADB..." -ForegroundColor Yellow
$adbPath = Get-Command adb -ErrorAction SilentlyContinue
if ($adbPath) {
    Write-Host "✅ ADB găsit: $($adbPath.Source)" -ForegroundColor Green
    adb version
} else {
    Write-Host "❌ ADB nu este găsit în PATH" -ForegroundColor Red
    Write-Host "   Instalează Android Studio și adaugă în PATH:" -ForegroundColor Yellow
    Write-Host "   C:\Users\$env:USERNAME\AppData\Local\Android\Sdk\platform-tools" -ForegroundColor Gray
}

# Verifică Android SDK
Write-Host "`n📦 Verificare Android SDK..." -ForegroundColor Yellow
$sdkPath = $env:ANDROID_HOME
if (-not $sdkPath) {
    $sdkPath = "$env:LOCALAPPDATA\Android\Sdk"
}

if (Test-Path $sdkPath) {
    Write-Host "✅ Android SDK găsit: $sdkPath" -ForegroundColor Green
} else {
    Write-Host "❌ Android SDK nu este găsit" -ForegroundColor Red
    Write-Host "   Instalează Android Studio de la:" -ForegroundColor Yellow
    Write-Host "   https://developer.android.com/studio" -ForegroundColor Gray
}

# Verifică emulatori
Write-Host "`n📱 Verificare emulatori..." -ForegroundColor Yellow
$emulatorPath = Get-Command emulator -ErrorAction SilentlyContinue
if ($emulatorPath) {
    Write-Host "✅ Emulator găsit" -ForegroundColor Green
    Write-Host "`nEmulatori disponibili:" -ForegroundColor Cyan
    emulator -list-avds
} else {
    Write-Host "❌ Emulator nu este găsit în PATH" -ForegroundColor Red
    Write-Host "   Adaugă în PATH:" -ForegroundColor Yellow
    Write-Host "   C:\Users\$env:USERNAME\AppData\Local\Android\Sdk\emulator" -ForegroundColor Gray
}

# Verifică Expo
Write-Host "`n⚛️ Verificare Expo..." -ForegroundColor Yellow
$expoPath = Get-Command npx -ErrorAction SilentlyContinue
if ($expoPath) {
    Write-Host "✅ Expo CLI disponibil" -ForegroundColor Green
} else {
    Write-Host "❌ Expo CLI nu este disponibil" -ForegroundColor Red
}

Write-Host "`nPentru instructiuni complete, vezi: SETUP_ANDROID_EMULATOR.md" -ForegroundColor Cyan

