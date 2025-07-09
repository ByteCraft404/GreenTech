import React from 'react';
import { motion } from 'framer-motion';
import { Construction, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, description, icon }) => {
  const navigate = useNavigate();
  const { selectedFarm, selectedGreenhouse } = useApp();

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">{title}</h1>
          <div className="flex items-center space-x-2">
            {icon}
            <span className="text-gray-400">
              {selectedFarm?.name} • {selectedGreenhouse?.name}
            </span>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/dashboard')}
          className="bg-green-500/20 border border-green-500/30 rounded-lg px-4 py-2 text-green-400 hover:bg-green-500/30 transition-all duration-300 flex items-center space-x-2"
        >
          <ArrowLeft size={16} />
          <span>Back to Dashboard</span>
        </motion.button>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center min-h-96 bg-gray-800/30 border border-green-500/20 rounded-2xl backdrop-blur-sm"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="p-8 bg-yellow-500/20 rounded-2xl mb-6 relative"
        >
          <Construction className="text-yellow-400" size={64} />
          <div className="absolute inset-0 bg-yellow-500/30 rounded-2xl blur-lg" />
        </motion.div>
        <h2 className="text-2xl font-bold text-white mb-4">Page Under Development</h2>
        <p className="text-gray-400 text-center max-w-md mb-8">
          {description} This feature is coming soon to enhance your greenhouse management experience.
        </p>
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/dashboard')}
            className="bg-green-500/20 border border-green-500/30 rounded-lg px-6 py-3 text-green-400 hover:bg-green-500/30 transition-all duration-300"
          >
            Return to Dashboard
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-6 py-3 text-gray-400 hover:bg-gray-700/70 transition-all duration-300"
          >
            Learn More
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};