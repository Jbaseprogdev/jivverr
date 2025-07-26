import { useState, useEffect } from 'react';
import { Stethoscope, Shield, Brain } from 'lucide-react';

// Dynamic imports to avoid SSR issues
let useAuthState = null;
let getAuth = null;
let Auth = null;
let DiagnosisInput = null;
let Dashboard = null;

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

        useAuthState = authHook;
        getAuth = getAuthFn;
        Auth = AuthComponent;
        DiagnosisInput = DiagnosisInputComponent;
        Dashboard = DashboardComponent;

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
  };

  // Show loading state during SSR or while loading
  if (!isClient || loading || !componentsLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Stethoscope className="w-8 h-8 text-primary-600" />
              <h1 className="text-xl font-bold text-gray-900">Jivverr</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="w-4 h-4" />
                <span>Secure & Private</span>
              </div>
              {Auth && <Auth user={user} setUser={setUser} />}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!user ? (
          <div className="text-center py-12">
            <Brain className="w-16 h-16 text-primary-600 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to Jivverr
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Get simplified explanations of medical diagnoses and symptoms. 
              Our AI-powered tool helps you understand complex medical terms in plain language.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="card text-center">
                <Shield className="w-8 h-8 text-primary-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Secure & Private</h3>
                <p className="text-sm text-gray-600">Your medical information is kept secure and private</p>
              </div>
              <div className="card text-center">
                <Brain className="w-8 h-8 text-primary-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">AI-Powered</h3>
                <p className="text-sm text-gray-600">Advanced AI provides clear, understandable explanations</p>
              </div>
              <div className="card text-center">
                <Stethoscope className="w-8 h-8 text-primary-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Medical Focus</h3>
                <p className="text-sm text-gray-600">Specialized in medical terminology and conditions</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Navigation Tabs */}
            <div className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'dashboard'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('analysis')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'analysis'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                New Analysis
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'dashboard' && Dashboard && (
              <Dashboard analyses={analyses} />
            )}
            
            {activeTab === 'analysis' && DiagnosisInput && (
              <div className="max-w-2xl mx-auto">
                <DiagnosisInput onAnalysisComplete={handleAnalysisComplete} />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-gray-600">
            <p className="mb-2">
              <strong>Disclaimer:</strong> This tool provides simplified explanations and is not a substitute for professional medical advice.
            </p>
            <p>Always consult with healthcare professionals for proper diagnosis and treatment.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}