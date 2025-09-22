#!/bin/bash

# Makeup API Test Script
# This script demonstrates how to use the Makeup API

API_BASE="http://localhost:8080/api/v1"

echo "🎨 Makeup API Test Script"
echo "========================="

# Test 1: Health Check
echo "1. Testing health endpoint..."
curl -s "$API_BASE/health" | jq '.'
echo ""

# Test 2: Get Available Styles
echo "2. Getting available makeup styles..."
curl -s "$API_BASE/makeup/styles" | jq '.'
echo ""

# Test 3: Upload Image (using a sample base64 image)
echo "3. Uploading sample image..."
# Note: This is a minimal 1x1 pixel JPEG in base64
SAMPLE_IMAGE="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="

UPLOAD_RESPONSE=$(curl -s -X POST "$API_BASE/makeup/upload" \
  -H "Content-Type: application/json" \
  -d "{\"image_data\": \"$SAMPLE_IMAGE\", \"format\": \"jpg\"}")

echo "$UPLOAD_RESPONSE" | jq '.'

# Extract image ID from response
IMAGE_ID=$(echo "$UPLOAD_RESPONSE" | jq -r '.data.id')
echo "Uploaded image ID: $IMAGE_ID"
echo ""

# Test 4: Apply Natural Makeup
echo "4. Applying natural makeup style..."
NATURAL_RESPONSE=$(curl -s -X POST "$API_BASE/makeup/apply/natural" \
  -H "Content-Type: application/json" \
  -d "{\"image_id\": \"$IMAGE_ID\", \"style_id\": \"natural\"}")

echo "$NATURAL_RESPONSE" | jq '.'
echo ""

# Test 5: Apply Bridal Makeup
echo "5. Applying bridal makeup style..."
BRIDAL_RESPONSE=$(curl -s -X POST "$API_BASE/makeup/apply/bridal" \
  -H "Content-Type: application/json" \
  -d "{\"image_id\": \"$IMAGE_ID\", \"style_id\": \"bridal\"}")

echo "$BRIDAL_RESPONSE" | jq '.'
echo ""

# Test 6: Apply Editorial Makeup
echo "6. Applying editorial makeup style..."
EDITORIAL_RESPONSE=$(curl -s -X POST "$API_BASE/makeup/apply/editorial" \
  -H "Content-Type: application/json" \
  -d "{\"image_id\": \"$IMAGE_ID\", \"style_id\": \"editorial\"}")

echo "$EDITORIAL_RESPONSE" | jq '.'
echo ""

echo "✅ All tests completed!"
echo ""
echo "📝 Notes:"
echo "- The sample image is a minimal 1x1 pixel JPEG"
echo "- Face detection may fail on such a small image"
echo "- Use real photos for better results"
echo "- Check the uploads/ directory for processed images"

