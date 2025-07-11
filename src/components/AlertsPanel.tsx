import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, X, Clock, Shield } from 'lucide-react';

interface Alert {
  id: string;
  type: 'error' | 'warning';
  sensorName: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
}


interface AlertsPanelProps {
  alerts: Alert[];
  onAcknowledge: (alertId: string) => Promise<void>;
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts, onAcknowledge }) => {
  const unacknowledgedAlerts = alerts.filter(alert => !alert.acknowledged);

  return (
    <div className="bg-gray-900 rounded-2xl p-6 shadow-2xl border border-red-500/30 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-orange-500/5" />
      
      <div className="relative z-10 flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <motion.div
            animate={{ 
              scale: unacknowledgedAlerts.length > 0 ? [1, 1.2, 1] : 1,
              rotate: unacknowledgedAlerts.length > 0 ? [0, 5, -5, 0] : 0
            }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="p-3 bg-red-500/20 rounded-xl relative"
          >
            <AlertTriangle className="text-red-400" size={28} />
            <div className="absolute inset-0 bg-red-500/30 rounded-xl blur-md" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold text-white">System Alerts</h2>
            <p className="text-gray-400">Security Monitor</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <motion.div
            animate={{ 
              scale: unacknowledgedAlerts.length > 0 ? [1, 1.1, 1] : 1,
              opacity: unacknowledgedAlerts.length > 0 ? [0.5, 1, 0.5] : 0.3
            }}
            transition={{ repeat: Infinity, duration: 2 }}
            className={`w-3 h-3 rounded-full ${
              unacknowledgedAlerts.length > 0 ? 'bg-red-500' : 'bg-green-500'
            }`}
          />
          <span className="text-sm text-gray-400 font-mono">
            {unacknowledgedAlerts.length} active
          </span>
        </div>
      </div>

      <div className="relative z-10 space-y-4 max-h-80 overflow-y-auto scrollbar-hide">
        <AnimatePresence>
          {alerts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="inline-block p-4 bg-green-500/20 rounded-full mb-4"
              >
                <Shield className="text-green-400" size={48} />
              </motion.div>
              <p className="text-gray-400 text-lg">All systems operating normally</p>
              <p className="text-gray-600 text-sm mt-2">No alerts detected</p>
            </motion.div>
          ) : (
            alerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.9 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl border-l-4 relative overflow-hidden ${
                  alert.type === 'error' 
                    ? 'border-red-500 bg-gradient-to-r from-red-900/30 to-red-800/20' 
                    : 'border-yellow-500 bg-gradient-to-r from-yellow-900/30 to-yellow-800/20'
                } ${alert.acknowledged ? 'opacity-60' : ''}`}
              >
                {/* Pulsing background for unacknowledged alerts */}
                {!alert.acknowledged && (
                  <motion.div
                    animate={{ opacity: [0.1, 0.3, 0.1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className={`absolute inset-0 ${
                      alert.type === 'error' ? 'bg-red-500/20' : 'bg-yellow-500/20'
                    }`}
                  />
                )}

                <div className="relative z-10 flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <motion.div
                        animate={{ 
                          rotate: !alert.acknowledged ? [0, 10, -10, 0] : 0,
                          scale: !alert.acknowledged ? [1, 1.1, 1] : 1
                        }}
                        transition={{ repeat: Infinity, duration: 1 }}
                      >
                        <AlertTriangle 
                          className={alert.type === 'error' ? 'text-red-400' : 'text-yellow-400'} 
                          size={20} 
                        />
                      </motion.div>
                      <span className="font-bold text-white text-lg">
                        {alert.sensorName}
                      </span>
                      {alert.acknowledged && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="p-1 bg-green-500/20 rounded-full"
                        >
                          <CheckCircle className="text-green-400" size={16} />
                        </motion.div>
                      )}
                    </div>
                    <p className="text-gray-300 mb-3 font-medium">{alert.message}</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500 font-mono">
                      <Clock size={12} />
                      <span>{new Date(alert.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                  
                  {!alert.acknowledged && (
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onAcknowledge(alert.id)}
                      className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all"
                    >
                      <X size={18} />
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};