import { useState, useEffect } from "react";

interface AuthUser {
  idUser: number;
  idEmpleado: number;
  rol: string | null;
  token: string | null;
  user: Record<string, any> | null;
  isLoggedIn: boolean;
  isVerificado: boolean;
  isLoading:boolean;
}
export const useAuth = (): AuthUser & { nombre?: string; apellido?: string; refreshAuth: () => void } => {
  const [auth, setAuth] = useState<AuthUser & { nombre?: string; apellido?: string }>({
    idUser: 0,
    idEmpleado: 0,
    rol: null,
    token: null,
    user: null,
    isLoggedIn: false,
    nombre: undefined,
    apellido: undefined,
    isVerificado: false,
    isLoading: true,
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
    let isVerificado: boolean = false;

    if (storedUser) {
      try {
        const userObj = JSON.parse(storedUser);
        user = userObj;

        idUser = userObj?.personaId ?? 0;
        idEmpleado = userObj?.empleadoId ?? 0;
        rol = userObj?.rol ?? null;

        nombre = userObj?.persona?.nombre;
        apellido = userObj?.persona?.apellido;
        isVerificado = !!userObj?.verificado;        
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
      isVerificado,
      isLoading: false,
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

  // Agregamos refreshAuth al retorno
  return { ...auth, refreshAuth: updateAuth };
};
