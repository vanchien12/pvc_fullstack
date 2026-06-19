from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class ProductBase(BaseModel):
    name: str
    price: float
    image: Optional[str] = None
    description: Optional[str] = None
    stock: int = 0


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    image: Optional[str] = None
    description: Optional[str] = None
    stock: Optional[int] = None


class ProductOut(ProductBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True  # Pydantic v2. Nếu bạn dùng Pydantic v1, đổi thành: orm_mode = True
