import { DeleteOutlined } from "@ant-design/icons";
import {
  Button,
  Popconfirm,
  Spin,
  Table,
  Typography,
  type TableColumnsType,
} from "antd";
import type { Warehouse } from "@/types/warehouse.types";
import { formatDate } from "@/utils/helpers";

type Props = {
  warehouses: Warehouse[];
  loading: boolean;
  onDelete: (id: number) => void;
  isWarehouseDeletionPending: boolean;
  onView: (id: number) => void;
  onAdd: () => void;
};

export default function WarehousesList({
  warehouses,
  loading,
  onDelete,
  isWarehouseDeletionPending,
  onView,
  onAdd,
}: Props) {
  if (loading)
    return (
      <Spin
        spinning={loading}
        tip="Загрузка..."
        style={{ display: "block", margin: "50px auto" }}
      />
    );

  if (!warehouses.length)
    return <Typography.Text>Склады отсутствуют</Typography.Text>;

  const lister: TableColumnsType = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
    },
    {
      title: "Название",
      dataIndex: "name",
      key: "name",
      width: 200,
    },
    {
      title: "Размеры (X×Y×Z)",
      render: (_, w) => `${w.x} × ${w.y} × ${w.z}`,
      dataIndex: "",
      key: "size",
      width: 150,
    },
    {
      title: "Дата создания",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => formatDate(date),
      width: 150,
    },
    {
      title: "Действия",
      render: (_, w) => (
        <Popconfirm
          title="вы уверены?"
          onConfirm={(e) => {
            e?.stopPropagation();
            onDelete(w.id);
          }}
          okText="да"
          cancelText="нет"
        >
          <Button
            danger
            loading={isWarehouseDeletionPending}
            icon={<DeleteOutlined />}
            onClick={(e) => e.stopPropagation()}
          />
        </Popconfirm>
      ),
      dataIndex: "",
      key: "do",
    },
  ];
  return (
    <>
      <Button type="primary" onClick={onAdd} style={{ marginBottom: 16 }}>
        Добавить склад
      </Button>

      <Table
        dataSource={warehouses}
        scroll={{ x: 800, y: 400 }}
        rowKey="id"
        columns={lister}
        onRow={(record) => ({ onClick: () => onView(record.id) })}
        style={{ cursor: "pointer" }}
        pagination={{
          current: 1,
          pageSize: 5,
          total: 5,
          showSizeChanger: true,
          pageSizeOptions: [2, 5, 10],
          placement: ["bottomEnd"],
        }}
      />
    </>
  );
}
