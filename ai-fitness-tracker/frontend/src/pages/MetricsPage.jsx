import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import useStore from '../store/useStore';

const MetricsPage = () => {
  const { progressData, getTopPerformingExercises } = useStore();
  
  const topPerformers = getTopPerformingExercises();
  
  // Generate sample data for demonstration
  const sampleData = useMemo(() => {
    const exercises = ['bench_press', 'squats', 'deadlifts'];
    const sampleProgress = {};
    
    exercises.forEach(exercise => {
      const data = [];
      const baseWeight = exercise === 'bench_press' ? 135 : exercise === 'squats' ? 155 : 185;
      
      for (let i = 0; i < 10; i++) {
        data.push({
          date: new Date(2024, 0, i * 3 + 1).toISOString(),
          weight: baseWeight + (i * 5) + Math.random() * 10,
          reps: 8 + Math.floor(Math.random() * 3),
          sets: 3 + Math.floor(Math.random() * 2),
          totalVolume: 0
        });
      }
      
      data.forEach(entry => {
        entry.totalVolume = entry.weight * entry.reps * entry.sets;
      });
      
      sampleProgress[exercise] = data;
    });
    
    return sampleProgress;
  }, []);

  const combinedData = { ...sampleProgress, ...progressData };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const exerciseNames = {
    bench_press: 'Bench Press',
    squats: 'Squats',
    deadlifts: 'Deadlifts'
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Progress Metrics</h1>
        <button className="btn-primary">
          📊 Export Data
        </button>
      </div>

      {/* Top Performing Exercises */}
      {topPerformers.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            🏆 Top 3 Performing Exercises
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topPerformers.map((exercise, index) => (
              <div key={exercise.exercise} className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{exercise.exercise}</h3>
                  <span className="text-2xl">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600">
                    Progress: <span className="font-medium text-green-600">+{exercise.progression}%</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Latest Weight: <span className="font-medium">{exercise.latestWeight} lbs</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Total Volume: <span className="font-medium">{exercise.latestVolume.toLocaleString()} lbs</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress Charts */}
      <div className="space-y-6">
        {Object.entries(combinedData).map(([exerciseKey, data]) => {
          if (!data || data.length === 0) return null;
          
          const exerciseName = exerciseNames[exerciseKey] || exerciseKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          
          return (
            <div key={exerciseKey} className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {exerciseName} Progress
              </h3>
              
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={formatDate}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      yAxisId="weight"
                      orientation="left"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis 
                      yAxisId="volume"
                      orientation="right"
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      labelFormatter={(value) => `Date: ${formatDate(value)}`}
                      formatter={(value, name) => [
                        name === 'weight' ? `${value} lbs` : 
                        name === 'totalVolume' ? `${value.toLocaleString()} lbs` : value,
                        name === 'weight' ? 'Weight' : 
                        name === 'totalVolume' ? 'Total Volume' : name
                      ]}
                    />
                    <Legend />
                    <Line 
                      yAxisId="weight"
                      type="monotone" 
                      dataKey="weight" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                      name="Weight"
                    />
                    <Line 
                      yAxisId="volume"
                      type="monotone" 
                      dataKey="totalVolume" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                      name="Total Volume"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <p className="text-gray-600">Latest Weight</p>
                  <p className="font-medium text-lg">{data[data.length - 1]?.weight} lbs</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600">Latest Volume</p>
                  <p className="font-medium text-lg">{data[data.length - 1]?.totalVolume.toLocaleString()} lbs</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-600">Sessions</p>
                  <p className="font-medium text-lg">{data.length}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {Object.keys(combinedData).length === 0 && (
        <div className="card text-center py-12">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Progress Data Yet
          </h3>
          <p className="text-gray-600 mb-6">
            Complete some workouts to start tracking your progress
          </p>
          <button className="btn-primary">
            Start Your First Workout
          </button>
        </div>
      )}
    </div>
  );
};

export default MetricsPage;