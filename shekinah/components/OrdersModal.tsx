
import React from 'react';
import { useProducts } from '../context/ProductContext';
import { XIcon, CheckIcon, Trash2Icon, DownloadIcon } from './Icons';
import type { Order } from '../types';

interface OrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OrdersModal: React.FC<OrdersModalProps> = ({ isOpen, onClose }) => {
  const { orders, updateOrderStatus, deleteOrder } = useProducts();

  if (!isOpen) return null;

  // Calcular totales
  const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  // Formatear fecha
  const formatDate = (dateInput: any) => {
    if (!dateInput) return '-';
    // Si es Timestamp de Firebase (tiene seconds)
    if (dateInput.seconds) {
      return new Date(dateInput.seconds * 1000).toLocaleDateString() + ' ' + new Date(dateInput.seconds * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }
    // Si es Date objeto o string
    return new Date(dateInput).toLocaleDateString();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid': return <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold">PAGADO</span>;
      case 'shipped': return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold">ENVIADO</span>;
      default: return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-bold">PENDIENTE</span>;
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
      if (window.confirm("¿Estás seguro de que deseas eliminar este pedido permanentemente?")) {
          try {
              await deleteOrder(orderId);
          } catch (error) {
              alert("Error al eliminar el pedido");
          }
      }
  };

  // Función para generar Excel (CSV) de la última semana
  const exportToExcel = () => {
    // 1. Filtrar pedidos de los últimos 7 días
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const filteredOrders = orders.filter(order => {
        let orderDate;
        if (order.date && order.date.seconds) {
            orderDate = new Date(order.date.seconds * 1000);
        } else {
            orderDate = new Date(order.date);
        }
        return orderDate >= sevenDaysAgo;
    });

    if (filteredOrders.length === 0) {
        alert("No hay ventas en los últimos 7 días para exportar.");
        return;
    }

    // 2. Crear cabeceras CSV
    const headers = ["ID Pedido", "Fecha", "Cliente", "Dirección", "Productos", "Total (S/)", "Método Pago", "Estado"];
    
    // 3. Mapear datos
    const rows = filteredOrders.map(order => {
        const dateStr = formatDate(order.date);
        // Formato: "2x Casco AGV | 1x Guantes"
        const itemsStr = order.items.map(i => `${i.quantity}x ${i.name}`).join(" | ");
        
        return [
            order.id,
            `"${dateStr}"`,
            `"${order.customerName}"`,
            `"${order.customerAddress}"`,
            `"${itemsStr}"`,
            order.total.toFixed(2),
            order.paymentMethod,
            order.status
        ].join(",");
    });

    // 4. Unir todo y crear Blob
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    
    // 5. Crear link fantasma y descargar
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Reporte_Semanal_Shekinah_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-[70] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-fade-in-scale">
        
        {/* Header */}
        <div className="bg-gray-900 p-4 flex justify-between items-center rounded-t-xl">
          <div>
            <h2 className="text-white font-bold uppercase tracking-wider text-lg">Gestión de Pedidos</h2>
            <p className="text-gray-400 text-xs">Historial de ventas en tiempo real</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Actions & Stats Bar */}
        <div className="bg-gray-50 p-4 border-b border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
           {/* Stats */}
           <div className="flex gap-4 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
                <div className="bg-white p-2 md:p-3 rounded shadow-sm border border-gray-200 min-w-[100px] text-center md:text-left">
                    <p className="text-[10px] text-gray-500 uppercase font-bold">Total Ventas</p>
                    <p className="text-lg md:text-xl font-black text-gray-900">{orders.length}</p>
                </div>
                <div className="bg-white p-2 md:p-3 rounded shadow-sm border border-gray-200 min-w-[100px] text-center md:text-left">
                    <p className="text-[10px] text-gray-500 uppercase font-bold">Ingresos</p>
                    <p className="text-lg md:text-xl font-black text-green-600">S/ {totalRevenue.toFixed(2)}</p>
                </div>
                <div className="bg-white p-2 md:p-3 rounded shadow-sm border border-gray-200 min-w-[100px] text-center md:text-left">
                    <p className="text-[10px] text-gray-500 uppercase font-bold">Pendientes</p>
                    <p className="text-lg md:text-xl font-black text-yellow-600">{pendingOrders}</p>
                </div>
           </div>

           {/* Export Button */}
           <button 
             onClick={exportToExcel}
             className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow flex items-center gap-2 font-bold text-sm transition-transform hover:scale-105 w-full md:w-auto justify-center"
           >
             <DownloadIcon className="w-5 h-5" />
             Descargar Reporte Semanal
           </button>
        </div>

        {/* Orders List */}
        <div className="flex-grow overflow-y-auto p-4 bg-gray-100">
          {orders.length === 0 ? (
             <div className="text-center py-20 opacity-50">
                <p className="text-4xl mb-2">📭</p>
                <p>No hay pedidos registrados aún.</p>
             </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg shadow border border-gray-200 p-4 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
                   
                   {/* Info Principal */}
                   <div className="flex-grow w-full">
                      <div className="flex items-center justify-between md:justify-start gap-2 mb-1">
                         <div className="flex gap-2 items-center">
                             <span className="font-mono text-xs text-gray-400">#{order.id.slice(-6)}</span>
                             <span className="text-xs text-gray-500">{formatDate(order.date)}</span>
                         </div>
                         {getStatusBadge(order.status)}
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg">{order.customerName}</h3>
                      <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
                         📍 {order.customerAddress}
                      </p>
                      
                      {/* Productos */}
                      <div className="bg-gray-50 p-2 rounded text-sm text-gray-700 border border-gray-100">
                         {order.items.map((item, idx) => (
                           <div key={idx} className="flex justify-between">
                              <span>{item.quantity}x {item.name}</span>
                              <span className="font-mono">S/ {(item.price * item.quantity).toFixed(2)}</span>
                           </div>
                         ))}
                         <div className="border-t border-gray-200 mt-1 pt-1 flex justify-between font-bold">
                            <span>TOTAL</span>
                            <span>S/ {order.total.toFixed(2)}</span>
                         </div>
                         <div className="text-xs text-gray-500 mt-1">
                            Pago vía: <span className="font-semibold uppercase">{order.paymentMethod}</span>
                         </div>
                      </div>
                   </div>

                   {/* Actions */}
                   <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto mt-2 md:mt-0">
                      {order.status === 'pending' && (
                        <button 
                          onClick={() => updateOrderStatus(order.id, 'paid')}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-xs font-bold uppercase shadow transition flex items-center justify-center gap-1 flex-grow md:w-40"
                        >
                          <CheckIcon className="w-4 h-4" /> Pagado
                        </button>
                      )}
                      {order.status === 'paid' && (
                        <button 
                          onClick={() => updateOrderStatus(order.id, 'shipped')}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-xs font-bold uppercase shadow transition flex items-center justify-center gap-1 flex-grow md:w-40"
                        >
                          🚚 Enviado
                        </button>
                      )}
                      
                      {/* Botón Eliminar Pedido */}
                      <button 
                        onClick={() => handleDeleteOrder(order.id)}
                        className="bg-red-100 hover:bg-red-200 text-red-700 border border-red-200 px-3 py-2 rounded text-xs font-bold uppercase shadow-sm transition flex items-center justify-center gap-1 flex-grow md:w-40"
                        title="Eliminar registro de pedido"
                      >
                         <Trash2Icon className="w-4 h-4" /> Eliminar
                      </button>
                   </div>

                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default OrdersModal;
