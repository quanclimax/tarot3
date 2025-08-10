import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DrawCards from "./pages/DrawCards";
import InterpretCards from "./pages/InterpretCards";
import CardLibrary from "./pages/CardLibrary";
import NotFound from "./pages/NotFound";
import BackgroundWrapper from "./components/BackgroundWrapper";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  return (
    <BackgroundWrapper>
      <div className="min-h-screen bg-background/50 text-foreground">
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<DrawCards />} />
                <Route path="/interpret" element={<InterpretCards />} />
                <Route path="/cards" element={<CardLibrary />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </div>
    </BackgroundWrapper>
  );
};

export default App;
