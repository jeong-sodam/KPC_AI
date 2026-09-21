import { 
  UserTokenAllocation, 
  TeamTokenBudget, 
  TokenRequest, 
  AiProviderApiKey, 
  AiModelPolicy,
  AdminDashboardKpis,
  UsageTrendPoint,
  UsageRankingItem,
  AuditLogItem
} from '../types';

export const INITIAL_DASHBOARD_KPIS: AdminDashboardKpis = {
  totalTokensUsed: 24820000,
  totalTokensQuota: 50000000,
  estimatedCostKrw: 1482000,
  costBudgetKrw: 3000000,
  activeUsers: 148,
  totalUsers: 210,
  activeAgents: 18,
  activeCustomAi: 6,
  pendingTokenRequests: 3
};

export const INITIAL_USER_ALLOCATIONS: UserTokenAllocation[] = [
  {
    id: 'user-001',
    name: '정소담',
    team: 'AI사업본부',
    role: '수석연구원 (나)',
    email: 'jeongsodam0108@gmail.com',
    usedTokens: 72430,
    totalQuota: 100000,
    remainingTokens: 27570,
    dailyLimit: 15000,
    dailyUsed: 6200,
    allowedModels: ['GPT Enterprise', 'Claude Enterprise', 'Gemini 2.5 Pro', 'Gemini 2.5 Flash', 'HyperCLOVA X'],
    allowedAgents: ['ALL'],
    status: '정상',
    isThrottled: false,
    lastActive: '방금 전'
  },
  {
    id: 'user-002',
    name: '김민수',
    team: '경영기획팀',
    role: '팀장',
    email: 'mskim@kpc.or.kr',
    usedTokens: 72000,
    totalQuota: 100000,
    remainingTokens: 28000,
    dailyLimit: 10000,
    dailyUsed: 4500,
    allowedModels: ['GPT Enterprise', 'Gemini 2.5 Flash'],
    allowedAgents: ['ALL'],
    status: '정상',
    isThrottled: false,
    lastActive: '12분 전'
  },
  {
    id: 'user-003',
    name: '이서연',
    team: '교육사업팀',
    role: '선임연구원',
    email: 'sylee@kpc.or.kr',
    usedTokens: 98000,
    totalQuota: 100000,
    remainingTokens: 2000,
    dailyLimit: 10000,
    dailyUsed: 9800,
    allowedModels: ['GPT Enterprise', 'Claude Enterprise'],
    allowedAgents: ['ALL'],
    status: '주의',
    isThrottled: false,
    lastActive: '25분 전'
  },
  {
    id: 'user-004',
    name: '박지훈',
    team: '컨설팅본부',
    role: '책임컨설턴트',
    email: 'jhpark@kpc.or.kr',
    usedTokens: 100000,
    totalQuota: 100000,
    remainingTokens: 0,
    dailyLimit: 12000,
    dailyUsed: 12000,
    allowedModels: ['GPT Enterprise', 'Gemini 2.5 Pro'],
    allowedAgents: ['ALL'],
    status: '사용 제한',
    isThrottled: true,
    lastActive: '1시간 전'
  },
  {
    id: 'user-005',
    name: '최유진',
    team: '생산성혁신TF',
    role: '선임연구원',
    email: 'yjchoi@kpc.or.kr',
    usedTokens: 45000,
    totalQuota: 80000,
    remainingTokens: 35000,
    dailyLimit: 8000,
    dailyUsed: 3100,
    allowedModels: ['Gemini 2.5 Flash', 'HyperCLOVA X'],
    allowedAgents: ['ALL'],
    status: '정상',
    isThrottled: false,
    lastActive: '3시간 전'
  },
  {
    id: 'user-006',
    name: '강동원',
    team: '글로벌협력처',
    role: '과장',
    email: 'dwkang@kpc.or.kr',
    usedTokens: 96000,
    totalQuota: 100000,
    remainingTokens: 4000,
    dailyLimit: 10000,
    dailyUsed: 9500,
    allowedModels: ['Claude Enterprise', 'GPT Enterprise'],
    allowedAgents: ['ALL'],
    status: '위험',
    isThrottled: false,
    lastActive: '10분 전'
  }
];

export const INITIAL_TEAM_BUDGETS: TeamTokenBudget[] = [
  {
    id: 'team-001',
    teamName: '경영기획팀',
    monthlyQuota: 5000000,
    usedTokens: 3200000,
    memberCount: 24,
    usageRate: 64,
    status: '정상',
    topModel: 'GPT Enterprise'
  },
  {
    id: 'team-002',
    teamName: '교육사업팀',
    monthlyQuota: 4000000,
    usedTokens: 3700000,
    memberCount: 18,
    usageRate: 92,
    status: '주의',
    topModel: 'Claude Enterprise'
  },
  {
    id: 'team-003',
    teamName: '컨설팅본부',
    monthlyQuota: 8000000,
    usedTokens: 7850000,
    memberCount: 38,
    usageRate: 98,
    status: '위험',
    topModel: 'Gemini 2.5 Pro'
  },
  {
    id: 'team-004',
    teamName: 'AI사업본부',
    monthlyQuota: 10000000,
    usedTokens: 5200000,
    memberCount: 30,
    usageRate: 52,
    status: '정상',
    topModel: 'Gemini 2.5 Flash'
  },
  {
    id: 'team-005',
    teamName: '글로벌협력처',
    monthlyQuota: 3000000,
    usedTokens: 2550000,
    memberCount: 14,
    usageRate: 85,
    status: '주의',
    topModel: 'Claude Enterprise'
  }
];

export const INITIAL_TOKEN_REQUESTS: TokenRequest[] = [
  {
    id: 'req-minsu',
    requesterName: '김민수',
    team: '경영기획팀',
    role: '팀장',
    currentUsage: 98200,
    existingQuota: 100000,
    requestedAmount: 50000,
    reason: '제안서 작성 업무를 위해 추가 AI 사용량이 필요합니다.',
    requestedAt: '2026.09.13 15:30',
    status: '대기'
  },
  {
    id: 'req-001',
    requesterName: '박지훈',
    team: '컨설팅본부',
    role: '책임컨설턴트',
    currentUsage: 100000,
    existingQuota: 100000,
    requestedAmount: 50000,
    reason: '이번 주 한국산업진흥원 공공 AI 제안서 집중 작성 및 기술 요구서 정밀 분석을 위해 긴급 추가 사용량이 필요합니다.',
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
    reason: '4분기 신규 DT 역량 강화 커리큘럼 교재 20종 AI 목차 및 연습문제 일괄 생성 작업 진행 중 잔여량 부족 예상.',
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
    reason: 'APO 아시아생산성기구 연례 보고서 영문화 및 다국어 계약서 15건 실시간 대조 번역 업무 수행.',
    requestedAt: '2026.09.12 17:40',
    status: '대기'
  },
  {
    id: 'req-004',
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
    id: 'req-005',
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

export const INITIAL_API_KEYS: AiProviderApiKey[] = [
  {
    id: 'provider-openai',
    providerName: 'OpenAI',
    logo: 'openai',
    status: '정상 연결',
    models: ['GPT-4o Enterprise', 'GPT-4o-mini', 'text-embedding-3-large'],
    monthlyCalls: 48200,
    monthlyCost: 622440,
    maskedKey: 'sk-proj-••••••••••••8F2A',
    fullKeySample: 'sk-proj-92847192847192848F2A',
    lastTestedAt: '2026.09.13 15:45 (정상 응답: 142ms)',
    isEnterprise: true
  },
  {
    id: 'provider-anthropic',
    providerName: 'Anthropic Claude',
    logo: 'anthropic',
    status: '정상 연결',
    models: ['Claude 3.5 Sonnet', 'Claude 3.5 Haiku'],
    monthlyCalls: 31400,
    monthlyCost: 459420,
    maskedKey: 'sk-ant-api03-••••••••••••E79C',
    fullKeySample: 'sk-ant-api03-098234123412E79C',
    lastTestedAt: '2026.09.13 15:45 (정상 응답: 198ms)',
    isEnterprise: true
  },
  {
    id: 'provider-google',
    providerName: 'Google Gemini',
    logo: 'google',
    status: '정상 연결',
    models: ['Gemini 2.5 Pro', 'Gemini 2.5 Flash'],
    monthlyCalls: 54100,
    monthlyCost: 266760,
    maskedKey: 'AIzaSy••••••••••••3M9X',
    fullKeySample: 'AIzaSy901823901823123M9X',
    lastTestedAt: '2026.09.13 15:46 (정상 응답: 88ms)',
    isEnterprise: true
  },
  {
    id: 'provider-naver',
    providerName: 'HyperCLOVA X',
    logo: 'naver',
    status: '정상 연결',
    models: ['CLOVA Studio HCX-003', 'CLOVA Summary Engine'],
    monthlyCalls: 12900,
    monthlyCost: 133380,
    maskedKey: 'ncp-iam-••••••••••••4B1Z',
    fullKeySample: 'ncp-iam-2093840293844B1Z',
    lastTestedAt: '2026.09.13 15:42 (정상 응답: 165ms)',
    isEnterprise: true
  },
  {
    id: 'provider-kpc-onprem',
    providerName: 'KPC On-Premise LLM',
    logo: 'kpc',
    status: '정상 연결',
    models: ['KPC-Enterprise-Llama3-Korean (망분리 폐쇄망)'],
    monthlyCalls: 21800,
    monthlyCost: 0,
    maskedKey: 'kpc-internal-sec-••••••••001',
    fullKeySample: 'kpc-internal-sec-token-001',
    lastTestedAt: '2026.09.13 15:40 (사내 GPU 클러스터 가동 중)',
    isEnterprise: true
  }
];

export const INITIAL_AI_MODELS: AiModelPolicy[] = [
  {
    id: 'model-gpt-ent',
    name: 'GPT Enterprise',
    provider: 'OpenAI',
    monthlyCostCap: 5000000,
    currentCost: 622440,
    monthlyTokenCap: 50000000,
    currentTokens: 10420000,
    rateLimitRpm: 1000,
    perUserMonthlyLimit: 200000,
    perTeamMonthlyLimit: 8000000,
    status: '정상',
    isActive: true
  },
  {
    id: 'model-claude-ent',
    name: 'Claude Enterprise',
    provider: 'Anthropic',
    monthlyCostCap: 3000000,
    currentCost: 459420,
    monthlyTokenCap: 30000000,
    currentTokens: 7690000,
    rateLimitRpm: 800,
    perUserMonthlyLimit: 150000,
    perTeamMonthlyLimit: 6000000,
    status: '정상',
    isActive: true
  },
  {
    id: 'model-gemini-pro',
    name: 'Gemini 2.5 Pro',
    provider: 'Google Cloud',
    monthlyCostCap: 2000000,
    currentCost: 180000,
    monthlyTokenCap: 40000000,
    currentTokens: 4200000,
    rateLimitRpm: 1200,
    perUserMonthlyLimit: 300000,
    perTeamMonthlyLimit: 10000000,
    status: '정상',
    isActive: true
  },
  {
    id: 'model-gemini-flash',
    name: 'Gemini 2.5 Flash',
    provider: 'Google Cloud',
    monthlyCostCap: 1000000,
    currentCost: 86760,
    monthlyTokenCap: 60000000,
    currentTokens: 2510000,
    rateLimitRpm: 3000,
    perUserMonthlyLimit: 500000,
    perTeamMonthlyLimit: 15000000,
    status: '정상',
    isActive: true
  },
  {
    id: 'model-hyperclova',
    name: 'HyperCLOVA X',
    provider: 'Naver Cloud',
    monthlyCostCap: 1500000,
    currentCost: 133380,
    monthlyTokenCap: 20000000,
    currentTokens: 1400000,
    rateLimitRpm: 600,
    perUserMonthlyLimit: 100000,
    perTeamMonthlyLimit: 3000000,
    status: '정상',
    isActive: true
  }
];

export const USAGE_RANKINGS_DATA = {
  users: [
    { rank: 1, name: '박지훈', subtext: '컨설팅본부 · 책임컨설턴트', metric: '100,000 Token', percentage: 14.2, tag: '사용 제한' },
    { rank: 2, name: '이서연', subtext: '교육사업팀 · 선임연구원', metric: '98,000 Token', percentage: 13.9, tag: '주의' },
    { rank: 3, name: '강동원', subtext: '글로벌협력처 · 과장', metric: '96,000 Token', percentage: 13.6, tag: '주의' },
    { rank: 4, name: '정소담', subtext: 'AI사업본부 · 수석연구원', metric: '72,430 Token', percentage: 10.3, tag: '정상' },
    { rank: 5, name: '김민수', subtext: '경영기획팀 · 팀장', metric: '72,000 Token', percentage: 10.2, tag: '정상' }
  ],
  teams: [
    { rank: 1, name: '컨설팅본부', subtext: '총 38명 · 7.85M Token', metric: '7,850,000 Token', percentage: 31.6, tag: '위험 (98%)' },
    { rank: 2, name: 'AI사업본부', subtext: '총 30명 · 5.20M Token', metric: '5,200,000 Token', percentage: 21.0, tag: '정상 (52%)' },
    { rank: 3, name: '교육사업팀', subtext: '총 18명 · 3.70M Token', metric: '3,700,000 Token', percentage: 14.9, tag: '주의 (92%)' },
    { rank: 4, name: '경영기획팀', subtext: '총 24명 · 3.20M Token', metric: '3,200,000 Token', percentage: 12.9, tag: '정상 (64%)' },
    { rank: 5, name: '글로벌협력처', subtext: '총 14명 · 2.55M Token', metric: '2,550,000 Token', percentage: 10.3, tag: '주의 (85%)' }
  ],
  agents: [
    { rank: 1, name: '제안서 전략 분석 및 초안 생성 Agent', subtext: 'AI Agent · RFP-DOC-001', metric: '1,280,000 Token', percentage: 38.2, tag: '급증 +142%' },
    { rank: 2, name: '사내 규정 및 감사 컴퍼스 검색 Agent', subtext: 'AI Agent · SEARCH-002', metric: '980,000 Token', percentage: 29.3, tag: '인기' },
    { rank: 3, name: '주간 업무보고 자동 집계 Agent', subtext: 'AI Agent · DOC-003', metric: '420,000 Token', percentage: 12.5, tag: '정상' },
    { rank: 4, name: '공공 교육 과정 기획 Agent', subtext: 'AI Agent · EDU-004', metric: '360,000 Token', percentage: 10.8, tag: '정상' },
    { rank: 5, name: '과업지시서 필수요건 추출기', subtext: 'AI Agent · RFP-EXT-005', metric: '310,000 Token', percentage: 9.2, tag: '정상' }
  ],
  customAi: [
    { rank: 1, name: 'DADAM 회의록 요약 시스템', subtext: 'Custom AI · DADAM-v2.1', metric: '760,000 Token', percentage: 41.5, tag: '인기' },
    { rank: 2, name: 'DARUDA 다국어 문서 번역', subtext: 'Custom AI · DARUDA-v3.1', metric: '520,000 Token', percentage: 28.4, tag: '추천' },
    { rank: 3, name: 'DAOM 비정형 문서 OCR 추출기', subtext: 'Custom AI · DAOM-v2.4', metric: '380,000 Token', percentage: 20.8, tag: '정상' },
    { rank: 4, name: 'RFP 수주 적합도 심층 판정 코크핏', subtext: 'Custom AI · RFP-EVAL', metric: '170,000 Token', percentage: 9.3, tag: '정상' }
  ],
  models: [
    { rank: 1, name: 'GPT Enterprise', subtext: 'OpenAI · GPT-4o', metric: '10,420,000 Token', percentage: 42.0, tag: '비용 42%' },
    { rank: 2, name: 'Claude Enterprise', subtext: 'Anthropic · Claude 3.5 Sonnet', metric: '7,690,000 Token', percentage: 31.0, tag: '비용 31%' },
    { rank: 3, name: 'Gemini 2.5 Pro / Flash', subtext: 'Google Cloud · 멀티모달', metric: '4,460,000 Token', percentage: 18.0, tag: '비용 18%' },
    { rank: 4, name: 'HyperCLOVA X & 온프레미스', subtext: 'Naver / KPC 내부망', metric: '2,250,000 Token', percentage: 9.0, tag: '비용 9%' }
  ]
};

export const USAGE_TRENDS_DATA = {
  daily: [
    { label: '9/7', tokens: 620000, calls: 3200, cost: 37200 },
    { label: '9/8', tokens: 840000, calls: 4100, cost: 50400 },
    { label: '9/9', tokens: 1120000, calls: 5600, cost: 67200 },
    { label: '9/10', tokens: 1450000, calls: 7200, cost: 87000 },
    { label: '9/11', tokens: 1890000, calls: 8900, cost: 113400 },
    { label: '9/12', tokens: 1620000, calls: 7800, cost: 97200 },
    { label: '9/13', tokens: 1980000, calls: 9400, cost: 118800 }
  ],
  weekly: [
    { label: '8월 3주', tokens: 4100000, calls: 21000, cost: 246000 },
    { label: '8월 4주', tokens: 5300000, calls: 28000, cost: 318000 },
    { label: '9월 1주', tokens: 6800000, calls: 34000, cost: 408000 },
    { label: '9월 2주', tokens: 8620000, calls: 43000, cost: 517200 }
  ],
  monthly: [
    { label: '6월', tokens: 14200000, calls: 71000, cost: 852000 },
    { label: '7월', tokens: 18900000, calls: 94000, cost: 1134000 },
    { label: '8월', tokens: 21500000, calls: 108000, cost: 1290000 },
    { label: '9월(현재)', tokens: 24820000, calls: 124000, cost: 1482000 }
  ]
};

export const AUDIT_LOGS_DATA: AuditLogItem[] = [
  {
    id: 'log-001',
    timestamp: '2026.09.13 16:15:22',
    userName: '정소담',
    team: 'AI사업본부',
    actionType: 'TOKEN_GRANT',
    serviceName: '관리자 콘솔',
    details: '박지훈 책임컨설턴트 긴급 토큰 요청(+50K) 심의 대기 상태 확인',
    status: 'SUCCESS'
  },
  {
    id: 'log-002',
    timestamp: '2026.09.13 15:45:10',
    userName: '시스템 자동',
    team: '인프라보안실',
    actionType: 'HEALTH_CHECK',
    serviceName: 'OpenAI API Provider',
    details: 'API 엔드포인트 핑 테스트 완료 (응답시간 142ms, 에러율 0.0%)',
    status: 'SUCCESS'
  },
  {
    id: 'log-003',
    timestamp: '2026.09.13 14:10:02',
    userName: '박지훈',
    team: '컨설팅본부',
    actionType: 'TOKEN_REQUEST',
    serviceName: '토큰 게이트웨이',
    details: '월 할당량 100K 100% 소진으로 인한 +50K 추가 토큰 신청 접수',
    status: 'SUCCESS'
  },
  {
    id: 'log-004',
    timestamp: '2026.09.13 13:58:44',
    userName: '박지훈',
    team: '컨설팅본부',
    actionType: 'THROTTLE_TRIGGER',
    serviceName: '제안서 생성 엔진',
    details: '토큰 한도 초과로 인한 API 호출 자동 일시 제한 조치 발동',
    status: 'WARNING'
  },
  {
    id: 'log-005',
    timestamp: '2026.09.13 11:20:18',
    userName: '이서연',
    team: '교육사업팀',
    actionType: 'AI_CALL',
    serviceName: 'Custom AI (DARUDA)',
    details: 'DOCX 28p 대용량 문서 번역 호출 (소모 토큰: 14,200 Token)',
    status: 'SUCCESS'
  },
  {
    id: 'log-006',
    timestamp: '2026.09.13 09:30:00',
    userName: '정소담',
    team: 'AI사업본부',
    actionType: 'MODEL_POLICY_UPDATE',
    serviceName: 'AI 모델 정책',
    details: 'Gemini 2.5 Flash 일일 호출 제한 3,000 RPM으로 상향 조정 완료',
    status: 'SUCCESS'
  }
];
