import './ProductCard.css'

// ES6: Destructuring props ngay trong tham số hàm
const ProductCard = ({ name, price, image }) => {
  // ES6: format giá tiền bằng template literal + toLocaleString
  const formattedPrice = `${price.toLocaleString('vi-VN')}đ`

  return (
    <div className="product-card">
      <div className="product-card__image" style={{ backgroundImage: `url(${image})` }} />
      <div className="product-card__info">
        <h3 className="product-card__name">{name}</h3>
        <p className="product-card__price">{formattedPrice}</p>
        <button className="product-card__btn">Thêm vào giỏ</button>
      </div>
    </div>
  )
}

export default ProductCard
