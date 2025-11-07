import React from "react";

const teamInfo = [
  {
    title: "Nuestra Misión",
    description: "Brindar atención médica de calidad, accesible y humana para todos nuestros pacientes.",
  },
  {
    title: "Nuestra Visión",
    description: "Ser líderes en servicios de salud, innovando y mejorando constantemente la experiencia del paciente.",
  },
  {
    title: "Nuestros Valores",
    description: "Compromiso, respeto, honestidad y excelencia en cada servicio que ofrecemos.",
  },
];

const AboutUsSection = () => {
  return (
    <section className="py-16 bg-light">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-8 text-primary">
          Quiénes Somos
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {teamInfo.map((item, index) => (
            <div
              key={index}
              className="bg-light border border-accent rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <h3 className="text-xl font-semibold mb-2 text-primary">
                {item.title}
              </h3>
              <p className="text-primary">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutUsSection;
