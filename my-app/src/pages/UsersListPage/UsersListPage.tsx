import * as usersApi from "@/api/users.api";
import { useState } from "react";
import UserForm from "@/features/UserForm/UserForm";
import { useUsers } from "../../hooks/useUsers";
import { useLocation, useNavigate } from "react-router-dom";
import { SharedTable } from "@/features/Table/SharedTable";
import type { User, UserCreate } from "@/types/users.types";
import { Button } from "antd";

export default function UsersListPage() {
  const { addUser, deleteUser } = useUsers();
  const [FormOpen, setFormOpen] = useState(false);

  const navigate = useNavigate();

  const location = useLocation();

  const handleAdd = (value: UserCreate) => {
    addUser(value, {
      onSuccess: () => setFormOpen(false),
    });
  };

  const functionQuery = (params: { page: string; limit: string }) =>
    usersApi.getUsersList(params);

  const handleView = (user: User) => {
    navigate(`/users/${user.id}`);
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "FirstName",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "IsActive",
      render: (isActive: boolean) => {
        return isActive ? "Активен" : "Неактивен";
      },
      dataIndex: "isActive",
      key: "isActive",
    },
  ];

  return (
    <>
      <Button
        onClick={() =>
          navigate("/warehouses/6/cargo", {
            state:{ from: location.pathname },
          })
        }
      >
        go to cargo
      </Button>
      <SharedTable<User>
        columns={columns}
        queryKeyBase={["user"]}
        onDelete={deleteUser}
        onAdd={() => setFormOpen(true)}
        onView={handleView}
        functionQuery={functionQuery}
      />
      <UserForm
        open={FormOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleAdd}
      />
    </>
  );
}
