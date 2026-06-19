import "./ProductCard.css";

// Arrow function: định dạng số thành tiền tệ VNĐ
const formatPrice = (price) =>
  price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

// Component tái sử dụng (Component Reusability):
// nhận "product" (object) và "onAddToCart" (function) qua props
const ProductCard = ({ product, onAddToCart }) => {
  // Destructuring object lấy các field cần dùng
  const { name, price, image, category } = product;

  return (
    <div className="product-card">
      <span className="product-card__category">{category}</span>

      <img className="product-card__image" src={image} alt={name} />

      <h3 className="product-card__name">{name}</h3>
      <p className="product-card__price">{formatPrice(price)}</p>

      <button
        className="product-card__btn"
        onClick={() => onAddToCart(product)}
      >
        Thêm vào giỏ
      </button>
    </div>
  );
};

export default ProductCard;
