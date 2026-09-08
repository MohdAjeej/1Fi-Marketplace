@echo off
echo ================================================
echo    1Fi App - Quick Fix Script
echo ================================================
echo.
echo This will clear cache and restart your app
echo.
pause

echo.
echo [1/3] Stopping any running processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 >nul

echo.
echo [2/3] Clearing Metro cache...
cd /d "%~dp0"
rmdir /s /q .expo 2>nul
rmdir /s /q node_modules\.cache 2>nul

echo.
echo [3/3] Starting app with clean cache...
echo.
echo ================================================
echo    Opening Expo...
echo    Scan QR code with Expo Go app!
echo ================================================
echo.

call npm start -- --clear

pause
