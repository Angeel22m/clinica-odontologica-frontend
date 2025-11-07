// src/pages/empleadosPage.tsx
import { useEffect, useState } from "react";
import { obtenerEmpleados } from "../../services/empleadosService";
import {ListaEmpleados} from "../../components/listaEmpleados";
import EmpleadoModal from "../../components/EmpleadoModal";
import type { EmpleadoResponse } from "../../types/empleado";



export default function EmpleadosPage() {
  const [empleados, setEmpleados] = useState<EmpleadoResponse[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [empleadoEdit, setEmpleadoEdit] = useState<EmpleadoResponse | null>(null);
  const [filtro, setFiltro] = useState("");
  const cargar = async () => {
    const data = await obtenerEmpleados();
    setEmpleados(data);
  };

  useEffect(() => {
    cargar();
  }, []);

  return (
    <div className="p-8 bg-light min-h-screen text-primary">
  {/* Encabezado */}
  <div className="flex justify-between items-center mb-8">
    <div>
      <h1 className="text-4xl font-bold mb-2 text-primary">
        Administración de Empleados
      </h1>
      <p className="text-primary/70">
        Crea, edita y gestiona los empleados de la clínica.
      </p>
    </div>

    <button
      className="btn-nueva-consulta shadow-md"
      onClick={() => {
        setEmpleadoEdit(null);
        setModalOpen(true);
      }}
    >
      + Nuevo empleado
    </button>
  </div>

  {/* Contenedor principal */}
  <div className="bg-light border border-primary/10 shadow-md rounded-xl p-6">
    <div className="flex justify-between mb-4">
      <input
        className="w-2/3 border border-primary/20 rounded-lg px-4 py-2 text-primary bg-light focus:outline-none focus:border-info focus:ring-2 focus:ring-info/40 transition-all duration-300"
        placeholder="Buscar por nombre, apellido o DNI"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
      />

      <button
        className="btn-accent shadow-sm"
        onClick={() => {
          setEmpleadoEdit(null);
          setModalOpen(true);
        }}
      >
        Nuevo empleado
      </button>
    </div>

    <ListaEmpleados
      empleados={empleados}
      filtro={filtro}
      onEditar={(e) => {
        setEmpleadoEdit(e);
        setModalOpen(true);
      }}
    />
  </div>

  {/* Modal */}
  {modalOpen && (
    <div className="overlay-dark fixed inset-0 flex justify-center items-center">
      <div className="bg-light rounded-xl p-6 shadow-xl animate-slide-in w-[90%] max-w-lg border border-primary/10">
        <EmpleadoModal
          empleadoSeleccionado={empleadoEdit}
          onClose={() => setModalOpen(false)}
          onSaved={() => {
            setModalOpen(true);
            cargar();
          }}
          visible={true}
        />
      </div>
    </div>
  )}
</div>

  );
}
