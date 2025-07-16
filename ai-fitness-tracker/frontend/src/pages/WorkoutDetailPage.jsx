import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';

const WorkoutDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getLastExerciseEntry, addExerciseProgress } = useStore();
  
  const [workout, setWorkout] = useState(null);
  const [exerciseData, setExerciseData] = useState({});

  useEffect(() => {
    // Mock workout data - in real app, this would come from API
    const mockWorkout = {
      id: parseInt(id),
      name: id === '1' ? 'Upper Body Strength' : 'Lower Body Power',
      date: '2024-01-15',
      status: 'in_progress',
      exercises: id === '1' ? [
        { name: 'Bench Press', sets: 3, targetReps: 8, targetWeight: 135 },
        { name: 'Pull-ups', sets: 3, targetReps: 10, targetWeight: 0 },
        { name: 'Overhead Press', sets: 3, targetReps: 6, targetWeight: 95 }
      ] : [
        { name: 'Squats', sets: 4, targetReps: 8, targetWeight: 185 },
        { name: 'Deadlifts', sets: 3, targetReps: 5, targetWeight: 225 },
        { name: 'Lunges', sets: 3, targetReps: 12, targetWeight: 25 }
      ]
    };
    
    setWorkout(mockWorkout);
    
    // Initialize exercise data with default values
    const initialData = {};
    mockWorkout.exercises.forEach((exercise, index) => {
      initialData[index] = {
        actualSets: exercise.sets,
        actualReps: exercise.targetReps,
        actualWeight: exercise.targetWeight
      };
    });
    setExerciseData(initialData);
  }, [id]);

  const handleExerciseChange = (exerciseIndex, field, value) => {
    setExerciseData(prev => ({
      ...prev,
      [exerciseIndex]: {
        ...prev[exerciseIndex],
        [field]: parseFloat(value) || 0
      }
    }));
  };

  const handleCompleteWorkout = () => {
    // Save progress for each exercise
    workout.exercises.forEach((exercise, index) => {
      const data = exerciseData[index];
      if (data.actualWeight > 0) {
        addExerciseProgress(
          exercise.name,
          data.actualWeight,
          data.actualReps,
          data.actualSets
        );
      }
    });
    
    alert('Workout completed and progress saved!');
    navigate('/');
  };

  if (!workout) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading workout...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{workout.name}</h1>
          <p className="text-gray-600">{workout.date}</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="text-gray-500 hover:text-gray-700"
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="space-y-6">
        {workout.exercises.map((exercise, index) => {
          const lastEntry = getLastExerciseEntry(exercise.name);
          const currentData = exerciseData[index] || {};
          
          return (
            <div key={index} className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{exercise.name}</h3>
                  {lastEntry && (
                    <p className="text-sm text-gray-500">
                      Last used: {lastEntry.weight} lbs × {lastEntry.reps} reps
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Target</p>
                  <p className="font-medium">
                    {exercise.sets} sets × {exercise.targetReps} reps @ {exercise.targetWeight} lbs
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sets Completed
                  </label>
                  <input
                    type="number"
                    value={currentData.actualSets || ''}
                    onChange={(e) => handleExerciseChange(index, 'actualSets', e.target.value)}
                    className="input-field"
                    min="0"
                    max="10"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reps per Set
                  </label>
                  <input
                    type="number"
                    value={currentData.actualReps || ''}
                    onChange={(e) => handleExerciseChange(index, 'actualReps', e.target.value)}
                    className="input-field"
                    min="0"
                    max="50"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight (lbs)
                  </label>
                  <input
                    type="number"
                    value={currentData.actualWeight || ''}
                    onChange={(e) => handleExerciseChange(index, 'actualWeight', e.target.value)}
                    className="input-field"
                    min="0"
                    step="0.5"
                  />
                </div>
              </div>

              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Total Volume:</span> {' '}
                  {(currentData.actualSets * currentData.actualReps * currentData.actualWeight || 0).toLocaleString()} lbs
                </p>
              </div>
            </div>
          );
        })}

        <div className="flex justify-end space-x-3">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Save Draft
          </button>
          <button
            onClick={handleCompleteWorkout}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Complete Workout
          </button>
        </div>
      </div>
    </div>
  );
};

export default WorkoutDetailPage;