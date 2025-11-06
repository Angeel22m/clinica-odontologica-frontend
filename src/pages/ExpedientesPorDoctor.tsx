import { useState } from 'react';
import FileUploader from "../components/fileUploader";
import type { UploadSuccessData } from '../types/expediente'; // Asegúrate de que este tipo exista

const ExpedientePorDoctor = () => {
  const [showUploader, setShowUploader] = useState(false); 

  // ID'S QUEMADOS (Constantes para prueba)
  const expedienteActualId = 1; 
  const usuarioActualId = 1; 

  const handleUploadSuccess = (data: UploadSuccessData) => {
    // Lógica al subir con éxito (ej: cerrar el formulario)
    setShowUploader(false); 
  };
  
  const handleCloseUploader = () => {
    // Lógica al cancelar
    setShowUploader(false);
  };

  return (
    <div className="p-4">

      {!showUploader && (
        <div className="mb-6">
          <button
            onClick={() => setShowUploader(true)}
            // Estilos Tailwind para un botón informativo y visible
            className="px-4 py-2 bg-info text-light font-semibold rounded-lg shadow-md hover:bg-accent hover:text-primary transition-colors flex items-center"
            title={`Adjuntar un nuevo documento al Expediente ID: ${expedienteActualId}`}
          >
            <span className="mr-2 text-xl leading-none"></span> Subir Nuevo Archivo
          </button>
        </div>
      )}

     {showUploader && (
        <div className="mt-4 mb-8 border p-4 rounded-lg shadow-xl bg-gray-50 max-w-lg mx-auto">
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h2 className="text-xl font-semibold text-primary">Adjuntar documento al expediente: {usuarioActualId}</h2>           
            <button
              onClick={handleCloseUploader}
              className="text-gray-500 hover:text-red-600 font-bold text-2xl leading-none"
              aria-label="Cerrar formulario"
            >
              &times;
            </button>
          </div>

          <FileUploader
            expedienteId={expedienteActualId} 
            creadoPorId={usuarioActualId}     
            onUploadSuccess={handleUploadSuccess} 
            onCancel={handleCloseUploader}    
          />
        </div>
      )}
    </div>
  );
};
  
export default ExpedientePorDoctor;