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

    console.log("=== Dashboard useEffect ===");
    console.log("Token from URL:", tokenFromUrl);
    console.log("Token from Storage:", tokenFromStorage);
    console.log("Using token:", token);

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
      console.log("=== Fetching user data ===");
      console.log("Token:", token);

      const response = await fetch("http://localhost:3000/profile", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("User data received:", data);

      // The backend now returns user directly (not wrapped)
      setUser(data);
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
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
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          color: "white",
          textAlign: "center",
          flexDirection: "column"
        }}>
          <h2>⚠️ {error}</h2>
          <p>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="dashboard-wrapper">
        <div className="loading">⏳ Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="dashboard-wrapper">
        <div className="loading">❌ No user data</div>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>📚 Library Management System</h1>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div className="profile-card">
          <div className="profile-header">
            <div className="avatar">
              {user?.Name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="profile-info">
              <h2>{user?.Name || "User"}</h2>
              <p className="email">{user?.emailId}</p>
              {user?.isGoogleUser && (
                <span className="google-badge">✓ Google User</span>
              )}
            </div>
          </div>

          <div className="profile-details">
            <div className="detail-item">
              <label>Username</label>
              <p>{user?.UserName || "N/A"}</p>
            </div>

            <div className="detail-item">
              <label>Stream</label>
              <p>{user?.stream || "Not specified"}</p>
            </div>

            <div className="detail-item">
              <label>Class</label>
              <p>{user?.class || "Not specified"}</p>
            </div>

            <div className="detail-item">
              <label>Member Since</label>
              <p>{new Date(user?.date).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="quick-links">
          <div className="link-card">
            <h3>📚 Browse Books</h3>
            <p>Explore our library collection</p>
          </div>

          <div className="link-card">
            <h3>📋 My Borrowings</h3>
            <p>View your borrowed books</p>
          </div>

          <div className="link-card">
            <h3>⭐ Reservations</h3>
            <p>Reserve books for later</p>
          </div>

          <div className="link-card">
            <h3>⚙️ Settings</h3>
            <p>Manage your account</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;