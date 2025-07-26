import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  Activity,
  Heart,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Users
} from 'lucide-react';

export default function Dashboard({ analyses = [] }) {
  const [stats, setStats] = useState({
    total: 0,
    recent: 0,
    moderate: 0,
    mild: 0,
    trend: 0
  });

  useEffect(() => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    
    const recent = analyses.filter(analysis => 
      new Date(analysis.timestamp) > oneWeekAgo
    ).length;
    
    const previousWeek = analyses.filter(analysis => {
      const date = new Date(analysis.timestamp);
      return date > twoWeeksAgo && date <= oneWeekAgo;
    }).length;
    
    const moderate = analyses.filter(analysis => 
      analysis.severity === 'moderate'
    ).length;
    
    const mild = analyses.filter(analysis => 
      analysis.severity === 'mild'
    ).length;

    const trend = previousWeek > 0 ? ((recent - previousWeek) / previousWeek) * 100 : 0;

    setStats({
      total: analyses.length,
      recent,
      moderate,
      mild,
      trend
    });
  }, [analyses]);

  const getSeverityIcon = (severity) => {
    return severity === 'moderate' ? 
      <AlertTriangle className="w-4 h-4 text-warning-500" /> : 
      <CheckCircle className="w-4 h-4 text-success-500" />;
  };

  const getSeverityColor = (severity) => {
    return severity === 'moderate' ? 'text-warning-600' : 'text-success-600';
  };

  const getSeverityBadge = (severity) => {
    return severity === 'moderate' ? 
      <span className="status-warning">Moderate</span> : 
      <span className="status-success">Mild</span>;
  };

  const StatCard = ({ title, value, icon: Icon, color, trend, subtitle }) => (
    <div className="card-hover">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 bg-${color}-100 rounded-xl flex items-center justify-center`}>
            <Icon className={`w-6 h-6 text-${color}-600`} />
          </div>
          <div>
            <p className="text-sm text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          </div>
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-sm ${trend >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
            {trend >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            <span className="font-medium">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="card-medical">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-display mb-2">Welcome back!</h1>
            <p className="text-gray-600">Here's your health analysis overview</p>
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-success-50 rounded-full">
            <Activity className="w-4 h-4 text-success-600" />
            <span className="text-sm font-medium text-success-700">All systems healthy</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="data-grid">
        <StatCard
          title="Total Analyses"
          value={stats.total}
          icon={FileText}
          color="primary"
          subtitle="All time"
        />
        
        <StatCard
          title="This Week"
          value={stats.recent}
          icon={Clock}
          color="blue"
          trend={stats.trend}
          subtitle="vs last week"
        />
        
        <StatCard
          title="Moderate Cases"
          value={stats.moderate}
          icon={AlertTriangle}
          color="warning"
          subtitle="Require attention"
        />
        
        <StatCard
          title="Mild Cases"
          value={stats.mild}
          icon={CheckCircle}
          color="success"
          subtitle="Under control"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card-hover">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">New Analysis</h3>
              <p className="text-sm text-gray-600">Add symptoms & diagnosis</p>
            </div>
          </div>
        </div>
        
        <div className="card-hover">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-success-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-success-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Schedule Checkup</h3>
              <p className="text-sm text-gray-600">Book appointment</p>
            </div>
          </div>
        </div>
        
        <div className="card-hover">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-warning-100 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-warning-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Share Report</h3>
              <p className="text-sm text-gray-600">With healthcare provider</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Analyses */}
      <div className="card-elevated">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-primary-600" />
            <h3 className="text-xl font-semibold text-gray-900">Recent Analyses</h3>
          </div>
          <button className="btn-ghost text-sm">View All</button>
        </div>
        
        {analyses.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No analyses yet</h3>
            <p className="text-gray-600 mb-6">Start by adding your first medical analysis to get insights</p>
            <button className="btn-primary">Start First Analysis</button>
          </div>
        ) : (
          <div className="space-y-4">
            {analyses.slice(0, 5).map((analysis, index) => (
              <div key={index} className="analysis-result p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getSeverityIcon(analysis.severity)}
                    <div>
                      {getSeverityBadge(analysis.severity)}
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
                  <button className="btn-ghost text-xs">View Details</button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Symptoms</p>
                    <p className="text-sm text-gray-600 line-clamp-2">{analysis.symptoms}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Diagnosis</p>
                    <p className="text-sm text-gray-600">{analysis.diagnosis}</p>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-sm font-medium text-gray-700 mb-1">AI Explanation</p>
                  <p className="text-sm text-gray-600 line-clamp-2">{analysis.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Health Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-5 h-5 text-primary-600" />
            <h3 className="font-semibold text-gray-900">Health Trends</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-success-50 rounded-lg">
              <span className="text-sm font-medium text-success-700">Mild cases trend</span>
              <span className="text-sm text-success-600">+12% this month</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-warning-50 rounded-lg">
              <span className="text-sm font-medium text-warning-700">Moderate cases</span>
              <span className="text-sm text-warning-600">-5% this month</span>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-5 h-5 text-primary-600" />
            <h3 className="font-semibold text-gray-900">Health Score</h3>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-success-400 to-success-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-bold text-white">85</span>
            </div>
            <p className="text-sm text-gray-600">Excellent health status</p>
          </div>
        </div>
      </div>
    </div>
  );
} 