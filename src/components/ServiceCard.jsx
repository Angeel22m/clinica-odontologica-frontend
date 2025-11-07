import React from "react";

export default function ServiceCard({ title, description }) {
  return (
    <div className="bg-accent/10 rounded-3xl shadow-lg p-10 hover:shadow-2xl transition transform hover:-translate-y-2">
      <h3 className="text-2xl font-semibold mb-4 text-primary">{title}</h3>
      <p className="text-primary/80 text-lg leading-relaxed">{description}</p>
    </div>
  );
}
