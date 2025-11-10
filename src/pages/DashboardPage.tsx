import { Link } from "react-router-dom";

const dashboard = () => {
  return <>
   <div className="bg-light min-h-screen p-8"> 
  <header className="mb-10 border-b border-gray-300 pb-4">
    <h1 className="text-4xl font-extrabold text-primary">
      Dashboard Principal
    </h1>
  </header>
  <div className="flex justify-between items-center mb-10">
    <p className="text-primary text-lg">
      Gestión y Resumen de Expedientes
    </p>
    
      <Link className="bg-accent text-primary font-bold py-3 px-8 rounded-lg shadow-lg shadow-accent/40 focus:outline-none focus:ring-4 focus:ring-accent/50 transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-[1.03] hover:shadow-xl" to="/expedientes">Ir a Expedientes</Link>
  </div>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-info">
      <h3 className="text-info text-2xl font-bold mb-2">35</h3>
      <p className="text-primary opacity-80">Expedientes Abiertos</p>
    </div>
    <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-success">
      <h3 className="text-success text-2xl font-bold mb-2">89%</h3>
      <p className="text-primary opacity-80">Completados este Mes</p>
    </div>
    <div className="bg-white p-6 rounded-xl shadow-lg border-t-4 border-primary">
      <h3 className="text-primary text-2xl font-bold mb-2">4/5</h3>
      <p className="text-primary opacity-80">Tareas Pendientes</p>
    </div>
  </div>
</div>
  </>
  
}

export default dashboard;
