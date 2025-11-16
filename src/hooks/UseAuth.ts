import { useState, useEffect } from "react";

interface AuthUser {
  idUser: number;
  idEmpleado: number;
  rol: string | null;
  token: string | null;
  user: Record<string, any> | null;
  isLoggedIn: boolean;
}
export const useAuth = (): AuthUser & { nombre?: string; apellido?: string } => {
  const [auth, setAuth] = useState<AuthUser & { nombre?: string; apellido?: string }>({
    idUser: 0,
    idEmpleado: 0,
    rol: null,
    token: null,
    user: null,
    isLoggedIn: false,
    nombre: undefined,
    apellido: undefined,
  });

  const updateAuth = () => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    let idUser = 0;
    let idEmpleado = 0;
    let rol: string | null = null;
    let user: Record<string, any> | null = null;
    let nombre: string | undefined;
    let apellido: string | undefined;

    if (storedUser) {
      try {
        const userObj = JSON.parse(storedUser);
        user = userObj;

        idUser = userObj?.personaId ?? 0;
        idEmpleado = userObj?.empleadoId ?? 0;
        rol = userObj?.rol ?? null;

        // Agregar nombre y apellido directamente
        nombre = userObj?.persona?.nombre;
        apellido = userObj?.persona?.apellido;
      } catch (error) {
        console.error("Error al parsear user del localStorage:", error);
      }
    }

    setAuth({
      idUser,
      idEmpleado,
      rol,
      token,
      user,
      isLoggedIn: !!token && !!user,
      nombre,
      apellido,
    });
  };

  useEffect(() => {
    updateAuth();

    const handleStorage = (event: StorageEvent) => {
      if (event.key === "user" || event.key === "token") {
        updateAuth();
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return auth;
};
