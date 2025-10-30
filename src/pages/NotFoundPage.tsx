import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-light">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <p className="text-gray-600 mb-6">Página no encontrada</p>
      <Link to="/" className="btn-primary px-6 py-3 rounded-lg">
        Volver al inicio
      </Link>
    </div>
  );
};

export default NotFoundPage;
