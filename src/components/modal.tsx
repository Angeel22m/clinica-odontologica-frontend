// Modal.tsx
import React from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, title, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overlay-dark backdrop-blur-sm">
      <div className="bg-light rounded-2xl shadow-2xl w-full max-w-lg p-6 relative animate-slide-in border border-primary/10">

        {/* Botón de cierre */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-primary/70 hover:text-primary text-2xl font-bold"
        >
          ✕
        </button>

        {/* Título */}
        {title && (
          <h2 className="text-xl font-bold text-primary mb-4 text-center">
            {title}
          </h2>
        )}

        {/* Contenido */}
        {children}
      </div>
    </div>
  );
};

export default Modal;

