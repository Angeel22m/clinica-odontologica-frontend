import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import EmpleadosPage from './pages/administracionEmpleados/empleadosPage'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* Toaster global - abajo, centrado */}
      <Toaster position="bottom-center" />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/empleados" element={<EmpleadosPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)


