
import React from 'react';
import type { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 1,
    category: 'Cascos y fundas',
    name: 'AGV Pista GP RR',
    price: 4500.00,
    stock: 5,
    description: ['Fibra de carbono 100%', 'Sistema de hidratación', 'Ventilación extrema', 'Visor óptico clase 1', 'Homologación FIM'],
    imageBg: 'bg-neutral-800',
    color: 'red-600',
    badge: 'PREMIUM',
    icon: (
      <svg viewBox="0 0 200 200" className="w-full h-40">
        <path d="M100,20 C60,20 30,50 30,90 L30,140 C30,170 50,180 100,180 C150,180 170,170 170,140 L170,90 C170,50 140,20 100,20 Z" fill="#374151" />
        <path d="M35,90 Q100,110 165,90 L165,120 Q100,140 35,120 Z" fill="#1f2937" /> 
        <circle cx="100" cy="180" r="60" fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.5"/>
        <path d="M30,90 L170,90" stroke="#ef4444" strokeWidth="2" fill="none" />
        <text x="100" y="110" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">RACING</text>
      </svg>
    ),
  },
  {
    id: 2,
    category: 'Cascos y fundas',
    name: 'Shoei NXR 2 Mate',
    price: 2100.00,
    stock: 12,
    description: ['Aerodinámica avanzada', 'Reducción de ruido', 'Visor CWR-F2', 'Pinlock incluido', 'E.Q.R.S. seguridad'],
    imageBg: 'bg-neutral-700',
    color: 'gray-400',
    icon: (
      <svg viewBox="0 0 200 200" className="w-full h-40">
        <path d="M100,25 C65,25 35,55 35,95 L35,145 C35,170 55,175 100,175 C145,175 165,170 165,145 L165,95 C165,55 135,25 100,25 Z" fill="#4b5563" />
        <path d="M40,95 Q100,115 160,95 L160,130 Q100,150 40,130 Z" fill="#111827" />
      </svg>
    ),
  },
  {
    id: 3,
    category: 'Protección personal',
    name: 'Chaqueta Alpinestars',
    price: 1200.00,
    stock: 3,
    description: ['Cuero bovino premium', 'Protecciones Nucleon Flex', 'Forro térmico desmontable', 'Ajuste deportivo', 'Cremallera de conexión'],
    imageBg: 'bg-red-900',
    color: 'red-500',
    icon: (
      <svg viewBox="0 0 200 200" className="w-full h-40">
        <path d="M60,40 L40,80 L40,160 L160,160 L160,80 L140,40 Z" fill="#7f1d1d" />
        <path d="M100,40 L100,160" stroke="#ef4444" strokeWidth="2" />
        <rect x="40" y="80" width="120" height="10" fill="#ef4444" />
        <path d="M40,80 L20,100 L30,140 L40,130" fill="#7f1d1d" />
        <path d="M160,80 L180,100 L170,140 L160,130" fill="#7f1d1d" />
      </svg>
    ),
  },
  {
    id: 4,
    category: 'Protección personal',
    name: 'Guantes Dainese Full Metal',
    price: 950.00,
    stock: 8,
    description: ['Titanio y Fibra de Carbono', 'Cuero de cabra', 'Costuras de aramida', 'Protección de meñique', 'Agarre mejorado'],
    imageBg: 'bg-neutral-800',
    color: 'yellow-500',
    badge: 'PRO',
    icon: (
      <svg viewBox="0 0 200 200" className="w-full h-40">
        <path d="M70,180 L70,100 Q70,60 90,40 L110,40 Q130,60 130,100 L130,180 Z" fill="#374151" />
        <circle cx="90" cy="80" r="10" fill="#eab308" />
        <circle cx="110" cy="70" r="10" fill="#eab308" />
        <rect x="70" y="150" width="60" height="10" fill="#1f2937" />
      </svg>
    ),
  },
  {
    id: 5,
    category: 'Accesorios de lujo',
    name: 'Intercomunicador Cardo',
    price: 100.00,
    stock: 15,
    description: ['Tecnología Mesh 2.0', 'Sonido JBL', 'Comandos de voz', 'Impermeable IP67', 'Alcance 1.6km'],
    imageBg: 'bg-blue-900',
    color: 'blue-400',
    icon: (
      <svg viewBox="0 0 200 200" className="w-full h-40">
        <rect x="50" y="80" width="100" height="40" rx="10" fill="#1e3a8a" />
        <circle cx="140" cy="100" r="15" fill="#60a5fa" />
        <line x1="50" y1="100" x2="30" y2="100" stroke="#1e3a8a" strokeWidth="4" />
        <circle cx="30" cy="100" r="5" fill="#1e3a8a" />
      </svg>
    ),
  },
  {
    id: 6,
    category: 'Parrillas y sliders',
    name: 'Slider de Motor Universal',
    price: 350.00,
    stock: 0,
    description: ['Aluminio CNC', 'Protección de impacto', 'Fácil instalación', 'Diseño aerodinámico', 'Universal'],
    imageBg: 'bg-neutral-800',
    color: 'gray-500',
    icon: (
      <svg viewBox="0 0 200 200" className="w-full h-40">
        <circle cx="100" cy="100" r="40" fill="#374151" stroke="#9ca3af" strokeWidth="4"/>
        <rect x="60" y="90" width="80" height="20" fill="#1f2937"/>
        <path d="M140,100 L180,100" stroke="#4b5563" strokeWidth="8"/>
      </svg>
    ),
  },
];
