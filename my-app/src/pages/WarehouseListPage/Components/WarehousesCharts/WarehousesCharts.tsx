import type { Warehouse } from "@/types/warehouse.types";
import { DateSort } from "./components/DateSort";
import { CargoChart } from "./components/CargoChart";
import { CargoDubleBarChart } from "./components/CargoDubleBarChart";
import { cargoChartData } from "./helpers/cargoChartData";
import { dateChartData } from "./helpers/dateChartData";

type SortType = "id" | "date" | "cargo";

type Props = {
  warehouses: Warehouse[];
  sortBy: SortType;
};

export default function WarehouseChart({ warehouses, sortBy }: Props) {
  return (
    <>
      {sortBy === "id" && (
        <CargoDubleBarChart data={cargoChartData(warehouses)} />
      )}
      {sortBy === "date" && <DateSort data={dateChartData(warehouses)} />}
      {sortBy === "cargo" && <CargoChart data={cargoChartData(warehouses)} />}
    </>
  );
}
