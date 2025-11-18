// src/components/LogoutButton.tsx
import React from "react";
import { LogOut } from "lucide-react";

const LogoutButton: React.FC = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <>
      {/* BOTÓN PRINCIPAL */}
      <button
        command="show-modal"
        commandfor="logout-dialog"
        className="w-full flex items-center gap-3 btn-alert rounded-md p-2 cursor-pointer shadow"
      >
        <LogOut className="w-5 h-5 text-light" />
        <span className="text-light">Logout</span>
      </button>

      {/* MODAL */}
      <el-dialog>
        <dialog
          id="logout-dialog"
          aria-labelledby="logout-title"
          className="fixed inset-0 size-auto max-h-none max-w-none cursor-default overflow-y-auto bg-transparent backdrop:bg-transparent"
        >
          {/* BACKDROP */}
          <el-dialog-backdrop className="fixed inset-0 overlay-dark transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"></el-dialog-backdrop>

          <div
            tabIndex={0}
            className="flex min-h-full items-end justify-center p-4 text-center focus:outline-none sm:items-center sm:p-0"
          >
            <el-dialog-panel className="relative transform overflow-hidden rounded-xl bg-primary text-left shadow-xl outline outline-light/10 transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out sm:my-8 sm:w-full sm:max-w-md">

              {/* CONTENIDO */}
              <div className="px-6 py-5">
                <div className="sm:flex sm:items-start">
                  
                  {/* ICONO */}
                  <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-alert/20 sm:mx-0 sm:size-10">
                    <LogOut className="w-6 h-6 text-alert" />
                  </div>

                  {/* TEXTO */}
                  <div className="mt-4 sm:mt-0 sm:ml-4">
                    <h3 id="logout-title" className="text-lg font-semibold text-light">
                      ¿Cerrar sesión?
                    </h3>
                    <p className="mt-2 text-light/70">
                      Tu sesión actual se cerrará y deberás volver a iniciar sesión.
                    </p>
                  </div>
                </div>
              </div>

              {/* BOTONES */}
              <div className="bg-primary/10 px-6 py-3 sm:flex sm:flex-row-reverse">

                {/* CONFIRMAR */}
                <button
                  type="button"
                  onClick={handleLogout}
                  command="close"
                  commandfor="logout-dialog"
                  className="btn-alert px-4 py-2 cursor-pointer rounded-md font-medium sm:ml-3 sm:w-auto w-full"
                >
                  Cerrar sesión
                </button>

                {/* CANCELAR */}
                <button
                  type="button"
                  command="close"
                  commandfor="logout-dialog"
                  className="mt-3 sm:mt-0 px-4 py-2 cursor-pointer rounded-md bg-light/10 text-light font-medium hover:bg-light/20 sm:w-auto w-full"
                >
                  Cancelar
                </button>
              </div>

            </el-dialog-panel>
          </div>
        </dialog>
      </el-dialog>
    </>
  );
};

export default LogoutButton;
