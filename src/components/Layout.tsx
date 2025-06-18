import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Users,
  UserPlus,
  GraduationCap,
  Apple,
  Package,
  LogOut,
  Dumbbell,
  Menu,
  X,
  Settings,
  Download,
  FileText,
} from "lucide-react";
import SyncStatusIndicator from "@/components/SyncStatusIndicator";
import ClearDataComponent from "@/components/ClearDataComponent";
import SupabaseStorageDiagnostics from "@/components/SupabaseStorageDiagnostics";
import RealTimeSyncMonitor from "@/components/RealTimeSyncMonitor";
import DataStorageVerification from "@/components/DataStorageVerification";
import MembersSupabaseTest from "@/components/MembersSupabaseTest";
import SyncErrorDebugger from "@/components/SyncErrorDebugger";
import SupabaseSchemaSync from "@/components/SupabaseSchemaSync";
import ForceSyncUtility from "@/components/ForceSyncUtility";
import ComprehensiveStorageDiagnostics from "@/components/ComprehensiveStorageDiagnostics";
import MemberGroupsStorageDiagnostics from "@/components/MemberGroupsStorageDiagnostics";
import MemberGroupsQuickFix from "@/components/MemberGroupsQuickFix";
import DebuggingPanel from "@/components/DebuggingPanel";
import EmergencyDataLossFix from "./EmergencyDataLossFix";
import MemberRelationshipsFix from "./MemberRelationshipsFix";
import CompleteMemberRelationshipsFix from "./CompleteMemberRelationshipsFix";
import EmergencyFPSRecovery from "./EmergencyFPSRecovery";
import InfiniteLoopMonitor from "./InfiniteLoopMonitor";
import EmergencyRecovery from "./EmergencyRecovery";
import SalesTableSyncFix from "./SalesTableSyncFix";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  logout,
  getMembers,
  getCourses,
  getDietPlans,
} from "@/lib/storage-new";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "الأعضاء", href: "/dashboard", icon: Users },
  { name: "إضافة عضو", href: "/dashboard/add-member-enhanced", icon: UserPlus },
  { name: "الكورسات", href: "/dashboard/courses", icon: GraduationCap },
  { name: "الأنظمة الغذائية", href: "/dashboard/diet-plans", icon: Apple },
  { name: "المخزون", href: "/dashboard/inventory", icon: Package },
];

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeComponent, setActiveComponent] = useState<string | null>(null);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return (
        location.pathname === "/dashboard" ||
        location.pathname === "/dashboard/members"
      );
    }
    return location.pathname === href;
  };

  const handleBackupDownload = async () => {
    try {
      const members = await getMembers();
      const courses = await getCourses();
      const dietPlans = await getDietPlans();

      const backup = {
        timestamp: new Date().toISOString(),
        members,
        courses,
        dietPlans,
      };

      const blob = new Blob([JSON.stringify(backup, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `gym-backup-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error creating backup:", error);
    }
  };

  const handleBackupPrint = () => {
    window.print();
  };

  const openDiagnostic = (componentName: string) => {
    setActiveComponent(componentName);
  };

  const closeDiagnostic = () => {
    setActiveComponent(null);
  };

  const renderDiagnosticComponent = () => {
    switch (activeComponent) {
      case "emergency-recovery":
        return <EmergencyRecovery />;
      case "infinite-loop-monitor":
        return <InfiniteLoopMonitor />;
      case "emergency-fps-recovery":
        return <EmergencyFPSRecovery />;
      case "emergency-data-loss-fix":
        return <EmergencyDataLossFix />;
      case "member-relationships-fix":
        return <MemberRelationshipsFix />;
      case "complete-member-relationships-fix":
        return <CompleteMemberRelationshipsFix />;
      case "sales-table-sync-fix":
        return <SalesTableSyncFix />;
      case "comprehensive-storage-diagnostics":
        return <ComprehensiveStorageDiagnostics />;
      case "member-groups-storage-diagnostics":
        return <MemberGroupsStorageDiagnostics />;
      case "member-groups-quick-fix":
        return <MemberGroupsQuickFix />;
      case "debugging-panel":
        return <DebuggingPanel />;
      case "supabase-storage-diagnostics":
        return <SupabaseStorageDiagnostics />;
      case "real-time-sync-monitor":
        return <RealTimeSyncMonitor />;
      case "data-storage-verification":
        return <DataStorageVerification />;
      case "members-supabase-test":
        return <MembersSupabaseTest />;
      case "sync-error-debugger":
        return <SyncErrorDebugger />;
      case "supabase-schema-sync":
        return <SupabaseSchemaSync />;
      case "force-sync-utility":
        return <ForceSyncUtility />;
      case "clear-data":
        return <ClearDataComponent />;
      default:
        return null;
    }
  };

  const getDialogTitle = () => {
    switch (activeComponent) {
      case "emergency-recovery":
        return "استرداد طارئ للموقع";
      case "infinite-loop-monitor":
        return "مراقب الحلقات اللا نهائية";
      case "emergency-fps-recovery":
        return "إصلاح طارئ لمشكلة 0 FPS";
      case "emergency-data-loss-fix":
        return "إصلاح فقدان البيانات";
      case "member-relationships-fix":
        return "إصلاح علاقات الأعضاء";
      case "complete-member-relationships-fix":
        return "إصلاح شامل للكورسات والأنظمة الغذائية";
      case "sales-table-sync-fix":
        return "إصلاح خطأ مزامنة المبيعات";
      case "comprehensive-storage-diagnostics":
        return "تشخيص التخزين الشامل";
      case "member-groups-storage-diagnostics":
        return "تشخيص مجموعات الأعضاء";
      case "member-groups-quick-fix":
        return "إصلاح سريع لمجموعات الأعضاء";
      case "debugging-panel":
        return "لوحة التشخيص";
      case "supabase-storage-diagnostics":
        return "تشخيص تخزين Supabase";
      case "real-time-sync-monitor":
        return "مراقب المزامنة الفورية";
      case "data-storage-verification":
        return "التحقق من تخزين البيانات";
      case "members-supabase-test":
        return "اختبار أعضاء Supabase";
      case "sync-error-debugger":
        return "مصحح أخطاء المزامنة";
      case "supabase-schema-sync":
        return "مزامنة مخطط Supabase";
      case "force-sync-utility":
        return "أداة المزامنة القسرية";
      case "clear-data":
        return "مسح البيانات";
      default:
        return "أداة التشخيص";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-l from-orange-500 to-amber-500 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Dumbbell className="h-8 w-8 text-white" />
              <h1 className="ml-3 text-xl font-bold text-white">
                نظام إدارة الجيم
              </h1>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8 space-x-reverse">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={() => navigate(item.href)}
                    className={cn(
                      "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive(item.href)
                        ? "bg-white/20 text-white"
                        : "text-white/80 hover:text-white hover:bg-white/10",
                    )}
                  >
                    <Icon className="h-4 w-4 ml-2" />
                    {item.name}
                  </button>
                );
              })}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4 space-x-reverse">
              <SyncStatusIndicator />

              {/* Settings Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                  >
                    <Settings className="h-4 w-4" />
                    الضبط
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuItem
                    onClick={() => openDiagnostic("emergency-recovery")}
                  >
                    🆘 استرداد طارئ للموقع (فوري)
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => openDiagnostic("infinite-loop-monitor")}
                  >
                    🚨 مراقب الحلقات اللا نهائية (عاجل)
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => openDiagnostic("emergency-fps-recovery")}
                  >
                    🚨 إصلاح طارئ 0 FPS (حرج)
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => openDiagnostic("emergency-data-loss-fix")}
                  >
                    🚨 إصلاح فقدان البيانات (أولوية)
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      openDiagnostic("complete-member-relationships-fix")
                    }
                  >
                    🔗 إصلاح شامل للكورسات والأنظمة الغذائية
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => openDiagnostic("sales-table-sync-fix")}
                  >
                    💰 إصلاح خطأ مزامنة المبيعات
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleBackupPrint}>
                    <FileText className="h-4 w-4 mr-2" />
                    طباعة النسخة الاحتياطية
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleBackupDownload}>
                    <Download className="h-4 w-4 mr-2" />
                    تنزيل نسخة احتياطية
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() =>
                      openDiagnostic("comprehensive-storage-diagnostics")
                    }
                  >
                    🔧 تشخيص التخزين ال��امل
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      openDiagnostic("member-groups-storage-diagnostics")
                    }
                  >
                    👥 تشخيص مجموعات الأعضاء
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => openDiagnostic("member-groups-quick-fix")}
                  >
                    ⚡ إصلاح سريع لمجموعات الأعضاء
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => openDiagnostic("debugging-panel")}
                  >
                    🐛 لوحة التشخيص
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() =>
                      openDiagnostic("supabase-storage-diagnostics")
                    }
                  >
                    📊 تشخيص تخزين Supabase
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => openDiagnostic("real-time-sync-monitor")}
                  >
                    🔄 مراقب المزامنة الفورية
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => openDiagnostic("data-storage-verification")}
                  >
                    ✅ التحقق من تخزين البيانات
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => openDiagnostic("members-supabase-test")}
                  >
                    🧪 اختبار أعضاء Supabase
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => openDiagnostic("sync-error-debugger")}
                  >
                    🔍 مصحح أخطاء المزامنة
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => openDiagnostic("supabase-schema-sync")}
                  >
                    🔗 مزامنة مخطط Supabase
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => openDiagnostic("force-sync-utility")}
                  >
                    💪 أداة المزامنة القسرية
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => openDiagnostic("clear-data")}
                  >
                    🗑️ مسح البيانات
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-white hover:bg-white/20"
              >
                <LogOut className="h-4 w-4 ml-2" />
                خروج
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white hover:bg-white/20"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.name}
                      variant="ghost"
                      className={cn(
                        "w-full justify-start gap-3",
                        isActive(item.href)
                          ? "bg-white/20 text-white"
                          : "text-white/80 hover:text-white hover:bg-white/10",
                      )}
                      onClick={() => {
                        navigate(item.href);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <Icon className="h-4 w-4" />
                      {item.name}
                    </Button>
                  );
                })}
                <div className="border-t border-white/20 my-2"></div>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-yellow-600 hover:bg-yellow-50"
                  onClick={() => {
                    openDiagnostic("emergency-data-loss-fix");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  🚨 إصلاح فقدان البيانات
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-blue-600 hover:bg-blue-50"
                  onClick={() => {
                    openDiagnostic("member-relationships-fix");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  🔗 إصلاح علاقات الأعضاء
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-blue-600 hover:bg-blue-50"
                  onClick={() => {
                    handleBackupDownload();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <Download className="h-4 w-4" />
                  تنزيل نسخة احتياطية
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-green-600 hover:bg-green-50"
                  onClick={() => {
                    handleBackupPrint();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <FileText className="h-4 w-4" />
                  طباعة النسخة الاحتياطية
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-red-600 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  خروج
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Diagnostic Component Modal */}
      <Dialog open={!!activeComponent} onOpenChange={closeDiagnostic}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{getDialogTitle()}</DialogTitle>
          </DialogHeader>
          {renderDiagnosticComponent()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
