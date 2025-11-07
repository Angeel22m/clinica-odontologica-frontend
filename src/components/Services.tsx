import React from "react";
import ServiceCard from "./ServiceCard";

export default function Services() {
  const services = [
    {
      title: "Limpieza Dental",
      description: "Prevención de caries y enfermedades periodontales con revisiones periódicas.",
    },
    {
      title: "Ortodoncia",
      description: "Alineación dental para adultos y niños mediante brackets o alineadores.",
    },
    {
      title: "Endodoncia",
      description: "Tratamiento profesional de conductos para salvar dientes dañados.",
    },
  ];

  return (
    <section id="services" className="py-32 bg-light">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-semibold text-center mb-16">Nuestros Servicios</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {services.map((service, i) => (
            <ServiceCard key={i} title={service.title} description={service.description} />
          ))}
        </div>
      </div>
    </section>
  );
}
