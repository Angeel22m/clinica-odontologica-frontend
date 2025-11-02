import type { Empleado } from "../types/empleado";

const STORAGE_KEY = "empleados_mock_storage_v1";
const API_URL = "http://localhost:3000/api/empleados";

// Lee empleados desde localStorage
function readStorage(): Empleado[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const data = JSON.parse(raw) as Empleado[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

// Escribe empleados a localStorage
function writeStorage(list: Empleado[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

// Semilla realista de clínica
const seed: Empleado[] = [
  { id: 1, nombre: "Juan", apellido: "Pérez", dni: "0801199000011", telefono: "99991111", direccion: "Col. Centro", fechaNac: "1990-03-15", correo: "juan.perez@clinica.com", rol: "doctor", puesto: "Odontólogo General", salario: 2800, fechaIngreso: "2021-02-10", activo: true },
  { id: 2, nombre: "María", apellido: "Gómez", dni: "0802199200022", telefono: "99992222", direccion: "Col. Kennedy", fechaNac: "1992-07-20", correo: "maria.gomez@clinica.com", rol: "recepcionista", puesto: "Recepcionista", salario: 1600, fechaIngreso: "2022-05-01", activo: true },
  { id: 3, nombre: "Carlos", apellido: "Mendoza", dni: "0803198800033", telefono: "99993333", direccion: "Res. Las Uvas", fechaNac: "1988-11-05", correo: "carlos.mendoza@clinica.com", rol: "doctor", puesto: "Cirujano Oral", salario: 3400, fechaIngreso: "2019-11-22", activo: true },
  { id: 4, nombre: "Laura", apellido: "García", dni: "0804199500044", telefono: "99994444", direccion: "Col. Miraflores", fechaNac: "1995-01-12", correo: "laura.garcia@clinica.com", rol: "administrador", puesto: "Administradora", salario: 3800, fechaIngreso: "2020-08-17", activo: true },
  { id: 5, nombre: "Jorge", apellido: "Hernández", dni: "0805198700055", telefono: "99995555", direccion: "Col. Palmira", fechaNac: "1987-04-30", correo: "jorge.hernandez@clinica.com", rol: "doctor", puesto: "Endodoncista", salario: 3200, fechaIngreso: "2018-06-01", activo: false },
  { id: 6, nombre: "Sofía", apellido: "Pineda", dni: "0806199700066", telefono: "99996666", direccion: "Col. La Sosa", fechaNac: "1997-09-18", correo: "sofia.pineda@clinica.com", rol: "recepcionista", puesto: "Asistente de Recepción", salario: 1500, fechaIngreso: "2023-03-12", activo: true },
  { id: 7, nombre: "Ricardo", apellido: "Flores", dni: "0807198900077", telefono: "99997777", direccion: "Res. El Sauce", fechaNac: "1989-06-21", correo: "ricardo.flores@clinica.com", rol: "doctor", puesto: "Odontopediatra", salario: 3000, fechaIngreso: "2020-01-15", activo: true },
  { id: 8, nombre: "Gabriela", apellido: "Mejía", dni: "0808199400088", telefono: "99998888", direccion: "Col. Lomas del Guijarro", fechaNac: "1994-10-02", correo: "gabriela.mejia@clinica.com", rol: "doctor", puesto: "Higienista Dental", salario: 2200, fechaIngreso: "2022-04-25", activo: true },
  { id: 9, nombre: "Eduardo", apellido: "Cruz", dni: "0809198600099", telefono: "99990000", direccion: "Res. La Hacienda", fechaNac: "1986-12-11", correo: "eduardo.cruz@clinica.com", rol: "doctor", puesto: "Prostodoncista", salario: 3500, fechaIngreso: "2018-10-10", activo: true },
  { id: 10, nombre: "Karla", apellido: "Figueroa", dni: "0810199500100", telefono: "98881111", direccion: "Col. El Prado", fechaNac: "1995-02-08", correo: "karla.figueroa@clinica.com", rol: "recepcionista", puesto: "Atención al Cliente", salario: 1650, fechaIngreso: "2021-09-05", activo: true },
  { id: 11, nombre: "Julio", apellido: "Perdomo", dni: "0811199000111", telefono: "98882222", direccion: "Col. Las Torres", fechaNac: "1990-01-25", correo: "julio.perdomo@clinica.com", rol: "doctor", puesto: "Ortodontista", salario: 3600, fechaIngreso: "2017-08-22", activo: false },
  { id: 12, nombre: "Daniela", apellido: "Santos", dni: "0812199300122", telefono: "98883333", direccion: "Col. La Florencia", fechaNac: "1993-08-15", correo: "daniela.santos@clinica.com", rol: "recepcionista", puesto: "Asistente Administrativa", salario: 1700, fechaIngreso: "2023-01-05", activo: true },
  { id: 13, nombre: "Andrés", apellido: "López", dni: "0813198800133", telefono: "98884444", direccion: "Col. Los Robles", fechaNac: "1988-02-20", correo: "andres.lopez@clinica.com", rol: "doctor", puesto: "Cirujano Oral", salario: 3650, fechaIngreso: "2016-03-18", activo: true },
  { id: 14, nombre: "Lucía", apellido: "Martínez", dni: "0814199600144", telefono: "98885555", direccion: "Col. San Ángel", fechaNac: "1996-05-19", correo: "lucia.martinez@clinica.com", rol: "administrador", puesto: "Gerente Operativa", salario: 4000, fechaIngreso: "2020-10-01", activo: true },
  { id: 15, nombre: "Fernando", apellido: "Aguilar", dni: "0815198900155", telefono: "98886666", direccion: "Col. 15 de Septiembre", fechaNac: "1989-12-02", correo: "fernando.aguilar@clinica.com", rol: "doctor", puesto: "Periodoncista", salario: 3100, fechaIngreso: "2019-07-15", activo: false },
];

// Inicializa semilla si no hay datos
function ensureSeed() {
  const curr = readStorage();
  if (curr.length === 0) writeStorage(seed);
}

// Obtiene todos los empleados
export async function getEmpleados(): Promise<Empleado[]> {
  ensureSeed();

  // Backend real
  // const res = await fetch(API_URL);
  // if (!res.ok) throw new Error("Error al obtener empleados");
  // return res.json();

  return readStorage();
}

// Crea empleado nuevo
export async function crearEmpleado(empleadoSinId: Omit<Empleado, "id">): Promise<Empleado> {
  // Backend real
  // const res = await fetch(API_URL, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(empleadoSinId),
  // });
  // if (!res.ok) throw new Error("Error al crear empleado");
  // return res.json();

  const list = readStorage();
  const nuevo: Empleado = {
    ...empleadoSinId,
    id: list.length ? Math.max(...list.map(e => e.id)) + 1 : 1,
  };
  list.push(nuevo);
  writeStorage(list);
  return nuevo;
}

// Edita campos del empleado
export async function editarEmpleado(id: number, cambios: Partial<Empleado>): Promise<boolean> {
  // Backend real
  // const res = await fetch(`${API_URL}/${id}`, {
  //   method: "PUT",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(cambios),
  // });
  // return res.ok;

  const list = readStorage();
  const idx = list.findIndex(e => e.id === id);
  if (idx === -1) return false;
  list[idx] = { ...list[idx], ...cambios };
  writeStorage(list);
  return true;
}

// Cambia el estado activo/inactivo
export async function desactivarEmpleado(id: number, nuevoEstado: boolean): Promise<boolean> {
  // Backend real
  // const res = await fetch(`${API_URL}/${id}/estado`, {
  //   method: "PATCH",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ activo: nuevoEstado }),
  // });
  // return res.ok;

  const list = readStorage();
  const idx = list.findIndex(e => e.id === id);
  if (idx === -1) return false;
  list[idx].activo = nuevoEstado;
  writeStorage(list);
  return true;
}
