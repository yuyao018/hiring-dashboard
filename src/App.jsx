import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Button from '@mui/material/Button'

const App = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState(""); // for custom prompt
  const navigate = useNavigate();

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000); // auto-hide after 3s
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4000/login", {
        email,
        password,
      });

      if (res.data.success) {
        // Store admin data in localStorage
        localStorage.setItem('adminData', JSON.stringify(res.data.admin));
        showToast("✅ Login successful!");
        setTimeout(() => navigate("/dashboard"), 1500); // redirect after 1.5s
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        showToast("❌ Invalid credentials");
      } else {
        console.error(err);
        showToast("⚠️ Error connecting to server");
      }
    }
  };

  return (
    <div className="loginContainer">
      <Navbar/>
      <form onSubmit={handleSubmit} className="form">
        <h2 className="title">Login</h2>

        <div className="inputGroup">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input"
          />
        </div>

        <div className="inputGroup">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input"
          />
        </div>

        <div className="loginBtn">
          <Button type="submit" variant='contained' color='primary'>
            Login
          </Button>
        </div>
      </form>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
};

export default App;
