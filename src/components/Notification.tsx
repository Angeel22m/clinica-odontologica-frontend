// Notification.tsx
interface NotificationProps {
  message: string;
  onClose: () => void;
  type?: 'success' | 'alert' | 'info';
}

export default function Notification({ message, onClose, type = 'success' }: NotificationProps) {
  
  // Función que asigna clases de fondo según el tipo
  const getNotificationClasses = () => {
    switch (type) {
      case 'alert':
        return 'bg-alert text-light';  // Rojo
      case 'info':
        return 'bg-info text-light';   // Azul
      case 'success':
      default:
        return 'bg-success text-light'; // Verde
    }
  };

  return (
    <div
      id="notification"
      className={`fixed top-5 right-5 z-50 p-3 rounded shadow-md flex justify-between items-center w-full max-w-md mx-auto mt-4 animate-slide-in ${getNotificationClasses()}`}
    >
      <span className="flex-1">{message}</span>
      <button
        id="notification-close-btn"
        className="ml-3 bg-primary text-light px-2 py-1 rounded hover:opacity-80 transition"
        onClick={onClose}
      >
        X
      </button>
    </div>
  );
}
