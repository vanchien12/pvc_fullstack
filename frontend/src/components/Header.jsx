import { useState } from 'react'
import './Header.css'

// ES6: Arrow Function Component + Destructuring props
const Header = ({ siteName, cartCount }) => {
  // React State: quản lý trạng thái mở/đóng menu mobile
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // ES6: arrow function xử lý sự kiện
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev)
  }

  // ES6: const + mảng danh sách menu
  const navLinks = ['Trang chủ', 'Sản phẩm', 'Khuyến mãi', 'Liên hệ']

  return (
    <header className="header">
      <div className="container header__inner">
        <div className="header__logo">{siteName}</div>

        <nav className={`header__nav ${isMenuOpen ? 'header__nav--open' : ''}`}>
          {/* JSX: render danh sách bằng map */}
          {navLinks.map((link) => (
            <a key={link} href="#" className="header__link">
              {link}
            </a>
          ))}
        </nav>

        <div className="header__actions">
          <span className="header__cart">🛒 {cartCount}</span>
          <button className="header__menu-btn" onClick={toggleMenu}>
            ☰
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
