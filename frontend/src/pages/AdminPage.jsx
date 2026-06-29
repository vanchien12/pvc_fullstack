// frontend/src/pages/AdminPage.jsx
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { api } from "../api";

const BASE_URL = "http://localhost:8000/api/v1";
const getToken = () => localStorage.getItem("shophub_token");

const authFetch = (url, options = {}) =>
  fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
      ...(options.headers || {}),
    },
  });

export default function AdminPage() {
  const { user } = useAuth();
  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ name:"", price:"150000", image:"", description:"", stock:"50", category:"Áo" });
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("success");

  useEffect(() => {
    api.get("/products").then(setProducts).catch(console.error);
    api.get("/orders").then(setOrders).catch(() => {});
  }, []);

  const showMsg = (m, type = "success") => {
    setMsg(m); setMsgType(type);
    setTimeout(() => setMsg(""), 3000);
  };

  const handleSaveProduct = async () => {
    if (!form.name || !form.price) return showMsg("Vui lòng nhập tên và giá!", "error");
    const body = {
      name: form.name,
      price: Number(form.price),
      stock: Number(form.stock) || 0,
      category: form.category,
      image: form.image || null,
      description: form.description || null,
    };
    try {
      if (editing) {
        const res = await authFetch(`${BASE_URL}/products/${editing}`, {
          method: "PUT",
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const err = await res.json();
          return showMsg("❌ " + (err.detail || "Lỗi cập nhật!"), "error");
        }
        const updated = await res.json();
        setProducts(ps => ps.map(p => p.id === editing ? updated : p));
        showMsg("✅ Cập nhật thành công!");
      } else {
        const res = await authFetch(`${BASE_URL}/products/`, {
          method: "POST",
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const err = await res.json();
          return showMsg("❌ " + (err.detail || "Lỗi thêm sản phẩm!"), "error");
        }
        const newP = await res.json();
        setProducts(ps => [...ps, newP]);
        showMsg("✅ Thêm sản phẩm thành công!");
      }
      setForm({ name:"", price:"150000", image:"", description:"", stock:"50", category:"Áo" });
      setEditing(null);
    } catch (e) {
      showMsg("❌ Có lỗi xảy ra: " + e.message, "error");
    }
  };

  const handleEdit = (p) => {
    setForm({
      name: p.name,
      price: String(p.price),
      image: p.image || "",
      description: p.description || "",
      stock: String(p.stock || 0),
      category: p.category || "Áo",
    });
    setEditing(p.id);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!confirm("Xóa sản phẩm này?")) return;
    try {
      const res = await authFetch(`${BASE_URL}/products/${id}`, { method: "DELETE" });
      if (!res.ok) return showMsg("❌ Không thể xóa!", "error");
      setProducts(ps => ps.filter(p => p.id !== id));
      showMsg("🗑️ Đã xóa sản phẩm!");
    } catch { showMsg("❌ Lỗi xóa sản phẩm!", "error"); }
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
        <div style={s.header}>
          <div>
            <h1 style={s.title}>🛠️ Trang quản trị</h1>
            <p style={s.sub}>Xin chào, <strong>{user?.name || user?.email}</strong>! Vai trò: Admin</p>
          </div>
        </div>

        {msg && (
          <div style={{
            ...s.msgBar,
            background: msgType === "error" ? "#fef2f2" : "#f0fdf4",
            border: `1px solid ${msgType === "error" ? "#fecaca" : "#bbf7d0"}`,
            color: msgType === "error" ? "#dc2626" : "#16a34a",
          }}>
            {msg}
          </div>
        )}

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

        <div style={s.tabs}>
          {["products","orders"].map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ ...s.tab, ...(tab===t ? s.tabActive : {}) }}>
              {t === "products" ? "📦 Sản phẩm" : "📋 Đơn hàng"}
            </button>
          ))}
        </div>

        {tab === "products" && (
          <div style={s.panel}>
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
                    {["Áo","Quần","Giày","Túi","Khác"].map(c => <option key={c}>{c}</option>)}
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
                {editing && (
                  <button style={s.cancelBtn} onClick={() => {
                    setEditing(null);
                    setForm({ name:"", price:"150000", image:"", description:"", stock:"50", category:"Áo" });
                  }}>Hủy</button>
                )}
              </div>
            </div>

            <div style={s.tableCard}>
              <h3 style={s.formTitle}>Danh sách sản phẩm ({products.length})</h3>
              {products.length === 0 ? (
                <div style={{ textAlign:"center", padding:40, color:"#64748b" }}>Chưa có sản phẩm nào</div>
              ) : (
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
                            {p.image ? (
                              <img src={p.image} alt={p.name} style={{ width:48, height:48, borderRadius:10, objectFit:"cover" }} />
                            ) : (
                              <div style={{ width:48, height:48, borderRadius:10, background:"#e2e8f0", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>📦</div>
                            )}
                            <span style={{ fontWeight:600 }}>{p.name}</span>
                          </div>
                        </td>
                        <td style={s.td}><span style={s.catBadge}>{p.category || "—"}</span></td>
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
              )}
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
                      <td style={s.td}><strong>{o.customer_name}</strong></td>
                      <td style={s.td}>{o.phone || "—"}</td>
                      <td style={s.td}><strong style={{ color:"#ef4444" }}>{o.total?.toLocaleString("vi-VN")}đ</strong></td>
                      <td style={s.td}>
                        <span style={{
                          ...s.statusBadge,
                          background: o.status==="approved"?"#d1fae5":o.status==="rejected"?"#fef2f2":"#fef3c7",
                          color: o.status==="approved"?"#16a34a":o.status==="rejected"?"#ef4444":"#d97706"
                        }}>
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
  msgBar: { padding:"12px 20px", borderRadius:12, marginBottom:20, fontWeight:600 },
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