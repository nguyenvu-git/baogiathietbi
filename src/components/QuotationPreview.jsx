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

      {/* Paper Sheet A4 Simulation */}
      <div 
        id="quotation-print-area"
        className="bg-white text-slate-900 shadow-2xl rounded-none w-[210mm] min-h-[297mm] p-[16mm] mx-auto text-xs font-sans leading-relaxed relative flex flex-col justify-between"
        style={{ boxSizing: 'border-box' }}
      >
        <div>
          {/* Header Section: Logo & Seller Info */}
          <div className="flex justify-between items-start border-b-2 border-blue-900 pb-6 mb-10">
            <div className="flex items-center space-x-4">
              {/* Strict Fixed Logo Box (32mm x 24mm with rounded corners) */}
              {seller.logo ? (
                <div 
                  className="shrink-0 overflow-hidden bg-white flex items-center justify-center border border-slate-200 shadow-sm rounded-xl p-1"
                  style={{ width: '32mm', height: '24mm', borderRadius: '10px' }}
                >
                  <img 
                    src={seller.logo} 
                    alt="Logo" 
                    style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', borderRadius: '6px' }} 
                  />
                </div>
              ) : (
                <div 
                  className="bg-blue-900 text-white font-bold flex items-center justify-center rounded-xl text-lg shrink-0 shadow-sm"
                  style={{ width: '32mm', height: '24mm', borderRadius: '10px' }}
                >
                  {seller.companyName ? seller.companyName.charAt(0) : 'BG'}
                </div>
              )}
              <div>
                <h1 className="text-base font-bold text-blue-950 uppercase tracking-wide">
                  {seller.companyName || 'CÔNG TY BÁO GIÁ'}
                </h1>
                <p className="text-[11px] text-slate-600 mt-0.5">Địa chỉ: {seller.address}</p>
                <p className="text-[11px] text-slate-600">
                  Hotline: <span className="font-semibold">{seller.phone}</span> | Email: {seller.email}
                </p>
                {seller.taxId && <p className="text-[11px] text-slate-600">MST: {seller.taxId}</p>}
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block bg-blue-50 text-blue-900 text-xs font-bold px-3 py-1 rounded border border-blue-200 uppercase tracking-wider">
                Bảng Báo Giá
              </span>
              <p className="text-[10px] text-slate-500 mt-1.5 font-mono">Mã: {quotationMeta.code}</p>
              <p className="text-[10px] text-slate-500 font-mono">Ngày: {quotationMeta.date}</p>
            </div>
          </div>

          {/* Quotation Title */}
          <div className="text-center my-10">
            <h2 className="text-xl font-black text-blue-900 tracking-wider uppercase mb-2">
              BẢNG BÁO GIÁ SẢN PHẨM & DỊCH VỤ
            </h2>
            <p className="text-[11px] italic text-slate-500">
              (Hiệu lực trong vòng {quotationMeta.validDays || 30} ngày kể từ ngày lập)
            </p>
          </div>

          {/* Buyer Info Box */}
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 mb-10 grid grid-cols-2 gap-4 text-slate-800 text-xs">
            <div className="space-y-1">
              <p><span className="font-bold">Kính gửi:</span> {buyer.customerName || 'Quý khách hàng'}</p>
              <p><span className="font-bold">Đơn vị:</span> {buyer.companyName || '---'}</p>
            </div>
            <div className="space-y-1">
              <p><span className="font-bold">Số điện thoại:</span> {buyer.phone || '---'}</p>
              <p><span className="font-bold">Địa chỉ:</span> {buyer.address || '---'}</p>
            </div>
          </div>

          {/* Main Table - Shrink to fit content (w-auto) with comfortable px-3 padding */}
          <table 
            className="w-auto min-w-[60%] border-collapse border border-slate-300 mb-10 text-xs"
          >
            <thead>
              <tr className="bg-blue-900 text-white text-[11px] font-bold uppercase">
                {visibleColumns.map(col => (
                  <th 
                    key={col.id}
                    className={`px-3 py-1 border border-blue-900 leading-tight whitespace-nowrap ${
                      col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'
                    }`}
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
                      className={`px-3 py-1 border border-slate-300 align-middle text-[11.5px] leading-tight ${
                        col.type === 'name' ? 'break-words max-w-[220px]' : 'whitespace-nowrap'
                      } ${
                        col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'
                      }`}
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

          {/* Totals Summary */}
          <div className="flex justify-end mb-8">
            <div className="w-80 space-y-1.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="font-semibold text-slate-600">Tổng tiền hàng:</span>
                <span className="font-mono font-bold text-slate-900">{totals.subtotal.toLocaleString('vi-VN')} đ</span>
              </div>

              {totals.discountAmount > 0 && (
                <div className="flex justify-between py-1 border-b border-slate-200 text-emerald-700">
                  <span>Chiết khấu ({totals.discountRate}%):</span>
                  <span className="font-mono font-bold">-{totals.discountAmount.toLocaleString('vi-VN')} đ</span>
                </div>
              )}

              {totals.vatAmount > 0 && (
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-600">Thuế VAT ({totals.vatRate}%):</span>
                  <span className="font-mono font-bold">+{totals.vatAmount.toLocaleString('vi-VN')} đ</span>
                </div>
              )}

              <div className="flex justify-between py-2 border-b-2 border-blue-900 text-sm font-bold text-blue-900">
                <span>TỔNG THANH TOÁN:</span>
                <span className="font-mono text-base">{totals.grandTotal.toLocaleString('vi-VN')} đ</span>
              </div>

              <p className="text-right text-[10.5px] italic font-semibold text-slate-600 pt-1">
                (Bằng chữ: {numberToWordsVN(totals.grandTotal)})
              </p>
            </div>
          </div>
        </div>

        {/* Footer & Signatures */}
        <div className="mt-8 pt-4 border-t border-slate-200">
          <div className="grid grid-cols-2 gap-6 text-center">
            <div>
              <p className="font-bold text-slate-900 uppercase">ĐẠI DIỆN KHÁCH HÀNG</p>
              <p className="text-[10px] italic text-slate-500 mb-14">(Ký, ghi rõ họ tên)</p>
              <p className="font-semibold text-slate-800">{buyer.customerName}</p>
            </div>
            <div>
              <p className="font-bold text-blue-900 uppercase">ĐẠI DIỆN BÊN BÁO GIÁ</p>
              <p className="text-[10px] italic text-slate-500 mb-14">(Ký, đóng dấu, ghi rõ họ tên)</p>
              <p className="font-semibold text-slate-800">{seller.companyName}</p>
            </div>
          </div>
          
          <div className="text-center text-[9.5px] text-slate-400 mt-6 pt-3 border-t border-slate-100">
            Báo giá được tạo tự động bởi Hệ thống Báo Giá Pro • Cảm ơn Quý khách hàng đã tin tưởng hợp tác!
          </div>
        </div>
      </div>
    </div>
  );
}

