# Gift Landing Page & QR Greeting Card System

Website bán quà tặng dạng landing page kết hợp với hệ thống tạo thiệp chúc online thông qua QR code.

## Tính năng

- ✅ Landing page hiển thị sản phẩm theo dịp (Tết, Valentine, 8/3)
- ✅ Form thu thập lead khách hàng (SĐT/Email)
- ✅ Trang admin quản lý sản phẩm và thiệp (Basic Auth)
- ✅ Tạo thiệp chúc mừng online
- ✅ Sinh QR code để in vào thiệp vật lý
- ✅ Trang public hiển thị thiệp khi quét QR

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: MongoDB
- **QR Generation**: qrcode library
- **Styling**: Tailwind CSS v4

## Cài đặt

### 1. Clone và cài đặt dependencies

```bash
npm install
```

### 2. Cấu hình Environment Variables

Tạo file `.env.local` với nội dung:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017
# Hoặc MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/

# Database Name (optional, default: gift_shop)
DB_NAME=gift_shop

# Base URL cho QR code và internal API calls
# Local: http://localhost:3000
# Production: https://your-domain.com
BASE_URL=http://localhost:3000

# Basic Auth cho Admin
ADMIN_USER=admin
ADMIN_PASS=your-secure-password
```

### 3. Chạy development server

```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem website.

## Cấu trúc URL

- `/` - Landing page (public)
- `/admin` - Trang admin (protected by Basic Auth)
- `/admin/products` - Quản lý sản phẩm
- `/admin/cards` - Tạo & quản lý thiệp
- `/c/[code]` - Trang thiệp public (khi quét QR)
- `/api/leads` - API nhận lead (POST)
- `/api/products` - API lấy sản phẩm public (GET)
- `/api/admin/*` - API admin (protected)

## Sử dụng

### 1. Tạo sản phẩm

1. Truy cập `/admin/products` (cần Basic Auth)
2. Điền tên sản phẩm và chọn dịp
3. Click "Tạo"

### 2. Tạo thiệp chúc mừng

1. Truy cập `/admin/cards`
2. Điền thông tin:
   - Template (vd: `tet_01`)
   - Người nhận
   - Người gửi
   - Lời chúc
3. Click "Tạo thiệp"
4. Click "Tải QR (PNG)" để tải QR code
5. In QR code và dán vào thiệp vật lý

### 3. Quét QR và xem thiệp

Khách hàng quét QR code → mở trang `/c/[code]` để xem thiệp.

## Deploy lên Vercel

1. Push code lên GitHub
2. Import project vào Vercel
3. Cấu hình Environment Variables trong Vercel:
   - `MONGODB_URI`
   - `DB_NAME` (optional)
   - `BASE_URL` (domain production của bạn)
   - `ADMIN_USER`
   - `ADMIN_PASS`
4. Deploy!

## Lưu ý quan trọng

⚠️ **URL thiệp phải ổn định tuyệt đối** - QR code đã in ra không được thay đổi URL.

⚠️ Trên Vercel, `BASE_URL` phải set đúng domain production để QR code hoạt động đúng.

## Phase 1 Checklist

- [x] Landing hiển thị được
- [x] Form lead ghi được DB
- [x] Admin vào được (Basic Auth)
- [x] Tạo được thiệp
- [x] QR tải được
- [x] Quét QR mở đúng thiệp

## License

Private project
