import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, ChartBarIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, CalendarIcon } from '@heroicons/react/24/outline';
import MetricsGraph from '../components/MetricsGraph.jsx';
import KPIChip from '../components/KPIChip.jsx';
import useClientStore from '../store/useClientStore.js';
import { formatDate } from '../utils/formatDate.js';
import { KPI_TYPES } from '../utils/schema.js';

const MetricsPage = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { 
    getClientById, 
    getKPIMeasurementsByClient, 
    getClientStats,
    getWorkoutsByClient 
  } = useClientStore();

  const [selectedKPI, setSelectedKPI] = useState('');
  const [timeRange, setTimeRange] = useState('30d');

  const client = getClientById(parseInt(clientId));
  const clientStats = getClientStats(parseInt(clientId));
  const allKPIMeasurements = getKPIMeasurementsByClient(parseInt(clientId));
  const workouts = getWorkoutsByClient(parseInt(clientId));

  // Filter KPI measurements based on time range
  const filteredMeasurements = useMemo(() => {
    const now = new Date();
    const cutoffDate = new Date();
    
    switch (timeRange) {
      case '7d':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        cutoffDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        cutoffDate.setDate(now.getDate() - 90);
        break;
      case '1y':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        cutoffDate.setDate(now.getDate() - 30);
    }

    return allKPIMeasurements.filter(measurement => 
      new Date(measurement.date) >= cutoffDate
    );
  }, [allKPIMeasurements, timeRange]);

  // Get KPI data for selected metric
  const selectedKPIData = useMemo(() => {
    if (!selectedKPI) return [];
    
    return filteredMeasurements
      .filter(measurement => measurement.kpiId === selectedKPI)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(measurement => ({
        date: measurement.date,
        value: measurement.value,
        unit: KPI_TYPES[selectedKPI]?.unit || ''
      }));
  }, [selectedKPI, filteredMeasurements]);

  // Get workout frequency data
  const workoutFrequencyData = useMemo(() => {
    const workoutsByDate = {};
    
    workouts.forEach(workout => {
      const date = new Date(workout.date).toISOString().split('T')[0];
      workoutsByDate[date] = (workoutsByDate[date] || 0) + 1;
    });

    return Object.entries(workoutsByDate)
      .map(([date, count]) => ({
        date,
        value: count,
        unit: ' workouts'
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [workouts]);

  // Calculate trend for selected KPI
  const calculateTrend = (data) => {
    if (data.length < 2) return { direction: 'neutral', percentage: 0 };
    
    const recent = data.slice(-5).reduce((sum, item) => sum + item.value, 0) / Math.min(5, data.length);
    const older = data.slice(0, Math.max(1, data.length - 5)).reduce((sum, item) => sum + item.value, 0) / Math.max(1, data.length - 5);
    
    const percentage = ((recent - older) / older) * 100;
    
    return {
      direction: percentage > 5 ? 'up' : percentage < -5 ? 'down' : 'neutral',
      percentage: Math.abs(percentage)
    };
  };

  const selectedKPITrend = calculateTrend(selectedKPIData);

  const handleKPISelect = (kpiId) => {
    setSelectedKPI(kpiId === selectedKPI ? '' : kpiId);
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  if (!client) {
    return (
      <div className="min-h-screen bg-surface-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500 mx-auto mb-4" />
          <p className="text-lg text-neutral-600">Loading client data...</p>
        </div>
      </div>
    );
  }

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
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={() => navigate('/client-dashboard')}
              className="p-2 text-neutral-600 hover:text-neutral-900 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeftIcon className="w-6 h-6" />
            </motion.button>
            
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">
                {client.name}'s Metrics
              </h1>
              <p className="text-lg text-neutral-600">
                Track progress and performance over time
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center">
              <ChartBarIcon className="w-8 h-8 text-accent-600" />
            </div>
          </div>
        </motion.div>

        {/* Time Range Selector */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex items-center space-x-2 mb-8"
        >
          <CalendarIcon className="w-5 h-5 text-neutral-500" />
          <span className="text-sm text-neutral-600 mr-2">Time Range:</span>
          {['7d', '30d', '90d', '1y'].map((range) => (
            <motion.button
              key={range}
              onClick={() => handleTimeRangeChange(range)}
              className={`px-3 py-1 text-sm font-medium rounded-pill transition-colors ${
                timeRange === range 
                  ? 'bg-accent-500 text-white' 
                  : 'bg-surface-secondary text-neutral-600 hover:bg-surface-tertiary'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {range}
            </motion.button>
          ))}
        </motion.div>

        {/* KPI Selection */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-neutral-900 mb-4">
            Key Performance Indicators
          </h2>
          <div className="flex flex-wrap gap-2">
            {client.selectedKPIs.map((kpiId) => (
              <KPIChip
                key={kpiId}
                kpiId={kpiId}
                isSelected={selectedKPI === kpiId}
                onClick={() => handleKPISelect(kpiId)}
              />
            ))}
          </div>
        </motion.div>

        {/* Main Chart */}
        {selectedKPI && selectedKPIData.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="mb-8"
          >
            <div className="bg-white rounded-card p-6 shadow-soft border border-neutral-200">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900">
                    {KPI_TYPES[selectedKPI]?.name || 'Selected Metric'}
                  </h3>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-accent-600">
                        {selectedKPIData[selectedKPIData.length - 1]?.value || 0}
                      </span>
                      <span className="text-sm text-neutral-500">
                        {KPI_TYPES[selectedKPI]?.unit || ''}
                      </span>
                    </div>
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-pill text-xs font-medium ${
                      selectedKPITrend.direction === 'up' ? 'bg-green-100 text-green-800' :
                      selectedKPITrend.direction === 'down' ? 'bg-red-100 text-red-800' :
                      'bg-neutral-100 text-neutral-600'
                    }`}>
                      {selectedKPITrend.direction === 'up' && <ArrowTrendingUpIcon className="w-3 h-3" />}
                      {selectedKPITrend.direction === 'down' && <ArrowTrendingDownIcon className="w-3 h-3" />}
                      <span>
                        {selectedKPITrend.direction === 'neutral' ? 'Stable' : 
                         `${selectedKPITrend.percentage.toFixed(1)}%`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <MetricsGraph
                title=""
                data={selectedKPIData}
                metric={KPI_TYPES[selectedKPI]?.name || 'Metric'}
                timeRange={timeRange}
                height={300}
                color="#3b82f6"
              />
            </div>
          </motion.div>
        )}

        {/* Secondary Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Workout Frequency */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <MetricsGraph
              title="Workout Frequency"
              data={workoutFrequencyData}
              metric="Workouts"
              highlightValue={clientStats.completedWorkouts}
              highlightLabel="total completed"
              timeRange={timeRange}
              height={200}
              color="#10b981"
            />
          </motion.div>

          {/* Performance Summary */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.6 }}
            className="bg-white rounded-card p-6 shadow-soft border border-neutral-200"
          >
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Performance Summary
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600">Total Workouts</span>
                <span className="font-semibold text-neutral-900">
                  {clientStats.completedWorkouts}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600">Total Sets</span>
                <span className="font-semibold text-neutral-900">
                  {clientStats.totalSets}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600">Total Reps</span>
                <span className="font-semibold text-neutral-900">
                  {clientStats.totalReps}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600">Average Workout Duration</span>
                <span className="font-semibold text-neutral-900">
                  {clientStats.averageWorkoutDuration || 0}m
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600">KPI Measurements</span>
                <span className="font-semibold text-neutral-900">
                  {allKPIMeasurements.length}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* KPI Grid */}
        {client.selectedKPIs.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.7 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {client.selectedKPIs.map((kpiId) => {
              const kpiData = filteredMeasurements.filter(m => m.kpiId === kpiId);
              const latestValue = kpiData[kpiData.length - 1]?.value || 0;
              const trend = calculateTrend(kpiData.map(d => ({ value: d.value })));
              
              return (
                <div
                  key={kpiId}
                  className="bg-white rounded-card p-6 shadow-soft border border-neutral-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-neutral-900">
                      {KPI_TYPES[kpiId]?.name || 'Unknown KPI'}
                    </h3>
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-pill text-xs font-medium ${
                      trend.direction === 'up' ? 'bg-green-100 text-green-800' :
                      trend.direction === 'down' ? 'bg-red-100 text-red-800' :
                      'bg-neutral-100 text-neutral-600'
                    }`}>
                      {trend.direction === 'up' && <ArrowTrendingUpIcon className="w-3 h-3" />}
                      {trend.direction === 'down' && <ArrowTrendingDownIcon className="w-3 h-3" />}
                      <span>
                        {trend.direction === 'neutral' ? 'Stable' : 
                         `${trend.percentage.toFixed(1)}%`}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-3xl font-bold text-accent-600 mb-2">
                    {latestValue}
                    <span className="text-sm text-neutral-500 ml-1">
                      {KPI_TYPES[kpiId]?.unit || ''}
                    </span>
                  </div>
                  
                  <div className="text-sm text-neutral-600">
                    {kpiData.length} measurements in {timeRange}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* Empty State */}
        {client.selectedKPIs.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-2xl font-semibold text-neutral-900 mb-2">
              No KPIs Selected
            </h3>
            <p className="text-neutral-600 mb-8 max-w-md mx-auto">
              This client hasn't selected any key performance indicators yet. 
              Edit their profile to add metrics to track.
            </p>
            <motion.button
              onClick={() => navigate('/user-profile')}
              className="inline-flex items-center px-6 py-3 bg-accent-500 text-white font-medium rounded-lg hover:bg-accent-600 transition-colors shadow-soft"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Edit Profile
            </motion.button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default MetricsPage;