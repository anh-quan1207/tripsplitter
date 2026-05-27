// ==========================================================================
// TripSplitter Core Logic & UI Bindings
// ==========================================================================

// Global state
let state = {
    members: [],
    expenses: []
};

// Mode for expense form (null for add, expenseId for edit)
let editModeExpenseId = null;

// Currency formatting helper
function formatVND(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
        .format(amount)
        .replace(/\u00a0g/g, '') // Clean formatting differences
        .trim();
}

// Custom number parser to handle commas
function parseAmount(val) {
    if (!val) return 0;
    // Remove dots, commas, spaces and currency symbols
    const clean = val.toString().replace(/[^\d]/g, '');
    return parseInt(clean, 10) || 0;
}

// Generate unique ID
function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

// Init data from localStorage or set defaults
function initData() {
    // Always load defaults to ensure hardcoded fixed state per request
    loadDefaults();
}

// Load nice default sample data to WOW the user on first load
function loadDefaults() {
    const memberIds = [
        'member_quan',
        'member_binh',
        'member_dat',
        'member_nam',
        'member_vinh',
        'member_duy',
        'member_thuy'
    ];
    
    state.members = [
        { id: 'member_quan', name: 'Quân', prepaid: 6000000 },
        { id: 'member_binh', name: 'Bình', prepaid: 6000000 },
        { id: 'member_dat', name: 'Đạt', prepaid: 6000000 },
        { id: 'member_nam', name: 'Nam', prepaid: 6000000 },
        { id: 'member_vinh', name: 'Vinh', prepaid: 6000000 },
        { id: 'member_duy', name: 'Duy', prepaid: 6000000 },
        { id: 'member_thuy', name: 'Thủy', prepaid: 6000000 }
    ];

    state.expenses = [
        {
            id: generateId(),
            name: 'Xe ra sân bay lượt đi',
            payerId: 'member_quan',
            amount: 330000,
            participantIds: ['member_quan', 'member_binh', 'member_dat', 'member_duy', 'member_thuy']
        },
        {
            id: generateId(),
            name: 'Ăn sáng',
            payerId: 'member_quan',
            amount: 525000,
            participantIds: [...memberIds]
        },
        {
            id: generateId(),
            name: 'Nước lọc',
            payerId: 'member_quan',
            amount: 25000,
            participantIds: [...memberIds]
        },
        {
            id: generateId(),
            name: 'Ăn cơm trưa Bếp Vừng',
            payerId: 'member_quan',
            amount: 1064000,
            participantIds: [...memberIds]
        },
        {
            id: generateId(),
            name: 'Ăn cơm Bà Buội Hội An',
            payerId: 'member_quan',
            amount: 862000,
            participantIds: [...memberIds]
        },
        {
            id: generateId(),
            name: 'Bà Nà Hills',
            payerId: 'member_quan',
            amount: 9000000,
            participantIds: [...memberIds]
        },
        {
            id: generateId(),
            name: 'Tiền phòng',
            payerId: 'member_quan',
            amount: 8340000,
            participantIds: [...memberIds]
        },
        {
            id: generateId(),
            name: 'Chọn ghế MB',
            payerId: 'member_quan',
            amount: 280000,
            participantIds: [...memberIds]
        },
        {
            id: generateId(),
            name: 'Cơm tối thứ 2',
            payerId: 'member_quan',
            amount: 840000,
            participantIds: [...memberIds]
        },
        {
            id: generateId(),
            name: 'Tiền xe ngày 1',
            payerId: 'member_quan',
            amount: 1700000,
            participantIds: [...memberIds]
        },
        {
            id: generateId(),
            name: 'Nước',
            payerId: 'member_quan',
            amount: 120000,
            participantIds: [...memberIds]
        },
        {
            id: generateId(),
            name: 'Coffee ngày 1',
            payerId: 'member_quan',
            amount: 615000,
            participantIds: [...memberIds]
        },
        {
            id: generateId(),
            name: 'Nước Mót Hội An',
            payerId: 'member_quan',
            amount: 140000,
            participantIds: [...memberIds]
        },
        {
            id: generateId(),
            name: 'Xe sân bay về',
            payerId: 'member_quan',
            amount: 300000,
            participantIds: ['member_quan', 'member_binh', 'member_dat', 'member_duy', 'member_thuy']
        },
        {
            id: generateId(),
            name: 'Tiền mặt trả tiền taxi, nước,.....',
            payerId: 'member_quan',
            amount: 300000,
            participantIds: [...memberIds]
        },
        {
            id: generateId(),
            name: 'Vé MB+kí gửi',
            payerId: 'member_quan',
            amount: 25528000,
            participantIds: [...memberIds]
        },
        {
            id: generateId(),
            name: 'Ăn Poseidon',
            payerId: 'member_quan',
            amount: 4300000,
            participantIds: [...memberIds]
        },
        {
            id: generateId(),
            name: 'Tiền taxi đi lại',
            payerId: 'member_binh',
            amount: 230000,
            participantIds: ['member_binh', 'member_quan', 'member_duy', 'member_thuy']
        }
    ];
    saveToStorage();
}

function saveToStorage() {
    localStorage.setItem('tripsplitter_state', JSON.stringify(state));
}

// CORE CALCULATIONS
function calculateCalculatedBalances() {
    // 1. Initialize balances structure
    const stats = {};
    state.members.forEach(member => {
        stats[member.id] = {
            id: member.id,
            name: member.name,
            prepaid: member.prepaid || 0,
            outOfPocket: 0,
            totalPaid: 0,
            totalSpent: 0,
            balance: 0
        };
    });

    // 2. Add up out-of-pocket payments (who paid)
    state.expenses.forEach(exp => {
        if (stats[exp.payerId]) {
            stats[exp.payerId].outOfPocket += exp.amount;
        }
        
        // 3. Add up shares (who spent)
        const participants = exp.participantIds || [];
        if (participants.length > 0) {
            const share = exp.amount / participants.length;
            participants.forEach(pId => {
                if (stats[pId]) {
                    stats[pId].totalSpent += share;
                }
            });
        }
    });

    // 4. Calculate Net Balances (Prepaid + OutOfPocket - Spent)
    state.members.forEach(member => {
        const pStats = stats[member.id];
        pStats.totalPaid = pStats.prepaid + pStats.outOfPocket;
        pStats.balance = pStats.totalPaid - pStats.totalSpent;
    });

    return stats;
}

// Settlement Optimizer Algorithm (Greedy approach)
function calculateSettlements(stats) {
    const debtors = [];
    const creditors = [];

    // Separate members into debtors (owe money) and creditors (receive money)
    Object.values(stats).forEach(p => {
        // Round to prevent tiny float point leftovers (e.g. 0.000001)
        const bal = Math.round(p.balance);
        if (bal < 0) {
            debtors.push({ id: p.id, name: p.name, balance: bal });
        } else if (bal > 0) {
            creditors.push({ id: p.id, name: p.name, balance: bal });
        }
    });

    // Sort debtors ascending (most negative first)
    debtors.sort((a, b) => a.balance - b.balance);
    // Sort creditors descending (most positive first)
    creditors.sort((a, b) => b.balance - a.balance);

    const transactions = [];
    let dIdx = 0;
    let cIdx = 0;

    while (dIdx < debtors.length && cIdx < creditors.length) {
        const debtor = debtors[dIdx];
        const creditor = creditors[cIdx];

        const amountToTransfer = Math.min(-debtor.balance, creditor.balance);
        
        if (amountToTransfer > 0) {
            transactions.push({
                from: debtor.name,
                to: creditor.name,
                amount: amountToTransfer
            });
            
            // Adjust balances
            debtor.balance += amountToTransfer;
            creditor.balance -= amountToTransfer;
        }

        // If debtor has cleared their debt, move to next debtor
        if (Math.round(debtor.balance) === 0) {
            dIdx++;
        }
        // If creditor has received all their credit, move to next creditor
        if (Math.round(creditor.balance) === 0) {
            cIdx++;
        }
    }

    return transactions;
}

// UI RENDERING FUNCTIONS
function renderAll() {
    const stats = calculateCalculatedBalances();
    const settlements = calculateSettlements(stats);

    renderDashboardStats(stats);
    renderMembersList(stats);
    renderExpensePayerDropdown();
    renderParticipantsChecklist();
    renderExpensesTable();
    renderSettlements(settlements);
}

function renderDashboardStats(stats) {
    const totalCost = state.expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const memberCount = state.members.length;
    const avg = memberCount > 0 ? totalCost / memberCount : 0;

    document.getElementById('total-trip-cost').textContent = formatVND(totalCost);
    document.getElementById('avg-cost').textContent = formatVND(avg);
    document.getElementById('member-count').textContent = memberCount;
}

function renderMembersList(stats) {
    const container = document.getElementById('member-list-container');
    container.innerHTML = '';

    if (state.members.length === 0) {
        container.innerHTML = `<p class="empty-state-text">Chưa có thành viên nào.</p>`;
        return;
    }

    state.members.forEach((member, index) => {
        const pStats = stats[member.id] || { totalPaid: 0, totalSpent: 0, balance: 0, outOfPocket: 0 };
        const bal = Math.round(pStats.balance);
        
        let balClass = 'balance-zero';
        let balText = 'Hoàn thành';
        
        if (bal > 0) {
            balClass = 'balance-positive';
            balText = `Nhận: +${formatVND(bal)}`;
        } else if (bal < 0) {
            balClass = 'balance-negative';
            balText = `Trả: ${formatVND(bal)}`;
        }

        // Get initials for avatar
        const initials = member.name.trim().split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

        const card = document.createElement('div');
        card.className = 'member-card';
        card.innerHTML = `
            <div class="member-info" style="flex: 1;">
                <div class="member-avatar">${initials}</div>
                <div class="member-details" style="flex: 1;">
                    <div class="flex-between" style="align-items: center; gap: 0.5rem; width: 100%;">
                        <span class="member-name">${member.name}</span>
                        <div class="member-prepaid-input-wrapper" title="Nhập số tiền thành viên này đã đóng quỹ trước">
                            <span class="prepaid-label">Quỹ:</span>
                            <input type="text" class="member-prepaid-input" data-id="${member.id}" value="${(member.prepaid || 0).toLocaleString('vi-VN')}" placeholder="0">
                        </div>
                    </div>
                    <div class="flex-between" style="font-size: 0.75rem; margin-top: 0.2rem;">
                        <span style="font-size: 0.7rem; opacity: 0.7;">Chi riêng: ${formatVND(pStats.outOfPocket)}</span>
                        <span class="member-balance ${balClass}" style="font-weight: 700;">${balText}</span>
                    </div>
                </div>
            </div>
            <button class="delete-member-btn" data-id="${member.id}" title="Xóa thành viên này" style="margin-left: 0.5rem;">
                <i class="fa-regular fa-trash-can"></i>
            </button>
        `;

        // Bind delete event
        card.querySelector('.delete-member-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            deleteMember(member.id);
        });

        // Bind prepaid input events
        const prepaidInput = card.querySelector('.member-prepaid-input');
        prepaidInput.addEventListener('input', (e) => {
            let value = e.target.value;
            const numericValue = parseAmount(value);
            if (numericValue === 0) {
                e.target.value = '';
            } else {
                e.target.value = numericValue.toLocaleString('vi-VN');
            }
        });
        
        prepaidInput.addEventListener('change', (e) => {
            const numericValue = parseAmount(e.target.value);
            member.prepaid = numericValue;
            saveToStorage();
            renderAll();
        });
        
        prepaidInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                prepaidInput.blur();
            }
        });

        container.appendChild(card);
    });
}

function renderExpensePayerDropdown() {
    const select = document.getElementById('expense-payer');
    const currentVal = select.value;
    
    select.innerHTML = '<option value="" disabled selected>Chọn người trả tiền...</option>';
    
    state.members.forEach(member => {
        const option = document.createElement('option');
        option.value = member.id;
        option.textContent = member.name;
        select.appendChild(option);
    });

    if (currentVal && state.members.some(m => m.id === currentVal)) {
        select.value = currentVal;
    }
}

function renderParticipantsChecklist() {
    const grid = document.getElementById('participants-grid');
    grid.innerHTML = '';

    if (state.members.length === 0) {
        grid.innerHTML = `<p class="empty-state-text">Vui lòng thêm thành viên trước để chọn chia tiền.</p>`;
        return;
    }

    state.members.forEach(member => {
        const label = document.createElement('label');
        label.className = 'participant-checkbox-label selected'; // Default selected
        label.setAttribute('data-id', member.id);
        label.innerHTML = `
            <input type="checkbox" value="${member.id}" checked>
            <span>${member.name}</span>
        `;

        const checkbox = label.querySelector('input');
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                label.classList.add('selected');
            } else {
                label.classList.remove('selected');
            }
        });

        grid.appendChild(label);
    });
}

function renderExpensesTable() {
    const tbody = document.getElementById('expenses-table-body');
    tbody.innerHTML = '';

    if (state.expenses.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="table-empty-state">
                    <i class="fa-regular fa-folder-open"></i>
                    <p>Chưa có khoản chi tiêu nào. Hãy thêm khoản chi ở trên!</p>
                </td>
            </tr>
        `;
        return;
    }

    state.expenses.forEach((exp, idx) => {
        const payer = state.members.find(m => m.id === exp.payerId);
        const payerName = payer ? payer.name : '<Đã xóa>';
        const pCount = exp.participantIds ? exp.participantIds.length : 0;
        const share = pCount > 0 ? exp.amount / pCount : 0;

        // Build list of participant names
        const tagBadges = (exp.participantIds || []).map(pId => {
            const m = state.members.find(m => m.id === pId);
            return m ? `<span class="tag-badge">${m.name}</span>` : '';
        }).join('');

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${idx + 1}</td>
            <td style="font-weight: 600;">${exp.name}</td>
            <td><span class="member-avatar" style="width: 22px; height: 22px; font-size: 0.6rem; display: inline-flex; margin-right: 0.4rem; vertical-align: middle;">${payerName.charAt(0).toUpperCase()}</span>${payerName}</td>
            <td class="text-right" style="font-weight: 600; color: var(--primary);">${formatVND(exp.amount)}</td>
            <td class="text-center"><span class="badge" style="background-color: var(--primary-light); color: var(--primary); padding: 0.2rem 0.5rem; border-radius: 10px; font-weight: 700; font-size: 0.75rem;">${pCount}</span></td>
            <td class="text-right text-muted">${formatVND(share)}</td>
            <td>
                <div class="participants-tags-list">
                    ${tagBadges}
                </div>
            </td>
            <td>
                <div class="action-btn-group">
                    <button class="btn-icon-edit" data-id="${exp.id}" title="Sửa khoản chi"><i class="fa-regular fa-pen-to-square"></i></button>
                    <button class="btn-icon-danger" data-id="${exp.id}" title="Xóa khoản chi"><i class="fa-regular fa-trash-can"></i></button>
                </div>
            </td>
        `;

        // Bind Edit/Delete
        tr.querySelector('.btn-icon-edit').addEventListener('click', () => editExpense(exp.id));
        tr.querySelector('.btn-icon-danger').addEventListener('click', () => deleteExpense(exp.id));

        tbody.appendChild(tr);
    });
}

function renderSettlements(settlements) {
    const container = document.getElementById('settlement-list-container');
    container.innerHTML = '';

    if (settlements.length === 0) {
        container.innerHTML = `
            <div class="empty-settlement">
                <i class="fa-solid fa-circle-check" style="color: var(--accent);"></i>
                <p>Mọi khoản chi tiêu đều cân bằng. Không có giao dịch cần thực hiện!</p>
            </div>
        `;
        return;
    }

    settlements.forEach(tx => {
        const item = document.createElement('div');
        item.className = 'settlement-item';
        item.innerHTML = `
            <div class="settlement-main">
                <div>
                    <span class="payer-name">${tx.from}</span>
                    <i class="fa-solid fa-arrow-right-long transfer-arrow"></i>
                    <span class="receiver-name">${tx.to}</span>
                </div>
                <span class="transfer-amount">${formatVND(tx.amount)}</span>
            </div>
            <div class="settlement-bank-info">
                Nội dung chuyển khoản gợi ý: <strong>${tx.from} chuyen tien TripSplitter</strong>
            </div>
        `;
        container.appendChild(item);
    });
}

// CONTROLLER ACTIONS
function addMember(name) {
    name = name.trim();
    if (!name) return;
    
    // Check duplication
    if (state.members.some(m => m.name.toLowerCase() === name.toLowerCase())) {
        alert('Tên thành viên đã tồn tại!');
        return;
    }

    const newMember = {
        id: generateId(),
        name: name
    };

    state.members.push(newMember);
    saveToStorage();
    renderAll();
    
    // Select the new member in dynamic form checkmarks
    // After render, we make sure they are checked
    const newlyAddedLabel = document.querySelector(`.participant-checkbox-label[data-id="${newMember.id}"]`);
    if (newlyAddedLabel) {
        const cb = newlyAddedLabel.querySelector('input');
        cb.checked = true;
        newlyAddedLabel.classList.add('selected');
    }
}

function deleteMember(id) {
    if (confirm('Xóa thành viên này sẽ xóa họ ra khỏi toàn bộ các khoản chi tiêu đang có. Bạn có chắc muốn xóa không?')) {
        // Remove member
        state.members = state.members.filter(m => m.id !== id);
        
        // Update expenses
        state.expenses.forEach(exp => {
            // If the payer is deleted, assign to the first remaining member or null
            if (exp.payerId === id) {
                exp.payerId = state.members.length > 0 ? state.members[0].id : '';
            }
            // Remove from participants list
            if (exp.participantIds) {
                exp.participantIds = exp.participantIds.filter(pId => pId !== id);
            }
        });

        // Filter out expenses with no participants or empty payers
        state.expenses = state.expenses.filter(exp => exp.payerId !== '' && exp.participantIds.length > 0);

        saveToStorage();
        renderAll();
    }
}

function saveExpense(e) {
    e.preventDefault();

    const name = document.getElementById('expense-name').value.trim();
    const amountVal = document.getElementById('expense-amount').value;
    const payerId = document.getElementById('expense-payer').value;

    if (!name || !amountVal || !payerId) {
        alert('Vui lòng nhập đầy đủ thông tin bắt buộc!');
        return;
    }

    const amount = parseAmount(amountVal);
    if (amount <= 0) {
        alert('Số tiền chi phải lớn hơn 0 đ!');
        return;
    }

    // Get selected participants
    const checkboxes = document.querySelectorAll('#participants-grid input[type="checkbox"]');
    const participantIds = [];
    checkboxes.forEach(cb => {
        if (cb.checked) {
            participantIds.push(cb.value);
        }
    });

    if (participantIds.length === 0) {
        alert('Vui lòng chọn ít nhất 1 thành viên tham gia chia tiền!');
        return;
    }

    if (editModeExpenseId) {
        // Edit mode
        const exp = state.expenses.find(e => e.id === editModeExpenseId);
        if (exp) {
            exp.name = name;
            exp.amount = amount;
            exp.payerId = payerId;
            exp.participantIds = participantIds;
        }
        editModeExpenseId = null;
        document.getElementById('save-expense-btn').innerHTML = '<i class="fa-solid fa-save"></i> Lưu Khoản Chi';
        document.getElementById('save-expense-btn').className = 'btn-primary';
    } else {
        // Add mode
        const newExp = {
            id: generateId(),
            name: name,
            payerId: payerId,
            amount: amount,
            participantIds: participantIds
        };
        state.expenses.push(newExp);
    }

    // Reset form
    document.getElementById('expense-form').reset();
    
    // Reset participant checkmarks to checked
    const labels = document.querySelectorAll('.participant-checkbox-label');
    labels.forEach(lbl => {
        const cb = lbl.querySelector('input');
        cb.checked = true;
        lbl.classList.add('selected');
    });

    saveToStorage();
    renderAll();
}

function editExpense(id) {
    const exp = state.expenses.find(e => e.id === id);
    if (!exp) return;

    editModeExpenseId = id;
    
    // Pre-fill form
    document.getElementById('expense-name').value = exp.name;
    document.getElementById('expense-amount').value = exp.amount.toLocaleString('vi-VN');
    document.getElementById('expense-payer').value = exp.payerId;

    // Pre-fill checkboxes
    const labels = document.querySelectorAll('.participant-checkbox-label');
    labels.forEach(lbl => {
        const mId = lbl.getAttribute('data-id');
        const cb = lbl.querySelector('input');
        if (exp.participantIds.includes(mId)) {
            cb.checked = true;
            lbl.classList.add('selected');
        } else {
            cb.checked = false;
            lbl.classList.remove('selected');
        }
    });

    // Change save button style
    const saveBtn = document.getElementById('save-expense-btn');
    saveBtn.innerHTML = '<i class="fa-regular fa-pen-to-square"></i> Cập Nhật Khoản Chi';
    saveBtn.className = 'btn-success';
    
    // Scroll form into view
    document.getElementById('expense-form').scrollIntoView({ behavior: 'smooth' });
}

function deleteExpense(id) {
    if (confirm('Bạn có chắc muốn xóa khoản chi tiêu này không?')) {
        state.expenses = state.expenses.filter(e => e.id !== id);
        saveToStorage();
        renderAll();
    }
}

// EXPORT TO EXCEL FEATURE (USING SHEETJS CLIENT-SIDE)
function exportToExcel() {
    if (state.members.length === 0) {
        alert('Vui lòng thêm thành viên trước khi xuất Excel!');
        return;
    }

    const wb = XLSX.utils.book_new();

    // ----------------------------------------------------
    // SHEET 1: TỔNG HỢP (SUMMARY)
    // ----------------------------------------------------
    const summaryData = [
        ['BẢNG CÂN ĐỐI & CHIA TIỀN CHUYẾN ĐI'],
        [],
        ['HƯỚNG DẪN SỬ DỤNG:'],
        ['1. Nhập tên các thành viên vào cột "Tên Thành Viên" (tối đa 10 người).'],
        ['2. Nhập số tiền mỗi người đã đóng quỹ trước vào cột "Tiền Đóng Quỹ (1)".'],
        ['3. Sang sheet "2. Chi Tiết Chi Tiêu" để nhập các khoản chi riêng, người chi, số tiền và tích "x" cho những ai tham gia.'],
        ['4. Bảng này sẽ tự động tính toán chi tiết bằng công thức Excel.'],
        [],
        ['DANH SÁCH THÀNH VIÊN & TỔNG HỢP TÀI CHÍNH'],
        ['STT', 'Tên Thành Viên', 'Tiền Đóng Quỹ (1)', 'Chi Thêm Riêng (2)', 'Tổng Cộng Đã Đóng (3) = (1)+(2)', 'Tổng Thực Chi (4)', 'Còn Lại (3) - (4)', 'Trạng Thái']
    ];

    // Prepopulate 10 rows for members (using formula links)
    const MAX_MEMBERS = 10;
    for (let i = 0; i < MAX_MEMBERS; i++) {
        const member = state.members[i];
        const memberName = member ? member.name : `Thành viên ${i + 1}`;
        const rowNum = 11 + i; // row index in sheet (1-based, index 11 is row 11)
        
        const helperColLetter = String.fromCharCode(81 + i); // Q, R, S...
        
        summaryData.push([
            i + 1,
            memberName,
            // C: Prepaid Fund
            member ? member.prepaid : 0,
            // D: Out of pocket Paid Formula
            { f: `SUMIF('2. Chi Tiết Chi Tiêu'!$C$6:$C$105, B${rowNum}, '2. Chi Tiết Chi Tiêu'!$D$6:$D$105)` },
            // E: Total Paid Formula
            { f: `C${rowNum}+D${rowNum}` },
            // F: Spent Formula
            { f: `SUM('2. Chi Tiết Chi Tiêu'!${helperColLetter}$6:${helperColLetter}$105)` },
            // G: Balance Formula
            { f: `E${rowNum}-F${rowNum}` },
            // H: Status Formula
            { f: `IF(G${rowNum}>0, "Nhận lại: " & TEXT(G${rowNum}, "#,##0 đ"), IF(G${rowNum}<0, "Đóng thêm: " & TEXT(-G${rowNum}, "#,##0 đ"), "Đã xong"))` }
        ]);
    }

    // Add Totals row
    summaryData.push([
        '',
        'TỔNG CỘNG',
        { f: 'SUM(C11:C20)' },
        { f: 'SUM(D11:D20)' },
        { f: 'SUM(E11:E20)' },
        { f: 'SUM(F11:F20)' },
        { f: 'SUM(G11:G20)' },
        { f: 'IF(ROUND(G21, 0)=0, "Khớp 100% (Hoàn thành)", "Lệch: " & TEXT(G21, "#,##0 đ"))' }
    ]);

    const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);

    // Apply styles to Summary Sheet (Column widths)
    wsSummary['!cols'] = [
        { wch: 6 },  // A
        { wch: 22 }, // B
        { wch: 18 }, // C
        { wch: 18 }, // D
        { wch: 22 }, // E
        { wch: 18 }, // F
        { wch: 18 }, // G
        { wch: 26 }  // H
    ];

    // Merge title
    wsSummary['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 1, c: 7 } } // A1:H2
    ];

    // ----------------------------------------------------
    // SHEET 2: CHI TIẾT CHI TIÊU (EXPENSES)
    // ----------------------------------------------------
    // Headers list
    const expHeaders = ['STT', 'Khoản Chi', 'Người Chi', 'Số Tiền Chi', 'Số Người', 'Tiền/Người'];
    
    // Add member names to headers (10 columns G to P)
    for (let i = 0; i < MAX_MEMBERS; i++) {
        expHeaders.push({ f: `='1. Tổng Hợp'!$B$${11 + i}` });
    }
    
    // Add helper headers to columns Q to Z
    for (let i = 0; i < MAX_MEMBERS; i++) {
        expHeaders.push(`Helper M${i + 1}`);
    }

    const expenseData = [
        ['DANH SÁCH CHI TIÊU & PHÂN CHIA CHI TIẾT'],
        [],
        ['Mẹo: Ở mỗi hàng, chọn Người Chi ở cột C, nhập Số Tiền ở cột D, rồi nhập chữ "x" (hoặc ký tự bất kỳ) vào cột tên của những người tham gia để chia tiền.'],
        [],
        expHeaders
    ];

    // Populate rows (from Row 6 to 105)
    const MAX_EXPENSES_ROWS = 100;
    for (let r = 0; r < MAX_EXPENSES_ROWS; r++) {
        const exp = state.expenses[r];
        const rowNum = 6 + r; // row index in sheet

        const row = [
            r + 1,
            exp ? exp.name : '',
            exp ? (state.members.find(m => m.id === exp.payerId)?.name || '') : '',
            exp ? exp.amount : '',
            // E: Participant count formula
            { f: `COUNTIF(G${rowNum}:P${rowNum}, "x")` },
            // F: Share per person formula
            { f: `IF(E${rowNum}>0, D${rowNum}/E${rowNum}, 0)` }
        ];

        // G to P: Participant "x" checkmarks
        for (let i = 0; i < MAX_MEMBERS; i++) {
            const member = state.members[i];
            if (exp && member && exp.participantIds.includes(member.id)) {
                row.push('x');
            } else {
                row.push('');
            }
        }

        // Q to Z: Helper formula columns
        for (let i = 0; i < MAX_MEMBERS; i++) {
            const memberColLetter = String.fromCharCode(71 + i); // G, H, I...
            row.push({ f: `IF(${memberColLetter}${rowNum}="x", $F${rowNum}, 0)` });
        }

        expenseData.push(row);
    }

    // Add Expenses Totals Row (Row 106)
    const expTotalRowIndex = 6 + MAX_EXPENSES_ROWS; // Row 106
    const expTotalRow = [
        '',
        'TỔNG CỘNG',
        '',
        { f: 'SUM(D6:D105)' },
        '',
        ''
    ];
    // Empty cells for G to P columns
    for (let i = 0; i < MAX_MEMBERS; i++) {
        expTotalRow.push('');
    }
    // Helper SUM formulas for Q to Z columns
    for (let i = 0; i < MAX_MEMBERS; i++) {
        const helperColLetter = String.fromCharCode(81 + i); // Q, R, S...
        expTotalRow.push({ f: `SUM(${helperColLetter}6:${helperColLetter}105)` });
    }
    expenseData.push(expTotalRow);

    const wsExpense = XLSX.utils.aoa_to_sheet(expenseData);

    // Apply styles (Column widths)
    const colWidths = [
        { wch: 5 },  // A: STT
        { wch: 25 }, // B: Item
        { wch: 15 }, // C: Payer
        { wch: 15 }, // D: Amount
        { wch: 10 }, // E: Count
        { wch: 14 }  // F: Each
    ];
    // Member cols G to P
    for (let i = 0; i < MAX_MEMBERS; i++) {
        colWidths.push({ wch: 10 });
    }
    // Helper cols Q to Z
    for (let i = 0; i < MAX_MEMBERS; i++) {
        colWidths.push({ wch: 8 });
    }
    wsExpense['!cols'] = colWidths;

    // Merge title
    wsExpense['!merges'] = [
        { s: { r: 0, c: 0 }, e: { r: 1, c: 15 } } // A1:P2
    ];

    // Append sheets to workbook
    XLSX.utils.book_append_sheet(wb, wsSummary, '1. Tổng Hợp');
    XLSX.utils.book_append_sheet(wb, wsExpense, '2. Chi Tiết Chi Tiêu');

    // Save/Download Excel file
    XLSX.writeFile(wb, 'TripSplitter_Chia_Tien.xlsx');
}

// IMPORT FROM EXCEL FEATURE (USING SHEETJS CLIENT-SIDE)
function importFromExcel(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            // Read Sheet 1: "1. Tổng Hợp"
            const summarySheet = workbook.Sheets['1. Tổng Hợp'];
            if (!summarySheet) {
                alert('File Excel không đúng định dạng TripSplitter (Không tìm thấy sheet "1. Tổng Hợp")!');
                return;
            }
            
            // Read Sheet 2: "2. Chi Tiết Chi Tiêu"
            const expenseSheet = workbook.Sheets['2. Chi Tiết Chi Tiêu'];
            if (!expenseSheet) {
                alert('File Excel không đúng định dạng TripSplitter (Không tìm thấy sheet "2. Chi Tiết Chi Tiêu")!');
                return;
            }
            
            // Parse Members from "1. Tổng Hợp" (Row 11 to 20, Column B and prepaid from Column C)
            // Row index 10 to 19 in 0-based indexing. Column B is 1, Column C is 2
            const importedMembers = [];
            const memberNameMap = {}; // name -> id
            
            for (let r = 10; r <= 19; r++) {
                const nameCellRef = XLSX.utils.encode_cell({ r: r, c: 1 });
                const prepaidCellRef = XLSX.utils.encode_cell({ r: r, c: 2 });
                const nameCell = summarySheet[nameCellRef];
                const prepaidCell = summarySheet[prepaidCellRef];
                
                if (nameCell && nameCell.v !== undefined && nameCell.v !== null) {
                    const name = nameCell.v.toString().trim();
                    if (name) {
                        const id = generateId();
                        const prepaid = prepaidCell && prepaidCell.v !== undefined && prepaidCell.v !== null ? parseInt(prepaidCell.v) || 0 : 0;
                        importedMembers.push({ id, name, prepaid });
                        memberNameMap[name.toLowerCase()] = id;
                    }
                }
            }
            
            if (importedMembers.length === 0) {
                alert('Không tìm thấy thành viên hợp lệ trong sheet "1. Tổng Hợp"! Vui lòng điền tên thành viên vào cột B.');
                return;
            }
            
            // Parse dynamic member columns in sheet 2 (Columns G to P, indices 6 to 15)
            // Headers are at Row 5 (index 4)
            const colToMemberId = {};
            for (let c = 6; c <= 15; c++) {
                const cellRef = XLSX.utils.encode_cell({ r: 4, c: c });
                const cell = expenseSheet[cellRef];
                if (cell && cell.v) {
                    const name = cell.v.toString().trim();
                    const memberId = memberNameMap[name.toLowerCase()];
                    if (memberId) {
                        colToMemberId[c] = memberId;
                    }
                }
            }
            
            const importedExpenses = [];
            // Data rows start from Row 6 (index 5) to Row 105 (index 104)
            for (let r = 5; r <= 104; r++) {
                const itemCell = expenseSheet[XLSX.utils.encode_cell({ r: r, c: 1 })]; // Col B (1)
                const payerCell = expenseSheet[XLSX.utils.encode_cell({ r: r, c: 2 })]; // Col C (2)
                const amountCell = expenseSheet[XLSX.utils.encode_cell({ r: r, c: 3 })]; // Col D (3)
                
                if (itemCell && itemCell.v !== undefined && itemCell.v !== null && amountCell && amountCell.v !== undefined && amountCell.v !== null) {
                    const itemName = itemCell.v.toString().trim();
                    const amount = parseInt(amountCell.v) || 0;
                    
                    if (itemName && amount > 0) {
                        const payerName = payerCell ? payerCell.v.toString().trim() : '';
                        const payerId = memberNameMap[payerName.toLowerCase()] || importedMembers[0].id;
                        
                        const participantIds = [];
                        // Check checkbox columns (Columns G to P, indices 6 to 15)
                        for (let c = 6; c <= 15; c++) {
                            const checkCell = expenseSheet[XLSX.utils.encode_cell({ r: r, c: c })];
                            if (checkCell && checkCell.v && checkCell.v.toString().toLowerCase() === 'x') {
                                const mId = colToMemberId[c];
                                if (mId) {
                                    participantIds.push(mId);
                                }
                            }
                        }
                        
                        // If no checkmarks were entered, default to all imported members participating
                        if (participantIds.length === 0) {
                            participantIds.push(...importedMembers.map(m => m.id));
                        }
                        
                        importedExpenses.push({
                            id: generateId(),
                            name: itemName,
                            payerId: payerId,
                            amount: amount,
                            participantIds: participantIds
                        });
                    }
                }
            }
            
            // Confirm with user before overwriting current data if current data exists
            if (state.members.length > 0 && !confirm('Nhập Excel sẽ ghi đè và thay thế toàn bộ dữ liệu thành viên và chi phí hiện tại trên màn hình. Bạn có chắc chắn muốn tiếp tục?')) {
                return;
            }
            
            // Update state
            state.members = importedMembers;
            state.expenses = importedExpenses;
            saveToStorage();
            renderAll();
            
            alert(`Nhập dữ liệu thành công! Đã nhập ${importedMembers.length} thành viên và ${importedExpenses.length} khoản chi tiêu.`);
        } catch (error) {
            console.error('Lỗi khi đọc file Excel:', error);
            alert('Có lỗi xảy ra khi đọc file Excel. Vui lòng đảm bảo file được chỉnh sửa đúng từ file mẫu của TripSplitter!');
        }
    };
    reader.onerror = function() {
        alert('Không thể đọc file!');
    };
    reader.readAsArrayBuffer(file);
}

// Function to show Ghi Chú Chuyển Tiền modal
function showNoteModal() {
    const modal = document.getElementById('note-modal');
    const container = document.getElementById('modal-note-cards');
    const textarea = document.getElementById('copy-note-text');
    
    // 1. Calculate stats using our core calculations
    const statsObj = calculateCalculatedBalances();
    const stats = Object.values(statsObj);
    
    // 2. Generate individual cards
    container.innerHTML = '';
    
    stats.forEach(m => {
        const card = document.createElement('div');
        card.className = 'note-member-card';
        
        let statusRow = '';
        if (m.id === 'member_quan') {
            statusRow = `
                <div class="note-card-row highlight">
                    <span>Trạng thái:</span>
                    <span>Nhận lại ${formatVND(m.balance)}</span>
                </div>
            `;
        } else {
            statusRow = `
                <div class="note-card-row warning">
                    <span>Cần chuyển cho Quân:</span>
                    <span>${formatVND(Math.abs(m.balance))}</span>
                </div>
            `;
        }
        
        card.innerHTML = `
            <div class="note-card-title">${m.name}</div>
            <div class="note-card-row">
                <span>Số tiền đóng quỹ:</span>
                <span>${formatVND(m.prepaid)}</span>
            </div>
            <div class="note-card-row">
                <span>Tự chi thêm riêng:</span>
                <span>${formatVND(m.outOfPocket)}</span>
            </div>
            <div class="note-card-row">
                <span>Tổng thực chi (tiêu):</span>
                <span>${formatVND(m.totalSpent)}</span>
            </div>
            ${statusRow}
        `;
        container.appendChild(card);
    });
    
    // 3. Generate copyable Zalo/Messenger text
    let totalCost = state.expenses.reduce((sum, e) => sum + e.amount, 0);
    let sharePerPerson = Math.round(totalCost / state.members.length);
    
    let text = `--- 📝 TỔNG HỢP CHIA TIỀN CHUYẾN ĐI ĐÀ NẴNG - HỘI AN ---\n`;
    text += `💰 Tổng chi phí chuyến đi: ${formatVND(totalCost)}\n`;
    text += `👥 Số thành viên: ${state.members.length} người\n`;
    text += `💸 Tiêu chuẩn thực chi mỗi người: ${formatVND(sharePerPerson)}\n`;
    text += `🎒 Quỹ đã đóng trước: ${formatVND(6000000)} / người\n\n`;
    text += `--------------------------------------------------\n`;
    text += `👉 PHƯƠNG ÁN CHUYỂN KHOẢN CHI TIẾT:\n`;
    text += `(Bàn giao lại toàn bộ 42.000.000 đ tiền quỹ đóng trước cho Quân nếu hiện tại người khác đang giữ)\n\n`;
    
    let index = 1;
    stats.forEach(m => {
        if (m.id !== 'member_quan') {
            text += `${index}. ${m.name}: Chuyển cho Quân -> ${formatVND(Math.abs(m.balance))}\n`;
            index++;
        }
    });
    
    const quanStat = stats.find(m => m.id === 'member_quan');
    const quanReceive = quanStat ? quanStat.balance : 0;
    
    text += `\n🎉 Quân nhận lại tổng cộng: ${formatVND(quanReceive - 42000000)} (từ 6 bạn chuyển khoản) + 42.000.000 đ (tiền quỹ chung).\n`;
    text += `--------------------------------------------------\n`;
    text += `Tạo bởi TripSplitter - Chia tiền thông minh & chính xác!`;
    
    textarea.value = text;
    
    // Display modal
    modal.style.display = 'flex';
}

// BIND ACTIONS & EVENT LISTENERS
document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize data
    initData();
    renderAll();

    // 2. Add Member Button Handler
    const addMemberBtn = document.getElementById('add-member-btn');
    const memberInput = document.getElementById('member-name-input');
    
    const handleAddMember = () => {
        const name = memberInput.value;
        if (name.trim()) {
            addMember(name);
            memberInput.value = '';
        }
    };

    addMemberBtn.addEventListener('click', handleAddMember);
    memberInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleAddMember();
    });

    // 3. Selection helper buttons (Select All / Deselect All)
    document.getElementById('select-all-members-btn').addEventListener('click', () => {
        const labels = document.querySelectorAll('.participant-checkbox-label');
        labels.forEach(lbl => {
            const cb = lbl.querySelector('input');
            cb.checked = true;
            lbl.classList.add('selected');
        });
    });

    document.getElementById('deselect-all-members-btn').addEventListener('click', () => {
        const labels = document.querySelectorAll('.participant-checkbox-label');
        labels.forEach(lbl => {
            const cb = lbl.querySelector('input');
            cb.checked = false;
            lbl.classList.remove('selected');
        });
    });

    // 4. Form Submission (Save Expense)
    document.getElementById('expense-form').addEventListener('submit', saveExpense);

    // 5. Input Formatting (Auto-comma for currency as typing)
    const amountInput = document.getElementById('expense-amount');
    amountInput.addEventListener('input', (e) => {
        let value = e.target.value;
        // Parse numbers only
        const numericValue = parseAmount(value);
        if (numericValue === 0) {
            e.target.value = '';
        } else {
            e.target.value = numericValue.toLocaleString('vi-VN');
        }
    });

    // 6. Reset Button Handler (Reset to fixed defaults)
    document.getElementById('reset-btn').addEventListener('click', () => {
        if (confirm('Bạn có chắc muốn đặt lại toàn bộ dữ liệu về chuyến đi gốc? Hành động này sẽ khôi phục danh sách 7 thành viên và 17 khoản chi ban đầu.')) {
            loadDefaults();
            renderAll();
        }
    });

    // 7. Copy Settlement Text Handler
    document.getElementById('copy-settlement-btn').addEventListener('click', () => {
        const stats = calculateCalculatedBalances();
        const settlements = calculateSettlements(stats);
        
        if (settlements.length === 0) {
            alert('Không có giao dịch nào để sao chép!');
            return;
        }

        let text = '✈️ TRIPSPLITTER - PHƯƠNG ÁN THANH TOÁN TỐI ƯU:\n';
        text += '------------------------------------------\n';
        settlements.forEach((tx, idx) => {
            text += `${idx + 1}. [${tx.from}] chuyển khoản cho [${tx.to}]: ${formatVND(tx.amount)}\n`;
            text += `   Nội dung: ${tx.from} chuyen tien TripSplitter\n`;
        });
        text += '------------------------------------------\n';
        text += 'Tạo bởi TripSplitter - Chia tiền chuyến đi rõ ràng nhất!';

        navigator.clipboard.writeText(text).then(() => {
            const toast = document.getElementById('copy-toast');
            toast.innerText = '📋 Đã sao chép phương án thành công!';
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 2500);
        }).catch(err => {
            console.error('Không thể sao chép vào bộ nhớ tạm: ', err);
            alert('Không thể tự động sao chép. Vui lòng thử lại!');
        });
    });

    // 8. Custom Note Modal Actions
    document.getElementById('show-note-btn').addEventListener('click', showNoteModal);
    
    document.getElementById('close-modal-btn').addEventListener('click', () => {
        document.getElementById('note-modal').style.display = 'none';
    });
    
    document.getElementById('note-modal').addEventListener('click', (e) => {
        if (e.target.id === 'note-modal') {
            document.getElementById('note-modal').style.display = 'none';
        }
    });

    document.getElementById('copy-note-btn').addEventListener('click', () => {
        const textarea = document.getElementById('copy-note-text');
        navigator.clipboard.writeText(textarea.value).then(() => {
            const toast = document.getElementById('copy-toast');
            toast.innerText = '📋 Đã sao chép ghi chú gửi nhóm thành công!';
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 2500);
        }).catch(err => {
            console.error('Không thể sao chép ghi chú: ', err);
            alert('Không thể tự động sao chép. Vui lòng chọn và sao chép thủ công!');
        });
    });
});
