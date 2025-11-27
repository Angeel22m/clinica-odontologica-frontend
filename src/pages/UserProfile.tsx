import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FiUser, FiMail, FiPhone, FiCalendar, FiEdit, FiArrowLeft, FiLock, FiSave, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Notification from "../components/Notification";


// Expresiones regulares para validación de campos
const regexValidations = {
    // Al menos 3 caracteres, solo letras y espacios (permite nombres compuestos)
    nombre: /^[A-Za-zñÑáéíóúÁÉÍÓÚ\s]{3,}$/, 
    apellido: /^[A-Za-zñÑáéíóúÁÉÍÓÚ\s]{3,}$/,
    // Formato de correo estándar
    correo: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
    // Mínimo 8 dígitos, solo números (ajusta según el formato de tu país)
    telefono: /^\d{7,8}$/, 
    // 8 a 10 dígitos, solo números
    dni: /^\d{12,13}$/, 
    // Permite alfanumérico, espacios, comas, puntos, guiones
    direccion: /^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ\s,.\-]{5,}$/,
    // Nota: La contraseña es mejor validarla con reglas más estrictas en el backend.
};

const strongPasswordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-+])[A-Za-z\d!@#$%^&*()\-+]{8,}$/;

interface NotificationState {
  message: string;
  type: 'success' | 'alert' | 'info';
}

export default function UserProfile() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userCorreo = user.correo;

  const [originalData, setOriginalData] = useState(null);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [changed, setChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newPasswordError, setNewPasswordError] = useState<string>('')
  const [validationErrors, setValidationErrors] = useState({});
  
  // ESTADOS NUEVOS PARA CONTRASEÑA
  const [viewMode, setViewMode] = useState<'profile' | 'password'>('profile');
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [notification, setNotification] = useState<NotificationState | null>(null);
  
  const editContainerRef = useRef(null);

  // Cargamos datos del backend
  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:3000/modificar/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOriginalData(res.data);

      setFormData({
        nombre: res.data.data.persona.nombre || "",
        apellido: res.data.data.persona.apellido || "",
        direccion: res.data.data.persona.direccion || "",
        telefono: res.data.data.persona.telefono || "",
        correo: res.data.data.correo || "",
        dni: res.data.data.persona.dni || "",
        fechaNac: res.data.data.persona.fechaNac || "",
      });

    } catch (err) {
      console.error("Error GET:", err);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);
  
  // Click outside para cerrar edición de perfil (solo activo en modo perfil)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (viewMode !== 'profile') return; // No hacer nada si estamos en modo contraseña
      if (!isEditing || loading || !editContainerRef.current) return;
      if (!editContainerRef.current.contains(event.target)) {
        setIsEditing(false)
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing, loading, viewMode]);


  // --- MANEJADORES DE PERFIL ---
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setChanged(true);
  };

  const handleSaveChanges = async () => {
    if (!changed) return;

    // --- 1. PROCESO DE VALIDACIÓN ---
    const errors = {};
    let formIsValid = true;

    // Iterar sobre los campos que deben ser validados
    for (const [field, label] of Object.entries({
        nombre: "Nombre", apellido: "Apellido", correo: "Correo", telefono: "Teléfono",
        dni: "DNI", direccion: "Dirección",
    })) {
        const value = formData[field];
        const regex = regexValidations[field];
        
        // Solo validar si el valor ha cambiado y si tenemos una RegEx para el campo
        if (regex && value && !regex.test(value)) {
            errors[field] = `Formato de ${label} inválido.`;
            formIsValid = false;
        }
    }
    
    // Actualizar el estado de errores
    setValidationErrors(errors);

    // Si hay errores, detenemos el proceso
    if (!formIsValid) {
        setNotification({message: "Por favor, corrige los errores en el formulario.", type:'alert'});
        return;
    }

    setLoading(true);
    try {
      await axios.patch(
        `http://localhost:3000/modificar/actualizar/${userCorreo}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      
      const correoOriginal = user.correo;
      const correoNuevo = formData["correo"]; // Asegurar acceso correcto
      
      if (correoNuevo && correoNuevo !== correoOriginal) {
        setNotification({message:"Acabas de actualizar tu correo! Debes iniciar sesión con su nuevo correo.", type:'info'});
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return;
      }
     
      setNotification({message:'Datos actualizados.', type:'success'});

      setOriginalData((prev) => ({
        ...prev,
        data: {
          ...prev.data,
          persona: {
            ...prev.data.persona,
            ...formData,
          },
        },
        correo: formData["correo"],
      }));

      setChanged(false);
      setIsEditing(false);
    } catch (err) {
      setNotification({message:"Error al actualizar datos", type:'alert'});
    }
    setLoading(false);
  };

  // --- MANEJADORES DE CONTRASEÑA ---
  
  const handlePasswordInput = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const toggleViewMode = () => {
    if (viewMode === 'profile') {
        setViewMode('password');
        setIsEditing(false); // Asegurar que salimos de edición
    } else {
        setViewMode('profile');
        // Limpiar campos de contraseña al salir
        setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    }
  };

 // ... (código anterior del componente React)

// El estado userCorreo ya existe y se usa en la URL
// const userCorreo = JSON.parse(localStorage.getItem("user")).correo;

// ... (handlePasswordInput y toggleViewMode se mantienen igual)

const handleSubmitPassword = async (e) => {
    e.preventDefault();
    setNewPasswordError('');
    
    // Validaciones básicas de campos obligatorios
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
        setNotification({ message: "Todos los campos son obligatorios", type: 'alert' });
        return;
    }

    // Validación de que la nueva contraseña y la confirmación coincidan
    if (passwordData.newPassword !== passwordData.confirmPassword) {
        setNotification({ message: "La nueva contraseña y la confirmación no coinciden", type: 'alert' });
        return;
    }
    
    // Validación adicional: La nueva contraseña no puede ser igual a la actual
    // (Esta validación ya se hace en el backend, pero es buena práctica hacerla también en el front)
    if (passwordData.currentPassword === passwordData.newPassword) {
        setNotification({ message: "La nueva contraseña no puede ser igual a la actual.", type: 'alert' });
        return;
    }

    if (!strongPasswordRegex.test(passwordData.newPassword)) {
        const errorMsg = "La nueva contraseña debe tener un mínimo de 8 caracteres, incluyendo al menos una mayúscula, un número y un carácter especial.";
        setNewPasswordError(errorMsg); // <--- ESTABLECER ERROR
        setNotification({ message: errorMsg, type: 'alert' });
        return;
    }

    setLoading(true);
    try {
        const response = await axios.patch(
            `http://localhost:3000/Modificar/cambiar-password/${userCorreo}`, 
            {
                passwordActual: passwordData.currentPassword,
                passwordNueva: passwordData.newPassword
            }, 
            { 
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                } 
            }
        );
        
        // El backend devuelve { message: 'Contraseña actualizada correctamente.' }
        setNotification({ message: response.data.message, type: 'success' });
        toggleViewMode(); // Regresar al perfil y limpiar campos
        
    } catch (error) {
        let errorMessage = "Error interno al procesar la solicitud.";
        
        // Manejo de errores de Axios/Backend (ej. código 401, 403, 400)
        if (axios.isAxiosError(error) && error.response) {
            
            // Tu backend devuelve un objeto { message: '...' } para los errores de validación.
            // Si el backend es NestJS, a veces usa 'message' o 'error.response.data.message'.
            const backendMessage = error.response.data.message || error.response.data.error;
            
            if (backendMessage) {
                // Si el mensaje es un array (típico de validadores de NestJS)
                if (Array.isArray(backendMessage)) {
                    errorMessage = backendMessage[0]; 
                } else {
                    errorMessage = backendMessage; // El mensaje de error específico (ej. "La contraseña actual es incorrecta")
                }
            } else {
                // Mensaje genérico si no se pudo extraer el mensaje específico
                errorMessage = `Error ${error.response.status}: Ocurrió un problema en el servidor.`;
            }
        }

        setNotification({ message: errorMessage, type: 'alert' });
        
    } finally {
        setLoading(false);
    }
};
  
    useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Función auxiliar para determinar la ruta base según el rol
const getHomeRoute = (rol: string | undefined) => {
  switch (rol) {
    case 'ADMIN':
      return '/dashboard';
    case 'DOCTOR':
      return '/citas/doctor';
    case 'RECEPCIONISTA':
      return '/recepcionista';
    case 'CLIENTE': // Agrega otros roles si los tienes
      return '/home/paciente';
    default:
      return '/login'; // Ruta por defecto o login si el rol no es válido
  }
};

const homePath = getHomeRoute(user.rol);

  if (!originalData) return <p className="text-center mt-10">Cargando perfil...</p>;

  return (
    <div className="min-h-screen bg-light p-6">

      {/* HEADER */}
      <header className="flex justify-between items-center mt-2 mb-10">
        <h1 className="text-4xl font-bold text-primary">Perfil de Usuario</h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* SIDEBAR */}
        <aside className="lg:col-span-1 bg-primary text-light rounded-xl p-6 shadow-lg h-fit">
         {/* APLICAMOS LA RUTA DINÁMICA */}
  <Link 
    className="flex flex-cols w-24 items-center gap-2 mb-4 hover:text-accent transition" 
    to={homePath} // <--- ¡AQUÍ ESTÁ EL CAMBIO!
  >
    <FiArrowLeft />
    <div>Regresar</div>
  </Link>

          <div className="flex flex-col items-center text-center">
            <div className="bg-light text-primary rounded-full p-4 w-24 h-24 flex items-center justify-center text-4xl shadow mb-4">
              <FiUser />
            </div>

            <h2 className="text-2xl font-semibold">
              {originalData.data.persona.nombre} {originalData.data.persona.apellido}
            </h2>
          </div>

          <div className="mt-6 space-y-3 text-md border-t border-light/20 pt-4">
            <p className="flex items-center gap-3"><FiMail /> {originalData.data.correo}</p>
            <p className="flex items-center gap-3"><FiPhone /> {originalData.data.persona.telefono}</p>
            <p className="flex items-center gap-3"><FiUser /> DNI: {originalData.data.persona.dni}</p>
            <p className="flex items-center gap-3"><FiCalendar /> Registro: {originalData.data.persona.createdAt?.substring(0, 10)}</p>
          </div>

          <div className="mt-8 flex justify-center">
            {/* Botón que alterna entre vistas */}
            <button 
                onClick={toggleViewMode}
                className={`w-full py-2 rounded-lg flex items-center justify-center gap-2 transition font-medium shadow-md ${
                    viewMode === 'profile' 
                    ? 'bg-light text-primary hover:bg-accent hover:text-light' 
                    : 'bg-accent text-light hover:bg-light hover:text-primary'
                }`}
            >
              {viewMode === 'profile' ? (
                  <> <FiLock /> Cambiar contraseña </>
              ) : (
                  <> <FiUser /> Ver información personal </>
              )}
            </button>
          </div>
        </aside>

        {/* CONTENIDO PRINCIPAL (CONDICIONAL) */}
        <main className="lg:col-span-2">
            
          {/* MODO 1: PERFIL (Información General) */}
          {viewMode === 'profile' && (
              <motion.section 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-light p-6 rounded-xl shadow border border-primary/10" 
                ref={editContainerRef}
              >
                <div className="flex justify-between items-center mb-6 border-b pb-2 border-gray-200">
                    <h3 className="text-2xl font-semibold text-primary">Información General</h3>
                    {!isEditing && (
                        <p className="text-sm text-gray-400 italic">Haz click en los datos para editar</p>
                    )}
                </div>

                <div
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  onClick={() => setIsEditing(true)}
                >
                  {Object.entries({
                    nombre: "Nombre",
                    apellido: "Apellido",
                    correo: "Correo",
                    telefono: "Teléfono",
                    dni: "DNI",
                    direccion: "Dirección",
                  }).map(([field, label]) => (
                    <div key={field} className="flex flex-col">
                      <label className="text-primary/70 text-sm font-semibold mb-1">{label}</label>

                      {isEditing ? (
                        <input
                          className="w-full border border-primary/30 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 text-primary bg-white"
                          value={formData[field]}
                          onChange={(e) => handleInputChange(field, e.target.value)}
                          type={field === "fechaNac" ? "date" : "text"}
                          
                        />
                        
                      ) : (
                        <p className="font-medium text-lg text-primary border-b border-transparent hover:border-gray-200 py-1 transition">
                            {formData[field] || <span className="text-gray-400 text-sm">Sin definir</span>}
                        </p>
                      )}
                      {validationErrors[field] && (
    <p className="text-alert text-sm mt-1 italic">{validationErrors[field]}</p>
)}
                    </div>
                  ))}
                </div>

                <AnimatePresence>
                  {isEditing && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="mt-8 flex justify-end gap-3"
                    >
                      <button 
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 text-primary hover:bg-gray-100 rounded-lg transition"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleSaveChanges}
                        disabled={loading}
                        className="btn-primary text-light px-6 py-2 rounded-lg shadow hover:bg-primary/90 transition flex items-center gap-2"
                      >
                        <FiSave /> {loading ? "Guardando..." : "Guardar cambios"}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.section>
          )}

          {/* MODO 2: CAMBIAR CONTRASEÑA */}
          {viewMode === 'password' && (
              <motion.section 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-light p-6 rounded-xl shadow border border-primary/10"
              >
                <div className="flex justify-between items-center mb-6 border-b pb-2 border-gray-200">
                    <h3 className="text-2xl font-semibold text-primary flex items-center gap-2">
                        <FiLock /> Seguridad
                    </h3>
                </div>

                <form onSubmit={handleSubmitPassword} className="max-w-md mx-auto space-y-5 py-4">
                    
                    {/* Contraseña Actual */}
                    <div>
                        <label className="block text-primary font-medium mb-1">Contraseña Actual</label>
                        <input 
                            type="password"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordInput}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                            placeholder="Ingrese su contraseña actual"
                        />
                    </div>

                    {/* Nueva Contraseña */}
                    <div>
                        <label className="block text-primary font-medium mb-1">Nueva Contraseña</label>
                        <input 
                            type="password"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordInput}
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
                            placeholder="Ingrese la nueva contraseña"
                        />
                        {/* MOSTRAR MENSAJE DE ERROR */}
    {newPasswordError && (
        <p className="text-red-500 text-xs mt-1 italic">{newPasswordError}</p>
    )}
                    </div>

                    {/* Confirmar Contraseña */}
                    <div>
                        <label className="block text-primary font-medium mb-1">Comprobar Nueva Contraseña</label>
                        <input 
                            type="password"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordInput}
                            className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:outline-none ${
                                passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword
                                ? 'border-red-500 focus:ring-red-200'
                                : 'border-gray-300 focus:ring-primary'
                            }`}
                            placeholder="Repita la nueva contraseña"
                        />
                        {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                            <p className="text-red-500 text-xs mt-1">Las contraseñas no coinciden</p>
                        )}
                    </div>

                    <div className="pt-4 flex justify-between gap-4">
                        <button
                            type="button"
                            onClick={toggleViewMode} // Regresa al perfil
                            className="w-1/2 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !passwordData.newPassword || passwordData.newPassword !== passwordData.confirmPassword}
                            className="w-1/2 btn-primary text-light py-2 rounded-lg shadow hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Actualizando..." : "Actualizar Contraseña"}
                        </button>
                    </div>
                </form>
              </motion.section>
          )}

        </main>
      </div>

      {/* NOTIFICACIONES */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
}