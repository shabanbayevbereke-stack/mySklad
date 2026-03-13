import type { User } from "@/types/users.types";
import api from "./axiosClient";

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export const loginUser = async (data: LoginData): Promise<AuthResponse> => {
  const res = await api.post("/users/auth/login", data);
  return res.data;
};

export const registerUser = async (data: LoginData): Promise<AuthResponse> => {
  const res = await api.post("/users/auth/register", data);
  return res.data;
};
