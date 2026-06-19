from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.user import UserRegister, UserLogin, UserOut, TokenResponse
from app.crud.user import get_user_by_email, create_user
from app.core.security import verify_password, create_access_token
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    """Đăng ký tài khoản mới với role mặc định 'user'."""
    existing_user = get_user_by_email(db, user_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email này đã được đăng ký",
        )

    new_user = create_user(db, user_data, role="user")
    return new_user


@router.post("/login", response_model=TokenResponse)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """Đăng nhập bằng email + password, trả về JWT access token."""
    user = get_user_by_email(db, credentials.email)

    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email hoặc mật khẩu không đúng",
        )

    # "sub" trong JWT payload lưu user id, dùng để xác định user ở các request sau
    access_token = create_access_token(data={"sub": str(user.id)})

    return TokenResponse(access_token=access_token, user=user)


@router.get("/me", response_model=UserOut)
def read_current_user(current_user: User = Depends(get_current_user)):
    """Trả về thông tin user đang đăng nhập, dựa trên token gửi kèm."""
    return current_user
