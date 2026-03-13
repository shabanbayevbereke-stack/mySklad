import { Navigate, Outlet, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";

type ProtectedRouteProps = {
  children?: ReactNode;
  roles?: string[];
};

export function NoGest() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // Не авторизован
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Нет нужной роли
  if (roles && user && !roles.includes(user.role!)) {
    return <Navigate to="/" replace />;
  }

  // Всё ок
  return children ? <>{children}</> : <Outlet />;
}

// Navigate — делает редирект на другой маршрут.

// Outlet — точка вставки вложенных маршрутов (children routes).

// useLocation — хук, который возвращает текущий URL (нужен, чтобы помнить, откуда пришёл пользователь).

// ReactNode — тип для children (любой JSX: компонент, строка, фрагмент и т.д.).

// useAuth — кастомный хук, который даёт доступ к:

// isAuthenticated — авторизован пользователь или нет

// user — объект текущего пользователя (роль, id и т.п.)

// children — компонент(ы), которые нужно защитить.

// roles — необязательный список ролей, которым разрешён доступ.

// user — объект пользователя (например { id, email, role })

// location — текущий маршрут, например:

// { pathname: "/warehouses/3", search: "", hash: "" }

// Итог: зачем нужен ProtectedRoute

// ✅ Защита маршрутов от неавторизованных
// ✅ Контроль доступа по ролям
// ✅ Корректный UX с возвратом на предыдущую страницу
