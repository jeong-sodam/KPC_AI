export type GnbTab = 
  | 'dia' 
  | 'knowledge_ai' 
  | 'custom_ai'
  | 'proposals' 
  | 'reports' 
  | 'ai_worker' 
  | 'ai_agent' 
  | 'ai_community'
  | 'admin';

export type UserRole = 'user' | 'admin';

export interface WorkerDocument {
  id: string;
  name: string;
  size: string;
  pages: number;
  format: 'PDF' | 'HWP' | 'DOCX' | 'XLSX' | 'PPTX' | 'TXT';
  uploadedAt: string;
  uploader: string;
  category: string;
  status: '인덱싱 완료' | '분석 중' | '대기';
  extractedChunks: number;
  summary: string;
  selected?: boolean;
}

export interface TaskAttachedFile {
  id: string;
  name: string;
  size: string;
  format: 'PDF' | 'DOCX' | 'XLSX' | 'PPTX' | 'IMAGE' | 'TXT';
  uploadedAt: string;
  selected: boolean;
}

export interface WorkerSearchSnippet {
  id: string;
  documentId: string;
  documentName: string;
  page: number;
  section: string;
  content: string;
  matchScore: number;
}

export interface VerifiedAgent {
  id: string;
  name: string;
  code: string;
  version: string;
  category: '문서작성' | '검색·분석' | '회의·요약' | 'RFP·제안' | '교육' | '데이터 분석' | '기타' | string;
  description: string;
  longDescription: string;
  author: string;
  department: string;
  maintainer: string;
  auditDate: string;
  auditScore: number;
  auditPassed: boolean;
  securityCertification: string;
  executionCount: number;
  rating: number;
  reviewCount: number;
  likes: number;
  userLiked?: boolean;
  commentsCount: number;
  tags: string[];
  status: '전사 배포' | '부서 한정' | '정기 검수 중' | '일시중단';
  isSaved?: boolean;
  isHidden?: boolean;
  capabilities: string[];
  tools: string[];
  systemPromptSample: string;
  inputsSample: { key: string; label: string; placeholder: string; type: 'text' | 'textarea' | 'select'; options?: string[] }[];
  outputSample: string;
  updatedAt: string;
  createdAt: string;
  icon?: string;
  screenshots?: string[];
  mainImageUrl?: string;
  thumbnailUrl?: string;
  oneLineDesc?: string;
}

export type CommunityDevType = 'AI 아이디어' | 'AI 개발' | 'AI Agent 개발' | 'Custom AI 개발' | '기타 AI 개발';

export type CommunityDevStatus = 
  | '아이디어 단계' 
  | '초기 개발' 
  | '개발 중' 
  | '테스트 중' 
  | '개선 중' 
  | '제출 준비' 
  | '공식 등록 검토 중'
  | '승인 완료'
  | '반려';

export type FeatureProposalStatus = '검토 중' | '반영 예정' | '개발 중' | '반영 완료' | '미반영';

export interface CommunityComment {
  id: string;
  author: string;
  department: string;
  avatar?: string;
  content: string;
  createdAt: string;
  likes: number;
  userLiked?: boolean;
  isFeatureProposal?: boolean;
  proposalStatus?: FeatureProposalStatus;
  replies?: CommunityComment[];
}

export type CommunityAgentStatus = 
  | '초안' 
  | '테스트 중' 
  | 'Community 게시' 
  | '검수 요청' 
  | '검수 중' 
  | '검수 예정'
  | '승인' 
  | '승인 완료' 
  | '반려' 
  | '사용 중지'
  | '아이디어' 
  | '개발 중' 
  | '검수 보류';

export interface AgentKnowledgeFile {
  id: string;
  name: string;
  format: 'PDF' | 'HWP' | 'DOCX' | 'XLSX' | 'TXT' | string;
  size: string;
  date: string;
}

export interface AgentConnectorItem {
  id: string;
  name: string;
  desc: string;
  status: '연결됨' | '미연결';
  permStatus: '승인됨' | '권한 필요';
  enabled: boolean;
  iconType?: string;
}

export interface OfficialSubmissionData {
  submittedAt: string;
  aiName: string;
  keyFeatures: string;
  problemSolved: string;
  targetUsers: string;
  currentDevStatus: string;
  version: string;
  howToUse: string;
  resultUrl?: string;
  prototypeUrl?: string;
  serviceUrl?: string;
  // Tech
  usedModels: string[];
  usedInternalData: string;
  usedExternalData: string;
  usedApisAndConnectors: string;
  // Security
  hasPersonalInfo: boolean;
  personalInfoDesc?: string;
  hasSensitiveInfo: boolean;
  sensitiveInfoDesc?: string;
  usesInternalSystem: boolean;
  usesExternalLlmAnonymization: boolean;
  // Team
  developerName: string;
  department: string;
  coDevelopers?: string;
  operatorName?: string;
  // Admin review notes
  adminReviewStatus?: '접수' | '검토 중' | '수정 요청' | '승인' | '반려' | '배포 완료';
  adminDecisionType?: 'agent' | 'custom_ai';
  adminNotes?: string;
}

export interface AgentAuditRequestData {
  agentId?: string;
  agentTitle?: string;
  reason: string;
  keyFeatures: string;
  targetAudience: string;
  expectedUsers: string;
  usedData: string;
  usedConnectors: string;
  hasSensitiveInfo: boolean;
  sensitiveInfoDetails?: string;
  adminNotes?: string;
  requestDate: string;
  rejectReason?: string;
  reviewedDate?: string;
  reviewer?: string;
}

export interface CommunityTimelineUpdate {
  version: string;
  date: string;
  title: string;
  changes: string[];
  author?: string;
}

export interface CommunityAgent {
  id: string;
  title: string;
  oneLineDesc?: string;
  shortDesc: string;
  description: string;
  devType?: CommunityDevType;
  devStatus?: CommunityDevStatus | string;
  version: string;
  author: string;
  department: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  userLiked?: boolean;
  isSaved?: boolean;
  views: number;
  forks?: number;
  runs?: number;
  commentsCount: number;
  auditNominated?: boolean;
  nominationCount?: number;
  status: CommunityAgentStatus;
  tags: string[];
  comments: CommunityComment[];
  changelog?: { version: string; date: string; changes: string[] }[];
  timelineUpdates?: CommunityTimelineUpdate[];
  // Structured post sections
  problemAndBackground?: string;
  implementedFeatures?: string;
  testingProgress?: string;
  plannedFeatures?: string;
  feedbackWanted?: string;
  // Media & Attachments
  screenshots?: string[];
  mainImageUrl?: string;
  thumbnailUrl?: string;
  demoVideoUrl?: string;
  demoGifUrl?: string;
  prototypeUrl?: string;
  serviceUrl?: string;
  testUrl?: string;
  documents?: { name: string; size: string; type: string }[];
  // Official Submission & Registration
  officialSubmission?: OfficialSubmissionData;
  officialRegisteredType?: 'agent' | 'custom_ai' | null;
  officialRegisteredId?: string;
  linkedVerifiedAgentId?: string;
  developmentType?: 'custom_ai' | 'agent';
  registeredType?: 'agent' | 'custom_ai' | null;
  registeredTargetId?: string;
  // Legacy / Aux Properties
  reasonCreated?: string;
  howToUse?: string;
  promptPreview?: string;
  systemPrompt?: string;
  exampleInputs?: string;
  exampleOutput?: string;
  icon?: string;
  iconBg?: string;
  targetPurpose?: string;
  visibilityScope?: '나만 사용' | '특정 부서' | '특정 사용자' | '전사 공개';
  selectedModel?: string;
  knowledgeFiles?: AgentKnowledgeFile[];
  knowledgeSources?: {
    knowledgeAi: boolean;
    sharePoint: boolean;
    oneDrive: boolean;
    approvedInternal?: boolean;
    teams?: boolean;
  };
  connectors?: AgentConnectorItem[];
  isForked?: boolean;
  forkedFromId?: string;
  forkedFromName?: string;
  previousStatus?: CommunityAgentStatus;
  auditRequestData?: AgentAuditRequestData;
  isAsset?: boolean;
  accessType?: 'Web App' | 'Prototype' | '사내 시스템' | 'API' | 'MCP' | '기타';
  apiEndpoint?: string;
  coAuthors?: string[];
  operatorDept?: string;
  maintainerName?: string;
  keyFeatures?: string[];
  serviceIntro?: string;
  usedModels?: string[];
  usedDataSources?: string[];
  connectedConnectorsList?: string[];
}

export type ProposalLnbTab = 
  | 'search' 
  | 'pipeline' 
  | 'proposals' 
  | 'my-tasks' 
  | 'library' 
  | 'settings';

export type ProjectSubTab = 
  | 'rfp-docs' 
  | 'ai-analysis' 
  | 'requirements' 
  | 'structure' 
  | 'matrix'
  | 'task-mgmt' 
  | 'editor'
  | 'resources' 
  | 'inputs' 
  | 'review' 
  | 'export' 
  | 'proj-settings';

export type Department = 
  | '전체' 
  | 'AI산업본부'
  | 'AI사업본부' 
  | '컨설팅본부' 
  | '교육사업본부' 
  | '생산성본부' 
  | 'CX본부' 
  | '자격사업본부';

export type PipelineStage = 
  | '검토 대기' 
  | '검토 중' 
  | '진행' 
  | '진행 안 함';

export interface PWinEvaluationItem {
  id: string;
  category: string;
  score: number; // e.g. 8 (out of 10)
  maxScore?: number;
  resultLabel: '최우수' | '우수' | '적합' | '보통' | '주의' | '미흡';
  rationale: string;
  rfpCitationLocation: string; // e.g. "RFP p.18 사업 범위"
  rfpPage: number;
  aiExplanation: string;
}

export type ProposalDocumentType = 'RFP' | '사업 관련 문서' | '참고자료' | '기타 자료';

export interface ProjectRelatedDoc {
  id: string;
  fileName: string;
  docType: ProposalDocumentType;
  uploader: string;
  uploadDate: string;
  size: string;
  isPrimaryRfp: boolean;
  pageCount?: number;
}

export interface RfpItem {
  id: string;
  title: string;
  agency: string;
  budget: number;
  budgetFormatted: string;
  deadline: string;
  announcementDate: string;
  contractType: string;
  country: string;
  currency: string;
  language: string;
  status: '모집 중' | '마감 임박' | '예정' | '마감';
  department: Department;
  stage: PipelineStage;
  pwin: number;
  assignee: string;
  participants: string[];
  purpose: string;
  tasks: string[];
  requirementsSummary: string;
  evalSummary: string;
  source: string;
  lastModified: string;
  // KPC Project Review and Registration fields
  projectName?: string;
  businessName?: string;
  businessField?: string;
  businessSummary?: string;
  businessPeriod?: string;
  memo?: string;
  primaryRfpFileName?: string;
  pwinBreakdown?: PWinEvaluationItem[];
  rejectionReason?: string;
  rejectionNote?: string;
  adminOpinion?: string;
  managerOpinion?: string;
  keyRequirements?: string[];
  keyRisks?: string[];
  relatedDocs?: ProjectRelatedDoc[];
}

export type ProjectType = 'Knowledge AI' | 'Proposal AI' | 'AI Platform & Agent';
export type ProposalWorkflowType = 'requirements' | 'qa' | 'blank';
export type RfpAnalysisStatus = 'RFP 미등록' | '등록 완료' | '분석 대기' | '분석 중' | '분석 완료' | '분석 실패';
export type ProposalDocCategory = 'RFP 문서' | '참고자료' | '기존 제안서' | '회사소개서' | '기술자료' | '기타 참고문서';

export interface DocumentItem {
  id: string;
  fileName: string;
  type: 'PDF' | 'DOCX' | 'PPTX' | 'XLSX' | 'HWP' | 'TXT';
  size: string;
  uploader: string;
  updatedAt: string;
  status: '분석 준비 완료' | '분석 완료' | '업로드 완료' | '등록 완료' | '대기';
  isRfp?: boolean;
  category?: ProposalDocCategory;
  pageCount?: number;
  previewContent?: {
    summary: string;
    keyHighlights: string[];
    sampleText: string;
    toc?: string[];
    metadata?: Record<string, string>;
  };
}

export interface PWinEvaluation {
  competitivePosition: number; // 0-100
  pastExperience: number;
  technicalCapability: number;
  clientFit: number;
  overallScore: number;
  isAiEvaluated: boolean;
  reasoning: {
    competitivePosition: string;
    pastExperience: string;
    technicalCapability: string;
    clientFit: string;
  };
  sources: string[];
  confidence: number;
}

export interface AiAnalysisSection {
  id: number;
  title: string;
  content: string;
  rfpPage: number;
  rfpQuote: string;
  sourcePage?: number;
  sourceSnippet?: string;
}

export interface RequirementItem {
  id: string;
  text?: string;
  name?: string;
  reqId?: string;
  category?: string;
  importance?: string;
  sourcePage?: number;
  sourceSnippet?: string;
  type?: '필수' | '평가' | '제출' | '계약';
  priority?: '높음' | '보통' | '낮음';
  status: '미반영' | '작성 중' | '반영' | '추출 완료' | '제안 반영';
  rfpPage?: string;
  rfpQuote?: string;
  checked?: boolean;
}

export type OutlineStatus = '작성 준비' | '작성 대기' | '작성 중' | '검토 준비' | '검토 요청' | '검토 중' | '완료';

export interface ProposalOutlineItem {
  id: string;
  code?: string;
  sectionNumber?: string;
  title: string;
  level?: number;
  sourceReqId?: string;
  sourceText?: string;
  status: OutlineStatus;
  author?: string;
  assignee?: string;
  reviewer?: string;
  deadline?: string;
  targetPages?: number;
  pageEstimate?: number;
  targetWords?: number;
  currentWords?: number;
  rfpMappingReqs?: string[];
  isExpanded?: boolean;
  children?: ProposalOutlineItem[];
}

export interface StoryboardSection {
  id: string;
  guidelines: string;
  evaluationCriteria: string;
  taskDescription: string;
  otherRequirements: string;
  winStrategy: string;
  differentiators: string[];
  painPoints: string[];
  targetPages: number | string;
  targetWords?: number;
  author?: string;
  assignee?: string;
  reviewer?: string;
  rfpRequirements?: string;
}

export type ProposalStoryboard = StoryboardSection;

export interface EditorVersion {
  id: string;
  versionCode?: string; // v1, v2, v3
  versionName?: string;
  title?: string; // AI 초안, 사용자 수정, AI 검토 반영
  time?: string;
  createdAt?: string;
  author: string;
  content: string;
}

export interface SummaryOption {
  id: number;
  title: string;
  desc: string;
  charCount: number;
  reductionRate: string;
  content: string;
  diffAddition: string;
  diffDeletion: string;
}

export interface CaseStudyOption {
  id: number;
  title: string;
  content: string;
  source: string;
  dataset: string;
}

export interface CitationItem {
  id: number;
  marker: string;
  fileName: string;
  page: string;
  originalQuote: string;
  relevance: string;
  dataType: string;
  isWeb?: boolean;
  webName?: string;
  webUrl?: string;
  searchDate?: string;
}

export interface CommentItem {
  id: string;
  text: string;
  author: string;
  date: string;
  resolved: boolean;
  selectedTextSnippet: string;
  replies?: {
    id: string;
    author: string;
    text: string;
    date: string;
  }[];
}

export interface ReviewScore {
  category: string;
  score: number;
  maxScore: number;
  description: string;
}

export interface ReviewSuggestion {
  id: string;
  category: string;
  issue: string;
  aiSuggestion: string;
  originalSnippet: string;
  revisedSnippet: string;
}

export interface SourceSettings {
  internalKpc: boolean;
  currentProjectDocs: boolean;
  datasets: boolean;
  webSearch: boolean;
  internalSubtypes: {
    all: boolean;
    proposals: boolean;
    reports: boolean;
    trackRecord: boolean;
    methodology: boolean;
    companyIntro: boolean;
  };
  allowedWebsites: string[];
  blockedWebsites: string[];
}

export interface RequirementsMatrixItem {
  id: string;
  reqId?: string;
  requirementName?: string;
  rfpRequirement?: string;
  source?: string;
  rfpPage?: number | string;
  proposalLocation?: string;
  proposalSectionNumber?: string;
  proposalSectionTitle?: string;
  assignee: string;
  status?: '작성 완료' | '작성 중' | '작성 대기';
  compliance?: string;
  notes?: string;
  reviewResult?: '충족' | '부분 충족' | '미충족';
}

export type RequirementsMatrixRow = RequirementsMatrixItem;

export interface ProposalLibraryItem {
  id: string;
  title: string;
  category: string;
  description?: string;
  size?: string;
  tags?: string[];
  updatedAt?: string;
  lastModified?: string;
  useCount?: number;
  fileFormat: string;
  department?: string;
  previewContent?: {
    summary: string;
    keyHighlights: string[];
    sampleText: string;
    toc?: string[];
    metadata?: Record<string, string>;
  };
}

export type LibraryItem = ProposalLibraryItem;

export interface MyTaskItem {
  id: string;
  project?: string;
  section?: string;
  sectionNumber?: string;
  sectionTitle?: string;
  role?: '작성자' | '검토자';
  assignee?: string;
  reviewer?: string;
  status: string;
  deadline: string;
  progress?: number;
  targetPages?: number;
  targetWords?: number;
  currentWords?: number;
}

export type ProposalSectionTask = MyTaskItem;
export type ProposalTaskStatus = '작성 대기' | '작성 중' | '검토 요청' | '검토 준비' | '완료';

export interface ReportSection {
  id: string;
  title: string;
  category?: string;
  content: string;
  keywords?: string[];
  lastModified?: string;
}

export interface ReportItem {
  id: string;
  title: string;
  type: string;
  author: string;
  department?: string;
  createdAt?: string;
  updatedAt?: string;
  status: '작성 완료' | '작성 중' | '검토 중' | '초안 완료';
  pages?: number;
  summary: string;
  sections?: ReportSection[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citations?: { id: number; label: string; text: string }[];
  category?: string;
  attachedFiles?: string[];
}

export interface ProposalProject {
  id: string;
  title: string;
  agency: string;
  budget: number;
  deadline: string;
  dDay: number;
  status: string;
  stage: 'discovery' | 'review' | 'kickoff' | 'writing' | 'final' | PipelineStage | string;
  manager: string;
  teamMembers: string[];
  pWin: number;
  rfpId: string;
  projectType?: ProjectType;
  workflowType?: ProposalWorkflowType;
  analysisStatus?: RfpAnalysisStatus;
  analysisProgress?: number;
  analysisStepIndex?: number;
  rfpName?: string;
  creationMethod?: 'requirements' | 'qa' | 'blank' | string;
  documents?: DocumentItem[];
  lastModified?: string;
  currentStep?: string;
  progressPercent?: number;
  teamInvited?: boolean;
  // KPC Extended Review and Registration fields
  projectName?: string;
  businessName?: string;
  businessField?: string;
  businessSummary?: string;
  businessPeriod?: string;
  memo?: string;
  primaryRfpFileName?: string;
  pwinBreakdown?: PWinEvaluationItem[];
  rejectionReason?: string;
  rejectionNote?: string;
  adminOpinion?: string;
  managerOpinion?: string;
  keyRequirements?: string[];
  keyRisks?: string[];
  relatedDocs?: ProjectRelatedDoc[];
  templateType?: string;
  targetScope?: string;
  language?: string;
}

export type RfpOpportunity = RfpItem;

export type ProposalCreationMethod = 'blank' | 'rfp_upload' | 'dia_auto';

export interface ProposalComment {
  id: string;
  author: string;
  createdAt?: string;
  date?: string;
  content?: string;
  text?: string;
  resolved: boolean;
  sectionId?: string;
  selectedTextSnippet?: string;
  replies?: {
    id: string;
    author: string;
    content?: string;
    text?: string;
    createdAt?: string;
    date?: string;
  }[];
}

export interface AIReviewResult {
  overallScore: number;
  items: {
    id: string;
    title: string;
    category: string;
    severity: '높음' | '중간' | '낮음';
    description: string;
    suggestion: string;
  }[];
}

// ─────────────────────────────────────────────────────────────
// KPC Enterprise AI 관리자 및 토큰 사용량 관리 타입
// ─────────────────────────────────────────────────────────────

export type AdminMenuTab =
  | 'dashboard'
  // AI 플랫폼 관리
  | 'multi_llm'
  | 'routing_policy'
  | 'token_cost_mgmt'
  | 'system_prompts'
  | 'api_mcp_mgmt'
  | 'security_policy'
  // 서비스 관리
  | 'service_knowledge_ai'
  | 'service_ai_worker'
  | 'service_proposal_ai'
  | 'custom_ai_mgmt'
  | 'ai_agent_mgmt'
  | 'community_mgmt'
  // 사용자 및 권한
  | 'user_mgmt'
  | 'org_team_mgmt'
  | 'permission_mgmt'
  // 데이터 및 문서
  | 'data_file_permissions'
  | 'knowledge_rag'
  | 'system_connectors'
  | 'm365_integration'
  // 로그 및 모니터링
  | 'audit_logs'
  | 'user_feedback'
  | 'ai_quality'
  | 'incident_alerts'
  // 추가/하위 호환 키
  | 'api_provider'
  | 'usage_cost'
  | 'token_budget'
  | 'token_requests'
  | 'cost_cap'
  | 'users_teams'
  | 'usage_analytics'
  | 'api_keys'
  | 'ai_models'
  | 'services';

export type TokenUsageStatus = '정상' | '주의' | '위험' | '사용 제한';

export interface UserTokenAllocation {
  id: string;
  name: string;
  team: string;
  role: string;
  email: string;
  usedTokens: number;
  totalQuota: number;
  remainingTokens: number;
  dailyLimit: number;
  dailyUsed: number;
  allowedModels: string[];
  allowedAgents: string[];
  status: TokenUsageStatus;
  isThrottled: boolean;
  lastActive: string;
}

export interface TeamTokenBudget {
  id: string;
  teamName: string;
  monthlyQuota: number;
  usedTokens: number;
  memberCount: number;
  usageRate: number; // 0 - 100
  status: '정상' | '주의' | '위험';
  topModel: string;
}

export interface TokenRequest {
  id: string;
  requesterName: string;
  team: string;
  role: string;
  currentUsage: number;
  existingQuota: number;
  requestedAmount: number;
  reason: string;
  requestedAt: string;
  status: '대기' | '승인 완료' | '일부 승인' | '반려';
  processedAt?: string;
  processedBy?: string;
  approvedAmount?: number;
}

export interface AiProviderApiKey {
  id: string;
  providerName: string;
  logo: string;
  status: '정상 연결' | '점검 필요' | '사용 중지';
  models: string[];
  monthlyCalls: number;
  monthlyCost: number;
  maskedKey: string;
  fullKeySample: string;
  lastTestedAt: string;
  isEnterprise: boolean;
}

export interface AiModelPolicy {
  id: string;
  name: string;
  provider: string;
  monthlyCostCap: number;
  currentCost: number;
  monthlyTokenCap: number;
  currentTokens: number;
  rateLimitRpm: number;
  perUserMonthlyLimit: number;
  perTeamMonthlyLimit: number;
  status: '정상' | '한도 근접' | '차단';
  isActive: boolean;
}

export interface AdminDashboardKpis {
  totalTokensUsed: number;
  totalTokensQuota: number;
  estimatedCostKrw: number;
  costBudgetKrw: number;
  activeUsers: number;
  totalUsers: number;
  activeAgents: number;
  activeCustomAi: number;
  pendingTokenRequests: number;
  todayActiveUsers?: number;
  monthlyAiCalls?: number;
  systemAlertsCount?: number;
}

export interface UsageTrendPoint {
  label: string;
  tokens: number;
  calls: number;
  cost: number;
}

export interface UsageRankingItem {
  rank: number;
  name: string;
  subtext: string;
  metric: string;
  percentage: number;
  tag: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  userName: string;
  team: string;
  actionType: string;
  serviceName: string;
  details: string;
  status: 'SUCCESS' | 'WARNING' | 'ERROR';
}

// ─────────────────────────────────────────────────────────────
// 확장 관리자 콘솔 20개 메뉴용 추가 타입
// ─────────────────────────────────────────────────────────────

export interface AdminSystemAlert {
  id: string;
  severity: 'critical' | 'warning' | 'info' | 'error';
  title: string;
  description: string;
  targetMenu: AdminMenuTab;
  timestamp: string;
  isRead: boolean;
}

export interface EntraUserAccount {
  id: string;
  name: string;
  email: string;
  department: string;
  role: '일반 사용자' | 'AI 제작자' | '부서 관리자' | '플랫폼 관리자' | '외부 사용자';
  permissions: string[];
  usedTokens: number;
  monthlyQuota: number;
  status: '활성' | '비활성';
  lastLogin: string;
  allowedAi: string[];
  allowedLlms: string[];
  entraGroupId: string;
}

export interface OrgTeamPolicy {
  id: string;
  teamName: string;
  entraGroupName: string;
  memberCount: number;
  monthlyTokenQuota: number;
  usedTokens: number;
  costBudgetKrw: number;
  defaultRole: string;
  allowedModels: string[];
  status: '정상' | '주의' | '위험';
}

export interface UsageBreakdownItem {
  id: string;
  name: string;
  category: string;
  callsCount: number;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  estimatedCostKrw: number;
  momChangeRate: number; // 전월 대비 증감률 %
  isSurging?: boolean; // 사용량 급증 배지
}

export interface PlatformTokenBudgetConfig {
  platformMonthlyCostBudgetKrw: number;
  platformCurrentCostKrw: number;
  platformMonthlyTokenQuota: number;
  platformCurrentTokens: number;
  warningThresholds: {
    cautionPercent: number; // 80%
    dangerPercent: number;  // 90%
    cutoffPercent: number;  // 100%
  };
  autoThrottleOnCutoff: boolean;
  emailAlertToAdmins: boolean;
}

export interface MultiLlmModelInfo {
  id: string;
  name: string;
  provider: string;
  version: string;
  type: 'Enterprise' | 'Commercial';
  connectionStatus: '정상' | '점검 필요' | '오류';
  latencyMs: number;
  monthlyTokensUsed: number;
  estimatedCostKrw: number;
  isActive: boolean;
}

export interface ProviderKeyInfo {
  id: string;
  providerName: string;
  logo: string;
  status: '정상 연결' | '점검 필요' | '사용 중지';
  usedModels: string[];
  lastApiCallTime: string;
  monthlyTokenCount: number;
  monthlyCostKrw: number;
  maskedApiKey: string;
}

export interface LlmRoutingRule {
  id: string;
  ruleName: string;
  conditionType: string;
  conditionDetail: string;
  targetModel: string;
  priority: number;
  isActive: boolean;
  description: string;
}

export interface CostCapRateLimitConfig {
  id: string;
  modelName: string;
  monthlyCostCapKrw: number;
  currentEstimatedCostKrw: number;
  monthlyTokenCap: number;
  currentTokens: number;
  dailyCallLimit: number;
  rpmLimit: number;
  perUserRateLimitRpm: number;
  perTeamMonthlyTokenLimit: number;
  warningStatus: '정상' | '주의' | '위험';
}

export interface SystemPromptTemplate {
  id: string;
  serviceName: string;
  version: string;
  author: string;
  updatedAt: string;
  status: '사용 중' | '테스트 중' | '보관';
  content: string;
  historyCount: number;
}

export interface ManagedAiAgent {
  id: string;
  name: string;
  developer: string;
  department: string;
  usersCount: number;
  executionCount: number;
  tokensUsed: number;
  estimatedCostKrw: number;
  status: '개발 중' | '검토 중' | '운영 중' | '사용 중지';
  connectedModel: string;
  connectedSkills: string[];
  connectedData: string[];
  errorRatePercent: number;
  userRating: number;
  tokenLimit?: number;
  sharingScope?: '전사 공개' | '부서 한정' | '비공개';
}

export interface ManagedCustomAi {
  id: string;
  name: string;
  creator: string;
  department: string;
  category: string;
  usersCount: number;
  executionCount: number;
  tokensUsed: number;
  estimatedCostKrw: number;
  status: '운영 중' | '개발 중' | '보관' | '사용 중지';
  sharingScope: '비공개' | '팀 공개' | '전사 공개';
  usedModel: string;
  rating: number;
  promptSummary: string;
  tokenLimit?: number;
}

export interface CommunityManagedPost {
  id: string;
  title: string;
  author: string;
  department: string;
  aiType: 'Custom AI' | 'AI Agent';
  views: number;
  usesCount: number;
  likes: number;
  reportsCount: number;
  createdAt: string;
  status: '정상' | '게시물 숨김' | '승격 완료 (Custom AI)' | '승격 완료 (AI Agent)';
}

export interface KnowledgeRagSource {
  id: string;
  sourceName: string;
  type: 'SharePoint' | 'OneDrive' | 'Teams' | 'KPC 내부 문서' | '교육 시스템' | '이러닝 시스템' | '자격 시스템' | 'ERP';
  status: '정상' | '점검 필요' | '동기화 중';
  lastSyncedAt: string;
  docCount: number;
  indexingStatus: string;
  errorCount: number;
  permissionSyncStatus: string;
}

export interface SystemConnectorItem {
  id: string;
  name: string;
  status: '정상' | '점검 필요' | '오류';
  apiStatus: string;
  lastCallTime: string;
  avgLatencyMs: number;
  errorCountLast24h: number;
  description: string;
}

export interface SecurityAccessPolicyConfig {
  adminRolesCount: number;
  userRolesCount: number;
  dataClassifications: {
    level: '민감' | '내부' | '공개';
    badgeColor: string;
    policyDescription: string;
    appliedModels: string[];
  }[];
  agentPublishPolicy: string;
  customAiPublishPolicy: string;
  externalLlmDataTransmissionBlock: boolean;
}

export interface DetailedAuditLogEntry {
  id: string;
  time: string;
  userName: string;
  action: string;
  target: string;
  result: string;
  clientIp: string;
  category: string;
}

export interface AiUserFeedbackItem {
  id: string;
  serviceName: string;
  positiveRate: number;
  totalRatings: number;
  negativeCount: number;
  needsQualityImprovement: boolean; // 75% 미만 등
  recentNegativeFeedback: {
    id: string;
    query: string;
    answerSnippet: string;
    reason: string;
    userName: string;
    timestamp: string;
  }[];
}

export interface AiQualityPerformanceMetric {
  id: string;
  targetName: string;
  type: 'Model' | 'Agent';
  avgResponseTimeSec: number;
  successRatePercent: number;
  errorRatePercent: number;
  userSatisfactionScore: number;
  avgTokensPerCall: number;
  groundingAccuracyScore: number;
  sourceCitationRate: number;
}

export interface SectionReferenceFileItem {
  id: string;
  fileName: string;
  fileSize: string;
  format: string;
  category: string;
  uploadDate: string;
  uploader?: string;
  status: string;
  selected: boolean;
}

export interface SectionReferenceConfig {
  sectionId: string;
  internalKnowledge: {
    selectedFileIds: string[];
    files: Array<{
      id: string;
      title: string;
      category: string;
      folderPath?: string;
      fileFormat: string;
      size: string;
      updatedAt: string;
      relevanceScore?: number;
    }>;
  };
  uploadedFiles: SectionReferenceFileItem[];
  webSearch: {
    enabled: boolean;
    includeUrls: string[];
    excludeUrls: string[];
  };
}


