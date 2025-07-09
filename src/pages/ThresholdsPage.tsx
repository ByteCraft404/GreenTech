import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sliders, Save, RotateCcw, Activity } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ThresholdConfig {
  sensor: string;
  name: string;
  unit: string;
  min: number;
  max: number;
  color: string;
}

export const ThresholdsPage: React.FC = () => {
  const { selectedFarm, selectedGreenhouse } = useApp();
  const [thresholds, setThresholds] = useState<ThresholdConfig[]>([
    { sensor: 'temperature', name: 'Temperature', unit: '°C', min: 18, max: 30, color: 'red' },
    { sensor: 'humidity', name: 'Humidity', unit: '%', min: 40, max: 80, color: 'blue' },
    { sensor: 'light', name: 'Light Intensity', unit: 'lux', min: 200, max: 2000, color: 'yellow' },
    { sensor: 'soil', name: 'Soil Moisture', unit: '%', min: 30, max: 70, color: 'green' },
  ]);

  const handleThresholdChange = (sensor: string, field: 'min' | 'max', value: number) => {
    setThresholds(prev => prev.map(threshold => 
      threshold.sensor === sensor 
        ? { ...threshold, [field]: value }
        : threshold
    ));
  };

  const handleSave = () => {
    // TODO: Save to backend
    console.log('Saving thresholds:', thresholds);
  };

  const handleReset = () => {
    setThresholds([
      { sensor: 'temperature', name: 'Temperature', unit: '°C', min: 18, max: 30, color: 'red' },
      { sensor: 'humidity', name: 'Humidity', unit: '%', min: 40, max: 80, color: 'blue' },
      { sensor: 'light', name: 'Light Intensity', unit: 'lux', min: 200, max: 2000, color: 'yellow' },
      { sensor: 'soil', name: 'Soil Moisture', unit: '%', min: 30, max: 70, color: 'green' },
    ]);
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
          <h1 className="text-4xl font-bold text-white mb-2">Threshold Configuration</h1>
          <div className="flex items-center space-x-2">
            <Sliders className="text-green-400" size={20} />
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

      {/* Threshold Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {thresholds.map((threshold, index) => (
          <motion.div
            key={threshold.sensor}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-900 rounded-2xl p-6 shadow-2xl border border-green-500/30 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5" />
            
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-6">
                <div className={`p-3 bg-${threshold.color}-500/20 rounded-xl`}>
                  <Activity className={`text-${threshold.color}-400`} size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{threshold.name}</h3>
                  <p className="text-gray-400">Configure operating limits</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Minimum Value ({threshold.unit})
                  </label>
                  <input
                    type="number"
                    value={threshold.min}
                    onChange={(e) => handleThresholdChange(threshold.sensor, 'min', Number(e.target.value))}
                    className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-500/50"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Maximum Value ({threshold.unit})
                  </label>
                  <input
                    type="number"
                    value={threshold.max}
                    onChange={(e) => handleThresholdChange(threshold.sensor, 'max', Number(e.target.value))}
                    className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-500/50"
                  />
                </div>

                <div className="bg-gray-800/30 rounded-lg p-4">
                  <p className="text-gray-400 text-sm mb-2">Current Range</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-${threshold.color}-400 font-mono`}>
                      {threshold.min} {threshold.unit}
                    </span>
                    <span className="text-gray-500">to</span>
                    <span className={`text-${threshold.color}-400 font-mono`}>
                      {threshold.max} {threshold.unit}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Information Panel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-800/30 border border-green-500/20 rounded-2xl p-6 backdrop-blur-sm"
      >
        <h2 className="text-xl font-semibold text-white mb-4">Threshold Guidelines</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-bold text-white mb-3">Recommended Ranges</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Temperature: 18-30°C for optimal growth</li>
              <li>• Humidity: 40-80% for most crops</li>
              <li>• Light: 200-2000 lux depending on plant type</li>
              <li>• Soil Moisture: 30-70% for healthy roots</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-white mb-3">Alert Behavior</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Values below minimum trigger low alerts</li>
              <li>• Values above maximum trigger high alerts</li>
              <li>• Critical alerts activate emergency protocols</li>
              <li>• Notifications sent to all operators</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
};