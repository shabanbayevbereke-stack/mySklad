import * as cargoApi from "@/api/cargo.api";
import type {
  Cargo,
  CargoCreate,
  CargoListResponse,
} from "@/types/cargo.types";
import { useLocation, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useCargo() {
  const { id, cargoId } = useParams<{ id: string; cargoId?: string }>();
  const warehouseId = Number(id);
  const cargoIdNum = Number(cargoId);

  const { search } = useLocation();

  const queryParams = new URLSearchParams(search);
  const currentPage = Number(queryParams.get("pageNumber")) || 1;
  const pageSize = Number(queryParams.get("pageSize")) || 5;

  const cargosKey = [
    "warehouse",
    warehouseId,
    "cargoList",
    currentPage,
    pageSize,
  ];

  const queryClient = useQueryClient();

  const { data: cargo, isLoading: isCargoLoading } = useQuery({
    queryKey: ["cargo", cargoIdNum],
    queryFn: () => cargoApi.getCargo(warehouseId, cargoIdNum),
    enabled: !!warehouseId && !!cargoIdNum,
  });

  const { mutateAsync: addCargo } = useMutation({
    mutationFn: (cargo: Omit<Cargo, "id">) =>
      cargoApi.addCargo(warehouseId, cargo),

    onMutate: async (newCargo) => {
      await queryClient.cancelQueries({
        queryKey: cargosKey,
      });
      const previousCargoList =
        queryClient.getQueryData<CargoListResponse>(cargosKey);

      const tempId = Math.random();
      queryClient.setQueryData<CargoListResponse>(
        ["warehouse", warehouseId, "cargoList", currentPage, pageSize],
        (old) =>
          old
            ? {
                ...old,
                data: [...old.data, { ...newCargo, id: tempId }],
              }
            : old,
      );

      return { previousCargoList };
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: cargosKey,
      });
    },

    onError: (_err, _newCargo, context) => {
      if (context?.previousCargoList) {
        queryClient.setQueryData(cargosKey, context.previousCargoList);
      }
    },
  });

  const { mutateAsync: deleteCargo, isPending } = useMutation({
    mutationFn: (cargoId: number) => cargoApi.deleteCargo(warehouseId, cargoId),
    onMutate: async (cargoId) => {
      await queryClient.cancelQueries({
        queryKey: cargosKey,
      });

      const previousCargoList =
        queryClient.getQueryData<CargoListResponse>(cargosKey);

      queryClient.setQueryData<CargoListResponse>(cargosKey, (old) =>
        old
          ? {
              ...old,
              data: old.data.filter((cargo) => cargo.id !== cargoId),
            }
          : old,
      );

      queryClient.removeQueries({
        queryKey: ["cargo", cargoId],
      });

      return { previousCargoList };
    },

    onError: (_err, _id, context) => {
      if (context?.previousCargoList) {
        queryClient.setQueryData(cargosKey, context.previousCargoList);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: cargosKey,
      });
    },
  });

  const { mutateAsync: editCargoMutation } = useMutation({
    mutationFn: (payload: Partial<CargoCreate>) =>
      cargoApi.updateCargo(warehouseId, cargoIdNum, payload),

    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ["cargo", cargoIdNum] });

      const previousCargo = queryClient.getQueryData(["cargo", cargoIdNum]);

      queryClient.setQueryData(["cargo", cargoIdNum], (old: any) =>
        old ? { ...old, ...newData } : old,
      );

      return { previousCargo };
    },

    onError: (_err, _newData, context) => {
      if (context?.previousCargo) {
        queryClient.setQueryData(["cargo", cargoIdNum], context.previousCargo);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["cargo", cargoIdNum],
      });
    },
  });

  return {
    editCargo: editCargoMutation,
    addCargo,
    deleteCargo,
    cargo,
    isCargoLoading,
    isPending,
    currentPage,
    pageSize,
  };
}
