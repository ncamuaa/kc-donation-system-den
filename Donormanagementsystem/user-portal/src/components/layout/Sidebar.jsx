import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, HeartHandshake, Megaphone, BarChart3, LogOut, Mail } from 'lucide-react';
import { cn } from '../../lib/utils';
import logo from '../../assets/image-removebg-preview.png';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Donors', href: '/donors', icon: Users },
  { name: 'Donations', href: '/donations', icon: HeartHandshake },
  { name: 'Projects', href: '/campaigns', icon: Megaphone },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Communications', href: '/communications', icon: Mail },
];

export function Sidebar() {
  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
      <div className="flex items-center justify-center h-24 border-b border-gray-200 px-6">
        <img 
          src={logo} 
          alt="Knowledge Channel Foundation" 
          className="h-20 w-auto object-contain"
        />
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-3 space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors border-l-2 border-l-transparent',
                  isActive
                    ? 'bg-primary-50 text-primary-700 border-l-primary-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                )
              }
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0 transition-colors',
                  'text-gray-400 group-hover:text-gray-500',
                  // isActive && 'text-primary-600' // NavLink handles isActive, but we can pass state if needed. 
                  // Actually NavLink render prop is cleaner.
                )}
                aria-hidden="true"
              />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t border-gray-200">
        <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 hover:text-gray-900">
          <LogOut className="mr-3 h-5 w-5 text-gray-400" />
          Sign out
        </button>
      </div>
    </div>
  );
}
