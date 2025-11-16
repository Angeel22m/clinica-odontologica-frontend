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
      className="w-full flex items-center gap-4 btn-alert rounded-md p-2 cursor-pointer shadow">
      <LogOut className="w-5 h-5" />
      Logout
    </button>
  );
};

export default LogoutButton;
