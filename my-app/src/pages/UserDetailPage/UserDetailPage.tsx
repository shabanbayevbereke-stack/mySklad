import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as usersApi from "@/api/users.api";
import type { User } from "@/types/users.types";
import UserDetail from "./components/UserDetail/UserDetail";
import { Button, Spin } from "antd";
import { CaretLeftOutlined } from "@ant-design/icons";

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    usersApi
      .getUserById(String(id))
      .then(setUser)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <Spin
        spinning={loading}
        style={{ display: "block", margin: "50px auto" }}
      />
    );
  if (!user) return <>Пользователь не найден</>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <Button
        onClick={() => navigate(-1)}
        style={{ width: "max-content" }}
        icon={<CaretLeftOutlined />}
      >
        назад
      </Button>
      <UserDetail user={user} />
    </div>
  );
}
