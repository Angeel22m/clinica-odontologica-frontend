import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import ExpedientesPage from '../pages/ExpedientePage';
import DashboardPage from '../pages/DashboardPage';
import NotFoundPage from '../pages/NotFoundPage';
import RegisterPage from '../pages/RegisterPage'
import AdminServicesPage from '../pages/AdminServicesPage';
import LoginPage from '../pages/LoginPage';
import HomePage from '../pages/HomePage';
import LandingPage from '../pages/LandingPage';
import PublicServicesPage from '../pages/ServicesPage'
import ExpedientesPagePorDoctor from '../pages/ExpedientePorDoctorPage'
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/landing" />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/expedientes" element={<ExpedientesPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/admin/services" element={<AdminServicesPage />} />
      <Route path="*" element={<NotFoundPage />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/services" element={<PublicServicesPage />} />
      <Route path="/expedientes/doctor" element={<ExpedientesPagePorDoctor doctorId={1} />} />
    </Routes>
  );
};

export default AppRoutes;
