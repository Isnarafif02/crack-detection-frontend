import LoadingSpinner from "./LoadingSpinner";
import Navbar from "./Navbar";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { motion } from "framer-motion";
import React, { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function UploadPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleBoxClick = () => fileInputRef.current?.click();

  // Batch detect: process selected files sequentially
  const handleDetect = async () => {
    if (files.length === 0) return;
    setLoading(true);
    try {
      let processed = 0;
      const resultsAccum: any[] = [];
      for (let i = 0; i < files.length; i++) {
        const f = files[i];
        const formData = new FormData();
        formData.append("file", f);
        try {
          const response = await axios.post(
            process.env.REACT_APP_API_URL || "http://localhost:8000/predict",
            formData
          );
          const result = response.data;
          // accumulate results into array to show in Result page
          resultsAccum.push(result);
          // save to history (best-effort) and capture server-assigned id
          try {
            const saveRes = await fetch(
              "http://localhost:8000/save_detection",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(result),
              }
            );
            if (saveRes.ok) {
              try {
                const savedJson = await saveRes.json();
                const serverId = savedJson?.id;
                if (serverId) {
                  // attach server id to the result object so frontend can show it
                  try {
                    // mutate result and update stored array
                    (result as any).server_id = serverId;
                  } catch (err) {
                    // ignore
                  }
                }
              } catch (err) {
                // if parsing fails, ignore but continue
              }
            } else {
              console.warn("Save detection returned non-OK", saveRes.status);
            }
          } catch (err) {
            console.warn("Failed to save detection history:", err);
          }

          // persist latest results array and last result for compatibility
          try {
            localStorage.setItem("crack_result", JSON.stringify(result));
            localStorage.setItem("crack_results", JSON.stringify(resultsAccum));
          } catch (err) {
            console.warn("Could not persist results to localStorage", err);
          }
          processed += 1;
          toast(`Memproses ${processed}/${files.length}`);
        } catch (err) {
          console.error("Detect failed for file", f.name, err);
        }
      }
      toast.success(`${processed} foto selesai diproses`);

      // Try to synchronize local results with server-side saved detections
      try {
        const res = await fetch("http://localhost:8000/get_detections");
        if (res.ok) {
          const serverList = await res.json();
          if (Array.isArray(serverList) && serverList.length > 0) {
            try {
              // Merge server IDs into the local batch results where possible by matching original_image or mask_image
              const mergedLocal = resultsAccum.map((local) => {
                const match = serverList.find((s: any) => {
                  try {
                    return (
                      s.original_image ===
                        (local.original_image || local.normal_image) ||
                      s.mask_image === local.mask_image
                    );
                  } catch (err) {
                    return false;
                  }
                });
                if (match) {
                  return {
                    ...local,
                    server_id: match.id,
                    server_timestamp: match.timestamp,
                  };
                }
                return local;
              });

              // also add any server-only records after the local ones (avoid duplicates by original_image)
              const existingKeys = new Set(
                mergedLocal.map((r) => r.original_image)
              );
              const extras = serverList.filter(
                (s: any) => !existingKeys.has(s.original_image)
              );

              const finalList = [...mergedLocal, ...extras];

              localStorage.setItem("crack_results", JSON.stringify(finalList));
              // prefer the last local processed item as the single-result fallback
              try {
                localStorage.setItem(
                  "crack_result",
                  JSON.stringify(finalList[finalList.length - 1])
                );
              } catch (err) {
                console.warn("Failed writing crack_result", err);
              }

              toast.success("Sinkronisasi dengan Riwayat server selesai.");
            } catch (err) {
              console.warn(
                "Gagal menyimpan crack_results ke localStorage:",
                err
              );
            }
          }
        } else {
          console.warn("get_detections returned non-OK", res.status);
        }
      } catch (err) {
        console.warn("Failed to sync with server detections:", err);
      }

      // after sync (or fallback), navigate to result page so user can pick which to view
      navigate("/result");
    } finally {
      setLoading(false);
    }
  };

  // removed single-file auto-upload; uploads handled in batch by handleDetect

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files || []);
    if (selected.length === 0) return;
    // combine with existing, enforce max 5
    const combined = [...files, ...selected];
    if (combined.length > 5) {
      toast.error("Foto sudah mencapai batas maksimal (5)");
      setFiles(combined.slice(0, 5));
    } else {
      setFiles(combined);
    }
  }

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
          className="text-gray-600 mb-6 dark:text-gray-300"
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
            const dropped = Array.from(e.dataTransfer.files || []);
            if (dropped.length === 0) return;
            const combined = [...files, ...dropped];
            if (combined.length > 5) {
              toast.error("Foto sudah mencapai batas maksimal (5)");
              setFiles(combined.slice(0, 5));
            } else {
              setFiles(combined);
            }
          }}
          initial={{ scale: 0.97, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6, type: "spring" }}
        >
          <CloudArrowUpIcon className="w-14 h-14 text-blue-600 dark:text-blue-300" />
          <p className="font-semibold text-lg mb-1 dark:text-blue-200">
            Drag & drop gambar di sini
          </p>
          <p className="text-gray-500 text-sm mb-4 dark:text-gray-400">
            atau klik untuk memilih file dari perangkat Anda
          </p>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleBoxClick();
            }}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-md text-sm font-semibold shadow hover:scale-105 transition"
          >
            Pilih Gambar
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            multiple
            onChange={onFileChange}
          />

          {files.length > 0 && (
            <motion.div
              className="mt-6 flex flex-col items-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid grid-cols-3 gap-4">
                {files.map((f, idx) => (
                  <div key={idx} className="relative w-48 h-48">
                    <img
                      src={URL.createObjectURL(f)}
                      alt={f.name}
                      className="w-full h-full object-cover rounded border dark:border-gray-700"
                    />
                    <button
                      className="absolute top-1 right-1 bg-white rounded-full p-1 text-sm"
                      onClick={() =>
                        setFiles((s) => s.filter((_, i) => i !== idx))
                      }
                      title="Hapus gambar"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {files.length > 0 && (
          <motion.div
            className="flex justify-center mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <button
              onClick={handleDetect}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl text-lg font-semibold shadow hover:scale-105 transition"
              disabled={loading}
            >
              {loading ? "Memproses..." : "Mulai Deteksi"}
            </button>
          </motion.div>
        )}
        {loading && <LoadingSpinner />}
      </motion.div>
    </motion.div>
  );
}
