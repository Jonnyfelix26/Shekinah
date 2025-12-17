
import React, { useState, FormEvent, useEffect } from 'react';
import { PlusIcon, EditIcon, Trash2Icon, XIcon } from './Icons';

type Day = 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes';

interface ScheduleItem {
  id: number;
  name: string;
  day: Day;
  startTime: string; 
  endTime: string;   
  color: string;     
}

const COLORS = [
  'bg-sky-200 border-sky-400 text-sky-800',
  'bg-emerald-200 border-emerald-400 text-emerald-800',
  'bg-amber-200 border-amber-400 text-amber-800',
  'bg-rose-200 border-rose-400 text-rose-800',
  'bg-violet-200 border-violet-400 text-violet-800',
  'bg-cyan-200 border-cyan-400 text-cyan-800',
];

const DAYS: Day[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
const TIME_SLOTS = Array.from({ length: 29 }, (_, i) => {
    const hour = Math.floor(i / 2) + 7;
    const minute = (i % 2) * 30;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
});

const getInitialSchedule = (): ScheduleItem[] => {
  try {
    const savedSchedule = localStorage.getItem('schoolSchedule');
    const defaultSchedule: ScheduleItem[] = [
      { id: 1, name: 'Matemáticas', day: 'Lunes', startTime: '08:00', endTime: '10:00', color: COLORS[0] },
      { id: 2, name: 'Historia', day: 'Miércoles', startTime: '10:30', endTime: '12:00', color: COLORS[1] },
      { id: 3, name: 'Gimnasio', day: 'Viernes', startTime: '09:00', endTime: '10:30', color: COLORS[2] },
    ];

    if (!savedSchedule) {
      return defaultSchedule;
    }
    
    const parsed = JSON.parse(savedSchedule);
    if (Array.isArray(parsed)) {
      // Filter out any malformed items to prevent crashes
      return parsed.filter((item): item is ScheduleItem => 
        item && typeof item.id === 'number' && typeof item.name === 'string' &&
        DAYS.includes(item.day) && typeof item.startTime === 'string' && 
        item.startTime.includes(':') && typeof item.endTime === 'string' &&
        item.endTime.includes(':') && typeof item.color === 'string'
      );
    }
    return defaultSchedule;
  } catch (error) {
    console.error("Failed to parse schedule from localStorage", error);
    // Return empty array on error to prevent app crash from corrupted data.
    return [];
  }
};

const SchoolSchedule: React.FC = () => {
    const [schedule, setSchedule] = useState<ScheduleItem[]>(getInitialSchedule);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState<ScheduleItem | null>(null);

    useEffect(() => {
        try {
            localStorage.setItem('schoolSchedule', JSON.stringify(schedule));
        } catch (error) {
            console.error("Failed to save schedule to localStorage", error);
        }
    }, [schedule]);

    const handleOpenModal = (item: ScheduleItem | null = null) => {
        setCurrentItem(item);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentItem(null);
    };

    const handleSubmit = (itemData: Omit<ScheduleItem, 'id'> & { id?: number }) => {
        setSchedule(prev => {
            if (itemData.id) {
                return prev.map(item => item.id === itemData.id ? { ...item, ...itemData } as ScheduleItem : item);
            }
            const newItem: ScheduleItem = { ...itemData, id: Date.now() };
            return [...prev, newItem];
        });
        handleCloseModal();
    };

    const handleDelete = (id: number) => {
        setSchedule(prev => prev.filter(item => item.id !== id));
        handleCloseModal();
    };

    const timeToGridRow = (time: string) => {
        const [hour, minute] = time.split(':').map(Number);
        return (hour - 7) * 2 + (minute / 30) + 2;
    };
    
    const dayToGridCol = (day: Day) => DAYS.indexOf(day) + 2;

    return (
        <section id="horario-escolar" className="mb-12">
            <h2 className="text-4xl font-bold text-teal-700 mb-6">✏️ Mi Horario Escolar</h2>
            <div className="bg-white rounded-xl shadow-lg p-6 overflow-x-auto">
                <div className="flex justify-between items-center mb-6">
                    <p className="text-gray-600">Organiza tus clases y actividades para tener una semana productiva.</p>
                    <button
                        onClick={() => handleOpenModal()}
                        className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 flex items-center gap-2 flex-shrink-0"
                    >
                        <PlusIcon className="w-5 h-5" /> Añadir Actividad
                    </button>
                </div>

                <div className="grid grid-cols-[auto,repeat(5,minmax(120px,1fr))] grid-rows-[auto,repeat(28,minmax(40px,1fr))] gap-x-2 relative min-w-[700px]">
                    {/* Time labels */}
                    <div className="col-start-1 row-start-1"></div>
                    {TIME_SLOTS.slice(0, -1).map((time, i) => i % 2 === 0 && (
                        <div key={time} className="text-right text-xs text-gray-400 pr-2 -mt-2" style={{ gridRow: i + 2 }}>
                            {time.split(':')[0]}:00
                        </div>
                    ))}

                    {/* Day headers */}
                    {DAYS.map((day, i) => (
                        <div key={day} className="row-start-1 text-center font-bold text-gray-600 py-2 sticky top-0 bg-white z-10" style={{ gridColumn: i + 2 }}>
                            {day}
                        </div>
                    ))}

                    {/* Grid lines */}
                    {Array.from({length: 29}).map((_, i) => (
                        <div key={`row-${i}`} className="col-start-2 col-span-5 border-t border-gray-100" style={{gridRow: i + 2}}/>
                    ))}
                    {DAYS.map((_, i) => (
                         <div key={`col-${i}`} className="row-start-2 row-span-[28] border-l border-gray-100 h-full" style={{gridColumn: i + 2}}/>
                    ))}

                    {/* Schedule items */}
                    {schedule.map(item => {
                        const rowStart = timeToGridRow(item.startTime);
                        const rowEnd = timeToGridRow(item.endTime);
                        const colStart = dayToGridCol(item.day);
                        return (
                            <div
                                key={item.id}
                                className={`rounded-lg p-2 flex flex-col justify-start overflow-hidden cursor-pointer hover:opacity-90 transition-opacity border ${item.color}`}
                                style={{
                                    gridColumn: colStart,
                                    gridRow: `${rowStart} / ${rowEnd}`,
                                }}
                                onClick={() => handleOpenModal(item)}
                            >
                                <p className="font-bold text-sm break-words">{item.name}</p>
                                <p className="text-xs">{item.startTime} - {item.endTime}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            <ScheduleModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                onDelete={handleDelete}
                item={currentItem}
            />
        </section>
    );
};


interface ScheduleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (itemData: Omit<ScheduleItem, 'id'> & { id?: number }) => void;
    onDelete: (id: number) => void;
    item: ScheduleItem | null;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({ isOpen, onClose, onSubmit, onDelete, item }) => {
    const [name, setName] = useState('');
    const [day, setDay] = useState<Day>('Lunes');
    const [startTime, setStartTime] = useState('08:00');
    const [endTime, setEndTime] = useState('09:00');
    const [color, setColor] = useState(COLORS[0]);

    useEffect(() => {
        if (item) {
            setName(item.name);
            setDay(item.day);
            setStartTime(item.startTime);
            setEndTime(item.endTime);
            setColor(item.color);
        } else {
            setName('');
            setDay('Lunes');
            setStartTime('08:00');
            setEndTime('09:00');
            setColor(COLORS[0]);
        }
    }, [item, isOpen]);
    
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (new Date(`1970-01-01T${startTime}`) >= new Date(`1970-01-01T${endTime}`)) {
            alert("La hora de fin debe ser posterior a la hora de inicio.");
            return;
        }
        onSubmit({ id: item?.id, name, day, startTime, endTime, color });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <form onSubmit={handleSubmit}>
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800">{item ? 'Editar Actividad' : 'Añadir Actividad'}</h3>
                            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600"><XIcon className="w-6 h-6" /></button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre de la actividad</label>
                                <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" />
                            </div>
                            <div>
                                <label htmlFor="day" className="block text-sm font-medium text-gray-700">Día</label>
                                <select id="day" value={day} onChange={e => setDay(e.target.value as Day)} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500">
                                    {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Hora de inicio</label>
                                    <input type="time" id="startTime" value={startTime} onChange={e => setStartTime(e.target.value)} step="1800" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" />
                                </div>
                                <div>
                                    <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">Hora de fin</label>
                                    <input type="time" id="endTime" value={endTime} onChange={e => setEndTime(e.target.value)} step="1800" required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500" />
                                </div>
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Color</label>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {COLORS.map(c => (
                                        <button key={c} type="button" onClick={() => setColor(c)} className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${c.split(' ')[0]} ${color === c ? 'ring-2 ring-offset-2 ring-teal-500' : ''}`}></button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
                        {item ? (
                            <button type="button" onClick={() => onDelete(item.id)} className="text-red-600 hover:text-red-800 font-semibold flex items-center gap-1">
                                <Trash2Icon className="w-5 h-5"/> Eliminar
                            </button>
                        ) : <div />}
                        <div className="flex gap-2">
                          <button type="button" onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg transition-all">
                            Cancelar
                          </button>
                          <button type="submit" className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-6 rounded-lg transition-all">
                             {item ? 'Guardar' : 'Crear'}
                          </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SchoolSchedule;
