import api from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useCourses() {
  return useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const response = await api.get("/courses");
      return response.data.data;
    },
  });
}

export function useShortCourses() {
  return useQuery({
    queryKey: ["shortCourses"],
    queryFn: async () => {
      const response = await api.get("/courses/short");
      return response.data.data;
    },
  });
}

export function useCourse(id) {
  return useQuery({
    queryKey: ["course", id],
    queryFn: async () => {
      const response = await api.get(`/courses/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
}

export function useShortCourse(id) {
  return useQuery({
    queryKey: ["shortCourse", id],
    queryFn: async () => {
      const response = await api.get(`/courses/short/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
}

export function useCreateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (courseData) => {
      const response = await api.post("/courses", courseData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
}

export function useCreateShortCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (courseData) => {
      const response = await api.post("/courses/short", courseData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shortCourses"] });
    },
  });
}

export function useUpdateCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...courseData }) => {
      const response = await api.put(`/courses/${id}`, courseData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
}

export function useUpdateShortCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...courseData }) => {
      const response = await api.put(`/courses/short/${id}`, courseData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shortCourses"] });
    },
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await api.delete(`/courses/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
}
