# Quick Start Guide

## 🚀 Get Jivverr Running in 5 Minutes

### Prerequisites
- macOS (for automatic setup)
- Internet connection

### Option 1: Automatic Setup (Recommended)
```bash
./setup.sh
```

### Option 2: Manual Setup
1. **Install Node.js**:
   ```bash
   brew install node
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Firebase**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication (Email/Password)
   - Copy your config to `firebase/config.js`

4. **Start the app**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Firebase Setup (Required)

1. Visit [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or select existing
3. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Email/Password
4. Get your config:
   - Go to Project Settings > General
   - Scroll to "Your apps"
   - Copy the config object
5. Update `firebase/config.js` with your values

## 🎯 What You'll Get

- ✅ User authentication (sign up/sign in)
- ✅ Medical diagnosis input form
- ✅ AI-powered explanations
- ✅ Analytics dashboard
- ✅ Responsive design
- ✅ Secure data handling

## 🚨 Important Notes

- This is a demo with simulated AI responses
- Medical data is stored locally in your browser
- Always consult healthcare professionals for medical advice
- Firebase configuration is required for authentication

## 🆘 Need Help?

- Check the full [README.md](README.md) for detailed instructions
- Ensure Node.js and npm are properly installed
- Verify Firebase configuration is correct
- Check browser console for any errors

## 🚀 Ready to Deploy?

```bash
npm run build
npm start
```

Or deploy to Vercel:
```bash
npm install -g vercel
vercel
``` 