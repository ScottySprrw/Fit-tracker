import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, ViewColumnsIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
import ClientCard from '../components/ClientCard.jsx';
import TagFilter from '../components/TagFilter.jsx';
import useClientStore from '../store/useClientStore.js';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const { 
    clients, 
    selectedTags, 
    setSelectedTags,
    getFilteredClients,
    getClientStats,
    getKPIMeasurementsByClient
  } = useClientStore();

  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const filteredClients = useMemo(() => {
    return getFilteredClients();
  }, [clients, selectedTags, getFilteredClients]);

  const allTags = useMemo(() => {
    const tagSet = new Set();
    clients.forEach(client => {
      client.tags?.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [clients]);

  const handleNewClient = () => {
    navigate('/user-profile');
  };

  const handleTagFilterChange = (tags) => {
    setSelectedTags(tags);
  };

  const getClientCardData = (client) => {
    const stats = getClientStats(client.id);
    const kpis = getKPIMeasurementsByClient(client.id);
    const recentKPIs = kpis
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3);

    return { stats, recentKPIs };
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-surface-primary"
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-neutral-900 mb-2">
              Client Dashboard
            </h1>
            <p className="text-lg text-neutral-600">
              Manage and track your clients' fitness progress
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="flex items-center space-x-2">
              <motion.button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-accent-500 text-white' 
                    : 'bg-surface-secondary text-neutral-600 hover:bg-surface-tertiary'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Squares2X2Icon className="w-5 h-5" />
              </motion.button>
              <motion.button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-accent-500 text-white' 
                    : 'bg-surface-secondary text-neutral-600 hover:bg-surface-tertiary'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ViewColumnsIcon className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Filters and Actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 space-y-4 md:space-y-0"
        >
          <div className="flex items-center space-x-4">
            <TagFilter
              availableTags={allTags}
              selectedTags={selectedTags}
              onSelectionChange={handleTagFilterChange}
              placeholder="Filter by tags"
            />
            
            <div className="text-sm text-neutral-600">
              {filteredClients.length} of {clients.length} clients
            </div>
          </div>
          
          <motion.button
            onClick={handleNewClient}
            className="inline-flex items-center px-6 py-3 bg-accent-500 text-white font-medium rounded-lg hover:bg-accent-600 transition-colors shadow-soft"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            New Client
          </motion.button>
        </motion.div>

        {/* Clients Grid/List */}
        {filteredClients.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className={`
              ${viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                : 'space-y-4'
              }
            `}
          >
            {filteredClients.map((client, index) => {
              const { stats, recentKPIs } = getClientCardData(client);
              
              return (
                <motion.div
                  key={client.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  <ClientCard
                    client={client}
                    stats={stats}
                    recentKPIs={recentKPIs}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-2xl font-semibold text-neutral-900 mb-2">
              {clients.length === 0 ? 'No clients yet' : 'No clients match your filters'}
            </h3>
            <p className="text-neutral-600 mb-8 max-w-md mx-auto">
              {clients.length === 0 
                ? 'Get started by creating your first client profile to begin tracking their fitness journey.'
                : 'Try adjusting your filters or create a new client profile.'
              }
            </p>
            <motion.button
              onClick={handleNewClient}
              className="inline-flex items-center px-6 py-3 bg-accent-500 text-white font-medium rounded-lg hover:bg-accent-600 transition-colors shadow-soft"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Create First Client
            </motion.button>
          </motion.div>
        )}

        {/* Stats Summary */}
        {clients.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6"
          >
            <div className="bg-white rounded-card p-6 shadow-soft border border-neutral-200 text-center">
              <div className="text-3xl font-bold text-accent-600 mb-2">
                {clients.length}
              </div>
              <div className="text-sm text-neutral-600">Total Clients</div>
            </div>
            
            <div className="bg-white rounded-card p-6 shadow-soft border border-neutral-200 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {clients.reduce((total, client) => {
                  const stats = getClientStats(client.id);
                  return total + stats.completedWorkouts;
                }, 0)}
              </div>
              <div className="text-sm text-neutral-600">Completed Workouts</div>
            </div>
            
            <div className="bg-white rounded-card p-6 shadow-soft border border-neutral-200 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {clients.reduce((total, client) => {
                  const stats = getClientStats(client.id);
                  return total + stats.totalSets;
                }, 0)}
              </div>
              <div className="text-sm text-neutral-600">Total Sets</div>
            </div>
            
            <div className="bg-white rounded-card p-6 shadow-soft border border-neutral-200 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {allTags.length}
              </div>
              <div className="text-sm text-neutral-600">Active Tags</div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ClientDashboard;