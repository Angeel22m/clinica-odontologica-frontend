import Header from '../components/Header'
import Hero from '../components/Hero'
import ServicesSection from '../components/ServicesSection'
import AboutUsSection from '../components/AboutUsSection'

export default function HomePage() {
  return (
    <div className="bg-light min-h-screen relative">
      <Header />
      <main>
        <Hero />
        <div className="border border-1 mt-12"></div>
        <AboutUsSection />
        <div className="border border-1 mt-12"></div>
        <ServicesSection />
      </main>
    </div>
  )
}
