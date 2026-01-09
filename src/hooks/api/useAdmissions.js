import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export function useAdmissions(params = {}) {
  return useQuery({
    queryKey: ["admissions", params],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (params.name) queryParams.append("name", params.name);
      if (params.contactNumber)
        queryParams.append("contactNumber", params.contactNumber);
      if (params.page) queryParams.append("page", params.page);
      if (params.limit) queryParams.append("limit", params.limit);

      const { data } = await api.get(`/admissions?${queryParams.toString()}`);
      return data;
    },
  });
}

export function useAdmission(id) {
  return useQuery({
    queryKey: ["admission", id],
    queryFn: async () => {
      const { data } = await api.get(`/admissions/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateAdmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (admissionData) => {
      const { data } = await api.post("/admissions", admissionData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admissions"] });
    },
  });
}

export function useUpdateAdmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...admissionData }) => {
      const { data } = await api.put(`/admissions/${id}`, admissionData);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admissions"] });
      queryClient.invalidateQueries({ queryKey: ["admission", variables.id] });
    },
  });
}

export function useDeleteAdmission() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const { data } = await api.delete(`/admissions/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admissions"] });
    },
  });
}
