# 🚀 HƯỚNG DẪN DEPLOY TRIPSPLITTER LÊN VERCEL

TripSplitter là một ứng dụng **HTML, CSS và JavaScript thuần (Static Website)**, không sử dụng Framework phức tạp nên tốc độ tải trang cực nhanh và việc triển khai (Deploy) lên Vercel là **hoàn toàn miễn phí** và chỉ mất **chưa đầy 1 phút**!

Dưới đây là 3 cách dễ nhất để đưa ứng dụng của bạn lên Vercel:

---

## 🎨 CÁCH 1: KÉO & THẢ TRỰC TIẾP TRÊN TRÌNH DUYỆT (Nhanh nhất - Không cần code)

Đây là phương pháp đơn giản nhất, bạn không cần cài đặt thêm bất kỳ công cụ nào:

1. **Bước 1:** Mở trình duyệt và truy cập vào trang chủ Vercel: [https://vercel.com](https://vercel.com)
2. **Bước 2:** Đăng nhập (Sign In) hoặc Đăng ký (Sign Up) bằng tài khoản **Google**, **GitHub** hoặc **Email** của bạn.
3. **Bước 3:** Sau khi vào màn hình Dashboard chính, truy cập đường dẫn: **[https://vercel.com/new](https://vercel.com/new)**
4. **Bước 4:** Bỏ qua phần import từ GitHub, cuộn xuống cuối trang. Bạn sẽ thấy một vùng hình chữ nhật đứt nét ghi:
   > *"Or deploy a folder with Vercel CLI or Drag a folder here to deploy it"*
5. **Bước 5:** Mở File Explorer trên máy tính, tìm đến thư mục chứa code của chuyến đi (`e:\sharing`).
6. **Bước 6:** **Kéo toàn bộ thư mục `sharing` này và thả vào** vùng chữ nhật đứt nét trên trang web Vercel.
7. **Bước 7:** Đợi khoảng 5 - 10 giây để Vercel tải lên và xử lý. Hệ thống sẽ cấp ngay cho bạn một tên miền miễn phí có đuôi `.vercel.app` (Ví dụ: `tripsplitter-vietnam.vercel.app`) để chia sẻ cho cả nhóm cùng truy cập!

---

## 🐙 CÁCH 2: LIÊN KẾT GITHUB (Khuyên dùng - Tự động cập nhật khi sửa code)

Nếu bạn muốn sau này mỗi lần chỉnh sửa code trên máy tính, trang web trên Vercel tự động cập nhật theo:

### 1. Đẩy code lên GitHub:
1. Mở PowerShell/Terminal tại thư mục `e:\sharing`.
2. Khởi tạo Git và đẩy code lên kho chứa (Repository) mới trên GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: init tripsplitter group trip"
   git branch -M main
   git remote add origin <LINK_REPOSITORY_GITHUB_CỦA_BẠN>
   git push -u origin main
   ```

### 2. Liên kết với Vercel:
1. Truy cập [https://vercel.com/new](https://vercel.com/new).
2. Đăng nhập bằng tài khoản **GitHub**.
3. Bạn sẽ thấy danh sách các Repository của mình ở cột bên trái. Click nút **"Import"** bên cạnh repository chứa code chuyến đi của bạn.
4. Ở trang cấu hình tiếp theo, giữ nguyên mọi cài đặt mặc định (Vercel tự nhận diện đây là Static Project) và click nút **"Deploy"**.
5. Kể từ bây giờ, bất kỳ khi nào bạn chạy `git push` để cập nhật dữ liệu, website trên Vercel sẽ **tự động cập nhật** sau 3 giây!

---

## 💻 CÁCH 3: DEPLOY QUA VERCEL CLI (Dành cho nhà phát triển)

Nếu bạn quen dùng cửa sổ dòng lệnh:

1. Mở PowerShell/Terminal tại thư mục `e:\sharing`.
2. Cài đặt Vercel CLI toàn cục trên máy tính:
   ```powershell
   npm install -g vercel
   ```
3. Đăng nhập vào tài khoản Vercel của bạn:
   ```powershell
   vercel login
   ```
4. Khởi chạy deployment bằng cách gõ:
   ```powershell
   vercel
   ```
   *(Ấn `Enter` để đồng ý với các câu hỏi mặc định)*
5. Đưa ứng dụng lên production (nhận link live chính thức):
   ```powershell
   vercel --prod
   ```

---

## 💡 CÁC ĐIỂM CỰC KỲ TIỆN LỢI SAU KHI DEPLOY:
* 📱 **Tương thích Mobile 100%:** Bạn bè trong nhóm có thể mở link trên điện thoại ngay khi đang ngồi ăn hoặc di chuyển để nhập khoản chi tiêu mới.
* 💾 **Tự động lưu trữ cá nhân (Local Auto-Save):** Dữ liệu của từng người khi nhập vẫn sẽ được tự động lưu vào trình duyệt của họ, không sợ bị mất khi tắt tab.
* 📋 **Sao chép Zalo/Messenger 1-Click:** Nhấp nút "Xem Ghi Chú Chuyển Tiền" -> "Sao Chép Ghi Chú Gửi Nhóm" rồi dán vào group chat cực kỳ chuyên nghiệp và rõ ràng!
