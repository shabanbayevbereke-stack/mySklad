import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

type RegisterFormValues = {
  email: string;
  password: string;
  confirmPassword: string;
};

export const useRegister = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, isRegisterLoading } = useAuth();
  const onFinish = async (values: RegisterFormValues) => {
    register({
      email: values.email,
      password: values.password,
    });

    const from =
      (
        location.state as {
          from?: {
            pathname: string;
          };
        }
      )?.from?.pathname || "/";
    navigate(from, { replace: true });
  };
  return { onFinish, isRegisterLoading };
};
