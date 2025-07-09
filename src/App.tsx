import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { FarmSelectionPage } from './pages/FarmSelectionPage';
import { Dashboard } from './pages/Dashboard';
import { ControlPanel } from './pages/ControlPanel';
import { SensorHistory } from './pages/SensorHistory';
import { AlertsPage } from './pages/AlertsPage';
import { ThresholdsPage } from './pages/ThresholdsPage';
import { DiagnosticsPage } from './pages/DiagnosticsPage';
import { AboutSystemPage } from './pages/AboutSystemPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <Routes>
            {/* Farm Selection (Root) */}
            <Route path="/" element={<FarmSelectionPage />} />
            
            {/* Authentication Routes (Hidden/Dormant) */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            
            {/* Main Application Routes */}
            <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
            <Route path="/control" element={<Layout><ControlPanel /></Layout>} />
            <Route path="/history" element={<Layout><SensorHistory /></Layout>} />
            <Route path="/alerts" element={<Layout><AlertsPage /></Layout>} />
            <Route path="/thresholds" element={<Layout><ThresholdsPage /></Layout>} />
            <Route path="/diagnostics" element={<Layout><DiagnosticsPage /></Layout>} />
            <Route path="/about" element={<Layout><AboutSystemPage /></Layout>} />
            <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
            <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;