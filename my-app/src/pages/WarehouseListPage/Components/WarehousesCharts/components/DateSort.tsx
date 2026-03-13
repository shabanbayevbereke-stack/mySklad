import { Bar, BarStack, Tooltip } from "recharts";
import { ShowcaseChart } from "./ShowcaseChart";
import { DataCustomTooltip } from "./DataCustomTooltip";

type Props = {
  data: any[];
};

export function DateSort({ data }: Props) {
  return (
    <>
      <ShowcaseChart data={data}>
        <Tooltip content={<DataCustomTooltip />} />
        <BarStack radius={[15, 15, 0, 0]}>
          <Bar
            dataKey="count"
            name="Количество складов"
            fill="#82ca9d"
            activeBar={{ fill: "#28692d", stroke: "purple" }}
          />
        </BarStack>
      </ShowcaseChart>
    </>
  );
}
