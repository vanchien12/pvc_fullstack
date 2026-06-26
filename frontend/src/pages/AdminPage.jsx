// frontend/src/pages/AdminPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { api } from "../api";

export default function AdminPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ name:"", price:"", image:"", description:"", stock:"", category:"Áo" });
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api.get("/products").then(setProducts);
    api.get("/orders").then(setOrders).catch(() => {});
  }, []);

  const showMsg = (m) => { setMsg(m); setTimeout(() => setMsg(""), 3000); };

  const handleSaveProduct = async () => {
    if (!form.name || !form.price) return showMsg("Vui lòng nhập tên và giá!");
    const body = { ...form, price: Number(form.price), stock: Number(form.stock) || 0 };
    try {
      if (editing) {
        const res = await fetch(`http://localhost:8000/api/v1/products/${editing}`, {
          method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body)
        });
        const updated = await res.json();
        setProducts(ps => ps.map(p => p.id === editing ? updated : p));
        showMsg("✅ Cập nhật thành công!");
      } else {
        const res = await fetch("http://localhost:8000/api/v1/products", {
          method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body)
        });
        const newP = await res.json();
        setProducts(ps => [...ps, newP]);
        showMsg("✅ Thêm sản phẩm thành công!");
      }
      setForm({ name:"", price:"", image:"", description:"", stock:"", category:"Áo" });
      setEditing(null);
    } catch { showMsg("❌ Có lỗi xảy ra!"); }
  };

  const handleEdit = (p) => {
    setForm({ name:p.name, price:String(p.price), image:p.image||"", description:p.description||"", stock:String(p.stock||0), category:p.category||"Áo" });
    setEditing(p.id);
    setTab("products");
    window.scrollTo(0,0);
  };

  const handleDelete = async (id) => {
    if (!confirm("Xóa sản phẩm này?")) return;
    await fetch(`http://localhost:8000/api/v1/products/${id}`, { method:"DELETE" });
    setProducts(ps => ps.filter(p => p.id !== id));
    showMsg("🗑️ Đã xóa sản phẩm!");
  };

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const stats = [
    { label:"Sản phẩm", value:products.length, icon:"📦", color:"#ede9fe" },
    { label:"Đơn hàng", value:orders.length, icon:"📋", color:"#dbeafe" },
    { label:"Chờ duyệt", value:orders.filter(o=>o.status==="pending").length, icon:"⏳", color:"#fef3c7" },
    { label:"Đã duyệt", value:orders.filter(o=>o.status==="approved").length, icon:"✅", color:"#d1fae5" },
  ];

  return (
    <div style={{ fontFamily:"'Segoe UI', sans-serif", background:"#f1f5f9", minHeight:"100vh" }}>
      <Navbar />
      <div style={s.container}>
        {/* Header */}
        <div style={s.header}>
          <div>
            <h1 style={s.title}>🛠️ Trang quản trị</h1>
            <p style={s.sub}>Xin chào, <strong>{user?.username}</strong>! Vai trò: Admin</p>
          </div>
        </div>

        {msg && <div style={s.msgBar}>{msg}</div>}

        {/* Stats */}
        <div style={s.statsGrid}>
          {stats.map(st => (
            <div key={st.label} style={{ ...s.statCard, background:st.color }}>
              <span style={{ fontSize:36 }}>{st.icon}</span>
              <div>
                <div style={{ fontSize:32, fontWeight:800, color:"#0f172a" }}>{st.value}</div>
                <div style={{ fontSize:14, color:"#64748b" }}>{st.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={s.tabs}>
          {["products","orders"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ ...s.tab, ...(tab===t ? s.tabActive : {}) }}>
              {t === "products" ? "📦 Sản phẩm" : "📋 Đơn hàng"}
            </button>
          ))}
        </div>

        {tab === "products" && (
          <div style={s.panel}>
            {/* Form thêm/sửa */}
            <div style={s.formCard}>
              <h3 style={s.formTitle}>{editing ? "✏️ Sửa sản phẩm" : "➕ Thêm sản phẩm mới"}</h3>
              <div style={s.formGrid}>
                <div>
                  <label style={s.label}>Tên sản phẩm *</label>
                  <input style={s.input} value={form.name} onChange={set("name")} placeholder="Nhập tên sản phẩm" />
                </div>
                <div>
                  <label style={s.label}>Giá (VND) *</label>
                  <input style={s.input} type="number" value={form.price} onChange={set("price")} placeholder="150000" />
                </div>
                <div>
                  <label style={s.label}>Danh mục</label>
                  <select style={s.input} value={form.category} onChange={set("category")}>
                    {["Áo","Quần","Giày","Túi"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={s.label}>Tồn kho</label>
                  <input style={s.input} type="number" value={form.stock} onChange={set("stock")} placeholder="50" />
                </div>
                <div style={{ gridColumn:"1/-1" }}>
                  <label style={s.label}>URL hình ảnh</label>
                  <input style={s.input} value={form.image} onChange={set("image")} placeholder="https://..." />
                </div>
                <div style={{ gridColumn:"1/-1" }}>
                  <label style={s.label}>Mô tả</label>
                  <textarea style={{ ...s.input, height:80, resize:"vertical" }} value={form.description} onChange={set("description")} placeholder="Mô tả sản phẩm..." />
                </div>
              </div>
              <div style={{ display:"flex", gap:12 }}>
                <button style={s.saveBtn} onClick={handleSaveProduct}>
                  {editing ? "💾 Lưu thay đổi" : "➕ Thêm sản phẩm"}
                </button>
                {editing && <button style={s.cancelBtn} onClick={() => { setEditing(null); setForm({ name:"", price:"", image:"", description:"", stock:"", category:"Áo" }); }}>Hủy</button>}
              </div>
            </div>

            {/* Product Table */}
            <div style={s.tableCard}>
              <h3 style={s.formTitle}>Danh sách sản phẩm ({products.length})</h3>
              <table style={s.table}>
                <thead>
                  <tr style={s.thead}>
                    <th style={s.th}>Sản phẩm</th>
                    <th style={s.th}>Danh mục</th>
                    <th style={s.th}>Giá</th>
                    <th style={s.th}>Tồn kho</th>
                    <th style={s.th}>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id} style={s.tr}>
                      <td style={s.td}>
                        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                          <img src={p.image} alt={p.name} style={{ width:48, height:48, borderRadius:10, objectFit:"cover" }} />
                          <span style={{ fontWeight:600 }}>{p.name}</span>
                        </div>
                      </td>
                      <td style={s.td}><span style={s.catBadge}>{p.category}</span></td>
                      <td style={s.td}><strong style={{ color:"#ef4444" }}>{p.price?.toLocaleString("vi-VN")}đ</strong></td>
                      <td style={s.td}>{p.stock}</td>
                      <td style={s.td}>
                        <button style={s.editBtn} onClick={() => handleEdit(p)}>✏️ Sửa</button>
                        <button style={s.deleteBtn} onClick={() => handleDelete(p.id)}>🗑️ Xóa</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "orders" && (
          <div style={s.tableCard}>
            <h3 style={s.formTitle}>Danh sách đơn hàng ({orders.length})</h3>
            {orders.length === 0 ? (
              <div style={{ textAlign:"center", padding:40, color:"#64748b" }}>Chưa có đơn hàng nào</div>
            ) : (
              <table style={s.table}>
                <thead>
                  <tr style={s.thead}>
                    <th style={s.th}>ID</th>
                    <th style={s.th}>Khách hàng</th>
                    <th style={s.th}>SĐT</th>
                    <th style={s.th}>Tổng tiền</th>
                    <th style={s.th}>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id} style={s.tr}>
                      <td style={s.td}>#{o.id}</td>
                      <td style={s.td}><strong>{o.customerName}</strong></td>
                      <td style={s.td}>{o.phone || "—"}</td>
                      <td style={s.td}><strong style={{ color:"#ef4444" }}>{o.total?.toLocaleString("vi-VN")}đ</strong></td>
                      <td style={s.td}>
                        <span style={{ ...s.statusBadge, background: o.status==="approved"?"#d1fae5":o.status==="rejected"?"#fef2f2":"#fef3c7", color:o.status==="approved"?"#16a34a":o.status==="rejected"?"#ef4444":"#d97706" }}>
                          {o.status === "approved" ? "✅ Đã duyệt" : o.status === "rejected" ? "❌ Từ chối" : "⏳ Chờ duyệt"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const s = {
  container: { padding:"32px 80px" },
  header: { display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 },
  title: { fontSize:28, fontWeight:800, color:"#0f172a", margin:"0 0 4px" },
  sub: { color:"#64748b", margin:0 },
  msgBar: { background:"#f0fdf4", border:"1px solid #bbf7d0", color:"#16a34a", padding:"12px 20px", borderRadius:12, marginBottom:20, fontWeight:600 },
  statsGrid: { display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:28 },
  statCard: { borderRadius:16, padding:"20px 24px", display:"flex", alignItems:"center", gap:16 },
  tabs: { display:"flex", gap:4, background:"#fff", borderRadius:12, padding:4, marginBottom:24, width:"fit-content", boxShadow:"0 2px 8px rgba(0,0,0,0.06)" },
  tab: { padding:"10px 24px", borderRadius:10, border:"none", background:"transparent", cursor:"pointer", fontWeight:600, color:"#64748b", fontSize:15 },
  tabActive: { background:"linear-gradient(135deg,#6366f1,#a855f7)", color:"#fff" },
  panel: { display:"flex", flexDirection:"column", gap:24 },
  formCard: { background:"#fff", borderRadius:20, padding:28, boxShadow:"0 4px 16px rgba(0,0,0,0.06)" },
  formTitle: { fontSize:18, fontWeight:700, color:"#0f172a", margin:"0 0 20px" },
  formGrid: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:20 },
  label: { display:"block", fontSize:13, fontWeight:600, color:"#374151", marginBottom:6 },
  input: { width:"100%", padding:"10px 14px", border:"2px solid #e2e8f0", borderRadius:10, fontSize:14, boxSizing:"border-box", outline:"none" },
  saveBtn: { background:"linear-gradient(135deg,#6366f1,#a855f7)", color:"#fff", border:"none", padding:"12px 28px", borderRadius:10, fontWeight:700, cursor:"pointer", fontSize:15 },
  cancelBtn: { background:"#f1f5f9", color:"#475569", border:"none", padding:"12px 20px", borderRadius:10, fontWeight:600, cursor:"pointer" },
  tableCard: { background:"#fff", borderRadius:20, padding:28, boxShadow:"0 4px 16px rgba(0,0,0,0.06)" },
  table: { width:"100%", borderCollapse:"collapse" },
  thead: { background:"#f8fafc" },
  th: { padding:"12px 16px", textAlign:"left", fontSize:13, fontWeight:700, color:"#64748b", textTransform:"uppercase", letterSpacing:0.5 },
  tr: { borderBottom:"1px solid #f1f5f9" },
  td: { padding:"14px 16px", fontSize:14, color:"#1e293b", verticalAlign:"middle" },
  catBadge: { background:"#ede9fe", color:"#6366f1", padding:"3px 10px", borderRadius:20, fontSize:12, fontWeight:600 },
  editBtn: { background:"#dbeafe", color:"#2563eb", border:"none", padding:"7px 14px", borderRadius:8, cursor:"pointer", fontWeight:600, marginRight:8, fontSize:13 },
  deleteBtn: { background:"#fef2f2", color:"#ef4444", border:"none", padding:"7px 14px", borderRadius:8, cursor:"pointer", fontWeight:600, fontSize:13 },
  statusBadge: { padding:"5px 12px", borderRadius:20, fontSize:13, fontWeight:600 },
};