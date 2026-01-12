import api from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useFees(params = {}) {
  return useQuery({
    queryKey: ["fees", params],
    queryFn: async () => {
      const response = await api.get("/fees", { params });
      return response.data;
    },
  });
}

export function useCreateFee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post("/fees", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fees"] });
      queryClient.invalidateQueries({ queryKey: ["students", "overdue"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}

export function useDownloadInvoice() {
  return useMutation({
    mutationFn: async (id) => {
      const response = await api.get(`/fees/${id}/invoice/download`, {
        responseType: "blob",
      });
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `invoice_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    },
  });
}

export function useSendInvoiceWhatsApp() {
  return useMutation({
    mutationFn: async (id) => {
      const response = await api.post(`/fees/${id}/invoice/send`);
      return response.data;
    },
  });
}

export function useOverdueStudents(params = {}) {
  return useQuery({
    queryKey: ["students", "overdue", params],
    queryFn: async () => {
      const response = await api.get("/students/overdue", { params });
      return response.data;
    },
  });
}
