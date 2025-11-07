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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative">
        {/* Botón de cierre */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-xl"
        >
          ✕
        </button>

        {/* Título opcional */}
        {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}

        {/* Contenido */}
        {children}
      </div>
    </div>
  );
};

export default Modal;
