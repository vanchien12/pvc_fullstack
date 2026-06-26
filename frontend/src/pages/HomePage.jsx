// frontend/src/pages/HomePage.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import { api } from "../api";

const FEATURES = [
  { icon:"🚚", title:"Miễn phí vận chuyển", desc:"Cho đơn hàng từ 300.000đ" },
  { icon:"🔄", title:"Đổi trả dễ dàng", desc:"Trong vòng 30 ngày" },
  { icon:"🛡️", title:"Bảo hành chính hãng", desc:"100% sản phẩm chính hãng" },
  { icon:"💳", title:"Thanh toán an toàn", desc:"Mã hoá SSL bảo mật" },
];

const CATEGORIES = [
  { name:"Áo", icon:"👕", color:"#dbeafe" },
  { name:"Quần", icon:"👖", color:"#fce7f3" },
  { name:"Giày", icon:"👟", color:"#d1fae5" },
  { name:"Túi", icon:"👜", color:"#fef3c7" },
];

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/products")
      .then(data => setProducts(data.slice(0, 8)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ fontFamily:"'Segoe UI', sans-serif", background:"#f8fafc", minHeight:"100vh" }}>
      <Navbar />

      {/* Hero Banner */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <p style={styles.heroEyebrow}>✨ Mua sắm thông minh</p>
          <h1 style={styles.heroTitle}>
            Khám phá bộ sưu tập<br />
            <span style={styles.heroAccent}>mới nhất 2024</span>
          </h1>
          <p style={styles.heroSub}>Hàng ngàn sản phẩm chất lượng, giá tốt mỗi ngày tại ShopHub</p>
          <div style={{ display:"flex", gap:16, marginTop:32 }}>
            <Link to="/products" style={styles.heroBtnPrimary}>Mua sắm ngay →</Link>
            <Link to="/products" style={styles.heroBtnSecondary}>Xem danh mục</Link>
          </div>
          <div style={styles.heroStats}>
            <div style={styles.stat}><strong style={{ fontSize:24 }}>10K+</strong><span>Sản phẩm</span></div>
            <div style={styles.statDivider} />
            <div style={styles.stat}><strong style={{ fontSize:24 }}>50K+</strong><span>Khách hàng</span></div>
            <div style={styles.statDivider} />
            <div style={styles.stat}><strong style={{ fontSize:24 }}>4.9⭐</strong><span>Đánh giá</span></div>
          </div>
        </div>
        <div style={styles.heroImage}>
          <img src="https://picsum.photos/seed/hero/600/500" alt="hero" style={{ width:"100%", height:"100%", objectFit:"cover", borderRadius:24 }} />
        </div>
      </section>

      {/* Features */}
      <section style={styles.features}>
        {FEATURES.map(f => (
          <div key={f.title} style={styles.featureCard}>
            <span style={{ fontSize:32 }}>{f.icon}</span>
            <div>
              <div style={{ fontWeight:700, color:"#1e293b", marginBottom:2 }}>{f.title}</div>
              <div style={{ fontSize:13, color:"#64748b" }}>{f.desc}</div>
            </div>
          </div>
        ))}
      </section>

      {/* Categories */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Danh mục nổi bật</h2>
        <div style={styles.categoryGrid}>
          {CATEGORIES.map(c => (
            <Link key={c.name} to={`/products?category=${c.name}`} style={{ ...styles.categoryCard, background:c.color }}>
              <span style={{ fontSize:40 }}>{c.icon}</span>
              <span style={{ fontWeight:700, color:"#1e293b", fontSize:16, marginTop:8 }}>{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section style={styles.section}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
          <h2 style={{ ...styles.sectionTitle, margin:0 }}>Sản phẩm nổi bật</h2>
          <Link to="/products" style={styles.viewAll}>Xem tất cả →</Link>
        </div>
        {loading ? (
          <div style={styles.loading}>
            {[...Array(8)].map((_, i) => <div key={i} style={styles.skeleton} />)}
          </div>
        ) : (
          <div style={styles.productGrid}>
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* CTA Banner */}
      <section style={styles.ctaBanner}>
        <h2 style={{ fontSize:32, fontWeight:800, margin:"0 0 12px", color:"#fff" }}>Đừng bỏ lỡ ưu đãi hôm nay!</h2>
        <p style={{ color:"rgba(255,255,255,0.85)", marginBottom:28, fontSize:16 }}>Giảm đến 50% cho đơn hàng đầu tiên khi đăng ký tài khoản</p>
        <Link to="/register" style={{ background:"#fff", color:"#6366f1", padding:"14px 36px", borderRadius:50, fontWeight:700, textDecoration:"none", fontSize:16 }}>
          Đăng ký ngay — Miễn phí
        </Link>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerLogo}>🛍️ ShopHub</div>
        <p style={{ color:"#64748b", margin:"8px 0 0" }}>© 2024 ShopHub. Mua sắm thông minh mỗi ngày.</p>
      </footer>
    </div>
  );
}

const styles = {
  hero: { display:"flex", alignItems:"center", gap:48, padding:"64px 80px", background:"linear-gradient(135deg,#f0f4ff 0%,#faf5ff 100%)", minHeight:520 },
  heroContent: { flex:1 },
  heroEyebrow: { color:"#6366f1", fontWeight:600, fontSize:14, letterSpacing:1, textTransform:"uppercase", margin:"0 0 16px" },
  heroTitle: { fontSize:52, fontWeight:900, color:"#0f172a", lineHeight:1.15, margin:"0 0 16px" },
  heroAccent: { background:"linear-gradient(135deg,#6366f1,#a855f7)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" },
  heroSub: { color:"#475569", fontSize:18, lineHeight:1.6, margin:0 },
  heroBtnPrimary: { background:"linear-gradient(135deg,#6366f1,#a855f7)", color:"#fff", padding:"14px 28px", borderRadius:12, fontWeight:700, textDecoration:"none", fontSize:16 },
  heroBtnSecondary: { background:"#fff", color:"#6366f1", padding:"14px 28px", borderRadius:12, fontWeight:700, textDecoration:"none", fontSize:16, border:"2px solid #6366f1" },
  heroStats: { display:"flex", alignItems:"center", gap:24, marginTop:40, color:"#475569", fontSize:14 },
  stat: { display:"flex", flexDirection:"column", gap:2 },
  statDivider: { width:1, height:40, background:"#e2e8f0" },
  heroImage: { flex:1, height:400, borderRadius:24, overflow:"hidden", boxShadow:"0 24px 64px rgba(99,102,241,0.2)" },
  features: { display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:0, background:"#fff", borderTop:"1px solid #e2e8f0", borderBottom:"1px solid #e2e8f0" },
  featureCard: { display:"flex", alignItems:"center", gap:16, padding:"24px 32px", borderRight:"1px solid #e2e8f0" },
  section: { padding:"64px 80px" },
  sectionTitle: { fontSize:28, fontWeight:800, color:"#0f172a", marginBottom:32 },
  categoryGrid: { display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:20 },
  categoryCard: { display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"32px 20px", borderRadius:20, textDecoration:"none", transition:"transform 0.2s", cursor:"pointer" },
  productGrid: { display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:24 },
  loading: { display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:24 },
  skeleton: { height:340, background:"linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)", borderRadius:16, animation:"pulse 1.5s infinite" },
  viewAll: { color:"#6366f1", textDecoration:"none", fontWeight:600, fontSize:15 },
  ctaBanner: { margin:"0 80px 64px", background:"linear-gradient(135deg,#6366f1,#a855f7)", borderRadius:24, padding:"64px", textAlign:"center" },
  footer: { background:"#1e293b", padding:"32px 80px", textAlign:"center" },
  footerLogo: { color:"#fff", fontWeight:800, fontSize:24 },
};