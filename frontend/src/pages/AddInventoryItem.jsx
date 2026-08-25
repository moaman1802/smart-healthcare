import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api/api";
import "./AddInventoryItem.css";

function AddInventoryItem() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    quantity: "",
    reorderLevel: "",
    unit: "pcs",
    unitPrice: "",
    supplier: "",
    purchaseDate: "",
    location: "",
    status: "AVAILABLE",
  });

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    const state = location.state;
    if (state?.item) {
      setEditing(state.item);
      setForm({
        name: state.item.name || "",
        category: state.item.category || "",
        description: state.item.description || "",
        quantity: state.item.quantity || "",
        reorderLevel: state.item.reorderLevel || "",
        unit: state.item.unit || "pcs",
        unitPrice: state.item.unitPrice || "",
        supplier: state.item.supplier || "",
        purchaseDate: state.item.purchaseDate || "",
        location: state.item.location || "",
        status: state.item.status || "AVAILABLE",
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editing) {
        await API.put(`/inventory/admin/update/${editing.id}`, form);
        alert("✅ Item updated!");
      } else {
        await API.post("/inventory/admin/add", form);
        alert("✅ Item added!");
      }
      navigate("/inventory");
    } catch (error) {
      alert(error.response?.data?.error || "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-inventory">
      <div className="inv-header">
        <h2>📦 {editing ? "Edit" : "Add"} Inventory Item</h2>
        <button className="btn-back" onClick={() => navigate(-1)}>← Back</button>
      </div>
      <form onSubmit={handleSubmit} className="inv-form">
        <div className="form-row">
          <div className="form-group">
            <label>Item Name *</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Category *</label>
            <select name="category" value={form.category} onChange={handleChange} required>
              <option value="">Select</option>
              <option value="Medical Equipment">Medical Equipment</option>
              <option value="Consumables">Consumables</option>
              <option value="Furniture">Furniture</option>
              <option value="Stationery">Stationery</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows="2" />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Quantity *</label>
            <input type="number" name="quantity" value={form.quantity} onChange={handleChange} min="0" required />
          </div>
          <div className="form-group">
            <label>Reorder Level</label>
            <input type="number" name="reorderLevel" value={form.reorderLevel} onChange={handleChange} min="0" placeholder="e.g. 10" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Unit</label>
            <select name="unit" value={form.unit} onChange={handleChange}>
              <option value="pcs">Pieces</option>
              <option value="box">Box</option>
              <option value="bottle">Bottle</option>
              <option value="pack">Pack</option>
            </select>
          </div>
          <div className="form-group">
            <label>Unit Price (₹)</label>
            <input type="number" name="unitPrice" value={form.unitPrice} onChange={handleChange} min="0" step="0.01" />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Supplier</label>
            <input type="text" name="supplier" value={form.supplier} onChange={handleChange} placeholder="Supplier name" />
          </div>
          <div className="form-group">
            <label>Purchase Date</label>
            <input type="date" name="purchaseDate" value={form.purchaseDate} onChange={handleChange} />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Location / Storage</label>
            <input type="text" name="location" value={form.location} onChange={handleChange} placeholder="e.g. Store Room A" />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="AVAILABLE">Available</option>
              <option value="LOW_STOCK">Low Stock</option>
              <option value="OUT_OF_STOCK">Out of Stock</option>
              <option value="DISCONTINUED">Discontinued</option>
            </select>
          </div>
        </div>
        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={() => navigate(-1)}>Cancel</button>
          <button type="submit" className="btn-save" disabled={loading}>{loading ? "Saving..." : "💾 Save"}</button>
        </div>
      </form>
    </div>
  );
}

export default AddInventoryItem;