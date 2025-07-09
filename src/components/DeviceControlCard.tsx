import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
// Ensure all necessary Lucide-React icons are imported for the new UI
import { Power, Loader2, CheckCircle, XCircle, Zap, Activity, Lightbulb, Fan, Waves, Sun } from 'lucide-react';
import { apiService } from '../services/api';

interface DeviceControlCardProps {
  device: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}

// Helper to format time (re-added as it's part of the new UI's data display)
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
  // Fallback for very old dates or errors
  if (diffDays >= 1) return `${diffDays} days ago`;
  return 'just now'; // For very recent updates
};

// Internal descriptions for each device, part of the new UI's content
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
      const callTimestamp = new Date(); // Record time of API call
      const status = await apiService.getActuatorStatus(device);
      if (status) {
        setIsOn(status.status === 'on');
        // Use backend timestamp if available, otherwise use the call timestamp
        setLastUpdated(new Date(status.timestamp || callTimestamp).toISOString());
      } else {
        // If status is null/undefined, treat as unknown/disconnected
        setIsOn(null);
        setLastUpdated(''); // Clear last updated if status is unknown
      }
    } catch (error) {
      console.error('Error fetching device status:', error);
      setIsOn(null); // Set to null on error to indicate disconnected/unknown
      setLastUpdated(''); // Clear last updated on error
    }
  };

  useEffect(() => {
    fetchStatus(); // Initial fetch on component mount
    const interval = setInterval(fetchStatus, 15000); // Refresh every 15 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, [device]); // Dependency array ensures effect runs if 'device' prop changes

  const handleToggle = async () => {
    if (isLoading || isOn === null) {
      // Prevent toggle if an operation is already in progress or if the device status is unknown
      console.log(`Cannot toggle ${name}: ${isOn === null ? 'unavailable' : 'currently loading'}`);
      return;
    }

    setIsLoading(true); // Indicate loading state
    const action = isOn ? 'off' : 'on'; // Determine action based on current state

    try {
      const success = await apiService.controlActuator({ device, action });
      if (success) {
        // Optimistic update: Assume success and update UI immediately for responsiveness
        setIsOn(!isOn);
        setLastUpdated(new Date().toISOString()); // Update timestamp to now

        // After a short delay, fetch the actual status to confirm
        setTimeout(fetchStatus, 1000);
      } else {
        console.error(`API reported failure to control ${name}. Reverting optimistic update.`);
        // If API explicitly indicates failure, revert UI and force re-fetch
        setIsOn(isOn); // Revert to previous state
        fetchStatus();
      }
    } catch (error) {
      console.error(`Error controlling device ${name}:`, error);
      // On network error, revert UI and force re-fetch
      setIsOn(isOn);
      fetchStatus();
    } finally {
      // Ensure isLoading is reset after a small delay, allowing optimistic update to render
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  // Logic to determine if the card should appear "disconnected" (grayed out with overlay)
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
        ${isDisconnected ? 'opacity-40 pointer-events-none' : ''} /* Adjusted: opacity but no grayscale, pointer-events-none to disable hover */
      `}
    >
      {/* Overlay for "Device Unavailable" when status is unknown/null */}
      {isDisconnected && (
        <div className="absolute inset-0 bg-gray-950/70 flex items-center justify-center z-20 cursor-not-allowed">
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

      {/* Status indicator glow (visible when ON and NOT disconnected) */}
      {isOn && !isDisconnected && (
        <motion.div
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className={`absolute inset-0 bg-${color}-500/10 rounded-2xl`}
        />
      )}

      <div className="relative z-10">
        {/* Header section: Icon and ON/OFF status */}
        <div className="flex items-center justify-between mb-8">
          <motion.div
            animate={{
              // Rotate fan icon when active, other icons might pulse
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
            {/* Clone the icon prop to apply dynamic size and class, maintaining original icon choice */}
            {React.cloneElement(icon as React.ReactElement, {
              size: 40, // Larger size for the new design
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
              {/* Display "N/A" or "UNKNOWN" if disconnected, otherwise ON/OFF */}
              {isDisconnected ? 'N/A' : (isOn ? 'ON' : 'OFF')}
            </div>
            {lastUpdated && !isDisconnected && ( // Show last updated only if connected and data exists
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <Activity size={12} />
                <span>{formatTimeAgo(lastUpdated)}</span>
              </div>
            )}
            {/* Display message if no recent data or disconnected */}
            {(!lastUpdated || isDisconnected) && (
              <div className="text-xs text-gray-500">
                 {isDisconnected ? '' : 'No recent data'}
              </div>
            )}
          </div>
        </div>

        {/* Device Info section: Name, Description, Power Status, Last Sync */}
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

        {/* Control Button section */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleToggle}
          disabled={isLoading || isDisconnected} // Button is disabled if loading or disconnected
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 relative overflow-hidden ${
            isOn
              ? 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-500 hover:to-red-600 shadow-lg shadow-red-500/30'
              : 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-500 hover:to-green-600 shadow-lg shadow-green-500/30'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {/* Loading overlay for button */}
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