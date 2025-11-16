import React from 'react';
import { useState } from "react";
import CitasDoctor from '../components/DoctorComponentes/CitasDoctor'; 
import { FiMenu } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from 'react-router-dom';
import LogoutButton from "../components/LogoutButton";
import { FiSettings } from "react-icons/fi";
import { FiUser } from "react-icons/fi";
import { useAuth } from '../hooks/UseAuth';

const DoctorPage: React.FC = () => {
    
    const [menuOpen, setMenuOpen] = useState(false);
    const {nombre,apellido} = useAuth();

    return (
        <div className="max-w-7xl w-full mx-auto p-6 bg-light border border-primary/20 rounded-2xl shadow-xl font-inter">
            
           {/* --- CABECERA (Doctor Info y Botones) --- */}
<header className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3 sm:gap-4">

    {/* Información del Doctor */}
    <div className="w-full sm:flex-1 p-3 bg-primary/10 border border-primary/20 rounded-xl text-primary font-semibold text-lg sm:text-xl shadow-sm">
        Doctor {`${nombre } ${apellido}`}
    </div>
    
    <div className="flex w-full sm:w-auto items-center gap-2 sm:gap-3">

        {/* Enlace "Ver Pacientes" */}
        <Link
            to={'/expedientes/doctor'} 
            className="btn-primary flex-shrink-0 px-4 py-2 text-sm sm:text-base rounded-lg shadow hover:shadow-md transition duration-200"
            title="Ver expedientes y datos de pacientes"
        >
            Ver Pacientes
        </Link>
        
        {/* MENÚ DESPLEGABLE */}
          <div className="relative">
            <AnimatePresence mode="wait">
            <motion.button
            onClick={() => setMenuOpen(!menuOpen)}
            animate={{rotate: menuOpen ? -90 : 0}}
            transition = {{ duration: 0.2}}
            className="p-2">
            <FiMenu
              className="hover:text-info transition h-7 w-7 cursor-pointer"
            />
            </motion.button>
            </AnimatePresence>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-light rounded-xl shadow-lg py-2 z-50">
              
                <div className="w-full text-left px-4 py-2 hover:bg-primary/10 cursor-pointer flex items-center gap-2">
                <FiUser />
                <Link>
                  Perfil
                </Link>
                </div>
                
                <div className="w-full text-left px-4 py-2 hover:bg-primary/10 cursor-pointer flex items-center gap-2">
                <FiSettings />
                <Link>
                  Configuración
                </Link>
                </div>
                
                <div className="w-full text-left px-4 py-2 cursor-pointer">
                <LogoutButton className="">
                  Cerrar sesión
                </LogoutButton>
                </div>
              </div>
            )}
          </div>
    </div>
</header>

            {/* --- TÍTULO DE LA SECCIÓN AGENDA --- */}
            <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-4 border-b-2 border-accent pb-2">
                Agenda de Citas
            </h2>
            
            {/* --- CONTENEDOR DE CITAS --- */}
            <div className="p-5 sm:p-6 border border-primary/20 rounded-2xl bg-light shadow-inner">
                <CitasDoctor />
            </div>
            
        </div>
    );
};

export default DoctorPage;
