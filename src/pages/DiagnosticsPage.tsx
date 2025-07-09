import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Stethoscope, Activity, Wifi, Cpu, HardDrive, Zap, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface SystemHealth {
  component: string;
  status: 'healthy' | 'warning' | 'error';
  value: string;
  description: string;
  icon: React.ReactNode;
}

export const DiagnosticsPage: React.FC = () => {
  const { selectedFarm, selectedGreenhouse } = useApp();
  const [systemHealth, setSystemHealth] = useState<SystemHealth[]>([
    {
      component: 'Network Connection',
      status: 'healthy',
      value: '98.5%',
      description: 'Stable connection to IoT devices',
      icon: <Wifi className="text-green-400" size={24} />
    },
    {
      component: 'CPU Usage',
      status: 'healthy',
      value: '23%',
      description: 'Processing load within normal range',
      icon: <Cpu className="text-blue-400" size={24} />
    },
    {
      component: 'Memory Usage',
      status: 'warning',
      value: '78%',
      description: 'Memory usage approaching threshold',
      icon: <HardDrive className="text-yellow-400" size={24} />
    },
    {
      component: 'Power Supply',
      status: 'healthy',
      value: '12.3V',
      description: 'Voltage stable and within range',
      icon: <Zap className="text-green-400" size={24} />
    },
    {
      component: 'Sensor Network',
      status: 'healthy',
      value: '4/4',
      description: 'All sensors responding normally',
      icon: <Activity className="text-green-400" size={24} />
    },
    {
      component: 'Actuator Systems',
      status: 'error',
      value: '2/3',
      description: 'One actuator offline - requires attention',
      icon: <Stethoscope className="text-red-400" size={24} />
    }
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="text-green-400" size={20} />;
      case 'warning':
        return <AlertTriangle className="text-yellow-400" size={20} />;
      case 'error':
        return <XCircle className="text-red-400" size={20} />;
      default:
        return <CheckCircle className="text-gray-400" size={20} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'border-green-500/50 bg-gradient-to-r from-green-900/30 to-green-800/20';
      case 'warning':
        return 'border-yellow-500/50 bg-gradient-to-r from-yellow-900/30 to-yellow-800/20';
      case 'error':
        return 'border-red-500/50 bg-gradient-to-r from-red-900/30 to-red-800/20';
      default:
        return 'border-gray-500/50 bg-gradient-to-r from-gray-900/30 to-gray-800/20';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">System Diagnostics</h1>
          <div className="flex items-center space-x-2">
            <Stethoscope className="text-blue-400" size={20} />
            <span className="text-gray-400">
              {selectedFarm?.name} • {selectedGreenhouse?.name}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
            <span className="text-blue-400 font-mono text-sm">SCANNING</span>
          </div>
        </div>
      </motion.div>

      {/* System Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900 rounded-2xl p-6 shadow-2xl border border-blue-500/30 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
        
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="p-3 bg-blue-500/20 rounded-xl"
            >
              <Stethoscope className="text-blue-400" size={28} />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold text-white">System Health Overview</h2>
              <p className="text-gray-400">Real-time component monitoring</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="text-green-400" size={16} />
                <span className="text-gray-300 text-sm">Healthy</span>
              </div>
              <p className="text-green-400 font-mono text-lg">
                {systemHealth.filter(s => s.status === 'healthy').length}
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <AlertTriangle className="text-yellow-400" size={16} />
                <span className="text-gray-300 text-sm">Warnings</span>
              </div>
              <p className="text-yellow-400 font-mono text-lg">
                {systemHealth.filter(s => s.status === 'warning').length}
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <XCircle className="text-red-400" size={16} />
                <span className="text-gray-300 text-sm">Errors</span>
              </div>
              <p className="text-red-400 font-mono text-lg">
                {systemHealth.filter(s => s.status === 'error').length}
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Activity className="text-blue-400" size={16} />
                <span className="text-gray-300 text-sm">Uptime</span>
              </div>
              <p className="text-blue-400 font-mono text-lg">99.2%</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Component Health Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {systemHealth.map((component, index) => (
          <motion.div
            key={component.component}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-6 rounded-xl border relative overflow-hidden ${getStatusColor(component.status)}`}
          >
            {component.status !== 'healthy' && (
              <motion.div
                animate={{ opacity: [0.1, 0.3, 0.1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className={`absolute inset-0 ${
                  component.status === 'error' ? 'bg-red-500/20' : 'bg-yellow-500/20'
                }`}
              />
            )}

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-800/50 rounded-lg">
                    {component.icon}
                  </div>
                  <h3 className="font-bold text-white">{component.component}</h3>
                </div>
                {getStatusIcon(component.status)}
              </div>

              <div className="mb-4">
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-bold text-white font-mono">
                    {component.value}
                  </span>
                </div>
              </div>

              <p className="text-gray-300 text-sm">{component.description}</p>

              <div className="mt-4 pt-3 border-t border-gray-700/50">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    component.status === 'healthy' ? 'bg-green-400' :
                    component.status === 'warning' ? 'bg-yellow-400' : 'bg-red-400'
                  } ${component.status !== 'healthy' ? 'animate-pulse' : ''}`} />
                  <span className="text-xs text-gray-400 capitalize">
                    {component.status}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gray-800/30 border border-green-500/20 rounded-2xl p-6 backdrop-blur-sm"
      >
        <h2 className="text-xl font-semibold text-white mb-4">Performance Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-bold text-white mb-3">Response Times</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex justify-between">
                <span>Sensor Data:</span>
                <span className="text-green-400 font-mono">1.2s</span>
              </li>
              <li className="flex justify-between">
                <span>Actuator Control:</span>
                <span className="text-green-400 font-mono">0.8s</span>
              </li>
              <li className="flex justify-between">
                <span>API Requests:</span>
                <span className="text-green-400 font-mono">0.3s</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-white mb-3">Data Quality</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex justify-between">
                <span>Accuracy:</span>
                <span className="text-green-400 font-mono">99.7%</span>
              </li>
              <li className="flex justify-between">
                <span>Completeness:</span>
                <span className="text-green-400 font-mono">98.9%</span>
              </li>
              <li className="flex justify-between">
                <span>Reliability:</span>
                <span className="text-green-400 font-mono">99.2%</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-white mb-3">System Load</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex justify-between">
                <span>CPU Load:</span>
                <span className="text-blue-400 font-mono">23%</span>
              </li>
              <li className="flex justify-between">
                <span>Memory:</span>
                <span className="text-yellow-400 font-mono">78%</span>
              </li>
              <li className="flex justify-between">
                <span>Network:</span>
                <span className="text-green-400 font-mono">12%</span>
              </li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};