import { useState } from 'react';
import { 
  Menu, 
  X, 
  Home, 
  FileText, 
  BarChart3, 
  User, 
  Settings, 
  LogOut,
  Heart,
  Activity,
  Shield,
  Bell
} from 'lucide-react';

export default function Layout({ children, user, setUser, currentPage = 'dashboard' }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home, current: currentPage === 'dashboard' },
    { name: 'New Analysis', href: '/analysis', icon: FileText, current: currentPage === 'analysis' },
    { name: 'History', href: '/history', icon: BarChart3, current: currentPage === 'history' },
    { name: 'Profile', href: '/profile', icon: User, current: currentPage === 'profile' },
    { name: 'Settings', href: '/settings', icon: Settings, current: currentPage === 'settings' },
  ];

  const handleSignOut = async () => {
    try {
      const { getAuth, signOut } = await import('firebase/auth');
      const { app } = await import('../firebase/init');
      const auth = getAuth(app);
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 font-display">Jivverr</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <nav className="mt-6 px-4 space-y-2">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={`nav-link ${item.current ? 'active' : ''}`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </a>
          ))}
        </nav>

        {/* User section */}
        {user && (
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-primary-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.email}
                </p>
                <p className="text-xs text-gray-500">Patient</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full nav-link text-danger-600 hover:text-danger-700 hover:bg-danger-50"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="bg-white shadow-soft border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu className="w-5 h-5 text-gray-500" />
              </button>
              <h2 className="text-lg font-semibold text-gray-900">
                {navigation.find(item => item.current)?.name || 'Dashboard'}
              </h2>
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="p-2 rounded-lg hover:bg-gray-100 relative">
                <Bell className="w-5 h-5 text-gray-500" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full"></span>
              </button>

              {/* Health status indicator */}
              <div className="flex items-center gap-2 px-3 py-1 bg-success-50 rounded-full">
                <Activity className="w-4 h-4 text-success-600" />
                <span className="text-sm font-medium text-success-700">Healthy</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="container-responsive">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 