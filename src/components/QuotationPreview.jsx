import React from 'react';
import { Printer, Image as ImageIcon } from 'lucide-react';
import { numberToWordsVN } from '../utils/numberToWords';

export default function QuotationPreview({ 
  seller, 
  buyer, 
  quotationMeta, 
  columns, 
  items, 
  totals,
  onDirectPrint,
  onToggleImageColumn,
  isImageColumnVisible
}) {
  const visibleColumns = columns.filter(c => c.visible);

  // Dynamic calculation for column width percentages on A4
  const getColWidthPercent = (colId) => {
    const hasImage = visibleColumns.some(c => c.id === 'image');
    switch (colId) {
      case 'stt': return '6%';
      case 'image': return '10%';
      case 'code': return hasImage ? '11%' : '12%';
      case 'name': return hasImage ? '28%' : '34%';
      case 'unit': return '7%';
      case 'quantity': return hasImage ? '7%' : '8%';
      case 'price': return hasImage ? '13%' : '14%';
      case 'amount': return hasImage ? '13%' : '14%';
      case 'note': return hasImage ? '5%' : '5%';
      default: return 'auto';
    }
  };

  return (
    <div className="w-full flex flex-col items-center py-4 bg-slate-200/60 dark:bg-slate-950/80 rounded-2xl p-4 sm:p-6 overflow-x-auto">
      
      {/* Printable Preview Quick Actions (Hidden when printing) */}
      <div className="no-print w-full max-w-[210mm] mb-4 flex items-center justify-between flex-wrap gap-2 bg-white dark:bg-slate-900 p-3 rounded-xl shadow border border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            📄 Mẫu In Khổ A4 ({visibleColumns.length} cột)
          </span>
          {isImageColumnVisible ? (
            <span className="text-[10px] bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full font-semibold">
              Có cột Ảnh
            </span>
          ) : (
            <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full font-semibold">
              Tối ưu chiều rộng chữ (Không ảnh)
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {onToggleImageColumn && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onToggleImageColumn();
              }}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition flex items-center gap-1.5 cursor-pointer ${
                isImageColumnVisible
                  ? 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800 hover:bg-purple-100'
                  : 'bg-slate-50 hover:bg-purple-50 text-slate-700 hover:text-purple-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5 text-purple-500" />
              {isImageColumnVisible ? '✓ Ẩn cột ảnh' : '+ Thêm cột ảnh (Sau STT)'}
            </button>
          )}

          <button
            onClick={onDirectPrint || (() => window.print())}
            className="text-xs font-bold px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow transition flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            In Báo Giá (A4)
          </button>
        </div>
      </div>

      {/* Paper Sheet A4 Simulation - Top 6mm (flush to top), Sides 10mm */}
      <div 
        id="quotation-print-area"
        className="bg-white text-slate-900 shadow-2xl rounded-none w-[210mm] min-h-[297mm] px-[10mm] pt-[6mm] pb-[8mm] mx-auto text-xs font-sans leading-relaxed relative flex flex-col justify-between"
        style={{ boxSizing: 'border-box' }}
      >
        <div>
          {/* Header Section: Logo & Seller Info */}
          <div className="flex justify-between items-start border-b border-blue-900 pb-3 mb-4">
            <div className="flex items-center space-x-3">
              {/* Strict Fixed Logo Box (28mm x 21mm with rounded corners) */}
              {seller.logo ? (
                <div 
                  className="shrink-0 overflow-hidden bg-white flex items-center justify-center border border-slate-200 shadow-sm rounded-lg p-0.5"
                  style={{ width: '28mm', height: '21mm', borderRadius: '6px' }}
                >
                  <img 
                    src={seller.logo} 
                    alt="Logo" 
                    style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', borderRadius: '4px' }} 
                  />
                </div>
              ) : (
                <div 
                  className="bg-blue-900 text-white font-bold flex items-center justify-center rounded-lg text-base shrink-0 shadow-sm"
                  style={{ width: '28mm', height: '21mm', borderRadius: '6px' }}
                >
                  {seller.companyName ? seller.companyName.charAt(0) : 'BG'}
                </div>
              )}
              <div>
                <h1 className="text-sm font-bold text-blue-950 uppercase tracking-wide">
                  {seller.companyName || 'CÔNG TY BÁO GIÁ'}
                </h1>
                <p className="text-[10px] text-slate-600 mt-0.5 leading-tight">Địa chỉ: {seller.address}</p>
                <p className="text-[10px] text-slate-600 leading-tight">
                  Hotline: <span className="font-semibold">{seller.phone}</span> | Email: {seller.email}
                </p>
                {seller.taxId && <p className="text-[10px] text-slate-600 leading-tight">MST: {seller.taxId}</p>}
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block bg-blue-50 text-blue-900 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-200 uppercase tracking-wider">
                Bảng Báo Giá
              </span>
              <p className="text-[9.5px] text-slate-500 mt-1 font-mono">Mã: {quotationMeta.code}</p>
              <p className="text-[9.5px] text-slate-500 font-mono">Ngày: {quotationMeta.date}</p>
            </div>
          </div>

          {/* Quotation Title - Compact font, removed validity line */}
          <div className="text-center my-3">
            <h2 className="text-base font-extrabold text-blue-900 tracking-wide uppercase">
              BẢNG BÁO GIÁ SẢN PHẨM & DỊCH VỤ
            </h2>
          </div>

          {/* Buyer Info Box - Compact padding */}
          <div className="bg-slate-50 rounded-lg p-2.5 px-3 border border-slate-200 mb-4 grid grid-cols-2 gap-3 text-slate-800 text-[11px] leading-tight">
            <div className="space-y-0.5">
              <p><span className="font-bold">Kính gửi:</span> {buyer.customerName || 'Quý khách hàng'}</p>
              <p><span className="font-bold">Đơn vị:</span> {buyer.companyName || '---'}</p>
            </div>
            <div className="space-y-0.5">
              <p><span className="font-bold">Số điện thoại:</span> {buyer.phone || '---'}</p>
              <p><span className="font-bold">Địa chỉ:</span> {buyer.address || '---'}</p>
            </div>
          </div>

          {/* Main Table - Shrink to fit content (w-auto) with compact vertical margin */}
          <table 
            className="w-auto min-w-[60%] border-collapse mb-4 text-xs" style={{ border: '1.5px solid #334155' }}
          >
            <thead>
              <tr className="bg-blue-900 text-white text-[9px] font-bold uppercase">
                {visibleColumns.map(col => (
                  <th 
                    key={col.id}
                    className={`px-3 py-1 leading-tight whitespace-nowrap ${
                      col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'
                    }`}
                    style={{ border: '1.5px solid #1e3a8a' }}
                  >
                    {col.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                  {visibleColumns.map(col => (
                    <td 
                      key={col.id}
                      className={`px-3 py-1 align-middle text-[11.5px] font-medium leading-tight ${
                        col.type === 'name' ? 'break-words max-w-[220px]' : 'whitespace-nowrap'
                      } ${
                        col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'
                      }`}
                      style={{ border: '1px solid #475569' }}
                    >
                      {col.type === 'stt' && (idx + 1)}

                      {col.type === 'image' && (
                        <div className="flex justify-center px-1">
                          {item[col.id] ? (
                            <img 
                              src={item[col.id]} 
                              alt="Item" 
                              className="w-7 h-7 object-contain rounded border border-slate-200 bg-white" 
                            />
                          ) : (
                            <span className="text-[9.5px] text-slate-300 italic">Không ảnh</span>
                          )}
                        </div>
                      )}

                      {col.type === 'currency' && (
                        <span className="font-mono font-medium">
                          {(parseFloat(item[col.id]) || 0).toLocaleString('vi-VN')} đ
                        </span>
                      )}

                      {col.type === 'number' && (
                        <span className="font-mono font-medium">{item[col.id] || 0}</span>
                      )}

                      {col.type === 'text' && (item[col.id] || '')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals Summary - Compact Spacing */}
          <div className="flex justify-end mb-4">
            <div className="w-72 space-y-1 text-[11px]">
              <div className="flex justify-between py-0.5 border-b border-slate-200">
                <span className="font-semibold text-slate-600">Tổng tiền hàng:</span>
                <span className="font-mono font-bold text-slate-900">{totals.subtotal.toLocaleString('vi-VN')} đ</span>
              </div>

              {totals.discountAmount > 0 && (
                <div className="flex justify-between py-0.5 border-b border-slate-200 text-emerald-700">
                  <span>Chiết khấu ({totals.discountRate}%):</span>
                  <span className="font-mono font-bold">-{totals.discountAmount.toLocaleString('vi-VN')} đ</span>
                </div>
              )}

              {totals.vatAmount > 0 && (
                <div className="flex justify-between py-0.5 border-b border-slate-200">
                  <span className="text-slate-600">Thuế VAT ({totals.vatRate}%):</span>
                  <span className="font-mono font-bold">+{totals.vatAmount.toLocaleString('vi-VN')} đ</span>
                </div>
              )}

              <div className="flex justify-between py-1 border-b-2 border-blue-900 text-xs font-bold text-blue-900">
                <span>TỔNG THANH TOÁN:</span>
                <span className="font-mono text-sm">{totals.grandTotal.toLocaleString('vi-VN')} đ</span>
              </div>

              <p className="text-right text-[9.5px] italic font-semibold text-slate-600 pt-0.5">
                (Bằng chữ: {numberToWordsVN(totals.grandTotal)})
              </p>
            </div>
          </div>
        </div>

        {/* Footer & Signatures - Clean Blank Area for Manual Signature & Stamp */}
        <div className="mt-4 pt-2 border-t border-slate-200">
          <div className="grid grid-cols-2 gap-4 text-center text-xs">
            <div>
              <p className="font-bold text-slate-900 uppercase">ĐẠI DIỆN KHÁCH HÀNG</p>
              <p className="text-[9.5px] italic text-slate-500 mb-10">(Ký, ghi rõ họ tên)</p>
            </div>
            <div>
              <p className="font-bold text-blue-900 uppercase">ĐẠI DIỆN BÊN BÁO GIÁ</p>
              <p className="text-[9.5px] italic text-slate-500 mb-10">(Ký, đóng dấu, ghi rõ họ tên)</p>
            </div>
          </div>
          
          <div className="text-center text-[9.5px] text-slate-400 mt-4 pt-2 border-t border-slate-100">
            Cảm ơn Quý khách hàng đã tin tưởng hợp tác!
          </div>
        </div>
      </div>
    </div>
  );
}

