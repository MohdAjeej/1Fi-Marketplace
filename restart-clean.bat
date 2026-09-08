@echo off
echo ========================================
echo  Clearing ALL Caches and Restarting
echo ========================================
echo.

echo [1/4] Clearing .expo directory...
rmdir /s /q .expo 2>nul

echo [2/4] Clearing Metro bundler cache...
rmdir /s /q %LOCALAPPDATA%\Temp\metro-* 2>nul
rmdir /s /q %LOCALAPPDATA%\Temp\haste-map-metro-* 2>nul

echo [3/4] Clearing node_modules cache...
rmdir /s /q node_modules\.cache 2>nul

echo [4/4] Starting with --clear flag...
echo.
npm start -- --clear
