import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Search, Menu, Command } from 'lucide-react';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';

interface HeaderProps {
  title: string;
  onMenuClick?: () => void;
}

export function Header({ title, onMenuClick }: HeaderProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  useKeyboardShortcuts();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-sm border-b border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden transition-all duration-200"
          >
            <Menu className="w-6 h-6" />
          </button>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="ml-4 text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent lg:ml-0"
          >
            {title}
          </motion.h1>
        </div>

        <div className="flex items-center space-x-4">
          {/* Search */}
          <motion.div
            className="relative"
            whileFocus={{ scale: 1.02 }}
          >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar... (Ctrl+/)"
              className={`pl-10 pr-12 py-2 border-2 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm transition-all duration-300 focus:outline-none ${
                searchFocused
                  ? 'border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 w-80'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 w-64'
              }`}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1 text-xs text-gray-400">
              <Command className="w-3 h-3" />
              <span>/</span>
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200"
          >
            <Bell className="w-6 h-6" />
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-lg"
            />
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}