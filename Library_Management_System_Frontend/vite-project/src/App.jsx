import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "../src/assets/pages/SignUp";
import Dashboard from "../src/assets/pages/Dashboard";
import Login from "../src/assets/pages/Login";

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