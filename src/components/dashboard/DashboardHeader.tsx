import { UserCircle, Bell, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User as UserIcon, UserPlus, Key, LogOut } from 'lucide-react';
import { User, GlobalSettings } from '@/lib/store';

interface HeaderProps {
  currentUser: User | null;
  settings: GlobalSettings | null;
  adminClickCount: number;
  setAdminClickCount: (val: number | ((prev: number) => number)) => void;
  setProfileOpen: (val: boolean) => void;
  setCreateEmpOpen: (val: boolean) => void;
  setChangePassOpen: (val: boolean) => void;
  setAffiliateOpen: (val: boolean) => void;
  setMySettingsOpen: (val: boolean) => void;
  handleLogout: () => void;
  hideEarnings: boolean;
}

export const DashboardHeader = ({ 
  currentUser, settings, adminClickCount, setAdminClickCount,
  setProfileOpen, setCreateEmpOpen, setChangePassOpen, setAffiliateOpen,
  setMySettingsOpen, handleLogout, hideEarnings
}: HeaderProps) => {
  return (
    <header className="mb-8 flex items-center justify-between">
      <div>
        <h1 
          className="text-2xl sm:text-4xl font-black text-gray-800 mb-1 text-shadow select-none cursor-default active:scale-95 transition-transform"
          onClick={() => setAdminClickCount(prev => prev + 1)}
        >
          {settings?.siteTitle || 'مان هويات لمكاتب الخدمات'}
        </h1>
        <p className="text-gray-500 font-medium text-sm sm:text-base">
          لوحة التحكم الرئيسية <span className="text-red-600 text-xs font-bold mr-1">v. 1</span>
        </p>
      </div>
      
      <div className="flex gap-3 items-center">
        {currentUser && (
            <DropdownMenu>
              <DropdownMenuTrigger className="outline-none">
                <div className="flex flex-col items-center justify-center mr-2 cursor-pointer group">
                    <button 
                        onClick={(e) => { e.stopPropagation(); setAffiliateOpen(true); }}
                        className="bg-green-50 text-green-600 rounded-2xl px-3 py-2 mb-2 flex flex-col items-center justify-center shadow-sm border border-green-100 hover:bg-green-100 transition-colors select-none"
                    >
                        <span className="text-[10px] font-bold">أرباحك:</span>
                        <span className="text-xs font-black">
                            {hideEarnings ? '****' : (currentUser.affiliateBalance || 0)} ريال
                        </span>
                    </button>
                    <div className="relative w-10 h-10 rounded-full bg-blue-100 shadow-3d flex items-center justify-center text-blue-600 mb-1 group-hover:scale-105 transition-transform border border-blue-200">
                        <UserCircle className="w-6 h-6" />
                        {currentUser.role === 'golden' && (
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white animate-blink-slow"></span>
                        )}
                    </div>
                    <div className="text-center leading-3 mt-1 max-w-[150px]">
                        <span className="block text-[10px] font-bold text-gray-600">مرحبا</span>
                        <span className="block text-[10px] font-bold text-red-600 break-words whitespace-normal">{currentUser.officeName}</span>
                    </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-[#eef2f6] shadow-3d border-none rounded-xl" align="end" dir="rtl">
                <DropdownMenuLabel className="text-center font-bold text-gray-700">{currentUser.officeName}</DropdownMenuLabel>
                <div className="text-center">
                    <span className={`text-xs font-bold ${currentUser.role === 'golden' ? 'text-yellow-700' : 'text-blue-600'}`}>
                        {currentUser.role === 'golden' ? 'عضو ذهبي' : currentUser.role === 'employee' ? 'موظف' : 'عضو'}
                    </span>
                    {currentUser.role === 'golden' && currentUser.subscriptionExpiry && (
                        <span className="block text-[10px] text-yellow-700 font-bold mt-1">
                            ينتهي اشتراكك في : {new Date(currentUser.subscriptionExpiry).toLocaleDateString('ar-SA')}
                        </span>
                    )}
                </div>
                <DropdownMenuSeparator className="bg-gray-200" />
                <DropdownMenuItem className="cursor-pointer focus:bg-white focus:text-blue-600 rounded-lg my-1 gap-2" onClick={() => setProfileOpen(true)}>
                    <UserIcon className="w-4 h-4" /> <span>الملف الشخصي</span>
                </DropdownMenuItem>
                {currentUser.role === 'golden' && (
                    <DropdownMenuItem className="cursor-pointer focus:bg-white focus:text-blue-600 rounded-lg my-1 gap-2" onClick={() => setCreateEmpOpen(true)}>
                        <UserPlus className="w-4 h-4" /> <span>إصدار عضوية موظف</span>
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem className="cursor-pointer focus:bg-white focus:text-blue-600 rounded-lg my-1 gap-2" onClick={() => setChangePassOpen(true)}>
                    <Key className="w-4 h-4" /> <span>تغيير كلمة المرور</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-200" />
                <DropdownMenuItem className="cursor-pointer focus:bg-red-50 focus:text-red-600 text-red-500 rounded-lg my-1 gap-2" onClick={handleLogout}>
                    <LogOut className="w-4 h-4" /> <span>تسجيل الخروج</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        )}
        
        <div className="flex gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="p-3 rounded-full bg-[#eef2f6] shadow-3d hover:shadow-3d-hover active:shadow-3d-active text-gray-600 transition-all relative">
                        <Bell className="w-6 h-6" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 bg-white shadow-xl border-none rounded-xl" dir="rtl">
                    <DropdownMenuLabel className="text-right">الإشعارات</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="p-4 text-center text-gray-500 text-sm">لا توجد إشعارات جديدة</div>
                </DropdownMenuContent>
            </DropdownMenu>

            <button 
                onClick={() => setMySettingsOpen(true)}
                className="p-3 rounded-full bg-[#eef2f6] shadow-3d hover:shadow-3d-hover active:shadow-3d-active text-gray-600 transition-all"
            >
                <Settings className="w-6 h-6" />
            </button>
        </div>
      </div>
    </header>
  );
};
