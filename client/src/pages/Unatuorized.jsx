// src/pages/Unauthorized.jsx
import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-400 to-red-400">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Unauthorized</h2>
        <p className="text-gray-600 mb-6">
          You don’t have access to this page. Please login or signup first.
        </p>
        <div className="flex flex-col gap-4">
          <Link
            to="/login"
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Signup
          </Link>
        </div>
      </div>
    </div>
  );
}
