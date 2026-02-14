// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/Admin/PrivateRoute';
import InvitePage from './pages/InvitePage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
// import AdminGuestsPage from './pages/AdminGuestsPage'; // Vamos criar depois
import NotFoundPage from './pages/NotFoundPage';
import AdminGuestsPage from './pages/AdminGuestsPage';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />

        <Routes>
          {/* Rota pública - convite */}
          <Route path="/invite/:token" element={<InvitePage />} />

          {/* Rotas administrativas */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute>
                <AdminDashboardPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/guests"
            element={
              <PrivateRoute>
                <AdminGuestsPage />
              </PrivateRoute>
            }
          />

          <Route path="/" element={<Navigate to="/admin/login" replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;