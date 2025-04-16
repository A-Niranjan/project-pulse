
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import NewTask from "./pages/NewTask";
import NotFound from "./pages/NotFound";
import NotesPage from "./pages/NotesPage";
import GoalsPage from "./pages/GoalsPage";
import ActivityPage from "./pages/ActivityPage";
import AgendaPage from "./pages/AgendaPage";
import MentionsPage from "./pages/MentionsPage";
import StatisticsPage from "./pages/StatisticsPage";
import SettingsPage from "./pages/SettingsPage";
import DribbblePage from "./pages/DribbblePage";
import BehancePage from "./pages/BehancePage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// AuthWrapper component to handle auth state and redirects
const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem("user");
      const authenticated = !!user;
      setIsAuthenticated(authenticated);
      setIsInitialized(true);
      
      // Redirect logic
      if (!authenticated && !location.pathname.includes('/login')) {
        navigate('/login', { replace: true });
      } else if (authenticated && location.pathname === '/login') {
        navigate('/dashboard', { replace: true });
      }
    };
    
    checkAuth();
    
    // Listen for storage changes (for when user logs in/out in another tab)
    window.addEventListener("storage", checkAuth);
    
    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, [navigate, location.pathname]);
  
  // Show loading state until we've checked authentication
  if (!isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center bg-projector-ivory">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 border-4 border-t-transparent border-projector-darkblue rounded-full animate-spin mb-4"></div>
          <p className="text-projector-darkblue font-medium">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If we're on the login page, or authentication is confirmed, show the children
  return <>{children}</>;
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthWrapper>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/new-task" element={<NewTask />} />
              <Route path="/notes" element={<NotesPage />} />
              <Route path="/goals" element={<GoalsPage />} />
              <Route path="/activity" element={<ActivityPage />} />
              <Route path="/agenda" element={<AgendaPage />} />
              <Route path="/mentions" element={<MentionsPage />} />
              <Route path="/statistics" element={<StatisticsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/dribbble" element={<DribbblePage />} />
              <Route path="/behance" element={<BehancePage />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthWrapper>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
