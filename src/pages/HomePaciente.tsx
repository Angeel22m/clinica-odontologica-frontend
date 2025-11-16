import { useState, useEffect } from "react";
import ModalAgendarCita from "../components/ModalAgendarCita";
import { FiMenu } from "react-icons/fi";
import { FiBell } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from 'react-router-dom';
import axios from "axios";
import LogoutButton from "../components/LogoutButton";
import { FiSettings } from "react-icons/fi";
import { FiUser } from "react-icons/fi";

export default function HomePaciente() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [citasPendientes, setCitasPendientes] = useState([]);
  
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || !user.id) {
    window.location.href = 'http://localhost:5173/login';
    return null;
  }
  
  useEffect(() => {
    const fetchCitasPendientes = async () => {
      try {
        const pacienteId = user.id;
        
        const res = await axios.get(`http://localhost:3000/citas/paciente/${pacienteId}`);
        
        setCitasPendientes(Array.isArray(res.data) ? res.data : []);
        
      } catch (err) {
        console.error('error al cargar las citas pendientes', err);
      }
    };
    fetchCitasPendientes(); 
  }, [])

  return (
    <div className="min-h-screen bg-light text-primary">
      {/* HEADER */}
      <header className="w-full bg-white shadow-sm py-3 px-6 flex justify-end items-center">
        <nav className="flex items-center gap-8">
          <Link to={"/Historial"} className="hover:text-info transition cursor-pointer">Historial clínico
          </Link>
          
          <button
            onClick={() => setShowModal(true)}
            className="hover:text-info transition cursor-pointer"
          >
            Crear cita
          </button>
	  <FiBell className="hover:text-info transition h-6 w-6 cursor-pointer" />
	  
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
        </nav>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="p-5 max-w-7xl mx-auto">
      <div className="text-success text-3xl font-bold mb-3" >{`Hola, ${JSON.parse(localStorage.getItem('user')).persona.nombre}`}</div>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Citas pendientes */}
          <section className="bg-white shadow-xl rounded-xl p-6 max-h-[500px] overflow-y-auto">
            <h2 className="text-xl font-medium mb-3">
              Citas pendientes de asistir
            </h2>
            { citasPendientes.length > 0 ? (
            <div className="flex flex-col gap-4">
              { citasPendientes.map(cita => (
                <div
                  key = {cita.id}
                  className="p-4 border border-primary/20 rounded-lg shadow-sm hover:shadow-lg transition"
                >
                  <div className="text-lg font-semibold text-primary">
                    {cita.servicio?.nombre}
                  </div>
                  
                  <div className="mt-1 text-sm text-gray-600">
                    Con: {" "}
                    <span className="font-medium text-dark">
                      {cita.doctor?.persona?.nombre} {cita.doctor?.persona?.apellido}
                    </span>
                  </div>
                  
                  <div className="mt-1 text-sm text-gray-600">
                    Fecha y Hora:{" "}
                    <span className="font-medium text-dark">
                      {new Date(cita.fecha).toLocaleDateString()} - {cita.hora.length===6 ? cita.hora.slice(1).replace('_', ':') : cita.hora}
                    </span>
                  </div>
                  
                  <div className="mt-2 flex justify-center gap-3">
                    <button
                      onClick={() => handleEditar(cita)}
                      className="px-3 py-1 rounded-lg bg-accent text-white hover:bg-info"
                    >Editar
                    </button>
                  
                    <button
                      onClick={() => handleEliminar(cita.id)}
                      className="px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600"
                    >Cancelar
                    </button>
                  </div>
                  
                </div>
              ))}
              
            </div>
            ) : (
            <div>No tiene citas pendientes</div>
            )}
          </section>

          {/* Citas por confirmar */}
          <section className="bg-white shadow-xl rounded-xl p-6">
            <h2 className="text-xl font-medium mb-3">Asistencia confirmada</h2>
            <div className="bg-primary/5 rounded-lg p-6 text-center">
              (Aquí van las citas por confirmar...)
            </div>
          </section>
        </div>
      </main>

      {/* MODAL */}
      {showModal && <ModalAgendarCita onClose={() => setShowModal(false)} />}
    </div>
  );
}

