@echo off
REM ============================================================================
REM Job Application Tracker - Quick Launch (Windows Batch)
REM ============================================================================
REM Simple launcher for Windows Command Prompt users

setlocal enabledelayedexpansion

title Job Application Tracker - Launcher

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║     Job Application Tracker - Smart Launcher             ║
echo ╚════════════════════════════════════════════════════════════╝
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if errorlevel 1 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js v18+ from https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js detected: 
node --version

REM Create .env if it doesn't exist
if not exist ".env" (
    if exist ".env.example" (
        echo [INFO] Creating .env from template...
        copy .env.example .env
        echo [OK] .env created successfully
    ) else (
        echo [WARNING] .env.example not found
    )
) else (
    echo [OK] .env file already exists
)

echo.
echo [INFO] Installing dependencies...
call npm install
if errorlevel 1 (
    echo [ERROR] npm install failed
    pause
    exit /b 1
)

echo.
echo ╔════════════════════════════════════════════════════════════╗
echo ║     Starting Application in Development Mode             ║
echo ╚════════════════════════════════════════════════════════════╝
echo.
echo [INFO] Server will be available at http://localhost:5005
echo [TIP] Database will auto-seed with sample data on first run
echo.

call npm run dev

pause
