
import React, { useState } from 'react';
import { useProducts } from '../context/ProductContext';
import { CheckIcon, Trash2Icon, DownloadIcon, BanIcon } from './Icons';

const AdminDashboard: React.FC = () => {
  const { orders, updateOrderStatus, deleteOrder } = useProducts();
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Calcular totales
  const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((acc, order) => acc + order.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  // Formatear fecha de forma segura
  const formatDate = (dateInput: any) => {
    if (!dateInput) return '-';
    try {
        if (dateInput.seconds) {
            return new Date(dateInput.seconds * 1000).toLocaleDateString() + ' ' + new Date(dateInput.seconds * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        }
        return new Date(dateInput).toLocaleDateString();
    } catch (e) {
        return 'Fecha inválida';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid': return <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold border border-green-200">PAGADO</span>;
      case 'shipped': return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold border border-blue-200">ENVIADO</span>;
      case 'cancelled': return <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded text-xs font-bold border border-gray-300">CANCELADO</span>;
      default: return <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-bold border border-yellow-200">PENDIENTE</span>;
    }
  };

  const handleDeleteOrder = async (orderId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      
      if (window.confirm("🔴 ¿ELIMINAR DEFINITIVAMENTE?\n\nEsta acción borrará el pedido de la base de datos para siempre.\n\nSi solo quieres anularlo, usa el botón de 'Cancelar'.")) {
          setProcessingId(orderId);
          try {
              await deleteOrder(orderId);
          } catch (error: any) {
              console.error(error);
              if (error.code === 'permission-denied') {
                 alert("⛔ PERMISO DENEGADO\n\nTe faltan permisos en Firebase.\nAsegúrate de que tus reglas de Firestore incluyan 'delete' en la sección 'orders'.");
              } else {
                 alert("Error: " + error.message);
              }
          } finally {
              setProcessingId(null);
          }
      }
  };

  const handleCancelOrder = async (orderId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      
      if (window.confirm("¿Anular este pedido? Quedará registrado como 'Cancelado'.")) {
          setProcessingId(orderId);
          try {
              await updateOrderStatus(orderId, 'cancelled');
          } catch (error: any) {
              alert("Error al cancelar: " + error.message);
          } finally {
              setProcessingId(null);
          }
      }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: 'paid' | 'shipped', e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      setProcessingId(orderId);
      try {
          await updateOrderStatus(orderId, newStatus);
      } catch (error: any) {
          alert("Error al actualizar: " + error.message);
      } finally {
          setProcessingId(null);
      }
  }

  // GENERACIÓN DE REPORTE EXCEL CON FORMATO DE TABLA
  const exportToExcel = () => {
    if (orders.length === 0) {
        alert("No hay datos para exportar");
        return;
    }

    // Construimos una tabla HTML que Excel interpreta como hoja de cálculo real
    let tableContent = `
      <html xmlns:x="urn:schemas-microsoft-com:office:excel">
      <head>
        <meta http-equiv="content-type" content="text/html; charset=UTF-8"/>
        <style>
          body { font-family: Arial, sans-serif; }
          table { border-collapse: collapse; width: 100%; }
          th { background-color: #1e3a8a; color: white; border: 1px solid #000000; padding: 10px; text-align: center; font-weight: bold; font-size: 14px; }
          td { border: 1px solid #cccccc; padding: 8px; text-align: left; vertical-align: middle; font-size: 12px; }
          .text-center { text-align: center; }
          .money { text-align: right; font-weight: bold; color: #059669; }
          .status-paid { background-color: #dcfce7; color: #166534; font-weight: bold; text-align: center; }
          .status-pending { background-color: #fef9c3; color: #854d0e; font-weight: bold; text-align: center; }
          .status-cancelled { background-color: #f3f4f6; color: #374151; text-align: center; text-decoration: line-through; }
        </style>
      </head>
      <body>
        <h2 style="text-align: center; color: #1e3a8a;">Reporte de Ventas - Shekinah Motor's</h2>
        <br/>
        <table border="1">
          <thead>
            <tr>
              <th>ID Pedido</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Dirección</th>
              <th>Productos</th>
              <th>Método Pago</th>
              <th>Estado</th>
              <th>Total (S/)</th>
            </tr>
          </thead>
          <tbody>
    `;

    orders.forEach(order => {
        const dateStr = formatDate(order.date);
        // Formatear productos con saltos de línea HTML
        const itemsStr = order.items.map(i => `• ${i.quantity}x ${i.name}`).join("<br style='mso-data-placement:same-cell;' />");
        
        let estadoClass = 'status-pending';
        let estadoTexto = 'PENDIENTE';
        
        if (order.status === 'paid') { estadoClass = 'status-paid'; estadoTexto = 'PAGADO'; }
        if (order.status === 'shipped') { estadoClass = 'status-paid'; estadoTexto = 'ENVIADO'; }
        if (order.status === 'cancelled') { estadoClass = 'status-cancelled'; estadoTexto = 'CANCELADO'; }

        tableContent += `
            <tr>
              <td class="text-center" style="mso-number-format:'@'">${order.id}</td>
              <td class="text-center">${dateStr}</td>
              <td>${order.customerName}</td>
              <td>${order.customerAddress}</td>
              <td>${itemsStr}</td>
              <td class="text-center">${order.paymentMethod}</td>
              <td class="${estadoClass}">${estadoTexto}</td>
              <td class="money">${order.total.toFixed(2)}</td>
            </tr>
        `;
    });

    tableContent += `
          </tbody>
        </table>
      </body>
      </html>
    `;

    // Crear el Blob con tipo Excel
    const blob = new Blob([tableContent], { type: 'application/vnd.ms-excel' });
    const url = window.URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.href = url;
    // Usamos extensión .xls para que Excel detecte la tabla HTML automáticamente
    link.setAttribute("download", `Shekinah_Reporte_${new Date().toISOString().slice(0,10)}.xls`);
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <section className="bg-gray-100 border-b-4 border-blue-600 mb-8">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div>
                <h2 className="text-3xl font-black text-gray-900 uppercase italic">Panel de Administración</h2>
                <p className="text-gray-500">Resumen de ventas y gestión de pedidos.</p>
            </div>
            <button 
                type="button"
                onClick={exportToExcel}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded shadow-lg flex items-center gap-2 font-bold text-sm uppercase tracking-wider transition transform hover:scale-105"
            >
                <DownloadIcon className="w-5 h-5" /> Descargar Reporte Excel
            </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-600">
                <p className="text-xs font-bold text-gray-400 uppercase">Total Pedidos</p>
                <p className="text-4xl font-black text-gray-900">{orders.length}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                <p className="text-xs font-bold text-gray-400 uppercase">Ingresos (Neto)</p>
                <p className="text-4xl font-black text-green-600">S/ {totalRevenue.toFixed(2)}</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-500">
                <p className="text-xs font-bold text-gray-400 uppercase">Pendientes</p>
                <p className="text-4xl font-black text-yellow-600">{pendingOrders}</p>
            </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="p-4 bg-gray-900 text-white font-bold uppercase tracking-wider text-sm flex justify-between items-center">
                <span>Últimos Pedidos</span>
                <span className="text-gray-400 text-xs normal-case font-normal">Ordenado por más reciente</span>
            </div>
            <div className="overflow-x-auto">
                {orders.length === 0 ? (
                    <div className="p-12 text-center text-gray-400">
                        <p className="text-4xl mb-2">📭</p>
                        <p>No hay pedidos registrados.</p>
                    </div>
                ) : (
                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="bg-gray-50 text-xs text-gray-700 uppercase font-bold">
                            <tr>
                                <th className="px-6 py-3">ID / Fecha</th>
                                <th className="px-6 py-3">Cliente</th>
                                <th className="px-6 py-3">Total</th>
                                <th className="px-6 py-3">Estado</th>
                                <th className="px-6 py-3 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => (
                                <tr key={order.id} className={`border-b hover:bg-gray-50 transition ${order.status === 'cancelled' ? 'opacity-50 bg-gray-50' : ''}`}>
                                    <td className="px-6 py-4">
                                        <div className="font-mono font-bold text-gray-900">#{order.id.slice(-5)}</div>
                                        <div className="text-xs text-gray-500">{formatDate(order.date)}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-900">{order.customerName}</div>
                                        <div className="text-xs text-gray-500 truncate max-w-[150px]">{order.customerAddress}</div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-gray-900">
                                        S/ {order.total.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(order.status)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2 flex-wrap md:flex-nowrap">
                                            {/* Acciones de Estado */}
                                            {processingId === order.id ? (
                                                <span className="text-xs font-bold text-blue-600 animate-pulse px-4 py-2">Procesando...</span>
                                            ) : (
                                                <>
                                                    {order.status === 'pending' && (
                                                        <>
                                                            <button 
                                                                type="button"
                                                                onClick={(e) => handleStatusUpdate(order.id, 'paid', e)}
                                                                className="bg-green-100 hover:bg-green-200 text-green-700 p-2 rounded border border-green-300 transition"
                                                                title="Marcar Pagado"
                                                            >
                                                                <CheckIcon className="w-4 h-4" />
                                                            </button>
                                                            <button 
                                                                type="button"
                                                                onClick={(e) => handleCancelOrder(order.id, e)}
                                                                className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded border border-gray-300 transition"
                                                                title="Cancelar Pedido"
                                                            >
                                                                <BanIcon className="w-4 h-4" />
                                                            </button>
                                                        </>
                                                    )}
                                                    {order.status === 'paid' && (
                                                        <button 
                                                            type="button"
                                                            onClick={(e) => handleStatusUpdate(order.id, 'shipped', e)}
                                                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-xs font-bold uppercase shadow transition flex items-center justify-center gap-1"
                                                        >
                                                            🚚 Enviado
                                                        </button>
                                                    )}
                                                    
                                                    {/* Botón Eliminar Pedido (Siempre visible) */}
                                                    <button 
                                                        type="button"
                                                        onClick={(e) => handleDeleteOrder(order.id, e)}
                                                        className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 p-2 rounded transition flex items-center justify-center"
                                                        title="Eliminar definitivamente"
                                                    >
                                                        <Trash2Icon className="w-4 h-4 pointer-events-none" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;
