import type { Warehouse } from "@/types/warehouse.types";
import { formatDate } from "@/utils/helpers";

export function dateChartData(warehouses: Warehouse[] = []) {
  const grouped = warehouses.reduce(
    (acc, warehouse) => {
      if (!warehouse.createdAt) return acc;

      const dateKey = new Date(warehouse.createdAt)
        .toISOString()
        .split("T")[0];

      if (!acc[dateKey]) {
        acc[dateKey] = {
          count: 0,
          names: [] as string[],
        };
      }

      acc[dateKey].count += 1;
      acc[dateKey].names.push(warehouse.name);

      return acc;
    },
    {} as Record<string, { count: number; names: string[] }>,
  );

  return Object.entries(grouped)
    .map(([date, value]) => ({
      name: formatDate(date),
      count: value.count,
      namesList: value.names,
      rawDate: date,
    }))
    .sort(
      (a, b) =>
        new Date(a.rawDate).getTime() -
        new Date(b.rawDate).getTime(),
    );
}