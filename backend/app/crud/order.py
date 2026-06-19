from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.order import Order, OrderItem
from app.models.product import Product
from app.schemas.order import OrderCreate, OrderStatusUpdate


def get_orders(db: Session):
    return db.query(Order).order_by(Order.created_at.desc()).all()


def get_order(db: Session, order_id: int):
    return db.query(Order).filter(Order.id == order_id).first()


def create_order(db: Session, data: OrderCreate):
    """Tạo đơn hàng (checkout). Tính tiền dựa trên giá thật trong DB, không tin giá từ client."""
    if not data.items:
        raise HTTPException(status_code=400, detail="Giỏ hàng không được trống.")

    total = 0.0
    line_items = []

    for item in data.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            raise HTTPException(
                status_code=400, detail=f"Sản phẩm id={item.product_id} không tồn tại."
            )
        if product.stock < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f'Sản phẩm "{product.name}" không đủ hàng tồn kho.',
            )
        line_total = product.price * item.quantity
        total += line_total
        line_items.append(
            {
                "product_id": product.id,
                "product_name": product.name,
                "price": product.price,
                "quantity": item.quantity,
            }
        )

    order = Order(
        customer_name=data.customer_name,
        phone=data.phone,
        address=data.address,
        total=total,
        status="pending",
    )
    db.add(order)
    db.flush()  # để lấy order.id trước khi commit

    for li in line_items:
        db.add(OrderItem(order_id=order.id, **li))

    db.commit()
    db.refresh(order)
    return order


def update_order_status(db: Session, order: Order, data: OrderStatusUpdate):
    if data.status not in ("pending", "approved", "rejected"):
        raise HTTPException(status_code=400, detail="Trạng thái không hợp lệ.")

    # Nếu duyệt đơn lần đầu -> trừ kho
    if data.status == "approved" and order.status != "approved":
        for item in order.items:
            if item.product_id:
                product = db.query(Product).filter(Product.id == item.product_id).first()
                if product:
                    product.stock = max(0, product.stock - item.quantity)

    order.status = data.status
    db.commit()
    db.refresh(order)
    return order
