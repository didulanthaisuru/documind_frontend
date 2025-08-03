#!/bin/bash

echo "Starting DocuMind Frontend..."
echo ""
echo "Prerequisites:"
echo "- Node.js must be installed"
echo "- Backend must be running on http://localhost:8000"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed. Please install npm first."
    exit 1
fi

echo "Installing dependencies..."
npm install

echo ""
echo "Starting development server..."
npm start 