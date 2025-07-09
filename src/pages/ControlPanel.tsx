import React from 'react';
import { motion } from 'framer-motion';
import { Power, Settings, Zap, Fan, Waves, Sun, Thermometer, Droplets, Activity } from 'lucide-react';
import { DeviceControlCard } from '../components/DeviceControlCard';
import { useApp } from '../context/AppContext';

export const ControlPanel: React.FC = () => {
  const { selectedFarm, selectedGreenhouse } = useApp();

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Control Panel</h1>
          <div className="flex items-center space-x-2">
            <Power className="text-green-400" size={20} />
            <span className="text-gray-400">
              {selectedFarm?.name} • {selectedGreenhouse?.name}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400 font-mono text-sm">CONTROL ACTIVE</span>
          </div>
        </div>
      </motion.div>

      {/* Control Center Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900 rounded-2xl p-6 shadow-2xl border border-green-500/30 relative overflow-hidden"
      >
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5" />
        
        {/* Header with glowing effect */}
        <div className="relative z-10 flex items-center space-x-3 mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="p-3 bg-green-500/20 rounded-xl relative"
          >
            <Power className="text-green-400" size={28} />
            <div className="absolute inset-0 bg-green-500/30 rounded-xl blur-md" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold text-white">Control Center</h2>
            <p className="text-gray-400">Device Management</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="relative z-10">
          <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"> {/* Adjusted grid for Quick Actions if needed */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-green-500/20 border border-green-500/30 rounded-xl p-4 text-left hover:bg-green-500/30 transition-all duration-300"
            >
              <Zap className="text-green-400 mb-2" size={24} />
              <p className="text-white font-medium">Emergency Stop</p>
              <p className="text-gray-400 text-sm">Stop all devices</p>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-4 text-left hover:bg-blue-500/30 transition-all duration-300"
            >
              <Activity className="text-blue-400 mb-2" size={24} />
              <p className="text-white font-medium">Auto Mode</p>
              <p className="text-gray-400 text-sm">Enable automation</p>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-4 text-left hover:bg-purple-500/30 transition-all duration-300"
            >
              <Settings className="text-purple-400 mb-2" size={24} />
              <p className="text-white font-medium">Schedule</p>
              <p className="text-gray-400 text-sm">Set timers</p>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-4 text-left hover:bg-yellow-500/30 transition-all duration-300"
            >
              <Thermometer className="text-yellow-400 mb-2" size={24} />
              <p className="text-white font-medium">Climate Control</p>
              <p className="text-gray-400 text-sm">Adjust environment</p>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Primary Controls - NOW DISPLAYED AS A GRID OF CARDS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-2xl font-semibold text-white mb-6">Primary Controls</h2>
        {/* CHANGED: From space-y-6 to responsive grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <DeviceControlCard
            device="fan"
            name="Ventilation Fan"
            icon={<Fan className="text-blue-400" size={24} />}
            color="blue"
          />
          <DeviceControlCard
            device="pump"
            name="Water Pump"
            icon={<Waves className="text-cyan-400" size={24} />}
            color="cyan"
          />
          <DeviceControlCard
            device="light"
            name="Grow Light"
            icon={<Sun className="text-yellow-400" size={24} />}
            color="yellow"
          />
          {/* Add more DeviceControlCard components here if needed */}
        </div>
      </motion.div>

      {/* System Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-800/30 border border-green-500/20 rounded-2xl p-6 backdrop-blur-sm"
      >
        <h2 className="text-xl font-semibold text-white mb-4">System Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Control System</span>
              <span className="text-green-400 font-mono">Online</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Last Command</span>
              <span className="text-white font-mono">2 minutes ago</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Response Time</span>
              <span className="text-blue-400 font-mono">~1.2s</span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Active Devices</span>
              <span className="text-green-400 font-mono">3/3</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Power Consumption</span>
              <span className="text-yellow-400 font-mono">45W</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Uptime</span>
              <span className="text-purple-400 font-mono">7d 14h 23m</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};