import type { Empleado } from "../types/empleado";

// Valida formato de correo básico
export const validarCorreo = (correo: string): boolean => {
  const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regexCorreo.test(correo.trim());
};

// Normaliza teléfono removiendo +504, 504, espacios y guiones
export const normalizarTelefono = (tel: string): string => {
  if (!tel) return "";
  let t = tel.replace(/\D/g, "");
  t = t.replace(/^(?:00504|\+?504)/, "");
  return t;
};

// Valida teléfono de Honduras (fijos y móviles) 8 dígitos
export const validarTelefono = (tel: string): boolean => {
  const normal = normalizarTelefono(tel);
  const regex = /^[2-9]\d{7}$/;
  return regex.test(normal);
};

// Normaliza DNI quitando cualquier carácter no numérico
export const normalizarDNI = (dni: string): string => dni.replace(/\D/g, "");

// Valida DNI de Honduras (13 dígitos, depto válido, fecha DDMMYY plausible)
export const validarDNI = (dni: string): boolean => {
  const limpio = normalizarDNI(dni);
  if (!/^\d{13}$/.test(limpio)) return false;

  const depto = parseInt(limpio.slice(0, 2), 10);
  if (depto < 1 || depto > 18) return false;

  const dia = parseInt(limpio.slice(4, 6), 10);
  const mes = parseInt(limpio.slice(6, 8), 10);
  const yy = parseInt(limpio.slice(8, 10), 10);
  const year = yy + 1900; // base razonable para proyectos clínicos

  if (mes < 1 || mes > 12) return false;
  if (dia < 1 || dia > 31) return false;
  if (year < 1900 || year > new Date().getFullYear()) return false;

  return true;
};

// Revisa duplicados por campo, excluyendo el idActual si se pasa
export const esDuplicado = (
  lista: Empleado[],
  campo: keyof Empleado,
  valor: string,
  idActual?: number
): boolean => {
  return lista.some((e) => String(e[campo]) === String(valor) && e.id !== idActual);
};
