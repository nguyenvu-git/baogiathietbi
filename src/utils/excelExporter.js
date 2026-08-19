import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { numberToWordsVN } from './numberToWords';

export async function exportToExcel({ seller, buyer, quotationMeta, columns, items, totals }) {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = seller.companyName || 'Hệ thống Báo giá';
  workbook.lastModifiedBy = seller.companyName || 'Hệ thống Báo giá';
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet('Báo Giá', {
    pageSetup: { paperSize: 9, orientation: 'portrait' }
  });

  // Enable grid lines
  worksheet.views = [{ showGridLines: true }];

  let currentRow = 1;

  // --- LOGO & SELLER INFO HEADER ---
  if (seller.logo) {
    try {
      const extension = seller.logo.substring(seller.logo.indexOf('/') + 1, seller.logo.indexOf(';'));
      const base64Data = seller.logo;
      const logoId = workbook.addImage({
        base64: base64Data,
        extension: extension === 'jpeg' ? 'jpeg' : 'png',
      });
      worksheet.addImage(logoId, {
        tl: { col: 0, row: 0 },
        ext: { width: 120, height: 60 }
      });
    } catch (e) {
      console.warn('Failed to embed logo into Excel:', e);
    }
  }

  // Seller info (Right aligned or next to logo)
  worksheet.mergeCells(`C${currentRow}:G${currentRow}`);
  const sellerTitleCell = worksheet.getCell(`C${currentRow}`);
  sellerTitleCell.value = (seller.companyName || 'CÔNG TY BÁO GIÁ').toUpperCase();
  sellerTitleCell.font = { name: 'Arial', size: 14, bold: true, color: { argb: 'FF1E293B' } };
  sellerTitleCell.alignment = { vertical: 'middle', horizontal: 'left' };

  currentRow++;
  worksheet.mergeCells(`C${currentRow}:G${currentRow}`);
  worksheet.getCell(`C${currentRow}`).value = `Địa chỉ: ${seller.address || ''}`;
  worksheet.getCell(`C${currentRow}`).font = { name: 'Arial', size: 9, italic: true };

  currentRow++;
  worksheet.mergeCells(`C${currentRow}:G${currentRow}`);
  worksheet.getCell(`C${currentRow}`).value = `Điện thoại: ${seller.phone || ''} | Email: ${seller.email || ''} | MST: ${seller.taxId || ''}`;
  worksheet.getCell(`C${currentRow}`).font = { name: 'Arial', size: 9, italic: true };

  currentRow += 2;

  // --- QUOTATION TITLE ---
  const activeColsCount = columns.filter(c => c.visible).length || 6;
  const lastColLetter = String.fromCharCode(65 + Math.max(activeColsCount - 1, 5));

  worksheet.mergeCells(`A${currentRow}:${lastColLetter}${currentRow}`);
  const titleCell = worksheet.getCell(`A${currentRow}`);
  titleCell.value = 'BẢNG BÁO GIÁ';
  titleCell.font = { name: 'Arial', size: 18, bold: true, color: { argb: 'FF1E40AF' } };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
  worksheet.getRow(currentRow).height = 30;

  currentRow++;
  worksheet.mergeCells(`A${currentRow}:${lastColLetter}${currentRow}`);
  const subTitleCell = worksheet.getCell(`A${currentRow}`);
  subTitleCell.value = `Số: ${quotationMeta.code || 'BG-001'} | Ngày: ${quotationMeta.date || new Date().toLocaleDateString('vi-VN')}`;
  subTitleCell.font = { name: 'Arial', size: 10, italic: true, color: { argb: 'FF64748B' } };
  subTitleCell.alignment = { horizontal: 'center', vertical: 'middle' };

  currentRow += 2;

  // --- BUYER INFO BOX ---
  worksheet.mergeCells(`A${currentRow}:D${currentRow}`);
  worksheet.getCell(`A${currentRow}`).value = `Kính gửi: ${buyer.customerName || 'Quý Khách Hàng'}`;
  worksheet.getCell(`A${currentRow}`).font = { name: 'Arial', size: 11, bold: true };

  worksheet.mergeCells(`E${currentRow}:${lastColLetter}${currentRow}`);
  worksheet.getCell(`E${currentRow}`).value = `Đơn vị: ${buyer.companyName || ''}`;
  worksheet.getCell(`E${currentRow}`).font = { name: 'Arial', size: 10 };

  currentRow++;
  worksheet.mergeCells(`A${currentRow}:D${currentRow}`);
  worksheet.getCell(`A${currentRow}`).value = `Điện thoại: ${buyer.phone || ''}`;
  worksheet.getCell(`A${currentRow}`).font = { name: 'Arial', size: 10 };

  worksheet.mergeCells(`E${currentRow}:${lastColLetter}${currentRow}`);
  worksheet.getCell(`E${currentRow}`).value = `Địa chỉ: ${buyer.address || ''}`;
  worksheet.getCell(`E${currentRow}`).font = { name: 'Arial', size: 10 };

  currentRow += 2;

  // --- TABLE HEADERS ---
  const visibleColumns = columns.filter(c => c.visible);
  const headerRowIndex = currentRow;
  const headerRow = worksheet.getRow(headerRowIndex);
  headerRow.height = 28;

  visibleColumns.forEach((col, idx) => {
    const cell = headerRow.getCell(idx + 1);
    cell.value = col.title;
    cell.font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1E3A8A' } // Deep slate blue
    };
    cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FF94A3B8' } },
      left: { style: 'thin', color: { argb: 'FF94A3B8' } },
      bottom: { style: 'medium', color: { argb: 'FF1E293B' } },
      right: { style: 'thin', color: { argb: 'FF94A3B8' } }
    };
  });

  currentRow++;

  // --- TABLE DATA ROWS ---
  const imageColumnIndex = visibleColumns.findIndex(c => c.type === 'image');

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const dataRow = worksheet.getRow(currentRow);
    const hasImage = imageColumnIndex !== -1 && item[visibleColumns[imageColumnIndex].id];

    // Set row height if image is present
    dataRow.height = hasImage ? 65 : 24;

    visibleColumns.forEach((col, cIdx) => {
      const cell = dataRow.getCell(cIdx + 1);
      const cellValue = item[col.id];

      // Formatting borders
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
      };

      if (col.type === 'stt') {
        cell.value = i + 1;
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      } else if (col.type === 'image') {
        if (cellValue) {
          try {
            const ext = cellValue.substring(cellValue.indexOf('/') + 1, cellValue.indexOf(';'));
            const imgId = workbook.addImage({
              base64: cellValue,
              extension: ext === 'jpeg' ? 'jpeg' : 'png',
            });
            worksheet.addImage(imgId, {
              tl: { col: cIdx + 0.1, row: currentRow - 1 + 0.1 },
              br: { col: cIdx + 0.9, row: currentRow - 0.1 },
              editAs: 'oneCell'
            });
          } catch (err) {
            console.warn('Failed to embed item image:', err);
          }
        }
      } else if (col.type === 'currency') {
        const val = parseFloat(cellValue) || 0;
        cell.value = val;
        cell.numFmt = '#,##0 "đ"';
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
      } else if (col.type === 'number') {
        const val = parseFloat(cellValue) || 0;
        cell.value = val;
        cell.numFmt = '#,##0';
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      } else {
        cell.value = cellValue || '';
        cell.alignment = { horizontal: col.align || 'left', vertical: 'middle', wrapText: true };
      }
    });

    currentRow++;
  }

  // --- SUMMARY / TOTALS SECTION ---
  const totalRowIndex = currentRow;

  // Subtotal
  worksheet.mergeCells(`A${totalRowIndex}:${String.fromCharCode(65 + visibleColumns.length - 2)}${totalRowIndex}`);
  const subLabelCell = worksheet.getCell(`A${totalRowIndex}`);
  subLabelCell.value = 'Tổng cộng tiền hàng:';
  subLabelCell.font = { name: 'Arial', size: 10, bold: true };
  subLabelCell.alignment = { horizontal: 'right', vertical: 'middle' };

  const subValCell = worksheet.getCell(`${String.fromCharCode(65 + visibleColumns.length - 1)}${totalRowIndex}`);
  subValCell.value = totals.subtotal;
  subValCell.numFmt = '#,##0 "đ"';
  subValCell.font = { name: 'Arial', size: 10, bold: true };
  subValCell.alignment = { horizontal: 'right', vertical: 'middle' };

  currentRow++;

  // Discount / VAT if applicable
  if (totals.discountAmount > 0) {
    worksheet.mergeCells(`A${currentRow}:${String.fromCharCode(65 + visibleColumns.length - 2)}${currentRow}`);
    worksheet.getCell(`A${currentRow}`).value = `Chiết khấu (${totals.discountRate}%):`;
    worksheet.getCell(`A${currentRow}`).alignment = { horizontal: 'right', vertical: 'middle' };

    const discVal = worksheet.getCell(`${String.fromCharCode(65 + visibleColumns.length - 1)}${currentRow}`);
    discVal.value = -totals.discountAmount;
    discVal.numFmt = '#,##0 "đ"';
    discVal.alignment = { horizontal: 'right', vertical: 'middle' };
    currentRow++;
  }

  if (totals.vatAmount > 0) {
    worksheet.mergeCells(`A${currentRow}:${String.fromCharCode(65 + visibleColumns.length - 2)}${currentRow}`);
    worksheet.getCell(`A${currentRow}`).value = `Thuế VAT (${totals.vatRate}%):`;
    worksheet.getCell(`A${currentRow}`).alignment = { horizontal: 'right', vertical: 'middle' };

    const vatVal = worksheet.getCell(`${String.fromCharCode(65 + visibleColumns.length - 1)}${currentRow}`);
    vatVal.value = totals.vatAmount;
    vatVal.numFmt = '#,##0 "đ"';
    vatVal.alignment = { horizontal: 'right', vertical: 'middle' };
    currentRow++;
  }

  // Grand Total
  worksheet.mergeCells(`A${currentRow}:${String.fromCharCode(65 + visibleColumns.length - 2)}${currentRow}`);
  const grandLabelCell = worksheet.getCell(`A${currentRow}`);
  grandLabelCell.value = 'TỔNG CỘNG THANH TOÁN:';
  grandLabelCell.font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FF1E3A8A' } };
  grandLabelCell.alignment = { horizontal: 'right', vertical: 'middle' };

  const grandValCell = worksheet.getCell(`${String.fromCharCode(65 + visibleColumns.length - 1)}${currentRow}`);
  grandValCell.value = totals.grandTotal;
  grandValCell.numFmt = '#,##0 "đ"';
  grandValCell.font = { name: 'Arial', size: 12, bold: true, color: { argb: 'FF1E3A8A' } };
  grandValCell.alignment = { horizontal: 'right', vertical: 'middle' };

  currentRow++;
  worksheet.mergeCells(`A${currentRow}:${lastColLetter}${currentRow}`);
  const wordsCell = worksheet.getCell(`A${currentRow}`);
  wordsCell.value = `(Bằng chữ: ${numberToWordsVN(totals.grandTotal)})`;
  wordsCell.font = { name: 'Arial', size: 10, italic: true, bold: true };
  wordsCell.alignment = { horizontal: 'right', vertical: 'middle' };

  currentRow += 2;

  // --- FOOTER & SIGNATURES ---
  worksheet.mergeCells(`A${currentRow}:C${currentRow}`);
  worksheet.getCell(`A${currentRow}`).value = 'ĐẠI DIỆN KHÁCH HÀNG';
  worksheet.getCell(`A${currentRow}`).font = { name: 'Arial', size: 10, bold: true };
  worksheet.getCell(`A${currentRow}`).alignment = { horizontal: 'center' };

  worksheet.mergeCells(`D${currentRow}:${lastColLetter}${currentRow}`);
  worksheet.getCell(`D${currentRow}`).value = 'ĐẠI DIỆN BÊN BÁO GIÁ';
  worksheet.getCell(`D${currentRow}`).font = { name: 'Arial', size: 10, bold: true };
  worksheet.getCell(`D${currentRow}`).alignment = { horizontal: 'center' };

  currentRow++;
  worksheet.mergeCells(`A${currentRow}:C${currentRow}`);
  worksheet.getCell(`A${currentRow}`).value = '(Ký, ghi rõ họ tên)';
  worksheet.getCell(`A${currentRow}`).font = { name: 'Arial', size: 9, italic: true };
  worksheet.getCell(`A${currentRow}`).alignment = { horizontal: 'center' };

  worksheet.mergeCells(`D${currentRow}:${lastColLetter}${currentRow}`);
  worksheet.getCell(`D${currentRow}`).value = '(Ký, đóng dấu, ghi rõ họ tên)';
  worksheet.getCell(`D${currentRow}`).font = { name: 'Arial', size: 9, italic: true };
  worksheet.getCell(`D${currentRow}`).alignment = { horizontal: 'center' };

  // --- COLUMN WIDTH ADJUSTMENTS ---
  visibleColumns.forEach((col, idx) => {
    const colObj = worksheet.getColumn(idx + 1);
    if (col.type === 'stt') colObj.width = 8;
    else if (col.type === 'image') colObj.width = 16;
    else if (col.type === 'number') colObj.width = 12;
    else if (col.type === 'currency') colObj.width = 18;
    else colObj.width = Math.max((col.title.length || 10) + 5, 22);
  });

  // Generate buffer and trigger download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const filename = `BaoGia_${quotationMeta.code || 'BG001'}_${new Date().toISOString().slice(0,10)}.xlsx`;
  saveAs(blob, filename);
}
