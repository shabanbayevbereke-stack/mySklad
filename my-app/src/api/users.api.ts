import api from "@/api/axiosClient";
import type {
  User,
  UsersListResponse,
  UserCreate,
  UserUpdate,
} from "@/types/users.types";

export const getUsersList = async (
  params?: Record<string, any>,
): Promise<UsersListResponse> => {
  const res = await api.get("/users", { params });
  return res.data;
};

export const getUserById = async (id: string): Promise<User> => {
  const res = await api.get(`/users/${id}`);
  return res.data;
};

export const createUser = async (data: UserCreate): Promise<User> => {
  const res = await api.post("/users", data);
  return res.data;
};

export const updateUser = async (
  id: string,
  data: UserUpdate,
): Promise<User> => {
  const res = await api.patch(`/users/${id}`, data);
  return res.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/users/${id}`);
};
