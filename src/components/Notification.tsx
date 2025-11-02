import React from "react"

export default function Notification({ message, onClose }) {

  return (
    <div id="notification" className="fixed top-5 right-5 z-50 notification-container bg-success text-light p-3 rounded shadow-md flex justify-between items-center w-full max-w-md mx-auto mt-4 animate-slide-in">
      {message}
      <button id="notification-close-btn" className="bg-primary text-light px-2 py-1 rounded hover:bg-accent" onClick={onClose}>X</button>
    </div>
  )
}
