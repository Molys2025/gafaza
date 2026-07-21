
import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Loader2 } from "lucide-react";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import LanguageSelector from "./components/LanguageSelector";
import "./i18n/config";

// The landing and auth pages are on the critical path, so they stay in the
// main bundle. Everything else is code-split: mapbox, recharts and the whole
// admin back-office used to ship to every first-time visitor.
import Index from "./pages/Index";
import Auth from "./pages/Auth";

const Experience = lazy(() => import("./pages/Experience"));
const Search = lazy(() => import("./pages/Search"));
const Jobs = lazy(() => import("./pages/Jobs"));
const JobDetail = lazy(() => import("./pages/JobDetail"));
const MyApplications = lazy(() => import("./pages/MyApplications"));
const OwnerJobApplications = lazy(() => import("./pages/OwnerJobApplications"));
const OwnerFindHarvesters = lazy(() => import("./pages/OwnerFindHarvesters"));
const HarvesterProfile = lazy(() => import("./pages/HarvesterProfile"));
const HarvesterPublicProfile = lazy(() => import("./pages/HarvesterPublicProfile"));
const HarvesterDashboard = lazy(() => import("./pages/HarvesterDashboard"));
const Messages = lazy(() => import("./pages/Messages"));
const Admin = lazy(() => import("./pages/Admin"));
const Account = lazy(() => import("./pages/Account"));
const OwnerPublicProfile = lazy(() => import("./pages/OwnerPublicProfile"));
const OwnerJobs = lazy(() => import("./pages/OwnerJobs"));
const Support = lazy(() => import("./pages/Support"));

const queryClient = new QueryClient();

const RouteFallback = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-olive" />
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <TooltipProvider>
          <BrowserRouter>
            <Navbar />
            <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/experience" element={<Experience />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/search" element={<Search />} />
              <Route path="/jobs" element={<Jobs />} />
              <Route path="/jobs/:id" element={<JobDetail />} />
              <Route path="/my-applications" element={<ProtectedRoute requiredRole="job_seeker"><MyApplications /></ProtectedRoute>} />
              <Route path="/owner-jobs" element={<ProtectedRoute requiredRole="work_provider"><OwnerJobs /></ProtectedRoute>} />
              <Route path="/owner-jobs/:id/applications" element={<ProtectedRoute requiredRole="work_provider"><OwnerJobApplications /></ProtectedRoute>} />
              <Route path="/owner-find-harvesters" element={<ProtectedRoute><OwnerFindHarvesters /></ProtectedRoute>} />
              <Route path="/harvester-profile" element={<ProtectedRoute><HarvesterProfile /></ProtectedRoute>} />
              <Route path="/harvester/:id" element={<HarvesterPublicProfile />} />
              <Route path="/owner/:id" element={<OwnerPublicProfile />} />
              <Route path="/harvester-dashboard" element={<ProtectedRoute><HarvesterDashboard /></ProtectedRoute>} />
              <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute requiredRole="admin" requiresProfile={false}><Admin /></ProtectedRoute>} />
              <Route path="/account" element={<ProtectedRoute requiresProfile={false}><Account /></ProtectedRoute>} />
              <Route path="/support" element={<ProtectedRoute requiresProfile={false}><Support /></ProtectedRoute>} />
              <Route path="*" element={<Index />} />
            </Routes>
            </Suspense>
            <LanguageSelector />
            <Toaster />
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
