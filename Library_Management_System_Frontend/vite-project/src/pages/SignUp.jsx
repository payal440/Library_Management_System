import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../Style/SignUp.css";

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const errorMsg = searchParams.get("error");

    if (token) {
      localStorage.setItem("token", token);
     setTimeout(() => navigate("/dashboard"), 500);
    }

    if (errorMsg) {
      setError(`Login failed: ${decodeURIComponent (errorMsg)}`);
    }
  }, [searchParams, navigate]);

  const handleGoogleLogin = () => {
    setLoading(true);
    window.location.href = "http://localhost:3000/auth/google";
  };

  const handleloginclick = () => {
    navigate("/login");
  };

  // Controlled input states for signup
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupError, setSignupError] = useState(null);

  // Handle manual signup
  const handleSignup = async (e) => {
    e.preventDefault();
    setSignupLoading(true);
    setSignupError(null);
    try {
      const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, username: email, stream: "", class: "" }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Signup failed");
      navigate("/login");
    } catch (err) {
      setSignupError(err.message);
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-card">
        <h2>Create Account</h2>
        <p className="subtitle">Start your journey with us</p>
        <form onSubmit={handleSignup}>
          <div className="input-box">
            <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="input-box">
            <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="input-box">
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          {signupError && <div style={{ color: "red", marginBottom: 10 }}>{signupError}</div>}
          <button className="primary-btn" type="submit" disabled={signupLoading}>{signupLoading ? "Signing Up..." : "Sign Up"}</button>
        </form>
        <div className="divider">
          <span>OR</span>
        </div>
        <button
          className="google-btn"
          onClick={handleGoogleLogin}
          disabled={loading}
          type="button"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {loading ? "Signing Up..." : "Continue with Google"}
        </button>
        <p className="footer">
          Already have an account? <span onClick={handleloginclick}>Login</span>
        </p>
      </div>
    </div>
  );
};

export default Signup;