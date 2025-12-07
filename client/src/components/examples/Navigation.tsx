import { ThemeProvider } from "../ThemeProvider";
import { Navigation } from "../Navigation";

export default function NavigationExample() {
  return (
    <ThemeProvider>
      <Navigation />
      <div className="pt-20 px-4">
        <p className="text-muted-foreground">Navigation bar is fixed at the top.</p>
      </div>
    </ThemeProvider>
  );
}
