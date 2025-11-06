import React, { useState } from 'react';
import type { DragEvent } from 'react';
import { uploadFileToExpediente } from '../services/api'; 

// Definiciones de tipos (asumidas)
interface UploadSuccessData {
  fileName: string;
  dbId: number;
  signedUrl: string;
  message: string;
}

interface FileUploaderProps {
  expedienteId: number;
  creadoPorId: number;
  onUploadSuccess?: (data: UploadSuccessData) => void;
  onCancel?: () => void; 
}

// --- CONSTANTES DE VALIDACIÓN ---
const MAX_FILE_SIZE_MB = 5;
const ACCEPTED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'text/plain']; 

const FileUploader: React.FC<FileUploaderProps> = ({
  expedienteId,
  creadoPorId,
  onUploadSuccess,
  onCancel,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  // ESTADO CLAVE: Para la barra de progreso
  const [uploadProgress, setUploadProgress] = useState(0); 

  const inputId = `file-upload-input-${expedienteId}`;

  // --- LÓGICA DE VALIDACIÓN ---
  const validateAndSetFile = (selectedFile: File) => {
    if (!ACCEPTED_FILE_TYPES.includes(selectedFile.type)) {
      setError('Tipo de archivo no válido. Solo se aceptan PDF, JPG, PNG o TXT.');
      setFile(null);
      return false;
    }
    if (selectedFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`El archivo no debe exceder los ${MAX_FILE_SIZE_MB} MB.`);
      setFile(null);
      return false;
    }
    
    setError(null);
    setFile(selectedFile);
    return true;
  };

  // --- HANDLERS DE INPUT/DROP ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    if (!isDragging) setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };

  // --- LÓGICA DE SUBIDA CON PROGRESO ---
  const handleUpload = async () => {
    if (!file) {
      setError('Selecciona un archivo primero.');
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0); // Reiniciar progreso
      setError(null);
      
      // LLAMADA AL SERVICIO CON EL CALLBACK DE PROGRESO
      const result = await uploadFileToExpediente(
          file, 
          expedienteId, 
          creadoPorId,
          (percent) => { setUploadProgress(percent); } // Actualiza la barra
      ); 

      if (onUploadSuccess) onUploadSuccess(result);
      setUploadProgress(100); // Asegurarse de que muestre 100%
      setFile(null);
    } catch (err: any) {
      setError(err.message || 'Error al subir el archivo.');
      setUploadProgress(0); // Resetear progreso en caso de fallo
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 border border-gray-300 rounded-lg shadow-md bg-light max-w-lg mx-auto">
      <h3 className="text-primary text-xl font-semibold mb-4 border-b pb-2">
        Sube tu documento aquí
      </h3>
      
      {/* 1. Área del Selector de Archivo (Drag & Drop) */}
      <label
        htmlFor={inputId}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          flex justify-center items-center h-24 p-4 border-2 border-dashed rounded-md cursor-pointer transition-all duration-300
          ${isDragging ? 'border-accent bg-accent/20 scale-[1.02]' : ''}
          ${file && !error ? 'border-success bg-success/10 text-primary' : 'border-gray-400 hover:border-primary bg-light text-gray-500'}
          ${error ? 'border-red-600 bg-red-100' : ''}
        `}
      >
        {file && !error ? (
          <p className="font-medium text-primary flex items-center">
            Archivo listo: **{file.name}** ({Math.round(file.size / 1024)} KB)
          </p>
        ) : (
          <p className="text-center text-sm md:text-base">
            {isDragging ? '¡Suelta el archivo aquí!' : 'Haz clic para **seleccionar** o **arrastra** un archivo (PDF, JPG, PNG) aquí.'}
          </p>
        )}
      </label>
      
      {/* Input Oculto Real */}
      <input 
        id={inputId}
        type="file" 
        onChange={handleChange} 
        className="hidden" 
        disabled={uploading}
        accept={ACCEPTED_FILE_TYPES.join(',')} 
      />

      {/* ----------------------------------------------------- */}
      {/* BARRA DE PROGRESO */}
      {/* ----------------------------------------------------- */}
      {uploading && !error && (
          <div className="mt-4">
              <div className="flex justify-between mb-1">
                  <p className="text-info font-medium">Subiendo archivo...</p>
                  <p className="text-primary font-bold">{uploadProgress}%</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                      className="bg-info h-2.5 rounded-full transition-all duration-300" 
                      style={{ width: `${uploadProgress}%` }}
                  ></div>
              </div>
          </div>
      )}

      {/* 2. Botones de Subida y Cancelación (Ocultos si uploading=true) */}
      {!uploading && (
            <div className="mt-4 flex justify-end space-x-3">
                {onCancel && (
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-full font-bold text-primary border border-gray-300 hover:bg-gray-200 transition-colors"
                    >
                        Cancelar
                    </button>
                )}

                <button
                    onClick={handleUpload}
                    disabled={!file || !!error}
                    className={`
                        px-6 py-2 rounded-full font-bold transition-all duration-200
                        ${!file || !!error
                        ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                        : 'bg-primary text-light hover:bg-accent hover:text-primary shadow-lg'
                        }
                    `}
                >
                    Subir Archivo
                </button>
            </div>
      )}
      
      {/* 3. Mensajes de Estado y Error */}
      <div className="mt-4 p-2 rounded text-center">
   {error && (
    <div className="bg-light p-3 rounded font-medium border border-red-400">
        {/* 1. Mensaje de Error (Fuera del botón) */}
        <p className="text-primary mb-3 text-base font-bold">
            Error de Subida: {error} (Máx: {MAX_FILE_SIZE_MB}MB)
        </p>
        
        {/* 2. Botón de Reintento (Asegura contraste usando Primary/Light) */}
        <button
            onClick={() => setError(null)}
            className="px-4 py-2 bg-primary text-light text-sm font-semibold rounded-lg shadow-md hover:bg-accent hover:text-primary transition-colors"
        >
            Aceptar y Reintentar
        </button>
    </div>
)}
</div>
    </div>
  );
};

export default FileUploader;