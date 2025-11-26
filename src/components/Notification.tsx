
// Definimos la interfaz de las props para tipado (si usas TypeScript)
interface NotificationProps {
  message: string;
  onClose: () => void;
  // Usamos 'success' o 'alert' (que es tu clase para error/peligro)
  type?: 'success' | 'alert' | 'info'; 
}

export default function Notification({ message, onClose, type = 'success' }: NotificationProps) {
  
  // Función que asigna las clases de fondo basadas en el tipo
  const getNotificationClasses = () => {
    switch (type) {
      case 'alert':
        // Usa tu clase personalizada para errores (rojo)
        return 'bg-alert text-light'; 
      case 'info':
        // Usa tu clase personalizada para información (azul)
        return 'bg-info text-light'; 
      case 'success':
      default:
        // Usa tu clase para éxito (verde) - Default
        return 'bg-success text-light'; 
    }
  };

  return (
    <div 
      id="notification" 
      // Se combinan las clases fijas con las clases dinámicas de color
      className={`fixed top-5 right-5 z-50 notification-container p-3 rounded shadow-md flex justify-between items-center w-full max-w-md mx-auto mt-4 animate-slide-in ${getNotificationClasses()}`}
    >
      {message}
      <button 
        id="notification-close-btn" 
        // Usamos colores de contraste para el botón de cierre
        className="bg-primary text-light px-2 py-1 rounded hover:opacity-80" 
        onClick={onClose}
      >
        X
      </button>
    </div>
  );
}