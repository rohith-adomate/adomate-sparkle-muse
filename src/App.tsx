import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { AdminLayout } from "@/components/layout/AdminLayout";
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
import Credits from "./pages/Credits";
import OnboardingPage from "./pages/OnboardingPage";
import AdminHome from "./pages/admin/AdminHome";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAdmins from "./pages/admin/AdminAdmins";
import AdminPlaceholder from "./pages/admin/AdminPlaceholder";

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
            <Route path="/brand-data-room/competitors" element={<Competitors />} />
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
            <Route path="/credits" element={<Credits />} />
          </Route>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminHome />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/admins" element={<AdminAdmins />} />
            <Route path="/admin/credits" element={<AdminPlaceholder title="Credits" />} />
            <Route path="/admin/credits" element={<AdminPlaceholder title="Credits" />} />
            <Route path="/admin/system-settings" element={<AdminPlaceholder title="System Settings" />} />
            <Route path="/admin/dashboards/users" element={<AdminPlaceholder title="Users Overview" />} />
            <Route path="/admin/dashboards/companies" element={<AdminPlaceholder title="Companies & Brands" />} />
            <Route path="/admin/dashboards/onboarding-qa" element={<AdminPlaceholder title="Onboarding QA" />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
