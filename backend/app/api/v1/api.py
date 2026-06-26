from fastapi import APIRouter
from app.api.v1.endpoints import auth, products, orders, shop_auth

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(products.router, prefix="/products", tags=["products"])
api_router.include_router(orders.router, prefix="/orders", tags=["orders"])
api_router.include_router(shop_auth.router, prefix="/shop-auth", tags=["shop-auth"])
