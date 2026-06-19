import { useState, useEffect } from "react";
import "./Banner.css";

const slides = [
  {
    id: 1,
    title: "Mùa Sale Cuối Năm",
    subtitle: "Giảm giá lên đến 50% cho tất cả sản phẩm",
    gradient: "linear-gradient(135deg, #6366f1 0%, #4338ca 100%)",
  },
  {
    id: 2,
    title: "Hàng Mới Về",
    subtitle: "Cập nhật xu hướng thời trang mới nhất",
    gradient: "linear-gradient(135deg, #22c55e 0%, #15803d 100%)",
  },
  {
    id: 3,
    title: "Miễn Phí Vận Chuyển",
    subtitle: "Cho đơn hàng từ 500.000đ trở lên",
    gradient: "linear-gradient(135deg, #fb923c 0%, #dc2626 100%)",
  },
];

// Thời gian tự động chuyển slide (ms)
const AUTO_SLIDE_INTERVAL = 4000;

const Banner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // useEffect: tự động chuyển slide, cleanup interval khi unmount
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, AUTO_SLIDE_INTERVAL);

    return () => clearInterval(timer);
  }, []);

  const { title, subtitle, gradient } = slides[currentIndex];

  return (
    <section className="banner" style={{ background: gradient }}>
      <div className="banner__content">
        <h2 className="banner__title">{title}</h2>
        <p className="banner__subtitle">{subtitle}</p>
        <button className="banner__cta">Mua ngay</button>
      </div>

      <button
        className="banner__btn banner__btn--prev"
        onClick={handlePrev}
        aria-label="Slide trước"
      >
        ‹
      </button>
      <button
        className="banner__btn banner__btn--next"
        onClick={handleNext}
        aria-label="Slide kế tiếp"
      >
        ›
      </button>

      <div className="banner__dots">
        {slides.map((slide, index) => (
          <span
            key={slide.id}
            className={`banner__dot ${
              index === currentIndex ? "banner__dot--active" : ""
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default Banner;
