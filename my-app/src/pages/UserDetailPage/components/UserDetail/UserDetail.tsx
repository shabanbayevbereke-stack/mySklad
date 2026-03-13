import { Card, Descriptions } from "antd";
import type { User } from "@/types/users.types";

type Props = {
  user: User;
};

export default function UserDetail({ user }: Props) {
  return (
    <Card
      title={`Пользователь: ${user.firstName || ""} ${user.lastName || ""}`}
    >
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
        <Descriptions.Item label="Роль">{user.role}</Descriptions.Item>
        <Descriptions.Item label="Активность">
          {user.isActive ? "Активен" : "Неактивен"}
        </Descriptions.Item>
        <Descriptions.Item label="Дата создания">
          {user.createdAt}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
}
