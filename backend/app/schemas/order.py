from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(gt=0)


class OrderCreate(BaseModel):
    customer_name: str
    phone: Optional[str] = None
    address: Optional[str] = None
    items: List[OrderItemCreate]


class OrderItemOut(BaseModel):
    id: int
    product_id: Optional[int]
    product_name: str
    price: float
    quantity: int

    class Config:
        from_attributes = True


class OrderOut(BaseModel):
    id: int
    customer_name: str
    phone: Optional[str] = None
    address: Optional[str] = None
    total: float
    status: str
    created_at: datetime
    items: List[OrderItemOut] = []

    class Config:
        from_attributes = True


class OrderStatusUpdate(BaseModel):
    status: str  # "pending" | "approved" | "rejected"
