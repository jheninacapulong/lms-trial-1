@echo off
REM First Aid LMS - Quick Start Script for Windows

echo.
echo ============================================
echo   First Aid LMS - Quick Start
echo ============================================
echo.

REM Check if PostgreSQL is installed
echo Checking for PostgreSQL...
psql --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: PostgreSQL is not installed or not in PATH
    echo Please install PostgreSQL from: https://www.postgresql.org/download/windows/
    pause
    exit /b 1
)

echo PostgreSQL found: OK
echo.

REM Create database
echo Creating database...
psql -U postgres -c "CREATE DATABASE lms_db;" 2>nul
if %errorlevel% equ 0 (
    echo Database created: OK
) else (
    echo Database may already exist
)
echo.

REM Navigate to backend
cd backend

echo Installing backend dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Error installing dependencies
    pause
    exit /b 1
)
echo.

echo Running database migrations...
call npx prisma migrate dev --name init
if %errorlevel% neq 0 (
    echo Error running migrations
    pause
    exit /b 1
)
echo.

echo Seeding database with sample data...
call npm run seed
if %errorlevel% neq 0 (
    echo Error seeding database
    pause
    exit /b 1
)
echo.

cd ..

echo Installing frontend dependencies...
cd frontend
call npm install
cd ..

echo.
echo ============================================
echo   Setup Complete!
echo ============================================
echo.
echo To start the application:
echo.
echo Terminal 1 - Backend:
echo   cd backend
echo   npm run dev
echo.
echo Terminal 2 - Frontend:
echo   cd frontend
echo   npm run dev
echo.
echo Then open: http://localhost:5173
echo.
pause
