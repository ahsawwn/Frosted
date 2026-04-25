import { useRef } from 'react';
import { X, Printer, FileText, Share2, Sparkles, CheckCircle2 } from 'lucide-react';
import { useReactToPrint } from 'react-to-print';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { QRCodeSVG } from 'qrcode.react';

const ReceiptModal = ({ isOpen, onClose, orderData }: any) => {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Oftsy_Invoice_${orderData?.id?.slice(-6)}`,
    pageStyle: `
      @page { size: 72mm auto; margin: 0; } 
      @media print { 
        body { 
          margin: 0 !important; 
          padding: 0 !important; 
          display: flex !important; 
          justify-content: center !important; 
          background: #fff !important;
          -webkit-print-color-adjust: exact;
        } 
        #print-area { 
          width: 72mm !important; 
          margin: 0 auto !important; 
          padding: 5mm !important; 
          display: block !important;
          box-shadow: none !important;
        } 
      }
    `,
  });

  if (!isOpen || !orderData) return null;

  const downloadPDF = async () => {
    if (!componentRef.current) return;
    const canvas = await html2canvas(componentRef.current, { scale: 3, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ format: [72, 200], unit: 'mm' });
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight); 
    pdf.save(`Oftsy-Invoice-${orderData.id.slice(-4)}.pdf`);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#0a0a0b]/90 backdrop-blur-xl p-4 animate-in fade-in duration-500 font-lexend">
      
      <div className="bg-surface w-full max-w-lg rounded-[2.5rem] shadow-glow overflow-hidden flex flex-col border-2 border-brand/20 relative max-h-[95vh]">
        <div className="absolute top-0 left-0 w-full h-[400px] bg-gradient-to-b from-brand/5 to-transparent pointer-events-none" />
        
        <div className="flex justify-between items-center p-6 border-b border-white/5 relative z-10 shrink-0">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center text-white shadow-glow">
                 <CheckCircle2 size={20} />
              </div>
              <div>
                 <h2 className="text-xl font-black text-text-main uppercase tracking-tighter italic leading-none">Receipt</h2>
                 <p className="text-[8px] font-black text-text-muted uppercase tracking-[0.4em] mt-1">Order Completed</p>
              </div>
           </div>
           <button onClick={onClose} className="p-3 bg-panel rounded-xl text-text-muted hover:text-brand transition-all border-2 border-border-oftsy">
              <X size={20} />
           </button>
        </div>

        {/* Scrollable Preview Area */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-6 bg-panel/30 relative z-10">
          <div className="flex justify-center mb-6">
             <div className="px-6 py-2 bg-emerald-500/10 border-2 border-emerald-500/20 rounded-full text-emerald-500 text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                <Sparkles size={12} /> Status: Validated
             </div>
          </div>

          {/* THE RECEIPT TARGET (Industrial Thermal Mockup) */}
          <div className="flex justify-center w-full">
            <div 
              ref={componentRef}
              id="print-area"
              className="bg-white text-black shrink-0"
              style={{ 
                width: '76mm', 
                padding: '10mm 0',
                boxSizing: 'border-box',
                fontFamily: 'monospace',
                fontSize: '11px',
                lineHeight: '1.1',
                color: '#000'
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                 <h1 style={{ margin: '0', fontSize: '24px', fontWeight: '900', letterSpacing: '-1.5px', textTransform: 'uppercase', color: '#000' }}>Oftsy</h1>
                 <p style={{ margin: '0', fontSize: '9px', fontWeight: 'bold', letterSpacing: '2px', color: '#000' }}>CREAMERY & BAKERY</p>
                 <div style={{ borderTop: '1.5px solid #000', borderBottom: '1.5px solid #000', margin: '12px 0', padding: '8px 0', fontSize: '9px', fontWeight: 'bold', color: '#000' }}>
                    <p>TERMINAL: K-ALPHA-9821</p>
                    <p style={{ marginTop: '3px' }}>{new Date().toLocaleString()}</p>
                    <p style={{ marginTop: '3px' }}>OPERATOR: {JSON.parse(localStorage.getItem('user') || '{}').username?.toUpperCase() || 'SYSTEM'}</p>
                    {orderData.customer && (
                      <div style={{ marginTop: '6px', border: '1.5px solid #000', padding: '1px 4px', display: 'inline-block' }}>CUSTOMER: {orderData.customer.name.toUpperCase()}</div>
                    )}
                 </div>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '15px' }}>
                 <thead>
                    <tr style={{ borderBottom: '2px solid #000' }}>
                       <th style={{ textAlign: 'left', paddingBottom: '4px', fontSize: '9px', fontWeight: '900', color: '#000' }}>DESCRIPTION</th>
                       <th style={{ textAlign: 'right', paddingBottom: '4px', fontSize: '9px', fontWeight: '900', color: '#000' }}>TOTAL</th>
                    </tr>
                 </thead>
                 <tbody>
                    {orderData.items.map((item: any, idx: number) => (
                      <tr key={idx} style={{ borderBottom: '1px dashed #000' }}>
                         <td style={{ padding: '6px 0', verticalAlign: 'top' }}>
                            <span style={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '10px' }}>{item.name}</span><br/>
                            <span style={{ fontSize: '9px' }}>{item.quantity} x PKR {item.price}</span>
                         </td>
                         <td style={{ textAlign: 'right', padding: '6px 0', verticalAlign: 'top', fontWeight: 'bold', fontSize: '10px' }}>
                            PKR {item.quantity * item.price}
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>

              <div style={{ borderTop: '2px solid #000', paddingTop: '10px' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '10px' }}>
                    <span>Subtotal:</span>
                    <span style={{ fontWeight: 'bold' }}>PKR {Math.round(orderData.subtotal)}</span>
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '10px' }}>
                    <span>Tax:</span>
                    <span style={{ fontWeight: 'bold' }}>PKR {Math.round(orderData.taxAmount)}</span>
                 </div>
                 {orderData.discount > 0 && (
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '10px' }}>
                      <span>Discount:</span>
                      <span style={{ fontWeight: 'bold' }}>-PKR {Math.round(orderData.discount)}</span>
                   </div>
                 )}
                 <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: '900', borderTop: '2.5px solid #000', marginTop: '8px', paddingTop: '8px' }}>
                    <span>Total:</span>
                    <span>PKR {Math.round(orderData.totalAmount)}</span>
                 </div>
              </div>

              <div style={{ marginTop: '30px', textAlign: 'center', borderTop: '1px solid #000', paddingTop: '10px' }}>
                 <p style={{ fontWeight: 'bold', fontSize: '9px', textAlign: 'center' }}>*** PAID VIA {orderData.paymentMethod} ***</p>
                 
                 {orderData.estimatedTime && (
                   <div style={{ borderTop: '2px solid #000', marginTop: '10px', paddingTop: '10px', textAlign: 'center' }}>
                     <p style={{ fontSize: '8px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '2px' }}>Estimated Ready At</p>
                     <p style={{ fontSize: '13px', fontWeight: '900' }}>{new Date(orderData.estimatedTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                   </div>
                 )}

                 <div style={{ margin: '15px 0', display: 'flex', justifyContent: 'center' }}>
                    <QRCodeSVG 
                      value={`https://oftsy.io/track/${orderData.id}`}
                      size={60}
                      level="M"
                      includeMargin={false}
                    />
                 </div>

                 <div style={{ margin: '15px 0', fontSize: '8px', textAlign: 'center' }}>
                    <p style={{ margin: '0' }}>ORDER: {orderData.id.toUpperCase()}</p>
                    <p style={{ margin: '4px 0 0' }}>POINTS: +{Math.floor(orderData.totalAmount / 100)}</p>
                 </div>
                 
                 <p style={{ fontSize: '10px', fontWeight: '900', letterSpacing: '2px', margin: '15px 0 0' }}>O F T S Y</p>
                 <p style={{ fontSize: '8px', marginTop: '5px' }}>THANK YOU FOR YOUR PATRONAGE</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions HUD */}
        <div className="p-5 bg-surface border-t border-white/5 grid grid-cols-3 gap-4 shrink-0 relative z-10">
          <button onClick={downloadPDF} className="flex flex-col items-center gap-2 p-4 bg-panel rounded-[1.5rem] border-2 border-border-oftsy hover:bg-surface hover:border-brand transition-all group">
             <FileText className="text-text-muted group-hover:text-brand" size={20} />
             <span className="text-[8px] font-black uppercase tracking-widest text-text-muted group-hover:text-text-main">Save PDF</span>
          </button>
          <button className="flex flex-col items-center gap-2 p-4 bg-panel rounded-[1.5rem] border-2 border-border-oftsy hover:bg-surface hover:border-brand transition-all group">
             <Share2 className="text-text-muted group-hover:text-brand" size={20} />
             <span className="text-[8px] font-black uppercase tracking-widest text-text-muted group-hover:text-text-main">Share</span>
          </button>
          <button onClick={() => handlePrint()} className="flex flex-col items-center gap-2 p-4 bg-brand rounded-[1.5rem] shadow-glow hover:brightness-110 transition-all group">
             <Printer className="text-white" size={20} />
             <span className="text-[8px] font-black uppercase tracking-widest text-white">Print</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptModal;