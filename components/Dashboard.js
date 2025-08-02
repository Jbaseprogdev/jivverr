import { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Clock, 
  Target, 
  Award,
  Plus,
  Search,
  Filter,
  Calendar,
  BarChart3,
  PieChart,
  Users,
  Shield,
  Heart,
  Brain,
  Zap
} from 'lucide-react';

export default function Dashboard({ user }) {
  const [recentAnalyses, setRecentAnalyses] = useState([
    {
      id: 1,
      symptoms: ['Headache', 'Fever', 'Fatigue'],
      diagnosis: 'Common Cold',
      confidence: 94,
      date: '2024-01-26',
      severity: 'low'
    },
    {
      id: 2,
      symptoms: ['Chest Pain', 'Shortness of Breath'],
      diagnosis: 'Anxiety',
      confidence: 87,
      date: '2024-01-25',
      severity: 'medium'
    },
    {
      id: 3,
      symptoms: ['Joint Pain', 'Stiffness'],
      diagnosis: 'Arthritis',
      confidence: 92,
      date: '2024-01-24',
      severity: 'high'
    }
  ]);

  const [stats, setStats] = useState({
    totalAnalyses: 47,
    accuracy: 94.2,
    avgResponseTime: 2.3,
    healthScore: 87
  });

  const [insights, setInsights] = useState([
    {
      id: 1,
      type: 'trend',
      title: 'Health Trend Improving',
      description: 'Your overall health score has increased by 12% this month',
      icon: TrendingUp,
      color: 'success'
    },
    {
      id: 2,
      type: 'recommendation',
      title: 'Stay Hydrated',
      description: 'Based on your symptoms, consider increasing water intake',
      icon: Heart,
      color: 'primary'
    },
    {
      id: 3,
      type: 'alert',
      title: 'Follow-up Recommended',
      description: 'Schedule a follow-up for your recent chest pain analysis',
      icon: Shield,
      color: 'warning'
    }
  ]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'low': return 'success';
      case 'medium': return 'warning';
      case 'high': return 'danger';
      default: return 'neutral';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'low': return '🟢';
      case 'medium': return '🟡';
      case 'high': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="card-medical">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">
              Welcome back, {user?.displayName || 'User'}! 👋
            </h1>
            <p className="text-neutral-600">
              Here's your health overview for today
            </p>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <div className="health-indicator good"></div>
            <span className="text-sm font-semibold text-success-600">Good Health</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="data-grid">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-medical rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div className="stat-trend positive">
              <TrendingUp className="w-4 h-4" />
              <span>+12%</span>
            </div>
          </div>
          <div className="stat-number">{stats.totalAnalyses}</div>
          <div className="stat-label">Total Analyses</div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-success rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div className="stat-trend positive">
              <TrendingUp className="w-4 h-4" />
              <span>+2.1%</span>
            </div>
          </div>
          <div className="stat-number">{stats.accuracy}%</div>
          <div className="stat-label">Accuracy Rate</div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-warning rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="stat-trend negative">
              <TrendingDown className="w-4 h-4" />
              <span>-0.3s</span>
            </div>
          </div>
          <div className="stat-number">{stats.avgResponseTime}s</div>
          <div className="stat-label">Avg Response Time</div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-danger rounded-xl flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div className="stat-trend positive">
              <TrendingUp className="w-4 h-4" />
              <span>+5%</span>
            </div>
          </div>
          <div className="stat-number">{stats.healthScore}</div>
          <div className="stat-label">Health Score</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card-elevated">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="btn-primary flex items-center justify-center gap-3 py-4">
            <Plus className="w-5 h-5" />
            New Analysis
          </button>
          <button className="btn-secondary flex items-center justify-center gap-3 py-4">
            <Search className="w-5 h-5" />
            Search History
          </button>
          <button className="btn-ghost flex items-center justify-center gap-3 py-4 border-2 border-dashed border-neutral-300 hover:border-primary-300">
            <Calendar className="w-5 h-5" />
            Schedule Checkup
          </button>
        </div>
      </div>

      {/* Health Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-elevated">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-900">Health Insights</h2>
            <button className="btn-icon">
              <Filter className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {insights.map((insight) => {
              const Icon = insight.icon;
              return (
                <div key={insight.id} className="flex items-start gap-3 p-4 bg-neutral-50 rounded-xl">
                  <div className={`w-10 h-10 bg-${insight.color}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 text-${insight.color}-600`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-neutral-900 mb-1">{insight.title}</h3>
                    <p className="text-sm text-neutral-600">{insight.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Analyses */}
        <div className="card-elevated">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-900">Recent Analyses</h2>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentAnalyses.map((analysis) => (
              <div key={analysis.id} className="p-4 bg-neutral-50 rounded-xl">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getSeverityIcon(analysis.severity)}</span>
                    <h3 className="font-semibold text-neutral-900">{analysis.diagnosis}</h3>
                  </div>
                  <span className={`status-${getSeverityColor(analysis.severity)}`}>
                    {analysis.confidence}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-neutral-600">
                  <div className="flex flex-wrap gap-1">
                    {analysis.symptoms.map((symptom, index) => (
                      <span key={index} className="symptom-tag text-xs">
                        {symptom}
                      </span>
                    ))}
                  </div>
                  <span>{analysis.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Health Analytics */}
      <div className="card-elevated">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-neutral-900">Health Analytics</h2>
          <div className="flex items-center gap-2">
            <button className="btn-icon">
              <BarChart3 className="w-4 h-4" />
            </button>
            <button className="btn-icon">
              <PieChart className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Symptom Frequency */}
          <div className="space-y-3">
            <h3 className="font-semibold text-neutral-900">Most Common Symptoms</h3>
            <div className="space-y-2">
              {[
                { symptom: 'Headache', frequency: 8, percentage: 75 },
                { symptom: 'Fatigue', frequency: 6, percentage: 60 },
                { symptom: 'Fever', frequency: 4, percentage: 40 }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">{item.symptom}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-neutral-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-medical rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-semibold text-neutral-700">{item.frequency}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Health Score Trend */}
          <div className="space-y-3">
            <h3 className="font-semibold text-neutral-900">Health Score Trend</h3>
            <div className="h-32 flex items-end justify-between gap-1">
              {[65, 72, 68, 75, 82, 79, 87].map((score, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-gradient-medical rounded-t"
                    style={{ height: `${(score / 100) * 100}%` }}
                  ></div>
                  <span className="text-xs text-neutral-500 mt-1">{score}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-neutral-500 text-center">Last 7 days</p>
          </div>

          {/* AI Performance */}
          <div className="space-y-3">
            <h3 className="font-semibold text-neutral-900">AI Performance</h3>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600 mb-1">94.2%</div>
                <div className="text-sm text-neutral-600">Overall Accuracy</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">Response Time</span>
                  <span className="font-semibold">2.3s avg</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">Confidence</span>
                  <span className="font-semibold">87% avg</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-600">Uptime</span>
                  <span className="font-semibold text-success-600">99.9%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Assistant Status */}
      <div className="card-medical">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-medical rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">AI Assistant Status</h3>
              <p className="text-sm text-neutral-600">Ready to help with your health questions</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="health-indicator good"></div>
            <span className="text-sm font-semibold text-success-600">Online</span>
          </div>
        </div>
      </div>
    </div>
  );
} 