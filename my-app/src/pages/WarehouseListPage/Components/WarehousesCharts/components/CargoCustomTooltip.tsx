import { useState, useEffect } from "react";

type CustomTooltipProps = {
  active?: boolean;
  payload?: any;
  coordinate?: { x: number; y: number };
};

export function CargoCustomTooltip({
  active,
  payload,
  coordinate,
}: CustomTooltipProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(Boolean(active && payload && payload.length));
    }, 0);

    return () => clearTimeout(timer);
  }, [active, payload]);

  if (!payload || !payload.length) return null;

  const data = payload[0];
  const warehouse = data.payload?.name;
  const value = data.value;
  const label = data.name;

  const isRightSide = (coordinate?.x ?? 0) > window.innerWidth / 2;

  return (
    <div
      style={{
        position: "absolute",
        left: coordinate?.x ?? 0,
        top: coordinate?.y ?? 0,
        background: "white",
        border: "1px solid #8d2c2c",
        borderRadius: 6,
        whiteSpace: "nowrap",
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
          padding: 10,
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <div style={{ fontWeight: 600 }}>{warehouse}</div>
      </header>

      <div style={{ margin: 10 }}>
        <span
          style={{
            display: "inline-block",
            width: 12,
            height: 12,
            backgroundColor: data.fill,
            borderRadius: 2,
            marginRight: 6,
          }}
        />
        {label}: <b>{value}</b>
      </div>
    </div>
  );
}
