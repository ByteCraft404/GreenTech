import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Activity } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AlertsPanel } from '../components/AlertsPanel';

interface Alert {
  id: string;
  type: 'error' | 'warning';
  sensorName: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

export const AlertsPage: React.FC = () => {
  const { selectedFarm, selectedGreenhouse } = useApp();
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'warning',
      sensorName: 'Temperature Sensor',
      message: 'Temperature exceeds optimal range (32°C)',
      timestamp: new Date().toISOString(),
      acknowledged: false
    },
    {
      id: '2',
      type: 'error',
      sensorName: 'Humidity Sensor',
      message: 'Humidity levels critically low (25%)',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      acknowledged: false
    }
  ]);

  const handleAcknowledge = async (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
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
          <h1 className="text-4xl font-bold text-white mb-2">System Alerts</h1>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="text-yellow-400" size={20} />
            <span className="text-gray-400">
              {selectedFarm?.name} • {selectedGreenhouse?.name}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
            <span className="text-yellow-400 font-mono text-sm">MONITORING</span>
          </div>
        </div>
      </motion.div>

      {/* Alerts Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <AlertsPanel alerts={alerts} onAcknowledge={handleAcknowledge} />
      </motion.div>

      {/* Alert Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-800/30 border border-green-500/20 rounded-2xl p-6 backdrop-blur-sm"
      >
        <h2 className="text-xl font-semibold text-white mb-4">Alert Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-700/30 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">Total Alerts</p>
            <p className="text-white font-mono text-lg">{alerts.length}</p>
          </div>
          <div className="bg-gray-700/30 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">Active Alerts</p>
            <p className="text-red-400 font-mono text-lg">
              {alerts.filter(a => !a.acknowledged).length}
            </p>
          </div>
          <div className="bg-gray-700/30 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">Critical Alerts</p>
            <p className="text-red-400 font-mono text-lg">
              {alerts.filter(a => a.type === 'error').length}
            </p>
          </div>
          <div className="bg-gray-700/30 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">Response Time</p>
            <p className="text-green-400 font-mono text-lg">~2.3s</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};