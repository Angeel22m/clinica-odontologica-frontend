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

  return (<div className="fixed inset-0 z-50 flex items-center justify-center overlay-dark backdrop-blur-sm p-4">  
  <div className="bg-light rounded-2xl shadow-2xl max-w-lg p-6 relative animate-slide-in border border-primary/10 max-h-full md:max-h-[90vh] flex flex-col">

    {/* Botón de cierre */}
    <button
      onClick={onClose}
      className="absolute top-2 right-3 text-primary/70 hover:text-primary text-2xl font-bold"
    >
      ✕
    </button>
    
    {title && (
      <h2 className="text-xl font-bold text-primary mb-4 text-center flex-shrink-0">
        {title}
      </h2>
    )}  
    
    <div className="overflow-y-auto flex-grow -mx-6 px-6"> 
      {children}
    </div>
    
  </div>
</div>
  );
};

export default Modal;

