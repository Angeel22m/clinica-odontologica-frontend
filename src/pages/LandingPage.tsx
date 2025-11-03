import Header from '../components/Header'
import Hero from '../components/Hero'

export default function HomePage() {
  return (
    <div className="bg-light min-h-screen relative">
      <Header />
      <main>
        <Hero />
      </main>
    </div>
  )
}
