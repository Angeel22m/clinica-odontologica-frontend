import React from "react";
import Button from "./Button";

export default function Contact() {
  return (
    <section id="contact" className="py-32 bg-light">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-semibold mb-6 text-primary">Contáctanos</h2>
        <p className="text-primary/70 mb-12 text-lg">
          Deja tus datos y nos pondremos en contacto para agendar tu cita.
        </p>
        <form className="bg-light shadow-xl rounded-3xl p-10 max-w-lg mx-auto flex flex-col gap-6">
          <input
            type="text"
            placeholder="Nombre"
            className="w-full p-4 border border-primary/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-primary"
          />
          <input
            type="email"
            placeholder="Correo"
            className="w-full p-4 border border-primary/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-primary"
          />
          <textarea
            placeholder="Mensaje"
            className="w-full p-4 border border-primary/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent text-primary"
            rows={5}
          ></textarea>
          <Button>Enviar</Button>
        </form>
      </div>
    </section>
  );
}
