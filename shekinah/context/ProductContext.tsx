
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Product, CartItem, Order } from '../types';
import { db } from '../lib/firebase'; 
import { useAuth } from './AuthContext'; // Importar auth context
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  where,
  getDocs,
  serverTimestamp
} from 'firebase/firestore';

interface ProductContextType {
  products: Product[];
  orders: Order[];
  addProduct: (product: Omit<Product, 'id'>, imageFile?: File) => Promise<void>;
  updateProduct: (product: Product, imageFile?: File) => Promise<void>;
  deleteProduct: (id: number | string) => Promise<void>;
  purchaseItems: (items: CartItem[]) => Promise<void>;
  addOrder: (order: Omit<Order, 'id' | 'date'>) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  loading: boolean;
}

const ProductContext = createContext<ProductContextType>({
  products: [],
  orders: [],
  addProduct: async () => {},
  updateProduct: async () => {},
  deleteProduct: async () => {},
  purchaseItems: async () => {},
  addOrder: async () => {},
  updateOrderStatus: async () => {},
  deleteOrder: async () => {},
  loading: true,
});

export const useProducts = () => useContext(ProductContext);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { auth } = useAuth(); // Usar el estado de autenticación
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. CARGAR PRODUCTOS (PÚBLICO - SIEMPRE)
  useEffect(() => {
    const qProducts = query(collection(db, 'products')); 
    
    const unsubscribeProducts = onSnapshot(qProducts, (snapshot) => {
      const productsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          id: data.id, 
          firebaseDocId: doc.id 
        } as Product & { firebaseDocId: string };
      });
      // Ordenar en cliente para asegurar consistencia
      productsData.sort((a, b) => String(b.id).localeCompare(String(a.id)));
      setProducts(productsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching products:", error);
      setLoading(false);
    });

    return () => unsubscribeProducts();
  }, []);

  // 2. CARGAR PEDIDOS (SOLO ADMIN - REACTIVO)
  // Este efecto solo se activa cuando auth.role cambia a 'admin'. 
  // Esto evita bloqueos de carga iniciales para clientes normales.
  useEffect(() => {
    let unsubscribeOrders = () => {};

    if (auth.role === 'admin') {
      console.log("Rol Admin detectado: Iniciando suscripción a Pedidos...");
      const qOrders = query(collection(db, 'orders'));
      
      unsubscribeOrders = onSnapshot(qOrders, (snapshot) => {
        console.log("Actualización de pedidos recibida. Cantidad:", snapshot.docs.length);
        const ordersData = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        })) as Order[];
        
        // Ordenamos aquí: El más reciente primero
        ordersData.sort((a, b) => {
          const dateA = a.date?.seconds || 0;
          const dateB = b.date?.seconds || 0;
          return dateB - dateA;
        });

        setOrders(ordersData);
      }, (error) => {
        console.error("Error fetching orders (posiblemente permisos):", error);
      });
    } else {
      // Si no es admin, limpiamos los pedidos para seguridad y memoria
      setOrders([]);
    }

    return () => unsubscribeOrders();
  }, [auth.role]); // Dependencia clave: solo se ejecuta cuando cambia el rol

  // Helper para convertir imagen a Base64 (Texto) sin usar Storage
  const uploadImage = async (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = error => reject(error);
      });
  };

  // 2. AGREGAR PRODUCTO (Create)
  const addProduct = async (productData: Omit<Product, 'id'>, imageFile?: File) => {
    try {
      let imageUrl = productData.image;

      // Si hay archivo, lo convertimos a Base64 localmente
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const newId = `prod-${Date.now()}-${Math.floor(Math.random() * 1000)}`; // ID único string robusto

      // Se guarda directo en la colección 'products'
      await addDoc(collection(db, 'products'), {
        ...productData,
        id: newId,
        image: imageUrl || null,
        createdAt: serverTimestamp()
      });
    } catch (error: any) {
      console.error("Error adding product:", error);
      throw error;
    }
  };

  // 3. ACTUALIZAR PRODUCTO (Update)
  const updateProduct = async (updatedProduct: Product, imageFile?: File) => {
    try {
      const productInState = products.find(p => String(p.id) === String(updatedProduct.id)) as (Product & { firebaseDocId?: string });
      
      if (!productInState?.firebaseDocId) {
        throw new Error("No se encontró el ID del documento en Firebase");
      }

      let imageUrl = updatedProduct.image;

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const productRef = doc(db, 'products', productInState.firebaseDocId);
      await updateDoc(productRef, {
        ...updatedProduct,
        image: imageUrl,
      });

    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  };

  // 4. ELIMINAR PRODUCTO (Delete - Método Robusto)
  const deleteProduct = async (id: number | string) => {
    try {
      console.log("Iniciando eliminación para ID:", id);
      
      let firebaseDocId = (products.find(p => String(p.id) === String(id)) as any)?.firebaseDocId;

      if (!firebaseDocId) {
          console.log("No encontrado en local, buscando en Firestore...");
          const q = query(collection(db, 'products'), where('id', '==', id));
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
              firebaseDocId = querySnapshot.docs[0].id;
          } else {
              const qNum = query(collection(db, 'products'), where('id', '==', Number(id)));
              const querySnapshotNum = await getDocs(qNum);
              if (!querySnapshotNum.empty) {
                  firebaseDocId = querySnapshotNum.docs[0].id;
              }
          }
      }

      if (!firebaseDocId) {
        throw new Error(`No se encontró ningún producto con el ID: ${id}`);
      }

      await deleteDoc(doc(db, 'products', firebaseDocId));
      console.log("Producto eliminado exitosamente de Firestore");

    } catch (error) {
      console.error("Error crítico eliminando producto:", error);
      alert("Hubo un error al intentar eliminar. Revisa la consola.");
      throw error;
    }
  };

  // 5. DESCONTAR STOCK
  const purchaseItems = async (items: CartItem[]) => {
    try {
      console.log("Iniciando descuento de stock...");
      for (const item of items) {
        const productInState = products.find(p => String(p.id) === String(item.id)) as (Product & { firebaseDocId?: string });
        
        if (productInState?.firebaseDocId) {
          const newStock = Math.max(0, productInState.stock - item.quantity);
          const productRef = doc(db, 'products', productInState.firebaseDocId);
          await updateDoc(productRef, { stock: newStock });
        }
      }
    } catch (error) {
      console.error("Error al descontar stock:", error);
      throw error;
    }
  };

  // 6. AGREGAR PEDIDO (Orders)
  const addOrder = async (orderData: Omit<Order, 'id' | 'date'>) => {
    try {
      await addDoc(collection(db, 'orders'), {
        ...orderData,
        date: serverTimestamp(), 
      });
      console.log("Pedido guardado exitosamente en Firebase");
    } catch (error) {
      console.error("Error creando pedido en Firebase:", error);
      throw error;
    }
  };

  // 7. ACTUALIZAR ESTADO DE PEDIDO
  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status });
    } catch (error) {
      console.error("Error actualizando pedido:", error);
      throw error;
    }
  };

  // 8. ELIMINAR PEDIDO
  const deleteOrder = async (orderId: string) => {
    try {
      await deleteDoc(doc(db, 'orders', orderId));
    } catch (error) {
      console.error("Error eliminando pedido:", error);
      throw error;
    }
  };

  return (
    <ProductContext.Provider value={{ 
      products, 
      orders, 
      addProduct, 
      updateProduct, 
      deleteProduct, 
      purchaseItems, 
      addOrder, 
      updateOrderStatus,
      deleteOrder,
      loading 
    }}>
      {children}
    </ProductContext.Provider>
  );
};
