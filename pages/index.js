import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import SimpleAuth from '../components/SimpleAuth';

// Dynamically import components to avoid SSR issues
const Layout = dynamic(() => import('../components/Layout'), { ssr: false });
const Dashboard = dynamic(() => import('../components/Dashboard'), { ssr: false });
const DiagnosisInput = dynamic(() => import('../components/DiagnosisInput'), { ssr: false });

export default function Home() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [analysisComplete, setAnalysisComplete] = useState(false);

  // Handle analysis completion
  const handleAnalysisComplete = () => {
    setAnalysisComplete(true);
    setActiveTab('dashboard');
  };

  // Switch to dashboard after analysis
  useEffect(() => {
    if (analysisComplete) {
      setAnalysisComplete(false);
    }
  }, [analysisComplete]);

  // If no user, show authentication
  if (!user) {
    return <SimpleAuth user={user} setUser={setUser} />;
  }

  // If user is authenticated, show the main app
  return (
    <Layout user={user} activeTab={activeTab} setActiveTab={setActiveTab}>
      {activeTab === 'dashboard' && <Dashboard user={user} />}
      {activeTab === 'diagnosis' && (
        <DiagnosisInput 
          user={user} 
          onComplete={handleAnalysisComplete}
        />
      )}
    </Layout>
  );
}