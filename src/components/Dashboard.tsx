import MetricsTable from "./MetricsTable";
import Navbar from "./Navbar";
import StatsCards from "./StatsCards";
import Tabs from "./Tabs";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const [tab, setTab] = useState("Metrik & Akurasi");
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const data = localStorage.getItem("crack_result");
    if (data) setResult(JSON.parse(data));
  }, []);

  return (
    <motion.div
      className="bg-gray-50 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
    >
      <Navbar />
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.7, type: "spring" }}
      >
        <Tabs active={tab} onTab={setTab} />
        {tab === "Metrik & Akurasi" && result && (
          <>
            <StatsCards result={result} />
            <MetricsTable result={result} />
          </>
        )}
        {/* Tambahkan komponen lain untuk tab lain jika perlu */}
      </motion.div>
    </motion.div>
  );
}
