import { Bar, BarStack, Tooltip } from "recharts";
import { ShowcaseChart } from "./ShowcaseChart";
import { CargoCustomTooltip } from "./CargoCustomTooltip";

type Props = {
  data: any[];
};

export function CargoChart({ data }: Props) {
  return (
    <>
      <ShowcaseChart data={data}>
        <Tooltip shared={false} content={<CargoCustomTooltip />} />
        <BarStack radius={[15, 15, 0, 0]}>
          <Bar
            dataKey="containers"
            stackId="a"
            name="Контейнеры"
            fill="#3f76a3"
            activeBar={{ fill: "#325c80", stroke: "purple" }}
          />

          <Bar
            dataKey="items"
            stackId="a"
            name="Грузы"
            fill="#338f3b"
            activeBar={{ fill: "#28692d", stroke: "purple" }}
          />
        </BarStack>
      </ShowcaseChart>
    </>
  );
}
