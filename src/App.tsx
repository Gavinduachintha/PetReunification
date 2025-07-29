import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Layout/Header';
import HomePage from './components/Home/HomePage';
import AuthPage from './components/Auth/AuthPage';
import Dashboard from './components/Dashboard/Dashboard';
import PetProfilePage from './components/PetProfile/PetProfilePage';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public pet profile route */}
          <Route path="/pet/:qrCode" element={<PetProfilePage />} />
          
          {/* Protected routes */}
          {user ? (
            <>
              <Route path="/" element={
                <>
                  <Header />
                  <Dashboard />
                </>
              } />
              <Route path="/dashboard" element={<Navigate to="/" replace />} />
            </>
          ) : (
            <>
              <Route path="/" element={
                <HomePage onGetStarted={() => window.location.href = '/auth'} />
              } />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/dashboard" element={<Navigate to="/auth" replace />} />
            </>
          )}
          
          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;