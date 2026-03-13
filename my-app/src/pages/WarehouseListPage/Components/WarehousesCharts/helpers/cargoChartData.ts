import type { Warehouse } from "@/types/warehouse.types";

export function cargoChartData(warehouses: Warehouse[] = []) {
  return warehouses.map((warehouse) => {
    const containers =
      warehouse.cargo?.filter((cargoItem) => cargoItem.type === "container")
        .length || 0;
    const items =
      warehouse.cargo?.filter((cargoItem) => cargoItem.type === "cargo")
        .length || 0;

    return {
      name: warehouse.name,
      containers,
      items,
      total: containers + items,
    };
  });
}
