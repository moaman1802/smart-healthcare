import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "./MedicineList.css";

function MedicineList() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await API.get("/medicines/admin/all");
      setMedicines(response.data);
      const cats = [...new Set(response.data.map(m => m.category).filter(Boolean))];
      setCategories(cats);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching medicines:", error);
      alert("Failed to load medicines");
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchMedicines();
      return;
    }
    try {
      const response = await API.get(`/medicines/search?name=${searchQuery}`);
      setMedicines(response.data);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleFilterCategory = async (category) => {
    setFilterCategory(category);
    if (category === "ALL") {
      fetchMedicines();
      return;
    }
    try {
      const response = await API.get(`/medicines/category/${category}`);
      setMedicines(response.data);
    } catch (error) {
      console.error("Filter error:", error);
    }
  };

  const handleFilterStatus = async (status) => {
    setFilterStatus(status);
    if (status === "ALL") {
      fetchMedicines();
      return;
    }
    try {
      const response = await API.get(`/medicines/status/${status}`);
      setMedicines(response.data);
    } catch (error) {
      console.error("Filter error:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this medicine?")) return;
    try {
      await API.delete(`/medicines/admin/delete/${id}`);
      alert("Medicine deleted successfully!");
      fetchMedicines();
    } catch (error) {
      alert("Failed to delete medicine");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "ACTIVE": return "status-active";
      case "INACTIVE": return "status-inactive";
      case "OUT_OF_STOCK": return "status-out";
      default: return "";
    }
  };

  if (loading) return <div className="loading">Loading medicines...</div>;

  return (
    <div className="medicine-list">
      <div className="med-header">
        <h2>💊 Medicine Management</h2>
        <button className="btn-add" onClick={() => navigate("/add-medicine")}>
          + Add Medicine
        </button>
      </div>

      <div className="med-toolbar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button onClick={handleSearch}>🔍</button>
          {searchQuery && (
            <button className="clear-btn" onClick={() => { setSearchQuery(""); fetchMedicines(); }}>✕</button>
          )}
        </div>
        <div className="filter-box">
          <span>Category:</span>
          <button className={filterCategory === "ALL" ? "active" : ""} onClick={() => handleFilterCategory("ALL")}>All</button>
          {categories.map((cat) => (
            <button key={cat} className={filterCategory === cat ? "active" : ""} onClick={() => handleFilterCategory(cat)}>
              {cat}
            </button>
          ))}
        </div>
        <div className="filter-box">
          <span>Status:</span>
          <button className={filterStatus === "ALL" ? "active" : ""} onClick={() => handleFilterStatus("ALL")}>All</button>
          <button className={filterStatus === "ACTIVE" ? "active" : ""} onClick={() => handleFilterStatus("ACTIVE")}>Active</button>
          <button className={filterStatus === "INACTIVE" ? "active" : ""} onClick={() => handleFilterStatus("INACTIVE")}>Inactive</button>
          <button className={filterStatus === "OUT_OF_STOCK" ? "active" : ""} onClick={() => handleFilterStatus("OUT_OF_STOCK")}>Out of Stock</button>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Category</th>
              <th>Manufacturer</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Expiry</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {medicines.length === 0 ? (
              <tr><td colSpan="9" className="empty-row">No medicines found.</td></tr>
            ) : (
              medicines.map((med, index) => (
                <tr key={med.id}>
                  <td>{index + 1}</td>
                  <td>{med.name}</td>
                  <td>{med.category}</td>
                  <td>{med.manufacturer || "N/A"}</td>
                  <td>{med.quantity}</td>
                  <td>₹{med.price}</td>
                  <td>{med.expiryDate}</td>
                  <td>
                    <span className={`status-badge ${getStatusColor(med.status)}`}>
                      {med.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn-edit" onClick={() => navigate("/add-medicine", { state: { medicine: med } })}>✏️</button>
                    <button className="btn-delete" onClick={() => handleDelete(med.id)}>🗑️</button>
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

export default MedicineList;