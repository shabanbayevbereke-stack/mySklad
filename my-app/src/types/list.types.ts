export interface ListMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ListResponse<T> {
  data: T[];
  meta: ListMeta;
}
