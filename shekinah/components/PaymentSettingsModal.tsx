
import React, { useState, useEffect, useRef } from 'react';
import { XIcon, QrCodeIcon, CreditCardIcon } from './Icons';

interface PaymentSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PaymentSettingsModal: React.FC<PaymentSettingsModalProps> = ({ isOpen, onClose }) => {
  const [yapeQr, setYapeQr] = useState<string | null>(null);
  const [plinQr, setPlinQr] = useState<string | null>(null);
  const [cardLink, setCardLink] = useState<string>('');
  
  const yapeRef = useRef<HTMLInputElement>(null);
  const plinRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const savedYape = localStorage.getItem('qr_yape');
      const savedPlin = localStorage.getItem('qr_plin');
      const savedLink = localStorage.getItem('payment_link');
      if (savedYape) setYapeQr(savedYape);
      if (savedPlin) setPlinQr(savedPlin);
      if (savedLink) setCardLink(savedLink);
    }
  }, [isOpen]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'yape' | 'plin') => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) { 
        alert("La imagen es muy grande. Máximo 1MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (type === 'yape') setYapeQr(result);
        else setPlinQr(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (yapeQr) localStorage.setItem('qr_yape', yapeQr);
    if (plinQr) localStorage.setItem('qr_plin', plinQr);
    localStorage.setItem('payment_link', cardLink);
    alert("Configuración de pagos guardada exitosamente.");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-[70] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-scale">
        <div className="bg-gray-900 p-4 flex justify-between items-center">
          <h2 className="text-white font-bold uppercase tracking-wider flex items-center gap-2">
             <CreditCardIcon className="w-5 h-5 text-blue-400"/> Configurar Pagos
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
           
           {/* YAPE CONFIG */}
           <div className="space-y-2">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <QrCodeIcon className="w-4 h-4 text-purple-600"/> Código QR Yape
              </h3>
              <div 
                onClick={() => yapeRef.current?.click()}
                className="border-2 border-dashed border-purple-200 bg-purple-50 rounded-lg p-4 text-center cursor-pointer hover:border-purple-500 transition flex flex-col items-center"
              >
                  {yapeQr ? (
                      <img src={yapeQr} alt="QR Yape" className="h-32 object-contain rounded mb-2" />
                  ) : (
                      <span className="text-purple-400 text-sm font-medium">Subir QR de Yape</span>
                  )}
                  <input type="file" ref={yapeRef} onChange={(e) => handleImageUpload(e, 'yape')} className="hidden" accept="image/*"/>
              </div>
           </div>

           {/* PLIN CONFIG */}
           <div className="space-y-2">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <QrCodeIcon className="w-4 h-4 text-blue-500"/> Código QR Plin
              </h3>
              <div 
                onClick={() => plinRef.current?.click()}
                className="border-2 border-dashed border-blue-200 bg-blue-50 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 transition flex flex-col items-center"
              >
                  {plinQr ? (
                      <img src={plinQr} alt="QR Plin" className="h-32 object-contain rounded mb-2" />
                  ) : (
                      <span className="text-blue-400 text-sm font-medium">Subir QR de Plin</span>
                  )}
                  <input type="file" ref={plinRef} onChange={(e) => handleImageUpload(e, 'plin')} className="hidden" accept="image/*"/>
              </div>
           </div>

           {/* CARD LINK CONFIG */}
           <div className="space-y-2">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <CreditCardIcon className="w-4 h-4 text-green-600"/> Link de Pago (Tarjetas)
              </h3>
              <p className="text-xs text-gray-500">Pega aquí tu link de MercadoPago, Izipay o Culqi.</p>
              <input 
                type="url" 
                placeholder="https://link.mercadopago.com/..." 
                value={cardLink}
                onChange={(e) => setCardLink(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-blue-600 outline-none text-sm text-gray-900"
              />
           </div>

           <button 
             onClick={handleSave}
             className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition shadow-lg"
           >
             Guardar Configuración
           </button>

        </div>
      </div>
    </div>
  );
};

export default PaymentSettingsModal;
