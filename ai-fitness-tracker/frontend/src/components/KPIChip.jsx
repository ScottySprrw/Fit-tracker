import React from 'react';
import { motion } from 'framer-motion';
import { KPI_TYPES } from '../utils/schema.js';

const KPIChip = ({ 
  kpiId, 
  isSelected = false, 
  onClick,
  size = 'medium',
  variant = 'default'
}) => {
  const kpiType = KPI_TYPES[kpiId];
  
  if (!kpiType) {
    return null;
  }

  const sizeClasses = {
    small: 'px-2 py-1 text-xs',
    medium: 'px-3 py-1.5 text-sm',
    large: 'px-4 py-2 text-base'
  };

  const getVariantClasses = () => {
    if (isSelected) {
      return 'bg-accent-500 text-white border-accent-500';
    }
    
    switch (variant) {
      case 'accent':
        return 'bg-accent-100 text-accent-700 border-accent-200';
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'danger':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-surface-secondary text-neutral-700 border-neutral-200';
    }
  };

  const chipContent = (
    <div className={`
      inline-flex items-center justify-center rounded-pill border transition-all duration-200
      ${sizeClasses[size]}
      ${getVariantClasses()}
      ${onClick ? 'cursor-pointer hover:shadow-soft' : ''}
    `}>
      <span className="font-medium">{kpiType.emoji}</span>
      <span className="ml-2 font-medium">{kpiType.name}</span>
    </div>
  );

  if (onClick) {
    return (
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 rounded-pill"
      >
        {chipContent}
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      {chipContent}
    </motion.div>
  );
};

export default KPIChip;