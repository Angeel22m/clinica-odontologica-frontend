import type { EmpleadoResponse } from "../types/empleado";

type Props = {
  empleados: EmpleadoResponse[];
  filtro: string;
  onEditar: (empleado: EmpleadoResponse) => void;
};

export const ListaEmpleados = ({ empleados, filtro, onEditar }: Props) => {
  //const normalizar = (v: string) => v.toLowerCase().trim();

  const empleadosFiltrados = empleados.filter((e) => {
  const q = filtro.trim().toLowerCase();

  // si no hay texto en el filtro, muestra todos
  if (!q) return true;

  return (
    e.persona.nombre.toLowerCase().includes(q) ||
    e.persona.apellido.toLowerCase().includes(q) ||
    e.persona.dni.toLowerCase().includes(q)
  );
});

  const formatMoney = (n: number) =>
    `L ${n}`;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-100 text-gray-700 text-sm font-semibold">
          <tr>
            <th className="py-3 px-4">Nombre</th>
            <th className="py-3 px-4">Apellido</th>
            <th className="py-3 px-4">DNI</th>
            <th className="py-3 px-4">Teléfono</th>
            <th className="py-3 px-4">Puesto</th>
            <th className="py-3 px-4">Salario</th>
            <th className="py-3 px-4">Estado</th>
            <th className="py-3 px-4 text-center">Acciones</th>
          </tr>
        </thead>

        <tbody className="text-sm text-gray-800">
          {empleadosFiltrados.map((e) => (
            <tr key={e.id} className="border-t hover:bg-gray-50 transition">
              <td className="py-3 px-4">{e.persona.nombre}</td>
              <td className="py-3 px-4">{e.persona.apellido}</td>
              <td className="py-3 px-4">{e.persona.dni}</td>
              <td className="py-3 px-4">{e.persona.telefono}</td>
              <td className="py-3 px-4">{e.puesto}</td>
              <td className="py-3 px-4">{formatMoney(e.salario)}</td>
              <td className="py-3 px-4">
                <span
                  className={`px-3 py-1 rounded-md text-xs font-medium ${
                    e.activo
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {e.activo ? "Activo" : "Inactivo"}
                </span>
              </td>
              <td className="py-3 px-4 text-center">
                <button
                  onClick={() => onEditar(e)}
                  className="px-4 py-1.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Editar
                </button>
              </td>
            </tr>
          ))}

          {empleadosFiltrados.length === 0 && (
            <tr>
              <td
                colSpan={8}
                className="py-6 text-center text-gray-500 text-sm"
              >
                No se encontraron resultados...
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
