import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "./NotificationList.css";

function NotificationList() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    if (!userEmail) {
      navigate("/login");
      return;
    }
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await API.get(`/notifications/user/${userEmail}`);
      setNotifications(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      alert("Failed to load notifications");
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await API.patch(`/notifications/${id}/read`);
      setNotifications(prev =>
        prev.map(n =>
          n.id === id ? { ...n, read: true } : n
        )
      );
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await API.patch(`/notifications/user/${userEmail}/read-all`);
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this notification?")) return;
    try {
      await API.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm("Delete all notifications?")) return;
    try {
      await API.delete(`/notifications/user/${userEmail}`);
      setNotifications([]);
    } catch (error) {
      console.error("Error clearing notifications:", error);
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }
    if (notification.link) {
      navigate(notification.link);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === "ALL") return true;
    if (filter === "UNREAD") return !n.read;
    if (filter === "READ") return n.read;
    return true;
  });

  if (loading) return <div className="loading">Loading notifications...</div>;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notification-list-page">
      <div className="nl-header">
        <h2>🔔 Notifications</h2>
        <div className="nl-actions">
          <span className="nl-unread-count">{unreadCount} unread</span>
          {unreadCount > 0 && (
            <button className="nl-mark-all" onClick={handleMarkAllAsRead}>
              Mark all read
            </button>
          )}
          {notifications.length > 0 && (
            <button className="nl-clear-all" onClick={handleClearAll}>
              Clear all
            </button>
          )}
        </div>
      </div>

      <div className="nl-filters">
        <button className={filter === "ALL" ? "active" : ""} onClick={() => setFilter("ALL")}>All</button>
        <button className={filter === "UNREAD" ? "active" : ""} onClick={() => setFilter("UNREAD")}>Unread</button>
        <button className={filter === "READ" ? "active" : ""} onClick={() => setFilter("READ")}>Read</button>
      </div>

      {filteredNotifications.length === 0 ? (
        <div className="nl-empty">
          <p>No notifications found.</p>
        </div>
      ) : (
        <div className="nl-list">
          {filteredNotifications.map((n) => (
            <div
              key={n.id}
              className={`nl-item ${n.read ? "read" : "unread"}`}
              onClick={() => handleNotificationClick(n)}
            >
              <div className="nl-item-content">
                <div className="nl-item-title">{n.title}</div>
                <div className="nl-item-message">{n.message}</div>
                <div className="nl-item-time">{formatTime(n.createdAt)}</div>
                {n.link && (
                  <div className="nl-item-link">🔗 Click to view</div>
                )}
              </div>
              <div className="nl-item-actions">
                {!n.read && <span className="nl-dot"></span>}
                <button
                  className="nl-delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(n.id);
                  }}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default NotificationList;