import { Modal, Form, Input, Select, Switch } from "antd";
import type { User, UserCreate } from "@/types/users.types";

type Props = {
  open: boolean;
  onClose?: () => void;
  onSubmit: (values: UserCreate) => void;
  user?: User;
};

export default function UserForm({ open, onClose, onSubmit, user }: Props) {
  const [form] = Form.useForm();

  return (
    <Modal
      open={open}
      title={user ? "Редактировать пользователя" : "Создать пользователя"}
      onCancel={() => {
        form.resetFields();
        onClose?.();
      }}
      onOk={() => {
        form.validateFields().then((values) => {
          onSubmit(values);
        });
      }}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ isActive: true, role: "manager" }}
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, type: "email" }]}
        >
          <Input />
        </Form.Item>
        {!user && (
          <Form.Item
            name="password"
            label="Пароль"
            rules={[{ required: true, min: 6 }]}
          >
            <Input.Password />
          </Form.Item>
        )}
        <Form.Item name="firstName" label="Имя">
          <Input />
        </Form.Item>
        <Form.Item name="lastName" label="Фамилия">
          <Input />
        </Form.Item>
        <Form.Item name="role" label="Роль">
          <Select
            options={[
              { value: "manager", label: "Менеджер" },
              { value: "admin", label: "Админ" },
            ]}
          />
        </Form.Item>
        <Form.Item name="isActive" label="Активность" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
}
