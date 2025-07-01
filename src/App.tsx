
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Experience from "./pages/Experience";
import Auth from "./pages/Auth";
import Search from "./pages/Search";
import OwnerProfile from "./pages/OwnerProfile";
import OwnerMyProfile from "./pages/OwnerMyProfile";
import OwnerOliveTrees from "./pages/OwnerOliveTrees";
import OwnerOliveTreeDetails from "./pages/OwnerOliveTreeDetails";
import OwnerEditOliveGrove from "./pages/OwnerEditOliveGrove";
import OwnerPlanHarvest from "./pages/OwnerPlanHarvest";
import OwnerAddOliveGrove from "./pages/OwnerAddOliveGrove";
import OwnerFindHarvesters from "./pages/OwnerFindHarvesters";
import OwnerPayments from "./pages/OwnerPayments";
import HarvesterProfile from "./pages/HarvesterProfile";
import HarvesterDashboard from "./pages/HarvesterDashboard";
import Messages from "./pages/Messages";
import Payment from "./pages/Payment";
import Evaluation from "./pages/Evaluation";
import Admin from "./pages/Admin";
import LanguageSelector from "./components/LanguageSelector";
import "./i18n/config";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <TooltipProvider>
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/experience" element={<Experience />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/search" element={<Search />} />
              <Route path="/owner-profile" element={<ProtectedRoute><OwnerProfile /></ProtectedRoute>} />
              <Route path="/owner-my-profile" element={<ProtectedRoute><OwnerMyProfile /></ProtectedRoute>} />
              <Route path="/owner-olive-trees" element={<ProtectedRoute><OwnerOliveTrees /></ProtectedRoute>} />
              <Route path="/owner-olive-tree-details" element={<ProtectedRoute><OwnerOliveTreeDetails /></ProtectedRoute>} />
              <Route path="/owner-edit-olive-grove" element={<ProtectedRoute><OwnerEditOliveGrove /></ProtectedRoute>} />
              <Route path="/owner-plan-harvest" element={<ProtectedRoute><OwnerPlanHarvest /></ProtectedRoute>} />
              <Route path="/owner-add-olive-grove" element={<ProtectedRoute><OwnerAddOliveGrove /></ProtectedRoute>} />
              <Route path="/owner-find-harvesters" element={<ProtectedRoute><OwnerFindHarvesters /></ProtectedRoute>} />
              <Route path="/owner-payments" element={<ProtectedRoute><OwnerPayments /></ProtectedRoute>} />
              <Route path="/harvester-profile" element={<ProtectedRoute><HarvesterProfile /></ProtectedRoute>} />
              <Route path="/harvester-dashboard" element={<ProtectedRoute><HarvesterDashboard /></ProtectedRoute>} />
              <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
              <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
              <Route path="/evaluation" element={<ProtectedRoute><Evaluation /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
            </Routes>
            <LanguageSelector />
            <Toaster />
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
