import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import WorkoutDetailPage from './pages/WorkoutDetailPage';
import MetricsPage from './pages/MetricsPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/workout/:id" element={<WorkoutDetailPage />} />
          <Route path="/metrics" element={<MetricsPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;