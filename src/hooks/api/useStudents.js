import api from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useStudents(params = {}) {
  return useQuery({
    queryKey: ["students", params],
    queryFn: async () => {
      const response = await api.get("/students", { params });
      return response.data;
    },
  });
}

export function useStudent(id) {
  return useQuery({
    queryKey: ["student", id],
    queryFn: async () => {
      const response = await api.get(`/students/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
}

export function useCreateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post("/students", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
}

export function useUpdateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await api.put(`/students/${id}`, data);
      return response.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["student", variables.id] });
    },
  });
}

export function useDeleteStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/students/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
}

export function useSearchStudents(query) {
  return useQuery({
    queryKey: ["students", "search", query],
    queryFn: async () => {
      const response = await api.get(
        `/students/search?q=${encodeURIComponent(query)}`
      );
      return response.data;
    },
    enabled: query?.length >= 2,
    staleTime: 1000 * 60, // 1 minute
  });
}
