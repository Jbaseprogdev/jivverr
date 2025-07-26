import { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  Home, 
  Stethoscope, 
  History, 
  User, 
  Settings, 
  LogOut, 
  Bell,
  Search,
  ChevronDown,
  Heart,
  Shield,
  Activity
} from 'lucide-react';
import { getAuth, signOut } from 'firebase/auth';
import { getFirebaseApp } from '../firebase/init';

export default function Layout({ children, user, setUser, activeTab, setActiveTab }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const navigation = [
    { name: 'Dashboard', icon: Home, tab: 'dashboard' },
    { name: 'New Analysis', icon: Stethoscope, tab: 'diagnosis' },
    { name: 'History', icon: History, tab: 'history' },
    { name: 'Profile', icon: User, tab: 'profile' },
    { name: 'Settings', icon: Settings, tab: 'settings' },
  ];

  const handleSignOut = async () => {
    try {
      const app = await getFirebaseApp();
      const auth = getAuth(app);
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getUserInitials = (user) => {
    if (user?.displayName) {
      return user.displayName.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    if (user?.phoneNumber) {
      return 'P';
    }
    return 'U';
  };

  const getUserDisplayName = (user) => {
    return user?.displayName || user?.email || user?.phoneNumber || 'User';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-blue-50 to-indigo-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-neutral-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex h-full flex-col medical-sidebar">
          {/* Logo */}
          <div className="flex items-center gap-3 p-6 border-b border-neutral-200">
            <div className="w-10 h-10 bg-gradient-medical rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-neutral-900 font-display">Jivverr</h1>
              <p className="text-xs text-neutral-500">AI Medical Assistant</p>
            </div>
          </div>

          {/* User Profile */}
          <div className="p-6 border-b border-neutral-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-medical rounded-full flex items-center justify-center text-white font-semibold text-lg">
                {getUserInitials(user)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-neutral-900 truncate">
                  {getUserDisplayName(user)}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="health-indicator good"></div>
                  <p className="text-xs text-neutral-500">Active</p>
                  {/* Removed firebaseAuthService.isEmailVerified() */}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.tab;
              
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    setActiveTab(item.tab);
                    setSidebarOpen(false);
                  }}
                  className={`nav-link w-full justify-start ${
                    isActive ? 'active' : ''
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-primary-500 rounded-full"></div>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Stats */}
          <div className="p-4 border-t border-neutral-200">
            <div className="card-medical">
              <div className="flex items-center gap-3 mb-3">
                <Activity className="w-4 h-4 text-primary-600" />
                <h3 className="text-sm font-semibold text-neutral-900">Today's Activity</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-600">Analyses</span>
                  <span className="font-semibold text-neutral-900">3</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-600">Accuracy</span>
                  <span className="font-semibold text-success-600">94%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sign Out */}
          <div className="p-4 border-t border-neutral-200">
            <button
              onClick={handleSignOut}
              className="nav-link w-full justify-start text-danger-600 hover:text-danger-700 hover:bg-danger-50"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-80">
        {/* Header */}
        <header className="glass-card border-b border-neutral-200 sticky top-0 z-30">
          <div className="flex items-center justify-between p-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden btn-icon"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Search */}
            <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search analyses, symptoms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <button className="btn-icon relative">
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-danger-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* User Menu */}
              <div className="relative">
                <button className="flex items-center gap-2 p-2 rounded-xl hover:bg-neutral-100 transition-colors duration-200">
                  <div className="w-8 h-8 bg-gradient-medical rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    {getUserInitials(user)}
                  </div>
                  <ChevronDown className="w-4 h-4 text-neutral-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Breadcrumb */}
          <div className="px-4 pb-4">
            <div className="breadcrumb">
              <span className="breadcrumb-item">Jivverr</span>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-item capitalize">{activeTab}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <div className="container-responsive">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Search (when needed) */}
      {sidebarOpen && (
        <div className="fixed top-0 left-0 right-0 z-50 p-4 bg-white border-b border-neutral-200 lg:hidden">
          <div className="relative">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search analyses, symptoms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
      )}
    </div>
  );
} 