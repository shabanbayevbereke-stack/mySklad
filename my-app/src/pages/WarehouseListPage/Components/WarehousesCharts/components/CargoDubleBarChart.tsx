import { Bar, Tooltip } from "recharts";
import { ShowcaseChart } from "./ShowcaseChart";

type Props = {
  data: any[]
};

export function CargoDubleBarChart({ data }: Props) {
  return (
    <>
      <ShowcaseChart data={data}>
        <Tooltip />
        <Bar
          dataKey="containers"
          name="Контейнеры"
          fill="#3f76a3"
          activeBar={{ fill: "#325c80" }}
          radius={[15, 15, 0, 0]}
        />

        <Bar
          dataKey="items"
          name="Грузы"
          fill="#338f3b"
          activeBar={{ fill: "#28692d" }}
          radius={[15, 15, 0, 0]}
        />
      </ShowcaseChart>
    </>
  );
}
