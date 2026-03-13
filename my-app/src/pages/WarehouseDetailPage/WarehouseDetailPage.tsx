import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Col, Row } from "antd";
import WarehouseForm from "@/features/WarehouseForm/WarehouseForm";
import WarehouseDetail from "./components/warehousesDetail/WarehouseDetail";
import MiniCargoList from "./components/miniCargoList/miniCargoList";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  YAxis,
} from "recharts";
import { getWarehouse, updateWarehouse } from "@/api/warehouse.api";

export default function WarehouseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const warehouseId = String(id);

  const [editOpen, setEditOpen] = useState(false);
  const navigate = useNavigate();

  const {
    data: warehouse,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["warehouse", warehouseId],
    queryFn: () => getWarehouse(Number(warehouseId)),
    enabled: !!warehouseId,
  });

  const totals = Object.values(warehouse?.cargo || {}).reduce(
    (acc, item) => {
      if (item.type === "container") {
        acc.containers += 1;
      } else if (item.type === "cargo") {
        acc.cargo += 1;
      }

      return acc;
    },
    { containers: 0, cargo: 0 },
  );

  console.log(`Контейнеров: ${totals.containers}, Грузов: ${totals.cargo}`);

  const dataItems = [
    {
      name: "items",
      conteiner: totals.containers,
      cargo: totals.cargo,
    },
  ];

  if (!warehouse) return <div>Загрузка...</div>;

  const handleEdit = async (values: any) => {
    const payload = {
      ...values,
      x: Number(values.x),
      y: Number(values.y),
      z: Number(values.z),
    };

    await updateWarehouse(Number(id), payload);
    setEditOpen(false);
    refetch();
  };

  return (
    <>
      <Button onClick={() => navigate("/warehouses")}>Назад</Button>

      <Row>
        <Col span={12}>
          <WarehouseDetail
            warehouse={warehouse}
            onEdit={() => setEditOpen(true)}
          />
        </Col>
        <Col span={12}>
          <BarChart
            style={{
              width: "100%",
              height: "100%",
              aspectRatio: 1.618,
            }}
            responsive
            data={dataItems}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <YAxis width="auto" />

            <Tooltip labelFormatter={() => ""}></Tooltip>
            <Legend />
            <Bar dataKey="conteiner" fill="#8884d8" />
            <Bar dataKey="cargo" fill="#82ca9d" />
          </BarChart>
        </Col>
      </Row>

      <WarehouseForm
        open={editOpen}
        titles="Редактировать склад"
        initialValues={warehouse}
        onClose={() => setEditOpen(false)}
        onSubmit={handleEdit}
      />

      <MiniCargoList items={warehouse.cargo!} loading={isLoading} />
    </>
  );
}
