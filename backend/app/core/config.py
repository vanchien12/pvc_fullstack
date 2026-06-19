from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Khóa bí mật để ký JWT token - PHẢI đổi khi deploy thật
    SECRET_KEY: str = "change-this-secret-key-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 ngày

    # Đường dẫn database SQLite (dễ chạy local, không cần cài server riêng)
    DATABASE_URL: str = "sqlite:///./shophub.db"

    # Danh sách origin frontend được phép gọi API (CORS)
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
    ]

    class Config:
        env_file = ".env"


settings = Settings()
