import { useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Button,
  Select,
  notification,
} from "antd";

export type CargoFormValues = {
  guid: string;
  type: "cargo" | "container";
  netWeight: number;
  packWeight: number;
  x: number;
  y: number;
  z: number;
  sizeX: number;
  sizeY: number;
  sizeZ: number;
  containSizeX: number;
  containSizeY: number;
  containSizeZ: number;
};

type Props = {
  open: boolean;
  title: string;
  initialValues?: CargoFormValues | null;
  onClose: () => void;
  onSubmit: (values: CargoFormValues) => Promise<void> | void;
};

export default function CargoForm({
  open,
  title,
  initialValues,
  onClose,
  onSubmit,
}: Props) {
  const [form] = Form.useForm<CargoFormValues>();

  useEffect(() => {
    if (open && initialValues) {
      form.setFieldsValue(initialValues);
    }

    if (open && !initialValues) {
      form.resetFields();
    }
  }, [open, initialValues, form]);

  const handleFinish = async (values: CargoFormValues) => {
    try {
      await onSubmit(values);
      form.resetFields();
    } catch (error: any) {
      const serverMessage =
        error.response?.data?.message || error.message || "Ошибка сервера";

      notification.error({
        message: "Ошибка сохранения",
        description: serverMessage,
        placement: "topRight",
      });
    }
  };

  return (
    <Modal
      open={open}
      title={title}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      footer={null}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <div style={{ display: "flex", gap: "10px" }}>
          <Form.Item
            label="Название"
            name="guid"
            style={{ flex: 2 }}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Тип"
            name="type"
            style={{ flex: 1 }}
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="cargo">Груз</Select.Option>
              <Select.Option value="container">Контейнер</Select.Option>
            </Select>
          </Form.Item>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <Form.Item
            label="Вес нетто"
            name="netWeight"
            style={{ flex: 1 }}
            rules={[{ required: true }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Вес пакета"
            name="packWeight"
            style={{ flex: 1 }}
            rules={[{ required: true }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
        </div>

        <hr style={{ border: "0.5px solid #f0f0f0", marginBottom: "20px" }} />

        <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
          <Form.Item
            label="расположение X"
            name="x"
            style={{ flex: 1 }}
            rules={[{ required: true }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Y"
            name="y"
            style={{ flex: 1 }}
            rules={[{ required: true }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Z"
            name="z"
            style={{ flex: 1 }}
            rules={[{ required: true }]}
          >
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
          <Form.Item
            label="Размер X"
            name="sizeX"
            style={{ flex: 1 }}
            rules={[{ required: true }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Y"
            name="sizeY"
            style={{ flex: 1 }}
            rules={[{ required: true }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Z"
            name="sizeZ"
            style={{ flex: 1 }}
            rules={[{ required: true }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
          <Form.Item
            label="Раз. груз X"
            name="containSizeX"
            style={{ flex: 1 }}
            rules={[{ required: true }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Y"
            name="containSizeY"
            style={{ flex: 1 }}
            rules={[{ required: true }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Z"
            name="containSizeZ"
            style={{ flex: 1 }}
            rules={[{ required: true }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
        </div>

        <Button
          type="primary"
          htmlType="submit"
          block
          style={{ marginTop: 10 }}
        >
          Сохранить
        </Button>
      </Form>
    </Modal>
  );
}
