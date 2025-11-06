import { useState } from 'react'
import MobileMenu from './MobileMenu'
import logo from '../assets/logo.png'

const navigation = [
  { name: 'Servicios', href: '/services' },
  { name: 'Especialistas', href: '#' },
  { name: 'Contacto', href: '#' },
  { name: 'Preguntas frecuentes', href: '#' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <nav className="flex items-center justify-between p-6 lg:px-8 shadow-sm/10 rounded-sm">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <a href="/landing" className="-m-1.5 p-1.5 flex items-center gap-2">
            <img
              alt="Logo"
              src={logo}
              className="h-10 w-auto"
            />
          </a>
        </div>

        {/* Botón menú móvil */}
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="rounded-md p-2 text-primary bg-accent"
          >
            ☰
          </button>
        </div>

        {/* Navegación escritorio */}
        <div className="hidden lg:flex lg:gap-x-12">
          {navigation.map((item) => (
            <a key={item.name} href={item.href} className="text-primary font-medium hover:text-accent">
              {item.name}
            </a>
          ))}
        </div>

        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <a href="/login" className="text-primary font-semibold bg-accent rounded-md px-3 py-2">
            Iniciar Sesión →
          </a>
        </div>
      </nav>

      {/* Menú móvil */}
      <MobileMenu
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navigation={navigation}
      />
    </header>
  )
}
