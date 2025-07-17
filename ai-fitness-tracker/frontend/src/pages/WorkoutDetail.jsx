import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { PlusIcon, CheckIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import ExerciseCard from '../components/ExerciseCard.jsx';
import useClientStore from '../store/useClientStore.js';
import { COMMON_EXERCISES } from '../utils/schema.js';

const WorkoutDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    getWorkoutById,
    getClientById,
    updateWorkoutLog,
    addExerciseToWorkout,
    updateWorkoutExercise,
    addSetToExercise,
    updateExerciseSet,
    removeSetFromExercise,
    getExerciseHistory,
    getLastExercisePerformance
  } = useClientStore();

  const [workout, setWorkout] = useState(null);
  const [client, setClient] = useState(null);
  const [isCompleting, setIsCompleting] = useState(false);
  const [showExerciseSelector, setShowExerciseSelector] = useState(false);

  useEffect(() => {
    const workoutData = getWorkoutById(parseInt(id));
    if (workoutData) {
      setWorkout(workoutData);
      const clientData = getClientById(workoutData.clientId);
      setClient(clientData);
    }
  }, [id, getWorkoutById, getClientById]);

  const handleExerciseUpdate = (exerciseId, updates) => {
    updateWorkoutExercise(workout.id, exerciseId, updates);
    // Refresh workout data
    const updatedWorkout = getWorkoutById(workout.id);
    setWorkout(updatedWorkout);
  };

  const handleAddSet = (exerciseId, setData) => {
    addSetToExercise(workout.id, exerciseId, setData);
    // Refresh workout data
    const updatedWorkout = getWorkoutById(workout.id);
    setWorkout(updatedWorkout);
  };

  const handleUpdateSet = (exerciseId, setId, updates) => {
    updateExerciseSet(workout.id, exerciseId, setId, updates);
    // Refresh workout data
    const updatedWorkout = getWorkoutById(workout.id);
    setWorkout(updatedWorkout);
  };

  const handleRemoveSet = (exerciseId, setId) => {
    removeSetFromExercise(workout.id, exerciseId, setId);
    // Refresh workout data
    const updatedWorkout = getWorkoutById(workout.id);
    setWorkout(updatedWorkout);
  };

  const handleAddExercise = (exercise) => {
    const exerciseData = {
      exerciseId: exercise.id,
      exercise: exercise,
      sets: [],
      targetSets: 3,
      targetReps: 10,
      targetWeight: 0,
      order: workout.exercises.length
    };
    
    addExerciseToWorkout(workout.id, exerciseData);
    // Refresh workout data
    const updatedWorkout = getWorkoutById(workout.id);
    setWorkout(updatedWorkout);
    setShowExerciseSelector(false);
  };

  const handleCompleteWorkout = async () => {
    setIsCompleting(true);
    
    try {
      // Update workout status
      updateWorkoutLog(workout.id, {
        status: 'completed',
        duration: Math.floor((new Date() - new Date(workout.createdAt)) / 1000 / 60) // minutes
      });
      
      // Simulate completion delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate back to client dashboard
      navigate('/client-dashboard');
    } catch (error) {
      console.error('Error completing workout:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  const getCompletionPercentage = () => {
    if (!workout || workout.exercises.length === 0) return 0;
    
    const totalSets = workout.exercises.reduce((total, exercise) => 
      total + exercise.sets.length, 0
    );
    
    const completedSets = workout.exercises.reduce((total, exercise) => 
      total + exercise.sets.filter(set => set.completed).length, 0
    );
    
    return totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;
  };

  if (!workout || !client) {
    return (
      <div className="min-h-screen bg-surface-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500 mx-auto mb-4" />
          <p className="text-lg text-neutral-600">Loading workout...</p>
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
                {workout.name}
              </h1>
              <p className="text-lg text-neutral-600">
                {client.name} • {new Date(workout.date).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-accent-600">
                {getCompletionPercentage()}%
              </div>
              <div className="text-sm text-neutral-500">Complete</div>
            </div>
            
            <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center">
              <div className="text-2xl">💪</div>
            </div>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <div className="w-full bg-neutral-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${getCompletionPercentage()}%` }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="bg-accent-500 h-2 rounded-full"
            />
          </div>
        </motion.div>

        {/* Exercises */}
        <div className="space-y-6 mb-8">
          {workout.exercises.map((workoutExercise, index) => {
            const lastPerformance = getLastExercisePerformance(client.id, workoutExercise.exercise.name);
            
            return (
              <motion.div
                key={workoutExercise.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
              >
                <ExerciseCard
                  exercise={workoutExercise.exercise}
                  workoutExercise={workoutExercise}
                  lastPerformance={lastPerformance}
                  onUpdateExercise={(updates) => handleExerciseUpdate(workoutExercise.id, updates)}
                  onAddSet={(setData) => handleAddSet(workoutExercise.id, setData)}
                  onUpdateSet={(setId, updates) => handleUpdateSet(workoutExercise.id, setId, updates)}
                  onRemoveSet={(setId) => handleRemoveSet(workoutExercise.id, setId)}
                />
              </motion.div>
            );
          })}
        </div>

        {/* Add Exercise Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="mb-8"
        >
          <motion.button
            onClick={() => setShowExerciseSelector(!showExerciseSelector)}
            className="w-full bg-white border-2 border-dashed border-neutral-300 rounded-card p-6 text-neutral-600 hover:border-accent-500 hover:text-accent-600 transition-colors"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <PlusIcon className="w-8 h-8 mx-auto mb-2" />
            <p className="font-medium">Add Exercise</p>
          </motion.button>
        </motion.div>

        {/* Exercise Selector */}
        {showExerciseSelector && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-card p-6 shadow-soft border border-neutral-200 mb-8"
          >
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Select Exercise
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {COMMON_EXERCISES.map((exercise) => (
                <motion.button
                  key={exercise.id}
                  onClick={() => handleAddExercise(exercise)}
                  className="p-4 text-left bg-surface-secondary hover:bg-surface-tertiary rounded-lg transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="font-medium text-neutral-900 mb-1">
                    {exercise.name}
                  </div>
                  <div className="text-sm text-neutral-600">
                    {exercise.muscleGroups.join(', ')}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Sticky Footer */}
      <div className="sticky bottom-0 bg-white border-t border-neutral-200 p-4 shadow-large">
        <div className="container mx-auto flex items-center justify-between">
          <div className="text-sm text-neutral-600">
            {workout.exercises.length} exercises • {getCompletionPercentage()}% complete
          </div>
          
          <motion.button
            onClick={handleCompleteWorkout}
            disabled={isCompleting}
            className={`
              inline-flex items-center px-6 py-3 font-medium rounded-lg transition-all
              ${isCompleting 
                ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed' 
                : 'bg-green-600 text-white hover:bg-green-700 shadow-soft'
              }
            `}
            whileHover={isCompleting ? {} : { scale: 1.02 }}
            whileTap={isCompleting ? {} : { scale: 0.98 }}
          >
            {isCompleting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-neutral-400 mr-2" />
                Completing...
              </>
            ) : (
              <>
                <CheckIcon className="w-5 h-5 mr-2" />
                Mark Complete
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default WorkoutDetail;