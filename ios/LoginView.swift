import SwiftUI
import FirebaseAuth

struct LoginView: View {
    @EnvironmentObject var authState: AuthStateManager
    @State private var email = ""
    @State private var password = ""
    @State private var confirmPassword = ""
    @State private var errorMessage = ""
    @State private var successMessage = ""
    @State private var isLoading = false
    @State private var isSignUp = false
    @State private var showForgotPassword = false
    
    var body: some View {
        NavigationView {
            VStack(spacing: 24) {
                // Header
                VStack(spacing: 8) {
                    Image(systemName: "stethoscope")
                        .font(.system(size: 60))
                        .foregroundColor(.blue)
                    
                    Text("Jivverr")
                        .font(.largeTitle)
                        .fontWeight(.bold)
                    
                    Text("Medical Diagnosis Simplified")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                }
                .padding(.top, 40)
                
                // Form
                VStack(spacing: 16) {
                    // Email Field
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Email")
                            .font(.headline)
                            .foregroundColor(.primary)
                        
                        TextField("Enter your email", text: $email)
                            .textFieldStyle(RoundedBorderTextFieldStyle())
                            .textInputAutocapitalization(.never)
                            .keyboardType(.emailAddress)
                            .autocorrectionDisabled()
                    }
                    
                    // Password Field
                    VStack(alignment: .leading, spacing: 8) {
                        Text("Password")
                            .font(.headline)
                            .foregroundColor(.primary)
                        
                        SecureField("Enter your password", text: $password)
                            .textFieldStyle(RoundedBorderTextFieldStyle())
                    }
                    
                    // Confirm Password Field (only for sign up)
                    if isSignUp {
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Confirm Password")
                                .font(.headline)
                                .foregroundColor(.primary)
                            
                            SecureField("Confirm your password", text: $confirmPassword)
                                .textFieldStyle(RoundedBorderTextFieldStyle())
                        }
                    }
                }
                .padding(.horizontal, 20)
                
                // Error Message
                if !errorMessage.isEmpty {
                    Text(errorMessage)
                        .foregroundColor(.red)
                        .font(.caption)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal, 20)
                }
                
                // Success Message
                if !successMessage.isEmpty {
                    Text(successMessage)
                        .foregroundColor(.green)
                        .font(.caption)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal, 20)
                }
                
                // Action Button
                Button(action: {
                    if isSignUp {
                        createAccount()
                    } else {
                        signInUser()
                    }
                }) {
                    HStack {
                        if isLoading {
                            ProgressView()
                                .progressViewStyle(CircularProgressViewStyle(tint: .white))
                                .scaleEffect(0.8)
                        }
                        
                        Text(isSignUp ? "Create Account" : "Sign In")
                            .font(.headline)
                            .fontWeight(.semibold)
                    }
                    .frame(maxWidth: .infinity)
                    .padding()
                    .background(isFormValid ? Color.blue : Color.gray)
                    .foregroundColor(.white)
                    .cornerRadius(12)
                }
                .disabled(isLoading || !isFormValid)
                .opacity(isFormValid ? 1.0 : 0.6)
                .padding(.horizontal, 20)
                
                // Forgot Password Button (only for sign in)
                if !isSignUp {
                    Button("Forgot Password?") {
                        sendPasswordReset()
                    }
                    .font(.subheadline)
                    .foregroundColor(.blue)
                    .disabled(email.isEmpty || isLoading)
                }
                
                // Toggle Sign In/Sign Up
                Button(action: {
                    withAnimation(.easeInOut(duration: 0.3)) {
                        isSignUp.toggle()
                        errorMessage = ""
                        successMessage = ""
                        confirmPassword = ""
                    }
                }) {
                    Text(isSignUp ? "Already have an account? Sign In" : "Don't have an account? Create One")
                        .foregroundColor(.blue)
                        .font(.subheadline)
                }
                .padding(.top, 8)
                
                Spacer()
                
                // Footer
                VStack(spacing: 8) {
                    Text("Secure & Private")
                        .font(.caption)
                        .foregroundColor(.secondary)
                    
                    Text("Your medical information is kept secure")
                        .font(.caption2)
                        .foregroundColor(.secondary)
                        .multilineTextAlignment(.center)
                }
                .padding(.bottom, 20)
            }
            .navigationBarHidden(true)
        }
        .navigationViewStyle(StackNavigationViewStyle())
    }
    
    // Form validation
    private var isFormValid: Bool {
        let emailValid = !email.isEmpty && email.contains("@")
        let passwordValid = password.count >= 6
        
        if isSignUp {
            let confirmPasswordValid = !confirmPassword.isEmpty && password == confirmPassword
            return emailValid && passwordValid && confirmPasswordValid
        } else {
            return emailValid && passwordValid
        }
    }
    
    // Sign In Function
    private func signInUser() {
        isLoading = true
        errorMessage = ""
        successMessage = ""
        
        Auth.auth().signIn(withEmail: email, password: password) { result, error in
            DispatchQueue.main.async {
                isLoading = false
                
                if let error = error {
                    errorMessage = getErrorMessage(from: error)
                }
                // Success is handled by AuthStateManager
            }
        }
    }
    
    // Create Account Function
    private func createAccount() {
        isLoading = true
        errorMessage = ""
        successMessage = ""
        
        // Validate passwords match
        guard password == confirmPassword else {
            errorMessage = "Passwords do not match"
            isLoading = false
            return
        }
        
        Auth.auth().createUser(withEmail: email, password: password) { result, error in
            DispatchQueue.main.async {
                isLoading = false
                
                if let error = error {
                    errorMessage = getErrorMessage(from: error)
                }
                // Success is handled by AuthStateManager
            }
        }
    }
    
    // Send Password Reset Function
    private func sendPasswordReset() {
        guard !email.isEmpty else {
            errorMessage = "Please enter your email address"
            return
        }
        
        isLoading = true
        errorMessage = ""
        successMessage = ""
        
        Auth.auth().sendPasswordReset(withEmail: email) { error in
            DispatchQueue.main.async {
                isLoading = false
                
                if let error = error {
                    errorMessage = getPasswordResetErrorMessage(from: error)
                } else {
                    successMessage = "Password reset email sent. Please check your inbox."
                    // Clear email field after successful reset
                    email = ""
                }
            }
        }
    }
    
    // Error message helper
    private func getErrorMessage(from error: Error) -> String {
        let nsError = error as NSError
        
        switch nsError.code {
        case AuthErrorCode.wrongPassword.rawValue:
            return "Incorrect password. Please try again."
        case AuthErrorCode.invalidEmail.rawValue:
            return "Invalid email address. Please check your email."
        case AuthErrorCode.userNotFound.rawValue:
            return "No account found with this email address."
        case AuthErrorCode.emailAlreadyInUse.rawValue:
            return "An account with this email already exists."
        case AuthErrorCode.weakPassword.rawValue:
            return "Password is too weak. Please choose a stronger password."
        case AuthErrorCode.networkError.rawValue:
            return "Network error. Please check your connection."
        default:
            return error.localizedDescription
        }
    }
    
    // Password reset error message helper
    private func getPasswordResetErrorMessage(from error: Error) -> String {
        let nsError = error as NSError
        
        switch nsError.code {
        case AuthErrorCode.userNotFound.rawValue:
            return "No account found with this email address."
        case AuthErrorCode.invalidEmail.rawValue:
            return "Invalid email address. Please check your email."
        case AuthErrorCode.tooManyRequests.rawValue:
            return "Too many password reset attempts. Please try again later."
        default:
            return "Failed to send reset email. Please try again."
        }
    }
}

// Preview
struct LoginView_Previews: PreviewProvider {
    static var previews: some View {
        LoginView()
            .environmentObject(AuthStateManager())
    }
} 