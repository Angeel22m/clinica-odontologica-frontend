import React from "react";

export default function About() {
  return (
    <section id="about" className="py-32 bg-accent/10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
        <img
          src="/odontologo.jpg"
          alt="Equipo odontológico"
          className="rounded-3xl shadow-xl w-full lg:w-1/2 object-cover"
        />
        <div className="text-center lg:text-left lg:w-1/2">
          <h2 className="text-4xl font-semibold text-primary mb-6">Sobre Nosotros</h2>
          <p className="text-primary/80 text-lg leading-relaxed mb-4">
            Somos un equipo de odontólogos con experiencia en todas las especialidades, enfocados en tu salud bucal y tu sonrisa.
          </p>
          <p className="text-primary/80 text-lg leading-relaxed">
            Nos comprometemos a brindar atención profesional, cálida y personalizada para cada paciente.
          </p>
        </div>
      </div>
    </section>
  );
}
