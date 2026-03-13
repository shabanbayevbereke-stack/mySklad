import type { Cargo } from "./cargo.types";
import type { ListResponse } from "./list.types";

export interface Warehouse {
  id: number; 
  x: number;
  y: number;
  z: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  cargo: Cargo[];
}

export interface WarehouseCreate {
  name?: string;
  description?: string;
  x: number;
  y: number;
  z: number;
}

export type WarehousesListResponse = ListResponse<Warehouse>;
