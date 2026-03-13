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
          <Descriptions.Item label="GUID">{cargo.guid}</Descriptions.Item>
          <Descriptions.Item label="Название">{cargo.name}</Descriptions.Item>
          <Descriptions.Item label="Вес, кг">
            Чистый: {cargo.netWeight},<br /> Упаковка: {cargo.packWeight},<br />
            Общий: {cargo.totalWeight},<br /> Максимум: {cargo.maxLoadWeight}
          </Descriptions.Item>
          <Descriptions.Item label="Размеры (см)">
            Фактический: {cargo.sizeX}×{cargo.sizeY}×{cargo.sizeZ} <br />
            Вместимость: {cargo.containSizeX}×{cargo.containSizeY}×
            {cargo.containSizeZ}
          </Descriptions.Item>
          <Descriptions.Item label="Транспорт">
            {cargo.transportNumber}
          </Descriptions.Item>
          <Descriptions.Item label="Склад">
            {cargo.warehouseId}
          </Descriptions.Item>
          <Descriptions.Item label="Описание">
            {cargo.description || "Нет описания"}
          </Descriptions.Item>
          <Descriptions.Item label="Дата хранения">
            {new Date(cargo.storageDate).toLocaleDateString("ru-RU")}
          </Descriptions.Item>
          <Descriptions.Item label="Дата создания">
            {new Date(cargo.createdAt).toLocaleString("ru-RU")}
          </Descriptions.Item>
          <Descriptions.Item label="Последнее обновление">
            {new Date(cargo.updatedAt).toLocaleString("ru-RU")}
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
