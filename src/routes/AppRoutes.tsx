import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ExpedientesPage from '../pages/ExpedientePage';
import DashboardPage from '../pages/DashboardPage';
import NotFoundPage from '../pages/NotFoundPage';
import AdminServicesPage from '../pages/AdminServicesPage';
import LoginPage from '../pages/LoginPage';
import HomePage from '../pages/HomePage';

const AppRoutes: React.FC = () => {
  return (
    
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/expedientes" element={<ExpedientesPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/admin/services" element={<AdminServicesPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
    
  );
};

export default AppRoutes;
