// frontend/src/pages/CartPage.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCart } from "../context/CartContext";
import { api } from "../api";

export default function CartPage() {
  const { items, updateQty, removeItem, clearCart, total } = useCart();
  const [form, setForm] = useState({ customerName:"", phone:"", address:"" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleOrder = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);
    try {
      await api.post("/orders", {
        customerName: form.customerName,
        phone: form.phone,
        address: form.address,
        items: items.map(i => ({ productId: i.id, quantity: i.qty })),
      });
      clearCart();
      setSuccess(true);
    } catch (err) {
      alert("Đặt hàng thất bại: " + err.message);
    } finally { setLoading(false); }
  };

  if (success) return (
    <div style={{ fontFamily:"'Segoe UI', sans-serif", background:"#f8fafc", minHeight:"100vh" }}>
      <Navbar />
      <div style={{ textAlign:"center", padding:"80px 20px" }}>
        <div style={{ fontSize:80 }}>🎉</div>
        <h2 style={{ fontSize:32, fontWeight:800, color:"#0f172a", margin:"16px 0 8px" }}>Đặt hàng thành công!</h2>
        <p style={{ color:"#64748b", fontSize:16, marginBottom:32 }}>Cảm ơn bạn đã mua sắm tại ShopHub. Chúng tôi sẽ liên hệ sớm!</p>
        <Link to="/" style={{ background:"linear-gradient(135deg,#6366f1,#a855f7)", color:"#fff", padding:"14px 36px", borderRadius:12, fontWeight:700, textDecoration:"none" }}>
          Về trang chủ
        </Link>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily:"'Segoe UI', sans-serif", background:"#f8fafc", minHeight:"100vh" }}>
      <Navbar />
      <div style={s.container}>
        <h1 style={s.title}>🛒 Giỏ hàng ({items.length} sản phẩm)</h1>
        {items.length === 0 ? (
          <div style={s.empty}>
            <div style={{ fontSize:80 }}>🛒</div>
            <p style={{ color:"#64748b", fontSize:18 }}>Giỏ hàng trống</p>
            <Link to="/products" style={s.shopBtn}>Tiếp tục mua sắm</Link>
          </div>
        ) : (
          <div style={s.layout}>
            <div style={{ flex:1 }}>
              {items.map(item => (
                <div key={item.id} style={s.item}>
                  <img src={item.image} alt={item.name} style={s.itemImg} />
                  <div style={{ flex:1 }}>
                    <div style={s.itemName}>{item.name}</div>
                    <div style={s.itemPrice}>{item.price.toLocaleString("vi-VN")}đ</div>
                  </div>
                  <div style={s.qtyRow}>
                    <button style={s.qtyBtn} onClick={() => updateQty(item.id, item.qty - 1)}>−</button>
                    <span style={s.qtyNum}>{item.qty}</span>
                    <button style={s.qtyBtn} onClick={() => updateQty(item.id, item.qty + 1)}>+</button>
                  </div>
                  <div style={s.lineTotal}>{(item.price * item.qty).toLocaleString("vi-VN")}đ</div>
                  <button style={s.removeBtn} onClick={() => removeItem(item.id)}>✕</button>
                </div>
              ))}
            </div>

            <div style={s.summary}>
              <h3 style={{ fontSize:20, fontWeight:700, margin:"0 0 24px" }}>Thông tin đặt hàng</h3>
              <form onSubmit={handleOrder}>
                <label style={s.label}>Tên người nhận *</label>
                <input style={s.input} value={form.customerName} onChange={e => setForm(f => ({ ...f, customerName:e.target.value }))} placeholder="Họ và tên" required />
                <label style={s.label}>Số điện thoại</label>
                <input style={s.input} value={form.phone} onChange={e => setForm(f => ({ ...f, phone:e.target.value }))} placeholder="0xxxxxxxxx" />
                <label style={s.label}>Địa chỉ giao hàng</label>
                <textarea style={{ ...s.input, height:80, resize:"vertical" }} value={form.address} onChange={e => setForm(f => ({ ...f, address:e.target.value }))} placeholder="Địa chỉ chi tiết..." />
                <div style={s.totalRow}>
                  <span>Tổng cộng:</span>
                  <span style={{ color:"#ef4444", fontWeight:800, fontSize:22 }}>{total.toLocaleString("vi-VN")}đ</span>
                </div>
                <button type="submit" style={s.orderBtn} disabled={loading}>
                  {loading ? "Đang đặt hàng..." : "✅ Đặt hàng ngay"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  container: { padding:"32px 80px" },
  title: { fontSize:28, fontWeight:800, color:"#0f172a", marginBottom:32 },
  empty: { textAlign:"center", padding:"60px", display:"flex", flexDirection:"column", alignItems:"center", gap:16 },
  shopBtn: { background:"linear-gradient(135deg,#6366f1,#a855f7)", color:"#fff", padding:"14px 36px", borderRadius:12, fontWeight:700, textDecoration:"none", fontSize:16 },
  layout: { display:"flex", gap:32, alignItems:"flex-start" },
  item: { background:"#fff", borderRadius:16, padding:20, marginBottom:16, display:"flex", alignItems:"center", gap:20, boxShadow:"0 2px 8px rgba(0,0,0,0.05)" },
  itemImg: { width:80, height:80, borderRadius:12, objectFit:"cover" },
  itemName: { fontWeight:700, color:"#1e293b", fontSize:16, marginBottom:4 },
  itemPrice: { color:"#64748b", fontSize:14 },
  qtyRow: { display:"flex", alignItems:"center", gap:10 },
  qtyBtn: { width:32, height:32, borderRadius:8, border:"1px solid #e2e8f0", background:"#f8fafc", cursor:"pointer", fontWeight:700 },
  qtyNum: { fontWeight:700, minWidth:24, textAlign:"center" },
  lineTotal: { fontWeight:700, color:"#ef4444", fontSize:16, minWidth:100, textAlign:"right" },
  removeBtn: { background:"#fef2f2", border:"none", color:"#ef4444", width:32, height:32, borderRadius:8, cursor:"pointer", fontWeight:700 },
  summary: { width:360, background:"#fff", borderRadius:20, padding:28, boxShadow:"0 8px 24px rgba(0,0,0,0.08)", flexShrink:0 },
  label: { display:"block", fontSize:14, fontWeight:600, color:"#374151", marginBottom:6 },
  input: { width:"100%", padding:"10px 14px", border:"2px solid #e2e8f0", borderRadius:10, fontSize:14, marginBottom:16, boxSizing:"border-box", outline:"none" },
  totalRow: { display:"flex", justifyContent:"space-between", alignItems:"center", padding:"16px 0", borderTop:"2px solid #e2e8f0", marginBottom:20 },
  orderBtn: { width:"100%", padding:"14px", background:"linear-gradient(135deg,#6366f1,#a855f7)", color:"#fff", border:"none", borderRadius:12, fontWeight:700, fontSize:16, cursor:"pointer" },
};