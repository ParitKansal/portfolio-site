import { ThemeProvider } from "../ThemeProvider";
import { BlogSection } from "../BlogSection";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function BlogSectionExample() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <BlogSection />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
