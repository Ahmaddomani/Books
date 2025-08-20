// src/components/Login.jsx
import axios from "axios";
import { useContext, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const pError = useRef(null);
  const { setUser } = useContext(UserContext);
  const navigator = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    pError.current.textContent = "";
  };

  const handleSubmit = async (e) => {
    const { email, password } = form;
    e.preventDefault();
    console.log(form);
    try {
      setLoading(true);
      const response = await axios.post(
        "https://books-1-dgne.onrender.com/auth/login",
        { email, password },
        {
          withCredentials: true,
        }
      );
      setUser(response.data.data);
      navigator("/");
    } catch (err) {
      console.log(err);
      setError(err);
      pError.current.textContent = err?.response?.data?.message || "";
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-400 to-red-400">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="example@gmail.com"
              required
              name="email"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="********"
              required
              name="password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-500 text-sm"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition-colors"
          >
            {!loading ? "Login" : "...Login"}
          </button>
        </form>
        <p ref={pError} className="error text-center m-3 text-rose-500">
          {error?.response.data?.message || ""}
        </p>
        <p className="text-sm text-gray-500 mt-4 text-center">
          Don't have an account?{" "}
          <Link to="/signup" className="text-purple-500">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
