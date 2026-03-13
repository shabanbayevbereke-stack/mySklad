import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import CargoForm from "@/features/CargoForm/CargoForm";
import CargoDetail from "./components/CargoDetail/CargoDetail";
import { useCargo } from "@/hooks/useCargo";
import type { UpdateCargoDto } from "@/types/cargo.types";

export default function CargoDetailPage() {
  const navigate = useNavigate();

  const [editOpen, setEditOpen] = useState(false);

  const { cargo, isCargoLoading, editCargo } = useCargo();

  if (isCargoLoading) return <div>Загрузка...</div>;
  if (!cargo) return <div>Груз не найден</div>;

  const handleEdit = async (values: any) => {
    const payload: UpdateCargoDto = {
      name: values.name ?? "",
      x: Number(values.x ?? 1),
      y: Number(values.y ?? 1),
      z: Number(values.z ?? 1),
      netWeight: Number(values.netWeight ?? "0"),
    };

    await editCargo(payload);

    message.success("Груз обновлён");
    setEditOpen(false);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <CargoDetail
        cargo={cargo}
        onEdit={() => setEditOpen(true)}
        handleBack={handleBack}
      />

      <CargoForm
        open={editOpen}
        title="Редактирование груза"
        initialValues={{
          ...cargo,
          netWeight: cargo.netWeight ?? 0,
        }}
        onClose={() => setEditOpen(false)}
        onSubmit={handleEdit}
      />
    </>
  );
}
