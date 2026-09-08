@echo off
echo ============================================
echo 1Fi Marketplace Backend Setup Script
echo ============================================
echo.

echo Step 1: Checking Node.js installation...
node --version > nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo Node.js found: 
node --version
echo.

echo Step 2: Installing dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo Dependencies installed successfully!
echo.

echo Step 3: Checking for .env file...
if not exist .env (
    echo Creating .env file from template...
    copy .env.example .env > nul
    echo.
    echo ============================================
    echo IMPORTANT: Please edit .env file now!
    echo Update DATABASE_URL with your PostgreSQL password
    echo ============================================
    echo.
    pause
)
echo .env file found!
echo.

echo Step 4: Generating Prisma client...
call npm run prisma:generate
if errorlevel 1 (
    echo ERROR: Failed to generate Prisma client
    pause
    exit /b 1
)
echo Prisma client generated!
echo.

echo Step 5: Running database migrations...
call npm run prisma:migrate
if errorlevel 1 (
    echo ERROR: Failed to run migrations
    echo Please check:
    echo 1. PostgreSQL is running
    echo 2. DATABASE_URL in .env is correct
    echo 3. Database exists
    pause
    exit /b 1
)
echo Migrations completed!
echo.

echo Step 6: Seeding database with sample data...
call npm run seed
if errorlevel 1 (
    echo ERROR: Failed to seed database
    pause
    exit /b 1
)
echo Database seeded successfully!
echo.

echo ============================================
echo Setup Complete! 
echo ============================================
echo.
echo Backend is ready to start!
echo.
echo To start the development server, run:
echo     npm run dev
echo.
echo The API will be available at:
echo     http://localhost:3000
echo.
echo Test health endpoint:
echo     http://localhost:3000/health
echo.
pause
