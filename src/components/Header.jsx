import React from 'react';
import { 
  FileSpreadsheet, 
  FileText, 
  FileDown, 
  Printer, 
  Columns, 
  Sparkles, 
  Moon, 
  Sun, 
  Download, 
  Upload, 
  RefreshCw,
  Eye,
  Edit3
} from 'lucide-react';

export default function Header({ 
  darkMode, 
  setDarkMode, 
  onOpenColumnManager, 
  onLoadPreset, 
  onExportJson, 
  onImportJson,
  onReset,
  previewMode,
  setPreviewMode,
  onQuickExport
}) {
  return (
    <header className="app-header bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20 text-white font-bold text-xl">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              Báo Giá Pro
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
                Multi-Format
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Xuất Excel có ảnh • PDF • Word • Không cần CSDL</p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Preset dataset dropdown */}
          <div className="relative group">
            <button 
              className="btn btn-secondary flex items-center gap-1.5 text-xs sm:text-sm font-medium px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition"
              title="Thêm dữ liệu mẫu thử nghiệm"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="hidden md:inline">Dữ liệu mẫu</span>
            </button>
            <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1 hidden group-hover:block z-50">
              <button 
                onClick={() => onLoadPreset('FURNITURE')}
                className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700/50 flex items-center gap-2"
              >
                🪑 Nội thất & Gia dụng
              </button>
              <button 
                onClick={() => onLoadPreset('ELECTRONICS')}
                className="w-full text-left px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700/50 flex items-center gap-2"
              >
                💻 Điện tử & Thiết bị
              </button>
              <div className="border-t border-slate-100 dark:border-slate-700 my-1"></div>
              <button 
                onClick={onReset}
                className="w-full text-left px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 flex items-center gap-2"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Tạo báo giá mới
              </button>
            </div>
          </div>

          {/* Manage Columns Button */}
          <button
            onClick={onOpenColumnManager}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-medium px-3 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-300 transition"
            title="Tùy chỉnh tên cột và thuộc tính cột (Hình ảnh, Tiền tệ...)"
          >
            <Columns className="w-4 h-4" />
            <span className="hidden sm:inline">Quản lý cột</span>
          </button>

          {/* View Mode Toggle */}
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`flex items-center gap-1.5 text-xs sm:text-sm font-medium px-3 py-2 rounded-lg transition ${
              previewMode 
                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' 
                : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200'
            }`}
            title="Chuyển đổi chế độ Chỉnh sửa / Xem trước tờ A4"
          >
            {previewMode ? (
              <>
                <Edit3 className="w-4 h-4" />
                <span className="hidden sm:inline">Chỉnh sửa</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                <span className="hidden sm:inline">Xem mẫu In</span>
              </>
            )}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            title="Đổi giao diện Sáng / Tối"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

        </div>
      </div>
    </header>
  );
}
