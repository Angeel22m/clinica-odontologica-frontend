// src/utils/validacionesEmpleado.ts

// ---------------------------
// REGEX
// ---------------------------

// Solo letras, espacios, acentos — 2 a 30 caracteres
export const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{2,30}$/;

// Apellido con reglas iguales a nombre
export const regexApellido = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{2,30}$/;

// DNI Honduras — 13 dígitos continuos
export const regexDNI = /^[0-9]{13}$/;

// Teléfono — 8 dígitos
export const regexTelefono = /^[0-9]{8}$/;

// Dirección entre 5 y 200 caracteres
export const regexDireccion = /^.{5,200}$/;

// Email estándar
export const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Fecha tipo YYYY-MM-DD
export const regexFecha = /^\d{4}-\d{2}-\d{2}$/;

// Password mínimo 6 caracteres
export const regexPassword = /^.{6,}$/;



// ---------------------------
// VALIDACIONES
// ---------------------------

export function validarEmpleado(
  data: any,
  esEdicion: boolean // true si se está editando un empleado existente
) {
  const errores: string[] = [];


  // -------- NOMBRE --------
  if (!regexNombre.test(data.nombre || "")) {
    errores.push("El nombre es inválido. Debe contener solo letras y tener entre 2 y 30 caracteres.");
  }

  // -------- APELLIDO --------
  if (!regexApellido.test(data.apellido || "")) {
    errores.push("El apellido es inválido. Debe contener solo letras y tener entre 2 y 30 caracteres.");
  }

  // -------- DNI --------
  if (!regexDNI.test(data.dni || "")) {
    errores.push("El DNI debe contener exactamente 13 dígitos numéricos.");
  }

  // -------- TELEFONO --------
  if (!regexTelefono.test(data.telefono || "")) {
    errores.push("El teléfono debe contener 8 dígitos numéricos.");
  }

  // -------- DIRECCION --------
  if (!regexDireccion.test(data.direccion || "")) {
    errores.push("La dirección es demasiado corta. Debe tener mínimo 5 caracteres.");
  }

  // -------- FECHA NACIMIENTO --------
  if (!regexFecha.test(data.fechaNac || "")) {
    errores.push("Debe seleccionar una fecha de nacimiento válida.");
  }

  // -------- CAMPOS SOLO PARA CREAR --------
  if (!esEdicion) {
    // CORREO
    if (!regexCorreo.test(data.correo || "")) {
      errores.push("El correo electrónico no es válido.");
    }

    // PASSWORD
    if (!regexPassword.test(data.password || "")) {
      errores.push("La contraseña debe tener al menos 6 caracteres.");
    }
  }

  return errores;
}


// Validación por campo, retorna objeto con errores específicos
export function validarEmpleadoPorCampo(data: any, esEdicion: boolean) {
  const errores: Record<string, string> = {};

  if (!regexNombre.test(data.nombre || "")) {
    errores.nombre = "El nombre debe tener entre 2 y 30 letras.";
  }

  if (!regexApellido.test(data.apellido || "")) {
    errores.apellido = "El apellido debe tener entre 2 y 30 letras.";
  }

  if (!regexDNI.test(data.dni || "")) {
    errores.dni = "El DNI debe contener 13 dígitos.";
  }

  if (!regexTelefono.test(data.telefono || "")) {
    errores.telefono = "El teléfono debe contener 8 dígitos.";
  }

  if (!regexDireccion.test(data.direccion || "")) {
    errores.direccion = "La dirección es demasiado corta.";
  }

  if (!regexFecha.test(data.fechaNac || "")) {
    errores.fechaNac = "Seleccione una fecha válida.";
  }

  if (!esEdicion) {
    if (!regexCorreo.test(data.correo || "")) {
      errores.correo = "Correo inválido.";
    }

    if (!regexPassword.test(data.password || "")) {
      errores.password = "La contraseña debe tener mínimo 6 caracteres.";
    }
  }

  return errores;
}
