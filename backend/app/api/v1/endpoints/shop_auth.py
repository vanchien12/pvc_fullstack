from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.shop_security import create_access_token, get_db, verify_password
from app.crud.user import get_user_by_email

router = APIRouter()


@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    Đăng nhập admin để lấy token.
    Lưu ý: OAuth2PasswordRequestForm yêu cầu gửi dữ liệu dạng form-data với field
    'username' (chính là email) và 'password' — KHÔNG phải JSON.
    """
    user = get_user_by_email(db, form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Sai email hoặc mật khẩu.")

    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Tài khoản này không phải admin.")

    token = create_access_token({"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}
