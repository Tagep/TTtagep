import { useEffect, useState } from 'react';
import { 
  FileText, Wallet, BarChart3, Users, UserCheck, Settings, Bell, LogOut, 
  Trophy, Menu, Award, LogIn, Receipt, Calculator, Activity, Clock, CheckCircle2,
  Search, Database, Trash2, AlertTriangle, Download, Upload, Crown, Mail, Phone, Lock, UserPlus, UserCircle, User as UserIcon, Key, X, Check, Shield, Sliders, Volume2, VolumeX,
  Building2, Pencil, Loader2, ArrowLeft, ArrowRight, Copy, Coins, Eye, EyeOff, Smartphone, MessageCircle, RefreshCw, Info, Headset, Share2
} from 'lucide-react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { DashboardButton } from '@/components/DashboardButton';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { 
  getStoredTransactions, 
  calculateAchievers, 
  createBackup, 
  restoreBackup, 
  Transaction,
  getCurrentUser,
  logoutUser,
  User,
  changePassword,
  updateUserProfile,
  getLastBackupTime,
  fetchTransactionsFromCloud,
  getGlobalSettings,
  fetchGlobalSettingsFromCloud,
  GlobalSettings,
  createEmployee,
  createSubscriptionRequest,
  createWithdrawalRequest,
  deleteAllAgents,
  deleteAllClients,
  deleteAllTransactions,
  deleteAllExpenses,
  deleteAllTransfers,
  deleteAllRefunds,
  isEmployeeRestricted
} from '@/lib/store';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const securityQuestions = [
  "اين ولدت والدتك؟",
  "ماهو اقرب صديق لك؟",
  "متي تزوجت؟",
  "ماهي الهواية المفضله؟",
  "مدينة في السعوديه اقرب لقلبك؟",
  "ما وجبتك المفضلة؟"
];

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [achievers, setAchievers] = useState<{name: string, count: number, total: number}[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<GlobalSettings | null>(null);
  // Admin Secret Click State
  const [adminClickCount, setAdminClickCount] = useState(0);
  // Settings State
  const [soundEnabled, setSoundEnabled] = useState(localStorage.getItem('moaqeb_sound_enabled') !== 'false');
  const [hideEarnings, setHideEarnings] = useState(localStorage.getItem('moaqeb_hide_earnings') === 'true');
  const [mySettingsOpen, setMySettingsOpen] = useState(false);
  const [tickerIndex, setTickerIndex] = useState(0);
  const [tickerStats, setTickerStats] = useState({ active: 0, inProgress: 0, completedWeek: 0 });
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [inquiryId, setInquiryId] = useState('');
  const [foundTx, setFoundTx] = useState<Transaction | null>(null);
  const [inquiryError, setInquiryError] = useState('');
  const [backupOpen, setBackupOpen] = useState(false);
  const [restoreText, setRestoreText] = useState('');
  const [lastBackup, setLastBackup] = useState<string | null>(null);
  // About App State
  const [aboutOpen, setAboutOpen] = useState(false);
  // System Reset State
  const [resetOpen, setResetOpen] = useState(false);
  const [resetStep, setResetStep] = useState<'menu' | 'confirm1' | 'confirm2'>('menu');
  const [resetAction, setResetAction] = useState<string | null>(null);
  const [resetLoading, setResetLoading] = useState(false);
  const [proOpen, setProOpen] = useState(false);
  const [subStep, setSubStep] = useState<'duration' | 'bank' | 'confirm'>('duration');
  const [selectedBank, setSelectedBank] = useState('');
  const [selectedDuration, setSelectedDuration] = useState<'شهر' | 'سنة' | ''>('');
  const [senderName, setSenderName] = useState('');
  const [subSuccess, setSubSuccess] = useState('');
  const [alreadySubscribed, setAlreadySubscribed] = useState(false);
  // Employee Creation
  const [createEmpOpen, setCreateEmpOpen] = useState(false);
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpPass, setNewEmpPass] = useState('');
  const [showEmpPass, setShowEmpPass] = useState(false); // Toggle Eye
  const [empSuccess, setEmpSuccess] = useState('');
  const [empError, setEmpError] = useState('');
  // Profile
  const [profileOpen, setProfileOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editOfficeName, setEditOfficeName] = useState('');
  const [editSecurityQuestion, setEditSecurityQuestion] = useState('');
  const [editSecurityAnswer, setEditSecurityAnswer] = useState('');
  const [verifyOldPass, setVerifyOldPass] = useState('');
  const [showVerifyPass, setShowVerifyPass] = useState(false); // Toggle Eye
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  // Change Password
  const [changePassOpen, setChangePassOpen] = useState(false);
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showOldPass, setShowOldPass] = useState(false); // Toggle Eye
  const [showNewPass, setShowNewPass] = useState(false); // Toggle Eye
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  // Affiliate State
  const [affiliateOpen, setAffiliateOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [rajhiAccount, setRajhiAccount] = useState('');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);
  const [withdrawError, setWithdrawError] = useState('');

  useEffect(() => {
    // Initial Load
    fetchGlobalSettingsFromCloud().then(setSettings);
    const user = getCurrentUser();
    setCurrentUser(user);
    if (user && user.role === 'golden') {
        const hasSeen = localStorage.getItem(`moaqeb_onboarding_seen_${user.id}`);
        if (!hasSeen) {
            setOnboardingOpen(true);
        }
    }
    const loadData = async () => {
        let txs: Transaction[] = [];
        if (user) {
            const targetId = user.role === 'employee' && user.parentId ? user.parentId : user.id;
            txs = await fetchTransactionsFromCloud(targetId);
        } else {
            txs = getStoredTransactions();
        }
        setTransactions(txs);
        setAchievers(calculateAchievers(txs));
        const now = Date.now();
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        const active = txs.filter(t => t.status === 'active').length;
        const inProgress = txs.filter(t => t.status === 'active' && t.targetDate > now).length;
        const completedWeek = txs.filter(t => t.status === 'completed' && t.createdAt >= startOfWeek.getTime()).length;
        setTickerStats({ active, inProgress, completedWeek });
    };
    loadData();
    setLastBackup(getLastBackupTime());
    const interval = setInterval(() => {
      setTickerIndex(prev => (prev + 1) % 3);
    }, 4000);
    return () => {
        clearInterval(interval);
    };
  }, []);

  // Realtime Settings Subscription
  useEffect(() => {
      const channel = supabase
        .channel('dashboard-settings-realtime')
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'app_settings', filter: 'id=eq.1' },
          (payload) => {
              if (payload.new && payload.new.settings) {
                  setSettings(prev => ({ ...prev, ...payload.new.settings }));
              }
          }
        )
        .subscribe();
      return () => { supabase.removeChannel(channel); };
  }, []);

  // Admin Click Logic
  useEffect(() => {
    if (adminClickCount >= 3) {
        navigate('/admins');
        setAdminClickCount(0);
    }
    const timer = setTimeout(() => {
        if (adminClickCount > 0) setAdminClickCount(0);
    }, 2000);
    return () => clearTimeout(timer);
  }, [adminClickCount, navigate]);

  // Realtime subscription for User Balance Updates
  useEffect(() => {
      if (!currentUser) return;
      const channel = supabase
        .channel('user-balance-realtime')
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'users',
            filter: `id=eq.${currentUser.id}`
          },
          (payload) => {
            if (payload.new) {
                const newBalance = Number(payload.new.affiliate_balance) || 0;
                setCurrentUser(prev => prev ? { ...prev, affiliateBalance: newBalance } : null);
                const stored = localStorage.getItem('moaqeb_current_user_v1');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    parsed.affiliateBalance = newBalance;
                    localStorage.setItem('moaqeb_current_user_v1', JSON.stringify(parsed));
                }
            }
          }
        )
        .subscribe();
      return () => {
        supabase.removeChannel(channel);
      };
  }, [currentUser?.id]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('openPro') === 'true') {
        setSubStep('duration');
        setSelectedDuration('');
        setSelectedBank('');
        setProOpen(true);
        window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location]);

  useEffect(() => {
      if (currentUser && profileOpen) {
          setEditOfficeName(currentUser.officeName);
          setEditSecurityQuestion(currentUser.securityQuestion || '');
          setEditSecurityAnswer(currentUser.securityAnswer || '');
          setIsEditingProfile(false);
          setVerifyOldPass('');
          setProfileError('');
          setProfileSuccess('');
      }
  }, [currentUser, profileOpen]);

  const handleLogout = () => { logoutUser(); navigate('/login'); };

  const handleInitiateReset = (action: string) => {
      setResetAction(action);
      setResetStep('confirm1');
  };

  const handleConfirmReset = async () => {
      if (resetStep === 'confirm1') {
          setResetStep('confirm2');
          return;
      }
      if (!currentUser || !resetAction) return;
      setResetLoading(true);
      const targetId = currentUser.role === 'employee' && currentUser.parentId ? currentUser.parentId : currentUser.id;
      let success = false;
      switch (resetAction) {
          case 'agents':
              success = await deleteAllAgents(targetId);
              break;
          case 'clients':
              success = await deleteAllClients(targetId);
              break;
          case 'expenses':
              success = await deleteAllExpenses(targetId);
              break;
          case 'transactions':
              success = await deleteAllTransactions(targetId);
              break;
          case 'statement':
              const tSuccess = await deleteAllTransfers(targetId);
              const rSuccess = await deleteAllRefunds(targetId);
              success = tSuccess && rSuccess;
              break;
          case 'reports':
              await deleteAllTransactions(targetId);
              await deleteAllExpenses(targetId);
              await deleteAllTransfers(targetId);
              await deleteAllRefunds(targetId);
              success = true;
              break;
      }
      setResetLoading(false);
      if (success) {
          toast.success('تم تنفيذ العملية بنجاح');
          window.location.reload();
      } else {
          toast.error('حدث خطأ أثناء التنفيذ');
      }
      setResetOpen(false);
      setResetStep('menu');
      setResetAction(null);
  };

  const handleCreateEmployee = async () => {
    setEmpError('');
    if (!currentUser || !newEmpName || !newEmpPass) return;
    const res = await createEmployee({ name: newEmpName, password: newEmpPass, permissions: [] }, currentUser);
    if (res.success) {
        setEmpSuccess(`تم إنشاء حساب الموظف بنجاح. اسم الدخول: ${res.username}`);
        setNewEmpName('');
        setNewEmpPass('');
    } else {
        setEmpError(res.message || 'فشل إنشاء الموظف');
    }
  };

  const handleUpdateProfile = async () => {
      setProfileError('');
      if (!currentUser) return;
      if (!editOfficeName || !editSecurityQuestion || !editSecurityAnswer || !verifyOldPass) {
          setProfileError('يرجى ملء جميع الحقول وكلمة المرور للتأكيد');
          return;
      }
      setProfileLoading(true);
      try {
          const res = await updateUserProfile(
              currentUser.id, 
              verifyOldPass, 
              editOfficeName, 
              editSecurityQuestion, 
              editSecurityAnswer
          );
          if (res.success) {
              setProfileSuccess('تم تحديث البيانات بنجاح');
              const updated = getCurrentUser();
              setCurrentUser(updated);
              setTimeout(() => {
                  setIsEditingProfile(false);
                  setProfileSuccess('');
                  setVerifyOldPass('');
              }, 1500);
          } else {
              setProfileError(res.message || 'فشل التحديث');
          }
      } catch (e) {
          setProfileError('حدث خطأ غير متوقع');
      } finally {
          setProfileLoading(false);
      }
  };

  const handleChangePassword = async () => {
    setPassError('');
    if (!currentUser) return;
    if (!oldPass || !newPass || !confirmPass) {
        setPassError('يرجى ملء جميع الحقول');
        return;
    }
    if (newPass !== confirmPass) {
        setPassError('كلمتا المرور غير متطابقتين');
        return;
    }
    setPassLoading(true);
    try {
        const result = await changePassword(currentUser.phone, oldPass, newPass);
        if (result.success) {
            setPassSuccess(true);
            setTimeout(() => {
                setChangePassOpen(false);
                setPassSuccess(false);
                setOldPass('');
                setNewPass('');
                setConfirmPass('');
            }, 2000);
        } else {
            setPassError(result.message || 'فشل التحديث');
        }
    } catch (err) {
        setPassError('حدث خطأ غير متوقع');
    } finally {
        setPassLoading(false);
    }
  };

  const handleInquiry = () => {
    setInquiryError('');
    setFoundTx(null);
    const tx = transactions.find(t => t.serialNo === inquiryId);
    if (!tx) {
        setInquiryError('لم يتم العثور على معاملة بهذا الرقم، يرجى التحقق والمحاولة مرة أخرى.');
    } else {
        setFoundTx(tx);
    }
  };

  const calculateTimeLeft = (targetDate: number) => {
    const diff = targetDate - Date.now();
    if (diff <= 0) return "منتهية";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${days} يوم و ${hours} ساعة`;
  };

  const handleCreateBackup = () => {
    const data = createBackup();
    setLastBackup(Date.now().toString());
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_moaqeb_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleRestoreBackup = () => {
    if (!restoreText) return;
    const success = restoreBackup(restoreText);
    if (success) {
      toast.success('تم استعادة النسخة الاحتياطية بنجاح! سيتم إعادة تحميل الصفحة.');
      window.location.reload();
    } else {
      toast.error('فشل استعادة النسخة. تأكد من صحة الكود.');
    }
  };

  const formatBackupDate = (ts: string) => {
    const date = new Date(parseInt(ts));
    const timeStr = date.toLocaleTimeString('ar-SA', { hour: 'numeric', minute: 'numeric' });
    const dayName = date.toLocaleDateString('ar-SA', { weekday: 'long' });
    const monthName = date.toLocaleDateString('ar-SA', { month: 'long' });
    const year = date.toLocaleDateString('ar-SA', { year: 'numeric' });
    return `${timeStr}، ${dayName}، ${monthName}، ${year}`;
  };

  const tickerItems = [
    { label: "المعاملات النشطة", value: tickerStats.active, icon: Activity, color: "text-blue-600" },
    { label: "تحت الإنجاز", value: tickerStats.inProgress, icon: Clock, color: "text-orange-600" },
    { label: "إنجاز هذا الأسبوع", value: tickerStats.completedWeek, icon: CheckCircle2, color: "text-green-600" }
  ];

  const canAccessPage = (page: keyof GlobalSettings['pagePermissions']) => {
    if (!settings) return true;
    const userRole = currentUser?.role || 'visitor';
    if (userRole === 'golden' || userRole === 'employee') return true;
    // @ts-ignore
    return settings.pagePermissions[page].includes(userRole);
  };

  const handlePageClick = (page: string, path: string) => {
      if (soundEnabled) {
          new Audio('/sound2.mp3').play().catch(() => {});
      }
      // @ts-ignore
      if (canAccessPage(page)) {
          navigate(path);
      } else {
          setSubStep('duration');
          setSelectedDuration('');
          setSelectedBank('');
          setProOpen(true);
      }
  };

  const handleSubscribe = async () => {
    if (!currentUser) {
        toast.error('يجب تسجيل الدخول أولاً');
        navigate('/login');
        return;
    }
    if (!selectedBank || !selectedDuration) return;
    if (!senderName || !/^[a-zA-Z\u0600-\u06FF\s]+$/.test(senderName) || senderName.length < 15) {
        return;
    }
    const res = await createSubscriptionRequest(
        currentUser.id, 
        currentUser.officeName, 
        currentUser.phone, 
        selectedDuration, 
        selectedBank,
        senderName
    );
    if (res.success) {
        setSubSuccess('تم إرسال طلب الاشتراك بنجاح! سيتم التفعيل قريباً.');
        setTimeout(() => {
            setSubSuccess('');
            setProOpen(false);
            setSubStep('duration');
            setSelectedBank('');
            setSelectedDuration('');
            setSenderName('');
        }, 3000);
    } else {
        toast.error(res.message);
    }
  };

  const resetSubModal = (open: boolean) => {
      setProOpen(open);
      if(open && currentUser?.role === 'golden' && currentUser.subscriptionExpiry && currentUser.subscriptionExpiry > Date.now()) {
          setAlreadySubscribed(true);
      } else {
          setAlreadySubscribed(false);
      }
      if(!open) {
          setTimeout(() => {
            setSubStep('duration');
            setSelectedBank('');
            setSelectedDuration('');
            setSenderName('');
            setSubSuccess('');
          }, 300);
      }
  };

  const toggleSound = (checked: boolean) => {
      setSoundEnabled(checked);
      localStorage.setItem('moaqeb_sound_enabled', String(checked));
  };

  const toggleHideEarnings = (checked: boolean) => {
      setHideEarnings(checked);
      localStorage.setItem('moaqeb_hide_earnings', String(checked));
  };

  const nextOnboardingStep = () => {
      if (settings && onboardingStep < settings.onboardingSteps.length - 1) {
          setOnboardingStep(prev => prev + 1);
      } else {
          if (currentUser) {
              localStorage.setItem(`moaqeb_onboarding_seen_${currentUser.id}`, 'true');
          }
          setOnboardingOpen(false);
      }
  };

  const prevOnboardingStep = () => {
      if (onboardingStep > 0) {
          setOnboardingStep(prev => prev - 1);
      }
  };

  const handleCopyReferral = () => {
      if (!currentUser) return;
      const link = `${window.location.origin}/register?ref=${currentUser.id}`;
      const msg = `سجل في تطبيق مان هوبات لإدارة مكاتب الخدمات العامه واستفد من المزايا المتعدده..\n${link}`;
      navigator.clipboard.writeText(msg);
      toast.success('تم نسخ رابط الدعوة بنجاح');
  };

  const handleWithdraw = async () => {
      if (!currentUser || !rajhiAccount) return;
      if (currentUser.affiliateBalance && currentUser.affiliateBalance < 110) {
          setWithdrawError('رصيدك الحالي أقل من الحد الأدنى للسحب (110 ريال)');
          return;
      }
      const res = await createWithdrawalRequest(currentUser.id, currentUser.officeName, currentUser.affiliateBalance || 0, rajhiAccount);
      if (res.success) {
          setWithdrawSuccess(true);
          setRajhiAccount('');
          setTimeout(() => {
              setWithdrawOpen(false);
              setWithdrawSuccess(false);
          }, 3000);
      } else {
          setWithdrawError(res.message || 'فشل إرسال الطلب');
      }
  };

  const whatsappShareText = `تطبيق مان هوبات لمكاتب الخدمات العامة والتعقيب
إدارة شامله لمكتبك وانت بعيد
للمعقبين ولمن يعملون في مكاتب الخدمات
إدارة شامله للتقارير
إدارة تفصليله للموظفين
المعاملات والمنصرفات
تقرير الأرباح للمكتب
جمل التطبيق الان من جوجل بلاي
https://play.google.com/store/apps/details?id=apli3885642.ofh
أو أدخل علي الرابط
http://Www.manhobat.com.com`;

  return (
    <div className="max-w-md mx-auto min-h-screen pb-20 relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-600 hover:text-blue-600 hover:bg-blue-50">
                    <Menu className="w-6 h-6" />
                </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#eef2f6] w-[300px] sm:w-[400px] overflow-y-auto" dir="rtl">
                <SheetHeader className="mb-6 text-right">
                    <SheetTitle className="text-2xl font-black text-gray-800">القائمة الرئيسية</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-3">
                    {currentUser ? (
                        <>
                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg mb-2">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                                    {currentUser.officeName.charAt(0)}
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-800">{currentUser.officeName}</p>
                                    <p className="text-xs text-gray-500">{currentUser.phone}</p>
                                </div>
                            </div>
                            <Button variant="ghost" className="w-full justify-start gap-2 h-14 rounded-xl bg-[#eef2f6] shadow-3d hover:shadow-3d-hover active:shadow-3d-active transition-all" onClick={() => setProfileOpen(true)}>
                                <UserCircle className="w-5 h-5" />
                                الملف الشخصي
                            </Button>
                            {currentUser.role !== 'employee' && (
                                <Button variant="ghost" className="w-full justify-start gap-2 h-14 rounded-xl bg-[#eef2f6] shadow-3d hover:shadow-3d-hover active:shadow-3d-active transition-all" onClick={() => setCreateEmpOpen(true)}>
                                    <UserPlus className="w-5 h-5" />
                                    إضافة موظف
                                </Button>
                            )}
                            <Button variant="ghost" className="w-full justify-start gap-2 h-14 rounded-xl bg-[#eef2f6] shadow-3d hover:shadow-3d-hover active:shadow-3d-active transition-all" onClick={() => setAboutOpen(true)}>
                                <Info className="w-5 h-5 text-blue-500" />
                                عن التطبيق
                            </Button>
                            <Button variant="ghost" className="w-full justify-start gap-2 h-14 rounded-xl bg-[#eef2f6] shadow-3d hover:shadow-3d-hover active:shadow-3d-active transition-all" onClick={() => setAffiliateOpen(true)}>
                                <Coins className="w-5 h-5 text-yellow-600" />
                                نظام العمولة
                            </Button>
                            <Button variant="ghost" className="w-full justify-start gap-2 h-14 rounded-xl bg-[#eef2f6] shadow-3d hover:shadow-3d-hover active:shadow-3d-active transition-all" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(whatsappShareText)}`, '_blank')}>
                                <Share2 className="w-5 h-5 text-blue-400" />
                                ارسل لصديق واكسب
                            </Button>
                            <Button variant="ghost" className="w-full justify-start gap-2 h-14 rounded-xl bg-[#eef2f6] shadow-3d hover:shadow-3d-hover active:shadow-3d-active transition-all" onClick={() => window.open('https://wa.me/249118014777', '_blank')}>
                                <Headset className="w-5 h-5 text-green-600" />
                                الدعم الفني السريع
                            </Button>
                            <Separator className="my-2 bg-gray-300/50" />
                            <Button variant="ghost" className="w-full justify-start gap-2 h-14 rounded-xl bg-[#eef2f6] shadow-3d hover:shadow-3d-hover active:shadow-3d-active transition-all text-red-600 font-bold" onClick={handleLogout}>
                                <LogOut className="w-5 h-5" />
                                تسجيل الخروج
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button className="w-full gap-2 h-14 rounded-xl shadow-3d" onClick={() => navigate('/login')}>
                                <LogIn className="w-4 h-4" />
                                تسجيل الدخول
                            </Button>
                            <Button variant="outline" className="w-full gap-2 h-14 rounded-xl shadow-3d" onClick={() => navigate('/register')}>
                                <UserPlus className="w-4 h-4" />
                                إنشاء حساب جديد
                            </Button>
                            <Button variant="ghost" className="w-full justify-start gap-2 h-14 rounded-xl bg-[#eef2f6] shadow-3d" onClick={() => setAboutOpen(true)}>
                                <Info className="w-5 h-5 text-blue-500" />
                                عن التطبيق
                            </Button>
                            <Button variant="ghost" className="w-full justify-start gap-2 h-14 rounded-xl bg-[#eef2f6] shadow-3d" onClick={() => window.open('https://wa.me/249118014777', '_blank')}>
                                <Headset className="w-5 h-5 text-green-600" />
                                الدعم الفني السريع
                            </Button>
                        </>
                    )}
                </div>
            </SheetContent>
        </Sheet>
        <div className="flex flex-col items-center">
            <h1 
                className="text-xl font-bold text-gray-800 select-none cursor-default active:scale-95 transition-transform"
                onClick={() => setAdminClickCount(prev => prev + 1)}
            >
                {settings?.siteTitle || 'مان هويات لمكاتب الخدمات'}
            </h1>
            {currentUser && (
                <p className="text-sm text-gray-500 font-medium mt-1">
                    {currentUser.role === 'golden' ? '✨ عضوية ذهبية' : currentUser.role === 'employee' ? 'موظف' : 'عضوية أساسية'}
                </p>
            )}
        </div>
        <div className="flex gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 relative">
                        <Bell className="w-6 h-6" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                    <DropdownMenuLabel className="text-right">الإشعارات</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="p-4 text-center text-gray-500 text-sm">
                        لا توجد إشعارات جديدة
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
            <Sheet open={mySettingsOpen} onOpenChange={setMySettingsOpen}>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-gray-600 hover:text-blue-600 hover:bg-blue-50">
                        <Settings className="w-6 h-6" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <SheetHeader className="mb-6 text-right">
                        <SheetTitle>الإعدادات</SheetTitle>
                    </SheetHeader>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="sound-toggle" className="flex items-center gap-2">
                                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                                أصوات التطبيق
                            </Label>
                            <Switch id="sound-toggle" checked={soundEnabled} onCheckedChange={toggleSound} />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="earnings-toggle" className="flex items-center gap-2">
                                {hideEarnings ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                إخفاء الأرباح
                            </Label>
                            <Switch id="earnings-toggle" checked={hideEarnings} onCheckedChange={toggleHideEarnings} />
                        </div>
                        <Separator />
                        <div className="space-y-2">
                            <h3 className="font-medium text-sm text-gray-500 mb-2 text-right">النسخ الاحتياطي</h3>
                            <Button variant="outline" className="w-full justify-start gap-2" onClick={() => setBackupOpen(true)}>
                                <Database className="w-4 h-4" />
                                إدارة النسخ الاحتياطي
                            </Button>
                        </div>
                        {currentUser && (
                            <>
                                <Separator />
                                <div className="space-y-2">
                                    <h3 className="font-medium text-sm text-gray-500 mb-2 text-right">الحساب</h3>
                                    <Button variant="outline" className="w-full justify-start gap-2" onClick={() => setChangePassOpen(true)}>
                                        <Key className="w-4 h-4" />
                                        تغيير كلمة المرور
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => setResetOpen(true)}>
                                        <Trash2 className="w-4 h-4" />
                                        تصفير النظام (حذف البيانات)
                                    </Button>
                                    <Button variant="outline" className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => navigate('/delete-data')}>
                                        <UserIcon className="w-4 h-4" />
                                        حذف الحساب نهائياً
                                    </Button>
                                </div>
                            </>
                        )}
                    </div>
                </SheetContent>
            </Sheet>
        </div>
      </div>
      {/* Ticker / Marquee */}
      {settings?.marquee && (
        <div 
            className="w-full py-2 mb-6 overflow-hidden shadow-sm border-b"
            style={{ 
                backgroundColor: settings.marquee.bgColor || '#DC2626', 
                color: settings.marquee.textColor || '#FFFFFF',
                borderColor: `${settings.marquee.bgColor}33` 
            }}
        >
            <div className="marquee-container">
            <div className="marquee-content font-bold text-sm sm:text-base">
                {settings.marquee.text || 'مرحباً بكم في تطبيق مان هويات لمكاتب الخدمات'}
            </div>
            </div>
        </div>
      )}
      {/* Main Grid */}
      <div className="grid grid-cols-2 gap-4 px-2">
        <DashboardButton icon={FileText} label="المعاملات" onClick={() => handlePageClick('transactions', '/transactions')} />
        <DashboardButton icon={Wallet} label="الحسابات" onClick={() => handlePageClick('accounts', '/accounts')} />
        <DashboardButton icon={BarChart3} label="التقارير" onClick={() => handlePageClick('reports', '/reports')} />
        <DashboardButton icon={Users} label="العملاء" onClick={() => handlePageClick('clients', '/clients')} />
        <DashboardButton icon={UserCheck} label="المعقبين" onClick={() => handlePageClick('agents', '/agents')} />
        <DashboardButton icon={Award} label="المنجزين" variant="primary" onClick={() => handlePageClick('achievers', '/achievers')} />
        <DashboardButton icon={Receipt} label="المنصرفات" variant="danger" onClick={() => handlePageClick('expenses', '/expenses')} />
        <DashboardButton icon={Calculator} label="الحاسبة" onClick={() => handlePageClick('calculator', '/calculator')} />
        <DashboardButton icon={Building2} label="مكاتب الخدمات" className="col-span-2" onClick={() => handlePageClick('summary', '/summary')} />
      </div>
      {/* Quick Stats Ticker */}
      <div className="mt-8 px-2">
        <div className="p-4 rounded-2xl bg-white shadow-sm border border-gray-100 relative overflow-hidden">
            <h3 className="text-sm font-bold text-gray-400 mb-3 text-right">ملخص سريع</h3>
            <div className="relative h-12 w-full">
                {tickerItems.map((item, idx) => (
                    <div key={idx} className={`absolute top-0 left-0 w-full transition-all duration-500 ease-in-out transform ${idx === tickerIndex ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <item.icon className={`w-5 h-5 ${item.color}`} />
                                <span className="text-gray-600 font-bold text-sm">{item.label}</span>
                            </div>
                            <span className={`font-black text-xl ${item.color}`}>{item.value}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
      {/* About Dialog */}
      <Dialog open={aboutOpen} onOpenChange={setAboutOpen}>
        <DialogContent className="bg-white border-none shadow-xl rounded-3xl" dir="rtl">
            <DialogHeader>
                <DialogTitle className="text-center text-xl font-black text-gray-800 flex items-center justify-center gap-2">
                    <Info className="w-6 h-6 text-blue-600" />
                    عن تطبيق مان هوبات
                </DialogTitle>
            </DialogHeader>
            <div className="py-6 space-y-4 text-gray-700 leading-relaxed">
                <p className="text-sm font-bold text-center">
                    تطبيق مان هوبات هو نظام محاسبي وإداري متكامل مخصص لمكاتب الخدمات العامة والاستقدام في المملكة العربية السعودية.
                </p>
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <h4 className="font-black text-blue-600 mb-2 text-sm">الهدف من التطبيق:</h4>
                    <ul className="text-xs space-y-2 list-disc list-inside font-medium text-gray-600">
                        <li>تنظيم المعاملات المالية والإدارية للمكاتب.</li>
                        <li>حفظ حقوق المكتب والعملاء والمعقبين.</li>
                        <li>متابعة الأرباح والمصروفات بدقة عالية.</li>
                        <li>تسهيل الوصول لأفضل المعقبين المنجزين.</li>
                        <li>إصدار تقارير تفصيلية للأداء المالي والإداري.</li>
                    </ul>
                </div>
                <div className="text-center">
                    <p className="text-[10px] text-gray-400">الإصدار 1.0.0</p>
                    <p className="text-[10px] text-gray-400 mt-1">تطوير: ELTAIB HAMED ELTAIB</p>
                </div>
                <Button onClick={() => setAboutOpen(false)} className="w-full py-6 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all">إغلاق</Button>
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
