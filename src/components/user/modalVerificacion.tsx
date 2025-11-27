import React, { useState } from 'react';
import axios from 'axios';
import Modal from '../modal';

interface ModalProps {
  onClose: () => void;
  onSuccess: () => void;
  token: string | null;
  clienteid: number;
  
  refreshAuth: ()=>void;
  setNotification: (notif: { message: string; type: 'success' | 'alert' | 'info' }) => void;
}

const ModalVerificacion: React.FC<ModalProps> = ({ onClose, onSuccess,refreshAuth, clienteid, token, setNotification }) => {
  const [step, setStep] = useState<'send' | 'verify'>('send');
  const [codeArray, setCodeArray] = useState(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const headers = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // --- MANEJADOR DE ENVÍO DEL CORREO ---
  const handleEnviarVerificacion = async () => {
    setIsSubmitting(true);
    try {
      await axios.post(`http://localhost:3000/email-verification/request-code/${clienteid}`, {}, headers);
      setStep('verify');
      setNotification({ message: "Correo de verificación enviado. Revisa tu bandeja de entrada.", type: 'info' });
    } catch (error) {
      setNotification({ message: "Error al enviar el correo. Intenta de nuevo.", type: 'alert' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
  e.preventDefault();
  const paste = e.clipboardData.getData('Text').replace(/\D/g, '').slice(0, 6); // máximo 6 dígitos
  const newCode = [...codeArray];
  for (let i = 0; i < paste.length; i++) {
    newCode[i] = paste[i];
    const nextInput = document.getElementById(`code-${i}`) as HTMLInputElement;
    nextInput?.focus();
  }
  setCodeArray(newCode);
};


  // --- MANEJADOR DE VERIFICACIÓN DEL CÓDIGO ---
  const handleVerificarCodigo = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = codeArray.join('');
    if (code.length !== 6) {
      setNotification({ message: "El código debe tener 6 dígitos.", type: 'alert' });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await axios.post(
        `http://localhost:3000/email-verification/validate/${clienteid}`,
        { code },
        headers
      );

      if (res.data?.success) {
        if (res.data?.success) {
    const updatedUser = { ...JSON.parse(localStorage.getItem('user') || '{}'), verificado: true };
    localStorage.setItem('user', JSON.stringify(updatedUser));

    refreshAuth(); // Actualiza HomePaciente inmediatamente
    setNotification({ message: "¡Verificación exitosa! Ya puedes agendar citas.", type: 'success' });
    onSuccess(); // Cierra la modal
}

      } else {
        setNotification({ message: res.data.message || "Código incorrecto o expirado.", type: 'alert' });
      }
    } catch (error) {
      setNotification({ message: "Error al verificar el código.", type: 'alert' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- MANEJO DE INPUTS ---
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 1);
    const newCode = [...codeArray];
    newCode[idx] = val;
    setCodeArray(newCode);

    // auto-focus siguiente input
    if (val && idx < 5) {
      const next = document.getElementById(`code-${idx + 1}`);
      next?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === 'Backspace' && !codeArray[idx] && idx > 0) {
      const prev = document.getElementById(`code-${idx - 1}`) as HTMLInputElement;
      prev?.focus();
    }
  };

  return (
    <Modal onClose={onClose} title="Verificación de correo" open>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-light p-6 rounded-lg shadow-xl w-96">
          <h3 className="text-xl font-bold mb-4 text-primary">Verificación de Correo</h3>

          {step === 'send' ? (
            <>
              <p className="mb-4 text-primary/80">
                Para poder agendar citas, necesitamos verificar tu dirección de correo electrónico.
              </p>
              <button
                onClick={handleEnviarVerificacion}
                disabled={isSubmitting}
                className="btn-primary w-full"
              >
                {isSubmitting ? 'Enviando Correo...' : 'Enviar Código de 6 Dígitos'}
              </button>
            </>
          ) : (
            <form onSubmit={handleVerificarCodigo}>
              <p className="mb-4 text-primary/80">
                Ingresa el código de 6 dígitos que enviamos a tu correo:
              </p>

              <div className="flex justify-between gap-2 mb-4">
                {codeArray.map((num, idx) => (
                  <input
                    key={idx}
                    id={`code-${idx}`}
                    type="text"
                    value={num}
                    onChange={(e) => handleCodeChange(e, idx)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    onPaste={handlePaste} 
                    maxLength={1}
                    className="w-10 h-12 text-center text-lg border border-primary/10 rounded focus:border-primary focus:ring-1 focus:ring-primary transition"
                  />
                ))}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || codeArray.some((c) => c === '')}
                className="btn-primary w-full"
              >
                {isSubmitting ? 'Verificando...' : 'Verificar Cuenta'}
              </button>
            </form>
          )}

          <button
            onClick={onClose}
            className="mt-4 w-full text-center hover:bg-primary hover:text-white btn-accent"
          >
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalVerificacion;
