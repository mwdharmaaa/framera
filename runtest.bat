@echo off
setlocal
echo ===================================================================
echo [*] Running Framera Automated Test Suite
echo ===================================================================

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [x] Node.js is required to execute the test runner.
    exit /b 1
)

node --test tests/*.test.js
if %errorlevel% neq 0 (
    echo [x] Test suite execution encountered failures.
    exit /b 1
)

echo [OK] All test suites passed successfully.
