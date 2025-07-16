import { useState } from 'react';
import useStore from '../store/useStore';

const ProfilePage = () => {
  const { profile, updateProfile } = useStore();
  const [formData, setFormData] = useState(profile);
  const [selectedKPIs, setSelectedKPIs] = useState(profile.kpis || []);
  
  const kpiOptions = [
    { id: '1rm', label: '1RM (One Rep Max)', description: 'Maximum weight lifted for one repetition' },
    { id: 'vo2max', label: 'VO2 Max', description: 'Maximum oxygen consumption during exercise' },
    { id: 'movement_score', label: 'Movement Score', description: 'Overall movement quality assessment' },
    { id: 'body_composition', label: 'Body Composition', description: 'Body fat percentage and muscle mass' },
    { id: 'endurance', label: 'Endurance', description: 'Cardiovascular and muscular endurance' },
    { id: 'flexibility', label: 'Flexibility', description: 'Range of motion and joint mobility' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleKPIToggle = (kpiId) => {
    setSelectedKPIs(prev => 
      prev.includes(kpiId) 
        ? prev.filter(id => id !== kpiId)
        : [...prev, kpiId]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile({ ...formData, kpis: selectedKPIs });
    alert('Profile updated successfully!');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Client Profile</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="input-field"
              required
            />
          </div>

          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
              Age
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              className="input-field"
              min="1"
              max="120"
              required
            />
          </div>

          <div>
            <label htmlFor="goals" className="block text-sm font-medium text-gray-700 mb-2">
              Main Fitness Goals
            </label>
            <textarea
              id="goals"
              name="goals"
              value={formData.goals}
              onChange={handleInputChange}
              rows="4"
              className="input-field"
              placeholder="e.g., Build muscle, lose weight, improve endurance..."
            />
          </div>

          <div>
            <label htmlFor="injuries" className="block text-sm font-medium text-gray-700 mb-2">
              Physical Complaints/Injuries
            </label>
            <textarea
              id="injuries"
              name="injuries"
              value={formData.injuries}
              onChange={handleInputChange}
              rows="4"
              className="input-field"
              placeholder="e.g., Lower back pain, knee issues, shoulder mobility..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Key Performance Indicators (KPIs)
            </label>
            <div className="space-y-3">
              {kpiOptions.map((kpi) => (
                <div key={kpi.id} className="flex items-start">
                  <input
                    type="checkbox"
                    id={kpi.id}
                    checked={selectedKPIs.includes(kpi.id)}
                    onChange={() => handleKPIToggle(kpi.id)}
                    className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <div className="ml-3">
                    <label htmlFor={kpi.id} className="text-sm font-medium text-gray-700">
                      {kpi.label}
                    </label>
                    <p className="text-sm text-gray-500">{kpi.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              onClick={() => setFormData(profile)}
            >
              Reset
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;