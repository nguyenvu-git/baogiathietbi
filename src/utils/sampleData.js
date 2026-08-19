// Helper SVGs encoded as Data URIs for realistic demo images
const createSvgDataUrl = (title, color1, color2) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${color1}"/>
        <stop offset="100%" stop-color="${color2}"/>
      </linearGradient>
    </defs>
    <rect width="200" height="200" rx="20" fill="url(#g)"/>
    <circle cx="100" cy="85" r="35" fill="rgba(255,255,255,0.2)"/>
    <text x="100" y="93" font-family="sans-serif" font-size="28" font-weight="bold" fill="#ffffff" text-anchor="middle">📦</text>
    <text x="100" y="150" font-family="sans-serif" font-size="14" font-weight="600" fill="#ffffff" text-anchor="middle">${title}</text>
  </svg>`;
  return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
};

export const DEFAULT_COLUMNS = [
  { id: 'stt', title: 'STT', type: 'stt', visible: true, width: '60px' },
  { id: 'image', title: 'Hình ảnh', type: 'image', visible: true, width: '100px' },
  { id: 'code', title: 'Mã SP', type: 'text', visible: true, width: '100px' },
  { id: 'name', title: 'Tên sản phẩm / Dịch vụ', type: 'text', visible: true, width: '240px' },
  { id: 'unit', title: 'ĐVT', type: 'text', visible: true, width: '80px' },
  { id: 'quantity', title: 'Số lượng', type: 'number', visible: true, width: '90px' },
  { id: 'price', title: 'Đơn giá (VNĐ)', type: 'currency', visible: true, width: '130px' },
  { id: 'amount', title: 'Thành tiền (VNĐ)', type: 'currency', visible: true, width: '140px', readonly: true },
  { id: 'note', title: 'Ghi chú', type: 'text', visible: true, width: '150px' }
];

export const PRESET_DATASETS = {
  FURNITURE: {
    name: 'Nội thất & Gia dụng',
    seller: {
      companyName: 'CÔNG TY TNHH NỘI THẤT SÁNG TẠO SÀI GÒN',
      address: '123 Đường Nguyễn Thị Minh Khai, Phường Bến Thành, Quận 1, TP. HCM',
      phone: '0908 123 456',
      email: 'baogia@noithatsangtao.vn',
      taxId: '0312987654',
      bankInfo: 'STK: 190388889999 - Ngân hàng Techcombank, CN TP.HCM',
      logo: null
    },
    buyer: {
      customerName: 'Anh Trần Minh Khoa',
      companyName: 'Công ty Cổ phần Đầu tư Công nghệ Sunrise',
      phone: '0912 999 888',
      email: 'khoa.tran@sunrisegroup.vn',
      address: 'Tầng 8, Tòa nhà Landmark 81, Q. Bình Thạnh, TP. HCM'
    },
    quotationMeta: {
      code: 'BG-NT-2026-088',
      date: new Date().toISOString().slice(0, 10),
      validDays: 30,
      vatRate: 8,
      discountRate: 5
    },
    items: [
      {
        id: '1',
        stt: 1,
        image: createSvgDataUrl('Ghế Ergonomic', '#3b82f6', '#1d4ed8'),
        code: 'SP-G01',
        name: 'Ghế xoay công thái học Ergonomic Office Chair Pro X',
        unit: 'Cái',
        quantity: 10,
        price: 3200000,
        amount: 32000000,
        note: 'Bảo hành 24 tháng'
      },
      {
        id: '2',
        stt: 2,
        image: createSvgDataUrl('Bàn Nâng Hạ', '#10b981', '#047857'),
        code: 'SP-B02',
        name: 'Bàn làm việc thông minh nâng hạ chiều cao tự động 1.6m',
        unit: 'Bộ',
        quantity: 5,
        price: 6800000,
        amount: 34000000,
        note: 'Mặt gỗ sồi nguyên khối'
      },
      {
        id: '3',
        stt: 3,
        image: createSvgDataUrl('Tủ Giám Đốc', '#f59e0b', '#b45309'),
        code: 'SP-T05',
        name: 'Tủ hồ sơ văn phòng cao cấp 4 cánh kính',
        unit: 'Cái',
        quantity: 2,
        price: 8500000,
        amount: 17000000,
        note: 'Sơn tĩnh điện chống trầy'
      },
      {
        id: '4',
        stt: 4,
        image: createSvgDataUrl('Sofa Da', '#8b5cf6', '#6d28d9'),
        code: 'SP-S09',
        name: 'Bộ Sofa da Ý phòng tiếp khách giám đốc',
        unit: 'Bộ',
        quantity: 1,
        price: 24500000,
        amount: 24500000,
        note: 'Tặng kèm 4 gối ôm'
      }
    ]
  },
  ELECTRONICS: {
    name: 'Thiết bị Điện tử & Công nghệ',
    seller: {
      companyName: 'CÔNG TY CP GIẢI PHÁP CÔNG NGHỆ NEXTGEN',
      address: '456 Lê Văn Sỹ, Phường 12, Quận 3, TP. Hồ Chí Minh',
      phone: '028 3999 7777',
      email: 'sales@nextgentech.vn',
      taxId: '0315444555',
      bankInfo: 'STK: 0071000123456 - Ngân hàng Vietcombank',
      logo: null
    },
    buyer: {
      customerName: 'Chị Nguyễn Thanh Hà',
      companyName: 'Trường Đại học Công nghệ & Truyền thông',
      phone: '0988 333 222',
      email: 'ha.nguyen@vnu.edu.vn',
      address: '268 Lý Thường Kiệt, Quận 10, TP. HCM'
    },
    quotationMeta: {
      code: 'BG-IT-2026-102',
      date: new Date().toISOString().slice(0, 10),
      validDays: 15,
      vatRate: 10,
      discountRate: 3
    },
    items: [
      {
        id: '1',
        stt: 1,
        image: createSvgDataUrl('Laptop i7', '#ef4444', '#b91c1c'),
        code: 'IT-LAP01',
        name: 'Laptop Dell XPS 15 Intel Core i7 16GB RAM 512GB SSD',
        unit: 'Máy',
        quantity: 8,
        price: 38500000,
        amount: 308000000,
        note: 'Hàng chính hãng DGW'
      },
      {
        id: '2',
        stt: 2,
        image: createSvgDataUrl('Màn Hình 4K', '#06b6d4', '#0e7490'),
        code: 'IT-MON02',
        name: 'Màn hình đồ họa LG UltraFine 27 inch 4K IPS 144Hz',
        unit: 'Cái',
        quantity: 12,
        price: 9900000,
        amount: 118800000,
        note: 'Bảo hành 36 tháng'
      },
      {
        id: '3',
        stt: 3,
        image: createSvgDataUrl('Máy Chiếu', '#ec4899', '#be185d'),
        code: 'IT-PRJ03',
        name: 'Máy chiếu hội trường Sony 5000 Lumens Full HD',
        unit: 'Bộ',
        quantity: 2,
        price: 28000000,
        amount: 56000000,
        note: 'Lắp đặt tận nơi'
      }
    ]
  }
};
