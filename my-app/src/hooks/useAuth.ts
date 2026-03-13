import type { UseMutateFunction } from "@tanstack/react-query";
import { createContext, useContext } from "react";
import type { User } from "@/types/users.types";
import type { AuthResponse } from "@/api/authApi";

type AuthContextValue = {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: UseMutateFunction<
    AuthResponse,
    Error,
    {
      email: string;
      password: string;
    },
    unknown
  >;
  isLoginLoading: boolean;
  register: UseMutateFunction<
    AuthResponse,
    Error,
    {
      email: string;
      password: string;
    },
    unknown
  >;
  isRegisterLoading: boolean;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
