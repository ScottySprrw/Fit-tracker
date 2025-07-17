import React from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  HomeIcon, 
  UserGroupIcon, 
  ChartBarIcon, 
  CogIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import useClientStore from '../store/useClientStore.js';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { clients } = useClientStore();

  const navigation = [
    { name: 'Dashboard', href: '/client-dashboard', icon: HomeIcon },
    { name: 'Clients', href: '/client-dashboard', icon: UserGroupIcon },
    { name: 'Analytics', href: '/client-dashboard', icon: ChartBarIcon },
    { name: 'Settings', href: '/user-profile', icon: CogIcon }
  ];

  const isCurrentPath = (path) => {
    return location.pathname === path || location.pathname.startsWith(path);
  };

  const handleNavigation = (href) => {
    navigate(href);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-surface-primary">
      {/* Mobile menu */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: mobileMenuOpen ? 0 : '-100%' }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 lg:hidden"
      >
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setMobileMenuOpen(false)} />
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: mobileMenuOpen ? 0 : '-100%' }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 bottom-0 w-80 bg-white shadow-xl"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-accent-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">💪</span>
              </div>
              <h1 className="text-xl font-bold text-neutral-900">FitTracker</h1>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          
          <nav className="px-6 py-4">
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <button
                    onClick={() => handleNavigation(item.href)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isCurrentPath(item.href)
                        ? 'bg-accent-100 text-accent-600 font-medium'
                        : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="px-6 py-4 border-t border-neutral-200">
            <div className="text-sm text-neutral-600">
              <p className="font-medium mb-1">Quick Stats</p>
              <p>{clients.length} active clients</p>
              <p>Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-50 lg:block lg:w-80 lg:overflow-y-auto lg:bg-white lg:border-r lg:border-neutral-200">
        <div className="flex h-16 shrink-0 items-center px-6 border-b border-neutral-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-accent-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">💪</span>
            </div>
            <h1 className="text-xl font-bold text-neutral-900">FitTracker</h1>
          </div>
        </div>
        
        <nav className="flex-1 px-6 py-4">
          <ul className="space-y-2">
            {navigation.map((item) => (
              <li key={item.name}>
                <button
                  onClick={() => handleNavigation(item.href)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isCurrentPath(item.href)
                      ? 'bg-accent-100 text-accent-600 font-medium'
                      : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="px-6 py-4 border-t border-neutral-200">
          <div className="text-sm text-neutral-600">
            <p className="font-medium mb-1">Quick Stats</p>
            <p>{clients.length} active clients</p>
            <p>Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-80">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-neutral-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-neutral-700 lg:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Separator */}
          <div className="h-6 w-px bg-neutral-200 lg:hidden" aria-hidden="true" />

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-neutral-500">
                  {location.pathname === '/client-dashboard' ? 'Dashboard' :
                   location.pathname === '/user-profile' ? 'New Client' :
                   location.pathname.includes('/workout/') ? 'Workout Session' :
                   location.pathname.includes('/metrics/') ? 'Client Metrics' :
                   'FitTracker'}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center">
                  <span className="text-accent-600 font-medium text-sm">T</span>
                </div>
                <span className="text-sm font-medium text-neutral-900">Trainer</span>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="min-h-[calc(100vh-4rem)]"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Layout;