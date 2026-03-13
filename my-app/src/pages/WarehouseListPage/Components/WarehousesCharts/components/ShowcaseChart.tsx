import {
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

type Props = {
  data: any[];
  children: React.ReactNode;
};

export function ShowcaseChart({ data, children }: Props) {
  return (
    <div style={{ width: "100%", overflowX: "auto", overflowY: "hidden" }}>
      <div style={{ minWidth: 800, width: "100%", height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap={"30%"}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="name"
              tickFormatter={(value: string) =>
                value.length > 5 ? value.slice(0, 5) + "…" : value
              }
            />

            <YAxis allowDecimals={false} />

            <Legend />
            {children}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
