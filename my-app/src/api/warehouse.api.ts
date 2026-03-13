import api from "@/api/axiosClient";
import type {
  Warehouse,
  WarehousesListResponse,
  WarehouseCreate,
} from "@/types/warehouse.types";

export const getWarehousesList = async (
  params?: Record<string, any>,
): Promise<WarehousesListResponse> => {
  const res = await api.get("/warehouse", { params });
  return res.data;
};

export const getWarehouse = async (id: number): Promise<Warehouse> => {
  const res = await api.get(`/warehouse/${id}`);
  return res.data;
};

export const createWarehouse = async (
  data: WarehouseCreate,
): Promise<Warehouse> => {
  const res = await api.post("/warehouse", data);
  return res.data;
};

export const updateWarehouse = async (
  id: number,
  data: WarehouseCreate ,
): Promise<Warehouse> => {
  const res = await api.patch(`/warehouse/${id}`, data);
  return res.data;
};

export const deleteWarehouse = async (id: number): Promise<void> => {
  await api.delete(`/warehouse/${id}`);
};
