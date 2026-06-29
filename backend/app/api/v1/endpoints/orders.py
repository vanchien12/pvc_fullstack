from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.shop_security import get_db
from app.crud import order as order_crud
from app.schemas.order import OrderCreate, OrderOut, OrderStatusUpdate

router = APIRouter()


@router.post("/", response_model=OrderOut, status_code=201)
def checkout(data: OrderCreate, db: Session = Depends(get_db)):
    """Khách đặt hàng - public."""
    return order_crud.create_order(db, data)


@router.get("/", response_model=List[OrderOut])
def list_orders(db: Session = Depends(get_db)):
    """Xem tất cả đơn hàng."""
    return order_crud.get_orders(db)


@router.get("/{order_id}", response_model=OrderOut)
def get_order(order_id: int, db: Session = Depends(get_db)):
    order = order_crud.get_order(db, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Không tìm thấy đơn hàng.")
    return order


@router.put("/{order_id}/status", response_model=OrderOut)
def update_status(
    order_id: int,
    data: OrderStatusUpdate,
    db: Session = Depends(get_db),
):
    order = order_crud.get_order(db, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Không tìm thấy đơn hàng.")
    return order_crud.update_order_status(db, order, data)