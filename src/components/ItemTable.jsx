import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Copy, 
  ArrowUp, 
  ArrowDown, 
  Upload, 
  Image as ImageIcon, 
  DollarSign, 
  Hash, 
  Layers,
  Sparkles
} from 'lucide-react';
import { numberToWordsVN } from '../utils/numberToWords';

// Component 1: Smart Quantity Stepper with Minus & Plus buttons
function QuantityStepperInput({ value, onChange }) {
  const numValue = Math.max(0, parseInt(value, 10) || 0);
  return (
    <div className="flex items-center justify-center gap-1">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, numValue - 1))}
        className="w-6 h-7 flex items-center justify-center rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs transition cursor-pointer select-none border border-slate-200 dark:border-slate-700"
        title="Giảm 1"
      >
        -
      </button>
      <input
        type="number"
        min="1"
        value={numValue}
        onWheel={(e) => e.target.blur()}
        onChange={(e) => onChange(Math.max(0, parseInt(e.target.value, 10) || 0))}
        className="w-12 py-1 text-xs text-center font-bold rounded border border-slate-200 dark:border-slate-700 focus:border-blue-500 bg-transparent text-slate-900 dark:text-white outline-none font-mono"
      />
      <button
        type="button"
        onClick={() => onChange(numValue + 1)}
        className="w-6 h-7 flex items-center justify-center rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs transition cursor-pointer select-none border border-slate-200 dark:border-slate-700"
        title="Tăng 1"
      >
        +
      </button>
    </div>
  );
}
const DEFAULT_UNITS = ['Cái', 'Bộ', 'Chiếc', 'Hộp', 'Thùng', 'Bao', 'Mét', 'Kg', 'Gói', 'Lô', 'Chuyến', 'Bộ sản phẩm'];

function formatUnitCapitalization(str) {
  if (!str) return '';
  const trimmed = str.trim();
  if (!trimmed) return '';
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
}

function UnitComboboxInput({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('baogia_unit_history');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return DEFAULT_UNITS;
  });

  const saveToHistory = (newUnit) => {
    const formatted = formatUnitCapitalization(newUnit);
    if (!formatted) return;
    if (!history.includes(formatted)) {
      const updated = [formatted, ...history];
      setHistory(updated);
      try {
        localStorage.setItem('baogia_unit_history', JSON.stringify(updated));
      } catch (e) {}
    }
  };

  const handleInputChange = (e) => {
    const raw = e.target.value;
    // Format on entry: first character uppercase, rest lowercase
    const formatted = formatUnitCapitalization(raw);
    onChange(formatted);
  };

  const handleSelect = (unit) => {
    onChange(unit);
    saveToHistory(unit);
    setIsOpen(false);
  };

  const filteredHistory = history.filter((unit) =>
    !value || unit.toLowerCase().includes((value || '').toLowerCase())
  );

  return (
    <div className="relative">
      <input
        type="text"
        value={value || ''}
        onFocus={() => setIsOpen(true)}
        onBlur={() => {
          setTimeout(() => {
            setIsOpen(false);
            if (value) saveToHistory(value);
          }, 200);
        }}
        onChange={handleInputChange}
        placeholder="Cái..."
        className="w-full px-2.5 py-1.5 text-sm rounded border border-slate-200 dark:border-slate-700 focus:border-blue-500 bg-transparent text-slate-900 dark:text-white outline-none transition font-sans"
      />
      {isOpen && filteredHistory.length > 0 && (
        <ul 
          className="absolute left-0 top-full mt-1 z-50 w-36 max-h-48 overflow-y-auto rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xl py-1 text-xs space-y-0.5"
          onMouseDown={(e) => e.preventDefault()}
        >
          {filteredHistory.map((item, idx) => (
            <li
              key={idx}
              onClick={() => handleSelect(item)}
              className="px-3 py-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-slate-700 dark:text-slate-200 font-medium transition cursor-pointer flex items-center justify-between"
            >
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Component 3: Smart Price Input with thousand separators, readable text badge, and floating shortcut popover on focus
function FormattedPriceInput({ value, onChange, readonly }) {
  const [isFocused, setIsFocused] = useState(false);
  const [displayStr, setDisplayStr] = useState('');

  const numericValue = parseFloat(value) || 0;

  const formatWithDots = (num) => {
    if (num === '' || num === null || num === undefined || isNaN(num)) return '0';
    return Number(num).toLocaleString('vi-VN');
  };

  const getReadableText = (num) => {
    if (!num || num <= 0) return null;
    if (num >= 1000000000) {
      const ty = (num / 1000000000).toLocaleString('vi-VN', { maximumFractionDigits: 2 });
      return `${ty} tỷ đ`;
    }
    if (num >= 1000000) {
      const trieu = (num / 1000000).toLocaleString('vi-VN', { maximumFractionDigits: 2 });
      return `${trieu} triệu đ`;
    }
    if (num >= 1000) {
      const nghin = (num / 1000).toLocaleString('vi-VN', { maximumFractionDigits: 1 });
      return `${nghin} nghìn đ`;
    }
    return `${num.toLocaleString('vi-VN')} đ`;
  };

  if (readonly) {
    return (
      <div className="w-full px-2.5 py-1.5 text-xs text-right font-bold rounded border border-transparent bg-slate-100 dark:bg-slate-800/60 text-blue-600 dark:text-blue-400 font-mono">
        {formatWithDots(numericValue)} đ
      </div>
    );
  }

  const readableText = getReadableText(numericValue);

  const handleAddAmount = (amount) => {
    onChange((numericValue || 0) + amount);
  };

  return (
    <div className="relative space-y-1 w-full min-w-[160px]">
      {readableText && (
        <div className="flex items-center justify-between text-[10px] px-0.5">
          <span className="text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/60 font-sans shadow-2xs" title={readableText}>
            {readableText}
          </span>
        </div>
      )}
      <div className="relative flex items-center w-full">
        <input
          type="text"
          value={isFocused ? displayStr : formatWithDots(numericValue)}
          onFocus={() => {
            setIsFocused(true);
            setDisplayStr(numericValue ? String(numericValue) : '');
          }}
          onBlur={() => {
            // Keep popover open if user clicks inside popover
            setTimeout(() => setIsFocused(false), 250);
          }}
          onChange={(e) => {
            const raw = e.target.value.replace(/[^0-9]/g, '');
            setDisplayStr(raw);
            const val = parseFloat(raw) || 0;
            onChange(val);
          }}
          placeholder="0"
          className="w-full px-3 py-1.5 text-xs text-right font-semibold rounded-lg border border-slate-300 dark:border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none transition font-mono shadow-xs"
        />
      </div>

      {/* Floating Popover Toolbar for Zero & Level Shortcuts on Focus */}
      {isFocused && (
        <div 
          className="absolute right-0 top-full mt-1.5 z-40 w-64 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl space-y-2 animate-in fade-in zoom-in-95 duration-100"
          onMouseDown={(e) => e.preventDefault()} // Prevent input blur when clicking popover buttons
        >
          {/* Section 1: Thêm số 0 */}
          <div>
            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
              Thêm số 0:
            </div>
            <div className="grid grid-cols-4 gap-1">
              <button
                type="button"
                onClick={() => onChange(numericValue * 10)}
                className="py-1 px-1.5 rounded bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold transition text-xs text-center border border-blue-200 dark:border-blue-800/50 cursor-pointer"
                title="Thêm 1 số 0 (x10)"
              >
                +0
              </button>
              <button
                type="button"
                onClick={() => onChange(numericValue * 100)}
                className="py-1 px-1.5 rounded bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold transition text-xs text-center border border-blue-200 dark:border-blue-800/50 cursor-pointer"
                title="Thêm 2 số 0 (x100)"
              >
                +00
              </button>
              <button
                type="button"
                onClick={() => onChange(numericValue * 1000)}
                className="py-1 px-1.5 rounded bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 font-bold transition text-xs text-center border border-blue-200 dark:border-blue-800/50 cursor-pointer"
                title="Thêm 3 số 0 (x1.000)"
              >
                +000
              </button>
              <button
                type="button"
                onClick={() => onChange(numericValue * 1000000)}
                className="py-1 px-1.5 rounded bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/60 dark:hover:bg-purple-900 text-purple-700 dark:text-purple-300 font-bold transition text-xs text-center border border-purple-200 dark:border-purple-800/50 cursor-pointer"
                title="Thêm 6 số 0 (x1.000.000)"
              >
                +000.000
              </button>
            </div>
          </div>

          {/* Section 2: Gợi ý mức tiền */}
          <div>
            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
              Cộng mức tiền nhanh:
            </div>
            <div className="grid grid-cols-5 gap-1">
              <button
                type="button"
                onClick={() => handleAddAmount(10000)}
                className="py-1 px-1 rounded bg-slate-100 hover:bg-emerald-100 dark:bg-slate-800 dark:hover:bg-emerald-900/60 text-slate-700 dark:text-slate-300 hover:text-emerald-700 font-semibold transition text-[10px] text-center border border-slate-200 dark:border-slate-700 cursor-pointer"
                title="+10.000 đ (Chục nghìn)"
              >
                +10k
              </button>
              <button
                type="button"
                onClick={() => handleAddAmount(100000)}
                className="py-1 px-1 rounded bg-slate-100 hover:bg-emerald-100 dark:bg-slate-800 dark:hover:bg-emerald-900/60 text-slate-700 dark:text-slate-300 hover:text-emerald-700 font-semibold transition text-[10px] text-center border border-slate-200 dark:border-slate-700 cursor-pointer"
                title="+100.000 đ (Trăm nghìn)"
              >
                +100k
              </button>
              <button
                type="button"
                onClick={() => handleAddAmount(1000000)}
                className="py-1 px-1 rounded bg-slate-100 hover:bg-blue-100 dark:bg-slate-800 dark:hover:bg-blue-900/60 text-slate-700 dark:text-slate-300 hover:text-blue-700 font-bold transition text-[10px] text-center border border-slate-200 dark:border-slate-700 cursor-pointer"
                title="+1.000.000 đ (1 Triệu)"
              >
                +1Tr
              </button>
              <button
                type="button"
                onClick={() => handleAddAmount(10000000)}
                className="py-1 px-1 rounded bg-slate-100 hover:bg-purple-100 dark:bg-slate-800 dark:hover:bg-purple-900/60 text-slate-700 dark:text-slate-300 hover:text-purple-700 font-bold transition text-[10px] text-center border border-slate-200 dark:border-slate-700 cursor-pointer"
                title="+10.000.000 đ (Chục triệu)"
              >
                +10Tr
              </button>
              <button
                type="button"
                onClick={() => handleAddAmount(100000000)}
                className="py-1 px-1 rounded bg-slate-100 hover:bg-indigo-100 dark:bg-slate-800 dark:hover:bg-indigo-900/60 text-slate-700 dark:text-slate-300 hover:text-indigo-700 font-bold transition text-[10px] text-center border border-slate-200 dark:border-slate-700 cursor-pointer"
                title="+100.000.000 đ (Trăm triệu)"
              >
                +100Tr
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ItemTable({ 
  columns, 
  items, 
  setItems, 
  totals, 
  onOpenColumnManager,
  onToggleImageColumn,
  isImageColumnVisible
}) {
  const visibleColumns = columns.filter(c => c.visible);

  const handleCellChange = (id, fieldId, value) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [fieldId]: value };
        // Auto calculate amount if quantity or price changed
        if (fieldId === 'quantity' || fieldId === 'price') {
          const qty = parseFloat(updated.quantity) || 0;
          const prc = parseFloat(updated.price) || 0;
          updated.amount = qty * prc;
        }
        return updated;
      }
      return item;
    }));
  };

  const handleImageUpload = (id, fieldId, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleCellChange(id, fieldId, reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddRow = () => {
    const newItem = {
      id: String(Date.now()),
      stt: items.length + 1,
      image: '',
      code: `SP-${String(items.length + 1).padStart(2, '0')}`,
      name: '',
      unit: 'Cái',
      quantity: 1,
      price: 0,
      amount: 0,
      note: ''
    };
    setItems([...items, newItem]);
  };

  const handleDuplicateRow = (itemToDup) => {
    const newItem = {
      ...itemToDup,
      id: String(Date.now()),
      code: `${itemToDup.code || 'SP'}-copy`
    };
    setItems([...items, newItem]);
  };

  const handleDeleteRow = (id) => {
    if (items.length <= 1) return;
    setItems(items.filter(item => item.id !== id));
  };

  const handleMoveRow = (index, direction) => {
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= items.length) return;
    const updated = [...items];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setItems(updated);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors duration-200 overflow-hidden mb-6">
      
      {/* Table Header Bar */}
      <div className="px-6 py-4 bg-slate-50/70 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              Danh Sách Sản Phẩm / Dịch Vụ
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold">
                {items.length} mặt hàng
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Nhập dữ liệu, tải ảnh sản phẩm và điều chỉnh đơn giá</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 flex-wrap gap-y-2">
          {/* Direct Toggle Button for Image Column right after STT */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              if (onToggleImageColumn) onToggleImageColumn();
            }}
            className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition flex items-center gap-1.5 cursor-pointer ${
              isImageColumnVisible
                ? 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/40 dark:text-purple-300 dark:border-purple-800 hover:bg-purple-200'
                : 'bg-slate-100 hover:bg-purple-50 text-slate-700 hover:text-purple-700 border-slate-200 dark:bg-slate-800 dark:hover:bg-purple-900/30 dark:text-slate-300 dark:border-slate-700'
            }`}
            title={isImageColumnVisible ? "Click để ẩn cột ảnh sản phẩm" : "Click để hiện cột ảnh ngay sau cột STT"}
          >
            <ImageIcon className="w-3.5 h-3.5 text-purple-500" />
            {isImageColumnVisible ? '✓ Ẩn Cột Ảnh' : '+ Thêm Cột Ảnh (Sau STT)'}
          </button>

          <button
            onClick={onOpenColumnManager}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 transition flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" /> Thêm/Sửa Cột
          </button>
          <button
            onClick={handleAddRow}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow hover:shadow-md transition flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Thêm sản phẩm
          </button>
        </div>
      </div>

      {/* Main Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 uppercase">
              {visibleColumns.map((col) => (
                <th 
                  key={col.id}
                  style={{ width: col.width || 'auto' }}
                  className={`p-3 border-r border-slate-200 dark:border-slate-800 last:border-r-0 ${
                    col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : 'text-left'
                  }`}
                >
                  <div className="flex items-center gap-1.5 justify-between">
                    <span>{col.title}</span>
                    {col.type === 'image' && <ImageIcon className="w-3.5 h-3.5 text-purple-500" />}
                  </div>
                </th>
              ))}
              <th className="p-3 text-center w-24">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
            {items.map((item, index) => (
              <tr 
                key={item.id}
                className={`transition-all duration-150 group border-b-2 border-slate-200 dark:border-slate-700/80 ${
                  index % 2 === 0 
                    ? 'bg-white dark:bg-slate-900' 
                    : 'bg-slate-50/90 dark:bg-slate-800/40'
                } hover:bg-blue-50/30 dark:hover:bg-slate-800/70 focus-within:bg-blue-50/90 dark:focus-within:bg-blue-950/50 focus-within:ring-2 focus-within:ring-blue-500/40`}
              >
                {visibleColumns.map((col) => (
                  <td 
                    key={col.id}
                    className="p-3 border-r border-slate-200 dark:border-slate-800 last:border-r-0 align-middle"
                  >
                    {col.type === 'stt' && (
                      <div className="flex items-center justify-center">
                        <span className="w-6 h-6 rounded-full inline-flex items-center justify-center font-extrabold text-xs bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 group-hover:bg-blue-600 group-hover:text-white group-focus-within:bg-blue-600 group-focus-within:text-white transition shadow-sm font-mono">
                          {index + 1}
                        </span>
                      </div>
                    )}

                    {col.type === 'image' && (
                      <div className="flex items-center justify-center">
                        {item[col.id] ? (
                          <div className="relative w-14 h-14 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 p-1 group/img overflow-hidden">
                            <img 
                              src={item[col.id]} 
                              alt="Item" 
                              className="w-full h-full object-contain"
                            />
                            <button
                              onClick={() => handleCellChange(item.id, col.id, '')}
                              className="absolute inset-0 bg-slate-900/70 text-rose-400 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition"
                              title="Xóa ảnh"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <label className="w-14 h-14 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-400 bg-slate-50 dark:bg-slate-800/40 flex flex-col items-center justify-center cursor-pointer text-slate-400 hover:text-blue-500 transition">
                            <Upload className="w-4 h-4 mb-0.5" />
                            <span className="text-[9px] font-medium">+ Ảnh</span>
                            <input 
                              type="file" 
                              accept="image/*"
                              onChange={(e) => handleImageUpload(item.id, col.id, e)}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    )}

                    {col.type === 'text' && (
                      col.id === 'unit' ? (
                        <UnitComboboxInput
                          value={item[col.id] || ''}
                          onChange={(val) => handleCellChange(item.id, col.id, val)}
                        />
                      ) : (
                        <input
                          type="text"
                          value={item[col.id] || ''}
                          onChange={(e) => handleCellChange(item.id, col.id, e.target.value)}
                          placeholder={`Nhập ${col.title.toLowerCase()}...`}
                          className="w-full px-2.5 py-1.5 text-sm rounded border border-slate-200 dark:border-slate-700 focus:border-blue-500 bg-transparent text-slate-900 dark:text-white outline-none transition"
                        />
                      )
                    )}

                    {col.type === 'number' && (
                      <QuantityStepperInput
                        value={item[col.id] || 1}
                        onChange={(val) => handleCellChange(item.id, col.id, val)}
                      />
                    )}

                    {col.type === 'currency' && (
                      <FormattedPriceInput
                        value={item[col.id] || 0}
                        readonly={col.readonly}
                        onChange={(val) => handleCellChange(item.id, col.id, val)}
                      />
                    )}
                  </td>
                ))}

                {/* Row actions */}
                <td className="p-2 text-center align-middle">
                  <div className="flex items-center justify-center space-x-1">
                    <button
                      onClick={() => handleDuplicateRow(item)}
                      className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition"
                      title="Nhân bản dòng này"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveRow(index, -1)}
                      disabled={index === 0}
                      className="p-1 rounded text-slate-400 hover:text-slate-600 disabled:opacity-30"
                      title="Di chuyển lên"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveRow(index, 1)}
                      disabled={index === items.length - 1}
                      className="p-1 rounded text-slate-400 hover:text-slate-600 disabled:opacity-30"
                      title="Di chuyển xuống"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteRow(item.id)}
                      disabled={items.length <= 1}
                      className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 disabled:opacity-30 transition"
                      title="Xóa dòng này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Footer Summary Card */}
      <div className="p-6 bg-slate-50/70 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div>
          <button
            onClick={handleAddRow}
            className="w-full md:w-auto px-4 py-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 font-semibold text-xs rounded-xl border border-indigo-200 dark:border-indigo-800 transition flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Thêm Mặt Hàng Tiếp Theo
          </button>
        </div>

        {/* Calculated Totals Box */}
        <div className="space-y-2 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
            <span>Tổng cộng tiền hàng:</span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {totals.subtotal.toLocaleString('vi-VN')} đ
            </span>
          </div>

          {totals.discountAmount > 0 && (
            <div className="flex justify-between text-xs text-emerald-600 dark:text-emerald-400">
              <span>Chiết khấu ({totals.discountRate}%):</span>
              <span className="font-semibold">
                -{totals.discountAmount.toLocaleString('vi-VN')} đ
              </span>
            </div>
          )}

          {totals.vatAmount > 0 && (
            <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
              <span>Thuế VAT ({totals.vatRate}%):</span>
              <span className="font-semibold text-slate-900 dark:text-white">
                +{totals.vatAmount.toLocaleString('vi-VN')} đ
              </span>
            </div>
          )}

          <div className="border-t border-slate-200 dark:border-slate-800 pt-2 flex justify-between items-center text-sm font-bold">
            <span className="text-blue-700 dark:text-blue-400">TỔNG THANH TOÁN:</span>
            <span className="text-lg text-blue-700 dark:text-blue-400">
              {totals.grandTotal.toLocaleString('vi-VN')} đ
            </span>
          </div>

          <div className="text-right text-xs italic font-medium text-slate-500 dark:text-slate-400">
            (Bằng chữ: {numberToWordsVN(totals.grandTotal)})
          </div>
        </div>
      </div>

    </div>
  );
}
