// Data schemas for the fitness tracker app

export const KPI_TYPES = {
  ONE_RM: '1rm',
  VO2_MAX: 'vo2max',
  MOVEMENT_SCORE: 'movement_score',
  BODY_COMPOSITION: 'body_composition',
  ENDURANCE: 'endurance',
  FLEXIBILITY: 'flexibility',
  STRENGTH: 'strength',
  POWER: 'power'
};

export const KPI_LABELS = {
  [KPI_TYPES.ONE_RM]: '1RM',
  [KPI_TYPES.VO2_MAX]: 'VO2 Max',
  [KPI_TYPES.MOVEMENT_SCORE]: 'Movement Score',
  [KPI_TYPES.BODY_COMPOSITION]: 'Body Composition',
  [KPI_TYPES.ENDURANCE]: 'Endurance',
  [KPI_TYPES.FLEXIBILITY]: 'Flexibility',
  [KPI_TYPES.STRENGTH]: 'Strength',
  [KPI_TYPES.POWER]: 'Power'
};

export const EXERCISE_TYPES = {
  STRENGTH: 'strength',
  CARDIO: 'cardio',
  FLEXIBILITY: 'flexibility',
  BALANCE: 'balance',
  PLYOMETRIC: 'plyometric'
};

/**
 * Client Profile Schema
 */
export const createClientProfile = ({
  id = Date.now(),
  name = '',
  email = '',
  phone = '',
  age = null,
  goals = '',
  injuries = '',
  selectedKPIs = [],
  tags = [],
  avatar = null,
  createdAt = new Date().toISOString(),
  updatedAt = new Date().toISOString()
} = {}) => ({
  id,
  name,
  email,
  phone,
  age,
  goals,
  injuries,
  selectedKPIs,
  tags,
  avatar,
  createdAt,
  updatedAt
});

/**
 * Exercise Schema
 */
export const createExercise = ({
  id = Date.now(),
  name = '',
  type = EXERCISE_TYPES.STRENGTH,
  muscleGroups = [],
  equipment = [],
  instructions = '',
  tips = '',
  createdAt = new Date().toISOString()
} = {}) => ({
  id,
  name,
  type,
  muscleGroups,
  equipment,
  instructions,
  tips,
  createdAt
});

/**
 * Exercise Set Schema
 */
export const createExerciseSet = ({
  id = Date.now(),
  reps = 0,
  weight = 0,
  duration = null, // for time-based exercises
  distance = null, // for cardio
  restTime = null,
  rpe = null, // Rate of Perceived Exertion (1-10)
  notes = '',
  completed = false,
  timestamp = new Date().toISOString()
} = {}) => ({
  id,
  reps,
  weight,
  duration,
  distance,
  restTime,
  rpe,
  notes,
  completed,
  timestamp
});

/**
 * Workout Log Schema
 */
export const createWorkoutLog = ({
  id = Date.now(),
  clientId = null,
  name = '',
  date = new Date().toISOString(),
  duration = null,
  exercises = [], // Array of { exerciseId, sets: [ExerciseSet] }
  notes = '',
  status = 'planned', // 'planned', 'in_progress', 'completed'
  createdAt = new Date().toISOString(),
  updatedAt = new Date().toISOString()
} = {}) => ({
  id,
  clientId,
  name,
  date,
  duration,
  exercises,
  notes,
  status,
  createdAt,
  updatedAt
});

/**
 * Workout Exercise Schema (exercise within a workout)
 */
export const createWorkoutExercise = ({
  id = Date.now(),
  exerciseId = null,
  exercise = null, // Full exercise object for convenience
  sets = [],
  targetSets = null,
  targetReps = null,
  targetWeight = null,
  restTime = null,
  notes = '',
  completed = false,
  order = 0
} = {}) => ({
  id,
  exerciseId,
  exercise,
  sets,
  targetSets,
  targetReps,
  targetWeight,
  restTime,
  notes,
  completed,
  order
});

/**
 * KPI Measurement Schema
 */
export const createKPIMeasurement = ({
  id = Date.now(),
  clientId = null,
  kpiType = '',
  value = 0,
  unit = '',
  notes = '',
  date = new Date().toISOString(),
  createdAt = new Date().toISOString()
} = {}) => ({
  id,
  clientId,
  kpiType,
  value,
  unit,
  notes,
  date,
  createdAt
});

/**
 * Validation helpers
 */
export const validateClientProfile = (profile) => {
  const errors = {};
  
  if (!profile.name || profile.name.trim() === '') {
    errors.name = 'Name is required';
  }
  
  if (profile.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
    errors.email = 'Invalid email format';
  }
  
  if (profile.age && (profile.age < 1 || profile.age > 120)) {
    errors.age = 'Age must be between 1 and 120';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateWorkoutLog = (workoutLog) => {
  const errors = {};
  
  if (!workoutLog.name || workoutLog.name.trim() === '') {
    errors.name = 'Workout name is required';
  }
  
  if (!workoutLog.clientId) {
    errors.clientId = 'Client ID is required';
  }
  
  if (!workoutLog.date) {
    errors.date = 'Workout date is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Common exercise database for quick setup
 */
export const COMMON_EXERCISES = [
  createExercise({
    name: 'Bench Press',
    type: EXERCISE_TYPES.STRENGTH,
    muscleGroups: ['chest', 'triceps', 'shoulders'],
    equipment: ['barbell', 'bench'],
    instructions: 'Lie on bench, grip barbell with hands wider than shoulders, lower to chest, press up.',
    tips: 'Keep feet flat on floor, maintain arch in lower back, control the weight.'
  }),
  createExercise({
    name: 'Deadlift',
    type: EXERCISE_TYPES.STRENGTH,
    muscleGroups: ['hamstrings', 'glutes', 'back', 'traps'],
    equipment: ['barbell'],
    instructions: 'Stand with feet hip-width apart, grip barbell, lift by extending hips and knees.',
    tips: 'Keep back neutral, chest up, bar close to body throughout movement.'
  }),
  createExercise({
    name: 'Squat',
    type: EXERCISE_TYPES.STRENGTH,
    muscleGroups: ['quadriceps', 'glutes', 'hamstrings'],
    equipment: ['barbell', 'squat rack'],
    instructions: 'Stand with feet shoulder-width apart, descend by sitting back, drive through heels to stand.',
    tips: 'Keep knees tracking over toes, chest up, full range of motion.'
  }),
  createExercise({
    name: 'Pull-ups',
    type: EXERCISE_TYPES.STRENGTH,
    muscleGroups: ['lats', 'biceps', 'rear delts'],
    equipment: ['pull-up bar'],
    instructions: 'Hang from bar, pull body up until chin over bar, lower with control.',
    tips: 'Full range of motion, avoid swinging, engage core.'
  }),
  createExercise({
    name: 'Push-ups',
    type: EXERCISE_TYPES.STRENGTH,
    muscleGroups: ['chest', 'triceps', 'shoulders', 'core'],
    equipment: ['none'],
    instructions: 'Start in plank position, lower body to floor, push back up.',
    tips: 'Keep body straight, full range of motion, control the movement.'
  })
];

export default {
  KPI_TYPES,
  KPI_LABELS,
  EXERCISE_TYPES,
  createClientProfile,
  createExercise,
  createExerciseSet,
  createWorkoutLog,
  createWorkoutExercise,
  createKPIMeasurement,
  validateClientProfile,
  validateWorkoutLog,
  COMMON_EXERCISES
};