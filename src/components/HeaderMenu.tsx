import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiMenu, FiUser, FiSettings } from "react-icons/fi";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";

export default function HamburgerMenu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cerrar menú si se hace click afuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  return (
    <div className="relative" ref={menuRef}>
      {/* Botón hamburguesa */}
      <motion.button
        onClick={() => setMenuOpen(!menuOpen)}
        animate={{ rotate: menuOpen ? -90 : 0 }}
        transition={{ duration: 0.2 }}
        className="p-2"
      >
        <FiMenu className="text-primary hover:text-info transition h-7 w-7 cursor-pointer" />
      </motion.button>

      {/* Menú */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute right-0 mt-2 w-44 bg-light rounded-xl shadow-lg py-2 z-50 border border-primary/10"
          >
            <div className="w-full text-left px-4 py-2 text-primary hover:bg-primary/10 cursor-pointer flex items-center gap-2">
              <FiUser />
              <Link to="/perfil">Perfil</Link>
            </div>

            <div className="w-full text-left px-4 py-2 text-primary hover:bg-primary/10 cursor-pointer flex items-center gap-2">
              <FiSettings />
              <Link to="/configuracion">Configuración</Link>
            </div>

            <hr className="my-1 border-primary/10" />

            <div className="w-full px-2 cursor-pointer">
              <LogoutButton className="text-primary hover:text-alert w-full text-left">
                Cerrar sesión
              </LogoutButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
