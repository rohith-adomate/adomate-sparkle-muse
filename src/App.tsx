import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SaveIndicatorProvider } from "@/contexts/SaveIndicatorContext";
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
import ConceptsRunDetail from "./pages/ConceptsRunDetail";
import Studio from "./pages/Studio";
import Content from "./pages/Content";
import CalendarPage from "./pages/CalendarPage";
import Performance from "./pages/Performance";
import Workflows from "./pages/Workflows";
import WorkflowCanvas from "./pages/WorkflowCanvas";
import Settings from "./pages/Settings";
import NotificationsSpec from "./pages/NotificationsSpec";
import NotFound from "./pages/NotFound";
import Credits from "./pages/Credits";
import OnboardingPage from "./pages/OnboardingPage";
import AdminHome from "./pages/admin/AdminHome";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAdmins from "./pages/admin/AdminAdmins";
import AdminCredits from "./pages/admin/AdminCredits";
import AdminSystemSettings from "./pages/admin/AdminSystemSettings";
import AdminUsersOverview from "./pages/admin/AdminUsersOverview";
import AdminOnboardingQA from "./pages/admin/AdminOnboardingQA";
import AdminCompanies from "./pages/admin/AdminCompanies";
import AdminPlaceholder from "./pages/admin/AdminPlaceholder";
import UIVariationsV2 from "./pages/UIVariationsV2";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SaveIndicatorProvider>
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
            <Route path="/concepts/:runId" element={<ConceptsRunDetail />} />
            <Route path="/studio" element={<Studio />} />
            <Route path="/content" element={<Content />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/performance" element={<Performance />} />
            <Route path="/workflows" element={<Workflows />} />
            <Route path="/workflows/:id" element={<WorkflowCanvas />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/notifications-spec" element={<NotificationsSpec />} />
            <Route path="/credits" element={<Credits />} />
            
          </Route>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminHome />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/admins" element={<AdminAdmins />} />
            <Route path="/admin/credits" element={<AdminCredits />} />
            <Route path="/admin/system-settings" element={<AdminSystemSettings />} />
            <Route path="/admin/dashboards/users" element={<AdminUsersOverview />} />
            <Route path="/admin/dashboards/companies" element={<AdminCompanies />} />
            <Route path="/admin/dashboards/onboarding-qa" element={<AdminOnboardingQA />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </SaveIndicatorProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
