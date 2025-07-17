import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

const InfoIcon = ({ 
  content, 
  position = 'top',
  size = 'medium',
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6'
  };

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  const arrowClasses = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-neutral-800',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-neutral-800',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-neutral-800',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-neutral-800'
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <motion.button
        type="button"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        className={`
          text-neutral-400 hover:text-neutral-600 transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 rounded-full
          ${sizeClasses[size]}
        `}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <InformationCircleIcon className="w-full h-full" />
      </motion.button>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            className={`
              absolute z-50 ${positionClasses[position]}
              bg-neutral-800 text-white text-sm rounded-lg px-3 py-2 shadow-large
              max-w-xs whitespace-normal pointer-events-none
            `}
          >
            {content}
            <div
              className={`
                absolute w-0 h-0 border-4 ${arrowClasses[position]}
              `}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InfoIcon;