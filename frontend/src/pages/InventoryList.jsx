import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "./InventoryList.css";

function InventoryList() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await API.get("/inventory/admin/all");
      setItems(res.data);
      const cats = [...new Set(res.data.map(i => i.category).filter(Boolean))];
      setCategories(cats);
      setLoading(false);
    } catch (error) {
      console.error(error);
      alert("Failed to load inventory");
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!search.trim()) { fetchItems(); return; }
    try {
      const res = await API.get(`/inventory/search?name=${search}`);
      setItems(res.data);
    } catch (error) { console.error(error); }
  };

  const handleFilterCategory = async (cat) => {
    setFilterCategory(cat);
    if (cat === "ALL") { fetchItems(); return; }
    try {
      const res = await API.get(`/inventory/category/${cat}`);
      setItems(res.data);
    } catch (error) { console.error(error); }
  };

  const handleFilterStatus = async (status) => {
    setFilterStatus(status);
    if (status === "ALL") { fetchItems(); return; }
    try {
      const res = await API.get(`/inventory/status/${status}`);
      setItems(res.data);
    } catch (error) { console.error(error); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      await API.delete(`/inventory/admin/delete/${id}`);
      alert("Deleted!");
      fetchItems();
    } catch (error) { alert("Failed to delete"); }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "AVAILABLE": return "status-avail";
      case "LOW_STOCK": return "status-low";
      case "OUT_OF_STOCK": return "status-out";
      default: return "";
    }
  };

  if (loading) return <div className="loading">Loading inventory...</div>;

  return (
    <div className="inventory-list">
      <div className="inv-header">
        <h2>📦 Inventory Management</h2>
        <button className="btn-add" onClick={() => navigate("/add-inventory")}>+ Add Item</button>
      </div>
      <div className="inv-toolbar">
        <div className="search-box">
          <input type="text" placeholder="Search by name..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} />
          <button onClick={handleSearch}>🔍</button>
          {search && <button className="clear-btn" onClick={() => { setSearch(""); fetchItems(); }}>✕</button>}
        </div>
        <div className="filter-box">
          <span>Category:</span>
          <button className={filterCategory === "ALL" ? "active" : ""} onClick={() => handleFilterCategory("ALL")}>All</button>
          {categories.map(c => <button key={c} className={filterCategory === c ? "active" : ""} onClick={() => handleFilterCategory(c)}>{c}</button>)}
        </div>
        <div className="filter-box">
          <span>Status:</span>
          <button className={filterStatus === "ALL" ? "active" : ""} onClick={() => handleFilterStatus("ALL")}>All</button>
          <button className={filterStatus === "AVAILABLE" ? "active" : ""} onClick={() => handleFilterStatus("AVAILABLE")}>Available</button>
          <button className={filterStatus === "LOW_STOCK" ? "active" : ""} onClick={() => handleFilterStatus("LOW_STOCK")}>Low Stock</button>
          <button className={filterStatus === "OUT_OF_STOCK" ? "active" : ""} onClick={() => handleFilterStatus("OUT_OF_STOCK")}>Out of Stock</button>
          <button className={filterStatus === "DISCONTINUED" ? "active" : ""} onClick={() => handleFilterStatus("DISCONTINUED")}>Discontinued</button>
        </div>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Unit</th>
              <th>Price</th>
              <th>Supplier</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan="9" className="empty-row">No items found.</td></tr>
            ) : (
              items.map((item, idx) => (
                <tr key={item.id}>
                  <td>{idx + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.category}</td>
                  <td>{item.quantity}</td>
                  <td>{item.unit || "pcs"}</td>
                  <td>₹{item.unitPrice || 0}</td>
                  <td>{item.supplier || "N/A"}</td>
                  <td><span className={`status-badge ${getStatusColor(item.status)}`}>{item.status}</span></td>
                  <td>
                    <button className="btn-edit" onClick={() => navigate("/add-inventory", { state: { item } })}>✏️</button>
                    <button className="btn-delete" onClick={() => handleDelete(item.id)}>🗑️</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default InventoryList;