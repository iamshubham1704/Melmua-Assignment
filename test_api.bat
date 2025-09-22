@echo off
REM Makeup API Test Script for Windows
REM This script demonstrates how to use the Makeup API

set API_BASE=http://localhost:8080/api/v1

echo 🎨 Makeup API Test Script
echo =========================

REM Test 1: Health Check
echo 1. Testing health endpoint...
curl -s "%API_BASE%/health"
echo.

REM Test 2: Get Available Styles
echo 2. Getting available makeup styles...
curl -s "%API_BASE%/makeup/styles"
echo.

REM Test 3: Upload Image (using a sample base64 image)
echo 3. Uploading sample image...
REM Note: This is a minimal 1x1 pixel JPEG in base64
set SAMPLE_IMAGE=data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=

curl -s -X POST "%API_BASE%/makeup/upload" -H "Content-Type: application/json" -d "{\"image_data\": \"%SAMPLE_IMAGE%\", \"format\": \"jpg\"}"
echo.

echo ✅ Test completed!
echo.
echo 📝 Notes:
echo - The sample image is a minimal 1x1 pixel JPEG
echo - Face detection may fail on such a small image
echo - Use real photos for better results
echo - Check the uploads/ directory for processed images
echo.
pause

