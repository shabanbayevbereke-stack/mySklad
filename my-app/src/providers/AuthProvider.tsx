import { useMutation } from "@tanstack/react-query";
import { message } from "antd";
import { useState, type ReactNode } from "react";
import { loginUser, registerUser } from "@/api/authApi";
import { AuthContext } from "@/hooks/useAuth";
import type { User } from "@/types/users.types";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("authUser");
    return stored ? JSON.parse(stored) : null;
  });

  const [accessToken, setAccessToken] = useState<string | null>(() =>
    localStorage.getItem("accessToken"),
  );

  const { mutate: login, isPending: isLoginLoading } = useMutation({
    mutationKey: ["login"],
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginUser({ email, password }),
    onSuccess: (data) => {
      setUser(data.user);
      setAccessToken(data.accessToken);

      localStorage.setItem("authUser", JSON.stringify(data.user));
      localStorage.setItem("accessToken", data.accessToken);

      message.success("Вы успешно вошли");
    },
    onError: (err: any) => {
      const errorMsg = err.response?.data?.message || "Ошибка при входе";
      message.error(errorMsg);
    },
  });

  const { mutate: register, isPending: isRegisterLoading } = useMutation({
    mutationKey: ["register"],
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      registerUser({ email, password }),
    onSuccess: (data) => {
      setUser(data.user);
      setAccessToken(data.accessToken);

      localStorage.setItem("authUser", JSON.stringify(data.user));
      localStorage.setItem("accessToken", data.accessToken);
    },
    onError: (err: any) => {
      const errorMsg = err.response?.data?.message || "Ошибка при входе";
      message.error(errorMsg);
    },
  });

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem("authUser");
    localStorage.removeItem("accessToken");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: !!user && !!accessToken,
        login,
        isLoginLoading,
        register,
        isRegisterLoading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
