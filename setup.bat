@echo off
title Sukhira V2 Setup Tool
echo ====================================================
echo             Sukhira Wellness V2 Setup Tool
echo ====================================================
echo.

if not exist ".env" (
    echo [ERROR] Master '.env' configuration file not found!
    echo Please create a file named '.env' in this directory (D:\Sukhira V2\.env)
    echo and fill in your Firebase, R2, and Razorpay keys.
    echo.
    pause
    exit /b 1
)

echo [1/4] Copying environment configurations...
if not exist "backend" mkdir "backend"
if not exist "store" mkdir "store"
if not exist "admin" mkdir "admin"

copy /y ".env" "backend\.env" >nul
copy /y ".env" "store\.env" >nul
copy /y ".env" "admin\.env" >nul
echo ✓ Environment variables synchronized.
echo.

echo [2/4] Installing backend server dependencies...
cd backend
call npm install
cd ..
echo ✓ Backend dependencies installed.
echo.

echo [3/4] Installing customer storefront dependencies...
cd store
call npm install
cd ..
echo ✓ Storefront dependencies installed.
echo.

echo [4/4] Installing admin panel dependencies...
cd admin
call npm install
cd ..
echo ✓ Admin panel dependencies installed.
echo.

echo ====================================================
echo Setup Completed Successfully!
echo ====================================================
echo To start each application locally:
echo   - Backend: run 'npm run dev' inside backend/
echo   - Storefront: run 'npm run dev' inside store/
echo   - Admin Panel: run 'npm run dev' inside admin/
echo ====================================================
pause
