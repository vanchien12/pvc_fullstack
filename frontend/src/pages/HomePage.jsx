import { useState } from 'react'
import Header from '../components/Header'
import Banner from '../components/Banner'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard'
import './HomePage.css'

// ES6: const + mảng object - dữ liệu sản phẩm mẫu
const sampleProducts = [
  { id: 1, name: 'Áo thun basic', price: 199000, image: 'https://placehold.co/300x200/ddd/999?text=Ao+thun' },
  { id: 2, name: 'Giày sneaker trắng', price: 850000, image: 'https://placehold.co/300x200/ddd/999?text=Giay' },
  { id: 3, name: 'Túi đeo chéo', price: 450000, image: 'https://placehold.co/300x200/ddd/999?text=Tui' },
  { id: 4, name: 'Mũ lưỡi trai', price: 120000, image: 'https://placehold.co/300x200/ddd/999?text=Mu' },
]

const HomePage = () => {
  // React State: số lượng sản phẩm trong giỏ hàng
  const [cartCount, setCartCount] = useState(0)

  // ES6: arrow function - tăng số lượng giỏ hàng
  const handleAddToCart = () => {
    setCartCount((prev) => prev + 1)
  }

  return (
    <div className="home-page" onClick={(e) => {
      // demo bắt sự kiện click vào nút "Thêm vào giỏ" (event delegation đơn giản)
      if (e.target.classList.contains('product-card__btn')) {
        handleAddToCart()
      }
    }}>
      {/* Props: truyền siteName và cartCount xuống Header */}
      <Header siteName="ShopHub" cartCount={cartCount} />

      <Banner />

      <main className="container home-page__content">
        <h2 className="home-page__heading">Sản phẩm nổi bật</h2>

        <div className="home-page__grid">
          {/* JSX: render danh sách bằng map + Destructuring trong tham số */}
          {sampleProducts.map(({ id, name, price, image }) => (
            <ProductCard key={id} name={name} price={price} image={image} />
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default HomePage
