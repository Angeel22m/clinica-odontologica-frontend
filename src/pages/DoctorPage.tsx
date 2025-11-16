import React from 'react';
import CitasDoctor from '../components/DoctorComponentes/CitasDoctor'; 

// ----------------------------------------------------------------------
// 1. PLACEHOLDER PARA REACT-ROUTER-DOM (Simulación del componente Link)
// ----------------------------------------------------------------------
const Link: React.FC<{ to: string, children: React.ReactNode, className?: string, title?: string }> = 
    ({ to, children, className, title }) => (
    <a href={to} className={className} title={title}>
        {children}
    </a>
);

// ----------------------------------------------------------------------
// 2. Datos Mock
// ----------------------------------------------------------------------
interface Doctor {
    id: number;
    nombre: string;
}

const mockDoctor: Doctor = {
    id: 3,
    nombre: "Ana López (Odontólogo)" 
};

// ----------------------------------------------------------------------
// 3. Componente DoctorPage
// ----------------------------------------------------------------------
const DoctorPage: React.FC = () => {
    
    const handleMenuClick = () => {
        console.log('Menú lateral abierto');
    };

    return (
        <div className="max-w-7xl w-full mx-auto p-6 bg-light border border-primary/20 rounded-2xl shadow-xl font-inter">
            
           {/* --- CABECERA (Doctor Info y Botones) --- */}
<header className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3 sm:gap-4">

    {/* Información del Doctor */}
    <div className="w-full sm:flex-1 p-3 bg-primary/10 border border-primary/20 rounded-xl text-primary font-semibold text-lg sm:text-xl shadow-sm">
        Doctor {mockDoctor.nombre}
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
        
        {/* Menú Icono */}
        <div 
            onClick={handleMenuClick} 
            className="w-10 h-10 border border-primary/30 text-primary rounded-full 
                       flex items-center justify-center font-bold text-xl cursor-pointer 
                       transition duration-200 hover:bg-accent hover:text-primary hover:border-accent shadow-sm"
            title="Menú"
        >
            ☰
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
