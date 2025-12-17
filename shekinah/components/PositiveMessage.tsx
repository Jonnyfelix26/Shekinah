import React from 'react';

// FIX: Removed React.FC for a simpler component definition, which can avoid subtle TypeScript issues.
const PositiveMessage = () => {
  return (
    <section id="inicio" className="mb-12">
      <div className="bg-gradient-to-r from-blue-100 via-cyan-100 to-teal-100 rounded-2xl p-8 text-center shadow-lg transition-transform duration-300 hover:scale-105">
        <h2 className="text-3xl font-bold text-teal-800 mb-4">💫 Mensaje del Día</h2>
        <p id="mensaje-positivo" className="text-xl text-gray-800 italic font-semibold">
          "Cada día es una nueva oportunidad para cuidar de ti mismo. Eres valioso y mereces bienestar."
        </p>
      </div>
    </section>
  );
};

export default PositiveMessage;
