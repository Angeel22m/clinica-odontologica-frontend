import { Link } from 'react-router-dom'

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-dark text-white">
      <h1 className="text-3xl font-bold mb-6">Bienvenido al Sistema</h1>
      <Link
        to="/empleados"
        className="bg-sky-500 hover:bg-sky-600 px-5 py-2 rounded-lg shadow text-white font-medium"
      >
        Ir a administración de empleados
      </Link>
    </div>
  )
}

export default App
