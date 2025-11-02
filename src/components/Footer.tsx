import React from "react";

export default function Footer() {
  return (
    <footer className="bg-primary text-light py-12">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-6">
        <span>&copy; 2025 Clínica Odontológica. Todos los derechos reservados.</span>
        <div className="flex gap-6 text-light font-medium">
          <a href="#" className="hover:text-accent transition">Facebook</a>
          <a href="#" className="hover:text-accent transition">Instagram</a>
          <a href="#" className="hover:text-accent transition">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
}
