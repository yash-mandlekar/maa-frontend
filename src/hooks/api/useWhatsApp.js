import api from "@/lib/api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useWhatsAppStatus() {
  return useQuery({
    queryKey: ["whatsapp", "status"],
    queryFn: async () => {
      const response = await api.get("/whatsapp/status");
      return response.data;
    },
    refetchInterval: 3000, // Poll every 3 seconds
    refetchIntervalInBackground: false,
  });
}

export function useRestartWhatsApp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.post("/whatsapp/restart");
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["whatsapp"] });
    },
  });
}
