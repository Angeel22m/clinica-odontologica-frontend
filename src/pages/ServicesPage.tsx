import React, { useEffect, useState } from "react";
import axios from "axios";

const PublicServiciosPage = () => {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const response = await axios.get("/api/servicios"); // tu endpoint

        // Asegurarnos de que servicios sea un array
        const data = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data.data)
          ? response.data.data
          : []; // si no es un array, usamos uno vacío

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

  const serviciosActivos = servicios.filter((s) => s.activo);

  return (
    <section className="py-16 bg-light">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-12 text-primary">
          Nuestros Servicios
        </h2>

        {serviciosActivos.length === 0 ? (
          <p className="text-primary py-16">
            No hay servicios disponibles
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {serviciosActivos.map((servicio) => (
              <div
                key={servicio.id}
                className="bg-light border border-accent rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <h3 className="text-xl font-semibold mb-2 text-primary">
                  {servicio.nombre}
                </h3>
                <p className="text-primary mb-4">{servicio.descripcion}</p>
                <p className="text-success font-semibold">
                  Precio: ${servicio.precio}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PublicServiciosPage;

