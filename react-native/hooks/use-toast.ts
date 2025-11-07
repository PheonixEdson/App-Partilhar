export const useToast = () => {
  return {
    toast: ({ title, description, variant }: { title: string; description: string; variant?: "destructive" | "default" }) => {
      console.log(`Toast: ${title} - ${description} (${variant})`);
    },
  };
};
