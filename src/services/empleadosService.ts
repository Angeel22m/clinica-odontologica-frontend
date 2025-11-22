// src/services/empleadosService.ts
import api from "../utils/api";
import type {
  EmpleadoResponse,
  CrearEmpleadoDTO,
  ActualizarEmpleadoDTO,
} from "../types/empleado";

const headers = {
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
};
const BASE_URL = "/empleado";

export const obtenerEmpleados = async (): Promise<EmpleadoResponse[]> => {
  const res = await api.get(BASE_URL);
  return res.data.data;
};

export const crearEmpleado = async (data: CrearEmpleadoDTO) => {
  const payload = {
    ...data,
    rol: data.puesto, // backend lo usa como rol
  };
  delete (payload as any).usuarioActivo;
  return await api.post(BASE_URL, payload);
};

export const actualizarEmpleado = async (id: number, data: ActualizarEmpleadoDTO) => {
  const payload: any = {};

  if (data.nombre) payload.nombre = data.nombre;
  if (data.apellido) payload.apellido = data.apellido;
  if (data.dni) payload.dni = data.dni;
  if (data.telefono) payload.telefono = data.telefono;
  if (data.direccion) payload.direccion = data.direccion;
  if (data.fechaNac) payload.fechaNac = new Date(data.fechaNac);

  if (data.puesto) payload.puesto = data.puesto;
  if (data.salario) payload.salario = Number(data.salario);
  if (data.fechaIngreso) payload.fechaIngreso = new Date(data.fechaIngreso);

  if (data.activo !== undefined) payload.activo = data.activo;

  

  const response = await api.put(`${BASE_URL}/${id}`, payload);
  return response.data;
};

