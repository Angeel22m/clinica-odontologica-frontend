export default function MobileMenu({ open, onClose, navigation }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-primary bg-opacity-95 flex flex-col p-6">
      <div className="flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <img
            alt=""
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
            className="h-8 w-auto"
          />
          <span className="text-light font-semibold">Your Company</span>
        </a>
        <button
          type="button"
          onClick={onClose}
          className="text-light text-3xl"
        >
          ×
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {navigation.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className="text-light text-lg font-semibold hover:text-accent"
            onClick={onClose}
          >
            {item.name}
          </a>
        ))}
        <a
          href="#"
          className="text-light text-lg font-semibold hover:text-accent"
          onClick={onClose}
        >
          Log in
        </a>
      </div>
    </div>
  )
}
