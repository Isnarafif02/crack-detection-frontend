import Navbar from "./Navbar";
import TabsResult from "./TabsResult";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import React from "react";

export default function ResultPage() {
  const [results, setResults] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const result = results[selectedIndex] ?? null;

  useEffect(() => {
    // prefer batch results if available
    try {
      const multi = localStorage.getItem("crack_results");
      if (multi) {
        const arr = JSON.parse(multi || "[]");
        if (Array.isArray(arr) && arr.length > 0) {
          setResults(arr);
          setSelectedIndex(0);
          return;
        }
      }
    } catch (err) {
      console.warn("Failed to parse crack_results", err);
    }

    const data = localStorage.getItem("crack_result");
    if (data) setResults([JSON.parse(data)]);
  }, []);

  if (!result) {
    return (
      <motion.div
        className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <Navbar />
        <motion.div
          className="flex flex-col items-center justify-center py-24"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-300">
            Tidak ada hasil deteksi.
          </h2>
        </motion.div>
      </motion.div>
    );
  }

  if (result.severity === "Tidak ada keretakan") {
    return (
      <motion.div
        className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <Navbar />
        <motion.div
          className="flex flex-col items-center justify-center py-24"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-300">
            Tidak ada keretakan yang terdeteksi pada gambar.
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 mt-4">
            Silakan coba dengan gambar lain yang memiliki keretakan.
          </p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      <Navbar />
      <motion.div
        className="max-w-6xl mx-auto py-8"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.7, type: "spring" }}
      >
        {/* If multiple results are present, allow selecting which one to view */}
        {results.length > 1 && (
          <div className="mb-4 flex items-center justify-end">
            <label className="mr-2 text-sm text-gray-600 dark:text-gray-300">
              Pilih hasil:
            </label>
            <select
              className="border rounded px-3 py-1 bg-white dark:bg-gray-800 dark:text-gray-100"
              value={selectedIndex}
              onChange={(e) => setSelectedIndex(Number(e.target.value))}
            >
              {results.map((r, idx) => (
                <option key={idx} value={idx}>
                  {(() => {
                    const idLabel = r?.server_id
                      ? `ID ${r.server_id}`
                      : `Local ${idx + 1}`;
                    const sev = r?.severity ?? "-";
                    const acc = Number(r?.accuracy ?? 0).toFixed(3);
                    return `${idLabel} — ${sev} — akurasi:${acc}`;
                  })()}
                </option>
              ))}
            </select>
          </div>
        )}

        <TabsResult result={result} />
      </motion.div>
    </motion.div>
  );
}
