@echo off
echo Clearing Expo cache...
rmdir /s /q .expo\web\cache 2>nul
rmdir /s /q .expo\web 2>nul
echo.
echo Starting with clear cache...
npm start -- --clear
