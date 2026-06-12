from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {"message": "Backend is running"}

@app.get("/products")
def get_products():
    return [
        {"id": 1, "name": "Product 1", "price": 100000},
        {"id": 2, "name": "Product 2", "price": 200000}
    ]