import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as cargoApi from "@/api/cargo.api";

import CargoForm from "@/features/CargoForm/CargoForm";
import type { Cargo, CargoCreate } from "@/types/cargo.types";
import { SharedTable } from "@/features/Table/SharedTable";
import { useCargo } from "@/hooks/useCargo";

export default function CargoListPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addCargo, deleteCargo } = useCargo();

  const [formOpen, setFormOpen] = useState(false);

  const handleAdd = async (values: CargoCreate) => {
    await addCargo(values as Omit<Cargo, "id">);
    setFormOpen(false);
  };

  const handleView = (cargo: Cargo) => {
    if (!id) return;
    navigate(`/warehouses/${id}/cargo/${cargo.id}`);
  };

  const functionQuery = (params: { page: string; limit: string }) =>
    cargoApi.getCargoList(Number(id), params);

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Название", dataIndex: "name", key: "name" },
    {
      title: "Размеры (X×Y×Z)",
      key: "size",
      render: (c: Cargo) => `${c.x} × ${c.y} × ${c.z}`,
    },
    {
      title: "Дата создания",
      dataIndex: "createdAt",
      key: "createdAt",
    },
  ];

  return (
    <>
      <SharedTable<Cargo>
        columns={columns}
        showBackButton
        queryKeyBase={["cargo", id]}
        onDelete={deleteCargo}
        onAdd={() => setFormOpen(true)}
        onView={handleView}
        functionQuery={functionQuery}
      />

      <CargoForm
        open={formOpen}
        title="Добавить предмет"
        onClose={() => setFormOpen(false)}
        onSubmit={handleAdd}
      />
    </>
  );
}
