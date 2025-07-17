import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import UserProfileForm from '../components/UserProfileForm.jsx';
import useClientStore from '../store/useClientStore.js';

const UserProfile = () => {
  const navigate = useNavigate();
  const { addClient } = useClientStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    
    try {
      // Add client to store
      const newClient = addClient(formData);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to client dashboard
      navigate('/client-dashboard');
    } catch (error) {
      console.error('Error creating client profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/client-dashboard');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-surface-primary via-surface-secondary to-surface-tertiary"
    >
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-neutral-900 mb-2">
            Create Client Profile
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Set up a comprehensive profile to track your client's fitness journey, 
            goals, and key performance indicators.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <UserProfileForm
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </div>

        {/* Loading Overlay */}
        {isSubmitting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-card p-8 shadow-large text-center"
            >
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500 mx-auto mb-4" />
              <p className="text-lg font-medium text-neutral-900">
                Creating client profile...
              </p>
              <p className="text-sm text-neutral-600 mt-2">
                Please wait while we set up the profile
              </p>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default UserProfile;