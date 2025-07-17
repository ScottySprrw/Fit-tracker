import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  createClientProfile, 
  createWorkoutLog, 
  createWorkoutExercise, 
  createExerciseSet,
  createKPIMeasurement,
  COMMON_EXERCISES 
} from '../utils/schema.js';

const useClientStore = create(
  persist(
    (set, get) => ({
      // State
      clients: [],
      workoutLogs: [],
      kpiMeasurements: [],
      exercises: COMMON_EXERCISES,
      currentClient: null,
      currentWorkout: null,
      selectedTags: [],
      
      // Client Management Actions
      addClient: (clientData) => {
        const newClient = createClientProfile(clientData);
        set((state) => ({
          clients: [...state.clients, newClient]
        }));
        return newClient;
      },
      
      updateClient: (clientId, updates) => {
        set((state) => ({
          clients: state.clients.map(client => 
            client.id === clientId 
              ? { ...client, ...updates, updatedAt: new Date().toISOString() }
              : client
          )
        }));
      },
      
      deleteClient: (clientId) => {
        set((state) => ({
          clients: state.clients.filter(client => client.id !== clientId),
          workoutLogs: state.workoutLogs.filter(log => log.clientId !== clientId),
          kpiMeasurements: state.kpiMeasurements.filter(kpi => kpi.clientId !== clientId)
        }));
      },
      
      getClientById: (clientId) => {
        return get().clients.find(client => client.id === clientId);
      },
      
      setCurrentClient: (clientId) => {
        const client = get().getClientById(clientId);
        set({ currentClient: client });
      },
      
      // Workout Management Actions
      addWorkoutLog: (workoutData) => {
        const newWorkout = createWorkoutLog(workoutData);
        set((state) => ({
          workoutLogs: [...state.workoutLogs, newWorkout]
        }));
        return newWorkout;
      },
      
      updateWorkoutLog: (workoutId, updates) => {
        set((state) => ({
          workoutLogs: state.workoutLogs.map(workout =>
            workout.id === workoutId
              ? { ...workout, ...updates, updatedAt: new Date().toISOString() }
              : workout
          )
        }));
      },
      
      deleteWorkoutLog: (workoutId) => {
        set((state) => ({
          workoutLogs: state.workoutLogs.filter(workout => workout.id !== workoutId)
        }));
      },
      
      getWorkoutById: (workoutId) => {
        return get().workoutLogs.find(workout => workout.id === workoutId);
      },
      
      getWorkoutsByClient: (clientId) => {
        return get().workoutLogs.filter(workout => workout.clientId === clientId);
      },
      
      setCurrentWorkout: (workoutId) => {
        const workout = get().getWorkoutById(workoutId);
        set({ currentWorkout: workout });
      },
      
      // Exercise Management within Workouts
      addExerciseToWorkout: (workoutId, exerciseData) => {
        const workoutExercise = createWorkoutExercise(exerciseData);
        set((state) => ({
          workoutLogs: state.workoutLogs.map(workout =>
            workout.id === workoutId
              ? {
                  ...workout,
                  exercises: [...workout.exercises, workoutExercise],
                  updatedAt: new Date().toISOString()
                }
              : workout
          )
        }));
        return workoutExercise;
      },
      
      updateWorkoutExercise: (workoutId, exerciseId, updates) => {
        set((state) => ({
          workoutLogs: state.workoutLogs.map(workout =>
            workout.id === workoutId
              ? {
                  ...workout,
                  exercises: workout.exercises.map(exercise =>
                    exercise.id === exerciseId
                      ? { ...exercise, ...updates }
                      : exercise
                  ),
                  updatedAt: new Date().toISOString()
                }
              : workout
          )
        }));
      },
      
      removeExerciseFromWorkout: (workoutId, exerciseId) => {
        set((state) => ({
          workoutLogs: state.workoutLogs.map(workout =>
            workout.id === workoutId
              ? {
                  ...workout,
                  exercises: workout.exercises.filter(exercise => exercise.id !== exerciseId),
                  updatedAt: new Date().toISOString()
                }
              : workout
          )
        }));
      },
      
      // Exercise Set Management
      addSetToExercise: (workoutId, exerciseId, setData) => {
        const newSet = createExerciseSet(setData);
        set((state) => ({
          workoutLogs: state.workoutLogs.map(workout =>
            workout.id === workoutId
              ? {
                  ...workout,
                  exercises: workout.exercises.map(exercise =>
                    exercise.id === exerciseId
                      ? { ...exercise, sets: [...exercise.sets, newSet] }
                      : exercise
                  ),
                  updatedAt: new Date().toISOString()
                }
              : workout
          )
        }));
        return newSet;
      },
      
      updateExerciseSet: (workoutId, exerciseId, setId, updates) => {
        set((state) => ({
          workoutLogs: state.workoutLogs.map(workout =>
            workout.id === workoutId
              ? {
                  ...workout,
                  exercises: workout.exercises.map(exercise =>
                    exercise.id === exerciseId
                      ? {
                          ...exercise,
                          sets: exercise.sets.map(set =>
                            set.id === setId
                              ? { ...set, ...updates }
                              : set
                          )
                        }
                      : exercise
                  ),
                  updatedAt: new Date().toISOString()
                }
              : workout
          )
        }));
      },
      
      removeSetFromExercise: (workoutId, exerciseId, setId) => {
        set((state) => ({
          workoutLogs: state.workoutLogs.map(workout =>
            workout.id === workoutId
              ? {
                  ...workout,
                  exercises: workout.exercises.map(exercise =>
                    exercise.id === exerciseId
                      ? {
                          ...exercise,
                          sets: exercise.sets.filter(set => set.id !== setId)
                        }
                      : exercise
                  ),
                  updatedAt: new Date().toISOString()
                }
              : workout
          )
        }));
      },
      
      // KPI Measurement Actions
      addKPIMeasurement: (measurementData) => {
        const newMeasurement = createKPIMeasurement(measurementData);
        set((state) => ({
          kpiMeasurements: [...state.kpiMeasurements, newMeasurement]
        }));
        return newMeasurement;
      },
      
      updateKPIMeasurement: (measurementId, updates) => {
        set((state) => ({
          kpiMeasurements: state.kpiMeasurements.map(measurement =>
            measurement.id === measurementId
              ? { ...measurement, ...updates }
              : measurement
          )
        }));
      },
      
      deleteKPIMeasurement: (measurementId) => {
        set((state) => ({
          kpiMeasurements: state.kpiMeasurements.filter(measurement => measurement.id !== measurementId)
        }));
      },
      
      getKPIMeasurementsByClient: (clientId) => {
        return get().kpiMeasurements.filter(measurement => measurement.clientId === clientId);
      },
      
      getKPIMeasurementsByType: (clientId, kpiType) => {
        return get().kpiMeasurements.filter(measurement => 
          measurement.clientId === clientId && measurement.kpiType === kpiType
        );
      },
      
      // Exercise Database Actions
      addExercise: (exerciseData) => {
        const newExercise = { ...exerciseData, id: Date.now() };
        set((state) => ({
          exercises: [...state.exercises, newExercise]
        }));
        return newExercise;
      },
      
      updateExercise: (exerciseId, updates) => {
        set((state) => ({
          exercises: state.exercises.map(exercise =>
            exercise.id === exerciseId
              ? { ...exercise, ...updates }
              : exercise
          )
        }));
      },
      
      deleteExercise: (exerciseId) => {
        set((state) => ({
          exercises: state.exercises.filter(exercise => exercise.id !== exerciseId)
        }));
      },
      
      getExerciseById: (exerciseId) => {
        return get().exercises.find(exercise => exercise.id === exerciseId);
      },
      
      // Filtering and Search
      setSelectedTags: (tags) => {
        set({ selectedTags: tags });
      },
      
      getFilteredClients: () => {
        const { clients, selectedTags } = get();
        if (selectedTags.length === 0) {
          return clients;
        }
        return clients.filter(client =>
          selectedTags.some(tag => client.tags.includes(tag))
        );
      },
      
      // Analytics and Insights
      getClientStats: (clientId) => {
        const { workoutLogs, kpiMeasurements } = get();
        const clientWorkouts = workoutLogs.filter(workout => workout.clientId === clientId);
        const clientKPIs = kpiMeasurements.filter(kpi => kpi.clientId === clientId);
        
        return {
          totalWorkouts: clientWorkouts.length,
          completedWorkouts: clientWorkouts.filter(workout => workout.status === 'completed').length,
          totalExercises: clientWorkouts.reduce((total, workout) => total + workout.exercises.length, 0),
          totalSets: clientWorkouts.reduce((total, workout) => 
            total + workout.exercises.reduce((exerciseTotal, exercise) => 
              exerciseTotal + exercise.sets.length, 0
            ), 0
          ),
          kpiCount: clientKPIs.length,
          lastWorkoutDate: clientWorkouts.length > 0 
            ? clientWorkouts.sort((a, b) => new Date(b.date) - new Date(a.date))[0].date
            : null
        };
      },
      
      getExerciseHistory: (clientId, exerciseName) => {
        const { workoutLogs } = get();
        const clientWorkouts = workoutLogs.filter(workout => workout.clientId === clientId);
        
        const exerciseHistory = [];
        clientWorkouts.forEach(workout => {
          workout.exercises.forEach(exercise => {
            if (exercise.exercise && exercise.exercise.name === exerciseName) {
              exerciseHistory.push({
                date: workout.date,
                sets: exercise.sets,
                notes: exercise.notes,
                workoutId: workout.id
              });
            }
          });
        });
        
        return exerciseHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
      },
      
      getLastExercisePerformance: (clientId, exerciseName) => {
        const history = get().getExerciseHistory(clientId, exerciseName);
        return history.length > 0 ? history[0] : null;
      },
      
      // Utility Actions
      clearAllData: () => {
        set({
          clients: [],
          workoutLogs: [],
          kpiMeasurements: [],
          exercises: COMMON_EXERCISES,
          currentClient: null,
          currentWorkout: null,
          selectedTags: []
        });
      },
      
      exportData: () => {
        const { clients, workoutLogs, kpiMeasurements, exercises } = get();
        return {
          clients,
          workoutLogs,
          kpiMeasurements,
          exercises,
          exportDate: new Date().toISOString(),
          version: '1.0'
        };
      },
      
      importData: (data) => {
        if (data.version === '1.0') {
          set({
            clients: data.clients || [],
            workoutLogs: data.workoutLogs || [],
            kpiMeasurements: data.kpiMeasurements || [],
            exercises: data.exercises || COMMON_EXERCISES
          });
        }
      }
    }),
    {
      name: 'fitness-tracker-storage',
      getStorage: () => localStorage,
      partialize: (state) => ({
        clients: state.clients,
        workoutLogs: state.workoutLogs,
        kpiMeasurements: state.kpiMeasurements,
        exercises: state.exercises,
        selectedTags: state.selectedTags
      })
    }
  )
);

export default useClientStore;