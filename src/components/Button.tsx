export default function Button({ children, onClick, className = '', ...props }) {
  return (
    <button
      onClick={onClick}
      className={`btn-primary px-4 py-2 rounded-md hover:bg-accent transition ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
