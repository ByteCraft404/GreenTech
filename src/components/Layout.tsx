import React, { useState } from 'react';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900/10 to-gray-900">
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <div className="md:ml-80 min-h-screen">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};