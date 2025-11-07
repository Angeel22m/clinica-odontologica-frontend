import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ExpedientesPage from '../pages/ExpedientePage';
import DashboardPage from '../pages/DashboardPage';
import NotFoundPage from '../pages/NotFoundPage';
import ExpedientePorDoctorPage from "../pages/ExpedientePorDoctorPage"

const AppRoutes: React.FC = () => {
  return (
    
    <Routes>
      <Route path="/" element={<Navigate to="/expedientes" />} />
      <Route path="/expedientes" element={<ExpedientesPage />} />
      <Route path="/expedientes/doctor" element={<ExpedientePorDoctorPage doctorId={1}/>} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
    
  );
};

export default AppRoutes;
