import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import CompanyInfoForm from './components/CompanyInfoForm';
import ColumnManager from './components/ColumnManager';
import ItemTable from './components/ItemTable';
import QuotationPreview from './components/QuotationPreview';
import ExportToolbar from './components/ExportToolbar';
import { DEFAULT_COLUMNS, PRESET_DATASETS } from './utils/sampleData';

const LOCAL_STORAGE_KEY = 'baogia_pro_data_v1';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [columnManagerOpen, setColumnManagerOpen] = useState(false);

  // Initial State from Furniture Preset
  const initialDataset = PRESET_DATASETS.FURNITURE;

  const [seller, setSeller] = useState(initialDataset.seller);
  const [buyer, setBuyer] = useState(initialDataset.buyer);
  const [quotationMeta, setQuotationMeta] = useState(initialDataset.quotationMeta);
  const [columns, setColumns] = useState(DEFAULT_COLUMNS);
  const [items, setItems] = useState(initialDataset.items);

  // Load saved state from LocalStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.seller) setSeller(parsed.seller);
        if (parsed.buyer) setBuyer(parsed.buyer);
        if (parsed.quotationMeta) setQuotationMeta(parsed.quotationMeta);
        if (parsed.columns) setColumns(parsed.columns);
        if (parsed.items) setItems(parsed.items);
      }
    } catch (e) {
      console.warn('Could not read from LocalStorage:', e);
    }
  }, []);

  // Save to LocalStorage on change
  useEffect(() => {
    try {
      const dataToSave = { seller, buyer, quotationMeta, columns, items };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (e) {
      console.warn('Could not save to LocalStorage:', e);
    }
  }, [seller, buyer, quotationMeta, columns, items]);

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Calculate totals dynamically
  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    const discountRate = parseFloat(quotationMeta.discountRate) || 0;
    const discountAmount = Math.round(subtotal * (discountRate / 100));

    const afterDiscount = subtotal - discountAmount;
    const vatRate = parseFloat(quotationMeta.vatRate) || 0;
    const vatAmount = Math.round(afterDiscount * (vatRate / 100));

    const grandTotal = afterDiscount + vatAmount;

    return {
      subtotal,
      discountRate,
      discountAmount,
      vatRate,
      vatAmount,
      grandTotal
    };
  }, [items, quotationMeta.discountRate, quotationMeta.vatRate]);

  // Handler: Toggle Image Column (strictly right after STT, 100% immutable)
  const handleToggleImageColumn = () => {
    setColumns(prevColumns => {
      const existingImg = prevColumns.find(c => c.id === 'image');
      const isCurrentlyVisible = existingImg ? existingImg.visible : false;

      if (isCurrentlyVisible) {
        // Hide image column
        return prevColumns.map(c => c.id === 'image' ? { ...c, visible: false } : { ...c });
      } else {
        // Show image column and place it strictly right after 'stt'
        const colsWithoutImage = prevColumns.filter(c => c.id !== 'image').map(c => ({ ...c }));
        const sttIdx = colsWithoutImage.findIndex(c => c.id === 'stt');
        const newImgCol = existingImg 
          ? { ...existingImg, visible: true }
          : { id: 'image', title: 'Hình ảnh', type: 'image', visible: true, width: '80px' };
        
        const insertIdx = sttIdx >= 0 ? sttIdx + 1 : 1;
        colsWithoutImage.splice(insertIdx, 0, newImgCol);
        return colsWithoutImage;
      }
    });
  };

  const isImageColumnVisible = useMemo(() => {
    return columns.some(c => c.id === 'image' && c.visible);
  }, [columns]);

  // Handler: Direct Print
  const handleDirectPrint = () => {
    window.print();
  };

  // Handler: Load Preset
  const handleLoadPreset = (key) => {
    const dataset = PRESET_DATASETS[key];
    if (dataset) {
      setSeller(dataset.seller);
      setBuyer(dataset.buyer);
      setQuotationMeta(dataset.quotationMeta);
      setItems(dataset.items);
    }
  };

  // Handler: Reset Form
  const handleReset = () => {
    if (window.confirm('Bạn có chắc chắn muốn làm mới toàn bộ báo giá?')) {
      setSeller({
        companyName: '',
        address: '',
        phone: '',
        email: '',
        taxId: '',
        bankInfo: '',
        logo: null
      });
      setBuyer({
        customerName: '',
        companyName: '',
        phone: '',
        email: '',
        address: ''
      });
      setQuotationMeta({
        code: `BG-${Date.now().toString().slice(-4)}`,
        date: new Date().toISOString().slice(0, 10),
        validDays: 30,
        vatRate: 8,
        discountRate: 0
      });
      setItems([
        {
          id: '1',
          stt: 1,
          image: '',
          code: 'SP-01',
          name: '',
          unit: 'Cái',
          quantity: 1,
          price: 0,
          amount: 0,
          note: ''
        }
      ]);
    }
  };

  // Handler: Backup / Export JSON
  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ seller, buyer, quotationMeta, columns, items }));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `Backup_BaoGia_${quotationMeta.code || 'BG001'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Handler: Restore / Import JSON
  const handleImportJson = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (parsed.seller) setSeller(parsed.seller);
          if (parsed.buyer) setBuyer(parsed.buyer);
          if (parsed.quotationMeta) setQuotationMeta(parsed.quotationMeta);
          if (parsed.columns) setColumns(parsed.columns);
          if (parsed.items) setItems(parsed.items);
          alert('Đã khôi phục dữ liệu từ file backup JSON!');
        } catch (err) {
          alert('File JSON không hợp lệ!');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
      
      {/* Header Bar */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenColumnManager={() => setColumnManagerOpen(true)}
        onLoadPreset={handleLoadPreset}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
        onReset={handleReset}
        previewMode={previewMode}
        setPreviewMode={setPreviewMode}
        onToggleImageColumn={handleToggleImageColumn}
        isImageColumnVisible={isImageColumnVisible}
        onDirectPrint={handleDirectPrint}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Export Action Toolbar */}
        <div className="no-print">
          <ExportToolbar
            seller={seller}
            buyer={buyer}
            quotationMeta={quotationMeta}
            columns={columns}
            items={items}
            totals={totals}
            onExportJson={handleExportJson}
            onImportJson={handleImportJson}
            onDirectPrint={handleDirectPrint}
            onToggleImageColumn={handleToggleImageColumn}
            isImageColumnVisible={isImageColumnVisible}
          />
        </div>

        {/* View Toggle Content */}
        {previewMode ? (
          /* Mode 1: Full Printable A4 Preview */
          <div className="animate-fadeIn">
            <QuotationPreview
              seller={seller}
              buyer={buyer}
              quotationMeta={quotationMeta}
              columns={columns}
              items={items}
              totals={totals}
              onDirectPrint={handleDirectPrint}
              onToggleImageColumn={handleToggleImageColumn}
              isImageColumnVisible={isImageColumnVisible}
            />
          </div>
        ) : (
          /* Mode 2: Interactive Editor View */
          <div className="space-y-6 animate-fadeIn">
            
            {/* Form & Table Editor Section (Hidden on Print) */}
            <div className="no-print space-y-6">
              {/* Form 1: Company & Buyer Info */}
              <CompanyInfoForm
                seller={seller}
                setSeller={setSeller}
                buyer={buyer}
                setBuyer={setBuyer}
                quotationMeta={quotationMeta}
                setQuotationMeta={setQuotationMeta}
              />

              {/* Form 2: Item List Table */}
              <ItemTable
                columns={columns}
                items={items}
                setItems={setItems}
                totals={totals}
                onOpenColumnManager={() => setColumnManagerOpen(true)}
                onToggleImageColumn={handleToggleImageColumn}
                isImageColumnVisible={isImageColumnVisible}
              />
            </div>

            {/* Live Mini Preview Canvas */}
            <div className="mt-12 border-t border-slate-200 dark:border-slate-800 pt-8">
              <div className="no-print flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  Xem trước bản in A4 (Live Preview)
                </h3>
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={handleDirectPrint}
                    className="text-xs font-semibold px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition cursor-pointer"
                  >
                    🖨️ In Báo Giá (A4)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode(true)}
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    Phóng to mẫu in A4 →
                  </button>
                </div>
              </div>

              <QuotationPreview
                seller={seller}
                buyer={buyer}
                quotationMeta={quotationMeta}
                columns={columns}
                items={items}
                totals={totals}
                onDirectPrint={handleDirectPrint}
                onToggleImageColumn={handleToggleImageColumn}
                isImageColumnVisible={isImageColumnVisible}
              />
            </div>

          </div>
        )}

      </main>

      {/* Column Manager Modal */}
      <ColumnManager
        isOpen={columnManagerOpen}
        onClose={() => setColumnManagerOpen(false)}
        columns={columns}
        setColumns={setColumns}
      />

      {/* Footer */}
      <footer className="no-print bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-6 mt-12 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>© 2026 Báo Giá Pro • Trình tạo Báo giá Đa định dạng chuyên nghiệp (Excel có ảnh, PDF, Word)</p>
      </footer>

    </div>
  );
}
