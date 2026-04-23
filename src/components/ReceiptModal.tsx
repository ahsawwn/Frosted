import React, { useRef } from 'react';
import { X, Download, Printer } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ReceiptModal = ({ isOpen, onClose, orderData }: any) => {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Oftsy_Order`,
  });

  if (!isOpen || !orderData) return null;

  const downloadPDF = async () => {
    if (!componentRef.current) return;
    const canvas = await html2canvas(componentRef.current, { scale: 3 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ format: [80, 180], unit: 'mm' });
    pdf.addImage(imgData, 'PNG', 4, 0, 72, 0); 
    pdf.save(`Oftsy-Receipt.pdf`);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4">
      {/* FORCE STRICT BLACK & WHITE FOR PRINTING */}
      <style>{`
        @media print {
          @page { 
            size: 80mm auto; 
            margin: 0mm !important; 
          }
          body { 
            margin: 0 !important; 
            padding: 0 !important; 
            background: white !important;
            -webkit-print-color-adjust: exact;
          }
          /* Ensure everything in the print ref is pure black */
          #print-area, #print-area * {
            color: #000000 !important;
            border-color: #000000 !important;
            background-color: transparent !important;
          }
        }
      `}</style>

      <div className="bg-white w-full max-w-[380px] rounded-[2.5rem] shadow-2xl overflow-hidden">
        <div className="flex justify-between items-center p-5 border-b border-slate-50 no-print">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Order Successful</span>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={18} /></button>
        </div>

        {/* Scrollable Preview Area */}
        <div className="p-4 bg-slate-100 overflow-y-auto max-h-[60vh]">
          {/* THE RECEIPT TARGET */}
          <div 
            ref={componentRef}
            id="print-area"
            className="bg-white mx-auto"
            style={{ 
              width: '80mm', 
              padding: '10mm 7mm', // 7mm side padding = 66mm content width (Very safe for 72mm hardware)
              boxSizing: 'border-box',
              color: '#000000',
              // Use a system font stack that is consistent across browsers and printers
              fontFamily: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace',
              fontSize: '11px',
              lineHeight: '1.4'
            }}
          >
            {/* Header */}
            <div className="text-center mb-6">
              <h2 style={{ fontSize: '24px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '2px', letterSpacing: '-1px' }}>Oftsy</h2>
              <p style={{ fontSize: '9px', fontWeight: 'bold', letterSpacing: '2px' }}>PREMIUM SOLUTIONS</p>
              
              <div style={{ borderTop: '1.5px solid #000', borderBottom: '1.5px solid #000', margin: '15px 0', padding: '8px 0', fontSize: '10px', fontWeight: 'bold' }}>
                <p>SARAI ALAMGIR, GUJRAT</p>
                <p style={{ marginTop: '4px' }}>{new Date().toLocaleString('en-PK', { dateStyle: 'short', timeStyle: 'short' })}</p>
                  {/* DUPLICATE INDICATOR */}
    {orderData.isDuplicate && (
      <p style={{ 
        marginTop: '8px', 
        fontSize: '11px', 
        border: '1px solid #000', 
        display: 'inline-block', 
        padding: '2px 8px',
        textTransform: 'uppercase' 
      }}>
        ** Duplicate Receipt **
      </p>
    )}
              </div>
            </div>

            {/* Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '15px' }}>
              <thead>
                <tr style={{ borderBottom: '1.5px solid #000' }}>
                  <th style={{ textAlign: 'left', paddingBottom: '4px', fontSize: '10px' }}>DESCRIPTION</th>
                  <th style={{ textAlign: 'right', paddingBottom: '4px', fontSize: '10px' }}>TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {orderData.items.map((item: any, idx: number) => (
                  <tr key={idx}>
                    <td style={{ padding: '6px 0', verticalAlign: 'top' }}>
                      <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>{item.name}</span><br/>
                      <span style={{ fontSize: '10px' }}>{item.quantity} x {Math.round(item.price)}</span>
                    </td>
                    <td style={{ textAlign: 'right', padding: '6px 0', verticalAlign: 'top', fontWeight: 'bold' }}>
                      ₨{Math.round(item.price * item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div style={{ borderTop: '1px dashed #000', paddingTop: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>SUBTOTAL:</span>
                <span style={{ fontWeight: 'bold' }}>₨{Math.round(orderData.subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>GST ({orderData.paymentMethod === 'CARD' ? '5%' : '15%'}):</span>
                <span style={{ fontWeight: 'bold' }}>₨{Math.round(orderData.taxAmount)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '900', borderTop: '1.5px solid #000', marginTop: '8px', paddingTop: '8px' }}>
                <span>TOTAL:</span>
                <span>₨{Math.round(orderData.totalAmount)}</span>
              </div>
            </div>

            {/* Footer */}
            <div style={{ marginTop: '30px', textAlign: 'center' }}>
              <p style={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '10px' }}>PAID VIA {orderData.paymentMethod}</p>
              <p style={{ fontSize: '9px', marginTop: '10px', fontWeight: 'bold' }}>*** THANK YOU FOR VISITING ***</p>
              <p style={{ fontSize: '8px', marginTop: '15px', opacity: '0.6' }}>OFTSY SYSTEMS (SMC-PVT) LTD</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 grid grid-cols-2 gap-4 bg-white border-t border-slate-50 no-print">
          <button 
            onClick={downloadPDF} 
            className="bg-slate-50 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-all"
          >
            Save PDF
          </button>
          <button 
            onClick={() => handlePrint()} 
            className="bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2"
          >
            <Printer size={16} /> Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;