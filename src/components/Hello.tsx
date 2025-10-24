import { useEffect, useState } from 'react';
import { api } from '../services/api';

export function Hello() {
  const [message, setMessage] = useState('Cargando...');

  useEffect(() => {
    api.get('/hello')
      .then(res => setMessage(res.data.message))
      .catch(() => setMessage('Error al cargar mensaje'));
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <h1>{message}</h1>
    </div>
  );
}
