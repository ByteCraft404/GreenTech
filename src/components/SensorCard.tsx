import React from 'react';
import { motion } from 'framer-motion';
import { 
  Thermometer, 
  Droplets, 
  Sun, 
  Leaf, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  Activity,
  Wind
} from 'lucide-react';

interface SensorCardProps {
  title: string;
  value: number | null;
  unit: string;
  icon: 'temperature' | 'humidity' | 'light' | 'soil' | 'co2';
  color: string;
  isLoading?: boolean;
  lastUpdated?: string;
  threshold?: { min: number; max: number };
}

const iconMap = {
  temperature: Thermometer,
  humidity: Droplets,
  light: Sun,
  soil: Leaf,
  co2: Wind,
};

export const SensorCard: React.FC<SensorCardProps> = ({
  title,
  value,
  unit,
  icon,
  color,
  isLoading = false,
  lastUpdated,
  threshold = { min: 0, max: 100 }
}) => {
  const Icon = iconMap[icon];
  const trend = Math.random() > 0.5 ? 'up' : 'down';
  const isWarning = value !== null && (value < threshold.min || value > threshold.max);

  const getDisplayValue = () => {
    if (isLoading) return '...';
    if (value === null || value === undefined) return 'N/A';
    return value.toFixed(1);
  };

  const getValueColor = () => {
    if (isLoading || value === null || value === undefined) return 'text-gray-400';
    if (isWarning) return 'text-red-400';
    return 'text-white';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -5 }}
      className={`bg-gray-900 rounded-2xl p-6 border transition-all duration-500 relative overflow-hidden ${
        isWarning 
          ? 'border-red-500/50 shadow-lg shadow-red-500/20 bg-gradient-to-br from-gray-900 to-red-900/20' 
          : 'border-green-500/30 shadow-lg shadow-green-500/10 hover:border-green-400/50 hover:shadow-green-400/20'
      }`}
    >
      {/* Animated background glow */}
      <div className={`absolute inset-0 opacity-20 ${
        isWarning ? 'bg-gradient-to-r from-red-500/10 to-orange-500/10' : 'bg-gradient-to-r from-green-500/10 to-blue-500/10'
      }`} />
      
      {/* Pulsing indicator for active sensors */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute top-4 right-4 w-3 h-3 bg-green-400 rounded-full"
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <motion.div 
              animate={{ rotate: isWarning ? [0, 5, -5, 0] : 0 }}
              transition={{ repeat: isWarning ? Infinity : 0, duration: 0.5 }}
              className={`p-3 rounded-xl relative ${
                isWarning ? 'bg-red-500/20' : `bg-${color}-500/20`
              }`}
            >
              <Icon 
                size={28} 
                className={`${isWarning ? 'text-red-400' : `text-${color}-400`} drop-shadow-lg`}
              />
              {/* Glowing effect */}
              <div className={`absolute inset-0 rounded-xl blur-md ${
                isWarning ? 'bg-red-500/30' : `bg-${color}-500/30`
              }`} />
            </motion.div>
            <div>
              <h3 className="font-bold text-xl text-white mb-1">{title}</h3>
              <div className="flex items-center space-x-2">
                <Activity size={14} className="text-green-400" />
                <p className="text-sm text-gray-400">
                  {lastUpdated || 'No data'}
                </p>
              </div>
            </div>
          </div>
          
          {isWarning && (
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="p-2 bg-red-500/20 rounded-full"
            >
              <AlertTriangle className="text-red-400" size={24} />
            </motion.div>
          )}
        </div>

        <div className="mb-6">
          <div className="flex items-baseline space-x-3 mb-2">
            <motion.span 
              key={value}
              initial={{ scale: 1.2, color: '#10B981' }}
              animate={{ scale: 1, color: '#FFFFFF' }}
              transition={{ duration: 0.3 }}
              className={`text-4xl font-bold font-mono ${getValueColor()}`}
            >
              {getDisplayValue()}
            </motion.span>
            <span className="text-xl text-gray-300 font-medium">{unit}</span>
            {value !== null && !isLoading && (
              <motion.div 
                animate={{ y: trend === 'up' ? -2 : 2 }}
                transition={{ repeat: Infinity, duration: 1, repeatType: 'reverse' }}
                className="flex items-center ml-3"
              >
                {trend === 'up' ? (
                  <TrendingUp className="text-green-400" size={20} />
                ) : (
                  <TrendingDown className="text-red-400" size={20} />
                )}
              </motion.div>
            )}
          </div>
        </div>

        {value !== null && !isLoading && (
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-gray-400">
              <span>Operating Range</span>
              <span className="font-mono">{threshold.min} - {threshold.max} {unit}</span>
            </div>
            
            <div className="relative">
              <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${Math.min(100, Math.max(0, 
                      ((value - threshold.min) / 
                        (threshold.max - threshold.min)) * 100
                    ))}%`
                  }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-3 rounded-full relative ${
                    isWarning 
                      ? 'bg-gradient-to-r from-red-500 to-orange-500' 
                      : `bg-gradient-to-r from-${color}-500 to-blue-500`
                  }`}
                >
                  <div className={`absolute inset-0 rounded-full blur-sm ${
                    isWarning 
                      ? 'bg-gradient-to-r from-red-400 to-orange-400' 
                      : `bg-gradient-to-r from-${color}-400 to-blue-400`
                  } opacity-60`} />
                </motion.div>
              </div>
            </div>

            <div className="flex justify-between text-xs text-gray-500 font-mono">
              <span>Min: {threshold.min}</span>
              <span>Max: {threshold.max}</span>
            </div>
          </div>
        )}

        {(value === null || value === undefined) && !isLoading && (
          <div className="mt-3 pt-3 border-t border-gray-700/50">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-400 rounded-full" />
              <span className="text-xs text-red-400">No Data Available</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};