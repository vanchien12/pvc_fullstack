import './Footer.css'

// ES6: const + arrow function, không nhận props (component thuần hiển thị)
const Footer = () => {
  // ES6: lấy năm hiện tại
  const currentYear = new Date().getFullYear()

  // ES6: const + mảng object cho danh sách liên kết
  const footerLinks = [
    {
      title: 'Về ShopHub',
      items: ['Giới thiệu', 'Tuyển dụng', 'Tin tức'],
    },
    {
      title: 'Hỗ trợ khách hàng',
      items: ['Trung tâm trợ giúp', 'Hướng dẫn mua hàng', 'Chính sách đổi trả'],
    },
    {
      title: 'Kết nối',
      items: ['Facebook', 'Instagram', 'YouTube'],
    },
  ]

  return (
    <footer className="footer">
      <div className="container footer__grid">
        {/* JSX: render danh sách lồng nhau */}
        {footerLinks.map((section) => (
          <div key={section.title} className="footer__col">
            <h4 className="footer__title">{section.title}</h4>
            <ul className="footer__list">
              {section.items.map((item) => (
                <li key={item} className="footer__item">
                  <a href="#">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="footer__bottom">
        <p>© {currentYear} ShopHub. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
