import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MapPin, Leaf, ArrowRight, Building2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { greenhouseTopology } from '../data/greenhouseTopology';

export const FarmSelectionPage: React.FC = () => {
  const navigate = useNavigate();
  const { setSelectedFarm, setSelectedGreenhouse } = useApp();

  const handleGreenhouseSelect = (farm: any, greenhouse: any) => {
    setSelectedFarm(farm);
    setSelectedGreenhouse(greenhouse);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 relative overflow-hidden">
      {/* Subtle global background glow, matching theme */}
      <div className="absolute inset-0 z-0 opacity-10 bg-gradient-to-br from-green-500/10 via-blue-500/10 to-gray-900" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center space-x-4 mb-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="p-4 bg-green-500/20 rounded-2xl relative"
            >
              <Leaf className="text-green-400" size={48} />
              <div className="absolute inset-0 bg-green-500/30 rounded-2xl blur-lg" />
            </motion.div>
            <div>
              <h1 className="text-5xl font-bold text-white mb-2">GreenTechHaven</h1>
              <p className="text-green-400 font-mono text-lg">Smart Greenhouse Network</p>
            </div>
          </div>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto">
            Select a greenhouse from our network to monitor and control your IoT systems
          </p>
        </motion.div>

        {/* Farm Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {greenhouseTopology.map((farm, farmIndex) => (
            <motion.div
              key={farm.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: farmIndex * 0.1 }}
              className="bg-gray-800/50 border border-green-500/20 rounded-2xl p-6 backdrop-blur-sm hover:border-green-500/40 transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5" />
              
              {/* Farm Info */}
              <div className="relative z-10 mb-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-green-500/20 rounded-lg">
                    <Building2 className="text-green-400" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{farm.name}</h3>
                    <div className="flex items-center space-x-2 text-gray-400">
                      <MapPin size={16} />
                      <span className="text-sm font-mono">{farm.location}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    <span>{farm.greenhouses.length} Greenhouse{farm.greenhouses.length > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full" />
                    <span>Active</span>
                  </div>
                </div>
              </div>

              {/* Greenhouse List */}
              <div className="relative z-10 space-y-3">
                <p className="text-green-400 font-medium text-sm mb-3">Available Greenhouses:</p>
                {farm.greenhouses.map((greenhouse, ghIndex) => (
                  <motion.button
                    key={greenhouse.id}
                    whileHover={{ scale: 1.02, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleGreenhouseSelect(farm, greenhouse)}
                    className="w-full flex items-center justify-between p-3 bg-gray-700/50 rounded-xl border border-gray-600/50 hover:border-green-500/50 transition-all duration-300 group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <Leaf className="text-green-400" size={16} />
                      </div>
                      <div>
                        <p className="text-white font-medium text-left">{greenhouse.name}</p>
                        <p className="text-gray-400 text-sm text-left">Ready for monitoring</p>
                      </div>
                    </div>
                    <ArrowRight
                      className="text-green-400 group-hover:translate-x-1 transition-transform duration-300"
                      size={20}
                    />
                  </motion.button>
                ))}
              </div>

              {/* Status Indicators */}
              <div className="relative z-10 mt-6 pt-4 border-t border-gray-700/50">
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center">
                    <div className="w-3 h-3 bg-green-400 rounded-full mx-auto mb-1 animate-pulse" />
                    <p className="text-xs text-gray-400">Sensors</p>
                  </div>
                  <div className="text-center">
                    <div className="w-3 h-3 bg-blue-400 rounded-full mx-auto mb-1 animate-pulse" />
                    <p className="text-xs text-gray-400">Network</p>
                  </div>
                  <div className="text-center">
                    <div className="w-3 h-3 bg-green-400 rounded-full mx-auto mb-1 animate-pulse" />
                    <p className="text-xs text-gray-400">Control</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 text-gray-400"
        >
          <p className="text-sm">
            Powered by GreenTechHaven IoT Network • Real-time monitoring and control
          </p>
        </motion.div>
      </div>
    </div>
  );
};