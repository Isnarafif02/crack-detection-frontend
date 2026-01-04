import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

type Datum = {
  epoch: number;
  accuracy?: number;
  mAP?: number;
};

export default function LineChartMetrics({ data }: { data?: Datum[] }) {
  const safe = Array.isArray(data) ? data : [];

  return (
    <div style={{ width: "100%", height: 320 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={safe}
          margin={{ top: 16, right: 24, left: 8, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="4 4" />
          <XAxis dataKey="epoch" allowDecimals={false} />
          <YAxis domain={["auto", "auto"]} />
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
          <Line
            type="monotone"
            dataKey="accuracy"
            stroke="#4f46e5"
            name="Accuracy"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="mAP"
            stroke="#db2777"
            name="mAP"
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
