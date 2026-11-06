# 💖 Our Love Story - Web Đếm Ngày Yêu Nhau & Kỷ Niệm Tình Yêu

Một ứng dụng web đếm ngày yêu nhau lãng mạn, hiện đại dành riêng cho các cặp đôi với giao diện tone hồng pastel, hiệu ứng hoa anh đào & trái tim bay lượn, nhạc nền lãng mạn, nhật ký, phòng chụp ảnh Polaroid, lịch lễ tình nhân và nhắn tin thời gian thực!

![Tone Hồng Pastel](https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1000&q=80)

---

## ✨ Tính Năng Nổi Bật

1. **Đếm Ngày Yêu Nhau (Love Counter)**:
   - Bộ đếm thời gian thực: Tổng số ngày, năm, tháng, ngày, giờ, phút, giây tích tắc từng giây.
   - Profile cặp đôi: Tên, biệt danh, cung hoàng đạo, sinh nhật, lời yêu thương, ảnh đại diện có thể đổi trực tiếp.
   - Thanh tiến trình đếm ngược đến cột mốc tiếp theo (100 ngày, 1 năm, 500 ngày, 1000 ngày,...).
   - Nút tương tác: Bắn pháo tim, gửi nụ hôn 💋, trao cái ôm ấm áp 🤗.

2. **Lịch Các Ngày Lễ Tình Nhân (Valentine & Milestones Calendar)**:
   - Đầy đủ **12 ngày Valentine** của 12 tháng trong năm (Diary Day, Valentine Đỏ, Valentine Trắng, Black Day, Rose Day, Kiss Day, Silver Day, Hug Day,...).
   - Tự động tính toán các cột mốc tình yêu dựa trên ngày bắt đầu quen nhau.
   - Cho phép thêm ngày kỷ niệm riêng (sinh nhật, ngày đi du lịch, ngày tỏ tình,...).
   - Đếm ngược chính xác số ngày còn lại đến từng sự kiện.

3. **Nhật Ký Tình Yêu (Love Diary & Timeline)**:
   - Ghi lại từng kỷ niệm với tiêu đề, ngày tháng, tâm trạng (🥰, 💖, 🌸, 🍜, 🏖️,...).
   - Đính kèm nhiều hình ảnh kỷ niệm.
   - Dòng thời gian (Timeline) dạng trái tim kết nối.
   - Thả tim và tìm kiếm nhật ký nhanh chóng.

4. **Phòng Chụp Ảnh Polaroid (Love Camera & Album)**:
   - Bật camera trực tiếp trên điện thoại/máy tính với các bộ lọc màu pastel, ấm áp, vintage.
   - Đếm ngược 3 giây, hiệu ứng chớp sáng và âm thanh chụp ảnh chân thực.
   - Xuất ảnh dạng khung **Polaroid viền trắng/hồng** kèm ngày tháng và tên đôi bạn.
   - Tải ảnh về máy hoặc lưu trữ vào Album tình yêu với hiệu ứng xếp ảnh nghệ thuật.

5. **Nhắn Tin Cho Nhau (Couple Messenger & Love Notes)**:
   - Giao diện chat ngọt ngào dành riêng cho hai người.
   - Bộ gợi ý lời nhắn nhanh ("Nhớ người yêu quá", "Hôm nay em ăn cơm chưa?",...).
   - Sticker biểu cảm tình yêu đáng yêu.
   - Đồng bộ tin nhắn qua Firebase Firestore trong thời gian thực.

6. **Hòm Thư Niêm Phong (Love Letters)**:
   - Viết thư hẹn ngày mở (chỉ mở ra vào đúng ngày Valentine, kỷ niệm 1 năm hoặc sinh nhật).

7. **Âm Nhạc & Hiệu Ứng Tone Hồng Pastel**:
   - Trình phát nhạc nền lãng mạn tích hợp sẵn đĩa than xoay tròn.
   - Hiệu ứng Canvas hoa anh đào & bóng bay trái tim bay lơ lửng, nổ tim khi click chuột.
   - Hiệu ứng âm thanh ngọt ngào (tiếng tim đập, chuông leng keng, tiếng chụp ảnh).

8. **Đồng Bộ Đám Mây & Liên Kết Google (Firebase)**:
   - Lưu trữ tự động trên máy (LocalStorage) không cần cài đặt.
   - Hỗ trợ đăng nhập tài khoản Google và đồng bộ thời gian thực qua Firebase Firestore.
   - Mã kết nối cặp đôi (Couple Code) để 2 người dùng chung dữ liệu.

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy Thử Trên Máy

### 1. Cài đặt các thư viện
Mở Terminal / PowerShell tại thư mục dự án và chạy:
```bash
pnpm install
# hoặc npm install
```

### 2. Chạy môi trường phát triển (Dev)
```bash
pnpm run dev
# hoặc npm run dev
```
Trình duyệt sẽ mở tại `http://localhost:5173`.

---

## 🌐 Hướng Dẫn Đẩy Lên GitHub & Mở Web Cho Mọi Người Truy Cập (GitHub Pages)

Dự án đã cấu hình sẵn GitHub Actions tự động build và xuất bản. Bạn chỉ cần làm theo các bước sau:

### Bước 1: Đẩy mã nguồn lên GitHub
1. Mở GitHub và tạo một **Repository mới** (ví dụ: `my-love-story`).
2. Mở Terminal tại thư mục này và gõ:
```bash
git init
git add .
git commit -m "Khoi tao web dem ngay yeu nhau"
git branch -M main
git remote add origin https://github.com/TEN_TAI_KHOAN_CUA_BAN/my-love-story.git
git push -u origin main
```

### Bước 2: Kích hoạt GitHub Pages
1. Vào repository trên GitHub > bấm vào tab **Settings** (ở trên cùng).
2. Ở thanh menu bên trái, chọn **Pages**.
3. Tại phần **Build and deployment** > **Source**: chọn **GitHub Actions**.
4. GitHub Actions sẽ tự động chạy trong khoảng 1-2 phút.
5. Sau khi hoàn tất, trang web của bạn sẽ hoạt động tại:
   `https://TEN_TAI_KHOAN_CUA_BAN.github.io/my-love-story/`

---

## ☁️ Cấu Hình Firebase Để Lưu Dữ Liệu Lên Đám Mây & Đăng Nhập Google

1. Vào [Firebase Console](https://console.firebase.google.com/) và tạo 1 dự án mới (miễn phí).
2. Vào **Authentication** > **Sign-in method** > Bật **Google**.
3. Vào **Firestore Database** > Bấm **Create database** (chế độ test mode hoặc thêm rule cho phép đọc/ghi).
4. Vào **Project Settings (Cài đặt dự án)** > cuộn xuống mục **Your apps** > chọn biểu tượng Web (`</>`) để lấy mã cấu hình:
   ```js
   const firebaseConfig = {
     apiKey: "...",
     authDomain: "...",
     projectId: "...",
     storageBucket: "...",
     messagingSenderId: "...",
     appId: "..."
   };
   ```
5. Mở trang web của bạn > Bấm vào biểu tượng **Cài Đặt (bánh răng)** > Chọn tab **Tài khoản Google & Cloud** > Dán các thông số vào và bấm Lưu. Cả hai bạn sẽ được đồng bộ dữ liệu vĩnh viễn!

