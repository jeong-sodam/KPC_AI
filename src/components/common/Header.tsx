import React, { useState, useRef, useEffect } from 'react';
import { GnbTab, UserRole } from '../../types';
import { 
  Bell, 
  User, 
  CheckCircle2, 
  ChevronDown, 
  Settings, 
  LogOut, 
  Sliders, 
  Shield, 
  X, 
  Check,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  BarChart3,
  LayoutDashboard,
  UserCheck,
  ArrowRight
} from 'lucide-react';

interface HeaderProps {
  activeTab: GnbTab;
  onTabChange?: (tab: GnbTab) => void;
  onSelectTab?: (tab: GnbTab) => void;
  onShowToast?: (msg: string) => void;
  userRole?: UserRole;
  onRoleChange?: (role: UserRole) => void;
  onOpenAdminConsole?: () => void;
  onOpenMyUsage?: () => void;
  onOpenMyProfile?: () => void;
  onRequestTokens?: () => void;
  usedTokens?: number;
  totalQuota?: number;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeTab, 
  onTabChange, 
  onSelectTab, 
  onShowToast,
  userRole = 'admin',
  onRoleChange,
  onOpenAdminConsole,
  onOpenMyUsage,
  onOpenMyProfile,
  onRequestTokens,
  usedTokens = 72430,
  totalQuota = 100000
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [activeProfileTab, setActiveProfileTab] = useState<'notifications' | 'settings'>('notifications');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [soundAlerts, setSoundAlerts] = useState(false);
  const [modelType, setModelType] = useState('Gemini 2.5 Flash (사내망 연동)');

  const profileRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState([
    { id: 1, title: 'AI 분석 완료', text: '공공기관 생성형 AI 플랫폼 구축 RFP 분석이 완료되었습니다.', time: '10분 전', read: false },
    { id: 2, title: '댓글 알림', text: '김민수 님이 [3.3 보안 체계] 섹션에 새로운 댓글을 남겼습니다.', time: '35분 전', read: false },
    { id: 3, title: '제안서 마감 임박', text: '한국교육진흥원 컨설팅 사업 제안서 마감이 24일 남았습니다.', time: '2시간 전', read: true }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTabChange = (tab: GnbTab) => {
    if (typeof onTabChange === 'function') {
      onTabChange(tab);
    } else if (typeof onSelectTab === 'function') {
      onSelectTab(tab);
    }
  };

  const showToastSafe = (msg: string) => {
    if (typeof onShowToast === 'function') {
      onShowToast(msg);
    }
  };

  const handleRoleChange = (newRole: UserRole) => {
    if (onRoleChange) {
      onRoleChange(newRole);
    }
    if (newRole === 'admin') {
      showToastSafe("🛡️ '관리자' 권한으로 전환되었습니다. (시스템 설정 및 관리자 기능 활성화)");
    } else {
      showToastSafe("👤 '일반사용자' 권한으로 전환되었습니다. (일반 사용자 권한 모드로 테스트)");
    }
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToastSafe('모든 알림을 읽음 처리했습니다.');
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-neutral-200 z-40 select-none">
      <div className="max-w-[1920px] mx-auto h-full px-5 flex items-center justify-between gap-4">
        {/* Left: KPC Logo */}
        <div 
          onClick={() => handleTabChange('knowledge_ai')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-[#E60012] flex items-center justify-center text-white font-black text-sm tracking-wider shadow-xs">
            KPC
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-[#111111]">KPC AI</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600 border border-neutral-200">
                Enterprise
              </span>
            </div>
            <span className="text-[10px] text-neutral-600 font-medium -mt-0.5">한국생산성본부 인텔리전스 플랫폼</span>
          </div>
        </div>

        {/* Spacer: Pushes GNB all the way to the right next to the profile */}
        <div className="flex-1" />

        {/* Right Section: GNB Menus directly adjacent to User Profile */}
        <div className="flex items-center h-full gap-2 sm:gap-3">
          {/* GNB Menus with KPC Red Line */}
          {/* 순서: 1. Knowledge AI (구 DIA) -> 2. AI Worker -> 3. 제안서 생성 -> 4. Custom AI -> 5. AI Agent -> 6. AI Community */}
          <nav className="flex items-center h-full gap-0.5 sm:gap-1 overflow-x-auto scrollbar-none">
            {/* 1. Knowledge AI (구 DIA) */}
            <button
              id="gnb-knowledge-ai-btn"
              onClick={() => handleTabChange('knowledge_ai')}
              className={`relative h-full px-3.5 sm:px-4 flex items-center font-medium text-xs sm:text-sm whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'knowledge_ai' || activeTab === 'dia'
                  ? 'text-[#111111] font-bold'
                  : 'text-neutral-500 hover:text-[#111111] hover:bg-neutral-50'
              }`}
            >
              <span>Knowledge AI</span>
              {(activeTab === 'knowledge_ai' || activeTab === 'dia') && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#E60012]" />
              )}
            </button>

            {/* 2. AI Worker */}
            <button
              id="gnb-ai-worker-btn"
              onClick={() => handleTabChange('ai_worker')}
              className={`relative h-full px-3.5 sm:px-4 flex items-center font-medium text-xs sm:text-sm whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'ai_worker'
                  ? 'text-[#111111] font-bold'
                  : 'text-neutral-500 hover:text-[#111111] hover:bg-neutral-50'
              }`}
            >
              <span>AI Worker</span>
              {activeTab === 'ai_worker' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#E60012]" />
              )}
            </button>

            {/* 3. 제안서 AI */}
            <button
              id="gnb-proposals-btn"
              onClick={() => handleTabChange('proposals')}
              className={`relative h-full px-3.5 sm:px-4 flex items-center font-medium text-xs sm:text-sm whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'proposals'
                  ? 'text-[#111111] font-bold'
                  : 'text-neutral-500 hover:text-[#111111] hover:bg-neutral-50'
              }`}
            >
              <span>제안서 AI</span>
              {activeTab === 'proposals' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#E60012]" />
              )}
            </button>

            {/* 4. Custom AI */}
            <button
              id="gnb-custom-ai-btn"
              onClick={() => handleTabChange('custom_ai')}
              className={`relative h-full px-3.5 sm:px-4 flex items-center font-medium text-xs sm:text-sm whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'custom_ai'
                  ? 'text-[#111111] font-bold'
                  : 'text-neutral-500 hover:text-[#111111] hover:bg-neutral-50'
              }`}
            >
              <span>Custom AI</span>
              {activeTab === 'custom_ai' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#E60012]" />
              )}
            </button>

            {/* 5. AI Agent */}
            <button
              id="gnb-ai-agent-btn"
              onClick={() => handleTabChange('ai_agent')}
              className={`relative h-full px-3.5 sm:px-4 flex items-center font-medium text-xs sm:text-sm whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'ai_agent'
                  ? 'text-[#111111] font-bold'
                  : 'text-neutral-500 hover:text-[#111111] hover:bg-neutral-50'
              }`}
            >
              <span>AI Agent</span>
              {activeTab === 'ai_agent' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#E60012]" />
              )}
            </button>

            {/* 6. AI Community */}
            <button
              id="gnb-ai-community-btn"
              onClick={() => handleTabChange('ai_community')}
              className={`relative h-full px-3.5 sm:px-4 flex items-center font-medium text-xs sm:text-sm whitespace-nowrap transition-colors cursor-pointer ${
                activeTab === 'ai_community'
                  ? 'text-[#111111] font-bold'
                  : 'text-neutral-500 hover:text-[#111111] hover:bg-neutral-50'
              }`}
            >
              <span>AI Community</span>
              {activeTab === 'ai_community' && (
                <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#E60012]" />
              )}
            </button>
          </nav>

          {/* User Profile & Integrated Dropdown (알림, 설정, 사용량, 권한 테스트 등) */}
          <div ref={profileRef} className="relative">
            <button
              id="user-profile-badge"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl hover:bg-neutral-100 cursor-pointer transition-colors focus:outline-none border border-neutral-200/80 bg-white shadow-2xs"
              title="사용자 프로필, AI 사용량, 권한 테스트 및 알림"
            >
              <div className="relative">
                <div className={`w-7 h-7 rounded-full text-white flex items-center justify-center text-xs font-bold shadow-2xs transition-colors ${
                  userRole === 'admin' ? 'bg-[#E60012]' : 'bg-neutral-800'
                }`}>
                  {userRole === 'admin' ? '관' : '정'}
                </div>
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#E60012] ring-2 ring-white" />
                )}
              </div>
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#111111] leading-tight">정소담</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded leading-none ${
                    userRole === 'admin' 
                      ? 'bg-red-50 text-[#E60012] border border-red-200' 
                      : 'bg-neutral-100 text-neutral-600 border border-neutral-200'
                  }`}>
                    {userRole === 'admin' ? '관리자' : '일반'}
                  </span>
                </div>
                <span className="text-[10px] text-neutral-500 leading-none">
                  {userRole === 'admin' ? 'AI사업본부 수석' : 'AI사업본부 선임'}
                </span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-neutral-500 transition-transform duration-200 ${showProfileMenu ? 'rotate-180 text-[#111111]' : ''}`} />
            </button>

            {/* Profile Dropdown Menu with AI Usage, Role Test, Notifications & Settings */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-92 bg-white rounded-2xl border border-neutral-200/90 shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150 divide-y divide-neutral-100">
                {/* 1. User Header Info */}
                <div className="p-4 bg-[#F8F9FA] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full text-white flex items-center justify-center text-sm font-bold shadow-xs ${
                      userRole === 'admin' ? 'bg-[#E60012]' : 'bg-neutral-800'
                    }`}>
                      {userRole === 'admin' ? '관리자' : '일반'}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[#111111]">
                          {userRole === 'admin' ? '정소담 수석연구원' : '정소담 선임연구원'}
                        </span>
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold border ${
                          userRole === 'admin' 
                            ? 'bg-red-50 text-[#E60012] border-[#E60012]/20' 
                            : 'bg-neutral-100 text-neutral-700 border-neutral-300'
                        }`}>
                          {userRole === 'admin' ? '관리자 (Admin)' : '일반사용자'}
                        </span>
                      </div>
                      <span className="text-[11px] text-neutral-500 block mt-0.5">
                        {userRole === 'admin' ? 'AI사업본부 · 생산성혁신TF (관리자)' : 'AI사업본부 · 실무 전담 (일반)'}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-mono">jeongsodam0108@gmail.com</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowProfileMenu(false)}
                    className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* 2. AI 사용량 현황 (프로필 클릭 시 확인) */}
                <div className="p-3.5 bg-neutral-50/70 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#E60012]" />
                      <span className="text-xs font-bold text-neutral-900">당월 AI Token 사용량</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-extrabold text-[#E60012]">
                        {Math.min(100, Math.round((usedTokens / Math.max(1, totalQuota)) * 100))}%
                      </span>
                      <span className="text-[10px] text-neutral-400">소진</span>
                    </div>
                  </div>

                  {/* 프로그레스 바 */}
                  <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        (usedTokens / totalQuota) >= 0.95
                          ? 'bg-[#E60012]'
                          : (usedTokens / totalQuota) >= 0.8
                          ? 'bg-amber-500'
                          : 'bg-neutral-900'
                      }`}
                      style={{ width: `${Math.min(100, (usedTokens / totalQuota) * 100)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-neutral-500 font-mono">
                    <span>사용 <strong className="text-neutral-800 font-bold">{(usedTokens / 1000).toFixed(1)}K</strong></span>
                    <span>잔여 <strong className="text-neutral-800 font-bold">{((totalQuota - usedTokens) / 1000).toFixed(1)}K</strong></span>
                    <span>한도 <strong className="text-neutral-800 font-bold">{(totalQuota / 1000).toFixed(0)}K Token</strong></span>
                  </div>

                  {/* 토큰 관련 바로가기 버튼군 */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      id="profile-view-usage-detail-btn"
                      onClick={() => {
                        setShowProfileMenu(false);
                        onOpenMyUsage?.();
                      }}
                      className="py-1.5 px-2 bg-white hover:bg-neutral-100 text-neutral-800 border border-neutral-200 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                    >
                      <BarChart3 className="w-3.5 h-3.5 text-neutral-500" />
                      <span>사용량 상세 분석</span>
                    </button>
                    <button
                      type="button"
                      id="profile-request-token-btn"
                      onClick={() => {
                        setShowProfileMenu(false);
                        onRequestTokens?.();
                      }}
                      className="py-1.5 px-2 bg-[#E60012] hover:bg-[#CC0010] text-white rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>토큰 추가 신청</span>
                    </button>
                  </div>
                </div>

                {/* 3. 권한 테스트 모드 (Role Testing Switcher) */}
                <div className="p-3 bg-neutral-50/90 border-t border-neutral-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800">
                      <Sliders className="w-3.5 h-3.5 text-[#E60012]" />
                      <span>권한 테스트 모드</span>
                    </div>
                    <span className="text-[10px] font-semibold text-neutral-500">
                      {userRole === 'admin' ? '현재: 관리자 (Admin)' : '현재: 일반 사용자'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 p-1 bg-neutral-200/80 rounded-xl">
                    <button
                      type="button"
                      id="role-switch-user-btn"
                      onClick={() => handleRoleChange('user')}
                      className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        userRole === 'user'
                          ? 'bg-white text-neutral-900 shadow-xs'
                          : 'text-neutral-500 hover:text-neutral-800'
                      }`}
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>일반 사용자</span>
                    </button>
                    <button
                      type="button"
                      id="role-switch-admin-btn"
                      onClick={() => handleRoleChange('admin')}
                      className={`py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        userRole === 'admin'
                          ? 'bg-[#E60012] text-white shadow-xs'
                          : 'text-neutral-500 hover:text-neutral-800'
                      }`}
                    >
                      <Shield className="w-3.5 h-3.5" />
                      <span>관리자 (Admin)</span>
                    </button>
                  </div>
                </div>

                {/* 4. Core Profile Actions (내 정보 & 관리자 콘솔) */}
                <div className="p-2.5 bg-white space-y-1.5">
                  {/* 내 정보 */}
                  <button
                    type="button"
                    id="menu-my-profile-btn"
                    onClick={() => {
                      setShowProfileMenu(false);
                      onOpenMyProfile?.();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 rounded-xl transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-neutral-100 group-hover:bg-white flex items-center justify-center text-neutral-600 border border-neutral-200">
                        <UserCheck className="w-3.5 h-3.5" />
                      </div>
                      <span>내 정보 및 계정 상세</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-700 transition-transform group-hover:translate-x-0.5" />
                  </button>

                  {/* 관리자 콘솔 - 클릭 시 실제 관리자 대시보드(/admin/dashboard)로 이동 */}
                  <button
                    type="button"
                    id="menu-admin-console-btn"
                    onClick={() => {
                      setShowProfileMenu(false);
                      if (onOpenAdminConsole) {
                        onOpenAdminConsole();
                      } else {
                        if (userRole !== 'admin' && onRoleChange) {
                          onRoleChange('admin');
                        }
                        handleTabChange('admin');
                      }
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-bold text-[#E60012] bg-red-50/70 hover:bg-red-50 hover:text-[#CC0010] border border-red-200/80 rounded-xl transition-all group cursor-pointer shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-[#E60012] text-white flex items-center justify-center shadow-2xs">
                        <LayoutDashboard className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold">관리자 콘솔</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-red-100 text-[#E60012] font-extrabold tracking-wider">
                          ADMIN
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#E60012] transition-transform group-hover:translate-x-0.5" />
                  </button>
                </div>

                {/* 3. Top Tabs: 알림 vs 설정 */}
                <div className="flex border-b border-neutral-200 bg-white">
                  <button
                    onClick={() => setActiveProfileTab('notifications')}
                    className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
                      activeProfileTab === 'notifications'
                        ? 'border-[#E60012] text-[#E60012]'
                        : 'border-transparent text-neutral-500 hover:text-neutral-800'
                    }`}
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>업무 알림</span>
                    {unreadCount > 0 && (
                      <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-[#E60012] text-white font-bold">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setActiveProfileTab('settings')}
                    className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
                      activeProfileTab === 'settings'
                        ? 'border-[#E60012] text-[#E60012]'
                        : 'border-transparent text-neutral-500 hover:text-neutral-800'
                    }`}
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>환경 설정</span>
                  </button>
                </div>

                {/* 3. Tab Contents */}
                {activeProfileTab === 'notifications' ? (
                  <div className="p-3">
                    <div className="flex items-center justify-between pb-2 mb-1 border-b border-neutral-100">
                      <span className="text-[11px] font-bold text-neutral-700">최근 도착한 업무 알림</span>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllRead}
                          className="text-[11px] text-[#E60012] hover:underline font-semibold"
                        >
                          모두 읽음
                        </button>
                      )}
                    </div>
                    <div className="divide-y divide-neutral-100 max-h-64 overflow-y-auto pr-0.5 space-y-1">
                      {notifications.map(item => (
                        <div
                          key={item.id}
                          onClick={() => {
                            setNotifications(prev =>
                              prev.map(n => (n.id === item.id ? { ...n, read: true } : n))
                            );
                          }}
                          className={`p-2.5 rounded-lg cursor-pointer transition-colors ${
                            item.read ? 'bg-white opacity-75 hover:bg-neutral-50' : 'bg-red-50/40 hover:bg-red-50/70 border border-red-100/50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-[#111111] flex items-center gap-1.5">
                              {!item.read && <span className="w-1.5 h-1.5 rounded-full bg-[#E60012]" />}
                              {item.title}
                            </span>
                            <span className="text-[10px] text-neutral-400">{item.time}</span>
                          </div>
                          <p className="text-[11px] text-neutral-600 leading-relaxed">
                            {item.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 space-y-3.5 text-xs">
                    {/* Model Choice */}
                    <div className="space-y-1.5">
                      <label className="font-bold text-neutral-700 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-[#E60012]" />
                        기본 생성 AI 엔진
                      </label>
                      <select
                        value={modelType}
                        onChange={e => {
                          setModelType(e.target.value);
                          showToastSafe(`기본 AI 모델이 '${e.target.value}'(으)로 변경되었습니다.`);
                        }}
                        className="w-full p-2 bg-[#F8F9FA] border border-neutral-200 rounded-lg text-xs text-[#111111] focus:outline-none focus:border-[#E60012]"
                      >
                        <option value="Gemini 2.5 Flash (사내망 연동)">Gemini 2.5 Flash (초고속 권장)</option>
                        <option value="Gemini 2.5 Pro (심층 제안 분석)">Gemini 2.5 Pro (정밀 추론)</option>
                        <option value="KPC 온프레미스 망분리 모델">KPC 온프레미스 망분리 모델</option>
                      </select>
                    </div>

                    {/* Alert Options */}
                    <div className="pt-2 border-t border-neutral-100 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-neutral-800 block">이메일 알림 연동</span>
                          <span className="text-[10px] text-neutral-400">제안서 댓글 알림 및 주요 업데이트 메일 수신</span>
                        </div>
                        <button
                          onClick={() => setEmailAlerts(!emailAlerts)}
                          className="text-neutral-600 hover:text-[#E60012]"
                        >
                          {emailAlerts ? (
                            <ToggleRight className="w-6 h-6 text-[#E60012]" />
                          ) : (
                            <ToggleLeft className="w-6 h-6 text-neutral-400" />
                          )}
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-neutral-800 block">알림 효과음</span>
                          <span className="text-[10px] text-neutral-400">작업 완료 시 사운드 알림</span>
                        </div>
                        <button
                          onClick={() => setSoundAlerts(!soundAlerts)}
                          className="text-neutral-600 hover:text-[#E60012]"
                        >
                          {soundAlerts ? (
                            <ToggleRight className="w-6 h-6 text-[#E60012]" />
                          ) : (
                            <ToggleLeft className="w-6 h-6 text-neutral-400" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-neutral-100">
                      <button
                        onClick={() => {
                          showToastSafe('사내 DLP 보안 인증 토큰이 갱신되었습니다.');
                        }}
                        className="w-full py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Shield className="w-3.5 h-3.5 text-emerald-600" />
                        <span>사내 보안 토큰 재검증</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 4. Dropdown Footer */}
                <div className="p-3 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between">
                  <span className="text-[10px] text-neutral-400">KPC AI Enterprise v2.4</span>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      showToastSafe('정상적으로 로그아웃되었습니다.');
                    }}
                    className="flex items-center gap-1 text-xs text-neutral-500 hover:text-[#E60012] font-semibold"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>로그아웃</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
