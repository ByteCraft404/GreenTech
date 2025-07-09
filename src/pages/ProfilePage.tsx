import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Calendar, Edit3, Save, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export const ProfilePage: React.FC = () => {
  const { selectedFarm, selectedGreenhouse } = useApp();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.name || 'System Operator',
    email: user?.email || 'operator@greentechhaven.com',
    phone: '+254 700 123 456',
    location: 'Nairobi, Kenya',
    role: 'Senior Greenhouse Operator',
    joinDate: '2023-01-15',
    department: 'Agricultural Operations',
    experience: '5+ years'
  });

  const handleSave = () => {
    // TODO: Save to backend
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original values
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">User Profile</h1>
          <div className="flex items-center space-x-2">
            <User className="text-cyan-400" size={20} />
            <span className="text-gray-400">
              {selectedFarm?.name} • {selectedGreenhouse?.name}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {isEditing ? (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCancel}
                className="bg-gray-500/20 border border-gray-500/30 rounded-lg px-4 py-2 text-gray-400 hover:bg-gray-500/30 transition-all duration-300 flex items-center space-x-2"
              >
                <X size={16} />
                <span>Cancel</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSave}
                className="bg-green-500/20 border border-green-500/30 rounded-lg px-4 py-2 text-green-400 hover:bg-green-500/30 transition-all duration-300 flex items-center space-x-2"
              >
                <Save size={16} />
                <span>Save Changes</span>
              </motion.button>
            </>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsEditing(true)}
              className="bg-blue-500/20 border border-blue-500/30 rounded-lg px-4 py-2 text-blue-400 hover:bg-blue-500/30 transition-all duration-300 flex items-center space-x-2"
            >
              <Edit3 size={16} />
              <span>Edit Profile</span>
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-900 rounded-2xl p-8 shadow-2xl border border-cyan-500/30 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5" />
        
        <div className="relative z-10">
          <div className="flex items-center space-x-6 mb-8">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="w-24 h-24 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full flex items-center justify-center border border-cyan-500/30"
            >
              <User className="text-cyan-400" size={40} />
            </motion.div>
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">{profile.name}</h2>
              <p className="text-cyan-400 text-lg font-medium">{profile.role}</p>
              <p className="text-gray-400">{profile.department}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50"
                  />
                ) : (
                  <div className="flex items-center space-x-3 p-3 bg-gray-800/30 rounded-lg">
                    <User className="text-cyan-400" size={20} />
                    <span className="text-white">{profile.name}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50"
                  />
                ) : (
                  <div className="flex items-center space-x-3 p-3 bg-gray-800/30 rounded-lg">
                    <Mail className="text-cyan-400" size={20} />
                    <span className="text-white">{profile.email}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50"
                  />
                ) : (
                  <div className="flex items-center space-x-3 p-3 bg-gray-800/30 rounded-lg">
                    <Phone className="text-cyan-400" size={20} />
                    <span className="text-white">{profile.phone}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Location
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500/50"
                  />
                ) : (
                  <div className="flex items-center space-x-3 p-3 bg-gray-800/30 rounded-lg">
                    <MapPin className="text-cyan-400" size={20} />
                    <span className="text-white">{profile.location}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-800/30 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4">Professional Information</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Role:</span>
                    <span className="text-white">{profile.role}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Department:</span>
                    <span className="text-white">{profile.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Experience:</span>
                    <span className="text-white">{profile.experience}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Join Date:</span>
                    <span className="text-white">{new Date(profile.joinDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/30 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4">Activity Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Last Login:</span>
                    <span className="text-green-400 font-mono">Today, 09:15</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Sessions:</span>
                    <span className="text-blue-400 font-mono">247</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Commands Executed:</span>
                    <span className="text-purple-400 font-mono">1,523</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Alerts Handled:</span>
                    <span className="text-yellow-400 font-mono">89</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-800/30 border border-green-500/20 rounded-2xl p-6 backdrop-blur-sm"
      >
        <h2 className="text-xl font-semibold text-white mb-4">Preferences</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-bold text-white mb-3">Notifications</h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-gray-300">Email alerts</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-gray-300">SMS notifications</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-gray-300">Push notifications</span>
              </label>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-white mb-3">Display</h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-gray-300">Dark theme</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-gray-300">Animations</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-gray-300">Compact view</span>
              </label>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-white mb-3">Data</h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-gray-300">Auto-refresh</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-gray-300">Data export</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-gray-300">Advanced metrics</span>
              </label>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};