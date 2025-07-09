import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import { Thermometer, Droplets, Sun, Leaf, Fan, Zap, Waves, Activity, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SensorCard } from '../components/SensorCard';
import { DeviceControlCard } from '../components/DeviceControlCard';
import { GreenhouseSelector } from '../components/GreenhouseSelector';
import { apiService, SensorData } from '../services/api';

export const Dashboard: React.FC = () => {
  const { selectedFarm, selectedGreenhouse } = useApp();
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [secondsAgo, setSecondsAgo] = useState(0);

  // Redirect if no greenhouse selected
  if (!selectedGreenhouse) {
    return <Navigate to="/" replace />;
  }

  const fetchSensorData = async () => {
    try {
      const data = await apiService.getLatestSensorData();
      setSensorData(data);
      if (data) {
        setLastUpdated(new Date(data.timestamp).toLocaleTimeString());
        setSecondsAgo(0);
      }
    } catch (error) {
      console.error('Error fetching sensor data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSensorData();
    const interval = setInterval(fetchSensorData, 15000); // Refresh every 15 seconds
    return () => clearInterval(interval);
  }, []);

  // Update seconds ago counter
  useEffect(() => {
    if (lastUpdated) {
      const interval = setInterval(() => {
        setSecondsAgo(prev => prev + 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [lastUpdated]);

  const getLastUpdatedText = () => {
    if (secondsAgo < 60) {
      return `${secondsAgo} seconds ago`;
    } else if (secondsAgo < 3600) {
      return `${Math.floor(secondsAgo / 60)} minutes ago`;
    } else {
      return `${Math.floor(secondsAgo / 3600)} hours ago`;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0"
      >
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Activity className="text-green-400" size={20} />
              <span className="text-gray-400">
                {selectedFarm?.name} • {selectedGreenhouse?.name}
              </span>
            </div>
            {lastUpdated && (
              <div className="text-gray-500 text-sm font-mono">
                Last updated: {getLastUpdatedText()}
              </div>
            )}
          </div>
        </div>
        <GreenhouseSelector />
      </motion.div>

      {/* System Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800/30 border border-green-500/20 rounded-2xl p-6 backdrop-blur-sm"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">System Status</h2>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400 font-mono text-sm">OPERATIONAL</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-700/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Activity className="text-blue-400" size={16} />
              <span className="text-gray-300 text-sm">Data Collection</span>
            </div>
            <p className="text-blue-400 font-mono text-lg">
              {sensorData ? 'Active' : 'Inactive'}
            </p>
          </div>
          <div className="bg-gray-700/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="text-green-400" size={16} />
              <span className="text-gray-300 text-sm">Power Status</span>
            </div>
            <p className="text-green-400 font-mono text-lg">Normal</p>
          </div>
          <div className="bg-gray-700/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Waves className="text-purple-400" size={16} />
              <span className="text-gray-300 text-sm">Network</span>
            </div>
            <p className="text-purple-400 font-mono text-lg">Connected</p>
          </div>
          <div className="bg-gray-700/30 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="text-yellow-400" size={16} />
              <span className="text-gray-300 text-sm">Alerts</span>
            </div>
            <p className="text-yellow-400 font-mono text-lg">0 Active</p>
          </div>
        </div>
      </motion.div>

      {/* Sensor Data */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-2xl font-semibold text-white mb-6">Environmental Sensors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <SensorCard
            title="Temperature"
            value={sensorData?.temperature || null}
            unit="°C"
            icon="temperature"
            color="red"
            isLoading={isLoading}
            lastUpdated={lastUpdated}
            threshold={{ min: 18, max: 30 }}
          />
          <SensorCard
            title="Humidity"
            value={sensorData?.humidity || null}
            unit="%"
            icon="humidity"
            color="blue"
            isLoading={isLoading}
            lastUpdated={lastUpdated}
            threshold={{ min: 40, max: 80 }}
          />
          <SensorCard
            title="Light Intensity"
            value={sensorData?.lightIntensity || null}
            unit="lux"
            icon="light"
            color="yellow"
            isLoading={isLoading}
            lastUpdated={lastUpdated}
            threshold={{ min: 200, max: 2000 }}
          />
          <SensorCard
            title="Soil Moisture"
            value={sensorData?.soilMoisture || null}
            unit="%"
            icon="soil"
            color="green"
            isLoading={isLoading}
            lastUpdated={lastUpdated}
            threshold={{ min: 30, max: 70 }}
          />
        </div>
      </motion.div>

      {/* Device Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-2xl font-semibold text-white mb-6">Device Controls</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        </div>
      </motion.div>
    </div>
  );
};