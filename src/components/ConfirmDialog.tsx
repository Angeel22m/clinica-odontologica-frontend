import React from "react"

export default function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div id="confirm-dialog" className="confirm-dialog-container bg-light p-6 rounded shadow-md w-full max-w-sm mx-auto mt-6">
      <p id="confirm-dialog-message" className="confirm-dialog-message text-primary font-semibold mb-4" >{message}</p>
      <div className="flex justify-end gap-2">
      <button id="confirm-dialog-yes-btn" className="btn-primary px-4 py-2 rounded hover:bg-accent" onClick={onConfirm}>Sí</button>
      <button id="confirm-dialog-no-btn" className="bg-accent text-light px-4 py-2 rounded hover:bg-info" onClick={onCancel}>No</button>
      </div>
    </div>
  )
}
