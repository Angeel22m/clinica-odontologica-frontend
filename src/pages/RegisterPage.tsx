import RegisterForm from "../components/RegisterForm";

export default function RegisterPage() {

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-light px-4 overflow-auto">
      <div className="w-full max-w-2xl text-center">

        {/* Formulario de registro */}
        <RegisterForm />

      </div>
    </div>
  );
}

