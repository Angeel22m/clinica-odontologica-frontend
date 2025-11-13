// src/components/LogoutButton.tsx
import React from "react";
import { LogOut } from "lucide-react";

const LogoutButton: React.FC = () => {
  const handleLogout = () => {
    const confirmLogout = window.confirm("¿Estás seguro de que deseas cerrar sesión?");
    if (!confirmLogout) return;

    // Elimina los datos de sesión
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirige al login
    window.location.href = "/login";
  };

  return (
    <button
      onClick={handleLogout}
      className="absolute top-4 right-4 px-3 py-2 flex items-center gap-1 bg-accent text-light font-semibold rounded-lg shadow hover:bg-primary hover:text-light transition-colors btn-nueva-consulta"
    >
      <LogOut className="w-5 h-5" />
      Logout
    </button>
  );
};

export default LogoutButton;
