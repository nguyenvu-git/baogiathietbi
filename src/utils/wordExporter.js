import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  HeadingLevel,
  BorderStyle,
  ImageRun
} from 'docx';
import { saveAs } from 'file-saver';
import { numberToWordsVN } from './numberToWords';

function base64ToUint8Array(base64) {
  if (!base64) return null;
  try {
    const base64Data = base64.split(',')[1] || base64;
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  } catch (e) {
    console.warn('Error converting base64 to Uint8Array:', e);
    return null;
  }
}

export async function exportToWord({ seller, buyer, quotationMeta, columns, items, totals }) {
  const visibleColumns = columns.filter(c => c.visible);

  const docChildren = [];

  const isInvoice = quotationMeta.docType === 'invoice';

  // Seller & Title Header
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: (seller.companyName || (isInvoice ? 'ĐƠN VỊ BÁN HÀNG' : 'CÔNG TY BÁO GIÁ')).toUpperCase(),
          bold: true,
          size: 28,
          color: '1E3A8A'
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: `Địa chỉ: ${seller.address || ''} | SĐT: ${seller.phone || ''} | Email: ${seller.email || ''}`,
          size: 18,
          italics: true,
          color: '64748B'
        })
      ]
    }),
    new Paragraph({ text: '', spacing: { after: 200 } }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: isInvoice ? 'HÓA ĐƠN BÁN HÀNG' : 'BẢNG BÁO GIÁ',
          bold: true,
          size: 36,
          color: '1E40AF'
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: `${isInvoice ? 'Mã HD' : 'Mã báo giá'}: ${quotationMeta.code || (isInvoice ? 'HD001' : 'BG001')} | Ngày: ${quotationMeta.date || new Date().toLocaleDateString('vi-VN')}`,
          size: 20,
          italics: true,
          color: '475569'
        })
      ]
    }),
    new Paragraph({ text: '', spacing: { after: 300 } })
  );

  // Buyer Info
  docChildren.push(
    new Paragraph({
      children: [
        new TextRun({ text: 'Kính gửi: ', bold: true, size: 22 }),
        new TextRun({ text: buyer.customerName || 'Quý khách hàng', bold: true, size: 22 })
      ]
    }),
    new Paragraph({
      children: [
        new TextRun({ text: 'Đơn vị / Công ty: ', bold: true, size: 20 }),
        new TextRun({ text: buyer.companyName || '', size: 20 })
      ]
    }),
    new Paragraph({
      children: [
        new TextRun({ text: 'SĐT: ', bold: true, size: 20 }),
        new TextRun({ text: `${buyer.phone || ''}  -  Địa chỉ: ${buyer.address || ''}`, size: 20 })
      ]
    }),
    new Paragraph({ text: '', spacing: { after: 300 } })
  );

  // Table Headers
  const tableRows = [];
  const headerCells = visibleColumns.map(col => {
    return new TableCell({
      shading: { fill: '1E3A8A' },
      children: [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({
              text: col.title,
              bold: true,
              color: 'FFFFFF',
              size: 20
            })
          ]
        })
      ]
    });
  });
  tableRows.push(new TableRow({ children: headerCells }));

  // Table Data Rows
  items.forEach((item, index) => {
    const rowCells = visibleColumns.map(col => {
      const val = item[col.id];
      let contentParagraphs = [];

      if (col.type === 'stt') {
        contentParagraphs.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: String(index + 1), size: 19 })]
          })
        );
      } else if (col.type === 'image') {
        const imgBuffer = base64ToUint8Array(val);
        if (imgBuffer) {
          try {
            contentParagraphs.push(
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new ImageRun({
                    data: imgBuffer,
                    transformation: { width: 60, height: 60 }
                  })
                ]
              })
            );
          } catch (e) {
            contentParagraphs.push(new Paragraph({ text: '' }));
          }
        } else {
          contentParagraphs.push(new Paragraph({ text: '' }));
        }
      } else if (col.type === 'currency') {
        const formatted = (parseFloat(val) || 0).toLocaleString('vi-VN') + ' đ';
        contentParagraphs.push(
          new Paragraph({
            alignment: AlignmentType.RIGHT,
            children: [new TextRun({ text: formatted, size: 19 })]
          })
        );
      } else if (col.type === 'number') {
        contentParagraphs.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: String(val || 0), size: 19 })]
          })
        );
      } else {
        contentParagraphs.push(
          new Paragraph({
            alignment: col.align === 'center' ? AlignmentType.CENTER : AlignmentType.LEFT,
            children: [new TextRun({ text: String(val || ''), size: 19 })]
          })
        );
      }

      return new TableCell({
        children: contentParagraphs
      });
    });

    tableRows.push(new TableRow({ children: rowCells }));
  });

  docChildren.push(
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: tableRows
    }),
    new Paragraph({ text: '', spacing: { after: 200 } })
  );

  // Totals Summary
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      children: [
        new TextRun({ text: 'Tổng tiền hàng: ', bold: true, size: 22 }),
        new TextRun({ text: totals.subtotal.toLocaleString('vi-VN') + ' đ', bold: true, size: 22 })
      ]
    })
  );

  if (totals.discountAmount > 0) {
    docChildren.push(
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [
          new TextRun({ text: `Chiết khấu (${totals.discountRate}%): `, size: 20 }),
          new TextRun({ text: '-' + totals.discountAmount.toLocaleString('vi-VN') + ' đ', size: 20 })
        ]
      })
    );
  }

  if (totals.vatAmount > 0) {
    docChildren.push(
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        children: [
          new TextRun({ text: `Thuế VAT (${totals.vatRate}%): `, size: 20 }),
          new TextRun({ text: totals.vatAmount.toLocaleString('vi-VN') + ' đ', size: 20 })
        ]
      })
    );
  }

  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      children: [
        new TextRun({ text: 'TỔNG CỘNG THANH TOÁN: ', bold: true, size: 24, color: '1E3A8A' }),
        new TextRun({ text: totals.grandTotal.toLocaleString('vi-VN') + ' đ', bold: true, size: 26, color: '1E3A8A' })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.RIGHT,
      children: [
        new TextRun({ text: `(Bằng chữ: ${numberToWordsVN(totals.grandTotal)})`, italics: true, bold: true, size: 20, color: '475569' })
      ]
    }),
    new Paragraph({ text: '', spacing: { after: 500 } })
  );

  // Signatures
  docChildren.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({
          text: isInvoice
            ? 'NGƯỜI MUA HÀNG                                NGƯỜI BÁN HÀNG'
            : 'ĐẠI DIỆN KHÁCH HÀNG                                ĐẠI DIỆN BÊN BÁO GIÁ',
          bold: true,
          size: 22
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: '(Ký, ghi rõ họ tên)                                      (Ký, đóng dấu, ghi rõ họ tên)', italics: true, size: 18 })
      ]
    })
  );

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: docChildren
      }
    ]
  });

  const blob = await Packer.toBlob(doc);
  const filePrefix = isInvoice ? 'HoaDon' : 'BaoGia';
  saveAs(blob, `${filePrefix}_${quotationMeta.code || (isInvoice ? 'HD001' : 'BG001')}.docx`);
}
