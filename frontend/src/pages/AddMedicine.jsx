import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api/api";
import "./AddMedicine.css";

function AddMedicine() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);

  const [form, setForm] = useState({
    name: "",
    category: "",
    manufacturer: "",
    composition: "",
    dosageForm: "",
    strength: "",
    quantity: "",
    price: "",
    expiryDate: "",
    storageConditions: "",
    description: "",
    status: "ACTIVE",
  });

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    // Check if editing
    const state = location.state;
    if (state?.medicine) {
      setEditingMedicine(state.medicine);
      setForm({
        name: state.medicine.name || "",
        category: state.medicine.category || "",
        manufacturer: state.medicine.manufacturer || "",
        composition: state.medicine.composition || "",
        dosageForm: state.medicine.dosageForm || "",
        strength: state.medicine.strength || "",
        quantity: state.medicine.quantity || "",
        price: state.medicine.price || "",
        expiryDate: state.medicine.expiryDate || "",
        storageConditions: state.medicine.storageConditions || "",
        description: state.medicine.description || "",
        status: state.medicine.status || "ACTIVE",
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.name || !form.category || !form.quantity || !form.price || !form.expiryDate) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      if (editingMedicine) {
        await API.put(`/medicines/admin/update/${editingMedicine.id}`, form);
        alert("✅ Medicine updated successfully!");
      } else {
        await API.post("/medicines/admin/add", form);
        alert("✅ Medicine added successfully!");
      }
      navigate("/medicines");
    } catch (error) {
      console.error("Error saving medicine:", error);
      alert(error.response?.data?.error || "Failed to save medicine");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-medicine">
      <div className="med-header">
        <h2>💊 {editingMedicine ? "Edit Medicine" : "Add New Medicine"}</h2>
        <button className="btn-back" onClick={() => navigate(-1)}>← Back</button>
      </div>

      <form onSubmit={handleSubmit} className="med-form">
        <div className="form-row">
          <div className="form-group">
            <label>Medicine Name *</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Paracetamol" required />
          </div>
          <div className="form-group">
            <label>Category *</label>
            <select name="category" value={form.category} onChange={handleChange} required>
              <option value="">Select Category</option>
              <option value="Antibiotic">Antibiotic</option>
              <option value="Painkiller">Painkiller</option>
              <option value="Antipyretic">Antipyretic</option>
              <option value="Antihistamine">Antihistamine</option>
              <option value="Antidepressant">Antidepressant</option>
              <option value="Antidiabetic">Antidiabetic</option>
              <option value="Antihypertensive">Antihypertensive</option>
              <option value="Syrup">Syrup</option>
              <option value="Injection">Injection</option>
              <option value="Cream">Cream</option>
              <option value="Vitamin">Vitamin</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Manufacturer</label>
            <input type="text" name="manufacturer" value={form.manufacturer} onChange={handleChange} placeholder="e.g. Cipla, Sun Pharma" />
          </div>
          <div className="form-group">
            <label>Composition</label>
            <input type="text" name="composition" value={form.composition} onChange={handleChange} placeholder="e.g. Paracetamol 500mg" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Dosage Form</label>
            <select name="dosageForm" value={form.dosageForm} onChange={handleChange}>
              <option value="">Select Dosage Form</option>
              <option value="Tablet">Tablet</option>
              <option value="Capsule">Capsule</option>
              <option value="Syrup">Syrup</option>
              <option value="Injection">Injection</option>
              <option value="Cream">Cream</option>
              <option value="Ointment">Ointment</option>
              <option value="Drops">Drops</option>
              <option value="Inhaler">Inhaler</option>
            </select>
          </div>
          <div className="form-group">
            <label>Strength</label>
            <input type="text" name="strength" value={form.strength} onChange={handleChange} placeholder="e.g. 500mg, 250mg/5ml" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Quantity *</label>
            <input type="number" name="quantity" value={form.quantity} onChange={handleChange} placeholder="e.g. 100" required min="0" />
          </div>
          <div className="form-group">
            <label>Price (₹) *</label>
            <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="e.g. 50.00" required min="0" step="0.01" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Expiry Date *</label>
            <input type="date" name="expiryDate" value={form.expiryDate} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="OUT_OF_STOCK">Out of Stock</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Storage Conditions</label>
          <input type="text" name="storageConditions" value={form.storageConditions} onChange={handleChange} placeholder="e.g. Store below 25°C" />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows="3" placeholder="Additional information..." />
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={() => navigate(-1)}>Cancel</button>
          <button type="submit" className="btn-save" disabled={loading}>
            {loading ? "Saving..." : editingMedicine ? "💾 Update Medicine" : "💾 Add Medicine"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddMedicine;