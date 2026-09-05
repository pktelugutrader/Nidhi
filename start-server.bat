@echo off
title Alakaapuri Local Web Server (Port 8080)
echo ===================================================
echo   Alakaapuri Nidhi Local Web Server
echo   Running at: http://localhost:8080
echo   Close this window when you want to stop the server.
echo ===================================================
echo.
start "" "http://localhost:8080"
python -m http.server 8080
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Python not found, trying Node.js...
    npx -y serve -l 8080 .
)
pause
