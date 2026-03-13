import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { QueryProvider } from "./providers/QueryProvider";
import { AuthProvider } from "./providers/AuthProvider";

import "antd/dist/reset.css";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryProvider>
      <ReactQueryDevtools initialIsOpen={false} />
      <AuthProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthProvider>
    </QueryProvider>
  </React.StrictMode>,
);

// QueryProvider — обёртка для работы с серверными запросами (скорее всего React Query или что-то похожее).

// AuthProvider — контекст аутентификации пользователя.

// React.StrictMode — проверка на потенциальные проблемы в приложении (только в режиме разработки).

// QueryProvider — глобальная обёртка для всех компонентов, которые будут использовать серверные запросы.

// AuthProvider — обеспечивает доступ к состоянию пользователя (логин, токен и т.д.) во всём приложении.

// Контекст авторизации (AuthProvider)

// Провайдер запросов (QueryProvider, скорее всего React Query)
