#!/usr/bin/env bash
# ==============================================================================
# Nexora Academy - AI-Powered School Management System Launcher
# Zero-Docker, Zero-Credentials, Zero-PII Architecture
# ==============================================================================

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
echo "=========================================================="
echo " Starting Nexora Academy AI School Management System"
echo " Working Directory: $DIR"
echo "=========================================================="

# 1. Setup Backend
echo "[1/3] Preparing Python FastAPI backend..."
cd "$DIR/backend"
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
    ./venv/bin/pip install --upgrade pip
    ./venv/bin/pip install -r requirements.txt httpx
fi

# 2. Setup Frontend
echo "[2/3] Checking Frontend dependencies..."
cd "$DIR/frontend"
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

# 3. Launch both processes
echo "[3/3] Launching servers..."

# Function to kill child processes on exit
cleanup() {
    echo ""
    echo "Shutting down servers..."
    kill $(jobs -p) 2>/dev/null || true
}
trap cleanup EXIT SIGINT SIGTERM

# Start FastAPI on port 8000
echo "Starting Backend API on http://127.0.0.1:8000 (OpenAPI docs at http://127.0.0.1:8000/docs)..."
cd "$DIR/backend"
./venv/bin/python run.py &
BACKEND_PID=$!

# Start Vite React on port 3000
echo "Starting Frontend Web App on http://localhost:3000..."
cd "$DIR/frontend"
npm run dev -- --host 127.0.0.1 --port 3000 &
FRONTEND_PID=$!

echo ""
echo "=========================================================="
echo " All services running!"
echo " Web Application:  http://localhost:3000"
echo " Backend REST API: http://127.0.0.1:8000"
echo " Interactive Docs: http://127.0.0.1:8000/docs"
echo " Press Ctrl+C to terminate both servers."
echo "=========================================================="

wait

