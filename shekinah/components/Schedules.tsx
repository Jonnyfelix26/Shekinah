
import React from 'react';

const Card: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 transition-transform duration-300 hover:-translate-y-1">
    <h3 className="text-2xl font-bold text-teal-700 mb-4">{title}</h3>
    <ul className="space-y-2 text-gray-700">{children}</ul>
  </div>
);

const Schedules: React.FC = () => {
  return (
    <section id="horarios" className="mb-12">
      <h2 className="text-4xl font-bold text-teal-700 mb-6">📅 Horarios de Actividades</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <Card title="🧘‍♀️ Meditación Guiada">
          <li className="flex items-center"><span className="mr-2">🕐</span> Lunes y Miércoles: 7:00 AM - 7:30 AM</li>
          <li className="flex items-center"><span className="mr-2">🕕</span> Viernes: 6:00 PM - 6:30 PM</li>
        </Card>
        <Card title="💬 Grupos de Apoyo">
          <li className="flex items-center"><span className="mr-2">🕒</span> Martes: 5:00 PM - 6:00 PM</li>
          <li className="flex items-center"><span className="mr-2">🕔</span> Jueves: 4:00 PM - 5:00 PM</li>
        </Card>
        <Card title="🎨 Taller de Arte Terapia">
          <li className="flex items-center"><span className="mr-2">🕓</span> Sábados: 10:00 AM - 12:00 PM</li>
        </Card>
        <Card title="🏃‍♂️ Yoga y Movimiento">
          <li className="flex items-center"><span className="mr-2">🕖</span> Lunes, Miércoles, Viernes: 7:00 PM - 8:00 PM</li>
        </Card>
      </div>
    </section>
  );
};

export default Schedules;
