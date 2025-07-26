import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth } from 'firebase/auth';
import { Stethoscope, Shield, Brain } from 'lucide-react';
import Auth from '../components/Auth';
import DiagnosisInput from '../components/DiagnosisInput';
import Dashboard from '../components/Dashboard';

export default function Home() {
  const auth = getAuth();
  const [user, loading] = useAuthState(auth);
  const [analyses, setAnalyses] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Load analyses from localStorage
  useEffect(() => {
    if (user) {
      const savedAnalyses = localStorage.getItem(`analyses_${user.uid}`);
      if (savedAnalyses) {
        setAnalyses(JSON.parse(savedAnalyses));
      }
    }
  }, [user]);

  // Save analyses to localStorage
  useEffect(() => {
    if (user && analyses.length > 0) {
      localStorage.setItem(`analyses_${user.uid}`, JSON.stringify(analyses));
    }
  }, [analyses, user]);

  const handleAnalysisComplete = (analysis) => {
    setAnalyses(prev => [analysis, ...prev]);
  };

  if (loading) {
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
              <h1 className="text-xl font-bold text-gray-900">Medalyzer Web</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="w-4 h-4" />
                <span>Secure & Private</span>
              </div>
              <Auth user={user} setUser={() => {}} />
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
              Welcome to Medalyzer Web
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
            {activeTab === 'dashboard' && (
              <Dashboard analyses={analyses} />
            )}
            
            {activeTab === 'analysis' && (
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