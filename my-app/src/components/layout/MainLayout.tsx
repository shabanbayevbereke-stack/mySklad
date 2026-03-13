// components/layout/MainLayout.tsx
import { Layout, Typography, Dropdown, message, type MenuProps } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import SideMenu from "./SideMenu";
import { useAuth } from "@/hooks/useAuth";

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();


  const displayName = user?.email ?? "Пользователь";

  const handleLogout = () => {
    logout();
    message.success("Вы вышли из системы");
    navigate("/login", { replace: true });
  };

  const dropdownMenu: MenuProps = {
    items: [
      {
        key: "logout",
        label: "Выйти",
        onClick: handleLogout,
      },
    ],
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} trigger={null}>
        <SideMenu collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      </Sider>

      <Layout>
        <Header
          style={{
            background: "#001529",
            padding: "0 16px",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Dropdown menu={dropdownMenu} placement="bottomRight">
            <Text
              style={{
                color: "#fff",
                fontWeight: 600,
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              {displayName}
            </Text>
          </Dropdown>
        </Header>

        <Content
          style={{
            padding: 16,
            background: "#f5f5f5",
            flex: 1,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
