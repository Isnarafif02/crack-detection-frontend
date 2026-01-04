import { getAuthHeaders, isAuthenticated } from "../utils/auth";
import LoadingSpinner from "./LoadingSpinner";
import Navbar from "./Navbar";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function UploadPageAuth() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL =
    process.env.REACT_APP_API_URL?.replace("/predict", "") ||
    "http://localhost:8000";

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      toast.error("Anda harus login terlebih dahulu");
      navigate("/login");
    }
  }, [navigate]);

  const handleBoxClick = () => fileInputRef.current?.click();

  const handleUpload = async (f: File) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", f);

      const response = await axios.post(`${API_URL}/predict`, formData, {
        headers: {
          ...getAuthHeaders(),
        },
      });

      // Save to localStorage for result page
      localStorage.setItem("crack_result", JSON.stringify(response.data));
      toast.success("Deteksi berhasil!");
      navigate("/result");
    } catch (error: any) {
      console.error("Upload error:", error);
      if (error.response?.status === 401) {
        toast.error("Sesi Anda telah habis. Silakan login kembali.");
        localStorage.clear();
        navigate("/login");
      } else {
        toast.error("Gagal mendeteksi gambar. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    if (f) {
      // Check file size (max 10MB)
      if (f.size > 10 * 1024 * 1024) {
        toast.error("Ukuran file maksimal 10MB");
        return;
      }

      // Check file type
      if (!f.type.startsWith("image/")) {
        toast.error("File harus berupa gambar");
        return;
      }

      setFile(f);
      handleUpload(f);
    }
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen dark:from-gray-900 dark:to-gray-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      <Navbar />
      <motion.div
        className="max-w-3xl mx-auto mt-12 bg-white rounded-xl p-8 shadow-lg dark:bg-gray-900 dark:text-gray-100"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.7, type: "spring" }}
      >
        <motion.h2
          className="text-2xl font-bold mb-2 text-blue-800 dark:text-blue-300"
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7, type: "spring" }}
        >
          Upload Gambar
        </motion.h2>

        <motion.div
          className="mt-8 bg-blue-50 rounded-xl p-6 dark:bg-gray-800"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
        >
          <b className="dark:text-white">Petunjuk:</b>
          <ul className="list-disc ml-6 mt-2 text-sm text-gray-700 dark:text-gray-200">
            <li>Format gambar yang didukung: JPG, PNG, JPEG</li>
            <li>Ukuran maksimum file: 10MB</li>
            <li>Resolusi optimal: minimal 800x600 piksel</li>
            <li>Pastikan gambar memiliki pencahayaan yang cukup</li>
            <li>Hindari gambar yang terlalu blur atau buram</li>
          </ul>
        </motion.div>

        <motion.p
          className="text-gray-600 mb-6 mt-4 dark:text-gray-300"
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.7, type: "spring" }}
        >
          Upload gambar struktur beton atau bangunan untuk mendeteksi keretakan.
        </motion.p>

        <motion.div
          className="border-2 border-dashed border-blue-400 dark:border-blue-600 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer bg-blue-50 hover:bg-blue-100 dark:bg-gray-800 dark:hover:bg-gray-700 transition"
          onClick={handleBoxClick}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files?.[0];
            if (f) {
              setFile(f);
              handleUpload(f);
            }
          }}
          whileHover={{
            scale: 1.02,
            boxShadow: "0 8px 32px 0 rgba(31,38,135,0.10)",
          }}
          initial={{ scale: 0.97, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6, type: "spring" }}
        >
          <div className="flex flex-col items-center">
            <motion.div
              className="bg-blue-100 dark:bg-blue-900 rounded-full p-4 mb-4"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              <CloudArrowUpIcon className="h-10 w-10 text-blue-400 dark:text-blue-300" />
            </motion.div>
            <p className="font-semibold text-lg mb-1 dark:text-blue-200">
              Drag & drop gambar di sini
            </p>
            <p className="text-gray-500 text-sm mb-4 dark:text-gray-400">
              atau klik untuk memilih file dari perangkat Anda
            </p>
            <button
              type="button"
              className="border border-blue-400 dark:border-blue-600 rounded px-6 py-2 bg-white hover:bg-blue-50 dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-blue-100 transition"
              onClick={(e) => {
                e.stopPropagation();
                handleBoxClick();
              }}
            >
              Pilih Gambar
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onFileChange}
            />
          </div>
          {file && !loading && (
            <motion.div
              className="mt-6 flex flex-col items-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src={URL.createObjectURL(file)}
                alt="preview"
                className="w-48 h-48 object-cover rounded border mb-2 dark:border-gray-700"
              />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {file.name}
              </p>
            </motion.div>
          )}
        </motion.div>

        {loading && <LoadingSpinner />}
      </motion.div>
    </motion.div>
  );
}
