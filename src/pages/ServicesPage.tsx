import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
const PublicServiciosPage = () => {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);

  const headers= {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  };

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const response = await axios.get("http://localhost:3000/servicios",headers);
	console.log(response.data)
        const data = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data.data)
          ? response.data.data
          : []; 

        setServicios(data);
      } catch (err) {
        console.error(err);
        setError("Error al cargar los servicios.");
      } finally {
        setLoading(false);
      }
    };

    fetchServicios();
  }, []);

  if (loading)
    return <p className="text-primary text-center py-16">Cargando...</p>;
  if (error)
    return <p className="text-red-500 text-center py-16">{error}</p>;

  const serviciosActivos = servicios.filter((s) => s.activo === true
  || s.activo === "activo");

  return (
    
    <section className="py-16 bg-light">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-12 text-primary">
          Nuestros Servicios
        </h2>
        <Link
      to="/"
      className="btn-primary absolute top-4 left-4 px-4 py-2 rounded-lg font-semibold shadow hover:opacity-90 transition"
    >
      Volver
    </Link>
        {serviciosActivos.length === 0 ? (
          <p className="text-primary py-16">
            No hay servicios disponibles
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {serviciosActivos.map((servicio) => (
              <div
                key={servicio.id}
                className="bg-light border border-accent rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow"
              >
                <h3 className="text-xl font-semibold mb-2 text-primary">
                  {servicio.nombre}
                </h3>
                <p className="text-primary mb-4">{servicio.descripcion}</p>
                <p className="text-success font-semibold mb-4">
                  Precio: ${servicio.precio}
                </p>
                
                <a className="btn-primary" onClick={()=>{window.location.href='/home/paciente'}}>Agendar cita</a>
              </div>
            ))}
          </div>
        )}
      </div>
)

    </section>
  );
};

export default PublicServiciosPage;

