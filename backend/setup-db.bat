@echo off
echo ===============================================
echo   MORTECH - Database Setup Script
echo ===============================================
echo.

echo [1/3] Pushing Prisma schema to database...
call npx prisma db push

if %errorlevel% neq 0 (
    echo ERROR: Failed to push schema
    pause
    exit /b 1
)

echo.
echo [2/3] Generating Prisma Client...
call npx prisma generate

if %errorlevel% neq 0 (
    echo ERROR: Failed to generate Prisma client
    pause
    exit /b 1
)

echo.
echo [3/3] Seeding database with initial data...
call node scripts/seedAll.js

if %errorlevel% neq 0 (
    echo WARNING: Seeding failed - you may need to seed manually
)

echo.
echo ===============================================
echo   Database setup completed successfully!
echo ===============================================
echo.
echo You can now start the backend server with:
echo   npm run dev
echo.
pause
