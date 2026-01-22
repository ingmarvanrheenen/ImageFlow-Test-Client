#!/bin/bash

# Quick setup script for testing your live RapidAPI

echo "🚀 RapidAPI Test Setup"
echo "====================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created .env file"
fi

echo "Let's configure your test environment!"
echo ""

# Ask for environment
echo "Which environment do you want to test?"
echo "1) Local development (localhost:3000)"
echo "2) Production (your deployed API on RapidAPI)"
read -p "Enter choice [1-2]: " choice

if [ "$choice" = "1" ]; then
    # Local config
    cat > .env << EOF
# Test Client Configuration - LOCAL DEVELOPMENT
TEST_API_URL=http://localhost:3000
RAPIDAPI_PROXY_SECRET=test-secret
TEST_RAPIDAPI_USER=test-user-123
TEST_RAPIDAPI_SUBSCRIPTION=BASIC
NODE_ENV=development
EOF
    
    echo ""
    echo "✅ Configured for local development!"
    echo ""
    echo "📋 Next steps:"
    echo "   1. Start your API: cd .. && npm run dev"
    echo "   2. Run tests: npm test"
    echo "   3. Or open web tester: open web-tester.html"
    
elif [ "$choice" = "2" ]; then
    # Production config
    echo ""
    read -p "Enter your deployed API URL (e.g., https://your-app.herokuapp.com): " api_url
    read -p "Enter your RapidAPI Proxy Secret (from RapidAPI dashboard): " proxy_secret
    
    cat > .env << EOF
# Test Client Configuration - PRODUCTION (RapidAPI)
TEST_API_URL=$api_url
RAPIDAPI_PROXY_SECRET=$proxy_secret
TEST_RAPIDAPI_USER=test-user-123
TEST_RAPIDAPI_SUBSCRIPTION=BASIC
NODE_ENV=production
EOF
    
    echo ""
    echo "✅ Configured for production testing!"
    echo ""
    echo "📋 Testing your live API at: $api_url"
    echo ""
    echo "🔍 How to find your RapidAPI Proxy Secret:"
    echo "   1. Go to: https://rapidapi.com/developer/dashboard"
    echo "   2. Click on your API"
    echo "   3. Go to Settings or Endpoints"
    echo "   4. Copy the 'Proxy Secret' value"
    echo ""
    echo "📋 Next steps:"
    echo "   1. Run tests: npm test"
    echo "   2. Or open web tester: open web-tester.html"
else
    echo "❌ Invalid choice. Please run the script again."
    exit 1
fi

echo ""
echo "📝 Configuration saved to .env"
echo ""

# Ask if they want to run tests now
read -p "Do you want to run the tests now? [y/n]: " run_tests

if [ "$run_tests" = "y" ] || [ "$run_tests" = "Y" ]; then
    echo ""
    echo "🧪 Running tests..."
    echo ""
    npm test
fi
