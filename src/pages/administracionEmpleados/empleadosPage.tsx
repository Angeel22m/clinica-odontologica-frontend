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
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-2">Administración de Empleados</h1>
      <p className="text-gray-500 mb-6">
        Crea, edita y gestiona los empleados de la clínica.
      </p>

      <div className="flex justify-between mb-4">
        <input
          className="w-2/3 border rounded-lg px-4 py-2"
           placeholder="Buscar por nombre, apellido o DNI"
           value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
      />    
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
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


      {modalOpen && (
        <EmpleadoModal
          empleadoSeleccionado={empleadoEdit}
          onClose={() => setModalOpen(false)}
          onSaved={() => {
            setModalOpen(true);
            cargar();
          } } visible={true}        />
      )}
    </div>
  );
}
