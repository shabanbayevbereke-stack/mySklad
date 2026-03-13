import { useEffect } from "react";
import { Modal, Form, Input, InputNumber } from "antd";

type Props = {
  open: boolean;
  titles: string;
  initialValues?: any;
  onClose: () => void;
  onSubmit: (values: any) => void;
};

export default function WarehouseForm({
  open,
  titles,
  initialValues,
  onClose,
  onSubmit,
}: Props) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open && initialValues) {
      form.setFieldsValue({
        name: initialValues.name,
        description: initialValues.description,
        x: initialValues.x,
        y: initialValues.y,
        z: initialValues.z,
      });
    }

    if (open && !initialValues) {
      form.resetFields();
    }
  }, [open, initialValues, form]);

  return (
    <Modal
      open={open}
      title={titles}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      onOk={() => {
        form.validateFields().then((values) => {
          onSubmit(values);
        });
      }}
      destroyOnHidden
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Название" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="description" label="Описание">
          <Input />
        </Form.Item>

        <Form.Item name="x" label="X" rules={[{ required: true }]}>
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="y" label="Y" rules={[{ required: true }]}>
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="z" label="Z" rules={[{ required: true }]}>
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
