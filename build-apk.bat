@echo off
echo ========================================
echo Building Manisera Android APK
echo ========================================
echo.

cd /d %~dp0

echo Step 1: Checking EAS CLI...
eas --version
if errorlevel 1 (
    echo EAS CLI not found. Installing...
    npm install -g eas-cli
)

echo.
echo Step 2: Login to Expo (if not already logged in)
echo Please login when prompted...
eas login

echo.
echo Step 3: Configuring project...
eas build:configure

echo.
echo Step 4: Building APK...
echo This may take 15-30 minutes...
eas build --platform android --profile preview

echo.
echo ========================================
echo Build complete!
echo ========================================
echo.
echo Next steps:
echo 1. Download the APK from the link provided
echo 2. Place it in: public\manisera.apk
echo 3. Commit and push to GitHub
echo.
pause


