import { Table, Typography, Spin, Tooltip } from "antd";
import type { TableColumnsType } from "antd";
import type { Cargo } from "@/types/cargo.types";
import { formatDate } from "@/utils/helpers";

type Props = {
  items: Cargo[];
  loading: boolean;
};

export default function CargoMiniList({ items, loading }: Props) {
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 24 }}>
        <Spin tip="Загрузка..." />
      </div>
    );
  }

  if (!items.length) {
    return <Typography.Text>Грузы отсутствуют</Typography.Text>;
  }

  const columns: TableColumnsType<Cargo> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 50,
    },
    {
      title: "Название",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Вес",
      dataIndex: "totalWeight",
      key: "totalWeight",
      render: (value) => `${value} кг`,
      width: 85,
    },
    {
      title: "Вес груза",
      dataIndex: "netWeight",
      key: "netWeight",
      render: (value) => `${value} кг`,
      width: 85,
    },
    {
      title: "Вес обертки",
      dataIndex: "packWeight",
      key: "packWeight",
      render: (value) => `${value} кг`,
      width: 100,
    },
    {
      title: "допустимый Вес",
      dataIndex: "maxLoadWeight",
      key: "maxLoadWeight",
      render: (value) => (value != null ? `${value} кг` : "—"),
      width: 150,
    },
    {
      title: "Размеры (X×Y×Z)",
      key: "size",
      render: (_, w) => `${w.x} × ${w.y} × ${w.z}`,
      width: 140,
    },
    {
      title: "Описание",
      dataIndex: "description",
      key: "description",
      render: (value) => (
        <Tooltip title={value}>
          <span>
            <p
              style={{
                maxWidth: "20ch",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              {value}
            </p>
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Дата создания",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (data) => formatDate(data),
    },
  ];

  return (
    <Table
      scroll={{ x: 1300, y: 300 }}
      size="small"
      dataSource={items}
      rowKey="id"
      columns={columns}
      pagination={false}
    />
  );
}
