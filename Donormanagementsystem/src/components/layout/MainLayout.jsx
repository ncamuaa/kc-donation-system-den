import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

export function MainLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-900 flex">
      <Sidebar collapsed={isSidebarCollapsed} />
      <div className="flex-1 flex flex-col min-w-0 bg-gradient-to-b from-white via-blue-50/40 to-white">
        <Navbar onToggleSidebar={() => setIsSidebarCollapsed(prev => !prev)} />
        <main className="flex-1 w-full p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
