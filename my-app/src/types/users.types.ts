export interface User {
  id: number;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  position?: string;
  department?: string;
  permission?: string;
  role?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UsersListResponse {
  data: User[];
  ListMeta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface UserCreate {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  isActive?: boolean;
}

export type UserUpdate = Partial<
  UserCreate & Omit<User, "id" | "createdAt" | "updatedAt">
>;
