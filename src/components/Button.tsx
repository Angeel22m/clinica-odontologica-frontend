import React from "react";

export default function Button({ children, onClick, type = "primary", className = "" }) {
  const base =
    "px-6 py-3 rounded-xl font-semibold shadow-lg transition-transform transform hover:scale-105";
  const styles = {
    primary: "bg-primary text-light hover:bg-accent",
    accent: "bg-accent text-light hover:bg-primary",
  };

  return (
    <button onClick={onClick} className={`${base} ${styles[type]} ${className}`}>
      {children}
    </button>
  );
}
