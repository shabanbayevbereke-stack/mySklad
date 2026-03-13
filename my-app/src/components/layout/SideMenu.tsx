// components/layout/SideMenu.tsx
import { Menu, Button, message } from "antd";
import {
  HomeOutlined,
  TeamOutlined,
  LogoutOutlined,
  UserOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

type SideMenuProps = {
  collapsed: boolean;
  onToggle: () => void;
};

export default function SideMenu({ collapsed, onToggle }: SideMenuProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    message.success("Вы вышли из системы");
    navigate("/login");
  };

  const selectedKey = () => {
    if (location.pathname.startsWith("/users")) return "users";
    if (location.pathname.startsWith("/profile")) return "profile";
    return "warehouses";
  };

  const items = [
    {
      key: "warehouses",
      icon: <HomeOutlined />,
      label: "Склады",
      onClick: () => navigate("/"),
    },
    {
      key: "users",
      icon: <TeamOutlined />,
      label: "Пользователи",
      onClick: () => navigate("/users"),
    },
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Профиль",
      onClick: () => navigate("/profile"),
    },
    { type: "divider" as const },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Выход",
      onClick: handleLogout,
    },
  ].filter(Boolean);

  return (
    <>
      <div style={{ padding: 16 }}>
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={onToggle}
          style={{ color: "#fff", width: "100%" }}
        >
          {!collapsed && "Меню"}
        </Button>
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey()]}
        items={items}
      />
    </>
  );
}
