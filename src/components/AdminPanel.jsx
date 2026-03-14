import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminPanel.css";

function AdminPanel() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: "",
    brand: "",
    price: "",
    category: "",
    image: "",
    rating: "",
    reviews: "",
    discount: "",
    description: ""
  });
  const [editingUser, setEditingUser] = useState(null);
  const [userRole, setUserRole] = useState("");
  const [editingOrder, setEditingOrder] = useState(null);
  const [orderStatus, setOrderStatus] = useState("");

  const token = localStorage.getItem("toko_elektronik_token");

  useEffect(() => {
    if (activeTab === "products") fetchProducts();
    else if (activeTab === "users") fetchUsers();
    else if (activeTab === "orders") fetchOrders();
  }, [activeTab]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
    }
    setLoading(false);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    }
    setLoading(false);
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
    setLoading(false);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(productForm)
      });
      if (res.ok) {
        alert("Product added successfully!");
        setProductForm({
          name: "",
          brand: "",
          price: "",
          category: "",
          image: "",
          rating: "",
          reviews: "",
          discount: "",
          description: ""
        });
        fetchProducts();
      } else {
        alert("Failed to add product");
      }
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product.id);
    setProductForm({
      name: product.name,
      brand: product.brand,
      price: product.price,
      category: product.category,
      image: product.image,
      rating: product.rating,
      reviews: product.reviews,
      discount: product.discount,
      description: product.description
    });
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/products/${editingProduct}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(productForm)
      });
      if (res.ok) {
        alert("Product updated successfully!");
        setEditingProduct(null);
        setProductForm({
          name: "",
          brand: "",
          price: "",
          category: "",
          image: "",
          rating: "",
          reviews: "",
          discount: "",
          description: ""
        });
        fetchProducts();
      } else {
        alert("Failed to update product");
      }
    } catch (err) {
      console.error("Error updating product:", err);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        alert("Product deleted successfully!");
        fetchProducts();
      } else {
        alert("Failed to delete product");
      }
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user.id);
    setUserRole(user.role);
  };

  const handleUpdateUserRole = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/${editingUser}/role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ role: userRole })
      });
      if (res.ok) {
        alert("User role updated successfully!");
        setEditingUser(null);
        fetchUsers();
      } else {
        alert("Failed to update user role");
      }
    } catch (err) {
      console.error("Error updating user role:", err);
    }
  };

  const handleEditOrder = (order) => {
    setEditingOrder(order.id);
    setOrderStatus(order.status);
  };

  const handleUpdateOrderStatus = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${editingOrder}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: orderStatus })
      });
      if (res.ok) {
        alert("Order status updated successfully!");
        setEditingOrder(null);
        fetchOrders();
      } else {
        alert("Failed to update order status");
      }
    } catch (err) {
      console.error("Error updating order status:", err);
    }
  };

  return (
    <div className="admin-panel">
      <h3>Admin Panel</h3>
      <div className="admin-tabs">
        <button className={activeTab === "products" ? "active" : ""} onClick={() => setActiveTab("products")}>Products</button>
        <button className={activeTab === "users" ? "active" : ""} onClick={() => setActiveTab("users")}>Users</button>
        <button className={activeTab === "orders" ? "active" : ""} onClick={() => setActiveTab("orders")}>Orders</button>
      </div>

      {activeTab === "products" && (
        <div className="crud-section">
          <h4>Manage Products</h4>
          <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct} className="product-form">
            <input type="text" placeholder="Name" value={productForm.name} onChange={(e) => setProductForm({...productForm, name: e.target.value})} required />
            <input type="text" placeholder="Brand" value={productForm.brand} onChange={(e) => setProductForm({...productForm, brand: e.target.value})} required />
            <input type="number" placeholder="Price" value={productForm.price} onChange={(e) => setProductForm({...productForm, price: e.target.value})} required />
            <select value={productForm.category} onChange={(e) => setProductForm({...productForm, category: e.target.value})} required>
              <option value="">Select Category</option>
              <option value="laptops">Laptops</option>
              <option value="smartphones">Smartphones</option>
              <option value="tablets">Tablets</option>
              <option value="audio">Audio</option>
              <option value="gaming">Gaming</option>
              <option value="accessories">Accessories</option>
            </select>
            <input type="url" placeholder="Image URL" value={productForm.image} onChange={(e) => setProductForm({...productForm, image: e.target.value})} />
            <input type="number" step="0.1" placeholder="Rating" value={productForm.rating} onChange={(e) => setProductForm({...productForm, rating: e.target.value})} />
            <input type="number" placeholder="Reviews" value={productForm.reviews} onChange={(e) => setProductForm({...productForm, reviews: e.target.value})} />
            <input type="number" placeholder="Discount %" value={productForm.discount} onChange={(e) => setProductForm({...productForm, discount: e.target.value})} />
            <textarea placeholder="Description" value={productForm.description} onChange={(e) => setProductForm({...productForm, description: e.target.value})} />
            <button type="submit">{editingProduct ? "Update Product" : "Add Product"}</button>
            {editingProduct && <button type="button" onClick={() => {setEditingProduct(null); setProductForm({name:"",brand:"",price:"",category:"",image:"",rating:"",reviews:"",discount:"",description:""});}}>Cancel</button>}
          </form>
          <div className="data-list">
            {loading ? <p>Loading...</p> : products.map(product => (
              <div key={product.id} className="data-item">
                <img src={product.image} alt={product.name} width="50" />
                <div>
                  <h5>{product.name}</h5>
                  <p>{product.brand} - Rp {product.price}</p>
                </div>
                <div>
                  <button onClick={() => handleEditProduct(product)}>Edit</button>
                  <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "users" && (
        <div className="crud-section">
          <h4>Manage Users</h4>
          <div className="data-list">
            {loading ? <p>Loading...</p> : users.map(user => (
              <div key={user.id} className="data-item">
                <div>
                  <h5>{user.username}</h5>
                  <p>{user.email} - Role: {user.role}</p>
                </div>
                <div>
                  {editingUser === user.id ? (
                    <>
                      <select value={userRole} onChange={(e) => setUserRole(e.target.value)}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                      <button onClick={handleUpdateUserRole}>Save</button>
                      <button onClick={() => setEditingUser(null)}>Cancel</button>
                    </>
                  ) : (
                    <button onClick={() => handleEditUser(user)}>Edit Role</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "orders" && (
        <div className="crud-section">
          <h4>Manage Orders</h4>
          <div className="data-list">
            {loading ? <p>Loading...</p> : orders.map(order => (
              <div key={order.id} className="data-item">
                <div>
                  <h5>Order #{order.order_number}</h5>
                  <p>Total: Rp {order.total} - Status: {order.status}</p>
                </div>
                <div>
                  {editingOrder === order.id ? (
                    <>
                      <select value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)}>
                        <option value="Pending">Pending</option>
                        <option value="Dalam Pengiriman">Dalam Pengiriman</option>
                        <option value="Selesai">Selesai</option>
                        <option value="Dibatalkan">Dibatalkan</option>
                      </select>
                      <button onClick={handleUpdateOrderStatus}>Save</button>
                      <button onClick={() => setEditingOrder(null)}>Cancel</button>
                    </>
                  ) : (
                    <button onClick={() => handleEditOrder(order)}>Update Status</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;