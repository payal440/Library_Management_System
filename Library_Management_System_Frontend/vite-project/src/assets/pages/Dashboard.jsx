import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../../Style/Dashboard.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    const tokenFromStorage = localStorage.getItem("token");
    const token = tokenFromUrl || tokenFromStorage;

    if (tokenFromUrl) {
      localStorage.setItem("token", tokenFromUrl);
    }

    if (!token) {
      setError("No token found");
      setTimeout(() => navigate("/signup"), 1500);
      return;
    }

    fetchUserData(token);
  }, [searchParams, navigate]);

  const fetchUserData = async (token) => {
    try {
      const response = await fetch("http://localhost:3000/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUser(data);
      setLoading(false);
    } catch (err) {
      setError(`Error: ${err.message}`);
      setLoading(false);
      localStorage.removeItem("token");
      setTimeout(() => navigate("/signup"), 2000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/signup");
  };

  if (error) {
    return (
      <div className="dashboard-wrapper">
        <div className="alert-panel">
          <h2>⚠️ {error}</h2>
          <p>Redirecting to signup...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="dashboard-wrapper">
        <div className="loading">⏳ Loading your dashboard...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="dashboard-wrapper">
        <div className="loading">❌ No user data available</div>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        <div className="dashboard-banner">
          <div>
            <p className="banner-tag">Welcome back,</p>
            <h1>{user?.Name || "Library User"}</h1>
            <p className="banner-text">
              Here’s your personalized library dashboard. Explore new books, manage your borrowings, and keep your account up to date.
            </p>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="dashboard-grid">
          <section className="profile-card">
            <div className="profile-header">
              <div className="avatar">
                {user?.Name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <h2>{user?.Name || "User"}</h2>
                <p className="email">{user?.emailId}</p>
                <span className="role-badge">Library Member</span>
              </div>
            </div>

            <div className="profile-details">
              <div className="detail-item">
                <span>Username</span>
                <strong>{user?.UserName || "Not set"}</strong>
              </div>
              <div className="detail-item">
                <span>Stream</span>
                <strong>{user?.stream || "Not specified"}</strong>
              </div>
              <div className="detail-item">
                <span>Class</span>
                <strong>{user?.class || "Not specified"}</strong>
              </div>
              <div className="detail-item">
                <span>Member since</span>
                <strong>{new Date(user?.date).toLocaleDateString()}</strong>
              </div>
            </div>
          </section>

          <section className="stats-card">
            <h3>Quick Actions</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <h4>📚 Browse Books</h4>
                <p>Explore the latest titles and categories.</p>
              </div>
              <div className="stat-item">
                <h4>📋 My Borrowings</h4>
                <p>Check current loans and due dates.</p>
              </div>
              <div className="stat-item">
                <h4>⭐ Reservations</h4>
                <p>Reserve books for future pickup.</p>
              </div>
              <div className="stat-item">
                <h4>⚙️ Settings</h4>
                <p>Update your profile and preferences.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
