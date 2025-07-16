import { Link } from 'react-router-dom';
import useStore from '../store/useStore';

const DashboardPage = () => {
  const { profile, workouts, getTopPerformingExercises } = useStore();
  
  const mockWorkouts = [
    {
      id: 1,
      name: 'Upper Body Strength',
      date: '2024-01-15',
      status: 'completed',
      exercises: ['Bench Press', 'Pull-ups', 'Overhead Press']
    },
    {
      id: 2,
      name: 'Lower Body Power',
      date: '2024-01-17',
      status: 'upcoming',
      exercises: ['Squats', 'Deadlifts', 'Lunges']
    },
    {
      id: 3,
      name: 'Full Body Circuit',
      date: '2024-01-19',
      status: 'upcoming',
      exercises: ['Burpees', 'Mountain Climbers', 'Plank']
    }
  ];

  const topPerformers = getTopPerformingExercises();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard
        </h1>
        <Link 
          to="/profile" 
          className="btn-primary"
        >
          Edit Profile
        </Link>
      </div>

      {/* Profile Summary */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Client Overview</h2>
        {profile.name ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-medium">{profile.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Age</p>
              <p className="font-medium">{profile.age}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-600">Goals</p>
              <p className="font-medium">{profile.goals || 'No goals set'}</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No profile information found</p>
            <Link to="/profile" className="btn-primary">
              Create Profile
            </Link>
          </div>
        )}
      </div>

      {/* Top Performing Exercises */}
      {topPerformers.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">🏆 Top Performing Exercises</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topPerformers.map((exercise, index) => (
              <div key={exercise.exercise} className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{exercise.exercise}</h3>
                  <span className="text-2xl">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Progress: <span className="font-medium text-green-600">+{exercise.progression}%</span>
                </p>
                <p className="text-sm text-gray-600">
                  Latest: {exercise.latestWeight} lbs
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Workouts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completed Workouts */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">✅ Completed Workouts</h2>
          <div className="space-y-3">
            {mockWorkouts
              .filter(w => w.status === 'completed')
              .map((workout) => (
                <Link 
                  key={workout.id}
                  to={`/workout/${workout.id}`}
                  className="block p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{workout.name}</h3>
                      <p className="text-sm text-gray-600">{workout.date}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {workout.exercises.join(', ')}
                      </p>
                    </div>
                    <span className="text-green-600 text-sm font-medium">
                      Complete
                    </span>
                  </div>
                </Link>
              ))}
          </div>
        </div>

        {/* Upcoming Workouts */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">📅 Upcoming Workouts</h2>
          <div className="space-y-3">
            {mockWorkouts
              .filter(w => w.status === 'upcoming')
              .map((workout) => (
                <Link 
                  key={workout.id}
                  to={`/workout/${workout.id}`}
                  className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{workout.name}</h3>
                      <p className="text-sm text-gray-600">{workout.date}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {workout.exercises.join(', ')}
                      </p>
                    </div>
                    <span className="text-blue-600 text-sm font-medium">
                      Upcoming
                    </span>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/metrics" className="btn-secondary">
            📊 View Progress
          </Link>
          <button className="btn-secondary">
            🤖 Generate New Workout
          </button>
          <button className="btn-secondary">
            📋 Export Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;