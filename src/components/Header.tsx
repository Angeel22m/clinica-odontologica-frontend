import React from "react";

export default function Header() {
  return (
    <header className="bg-light shadow-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center py-6 px-6">
        <h1 className="text-3xl font-bold">Clínica Odontológica</h1>
        <nav>
          <ul className="flex gap-8 font-medium text-primary">
            <li><a href="#services" className="hover:text-accent transition">Servicios</a></li>
            <li><a href="#about" className="hover:text-accent transition">Nosotros</a></li>
            <li><a href="#contact" className="hover:text-accent transition">Contacto</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
