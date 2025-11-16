import { useState } from 'react';
import type {DragEvent} from 'react'
import Modal from './modal';
import { uploadFileToExpediente } from '../services/expedientesService';

interface FileUploaderProps {
  expedienteId: number;
  creadoPorId: number;
  open: boolean;
  onUploadSuccess: (data: { storageName: string; signedUrl: string; dbId: number }) => void;
  onClose: () => void;
}

const MAX_FILE_SIZE_MB = 5;
const ACCEPTED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'text/plain'];

const FileUploader: React.FC<FileUploaderProps> = ({ expedienteId, creadoPorId, open, onUploadSuccess, onClose }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);

  const validateFile = (f: File) => {
    if (!ACCEPTED_FILE_TYPES.includes(f.type)) return "Tipo de archivo no permitido";
    if (f.size > MAX_FILE_SIZE_MB * 1024 * 1024) return `Máximo ${MAX_FILE_SIZE_MB} MB`;
    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const err = validateFile(f);
    if (err) { setError(err); setFile(null); return; }
    setError(null); setFile(f);
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files?.[0]; if (!f) return;
    const err = validateFile(f);
    if (err) { setError(err); setFile(null); return; }
    setError(null); setFile(f);
  };

 const handleUpload = async () => {
  if (!file) return setError("Selecciona un archivo primero");
  try {
    setUploading(true); setProgress(0); setError(null);
    const res = await uploadFileToExpediente(file, expedienteId, creadoPorId, (p) => setProgress(p));

    // Transformamos la respuesta para que tenga storageName
    onUploadSuccess({
      storageName: res.fileName,  // <-- aquí renombramos
      signedUrl: res.signedUrl,
      dbId: res.dbId,
    });

    setFile(null); 
    setProgress(100);
  } catch (err: any) {
    setError(err.message || "Error al subir");
    setProgress(0);
  } finally {
    setUploading(false);
  }
};


  return (
    <Modal open={open} onClose={onClose} title="Subir archivo">
      <div className="p-4 bg-light rounded-lg shadow-md max-w-lg mx-auto">
        <label
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`flex justify-center items-center h-24 p-4 border-2 border-dashed rounded-md cursor-pointer transition ${dragging ? 'border-accent bg-accent/20' : 'border-gray-400'}`}
        >
          {file ? <span>{file.name}</span> : <span>Arrastra o selecciona un archivo (PDF, JPG, PNG, TXT)</span>}
          <input type="file" onChange={handleChange} className="hidden" />
        </label>

        {uploading && (
          <div className="mt-2">
            <div className="w-full bg-gray-200 h-2.5 rounded-full">
              <div className="bg-primary h-2.5 rounded-full transition-all" style={{ width: `${progress}%` }}></div>
            </div>
            <p className="text-sm text-right">{progress}%</p>
          </div>
        )}

        {error && <p className="text-red-600 mt-2">{error}</p>}

        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded border hover:bg-gray-200">Cancelar</button>
          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className={`px-4 py-2 rounded text-light ${file && !uploading ? 'bg-primary hover:bg-accent' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            Subir
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default FileUploader;
