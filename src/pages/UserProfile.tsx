import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FiUser, FiMail, FiPhone, FiCalendar, FiEdit, FiArrowLeft } from "react-icons/fi";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function UserProfile() {
  const userCorreo = JSON.parse(localStorage.getItem("user")).correo;

  const [originalData, setOriginalData] = useState(null); // Datos para el aside
  const [formData, setFormData] = useState({}); // Datos editables
  const [isEditing, setIsEditing] = useState(false);
  const [changed, setChanged] = useState(false);
  const [loading, setLoading] = useState(false);
  
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
      });

    } catch (err) {
      console.error("Error GET:", err);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!isEditing || loading || !editContainerRef.current) return;
      if (!editContainerRef.current.contains(event.target)) {
        setIsEditing(false)
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing, loading]);


  // Detecta cambios
  
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setChanged(true);
  };

  const handleSaveChanges = async () => {
    if (!changed) return;

    setLoading(true);
    try {
      const res = await axios.patch(
        `http://localhost:3000/modificar/actualizar/${userCorreo}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      
      const correoOriginal = JSON.parse(localStorage.getItem("user")).correo;
      const correoNuevo = formData.correo;
      
      if (correoNuevo && correoNuevo !== correoOriginal) {
        alert("Acabas de actualizar tu correo! Debes iniciar sesion con su nuevo correo.");
        
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        
        window.location.href = "/login";
        return;
      }

      alert(res.data.message || "Datos actualizados.");

      // Actualiza el aside con los nuevos datos
      setOriginalData((prev) => ({
        ...prev,
        data: {
          ...prev.data,
          persona: {
            ...prev.data.persona,
            ...formData,
          },
        },
        correo: formData.correo,
      }));

      setChanged(false);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error al actualizar datos");
    }
    setLoading(false);
  };

  if (!originalData) return <p>Cargando...</p>;

  return (
    <div className="min-h-screen bg-light p-6">

      {/* HEADER */}
      <header className="flex justify-between items-center mt-2 mb-10">
        <h1 className="text-4xl font-bold text-primary">Perfil de Usuario</h1>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* SIDEBAR */}
        <aside className="lg:col-span-1 bg-primary text-light rounded-xl p-6 shadow-lg">
          <Link className="flex flex-cols w-24 items-center gap-2 mb-4 hover:text-accent" to="/home/paciente">
            <FiArrowLeft />
            <div>Regresar</div>
          </Link>

          <div className="flex flex-col items-center text-center">
            <div className="bg-light text-primary rounded-full p-4 w-24 h-24 flex items-center justify-center text-4xl shadow">
              <FiUser />
            </div>

            <h2 className="text-2xl font-semibold mt-4">
              {originalData.data.persona.nombre} {originalData.data.persona.apellido}
            </h2>
          </div>

          <div className="mt-6 space-y-3 text-md">
            <p className="flex items-center gap-2"><FiMail /> {originalData.data.correo}</p>
            <p className="flex items-center gap-2"><FiPhone /> {originalData.data.persona.telefono}</p>
            <p className="flex items-center gap-2"><FiUser /> DNI: {originalData.data.persona.dni}</p>
            <p className="flex items-center gap-2"><FiCalendar /> Creado: {originalData.data.persona.createdAt?.substring(0, 10)}</p>
          </div>

          <div className="mt-8 space-y-3 flex justify-center">
            <button className="btn-primary w-52 flex items-center justify-center gap-2">
              <FiEdit /> Cambiar contraseña
            </button>
          </div>
        </aside>

        {/* CONTENIDO PRINCIPAL */}
        <main className="lg:col-span-2 space-y-6">

          <section className="bg-light p-6 rounded-xl shadow border border-primary/10" ref={editContainerRef}>
            <h3 className="text-2xl font-semibold text-primary mb-4">Información General</h3>

            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
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
                <div key={field}>
                  <p className="text-primary/70 text-lg py-1">{label}</p>

                  {isEditing ? (
                    <input
                      className="w-60 border border-primary/30 rounded-lg px-2 py-2 focus:outline-none focus:ring-1 focus:ring-primary/40 text-primary"
                      value={formData[field]}
                      onChange={(e) => handleInputChange(field, e.target.value)}
                      type={field === "fechaNac" ? "date" : "text"}
                    />
                  ) : (
                    <p className="font-medium text-primary">{formData[field]}</p>
                  )}
                </div>
              ))}
            </div>

            <AnimatePresence>
              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 2 }}
                  className="mt-10"
                >
                  <button
                    onClick={handleSaveChanges}
                    disabled={loading}
                    className="btn-primary text-light px-6 py-2 rounded-lg shadow hover:bg-primary/90 transition"
                  >
                    {loading ? "Guardando..." : "Guardar cambios"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </main>
      </div>
    </div>
  );
}

