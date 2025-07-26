#!/bin/bash

echo "🚀 Setting up Jivverr..."

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    echo "📦 Installing Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
else
    echo "✅ Homebrew is already installed"
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js..."
    brew install node
else
    echo "✅ Node.js is already installed"
    echo "Node version: $(node --version)"
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install Node.js first."
    exit 1
else
    echo "✅ npm is installed"
    echo "npm version: $(npm --version)"
fi

# Install dependencies
echo "📦 Installing project dependencies..."
npm install

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Configure Firebase:"
echo "   - Go to https://console.firebase.google.com/"
echo "   - Create a new project or select existing one"
echo "   - Enable Authentication (Email/Password)"
echo "   - Update firebase/config.js with your credentials"
echo ""
echo "2. Start the development server:"
echo "   npm run dev"
echo ""
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "📚 For detailed instructions, see README.md" 