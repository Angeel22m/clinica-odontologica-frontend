import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ExpedientesPage from '../pages/ExpedientePage';
import DashboardPage from '../pages/DashboardPage';
import NotFoundPage from '../pages/NotFoundPage';


const AppRoutes: React.FC = () => {
  return (
    
    <Routes>
      <Route path="/" element={<Navigate to="/expedientes" />} />
      <Route path="/expedientes" element={<ExpedientesPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
    
  );
};

export default AppRoutes;
