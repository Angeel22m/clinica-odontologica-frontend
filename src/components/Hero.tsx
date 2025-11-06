import Button from './Button'

export default function Hero() {
  return (
    <section className="pt-32 text-center px-6">
      <h1 className="text-5xl font-bold text-primary">
        Sonríe con confianza
      </h1>
      <p className="mt-4 text-lg font-semibold text-info max-w-xl mx-auto">
        En nuestra clínica odontológica, nos encargamos de tu salud dental con el mejor cuidado y tecnología.
      </p>
      <div className="mt-8 flex justify-center items-center gap-4">
        <Button className="font-semibold cursor-pointer">Agenda tu cita</Button>
        <a href="/services" className="text-primary font-semibold hover:bg-accent rounded-md px-3 py-2">
          Nuestros servicios →
        </a>
      </div>
    </section>
  )
}
