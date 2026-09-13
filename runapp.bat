@echo off
setlocal
echo ===================================================================
echo [*] Starting Framera Photo Studio Local Server
echo ===================================================================

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [x] Node.js is required to launch Framera studio.
    exit /b 1
)

echo [*] Launching local server on http://localhost:8080 ...
start http://localhost:8080
node server.js
