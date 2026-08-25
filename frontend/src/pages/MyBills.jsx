import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "./MyBills.css";

function MyBills() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userEmail = localStorage.getItem("userEmail") || "";
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const res = await API.get(`/bills/patient/${userEmail}`);
      setBills(res.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      alert("Failed to load bills");
      setLoading(false);
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

  const filteredBills = bills.filter(b => filter === "ALL" || b.paymentStatus === filter);

  if (loading) return <div className="loading">Loading bills...</div>;

  return (
    <div className="my-bills">
      <div className="bill-header">
        <h2>💰 My Bills</h2>
        <span className="count">{bills.length} total</span>
      </div>
      <div className="filter-bar">
        <button className={filter === "ALL" ? "active" : ""} onClick={() => setFilter("ALL")}>All</button>
        <button className={filter === "PENDING" ? "active" : ""} onClick={() => setFilter("PENDING")}>Pending</button>
        <button className={filter === "PAID" ? "active" : ""} onClick={() => setFilter("PAID")}>Paid</button>
        <button className={filter === "PARTIAL" ? "active" : ""} onClick={() => setFilter("PARTIAL")}>Partial</button>
        <button className={filter === "CANCELLED" ? "active" : ""} onClick={() => setFilter("CANCELLED")}>Cancelled</button>
      </div>
      {filteredBills.length === 0 ? (
        <div className="empty-state"><p>No bills found.</p></div>
      ) : (
        <div className="bills-list">
          {filteredBills.map(bill => (
            <div key={bill.id} className="bill-card">
              <div className="bill-header-row">
                <span className="invoice">#{bill.invoiceNumber}</span>
                <span className={`status-badge ${getStatusColor(bill.paymentStatus)}`}>{bill.paymentStatus}</span>
              </div>
              <div className="bill-details">
                <p><strong>Service:</strong> {bill.serviceType}</p>
                <p><strong>Amount:</strong> ₹{bill.amount}</p>
                <p><strong>Tax:</strong> ₹{bill.tax}</p>
                <p><strong>Total:</strong> ₹{bill.totalAmount}</p>
                <p><strong>Date:</strong> {bill.billDate}</p>
                <p><strong>Due:</strong> {bill.dueDate}</p>
                {bill.description && <p><strong>Description:</strong> {bill.description}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBills;