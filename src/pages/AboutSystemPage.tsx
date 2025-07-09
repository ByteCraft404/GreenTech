import React from 'react';
import { motion } from 'framer-motion';
import { 
  Info,
  Leaf,
  Thermometer,
  Droplets,
  Sprout,
  Sun,
  Fan,
  Waves,
  Lightbulb,
  Zap,
  Shield,
  Activity,
  BarChart3,
  Bell,
  Settings,
  Cpu,
  Wifi
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AboutSystemPage: React.FC = () => {
  const { selectedFarm, selectedGreenhouse } = useApp();

  const features = [
    {
      icon: Thermometer,
      title: 'Temperature Control',
      description: 'Monitors ambient temperature with automated ventilation control to maintain optimal growing conditions.',
      color: '#EF4444'
    },
    {
      icon: Droplets,
      title: 'Humidity Management',
      description: 'Tracks humidity levels and triggers misting systems to ensure proper moisture balance.',
      color: '#3B82F6'
    },
    {
      icon: Sprout,
      title: 'Soil Monitoring',
      description: 'Measures soil moisture content and activates irrigation systems when needed.',
      color: '#10B981'
    },
    {
      icon: Sun,
      title: 'Light Optimization',
      description: 'Monitors light intensity and controls supplemental LED grow lights for photosynthesis.',
      color: '#F59E0B'
    },
    {
      icon: Fan,
      title: 'Ventilation System',
      description: 'Automated fan control for air circulation and temperature regulation.',
      color: '#6B7280'
    },
    {
      icon: Waves,
      title: 'Irrigation Control',
      description: 'Smart water pump management for efficient plant watering schedules.',
      color: '#06B6D4'
    },
    {
      icon: Lightbulb,
      title: 'LED Grow Lights',
      description: 'Programmable lighting system to supplement natural sunlight.',
      color: '#F59E0B'
    },
    {
      icon: Bell,
      title: 'Alert System',
      description: 'Real-time notifications when environmental parameters exceed safe thresholds.',
      color: '#EF4444'
    }
  ];

  const specifications = [
    { label: 'Sensor Update Rate', value: '15 seconds' },
    { label: 'Temperature Range', value: '-10°C to 50°C' },
    { label: 'Humidity Range', value: '0% to 100%' },
    { label: 'Light Measurement', value: '0 to 2000 lux' },
    { label: 'Soil Moisture', value: '0% to 100%' },
    { label: 'Power Consumption', value: '< 50W' },
    { label: 'Connectivity', value: 'WiFi, Ethernet' },
    { label: 'Operating System', value: 'Linux/Raspberry Pi' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">About System</h1>
          <div className="flex items-center space-x-2">
            <Info className="text-purple-400" size={20} />
            <span className="text-gray-400">
              {selectedFarm?.name} • {selectedGreenhouse?.name}
            </span>
          </div>
        </div>
      </motion.div>

      {/* System Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900 rounded-2xl p-8 shadow-2xl border border-green-500/30 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-blue-500/5" />
        
        <div className="relative z-10">
          <div className="flex items-center space-x-4 mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="p-4 bg-green-500/20 rounded-2xl relative"
            >
              <Leaf className="text-green-400" size={40} />
              <div className="absolute inset-0 bg-green-500/30 rounded-2xl blur-lg" />
            </motion.div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">GreenTechHaven IoT Control Hub</h2>
              <p className="text-green-400 text-lg font-mono">Advanced Greenhouse Automation Platform</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">System Description</h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                The GreenTechHaven IoT Control Hub is a comprehensive greenhouse automation system designed to optimize plant growth conditions through intelligent monitoring and control. Using advanced sensors and automated actuators, the system maintains ideal environmental parameters while minimizing resource consumption and maximizing crop yield.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Built with modern web technologies and IoT protocols, the system provides real-time monitoring, historical data analysis, and predictive maintenance capabilities. The intuitive dashboard allows operators to monitor multiple greenhouse zones, set custom thresholds, and receive instant alerts when intervention is required.
              </p>
            </div>
            
            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/50">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                <Cpu className="text-blue-400" size={20} />
                <span>Key Benefits</span>
              </h3>
              <ul className="space-y-3">
                {[
                  'Automated climate control reduces manual intervention',
                  'Real-time monitoring prevents crop damage',
                  'Data-driven insights optimize growing conditions',
                  'Energy-efficient operation reduces costs',
                  'Scalable architecture supports multiple zones',
                  'Remote access enables off-site management'
                ].map((benefit, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3 text-gray-300"
                  >
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    <span>{benefit}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-3xl font-bold text-white mb-8 text-center">System Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gray-900 rounded-xl p-6 shadow-2xl border border-gray-700/50 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800/30 to-gray-700/30 group-hover:from-gray-700/40 group-hover:to-gray-600/40 transition-all duration-300" />
                
                <div className="relative z-10">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="p-3 rounded-xl mb-4 inline-block"
                    style={{ backgroundColor: `${feature.color}20` }}
                  >
                    <Icon size={28} style={{ color: feature.color }} />
                  </motion.div>
                  
                  <h3 className="font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Technical Specifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-900 rounded-2xl p-8 shadow-2xl border border-blue-500/30 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5" />
          
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="p-3 bg-blue-500/20 rounded-xl"
              >
                <Settings className="text-blue-400" size={24} />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-white">Technical Specifications</h2>
                <p className="text-gray-400">System capabilities and limits</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {specifications.map((spec, index) => (
                <motion.div
                  key={spec.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  className="flex justify-between items-center p-4 bg-gray-800/50 rounded-lg border border-gray-700/50"
                >
                  <span className="text-gray-300 font-medium">{spec.label}</span>
                  <span className="text-blue-400 font-mono">{spec.value}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-900 rounded-2xl p-8 shadow-2xl border border-purple-500/30 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5" />
          
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-6">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="p-3 bg-purple-500/20 rounded-xl"
              >
                <Shield className="text-purple-400" size={24} />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-white">Safety & Reliability</h2>
                <p className="text-gray-400">Built-in protection systems</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-white mb-3">Safety Features</h3>
                <ul className="space-y-2">
                  {[
                    'Automatic emergency shutdown protocols',
                    'Redundant sensor validation',
                    'Fail-safe actuator controls',
                    'Power surge protection'
                  ].map((item, index) => (
                    <li key={index} className="flex items-center space-x-2 text-gray-300">
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-bold text-white mb-3">Reliability</h3>
                <ul className="space-y-2">
                  {[
                    '99.9% uptime guarantee',
                    'Automatic data backup',
                    'Self-diagnostic capabilities',
                    '24/7 monitoring support'
                  ].map((item, index) => (
                    <li key={index} className="flex items-center space-x-2 text-gray-300">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Architecture Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gray-900 rounded-2xl p-8 shadow-2xl border border-green-500/30 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-blue-500/5" />
        
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="p-3 bg-green-500/20 rounded-xl"
            >
              <Wifi className="text-green-400" size={28} />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold text-white">System Architecture</h2>
              <p className="text-gray-400">How everything works together</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <motion.div
                animate={{ y: [-5, 5, -5] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="p-6 bg-blue-500/20 rounded-2xl mb-4 inline-block"
              >
                <Activity className="text-blue-400" size={40} />
              </motion.div>
              <h3 className="font-bold text-white mb-2">Sensor Layer</h3>
              <p className="text-gray-400 text-sm">
                Environmental sensors collect real-time data on temperature, humidity, soil moisture, and light levels.
              </p>
            </div>
            
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="p-6 bg-green-500/20 rounded-2xl mb-4 inline-block"
              >
                <Cpu className="text-green-400" size={40} />
              </motion.div>
              <h3 className="font-bold text-white mb-2">Control Layer</h3>
              <p className="text-gray-400 text-sm">
                Microcontroller processes sensor data and makes intelligent decisions about actuator control.
              </p>
            </div>
            
            <div className="text-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="p-6 bg-purple-500/20 rounded-2xl mb-4 inline-block"
              >
                <BarChart3 className="text-purple-400" size={40} />
              </motion.div>
              <h3 className="font-bold text-white mb-2">Interface Layer</h3>
              <p className="text-gray-400 text-sm">
                Web dashboard provides real-time monitoring, historical analysis, and remote control capabilities.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center"
      >
        <p className="text-gray-400 text-sm">
          GreenTechHaven IoT Control Hub v1.0.0 - Built with React, TypeScript, and modern IoT technologies
        </p>
        <p className="text-gray-500 text-xs mt-2">
          © 2024 GreenTechHaven Systems. Optimizing agriculture through intelligent automation.
        </p>
      </motion.div>
    </div>
  );
};