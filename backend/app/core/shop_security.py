"""
File này tạo riêng cho tính năng Shop (sản phẩm/giỏ hàng/đơn hàng) để KHÔNG đụng vào
app/api/deps.py hay app/core/security.py hiện có của bạn.

LƯU Ý QUAN TRỌNG:
- Nếu project của bạn ĐÃ CÓ sẵn dependency `get_db` (thường ở app/api/deps.py) và
  hệ thống đăng nhập JWT (tạo/xác thực token) rồi, hãy dùng lại các hàm đó thay vì
  file này, để tránh có 2 hệ thống đăng nhập song song.
- Nếu CHƯA có, file này cung cấp đủ: tạo token khi admin đăng nhập, xác thực token,
  và dependency `require_admin` để chặn các API chỉ admin được dùng.
"""

from datetime import datetime, timedelta
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import SessionLocal
from app.models.user import User

# ---- Cấu hình JWT ----
# Nếu app/core/config.py của bạn CHƯA có SECRET_KEY, thêm dòng:
#   SECRET_KEY: str = "doi-chuoi-nay-thanh-ngau-nhien-va-bi-mat"
# vào trong class Settings.
SECRET_KEY = getattr(settings, "SECRET_KEY", "shop-temporary-secret-change-me")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 8  # 8 tiếng

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/shop-auth/login", auto_error=False)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_minutes: int = ACCESS_TOKEN_EXPIRE_MINUTES) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=expires_minutes)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def require_admin(token: Optional[str] = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Không thể xác thực. Vui lòng đăng nhập admin.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    if not token:
        raise credentials_exception

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise credentials_exception

    if user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Chỉ admin mới có quyền truy cập.",
        )

    return user
