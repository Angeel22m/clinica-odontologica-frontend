import { useState } from 'react';
import Modal from './modal';
// ELIMINAMOS apiCallToCancelCita, ya que usaremos onCancelSubmit (que usa axios)

interface CitaData {
  id: number;
  fecha: string;
  doctor: {
    persona: {
      nombre: string;
    };
  };
  // ... puedes agregar más campos si los necesitas en el modal
}

interface UserData {
    id: number; 
    role: string | null | undefined;
}

interface ModalProps {
    cita: CitaData;
    onClose: () => void;
    // onCancelSubmit es la función que usa axios y se pasa desde HomePaciente
    onCancelSubmit: (data: any) => Promise<any>; 
    onSuccess: () => void;
    currentUser: UserData; // Recibimos el usuario real como prop
}


const ModalCancelarCita: React.FC<ModalProps> = ({ 
    cita, 
    onClose, 
    onSuccess, 
    onCancelSubmit, 
    currentUser 
}) => {
    // Estado para capturar el motivo de cancelación
    const [motivoCancelacion, setMotivoCancelacion] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null); // Tipado a string | null

    // NOTA: EL currentUser AHORA VIENE DE PROPS

    const handleCancelacion = async () => {
        if (motivoCancelacion.trim() === '') {
            setError('Debes ingresar un motivo de cancelación.');
            return;
        }

        setIsLoading(true);
        setError(null);

        const dataToSend = {
            citaId: cita.id, // ID de la cita a cancelar
            motivoCancelacion: motivoCancelacion,
            // USAMOS LOS DATOS REALES PASADOS DESDE HOMEPCIENTE
            usuarioCancelaId: currentUser.id, 
            rolCancela: currentUser.role,
        };

        try {
            // Llama a la función del padre (handleCancelacionFinal que usa Axios)
            await onCancelSubmit(dataToSend);
            
            // Si llega aquí, la cancelación fue exitosa. 
            // alert(`Cita #${cita.id} cancelada exitosamente.`); // Se reemplaza por la Notificación global en HomePaciente.
            onSuccess(); // Cierra el modal y activa la recarga de datos en el padre
            
        } catch (err: any) {
            // Captura el error lanzado por onCancelSubmit (incluyendo el mensaje del backend)
            // Ya se configuró la Notificación global en HomePaciente.
            setError(err.message || 'Ocurrió un error inesperado al cancelar.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!cita) return null;

    return (
        <Modal onClose={onClose} open title='Confirmar Cancelacion'>
        
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
              
                
                <p className="mb-4 text-gray-700">
                    Estás a punto de cancelar la cita con <strong>{cita.doctor.persona.nombre}</strong> el <strong>{cita.fecha}</strong>. 
                    Por favor, indica la razón.
                </p>

                {/* Campo de Motivo */}
                <div className="mb-4">
                    <label 
                        htmlFor="motivo" 
                        className="block text-sm font-medium text-alert"
                    >
                        Motivo de Cancelación *
                    </label>
                    <textarea
                        id="motivo"
                        rows={3}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-red-500 focus:border-red-500"
                        value={motivoCancelacion}
                        onChange={(e) => setMotivoCancelacion(e.target.value)}
                        disabled={isLoading}
                    />
                </div>

                {/* Mensaje de Error */}
                {error && (
                    <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Botones de Acción */}
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium btn-primary rounded-md hover:bg-gray-300"
                        disabled={isLoading}
                    >
                        Cerrar
                    </button>
                    <button
                        onClick={handleCancelacion}
                        className="px-4 py-2 text-sm font-medium btn-alert rounded-md"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Cancelando...' : 'Confirmar Cancelación'}
                    </button>
                </div>
            </div>
       
        </Modal>
    );
};

export default ModalCancelarCita;