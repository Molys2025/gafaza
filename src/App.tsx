
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import Navbar from "./components/Navbar";
import Index from "./pages/Index";
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
import Messages from "./pages/Messages";
import Payment from "./pages/Payment";
import Evaluation from "./pages/Evaluation";
import LanguageToggle from "./components/LanguageToggle";
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
              <Route path="/search" element={<Search />} />
              <Route path="/owner-profile" element={<OwnerProfile />} />
              <Route path="/owner-my-profile" element={<OwnerMyProfile />} />
              <Route path="/owner-olive-trees" element={<OwnerOliveTrees />} />
              <Route path="/owner-olive-tree-details" element={<OwnerOliveTreeDetails />} />
              <Route path="/owner-edit-olive-grove" element={<OwnerEditOliveGrove />} />
              <Route path="/owner-plan-harvest" element={<OwnerPlanHarvest />} />
              <Route path="/owner-add-olive-grove" element={<OwnerAddOliveGrove />} />
              <Route path="/owner-find-harvesters" element={<OwnerFindHarvesters />} />
              <Route path="/owner-payments" element={<OwnerPayments />} />
              <Route path="/harvester-profile" element={<HarvesterProfile />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/evaluation" element={<Evaluation />} />
            </Routes>
            <LanguageToggle />
            <Toaster />
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
