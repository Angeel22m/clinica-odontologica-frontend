import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-light p-6">
  
  {/* Gran Número de Error 404 */}
  <h1 className="text-8xl md:text-9xl font-extrabold text-primary mb-6 animate-pulse">
    404
  </h1>
  
  {/* Mensaje Principal */}
  <p className="text-2xl font-semibold text-primary mb-8 opacity-80">
    ¡Ups! Parece que esta página no existe.
  </p>
  
  {/* Botón de Navegación (Usando tu utilidad btn-primary) */}
  <Link 
    to="/" 
    className="
      btn-primary 
      text-lg 
      font-bold 
      px-10 
      py-4 
      rounded-xl 
      shadow-lg 
      shadow-primary/50
      focus:outline-none 
      focus:ring-4 
      focus:ring-primary/50
      transition 
      duration-300 
      ease-in-out 
      hover:scale-[1.05] 
      hover:shadow-xl
    "
  >
    Volver a Landing
  </Link>

  {/* Pequeña Referencia Opcional */}
  <p className="mt-8 text-sm text-primary opacity-60">
    Si crees que esto es un error, contacta a soporte.
  </p>
</div>
  );
};

export default NotFoundPage;
