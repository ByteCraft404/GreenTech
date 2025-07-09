import React from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Settings, 
  User, 
  Leaf,
  Menu,
  X,
  Activity,
  BarChart3,
  Power,
  AlertTriangle,
  Sliders,
  Stethoscope,
  Info,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, description: 'Live overview', path: '/dashboard' },
  { id: 'control', label: 'Control Panel', icon: Power, description: 'Device controls', path: '/control' },
  { id: 'history', label: 'Sensor History', icon: TrendingUp, description: 'Historical data', path: '/history' },
  { id: 'alerts', label: 'Alerts', icon: AlertTriangle, description: 'System alerts', path: '/alerts' },
  { id: 'thresholds', label: 'Thresholds', icon: Sliders, description: 'Configure limits', path: '/thresholds' },
  { id: 'diagnostics', label: 'Diagnostics', icon: Stethoscope, description: 'System health', path: '/diagnostics' },
  { id: 'about', label: 'About System', icon: Info, description: 'System info', path: '/about' },
  { id: 'profile', label: 'Profile', icon: User, description: 'User settings', path: '/profile' },
  { id: 'settings', label: 'Settings', icon: Settings, description: 'Configuration', path: '/settings' },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    if (window.innerWidth < 768) onToggle();
  };

  return (
    <>
      {/* Mobile menu button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggle}
        className="md:hidden fixed top-6 left-6 z-50 p-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl shadow-2xl border border-green-500/50"
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.div>
      </motion.button>

      {/* Overlay for mobile */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onToggle}
          className="md:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ 
          x: typeof window !== 'undefined' && window.innerWidth >= 768 ? 0 : (isOpen ? 0 : -300)
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 h-screen w-80 bg-gray-900 shadow-2xl z-50 md:translate-x-0 md:z-auto border-r border-green-500/20 overflow-y-auto scrollbar-hide"
        style={{ 
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {/* Header */}
        <div className="p-8 border-b border-gray-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-blue-500/10" />
          <div className="relative z-10 flex items-center space-x-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="p-3 bg-green-500/20 rounded-xl relative"
            >
              <Leaf className="text-green-400" size={32} />
              <div className="absolute inset-0 bg-green-500/30 rounded-xl blur-md" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold text-white">GreenTechHaven</h1>
              <p className="text-green-400 font-mono text-sm">IoT Control Hub</p>
            </div>
          </div>
        </div>

        {/* Status indicators */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <span className="text-gray-400 text-sm font-medium">System Status</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="flex items-center space-x-2"
            >
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span className="text-green-400 text-xs font-mono">ONLINE</span>
            </motion.div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
              <Activity className="text-blue-400 mb-1" size={16} />
              <p className="text-xs text-gray-400">Sensors</p>
              <p className="text-blue-400 font-mono text-sm">4 Active</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
              <BarChart3 className="text-green-400 mb-1" size={16} />
              <p className="text-xs text-gray-400">Devices</p>
              <p className="text-green-400 font-mono text-sm">3 Online</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6">
          <ul className="space-y-2">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <li key={item.id}>
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden ${
                      isActive
                        ? 'bg-gradient-to-r from-green-600/20 to-green-500/20 text-white border border-green-500/50 shadow-lg shadow-green-500/20'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        animate={{ opacity: [0.3, 0.6, 0.3] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute inset-0 bg-green-500/10 rounded-xl"
                      />
                    )}
                    <Icon size={20} className="relative z-10" />
                    <div className="relative z-10 text-left">
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                    {isActive && (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="absolute right-4 w-2 h-2 bg-green-400 rounded-full"
                      />
                    )}
                  </motion.button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User info */}
        <div className="p-6 border-t border-gray-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-800/50 to-gray-700/50" />
          <div className="relative z-10 flex items-center space-x-4">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="w-12 h-12 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full flex items-center justify-center border border-green-500/30"
            >
              <User className="text-green-400" size={20} />
            </motion.div>
            <div>
              <p className="text-white font-medium">
                {user?.name || 'Operator'}
              </p>
              <p className="text-gray-400 text-sm font-mono">{user?.email}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};