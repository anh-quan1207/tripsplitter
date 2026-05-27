const ExcelJS = require('exceljs');
const path = require('path');

async function createExpenseExcel() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Antigravity';
  workbook.lastModifiedBy = 'Antigravity';
  workbook.created = new Date();
  workbook.modified = new Date();

  // Create sheet 1: Hướng Dẫn & Tổng Hợp
  const summarySheet = workbook.addWorksheet('1. Tổng Hợp', {
    views: [{ showGridLines: true }]
  });

  // Create sheet 2: Chi Tiết Chi Tiêu
  const expenseSheet = workbook.addWorksheet('2. Chi Tiết Chi Tiêu', {
    views: [{ showGridLines: true }]
  });

  // --- STYLING PATTERNS ---
  const fontTitle = { name: 'Segoe UI', size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
  const fontSectionHeader = { name: 'Segoe UI', size: 12, bold: true, color: { argb: 'FF0F5132' } };
  const fontHeader = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
  const fontBold = { name: 'Segoe UI', size: 10, bold: true };
  const fontNormal = { name: 'Segoe UI', size: 10 };
  const fontItalic = { name: 'Segoe UI', size: 9, italic: true, color: { argb: 'FF6C757D' } };

  const fillPrimary = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF0F5132' } // Dark Green
  };

  const fillSecondary = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFD1E7DD' } // Mint Light Green
  };

  const fillZebra = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFF8F9FA' } // Lightest Gray
  };

  const fillHeaderTotal = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE2E3E5' } // Gray
  };

  const borderThin = {
    top: { style: 'thin', color: { argb: 'FFDEE2E6' } },
    left: { style: 'thin', color: { argb: 'FFDEE2E6' } },
    bottom: { style: 'thin', color: { argb: 'FFDEE2E6' } },
    right: { style: 'thin', color: { argb: 'FFDEE2E6' } }
  };

  const borderDoubleBottom = {
    top: { style: 'thin', color: { argb: 'FFDEE2E6' } },
    left: { style: 'thin', color: { argb: 'FFDEE2E6' } },
    bottom: { style: 'double', color: { argb: 'FF212529' } },
    right: { style: 'thin', color: { argb: 'FFDEE2E6' } }
  };

  // ==========================================
  // SHEET 1: TỔNG HỢP & HƯỚNG DẪN
  // ==========================================

  // Set column widths for Summary Sheet
  summarySheet.columns = [
    { key: 'stt', width: 6 },
    { key: 'name', width: 25 },
    { key: 'prepaid', width: 18 },
    { key: 'out_of_pocket', width: 18 },
    { key: 'total_paid', width: 22 },
    { key: 'total_spent', width: 22 },
    { key: 'balance', width: 22 },
    { key: 'status', width: 28 }
  ];

  // Header Title
  summarySheet.mergeCells('A1:H2');
  const titleCell = summarySheet.getCell('A1');
  titleCell.value = 'BẢNG CÂN ĐỐI & CHIA TIỀN CHUYẾN ĐI';
  titleCell.font = fontTitle;
  titleCell.fill = fillPrimary;
  titleCell.alignment = { vertical: 'middle', horizontal: 'center' };

  // Guide box
  summarySheet.mergeCells('A4:H5');
  const guideCell = summarySheet.getCell('A4');
  guideCell.value = 'HƯỚNG DẪN SỬ DỤNG:\n1. Nhập tên các thành viên vào cột "Tên Thành Viên" ở bảng dưới đây (tối đa 10 người).\n2. Nhập số tiền mỗi người đã đóng trước vào quỹ vào cột "Tiền Đóng Quỹ (1)".\n3. Sang sheet "2. Chi Tiết Chi Tiêu" để nhập các khoản chi riêng, người chi, số tiền và tích "x" cho những ai tham gia khoản chi đó.\n4. Bảng này sẽ tự động tính toán chi tiết bằng công thức Excel.';
  guideCell.font = fontItalic;
  guideCell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
  guideCell.fill = fillZebra;

  // Section Header
  summarySheet.mergeCells('A7:H7');
  const sectHeader = summarySheet.getCell('A7');
  sectHeader.value = 'DANH SÁCH THÀNH VIÊN & TỔNG HỢP TÀI CHÍNH';
  sectHeader.font = fontSectionHeader;
  sectHeader.alignment = { vertical: 'middle', horizontal: 'left' };

  // Table Headers
  const headers = ['STT', 'Tên Thành Viên', 'Tiền Đóng Quỹ (1)', 'Chi Thêm Riêng (2)', 'Tổng Cộng Đã Chi (3) = (1)+(2)', 'Tổng Thực Chi (4)', 'Còn Lại (3) - (4)', 'Trạng Thái'];
  const headerRow = summarySheet.getRow(10);
  headerRow.values = headers;
  headerRow.height = 26;
  headerRow.eachCell((cell, colNumber) => {
    cell.font = fontHeader;
    cell.fill = fillPrimary;
    cell.alignment = { vertical: 'middle', horizontal: colNumber === 2 || colNumber === 8 ? 'left' : 'center' };
    cell.border = borderThin;
  });

  // Example members list
  const defaultMembers = [
    'An',
    'Bình',
    'Cường',
    'Dũng',
    'Lan',
    'Hoa',
    'Thành viên 7',
    'Thành viên 8',
    'Thành viên 9',
    'Thành viên 10'
  ];

  const defaultPrepaid = [
    500000,
    500000,
    500000,
    500000,
    500000,
    500000,
    0,
    0,
    0,
    0
  ];

  // Fill in member rows (Rows 11 to 20)
  for (let i = 0; i < 10; i++) {
    const rowNum = 11 + i;
    const row = summarySheet.getRow(rowNum);
    row.height = 22;
    
    // Set cell formulas and values
    // A: STT
    row.getCell(1).value = i + 1;
    // B: Name
    row.getCell(2).value = defaultMembers[i];
    // C: Prepaid
    row.getCell(3).value = defaultPrepaid[i];
    // D: Out of Pocket = SUMIF('2. Chi Tiết Chi Tiêu'!$C$6:$C$100, B{rowNum}, '2. Chi Tiết Chi Tiêu'!$D$6:$D$100)
    row.getCell(4).value = { formula: `=SUMIF('2. Chi Tiết Chi Tiêu'!$C$6:$C$100, B${rowNum}, '2. Chi Tiết Chi Tiêu'!$D$6:$D$100)` };
    // E: Total Paid = C{rowNum} + D{rowNum}
    row.getCell(5).value = { formula: `=C${rowNum}+D${rowNum}` };
    // F: Total Spent = SUM('2. Chi Tiết Chi Tiêu'!{HelperCol}6:{HelperCol}100)
    const helperColChar = String.fromCharCode(81 + i); // 81 is 'Q'
    row.getCell(6).value = { formula: `=SUM('2. Chi Tiết Chi Tiêu'!${helperColChar}$6:${helperColChar}$100)` };
    // G: Balance = E{rowNum} - F{rowNum}
    row.getCell(7).value = { formula: `=E${rowNum}-F${rowNum}` };
    // H: Status
    row.getCell(8).value = { formula: `=IF(G${rowNum}>0, "Nhận lại: " & TEXT(G${rowNum}, "#,##0 đ"), IF(G${rowNum}<0, "Đóng thêm: " & TEXT(-G${rowNum}, "#,##0 đ"), "Đã xong"))` };

    row.eachCell((cell, colNumber) => {
      cell.font = colNumber === 2 ? fontBold : fontNormal;
      cell.border = borderThin;
      
      // Formatting
      if (colNumber === 1) cell.alignment = { horizontal: 'center' };
      if (colNumber === 2) cell.alignment = { horizontal: 'left' };
      if (colNumber >= 3 && colNumber <= 7) {
        cell.numFormat = '#,##0" đ";[Red]-#,##0" đ";"0 đ"';
        cell.alignment = { horizontal: 'right' };
      }
      if (colNumber === 8) {
        cell.alignment = { horizontal: 'left' };
      }

      // Zebra coloring
      if (rowNum % 2 === 0) {
        cell.fill = fillZebra;
      }
    });
  }

  // Add Summary / Total Row (Row 21)
  const totalRow = summarySheet.getRow(21);
  totalRow.height = 24;
  totalRow.getCell(1).value = '';
  totalRow.getCell(2).value = 'TỔNG CỘNG';
  totalRow.getCell(3).value = { formula: '=SUM(C11:C20)' };
  totalRow.getCell(4).value = { formula: '=SUM(D11:D20)' };
  totalRow.getCell(5).value = { formula: '=SUM(E11:E20)' };
  totalRow.getCell(6).value = { formula: '=SUM(F11:F20)' };
  totalRow.getCell(7).value = { formula: '=SUM(G11:G20)' };
  totalRow.getCell(8).value = { formula: '=IF(ROUND(G21, 0)=0, "Khớp 100% (Hoàn thành)", "Lệch: " & TEXT(G21, "#,##0 đ"))' };

  totalRow.eachCell((cell, colNumber) => {
    cell.font = fontBold;
    cell.fill = fillSecondary;
    cell.border = borderDoubleBottom;
    if (colNumber >= 3 && colNumber <= 7) {
      cell.numFormat = '#,##0" đ"';
      cell.alignment = { horizontal: 'right' };
    }
    if (colNumber === 2) cell.alignment = { horizontal: 'left' };
    if (colNumber === 8) {
      cell.alignment = { horizontal: 'left' };
      cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FF0F5132' } };
    }
  });


  // ==========================================
  // SHEET 2: CHI TIẾT CHI TIÊU
  // ==========================================

  // Setup Column Widths for Sheet 2
  // Columns: 
  // A: STT (6)
  // B: Khoản Chi (25)
  // C: Người Chi (15)
  // D: Số Tiền (16)
  // E: Số Người (10)
  // F: Tiền/Người (14)
  // G to P: Members columns (12 each)
  // Q to Z: Helper columns (10 each) - we can set width to 1 for helper columns to hide them visually or keep them visible but clean
  const expCols = [
    { key: 'stt', width: 6 },
    { key: 'item', width: 25 },
    { key: 'payer', width: 16 },
    { key: 'amount', width: 16 },
    { key: 'count', width: 11 },
    { key: 'each_amt', width: 15 }
  ];
  
  // Add member columns
  for (let i = 0; i < 10; i++) {
    expCols.push({ key: `m_${i}`, width: 12 });
  }
  // Add helper columns
  for (let i = 0; i < 10; i++) {
    expCols.push({ key: `h_${i}`, width: 10 });
  }
  
  expenseSheet.columns = expCols;

  // Title block for Expenses
  expenseSheet.mergeCells('A1:P2');
  const expTitle = expenseSheet.getCell('A1');
  expTitle.value = 'DANH SÁCH CHI TIÊU & PHÂN CHIA CHI TIẾT';
  expTitle.font = fontTitle;
  expTitle.fill = fillPrimary;
  expTitle.alignment = { vertical: 'middle', horizontal: 'center' };

  // Guide row
  expenseSheet.mergeCells('A4:P4');
  const expGuide = expenseSheet.getCell('A4');
  expGuide.value = 'Mẹo: Ở mỗi hàng, chọn Người Chi ở cột C, nhập Số Tiền ở cột D, rồi nhập chữ "x" (hoặc ký tự bất kỳ) vào cột tên của những người tham gia để chia tiền.';
  expGuide.font = fontItalic;
  expGuide.alignment = { vertical: 'middle', horizontal: 'left' };
  expGuide.fill = fillZebra;

  // Table Headers
  const expHeaderRow = expenseSheet.getRow(5);
  expHeaderRow.height = 26;
  
  // Base headers
  const baseHeaders = ['STT', 'Khoản Chi', 'Người Chi', 'Số Tiền Chi', 'Số Người', 'Tiền/Người'];
  
  // Write base headers
  for (let col = 1; col <= 6; col++) {
    const cell = expHeaderRow.getCell(col);
    cell.value = baseHeaders[col - 1];
    cell.font = fontHeader;
    cell.fill = fillPrimary;
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = borderThin;
  }

  // Write dynamic member names in headers (Columns G to P)
  for (let colIdx = 0; colIdx < 10; colIdx++) {
    const colNumber = 7 + colIdx;
    const cell = expHeaderRow.getCell(colNumber);
    // Link header directly to the member name in Summary Sheet
    cell.value = { formula: `='1. Tổng Hợp'!$B$${11 + colIdx}` };
    cell.font = fontHeader;
    cell.fill = fillPrimary;
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = borderThin;
  }

  // Write Helper headers (Columns Q to Z)
  for (let colIdx = 0; colIdx < 10; colIdx++) {
    const colNumber = 17 + colIdx;
    const cell = expHeaderRow.getCell(colNumber);
    cell.value = `Helper M${colIdx + 1}`;
    cell.font = fontItalic;
    cell.fill = fillHeaderTotal;
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = borderThin;
    
    // Make helper columns super narrow to keep sheet clean
    expenseSheet.getColumn(colNumber).width = 8;
  }

  // Example expenses data
  const exampleExpenses = [
    { item: 'Thuê xe du lịch di chuyển', payer: 'An', amount: 3000000, split: ['x', 'x', 'x', 'x', 'x', 'x', '', '', '', ''] },
    { item: 'Ăn tối hải sản ngày 1', payer: 'Bình', amount: 2400000, split: ['x', 'x', 'x', 'x', 'x', 'x', '', '', '', ''] },
    { item: 'Vé cổng khu du lịch', payer: 'Cường', amount: 1200000, split: ['x', 'x', 'x', 'x', 'x', 'x', '', '', '', ''] },
    { item: 'Nước ngọt & trái cây', payer: 'Lan', amount: 600000, split: ['x', 'x', 'x', 'x', 'x', 'x', '', '', '', ''] },
    { item: 'Ăn sáng cafe ngày 2', payer: 'Hoa', amount: 900000, split: ['x', 'x', 'x', 'x', 'x', 'x', '', '', '', ''] },
    { item: 'Khách sạn (đóng trước)', payer: 'An', amount: 4800000, split: ['x', 'x', 'x', 'x', 'x', 'x', '', '', '', ''] }
  ];

  // Write Rows (Rows 6 to 100)
  for (let rowIdx = 0; rowIdx < 95; rowIdx++) {
    const rowNum = 6 + rowIdx;
    const row = expenseSheet.getRow(rowNum);
    row.height = 20;

    const hasExample = rowIdx < exampleExpenses.length;
    const exData = hasExample ? exampleExpenses[rowIdx] : null;

    // A: STT
    row.getCell(1).value = rowIdx + 1;
    // B: Item
    row.getCell(2).value = exData ? exData.item : '';
    // C: Payer
    row.getCell(3).value = exData ? exData.payer : '';
    // D: Amount
    row.getCell(4).value = exData ? exData.amount : '';
    // E: Count = COUNTIF(G{rowNum}:P{rowNum}, "x")
    row.getCell(5).value = { formula: `=COUNTIF(G${rowNum}:P${rowNum}, "x")` };
    // F: Each Amount = IF(E{rowNum}>0, D{rowNum}/E{rowNum}, 0)
    row.getCell(6).value = { formula: `=IF(E${rowNum}>0, D${rowNum}/E${rowNum}, 0)` };

    // G to P: Members columns
    for (let colIdx = 0; colIdx < 10; colIdx++) {
      const colNumber = 7 + colIdx;
      row.getCell(colNumber).value = (exData && exData.split[colIdx] === 'x') ? 'x' : '';
    }

    // Q to Z: Helpers columns
    // Formula in Helper (Col 17) for Member 1 (Col 7): =IF(G{rowNum}="x", $F{rowNum}, 0)
    for (let colIdx = 0; colIdx < 10; colIdx++) {
      const helperColNum = 17 + colIdx;
      const memberColLetter = String.fromCharCode(71 + colIdx); // 71 is 'G'
      row.getCell(helperColNum).value = { formula: `=IF(${memberColLetter}${rowNum}="x", $F${rowNum}, 0)` };
    }

    // Styling
    row.eachCell((cell, colNumber) => {
      cell.font = fontNormal;
      cell.border = borderThin;

      // Alignments & formats
      if (colNumber === 1 || colNumber === 5 || (colNumber >= 7 && colNumber <= 16)) {
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
      }
      if (colNumber === 2 || colNumber === 3) {
        cell.alignment = { horizontal: 'left', vertical: 'middle' };
      }
      if (colNumber === 4 || colNumber === 6 || colNumber >= 17) {
        cell.alignment = { horizontal: 'right', vertical: 'middle' };
      }

      if (colNumber === 4 || colNumber === 6 || colNumber >= 17) {
        cell.numFormat = '#,##0';
      }

      // Soft coloring for checkboxes
      if (colNumber >= 7 && colNumber <= 16) {
        cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FF0F5132' } };
      }

      // Zebra formatting
      if (rowNum % 2 === 0) {
        cell.fill = fillZebra;
      }
    });

    // Add Data Validation for the Payer Column C
    row.getCell(3).dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: ["='1. Tổng Hợp'!$B$11:$B$20"] // Link to list of member names
    };
  }

  // Add Summary row at bottom (Row 101)
  const expTotalRow = expenseSheet.getRow(101);
  expTotalRow.height = 24;
  expTotalRow.getCell(1).value = '';
  expTotalRow.getCell(2).value = 'TỔNG CỘNG';
  expTotalRow.getCell(3).value = '';
  expTotalRow.getCell(4).value = { formula: '=SUM(D6:D100)' };
  expTotalRow.getCell(5).value = '';
  expTotalRow.getCell(6).value = '';

  for (let colIdx = 0; colIdx < 10; colIdx++) {
    const colNumber = 7 + colIdx;
    expTotalRow.getCell(colNumber).value = '';
  }

  for (let colIdx = 0; colIdx < 10; colIdx++) {
    const helperColNum = 17 + colIdx;
    const helperColChar = String.fromCharCode(81 + colIdx); // Q is 81
    expTotalRow.getCell(helperColNum).value = { formula: `=SUM(${helperColChar}6:${helperColChar}100)` };
  }

  expTotalRow.eachCell((cell, colNumber) => {
    cell.font = fontBold;
    cell.fill = fillSecondary;
    cell.border = borderDoubleBottom;

    if (colNumber === 4 || colNumber >= 17) {
      cell.numFormat = '#,##0" đ"';
      cell.alignment = { horizontal: 'right', vertical: 'middle' };
    }
    if (colNumber === 2) {
      cell.alignment = { horizontal: 'left', vertical: 'middle' };
    }
  });

  // Write workbook to file
  const destPath = path.join('e:\\sharing', 'Chia_Tien_Chuyen_Di.xlsx');
  await workbook.xlsx.writeFile(destPath);
  console.log(`Excel file created successfully at: ${destPath}`);
}

createExpenseExcel().catch(err => {
  console.error('Error generating Excel:', err);
  process.exit(1);
});
