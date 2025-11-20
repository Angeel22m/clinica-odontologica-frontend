import { io } from "socket.io-client";

const URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";



const socket = io(URL, {
  query: {token:localStorage.getItem('token') || ''},
  // Puedes añadir opciones como headers o autenticación aquí
  withCredentials: true,
});


export default socket;