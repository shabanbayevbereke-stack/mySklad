import api from "@/api/axiosClient";
import type { Cargo, CargoCreate, CargoListResponse } from "@/types/cargo.types";

export const getCargo = async (
  warehouseId: number,
  cargoId: number,
): Promise<Cargo> => {
  const res = await api.get(`/warehouse/${warehouseId}/cargo/${cargoId}`);
  return res.data;
};

export const getCargoList = async (
  warehouseId: number,
  params: {
    limit: string; 
    page: string;
  },
): Promise<CargoListResponse> => {
  const res = await api.get(`/warehouse/${warehouseId}/cargo`, {
    params,
  });
  return res.data;
};

export const addCargo = async (
  warehouseId: number,
  cargo: Omit<Cargo, "id">,
): Promise<Cargo> => {
  const res = await api.post(`/warehouse/${warehouseId}/cargo`, cargo);
  return res.data;
};

export const deleteCargo = async (
  warehouseId: number,
  cargoId: number,
): Promise<void> => {
  await api.delete(`/warehouse/${warehouseId}/cargo/${cargoId}`);
};

export const updateCargo = async (
  warehouseId: number,
  cargoId: number,
  data: Partial<CargoCreate>,
): Promise<Cargo> => {
  const res = await api.patch(`/warehouse/${warehouseId}/cargo/${cargoId}`, data);
  return res.data;
};
