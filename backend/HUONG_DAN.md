# Bổ sung tính năng Shop cho project pvc_fullstack (FastAPI)

Các file trong bộ này **hoàn toàn mới**, không đè lên file nào của bạn. Chỉ cần
copy vào đúng vị trí rồi nối 3 chỗ nhỏ là xong.

## 1. Copy file (chạy trong CMD)

```cmd
xcopy "đường_dẫn_giải_nén\app\models" "D:\pvc_fullstack\backend\app\models" /E /I /Y
xcopy "đường_dẫn_giải_nén\app\schemas" "D:\pvc_fullstack\backend\app\schemas" /E /I /Y
xcopy "đường_dẫn_giải_nén\app\crud" "D:\pvc_fullstack\backend\app\crud" /E /I /Y
xcopy "đường_dẫn_giải_nén\app\api\v1\endpoints" "D:\pvc_fullstack\backend\app\api\v1\endpoints" /E /I /Y
xcopy "đường_dẫn_giải_nén\app\core" "D:\pvc_fullstack\backend\app\core" /E /I /Y
```

> Nếu CMD báo file `__init__.py` đã tồn tại và hỏi ghi đè (Y/N) — chọn **N** (No) để giữ
> nguyên file cũ, không có vấn đề gì vì code mới nằm trong các file riêng (`product.py`,
> `order.py`, `shop_security.py`...).

## 2. Cài thêm thư viện

```cmd
cd /d D:\pvc_fullstack\backend
pip install python-jose[cryptography] passlib[bcrypt]
```

## 3. Gắn 3 router mới vào `app/api/v1/api.py`

Mở file `app/api/v1/api.py` hiện tại của bạn, thêm vào:

```python
from app.api.v1.endpoints import products, orders, shop_auth

api_router.include_router(products.router, prefix="/products", tags=["products"])
api_router.include_router(orders.router, prefix="/orders", tags=["orders"])
api_router.include_router(shop_auth.router, prefix="/shop-auth", tags=["shop-auth"])
```

(Giữ nguyên các `include_router` cũ đã có, chỉ thêm 3 dòng trên vào cuối.)

## 4. Kiểm tra `app/core/config.py` có `SECRET_KEY` chưa

Mở `app/core/config.py`, nếu trong `class Settings` **chưa có** dòng `SECRET_KEY`, thêm:

```python
SECRET_KEY: str = "doi-chuoi-nay-thanh-ngau-nhien-va-bi-mat-cua-rieng-ban"
```

(Nếu đã có sẵn `SECRET_KEY` cho hệ thống auth khác — không cần thêm gì, file
`shop_security.py` sẽ tự dùng lại.)

## 5. Chạy thử

```cmd
cd /d D:\pvc_fullstack\backend
uvicorn main:app --reload
```

Mở `http://localhost:8000/docs` để thấy các API mới: `/api/v1/products`,
`/api/v1/orders`, `/api/v1/shop-auth/login`.

## 6. Đăng nhập admin để test

Tài khoản admin đã được tạo sẵn tự động khi chạy server (xem trong `main.py` gốc
của bạn — hàm `seed_admin_account`):

```
Email:    admin@shophub.com
Mật khẩu: admin123
```

Gọi `POST /api/v1/shop-auth/login` với **form-data** (không phải JSON):
- `username`: admin@shophub.com
- `password`: admin123

Nhận về `access_token`, dùng làm header `Authorization: Bearer <token>` khi gọi
các API cần quyền admin (thêm sản phẩm, xem đơn hàng, duyệt đơn).

## 7. Danh sách API

| Method | Endpoint                          | Quyền  | Mô tả                     |
|--------|-------------------------------------|--------|-----------------------------|
| GET    | /api/v1/products                     | Public | Danh sách sản phẩm          |
| POST   | /api/v1/products                     | Admin  | Thêm sản phẩm                |
| PUT    | /api/v1/products/{id}                | Admin  | Sửa sản phẩm                 |
| DELETE | /api/v1/products/{id}                | Admin  | Xóa sản phẩm                 |
| POST   | /api/v1/orders                        | Public | Đặt hàng / thanh toán          |
| GET    | /api/v1/orders                        | Admin  | Xem tất cả đơn hàng             |
| PUT    | /api/v1/orders/{id}/status             | Admin  | Duyệt / từ chối đơn              |
| POST   | /api/v1/shop-auth/login                 | Public | Đăng nhập admin, lấy token        |

## ⚠️ Lưu ý quan trọng

File `app/core/shop_security.py` mình viết **độc lập** với hệ thống auth bạn có
thể đã có sẵn (vì mình chưa thấy `app/api/deps.py` và `app/core/security.py`
gốc của bạn). Nếu project bạn **đã có sẵn** dependency `get_db` và hệ thống
JWT/đăng nhập rồi, gửi mình 2 file đó — mình sẽ chỉnh lại để dùng chung 1 hệ
thống auth duy nhất, tránh trùng lặp.
