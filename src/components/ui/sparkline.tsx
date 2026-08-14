export function Sparkline({
  points,
  width = 280,
  height = 64,
  color = "#b0402c",
}: {
  points: number[];
  width?: number;
  height?: number;
  color?: string;
}) {
  if (points.length < 2) return null;
  const max = Math.max(...points, 20);
  const min = Math.min(...points, 0);
  const range = max - min || 1;
  const step = width / (points.length - 1);
  const coords = points.map((p, i) => {
    const x = i * step;
    const y = height - 6 - ((p - min) / range) * (height - 14);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const path = `M${coords.join(" L")}`;
  const area = `${path} L${width},${height} L0,${height} Z`;
  const gradId = `spark-${color.replace("#", "")}`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label="Risk curve">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${gradId})`} />
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {points.map((p, i) => {
        const [x, y] = coords[i].split(",").map(Number);
        return <circle key={i} cx={x} cy={y} r="2.6" fill={color} />;
      })}
    </svg>
  );
}
