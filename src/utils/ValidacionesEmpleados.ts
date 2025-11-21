// src/utils/validacionesEmpleado.ts

// ------------------ REGEX ------------------
export const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúñÑ ]{2,30}$/;
export const regexApellido = /^[A-Za-zÁÉÍÓÚáéíóúñÑ ]{2,30}$/;

// Identidad Honduras: primeros 4 dígitos válidos + 9 restantes
export const regexDNI = /^(0[1-9]|1[0-8])(0[1-9]|[1-2][0-9]|3[0-5])[0-9]{9}$/;

// Teléfono Honduras: 8 dígitos que inicien con 2,3,7,8,9
export const regexTelefono = /^[23789][0-9]{7}$/;

export const regexCorreo = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

// Contraseña >=8 y un número
export const regexPassword = /^(?=.*\d).{8,}$/;

// ------------------ NORMALIZADORES ------------------

export function limpiarDNI(dni: string) {
  return dni.replace(/[^0-9]/g, "");
}

export function limpiarTelefono(telefono: string) {
  let t = telefono.replace(/[^0-9]/g, "");

  // Remover formatos +504, 504
  if (t.startsWith("504")) t = t.slice(3);
  if (t.startsWith("504")) t = t.slice(3);

  // Solo 8 dígitos finales
  if (t.length > 8) t = t.slice(t.length - 8);

  return t;
}

// ------------------ VALIDACIÓN COMPLETA ------------------

export function validarEmpleadoCampos(data: any, esEdicion: boolean) {
  const errores: Record<string, string> = {};

  // Nombre
  if (!regexNombre.test(data.nombre)) {
    errores.nombre = "Nombre inválido.";
  }

  // Apellido
  if (!regexApellido.test(data.apellido)) {
    errores.apellido = "Apellido inválido.";
  }

  // DNI
  const dniLimpio = limpiarDNI(data.dni);
  if (!regexDNI.test(dniLimpio)) {
    errores.dni =
      "DNI inválido. Debe iniciar con un código municipal válido y contener 13 dígitos.";
  }

  // Teléfono
  const tel = limpiarTelefono(data.telefono);
  if (!regexTelefono.test(tel)) {
    errores.telefono =
      "El teléfono debe tener 8 dígitos y comenzar con 2,3,7,8 o 9.";
  }

  // Dirección
  if (!data.direccion || data.direccion.length < 5) {
    errores.direccion = "Dirección demasiado corta.";
  }

  // Fecha nacimiento
  if (!data.fechaNac) {
    errores.fechaNac = "Seleccione una fecha.";
  } else {
    const fn = new Date(data.fechaNac);
    const hoy = new Date();
    if (fn > hoy) errores.fechaNac = "Fecha inválida.";
    if (hoy.getFullYear() - fn.getFullYear() < 18)
      errores.fechaNac = "Debe ser mayor de 18 años.";
  }

  // Fecha ingreso
  if (!data.fechaIngreso) {
    errores.fechaIngreso = "Seleccione una fecha.";
  } else {
    const fi = new Date(data.fechaIngreso);
    const fn = new Date(data.fechaNac);
    if (fi < fn)
      errores.fechaIngreso =
        "La fecha de ingreso no puede ser antes de su nacimiento.";
  }

  // Salario
  if (!data.salario || Number(data.salario) <= 0) {
    errores.salario = "Salario debe ser mayor a cero.";
  }

  // Solo crear
  if (!esEdicion) {
    if (!regexCorreo.test(data.correo)) errores.correo = "Correo inválido.";

    if (!regexPassword.test(data.password))
      errores.password =
        "La contraseña debe tener 8 caracteres y al menos un número.";
  }

  return errores;
}