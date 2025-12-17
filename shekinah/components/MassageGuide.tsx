
import React from 'react';

const MassageCard: React.FC<{ title: string; duration: string; steps: string[] }> = ({ title, duration, steps }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 transition-transform duration-300 hover:-translate-y-1">
    <h3 className="text-2xl font-bold text-teal-700 mb-4">{title}</h3>
    <p className="text-gray-700 mb-3"><strong>Duración:</strong> {duration}</p>
    <ol className="list-decimal list-inside space-y-2 text-gray-700">
      {steps.map((step, index) => <li key={index}>{step}</li>)}
    </ol>
  </div>
);

const MassageGuide: React.FC = () => {
  const massages = [
    {
      title: "🙌 Masaje de Manos",
      duration: "5 minutos",
      steps: [
        "Aplica un poco de crema o aceite en tus manos",
        "Masajea cada dedo desde la base hasta la punta con movimientos circulares",
        "Presiona suavemente el centro de la palma con el pulgar de la otra mano",
        "Realiza movimientos circulares en las muñecas"
      ]
    },
    {
      title: "🧠 Masaje de Cabeza",
      duration: "10 minutos",
      steps: [
        "Con las yemas de los dedos, masajea el cuero cabelludo con movimientos circulares",
        "Comienza desde la frente y avanza hacia la nuca",
        "Presiona suavemente las sienes con movimientos circulares",
        "Masajea detrás de las orejas y la base del cráneo"
      ]
    },
    {
      title: "👣 Masaje de Pies",
      duration: "10 minutos por pie",
      steps: [
        "Siéntate cómodamente y coloca un pie sobre tu rodilla opuesta",
        "Aplica aceite o crema y masajea la planta del pie con los pulgares",
        "Presiona puntos específicos en el arco del pie",
        "Masajea cada dedo individualmente",
        "Termina con movimientos suaves en el tobillo"
      ]
    },
    {
      title: "💪 Masaje de Cuello y Hombros",
      duration: "8 minutos",
      steps: [
        "Coloca una mano sobre el hombro opuesto",
        "Presiona y suelta los músculos del hombro repetidamente",
        "Masajea la parte posterior del cuello con movimientos ascendentes",
        "Realiza círculos suaves en la base del cráneo"
      ]
    }
  ];

  return (
    <section id="masajes" className="mb-12">
      <h2 className="text-4xl font-bold text-teal-700 mb-6">💆‍♀️ Masajes Recomendados para Casa</h2>
      <div className="space-y-6">
        {massages.map((massage, index) => (
          <MassageCard key={index} title={massage.title} duration={massage.duration} steps={massage.steps} />
        ))}
      </div>
    </section>
  );
};

export default MassageGuide;
