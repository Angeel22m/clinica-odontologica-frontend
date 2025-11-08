import type { EmpleadoResponse } from "../types/empleado";
import '../index.css';
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
    <div className="bg-light border border-primary/10  max-h-96 overflow-y-auto shadow-md rounded-lg">
  <table className="w-full text-left border-collapse">
    <thead className="bg-primary text-light text-sm font-semibold sticky top-0  uppercase">
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

    <tbody className="text-sm text-primary">
      {empleadosFiltrados.map((e) => (
        <tr
          key={e.id}
          className="border-t border-primary/10 hover:bg-accent/10 transition"
        >
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
                  ? "bg-success/20 text-success"
                  : "bg-primary/20 text-primary/70"
              }`}
            >
              {e.activo ? "Activo" : "Inactivo"}
            </span>
          </td>
          <td className="py-3 px-4 text-center">
            <button
              onClick={() => onEditar(e)}
              className="btn-accent text-sm font-medium px-4 py-1.5 rounded-lg shadow-sm transition"
            >
              Editar
            </button>
          </td>
        </tr>
      ))}

      {empleadosFiltrados.length === 0 && (
        <tr>
          <td colSpan={8} className="py-6 text-center text-primary/60 text-sm">
            No se encontraron resultados...
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

  );
};
