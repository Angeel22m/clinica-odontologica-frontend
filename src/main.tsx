import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import App from "./App";
import EmpleadosPage from "./pages/administracionEmpleados/empleadosPage";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          <Route path="/" element={<Navigate to="/empleados" replace />} />
          <Route path="/empleados" element={<EmpleadosPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
