# Jivverr

This is the Vercel-ready web version of Jivverr - an AI-powered medical diagnosis explanation tool.

## Features
- 🔐 Firebase Authentication (Sign up/Sign in)
- 📝 Diagnosis Input with symptom tracking
- 🤖 AI-Powered Layman Explanations
- 📊 Interactive Dashboard with analytics
- 🎨 Modern UI with Tailwind CSS
- 📱 Responsive design
- 🔒 Secure and private data handling

## Prerequisites

Before running this project, you need to install:

### Node.js and npm
1. **Install Homebrew** (if not already installed):
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. **Install Node.js**:
   ```bash
   brew install node
   ```

3. **Verify installation**:
   ```bash
   node --version
   npm --version
   ```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Firebase Configuration
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable Authentication (Email/Password)
4. Get your Firebase config from Project Settings
5. Update `firebase/config.js` with your actual Firebase credentials:

```javascript
export const firebaseConfig = {
  apiKey: 'your-actual-api-key',
  authDomain: 'your-project.firebaseapp.com',
  projectId: 'your-project-id',
  appId: 'your-app-id',
};
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### 4. Build for Production
```bash
npm run build
npm start
```

## Project Structure

```
jivverr/
├── components/          # React components
│   ├── Auth.js         # Authentication component
│   ├── Dashboard.js    # Analytics dashboard
│   └── DiagnosisInput.js # Medical input form
├── firebase/
│   └── config.js       # Firebase configuration
├── pages/              # Next.js pages
│   ├── _app.js         # App wrapper
│   └── index.js        # Main page
├── styles/
│   └── globals.css     # Global styles with Tailwind
├── package.json        # Dependencies
├── tailwind.config.js  # Tailwind configuration
├── next.config.js      # Next.js configuration
└── vercel.json         # Vercel deployment config
```

## Key Technologies

- **Next.js 14** - React framework
- **Firebase** - Authentication and backend
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Firebase Hooks** - Firebase integration

## Features in Detail

### Authentication
- Email/password sign up and sign in
- Secure user sessions
- Protected routes

### Diagnosis Input
- Symptom description input
- Medical diagnosis entry
- AI-powered explanation generation
- Severity assessment

### Dashboard
- Analysis history tracking
- Statistics and metrics
- Recent analyses display
- User-specific data storage

## Deployment

### Vercel Deployment with Custom Domain
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables for Firebase config
4. Configure custom domain `jivverr.com` in Vercel dashboard
5. Deploy automatically on push to main branch

The app will be available at:
- **Primary Domain**: https://jivverr.com
- **WWW Subdomain**: https://www.jivverr.com
- **Vercel URL**: Your default Vercel URL (fallback)

### Domain Configuration
The app is configured to work with the `jivverr.com` domain. Make sure to:
1. Add the domain in your Vercel project settings
2. Configure DNS records as instructed by Vercel
3. Enable HTTPS (automatic with Vercel)

### Manual Vercel Deployment
```bash
npm install -g vercel
vercel
```

## Environment Variables

Create a `.env.local` file for local development:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## Security Notes

- All medical data is stored locally in the browser
- Firebase authentication ensures secure user management
- No sensitive data is transmitted to external services
- Always consult healthcare professionals for medical advice

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This tool provides simplified explanations and is not a substitute for professional medical advice. Always consult with healthcare professionals for proper diagnosis and treatment.
# Updated Sat Jul 26 00:38:41 CST 2025
