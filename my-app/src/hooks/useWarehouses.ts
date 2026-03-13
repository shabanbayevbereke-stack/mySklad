import * as warehouseApi from "@/api/warehouse.api";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryKey,
} from "@tanstack/react-query";
import { useLocation, useParams } from "react-router-dom";
import type { Warehouse, WarehouseCreate } from "@/types/warehouse.types";

type MutationContext = {
  previousData: [QueryKey, unknown][];
};

export function useWarehouses() {
  const params = useParams();
  const { id } = params;
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const currentPage = Number(searchParams.get(`pageNumber`)) || 1;
  const pageSize = Number(searchParams.get(`pageSize`) || 5);
  const queryClient = useQueryClient();

  const { data: warehouses, isLoading: loading } = useQuery({
    queryKey: ["warehouses", currentPage, pageSize],
    queryFn: () => warehouseApi.getWarehousesList(params),
  });

  const { mutate: addWarehouse } = useMutation<
    Warehouse,
    Error,
    WarehouseCreate,
    MutationContext
  >({
    mutationFn: (newWarehouse) => warehouseApi.createWarehouse(newWarehouse),
    onMutate: async (newWarehouse) => {
      await queryClient.cancelQueries({ queryKey: ["warehouse"] });
      const previousData = queryClient.getQueriesData({
        queryKey: ["warehouse"],
      });

      queryClient.setQueriesData(
        { queryKey: ["warehouse"] },
        (oldData: { data: Warehouse[] }) => {
          if (!oldData || !oldData.data) return oldData;
          return {
            ...oldData,
            data: [newWarehouse, ...oldData.data],
          };
        },
      );

      return { previousData };
    },
    onError: (err, _variables, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      console.error("error", err.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouse"] });
    },
  });

  const { mutate: deleteWarehouse } = useMutation<
    void,
    Error,
    number,
    MutationContext
  >({
    mutationFn: (id: number) => warehouseApi.deleteWarehouse(id),
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ["warehouse"] });
      const previousData = queryClient.getQueriesData({
        queryKey: ["warehouse"],
      });

      queryClient.setQueriesData(
        { queryKey: ["warehouse"] },
        (oldData: { data: Warehouse[] }) => {
          if (!oldData || !oldData.data) return oldData;
          return {
            ...oldData,
            data: oldData.data.filter((w: Warehouse) => w.id !== deletedId),
          };
        },
      );

      return { previousData };
    },
    onError: (err, _variables, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      console.error("error", err.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["warehouse"] });
    },
  });

  const { mutate: editWarehouse } = useMutation<
    Warehouse,
    Error,
    Warehouse,
    { previousWarehouse?: Warehouse }
  >({
    mutationFn: (newData) => warehouseApi.updateWarehouse(Number(id), newData),
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ["warehouse", id] });
      const previousWarehouse = queryClient.getQueryData<Warehouse>([
        "warehouse",
        id,
      ]);
      queryClient.setQueryData(["warehouse", id], (old?: Warehouse) => ({
        ...old,
        ...newData,
      }));
      return { previousWarehouse };
    },
    onError: (_err, _newData, context) => {
      if (context?.previousWarehouse) {
        queryClient.setQueryData(["warehouse", id], context.previousWarehouse);
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["warehouse", id], data);
      queryClient.invalidateQueries({ queryKey: ["warehouse"] });
    },
  });

  return {
    warehouses,
    loading,
    addWarehouse,
    editWarehouse,
    deleteWarehouse,
    currentPage,
    pageSize,
  };
}
