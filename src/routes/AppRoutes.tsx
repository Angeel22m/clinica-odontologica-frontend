import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import ExpedientesPage from '../pages/ExpedientePage';
import DashboardPage from '../pages/DashboardPage';
import NotFoundPage from '../pages/NotFoundPage';

import PacientesPage from '../pages/pacientes/PacientesPage';
import PacienteFormPage from '../pages/pacientes/pacienteFormPage';

// Placeholders opcionales a futuro:
import PacienteDetallePage from '../pages/pacientes/PacienteDetallePage';


import ExpedientePorDoctorPage from "../pages/ExpedientePorDoctorPage"
import AdminServicesPage from '../pages/AdminServicesPage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Home seguir redirigiendo a expedientes */}
      <Route path="/" element={<Navigate to="/expedientes" />} />

      {/* Rutas existentes */}
      <Route path="/expedientes" element={<ExpedientesPage />} />
      <Route path="/expedientes/doctor" element={<ExpedientePorDoctorPage doctorId={1}/>} />
      <Route path="/dashboard" element={<DashboardPage />} />

      {/* Pacientes */}
      <Route path="/pacientes" element={<PacientesPage />} />
      <Route path="/pacientes/nuevo" element={<PacienteFormPage />} />
      <Route path="/pacientes/:id" element={<PacienteDetallePage />} />

      {/*Citas deshabilitadas para este sprint */}
      {/*
        <Route path="/pacientes/:id/citas" element={<PacienteCitasPage />} />
        <Route path="/pacientes/:id/citas/nueva" element={<NuevaCitaPage />} />
      */}

      {/* 404 */}
      <Route path="/admin/services" element={<AdminServicesPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
