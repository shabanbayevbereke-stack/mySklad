import { Button, Form, Input, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { useRegister } from "./hooks/useRegister";

const { Text } = Typography;

export function RegisterForm() {
  const navigate = useNavigate();

  const { onFinish, isRegisterLoading } = useRegister();

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

      <Form.Item
        name="confirmPassword"
        label="Повторите пароль"
        dependencies={["password"]}
        rules={[
          { required: true, message: "Повторите пароль" },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue("password") === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error("Пароли не совпадают"));
            },
          }),
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Button
        type="primary"
        htmlType="submit"
        block
        loading={isRegisterLoading}
      >
        Зарегистрироваться
      </Button>

      <Text
        style={{
          display: "flex",
          marginTop: 16,
          justifyContent: "space-between",
        }}
      >
        <p>Уже есть аккаунт?</p>
        <Button
          onClick={() => navigate("/login")}
          color="default"
          variant="link"
        >
          Войти
        </Button>
      </Text>
    </Form>
  );
}
