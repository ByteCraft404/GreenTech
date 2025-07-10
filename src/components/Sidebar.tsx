// src/components/Sidebar.tsx
import React, { useState, useEffect, useCallback } from 'react';
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
  TrendingUp,
  CloudOff,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
// Ensure SensorData interface from apiService is correctly updated
import { apiService, ActuatorStatusData, SensorData } from '../services/api';

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

const knownActuators = ['fan', 'pump', 'light'];

// **** CRITICAL FIX: These must EXACTLY match the property names from your backend data ****
// Your log shows: temperature, humidity, lightIntensity, soilMoisture
const knownSensorKeys = [
  'temperature',
  'humidity',
  'lightIntensity', // Use camelCase as shown in your log
  'soilMoisture'    // Use camelCase as shown in your log
];


export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [sensorCount, setSensorCount] = useState<number | null>(null);
  const [deviceOnlineCount, setDeviceOnlineCount] = useState<number | null>(null);
  const [systemStatus, setSystemStatus] = useState<'online' | 'partial' | 'offline'>('online');

  const handleNavigation = (path: string) => {
    navigate(path);
    if (window.innerWidth < 768) onToggle();
  };

  const fetchSystemStatus = useCallback(async () => {
    let currentSensorsActive = 0;
    let currentDevicesOnline = 0;
    let sensorApiFailed = false;
    let actuatorApiFailed = false;

    console.log("--- Sidebar: Starting fetchSystemStatus ---");

    try {
      // 1. Fetch Sensor Data
      const allSensorData: SensorData[] | null = await apiService.getAllSensorData();
      console.log("Sidebar: Raw sensor data from API:", allSensorData);

      if (allSensorData && allSensorData.length > 0) {
        // We expect the *latest* single sensor data object from the backend
        // Assuming the last item in the array is the most recent, or you might have a dedicated "current" endpoint
        const latestSensorReadings = allSensorData[allSensorData.length - 1]; // Get the most recent entry

        console.log("Sidebar: Processing latest sensor readings object:", latestSensorReadings);

        knownSensorKeys.forEach(key => {
          // Access the sensor value using the key (e.g., latestSensorReadings.temperature)
          const value = latestSensorReadings[key as keyof SensorData]; // Use keyof SensorData for type safety

          console.log(`Sidebar: Checking sensor key '${key}'. Value found: ${value}`);

          if (value !== null && value !== undefined) {
            const parsedValue = typeof value === 'string' ? parseFloat(value) : value;

            if (typeof parsedValue === 'number' && !isNaN(parsedValue)) {
              currentSensorsActive++;
              console.log(`Sidebar: Sensor '${key}' IS ACTIVE. Current count: ${currentSensorsActive}`);
            } else {
              console.warn(`Sidebar: Sensor '${key}' value is not a valid number (or NaN):`, value);
            }
          } else {
            console.log(`Sidebar: Sensor '${key}' is missing or its value is null/undefined.`);
          }
        });
      } else {
        sensorApiFailed = true;
        console.error("Sidebar: apiService.getAllSensorData() returned null or empty (API error or no data).");
      }
      setSensorCount(currentSensorsActive);
      console.log("Sidebar: Final sensor count set to:", currentSensorsActive);


      // 2. Fetch Actuator Status (unchanged, but includes logs)
      const actuatorStatusResults = await Promise.allSettled(
        knownActuators.map(device => apiService.getActuatorStatus(device))
      );
      console.log("Sidebar: Actuator status results:", actuatorStatusResults);

      actuatorStatusResults.forEach(result => {
        if (result.status === 'fulfilled' && result.value !== null) {
          const statusResponse = result.value;
          console.log(`Sidebar: Actuator '${statusResponse?.device}' status fulfilled:`, statusResponse);
          if (statusResponse && (statusResponse.status === 'on' || statusResponse.status === 'off')) {
            currentDevicesOnline++;
          }
        } else {
          actuatorApiFailed = true;
          console.warn("Sidebar: Actuator status fetch failed for one or more devices:", result);
        }
      });
      setDeviceOnlineCount(currentDevicesOnline);
      console.log("Sidebar: Final device online count set to:", currentDevicesOnline);


      // 3. Determine Overall System Status
      const totalExpectedSensors = knownSensorKeys.length; // Use knownSensorKeys here
      const totalExpectedDevices = knownActuators.length;

      const allSensorsReporting = currentSensorsActive === totalExpectedSensors;
      const allDevicesResponding = currentDevicesOnline === totalExpectedDevices;

      console.log(`Sidebar: Status Calculation -> Expected Sensors: ${totalExpectedSensors}, Active: ${currentSensorsActive}, API Failed: ${sensorApiFailed}`);
      console.log(`Sidebar: Status Calculation -> Expected Devices: ${totalExpectedDevices}, Online: ${currentDevicesOnline}, API Failed: ${actuatorApiFailed}`);

      if (allSensorsReporting && allDevicesResponding && !sensorApiFailed && !actuatorApiFailed) {
        setSystemStatus('online');
        console.log("Sidebar: System Status set to: ONLINE");
      } else if (currentSensorsActive > 0 || currentDevicesOnline > 0) {
        setSystemStatus('partial');
        console.log("Sidebar: System Status set to: PARTIAL");
      } else {
        setSystemStatus('offline');
        console.log("Sidebar: System Status set to: OFFLINE");
      }

    } catch (error) {
      console.error('Sidebar: Critical error during system status fetch:', error);
      setSystemStatus('offline');
      setSensorCount(0);
      setDeviceOnlineCount(0);
    }
    console.log("--- Sidebar: Finished fetchSystemStatus ---");
  }, []); // useCallback dependency array


  useEffect(() => {
    fetchSystemStatus();
    const interval = setInterval(fetchSystemStatus, 15000);
    return () => clearInterval(interval);
  }, [fetchSystemStatus]);


  const statusColorClass = {
    'online': 'text-green-400',
    'partial': 'text-yellow-400',
    'offline': 'text-red-400'
  };

  const statusText = {
    'online': 'ONLINE',
    'partial': 'PARTIAL',
    'offline': 'OFFLINE'
  };

  const statusIcon = {
    'online': <div className="w-2 h-2 bg-green-400 rounded-full" />,
    'partial': <Zap className="text-yellow-400" size={16} />,
    'offline': <CloudOff className="text-red-400" size={16} />
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
        className="fixed left-0 top-0 h-screen w-80 bg-gray-900 shadow-2xl z-50 md:translate-x-0 md:z-auto border-r border-green-500/20 overflow-y-auto"
        style={{
          scrollbarWidth: 'none', /* For Firefox */
          msOverflowStyle: 'none' /* For Internet Explorer and Edge */
        }}
      >
        {/* Fix for the `jsx` warning */}
        <style>{`
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
              animate={{ scale: systemStatus === 'online' ? [1, 1.2, 1] : 1 }}
              transition={{ repeat: Infinity, duration: systemStatus === 'online' ? 2 : 0 }}
              className={`flex items-center space-x-2 ${statusColorClass[systemStatus]}`}
            >
              {statusIcon[systemStatus]}
              <span className="text-xs font-mono">{statusText[systemStatus]}</span>
            </motion.div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
              <Activity className="text-blue-400 mb-1" size={16} />
              <p className="text-xs text-gray-400">Sensors</p>
              <p className="text-blue-400 font-mono text-sm">
                {sensorCount !== null ? `${sensorCount} Active` : '---'}
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
              <BarChart3 className="text-green-400 mb-1" size={16} />
              <p className="text-xs text-gray-400">Devices</p>
              <p className="text-green-400 font-mono text-sm">
                {deviceOnlineCount !== null ? `${deviceOnlineCount} Online` : '---'}
              </p>
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