import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Save, RotateCcw, Bell, Shield, Database, Wifi } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SettingsPage: React.FC = () => {
  const { selectedFarm, selectedGreenhouse } = useApp();
  const [settings, setSettings] = useState({
    refreshInterval: 15,
    alertThreshold: 'medium',
    dataRetention: 30,
    autoBackup: true,
    networkTimeout: 10,
    debugMode: false,
    maintenanceMode: false,
    apiLogging: true
  });

  const handleSave = () => {
    // TODO: Save to backend
    console.log('Saving settings:', settings);
  };

  const handleReset = () => {
    setSettings({
      refreshInterval: 15,
      alertThreshold: 'medium',
      dataRetention: 30,
      autoBackup: true,
      networkTimeout: 10,
      debugMode: false,
      maintenanceMode: false,
      apiLogging: true
    });
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
          <h1 className="text-4xl font-bold text-white mb-2">System Settings</h1>
          <div className="flex items-center space-x-2">
            <Settings className="text-gray-400" size={20} />
            <span className="text-gray-400">
              {selectedFarm?.name} • {selectedGreenhouse?.name}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReset}
            className="bg-gray-500/20 border border-gray-500/30 rounded-lg px-4 py-2 text-gray-400 hover:bg-gray-500/30 transition-all duration-300 flex items-center space-x-2"
          >
            <RotateCcw size={16} />
            <span>Reset</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            className="bg-green-500/20 border border-green-500/30 rounded-lg px-4 py-2 text-green-400 hover:bg-green-500/30 transition-all duration-300 flex items-center space-x-2"
          >
            <Save size={16} />
            <span>Save Changes</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* System Configuration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 rounded-2xl p-6 shadow-2xl border border-green-500/30 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5" />
          
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <Settings className="text-green-400" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">System Configuration</h2>
                <p className="text-gray-400">Core system settings</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Data Refresh Interval (seconds)
                </label>
                <input
                  type="number"
                  value={settings.refreshInterval}
                  onChange={(e) => setSettings(prev => ({ ...prev, refreshInterval: Number(e.target.value) }))}
                  className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-500/50"
                  min="5"
                  max="300"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Network Timeout (seconds)
                </label>
                <input
                  type="number"
                  value={settings.networkTimeout}
                  onChange={(e) => setSettings(prev => ({ ...prev, networkTimeout: Number(e.target.value) }))}
                  className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-500/50"
                  min="5"
                  max="60"
                />
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Data Retention (days)
                </label>
                <select
                  value={settings.dataRetention}
                  onChange={(e) => setSettings(prev => ({ ...prev, dataRetention: Number(e.target.value) }))}
                  className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500/50"
                >
                  <option value={7}>7 days</option>
                  <option value={30}>30 days</option>
                  <option value={90}>90 days</option>
                  <option value={365}>1 year</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Alert Configuration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900 rounded-2xl p-6 shadow-2xl border border-yellow-500/30 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-orange-500/5" />
          
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-yellow-500/20 rounded-xl">
                <Bell className="text-yellow-400" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Alert Configuration</h2>
                <p className="text-gray-400">Notification settings</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Alert Sensitivity
                </label>
                <select
                  value={settings.alertThreshold}
                  onChange={(e) => setSettings(prev => ({ ...prev, alertThreshold: e.target.value }))}
                  className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500/50"
                >
                  <option value="low">Low - Critical only</option>
                  <option value="medium">Medium - Important alerts</option>
                  <option value="high">High - All alerts</option>
                </select>
              </div>

              <div className="space-y-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.autoBackup}
                    onChange={(e) => setSettings(prev => ({ ...prev, autoBackup: e.target.checked }))}
                    className="w-5 h-5 text-yellow-400 bg-gray-800 border-gray-600 rounded focus:ring-yellow-500"
                  />
                  <span className="text-gray-300">Enable automatic data backup</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.apiLogging}
                    onChange={(e) => setSettings(prev => ({ ...prev, apiLogging: e.target.checked }))}
                    className="w-5 h-5 text-yellow-400 bg-gray-800 border-gray-600 rounded focus:ring-yellow-500"
                  />
                  <span className="text-gray-300">Enable API request logging</span>
                </label>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Security Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900 rounded-2xl p-6 shadow-2xl border border-purple-500/30 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5" />
          
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <Shield className="text-purple-400" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Security Settings</h2>
                <p className="text-gray-400">System security options</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.debugMode}
                    onChange={(e) => setSettings(prev => ({ ...prev, debugMode: e.target.checked }))}
                    className="w-5 h-5 text-purple-400 bg-gray-800 border-gray-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-gray-300">Enable debug mode</span>
                </label>

                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) => setSettings(prev => ({ ...prev, maintenanceMode: e.target.checked }))}
                    className="w-5 h-5 text-purple-400 bg-gray-800 border-gray-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-gray-300">Maintenance mode</span>
                </label>
              </div>

              <div className="bg-gray-800/30 rounded-lg p-4">
                <h3 className="font-bold text-white mb-3">Security Status</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Encryption:</span>
                    <span className="text-green-400">Enabled</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Firewall:</span>
                    <span className="text-green-400">Active</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">SSL Certificate:</span>
                    <span className="text-green-400">Valid</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Network Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900 rounded-2xl p-6 shadow-2xl border border-blue-500/30 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5" />
          
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <Wifi className="text-blue-400" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Network Settings</h2>
                <p className="text-gray-400">Connection configuration</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-800/30 rounded-lg p-4">
                <h3 className="font-bold text-white mb-3">Connection Status</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">API Endpoint:</span>
                    <span className="text-green-400">Connected</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Response Time:</span>
                    <span className="text-blue-400">1.2s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Uptime:</span>
                    <span className="text-green-400">99.2%</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/30 rounded-lg p-4">
                <h3 className="font-bold text-white mb-3">API Configuration</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Base URL:</span>
                    <span className="text-blue-400 font-mono text-sm">smartfarm-ua4d.onrender.com</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Version:</span>
                    <span className="text-blue-400">v1.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Protocol:</span>
                    <span className="text-green-400">HTTPS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* System Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-800/30 border border-green-500/20 rounded-2xl p-6 backdrop-blur-sm"
      >
        <h2 className="text-xl font-semibold text-white mb-4">System Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <h3 className="font-bold text-white mb-3">Application</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Version:</span>
                <span className="text-green-400">v1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Build:</span>
                <span className="text-blue-400">2024.01.15</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Environment:</span>
                <span className="text-purple-400">Production</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-white mb-3">Performance</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Memory Usage:</span>
                <span className="text-yellow-400">78%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">CPU Load:</span>
                <span className="text-green-400">23%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Storage:</span>
                <span className="text-blue-400">45%</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-white mb-3">Database</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Records:</span>
                <span className="text-green-400">15,247</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Size:</span>
                <span className="text-blue-400">2.3 GB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Last Backup:</span>
                <span className="text-purple-400">2h ago</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-white mb-3">Monitoring</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Active Sensors:</span>
                <span className="text-green-400">4/4</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Devices Online:</span>
                <span className="text-green-400">3/3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Alerts:</span>
                <span className="text-yellow-400">2 Active</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};