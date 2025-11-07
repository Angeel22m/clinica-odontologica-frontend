import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import ExpedientesPage from '../pages/ExpedientePage';
import DashboardPage from '../pages/DashboardPage';
import NotFoundPage from '../pages/NotFoundPage';

import AdminServicesPage from '../pages/AdminServicesPage';
import LoginPage from '../pages/LoginPage';
import LandingPage from '../pages/LandingPage';
import RegisterPage from '../pages/RegisterPage'

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/expedientes" element={<ExpedientesPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/admin/services" element={<AdminServicesPage />} />
      <Route path="*" element={<NotFoundPage />} />
      <Route path="/landing" element={<LandingPage />} />
    </Routes>
  );
};

export default AppRoutes;
