from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from app.core.config import settings

# check_same_thread=False cần thiết cho SQLite khi dùng với FastAPI (đa luồng)
engine = create_engine(
    settings.DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """Dependency cung cấp DB session cho mỗi request, tự đóng khi xong."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
