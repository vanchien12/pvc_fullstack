import { useState, useEffect } from 'react'
import './Banner.css'

// ES6: const + mảng object - dữ liệu banner (giả lập dữ liệu từ API)
const bannerSlides = [
  {
    id: 1,
    title: 'Sale mùa hè - Giảm đến 50%',
    subtitle: 'Áp dụng cho tất cả sản phẩm thời trang',
    bgColor: '#ff6b6b',
  },
  {
    id: 2,
    title: 'Miễn phí vận chuyển',
    subtitle: 'Cho đơn hàng từ 500.000đ',
    bgColor: '#4ecdc4',
  },
  {
    id: 3,
    title: 'Hàng mới về',
    subtitle: 'Khám phá bộ sưu tập mới nhất',
    bgColor: '#ffa726',
  },
]

const Banner = () => {
  // React State: lưu index của slide hiện tại
  const [currentIndex, setCurrentIndex] = useState(0)

  // React Effect: tự động chuyển slide sau mỗi 3 giây
  useEffect(() => {
    const timer = setInterval(() => {
      // ES6: arrow function trong setState để tính giá trị mới dựa trên giá trị cũ
      setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerSlides.length)
    }, 3000)

    // cleanup function - tránh memory leak
    return () => clearInterval(timer)
  }, [])

  // ES6: Destructuring object lấy ra các thuộc tính cần dùng
  const { title, subtitle, bgColor } = bannerSlides[currentIndex]

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  return (
    <section className="banner" style={{ backgroundColor: bgColor }}>
      <div className="container banner__content">
        <h2 className="banner__title">{title}</h2>
        <p className="banner__subtitle">{subtitle}</p>
        <button className="banner__btn">Mua ngay</button>
      </div>

      <div className="banner__dots">
        {bannerSlides.map((slide, index) => (
          <span
            key={slide.id}
            className={`banner__dot ${index === currentIndex ? 'banner__dot--active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </section>
  )
}

export default Banner
