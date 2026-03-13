import { Spin, Table } from "antd";
import type { ColumnsType } from "antd/es/table";

interface User {
  key: string;
  name: string;
}

const columns: ColumnsType<User> = [
  {
    title: "Имя",
    dataIndex: "name",
  },
];

export default function Loading() {
  const loading = true;
  const data: User[] = [];

  return (
    <Spin spinning={loading} tip="Загрузка...">
      <Table<User>
        columns={columns}
        dataSource={data}
      />
    </Spin>
  );
}
