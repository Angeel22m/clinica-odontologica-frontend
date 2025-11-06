import logo from '../assets/logo.png'

export default function MobileMenu({ open, onClose, navigation }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end p-6 overlay-dark">
      <div
        className="fixed inset-0 bg-black bg-opacity-25"
        onClick={onClose}
      ></div>

      <div className="fixed top-0 right-0 bg-light rounded-l shadow-xl w-72 p-6 flex flex-col gap-6 z-50">
        <div className="flex items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <img
              alt=""
              src={logo}
              className="h-8 w-auto"
            />

          </a>
          <button
            type="button"
            onClick={onClose}
            className="text-primary text-3xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-primary text-lg font-semibold hover:text-accent transition-colors"
              onClick={onClose}
            >
              {item.name}
            </a>
          ))}

          <button
            className="mt-4 px-4 py-2 btn-primary rounded-md hover:bg-accent transition-colors"
            onClick={onClose}
          >
            Log in
          </button>
        </div>
      </div>
    </div>
  );
}

