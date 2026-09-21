import { 
  UserTokenAllocation, 
  TeamTokenBudget, 
  TokenRequest, 
  AiProviderApiKey, 
  AiModelPolicy,
  AdminDashboardKpis,
  UsageTrendPoint,
  UsageRankingItem,
  AuditLogItem,
  EntraUserAccount,
  OrgTeamPolicy,
  UsageBreakdownItem,
  PlatformTokenBudgetConfig,
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
} from '../types';

// ==========================================
// 1. 운영 대시보드 데이터
// ==========================================
export const EXPANDED_DASHBOARD_KPIS: AdminDashboardKpis = {
  totalTokensUsed: 24820000,
  totalTokensQuota: 50000000,
  estimatedCostKrw: 1482000,
  costBudgetKrw: 3000000,
  activeUsers: 148,
  totalUsers: 210,
  activeAgents: 18,
  activeCustomAi: 6,
  pendingTokenRequests: 5,
  // 확장 필드
  todayActiveUsers: 148,
  monthlyAiCalls: 124500,
  systemAlertsCount: 4
};

export const DASHBOARD_RECENT_ALERTS: AdminSystemAlert[] = [
  {
    id: 'alert-1',
    severity: 'critical',
    title: '교육사업팀 Token 사용량 90% 도달',
    description: '당월 할당량 10M 중 9.2M 소진 (주의 등급 격상, 초과 위험)',
    targetMenu: 'token_budget',
    timestamp: '10분 전',
    isRead: false
  },
  {
    id: 'alert-2',
    severity: 'warning',
    title: 'GPT Enterprise 월 비용 한도 80% 도달',
    description: '월 상한 ₩5,000,000 중 ₩4,120,000 발생 (82.4%)',
    targetMenu: 'cost_cap',
    timestamp: '25분 전',
    isRead: false
  },
  {
    id: 'alert-3',
    severity: 'info',
    title: '제안서 작성 Agent 사용량 전주 대비 135% 증가',
    description: '공공 RFP 공고 집중 기간으로 호출 급증 (4.2M Token 누적)',
    targetMenu: 'usage_cost',
    timestamp: '1시간 전',
    isRead: true
  },
  {
    id: 'alert-4',
    severity: 'error',
    title: 'Gemini API 연결 오류 발생 (일시적 Latency 스파이크)',
    description: '15:20~15:24 간 3건의 503 에러 발생 후 정상 자동 복구 완료',
    targetMenu: 'api_provider',
    timestamp: '2시간 전',
    isRead: true
  },
  {
    id: 'alert-5',
    severity: 'warning',
    title: '교육 시스템 ERP Gateway 동기화 점검 필요',
    description: '최근 배치 동기화 중 4건의 커리큘럼 메타데이터 매핑 실패',
    targetMenu: 'system_connectors',
    timestamp: '3시간 전',
    isRead: true
  }
];

// TOP 5 랭킹 데이터
export const DASHBOARD_TOP5_DATA = {
  users: [
    { rank: 1, name: '박지훈 책임', subtext: '컨설팅본부 · 제안수주팀', metric: '100,000 Token', percentage: 14.2, tag: '사용 제한' },
    { rank: 2, name: '이서연 선임', subtext: '교육사업팀 · 디지털과정', metric: '98,000 Token', percentage: 13.9, tag: '주의 (98%)' },
    { rank: 3, name: '강동원 과장', subtext: '글로벌협력처 · 해외사업', metric: '96,000 Token', percentage: 13.6, tag: '주의 (96%)' },
    { rank: 4, name: '정소담 수석', subtext: 'AI사업본부 · 플랫폼개발', metric: '72,430 Token', percentage: 10.3, tag: '정상 (72%)' },
    { rank: 5, name: '김민수 팀장', subtext: '경영기획팀 · 전략기획', metric: '72,000 Token', percentage: 10.2, tag: '정상 (72%)' }
  ],
  departments: [
    { rank: 1, name: '컨설팅본부', subtext: '총 38명 · 7.85M Token', metric: '7,850,000 Token', percentage: 31.6, tag: '위험 (98%)' },
    { rank: 2, name: 'AI사업본부', subtext: '총 30명 · 5.20M Token', metric: '5,200,000 Token', percentage: 21.0, tag: '정상 (52%)' },
    { rank: 3, name: '교육사업팀', subtext: '총 18명 · 3.70M Token', metric: '3,700,000 Token', percentage: 14.9, tag: '주의 (92%)' },
    { rank: 4, name: '경영기획팀', subtext: '총 24명 · 3.20M Token', metric: '3,200,000 Token', percentage: 12.9, tag: '정상 (64%)' },
    { rank: 5, name: '글로벌협력처', subtext: '총 14명 · 2.55M Token', metric: '2,550,000 Token', percentage: 10.3, tag: '주의 (85%)' }
  ],
  agents: [
    { rank: 1, name: '제안서 전략 분석 및 초안 생성 Agent', subtext: 'AI Agent · RFP-DOC-001', metric: '4,280,000 Token', percentage: 38.2, tag: '급증 +142%' },
    { rank: 2, name: '사내 규정 및 감사 컴퍼스 검색 Agent', subtext: 'AI Agent · SEARCH-002', metric: '1,980,000 Token', percentage: 29.3, tag: '인기' },
    { rank: 3, name: '주간 업무보고 자동 집계 Agent', subtext: 'AI Agent · DOC-003', metric: '820,000 Token', percentage: 12.5, tag: '정상' },
    { rank: 4, name: '공공 교육 과정 기획 Agent', subtext: 'AI Agent · EDU-004', metric: '760,000 Token', percentage: 10.8, tag: '정상' },
    { rank: 5, name: '과업지시서 필수요건 추출기', subtext: 'AI Agent · RFP-EXT-005', metric: '610,000 Token', percentage: 9.2, tag: '정상' }
  ],
  customAi: [
    { rank: 1, name: 'DADAM 회의록 요약 시스템', subtext: 'Custom AI · DADAM-v2.1', metric: '1,760,000 Token', percentage: 41.5, tag: '인기' },
    { rank: 2, name: 'DARUDA 다국어 문서 번역', subtext: 'Custom AI · DARUDA-v3.1', metric: '1,120,000 Token', percentage: 28.4, tag: '추천' },
    { rank: 3, name: 'DAOM 비정형 문서 OCR 추출기', subtext: 'Custom AI · DAOM-v2.4', metric: '880,000 Token', percentage: 20.8, tag: '정상' },
    { rank: 4, name: 'RFP 수주 적합도 심층 판정 코크핏', subtext: 'Custom AI · RFP-EVAL', metric: '470,000 Token', percentage: 9.3, tag: '정상' }
  ],
  models: [
    { rank: 1, name: 'GPT Enterprise', subtext: 'OpenAI · GPT-4o Enterprise', metric: '10,420,000 Token', percentage: 42.0, tag: '비용 42%' },
    { rank: 2, name: 'Claude Enterprise', subtext: 'Anthropic · Claude 3.5 Sonnet', metric: '7,690,000 Token', percentage: 31.0, tag: '비용 31%' },
    { rank: 3, name: 'Gemini 2.5 Pro / Flash', subtext: 'Google Cloud · 멀티모달', metric: '4,460,000 Token', percentage: 18.0, tag: '비용 18%' },
    { rank: 4, name: 'HyperCLOVA X & 온프레미스', subtext: 'Naver / KPC 내부망', metric: '2,250,000 Token', percentage: 9.0, tag: '비용 9%' }
  ]
};

// ==========================================
// 2. 사용자 및 조직 관리 (Entra ID 기반)
// ==========================================
export const INITIAL_ENTRA_USERS: EntraUserAccount[] = [
  {
    id: 'usr-001',
    name: '정소담',
    email: 'jeongsodam0108@gmail.com',
    department: 'AI사업본부',
    role: '플랫폼 관리자',
    permissions: ['ALL_PERMISSIONS', 'MODEL_ADMIN', 'TOKEN_APPROVER', 'AGENT_ADMIN'],
    usedTokens: 72430,
    monthlyQuota: 200000,
    status: '활성',
    lastLogin: '2026.09.13 16:32 (현재 세션)',
    allowedAi: ['Knowledge AI', 'AI Worker', '제안서 생성', 'Custom AI', 'AI Agent', 'Community'],
    allowedLlms: ['GPT Enterprise', 'Claude Enterprise', 'Gemini 2.5 Pro', 'Gemini 2.5 Flash', 'HyperCLOVA X', 'KPC On-Premise'],
    entraGroupId: 'ENTRA-GRP-AI-ADMINS'
  },
  {
    id: 'usr-002',
    name: '김민수',
    email: 'mskim@kpc.or.kr',
    department: '경영기획팀',
    role: '부서 관리자',
    permissions: ['DEPT_TOKEN_VIEW', 'MEMBER_MANAGEMENT', 'AI_VIEW'],
    usedTokens: 98200,
    monthlyQuota: 100000,
    status: '활성',
    lastLogin: '2026.09.13 15:40',
    allowedAi: ['Knowledge AI', 'AI Worker', 'Custom AI', 'Community'],
    allowedLlms: ['GPT Enterprise', 'Gemini 2.5 Flash', 'HyperCLOVA X'],
    entraGroupId: 'ENTRA-GRP-MGMT-LEADERS'
  },
  {
    id: 'usr-003',
    name: '이서연',
    email: 'sylee@kpc.or.kr',
    department: '교육사업팀',
    role: 'AI 제작자',
    permissions: ['AGENT_CREATE', 'CUSTOM_AI_CREATE', 'PROMPT_TEST'],
    usedTokens: 98000,
    monthlyQuota: 100000,
    status: '활성',
    lastLogin: '2026.09.13 14:15',
    allowedAi: ['Knowledge AI', 'AI Worker', 'Custom AI', 'AI Agent', 'Community'],
    allowedLlms: ['GPT Enterprise', 'Claude Enterprise', 'Gemini 2.5 Pro'],
    entraGroupId: 'ENTRA-GRP-EDU-BIZ'
  },
  {
    id: 'usr-004',
    name: '박지훈',
    email: 'jhpark@kpc.or.kr',
    department: '컨설팅본부',
    role: '일반 사용자',
    permissions: ['BASIC_AI_USE', 'PROPOSAL_VIEW'],
    usedTokens: 100000,
    monthlyQuota: 100000,
    status: '비활성', // 사용 제한 초과
    lastLogin: '2026.09.13 13:00',
    allowedAi: ['Knowledge AI', 'AI Worker', '제안서 생성'],
    allowedLlms: ['GPT Enterprise', 'Gemini 2.5 Pro'],
    entraGroupId: 'ENTRA-GRP-CONSULTING'
  },
  {
    id: 'usr-005',
    name: '최유진',
    email: 'yjchoi@kpc.or.kr',
    department: '생산성혁신TF',
    role: 'AI 제작자',
    permissions: ['AGENT_CREATE', 'CUSTOM_AI_CREATE'],
    usedTokens: 45000,
    monthlyQuota: 100000,
    status: '활성',
    lastLogin: '2026.09.13 11:20',
    allowedAi: ['Knowledge AI', 'AI Worker', 'Custom AI', 'AI Agent', 'Community'],
    allowedLlms: ['GPT Enterprise', 'Gemini 2.5 Flash'],
    entraGroupId: 'ENTRA-GRP-INNOVATION-TF'
  },
  {
    id: 'usr-006',
    name: '강동원',
    email: 'dwkang@kpc.or.kr',
    department: '글로벌협력처',
    role: '일반 사용자',
    permissions: ['BASIC_AI_USE', 'TRANSLATE_SPECIAL'],
    usedTokens: 96000,
    monthlyQuota: 100000,
    status: '활성',
    lastLogin: '2026.09.13 09:45',
    allowedAi: ['Knowledge AI', 'AI Worker', 'Custom AI'],
    allowedLlms: ['Claude Enterprise', 'Gemini 2.5 Flash'],
    entraGroupId: 'ENTRA-GRP-GLOBAL-AFFAIRS'
  },
  {
    id: 'usr-007',
    name: '마이클 리',
    email: 'ext.mlee@partner.kpc.or.kr',
    department: '외부 제휴컨설턴트',
    role: '외부 사용자',
    permissions: ['RESTRICTED_RFP_USE'],
    usedTokens: 32000,
    monthlyQuota: 50000,
    status: '활성',
    lastLogin: '2026.09.12 18:20',
    allowedAi: ['제안서 생성 (제한적)'],
    allowedLlms: ['KPC On-Premise', 'Gemini 2.5 Flash'],
    entraGroupId: 'ENTRA-GRP-EXT-PARTNERS'
  }
];

export const INITIAL_ORG_TEAMS: OrgTeamPolicy[] = [
  {
    id: 'team-001',
    teamName: '경영기획팀',
    entraGroupName: 'KPC-SG-MGMT-STRATEGY',
    memberCount: 24,
    monthlyTokenQuota: 5000000,
    usedTokens: 3200000,
    costBudgetKrw: 400000,
    defaultRole: '일반 사용자',
    allowedModels: ['GPT Enterprise', 'Gemini 2.5 Flash', 'HyperCLOVA X'],
    status: '정상'
  },
  {
    id: 'team-002',
    teamName: '교육사업팀',
    entraGroupName: 'KPC-SG-EDU-DEVELOPMENT',
    memberCount: 18,
    monthlyTokenQuota: 10000000,
    usedTokens: 9200000,
    costBudgetKrw: 800000,
    defaultRole: 'AI 제작자',
    allowedModels: ['GPT Enterprise', 'Claude Enterprise', 'Gemini 2.5 Flash'],
    status: '주의'
  },
  {
    id: 'team-003',
    teamName: '컨설팅본부',
    entraGroupName: 'KPC-SG-CONSULTING-BIZ',
    memberCount: 38,
    monthlyTokenQuota: 8000000,
    usedTokens: 7850000,
    costBudgetKrw: 700000,
    defaultRole: '일반 사용자',
    allowedModels: ['GPT Enterprise', 'Gemini 2.5 Pro'],
    status: '위험'
  },
  {
    id: 'team-004',
    teamName: 'AI사업본부',
    entraGroupName: 'KPC-SG-AI-INNOVATION',
    memberCount: 30,
    monthlyTokenQuota: 15000000,
    usedTokens: 6200000,
    costBudgetKrw: 1200000,
    defaultRole: 'AI 제작자',
    allowedModels: ['GPT Enterprise', 'Claude Enterprise', 'Gemini 2.5 Pro', 'Gemini 2.5 Flash', 'HyperCLOVA X', 'KPC On-Premise'],
    status: '정상'
  },
  {
    id: 'team-005',
    teamName: '글로벌협력처',
    entraGroupName: 'KPC-SG-GLOBAL-COOP',
    memberCount: 14,
    monthlyTokenQuota: 3000000,
    usedTokens: 2550000,
    costBudgetKrw: 250000,
    defaultRole: '일반 사용자',
    allowedModels: ['Claude Enterprise', 'Gemini 2.5 Flash'],
    status: '주의'
  }
];

// ==========================================
// 3. AI 사용량 및 비용 관리 데이터
// ==========================================
export const INITIAL_USAGE_BREAKDOWNS: Record<'all' | 'users' | 'teams' | 'models' | 'agents' | 'custom_ai', UsageBreakdownItem[]> = {
  all: [
    {
      id: 'usg-all-1',
      name: '제안서 생성 Agent (RFP 특화)',
      category: 'AI Agent',
      callsCount: 34200,
      inputTokens: 2850000,
      outputTokens: 1430000,
      totalTokens: 4280000,
      estimatedCostKrw: 420000,
      momChangeRate: 142.5,
      isSurging: true
    },
    {
      id: 'usg-all-2',
      name: 'GPT Enterprise (전사 호출)',
      category: 'LLM Model',
      callsCount: 48200,
      inputTokens: 6800000,
      outputTokens: 3620000,
      totalTokens: 10420000,
      estimatedCostKrw: 622440,
      momChangeRate: 24.1,
      isSurging: false
    },
    {
      id: 'usg-all-3',
      name: 'DADAM 회의록 요약 시스템',
      category: 'Custom AI',
      callsCount: 14500,
      inputTokens: 1250000,
      outputTokens: 510000,
      totalTokens: 1760000,
      estimatedCostKrw: 128000,
      momChangeRate: 88.3,
      isSurging: true
    },
    {
      id: 'usg-all-4',
      name: '사내 규정 및 감사 컴퍼스 검색',
      category: 'AI Agent',
      callsCount: 18200,
      inputTokens: 1420000,
      outputTokens: 560000,
      totalTokens: 1980000,
      estimatedCostKrw: 145000,
      momChangeRate: 15.2,
      isSurging: false
    },
    {
      id: 'usg-all-5',
      name: 'Claude Enterprise (심층 작성)',
      category: 'LLM Model',
      callsCount: 31400,
      inputTokens: 4900000,
      outputTokens: 2790000,
      totalTokens: 7690000,
      estimatedCostKrw: 459420,
      momChangeRate: 18.7,
      isSurging: false
    }
  ],
  users: [
    {
      id: 'usg-usr-1',
      name: '박지훈 책임 (컨설팅본부)',
      category: '사용자',
      callsCount: 1820,
      inputTokens: 68000,
      outputTokens: 32000,
      totalTokens: 100000,
      estimatedCostKrw: 14200,
      momChangeRate: 98.4,
      isSurging: true
    },
    {
      id: 'usg-usr-2',
      name: '이서연 선임 (교육사업팀)',
      category: '사용자',
      callsCount: 1650,
      inputTokens: 66000,
      outputTokens: 32000,
      totalTokens: 98000,
      estimatedCostKrw: 13800,
      momChangeRate: 112.0,
      isSurging: true
    },
    {
      id: 'usg-usr-3',
      name: '강동원 과장 (글로벌협력처)',
      category: '사용자',
      callsCount: 1420,
      inputTokens: 64000,
      outputTokens: 32000,
      totalTokens: 96000,
      estimatedCostKrw: 12500,
      momChangeRate: 45.2,
      isSurging: false
    },
    {
      id: 'usg-usr-4',
      name: '정소담 수석 (AI사업본부)',
      category: '사용자',
      callsCount: 2840,
      inputTokens: 48000,
      outputTokens: 24430,
      totalTokens: 72430,
      estimatedCostKrw: 9800,
      momChangeRate: 8.5,
      isSurging: false
    }
  ],
  teams: [
    {
      id: 'usg-tm-1',
      name: '컨설팅본부',
      category: '부서',
      callsCount: 38200,
      inputTokens: 5200000,
      outputTokens: 2650000,
      totalTokens: 7850000,
      estimatedCostKrw: 485000,
      momChangeRate: 74.2,
      isSurging: true
    },
    {
      id: 'usg-tm-2',
      name: '교육사업팀',
      category: '부서',
      callsCount: 24500,
      inputTokens: 2500000,
      outputTokens: 1200000,
      totalTokens: 3700000,
      estimatedCostKrw: 220000,
      momChangeRate: 68.0,
      isSurging: false
    },
    {
      id: 'usg-tm-3',
      name: 'AI사업본부',
      category: '부서',
      callsCount: 42000,
      inputTokens: 3600000,
      outputTokens: 1600000,
      totalTokens: 5200000,
      estimatedCostKrw: 310000,
      momChangeRate: 12.0,
      isSurging: false
    }
  ],
  models: [
    {
      id: 'usg-mdl-1',
      name: 'GPT Enterprise (GPT-4o)',
      category: '모델',
      callsCount: 48200,
      inputTokens: 6800000,
      outputTokens: 3620000,
      totalTokens: 10420000,
      estimatedCostKrw: 622440,
      momChangeRate: 24.1,
      isSurging: false
    },
    {
      id: 'usg-mdl-2',
      name: 'Claude Enterprise (3.5 Sonnet)',
      category: '모델',
      callsCount: 31400,
      inputTokens: 4900000,
      outputTokens: 2790000,
      totalTokens: 7690000,
      estimatedCostKrw: 459420,
      momChangeRate: 18.7,
      isSurging: false
    },
    {
      id: 'usg-mdl-3',
      name: 'Gemini 2.5 Pro / Flash',
      category: '모델',
      callsCount: 54100,
      inputTokens: 3100000,
      outputTokens: 1360000,
      totalTokens: 4460000,
      estimatedCostKrw: 266760,
      momChangeRate: 42.0,
      isSurging: false
    }
  ],
  agents: [
    {
      id: 'usg-ag-1',
      name: '제안서 전략 분석 및 초안 생성 Agent',
      category: 'AI Agent',
      callsCount: 34200,
      inputTokens: 2850000,
      outputTokens: 1430000,
      totalTokens: 4280000,
      estimatedCostKrw: 420000,
      momChangeRate: 142.5,
      isSurging: true
    },
    {
      id: 'usg-ag-2',
      name: '사내 규정 및 감사 컴퍼스 검색 Agent',
      category: 'AI Agent',
      callsCount: 18200,
      inputTokens: 1420000,
      outputTokens: 560000,
      totalTokens: 1980000,
      estimatedCostKrw: 145000,
      momChangeRate: 15.2,
      isSurging: false
    }
  ],
  custom_ai: [
    {
      id: 'usg-cai-1',
      name: 'DADAM 회의록 요약 시스템',
      category: 'Custom AI',
      callsCount: 14500,
      inputTokens: 1250000,
      outputTokens: 510000,
      totalTokens: 1760000,
      estimatedCostKrw: 128000,
      momChangeRate: 88.3,
      isSurging: true
    },
    {
      id: 'usg-cai-2',
      name: 'DARUDA 다국어 문서 번역',
      category: 'Custom AI',
      callsCount: 9800,
      inputTokens: 780000,
      outputTokens: 340000,
      totalTokens: 1120000,
      estimatedCostKrw: 84000,
      momChangeRate: 31.0,
      isSurging: false
    }
  ]
};

// ==========================================
// 4. Token Budget 3단계 계층 관리
// ==========================================
export const INITIAL_PLATFORM_BUDGET: PlatformTokenBudgetConfig = {
  platformMonthlyCostBudgetKrw: 20000000,
  platformCurrentCostKrw: 1482000,
  platformMonthlyTokenQuota: 50000000,
  platformCurrentTokens: 24820000,
  warningThresholds: {
    cautionPercent: 80,
    dangerPercent: 90,
    cutoffPercent: 100
  },
  autoThrottleOnCutoff: true,
  emailAlertToAdmins: true
};

// ==========================================
// 5. 추가 사용량 요청 관리 (대기 5 / 승인 12 / 반려 2)
// ==========================================
export const EXPANDED_TOKEN_REQUESTS: TokenRequest[] = [
  {
    id: 'req-001',
    requesterName: '박지훈',
    team: '컨설팅본부',
    role: '책임컨설턴트',
    currentUsage: 100000,
    existingQuota: 100000,
    requestedAmount: 50000,
    reason: '이번 주 한국산업진흥원 공공 AI 제안서 집중 작성 및 기술요구서 정밀 분석을 위한 긴급 쿼터 충전 필요.',
    requestedAt: '2026.09.13 14:10',
    status: '대기'
  },
  {
    id: 'req-002',
    requesterName: '이서연',
    team: '교육사업팀',
    role: '선임연구원',
    currentUsage: 98000,
    existingQuota: 100000,
    requestedAmount: 50000,
    reason: '4분기 신규 DT 역량 강화 커리큘럼 교재 20종 AI 목차 및 연습문제 일괄 생성 작업 진행 중.',
    requestedAt: '2026.09.13 11:25',
    status: '대기'
  },
  {
    id: 'req-003',
    requesterName: '강동원',
    team: '글로벌협력처',
    role: '과장',
    currentUsage: 96000,
    existingQuota: 100000,
    requestedAmount: 100000,
    reason: 'APO 아시아생산성기구 연례 보고서 영문화 및 다국어 계약서 15건 실시간 대조 번역.',
    requestedAt: '2026.09.12 17:40',
    status: '대기'
  },
  {
    id: 'req-004',
    requesterName: '정동진',
    team: 'AI산업본부',
    role: '책임연구원',
    currentUsage: 88000,
    existingQuota: 100000,
    requestedAmount: 30000,
    reason: '제조 AI 실증 단지 PoC 모델 벤치마킹 데이터 셋 정제 작업 토큰 소진 임박.',
    requestedAt: '2026.09.12 14:00',
    status: '대기'
  },
  {
    id: 'req-005',
    requesterName: '송민지',
    team: '고객경영본부',
    role: '선임컨설턴트',
    currentUsage: 79000,
    existingQuota: 80000,
    requestedAmount: 40000,
    reason: 'CSVOC 고객 클레임 감성 분석 자동화 테스트 및 배치 실행 쿼터 확보.',
    requestedAt: '2026.09.12 10:15',
    status: '대기'
  },
  {
    id: 'req-006',
    requesterName: '윤도현',
    team: 'R&D혁신센터',
    role: '수석연구원',
    currentUsage: 80000,
    existingQuota: 80000,
    requestedAmount: 20000,
    reason: 'KCI 등재 학술논문 생산성 지표 10개년 시계열 텍스트 마이닝 분석.',
    requestedAt: '2026.09.11 09:30',
    status: '승인 완료',
    processedAt: '2026.09.11 10:15',
    processedBy: '관리자 (정소담)',
    approvedAmount: 20000
  },
  {
    id: 'req-007',
    requesterName: '한소희',
    team: '고객경영본부',
    role: '전임연구원',
    currentUsage: 70000,
    existingQuota: 70000,
    requestedAmount: 100000,
    reason: '단순 개인 업무 참고용 프롬프트 테스트 목적.',
    requestedAt: '2026.09.10 16:00',
    status: '반려',
    processedAt: '2026.09.10 16:30',
    processedBy: '관리자 (정소담)',
    approvedAmount: 0
  }
];

// ==========================================
// 6. Multi-LLM 모델 관리
// ==========================================
export const INITIAL_MULTI_LLMS: MultiLlmModelInfo[] = [
  {
    id: 'mdl-gpt-ent',
    name: 'GPT Enterprise',
    provider: 'OpenAI',
    version: 'GPT-4o (2024-11-20)',
    type: 'Enterprise',
    connectionStatus: '정상',
    latencyMs: 142,
    monthlyTokensUsed: 10420000,
    estimatedCostKrw: 622440,
    isActive: true
  },
  {
    id: 'mdl-claude-ent',
    name: 'Claude Enterprise',
    provider: 'Anthropic',
    version: 'Claude 3.5 Sonnet v2',
    type: 'Enterprise',
    connectionStatus: '정상',
    latencyMs: 198,
    monthlyTokensUsed: 7690000,
    estimatedCostKrw: 459420,
    isActive: true
  },
  {
    id: 'mdl-gemini-pro',
    name: 'Gemini 2.5 Pro',
    provider: 'Google Cloud',
    version: 'Gemini 2.5 Pro (Flash Grounding)',
    type: 'Enterprise',
    connectionStatus: '정상',
    latencyMs: 110,
    monthlyTokensUsed: 4200000,
    estimatedCostKrw: 180000,
    isActive: true
  },
  {
    id: 'mdl-hyperclova-x',
    name: 'HyperCLOVA X',
    provider: 'NAVER Cloud',
    version: 'HCX-003 Enterprise',
    type: 'Commercial',
    connectionStatus: '정상',
    latencyMs: 165,
    monthlyTokensUsed: 1400000,
    estimatedCostKrw: 133380,
    isActive: true
  },
  {
    id: 'mdl-llama-kpc',
    name: 'Llama 3 KPC On-Prem',
    provider: 'KPC 사내 GPU 망분리',
    version: 'Llama-3-70B-Korean-v1.2',
    type: 'Enterprise',
    connectionStatus: '정상',
    latencyMs: 82,
    monthlyTokensUsed: 1110000,
    estimatedCostKrw: 0,
    isActive: true
  }
];

// ==========================================
// 7. API Key / Provider 관리 (마스킹 처리)
// ==========================================
export const INITIAL_PROVIDER_KEYS: ProviderKeyInfo[] = [
  {
    id: 'prov-openai',
    providerName: 'OpenAI',
    logo: 'openai',
    status: '정상 연결',
    usedModels: ['GPT-4o Enterprise', 'GPT-4o-mini', 'text-embedding-3-large'],
    lastApiCallTime: '방금 전 (16:34:10)',
    monthlyTokenCount: 10420000,
    monthlyCostKrw: 622440,
    maskedApiKey: 'sk-proj-••••••••8F2A'
  },
  {
    id: 'prov-anthropic',
    providerName: 'Anthropic',
    logo: 'anthropic',
    status: '정상 연결',
    usedModels: ['Claude 3.5 Sonnet', 'Claude 3.5 Haiku'],
    lastApiCallTime: '2분 전 (16:32:44)',
    monthlyTokenCount: 7690000,
    monthlyCostKrw: 459420,
    maskedApiKey: 'sk-ant-••••••••E79C'
  },
  {
    id: 'prov-google',
    providerName: 'Google Gemini',
    logo: 'google',
    status: '정상 연결',
    usedModels: ['Gemini 2.5 Pro', 'Gemini 2.5 Flash'],
    lastApiCallTime: '방금 전 (16:34:28)',
    monthlyTokenCount: 4460000,
    monthlyCostKrw: 266760,
    maskedApiKey: 'AIzaSy••••••••3M9X'
  },
  {
    id: 'prov-naver',
    providerName: 'HyperCLOVA X',
    logo: 'naver',
    status: '정상 연결',
    usedModels: ['CLOVA Studio HCX-003', 'CLOVA Summary Engine'],
    lastApiCallTime: '15분 전 (16:19:02)',
    monthlyTokenCount: 1400000,
    monthlyCostKrw: 133380,
    maskedApiKey: 'ncp-iam-••••••••4B1Z'
  }
];

// ==========================================
// 8. LLM 라우팅 정책 관리 (조건 -> 모델 -> 우선순위)
// ==========================================
export const INITIAL_ROUTING_RULES: LlmRoutingRule[] = [
  {
    id: 'rule-sec-1',
    ruleName: '민감 / 대외비 데이터 처리',
    conditionType: '데이터 보안 등급',
    conditionDetail: '데이터 등급 = 민감 (🔒 Enterprise LLM Only)',
    targetModel: 'Llama 3 KPC On-Prem & GPT Enterprise',
    priority: 1,
    isActive: true,
    description: '재무 정보, 감사 자료, 개인정보 포함 시 폐쇄망 온프레미스 또는 Enterprise 계약 전용 모델만 강제 라우팅'
  },
  {
    id: 'rule-sec-2',
    ruleName: '사내 내부 업무 데이터 처리',
    conditionType: '데이터 보안 등급',
    conditionDetail: '데이터 등급 = 사내 내부 데이터',
    targetModel: 'GPT Enterprise 우선 (대체: Claude Enterprise)',
    priority: 2,
    isActive: true,
    description: '사내 규정, 주간보고, 회의록 등 내부 자산 가공 시 Enterprise 모델 우선 배정'
  },
  {
    id: 'rule-sec-3',
    ruleName: '공개 / 대외 데이터 처리',
    conditionType: '데이터 보안 등급',
    conditionDetail: '데이터 등급 = 공개 데이터 / 외부 자료',
    targetModel: '상용 LLM 허용 (Gemini 2.5 Flash, HyperCLOVA X 등)',
    priority: 3,
    isActive: true,
    description: '공공 입찰공고 분석, 보도자료 요약 등 대외 공개 자료는 가성비 상용 모델 허용'
  },
  {
    id: 'rule-task-1',
    ruleName: '공공/기업 제안서 작성 특화',
    conditionType: '업무 목적별 라우팅',
    conditionDetail: '서비스 = 제안서 생성 / RFP 분석',
    targetModel: 'GPT Enterprise (고성능 추론 & 표 생성)',
    priority: 4,
    isActive: true,
    description: 'RFP 과업 요구사항 추출 및 제안 전략 매트릭스 도출'
  },
  {
    id: 'rule-task-2',
    ruleName: '대규모 문서 요약 및 RAG 검색',
    conditionType: '업무 목적별 라우팅',
    conditionDetail: '업무 = 대용량 문서 요약 및 멀티모달 OCR',
    targetModel: 'Gemini 2.5 Flash / Pro (긴 컨텍스트 윈도우)',
    priority: 5,
    isActive: true,
    description: '100페이지 이상 비정형 PDF 및 도표 검색 최적화'
  },
  {
    id: 'rule-task-3',
    ruleName: '일반 사내 질의응답 (비용 효율)',
    conditionType: '업무 목적별 라우팅',
    conditionDetail: '단순 질의 및 일상 사무 보조',
    targetModel: '비용 효율 모델 (Gemini 2.5 Flash / Llama On-Prem)',
    priority: 6,
    isActive: true,
    description: '토큰 단가가 가장 저렴한 모델로 자동 디스패치'
  }
];

// ==========================================
// 9. Cost Cap / Rate Limit 관리
// ==========================================
export const INITIAL_COST_CAPS: CostCapRateLimitConfig[] = [
  {
    id: 'cap-gpt-ent',
    modelName: 'GPT Enterprise',
    monthlyCostCapKrw: 5000000,
    currentEstimatedCostKrw: 3820000,
    monthlyTokenCap: 50000000,
    currentTokens: 10420000,
    dailyCallLimit: 50000,
    rpmLimit: 1000,
    perUserRateLimitRpm: 60,
    perTeamMonthlyTokenLimit: 10000000,
    warningStatus: '주의' // 76%
  },
  {
    id: 'cap-claude-ent',
    modelName: 'Claude Enterprise',
    monthlyCostCapKrw: 3000000,
    currentEstimatedCostKrw: 459420,
    monthlyTokenCap: 30000000,
    currentTokens: 7690000,
    dailyCallLimit: 30000,
    rpmLimit: 800,
    perUserRateLimitRpm: 40,
    perTeamMonthlyTokenLimit: 6000000,
    warningStatus: '정상'
  },
  {
    id: 'cap-gemini-pro',
    modelName: 'Gemini 2.5 Pro',
    monthlyCostCapKrw: 2000000,
    currentEstimatedCostKrw: 180000,
    monthlyTokenCap: 40000000,
    currentTokens: 4200000,
    dailyCallLimit: 40000,
    rpmLimit: 1200,
    perUserRateLimitRpm: 80,
    perTeamMonthlyTokenLimit: 8000000,
    warningStatus: '정상'
  },
  {
    id: 'cap-hyperclova',
    modelName: 'HyperCLOVA X',
    monthlyCostCapKrw: 1500000,
    currentEstimatedCostKrw: 133380,
    monthlyTokenCap: 20000000,
    currentTokens: 1400000,
    dailyCallLimit: 20000,
    rpmLimit: 600,
    perUserRateLimitRpm: 30,
    perTeamMonthlyTokenLimit: 3000000,
    warningStatus: '정상'
  }
];

// ==========================================
// 10. 시스템 프롬프트 관리
// ==========================================
export const INITIAL_SYSTEM_PROMPTS: SystemPromptTemplate[] = [
  {
    id: 'prmpt-1',
    serviceName: 'DIA (Knowledge AI)',
    version: 'v3.2',
    author: '관리자 (정소담)',
    updatedAt: '2026.09.14',
    status: '사용 중',
    content: `당신은 한국생산성본부(KPC)의 사내 지식 비서 DIA입니다.
임직원의 업무 생산성 혁신을 위해 사내 규정, 표준 가이드, 프로젝트 이력을 정확하게 검색하여 근거와 함께 답변하십시오.
- 답변 시 반드시 출처 문서명과 조항을 명시하십시오.
- 사외로 유출되면 안 되는 개인정보 및 재무 민감 데이터는 마스킹 처리하십시오.`,
    historyCount: 8
  },
  {
    id: 'prmpt-2',
    serviceName: '제안서 생성 Agent',
    version: 'v2.4',
    author: '관리자 (정소담)',
    updatedAt: '2026.09.13',
    status: '사용 중',
    content: `당신은 KPC 공공/민간 제안서 수주 전략 전문 컨설턴트 Agent입니다.
입력된 공고문 및 제안요청서(RFP)를 바탕으로 다음 항목을 순차 작성하십시오:
1. 사업 배경 및 당위성
2. KPC의 차별화된 수행 전략 및 방법론
3. 상세 추진 일정 및 기대효과
- 문체는 격식 있는 개조식(보고서 스타일)을 유지하십시오.`,
    historyCount: 12
  },
  {
    id: 'prmpt-3',
    serviceName: 'AI Worker (지능형 사원)',
    version: 'v1.8',
    author: '김민수 팀장',
    updatedAt: '2026.09.10',
    status: '사용 중',
    content: `당신은 KPC 부서별 정량/정성 업무를 대행하는 AI Worker입니다.
데이터 취합, 엑셀 표 가공, 회의록 요약, 이메일 초안 작성에 특화되어 있습니다.`,
    historyCount: 5
  },
  {
    id: 'prmpt-4',
    serviceName: 'DADAM 회의록 요약',
    version: 'v2.1',
    author: '이서연 선임',
    updatedAt: '2026.09.08',
    status: '사용 중',
    content: `회의 녹취록 및 텍스트를 분석하여 핵심 결정사항(Decisions), 업무 액션 아이템(Action Items), 담당자 및 기한을 표 형태로 정리하십시오.`,
    historyCount: 4
  }
];

// ==========================================
// 11. AI Agent 관리
// ==========================================
export const INITIAL_MANAGED_AGENTS: ManagedAiAgent[] = [
  {
    id: 'ag-01',
    name: '제안서 전략 분석 및 초안 생성 Agent',
    developer: '정소담 수석',
    department: 'AI사업본부',
    usersCount: 84,
    executionCount: 1420,
    tokensUsed: 4280000,
    estimatedCostKrw: 420000,
    status: '운영 중',
    connectedModel: 'GPT Enterprise',
    connectedSkills: ['RFP_PARSER', 'DOCX_EXPORT', 'BUDGET_CALC'],
    connectedData: ['KPC 과거 3개년 수주 제안서 240건'],
    errorRatePercent: 0.8,
    userRating: 4.8
  },
  {
    id: 'ag-02',
    name: '사내 규정 및 감사 컴퍼스 검색 Agent',
    developer: '박지훈 책임',
    department: '컨설팅본부',
    usersCount: 78,
    executionCount: 1100,
    tokensUsed: 1980000,
    estimatedCostKrw: 145000,
    status: '운영 중',
    connectedModel: 'Gemini 2.5 Pro',
    connectedSkills: ['RAG_COMPASS', 'REGULATION_SEARCH'],
    connectedData: ['KPC 정관, 취업규칙, 감사 매뉴얼'],
    errorRatePercent: 1.2,
    userRating: 4.6
  },
  {
    id: 'ag-03',
    name: '주간 업무보고 자동 집계 Agent',
    developer: '이서연 선임',
    department: '교육사업팀',
    usersCount: 52,
    executionCount: 390,
    tokensUsed: 820000,
    estimatedCostKrw: 49200,
    status: '운영 중',
    connectedModel: 'Gemini 2.5 Flash',
    connectedSkills: ['EXCEL_AGGREGATOR', 'EMAIL_SENDER'],
    connectedData: ['팀별 주간 계획 템플릿'],
    errorRatePercent: 0.4,
    userRating: 4.7
  },
  {
    id: 'ag-04',
    name: 'APO 글로벌 컨퍼런스 영문화 Agent',
    developer: '강동원 과장',
    department: '글로벌협력처',
    usersCount: 22,
    executionCount: 180,
    tokensUsed: 520000,
    estimatedCostKrw: 36000,
    status: '검토 중',
    connectedModel: 'Claude Enterprise',
    connectedSkills: ['TRANSLATION_CHECK', 'FORMAL_EN'],
    connectedData: ['APO 용어집 및 과거 브로슈어'],
    errorRatePercent: 2.1,
    userRating: 4.3
  }
];

// ==========================================
// 12. Custom AI 관리
// ==========================================
export const INITIAL_MANAGED_CUSTOM_AI: ManagedCustomAi[] = [
  {
    id: 'cai-01',
    name: 'DADAM 회의록 요약 시스템',
    creator: '김민수 팀장',
    department: '경영기획팀',
    category: '문서/요약',
    usersCount: 92,
    executionCount: 980,
    tokensUsed: 1760000,
    estimatedCostKrw: 128000,
    status: '운영 중',
    sharingScope: '전사 공개',
    usedModel: 'Gemini 2.5 Flash',
    rating: 4.9,
    promptSummary: '회의록 텍스트 입력 시 결정사항 및 Action Item 표 정리'
  },
  {
    id: 'cai-02',
    name: 'DARUDA 다국어 문서 번역',
    creator: '강동원 과장',
    department: '글로벌협력처',
    category: '번역/글로벌',
    usersCount: 65,
    executionCount: 710,
    tokensUsed: 1120000,
    estimatedCostKrw: 84000,
    status: '운영 중',
    sharingScope: '전사 공개',
    usedModel: 'Claude Enterprise',
    rating: 4.7,
    promptSummary: '공공기관 및 비즈니스 표준 영/일/중 전문 어휘 반영 번역'
  },
  {
    id: 'cai-03',
    name: 'DAOM 비정형 문서 OCR 추출기',
    creator: '정소담 수석',
    department: 'AI사업본부',
    category: '데이터가공',
    usersCount: 45,
    executionCount: 430,
    tokensUsed: 880000,
    estimatedCostKrw: 52800,
    status: '운영 중',
    sharingScope: '전사 공개',
    usedModel: 'Gemini 2.5 Pro',
    rating: 4.8,
    promptSummary: '도표/수식이 포함된 스캔 PDF 및 영수증 구조화 JSON 추출'
  },
  {
    id: 'cai-04',
    name: 'DT 커리큘럼 시험문제 자동 생성기',
    creator: '이서연 선임',
    department: '교육사업팀',
    category: '교육/시험',
    usersCount: 14,
    executionCount: 120,
    tokensUsed: 310000,
    estimatedCostKrw: 18600,
    status: '운영 중',
    sharingScope: '팀 공개',
    usedModel: 'GPT Enterprise',
    rating: 4.4,
    promptSummary: '단원별 객관식/주관식 문제 및 해설 자동 생성'
  }
];

// ==========================================
// 13. AI Community 운영 관리
// ==========================================
export const INITIAL_COMMUNITY_POSTS: CommunityManagedPost[] = [
  {
    id: 'cpost-01',
    title: '공공입찰 RFP 필수요건 자격 적격성 검증 프롬프트 공유',
    author: '박지훈 책임',
    department: '컨설팅본부',
    aiType: 'AI Agent',
    views: 482,
    usesCount: 142,
    likes: 38,
    reportsCount: 0,
    createdAt: '2026.09.11',
    status: '정상'
  },
  {
    id: 'cpost-02',
    title: '교육과정 실습용 파이썬 예제 코드 자동 디버깅 봇',
    author: '이서연 선임',
    department: '교육사업팀',
    aiType: 'Custom AI',
    views: 310,
    usesCount: 88,
    likes: 24,
    reportsCount: 0,
    createdAt: '2026.09.10',
    status: '승격 완료 (Custom AI)'
  },
  {
    id: 'cpost-03',
    title: '해외 APO 회원국 생산성 뉴스레터 브리핑 생성기',
    author: '강동원 과장',
    department: '글로벌협력처',
    aiType: 'Custom AI',
    views: 198,
    usesCount: 45,
    likes: 19,
    reportsCount: 0,
    createdAt: '2026.09.08',
    status: '정상'
  },
  {
    id: 'cpost-04',
    title: '사내 슬랙/팀즈 메신저 잡담성 생성 프롬프트',
    author: '익명 연구원',
    department: '생산성혁신TF',
    aiType: 'Custom AI',
    views: 95,
    usesCount: 12,
    likes: 2,
    reportsCount: 3,
    createdAt: '2026.09.05',
    status: '게시물 숨김'
  }
];

// ==========================================
// 14. Knowledge / RAG 관리 (연결 Source)
// ==========================================
export const INITIAL_RAG_SOURCES: KnowledgeRagSource[] = [
  {
    id: 'rag-1',
    sourceName: 'SharePoint 사내 중앙문서함',
    type: 'SharePoint',
    status: '정상',
    lastSyncedAt: '10분 전 (16:25)',
    docCount: 14200,
    indexingStatus: '최신 (색인 100%)',
    errorCount: 0,
    permissionSyncStatus: 'Entra ID 권한 1:1 매핑 정상'
  },
  {
    id: 'rag-2',
    sourceName: 'OneDrive 부서별 공유 폴더',
    type: 'OneDrive',
    status: '정상',
    lastSyncedAt: '30분 전 (16:05)',
    docCount: 8900,
    indexingStatus: '최신 (색인 100%)',
    errorCount: 0,
    permissionSyncStatus: '동기화 완료'
  },
  {
    id: 'rag-3',
    sourceName: 'Microsoft Teams 채널 파일 저장소',
    type: 'Teams',
    status: '정상',
    lastSyncedAt: '1시간 전 (15:30)',
    docCount: 5400,
    indexingStatus: '최신 (색인 100%)',
    errorCount: 0,
    permissionSyncStatus: '팀즈 채널 멤버십 자동 상속'
  },
  {
    id: 'rag-4',
    sourceName: 'KPC 내부 규정 및 감사 편람',
    type: 'KPC 내부 문서',
    status: '정상',
    lastSyncedAt: '오늘 06:00 (일일 배치)',
    docCount: 1850,
    indexingStatus: '최신 (색인 100%)',
    errorCount: 0,
    permissionSyncStatus: '전사 공개 열람 규정'
  },
  {
    id: 'rag-5',
    sourceName: 'KPC 교육 포털 및 LMS 커리큘럼 DB',
    type: '교육 시스템',
    status: '점검 필요',
    lastSyncedAt: '어제 22:00',
    docCount: 3200,
    indexingStatus: '색인 94% (4건 인덱싱 대기)',
    errorCount: 4,
    permissionSyncStatus: '일부 강사 DB 타임아웃'
  },
  {
    id: 'rag-6',
    sourceName: '이러닝 콘텐츠 아카이브',
    type: '이러닝 시스템',
    status: '정상',
    lastSyncedAt: '오늘 08:30',
    docCount: 4100,
    indexingStatus: '최신 (색인 100%)',
    errorCount: 0,
    permissionSyncStatus: '동기화 완료'
  },
  {
    id: 'rag-7',
    sourceName: '국가공인 자격검정 문항 아카이브',
    type: '자격 시스템',
    status: '정상',
    lastSyncedAt: '오늘 09:00',
    docCount: 6500,
    indexingStatus: '최신 (색인 100%)',
    errorCount: 0,
    permissionSyncStatus: '🔒 최고 등급 보안 망분리'
  },
  {
    id: 'rag-8',
    sourceName: 'ERP 회계/사업 실적 시스템',
    type: 'ERP',
    status: '정상',
    lastSyncedAt: '오늘 15:00',
    docCount: 980,
    indexingStatus: '최신 (색인 100%)',
    errorCount: 0,
    permissionSyncStatus: '🔒 재무 권한자 한정 조회'
  }
];

// ==========================================
// 15. 시스템 연계 / 커넥터 관리
// ==========================================
export const INITIAL_SYSTEM_CONNECTORS: SystemConnectorItem[] = [
  {
    id: 'conn-1',
    name: 'Microsoft 365 Entra ID Gateway',
    status: '정상',
    apiStatus: 'HTTP 200 OK (OAuth2.0)',
    lastCallTime: '방금 전 (16:34:50)',
    avgLatencyMs: 45,
    errorCountLast24h: 0,
    description: '사내 SSO 인증 및 임직원 조직도, 이메일, 캘린더 실시간 연동'
  },
  {
    id: 'conn-2',
    name: 'Microsoft SharePoint Online Graph API',
    status: '정상',
    apiStatus: 'HTTP 200 OK',
    lastCallTime: '2분 전 (16:33:10)',
    avgLatencyMs: 110,
    errorCountLast24h: 0,
    description: '전사 문서 라이브러리 실시간 웹훅 인덱싱'
  },
  {
    id: 'conn-3',
    name: 'Microsoft Teams Webhook Connector',
    status: '정상',
    apiStatus: 'HTTP 200 OK',
    lastCallTime: '5분 전 (16:30:15)',
    avgLatencyMs: 85,
    errorCountLast24h: 0,
    description: '부서별 업무 알림 및 회의록 수집 봇 상호작용'
  },
  {
    id: 'conn-4',
    name: 'KPC ERP Gateway (SAP 연계)',
    status: '정상',
    apiStatus: 'HTTP 200 OK (mTLS)',
    lastCallTime: '15분 전 (16:20:00)',
    avgLatencyMs: 240,
    errorCountLast24h: 1,
    description: '프로젝트 코드 매핑 및 사업비·예산 정산 정보 검증'
  },
  {
    id: 'conn-5',
    name: 'KPC 교육정보망 API 서버',
    status: '점검 필요',
    apiStatus: 'HTTP 504 Gateway Timeout (간헐적)',
    lastCallTime: '25분 전 (16:10:22)',
    avgLatencyMs: 820,
    errorCountLast24h: 4,
    description: '수강생 명단 및 연간 교육 커리큘럼 데이터베이스'
  }
];

// ==========================================
// 16. 보안 및 접근 정책
// ==========================================
export const INITIAL_SECURITY_POLICY: SecurityAccessPolicyConfig = {
  adminRolesCount: 3,
  userRolesCount: 5,
  dataClassifications: [
    {
      level: '민감',
      badgeColor: 'red',
      policyDescription: '🔒 Enterprise LLM Only (또는 사내 온프레미스 망분리 모델 강제)',
      appliedModels: ['Llama 3 KPC On-Prem', 'GPT Enterprise (Azure Gov)']
    },
    {
      level: '내부',
      badgeColor: 'amber',
      policyDescription: 'Enterprise LLM 우선 사용 (외부 상용 LLM 데이터 재학습 차단)',
      appliedModels: ['GPT Enterprise', 'Claude Enterprise', 'Gemini Enterprise']
    },
    {
      level: '공개',
      badgeColor: 'emerald',
      policyDescription: '일반 상용 LLM 사용 가능 (가성비 최우선 자동 라우팅)',
      appliedModels: ['Gemini 2.5 Flash', 'HyperCLOVA X']
    }
  ],
  agentPublishPolicy: '관리자 보안 검수 승인 후 전사 배포 (미승인 시 팀 비공개)',
  customAiPublishPolicy: '팀 단위 자유 공유 가능, 전사 공개 시 관리자 검토 필수',
  externalLlmDataTransmissionBlock: true
};

// ==========================================
// 17. Audit Log / 활동 기록
// ==========================================
export const EXPANDED_AUDIT_LOGS: DetailedAuditLogEntry[] = [
  {
    id: 'log-01',
    time: '16:32:10',
    userName: '관리자 (정소담)',
    action: '토큰 추가 승인',
    target: '윤도현 수석 (+20,000 Token)',
    result: '성공',
    clientIp: '10.20.101.45',
    category: '토큰 관리'
  },
  {
    id: 'log-02',
    time: '16:25:40',
    userName: '정소담 수석',
    action: 'AI Agent 등록 및 배포',
    target: '제안서 전략 분석 및 초안 생성 Agent v2.4',
    result: '성공',
    clientIp: '10.20.101.45',
    category: 'Agent 관리'
  },
  {
    id: 'log-03',
    time: '16:15:02',
    userName: '관리자 (정소담)',
    action: 'System Prompt 수정',
    target: 'DIA (Knowledge AI) v3.2 가이드라인 반영',
    result: '성공',
    clientIp: '10.20.101.45',
    category: '프롬프트 관리'
  },
  {
    id: 'log-04',
    time: '15:48:19',
    userName: '박지훈 책임',
    action: 'ERP 회계 데이터 접근 시도',
    target: '재무제표 원장 DB (권한 부족)',
    result: '차단 (Security Rule)',
    clientIp: '10.20.104.12',
    category: '보안 정책'
  },
  {
    id: 'log-05',
    time: '15:20:00',
    userName: '시스템 자동 봇',
    action: 'Rate Limit 초과 감지',
    target: '교육사업팀 일일 RPM 한도 80% 도달 경고',
    result: '성공',
    clientIp: '127.0.0.1 (Internal)',
    category: '비용/한도'
  },
  {
    id: 'log-06',
    time: '14:50:33',
    userName: '이서연 선임',
    action: '토큰 증액 신청',
    target: '+50,000 Token (사유: 교재 제작)',
    result: '성공',
    clientIp: '10.20.102.88',
    category: '토큰 관리'
  },
  {
    id: 'log-07',
    time: '14:10:05',
    userName: '관리자 (정소담)',
    action: 'API Key 연결 테스트',
    target: 'OpenAI Enterprise Provider (Latency 142ms)',
    result: '성공',
    clientIp: '10.20.101.45',
    category: 'API 관리'
  }
];

// ==========================================
// 18. 사용자 피드백 / AI 품질 관리
// ==========================================
export const INITIAL_USER_FEEDBACK: AiUserFeedbackItem[] = [
  {
    id: 'fb-01',
    serviceName: 'DIA (Knowledge AI)',
    positiveRate: 91,
    totalRatings: 520,
    negativeCount: 47,
    needsQualityImprovement: false,
    recentNegativeFeedback: [
      {
        id: 'nfb-1',
        query: '2026년도 사내 출장비 일비 기준이 얼마인가요?',
        answerSnippet: '2024년도 기준으로 30,000원입니다... (구 규정 인용)',
        reason: '최신 2026년 개정 여비 규정이 반영되지 않고 2년 전 규정 문서를 인용함',
        userName: '최유진 선임',
        timestamp: '2026.09.13 14:20'
      }
    ]
  },
  {
    id: 'fb-02',
    serviceName: '제안서 생성 Agent',
    positiveRate: 88,
    totalRatings: 430,
    negativeCount: 51,
    needsQualityImprovement: false,
    recentNegativeFeedback: [
      {
        id: 'nfb-2',
        query: '한국지역난방공사 에너지 효율화 RFP 기술수행방안 작성해줘',
        answerSnippet: '일반적인 공공 IT 클라우드 전환 방안을 서술...',
        reason: '발주처의 특수 에너지 도메인 요건 대신 일반 SI 템플릿 문구가 출력됨',
        userName: '박지훈 책임',
        timestamp: '2026.09.12 16:45'
      }
    ]
  },
  {
    id: 'fb-03',
    serviceName: '사내 규정 및 감사 컴퍼스 검색',
    positiveRate: 72,
    totalRatings: 334,
    negativeCount: 69,
    needsQualityImprovement: true, // 품질 개선 필요 Badge
    recentNegativeFeedback: [
      {
        id: 'nfb-3',
        query: '연구비 법인카드 주말 사용 시 사전 품의 양식과 첨부 증빙은?',
        answerSnippet: '해당 규정을 찾을 수 없습니다. 총무팀에 직접 문의하세요.',
        reason: '문서가 존재함에도 검색 RAG 임베딩 매칭 실패로 답변 거부',
        userName: '김민수 팀장',
        timestamp: '2026.09.13 10:12'
      }
    ]
  }
];

// ==========================================
// 19. AI 품질 / 성능 모니터링
// ==========================================
export const INITIAL_AI_QUALITY_METRICS: AiQualityPerformanceMetric[] = [
  {
    id: 'q-gpt-ent',
    targetName: 'GPT Enterprise',
    type: 'Model',
    avgResponseTimeSec: 4.2,
    successRatePercent: 99.4,
    errorRatePercent: 0.6,
    userSatisfactionScore: 89,
    avgTokensPerCall: 216,
    groundingAccuracyScore: 92,
    sourceCitationRate: 95
  },
  {
    id: 'q-gemini-flash',
    targetName: 'Gemini 2.5 Flash',
    type: 'Model',
    avgResponseTimeSec: 1.8,
    successRatePercent: 99.8,
    errorRatePercent: 0.2,
    userSatisfactionScore: 85,
    avgTokensPerCall: 180,
    groundingAccuracyScore: 88,
    sourceCitationRate: 90
  },
  {
    id: 'q-claude-ent',
    targetName: 'Claude Enterprise',
    type: 'Model',
    avgResponseTimeSec: 3.6,
    successRatePercent: 99.1,
    errorRatePercent: 0.9,
    userSatisfactionScore: 91,
    avgTokensPerCall: 245,
    groundingAccuracyScore: 94,
    sourceCitationRate: 96
  },
  {
    id: 'q-ag-rfp',
    targetName: '제안서 생성 Agent',
    type: 'Agent',
    avgResponseTimeSec: 6.5,
    successRatePercent: 98.8,
    errorRatePercent: 1.2,
    userSatisfactionScore: 88,
    avgTokensPerCall: 1250,
    groundingAccuracyScore: 91,
    sourceCitationRate: 98
  }
];
