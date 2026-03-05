import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Home from "./pages/Home";
import BrandDataRoom from "./pages/BrandDataRoom";
import BrandKnowledge from "./pages/BrandKnowledge";
import Products from "./pages/Products";
import Personas from "./pages/Personas";
import MetaIntegration from "./pages/MetaIntegration";
import Competitors from "./pages/Competitors";
import Campaigns from "./pages/Campaigns";
import CampaignDetail from "./pages/CampaignDetail";
import Concepts from "./pages/Concepts";
import Studio from "./pages/Studio";
import Content from "./pages/Content";
import CalendarPage from "./pages/CalendarPage";
import Performance from "./pages/Performance";
import Workflows from "./pages/Workflows";
import Settings from "./pages/Settings";
import NotificationsSpec from "./pages/NotificationsSpec";
import NotFound from "./pages/NotFound";
import OnboardingPage from "./pages/OnboardingPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route element={<AppLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/brand-data-room" element={<BrandDataRoom />} />
            <Route path="/brand-data-room/knowledge" element={<BrandKnowledge />} />
            <Route path="/brand-data-room/products" element={<Products />} />
            <Route path="/brand-data-room/personas" element={<Personas />} />
            <Route path="/brand-data-room/meta" element={<MetaIntegration />} />
            <Route path="/brand-data-room/keywords" element={<CustomKeywords />} />
            <Route path="/campaigns" element={<Workflows />} />
            <Route path="/campaigns/:id" element={<Workflows />} />
            <Route path="/concepts" element={<Concepts />} />
            <Route path="/studio" element={<Studio />} />
            <Route path="/content" element={<Content />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/performance" element={<Performance />} />
            <Route path="/workflows" element={<Workflows />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/notifications-spec" element={<NotificationsSpec />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
