import React, { useState, useEffect, useMemo } from 'react'; // Added useMemo
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { BarChart3, TrendingUp, Activity, Calendar, Download, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { apiService, SensorData } from '../services/api';

// Sensor configuration for colors, labels, and glow effects
const sensorConfig = {
  temperature: { color: '#EF4444', label: 'Temperature (°C)', glow: '#EF444440' },
  humidity: { color: '#3B82F6', label: 'Humidity (%)', glow: '#3B82F640' },
  soilMoisture: { color: '#10B981', label: 'Soil Moisture (%)', glow: '#10B98140' },
  lightIntensity: { color: '#F59E0B', label: 'Light (lux)', glow: '#F59E0B40' },
};

export const SensorHistory: React.FC = () => {
  // Keeping selectedFarm and selectedGreenhouse from context for display purposes in header,
  // but they will NOT be used for filtering `chartData` as per your request.
  const { selectedFarm, selectedGreenhouse } = useApp();

  // This state holds ALL raw sensor data fetched from the backend, without any initial filtering.
  const [allRawSensorData, setAllRawSensorData] = useState<SensorData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('24h'); // Default time range
  const [selectedSensors, setSelectedSensors] = useState<string[]>(
    Object.keys(sensorConfig)
  );
  const [chartType, setChartType] = useState<'line' | 'area'>('line');

  // Fetch all historical data only once when the component mounts.
  // The `timeRange` dependency has been removed here because the backend doesn't use it.
  useEffect(() => {
    const fetchHistoricalData = async () => {
      setIsLoading(true);
      try {
        const data = await apiService.getAllSensorData();
        console.log("🟢 Data fetched from backend (all data, no filters applied yet):", data);
        setAllRawSensorData(data); // Store the raw, unfiltered data
      } catch (error) {
        console.error('🔴 Error fetching historical data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistoricalData();
  }, []); // Empty dependency array: runs ONLY ONCE when the component mounts.

  // Memoized chart data, applying only the frontend time range filter
  const chartData = useMemo(() => {
    console.log("--- Chart Data Calculation Start (Frontend Filtering) ---");
    console.log("Raw data received by useMemo:", allRawSensorData);
    console.log("Selected Time Range for filter:", timeRange);

    if (!allRawSensorData || allRawSensorData.length === 0) {
      console.log("No raw data available to process. Returning empty chartData.");
      console.log("--- Chart Data Calculation End ---");
      return [];
    }

    // 1. Apply time range filter on the frontend
    const now = Date.now(); // Current timestamp in milliseconds
    let minTimestamp = 0; // Default to showing all if 'all' option is introduced

    // Calculate the minimum timestamp based on the selected timeRange
    if (timeRange === '1h') minTimestamp = now - 60 * 60 * 1000;
    else if (timeRange === '6h') minTimestamp = now - 6 * 60 * 60 * 1000;
    else if (timeRange === '24h') minTimestamp = now - 24 * 60 * 60 * 1000;
    else if (timeRange === '7d') minTimestamp = now - 7 * 24 * 60 * 60 * 1000;
    else if (timeRange === '30d') minTimestamp = now - 30 * 24 * 60 * 60 * 1000;
    // You could add an 'all' option if you want a button for it in the UI:
    // else if (timeRange === 'all') minTimestamp = 0;

    console.log(`⏱️ Current time for filter: ${new Date(now).toLocaleString()}`);
    console.log(`⏱️ Minimum timestamp for '${timeRange}' filter: ${new Date(minTimestamp).toLocaleString()}`);

    const processedData = allRawSensorData // Start with all raw data
      .filter(item => {
          const itemTimestamp = new Date(item.timestamp).getTime(); // Convert item timestamp to milliseconds
          const isValidDate = !isNaN(itemTimestamp); // Check if the timestamp is valid
          const inTimeRange = isValidDate && itemTimestamp >= minTimestamp;

          if (!isValidDate) {
              console.warn('⚠️ Invalid timestamp found, excluding:', item.timestamp);
          } else if (!inTimeRange) {
              console.log(`🕒 Excluding data point at ${new Date(itemTimestamp).toLocaleString()} because it's older than '${timeRange}' filter.`);
          }
          return inTimeRange;
      })
      .map(item => ({
        ...item,
        timeValue: new Date(item.timestamp).getTime(), // Numeric timestamp for sorting
        time: new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // String for X-axis label
        date: new Date(item.timestamp).toLocaleDateString() // For displaying date on tooltip
      }))
      // Sort data by timestamp to ensure correct line drawing on the chart
      .sort((a, b) => a.timeValue - b.timeValue);

    console.log("✅ Final chartData (after time range filter and mapping):", processedData);
    console.log("--- Chart Data Calculation End ---");
    return processedData;
  }, [allRawSensorData, timeRange]); // Dependencies for useMemo: re-run if raw data or timeRange changes


  const toggleSensor = (sensor: string) => {
    setSelectedSensors(prev =>
      prev.includes(sensor)
        ? prev.filter(s => s !== sensor)
        : [...prev, sensor]
    );
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      // Find the displayDate from the first payload item's data
      const displayDate = payload[0]?.payload?.date || '';
      return (
        <div className="bg-gray-800 border border-green-500/30 rounded-xl p-4 shadow-2xl">
          <p className="text-green-400 font-mono text-sm mb-2">{`Date: ${displayDate}`}</p>
          <p className="text-green-400 font-mono text-sm mb-2">{`Time: ${label}`}</p>
          {payload.map((entry: any, index: number) => {
            const sensorKey = entry.dataKey as keyof typeof sensorConfig;
            const config = sensorConfig[sensorKey];
            return (
              <p key={index} className="text-white font-medium" style={{ color: config?.color || '#FFFFFF' }}>
                {`${config?.label || entry.name}: ${entry.value !== undefined ? entry.value.toFixed(1) : 'N/A'}`}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  const exportData = () => {
    // This will export ALL raw data, not just the currently displayed filtered data.
    // If you want to export only the displayed data, change `allRawSensorData` to `chartData`.
    if (allRawSensorData.length === 0) {
      alert('No data to export.');
      return;
    }

    const csvContent = "data:text/csv;charset=utf-8,"
      + "Timestamp,Temperature,Humidity,Soil Moisture,Light Intensity\n"
      + allRawSensorData.map(row =>
        `${row.timestamp},${row.temperature},${row.humidity},${row.soilMoisture},${row.lightIntensity}`
      ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `greenhouse_data_${selectedFarm?.name || 'farm'}_${selectedGreenhouse?.name || 'greenhouse'}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-gray-900 to-purple-900/10" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 p-8 max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-4xl font-bold text-white mb-12 flex items-center space-x-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="p-3 bg-blue-500/20 rounded-xl relative"
          >
            <TrendingUp className="text-blue-400" size={32} />
            <div className="absolute inset-0 bg-blue-500/30 rounded-xl blur-md" />
          </motion.div>
          <span>Sensor History & Analytics</span>
        </motion.h1>

        {/* Controls Section: Time Range, Chart Type, Export */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 rounded-2xl p-6 mb-8 shadow-2xl border border-green-500/30 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-blue-500/5" />

          <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
            {/* Time Range Selector (now with buttons) */}
            <div className="flex items-center space-x-3">
              <Calendar className="text-green-400" size={20} />
              <span className="text-white font-medium">Time Range:</span>
              <div className="flex space-x-2">
                {['1h', '6h', '24h', '7d', '30d'].map((range) => (
                  <motion.button
                    key={range}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setTimeRange(range)}
                    className={`px-4 py-2 rounded-lg font-mono text-sm transition-all ${
                      timeRange === range
                        ? 'bg-green-500/30 text-green-400 border border-green-500/50'
                        : 'bg-gray-800/50 text-gray-400 hover:text-white'
                    }`}
                  >
                    {range === '1h' ? 'Last Hour' : range === '6h' ? 'Last 6 Hours' : range === '24h' ? 'Last 24 Hours' : range === '7d' ? 'Last Week' : 'Last Month'}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Chart Type Selector */}
            <div className="flex items-center space-x-3">
              <BarChart3 className="text-blue-400" size={20} />
              <span className="text-white font-medium">Chart Type:</span>
              <div className="flex space-x-2">
                {[
                  { type: 'line' as const, label: 'Line' },
                  { type: 'area' as const, label: 'Area' }
                ].map(({ type, label }) => (
                  <motion.button
                    key={type}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setChartType(type)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                      chartType === type
                        ? 'bg-blue-500/30 text-blue-400 border border-blue-500/50'
                        : 'bg-gray-800/50 text-gray-400 hover:text-white'
                    }`}
                  >
                    {label}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Export Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={exportData}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600/20 to-purple-500/20 border border-purple-500/30 rounded-lg text-purple-400 hover:bg-purple-500/30 transition-all font-medium"
            >
              <Download size={16} />
              <span>Export CSV</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Sensor Toggles */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-3 mb-8"
        >
          {Object.entries(sensorConfig).map(([key, config]) => (
            <motion.button
              key={key}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleSensor(key)}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 relative overflow-hidden ${
                selectedSensors.includes(key)
                  ? 'text-white shadow-lg border'
                  : 'text-gray-400 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700'
              }`}
              style={{
                backgroundColor: selectedSensors.includes(key) ? `${config.color}20` : undefined,
                borderColor: selectedSensors.includes(key) ? `${config.color}50` : undefined,
              }}
            >
              {selectedSensors.includes(key) && (
                <motion.div
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-0 rounded-xl"
                  style={{ backgroundColor: config.glow }}
                />
              )}
              <span className="relative z-10">{config.label}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Main Chart Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900 rounded-2xl p-8 shadow-2xl border border-blue-500/30 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="p-3 bg-blue-500/20 rounded-xl relative"
                >
                  <BarChart3 className="text-blue-400" size={28} />
                  <div className="absolute inset-0 bg-blue-500/30 rounded-xl blur-md" />
                </motion.div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Historical Data Visualization</h2>
                  <p className="text-gray-400">Real-time sensor trends and patterns for {selectedFarm?.name || 'your farm'} in {selectedGreenhouse?.name || 'the selected greenhouse'}</p>
                </div>
              </div>

              <motion.div
                animate={{ y: [-2, 2, -2] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="flex items-center space-x-2"
              >
                <Activity className="text-green-400" size={20} />
                <span className="text-green-400 font-mono text-sm">LIVE DATA</span>
              </motion.div>
            </div>

            <div className="h-96 bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-gray-400 text-lg flex items-center space-x-2">
                    <Loader2 className="animate-spin" size={24} />
                    <span>Loading chart data...</span>
                  </div>
                </div>
              ) : chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === 'line' ? (
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis
                        dataKey="time"
                        stroke="#9CA3AF"
                        fontSize={12}
                        fontFamily="monospace"
                        // Optional: to show date if data spans multiple days
                        tickFormatter={(value, index) => {
                          const item = chartData[index];
                          // Show date only for the first point or if the date changes
                          if (item && item.date && chartData.length > 1) {
                             if (index === 0 || item.date !== chartData[index - 1].date) {
                                return `${item.date}\n${value}`; // Date on a new line
                             }
                          }
                          return value;
                        }}
                      />
                      <YAxis
                        stroke="#9CA3AF"
                        fontSize={12}
                        fontFamily="monospace"
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        wrapperStyle={{ color: '#D1D5DB' }}
                      />

                      {selectedSensors.map(sensor => {
                        const config = sensorConfig[sensor as keyof typeof sensorConfig];
                        return (
                          <Line
                            key={sensor}
                            type="monotone"
                            dataKey={sensor}
                            stroke={config.color}
                            strokeWidth={3}
                            dot={{ r: 4, strokeWidth: 2 }}
                            activeDot={{
                              r: 6,
                              strokeWidth: 0,
                              fill: config.color,
                              filter: `drop-shadow(0 0 6px ${config.color})`
                            }}
                            name={config.label}
                            filter={`drop-shadow(0 0 4px ${config.glow})`}
                          />
                        );
                      })}
                    </LineChart>
                  ) : (
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis
                        dataKey="time"
                        stroke="#9CA3AF"
                        fontSize={12}
                        fontFamily="monospace"
                        // Optional: to show date if data spans multiple days
                        tickFormatter={(value, index) => {
                          const item = chartData[index];
                          if (item && item.date && chartData.length > 1) {
                             if (index === 0 || item.date !== chartData[index - 1].date) {
                                return `${item.date}\n${value}`;
                             }
                          }
                          return value;
                        }}
                      />
                      <YAxis
                        stroke="#9CA3AF"
                        fontSize={12}
                        fontFamily="monospace"
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        wrapperStyle={{ color: '#D1D5DB' }}
                      />

                      {selectedSensors.map(sensor => {
                        const config = sensorConfig[sensor as keyof typeof sensorConfig];
                        return (
                          <Area
                            key={sensor}
                            type="monotone"
                            dataKey={sensor}
                            stroke={config.color}
                            fill={`${config.color}30`}
                            strokeWidth={2}
                            name={config.label}
                          />
                        );
                      })}
                    </AreaChart>
                  )}
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 text-lg">
                  No historical data available for the selected greenhouse.
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {Object.entries(sensorConfig).map(([key, config], index) => {
            // Calculate statistics based on the *filtered* chartData
            const sensorValues = chartData.map(d => d[key as keyof SensorData] as number).filter(value => typeof value === 'number');

            const avg = sensorValues.length > 0 ? (sensorValues.reduce((a, b) => a + b, 0) / sensorValues.length) : NaN;
            const min = sensorValues.length > 0 ? Math.min(...sensorValues) : NaN;
            const max = sensorValues.length > 0 ? Math.max(...sensorValues) : NaN;

            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="bg-gray-900 rounded-xl p-6 border border-gray-700/50 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800/30 to-gray-700/30" />

                <div className="relative z-10">
                  <div className="flex items-center space-x-3 mb-4">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: config.color }}
                    />
                    <h3 className="font-bold text-white text-sm">{config.label}</h3>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-400">Average:</span>
                      <span className="text-sm font-mono text-white">
                        {!isNaN(avg) ? avg.toFixed(1) : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-400">Min:</span>
                      <span className="text-sm font-mono text-blue-400">
                        {!isNaN(min) ? min.toFixed(1) : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-400">Max:</span>
                      <span className="text-sm font-mono text-red-400">
                        {!isNaN(max) ? max.toFixed(1) : 'N/A'} 
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </div>
  );
};