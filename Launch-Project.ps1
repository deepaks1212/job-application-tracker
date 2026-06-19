# ============================================================================
# 🚀 Job Application Tracker - One-Click Smart Launcher
# ============================================================================
# Interactive PowerShell startup script with automatic environment detection
# and intelligent dependency management

param(
    [switch]$Production = $false,
    [switch]$Fresh = $false
)

$ErrorActionPreference = "Stop"

# Color definitions for beautiful terminal output
$Colors = @{
    Reset   = "`e[0m"
    Success = "`e[32m"
    Error   = "`e[31m"
    Info    = "`e[36m"
    Warning = "`e[33m"
    Bold    = "`e[1m"
}

function Write-Header {
    Write-Host ""
    Write-Host "$($Colors.Bold)╔════════════════════════════════════════════════════════════╗$($Colors.Reset)"
    Write-Host "$($Colors.Bold)║     🚀 Job Application Tracker - Smart Launcher 🚀        ║$($Colors.Reset)"
    Write-Host "$($Colors.Bold)╚════════════════════════════════════════════════════════════╝$($Colors.Reset)"
    Write-Host ""
}

function Write-Status {
    param([string]$Message, [ValidateSet("Success", "Error", "Info", "Warning")]$Type = "Info")
    $color = $Colors[$Type]
    $emoji = @{
        Success = "✓"
        Error   = "✗"
        Info    = "ℹ"
        Warning = "⚠"
    }[$Type]
    Write-Host "$($color)[$emoji] $Message$($Colors.Reset)"
}

function Check-Prerequisites {
    Write-Host "$($Colors.Info)Checking prerequisites...$($Colors.Reset)"
    
    # Check Node.js
    if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
        Write-Status "Node.js not found. Please install Node.js v18+" Error
        exit 1
    }
    $nodeVersion = node --version
    Write-Status "Node.js $nodeVersion detected" Success
    
    # Check npm
    if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
        Write-Status "npm not found. Please install npm" Error
        exit 1
    }
    Write-Status "npm $(npm --version) detected" Success
}

function Setup-Environment {
    Write-Host ""
    Write-Host "$($Colors.Info)Setting up environment...$($Colors.Reset)"
    
    # Create .env if it doesn't exist
    if (-not (Test-Path ".env")) {
        Write-Status "Creating .env file from template" Info
        if (Test-Path ".env.example") {
            Copy-Item ".env.example" ".env"
            Write-Status ".env created successfully" Success
        } else {
            Write-Status ".env.example not found" Warning
        }
    } else {
        Write-Status ".env file already exists" Info
    }
}

function Install-Dependencies {
    Write-Host ""
    Write-Host "$($Colors.Info)Installing dependencies...$($Colors.Reset)"
    
    if ($Fresh -or -not (Test-Path "node_modules")) {
        Write-Status "Running npm install..." Info
        npm install
        Write-Status "Dependencies installed" Success
    } else {
        Write-Status "Dependencies already installed" Info
    }
}

function Initialize-Database {
    Write-Host ""
    Write-Host "$($Colors.Info)Initializing database...$($Colors.Reset)"
    
    Write-Status "Database schema will auto-initialize on server start" Info
    Write-Status "Sample data will be auto-seeded if database is empty" Info
}

function Build-Production {
    if ($Production) {
        Write-Host ""
        Write-Host "$($Colors.Info)Building for production...$($Colors.Reset)"
        
        npm run build
        if ($LASTEXITCODE -ne 0) {
            Write-Status "Build failed" Error
            exit 1
        }
        Write-Status "Production build completed" Success
    }
}

function Start-Application {
    Write-Host ""
    Write-Host "$($Colors.Bold)╔════════════════════════════════════════════════════════════╗$($Colors.Reset)"
    Write-Host "$($Colors.Bold)║          🎯 Ready to Launch Application 🎯               ║$($Colors.Reset)"
    Write-Host "$($Colors.Bold)╚════════════════════════════════════════════════════════════╝$($Colors.Reset)"
    Write-Host ""
    
    if ($Production) {
        Write-Status "Starting production server..." Info
        Write-Host ""
        npm start
    } else {
        Write-Status "Starting development server (with hot reload)..." Info
        Write-Host ""
        Write-Host "$($Colors.Bold)TIPS FOR DEVELOPMENT:$($Colors.Reset)"
        Write-Host "  • Frontend: Changes auto-reload via Vite HMR"
        Write-Host "  • Backend: Modify server.ts and restart to see changes"
        Write-Host "  • Database: Auto-seeds with sample data on first run"
        Write-Host ""
        npm run dev
    }
}

function Show-Menu {
    Write-Host ""
    Write-Host "$($Colors.Bold)Select startup mode:$($Colors.Reset)"
    Write-Host "  1. Development (default - with hot reload)"
    Write-Host "  2. Production (optimized build)"
    Write-Host "  3. Fresh install (clean reinstall dependencies)"
    Write-Host ""
    $choice = Read-Host "Enter your choice (1-3)"
    
    switch ($choice) {
        "2" { $script:Production = $true }
        "3" { $script:Fresh = $true }
        default { $script:Production = $false }
    }
}

# ============================================================================
# MAIN EXECUTION
# ============================================================================

Clear-Host
Write-Header

if (-not $Production -and -not $Fresh) {
    Show-Menu
}

Check-Prerequisites
Setup-Environment
Install-Dependencies
Initialize-Database
Build-Production

Write-Host ""
Write-Host "$($Colors.Success)$($Colors.Bold)All checks passed! Starting application...$($Colors.Reset)"
Write-Host ""

Start-Application
