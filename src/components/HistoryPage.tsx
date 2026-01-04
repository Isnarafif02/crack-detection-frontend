import Navbar from "./Navbar";
import { CloudArrowDownIcon, TrashIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";

type DetectionHistoryItem = {
  id: number;
  timestamp: string;
  accuracy: number;
  mAP: number;
  severity: string;
  original_image: string;
  mask_image: string;
};

export default function HistoryPage() {
  const [history, setHistory] = useState<DetectionHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchHistory() {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8000/get_detections");
        const data = await response.json();
        setHistory(data.reverse());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  const exportAll = async () => {
    try {
      const ids = history.map((h) => h.id);
      const res = await fetch("http://localhost:8000/export_history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ids,
          format: "zip",
          include_metrics_history: true,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        alert(`Export gagal: ${err?.detail || res.statusText}`);
        return;
      }
      const data = await res.json();
      if (data.file_path)
        window.open(`http://localhost:8000/${data.file_path}`, "_blank");
    } catch (e) {
      console.error(e);
      alert("Export gagal");
    }
  };

  const [openDownloadId, setOpenDownloadId] = useState<number | null>(null);

  const toggleDownloadMenu = (id: number) => {
    setOpenDownloadId((prev) => (prev === id ? null : id));
  };

  // auto-close download dropdown when clicking outside
  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (openDownloadId == null) return;
      const target = e.target as HTMLElement;
      if (!target.closest(`[data-download-root="${openDownloadId}"]`)) {
        setOpenDownloadId(null);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [openDownloadId]);

  // Export a single item using the single-item /export endpoint (returns a PDF or CSV)
  async function exportItem(item: DetectionHistoryItem, format: string) {
    try {
      const res = await fetch("http://localhost:8000/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file_format: format, detection_data: item }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        alert(`Export gagal: ${err?.detail || res.statusText}`);
        return;
      }

      const data = await res.json();
      if (data?.file_path) {
        window.open(`http://localhost:8000/${data.file_path}`, "_blank");
      } else {
        alert("File export tidak tersedia");
      }
    } catch (e) {
      console.error(e);
      alert("Export gagal");
    }
  }

  function handleDelete(id: number): void {
    (async () => {
      if (!window.confirm("Hapus entri ini?")) return;

      setLoading(true);
      try {
        const res = await fetch(`http://localhost:8000/detection/${id}`, {
          method: "DELETE",
        });
        if (!res.ok) {
          const err = await res.json().catch(() => null);
          alert(`Hapus gagal: ${err?.detail || res.statusText}`);
          return;
        }

        // Remove from local state so UI updates immediately
        setHistory((prev) => prev.filter((h) => h.id !== id));
      } catch (e) {
        console.error(e);
        alert("Hapus gagal");
      } finally {
        setLoading(false);
      }
    })();
  }

  return (
    <motion.div
      className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen dark:from-gray-900 dark:to-gray-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Navbar />
      <motion.div
        className="max-w-3xl mx-auto mt-12 bg-white rounded-xl p-8 shadow-lg dark:bg-gray-900 dark:text-gray-100"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <motion.h2
          className="text-2xl font-bold mb-2 text-blue-800 dark:text-blue-300"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          Riwayat Deteksi
        </motion.h2>

        <div className="flex items-center justify-end mb-4">
          <button
            className="px-3 py-2 bg-blue-600 text-white rounded"
            onClick={exportAll}
          >
            Download Semua (ZIP)
          </button>
        </div>

        {loading ? (
          <div className="p-6 bg-white rounded shadow">Loading...</div>
        ) : history.length === 0 ? (
          <div className="p-8 bg-white dark:bg-gray-800 rounded shadow text-center">
            <h3 className="text-lg text-black dark:text-blue-400 font-semibold mb-2">
              Belum ada riwayat deteksi
            </h3>
            <p className="text-sm text-gray-600 dark:text-white mb-4">
              Sepertinya Anda belum menyimpan hasil deteksi. Lakukan deteksi
              pada halaman Upload lalu simpan hasilnya untuk melihatnya di sini.
            </p>
            <div className="flex justify-center gap-3">
              <a
                href="/upload"
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Ke Halaman Upload
              </a>
              <button
                className="px-4 py-2 bg-gray-100 dark:bg-gray-600 border dark:border-0 rounded"
                onClick={() => window.location.reload()}
              >
                Refresh
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <div
                key={item.id}
                className="p-6 bg-white dark:bg-gray-800 rounded shadow flex items-center justify-between"
              >
                <div className="flex items-center gap-6">
                  <div className="w-36 h-36 bg-gray-50 rounded overflow-hidden flex items-center justify-center">
                    <img
                      src={item.original_image}
                      alt="orig"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-lg font-semibold">ID: {item.id}</div>
                    <div className="text-sm text-gray-600">
                      {item.timestamp}
                    </div>
                    <div className="mt-2 text-sm">
                      Severity:{" "}
                      <span className="font-medium">{item.severity}</span>
                    </div>
                    <div className="text-sm">
                      Accuracy:{" "}
                      <span className="font-medium">{item.accuracy}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 relative">
                  <div className="relative" data-download-root={item.id}>
                    <button
                      onClick={() => toggleDownloadMenu(item.id)}
                      className="p-2 bg-green-600 text-white rounded hover:bg-green-700"
                      title="Download"
                    >
                      <CloudArrowDownIcon className="w-5 h-5" />
                    </button>

                    {openDownloadId === item.id && (
                      <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-800 border dark:border-0 rounded shadow z-20">
                        <button
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700"
                          onClick={() => {
                            setOpenDownloadId(null);
                            exportItem(item, "pdf");
                          }}
                        >
                          Download PDF
                        </button>
                        <button
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700"
                          onClick={() => {
                            setOpenDownloadId(null);
                            exportItem(item, "csv");
                          }}
                        >
                          Download CSV
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
                    title="Hapus"
                  >
                    <TrashIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
