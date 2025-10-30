import {Hello} from './components/Hello'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import listaEmpleados from "./pages/administracionEmpleados/listaEmpleados";
function App() {

  return (
    <>
      <h1>WELCOME A MI PROYECTO DE INGENIERIA</h1>
        <Hello />   
         <BrowserRouter>
      <Routes>
        <Route path="/administracionEmpleados" element={<listaEmpleados />} />
       </Routes> 
    </BrowserRouter> 
    </>
  )
}

export default App
