import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Power, Loader2, Zap, Activity, Fan, Waves, Sun } from 'lucide-react';
import { apiService } from '../services/api'; // Ensure this path is correct

interface DeviceControlCardProps {
  device: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}

// Helper function to safely parse dates, especially from Spring Boot's LocalDateTime
const parseBackendDate = (dateInput: string | number[] | null): Date | null => {
  if (!dateInput) {
    return null;
  }

  // If it's already an ISO string (like "2025-07-11T22:13:36.123")
  if (typeof dateInput === 'string') {
    try {
      const date = new Date(dateInput);
      // Check if the date is valid after parsing
      if (!isNaN(date.getTime())) {
        return date;
      }
    } catch (e) {
      console.warn("Failed to parse ISO string date:", dateInput, e);
    }
  } 
  // If it's an array of numbers (e.g., [2025, 7, 11, 22, 13, 36, 123456789])
  else if (Array.isArray(dateInput) && dateInput.every(num => typeof num === 'number')) {
    // Note: Month in Date constructor is 0-indexed (January is 0, December is 11)
    // LocalDateTime array usually gives 1-indexed month.
    // Also, nanoseconds (last element) might need to be converted to milliseconds.
    const [year, month, day, hour, minute, second, nano] = dateInput;
    try {
      const milliseconds = nano ? Math.floor(nano / 1_000_000) : 0; // Convert nanoseconds to milliseconds
      const date = new Date(year, month - 1, day, hour, minute, second, milliseconds);
      if (!isNaN(date.getTime())) {
        return date;
      }
    } catch (e) {
      console.warn("Failed to parse number array date:", dateInput, e);
    }
  }
  
  return null;
};

const formatTimeAgo = (isoString: string): string => {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.round(diffMs / 1000);
  const diffMinutes = Math.round(diffSeconds / 60);
  const diffHours = Math.round(diffMinutes / 60);
  const diffDays = Math.round(diffHours / 24);

  if (diffSeconds < 60) return `${diffSeconds} seconds ago`;
  if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays >= 1) return `${diffDays} days ago`;
  return 'just now';
};

const deviceDescriptions: { [key: string]: string } = {
  fan: 'Controls greenhouse ventilation and air circulation to manage temperature and humidity.',
  pump: 'Manages irrigation and nutrient delivery to plants via the automated watering system.',
  light: 'Provides supplemental LED lighting for optimal plant growth cycles and photosynthesis.',
};

export const DeviceControlCard: React.FC<DeviceControlCardProps> = ({
  device,
  name,
  icon,
  color
}) => {
  const [isOn, setIsOn] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchStatus = async () => {
    try {
      const callTimestamp = new Date();
      const statusResponse = await apiService.getActuatorStatus(device);

      if (statusResponse) {
        if (statusResponse.status === 'on') {
          setIsOn(true);
        } else if (statusResponse.status === 'off') {
          setIsOn(false);
        } else {
          // If status is 'unknown' or null, treat it as off for interaction purposes
          setIsOn(false); 
        }

        // Use the new parseBackendDate helper for 'time'
        const parsedTime = parseBackendDate(statusResponse.time);
        if (parsedTime) {
          setLastUpdated(parsedTime.toISOString());
        } else {
          setLastUpdated(callTimestamp.toISOString()); // Fallback to client timestamp
        }
      } else {
        console.warn(`Invalid or null status response for ${device}. Setting to disconnected.`);
        setIsOn(null); // Set to null on invalid or missing status
        setLastUpdated(''); // Clear last updated if status is unknown
      }
    } catch (error) {
      console.error('Error fetching device status:', error);
      setIsOn(null); // Set to null on error to indicate disconnected/unknown
      setLastUpdated(''); // Clear last updated on error
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 15000);
    return () => clearInterval(interval);
  }, [device]);

  const handleToggle = async () => {
    if (isLoading || isOn === null) {
      console.log(`Cannot toggle ${name}: ${isOn === null ? 'unavailable' : 'currently loading'}`);
      return;
    }

    setIsLoading(true);
    // Variable renamed to newStatus for clarity
    const newStatus = isOn ? 'off' : 'on'; 

    try {
      // Pass 'status' to the controlActuator method, matching the updated api.ts interface
      const success = await apiService.controlActuator({ device, status: newStatus });
      if (success) {
        setIsOn(!isOn);
        setLastUpdated(new Date().toISOString());
        setTimeout(fetchStatus, 1000); // Re-fetch status quickly to confirm actual state
      } else {
        console.error(`API reported failure to control ${name}. Reverting optimistic update.`);
        setIsOn(isOn); // Revert optimistic update
        fetchStatus(); // Re-fetch status to get actual state
      }
    } catch (error) {
      console.error(`Error controlling device ${name}:`, error);
      setIsOn(isOn); // Revert optimistic update
      fetchStatus(); // Re-fetch status to get actual state
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  const isDisconnected = isOn === null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 }}
      className={`
        bg-gray-900 rounded-2xl p-8 shadow-2xl border
        transition-all duration-500 relative overflow-hidden
        ${isOn
          ? `border-${color}-500/50 shadow-lg shadow-${color}-500/20`
          : 'border-gray-700/50 hover:border-gray-600/50'
        }
        ${isDisconnected ? 'opacity-40' : ''}
      `}
    >
      {isDisconnected && (
        <div className="absolute inset-0 bg-gray-950/70 flex items-center justify-center z-20 cursor-not-allowed pointer-events-none">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="text-red-500 flex flex-col items-center text-center"
          >
            <Zap size={48} className="mb-2 animate-pulse" />
            <span className="text-xl font-bold">Device Unavailable</span>
            <span className="text-sm text-gray-400">Status unknown or not connected.</span>
          </motion.div>
        </div>
      )}

      {isOn && !isDisconnected && (
        <motion.div
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className={`absolute inset-0 bg-${color}-500/10 rounded-2xl`}
        />
      )}

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <motion.div
            animate={{
              rotate: isOn && device === 'fan' ? 360 : 0,
              scale: isOn ? [1, 1.1, 1] : 1
            }}
            transition={{
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1, repeat: Infinity }
            }}
            className={`p-4 rounded-2xl relative ${
              isOn ? `bg-${color}-500/30` : 'bg-gray-700/50'
            }`}
          >
            {React.cloneElement(icon as React.ReactElement, {
              size: 40,
              className: `${
                isOn ? `text-${color}-400` : 'text-gray-400'
              } drop-shadow-lg`
            })}
            {isOn && (
              <div className={`absolute inset-0 bg-${color}-500/40 rounded-2xl blur-md`} />
            )}
          </motion.div>

          <div className="text-right">
            <div className={`text-2xl font-bold font-mono ${
              isOn ? `text-${color}-400` : 'text-gray-500'
            }`}>
              {isDisconnected ? 'N/A' : (isOn ? 'ON' : 'OFF')}
            </div>
            {lastUpdated && !isDisconnected ? (
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Activity size={12} />
                <span>{formatTimeAgo(lastUpdated)}</span>
              </div>
            ) : (
              !isDisconnected && ( // Only show "No recent data" if not disconnected entirely
                <div className="text-xs text-gray-500">
                  No recent data
                </div>
              )
            )}
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold text-white mb-2">{name}</h3>
          <p className="text-gray-400 mb-4">{deviceDescriptions[device] || 'No description available.'}</p>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
              <p className="text-xs text-gray-400 mb-1">Power Status</p>
              <p className={`font-mono text-sm ${
                isOn ? `text-${color}-400` : 'text-gray-500'
              }`}>
                {isDisconnected ? 'UNKNOWN' : (isOn ? 'ACTIVE' : 'STANDBY')}
              </p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
              <p className="text-xs text-gray-400 mb-1">Last Sync</p>
              <p className="font-mono text-sm text-blue-400">
                {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleToggle}
          disabled={isLoading || isDisconnected}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 relative overflow-hidden ${
            isOn
              ? 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-500 hover:to-red-600 shadow-lg shadow-red-500/30'
              : 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-500 hover:to-green-600 shadow-lg shadow-green-500/30'
          } ${isDisconnected ? 'cursor-not-allowed' : 'cursor-pointer'} disabled:opacity-50`}
        >
          {isLoading && (
            <motion.div
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="absolute inset-0 bg-white/20 rounded-xl"
            />
          )}
          <div className="relative z-10 flex items-center justify-center space-x-3">
            {isLoading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Zap size={20} />
            )}
            <span>
              {isLoading ? 'Processing...' : isOn ? 'Turn OFF' : 'Turn ON'}
            </span>
          </div>
        </motion.button>
      </div>
    </motion.div>
  );
};
