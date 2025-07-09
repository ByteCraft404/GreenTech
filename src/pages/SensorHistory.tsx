import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Calendar, Download, Filter, Activity } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { apiService, SensorData } from '../services/api';

export const SensorHistory: React.FC = () => {
  const { selectedFarm, selectedGreenhouse } = useApp();
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('24h');

  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        const data = await apiService.getAllSensorData();
        setSensorData(data);
      } catch (error) {
        console.error('Error fetching historical data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistoricalData();
  }, []);

  const formatChartData = (data: SensorData[]) => {
    return data.map(item => ({
      ...item,
      time: new Date(item.timestamp).toLocaleTimeString(),
      date: new Date(item.timestamp).toLocaleDateString()
    }));
  };

  const chartData = formatChartData(sensorData);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-green-500/20 rounded-lg p-3 shadow-lg">
          <p className="text-white font-medium">{`Time: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.name}: ${entry.value}${entry.name === 'Temperature' ? '°C' : 
                entry.name === 'Humidity' ? '%' : 
                entry.name === 'Light Intensity' ? ' lux' : '%'}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
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
          <h1 className="text-4xl font-bold text-white mb-2">Sensor History</h1>
          <div className="flex items-center space-x-2">
            <Activity className="text-green-400" size={20} />
            <span className="text-gray-400">
              {selectedFarm?.name} • {selectedGreenhouse?.name}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-gray-800 border border-green-500/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500/50"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last Week</option>
            <option value="30d">Last Month</option>
          </select>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-green-500/20 border border-green-500/30 rounded-lg px-4 py-2 text-green-400 hover:bg-green-500/30 transition-all duration-300 flex items-center space-x-2"
          >
            <Download size={16} />
            <span>Export</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Charts */}
      <div className="space-y-8">
        {/* Temperature & Humidity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800/30 border border-green-500/20 rounded-2xl p-6 backdrop-blur-sm"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Temperature & Humidity</h2>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-400">Loading chart data...</div>
            </div>
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="#EF4444" 
                  strokeWidth={2}
                  name="Temperature"
                  dot={{ fill: '#EF4444', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="humidity" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  name="Humidity"
                  dot={{ fill: '#3B82F6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              No historical data available
            </div>
          )}
        </motion.div>

        {/* Light & Soil */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800/30 border border-green-500/20 rounded-2xl p-6 backdrop-blur-sm"
        >
          <h2 className="text-xl font-semibold text-white mb-4">Light Intensity & Soil Moisture</h2>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-400">Loading chart data...</div>
            </div>
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="lightIntensity" 
                  stroke="#EAB308" 
                  strokeWidth={2}
                  name="Light Intensity"
                  dot={{ fill: '#EAB308', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="soilMoisture" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  name="Soil Moisture"
                  dot={{ fill: '#10B981', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              No historical data available
            </div>
          )}
        </motion.div>
      </div>

      {/* Data Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-800/30 border border-green-500/20 rounded-2xl p-6 backdrop-blur-sm"
      >
        <h2 className="text-xl font-semibold text-white mb-4">Data Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-700/30 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">Total Records</p>
            <p className="text-white font-mono text-lg">{sensorData.length}</p>
          </div>
          <div className="bg-gray-700/30 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">Avg Temperature</p>
            <p className="text-red-400 font-mono text-lg">
              {sensorData.length > 0 
                ? (sensorData.reduce((sum, d) => sum + d.temperature, 0) / sensorData.length).toFixed(1) + '°C'
                : 'N/A'
              }
            </p>
          </div>
          <div className="bg-gray-700/30 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">Avg Humidity</p>
            <p className="text-blue-400 font-mono text-lg">
              {sensorData.length > 0 
                ? (sensorData.reduce((sum, d) => sum + d.humidity, 0) / sensorData.length).toFixed(1) + '%'
                : 'N/A'
              }
            </p>
          </div>
          <div className="bg-gray-700/30 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-1">Data Quality</p>
            <p className="text-green-400 font-mono text-lg">
              {sensorData.length > 0 ? 'Good' : 'No Data'}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};