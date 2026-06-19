import "./Footer.css";

const Footer = () => {
  // ES6: const với template literal lấy năm hiện tại
  const currentYear = new Date().getFullYear();
  const siteName = "ShopHub";

  // Mảng các liên kết, dùng cho .map()
  const footerLinks = [
    { id: 1, label: "Chính sách bảo mật", href: "#" },
    { id: 2, label: "Điều khoản dịch vụ", href: "#" },
    { id: 3, label: "Hỗ trợ khách hàng", href: "#" },
  ];

  return (
    <footer className="footer">
      <div className="footer__top">
        <h3 className="footer__brand">{siteName}</h3>
        <ul className="footer__links">
          {footerLinks.map(({ id, label, href }) => (
            <li key={id}>
              <a href={href}>{label}</a>
            </li>
          ))}
        </ul>
      </div>

      <p className="footer__copyright">
        © {currentYear} {siteName}. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
