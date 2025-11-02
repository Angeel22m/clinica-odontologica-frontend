import { useEffect, useState } from "react";
import ListaEmpleados from "./listaEmpleados";
import type { Empleado } from "../../types/empleado";
import { crearEmpleado, editarEmpleado, getEmpleados, desactivarEmpleado } from "../../services/empleadosService";
import { toast } from "react-hot-toast";
import {
  validarCorreo,
  validarTelefono,
  validarDNI,
  normalizarTelefono,
  normalizarDNI,
  esDuplicado
} from "../../utils/validaciones";

const EmpleadosPage: React.FC = () => {
  // Estado de empleados
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  // Modal crear
  const [mostrarModal, setMostrarModal] = useState(false);
  // Modal editar
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  // Empleado seleccionado para edición
  const [empleadoEditar, setEmpleadoEditar] = useState<Empleado | null>(null);

  // Form crear
  const [nuevoEmpleado, setNuevoEmpleado] = useState<Omit<Empleado, "id">>({
    nombre: "",
    apellido: "",
    dni: "",
    telefono: "",
    direccion: "",
    fechaNac: "",
    correo: "",
    rol: "recepcionista",
    puesto: "",
    salario: 0,
    fechaIngreso: "",
    activo: true,
  });

  // Errores crear
  const [erroresNuevo, setErroresNuevo] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    telefono: "",
    correo: "",
    puesto: "",
    salario: ""
  });

  // Errores editar
  const [erroresEditar, setErroresEditar] = useState({
    telefono: "",
    correo: "",
    puesto: "",
    salario: ""
  });

  // Carga inicial
  useEffect(() => {
    const load = async () => {
      const data = await getEmpleados();
      setEmpleados(data);
    };
    load();
  }, []);

  // Abre modal crear
  const abrirModal = () => setMostrarModal(true);

  // Cierra y limpia modal crear
  const cerrarModal = () => {
    setMostrarModal(false);
    setNuevoEmpleado({
      nombre: "",
      apellido: "",
      dni: "",
      telefono: "",
      direccion: "",
      fechaNac: "",
      correo: "",
      rol: "recepcionista",
      puesto: "",
      salario: 0,
      fechaIngreso: "",
      activo: true,
    });
    setErroresNuevo({
      nombre: "",
      apellido: "",
      dni: "",
      telefono: "",
      correo: "",
      puesto: "",
      salario: ""
    });
  };

  // Valida campo del formulario de crear
  const validarCampoNuevo = (campo: string, valor: string) => {
    let mensaje = "";
    switch (campo) {
      case "correo":
        if (!validarCorreo(valor)) mensaje = "Correo inválido";
        else if (esDuplicado(empleados, "correo", valor)) mensaje = "Correo ya registrado";
        break;
      case "telefono": {
        if (!validarTelefono(valor)) mensaje = "Teléfono inválido";
        const normal = normalizarTelefono(valor);
        if (esDuplicado(empleados, "telefono", normal)) mensaje = "Teléfono ya registrado";
        break;
      }
      case "dni": {
        if (!validarDNI(valor)) mensaje = "Número de identidad inválido";
        const normal = normalizarDNI(valor);
        if (esDuplicado(empleados, "dni", normal)) mensaje = "Identidad ya registrada";
        break;
      }
      default:
        break;
    }
    setErroresNuevo(prev => ({ ...prev, [campo]: mensaje }));
  };

  // Valida campo del formulario de editar
  const validarCampoEditar = (campo: string, valor: string, idActual: number) => {
    let mensaje = "";
    switch (campo) {
      case "correo":
        if (!validarCorreo(valor)) mensaje = "Correo inválido";
        else if (esDuplicado(empleados, "correo", valor, idActual)) mensaje = "Correo ya registrado";
        break;
      case "telefono": {
        if (!validarTelefono(valor)) mensaje = "Teléfono inválido";
        const normal = normalizarTelefono(valor);
        if (esDuplicado(empleados, "telefono", normal, idActual)) mensaje = "Teléfono ya registrado";
        break;
      }
      case "puesto":
        if (!valor.trim()) mensaje = "Puesto requerido";
        break;
      case "salario":
        if (Number(valor) < 0) mensaje = "Salario inválido";
        break;
      default:
        break;
    }
    setErroresEditar(prev => ({ ...prev, [campo]: mensaje }));
  };

  // Indicadores de error
  const hayErroresNuevo = Object.values(erroresNuevo).some(e => e !== "");
  const hayErroresEditar = Object.values(erroresEditar).some(e => e !== "");

  // Guarda un nuevo empleado
  const handleGuardar = async () => {
    if (!nuevoEmpleado.nombre.trim() || !nuevoEmpleado.apellido.trim() || !nuevoEmpleado.correo.trim()) {
      toast.error("Completa nombre, apellido y correo");
      return;
    }
    if (hayErroresNuevo) {
      toast.error("Corrige los errores antes de continuar");
      return;
    }

    try {
      const payload: Omit<Empleado, "id"> = {
        ...nuevoEmpleado,
        telefono: normalizarTelefono(nuevoEmpleado.telefono),
        dni: normalizarDNI(nuevoEmpleado.dni),
        fechaIngreso: new Date().toISOString().split("T")[0],
      };

      const creado = await crearEmpleado(payload);
      setEmpleados(prev => [...prev, creado]);
      toast.success("Empleado registrado correctamente");
      cerrarModal();

      // Backend real
      // const res = await fetch("http://localhost:3000/api/empleados", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(payload),
      // });
      // if (!res.ok) throw new Error("Error en backend");
      // const creado = await res.json();
      // setEmpleados(prev => [...prev, creado]);
      // toast.success("Empleado registrado correctamente");
      // cerrarModal();
    } catch (e) {
      console.error(e);
      toast.error("No se pudo registrar el empleado");
    }
  };

  // Abre modal editar con empleado seleccionado
  const abrirModalEditar = (emp: Empleado) => {
    setEmpleadoEditar(emp);
    setErroresEditar({ telefono: "", correo: "", puesto: "", salario: "" });
    setMostrarModalEditar(true);
  };

  // Guarda cambios de edición
  const handleGuardarEdicion = async () => {
    if (!empleadoEditar) return;
    if (hayErroresEditar) {
      toast.error("Corrige los errores antes de continuar");
      return;
    }

    try {
      const cambios: Partial<Empleado> = {
        telefono: normalizarTelefono(empleadoEditar.telefono),
        direccion: empleadoEditar.direccion,
        correo: empleadoEditar.correo,
        rol: empleadoEditar.rol,
        puesto: empleadoEditar.puesto,
        salario: empleadoEditar.salario,
        activo: empleadoEditar.activo,
      };

      const ok = await editarEmpleado(empleadoEditar.id, cambios);
      if (!ok) throw new Error("No se pudo actualizar");

      setEmpleados(prev => prev.map(e => (e.id === empleadoEditar.id ? { ...e, ...cambios } : e)));
      toast.success("Empleado actualizado correctamente");
      setMostrarModalEditar(false);

      // Backend real
      // const res = await fetch(`http://localhost:3000/api/empleados/${empleadoEditar.id}`, {
      //   method: "PUT",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(cambios),
      // });
      // if (!res.ok) throw new Error("Error en backend");
      // const actualizado = await res.json();
      // setEmpleados(prev => prev.map(e => (e.id === actualizado.id ? actualizado : e)));
      // toast.success("Empleado actualizado correctamente");
      // setMostrarModalEditar(false);
    } catch (e) {
      console.error(e);
      toast.error("No se pudo actualizar el empleado");
    }
  };

  // Alterna activo/inactivo desde la tabla
  const handleToggleActivo = async (emp: Empleado) => {
    try {
      const ok = await desactivarEmpleado(emp.id, !emp.activo);
      if (!ok) throw new Error("No se pudo cambiar estado");
      setEmpleados(prev => prev.map(e => (e.id === emp.id ? { ...e, activo: !e.activo } : e)));
      toast.success(emp.activo ? "Empleado desactivado" : "Empleado activado");
    } catch (e) {
      console.error(e);
      toast.error("No se pudo actualizar el estado");
    }
  };

  return (
    <div className="w-full">
      <ListaEmpleados
        empleados={empleados}
        onCrear={abrirModal}
        onEditar={abrirModalEditar}
        onToggleActivo={handleToggleActivo}
      />

      {/* Modal Crear */}
      {mostrarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="card w-[520px] max-w-[95vw] p-6 overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-bold mb-4 text-center">Nuevo Empleado</h2>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nombre *"
                className="border border-primario/20 p-2 rounded col-span-1"
                value={nuevoEmpleado.nombre}
                onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, nombre: e.target.value })}
              />
              <input
                type="text"
                placeholder="Apellido *"
                className="border border-primario/20 p-2 rounded col-span-1"
                value={nuevoEmpleado.apellido}
                onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, apellido: e.target.value })}
              />

              <input
                type="text"
                placeholder="DNI"
                className={`border p-2 rounded col-span-1 ${erroresNuevo.dni ? "border-red-500" : "border-primario/20"}`}
                value={nuevoEmpleado.dni}
                onChange={(e) => {
                  const v = e.target.value;
                  setNuevoEmpleado({ ...nuevoEmpleado, dni: v });
                  validarCampoNuevo("dni", v);
                }}
              />
              {erroresNuevo.dni && <p className="text-xs text-red-500 col-span-1">{erroresNuevo.dni}</p>}

              <input
                type="text"
                placeholder="Teléfono"
                className={`border p-2 rounded col-span-1 ${erroresNuevo.telefono ? "border-red-500" : "border-primario/20"}`}
                value={nuevoEmpleado.telefono}
                onChange={(e) => {
                  const v = e.target.value;
                  setNuevoEmpleado({ ...nuevoEmpleado, telefono: v });
                  validarCampoNuevo("telefono", v);
                }}
              />
              {erroresNuevo.telefono && <p className="text-xs text-red-500 col-span-1">{erroresNuevo.telefono}</p>}

              <input
                type="text"
                placeholder="Dirección"
                className="border border-primario/20 p-2 rounded col-span-2"
                value={nuevoEmpleado.direccion}
                onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, direccion: e.target.value })}
              />

              <label className="col-span-1 text-sm text-primario/70 mt-1">Fecha de Nacimiento</label>
              <input
                type="date"
                className="border border-primario/20 p-2 rounded col-span-1"
                value={nuevoEmpleado.fechaNac}
                onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, fechaNac: e.target.value })}
              />

              <input
                type="email"
                placeholder="Correo *"
                className={`border p-2 rounded col-span-2 ${erroresNuevo.correo ? "border-red-500" : "border-primario/20"}`}
                value={nuevoEmpleado.correo}
                onChange={(e) => {
                  const v = e.target.value;
                  setNuevoEmpleado({ ...nuevoEmpleado, correo: v });
                  validarCampoNuevo("correo", v);
                }}
              />
              {erroresNuevo.correo && <p className="text-xs text-red-500 col-span-2">{erroresNuevo.correo}</p>}

              <label className="col-span-1 text-sm text-primario/70 mt-1">Rol</label>
              <select
                className="border border-primario/20 p-2 rounded col-span-1"
                value={nuevoEmpleado.rol}
                onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, rol: e.target.value as Empleado["rol"] })}
              >
                <option value="recepcionista">Recepcionista</option>
                <option value="doctor">Doctor</option>
                <option value="administrador">Administrador</option>
              </select>

              <input
                type="text"
                placeholder="Puesto"
                className="border border-primario/20 p-2 rounded col-span-1"
                value={nuevoEmpleado.puesto}
                onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, puesto: e.target.value })}
              />
              <input
                type="number"
                placeholder="Salario"
                className="border border-primario/20 p-2 rounded col-span-1"
                value={nuevoEmpleado.salario}
                onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, salario: Number(e.target.value || 0) })}
              />

              {/* Fecha de ingreso se asigna automáticamente al guardar */}
              <div className="col-span-2 flex items-center gap-2 mt-1">
                <input
                  id="activo"
                  type="checkbox"
                  checked={nuevoEmpleado.activo}
                  onChange={(e) => setNuevoEmpleado({ ...nuevoEmpleado, activo: e.target.checked })}
                />
                <label htmlFor="activo" className="text-sm text-primario/80">Activo</label>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={cerrarModal} className="btn bg-primario text-white hover:bg-primario/90">Cancelar</button>
              <button
                onClick={handleGuardar}
                disabled={hayErroresNuevo}
                className={`btn ${hayErroresNuevo ? "bg-gray-400 cursor-not-allowed" : "btn-success"}`}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar */}
      {mostrarModalEditar && empleadoEditar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="card w-[520px] max-w-[95vw] p-6 overflow-y-auto max-h-[90vh]">
            <h2 className="text-2xl font-bold mb-4 text-center">Editar Empleado</h2>

            <div className="grid grid-cols-2 gap-4">
              <input value={empleadoEditar.nombre} disabled className="border border-primario/20 p-2 rounded bg-gray-100" />
              <input value={empleadoEditar.apellido} disabled className="border border-primario/20 p-2 rounded bg-gray-100" />
              <input value={empleadoEditar.dni} disabled className="border border-primario/20 p-2 rounded bg-gray-100" />
              <input value={empleadoEditar.fechaNac} disabled className="border border-primario/20 p-2 rounded bg-gray-100" />
              <input value={empleadoEditar.fechaIngreso} disabled className="border border-primario/20 p-2 rounded bg-gray-100" />

              <input
                type="text"
                placeholder="Teléfono"
                className={`border p-2 rounded col-span-1 ${erroresEditar.telefono ? "border-red-500" : "border-primario/20"}`}
                value={empleadoEditar.telefono}
                onChange={(e) => {
                  const v = e.target.value;
                  setEmpleadoEditar({ ...empleadoEditar, telefono: v });
                  validarCampoEditar("telefono", v, empleadoEditar.id);
                }}
              />
              {erroresEditar.telefono && <p className="text-xs text-red-500 col-span-1">{erroresEditar.telefono}</p>}

              <input
                type="text"
                placeholder="Dirección"
                className="border border-primario/20 p-2 rounded col-span-2"
                value={empleadoEditar.direccion}
                onChange={(e) => setEmpleadoEditar({ ...empleadoEditar, direccion: e.target.value })}
              />

              <input
                type="email"
                placeholder="Correo"
                className={`border p-2 rounded col-span-2 ${erroresEditar.correo ? "border-red-500" : "border-primario/20"}`}
                value={empleadoEditar.correo}
                onChange={(e) => {
                  const v = e.target.value;
                  setEmpleadoEditar({ ...empleadoEditar, correo: v });
                  validarCampoEditar("correo", v, empleadoEditar.id);
                }}
              />
              {erroresEditar.correo && <p className="text-xs text-red-500 col-span-2">{erroresEditar.correo}</p>}

              <label className="col-span-1 text-sm text-primario/70 mt-1">Rol</label>
              <select
                className="border border-primario/20 p-2 rounded col-span-1"
                value={empleadoEditar.rol}
                onChange={(e) => setEmpleadoEditar({ ...empleadoEditar, rol: e.target.value as Empleado["rol"] })}
              >
                <option value="recepcionista">Recepcionista</option>
                <option value="doctor">Doctor</option>
                <option value="administrador">Administrador</option>
              </select>

              <input
                type="text"
                placeholder="Puesto"
                className={`border p-2 rounded col-span-1 ${erroresEditar.puesto ? "border-red-500" : "border-primario/20"}`}
                value={empleadoEditar.puesto}
                onChange={(e) => {
                  const v = e.target.value;
                  setEmpleadoEditar({ ...empleadoEditar, puesto: v });
                  validarCampoEditar("puesto", v, empleadoEditar.id);
                }}
              />
              {erroresEditar.puesto && <p className="text-xs text-red-500 col-span-1">{erroresEditar.puesto}</p>}

              <input
                type="number"
                placeholder="Salario"
                className={`border p-2 rounded col-span-1 ${erroresEditar.salario ? "border-red-500" : "border-primario/20"}`}
                value={empleadoEditar.salario}
                onChange={(e) => {
                  const v = e.target.value;
                  setEmpleadoEditar({ ...empleadoEditar, salario: Number(v) });
                  validarCampoEditar("salario", v, empleadoEditar.id);
                }}
              />
              {erroresEditar.salario && <p className="text-xs text-red-500 col-span-1">{erroresEditar.salario}</p>}

              <div className="col-span-2 flex items-center gap-2 mt-1">
                <input
                  id="activoEditar"
                  type="checkbox"
                  checked={empleadoEditar.activo}
                  onChange={(e) => setEmpleadoEditar({ ...empleadoEditar, activo: e.target.checked })}
                />
                <label htmlFor="activoEditar" className="text-sm text-primario/80">Activo</label>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setMostrarModalEditar(false)}
                className="btn bg-primario text-white hover:bg-primario/90"
              >
                Cancelar
              </button>
              <button
                onClick={handleGuardarEdicion}
                disabled={hayErroresEditar}
                className={`btn ${hayErroresEditar ? "bg-gray-400 cursor-not-allowed" : "btn-primary"}`}
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmpleadosPage;
