@echo off
echo ====================================================
echo Starting Mall Customer Analyzer
echo ====================================================

REM Start Backend
start "Mall Analyzer Backend (Flask)" cmd /k ".\.venv\Scripts\python.exe app.py"

REM Start Frontend Dev Server
start "Mall Analyzer Frontend (Vite)" cmd /k "cd frontend && npm run dev"

echo.
echo Backend is starting at http://localhost:5000
echo Frontend dev server is starting at http://localhost:5173
echo You can also access the full app directly at http://localhost:5000
echo ====================================================
