import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { KPI_TYPES, KPI_LABELS } from '../utils/schema.js';

const UserProfileForm = ({ initialData = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    age: initialData?.age || '',
    goals: initialData?.goals || '',
    injuries: initialData?.injuries || '',
    selectedKPIs: initialData?.selectedKPIs || [],
    tags: initialData?.tags || []
  });

  const [errors, setErrors] = useState({});

  const kpiOptions = Object.entries(KPI_TYPES).map(([key, value]) => ({
    id: value,
    label: KPI_LABELS[value],
    description: getKPIDescription(value)
  }));

  function getKPIDescription(kpiType) {
    const descriptions = {
      [KPI_TYPES.ONE_RM]: 'Maximum weight lifted for one repetition',
      [KPI_TYPES.VO2_MAX]: 'Maximum oxygen consumption during exercise',
      [KPI_TYPES.MOVEMENT_SCORE]: 'Overall movement quality assessment',
      [KPI_TYPES.BODY_COMPOSITION]: 'Body fat percentage and muscle mass',
      [KPI_TYPES.ENDURANCE]: 'Cardiovascular and muscular endurance',
      [KPI_TYPES.FLEXIBILITY]: 'Range of motion and joint mobility',
      [KPI_TYPES.STRENGTH]: 'Overall strength capacity',
      [KPI_TYPES.POWER]: 'Explosive power and speed'
    };
    return descriptions[kpiType] || '';
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleKPIToggle = (kpiId) => {
    setFormData(prev => ({
      ...prev,
      selectedKPIs: prev.selectedKPIs.includes(kpiId)
        ? prev.selectedKPIs.filter(id => id !== kpiId)
        : [...prev.selectedKPIs, kpiId]
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (formData.age && (formData.age < 1 || formData.age > 120)) {
      newErrors.age = 'Age must be between 1 and 120';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white/80 backdrop-blur-sm rounded-card p-6 shadow-soft border border-neutral-200"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-neutral-900">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 transition-colors ${
                  errors.name ? 'border-red-500' : 'border-neutral-300'
                }`}
                placeholder="Enter client name"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-neutral-700 mb-1">
                Age
              </label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 transition-colors ${
                  errors.age ? 'border-red-500' : 'border-neutral-300'
                }`}
                placeholder="Age"
                min="1"
                max="120"
              />
              {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 transition-colors ${
                  errors.email ? 'border-red-500' : 'border-neutral-300'
                }`}
                placeholder="client@example.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 transition-colors"
                placeholder="(555) 123-4567"
              />
            </div>
          </div>
        </div>

        {/* Goals */}
        <div>
          <label htmlFor="goals" className="flex items-center text-sm font-medium text-neutral-700 mb-2">
            <span className="mr-2">💡</span>
            Goals
          </label>
          <textarea
            id="goals"
            name="goals"
            value={formData.goals}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 transition-colors"
            placeholder="e.g., Build muscle, lose weight, improve endurance..."
          />
        </div>

        {/* Injuries */}
        <div>
          <label htmlFor="injuries" className="flex items-center text-sm font-medium text-neutral-700 mb-2">
            <span className="mr-2">🦴</span>
            Injuries & Limitations
          </label>
          <textarea
            id="injuries"
            name="injuries"
            value={formData.injuries}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 transition-colors"
            placeholder="e.g., Lower back pain, knee issues, shoulder mobility..."
          />
        </div>

        {/* KPIs */}
        <div>
          <label className="flex items-center text-sm font-medium text-neutral-700 mb-4">
            <span className="mr-2">📈</span>
            Key Performance Indicators
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {kpiOptions.map((kpi) => (
              <motion.button
                key={kpi.id}
                type="button"
                onClick={() => handleKPIToggle(kpi.id)}
                className={`p-3 rounded-pill text-left transition-all duration-200 ${
                  formData.selectedKPIs.includes(kpi.id)
                    ? 'bg-accent-500 text-white shadow-medium'
                    : 'bg-surface-secondary text-neutral-700 hover:bg-surface-tertiary'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="font-medium">{kpi.label}</div>
                <div className="text-sm opacity-80">{kpi.description}</div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-200">
          {onCancel && (
            <motion.button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 text-neutral-600 hover:text-neutral-800 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>
          )}
          <motion.button
            type="submit"
            className="px-6 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors shadow-soft"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {initialData ? 'Update Profile' : 'Create Profile'}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default UserProfileForm;