
import type React from 'react';

export interface Product {
  id: string | number; // Firebase usa Strings, Legacy usa Numbers
  category: 
    | 'Accesorios generales'
    | 'Accesorios de lujo'
    | 'Protección personal'
    | 'Parrillas y sliders'
    | 'Cascos y fundas'
    | 'Stickers resinados';
  name: string;
  price: number;
  stock: number; // Inventory count
  description: string[];
  imageBg: string; 
  color: string; 
  icon?: React.ReactNode; 
  image?: string; 
  badge?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerAddress: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'cancelled';
  date: any; // Firestore Timestamp
  paymentMethod: string;
}
