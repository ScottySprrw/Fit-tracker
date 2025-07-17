import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { formatWorkoutDate } from '../utils/formatDate.js';
import KPIChip from './KPIChip.jsx';
import useClientStore from '../store/useClientStore.js';

const ClientCard = ({ client, stats, recentKPIs = [] }) => {
  const navigate = useNavigate();
  const { addWorkoutLog } = useClientStore();

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getAvatarColor = (name) => {
    const colors = [
      'bg-red-500',
      'bg-orange-500',
      'bg-yellow-500',
      'bg-green-500',
      'bg-blue-500',
      'bg-indigo-500',
      'bg-purple-500',
      'bg-pink-500'
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  const handleCardClick = () => {
    // Create a new workout for this client
    const newWorkout = addWorkoutLog({
      clientId: client.id,
      name: `Workout - ${new Date().toLocaleDateString()}`,
      date: new Date().toISOString(),
      exercises: []
    });
    
    // Navigate to the workout detail page
    navigate(`/workout/${newWorkout.id}`);
  };

  const handleMetricsClick = (e) => {
    e.stopPropagation();
    navigate(`/metrics/${client.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleCardClick}
      className="bg-white rounded-card p-6 shadow-soft hover:shadow-medium transition-all duration-200 cursor-pointer border border-neutral-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {/* Avatar */}
          <div className={`
            w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold
            ${getAvatarColor(client.name)}
          `}>
            {getInitials(client.name)}
          </div>
          
          <div>
            <h3 className="font-semibold text-neutral-900 text-lg">{client.name}</h3>
            <p className="text-sm text-neutral-500">
              {client.age && `${client.age} years old`}
            </p>
          </div>
        </div>
        
        {/* Tags */}
        {client.tags && client.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {client.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs font-medium bg-surface-tertiary text-neutral-600 rounded-pill"
              >
                {tag}
              </span>
            ))}
            {client.tags.length > 2 && (
              <span className="px-2 py-1 text-xs font-medium bg-surface-tertiary text-neutral-600 rounded-pill">
                +{client.tags.length - 2}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Goals */}
      {client.goals && (
        <div className="mb-4">
          <p className="text-sm text-neutral-600 line-clamp-2">{client.goals}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-neutral-900">{stats?.completedWorkouts || 0}</div>
          <div className="text-xs text-neutral-500">Workouts</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-neutral-900">{stats?.totalSets || 0}</div>
          <div className="text-xs text-neutral-500">Sets</div>
        </div>
      </div>

      {/* Recent KPIs */}
      {recentKPIs.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {recentKPIs.slice(0, 3).map((kpi) => (
              <KPIChip
                key={kpi.id}
                label={kpi.kpiType}
                value={kpi.value}
                unit={kpi.unit}
                size="small"
                variant="accent"
              />
            ))}
          </div>
        </div>
      )}

      {/* Mini Sparkline Placeholder */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-neutral-500 mb-2">
          <span>Progress</span>
          <span>Last 30 days</span>
        </div>
        <div className="h-8 bg-gradient-to-r from-accent-100 to-accent-200 rounded-lg flex items-end justify-center">
          <div className="text-xs text-accent-700 font-medium">+12%</div>
        </div>
      </div>

      {/* Last Workout */}
      {stats?.lastWorkoutDate && (
        <div className="text-xs text-neutral-500 mb-4">
          Last workout: {formatWorkoutDate(stats.lastWorkoutDate)}
        </div>
      )}

      {/* Actions */}
      <div className="flex space-x-2">
        <motion.button
          onClick={handleCardClick}
          className="flex-1 bg-accent-500 text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-accent-600 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          View Workouts
        </motion.button>
        <motion.button
          onClick={handleMetricsClick}
          className="bg-surface-secondary text-neutral-700 text-sm font-medium py-2 px-4 rounded-lg hover:bg-surface-tertiary transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Metrics
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ClientCard;