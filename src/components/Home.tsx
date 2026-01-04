import { isAuthenticated } from "../utils/auth";
import Navbar from "./Navbar";
import { motion } from "framer-motion";
import {
  FiHardDrive,
  FiTool,
  FiDivideSquare,
  FiSettings,
  FiActivity,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const authenticated = isAuthenticated();

  const handleGetStarted = () => {
    if (authenticated) {
      navigate("/upload");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navbar />
      {/* Animated Gradient Background */}
      <div
        className="absolute inset-0 -z-10 animate-gradient"
        style={{
          background: document.documentElement.classList.contains("dark")
            ? "linear-gradient(120deg, #232946, #6366f1, #818cf8, #334155, #0f172a)"
            : "linear-gradient(120deg, #a5b4fc, #fcd34d, #818cf8, #f472b6, #38bdf8, #6366f1)",
          backgroundSize: "400% 400%",
        }}
      />
      {/* Overlay for dark mode */}
      <div className="absolute inset-0 -z-10 pointer-events-none dark:bg-gray-900/50" />
      {/* Animated Construction Icons */}
      <motion.div
        className="flex justify-center gap-8 mt-16 mb-4"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
      >
        {FiHardDrive({
          className: "text-5xl text-yellow-400 drop-shadow-lg animate-bounce",
        })}
        {FiTool({
          className:
            "text-5xl text-blue-700 dark:text-blue-300 animate-spin-slow",
        })}
        {FiDivideSquare({
          className:
            "text-5xl text-green-500 dark:text-green-300 animate-pulse",
        })}
        {FiSettings({
          className: "text-5xl text-gray-700 dark:text-gray-300 animate-spin",
        })}
        {FiActivity({
          className: "text-5xl text-red-500 dark:text-red-300 animate-bounce",
        })}
      </motion.div>
      {/* Main Content */}
      <motion.div
        className="flex flex-col items-center justify-center py-24"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
      >
        <motion.h1
          className="text-5xl font-extrabold mb-4 text-blue-800 dark:text-blue-300 text-center drop-shadow-lg"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.7 }}
        >
          Deteksi Keretakan Beton & Struktur Bangunan
        </motion.h1>
        <motion.p
          className="text-lg mb-8 text-center max-w-2xl text-gray-700 dark:text-gray-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.7 }}
        >
          Website ini membantu Anda mendeteksi keretakan pada beton dan struktur
          bangunan secara otomatis menggunakan teknologi segmentasi gambar dan
          kecerdasan buatan.
        </motion.p>
        <motion.button
          onClick={handleGetStarted}
          className="bg-gradient-to-r from-yellow-400 via-blue-600 to-indigo-600 text-white px-10 py-4 rounded-2xl text-xl font-bold shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300 flex items-center gap-3"
          whileHover={{
            scale: 1.08,
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
          }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {FiTool({ className: "text-2xl" })}
          {authenticated ? "Mulai Deteksi" : "Login untuk Memulai"}
        </motion.button>
      </motion.div>
      {/* Floating Animated Icon */}
      <motion.div
        className="fixed bottom-8 right-8 z-50"
        initial={{ opacity: 0, scale: 0.7, x: 60, y: 60 }}
        animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
        transition={{ delay: 1.5, duration: 0.7, type: "spring" }}
      >
        {FiHardDrive({
          className: "text-4xl text-yellow-400 animate-bounce",
          title: "Aman & Modern",
        })}
      </motion.div>
      {/* Custom Animations */}
      <style>
        {`
          .animate-spin-slow {
            animation: spin 3s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg);}
            100% { transform: rotate(360deg);}
          }
          @keyframes gradientMove {
            0% {background-position: 0% 50%;}
            50% {background-position: 100% 50%;}
            100% {background-position: 0% 50%;}
          }
          .animate-gradient {
            animation: gradientMove 12s ease-in-out infinite;
          }
        `}
      </style>
    </div>
  );
}
