import type { ListResponse } from "./list.types";

export interface Cargo {
  id: number;
  guid: string;
  type: "cargo" | "container";
  name: string;
  createdAt: string;
  description: string;
  netWeight: number;
  packWeight: number;
  totalWeight: number;
  maxLoadWeight: number;
  x: number;
  y: number;
  z: number;
  sizeX: number;
  sizeY: number;
  sizeZ: number;
  containSizeX: number;
  containSizeY: number;
  containSizeZ: number;
  position: string;
  transportNumber: string;
  storageDate: string;
}
export interface CargoCreate {
  name?: string;
  x: number;
  y: number;
  z: number;
  netWeight: number;
}

export type UpdateCargoDto = CargoCreate;

export type CargoListResponse = ListResponse<Cargo>;
