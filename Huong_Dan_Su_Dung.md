# HƯỚNG DẪN SỬ DỤNG PHẦN MỀM CHIA TIỀN CHUYẾN ĐI (TRIPSPLITTER)

Chào bạn! Dưới đây là bộ giải pháp chia tiền chuyến đi cực kỳ trực quan, rõ ràng và chuyên nghiệp mà mình đã thiết kế riêng cho nhóm của bạn. Bộ công cụ bao gồm **File Excel tự động** và **Ứng dụng Web cục bộ siêu đẹp**, đặc biệt đã tích hợp tính năng **Quản Lý Quỹ Đóng Trước (Prepaid Fund)** để tính toán chính xác nhất khi nhóm có quỹ chung.

Tất cả các file đã được tạo sẵn trong thư mục làm việc của bạn (`e:\sharing`).

---

## 🛠️ CẤU TRÚC 1: FILE EXCEL TỰ ĐỘNG (`Chia_Tien_Chuyen_Di.xlsx`)

File Excel này được xây dựng với cấu trúc đa sheet chuyên nghiệp, sử dụng **công thức Excel tự động** để bạn chỉ cần nhập liệu một lần, mọi thứ sẽ tự tính toán.

### 📊 Sheet 1: `1. Tổng Hợp`
* **Công dụng:** Nơi hiển thị báo cáo tài chính chung của cả đoàn, ghi nhận các đóng góp quỹ trước chuyến đi và kiểm soát ai thừa/thiếu tiền.
* **Cách hoạt động:**
  1. Bạn chỉ cần nhập tên của các thành viên vào cột **Tên Thành Viên** (hỗ trợ tối đa 10 người).
  2. Cột **Tiền Đóng Quỹ (1):** Nhập số tiền mỗi thành viên đã đóng trước chuyến đi (đóng quỹ chung). Nếu ai chưa đóng, để là 0.
  3. Cột **Chi Thêm Riêng (2):** Tự động tính tổng số tiền người đó đã tự bỏ tiền túi ra trả cho các hóa đơn trong chuyến đi (dựa trên Sheet 2).
  4. Cột **Tổng Cộng Đã Đóng (3) = (1) + (2):** Tổng số đóng góp tài chính của mỗi người (Tiền quỹ đóng trước + Tiền tự chi thêm).
  5. Cột **Tổng Thực Chi (4):** Tự động tính tổng số tiền người đó thực tế phải chịu sau khi chia đều các khoản họ tham gia ở Sheet 2.
  6. Cột **Còn Lại (3) - (4):**
     * Nếu hiện **Số dương (màu đen)**: Người này đã đóng góp nhiều hơn mức họ tiêu, sẽ được **nhận lại** tiền mặt từ quỹ hoặc từ các thành viên khác.
     * Nếu hiện **Số âm (chữ đỏ)**: Người này đã tiêu nhiều hơn mức đóng góp, cần phải **đóng thêm** tiền.
  7. Cột **Trạng thái**: Tự động hiển thị chữ "Nhận lại: ... đ", "Đóng thêm: ... đ" hoặc "Đã xong" để dễ theo dõi.

### 📝 Sheet 2: `2. Chi Tiết Chi Tiêu`
* **Công dụng:** Nhật ký ghi lại từng khoản chi tiêu thực tế bằng tiền mặt hoặc chuyển khoản cá nhân trong chuyến đi.
* **Cách nhập liệu:**
  * **Cột B (Khoản Chi):** Nhập tên khoản chi (ví dụ: *Ăn trưa hải sản*, *Thuê xe máy*...).
  * **Cột C (Người Chi):** Chọn tên người đã đứng ra trả tiền (Excel có sẵn danh sách chọn dropdown liên kết trực tiếp với Sheet 1).
  * **Cột D (Số Tiền Chi):** Nhập tổng số tiền của khoản chi đó.
  * **Cột G đến P (Cột tên thành viên):** Tên cột sẽ tự động cập nhật theo tên bạn nhập ở Sheet 1. Với mỗi khoản chi, người nào tham gia chia tiền thì bạn chỉ cần gõ chữ **`x`** vào cột của người đó.
* **Công thức tự động:**
  * **Cột E (Số Người):** Tự động đếm có bao nhiêu chữ `x` để chia tiền.
  * **Cột F (Tiền/Người):** Tự động chia đều số tiền cho số người tham gia.
  * **Cột Q đến Z (Helper Columns):** Các cột bổ trợ (được thu nhỏ để bảo đảm thẩm mỹ) tự động tính toán số tiền từng người phải trả để làm cơ sở tính toán cho Sheet 1.

---

## 🌐 CẤU TRÚC 2: ỨNG DỤNG WEB TỰ ĐỘNG (`TripSplitter Web App`)

Bên cạnh file Excel tĩnh, mình đã xây dựng cho bạn một ứng dụng web cục bộ chạy ngay trên trình duyệt với giao diện **Emerald & Mint cực kỳ cao cấp, hiện đại** (sử dụng Glassmorphism, hiệu ứng chuyển động mượt mà và tương thích tốt trên mọi thiết bị).

### 🚀 Cách mở Ứng dụng Web:
1. Bạn vào thư mục `e:\sharing`.
2. Chỉ cần click đúp vào file **`index.html`** để mở trực tiếp trên trình duyệt của bạn (Chrome, Edge, Firefox, Safari...).
3. *Hoặc* nếu muốn chạy server nội bộ ổn định hơn:
   * Chạy lệnh: `npm run dev` (hoặc `npx http-server ./ -p 5000`).
   * Truy cập link: `http://localhost:5000`.

### 🌟 Các tính năng nổi bật vượt trội của Web App:
1. **Giao diện thời thượng (Wow-effect):** Giúp bạn nhập liệu cực nhanh, không lo lỗi công thức Excel. Cột số tiền tự động thêm dấu phẩy phân tách hàng nghìn khi bạn đang gõ.
2. **Quản lý Quỹ Đóng Trước (Prepaid) trực tiếp (MỚI):**
   * Trong thanh bên trái (Sidebar) chứa danh sách thành viên, mỗi người sẽ có thêm ô nhập **"Quỹ"** nhỏ gọn và hiện đại.
   * Bạn có thể gõ trực tiếp số tiền từng thành viên đã đóng trước (ví dụ: gõ *500,000*). Số tiền sẽ tự động định dạng đẹp mắt.
   * Dưới tên mỗi thành viên sẽ hiển thị thêm dòng **"Chi riêng: ... đ"** để phân tách rõ ràng giữa tiền đóng quỹ trước và tiền cá nhân tự chi thêm trong chuyến đi.
3. **Tính năng "Nhập Từ Excel" & "Xuất Excel" động (MỚI):**
   * Bạn có thể nhấn **"Xuất Excel Chi Tiết"** để lưu toàn bộ dữ liệu hiện tại trên web thành file Excel tự động (với đầy đủ cột Tiền Đóng Quỹ).
   * Ngược lại, nếu bạn đã chỉnh sửa file Excel ở nhà và muốn hiển thị lên màn hình Web App để xem phương án thanh toán trực quan, bạn chỉ cần nhấn **"Nhập Từ Excel"** và chọn file Excel của mình! Hệ thống sẽ tự động quét, lấy chính xác thông tin thành viên, **số tiền đóng quỹ** và toàn bộ chi phí hiển thị lên màn hình trong 1 giây!
4. **Thuật toán tối ưu hóa nợ (Settlement Guide) Độc quyền:**
   * Tính toán và đưa ra phương án **Ai chuyển tiền cho Ai với số tiền bao nhiêu** sao cho **số lượng giao dịch chuyển khoản là ít nhất**, có trừ chính xác phần đóng quỹ trước của mỗi người.
   * Có nút **"Sao Chép"** nhanh phương án chuyển tiền để bạn dễ dàng dán (Paste) vào nhóm chat Zalo/Messenger gửi cho bạn bè!
5. **Lưu trữ tự động (Auto-save):** Mọi dữ liệu bạn nhập sẽ tự động được lưu vào trình duyệt. Dù bạn có F5 hay tắt tab đi mở lại, thông tin chuyến đi vẫn nguyên vẹn!

---

## 💡 Mẹo nhỏ khi đi du lịch nhóm:
* Hãy nhập tất cả các thành viên vào trước, rồi điền tiền đóng quỹ trước của từng người (nếu có).
* Bất kỳ khi nào có hóa đơn mới trong chuyến đi, hãy mở điện thoại hoặc máy tính nhập ngay vào Web App để đỡ quên.
* Cuối chuyến đi, chỉ cần nhấn **"Xuất Excel Chi Tiết"** để lưu làm kỷ niệm, rồi nhấn **"Sao Chép"** phương án thanh toán tối ưu gửi vào nhóm chung để mọi người chuyển khoản trả nhau là xong!

Chúc nhóm bạn có những chuyến đi vui vẻ và tài chính luôn minh bạch, rõ ràng nhất nhé! ✈️🏖️
