import { useEffect, useState } from "react";

type CustomTooltipProps = {
  active?: boolean;
  payload?: any[];
  label?: string | number;

  coordinate?: { x: number; y: number };
};

export function DataCustomTooltip({
  active,
  payload,
  label,
  coordinate,
}: CustomTooltipProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(Boolean(active && payload && payload.length));
    }, 0);

    return () => clearTimeout(timer);
  }, [active, payload]);
  if (!active || !payload || !payload.length) return null;

  const rootData = payload[0].payload;
  const names: string[] = rootData?.namesList || [];

  const isRightSide = (coordinate?.x ?? 0) > window.innerWidth / 2;

  return (
    <div
      style={{
        background: "white",
        position: "absolute",
        left: coordinate?.x ?? 0,
        top: coordinate?.y ?? 0,
        border: "1px solid #cbd5e1",
        borderRadius: "8px",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
        minWidth: "200px",
        overflow: "hidden",
        transform: `
          translate(${isRightSide ? "-105%" : "15px"}, ${visible ? "0" : "-10px"})
        `,
        opacity: visible ? 1 : 0,
        transition: "transform 0.5s ease, opacity 0.5s ease",
      }}
    >
      <header
        style={{
          background: "#8da1b4",
          padding: "8px 12px",
          borderBottom: "1px solid #e2e8f0",
          fontWeight: "bold",
          fontSize: "14px",
          color: "#1e293b",
        }}
      >
        Дата создания: {label}
      </header>

      <div style={{ padding: "10px 12px" }}>
        {names.map((name, idx) => (
          <p
            key={idx}
            style={{
              fontSize: "13px",

              display: "flex",
              alignItems: "center",
            }}
          >
            {name}
          </p>
        ))}
      </div>
    </div>
  );
}
