import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import RaiseComplaintPage from './pages/RaiseComplaintPage';
import TrackComplaintsPage from './pages/TrackComplaintsPage';
import AdminComplaintsPage from './pages/AdminComplaintsPage';
import TechnicianTasksPage from './pages/TechnicianTasksPage';
import FeedbackPage from './pages/FeedbackPage';

import ComplaintDetailsPage from './pages/ComplaintDetailsPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Dashboard (All authenticated users) */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />

          {/* Shared Details Route */}
          <Route path="/complaints/:id" element={
            <ProtectedRoute>
              <ComplaintDetailsPage />
            </ProtectedRoute>
          } />

          {/* Student Routes */}
          <Route path="/raise-complaint" element={
            <ProtectedRoute roles={['student']}>
              <RaiseComplaintPage />
            </ProtectedRoute>
          } />
          <Route path="/track-complaints" element={
            <ProtectedRoute roles={['student']}>
              <TrackComplaintsPage />
            </ProtectedRoute>
          } />
          <Route path="/feedback" element={
            <ProtectedRoute roles={['student']}>
              <FeedbackPage />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin/complaints" element={
            <ProtectedRoute roles={['admin']}>
              <AdminComplaintsPage />
            </ProtectedRoute>
          } />

          {/* Technician Routes */}
          <Route path="/technician/tasks" element={
            <ProtectedRoute roles={['technician']}>
              <TechnicianTasksPage />
            </ProtectedRoute>
          } />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
