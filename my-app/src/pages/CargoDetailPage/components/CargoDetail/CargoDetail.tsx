import { Button, Card, Descriptions } from "antd";

type Props = {
  cargo: any;
  onEdit: () => void;
  handleBack: () => void;
};

export default function CargoDetailPage({ cargo, handleBack, onEdit }: Props) {
  return (
    <div>
      <Button onClick={handleBack}>Назад</Button>
      <Card title={`Детали груза: ${cargo.name}`} style={{ marginTop: 16 }}>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="Название">{cargo.name}</Descriptions.Item>
          <Descriptions.Item label="Вес">{cargo.netWeight}</Descriptions.Item>
          <Descriptions.Item label="Размеры">
            {cargo.x}×{cargo.y}×{cargo.z}
          </Descriptions.Item>
          <Descriptions.Item label="Дата добавления">
            {cargo.storageDate}
          </Descriptions.Item>
        </Descriptions>
        <br />
        <Button type="primary" onClick={onEdit}>
          Редактировать
        </Button>
      </Card>
    </div>
  );
}
