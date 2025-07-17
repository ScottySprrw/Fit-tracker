import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon, MinusIcon, CheckIcon } from '@heroicons/react/24/outline';
import InfoIcon from './InfoIcon.jsx';
import RepeatLastSetButton from './RepeatLastSetButton.jsx';

const ExerciseCard = ({ 
  exercise, 
  workoutExercise, 
  lastPerformance,
  onUpdateExercise,
  onAddSet,
  onUpdateSet,
  onRemoveSet
}) => {
  const [newSet, setNewSet] = useState({
    weight: '',
    reps: '',
    duration: '',
    rpe: ''
  });

  const handleNewSetChange = (field, value) => {
    setNewSet(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddSet = () => {
    const setData = {
      weight: parseFloat(newSet.weight) || 0,
      reps: parseInt(newSet.reps) || 0,
      duration: newSet.duration ? parseInt(newSet.duration) : null,
      rpe: newSet.rpe ? parseInt(newSet.rpe) : null
    };
    
    onAddSet(setData);
    setNewSet({ weight: '', reps: '', duration: '', rpe: '' });
  };

  const handleRepeatLastSet = (lastSet) => {
    setNewSet({
      weight: lastSet.weight.toString(),
      reps: lastSet.reps.toString(),
      duration: lastSet.duration ? lastSet.duration.toString() : '',
      rpe: lastSet.rpe ? lastSet.rpe.toString() : ''
    });
  };

  const handleSetToggle = (setId, completed) => {
    onUpdateSet(setId, { completed: !completed });
  };

  const isNewSetValid = () => {
    return (newSet.weight && newSet.reps) || newSet.duration;
  };

  const getLastUsedText = () => {
    if (!lastPerformance || !lastPerformance.sets.length) return null;
    
    const lastSet = lastPerformance.sets[lastPerformance.sets.length - 1];
    const parts = [];
    
    if (lastSet.weight > 0) parts.push(`${lastSet.weight} lbs`);
    if (lastSet.reps > 0) parts.push(`${lastSet.reps} reps`);
    if (lastSet.duration) parts.push(`${lastSet.duration}s`);
    
    return parts.join(' × ');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-card p-6 shadow-soft border border-neutral-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold text-neutral-900">{exercise.name}</h3>
            <InfoIcon 
              content={exercise.tips || exercise.instructions || "No additional information available"}
              position="bottom"
            />
          </div>
          {getLastUsedText() && (
            <p className="text-sm text-neutral-500 mt-1">
              Last used: {getLastUsedText()}
            </p>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-pill ${
            exercise.type === 'strength' ? 'bg-blue-100 text-blue-800' :
            exercise.type === 'cardio' ? 'bg-green-100 text-green-800' :
            'bg-purple-100 text-purple-800'
          }`}>
            {exercise.type}
          </span>
        </div>
      </div>

      {/* Target Information */}
      {(workoutExercise.targetSets || workoutExercise.targetReps || workoutExercise.targetWeight) && (
        <div className="bg-surface-secondary rounded-lg p-3 mb-4">
          <div className="text-sm text-neutral-600">
            <span className="font-medium">Target: </span>
            {workoutExercise.targetSets && `${workoutExercise.targetSets} sets`}
            {workoutExercise.targetReps && ` × ${workoutExercise.targetReps} reps`}
            {workoutExercise.targetWeight && ` @ ${workoutExercise.targetWeight} lbs`}
          </div>
        </div>
      )}

      {/* Completed Sets */}
      {workoutExercise.sets && workoutExercise.sets.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-neutral-700 mb-2">Completed Sets</h4>
          <div className="space-y-2">
            {workoutExercise.sets.map((set, index) => (
              <motion.div
                key={set.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  set.completed 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-surface-secondary border-neutral-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleSetToggle(set.id, set.completed)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      set.completed 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : 'border-neutral-300 hover:border-accent-500'
                    }`}
                  >
                    {set.completed && <CheckIcon className="w-4 h-4" />}
                  </button>
                  
                  <span className="text-sm font-medium text-neutral-700">
                    Set {index + 1}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-neutral-600">
                  {set.weight > 0 && <span>{set.weight} lbs</span>}
                  {set.reps > 0 && <span>{set.reps} reps</span>}
                  {set.duration && <span>{set.duration}s</span>}
                  {set.rpe && <span>RPE {set.rpe}</span>}
                  
                  <button
                    onClick={() => onRemoveSet(set.id)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <MinusIcon className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Set */}
      <div className="border-t border-neutral-200 pt-4">
        <h4 className="text-sm font-medium text-neutral-700 mb-3">Add New Set</h4>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
          <div>
            <label className="block text-xs text-neutral-500 mb-1">Weight (lbs)</label>
            <input
              type="number"
              value={newSet.weight}
              onChange={(e) => handleNewSetChange('weight', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
              placeholder="0"
              min="0"
              step="0.5"
            />
          </div>
          
          <div>
            <label className="block text-xs text-neutral-500 mb-1">Reps</label>
            <input
              type="number"
              value={newSet.reps}
              onChange={(e) => handleNewSetChange('reps', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
              placeholder="0"
              min="0"
            />
          </div>
          
          <div>
            <label className="block text-xs text-neutral-500 mb-1">Duration (s)</label>
            <input
              type="number"
              value={newSet.duration}
              onChange={(e) => handleNewSetChange('duration', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
              placeholder="0"
              min="0"
            />
          </div>
          
          <div>
            <label className="block text-xs text-neutral-500 mb-1">RPE (1-10)</label>
            <input
              type="number"
              value={newSet.rpe}
              onChange={(e) => handleNewSetChange('rpe', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
              placeholder="0"
              min="1"
              max="10"
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <RepeatLastSetButton
            lastSet={lastPerformance?.sets?.[lastPerformance.sets.length - 1]}
            onRepeat={handleRepeatLastSet}
          />
          
          <motion.button
            onClick={handleAddSet}
            disabled={!isNewSetValid()}
            className={`
              inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg
              transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2
              ${isNewSetValid() 
                ? 'bg-accent-500 text-white hover:bg-accent-600' 
                : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
              }
            `}
            whileHover={isNewSetValid() ? { scale: 1.02 } : {}}
            whileTap={isNewSetValid() ? { scale: 0.98 } : {}}
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Set
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ExerciseCard;