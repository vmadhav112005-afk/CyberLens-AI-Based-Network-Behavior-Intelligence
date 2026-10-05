@echo off
title CyberLens - AI-Based Network Behavior Intelligence
color 0b

echo ======================================================================
echo           CYBERLENS -- AI-BASED NETWORK BEHAVIOR INTELLIGENCE
echo              Comparing Classification vs Clustering on 150k Flows
echo ======================================================================
echo.

:: Check Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH.
    pause
    exit /b 1
)

:: Check Node
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH.
    pause
    exit /b 1
)

:: Check Dataset Existence
if not exist "data\network_traffic_dataset.csv" (
    echo [INFO] Dataset not found. Generating 150,000 realistic network flows...
    python data\generate_dataset.py --rows 150000
)

:: Check Models Existence
if not exist "models\classification_model.pkl" (
    echo [INFO] Training Supervised Classification Model (Random Forest)...
    python ml\classification.py
)

if not exist "models\clustering_model.pkl" (
    echo [INFO] Training Unsupervised Clustering Model (K-Means)...
    python ml\clustering.py
)

echo.
echo [1/2] Starting CyberLens FastAPI Backend on http://localhost:8000 ...
start "CyberLens API Backend" cmd /k "python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload"

echo [2/2] Starting CyberLens React Dashboard on http://localhost:5173 ...
cd frontend
start "CyberLens SOC Dashboard" cmd /k "npm run dev -- --port 5173"
cd ..

echo.
echo ======================================================================
echo  CyberLens Services are Running!
echo  - Frontend Dashboard : http://localhost:5173
echo  - FastAPI Swagger Docs: http://localhost:8000/docs
echo  - REST API Base URL  : http://localhost:8000/api
echo ======================================================================
echo.
timeout /t 3 >nul
start http://localhost:5173
pause
