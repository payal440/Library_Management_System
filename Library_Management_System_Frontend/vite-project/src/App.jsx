import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/" element={<Navigate to="/signup" />} />
    </Routes>
  );
}

export default App;