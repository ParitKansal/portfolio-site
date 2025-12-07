import { ThemeProvider } from "../ThemeProvider";
import { KnowledgeVaultSection } from "../KnowledgeVaultSection";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function KnowledgeVaultSectionExample() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <KnowledgeVaultSection />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
