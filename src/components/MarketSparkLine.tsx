// components/MarketSparkline.tsx
import React from "react";

interface Props {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
}

const MarketSparkline: React.FC<Props> = ({ data, width = 80, height = 24, color = "#4f46e5" }) => {
  if (!data.length) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((v - min) / (max - min || 1)) * height;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg width={width} height={height}>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        points={points}
      />
    </svg>
  );
};

export default MarketSparkline;
