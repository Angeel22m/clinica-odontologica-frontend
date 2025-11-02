import { useMemo, useState } from "react";
import type { Empleado } from "../../types/empleado";
import { Pencil, XCircle, CheckCircle, UserPlus, Search } from "lucide-react";

type Props = {
  empleados: Empleado[];
  onCrear: () => void;
  onEditar: (emp: Empleado) => void;
  onToggleActivo: (emp: Empleado) => void;
};

const currency = new Intl.NumberFormat("es-HN", { style: "currency", currency: "HNL" });

const ListaEmpleados: React.FC<Props> = ({ empleados, onCrear, onEditar, onToggleActivo }) => {
  const [term, setTerm] = useState("");

  // Filtra por nombre, apellido o correo
  const filtered = useMemo(() => {
    const q = term.trim().toLowerCase();
    if (!q) return empleados;
    return empleados.filter(
      e =>
        e.nombre.toLowerCase().includes(q) ||
        e.apellido.toLowerCase().includes(q) ||
        e.correo.toLowerCase().includes(q)
    );
  }, [empleados, term]);

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl font-extrabold text-primario mt-10 mb-6">
        Administración de Empleados
      </h1>

      {/* Barra: buscador + botón */}
      <div className="flex flex-col sm:flex-row justify-between items-center w-full max-w-7xl mb-6 px-6 gap-4">
        <div className="relative w-full sm:w-1/2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-primario" size={18} />
          <input
            type="text"
            placeholder="Buscar por nombre, apellido o correo..."
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-primario/20 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-celeste2"
          />
        </div>
        <button onClick={onCrear} className="btn btn-primary">
          <UserPlus size={18} />
          <span className="ml-2">Agregar Empleado</span>
        </button>
      </div>

      {/* Tabla con cabecera oscura y scroll vertical */}
      <div className="w-full max-w-7xl card overflow-hidden">
        <div className="overflow-y-auto max-h-[70vh]">
          <table className="min-w-full text-left">
            <thead className="bg-primario text-white sticky top-0 z-10">
              <tr className="text-sm">
                <th className="py-3 px-4">Nombre</th>
                <th className="py-3 px-4">Apellido</th>
                <th className="py-3 px-4">DNI</th>
                <th className="py-3 px-4">Teléfono</th>
                <th className="py-3 px-4">Dirección</th>
                <th className="py-3 px-4">Fecha Nac.</th>
                <th className="py-3 px-4">Correo</th>
                <th className="py-3 px-4">Rol</th>
                <th className="py-3 px-4">Puesto</th>
                <th className="py-3 px-4">Salario</th>
                <th className="py-3 px-4">Fecha Ingreso</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primario/10">
              {filtered.map((e) => (
                <tr key={e.id} className="bg-white hover:bg-grisClaro">
                  <td className="py-3 px-4">{e.nombre}</td>
                  <td className="py-3 px-4">{e.apellido}</td>
                  <td className="py-3 px-4">{e.dni}</td>
                  <td className="py-3 px-4">{e.telefono}</td>
                  <td className="py-3 px-4">{e.direccion}</td>
                  <td className="py-3 px-4">{new Date(e.fechaNac).toLocaleDateString()}</td>
                  <td className="py-3 px-4">{e.correo}</td>
                  <td className="py-3 px-4 capitalize">{e.rol}</td>
                  <td className="py-3 px-4">{e.puesto}</td>
                  <td className="py-3 px-4">{currency.format(e.salario)}</td>
                  <td className="py-3 px-4">{new Date(e.fechaIngreso).toLocaleDateString()}</td>
                  <td className="py-3 px-4">
                    {e.activo ? (
                      <span className="text-verde font-semibold">Activo</span>
                    ) : (
                      <span className="text-red-500 font-semibold">Inactivo</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2 justify-center">
                      <button onClick={() => onEditar(e)} className="btn btn-warning">
                        <Pencil size={16} />
                        <span className="ml-1">Editar</span>
                      </button>

                      {e.activo ? (
                        <button onClick={() => onToggleActivo(e)} className="btn btn-danger">
                          <XCircle size={16} />
                          <span className="ml-1">Desactivar</span>
                        </button>
                      ) : (
                        <button onClick={() => onToggleActivo(e)} className="btn btn-success">
                          <CheckCircle size={16} />
                          <span className="ml-1">Activar</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="text-center text-primario/60 py-6">No se encontraron empleados.</div>
        )}
      </div>
    </div>
  );
};

export default ListaEmpleados;
