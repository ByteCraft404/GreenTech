import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MapPin, Building2, Leaf } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { greenhouseTopology } from '../data/greenhouseTopology';

export const GreenhouseSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { selectedFarm, selectedGreenhouse, setSelectedFarm, setSelectedGreenhouse } = useApp();

  const handleSelection = (farm: any, greenhouse: any) => {
    setSelectedFarm(farm);
    setSelectedGreenhouse(greenhouse);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 bg-gray-800/50 border border-green-500/20 rounded-2xl p-4 backdrop-blur-sm hover:border-green-500/40 transition-all duration-300 min-w-80"
      >
        <div className="p-2 bg-green-500/20 rounded-lg">
          <Building2 className="text-green-400" size={20} />
        </div>
        <div className="flex-1 text-left">
          <p className="text-white font-medium">
            {selectedFarm?.name || 'Select Farm'}
          </p>
          <p className="text-gray-400 text-sm">
            {selectedGreenhouse?.name || 'No greenhouse selected'}
          </p>
        </div>
        <ChevronDown 
          className={`text-gray-400 transform transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
          size={20} 
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 left-0 right-0 bg-gray-800/95 border border-green-500/20 rounded-2xl backdrop-blur-sm z-50 max-h-96 overflow-y-auto"
          >
            <div className="p-4 space-y-3">
              {greenhouseTopology.map((farm) => (
                <div key={farm.id} className="space-y-2">
                  <div className="flex items-center space-x-2 px-3 py-2 bg-gray-700/30 rounded-lg">
                    <MapPin className="text-green-400" size={16} />
                    <span className="text-green-400 font-medium text-sm">{farm.name}</span>
                    <span className="text-gray-500 text-xs">({farm.location})</span>
                  </div>
                  {farm.greenhouses.map((greenhouse) => (
                    <motion.button
                      key={greenhouse.id}
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelection(farm, greenhouse)}
                      className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                        selectedGreenhouse?.id === greenhouse.id
                          ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                          : 'text-gray-300 hover:bg-gray-700/50'
                      }`}
                    >
                      <Leaf size={16} />
                      <span className="font-medium">{greenhouse.name}</span>
                    </motion.button>
                  ))}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};