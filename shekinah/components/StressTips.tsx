
import React from 'react';

const TipCard: React.FC<{ icon: string; title: string; text: string; bg: string; color: string }> = ({ icon, title, text, bg, color }) => (
  <div className={`${bg} rounded-xl p-6 transition-shadow duration-300 hover:shadow-xl`}>
    <div className="text-4xl mb-3">{icon}</div>
    <h3 className={`text-xl font-bold ${color} mb-3`}>{title}</h3>
    <p className="text-gray-700">{text}</p>
  </div>
);

const StressTips: React.FC = () => {
  return (
    <section id="consejos" className="mb-12">
      <h2 className="text-4xl font-bold text-teal-700 mb-6">💡 Consejos para Manejar el Estrés</h2>
      <div className="grid md:grid-cols-3 gap-6">
        <TipCard icon="🌬️" title="Respiración Profunda" text="Practica respiraciones profundas: inhala por 4 segundos, mantén por 4, exhala por 4. Repite 5 veces." bg="bg-blue-50" color="text-blue-800" />
        <TipCard icon="🚶‍♀️" title="Camina al Aire Libre" text="Una caminata de 15 minutos puede reducir significativamente los niveles de estrés y mejorar tu ánimo." bg="bg-green-50" color="text-green-800" />
        <TipCard icon="📱" title="Desconexión Digital" text="Toma descansos de las redes sociales. Dedica 30 minutos al día sin pantallas." bg="bg-purple-50" color="text-purple-800" />
        <TipCard icon="💤" title="Duerme Bien" text="Mantén un horario regular de sueño. Intenta dormir 7-9 horas cada noche." bg="bg-pink-50" color="text-pink-800" />
        <TipCard icon="🎵" title="Música Relajante" text="Escucha música suave o sonidos de la naturaleza para calmar tu mente." bg="bg-yellow-50" color="text-yellow-800" />
        <TipCard icon="✍️" title="Diario Personal" text="Escribe tus pensamientos y emociones. Es una excelente forma de procesar el estrés." bg="bg-indigo-50" color="text-indigo-800" />
      </div>
    </section>
  );
};

export default StressTips;
