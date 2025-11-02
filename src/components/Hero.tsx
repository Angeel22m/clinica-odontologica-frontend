import React from "react";
import Button from "./Button";

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-primary to-accent text-light py-40">
      <div className="max-w-4xl mx-auto text-center px-6">
        <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 leading-tight">
          Sonrisas saludables, pacientes felices
        </h1>
        <p className="text-lg sm:text-xl mb-12 text-light/90">
          Atención odontológica profesional, combinando salud, estética y bienestar.
        </p>
        <Button>Agenda tu cita</Button>
      </div>
    </section>
  );
}
