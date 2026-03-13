@echo off
setlocal enabledelayedexpansion

echo.
echo ========================================
echo  🚀 Toko Elektronik Online - Backend Setup
echo ========================================
echo.

REM Check if XAMPP MySQL exists
set MYSQL_PATH=C:\xampp\mysql\bin\mysqld.exe

if exist "!MYSQL_PATH!" (
    echo ✅ XAMPP MySQL found at: !MYSQL_PATH!
    echo.
    echo Starting MySQL Server in background...
    start "MySQL Server" "!MYSQL_PATH!" --console
    timeout /t 3 /nobreak
    echo ✅ MySQL Server started!
) else (
    echo ⚠️  XAMPP MySQL not found. Trying net start...
    net start MySQL80
    if !errorlevel! neq 0 (
        echo ❌ MySQL is not running and could not be started.
        echo.
        echo 📍 Please start MySQL manually:
        echo    - Open XAMPP Control Panel and click "Start" next to MySQL
        echo    - Or run: net start MySQL80
        echo.
        pause
        exit /b 1
    )
)

echo.
echo ========================================
echo  📦 Starting Backend Server...
echo ========================================
echo.

cd /d "%~dp0"
node server.js

pause
