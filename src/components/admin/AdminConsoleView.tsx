import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  KeyRound, 
  Cpu, 
  Bot, 
  Inbox, 
  ScrollText, 
  ArrowLeft, 
  Shield, 
  Sparkles, 
  TrendingUp, 
  DollarSign, 
  CheckCircle2, 
  AlertTriangle, 
  AlertCircle, 
  ChevronRight, 
  ChevronDown,
  Sliders, 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  Check, 
  X, 
  Layers, 
  Activity, 
  ExternalLink,
  Lock,
  Building,
  UserCheck,
  Calendar,
  Clock,
  Settings,
  Database,
  Share2,
  Cloud,
  ThumbsUp,
  ThumbsDown,
  Server,
  FileText,
  ShieldAlert,
  Coins,
  Shuffle
} from 'lucide-react';
import { 
  AdminMenuTab, 
  UserRole,
  AdminDashboardKpis,
  EntraUserAccount,
  OrgTeamPolicy,
  UsageBreakdownItem,
  PlatformTokenBudgetConfig,
  TokenRequest,
  MultiLlmModelInfo,
  ProviderKeyInfo,
  LlmRoutingRule,
  CostCapRateLimitConfig,
  SystemPromptTemplate,
  ManagedAiAgent,
  ManagedCustomAi,
  CommunityManagedPost,
  KnowledgeRagSource,
  SystemConnectorItem,
  SecurityAccessPolicyConfig,
  DetailedAuditLogEntry,
  AiUserFeedbackItem,
  AiQualityPerformanceMetric,
  AdminSystemAlert
} from '../../types';
import { 
  EXPANDED_DASHBOARD_KPIS,
  DASHBOARD_RECENT_ALERTS,
  DASHBOARD_TOP5_DATA,
  INITIAL_ENTRA_USERS,
  INITIAL_ORG_TEAMS,
  INITIAL_USAGE_BREAKDOWNS,
  INITIAL_PLATFORM_BUDGET,
  EXPANDED_TOKEN_REQUESTS,
  INITIAL_MULTI_LLMS,
  INITIAL_PROVIDER_KEYS,
  INITIAL_ROUTING_RULES,
  INITIAL_COST_CAPS,
  INITIAL_SYSTEM_PROMPTS,
  INITIAL_MANAGED_AGENTS,
  INITIAL_MANAGED_CUSTOM_AI,
  INITIAL_COMMUNITY_POSTS,
  INITIAL_RAG_SOURCES,
  INITIAL_SYSTEM_CONNECTORS,
  INITIAL_SECURITY_POLICY,
  EXPANDED_AUDIT_LOGS,
  INITIAL_USER_FEEDBACK,
  INITIAL_AI_QUALITY_METRICS
} from '../../data/adminExpandedMockData';
import { USAGE_TRENDS_DATA } from '../../data/adminMockData';

// Modular Sub-Views
import { UserAndOrgView } from './views/UserAndOrgView';
import { AiOperationsView } from './views/AiOperationsView';
import { ModelAndCostView } from './views/ModelAndCostView';
import { DataAndIntegrationView } from './views/DataAndIntegrationView';
import { OperationsAndQualityView } from './views/OperationsAndQualityView';
import { ServiceKnowledgeAiView } from './views/ServiceKnowledgeAiView';
import { ServiceAiWorkerView } from './views/ServiceAiWorkerView';
import { ServiceProposalAiView } from './views/ServiceProposalAiView';
import { ApiMcpManagementView } from './views/ApiMcpManagementView';
import { SecurityPolicyView } from './views/SecurityPolicyView';
import { DataAndFilePermissionsView } from './views/DataAndFilePermissionsView';

interface AdminConsoleViewProps {
  onBackToWorkspace: () => void;
  onSwitchToUser?: () => void;
  onShowToast: (msg: string) => void;
  userRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

// 6 Accordion Categories Configuration
interface NavCategory {
  id: string;
  label: string;
  items: {
    id: AdminMenuTab;
    label: string;
    icon: React.FC<{ className?: string }>;
    badge?: number;
  }[];
}

export const AdminConsoleView: React.FC<AdminConsoleViewProps> = ({
  onBackToWorkspace,
  onSwitchToUser,
  onShowToast,
  userRole,
  onRoleChange
}) => {
  // Navigation State
  const [activeMenu, setActiveMenu] = useState<AdminMenuTab>('dashboard');

  // Accordion state: which categories are expanded
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    dashboard: true,
    user_mgmt: true,
    ai_ops: true,
    model_cost: true,
    data_int: false,
    ops_quality: false
  });

  const toggleCategory = (catId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  // State Layers
  const [kpis, setKpis] = useState<AdminDashboardKpis>(EXPANDED_DASHBOARD_KPIS);
  const [users, setUsers] = useState<EntraUserAccount[]>(INITIAL_ENTRA_USERS);
  const [teams, setTeams] = useState<OrgTeamPolicy[]>(INITIAL_ORG_TEAMS);
  const [requests, setRequests] = useState<TokenRequest[]>(EXPANDED_TOKEN_REQUESTS);
  const [models, setModels] = useState<MultiLlmModelInfo[]>(INITIAL_MULTI_LLMS);
  const [providerKeys, setProviderKeys] = useState<ProviderKeyInfo[]>(INITIAL_PROVIDER_KEYS);
  const [routingRules, setRoutingRules] = useState<LlmRoutingRule[]>(INITIAL_ROUTING_RULES);
  const [budgetConfig, setBudgetConfig] = useState<PlatformTokenBudgetConfig>(INITIAL_PLATFORM_BUDGET);
  const [costCaps, setCostCaps] = useState<CostCapRateLimitConfig[]>(INITIAL_COST_CAPS);
  const [systemPrompts, setSystemPrompts] = useState<SystemPromptTemplate[]>(INITIAL_SYSTEM_PROMPTS);
  const [agents, setAgents] = useState<ManagedAiAgent[]>(INITIAL_MANAGED_AGENTS);
  const [customAiList, setCustomAiList] = useState<ManagedCustomAi[]>(INITIAL_MANAGED_CUSTOM_AI);
  const [communityPosts, setCommunityPosts] = useState<CommunityManagedPost[]>(INITIAL_COMMUNITY_POSTS);
  const [ragSources, setRagSources] = useState<KnowledgeRagSource[]>(INITIAL_RAG_SOURCES);
  const [connectors, setConnectors] = useState<SystemConnectorItem[]>(INITIAL_SYSTEM_CONNECTORS);
  const [securityPolicy] = useState<SecurityAccessPolicyConfig>(INITIAL_SECURITY_POLICY);
  const [auditLogs] = useState<DetailedAuditLogEntry[]>(EXPANDED_AUDIT_LOGS);
  const [feedbackList] = useState<AiUserFeedbackItem[]>(INITIAL_USER_FEEDBACK);
  const [qualityMetrics] = useState<AiQualityPerformanceMetric[]>(INITIAL_AI_QUALITY_METRICS);
  const [alerts] = useState<AdminSystemAlert[]>(DASHBOARD_RECENT_ALERTS);

  // Dashboard Trends View Mode
  const [trendPeriod, setTrendPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [trendMetric, setTrendMetric] = useState<'tokens' | 'calls' | 'cost'>('tokens');
  const [rankingTab, setRankingTab] = useState<'users' | 'departments' | 'agents' | 'customAi' | 'models'>('users');

  // Define the Accordion Navigation Structure (17+ areas grouped in 6 categories)
  const pendingRequestCount = requests.filter(r => r.status === '대기').length;
  const criticalAlertCount = alerts.filter(a => a.severity === 'critical' || a.severity === 'warning').length;

  const NAV_CATEGORIES: NavCategory[] = [
    {
      id: 'dashboard',
      label: '대시보드',
      items: [
        { id: 'dashboard', label: '운영 총괄 대시보드', icon: LayoutDashboard }
      ]
    },
    {
      id: 'ai_platform',
      label: 'Level 1. AI 플랫폼 관리',
      items: [
        { id: 'multi_llm', label: 'Multi-LLM 모델 관리', icon: Cpu },
        { id: 'routing_policy', label: '모델 라우팅 정책', icon: Shuffle },
        { 
          id: 'token_cost_mgmt', 
          label: '토큰 / 비용 관리', 
          icon: Coins,
          badge: pendingRequestCount > 0 ? pendingRequestCount : undefined
        },
        { id: 'api_mcp_mgmt', label: 'API / MCP 중앙 관리', icon: Server },
        { id: 'security_policy', label: '보안 정책 및 DLP', icon: Shield }
      ]
    },
    {
      id: 'service_mgmt',
      label: 'Level 2. 서비스별 설정 (6대 서비스)',
      items: [
        { id: 'service_knowledge_ai', label: 'Knowledge AI 관리', icon: Database },
        { id: 'service_ai_worker', label: 'AI Worker 관리', icon: Bot },
        { id: 'service_proposal_ai', label: '제안서 AI 관리', icon: FileText },
        { id: 'custom_ai_mgmt', label: 'Custom AI 관리', icon: Sparkles },
        { id: 'ai_agent_mgmt', label: 'AI Agent 관리', icon: Bot },
        { id: 'community_mgmt', label: 'AI Community 관리', icon: Share2 }
      ]
    },
    {
      id: 'user_mgmt',
      label: '사용자 및 권한 관리',
      items: [
        { id: 'user_mgmt', label: '사용자 및 권한 (Entra ID)', icon: Users },
        { id: 'org_team_mgmt', label: '조직 및 부서별 정책', icon: Building },
        { id: 'permission_mgmt', label: '권한 및 역할 (RBAC)', icon: Shield }
      ]
    },
    {
      id: 'data_file_permissions',
      label: '데이터 및 문서 관리',
      items: [
        { id: 'data_file_permissions', label: '데이터 및 파일 접근권한', icon: Database },
        { id: 'knowledge_rag', label: 'Knowledge / RAG 연동', icon: Cloud }
      ]
    },
    {
      id: 'logs_monitoring',
      label: '로그 및 모니터링',
      items: [
        { id: 'audit_logs', label: '감사 로그 (Audit Logs)', icon: ScrollText },
        { id: 'ai_quality', label: 'AI 품질 모니터링', icon: Activity },
        { 
          id: 'incident_alerts', 
          label: '시스템 경고 센터', 
          icon: AlertTriangle,
          badge: criticalAlertCount > 0 ? criticalAlertCount : undefined
        }
      ]
    }
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#F9FAFB] text-neutral-900 overflow-hidden font-sans">
      {/* ─────────────────────────────────────────────────────────────
          1. 상단 글로벌 GNB / 관리자 헤더
          ───────────────────────────────────────────────────────────── */}
      <header className="h-16 bg-white border-b border-neutral-200 px-6 flex items-center justify-between shrink-0 z-20 shadow-2xs">
        <div className="flex items-center gap-3">
          <button
            type="button"
            id="admin-btn-back-workspace"
            onClick={onBackToWorkspace}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors text-xs font-semibold cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>워크스페이스로 복귀</span>
          </button>

          <div className="h-4 w-px bg-neutral-200" />

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-black text-xs tracking-tighter">
              KPC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-neutral-900">KPC 통합 운영 관리자 콘솔</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#E60012] text-white tracking-wide uppercase">
                  ENTERPRISE ADMIN
                </span>
              </div>
              <span className="text-[11px] text-neutral-500 font-mono">
                통합 운영 · 모니터링 · 비용 통제 센터 (v2.4)
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-50 text-[#E60012] text-xs font-bold border border-red-200">
            <span className="w-2 h-2 rounded-full bg-[#E60012] animate-pulse" />
            <span>전사 관리자 모드</span>
          </div>

          <div className="h-4 w-px bg-neutral-200" />

          {/* Quick Role Switcher */}
          <div className="flex items-center bg-neutral-100 p-0.5 rounded-lg border border-neutral-200 text-xs">
            <button
              type="button"
              id="admin-console-role-user-btn"
              onClick={() => {
                if (onSwitchToUser) {
                  onSwitchToUser();
                } else {
                  onRoleChange('user');
                  onBackToWorkspace();
                }
              }}
              className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                userRole === 'user'
                  ? 'bg-white text-neutral-900 shadow-xs font-bold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              일반사용자
            </button>
            <button
              type="button"
              id="admin-console-role-admin-btn"
              onClick={() => {
                onRoleChange('admin');
                onShowToast("🛡️ 현재 전사 관리자(Admin) 모드로 실행 중입니다.");
              }}
              className={`px-2.5 py-1 rounded text-xs font-bold shadow-xs cursor-pointer transition-colors ${
                userRole === 'admin'
                  ? 'bg-[#E60012] text-white'
                  : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'
              }`}
            >
              관리자
            </button>
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. 바디 영역: 좌측 아코디언 사이드바 + 메인 화면
          ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        {/* 좌측 아코디언 사이드바 */}
        <aside className="w-68 bg-white border-r border-neutral-200 flex flex-col justify-between shrink-0 overflow-y-auto select-none">
          <div className="p-3.5 space-y-2">
            <div className="px-2 py-1 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                Control & Governance
              </span>
              <h2 className="text-xs font-bold text-neutral-800 mt-0.5">운영 통제 카테고리</h2>
            </div>

            {/* Accordion Categories */}
            <div className="space-y-1.5">
              {NAV_CATEGORIES.map(category => {
                const isExpanded = expandedCategories[category.id] ?? true;
                const hasActiveItem = category.items.some(it => it.id === activeMenu);

                return (
                  <div key={category.id} className="rounded-xl border border-neutral-100 overflow-hidden bg-neutral-50/40">
                    {/* Accordion Header */}
                    <button
                      type="button"
                      onClick={() => toggleCategory(category.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold transition-colors cursor-pointer ${
                        hasActiveItem
                          ? 'bg-neutral-100/90 text-neutral-900'
                          : 'text-neutral-700 hover:bg-neutral-100/50'
                      }`}
                    >
                      <span className="truncate">{category.label}</span>
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      )}
                    </button>

                    {/* Accordion Submenu Items */}
                    {isExpanded && (
                      <div className="p-1 space-y-0.5 bg-white border-t border-neutral-100">
                        {category.items.map(item => {
                          const Icon = item.icon;
                          const isActive = activeMenu === item.id;

                          return (
                            <button
                              key={item.id}
                              id={`admin-menu-${item.id}`}
                              type="button"
                              onClick={() => setActiveMenu(item.id)}
                              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                                isActive
                                  ? 'bg-neutral-900 text-white font-bold shadow-xs'
                                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                              }`}
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#E60012]' : 'text-neutral-400'}`} />
                                <span className="truncate text-[11px]">{item.label}</span>
                              </div>

                              {item.badge !== undefined && item.badge > 0 && (
                                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold shrink-0 ${
                                  isActive ? 'bg-[#E60012] text-white' : 'bg-red-100 text-[#E60012]'
                                }`}>
                                  {item.badge}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar Footer Info */}
          <div className="p-3.5 border-t border-neutral-100 bg-neutral-50/70 text-[11px] text-neutral-400 space-y-1">
            <div className="flex items-center justify-between">
              <span>보안 인가 등급</span>
              <span className="font-bold text-neutral-700 font-mono">KPC-LEVEL-1</span>
            </div>
            <div className="flex items-center justify-between">
              <span>토큰 갱신 주기</span>
              <span className="font-medium text-neutral-600">매월 1일 00:00</span>
            </div>
            <div className="text-[10px] text-neutral-400 pt-0.5">
              KPC Enterprise AI v2.4 Platform
            </div>
          </div>
        </aside>

        {/* ─────────────────────────────────────────────────────────────
            우측 메인 콘텐츠 화면 (17+ Areas)
            ───────────────────────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">

            {/* ═══════════════════════════════════════════════════════════
                CATEGORY 1: 운영 대시보드
               ═══════════════════════════════════════════════════════════ */}
            {activeMenu === 'dashboard' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                {/* 상단 타이틀 & 새로고침 */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold text-neutral-900">플랫폼 운영 통합 대시보드</h2>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      전사 AI Token 사용량, 실시간 활성 사용자, 비용 예측 및 시스템 경고를 한눈에 모니터링합니다.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onShowToast('대시보드 실시간 메트릭이 갱신되었습니다.')}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-xl border border-neutral-200 hover:bg-neutral-50 text-xs font-semibold text-neutral-700 shadow-2xs transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-neutral-500" />
                      <span>새로고침</span>
                    </button>
                  </div>
                </div>

                {/* 1. 상단 8대 KPI 카드 (사용자 요구사항 완벽 반영) */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                  {/* 오늘 활성 사용자 */}
                  <div className="bg-white p-3.5 rounded-2xl border border-neutral-200 shadow-2xs flex flex-col justify-between">
                    <span className="text-[10px] font-semibold text-neutral-500">오늘 활성 사용자</span>
                    <div className="my-1.5">
                      <div className="text-lg font-black text-neutral-900">{kpis.todayActiveUsers}명</div>
                      <span className="text-[10px] text-neutral-400">전체 210명 중 70%</span>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded w-fit">
                      +14명 증가
                    </span>
                  </div>

                  {/* 이번 달 AI 호출 수 */}
                  <div className="bg-white p-3.5 rounded-2xl border border-neutral-200 shadow-2xs flex flex-col justify-between">
                    <span className="text-[10px] font-semibold text-neutral-500">이번 달 AI 호출</span>
                    <div className="my-1.5">
                      <div className="text-lg font-black text-neutral-900">{(kpis.monthlyAiCalls / 1000).toFixed(1)}K회</div>
                      <span className="text-[10px] text-neutral-400">일평균 4,150회</span>
                    </div>
                    <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded w-fit">
                      +28% 전월비
                    </span>
                  </div>

                  {/* 이번 달 Token 사용량 */}
                  <div className="bg-white p-3.5 rounded-2xl border border-neutral-200 shadow-2xs flex flex-col justify-between">
                    <span className="text-[10px] font-semibold text-neutral-500">이번 달 Token</span>
                    <div className="my-1.5">
                      <div className="text-lg font-black text-neutral-900">24.8M</div>
                      <span className="text-[10px] text-neutral-400">/ 50.0M (49.6%)</span>
                    </div>
                    <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full bg-neutral-900 rounded-full" style={{ width: '49.6%' }} />
                    </div>
                  </div>

                  {/* 이번 달 예상 비용 */}
                  <div className="bg-white p-3.5 rounded-2xl border border-neutral-200 shadow-2xs flex flex-col justify-between">
                    <span className="text-[10px] font-semibold text-neutral-500">이번 달 예상 비용</span>
                    <div className="my-1.5">
                      <div className="text-lg font-black text-neutral-900">₩148만</div>
                      <span className="text-[10px] text-neutral-400">예산 ₩300만 (49%)</span>
                    </div>
                    <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full" style={{ width: '49.4%' }} />
                    </div>
                  </div>

                  {/* 활성 AI Agent 수 */}
                  <div className="bg-white p-3.5 rounded-2xl border border-neutral-200 shadow-2xs flex flex-col justify-between">
                    <span className="text-[10px] font-semibold text-neutral-500">활성 AI Agent</span>
                    <div className="my-1.5">
                      <div className="text-lg font-black text-neutral-900">{kpis.activeAgents}개</div>
                      <span className="text-[10px] text-neutral-400">배포 완료</span>
                    </div>
                    <span className="text-[10px] font-semibold text-neutral-600 bg-neutral-100 px-1.5 py-0.5 rounded w-fit">
                      공식 승인
                    </span>
                  </div>

                  {/* 활성 Custom AI 수 */}
                  <div className="bg-white p-3.5 rounded-2xl border border-neutral-200 shadow-2xs flex flex-col justify-between">
                    <span className="text-[10px] font-semibold text-neutral-500">활성 Custom AI</span>
                    <div className="my-1.5">
                      <div className="text-lg font-black text-neutral-900">{kpis.activeCustomAi}개</div>
                      <span className="text-[10px] text-neutral-400">특화 서비스</span>
                    </div>
                    <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded w-fit">
                      100% 가동
                    </span>
                  </div>

                  {/* 추가 사용량 요청 건수 */}
                  <div 
                    onClick={() => setActiveMenu('token_requests')}
                    className="bg-white p-3.5 rounded-2xl border border-neutral-200 shadow-2xs flex flex-col justify-between cursor-pointer hover:border-red-300 transition-colors"
                  >
                    <span className="text-[10px] font-semibold text-neutral-500">토큰 요청 건수</span>
                    <div className="my-1.5 flex items-center justify-between">
                      <div className="text-lg font-black text-[#E60012]">
                        {pendingRequestCount}건
                      </div>
                      <span className="w-2 h-2 rounded-full bg-[#E60012] animate-ping" />
                    </div>
                    <span className="text-[10px] font-bold text-[#E60012] bg-red-50 px-1.5 py-0.5 rounded w-fit">
                      심사 대기 &gt;
                    </span>
                  </div>

                  {/* 시스템 경고 건수 */}
                  <div 
                    onClick={() => setActiveMenu('incident_alerts')}
                    className="bg-white p-3.5 rounded-2xl border border-neutral-200 shadow-2xs flex flex-col justify-between cursor-pointer hover:border-amber-300 transition-colors"
                  >
                    <span className="text-[10px] font-semibold text-neutral-500">시스템 경고</span>
                    <div className="my-1.5">
                      <div className="text-lg font-black text-amber-700">
                        {criticalAlertCount}건
                      </div>
                      <span className="text-[10px] text-neutral-400">긴급 조치 필요</span>
                    </div>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded w-fit">
                      알림 확인 &gt;
                    </span>
                  </div>
                </div>

                {/* 사용량 추이 & TOP 5 랭킹 (2열 레이아웃) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* 좌측 (7열): 사용량 추이 그래프 */}
                  <div className="lg:col-span-7 bg-white rounded-2xl border border-neutral-200 p-6 shadow-2xs space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100">
                      <div>
                        <h3 className="font-bold text-sm text-neutral-900">AI 사용량 추이 분석</h3>
                        <p className="text-[11px] text-neutral-500">일 / 주 / 월별 호출 횟수, Token 사용량 및 예상 비용 추이</p>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Period Switcher */}
                        <div className="flex items-center bg-neutral-100 p-0.5 rounded-lg text-xs font-semibold">
                          {(['daily', 'weekly', 'monthly'] as const).map(p => (
                            <button
                              key={p}
                              type="button"
                              onClick={() => setTrendPeriod(p)}
                              className={`px-2.5 py-1 rounded cursor-pointer transition-colors ${
                                trendPeriod === p
                                  ? 'bg-white text-neutral-900 shadow-2xs font-bold'
                                  : 'text-neutral-500 hover:text-neutral-900'
                              }`}
                            >
                              {p === 'daily' ? '일별' : p === 'weekly' ? '주별' : '월별'}
                            </button>
                          ))}
                        </div>

                        {/* Metric Switcher */}
                        <div className="flex items-center bg-neutral-100 p-0.5 rounded-lg text-xs font-semibold">
                          {(['tokens', 'calls', 'cost'] as const).map(m => (
                            <button
                              key={m}
                              type="button"
                              onClick={() => setTrendMetric(m)}
                              className={`px-2.5 py-1 rounded cursor-pointer transition-colors ${
                                trendMetric === m
                                  ? 'bg-[#E60012] text-white shadow-2xs font-bold'
                                  : 'text-neutral-500 hover:text-neutral-900'
                              }`}
                            >
                              {m === 'tokens' ? 'Token' : m === 'calls' ? '호출수' : '예상비용'}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Chart Graphic */}
                    <div className="h-64 flex flex-col justify-between pt-2">
                      <div className="flex items-end justify-between gap-2 h-48 px-2">
                        {USAGE_TRENDS_DATA[trendPeriod].map((pt, idx) => {
                          const currentVal = trendMetric === 'tokens' ? pt.tokens : trendMetric === 'calls' ? pt.calls : pt.cost;
                          const maxVal = Math.max(...USAGE_TRENDS_DATA[trendPeriod].map(d => trendMetric === 'tokens' ? d.tokens : trendMetric === 'calls' ? d.calls : d.cost));
                          const heightPct = Math.round((currentVal / maxVal) * 100);

                          return (
                            <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                              <span className="text-[10px] font-mono text-neutral-400 group-hover:text-neutral-900 group-hover:font-bold transition-colors">
                                {trendMetric === 'tokens' 
                                  ? `${(pt.tokens / 1000).toFixed(0)}K` 
                                  : trendMetric === 'calls' 
                                  ? `${pt.calls.toLocaleString()}회` 
                                  : `₩${(pt.cost / 1000).toFixed(0)}K`}
                              </span>

                              <div className="w-full max-w-[48px] bg-neutral-100 rounded-t-lg overflow-hidden flex items-end h-full">
                                <div 
                                  className={`w-full rounded-t-lg transition-all duration-300 ${
                                    idx === USAGE_TRENDS_DATA[trendPeriod].length - 1
                                      ? 'bg-[#E60012]'
                                      : 'bg-neutral-800 hover:bg-neutral-700'
                                  }`}
                                  style={{ height: `${Math.max(12, heightPct)}%` }}
                                />
                              </div>

                              <span className="text-[11px] font-semibold text-neutral-600 truncate">
                                {pt.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-neutral-100 text-[11px] text-neutral-500">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded bg-neutral-800" />
                            <span>이전 기간</span>
                          </span>
                          <span className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded bg-[#E60012]" />
                            <span>현재 기간 (최신)</span>
                          </span>
                        </div>
                        <span className="font-mono text-neutral-400">전월 대비 평균 +28.4% 증가 추세</span>
                      </div>
                    </div>
                  </div>

                  {/* 우측 (5열): 사용량 TOP 5 (사용자/부서/AI Agent/Custom AI/모델) */}
                  <div className="lg:col-span-5 bg-white rounded-2xl border border-neutral-200 p-6 shadow-2xs space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                      <div>
                        <h3 className="font-bold text-sm text-neutral-900">사용량 TOP 5 순위</h3>
                        <p className="text-[11px] text-neutral-500">5개 분류별 최다 AI 사용 리소스</p>
                      </div>
                    </div>

                    {/* 5 Tabs */}
                    <div className="flex border-b border-neutral-200 overflow-x-auto scrollbar-none gap-1">
                      {[
                        { id: 'users', label: '사용자' },
                        { id: 'departments', label: '부서' },
                        { id: 'agents', label: 'AI Agent' },
                        { id: 'customAi', label: 'Custom AI' },
                        { id: 'models', label: '모델' }
                      ].map(t => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setRankingTab(t.id as any)}
                          className={`py-2 px-2 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                            rankingTab === t.id
                              ? 'border-[#E60012] text-[#E60012] font-bold'
                              : 'border-transparent text-neutral-500 hover:text-neutral-900'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>

                    {/* Items List */}
                    <div className="space-y-2.5 pt-1">
                      {DASHBOARD_TOP5_DATA[rankingTab].map((item: any, idx: number) => (
                        <div key={idx} className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-200/80 space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                                idx === 0 ? 'bg-[#E60012] text-white' : idx === 1 ? 'bg-neutral-800 text-white' : 'bg-neutral-200 text-neutral-700'
                              }`}>
                                {item.rank}
                              </span>
                              <div className="min-w-0">
                                <span className="font-bold text-xs text-neutral-900 truncate block">
                                  {item.name}
                                </span>
                                <span className="text-[10px] text-neutral-400 block truncate">
                                  {item.subtext}
                                </span>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <span className="font-mono font-bold text-xs text-neutral-900 block">
                                {item.metric}
                              </span>
                              <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded inline-block ${
                                item.tag.includes('위험') || item.tag.includes('제한') || item.tag.includes('급증')
                                  ? 'bg-red-50 text-[#E60012]'
                                  : item.tag.includes('주의')
                                  ? 'bg-amber-50 text-amber-700'
                                  : 'bg-neutral-100 text-neutral-600'
                              }`}>
                                {item.tag}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>


              </div>
            )}

            {/* ═══════════════════════════════════════════════════════════
                CATEGORY 2: 사용자 및 조직 관리
               ═══════════════════════════════════════════════════════════ */}
            {activeMenu === 'user_mgmt' && (
              <UserAndOrgView
                subTab="users"
                onShowToast={onShowToast}
                users={users}
                setUsers={setUsers}
                teams={teams}
                setTeams={setTeams}
                securityPolicy={securityPolicy}
              />
            )}
            {activeMenu === 'org_team_mgmt' && (
              <UserAndOrgView
                subTab="teams"
                onShowToast={onShowToast}
                users={users}
                setUsers={setUsers}
                teams={teams}
                setTeams={setTeams}
                securityPolicy={securityPolicy}
              />
            )}
            {activeMenu === 'permission_mgmt' && (
              <UserAndOrgView
                subTab="permissions"
                onShowToast={onShowToast}
                users={users}
                setUsers={setUsers}
                teams={teams}
                setTeams={setTeams}
                securityPolicy={securityPolicy}
              />
            )}

            {/* ═══════════════════════════════════════════════════════════
                CATEGORY 3: AI 서비스 운영 관리
               ═══════════════════════════════════════════════════════════ */}
            {activeMenu === 'ai_agent_mgmt' && (
              <AiOperationsView
                subTab="agents"
                onShowToast={onShowToast}
                agents={agents}
                setAgents={setAgents}
                customAiList={customAiList}
                setCustomAiList={setCustomAiList}
                communityPosts={communityPosts}
                setCommunityPosts={setCommunityPosts}
                systemPrompts={systemPrompts}
                setSystemPrompts={setSystemPrompts}
              />
            )}
            {activeMenu === 'custom_ai_mgmt' && (
              <AiOperationsView
                subTab="custom_ai"
                onShowToast={onShowToast}
                agents={agents}
                setAgents={setAgents}
                customAiList={customAiList}
                setCustomAiList={setCustomAiList}
                communityPosts={communityPosts}
                setCommunityPosts={setCommunityPosts}
                systemPrompts={systemPrompts}
                setSystemPrompts={setSystemPrompts}
              />
            )}
            {activeMenu === 'community_mgmt' && (
              <AiOperationsView
                subTab="community"
                onShowToast={onShowToast}
                agents={agents}
                setAgents={setAgents}
                customAiList={customAiList}
                setCustomAiList={setCustomAiList}
                communityPosts={communityPosts}
                setCommunityPosts={setCommunityPosts}
                systemPrompts={systemPrompts}
                setSystemPrompts={setSystemPrompts}
              />
            )}

            {/* ═══════════════════════════════════════════════════════════
                Level 1: AI 플랫폼 공통 관리
               ═══════════════════════════════════════════════════════════ */}
            {activeMenu === 'token_cost_mgmt' && (
              <ModelAndCostView
                subTab="budget"
                onShowToast={onShowToast}
                models={models}
                setModels={setModels}
                providerKeys={providerKeys}
                setProviderKeys={setProviderKeys}
                routingRules={routingRules}
                setRoutingRules={setRoutingRules}
                usageBreakdowns={INITIAL_USAGE_BREAKDOWNS}
                budgetConfig={budgetConfig}
                setBudgetConfig={setBudgetConfig}
                requests={requests}
                setRequests={setRequests}
                costCaps={costCaps}
                setCostCaps={setCostCaps}
                teams={teams}
                users={users}
                setUsers={setUsers}
              />
            )}
            {activeMenu === 'api_mcp_mgmt' && (
              <ApiMcpManagementView onShowToast={onShowToast} />
            )}
            {activeMenu === 'security_policy' && (
              <SecurityPolicyView onShowToast={onShowToast} />
            )}

            {/* ═══════════════════════════════════════════════════════════
                Level 2: 서비스별 관리 (6대 서비스)
               ═══════════════════════════════════════════════════════════ */}
            {activeMenu === 'service_knowledge_ai' && (
              <ServiceKnowledgeAiView onShowToast={onShowToast} />
            )}
            {activeMenu === 'service_ai_worker' && (
              <ServiceAiWorkerView onShowToast={onShowToast} />
            )}
            {activeMenu === 'service_proposal_ai' && (
              <ServiceProposalAiView onShowToast={onShowToast} />
            )}

            {/* ═══════════════════════════════════════════════════════════
                데이터 및 파일 접근 권한
               ═══════════════════════════════════════════════════════════ */}
            {activeMenu === 'data_file_permissions' && (
              <DataAndFilePermissionsView onShowToast={onShowToast} />
            )}

            {/* ═══════════════════════════════════════════════════════════
                CATEGORY 4: AI 모델 및 비용 관리
               ═══════════════════════════════════════════════════════════ */}
            {activeMenu === 'multi_llm' && (
              <ModelAndCostView
                subTab="multi_llm"
                onShowToast={onShowToast}
                models={models}
                setModels={setModels}
                providerKeys={providerKeys}
                setProviderKeys={setProviderKeys}
                routingRules={routingRules}
                setRoutingRules={setRoutingRules}
                usageBreakdowns={INITIAL_USAGE_BREAKDOWNS}
                budgetConfig={budgetConfig}
                setBudgetConfig={setBudgetConfig}
                requests={requests}
                setRequests={setRequests}
                costCaps={costCaps}
                setCostCaps={setCostCaps}
                teams={teams}
                users={users}
                setUsers={setUsers}
              />
            )}
            {activeMenu === 'api_provider' && (
              <ModelAndCostView
                subTab="api_provider"
                onShowToast={onShowToast}
                models={models}
                setModels={setModels}
                providerKeys={providerKeys}
                setProviderKeys={setProviderKeys}
                routingRules={routingRules}
                setRoutingRules={setRoutingRules}
                usageBreakdowns={INITIAL_USAGE_BREAKDOWNS}
                budgetConfig={budgetConfig}
                setBudgetConfig={setBudgetConfig}
                requests={requests}
                setRequests={setRequests}
                costCaps={costCaps}
                setCostCaps={setCostCaps}
                teams={teams}
                users={users}
                setUsers={setUsers}
              />
            )}
            {activeMenu === 'routing_policy' && (
              <ModelAndCostView
                subTab="routing"
                onShowToast={onShowToast}
                models={models}
                setModels={setModels}
                providerKeys={providerKeys}
                setProviderKeys={setProviderKeys}
                routingRules={routingRules}
                setRoutingRules={setRoutingRules}
                usageBreakdowns={INITIAL_USAGE_BREAKDOWNS}
                budgetConfig={budgetConfig}
                setBudgetConfig={setBudgetConfig}
                requests={requests}
                setRequests={setRequests}
                costCaps={costCaps}
                setCostCaps={setCostCaps}
                teams={teams}
                users={users}
                setUsers={setUsers}
              />
            )}
            {activeMenu === 'usage_cost' && (
              <ModelAndCostView
                subTab="usage_cost"
                onShowToast={onShowToast}
                models={models}
                setModels={setModels}
                providerKeys={providerKeys}
                setProviderKeys={setProviderKeys}
                routingRules={routingRules}
                setRoutingRules={setRoutingRules}
                usageBreakdowns={INITIAL_USAGE_BREAKDOWNS}
                budgetConfig={budgetConfig}
                setBudgetConfig={setBudgetConfig}
                requests={requests}
                setRequests={setRequests}
                costCaps={costCaps}
                setCostCaps={setCostCaps}
                teams={teams}
                users={users}
                setUsers={setUsers}
              />
            )}
            {activeMenu === 'token_budget' && (
              <ModelAndCostView
                subTab="budget"
                onShowToast={onShowToast}
                models={models}
                setModels={setModels}
                providerKeys={providerKeys}
                setProviderKeys={setProviderKeys}
                routingRules={routingRules}
                setRoutingRules={setRoutingRules}
                usageBreakdowns={INITIAL_USAGE_BREAKDOWNS}
                budgetConfig={budgetConfig}
                setBudgetConfig={setBudgetConfig}
                requests={requests}
                setRequests={setRequests}
                costCaps={costCaps}
                setCostCaps={setCostCaps}
                teams={teams}
                users={users}
                setUsers={setUsers}
              />
            )}
            {activeMenu === 'token_requests' && (
              <ModelAndCostView
                subTab="requests"
                onShowToast={onShowToast}
                models={models}
                setModels={setModels}
                providerKeys={providerKeys}
                setProviderKeys={setProviderKeys}
                routingRules={routingRules}
                setRoutingRules={setRoutingRules}
                usageBreakdowns={INITIAL_USAGE_BREAKDOWNS}
                budgetConfig={budgetConfig}
                setBudgetConfig={setBudgetConfig}
                requests={requests}
                setRequests={setRequests}
                costCaps={costCaps}
                setCostCaps={setCostCaps}
                teams={teams}
                users={users}
                setUsers={setUsers}
              />
            )}
            {activeMenu === 'cost_cap' && (
              <ModelAndCostView
                subTab="cost_cap"
                onShowToast={onShowToast}
                models={models}
                setModels={setModels}
                providerKeys={providerKeys}
                setProviderKeys={setProviderKeys}
                routingRules={routingRules}
                setRoutingRules={setRoutingRules}
                usageBreakdowns={INITIAL_USAGE_BREAKDOWNS}
                budgetConfig={budgetConfig}
                setBudgetConfig={setBudgetConfig}
                requests={requests}
                setRequests={setRequests}
                costCaps={costCaps}
                setCostCaps={setCostCaps}
                teams={teams}
                users={users}
                setUsers={setUsers}
              />
            )}

            {/* ═══════════════════════════════════════════════════════════
                CATEGORY 5: 데이터 및 연계 관리
               ═══════════════════════════════════════════════════════════ */}
            {activeMenu === 'knowledge_rag' && (
              <DataAndIntegrationView
                subTab="knowledge_rag"
                onShowToast={onShowToast}
                ragSources={ragSources}
                setRagSources={setRagSources}
                connectors={connectors}
                setConnectors={setConnectors}
              />
            )}
            {activeMenu === 'system_connectors' && (
              <DataAndIntegrationView
                subTab="connectors"
                onShowToast={onShowToast}
                ragSources={ragSources}
                setRagSources={setRagSources}
                connectors={connectors}
                setConnectors={setConnectors}
              />
            )}
            {activeMenu === 'm365_integration' && (
              <DataAndIntegrationView
                subTab="m365"
                onShowToast={onShowToast}
                ragSources={ragSources}
                setRagSources={setRagSources}
                connectors={connectors}
                setConnectors={setConnectors}
              />
            )}

            {/* ═══════════════════════════════════════════════════════════
                CATEGORY 6: 운영 및 품질 모니터링
               ═══════════════════════════════════════════════════════════ */}
            {activeMenu === 'user_feedback' && (
              <OperationsAndQualityView
                subTab="feedback"
                onShowToast={onShowToast}
                auditLogs={auditLogs}
                feedbackList={feedbackList}
                qualityMetrics={qualityMetrics}
                alerts={alerts}
                onNavigateMenu={m => setActiveMenu(m)}
              />
            )}
            {activeMenu === 'ai_quality' && (
              <OperationsAndQualityView
                subTab="quality"
                onShowToast={onShowToast}
                auditLogs={auditLogs}
                feedbackList={feedbackList}
                qualityMetrics={qualityMetrics}
                alerts={alerts}
                onNavigateMenu={m => setActiveMenu(m)}
              />
            )}
            {activeMenu === 'audit_logs' && (
              <OperationsAndQualityView
                subTab="audit_logs"
                onShowToast={onShowToast}
                auditLogs={auditLogs}
                feedbackList={feedbackList}
                qualityMetrics={qualityMetrics}
                alerts={alerts}
                onNavigateMenu={m => setActiveMenu(m)}
              />
            )}
            {activeMenu === 'incident_alerts' && (
              <OperationsAndQualityView
                subTab="alerts"
                onShowToast={onShowToast}
                auditLogs={auditLogs}
                feedbackList={feedbackList}
                qualityMetrics={qualityMetrics}
                alerts={alerts}
                onNavigateMenu={m => setActiveMenu(m)}
              />
            )}

          </div>
        </main>
      </div>
    </div>
  );
};
