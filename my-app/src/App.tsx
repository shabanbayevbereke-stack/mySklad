import { Routes, Route, Navigate } from "react-router-dom";

import { NoGest, ProtectedRoute } from "./components/ProtectedRoute";
import MainLayout from "./components/layout/MainLayout";

import LoginPage from "./pages/LoginPage/LoginPage";

import UsersListPage from "./pages/UsersListPage/UsersListPage";
import UserDetailPage from "./pages/UserDetailPage/UserDetailPage";
import CargoDetailPage from "./pages/CargoDetailPage/CargoDetailPage";
import CargoListPage from "./pages/CargoListPage/CargoListPage";
import WarehouseDetailPage from "./pages/WarehouseDetailPage/WarehouseDetailPage";
import WarehouseListPage from "./pages/WarehouseListPage/WarehouseListPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import { MyCustomPage } from "./pages/CastomPage/MyCustomPage";

export default function App() {
  return (
    <Routes>
      <Route element={<NoGest />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/users" element={<UsersListPage />} />
        <Route path="/users/:id" element={<UserDetailPage />} />

        <Route index element={<WarehouseListPage />} />

        <Route path="warehouses/:id" element={<WarehouseDetailPage />} />

        <Route path="warehouses/:id/cargo" element={<CargoListPage />} />
        <Route
          path="warehouses/:id/cargo/:cargoId"
          element={<CargoDetailPage />}
        />

        <Route path="warehouses" element={<Navigate to="/" replace />} />
        
        <Route path="castom" element={<MyCustomPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
