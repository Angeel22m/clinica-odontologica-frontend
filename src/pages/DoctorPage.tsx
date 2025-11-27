import React from 'react';
import { useState } from "react";
import CitasDoctor from '../components/DoctorComponentes/CitasDoctor'; 
import HeaderMenu from '../components/HeaderMenu';
import { Link } from 'react-router-dom';

import { useAuth } from '../hooks/UseAuth';

const DoctorPage: React.FC = () => {
    
    const [menuOpen, setMenuOpen] = useState(false);
    const {nombre,apellido,idUser} = useAuth();  

    return (
        <div className="w-full mx-auto p-6 bg-light border border-primary/20 rounded-2xl shadow-xl font-inter">
            
           {/* --- CABECERA (Doctor Info y Botones) --- */}
<header className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3 sm:gap-4">

    {/* Información del Doctor */}
    <div className="w-full sm:flex-1 p-3 bg-primary/10 border border-primary/20 rounded-xl text-primary font-semibold text-lg sm:text-xl shadow-sm">
        Dr. {`${nombre } ${apellido}`}
    </div>
    
    <div className="flex w-full sm:w-auto items-center gap-2 sm:gap-3">

        {/* Enlace "Ver Pacientes" */}
        <Link 
            to={`/expedientes/doctor`} 
            className="btn-primary flex-shrink-0 px-4 py-2 text-sm sm:text-base rounded-lg shadow hover:shadow-md transition duration-200"
            title="Ver expedientes y datos de pacientes"
        >
            Ver Pacientes
        </Link>
        
        {/* MENÚ DESPLEGABLE */}
          <HeaderMenu/>
    </div>
</header>

            {/* --- TÍTULO DE LA SECCIÓN AGENDA --- */}
            <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-4 border-b-2 border-primary pb-2">
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
