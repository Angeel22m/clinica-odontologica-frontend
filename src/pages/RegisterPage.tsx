import RegisterForm from "../components/RegisterForm";

export default function RegisterPage() {
  const handleRegister = async () => {
    // Simulación visual (sin lógica de API aún)
    console.log("Simulación de registro de usuario");
    return true;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-light px-4 overflow-auto">
      <div className="w-full max-w-2xl text-center">

        {/* Formulario de registro */}
        <RegisterForm onRegister={handleRegister} />

      </div>
    </div>
  );
}

