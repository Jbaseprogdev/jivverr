import { useState, useEffect } from 'react';
import { BarChart3, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

export default function Dashboard({ analyses = [] }) {
  const [stats, setStats] = useState({
    total: 0,
    recent: 0,
    moderate: 0,
    mild: 0
  });

  useEffect(() => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const recent = analyses.filter(analysis => 
      new Date(analysis.timestamp) > oneWeekAgo
    ).length;
    
    const moderate = analyses.filter(analysis => 
      analysis.severity === 'moderate'
    ).length;
    
    const mild = analyses.filter(analysis => 
      analysis.severity === 'mild'
    ).length;

    setStats({
      total: analyses.length,
      recent,
      moderate,
      mild
    });
  }, [analyses]);

  const getSeverityIcon = (severity) => {
    return severity === 'moderate' ? 
      <AlertTriangle className="w-4 h-4 text-yellow-500" /> : 
      <CheckCircle className="w-4 h-4 text-green-500" />;
  };

  const getSeverityColor = (severity) => {
    return severity === 'moderate' ? 'text-yellow-600' : 'text-green-600';
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-primary-600" />
            <div>
              <p className="text-sm text-gray-600">Total Analyses</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">This Week</p>
              <p className="text-2xl font-bold">{stats.recent}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
            <div>
              <p className="text-sm text-gray-600">Moderate</p>
              <p className="text-2xl font-bold">{stats.moderate}</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Mild</p>
              <p className="text-2xl font-bold">{stats.mild}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Analyses */}
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">Recent Analyses</h3>
        
        {analyses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No analyses yet. Start by adding your first medical analysis.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {analyses.slice(0, 5).map((analysis, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getSeverityIcon(analysis.severity)}
                    <span className={`text-sm font-medium ${getSeverityColor(analysis.severity)}`}>
                      {analysis.severity.charAt(0).toUpperCase() + analysis.severity.slice(1)}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(analysis.timestamp).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="mb-2">
                  <p className="text-sm font-medium text-gray-700">Symptoms:</p>
                  <p className="text-sm text-gray-600">{analysis.symptoms}</p>
                </div>
                
                <div className="mb-2">
                  <p className="text-sm font-medium text-gray-700">Diagnosis:</p>
                  <p className="text-sm text-gray-600">{analysis.diagnosis}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700">Explanation:</p>
                  <p className="text-sm text-gray-600 line-clamp-2">{analysis.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 