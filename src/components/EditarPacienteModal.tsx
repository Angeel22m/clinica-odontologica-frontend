// src/components/EditarPacienteModal.tsx

import React, { useEffect, useState } from "react";
import type {
  PacienteRecepcionista,
  PacienteModificarPayload,
} from "../services/modificarInfoService";
import Modal from "./modal"; 


// Tipo para el estado de errores (Parcial del payload, solo los campos editables)
type FormErrors = Partial<Record<keyof PacienteModificarPayload, string>>;

const regex = {
  // Contraseña: Mínimo 8 caracteres, al menos una mayúscula, un número, un carácter especial.
  password: /^(?=.*\d)(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/,

  // DNI: Exactamente 13 dígitos.
  dni: /^\d{13}$/,

  // Teléfono: Exactamente 8 dígitos.
  telefono: /^\d{8}$/,

  // Dirección: Al menos 5 caracteres, permitiendo letras, números, espacios y signos comunes.
  direccion: /^[a-zA-Z0-9\s.,#'\-]{5,}$/,
};

interface EditarPacienteModalProps {
  open: boolean;
  paciente: PacienteRecepcionista | null;
  onClose: () => void;
  onSave: (data: PacienteModificarPayload) => void | Promise<void>;
}

const EditarPacienteModal: React.FC<EditarPacienteModalProps> = ({
  open,
  paciente,
  onClose,
  onSave,
}) => {
  const [form, setForm] = useState<PacienteModificarPayload>({
    dni: "",
    telefono: "",
    direccion: "",
    fechaNac: "",
    password: "",
  });

  // Nuevo estado para los errores
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (open && paciente) {
      // Inicializar el formulario
      setForm({
        dni: paciente.dni ?? "",
        telefono: paciente.telefono ?? "",
        direccion: paciente.direccion ?? "",
        fechaNac: paciente.fechaNac ? paciente.fechaNac.slice(0, 10) : "",
        password: "",
      });
     
      setErrors({}); 
    }
  }, [open, paciente]);

  if (!open || !paciente) return null;

  // 3. Función de Validación en tiempo real (handleChange)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const key = name as keyof PacienteModificarPayload;

    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));

    // Resetear el error si el campo se vacía o la validación es correcta
    if (regex[key]) {
      const pattern = regex[key as keyof typeof regex];
      let error = "";

      if (value.length > 0 && !pattern.test(value)) {
        if (key === 'password') {
          error = "Mín. 8 caracteres, incluyendo Mayúscula, número y símbolo.";
        } else if (key === 'dni') {
          error = "El DNI debe tener exactamente 13 dígitos.";
        } else if (key === 'telefono') {
          error = "El Teléfono debe tener exactamente 8 dígitos.";
        } else if (key === 'direccion') {
          error = "La Dirección debe tener un formato válido (mín. 5 caracteres).";
        }
      }
      
      setErrors((prev) => ({
        ...prev,
        [key]: error,
      }));
    }
  };

  // 4. Función de Validación Final (handleSubmit)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  let newErrors: FormErrors = {};

  const fieldsToValidate: (keyof PacienteModificarPayload)[] = [
    "dni",
    "telefono",
    "direccion",
    "password",
  ];

  fieldsToValidate.forEach((field) => {
    const value = form[field];
    const pattern = regex[field as keyof typeof regex];

    // Si está vacío → no se valida, no hay error
    if (!value) return;

    // Validar password solo si se escribió
    if (field === "password") {
      if (!pattern.test(value)) {
        newErrors.password =
          "Mín. 8 caracteres, incluyendo Mayúscula, número y símbolo.";
      }
      return;
    }

    // Validación general para DNI, teléfono y dirección
    if (!pattern.test(value)) {
      newErrors[field] =
        errors[field] || `El formato de ${field} es incorrecto.`;
    }
  });

  setErrors(newErrors);

  // Si hay errores no enviar
  if (Object.keys(newErrors).length > 0) {
    console.error("Errores de validación:", newErrors);
    return;
  }

  // Crear payload solo con los campos llenados
  const payload: PacienteModificarPayload = Object.fromEntries(
    Object.entries(form).filter(([_, v]) => v && v !== "")
  ) as PacienteModificarPayload;

  await onSave(payload);
};

  // 6. Actualizar el renderizado para mostrar errores
  const getClassName = (fieldName: keyof PacienteModificarPayload) => {
    const baseClasses = "mt-1 w-full p-2 border rounded-lg";
    const focusClasses = "focus:border-blue-500 focus:ring-blue-500";
    const errorClass = "border-red-500";
    
    return `${baseClasses} ${errors[fieldName] ? errorClass : focusClasses}`;
  };


  return (
    <Modal open={open} onClose={onClose} title="Editar Paciente">
      <form onSubmit={handleSubmit} className="space-y-4 pt-3"> 
        {/* CORREO (Deshabilitado) */}
        {/* ... (código del correo sin cambios) ... */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Correo
          </label>
          <input
            type="email"
            value={paciente.correo}
            disabled
            className="mt-1 w-full p-2 border rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
          />
        </div>

        {/* CONTRASEÑA */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Contraseña (Dejar vacío para no cambiar)
          </label>
          <input
            type="password"
            name="password"            
            onChange={handleChange}
            placeholder="********"
            className={getClassName('password')}
          />
          {errors.password && (
            <p className=" text-xs text-alert mt-1">{errors.password}</p>
          )}
        </div>

        {/* NOMBRE Y APELLIDO (Deshabilitados) */}
        {/* ... (código de Nombre y Apellido sin cambios) ... */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              value={paciente.nombre || ""}
              disabled
              className="mt-1 w-full p-2 border rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Apellido
            </label>
            <input
              type="text"
              name="apellido"
              value={paciente.apellido || ""}
              disabled
              className="mt-1 w-full p-2 border rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
            />
          </div>
        </div>

        {/* DNI Y TELÉFONO (EDITABLES) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              DNI
            </label>
            <input
              type="text"
              name="dni"          
              placeholder={form.dni}
              onChange={handleChange}
              className={getClassName('dni')}
            />
            {errors.dni && (
              <p className=" text-alert text-xs mt-1">{errors.dni}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Teléfono
            </label>
            <input
              type="text"
              name="telefono"              
              placeholder={form.telefono}
              onChange={handleChange}
              className={getClassName('telefono')}
            />
            {errors.telefono && (
              <p className=" text-alert text-xs mt-1">{errors.telefono}</p>
            )}
          </div>
        </div>

        {/* DIRECCIÓN (EDITABLE) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Dirección
          </label>
          <input
            type="text"
            name="direccion"
            placeholder={form.direccion}
            onChange={handleChange}
            className={getClassName('direccion')}
          />
          {errors.direccion && (
            <p className=" text-xs text-alert mt-1">{errors.direccion}</p>
          )}
        </div>

        {/* FECHA DE NACIMIENTO (EDITABLE) */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fecha de nacimiento
          </label>
          <input
            type="date"
            name="fechaNac"
            value={form.fechaNac || ""}
            onChange={handleChange}           
            className={getClassName('fechaNac')} 
          />
          {errors.fechaNac && (
            <p className=" text-xs text-alert text-alert/300 mt-1">{errors.fechaNac}</p>
          )}
        </div>

        {/* BOTONES */}
        <div className="flex justify-end gap-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg btn-primary border border-gray-300 text-gray-700 hover:bg-gray-100 transition duration-150"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 btn-accent rounded-lg bg-accent text-white hover:bg-info transition duration-150"
            // Puedes deshabilitar el botón si hay errores en tiempo real
            disabled={Object.values(errors).some(error => error !== "")}
          >
            Guardar cambios
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditarPacienteModal;