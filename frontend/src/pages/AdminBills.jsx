import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "./AdminBills.css";

function AdminBills() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const res = await API.get("/bills/admin/all");
      setBills(res.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      alert("Failed to load bills");
      setLoading(false);
    }
  };

  const handleFilterStatus = async (status) => {
    setFilterStatus(status);
    if (status === "ALL") {
      fetchBills();
      return;
    }
    try {
      const res = await API.get(`/bills/status/${status}`);
      setBills(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    if (!window.confirm(`Update bill to ${newStatus}?`)) return;
    try {
      await API.patch(`/bills/admin/status/${id}?status=${newStatus}`);
      alert("Status updated!");
      fetchBills();
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this bill?")) return;
    try {
      await API.delete(`/bills/admin/delete/${id}`);
      alert("Deleted!");
      fetchBills();
    } catch (error) {
      alert("Failed to delete");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING": return "status-pending";
      case "PAID": return "status-paid";
      case "PARTIAL": return "status-partial";
      case "CANCELLED": return "status-cancelled";
      default: return "";
    }
  };

  if (loading) return <div className="loading">Loading bills...</div>;

  return (
    <div className="admin-bills">
      <div className="admin-header">
        <h2>💰 Bill Management</h2>
        <button className="btn-add" onClick={() => navigate("/add-bill")}>+ Generate Bill</button>
      </div>
      <div className="filters">
        <div className="filter-group">
          <span>Status:</span>
          <button className={filterStatus === "ALL" ? "active" : ""} onClick={() => handleFilterStatus("ALL")}>All</button>
          <button className={filterStatus === "PENDING" ? "active" : ""} onClick={() => handleFilterStatus("PENDING")}>Pending</button>
          <button className={filterStatus === "PAID" ? "active" : ""} onClick={() => handleFilterStatus("PAID")}>Paid</button>
          <button className={filterStatus === "PARTIAL" ? "active" : ""} onClick={() => handleFilterStatus("PARTIAL")}>Partial</button>
          <button className={filterStatus === "CANCELLED" ? "active" : ""} onClick={() => handleFilterStatus("CANCELLED")}>Cancelled</button>
        </div>
      </div>
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Invoice</th>
              <th>Patient</th>
              <th>Service</th>
              <th>Amount</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bills.length === 0 ? (
              <tr><td colSpan="8" className="empty-row">No bills found.</td></tr>
            ) : (
              bills.map(bill => (
                <tr key={bill.id}>
                  <td>{bill.invoiceNumber}</td>
                  <td>{bill.patientName}</td>
                  <td>{bill.serviceType}</td>
                  <td>₹{bill.amount}</td>
                  <td>₹{bill.totalAmount}</td>
                  <td>
                    <span className={`status-badge ${getStatusColor(bill.paymentStatus)}`}>
                      {bill.paymentStatus}
                    </span>
                  </td>
                  <td>{bill.billDate}</td>
                  <td>
                    <select onChange={(e) => handleStatusUpdate(bill.id, e.target.value)} value={bill.paymentStatus}>
                      <option value="PENDING">Pending</option>
                      <option value="PAID">Paid</option>
                      <option value="PARTIAL">Partial</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                    <button className="btn-delete" onClick={() => handleDelete(bill.id)}>🗑️</button>
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

export default AdminBills;