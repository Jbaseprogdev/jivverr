import SwiftUI
import Firebase
import FirebaseAuth

@main
struct JivverrApp: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) var delegate
    @StateObject private var authState = AuthStateManager()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(authState)
        }
    }
}

// Content View to handle authentication state
struct ContentView: View {
    @EnvironmentObject var authState: AuthStateManager
    
    var body: some View {
        Group {
            if authState.isAuthenticated {
                DashboardView()
            } else {
                LoginView()
            }
        }
        .onAppear {
            authState.checkAuthState()
        }
    }
}

// App Delegate for Firebase initialization
import Firebase

class AppDelegate: NSObject, UIApplicationDelegate {
    func application(_ application: UIApplication,
                     didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil) -> Bool {
        FirebaseApp.configure()
        return true
    }
}

// Authentication State Manager
class AuthStateManager: ObservableObject {
    @Published var isAuthenticated = false
    @Published var isLoading = true
    
    private var authStateHandle: AuthStateDidChangeListenerHandle?
    
    init() {
        setupAuthStateListener()
    }
    
    deinit {
        if let handle = authStateHandle {
            Auth.auth().removeStateDidChangeListener(handle)
        }
    }
    
    private func setupAuthStateListener() {
        authStateHandle = Auth.auth().addStateDidChangeListener { [weak self] _, user in
            DispatchQueue.main.async {
                self?.isAuthenticated = user != nil
                self?.isLoading = false
            }
        }
    }
    
    func checkAuthState() {
        isLoading = true
        // The auth state listener will handle the rest
    }
    
    func signOut() {
        do {
            try Auth.auth().signOut()
        } catch {
            print("Error signing out: \(error)")
        }
    }
}

// Preview
struct JivverrApp_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
            .environmentObject(AuthStateManager())
    }
} 