import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { formatRupiahShort } from "../utils/formatCurrency";
import AdminPanel from "../components/AdminPanel";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const { orders, user } = useContext(CartContext);
  const [stats, setStats] = useState({
    totalproducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  // Fetch statistics dari API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch products
        const productsRes = await fetch("http://localhost:5000/api/products");
        const products = productsRes.ok ? await productsRes.json() : [];
        
        let totalUsers = 1; // Minimal ada 1 user (yang login)
        
        // Jika admin, fetch users
        if (user?.role === 'admin') {
          const usersRes = await fetch("http://localhost:5000/api/users", {
            headers: { Authorization: `Bearer ${localStorage.getItem("toko_elektronik_token")}` }
          });
          const users = usersRes.ok ? await usersRes.json() : [];
          totalUsers = users.length;
        }
        
        // Hitung revenue dari orders di context
        const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
        
        setStats({
          totalproducts: products.length || 8,
          totalUsers: totalUsers,
          totalOrders: orders.length || 0,
          totalRevenue: totalRevenue || 0
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
        // Fallback values
        setStats({
          totalproducts: 8,
          totalUsers: 1,
          totalOrders: orders.length || 0,
          totalRevenue: orders.reduce((sum, order) => sum + (order.total || 0), 0) || 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [orders, user]);

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="welcome-card">
          <h2>Selamat Datang, Di Toko Elektronik Kami! 👋</h2>
          <p>Anda telah berhasil login ke sistem ELECTRONIC STORE kami.</p>
        </div>

        <div className="menu-container">
          <h3>Menu Utama</h3>
          <div className="menu-buttons">
            <button className="menu-btn" onClick={() => navigate("/products")}>
              � Jelajahi Elektronik
            </button>
            <button className="menu-btn" onClick={() => navigate("/cart")}>
              🛒 Keranjang Belanja
            </button>
            <button className="menu-btn" onClick={() => navigate("/orders")}>
              📦 Riwayat Pesanan
            </button>
            <button className="menu-btn" onClick={() => navigate("/profile")}>
              👤 Profil Saya
            </button>
          </div>
        </div>

        {user?.role === 'admin' && (
          <div className="stats-container">
            <h3>Dashboard Admin</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📦</div>
                <div className="stat-content">
                  <h4>{stats.totalproducts}</h4>
                  <p>Total Produk</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-content">
                  <h4>{stats.totalUsers}</h4>
                  <p>Total Users</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📋</div>
                <div className="stat-content">
                  <h4>{stats.totalOrders}</h4>
                  <p>Total Orders</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <div className="stat-content">
                  <h4>{formatRupiahShort(stats.totalRevenue)}</h4>
                  <p>Total Revenue</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {user?.role === 'admin' && <AdminPanel />}

        <div className="info-section">
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
