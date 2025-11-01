import { useState } from "react";
import ListaEmpleados from "./listaEmpleados";
import type { Empleado } from "../../types/empleado";
import { crearEmpleado } from "../../services/empleadosService";
import { toast } from "react-hot-toast";

const EmpleadosPage: React.FC = () => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const [nuevoEmpleado, setNuevoEmpleado] = useState<Omit<Empleado, "id">>({
    nombre: "",
    apellido: "",
    dni: "",
    telefono: "",
    direccion: "",
    fechaNac: "",
    correo: "",
    rol: "recepcionista",
    puesto: "",
    salario: 0,
    fechaIngreso: "",
    activo: true,
  });

  const abrirModal = () => setMostrarModal(true);

  const cerrarModal = () => {
    setMostrarModal(false);
    setNuevoEmpleado({
      nombre: "",
      apellido: "",
      dni: "",
      telefono: "",
      direccion: "",
      fechaNac: "",
      correo: "",
      rol: "recepcionista",
      puesto: "",
      salario: 0,
      fechaIngreso: "",
      activo: true,
    });
  };

  const handleGuardar = async () => {
    if (!nuevoEmpleado.nombre.trim() || !nuevoEmpleado.apellido.trim() || !nuevoEmpleado.correo.trim()) {
      toast.error("Completa nombre, apellido y correo.");
      return;
    }

    try {
      // ✅ MOCK + localStorage
      const ok = await crearEmpleado(nuevoEmpleado);
      if (!ok) throw new Error("No se pudo crear (mock).");

      toast.success("Empleado registrado correctamente ✅");
      setReloadKey(k => k + 1);
      cerrarModal();

      // ❗ BACKEND REAL — descomentar para usar API
      /*
      const res = await fetch("http://localhost:3000/api/empleados", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoEmpleado),
      });
      if (!res.ok) throw new Error("Error en backend");
      toast.success("Empleado registrado correctamente (API) ✅");
      setReloadKey(k => k + 1);
      cerrarModal();
      */
    } catch (e) {
      console.error(e);
      toast.error("No se pudo registrar el empleado ❌");
    }
  };

  return (
    <div className="min-h-screen w-full bg-light text-gray-900">
      <ListaEmpleados
        onCrear={abrirModal}
        onEditar={(emp) => console.log("Editar (pendiente):", emp)}
        reloadKey={reloadKey}
      />

      {mostrarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center ">
          <div className="bg-white w-[520px] max-w-[95vw] rounded-xl shadow-lg p-6 overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-bold mb-4 text-center">Nuevo Empleado</h2>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nombre *"
                className="border p-2 rounded col-span-1"
                value={nuevoEmpleado.nombre}
                onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, nombre: e.target.value })}
              />
              <input
                type="text"
                placeholder="Apellido *"
                className="border p-2 rounded col-span-1"
                value={nuevoEmpleado.apellido}
                onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, apellido: e.target.value })}
              />
              <input
                type="text"
                placeholder="DNI"
                className="border p-2 rounded col-span-1"
                value={nuevoEmpleado.dni}
                onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, dni: e.target.value })}
              />
              <input
                type="text"
                placeholder="Teléfono"
                className="border p-2 rounded col-span-1"
                value={nuevoEmpleado.telefono}
                onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, telefono: e.target.value })}
              />
              <input
                type="text"
                placeholder="Dirección"
                className="border p-2 rounded col-span-2"
                value={nuevoEmpleado.direccion}
                onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, direccion: e.target.value })}
              />
              <label className="col-span-1 text-sm text-gray-600 mt-1">Fecha de Nacimiento</label>
              <input
                type="date"
                className="border p-2 rounded col-span-1"
                value={nuevoEmpleado.fechaNac}
                onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, fechaNac: e.target.value })}
              />
              <input
                type="email"
                placeholder="Correo *"
                className="border p-2 rounded col-span-2"
                value={nuevoEmpleado.correo}
                onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, correo: e.target.value })}
              />
              <label className="col-span-1 text-sm text-gray-600 mt-1">Rol</label>
              <select
                className="border p-2 rounded col-span-1"
                value={nuevoEmpleado.rol}
                onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, rol: e.target.value as Empleado["rol"] })}
              >
                <option value="recepcionista">Recepcionista</option>
                <option value="doctor">Doctor</option>
                <option value="administrador">Administrador</option>
              </select>
              <input
                type="text"
                placeholder="Puesto"
                className="border p-2 rounded col-span-1"
                value={nuevoEmpleado.puesto}
                onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, puesto: e.target.value })}
              />
              <input
                type="number"
                placeholder="Salario"
                className="border p-2 rounded col-span-1"
                value={nuevoEmpleado.salario}
                onChange={(e) =>
                  setNuevoEmpleado({ ...nuevoEmpleado, salario: Number(e.target.value || 0) })
                }
              />
              <label className="col-span-1 text-sm text-gray-600 mt-1">Fecha de Ingreso</label>
              <input
                type="date"
                className="border p-2 rounded col-span-1"
                value={nuevoEmpleado.fechaIngreso}
                onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, fechaIngreso: e.target.value })}
              />

              <div className="col-span-2 flex items-center gap-2 mt-1">
                <input
                  id="activo"
                  type="checkbox"
                  checked={nuevoEmpleado.activo}
                  onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, activo: e.target.checked })}
                />
                <label htmlFor="activo" className="text-sm text-gray-700">Activo</label>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={cerrarModal} className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded">
                Cancelar
              </button>
              <button onClick={handleGuardar} className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
                Guardar
              </button>
            </div>

            <div className="mt-4 text-xs text-gray-500">
              {/* ✅ FRONTEND MOCK — eliminar cuando el backend esté listo */}
              <p>Guardado actual: <strong>Mock + localStorage</strong></p>
              {/* ❗ BACKEND REAL — descomentar bloque fetch en handleGuardar para usar API */}
              <p>Para usar API real: descomenta el bloque <code>fetch(...)</code> en <code>handleGuardar</code>.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmpleadosPage;
