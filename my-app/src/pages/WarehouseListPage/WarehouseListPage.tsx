import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as warehouseApi from "@/api/warehouse.api";
import { SharedTable } from "@/features/Table/SharedTable";
import WarehouseForm from "@/features/WarehouseForm/WarehouseForm";
import type { WarehouseCreate, Warehouse } from "@/types/warehouse.types";
import { formatDate } from "@/utils/helpers";
import { useWarehouses } from "../../hooks/useWarehouses";
import { Select } from "antd";
import WarehousesCharts from "./Components/WarehousesCharts/WarehousesCharts";

export default function WarehouseListPage() {
  const navigate = useNavigate();
  const { addWarehouse, deleteWarehouse, warehouses } = useWarehouses();
  const [formOpen, setFormOpen] = useState(false);
  //неужно не трогать

  const handleAdd = (values: WarehouseCreate) => {
    addWarehouse(values);
    setFormOpen(false);
  }; // создание склада

  const [sortBy, setSortBy] = useState<"id" | "date" | "cargo">("date");

  useEffect(() => {
    warehouseApi.getWarehousesList({ limit: 100 });
  }, []); //запрос на большой лист количества складов

  const functionQuery = (params: { page: string; limit: string }) =>
    warehouseApi.getWarehousesList(params); //это уже по парамс то есть страницы и лимиту

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Название", dataIndex: "name", key: "name" },
    {
      title: "размеры (X×Y×Z)",
      key: "size",
      render: (w: Warehouse) => `${w.x} × ${w.y} × ${w.z}`,
    },
    {
      title: "Дата создания",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: any) => formatDate(date),
    },
  ]; //столбцы для тейбла

  const handleView = (warehouse: Warehouse) => {
    navigate(`/warehouses/${warehouse.id}`);
  }; //переход в подробности

  return (
    <>
      <SharedTable<Warehouse>
        columns={columns}
        onAdd={() => setFormOpen(true)}
        onDelete={deleteWarehouse}
        onView={handleView}
        functionQuery={functionQuery}
        queryKeyBase={["warehouse"]}
      />

      <div
        style={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <span>сортировать по:</span>
        <Select
          style={{ width: 200 }}
          value={sortBy}
          onChange={(value) => setSortBy(value)}
          options={[
            { value: "id", label: "ID" },
            { value: "date", label: "Дата создания" },
            { value: "cargo", label: "Количество грузов" },
          ]}
        />
      </div>

      <WarehousesCharts warehouses={warehouses?.data || []} sortBy={sortBy} />

      <WarehouseForm
        open={formOpen}
        titles="Добавить склад"
        onClose={() => setFormOpen(false)}
        onSubmit={handleAdd}
      />
    </>
  );
}
