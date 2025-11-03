import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import ExpedientesPage from '../pages/ExpedientePage';
import DashboardPage from '../pages/DashboardPage';
import NotFoundPage from '../pages/NotFoundPage';

//Nuevas páginas (aún no creadas, pero dejamos lista la estructura)
// import PacientesPage from '../pages/pacientes/PacientesPage';
// import NuevoPacientePage from '../pages/pacientes/NuevoPacientePage';
// import PacienteDetallePage from '../pages/pacientes/PacienteDetallePage';
// import PacienteCitasPage from '../pages/pacientes/PacienteCitasPage';
// import NuevaCitaPage from '../pages/pacientes/NuevaCitaPage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>

      {/* Ruta principal */}
      <Route path="/" element={<Navigate to="/expedientes" />} />

      {/* Rutas existentes */}
      <Route path="/expedientes" element={<ExpedientesPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />

      {/* Rutas de Pacientes */}
      {/* <Route path="/pacientes" element={<PacientesPage />} />
      <Route path="/pacientes/nuevo" element={<NuevoPacientePage />} />
      <Route path="/pacientes/:id" element={<PacienteDetallePage />} />
      <Route path="/pacientes/:id/citas" element={<PacienteCitasPage />} />
      <Route path="/pacientes/:id/citas/nueva" element={<NuevaCitaPage />} /> */}

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />

    </Routes>
  );
};

export default AppRoutes;
