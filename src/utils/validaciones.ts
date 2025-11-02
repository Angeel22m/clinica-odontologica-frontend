// src/utils/validaciones.ts
import type { Empleado } from "../types/empleado";

/* ===========================
   ✅ VALIDACIÓN DE CORREO
   =========================== */
export const validarCorreo = (correo: string): boolean => {
  const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regexCorreo.test(correo.trim());
};

/* ===========================
   ✅ NORMALIZAR TELÉFONO
   (remueve +504, 504, espacios, guiones, etc.)
   =========================== */
export const normalizarTelefono = (tel: string): string => {
  if (!tel) return "";
  let t = tel.replace(/\D/g, ""); // quitar todo lo que no sea número

  // quitar prefijos válidos (+504 / 504 / 00504)
  t = t.replace(/^(\+?504|00504)/, "");

  return t;
};

/* ===========================
   ✅ VALIDAR TELÉFONO (Honduras)
   Acepta fijos y móviles, 8 dígitos
   =========================== */
export const validarTelefono = (tel: string): boolean => {
  const normalizado = normalizarTelefono(tel);
  const regexTelefonoHN = /^[2-9]\d{7}$/;
  return regexTelefonoHN.test(normalizado);
};

/* ===========================
   ✅ NORMALIZAR DNI
   (quita guiones, espacios, etc.)
   =========================== */
export const normalizarDNI = (dni: string): string => {
  return dni.replace(/\D/g, ""); // solo números
};

/* ===========================
   ✅ VALIDAR DNI DE HONDURAS (AVANZADO)
   - 13 dígitos
   - Se aceptan guiones o sin guiones
   - Prefijo de departamento permitido
   - Fecha interna válida (DDMMYY)
   =========================== */
export const validarDNI = (dni: string): boolean => {
  const limpio = normalizarDNI(dni);
  if (limpio.length !== 13) return false;
  if (!/^\d+$/.test(limpio)) return false;

  const depto = parseInt(limpio.substring(0, 2));
  if (depto < 1 || depto > 18) return false; // 18 departamentos válidos

  // extraer posible fecha (DNI contiene día, mes y año de nacimiento en posiciones [4-9])
  const dia = parseInt(limpio.substring(4, 6));
  const mes = parseInt(limpio.substring(6, 8));
  const anio = parseInt(limpio.substring(8, 10)) + 1900; // se asume 19xx

  if (mes < 1 || mes > 12) return false;
  if (dia < 1 || dia > 31) return false;
  if (anio < 1900 || anio > new Date().getFullYear()) return false;

  return true;
};

/* ===========================
   ✅ VALIDAR DUPLICADOS
   - Revisa si un valor ya existe en empleados
   =========================== */
export const esDuplicado = (
  lista: Empleado[],
  campo: keyof Empleado,
  valor: string,
  idActual?: number
): boolean => {
  return lista.some((e) => e[campo] === valor && e.id !== idActual);
};
