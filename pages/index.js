import { useState, useEffect } from 'react';
import { Stethoscope, Shield, Brain, Heart, Activity } from 'lucide-react';

// Dynamic imports to avoid SSR issues
let Auth = null;
let DiagnosisInput = null;
let Dashboard = null;
let Layout = null;
let firebaseAuthService = null;

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyses, setAnalyses] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [componentsLoaded, setComponentsLoaded] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on client side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load components and Firebase on client side only
  useEffect(() => {
    if (!isClient) return;

    const loadComponents = async () => {
      try {
        // Dynamic imports
        const AuthComponent = (await import('../components/Auth')).default;
        const DiagnosisInputComponent = (await import('../components/DiagnosisInput')).default;
        const DashboardComponent = (await import('../components/Dashboard')).default;
        const LayoutComponent = (await import('../components/Layout')).default;
        const FirebaseAuthService = (await import('../firebase/auth')).default;

        Auth = AuthComponent;
        DiagnosisInput = DiagnosisInputComponent;
        Dashboard = DashboardComponent;
        Layout = LayoutComponent;
        firebaseAuthService = FirebaseAuthService;

        setComponentsLoaded(true);
      } catch (error) {
        console.error('Error loading components:', error);
        setLoading(false);
      }
    };

    loadComponents();
  }, [isClient]);

  // Initialize Firebase auth after components are loaded
  useEffect(() => {
    if (!componentsLoaded || !isClient) return;

    const initAuth = async () => {
      try {
        await firebaseAuthService.init();
        
        // Set up auth state listener
        const unsubscribe = firebaseAuthService.onAuthStateChanged((user) => {
          setUser(user);
          setLoading(false);
        });
        
        // Cleanup on unmount
        return unsubscribe;
      } catch (error) {
        console.error('Firebase auth error:', error);
        setLoading(false);
      }
    };

    initAuth();
  }, [componentsLoaded, isClient]);

  // Load analyses from localStorage
  useEffect(() => {
    if (user && isClient) {
      const savedAnalyses = localStorage.getItem(`analyses_${user.uid}`);
      if (savedAnalyses) {
        setAnalyses(JSON.parse(savedAnalyses));
      }
    }
  }, [user, isClient]);

  // Save analyses to localStorage
  useEffect(() => {
    if (user && analyses.length > 0 && isClient) {
      localStorage.setItem(`analyses_${user.uid}`, JSON.stringify(analyses));
    }
  }, [analyses, user, isClient]);

  const handleAnalysisComplete = (analysis) => {
    setAnalyses(prev => [analysis, ...prev]);
    setActiveTab('dashboard'); // Switch to dashboard after analysis
  };

  // Show loading state during SSR or while loading
  if (!isClient || loading || !componentsLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-blue-600 rounded-2xl mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Jivverr</h1>
          <p className="text-neutral-600 mb-6">Loading your medical assistant...</p>
          <div className="loading-dots">
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>
    );
  }

  // Render the app
  return (
    <div className="min-h-screen">
      {!user ? (
        <Auth user={user} setUser={setUser} />
      ) : (
        <Layout user={user} setUser={setUser} activeTab={activeTab} setActiveTab={setActiveTab}>
          {activeTab === 'dashboard' && <Dashboard user={user} analyses={analyses} />}
          {activeTab === 'diagnosis' && <DiagnosisInput onComplete={handleAnalysisComplete} />}
          {activeTab === 'history' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-neutral-900">Analysis History</h1>
              </div>
              {analyses.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">
                    <Stethoscope className="w-8 h-8 text-neutral-400" />
                  </div>
                  <h3 className="empty-state-title">No analyses yet</h3>
                  <p className="empty-state-description">
                    Start your first medical analysis to see your history here
                  </p>
                  <button
                    onClick={() => setActiveTab('diagnosis')}
                    className="btn-primary"
                  >
                    Start First Analysis
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {analyses.map((analysis, index) => (
                    <div key={index} className="analysis-result">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                            <Stethoscope className="w-5 h-5 text-primary-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-neutral-900">{analysis.diagnosis}</h3>
                            <p className="text-sm text-neutral-600">
                              {new Date(analysis.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <span className={`status-${analysis.severity === 'moderate' ? 'warning' : 'success'}`}>
                          {analysis.severity}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-neutral-700 mb-1">Symptoms</p>
                          <p className="text-sm text-neutral-600">{analysis.symptoms}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-neutral-700 mb-1">AI Explanation</p>
                          <p className="text-sm text-neutral-600">{analysis.explanation}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-neutral-900">Profile</h1>
              </div>
              <div className="card-elevated">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-medical rounded-full flex items-center justify-center text-white text-xl font-semibold">
                    {user.displayName ? user.displayName[0].toUpperCase() : user.email[0].toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-neutral-900">
                      {user.displayName || 'User'}
                    </h2>
                    <p className="text-neutral-600">{user.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-3">Account Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-neutral-700">Email</label>
                        <p className="text-sm text-neutral-600">{user.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-neutral-700">Account Created</label>
                        <p className="text-sm text-neutral-600">
                          {user.metadata?.creationTime ? 
                            new Date(user.metadata.creationTime).toLocaleDateString() : 
                            'Unknown'
                          }
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-neutral-700">Last Sign In</label>
                        <p className="text-sm text-neutral-600">
                          {user.metadata?.lastSignInTime ? 
                            new Date(user.metadata.lastSignInTime).toLocaleDateString() : 
                            'Unknown'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-3">Statistics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-neutral-600">Total Analyses</span>
                        <span className="text-sm font-semibold text-neutral-900">{analyses.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-neutral-600">This Month</span>
                        <span className="text-sm font-semibold text-neutral-900">
                          {analyses.filter(a => {
                            const date = new Date(a.timestamp);
                            const now = new Date();
                            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                          }).length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-neutral-900">Settings</h1>
              </div>
              <div className="card-elevated">
                <h3 className="font-semibold text-neutral-900 mb-4">Application Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-neutral-900">Notifications</h4>
                      <p className="text-sm text-neutral-600">Receive health reminders and updates</p>
                    </div>
                    <button className="btn-secondary">Enable</button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-neutral-900">Data Privacy</h4>
                      <p className="text-sm text-neutral-600">Manage your health data privacy</p>
                    </div>
                    <button className="btn-secondary">Configure</button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-neutral-900">Export Data</h4>
                      <p className="text-sm text-neutral-600">Download your health analysis history</p>
                    </div>
                    <button className="btn-secondary">Export</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Layout>
      )}
    </div>
  );
}