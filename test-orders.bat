@echo off
echo ========================================
echo  Order System - Ready to Test!
echo ========================================
echo.
echo What was implemented:
echo   1. Orders now save to device storage
echo   2. Success alert shows order confirmation
echo   3. Orders tab displays your real orders
echo   4. Orders persist after app restart
echo.
echo ========================================
echo  Starting dev server with fresh cache...
echo ========================================
echo.

rmdir /s /q .expo 2>nul
npm start -- --clear
