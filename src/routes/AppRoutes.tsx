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
import { useAuth } from "../hooks/UseAuth";
import RecepcionistaPage from '../pages/RecepcionistaPage';

// solo es para pruebas luego se dejan los roles correspondientes
const allUser  =['ADMIN',"CLIENTE","ADMINISTRADOR","DOCTOR"] 

const AppRoutes: React.FC = () => {
  const { idUser, idEmpleado} = useAuth();
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Navigate to="/landing" />} />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/services" element={<PublicServicesPage />} />


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
      path="/recepcionista" 
        element={
        <ProtectedRoute
        element={<RecepcionistaPage />}
        allowedRoles={["RECEPCIONISTA"]}
        />
      }
      />
      
          
      {/* Rutas protegidas por rol */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute
            element={<DashboardPage />}
            allowedRoles={["ADMIN"]}
          />
        }

      />

        <Route path="/home/paciente" 
        element={ <ProtectedRoute 
          element={<HomePaciente />}
          allowedRoles={["CLIENTE"]}
      
      />
      } />

       <Route path="/citas/doctor" 
       element={<ProtectedRoute 
        element={<DoctorPage/>} 
        allowedRoles={["DOCTOR"]}
        />
      }
      />
        
      <Route
        path="/expedientes/doctor/:expedienteId?"
        element={
          <ProtectedRoute
            element={<ExpedientesPagePorDoctor doctorId={idEmpleado} />}
            allowedRoles={["DOCTOR"]}
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
            element={<HistorialdelPaciente pacienteId={idUser} />}
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

      <Route path="/expedientes" 
      element={<ProtectedRoute element={<ExpedientesPage/>}
      allowedRoles={["ADMIN"]}
      
      />} />

      {/* Fallback */}
      <Route path="*" element={<LandingPage/>} />
    </Routes>
  );
};

export default AppRoutes;
