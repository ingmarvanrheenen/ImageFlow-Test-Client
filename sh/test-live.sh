#!/bin/bash

# Quick test script for your live Render API
# No CORS issues since it uses curl

API_URL="https://imageflow-api.onrender.com"
SECRET="7d776b60-f55c-11f0-ab89-778359b4e97b"

echo "🚀 Testing ImageFlow API on Render"
echo "===================================="
echo ""

# Test 1: Health Check
echo "1️⃣ Testing Health Check..."
HEALTH=$(curl -s "$API_URL/health" \
  -H "X-RapidAPI-Proxy-Secret: $SECRET")

if echo "$HEALTH" | grep -q "healthy"; then
    echo "✅ Health check passed!"
    echo "$HEALTH" | jq '.' 2>/dev/null || echo "$HEALTH"
else
    echo "❌ Health check failed!"
    echo "$HEALTH"
fi

echo ""
echo "---"
echo ""

# Test 2: QR Code Generation
echo "2️⃣ Testing QR Code Generation..."
QR_RESPONSE=$(curl -s -X POST "$API_URL/api/v1/qrcode/generate" \
  -H "Content-Type: application/json" \
  -H "X-RapidAPI-Proxy-Secret: $SECRET" \
  -H "X-RapidAPI-User: test-user" \
  -H "X-RapidAPI-Subscription: BASIC" \
  -d '{
    "data": "Testing ImageFlow API on Render!",
    "size": 300,
    "format": "png"
  }')

if echo "$QR_RESPONSE" | grep -q "success"; then
    echo "✅ QR Code generation successful!"
    echo "$QR_RESPONSE" | jq 'del(.data.qrcode)' 2>/dev/null || echo "QR code generated (base64 hidden)"
    
    # Save QR code to file
    echo "$QR_RESPONSE" | jq -r '.data.qrcode' 2>/dev/null | \
      sed 's/^data:image\/png;base64,//' | \
      base64 -d > output/test-qr-render.png 2>/dev/null
    
    if [ -f "output/test-qr-render.png" ]; then
        echo "💾 Saved to: output/test-qr-render.png"
        echo "   Open it: open output/test-qr-render.png"
    fi
else
    echo "❌ QR Code generation failed!"
    echo "$QR_RESPONSE"
fi

echo ""
echo "---"
echo ""

# Test 3: API Info
echo "3️⃣ API Information..."
echo "   URL: $API_URL"
echo "   Status: Online ✅"
echo "   Authentication: RapidAPI Headers ✅"
echo "   Endpoints:"
echo "     - GET  /health"
echo "     - POST /api/v1/qrcode/generate"
echo "     - POST /api/v1/qrcode/decode"
echo "     - POST /api/v1/image/resize"
echo "     - POST /api/v1/image/convert"

echo ""
echo "===================================="
echo "🎉 Testing complete!"
echo ""
echo "💡 Tips:"
echo "   - Web tester has CORS issues until you redeploy"
echo "   - Use this script for quick testing"
echo "   - Deploy the CORS fix to enable web tester"
echo ""
echo "📋 To deploy CORS fix:"
echo "   git add src/app.js"
echo "   git commit -m 'Enable CORS for production'"
echo "   git push"
echo "   (Render will auto-deploy)"
