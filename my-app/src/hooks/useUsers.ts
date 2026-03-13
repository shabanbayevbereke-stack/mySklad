import * as usersApi from "@/api/users.api";
import { useParams } from "react-router-dom";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type QueryKey,
} from "@tanstack/react-query";
import type { User, UserCreate } from "@/types/users.types";

type MutationContext = {
  previousData: [QueryKey, unknown][];
};

export function useUsers() {
  const params = useParams();
  const queryClient = useQueryClient();

  const { data: users, isLoading: loading } = useQuery({
    queryKey: ["user", params],
    queryFn: () => usersApi.getUsersList(params),
  });

  const { mutateAsync: addUser } = useMutation<
    User,
    Error,
    UserCreate,
    MutationContext
  >({
    mutationFn: (newUser) => usersApi.createUser(newUser),
    onMutate: async (newUser) => {
      await queryClient.cancelQueries({ queryKey: ["user"] });
      const previousData = queryClient.getQueriesData<UserCreate>({
        queryKey: ["user"],
      });
      queryClient.setQueriesData({ queryKey: ["user"] }, (oldData: { data: User[] }) => {
        if (!oldData || !oldData.data) return oldData;

        return {
          ...oldData,
          data: [newUser, ...oldData.data],
        };
      });

      return { previousData };
    },
    onError: (err, _newUser, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      console.error("Ошибка при добавлении:", err.message);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const { mutateAsync: deleteUser } = useMutation<
    void,
    Error,
    number,
    MutationContext
  >({
    mutationFn: (id: number) => usersApi.deleteUser(String(id)),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["user"] });

      const previousData = queryClient.getQueriesData({ queryKey: ["user"] });

      queryClient.setQueriesData({ queryKey: ["user"] }, (oldData: { data: User[] }) => {
        if (!oldData || !oldData.data) return oldData;

        return {
          ...oldData,
          data: oldData.data.filter((item: User) => item.id !== id),
        };
      });

      return { previousData };
    },
    onError: (err, _variables, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      console.error("Ошибка при удалении:", err.message);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });

  const getUserById = (id: number) =>
    users?.data?.find((u: { id: number }) => u.id === id);

  return { users, loading, addUser, deleteUser, getUserById };
}
