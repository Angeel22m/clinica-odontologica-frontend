import React from "react";

const services = [
  {
    title: "Consulta General",
    description: "Atención médica completa para ti y tu familia.",
  },
  {
    title: "Laboratorio Clínico",
    description: "Pruebas diagnósticas precisas y confiables.",
  },
  {
    title: "Urgencias 24/7",
    description: "Atención inmediata en casos críticos.",
  },
];

const ServicesSection = () => {
  return (
    <section className="py-16 bg-light">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-8 text-primary">
          Algunos de nuestros servicios
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-light p-6 rounded-2xl shadow-lg border border-accent hover:shadow-2xl transition-shadow duration-400"
            >
              <h3 className="text-xl font-semibold mb-2 text-primary">
                {service.title}
              </h3>
              <p className="text-primary">{service.description}</p>
            </div>
          ))}
        </div>

        <a
  href="/servicios" // o "#servicios" si es ancla en la misma página
  className="inline-block px-6 py-3 btn-primary rounded-md hover:bg-accent transition-colors"
>
  Ver todos los servicios
</a>
      </div>
    </section>
  );
};

export default ServicesSection;

