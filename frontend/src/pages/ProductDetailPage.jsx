// frontend/src/pages/ProductDetailPage.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import { api } from "../api";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    api.get(`/products/${id}`)
      .then(setProduct)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = () => {
    addItem(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <div style={s.center}><Navbar /><div style={{ padding:80, textAlign:"center" }}>Đang tải...</div></div>;
  if (!product) return <div><Navbar /><div style={{ padding:80, textAlign:"center" }}>Không tìm thấy sản phẩm</div></div>;

  return (
    <div style={{ fontFamily:"'Segoe UI', sans-serif", background:"#f8fafc", minHeight:"100vh" }}>
      <Navbar />
      <div style={s.container}>
        <Link to="/products" style={s.back}>← Quay lại danh sách</Link>
        <div style={s.card}>
          <img src={product.image} alt={product.name} style={s.img} />
          <div style={s.info}>
            <span style={s.badge}>{product.category}</span>
            <h1 style={s.name}>{product.name}</h1>
            <div style={s.rating}>⭐ {product.rating} / 5</div>
            <p style={s.desc}>{product.description}</p>
            <div style={s.price}>{product.price.toLocaleString("vi-VN")}đ</div>
            <div style={s.stock}>Còn lại: <strong>{product.stock}</strong> sản phẩm</div>
            <div style={s.qtyRow}>
              <button style={s.qtyBtn} onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
              <span style={s.qtyNum}>{qty}</span>
              <button style={s.qtyBtn} onClick={() => setQty(q => Math.min(product.stock, q + 1))}>+</button>
            </div>
            <button style={{ ...s.addBtn, background: added ? "#16a34a" : "linear-gradient(135deg,#6366f1,#a855f7)" }} onClick={handleAdd}>
              {added ? "✅ Đã thêm vào giỏ!" : "🛒 Thêm vào giỏ hàng"}
            </button>
            <Link to="/cart" style={s.cartLink}>Xem giỏ hàng →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  center: { fontFamily:"'Segoe UI', sans-serif" },
  container: { padding:"32px 80px" },
  back: { color:"#6366f1", textDecoration:"none", fontWeight:600, fontSize:15, display:"inline-block", marginBottom:24 },
  card: { background:"#fff", borderRadius:24, overflow:"hidden", boxShadow:"0 8px 32px rgba(0,0,0,0.08)", display:"flex", gap:0 },
  img: { width:480, height:480, objectFit:"cover" },
  info: { flex:1, padding:"48px 48px", display:"flex", flexDirection:"column", gap:0 },
  badge: { display:"inline-block", background:"#ede9fe", color:"#6366f1", padding:"4px 14px", borderRadius:20, fontSize:13, fontWeight:600, marginBottom:16 },
  name: { fontSize:32, fontWeight:800, color:"#0f172a", margin:"0 0 12px" },
  rating: { color:"#f59e0b", fontWeight:600, fontSize:16, marginBottom:16 },
  desc: { color:"#475569", fontSize:16, lineHeight:1.7, marginBottom:24 },
  price: { fontSize:36, fontWeight:800, color:"#ef4444", marginBottom:8 },
  stock: { color:"#64748b", fontSize:14, marginBottom:20 },
  qtyRow: { display:"flex", alignItems:"center", gap:16, marginBottom:24 },
  qtyBtn: { width:40, height:40, borderRadius:10, border:"2px solid #e2e8f0", background:"#fff", fontSize:20, cursor:"pointer", fontWeight:700 },
  qtyNum: { fontSize:20, fontWeight:700, minWidth:32, textAlign:"center" },
  addBtn: { padding:"16px 32px", color:"#fff", border:"none", borderRadius:14, fontWeight:700, fontSize:17, cursor:"pointer", transition:"background 0.3s", marginBottom:16 },
  cartLink: { color:"#6366f1", textDecoration:"none", fontWeight:600, fontSize:15 },
};