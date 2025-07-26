# Medalyzer iOS App

A native iOS application for medical diagnosis explanations, built with SwiftUI and Firebase.

## Features

- 🔐 **Firebase Authentication** - Secure sign up and sign in
- 📝 **Medical Analysis Input** - Symptom and diagnosis entry
- 🤖 **AI-Powered Explanations** - Simplified medical terminology
- 📊 **Analytics Dashboard** - Statistics and insights
- 📱 **Native iOS Experience** - Optimized for iPhone and iPad
- 🔒 **Secure & Private** - Local data storage with Firebase sync

## Prerequisites

- Xcode 14.0 or later
- iOS 15.0 or later
- Firebase project with Authentication enabled
- Apple Developer Account (for App Store distribution)

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/Jbaseprogdev/medalyzer-vercel.git
cd medalyzer-vercel/ios
```

### 2. Firebase Configuration

1. **Create Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or select existing one
   - Enable Authentication (Email/Password)

2. **Add iOS App**:
   - In Firebase Console, click "Add app" → iOS
   - Enter your Bundle ID (e.g., `com.yourcompany.medalyzer`)
   - Download `GoogleService-Info.plist`

3. **Configure Firebase**:
   - Add `GoogleService-Info.plist` to your Xcode project
   - Ensure it's included in your target

### 3. Install Dependencies

The app uses Swift Package Manager for dependencies. Add these in Xcode:

1. **Firebase iOS SDK**:
   - URL: `https://github.com/firebase/firebase-ios-sdk`
   - Dependencies: FirebaseAuth, FirebaseFirestore

2. **Additional Dependencies** (if needed):
   - Add any other packages you need for your specific features

### 4. Build and Run

1. Open `Medalyzer.xcodeproj` in Xcode
2. Select your target device or simulator
3. Press `Cmd + R` to build and run

## Project Structure

```
ios/
├── Medalyzer/
│   ├── Views/
│   │   ├── LoginView.swift          # Authentication UI
│   │   ├── DashboardView.swift      # Main dashboard
│   │   ├── DiagnosisInputView.swift # Medical input form
│   │   └── ExplanationView.swift    # Analysis results
│   ├── Models/
│   │   └── MedicalAnalysis.swift    # Data models
│   ├── Services/
│   │   └── FirebaseService.swift    # Firebase integration
│   ├── Utils/
│   │   └── Extensions.swift         # Swift extensions
│   └── Resources/
│       ├── Assets.xcassets          # App icons and images
│       └── GoogleService-Info.plist # Firebase config
├── Medalyzer.xcodeproj              # Xcode project file
└── README.md                        # This file
```

## Key Components

### Authentication (`LoginView.swift`)
- Email/password sign up and sign in
- Form validation and error handling
- Loading states and user feedback
- Secure Firebase authentication

### Dashboard (`DashboardView.swift`)
- Tab-based navigation
- Statistics cards with analytics
- Recent analyses display
- History view with all past analyses

### Medical Input (`DiagnosisInputView.swift`)
- Symptom description input
- Medical diagnosis entry
- AI-powered explanation generation
- Results display with severity assessment

### Data Models (`MedicalAnalysis.swift`)
```swift
struct MedicalAnalysis: Identifiable {
    let id = UUID()
    let symptoms: String
    let diagnosis: String
    let explanation: String
    let timestamp: Date
    let severity: String
}
```

## Firebase Integration

### Authentication
- Email/password authentication
- User session management
- Secure sign out functionality

### Data Storage
- Local storage with UserDefaults
- Firebase Firestore for cloud sync (optional)
- Offline-first approach for privacy

## UI/UX Features

### Design System
- **Colors**: Blue primary theme with semantic colors
- **Typography**: System fonts with proper hierarchy
- **Icons**: SF Symbols for consistency
- **Layout**: Responsive design for all screen sizes

### User Experience
- **Loading States**: Progress indicators for async operations
- **Error Handling**: User-friendly error messages
- **Form Validation**: Real-time input validation
- **Accessibility**: VoiceOver support and dynamic type

## Security & Privacy

### Data Protection
- All medical data stored locally on device
- Optional cloud sync with user consent
- Firebase authentication for secure access
- No sensitive data transmitted without permission

### Privacy Features
- Local-first data storage
- User-controlled data sharing
- Secure authentication
- Medical disclaimer and warnings

## Development Guidelines

### Code Style
- Follow Swift style guidelines
- Use SwiftUI best practices
- Implement MVVM architecture
- Write unit tests for business logic

### Performance
- Lazy loading for large datasets
- Efficient image handling
- Minimal network requests
- Optimized memory usage

## Testing

### Unit Tests
```bash
# Run unit tests
xcodebuild test -scheme Medalyzer -destination 'platform=iOS Simulator,name=iPhone 14'
```

### UI Tests
- Automated UI testing with XCUITest
- Accessibility testing
- Cross-device compatibility

## Deployment

### App Store Distribution
1. **Archive the app** in Xcode
2. **Upload to App Store Connect**
3. **Submit for review**
4. **Release to users**

### TestFlight Distribution
1. **Create TestFlight build**
2. **Invite testers**
3. **Collect feedback**
4. **Iterate and improve**

## Troubleshooting

### Common Issues

1. **Firebase Configuration**:
   - Ensure `GoogleService-Info.plist` is properly added
   - Check Bundle ID matches Firebase project
   - Verify Authentication is enabled

2. **Build Errors**:
   - Clean build folder (`Cmd + Shift + K`)
   - Reset package caches
   - Check iOS deployment target

3. **Authentication Issues**:
   - Verify Firebase project settings
   - Check network connectivity
   - Review error messages in console

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This tool provides simplified explanations and is not a substitute for professional medical advice. Always consult with healthcare professionals for proper diagnosis and treatment.

## Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review Firebase documentation
- Contact the development team

---

**Built with ❤️ using SwiftUI and Firebase** 