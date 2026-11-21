@echo off
setlocal
cd /d "%~dp0.."

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js not found. Install it from https://nodejs.org and try again.
  pause
  exit /b 1
)

echo Starting W2b admin tool...
start "W2b Admin Server" cmd /k node .admin\server.js
timeout /t 2 /nobreak >nul
start "" http://127.0.0.1:4848
exit
