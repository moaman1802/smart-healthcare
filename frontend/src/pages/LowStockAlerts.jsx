import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "./LowStockAlerts.css";

function LowStockAlerts() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchLowStock();
  }, []);

  const fetchLowStock = async () => {
    try {
      const res = await API.get("/medicines/low-stock?threshold=10");
      setMedicines(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching low stock:", error);
      alert("Failed to load low stock alerts");
      setLoading(false);
    }
  };

  const handleUpdateStock = async (id, newQuantity) => {
    if (!newQuantity || newQuantity < 0) return;
    try {
      await API.patch(`/medicines/admin/stock/${id}?quantity=${newQuantity}`);
      alert("Stock updated!");
      fetchLowStock();
    } catch (error) {
      alert("Failed to update stock");
    }
  };

  if (loading) return <div className="loading">Loading alerts...</div>;

  return (
    <div className="low-stock-alerts">
      <div className="alert-header">
        <h2>⚠️ Low Stock Alerts</h2>
        <span className="count">{medicines.length} items low</span>
      </div>

      {medicines.length === 0 ? (
        <div className="empty-state">✅ All medicines are well stocked!</div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Medicine</th>
                <th>Current Stock</th>
                <th>Reorder Level</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {medicines.map((med, idx) => (
                <tr key={med.id}>
                  <td>{idx + 1}</td>
                  <td>{med.name}</td>
                  <td className="low-quantity">{med.quantity}</td>
                  <td>{med.reorderLevel || 10}</td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      placeholder="New stock"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          const val = parseInt(e.target.value);
                          if (!isNaN(val)) handleUpdateStock(med.id, val);
                        }
                      }}
                    />
                    <button
                      className="btn-update"
                      onClick={() => {
                        const input = e.target.parentElement.querySelector('input');
                        const val = parseInt(input.value);
                        if (!isNaN(val)) handleUpdateStock(med.id, val);
                      }}
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default LowStockAlerts;