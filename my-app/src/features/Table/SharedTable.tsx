import { Button, Table, Popconfirm, type TableColumnsType } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { DeleteOutlined, LeftOutlined } from "@ant-design/icons";
import { useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

type SharedTableProps<T extends { id: number }> = {
  columns: TableColumnsType<T>;
  queryKeyBase: any;
  onDelete?: (id: number) => void;
  onView?: (item: T) => void;
  onAdd?: () => void;
  whereGoBack?: string;
  showBackButton?: boolean;
  functionQuery: (params: { page: string; limit: string }) => Promise<any>;
};

export function SharedTable<T extends { id: number }>({
  columns,
  onDelete,
  onAdd,
  showBackButton,
  whereGoBack,
  queryKeyBase,
  onView,
  functionQuery,
}: SharedTableProps<T>) {
  const navigate = useNavigate();
  const location = useLocation();
  const search = location.search;

  const urlParams = useMemo(() => new URLSearchParams(search), [search]);

  const page = urlParams.get("pageNumber") || "1";
  const pageSize = urlParams.get("pageSize") || "5";

  const { data, isLoading } = useQuery({
    queryKey: [...queryKeyBase, page, pageSize],
    queryFn: () => functionQuery({ page, limit: pageSize }),
  });

  const dataSource = data?.data;
  const meta = data?.meta;
  const limit = meta?.limit;
  const total = meta?.total;

  const totalPage = meta?.totalPages;
  const showButton = showBackButton && whereGoBack && location.state;

  const actionColumn: TableColumnsType<T> = [
    {
      title: "Действия",
      key: "actions",
      width: 100,
      render: (_, record) => {
        return onDelete ? (
          <Popconfirm
            title="Вы уверены?"
            onConfirm={(e) => {
              e?.stopPropagation();
              onDelete(record.id);
            }}
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={(e) => e.stopPropagation()}
            />
          </Popconfirm>
        ) : null;
      },
    },
  ];

  const handleBack = () => navigate(`${location.state.from}`);

  const handlePageChange = (newPage: number) => {
    urlParams.set("pageNumber", String(newPage));
    navigate(`?${urlParams.toString()}`, {
      state: location.state,
    });
  };

  const handlePageSizeChange = (size: number) => {
    urlParams.set("pageSize", String(size));
    navigate(`?${urlParams.toString()}`, {
      state: location.state,
    });
  };

  useEffect(() => {
    if (totalPage && Number(page) > Number(totalPage)) {
      urlParams.set("pageNumber", "1");
      navigate(`?${urlParams.toString()}`, {
        state: location.state,
      });
    }
  }, [totalPage, navigate, urlParams, page, location.state]);

  return (
    <>
      <div
        style={{
          display: "Flex",
          justifyContent: "space-between",
        }}
      >
        {showButton && <Button onClick={handleBack} icon={<LeftOutlined />} />}
        <Button type="primary" onClick={onAdd} style={{ marginLeft: "auto" }}>
          Добавить
        </Button>
      </div>

      <Table<T>
        rowKey="id"
        loading={isLoading}
        dataSource={dataSource || []}
        columns={[...columns, ...actionColumn]}
        onRow={(record) => ({ onClick: () => onView?.(record) })}
        pagination={{
          current: Number(page),
          total: total,
          pageSize: limit,
          showSizeChanger: true,
          pageSizeOptions: [2, 5, 10],
          onChange: (page, size) => {
            handlePageChange(page);
            if (size) handlePageSizeChange(size);
          },
          placement: ["bottomEnd"],
        }}
        scroll={{ x: 800 }}
        style={{ cursor: "pointer" }}
      />
    </>
  );
}
