import React from 'react';
import { numberToWordsVN } from '../utils/numberToWords';

export default function QuotationPreview({ seller, buyer, quotationMeta, columns, items, totals }) {
  const visibleColumns = columns.filter(c => c.visible);

  return (
    <div className="w-full flex justify-center py-4 bg-slate-200/60 dark:bg-slate-950/80 rounded-2xl p-4 sm:p-6 overflow-x-auto">
      {/* Paper Sheet A4 Simulation */}
      <div 
        id="quotation-print-area"
        className="bg-white text-slate-900 shadow-2xl rounded-none w-[210mm] min-h-[297mm] p-[15mm] mx-auto text-xs font-sans leading-relaxed relative flex flex-col justify-between"
        style={{ boxSizing: 'border-box' }}
      >
        <div>
          {/* Header Section: Logo & Seller Info */}
          <div className="flex justify-between items-start border-b-2 border-blue-900 pb-4 mb-6">
            <div className="flex items-center space-x-4">
              {seller.logo ? (
                <img src={seller.logo} alt="Logo" className="max-h-16 max-w-[140px] object-contain" />
              ) : (
                <div className="w-16 h-16 bg-blue-900 text-white font-bold flex items-center justify-center rounded text-xl">
                  {seller.companyName ? seller.companyName.charAt(0) : 'BG'}
                </div>
              )}
              <div>
                <h1 className="text-base font-bold text-blue-950 uppercase tracking-wide">
                  {seller.companyName || 'CÔNG TY BÁO GIÁ'}
                </h1>
                <p className="text-[11px] text-slate-600">Địa chỉ: {seller.address}</p>
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
              <p className="text-[10px] text-slate-500 mt-1 font-mono">Mã: {quotationMeta.code}</p>
              <p className="text-[10px] text-slate-500 font-mono">Ngày: {quotationMeta.date}</p>
            </div>
          </div>

          {/* Quotation Big Title */}
          <div className="text-center my-6">
            <h2 className="text-2xl font-black text-blue-900 tracking-wider uppercase mb-1">
              BẢNG BÁO GIÁ SẢN PHẨM & DỊCH VỤ
            </h2>
            <p className="text-[11px] italic text-slate-500">
              (Hiệu lực trong vòng {quotationMeta.validDays || 30} ngày kể từ ngày lập)
            </p>
          </div>

          {/* Buyer Info Box */}
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 mb-6 grid grid-cols-2 gap-2 text-slate-800">
            <div>
              <p><span className="font-bold">Kính gửi:</span> {buyer.customerName || 'Quý khách hàng'}</p>
              <p><span className="font-bold">Đơn vị:</span> {buyer.companyName || '---'}</p>
            </div>
            <div>
              <p><span className="font-bold">Số điện thoại:</span> {buyer.phone || '---'}</p>
              <p><span className="font-bold">Địa chỉ:</span> {buyer.address || '---'}</p>
            </div>
          </div>

          {/* Main Table */}
          <table className="w-full border-collapse border border-slate-300 mb-6">
            <thead>
              <tr className="bg-blue-900 text-white text-[11px] font-bold uppercase">
                {visibleColumns.map(col => (
                  <th 
                    key={col.id}
                    style={{ width: col.width || 'auto' }}
                    className={`p-2 border border-blue-900 ${
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
                      className={`p-2 border border-slate-300 align-middle ${
                        col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'
                      }`}
                    >
                      {col.type === 'stt' && (idx + 1)}

                      {col.type === 'image' && (
                        <div className="flex justify-center">
                          {item[col.id] ? (
                            <img 
                              src={item[col.id]} 
                              alt="Item" 
                              className="w-12 h-12 object-contain rounded border border-slate-200 bg-white" 
                            />
                          ) : (
                            <span className="text-[10px] text-slate-300 italic">Không ảnh</span>
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
          <div className="flex justify-end mb-6">
            <div className="w-72 space-y-1 text-[11px]">
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

              <div className="flex justify-between py-1.5 border-b-2 border-blue-900 text-sm font-bold text-blue-900">
                <span>TỔNG THANH TOÁN:</span>
                <span className="font-mono">{totals.grandTotal.toLocaleString('vi-VN')} đ</span>
              </div>

              <p className="text-right text-[10px] italic font-semibold text-slate-600 pt-1">
                (Bằng chữ: {numberToWordsVN(totals.grandTotal)})
              </p>
            </div>
          </div>
        </div>

        {/* Footer & Signatures */}
        <div className="mt-8 pt-4 border-t border-slate-200">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="font-bold text-slate-900 uppercase">ĐẠI DIỆN KHÁCH HÀNG</p>
              <p className="text-[10px] italic text-slate-500 mb-12">(Ký, ghi rõ họ tên)</p>
              <p className="font-semibold text-slate-800">{buyer.customerName}</p>
            </div>
            <div>
              <p className="font-bold text-blue-900 uppercase">ĐẠI DIỆN BÊN BÁO GIÁ</p>
              <p className="text-[10px] italic text-slate-500 mb-12">(Ký, đóng dấu, ghi rõ họ tên)</p>
              <p className="font-semibold text-slate-800">{seller.companyName}</p>
            </div>
          </div>
          
          <div className="text-center text-[9px] text-slate-400 mt-6 pt-2 border-t border-slate-100">
            Báo giá được tạo tự động bởi Hệ thống Báo Giá Pro • Cảm ơn Quý khách hàng đã tin tưởng hợp tác!
          </div>
        </div>
      </div>
    </div>
  );
}
