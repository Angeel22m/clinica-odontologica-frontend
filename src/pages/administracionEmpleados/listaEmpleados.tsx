import { useEffect, useState } from "react";
import { getUsuarios, desactivarUsuario } from "../../services/api";
import { Link } from "react-router-dom";

export default function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState<any[]>([]);

  useEffect(() => {
    getUsuarios().then(setUsuarios);
  }, []);

  const handleDesactivar = async (id: number) => {
    await desactivarUsuario(id);
    alert("Usuario desactivado");
    setUsuarios(await getUsuarios());
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión de Usuarios</h1>
      <Link to="/usuarios/nuevo" className="text-blue-500 underline">Crear usuario</Link>
      <table className="min-w-full mt-4 border">
        <thead>
          <tr className="bg-gray-200">
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id}>
              <td>{u.nombre}</td>
              <td>{u.correo}</td>
              <td>{u.rol}</td>
              <td>{u.activo ? "Activo" : "Inactivo"}</td>
              <td>
                <Link to={`/usuarios/editar/${u.id}`} className="text-green-600 mr-2">Editar</Link>
                <button onClick={() => handleDesactivar(u.id)} className="text-red-600">Desactivar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
