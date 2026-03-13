import { Button, Card, Descriptions, Typography, Space } from "antd";
import { useLocation, useNavigate, useParams } from "react-router-dom";

type Props = {
  warehouse: any;
  onEdit: () => void;
};

export default function WarehouseDetail({ warehouse, onEdit }: Props) {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation()

  if (!warehouse) {
    return <Typography.Text>Склад не найден</Typography.Text>;
  }

  return (
    <Card title={warehouse.name || "Склад"}>
      <Descriptions bordered column={1}>
        <Descriptions.Item label="ID">{warehouse.id}</Descriptions.Item>

        <Descriptions.Item label="Размеры (X×Y×Z)">
          {warehouse.x} × {warehouse.y} × {warehouse.z}
        </Descriptions.Item>

        <Descriptions.Item label="Описание">
          {warehouse.description || "—"}
        </Descriptions.Item>

        <Descriptions.Item label="Дата создания">
          {warehouse.createdAt}
        </Descriptions.Item>
      </Descriptions>

      <br />

      <Space>
        <Button
          type="primary"
          onClick={() =>
          navigate(`/warehouses/${id}/cargo`, {
            state:{ from: location.pathname },
          })
        }
        >
          Грузы на складе
        </Button>
        <Button type="primary" onClick={onEdit}>
          Редактировать
        </Button>
      </Space>
    </Card>
  );
}
