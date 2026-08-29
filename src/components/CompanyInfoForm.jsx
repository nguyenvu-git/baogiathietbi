import React, { useState } from 'react';
import { Building2, UserCheck, FileBadge, Upload, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

export default function CompanyInfoForm({ seller, setSeller, buyer, setBuyer, quotationMeta, setQuotationMeta }) {
  const [collapsed, setCollapsed] = useState(false);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          // Standardize logo image resolution using HTML5 Canvas
          const MAX_WIDTH = 400;
          const MAX_HEIGHT = 200;
          let width = img.width;
          let height = img.height;

          if (width > MAX_WIDTH || height > MAX_HEIGHT) {
            if (width / height > MAX_WIDTH / MAX_HEIGHT) {
              height = Math.round((height * MAX_WIDTH) / width);
              width = MAX_WIDTH;
            } else {
              width = Math.round((width * MAX_HEIGHT) / height);
              height = MAX_HEIGHT;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const resizedDataUrl = canvas.toDataURL(file.type || 'image/png', 0.9);
          setSeller({ ...seller, logo: resizedDataUrl });
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors duration-200 overflow-hidden mb-6">
      
      {/* Card Header with Collapse Toggle */}
      <div 
        onClick={() => setCollapsed(!collapsed)}
        className="px-6 py-4 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white text-base">Thông Tin Bên Báo Giá & Khách Hàng</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Nhập logo, tên công ty, thông tin người mua và thông số báo giá</p>
          </div>
        </div>
        <button type="button" className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
          {collapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
        </button>
      </div>

      {!collapsed && (
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Column 1: Bên Bán (Seller Info + Logo) */}
          <div className="space-y-4 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 pb-6 lg:pb-0 lg:pr-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                <Building2 className="w-4 h-4" /> Đơn Vị Báo Giá (Bên Bán)
              </h3>
            </div>

            {/* Logo Upload Box (Fixed 112px x 64px Box) */}
            <div className="flex items-center gap-4">
              <div className="relative w-28 h-16 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex flex-col items-center justify-center text-center overflow-hidden group shrink-0">
                {seller.logo ? (
                  <>
                    <img src={seller.logo} alt="Company Logo" className="w-full h-full object-contain p-1.5" />
                    <button
                      type="button"
                      onClick={() => setSeller({ ...seller, logo: null })}
                      className="absolute inset-0 bg-slate-900/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer"
                      title="Xóa logo"
                    >
                      <Trash2 className="w-5 h-5 text-rose-400" />
                    </button>
                  </>
                ) : (
                  <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center p-1 text-slate-400 hover:text-blue-500 transition">
                    <Upload className="w-5 h-5 mb-0.5" />
                    <span className="text-[10px] font-medium">Tải Logo</span>
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                  </label>
                )}
              </div>
              <div className="flex-1 text-xs text-slate-500 dark:text-slate-400 space-y-1">
                <p className="font-semibold text-slate-700 dark:text-slate-300">Logo công ty</p>
                <p>Khuyến nghị ảnh PNG/JPG trong suốt.</p>
                <p>Logo sẽ tự động xuất hiện trên file Excel & PDF.</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Tên Công Ty / Đơn vị</label>
                <input
                  type="text"
                  value={seller.companyName}
                  onChange={(e) => setSeller({ ...seller, companyName: e.target.value })}
                  placeholder="Vd: Công ty TNHH Giải Pháp Sáng Tạo"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Địa chỉ</label>
                <input
                  type="text"
                  value={seller.address}
                  onChange={(e) => setSeller({ ...seller, address: e.target.value })}
                  placeholder="Vd: 123 Nguyễn Huệ, Quận 1, TP.HCM"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Số điện thoại</label>
                  <input
                    type="text"
                    value={seller.phone}
                    onChange={(e) => setSeller({ ...seller, phone: e.target.value })}
                    placeholder="0908 123 456"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Mã số thuế</label>
                  <input
                    type="text"
                    value={seller.taxId}
                    onChange={(e) => setSeller({ ...seller, taxId: e.target.value })}
                    placeholder="0312345678"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Email / Ngân hàng</label>
                <input
                  type="text"
                  value={seller.email}
                  onChange={(e) => setSeller({ ...seller, email: e.target.value })}
                  placeholder="contact@company.com"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Column 2: Bên Mua (Buyer Info) */}
          <div className="space-y-4 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-slate-800 pb-6 lg:pb-0 lg:pr-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4" /> Khách Hàng (Bên Mua)
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Tên Người nhận / Khách hàng</label>
                <input
                  type="text"
                  value={buyer.customerName}
                  onChange={(e) => setBuyer({ ...buyer, customerName: e.target.value })}
                  placeholder="Vd: Anh Nguyễn Văn A"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Tên Công ty khách hàng</label>
                <input
                  type="text"
                  value={buyer.companyName}
                  onChange={(e) => setBuyer({ ...buyer, companyName: e.target.value })}
                  placeholder="Vd: Tập đoàn ABC"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Địa chỉ giao hàng / Công ty</label>
                <input
                  type="text"
                  value={buyer.address}
                  onChange={(e) => setBuyer({ ...buyer, address: e.target.value })}
                  placeholder="Vd: 456 Lê Duẩn, Đà Nẵng"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Số điện thoại</label>
                  <input
                    type="text"
                    value={buyer.phone}
                    onChange={(e) => setBuyer({ ...buyer, phone: e.target.value })}
                    placeholder="0912 345 678"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={buyer.email}
                    onChange={(e) => setBuyer({ ...buyer, email: e.target.value })}
                    placeholder="client@gmail.com"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Thông số Báo giá & Thuế */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
              <FileBadge className="w-4 h-4" /> Thông Số Báo Giá
            </h3>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Mã báo giá</label>
                  <input
                    type="text"
                    value={quotationMeta.code}
                    onChange={(e) => setQuotationMeta({ ...quotationMeta, code: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Ngày lập</label>
                  <input
                    type="date"
                    value={quotationMeta.date}
                    onChange={(e) => setQuotationMeta({ ...quotationMeta, date: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Hiệu lực (ngày)</label>
                  <input
                    type="number"
                    value={quotationMeta.validDays}
                    onChange={(e) => setQuotationMeta({ ...quotationMeta, validDays: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Chiết khấu (%)</label>
                  <input
                    type="number"
                    value={quotationMeta.discountRate}
                    onChange={(e) => setQuotationMeta({ ...quotationMeta, discountRate: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Thuế VAT (%)</label>
                  <input
                    type="number"
                    value={quotationMeta.vatRate}
                    onChange={(e) => setQuotationMeta({ ...quotationMeta, vatRate: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
