@echo off
setlocal EnableDelayedExpansion
title JINI AI - Developer Console

:: Set console color (Cyan text on black background)
color 0B

echo =======================================================================
echo.
echo      ██╗██╗███╗   ██╗██╗       █████╗ ██╗
echo      ██║██║████╗  ██║██║      ██╔══██╗██║
echo      ██║██║██╔██╗ ██║██║█████╗███████║██║
echo ██   ██║██║██║╚██╗██║██║╚════╝██╔══██║██║
echo ╚█████╔╝██║██║ ╚████║██║      ██║  ██║██║
echo  ╚════╝ ╚═╝╚═╝  ╚═══╝╚═╝      ╚═╝  ╚═╝╚═╝
echo.
echo =======================================================================
echo   Advanced AI Blueprint Architect - Development Environment Server
echo =======================================================================
echo.

echo [*] Initializing JINI AI System...
echo.

echo [1/4] Terminating hanging Node.js processes (Preventing EPERM locks)...
taskkill /IM node.exe /F >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo  -[+] Successfully cleared old processes.
) else (
    echo  -[-] No hanging processes found. Clean start!
)
echo.

if not exist "node_modules\" (
    echo [2/4] First time setup detected! Installing missing dependencies...
    call npm install
    echo.
) else (
    echo [2/4] Dependencies verified (node_modules exists).
    echo.
)

echo [3/4] Generating Prisma Client...
call npx prisma generate
echo.

echo [4/4] Starting Next.js Development Server...
echo.
echo =======================================================================
echo   JINI AI is coming online. Press CTRL+C at any time to shutdown.
echo   Local App URL: http://localhost:3000
echo =======================================================================
call npm run dev

