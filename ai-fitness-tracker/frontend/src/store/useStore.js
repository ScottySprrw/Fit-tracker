import { create } from 'zustand';

const useStore = create((set, get) => ({
  // Client Profile State
  profile: {
    name: '',
    age: '',
    goals: '',
    injuries: '',
    kpis: []
  },
  
  // Workouts State
  workouts: [],
  currentWorkout: null,
  
  // Progress Data
  exercises: [],
  progressData: {},
  
  // Actions
  updateProfile: (profileData) => set({ profile: profileData }),
  
  addWorkout: (workout) => set((state) => ({
    workouts: [...state.workouts, { ...workout, id: Date.now() }]
  })),
  
  setCurrentWorkout: (workout) => set({ currentWorkout: workout }),
  
  updateWorkoutExercise: (workoutId, exerciseIndex, exerciseData) => set((state) => {
    const updatedWorkouts = state.workouts.map(workout => {
      if (workout.id === workoutId) {
        const updatedExercises = [...workout.exercises];
        updatedExercises[exerciseIndex] = { ...updatedExercises[exerciseIndex], ...exerciseData };
        return { ...workout, exercises: updatedExercises };
      }
      return workout;
    });
    return { workouts: updatedWorkouts };
  }),
  
  addExerciseProgress: (exercise, weight, reps, sets) => set((state) => {
    const exerciseKey = exercise.toLowerCase().replace(/\s+/g, '_');
    const progressEntry = {
      date: new Date().toISOString(),
      weight,
      reps,
      sets,
      totalVolume: weight * reps * sets
    };
    
    return {
      progressData: {
        ...state.progressData,
        [exerciseKey]: [...(state.progressData[exerciseKey] || []), progressEntry]
      }
    };
  }),
  
  getExerciseHistory: (exercise) => {
    const state = get();
    const exerciseKey = exercise.toLowerCase().replace(/\s+/g, '_');
    return state.progressData[exerciseKey] || [];
  },
  
  getLastExerciseEntry: (exercise) => {
    const history = get().getExerciseHistory(exercise);
    return history.length > 0 ? history[history.length - 1] : null;
  },
  
  getTopPerformingExercises: () => {
    const state = get();
    const exerciseStats = [];
    
    Object.entries(state.progressData).forEach(([exercise, entries]) => {
      if (entries.length >= 2) {
        const latest = entries[entries.length - 1];
        const previous = entries[entries.length - 2];
        const progression = ((latest.totalVolume - previous.totalVolume) / previous.totalVolume) * 100;
        
        exerciseStats.push({
          exercise: exercise.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          progression: progression.toFixed(1),
          latestVolume: latest.totalVolume,
          latestWeight: latest.weight
        });
      }
    });
    
    return exerciseStats
      .sort((a, b) => b.progression - a.progression)
      .slice(0, 3);
  }
}));

export default useStore;