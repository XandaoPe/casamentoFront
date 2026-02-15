// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/Admin/PrivateRoute';
import InvitePage from './pages/InvitePage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminGuestsPage from './pages/AdminGuestsPage';
import NotFoundPage from './pages/NotFoundPage';

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
          {/* ✅ ROTA PÚBLICA DO CONVITE - DEVE SER PRIMEIRA */}
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

          {/* Redirecionamentos */}
          <Route path="/" element={<Navigate to="/admin/login" replace />} />

          {/* Rota 404 - DEVE SER A ÚLTIMA */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;