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
import Inventory from "./pages/Inventory";
import SystemDiagnostics from "./pages/SystemDiagnostics";
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

// Database error component
const DatabaseError = ({ error }: { error: string }) => (
  <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
    <div className="text-center space-y-6 max-w-2xl">
      <div className="text-red-500 text-6xl">⚠️</div>
      <h2 className="text-2xl font-bold text-gray-900">
        خطأ في إعداد قاعدة البيانات
      </h2>
      <div className="bg-white p-6 rounded-lg border border-red-200 text-right">
        <p className="text-red-700 mb-4">{error}</p>
        <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700">
          <h3 className="font-semibold mb-2">خطوات الحل:</h3>
          <ol className="list-decimal list-inside space-y-1">
            <li>انتقل إلى لوحة تحكم Supabase</li>
            <li>اذهب إلى قسم SQL Editor</li>
            <li>انسخ والصق محتوى ملف gym-management-new-schema.sql</li>
            <li>اضغط Run لتنفيذ الاستعلام</li>
            <li>أعد تحميل الصفحة</li>
          </ol>
        </div>
      </div>
      <button
        onClick={() => window.location.reload()}
        className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
      >
        إعادة تحميل الصفحة
      </button>
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

  // Show database error if database is not properly set up
  if (dbError) {
    return <DatabaseError error={dbError} />;
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
              <Route path="inventory" element={<Inventory />} />
              <Route path="diagnostics" element={<SystemDiagnostics />} />
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
