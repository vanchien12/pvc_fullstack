from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.shop_security import get_db, require_admin
from app.crud import product as product_crud
from app.schemas.product import ProductCreate, ProductOut, ProductUpdate

router = APIRouter()


@router.get("/", response_model=List[ProductOut])
def list_products(db: Session = Depends(get_db)):
    """Danh sách sản phẩm - public, ai cũng xem được."""
    return product_crud.get_products(db)


@router.get("/{product_id}", response_model=ProductOut)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = product_crud.get_product(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm.")
    return product


@router.post("/", response_model=ProductOut, status_code=201)
def create_product(
    data: ProductCreate,
    db: Session = Depends(get_db),
    admin=Depends(require_admin),
):
    """Thêm sản phẩm - chỉ admin."""
    return product_crud.create_product(db, data)


@router.put("/{product_id}", response_model=ProductOut)
def update_product(
    product_id: int,
    data: ProductUpdate,
    db: Session = Depends(get_db),
    admin=Depends(require_admin),
):
    product = product_crud.get_product(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm.")
    return product_crud.update_product(db, product, data)


@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    admin=Depends(require_admin),
):
    product = product_crud.get_product(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Không tìm thấy sản phẩm.")
    product_crud.delete_product(db, product)
    return {"message": "Đã xóa sản phẩm."}
