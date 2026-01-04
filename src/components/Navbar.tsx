import { getUsername, isAuthenticated, logout } from "../utils/auth";
import {
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const [username, setUsername] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Check auth status
    setAuthenticated(isAuthenticated());
    setUsername(getUsername());
  }, []);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  const handleLogout = () => {
    logout();
    setAuthenticated(false);
    setUsername(null);
    navigate("/login");
  };

  return (
    <nav className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 flex items-center shadow dark:from-gray-900 dark:to-gray-800">
      {/* Logo di kiri */}
      <div className="flex-shrink-0">
        <span className="font-bold text-xl text-white">CrackDetect</span>
      </div>

      {/* Menu di tengah */}
      <div className="flex-1 flex justify-center">
        <div className="flex gap-8 font-medium">
          <Link to="/" className="text-white hover:underline">
            Home
          </Link>
          {authenticated && (
            <>
              <Link to="/upload" className="text-white hover:underline">
                Upload
              </Link>
              <Link to="/result" className="text-white hover:underline">
                Hasil Deteksi
              </Link>
              <Link to="/my-history" className="text-white hover:underline">
                Riwayat Saya
              </Link>
            </>
          )}
        </div>
      </div>

      {/* User info & controls di kanan */}
      <div className="flex items-center gap-4">
        {authenticated && username && (
          <div className="flex items-center gap-2 text-white">
            <UserCircleIcon className="h-6 w-6" />
            <span className="font-medium">{username}</span>
          </div>
        )}

        {authenticated && (
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition font-medium"
            title="Logout"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            Keluar
          </button>
        )}

        {/* Dark mode toggle */}
        <button
          onClick={() => setDark((d) => !d)}
          className={`relative w-14 h-8 rounded-full transition-colors duration-300 outline-none border-2 ${
            dark
              ? "bg-gradient-to-r from-gray-800 to-gray-900 border-gray-700 shadow-[0_0_16px_2px_rgba(80,80,120,0.3)]"
              : "bg-gradient-to-r from-blue-200 to-yellow-200 border-blue-100 shadow-[0_0_16px_2px_rgba(255,220,120,0.2)]"
          }`}
          aria-label="Toggle dark mode"
        >
          <span
            className={`absolute top-1 left-1 w-6 h-6 rounded-full transition-all duration-300 shadow ${
              dark
                ? "translate-x-6 bg-gradient-to-br from-gray-700 to-gray-900 border border-gray-600"
                : "translate-x-0 bg-gradient-to-br from-yellow-300 to-yellow-500 border border-yellow-300"
            }`}
          >
            <span className="flex items-center justify-center w-full h-full text-lg">
              {dark ? "🌙" : "☀️"}
            </span>
          </span>
          {!dark ? (
            <span className="absolute left-7 top-2 w-4 h-4 bg-white rounded-full opacity-70 blur-sm" />
          ) : (
            <>
              <span className="absolute left-3 top-2 w-1 h-1 bg-white rounded-full opacity-80" />
              <span className="absolute left-5 top-4 w-1.5 h-1.5 bg-white rounded-full opacity-60" />
              <span className="absolute left-9 top-3 w-0.5 h-0.5 bg-white rounded-full opacity-50" />
            </>
          )}
        </button>
      </div>
    </nav>
  );
}
