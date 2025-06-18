import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import "./styles/print.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

// Pages
import Login from "./pages/Login";
import Subscribers from "./pages/Subscribers";
import AddSubscriber from "./pages/AddSubscriber";
import Courses from "./pages/Courses";
import DietPlans from "./pages/DietPlans";
import NotFound from "./pages/NotFound";

// Components
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Utils
import { getAuthState } from "@/lib/auth-new";
import {
  checkDatabaseInitialization,
  initializeDatabaseWithSampleData,
} from "@/lib/database-init";

// Loading component
const AppLoading = () => (
  <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto"></div>
      <h2 className="text-xl font-semibold text-gray-900">
        جاري تحميل النظام...
      </h2>
      <p className="text-gray-600">يرجى الانتظار قليلاً</p>
    </div>
  </div>
);

const queryClient = new QueryClient();

const App = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [authState, setAuthState] = useState<{
    isAuthenticated: boolean;
  } | null>(null);
  const [dbError, setDbError] = useState<string | null>(null);

  const initializeApp = async () => {
    try {
      // Check database initialization
      const dbStatus = await checkDatabaseInitialization();
      if (!dbStatus.isInitialized) {
        console.warn(
          "Database not properly initialized:",
          dbStatus.missingTables,
        );
        setDbError(
          `قاعدة البيانات غير مهيأة. الجداول المفقودة: ${dbStatus.missingTables.join(", ")}. يرجى تشغيل ملف gym-management-new-schema.sql في Supabase.`,
        );
      } else {
        // Initialize with sample data if needed
        await initializeDatabaseWithSampleData();
        setDbError(null);
      }

      // Get auth state
      const auth = getAuthState();
      setAuthState(auth);
      setIsInitialized(true);
    } catch (error) {
      console.error("App initialization failed:", error);
      setDbError(
        error instanceof Error ? error.message : "خطأ في تهيئة النظام",
      );
      // Set default state in case of error
      setAuthState({ isAuthenticated: false });
      setIsInitialized(true);
    }
  };

  useEffect(() => {
    initializeApp();
  }, []);

  // Show loading while initializing
  if (!isInitialized || !authState) {
    return <AppLoading />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Redirect root to appropriate page based on auth */}
            <Route
              path="/"
              element={
                authState.isAuthenticated ? (
                  <Navigate to="/dashboard/subscribers" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* Login page */}
            <Route path="/login" element={<Login />} />

            {/* Protected dashboard routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              {/* Default dashboard route goes to subscribers */}
              <Route index element={<Navigate to="subscribers" replace />} />
              <Route path="subscribers" element={<Subscribers />} />
              <Route path="add-subscriber" element={<AddSubscriber />} />
              <Route path="courses" element={<Courses />} />
              <Route path="diet-plans" element={<DietPlans />} />
            </Route>

            {/* Catch all for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
