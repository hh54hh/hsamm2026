import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Dumbbell, Apple, ChefHat, Sparkles } from "lucide-react";
import EmergencySyncFix from "@/components/EmergencySyncFix";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full">
              <Dumbbell className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              نظام إدارة النادي الرياضي
            </h1>
            <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full">
              <ChefHat className="h-8 w-8 text-white" />
            </div>
          </div>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            نظام شامل لإدارة النادي الرياضي مع نظام ذكي لاقتراح الأنظمة الغذائية
            المخصصة
          </p>

          <Button
            size="lg"
            onClick={() => navigate("/dashboard")}
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-lg px-8 py-4 h-auto"
          >
            <Sparkles className="h-5 w-5 mr-2" />
            دخول النظام
          </Button>
        </div>

        {/* Emergency Sync Fix */}
        <div className="max-w-2xl mx-auto mt-8">
          <EmergencySyncFix />
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="bg-white/70 backdrop-blur-sm border-orange-200 hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-8 text-center">
              <div className="p-4 bg-blue-100 rounded-full w-fit mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                إدارة الأعضاء
              </h3>
              <p className="text-gray-600">
                تتبع جميع بيانات الأعضاء، الاشتراكات، الكورسات، والأنظمة
                الغذائية بسهولة
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-orange-200 hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-8 text-center">
              <div className="p-4 bg-green-100 rounded-full w-fit mx-auto mb-4">
                <Apple className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                النظام الغذائي الذكي
              </h3>
              <p className="text-gray-600">
                حساب السعرات الحرا��ية وا��تراح ��نظمة ��ذائية مخصصة لك�� عضو
                حسب أهدافه
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-orange-200 hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-8 text-center">
              <div className="p-4 bg-purple-100 rounded-full w-fit mx-auto mb-4">
                <Dumbbell className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                إدارة الكورسات والمخزون
              </h3>
              <p className="text-gray-600">
                تنظيم الكورسات التدريبية، إدارة المخزون والمبيعات بنظام متكامل
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <div className="flex items-center justify-center gap-2 text-gray-600 mb-4">
            <ChefHat className="h-5 w-5 text-orange-500" />
            <span>مدعوم بالذكاء الاصطناعي</span>
            <Sparkles className="h-5 w-5 text-amber-500 animate-pulse" />
          </div>
          <p className="text-gray-600">
            ابدأ الآن في إدارة نادي أكثر تطوراً وذكاءً
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
