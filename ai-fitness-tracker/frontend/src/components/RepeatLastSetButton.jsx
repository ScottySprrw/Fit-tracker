import React from 'react';
import { motion } from 'framer-motion';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

const RepeatLastSetButton = ({ 
  lastSet, 
  onRepeat, 
  disabled = false,
  className = ''
}) => {
  if (!lastSet) return null;

  const handleClick = () => {
    if (!disabled && onRepeat) {
      onRepeat(lastSet);
    }
  };

  const formatLastSet = () => {
    const parts = [];
    
    if (lastSet.weight > 0) {
      parts.push(`${lastSet.weight} lbs`);
    }
    
    if (lastSet.reps > 0) {
      parts.push(`${lastSet.reps} reps`);
    }
    
    if (lastSet.duration) {
      parts.push(`${lastSet.duration}s`);
    }
    
    return parts.length > 0 ? parts.join(' × ') : 'Repeat';
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={`
        inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg
        transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2
        ${disabled 
          ? 'text-neutral-400 bg-neutral-100 cursor-not-allowed' 
          : 'text-accent-600 bg-accent-50 hover:bg-accent-100 hover:text-accent-700'
        }
        ${className}
      `}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
    >
      <ArrowPathIcon className="w-4 h-4 mr-2" />
      <span>Repeat: {formatLastSet()}</span>
    </motion.button>
  );
};

export default RepeatLastSetButton;