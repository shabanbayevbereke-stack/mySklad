import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

type LoginFormValues = {
  email: string;
  password: string;
};

export const useLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoginLoading } = useAuth();

  const onFinish = async (values: LoginFormValues) => {
    login({
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
  return { onFinish, isLoginLoading };
};
