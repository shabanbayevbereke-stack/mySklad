import { Button, Form, Input, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { useLogin } from "./hooks/useLogin";

const { Text } = Typography;

export function LoginForm() {
  const navigate = useNavigate();

  const { onFinish, isLoginLoading } = useLogin();

  return (
    <Form layout="vertical" onFinish={onFinish}>
      <Form.Item
        name="email"
        label="Email"
        rules={[
          { required: true, message: "Введите email" },
          { type: "email", message: "Некорректный email" },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="password"
        label="Пароль"
        rules={[
          { required: true, message: "Введите пароль" },
          { min: 6, message: "Минимум 6 символов" },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Button type="primary" htmlType="submit" block loading={isLoginLoading}>
        Войти
      </Button>

      <Text
        style={{
          display: "flex",
          marginTop: 16,
          justifyContent: "space-between",
        }}
      >
        <p>Нет аккаунта?</p>{" "}
        <Button
          onClick={() => navigate("/register")}
          color="default"
          variant="link"
        >
          Зарегистрироваться
        </Button>
      </Text>
    </Form>
  );
}
