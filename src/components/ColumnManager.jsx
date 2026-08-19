import React, { useState } from 'react';
import { X, Plus, Eye, EyeOff, Trash2, ArrowUp, ArrowDown, Image as ImageIcon, Type, Hash, DollarSign } from 'lucide-react';

export default function ColumnManager({ isOpen, onClose, columns, setColumns }) {
  const [newColTitle, setNewColTitle] = useState('');
  const [newColType, setNewColType] = useState('text');
  const [newColAlign, setNewColAlign] = useState('left');

  if (!isOpen) return null;

  const handleAddColumn = (e) => {
    e.preventDefault();
    if (!newColTitle.trim()) return;

    const colId = 'col_' + Date.now();
    const newCol = {
      id: colId,
      title: newColTitle.trim(),
      type: newColType,
      visible: true,
      align: newColAlign,
      width: newColType === 'image' ? '100px' : '150px'
    };

    setColumns([...columns, newCol]);
    setNewColTitle('');
    setNewColType('text');
  };

  const handleToggleVisible = (id) => {
    setColumns(columns.map(c => c.id === id ? { ...c, visible: !c.visible } : c));
  };

  const handleUpdateTitle = (id, title) => {
    setColumns(columns.map(c => c.id === id ? { ...c, title } : c));
  };

  const handleDeleteColumn = (id) => {
    setColumns(columns.filter(c => c.id !== id));
  };

  const handleMoveColumn = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= columns.length) return;
    const updated = [...columns];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setColumns(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Quản lý Cột Báo Giá
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Thêm tên cột mới, chọn cột có chứa hình ảnh, đổi tên hoặc ẩn/hiện cột
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Form Thêm Cột Mới */}
          <form onSubmit={handleAddColumn} className="bg-blue-50/60 dark:bg-blue-950/30 p-4 rounded-xl border border-blue-100 dark:border-blue-900/40 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400">
              + Thêm Cột Mới Cho Bảng
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Tên cột</label>
                <input 
                  type="text"
                  placeholder="Vd: Ảnh sản phẩm, Xuất xứ..."
                  value={newColTitle}
                  onChange={(e) => setNewColTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Loại dữ liệu</label>
                <select
                  value={newColType}
                  onChange={(e) => setNewColType(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="text">Chữ / Mô tả (Text)</option>
                  <option value="image">🖼️ Hình ảnh (Image upload)</option>
                  <option value="number">Số lượng (Number)</option>
                  <option value="currency">Số tiền (VNĐ)</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg shadow hover:shadow-md transition flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Thêm Cột
                </button>
              </div>
            </div>
          </form>

          {/* Danh Sách Cột Hiện Tại */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Danh sách cột hiển thị ({columns.length})
            </h3>
            
            <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
              {columns.map((col, idx) => (
                <div 
                  key={col.id}
                  className={`p-3 flex items-center justify-between gap-3 transition ${
                    col.visible ? 'bg-white dark:bg-slate-900' : 'bg-slate-50 dark:bg-slate-900/40 opacity-60'
                  }`}
                >
                  {/* Order & Visibility toggle */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleVisible(col.id)}
                      className={`p-1.5 rounded-lg transition ${
                        col.visible 
                          ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30' 
                          : 'text-slate-400 bg-slate-100 dark:bg-slate-800'
                      }`}
                      title={col.visible ? "Ẩn cột" : "Hiện cột"}
                    >
                      {col.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>

                    {/* Column type badge */}
                    <span className="text-xs px-2 py-1 rounded font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center gap-1">
                      {col.type === 'image' && <ImageIcon className="w-3 h-3 text-purple-500" />}
                      {col.type === 'currency' && <DollarSign className="w-3 h-3 text-emerald-500" />}
                      {col.type === 'number' && <Hash className="w-3 h-3 text-amber-500" />}
                      {col.type === 'text' && <Type className="w-3 h-3 text-blue-500" />}
                      {col.type.toUpperCase()}
                    </span>
                  </div>

                  {/* Title input */}
                  <div className="flex-1">
                    <input 
                      type="text"
                      value={col.title}
                      onChange={(e) => handleUpdateTitle(col.id, e.target.value)}
                      className="w-full px-2.5 py-1 text-sm font-semibold rounded border border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-blue-500 bg-transparent text-slate-900 dark:text-white outline-none transition"
                      disabled={col.id === 'stt' || col.id === 'amount'}
                    />
                  </div>

                  {/* Up / Down / Delete actions */}
                  <div className="flex items-center space-x-1">
                    <button 
                      onClick={() => handleMoveColumn(idx, -1)}
                      disabled={idx === 0}
                      className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-30"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleMoveColumn(idx, 1)}
                      disabled={idx === columns.length - 1}
                      className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 disabled:opacity-30"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    
                    {!['stt', 'name', 'quantity', 'price', 'amount'].includes(col.id) && (
                      <button 
                        onClick={() => handleDeleteColumn(col.id)}
                        className="p-1 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 transition"
                        title="Xóa cột này"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-medium text-sm rounded-xl shadow transition"
          >
            Đóng & Áp Dụng
          </button>
        </div>

      </div>
    </div>
  );
}
