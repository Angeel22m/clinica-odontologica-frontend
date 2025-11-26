// src/pages/FacturaPage.tsx
import { useState } from "react";
import HeaderMenu from "../components/HeaderMenu";
import { FiChevronLeft } from "react-icons/fi";
import { Link } from "react-router-dom";
import BuscadorPacienteFactura from "../components/BuscadorPacienteFactura";

export default function FacturaPage() {
  // Datos base (puedes conectar luego al backend)
  const [servicios, setServicios] = useState([]);
  const [paciente, setPaciente] = useState(null);

  return (
    <div className="p-8 min-h-screen bg-light text-primary">
      {/* HEADER */}

      
      <header className="flex justify-between items-center mb-8 border-b border-primary/10 pb-4">

        <button>
           <Link className="btn-primary w-32 flex items-center gap-1" to={"/recepcionista"}>
              <FiChevronLeft />
              
              Regresar</Link>
      
        </button>


        <div>
          <h1 className="text-4xl font-bold mb-1 text-primary">
            Facturación
          </h1>
          <p className="text-primary/70">Facturas</p>
        </div>

        <HeaderMenu />
      </header>

      {/* CONTENEDOR PRINCIPAL */}
    <div className=" gap-6">
        
        {/* BLOQUE: BUSCAR PACIENTE */}
        
        <BuscadorPacienteFactura
        onPacienteSeleccionado={(p) => setPaciente(p)}
      />

      {paciente && (
        <div className="mt-6">
          {/* Aquí irá el formulario de factura más adelante */}
          <p className="text-primary font-medium">
            Nombre Cliente: {paciente.nombre} {paciente.apellido} <br />
            DNI: {paciente.dni}
            
          </p>
        </div>
      )}
        

        {/* BLOQUE: SERVICIOS */}
        <div className="lg:col-span-2 p-6 bg-light border border-primary/10 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Servicios</h2>

          <div className="flex gap-3 mb-4">
            <select className="w-2/3 p-3 border border-primary/20 rounded-xl bg-light text-primary">
              <option value="">Seleccione un servicio</option>
            </select>

            <input
              type="number"
              placeholder="Cantidad"
              className="w-1/3 p-3 border border-primary/20 rounded-xl text-primary"
            />
          </div>

          <button className="btn-primary w-full mb-6">Agregar servicio</button>

          {/* TABLA DE SERVICIOS */}
          <div className="max-h-72 overflow-y-auto border border-primary/10 rounded-xl">
            <table className="w-full text-left">
              <thead className="bg-primary text-light uppercase text-sm sticky top-0">
                <tr>
                  <th className="py-3 px-4">Servicio</th>
                  <th className="py-3 px-4">Cant.</th>
                  <th className="py-3 px-4">Precio</th>
                  <th className="py-3 px-4 text-center">Acción</th>
                </tr>
              </thead>

              <tbody className="text-primary text-sm">
                {servicios.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-6 text-center text-primary/60"
                    >
                      Aún no hay servicios agregados
                    </td>
                  </tr>
                )}

                {servicios.map((s, i) => (
                  <tr
                    key={i}
                    className="border-t border-primary/10 hover:bg-accent/10 transition"
                  >
                    <td className="py-2 px-4">{s.nombre}</td>
                    <td className="py-2 px-4">{s.cantidad}</td>
                    <td className="py-2 px-4">L {s.precio}</td>
                    <td className="py-2 px-4 text-center">
                      <button className="btn-alert px-3 py-1 rounded-lg">
                        Quitar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* TOTAL */}
          <div className="mt-6 text-right text-primary">
            <p className="text-lg">
              <strong>Subtotal:</strong> L 0.00
            </p>
            <p className="text-lg">
              <strong>ISV 15%:</strong> L 0.00
            </p>
            <p className="text-xl font-bold mt-2">
              Total: L 0.00
            </p>
          </div>

          {/* BOTÓN GENERAR */}
          <button className="btn-success w-full mt-6 py-3 rounded-lg shadow">
            Generar factura
          </button>
        </div>
      </div>
    // </div>
  );
}
