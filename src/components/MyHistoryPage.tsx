import { getAuthHeaders } from "../utils/auth";
import LoadingSpinner from "./LoadingSpinner";
import Navbar from "./Navbar";
import {
  TrashIcon,
  EyeIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

interface Detection {
  id: number;
  accuracy: number;
  mAP: number;
  crack_area: number;
  crack_length: number;
  severity: string;
  created_at: string;
  original_image: string;
  mask_image: string;
  inference_time: number;
}

export default function MyHistoryPage() {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);
  const navigate = useNavigate();

  const API_URL =
    process.env.REACT_APP_API_URL?.replace("/predict", "") ||
    "http://localhost:8000";

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Anda harus login terlebih dahulu");
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/history`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDetections(response.data);
      } catch (error: any) {
        console.error("Fetch history error:", error);
        if (error.response?.status === 401) {
          toast.error("Sesi Anda telah habis. Silakan login kembali.");
          localStorage.clear();
          navigate("/login");
        } else {
          toast.error("Gagal memuat riwayat deteksi");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [navigate, API_URL]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Yakin ingin menghapus deteksi ini?")) {
      return;
    }

    const token = localStorage.getItem("token");
    setDeleting(id);

    try {
      await axios.delete(`${API_URL}/history/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Deteksi berhasil dihapus");
      setDetections(detections.filter((d) => d.id !== id));
    } catch (error: any) {
      console.error("Delete error:", error);
      toast.error("Gagal menghapus deteksi");
    } finally {
      setDeleting(null);
    }
  };

  const handleView = (detection: Detection) => {
    // Store full detection data to localStorage
    localStorage.setItem("crack_result", JSON.stringify(detection));
    navigate("/result");
  };

  const handleDownload = async (detectionId: number, format: "csv" | "pdf") => {
    try {
      const API_URL =
        process.env.REACT_APP_API_URL?.replace("/predict", "") ||
        "http://localhost:8000";

      const response = await axios.get(
        `${API_URL}/export/${detectionId}/${format}`,
        {
          headers: getAuthHeaders(),
          responseType: "blob",
        }
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `detection_${detectionId}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success(`File ${format.toUpperCase()} berhasil diunduh!`);
    } catch (error: any) {
      console.error("Download error:", error);
      toast.error(`Gagal mengunduh file ${format.toUpperCase()}`);
    }
  };

  const handleClearAll = async () => {
    if (detections.length === 0) {
      toast.error("Tidak ada riwayat untuk dihapus");
      return;
    }

    if (
      !window.confirm(
        `Yakin ingin menghapus semua ${detections.length} riwayat deteksi?`
      )
    ) {
      return;
    }

    const token = localStorage.getItem("token");
    setLoading(true);

    try {
      await axios.delete(`${API_URL}/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Semua riwayat berhasil dihapus");
      setDetections([]);
    } catch (error: any) {
      console.error("Clear all error:", error);
      toast.error("Gagal menghapus riwayat");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      <Navbar />
      <motion.div
        className="max-w-7xl mx-auto py-8 px-4"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.7 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-800 dark:text-blue-300">
            Riwayat Deteksi
          </h1>
          {detections.length > 0 && (
            <button
              onClick={handleClearAll}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition font-semibold"
            >
              Hapus Semua
            </button>
          )}
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : detections.length === 0 ? (
          <motion.div
            className="bg-white dark:bg-gray-900 rounded-xl p-12 text-center shadow-lg"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
              Belum ada riwayat deteksi
            </p>
            <button
              onClick={() => navigate("/upload")}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition"
            >
              Mulai Deteksi Baru
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {detections.map((detection, index) => (
              <motion.div
                key={detection.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="relative">
                  <img
                    src={detection.original_image}
                    alt={`Detection ${detection.id}`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    #{detection.id}
                  </div>
                </div>

                <div className="p-4">
                  <div className="mb-3">
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      {new Date(detection.created_at).toLocaleString("id-ID")}
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Severity:
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          detection.severity === "Severe"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            : detection.severity === "Moderate"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        }`}
                      >
                        {detection.severity}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">
                          Akurasi:
                        </span>
                        <span className="ml-1 font-semibold text-blue-600 dark:text-blue-400">
                          {(detection.accuracy * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">
                          Area:
                        </span>
                        <span className="ml-1 font-semibold text-blue-600 dark:text-blue-400">
                          {detection.crack_area.toFixed(0)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleView(detection)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition flex items-center justify-center gap-2"
                    >
                      <EyeIcon className="h-5 w-5" />
                      Lihat
                    </button>
                    <button
                      onClick={() => handleDownload(detection.id, "csv")}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition flex items-center justify-center gap-1 text-sm"
                      title="Download CSV"
                    >
                      <ArrowDownTrayIcon className="h-4 w-4" />
                      CSV
                    </button>
                    <button
                      onClick={() => handleDownload(detection.id, "pdf")}
                      className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-lg transition flex items-center justify-center gap-1 text-sm"
                      title="Download PDF"
                    >
                      <ArrowDownTrayIcon className="h-4 w-4" />
                      PDF
                    </button>
                    <button
                      onClick={() => handleDelete(detection.id)}
                      disabled={deleting === detection.id}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition disabled:opacity-50 flex items-center justify-center"
                    >
                      {deleting === detection.id ? (
                        <span className="animate-spin">⏳</span>
                      ) : (
                        <TrashIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
