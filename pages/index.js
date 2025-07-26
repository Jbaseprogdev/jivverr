import { useState, useEffect } from 'react';
import { Stethoscope, Shield, Brain, Heart, Activity } from 'lucide-react';

// Dynamic imports to avoid SSR issues
let useAuthState = null;
let getAuth = null;
let Auth = null;
let DiagnosisInput = null;
let Dashboard = null;
let Layout = null;

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
        const { useAuthState: authHook } = await import('react-firebase-hooks/auth');
        const { getAuth: getAuthFn } = await import('firebase/auth');
        const AuthComponent = (await import('../components/Auth')).default;
        const DiagnosisInputComponent = (await import('../components/DiagnosisInput')).default;
        const DashboardComponent = (await import('../components/Dashboard')).default;
        const LayoutComponent = (await import('../components/Layout')).default;

        useAuthState = authHook;
        getAuth = getAuthFn;
        Auth = AuthComponent;
        DiagnosisInput = DiagnosisInputComponent;
        Dashboard = DashboardComponent;
        Layout = LayoutComponent;

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

    try {
      const auth = getAuth();
      const [user, authLoading] = useAuthState(auth);
      
      setUser(user);
      setLoading(authLoading);
    } catch (error) {
      console.error('Firebase auth error:', error);
      setLoading(false);
    }
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
          <div className="loading-spinner w-8 h-8 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading Jivverr...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show auth page
  if (!user) {
    return Auth ? <Auth user={user} setUser={setUser} /> : null;
  }

  // If user is authenticated, show main app with layout
  return Layout ? (
    <Layout user={user} setUser={setUser} currentPage={activeTab}>
      {activeTab === 'dashboard' && Dashboard && (
        <Dashboard analyses={analyses} />
      )}
      
      {activeTab === 'analysis' && DiagnosisInput && (
        <DiagnosisInput onAnalysisComplete={handleAnalysisComplete} />
      )}
      
      {activeTab === 'history' && (
        <div className="space-y-6">
          <div className="card-elevated">
            <div className="flex items-center gap-3 mb-6">
              <Activity className="w-6 h-6 text-primary-600" />
              <h2 className="text-xl font-semibold text-gray-900">Analysis History</h2>
            </div>
            
            {analyses.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No history yet</h3>
                <p className="text-gray-600 mb-6">Your medical analyses will appear here</p>
                <button 
                  onClick={() => setActiveTab('analysis')}
                  className="btn-primary"
                >
                  Start First Analysis
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {analyses.map((analysis, index) => (
                  <div key={index} className="analysis-result p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {analysis.severity === 'moderate' ? (
                          <div className="w-3 h-3 bg-warning-500 rounded-full"></div>
                        ) : (
                          <div className="w-3 h-3 bg-success-500 rounded-full"></div>
                        )}
                        <div>
                          <span className={`status-badge ${
                            analysis.severity === 'moderate' ? 'status-warning' : 'status-success'
                          }`}>
                            {analysis.severity.charAt(0).toUpperCase() + analysis.severity.slice(1)}
                          </span>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(analysis.timestamp).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Symptoms</p>
                        <p className="text-sm text-gray-600">{analysis.symptoms}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">Diagnosis</p>
                        <p className="text-sm text-gray-600">{analysis.diagnosis}</p>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-sm font-medium text-gray-700 mb-1">AI Explanation</p>
                      <p className="text-sm text-gray-600">{analysis.explanation}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <div className="card-elevated">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-primary-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="form-label">Email</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="input-field bg-gray-50"
                />
              </div>
              
              <div>
                <label className="form-label">Member Since</label>
                <input
                  type="text"
                  value={user.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A'}
                  disabled
                  className="input-field bg-gray-50"
                />
              </div>
              
              <div>
                <label className="form-label">Total Analyses</label>
                <input
                  type="text"
                  value={analyses.length}
                  disabled
                  className="input-field bg-gray-50"
                />
              </div>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="card-elevated">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-6 h-6 text-primary-600" />
              <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-success-50 rounded-xl">
                <div>
                  <p className="font-medium text-success-700">Data Privacy</p>
                  <p className="text-sm text-success-600">Your data is encrypted and secure</p>
                </div>
                <div className="w-3 h-3 bg-success-500 rounded-full"></div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-primary-50 rounded-xl">
                <div>
                  <p className="font-medium text-primary-700">AI Processing</p>
                  <p className="text-sm text-primary-600">Advanced AI for accurate explanations</p>
                </div>
                <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  ) : null;
}