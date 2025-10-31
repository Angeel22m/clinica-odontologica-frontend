import React from "react"

export default function Notification({ message, onClose }) {

  return (
    <div id="notification" className="notification-container bg-success text-light p-3 rounded shadow-md flex justify-between items-center w-full max-w-md mx-auto mt-4">
      {message}
      <button id="notification-close-btn" className="bg-primary text-light px-2 py-1 rounded hover:bg-accent" onClick={onClose}>X</button>
    </div>
  )
}
