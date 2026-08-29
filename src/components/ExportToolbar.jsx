import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  FileText, 
  FileCode, 
  Printer, 
  Download, 
  FileDown,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { exportToExcel } from '../utils/excelExporter';
import { exportToPDF } from '../utils/pdfExporter';
import { exportToWord } from '../utils/wordExporter';

export default function ExportToolbar({ 
  seller, 
  buyer, 
  quotationMeta, 
  columns, 
  items, 
  totals, 
  onExportJson, 
  onImportJson,
  onDirectPrint,
  onToggleImageColumn,
  isImageColumnVisible
}) {
  const [exporting, setExporting] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const showNotification = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleExportExcel = async () => {
    try {
      setExporting('excel');
      await exportToExcel({ seller, buyer, quotationMeta, columns, items, totals });
      showNotification('Đã xuất file Excel thành công (có nhúng ảnh)!');
    } catch (e) {
      console.error(e);
      alert('Có lỗi xảy ra khi xuất Excel: ' + e.message);
    } finally {
      setExporting(null);
    }
  };

  const handleExportPdf = async () => {
    try {
      setExporting('pdf');
      await exportToPDF('quotation-print-area', `BaoGia_${quotationMeta.code || 'BG001'}.pdf`);
      showNotification('Đã xuất file PDF A4 thành công!');
    } catch (e) {
      console.error(e);
      alert('Có lỗi xảy ra khi xuất PDF: ' + e.message);
    } finally {
      setExporting(null);
    }
  };

  const handleExportWord = async () => {
    try {
      setExporting('word');
      await exportToWord({ seller, buyer, quotationMeta, columns, items, totals });
      showNotification('Đã xuất file Word (.docx) thành công!');
    } catch (e) {
      console.error(e);
      alert('Có lỗi xảy ra khi xuất Word: ' + e.message);
    } finally {
      setExporting(null);
    }
  };

  const handleExportCsv = () => {
    try {
      setExporting('csv');
      const visibleCols = columns.filter(c => c.visible);
      let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
      
      // Header row
      csvContent += visibleCols.map(c => `"${c.title}"`).join(",") + "\n";

      // Data rows
      items.forEach((item, idx) => {
        const row = visibleCols.map(col => {
          if (col.type === 'stt') return idx + 1;
          if (col.type === 'image') return item[col.id] ? '"[Hình ảnh]"' : '""';
          const val = item[col.id] || '';
          return `"${String(val).replace(/"/g, '""')}"`;
        });
        csvContent += row.join(",") + "\n";
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `BaoGia_${quotationMeta.code || 'BG001'}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showNotification('Đã tải file CSV!');
    } catch (e) {
      alert('Lỗi xuất CSV: ' + e.message);
    } finally {
      setExporting(null);
    }
  };

  const handlePrint = () => {
    if (onDirectPrint) {
      onDirectPrint();
    } else {
      window.print();
    }
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 rounded-2xl shadow-xl p-6 text-white mb-8 border border-slate-800">
      
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        
        {/* Title & Badge */}
        <div>
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Download className="w-5 h-5 text-emerald-400" />
            In Báo Giá & Xuất File Tự Động
          </h2>
          <p className="text-xs text-slate-300">
            In trực tiếp ra máy in/file PDF khổ A4 hoặc tải file Excel nhúng ảnh, Word & PDF.
          </p>
        </div>

        {/* Action Buttons Grid */}
        <div className="flex flex-wrap items-center gap-2.5">

          {/* Direct Print Button (PROMINENT PRIMARY ACTION) */}
          <button
            onClick={handlePrint}
            className="px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 active:from-indigo-700 active:to-blue-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition flex items-center gap-2 transform hover:-translate-y-0.5"
            title="Mở ngay cửa sổ in ấn tờ A4 hoặc Lưu dạng PDF trực tiếp"
          >
            <Printer className="w-4 h-4 text-white animate-pulse" />
            🖨️ In Báo Giá (A4)
          </button>

          {/* Toggle Image Column Button */}
          {onToggleImageColumn && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onToggleImageColumn();
              }}
              className={`px-3.5 py-2.5 font-semibold text-xs sm:text-sm rounded-xl border transition flex items-center gap-1.5 cursor-pointer ${
                isImageColumnVisible
                  ? 'bg-purple-600 hover:bg-purple-500 text-white border-purple-400 shadow-md'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
              title={isImageColumnVisible ? "Ẩn cột ảnh khỏi bản in" : "Thêm cột ảnh chèn ngay sau STT"}
            >
              🖼️ {isImageColumnVisible ? '✓ Đang mở cột ảnh' : '+ Thêm cột ảnh'}
            </button>
          )}

          {/* Excel Export */}
          <button
            onClick={handleExportExcel}
            disabled={!!exporting}
            className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md transition flex items-center gap-2 disabled:opacity-50"
          >
            {exporting === 'excel' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
            )}
            Excel có ảnh
          </button>

          {/* PDF Export */}
          <button
            onClick={handleExportPdf}
            disabled={!!exporting}
            className="px-3 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs sm:text-sm rounded-xl shadow transition flex items-center gap-1.5 disabled:opacity-50"
          >
            {exporting === 'pdf' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileText className="w-4 h-4 text-rose-200" />
            )}
            File PDF
          </button>

          {/* Word Export */}
          <button
            onClick={handleExportWord}
            disabled={!!exporting}
            className="px-3 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs sm:text-sm rounded-xl shadow transition flex items-center gap-1.5 disabled:opacity-50"
          >
            {exporting === 'word' ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileText className="w-4 h-4 text-blue-200" />
            )}
            Word (.docx)
          </button>

          {/* Backup JSON */}
          <button
            onClick={onExportJson}
            className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs sm:text-sm rounded-xl border border-slate-700 transition flex items-center gap-1.5"
            title="Lưu file JSON cấu hình để tải lại sau"
          >
            <FileDown className="w-4 h-4 text-indigo-400" />
            Backup
          </button>

        </div>
      </div>

      {/* Toast Notification */}
      {successMsg && (
        <div className="mt-4 p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {successMsg}
        </div>
      )}

    </div>
  );
}
