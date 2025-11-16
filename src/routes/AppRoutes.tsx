import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ExpedientesPage from '../pages/ExpedientePage';
import DashboardPage from '../pages/DashboardPage';
import HistorialdelPaciente from '../pages/HistorialdelPaciente';
import RegisterPage from '../pages/RegisterPage'
import AdminServicesPage from '../pages/AdminServicesPage';
import LoginPage from '../pages/LoginPage';
import HomePage from '../pages/HomePage';
import LandingPage from '../pages/LandingPage';
import PublicServicesPage from '../pages/ServicesPage'
import ExpedientesPagePorDoctor from '../pages/ExpedientePorDoctorPage'
import EmpleadosPage from '../pages/administracionEmpleados/empleadosPage'
import HomePaciente from '../pages/HomePaciente'
import ProtectedRoute from "../components/ProtectedRoute";
import  DoctorPage from "../pages/DoctorPage";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Navigate to="/landing" />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/services" element={<PublicServicesPage />} />
      <Route path="/expedientes" element={<ExpedientesPage/>} />
      <Route path="/citas/doctor" element={<DoctorPage/>}/>
      <Route path="/empleados" element={<EmpleadosPage />} />
      <Route path="/expedientes/doctor" element={<ExpedientesPagePorDoctor doctorId={1} />} />
      <Route path="/home/paciente" element={<HomePaciente />} />


      {/* Rutas protegidas por rol */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute
            element={<DashboardPage />}
            allowedRoles={["ADMIN", "DOCTOR", "RECEPCIONISTA"]}
          />
        }
      />

     

      <Route
        path="/expedientes/doctor"
        element={
          <ProtectedRoute
            element={<ExpedientesPagePorDoctor doctorId={1} />}
            allowedRoles={["DOCTOR","ADMIN","CLIENTE"]}
          />
        }
      />

      <Route
        path="/empleados"
        element={
          <ProtectedRoute
            element={<EmpleadosPage />}
            allowedRoles={["ADMIN"]}
          />
        }
      />

      <Route
        path="/Historial"
        element={
          <ProtectedRoute
            element={<HistorialdelPaciente />}
            allowedRoles={["CLIENTE"]}
          />
        }
      />

      <Route
        path="/admin/services"
        element={
          <ProtectedRoute
            element={<AdminServicesPage />}
            allowedRoles={["ADMIN"]}
          />
        }
      />

      {/* Fallback */}
      <Route path="*" element={<LandingPage/>} />
    </Routes>
  );
};

export default AppRoutes;
