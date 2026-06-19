from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.session import Base, engine, SessionLocal
from app.api.v1.api import api_router
from app.models.user import User
from app.crud.user import get_user_by_email
from app.core.security import hash_password

# Tạo toàn bộ bảng trong DB nếu chưa tồn tại (dựa theo các model đã import)
Base.metadata.create_all(bind=engine)


def seed_admin_account():
    """Tạo sẵn 1 tài khoản admin mặc định nếu chưa tồn tại, để có thể đăng nhập ngay."""
    db = SessionLocal()
    try:
        admin = get_user_by_email(db, "admin@shophub.com")
        if not admin:
            admin = User(
                name="Quản trị viên",
                email="admin@shophub.com",
                hashed_password=hash_password("admin123"),
                role="admin",
            )
            db.add(admin)
            db.commit()
    finally:
        db.close()


seed_admin_account()

app = FastAPI(title="ShopHub API", version="1.0.0")

# Cho phép frontend (chạy ở domain/port khác) gọi API này
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")


@app.get("/")
def root():
    return {"message": "ShopHub API đang chạy", "docs": "/docs"}
