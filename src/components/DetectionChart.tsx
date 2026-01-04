import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function DetectionChart({ result }: { result: any }) {
  const crackArea = Number(result?.crack_area ?? 0);
  const total =
    Number(result?.total_area ?? 0) || (crackArea > 0 ? crackArea * 25 : 10000);
  const rest = Math.max(total - crackArea, 0);
  const data = [
    { name: "Non-crack", value: rest },
    { name: "Crack", value: crackArea },
  ];
  const COLORS = ["#c7d2fe", "#6366f1"];

  return (
    <div>
      <h3 className="text-center font-semibold dark:text-blue-200 mb-2">
        Crack Area Distribution
      </h3>
      <div style={{ width: "100%", height: 180 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              dataKey="value"
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={60}
              innerRadius={24}
              paddingAngle={2}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={(v: any) => `${v}`} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
