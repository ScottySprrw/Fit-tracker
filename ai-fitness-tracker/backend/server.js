const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Data file paths
const DATA_DIR = path.join(__dirname, 'data');
const PROFILES_FILE = path.join(DATA_DIR, 'profiles.json');
const WORKOUTS_FILE = path.join(DATA_DIR, 'workouts.json');
const PROGRESS_FILE = path.join(DATA_DIR, 'progress.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

// Initialize data files if they don't exist
const initializeFiles = () => {
  if (!fs.existsSync(PROFILES_FILE)) {
    fs.writeFileSync(PROFILES_FILE, JSON.stringify({}));
  }
  if (!fs.existsSync(WORKOUTS_FILE)) {
    fs.writeFileSync(WORKOUTS_FILE, JSON.stringify([]));
  }
  if (!fs.existsSync(PROGRESS_FILE)) {
    fs.writeFileSync(PROGRESS_FILE, JSON.stringify({}));
  }
};

// Utility functions
const readJSONFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return null;
  }
};

const writeJSONFile = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    return false;
  }
};

// Routes

// Profile routes
app.get('/api/profile', (req, res) => {
  const profiles = readJSONFile(PROFILES_FILE);
  if (profiles === null) {
    return res.status(500).json({ error: 'Failed to read profiles' });
  }
  
  // For now, return the first profile or empty object
  const profileId = Object.keys(profiles)[0];
  const profile = profileId ? profiles[profileId] : {};
  
  res.json(profile);
});

app.post('/api/profile', (req, res) => {
  const profiles = readJSONFile(PROFILES_FILE);
  if (profiles === null) {
    return res.status(500).json({ error: 'Failed to read profiles' });
  }
  
  const profileId = 'default'; // For now, use a default profile
  profiles[profileId] = req.body;
  
  if (writeJSONFile(PROFILES_FILE, profiles)) {
    res.json({ message: 'Profile saved successfully', profile: req.body });
  } else {
    res.status(500).json({ error: 'Failed to save profile' });
  }
});

// Workout routes
app.get('/api/workouts', (req, res) => {
  const workouts = readJSONFile(WORKOUTS_FILE);
  if (workouts === null) {
    return res.status(500).json({ error: 'Failed to read workouts' });
  }
  
  res.json(workouts);
});

app.post('/api/workouts', (req, res) => {
  const workouts = readJSONFile(WORKOUTS_FILE);
  if (workouts === null) {
    return res.status(500).json({ error: 'Failed to read workouts' });
  }
  
  const newWorkout = {
    id: Date.now(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  
  workouts.push(newWorkout);
  
  if (writeJSONFile(WORKOUTS_FILE, workouts)) {
    res.json(newWorkout);
  } else {
    res.status(500).json({ error: 'Failed to save workout' });
  }
});

app.get('/api/workouts/:id', (req, res) => {
  const workouts = readJSONFile(WORKOUTS_FILE);
  if (workouts === null) {
    return res.status(500).json({ error: 'Failed to read workouts' });
  }
  
  const workout = workouts.find(w => w.id === parseInt(req.params.id));
  if (!workout) {
    return res.status(404).json({ error: 'Workout not found' });
  }
  
  res.json(workout);
});

app.put('/api/workouts/:id', (req, res) => {
  const workouts = readJSONFile(WORKOUTS_FILE);
  if (workouts === null) {
    return res.status(500).json({ error: 'Failed to read workouts' });
  }
  
  const workoutIndex = workouts.findIndex(w => w.id === parseInt(req.params.id));
  if (workoutIndex === -1) {
    return res.status(404).json({ error: 'Workout not found' });
  }
  
  workouts[workoutIndex] = { ...workouts[workoutIndex], ...req.body };
  
  if (writeJSONFile(WORKOUTS_FILE, workouts)) {
    res.json(workouts[workoutIndex]);
  } else {
    res.status(500).json({ error: 'Failed to update workout' });
  }
});

// Progress routes
app.get('/api/progress', (req, res) => {
  const progress = readJSONFile(PROGRESS_FILE);
  if (progress === null) {
    return res.status(500).json({ error: 'Failed to read progress' });
  }
  
  res.json(progress);
});

app.post('/api/progress', (req, res) => {
  const progress = readJSONFile(PROGRESS_FILE);
  if (progress === null) {
    return res.status(500).json({ error: 'Failed to read progress' });
  }
  
  const { exercise, weight, reps, sets } = req.body;
  const exerciseKey = exercise.toLowerCase().replace(/\s+/g, '_');
  
  if (!progress[exerciseKey]) {
    progress[exerciseKey] = [];
  }
  
  const progressEntry = {
    date: new Date().toISOString(),
    weight,
    reps,
    sets,
    totalVolume: weight * reps * sets
  };
  
  progress[exerciseKey].push(progressEntry);
  
  if (writeJSONFile(PROGRESS_FILE, progress)) {
    res.json(progressEntry);
  } else {
    res.status(500).json({ error: 'Failed to save progress' });
  }
});

app.get('/api/progress/:exercise', (req, res) => {
  const progress = readJSONFile(PROGRESS_FILE);
  if (progress === null) {
    return res.status(500).json({ error: 'Failed to read progress' });
  }
  
  const exerciseKey = req.params.exercise.toLowerCase().replace(/\s+/g, '_');
  const exerciseProgress = progress[exerciseKey] || [];
  
  res.json(exerciseProgress);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Initialize files and start server
initializeFiles();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Data directory: ${DATA_DIR}`);
});