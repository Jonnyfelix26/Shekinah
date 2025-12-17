
import React, { useState, useEffect, FormEvent, useRef } from 'react';
import type { Product } from '../types';
import { useProducts } from '../context/ProductContext';
import { XIcon, Trash2Icon } from './Icons';

interface AdminProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
}

const AdminProductModal: React.FC<AdminProductModalProps> = ({ isOpen, onClose, productToEdit }) => {
  const { addProduct, updateProduct, deleteProduct } = useProducts();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState<Product['category']>('Cascos y fundas');
  const [description, setDescription] = useState('');
  const [badge, setBadge] = useState('');
  
  // Image handling
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  
  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name);
      setPrice(productToEdit.price.toString());
      setStock(productToEdit.stock.toString());
      setCategory(productToEdit.category as Product['category']);
      setDescription(productToEdit.description.join('\n'));
      setBadge(productToEdit.badge || '');
      setImagePreview(productToEdit.image || null);
    } else {
      resetForm();
    }
  }, [productToEdit, isOpen]);

  const resetForm = () => {
    setName('');
    setPrice('');
    setStock('');
    setCategory('Cascos y fundas');
    setDescription('');
    setBadge('');
    setImagePreview(null);
    setImageFile(undefined);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Función para redimensionar imagen (Crucial para Firestore)
  const resizeImage = (file: File): Promise<{ base64: string, file: File }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          // Limite de tamaño seguro para Firestore (~800kb)
          const MAX_WIDTH = 600; 
          const MAX_HEIGHT = 600;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Comprimir a JPEG calidad 0.6 para ahorrar espacio en BD
          const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
          
          // Crear un nuevo File objeto desde el base64
          fetch(dataUrl)
            .then(res => res.blob())
            .then(blob => {
              const resizedFile = new File([blob], file.name, { type: 'image/jpeg' });
              resolve({ base64: dataUrl, file: resizedFile });
            });
        };
      };
    });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessingImage(true);
      try {
        const { base64, file: resizedFile } = await resizeImage(file);
        setImagePreview(base64);
        setImageFile(resizedFile);
      } catch (error) {
        console.error("Error procesando imagen", error);
        alert("Error al procesar la imagen.");
      } finally {
        setIsProcessingImage(false);
      }
    }
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (productToEdit && window.confirm(`¿Eliminar definitivamente "${productToEdit.name}"?`)) {
      setIsSubmitting(true); // Bloquear UI
      try {
         await deleteProduct(productToEdit.id);
         onClose(); // Cerrar solo si tuvo éxito
      } catch(err) {
         console.error(err);
         alert("Error al eliminar. Intenta de nuevo.");
      } finally {
         setIsSubmitting(false);
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const productData: any = {
      name,
      price: parseFloat(price),
      stock: parseInt(stock) || 0,
      category,
      description: description.split('\n').filter(line => line.trim() !== ''),
      // CRITICAL FIX: Firebase rejects 'undefined'. Use 'null' for empty values.
      badge: badge ? badge : null,
      color: 'gray-500', 
      imageBg: 'bg-white', 
      // If we have a file, we send null here (it's handled in context), otherwise send existing preview or null
      image: imageFile ? null : (imagePreview || null), 
    };

    try {
        if (productToEdit) {
            await updateProduct({ ...productToEdit, ...productData }, imageFile);
        } else {
            await addProduct(productData, imageFile);
        }
        resetForm();
        onClose();
    } catch (error) {
        console.error("Error en submit:", error);
        alert("No se pudo guardar. Verifica los datos e intenta nuevamente.");
    } finally {
        setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in-scale">
        <div className="bg-gray-900 p-4 flex justify-between items-center sticky top-0 z-10">
          <h2 className="text-white font-bold uppercase tracking-wider">
            {productToEdit ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-white">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Image Upload Section */}
          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 mb-2">Imagen del Producto</label>
            <div 
              className={`border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition relative group bg-gray-50 ${isProcessingImage ? 'opacity-50 pointer-events-none' : ''}`}
              onClick={() => fileInputRef.current?.click()}
            >
              {isProcessingImage ? (
                 <div className="py-8 text-gray-500 font-medium animate-pulse">Procesando imagen...</div>
              ) : imagePreview ? (
                <div className="relative h-40 w-full flex items-center justify-center overflow-hidden rounded">
                    <img src={imagePreview} alt="Preview" className="object-contain h-full max-w-full" />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        <span className="text-white font-bold">Cambiar Imagen</span>
                    </div>
                </div>
              ) : (
                <div className="py-8 text-gray-500">
                  <div className="mx-auto w-12 h-12 mb-2">📷</div>
                  <p className="text-sm">Click para subir foto</p>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                accept="image/*" 
                className="hidden" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Nombre del Producto</label>
            <input
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ej: Casco AGV K3"
              className="w-full px-3 py-2 border rounded focus:ring-1 focus:ring-blue-600 outline-none text-gray-900"
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <label className="block text-sm font-bold text-gray-700 mb-1">Precio (S/)</label>
              <input
                required
                type="number"
                step="0.01"
                value={price}
                onChange={e => setPrice(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:ring-1 focus:ring-blue-600 outline-none text-gray-900"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-bold text-gray-700 mb-1">Stock</label>
              <input
                required
                type="number"
                min="0"
                value={stock}
                onChange={e => setStock(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:ring-1 focus:ring-blue-600 outline-none text-gray-900"
              />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-bold text-gray-700 mb-1">Categoría</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 border rounded focus:ring-1 focus:ring-blue-600 outline-none bg-white text-gray-900"
              >
                <option value="Accesorios generales">Accesorios generales</option>
                <option value="Accesorios de lujo">Accesorios de lujo</option>
                <option value="Protección personal">Protección personal</option>
                <option value="Parrillas y sliders">Parrillas y sliders</option>
                <option value="Cascos y fundas">Cascos y fundas</option>
                <option value="Stickers resinados">Stickers resinados</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Etiqueta (Opcional)</label>
            <input
              placeholder="EJ: NUEVO, OFERTA"
              value={badge}
              onChange={e => setBadge(e.target.value)}
              className="w-full px-3 py-2 border rounded focus:ring-1 focus:ring-blue-600 outline-none text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Descripción</label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Material resistente&#10;Certificación DOT&#10;..."
              className="w-full px-3 py-2 border rounded focus:ring-1 focus:ring-blue-600 outline-none text-gray-900"
            />
          </div>

          <div className="pt-2 flex gap-3">
             {productToEdit && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  className="bg-red-700 hover:bg-red-800 text-white font-bold px-4 rounded transition uppercase tracking-widest shadow-lg flex items-center justify-center disabled:opacity-50"
                  title="Eliminar Producto"
                >
                   <Trash2Icon className="w-5 h-5 pointer-events-none" />
                </button>
             )}
            <button
              type="submit"
              disabled={isSubmitting || isProcessingImage}
              className="flex-grow bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition uppercase tracking-widest shadow-lg disabled:opacity-50 flex justify-center items-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Guardando...
                </>
              ) : (productToEdit ? 'Guardar Cambios' : 'Crear Producto')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProductModal;
