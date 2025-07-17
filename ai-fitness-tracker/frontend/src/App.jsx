import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import UserProfile from './pages/UserProfile.jsx';
import ClientDashboard from './pages/ClientDashboard.jsx';
import WorkoutDetail from './pages/WorkoutDetail.jsx';
import MetricsPage from './pages/MetricsPage.jsx';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/client-dashboard" replace />} />
          <Route path="/client-dashboard" element={<ClientDashboard />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/workout/:id" element={<WorkoutDetail />} />
          <Route path="/metrics/:clientId" element={<MetricsPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;