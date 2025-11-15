import { useState } from "react";
import ModalAgendarCita from "../components/ModalAgendarCita";
import { FiMenu } from "react-icons/fi";
import { FiBell } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function HomePaciente() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-light text-primary">
      {/* HEADER */}
      <header className="w-full bg-white shadow-sm py-3 px-6 flex justify-end items-center">
        <nav className="flex items-center gap-8">
          <button className="hover:text-info transition cursor-pointer">Historial clínico</button>
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
                <button className="w-full text-left px-4 py-2 hover:bg-primary/10 cursor-pointer">
                  Perfil
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-primary/10 cursor-pointer">
                  Configuración
                </button>
                <button className="w-full text-left px-4 py-2 hover:bg-primary/10 text-red-500 cursor-pointer">
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="p-6 max-w-7xl mx-auto">
      <div className="text-success text-3xl font-bold mb-2" >{`Hola, ${JSON.parse(localStorage.getItem('user')).persona.nombre}`}</div>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Citas pendientes */}
          <section className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-xl font-medium mb-3">
              Citas pendientes de asistir
            </h2>
            <div className="bg-primary/5 rounded-lg p-6 text-center">
              (Aquí van las citas pendientes...)
            </div>
          </section>

          {/* Citas por confirmar */}
          <section className="bg-white shadow-lg rounded-xl p-6">
            <h2 className="text-xl font-medium mb-3">Citas por confirmar</h2>
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

