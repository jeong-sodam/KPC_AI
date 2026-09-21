import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, 
  Save, 
  Share2, 
  Play, 
  Sparkles, 
  Bot, 
  Upload, 
  FileText, 
  Trash2, 
  Check, 
  AlertCircle, 
  Info, 
  Database, 
  Globe, 
  Lock, 
  Users, 
  Building2, 
  Cpu, 
  Search, 
  BookOpen, 
  Award, 
  Cloud, 
  MessageSquare, 
  Sliders, 
  RefreshCw, 
  Send, 
  User, 
  CheckCircle2, 
  Paperclip, 
  HelpCircle,
  Wand2,
  Copy,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Plus,
  X,
  FileCheck,
  GraduationCap,
  BarChart3,
  ExternalLink,
  Layers,
  ChevronRight,
  SlidersHorizontal
} from 'lucide-react';
import { 
  CommunityAgent, 
  AgentKnowledgeFile, 
  AgentConnectorItem 
} from '../../types';
import { 
  DEFAULT_AGENT_CONNECTORS, 
  AGENT_MODELS, 
  AGENT_TAG_PRESETS 
} from '../../data/communityMockData';

interface AgentStudioViewProps {
  initialAgent?: CommunityAgent | null;
  onBack: () => void;
  onSaveDraft: (agent: CommunityAgent) => void;
  onPublish: (agent: CommunityAgent) => void;
  onRequestAudit?: (agent: CommunityAgent) => void;
  onShowToast: (msg: string) => void;
}

interface TestMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  citations?: string[];
  usedConnectors?: string[];
  model?: string;
  sourceDoc?: string;
  executionTime?: string;
  showDetails?: boolean;
}

// Knowledge Item Interface
interface KnowledgeSourceItem {
  id: string;
  name: string;
  type: 'PDF' | 'Word' | 'Excel' | 'PowerPoint' | 'Knowledge AI' | 'SharePoint' | 'OneDrive' | 'Teams';
  location: string;
  hasAccessControl: boolean;
  size?: string;
  date: string;
}

// Connector UI Item Interface
interface ConnectorDefinition {
  id: string;
  name: string;
  description: string;
  category: 'business' | 'm365' | 'other';
  systemName: string;
  status: 'connected' | 'disconnected';
  permissionStatus: 'available' | 'restricted';
  permissionNote?: string;
}

export const AgentStudioView: React.FC<AgentStudioViewProps> = ({
  initialAgent,
  onBack,
  onSaveDraft,
  onPublish,
  onRequestAudit,
  onShowToast
}) => {
  // Navigation Tabs: 6 Core Settings requested by user
  // 1. 기본 정보 (basic)
  // 2. 지침 (instructions)
  // 3. 지식 (knowledge)
  // 4. 도구·커넥터 (connectors)
  // 5. 모델 (model)
  // 6. 권한 (permissions)
  const [activeTab, setActiveTab] = useState<'basic' | 'instructions' | 'knowledge' | 'connectors' | 'model' | 'permissions'>('basic');

  // 1. 기본 정보
  const [title, setTitle] = useState(initialAgent?.title || '새 AI Agent');
  const [shortDesc, setShortDesc] = useState(initialAgent?.shortDesc || '');
  const [description, setDescription] = useState(
    initialAgent?.description || '사용자의 업무를 체계적으로 분석하여 표준 서식에 맞춰 결과를 정리합니다.'
  );
  const [targetPurpose, setTargetPurpose] = useState(
    initialAgent?.targetPurpose || initialAgent?.reasonCreated || '회의 및 업무 지원 효율화'
  );
  const [selectedTags, setSelectedTags] = useState<string[]>(
    initialAgent?.tags && initialAgent.tags.length > 0 ? initialAgent.tags : ['업무지원', '자동화']
  );
  const [customTagInput, setCustomTagInput] = useState('');
  const [selectedIconBg, setSelectedIconBg] = useState(
    initialAgent?.iconBg || 'bg-red-50 text-[#E60012] border-red-200'
  );
  const [cardImageUrl, setCardImageUrl] = useState<string>(
    initialAgent?.mainImageUrl || initialAgent?.thumbnailUrl || ''
  );
  const [customIconUrl, setCustomIconUrl] = useState<string>(
    initialAgent?.icon && (initialAgent.icon.startsWith('http') || initialAgent.icon.startsWith('data:')) ? initialAgent.icon : ''
  );
  const cardImageInputRef = useRef<HTMLInputElement>(null);
  const iconFileInputRef = useRef<HTMLInputElement>(null);

  // 카드 예시 화면 이미지 업로드 핸들러
  const handleCardImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      onShowToast('이미지 파일 크기는 5MB 이하여야 합니다.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const result = loadEvent.target?.result as string;
      setCardImageUrl(result);
      setIsDirty(true);
      onShowToast('카드 예시 화면 이미지가 등록되었습니다.');
    };
    reader.readAsDataURL(file);
  };

  // 사용자 정의 아이콘 업로드 핸들러
  const handleCustomIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      onShowToast('아이콘 이미지 파일 크기는 2MB 이하여야 합니다.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const result = loadEvent.target?.result as string;
      setCustomIconUrl(result);
      setSelectedIconBg('custom');
      setIsDirty(true);
      onShowToast('사용자 맞춤 아이콘이 등록되었습니다.');
    };
    reader.readAsDataURL(file);
  };

  // 2. 지침 (Agent 역할, 답변 방식, 수행 업무)
  const [systemPrompt, setSystemPrompt] = useState(
    initialAgent?.systemPrompt || 
    `당신은 한국생산성본부(KPC)의 전문 업무 지원 AI Agent입니다.\n\n[주요 업무 지침]\n1. 사용자의 요청 내용을 정확히 분석하여 체계적인 구조로 답변합니다.\n2. 확인되지 않은 사실은 임의로 지어내지 않으며 사내 규정과 지침을 준수합니다.\n3. 사내 임직원이 바로 실행할 수 있도록 명확한 Action Item과 체크리스트를 제공합니다.`
  );
  const [showAiImproveModal, setShowAiImproveModal] = useState(false);
  const [improvedPromptDraft, setImprovedPromptDraft] = useState('');
  const [isImprovingPrompt, setIsImprovingPrompt] = useState(false);

  // 3. 지식 (문서, Knowledge AI, M365)
  const [knowledgeList, setKnowledgeList] = useState<KnowledgeSourceItem[]>([
    {
      id: 'k-1',
      name: 'KPC_업무_표준_운영_가이드라인_2026.pdf',
      type: 'PDF',
      location: '파일 업로드 > 규정문서',
      hasAccessControl: true,
      size: '2.4 MB',
      date: '2026.09.11'
    },
    {
      id: 'k-2',
      name: 'KPC 회의 운영 및 서식 가이드',
      type: 'SharePoint',
      location: 'SharePoint > KPC_업무혁신추진단 > 표준문서함',
      hasAccessControl: true,
      size: '사내 사이트 연동',
      date: '2026.09.12'
    },
    {
      id: 'k-3',
      name: 'KPC 사내 복무 규정 및 여비 기준',
      type: 'Knowledge AI',
      location: 'Knowledge AI > 사내 규정집 DB',
      hasAccessControl: true,
      size: 'RAG 인덱스',
      date: '2026.09.15'
    }
  ]);
  const [showAddKnowledgeModal, setShowAddKnowledgeModal] = useState(false);
  const [selectedKnowledgeCategory, setSelectedKnowledgeCategory] = useState<'file' | 'knowledge_ai' | 'm365'>('file');

  // 4. 도구·커넥터
  const ALL_CONNECTORS: ConnectorDefinition[] = [
    // 업무 시스템
    {
      id: 'sys-kpc-edu',
      name: '교육과정 조회',
      description: 'KPC 최신 공개교육 및 직무 연수 과정 정보를 검색하고 조회합니다.',
      category: 'business',
      systemName: '교육사업본부 ERP',
      status: 'connected',
      permissionStatus: 'available'
    },
    {
      id: 'sys-kpc-online',
      name: '온라인교육 조회',
      description: 'KPC 이러닝 및 마이크로러닝 강좌 카탈로그와 수강 이력을 조회합니다.',
      category: 'business',
      systemName: '디지털교육시스템',
      status: 'connected',
      permissionStatus: 'available'
    },
    {
      id: 'sys-kpc-cert',
      name: '자격정보 조회',
      description: 'KPC 공인 자격증 및 인증 시험 기준, 일정 정보를 검색합니다.',
      category: 'business',
      systemName: '자격인증본부 DB',
      status: 'connected',
      permissionStatus: 'available'
    },
    {
      id: 'sys-kpc-erp',
      name: 'ERP 조회',
      description: '사내 프로젝트 예산, 회계 코드, 부서별 지출 실적을 조회합니다.',
      category: 'business',
      systemName: '경영기획 ERP',
      status: 'connected',
      permissionStatus: 'available'
    },
    // Microsoft 365
    {
      id: 'm365-sharepoint',
      name: 'SharePoint',
      description: '사내 SharePoint 문서 라이브러리 및 팀 사이트 문서를 실시간 검색합니다.',
      category: 'm365',
      systemName: 'Microsoft 365',
      status: 'connected',
      permissionStatus: 'available'
    },
    {
      id: 'm365-onedrive',
      name: 'OneDrive',
      description: '개인 및 부서 공유 비즈니스 클라우드 파일을 안전하게 연동합니다.',
      category: 'm365',
      systemName: 'Microsoft 365',
      status: 'connected',
      permissionStatus: 'available'
    },
    {
      id: 'm365-teams',
      name: 'Teams',
      description: 'Microsoft Teams 채널 대화 및 회의 대화록 요약 정보를 조회합니다.',
      category: 'm365',
      systemName: 'Microsoft 365',
      status: 'connected',
      permissionStatus: 'available'
    },
    // 기타
    {
      id: 'ext-approved-api',
      name: '승인된 외부 API',
      description: '공공 데이터 포털 및 사전 인가된 대외 기관 공식 API를 연동합니다.',
      category: 'other',
      systemName: '보안관제 연계 Gateway',
      status: 'disconnected',
      permissionStatus: 'restricted',
      permissionNote: '정보보안팀 사전 승인 필요'
    },
    {
      id: 'ext-rest-api',
      name: 'REST API',
      description: '사내 마이크로서비스 및 REST 엔드포인트를 표준 규격으로 호출합니다.',
      category: 'other',
      systemName: '사내 API Gateway',
      status: 'connected',
      permissionStatus: 'available'
    },
    {
      id: 'ext-mcp',
      name: 'MCP Connector',
      description: 'Model Context Protocol 표준 규격 기반의 외부 AI 에이전트 도구를 연계합니다.',
      category: 'other',
      systemName: 'AI Studio MCP Hub',
      status: 'connected',
      permissionStatus: 'available'
    }
  ];

  // Active connector IDs
  const [activeConnectorIds, setActiveConnectorIds] = useState<string[]>(
    initialAgent?.connectors && Array.isArray(initialAgent.connectors)
      ? initialAgent.connectors.map(c => typeof c === 'string' ? c : c.id)
      : ['m365-sharepoint', 'm365-teams', 'sys-kpc-edu']
  );

  // 5. 모델 (자동 선택 (권장), GPT, Claude, Gemini)
  const [modelChoice, setModelChoice] = useState<'auto' | 'gpt' | 'claude' | 'gemini'>('auto');

  // 6. 권한 (나만 사용, 특정 사용자, 특정 부서, 특정 그룹, 전사)
  const [visibilityScope, setVisibilityScope] = useState<'나만 사용' | '특정 사용자' | '특정 부서' | '특정 그룹' | '전사'>(
    (initialAgent?.visibilityScope as any) || '나만 사용'
  );
  const [targetDepartment, setTargetDepartment] = useState('AI전략팀');

  // Status & Version
  const [status, setStatus] = useState<CommunityAgent['status']>(initialAgent?.status || '초안');
  const [version, setVersion] = useState(initialAgent?.version || 'v0.1');
  const [isDirty, setIsDirty] = useState(false);

  // Right Panel: Agent Test Chat
  const [testMessages, setTestMessages] = useState<TestMessage[]>([
    {
      id: 'msg-start',
      sender: 'agent',
      text: `안녕하세요! **${title || 'AI Agent'}** 테스트 환경입니다.\n\n설정하신 **시스템 지침**, 연결된 **지식(SharePoint, 규정집)** 및 **커넥터**가 실시간으로 반영되어 동작합니다.\n\n테스트할 질문이나 업무 내용을 입력해보세요.`,
      model: modelChoice === 'auto' ? '자동 선택 (Gemini 2.5 Flash 매핑)' : modelChoice.toUpperCase(),
      usedConnectors: activeConnectorIds.map(id => ALL_CONNECTORS.find(c => c.id === id)?.name || id),
      sourceDoc: 'KPC 회의 운영 및 서식 가이드',
      executionTime: '210ms',
      showDetails: false
    }
  ]);
  const [testInput, setTestInput] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Helper: Assemble CommunityAgent
  const buildCurrentAgent = (newStatus?: CommunityAgent['status']): CommunityAgent => {
    return {
      id: initialAgent?.id || `agent-${Date.now()}`,
      title: title.trim() || '새 AI Agent',
      shortDesc: shortDesc.trim() || (description ? description.slice(0, 80) : '사내 업무 지원 Agent'),
      description: description.trim() || 'KPC 사내 직무 지원을 위한 맞춤형 AI Agent입니다.',
      targetPurpose: targetPurpose.trim(),
      reasonCreated: targetPurpose.trim(),
      howToUse: '1. 업무 내용 및 지시사항 입력\n2. AI Agent 분석 및 서식 변환\n3. 결과 검토 및 사내 시스템 전달',
      author: initialAgent?.author || '정소담',
      department: initialAgent?.department || 'AI전략팀',
      category: selectedTags[0] || '업무지원',
      createdAt: initialAgent?.createdAt || '2026.09.17',
      updatedAt: '2026.09.17',
      version: version,
      likes: initialAgent?.likes || 0,
      userLiked: initialAgent?.userLiked || false,
      isSaved: initialAgent?.isSaved || false,
      views: (initialAgent?.views || 0) + 1,
      forks: initialAgent?.forks || 0,
      runs: (initialAgent?.runs || 0) + testMessages.length,
      commentsCount: initialAgent?.commentsCount || 0,
      auditNominated: initialAgent?.auditNominated || false,
      nominationCount: initialAgent?.nominationCount || 0,
      status: newStatus || status,
      developmentType: 'agent',
      exampleInputs: initialAgent?.exampleInputs || '회의 녹취록 및 안건 메모',
      exampleOutput: initialAgent?.exampleOutput || '핵심 결정사항 요약 및 Action Item',
      tags: selectedTags,
      mainImageUrl: cardImageUrl || initialAgent?.mainImageUrl,
      thumbnailUrl: cardImageUrl || initialAgent?.thumbnailUrl,
      icon: customIconUrl || initialAgent?.icon,
      promptPreview: systemPrompt.slice(0, 120) + '...',
      systemPrompt: systemPrompt,
      selectedModel: modelChoice,
      visibilityScope: visibilityScope === '전사' ? '전사 공개' : visibilityScope,
      iconBg: selectedIconBg,
      knowledgeFiles: knowledgeList.map(k => ({
        id: k.id,
        name: k.name,
        format: k.type,
        size: k.size || '1MB',
        date: k.date
      })),
      knowledgeSources: {
        knowledgeAi: knowledgeList.some(k => k.type === 'Knowledge AI'),
        sharePoint: knowledgeList.some(k => k.type === 'SharePoint'),
        oneDrive: knowledgeList.some(k => k.type === 'OneDrive'),
        approvedInternal: true,
        teams: knowledgeList.some(k => k.type === 'Teams')
      },
      connectors: activeConnectorIds.map(id => {
        const c = ALL_CONNECTORS.find(conn => conn.id === id);
        const pStatus: '권한 필요' | '승인됨' = c?.permissionStatus === 'restricted' ? '권한 필요' : '승인됨';
        return {
          id: id,
          name: c?.name || id,
          desc: c?.description || '사내 시스템 연동',
          status: '연결됨' as const,
          permStatus: pStatus,
          enabled: true
        };
      }),
      comments: initialAgent?.comments || [],
      changelog: initialAgent?.changelog || [
        {
          version: version,
          date: '2026.09.17',
          changes: ['Agent 제작 Studio에서 설정 업데이트']
        }
      ]
    };
  };

  // Action: Save Draft
  const handleSaveDraft = () => {
    if (!title.trim()) {
      onShowToast('Agent 이름을 먼저 입력해주세요.');
      return;
    }
    const agent = buildCurrentAgent('초안');
    setStatus('초안');
    setIsDirty(false);
    onSaveDraft(agent);
    onShowToast(`'${title}'이(가) 초안으로 안전하게 저장되었습니다.`);
  };

  // Action: Direct Publish (추가 모달 없이 즉시 업로드/게시)
  const handlePublishDirect = () => {
    if (!title.trim()) {
      onShowToast('Agent 이름을 먼저 입력해주세요.');
      return;
    }
    const agent = buildCurrentAgent('Community 게시');
    agent.status = 'Community 게시';
    setStatus('Community 게시');
    setIsDirty(false);
    onPublish(agent);
    onShowToast(`'${title}'이(가) AI Community에 성공적으로 게시되었습니다.`);
  };

  // Action: Toggle Connector
  const handleToggleConnector = (id: string) => {
    const conn = ALL_CONNECTORS.find(c => c.id === id);
    if (conn?.permissionStatus === 'restricted') {
      onShowToast(`'${conn.name}' 커넥터는 사전 승인 권한이 필요하여 활성화할 수 없습니다.`);
      return;
    }

    setIsDirty(true);
    setActiveConnectorIds(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  // Action: Add Knowledge Item
  const handleAddKnowledge = (name: string, type: KnowledgeSourceItem['type'], loc: string) => {
    const newItem: KnowledgeSourceItem = {
      id: `k-${Date.now()}`,
      name,
      type,
      location: loc,
      hasAccessControl: true,
      size: type === 'PDF' ? '1.5 MB' : '사내 연동',
      date: '2026.09.17'
    };
    setKnowledgeList(prev => [...prev, newItem]);
    setShowAddKnowledgeModal(false);
    setIsDirty(true);
    onShowToast(`지식 '${name}'이(가) 연결되었습니다.`);
  };

  // Action: Remove Knowledge Item
  const handleRemoveKnowledge = (id: string) => {
    setKnowledgeList(prev => prev.filter(k => k.id !== id));
    setIsDirty(true);
    onShowToast('연결된 지식이 삭제되었습니다.');
  };

  // Action: AI로 개선
  const handleTriggerAiImprove = () => {
    setIsImprovingPrompt(true);
    setTimeout(() => {
      const refined = `당신은 한국생산성본부(KPC)의 전문 [${title || '업무 지원'}] AI Agent입니다.

[역할 및 페르소나]
- KPC 임직원의 사내 직무 생산성 향상을 위한 정밀 비즈니스 보조 비서입니다.
- 신뢰성 높고 명확한 개조식 문체와 공공·엔터프라이즈 표준 어조를 유지합니다.

[핵심 업무 수행 지침]
1. 사용자가 전달한 업무 내용과 배경 데이터를 다각도로 분석하여 핵심 요건을 먼저 도출합니다.
2. 연결된 사내 지식(${knowledgeList.map(k => k.name).slice(0, 2).join(', ')})의 공식 규정과 운영 가이드를 최우선 준거로 인용합니다.
3. 결과물은 반드시 즉시 실무에 적용 가능한 Action Item(담당자, 목표 기한, 산출물 서식)을 포함하여 구조화합니다.

[보안 및 거버넌스 제약사항]
- 권한이 승인되지 않은 내부 기밀 및 개인정보는 임의 발췌하지 않으며, DLP 필터링 규정을 준수합니다.
- 확실하지 않은 추측성 정보는 답변하지 않고, 사내 담당 부서에 교차 확인할 것을 명시합니다.`;
      
      setImprovedPromptDraft(refined);
      setIsImprovingPrompt(false);
      setShowAiImproveModal(true);
    }, 600);
  };

  const handleApplyImprovedPrompt = () => {
    setSystemPrompt(improvedPromptDraft);
    setShowAiImproveModal(false);
    setIsDirty(true);
    onShowToast('AI가 개선한 전문 지침이 성공적으로 적용되었습니다.');
  };

  // Action: Test Chat Execution
  const handleExecuteTest = (customPrompt?: string) => {
    const promptToSend = customPrompt || testInput;
    if (!promptToSend.trim() || isTesting) return;

    const userMsg: TestMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: promptToSend
    };

    setTestMessages(prev => [...prev, userMsg]);
    if (!customPrompt) setTestInput('');
    setIsTesting(true);

    setTimeout(() => {
      const activeConns = ALL_CONNECTORS.filter(c => activeConnectorIds.includes(c.id));
      let reply = '';
      let source = 'KPC 회의 운영 가이드.pdf';

      if (promptToSend.includes('회의') || promptToSend.includes('정리')) {
        reply = `회의 내용을 분석한 결과는 다음과 같습니다.\n\n1. **핵심 논의사항**\n   - 사내 AI Agent 스튜디오 정식 도입 및 KPC 맞춤형 템플릿 배포 추진\n   - 데이터 보안 및 접근 권한 분리 기준 검토\n\n2. **주요 의사결정 사항**\n   - 전사 임직원 대상 자연어 기반 Agent 제작 기능 오픈 결정\n   - 공식 Agent는 사전 검수 승인 절차를 거친 항목만 등록\n\n3. **담당자별 Action Item**\n   - [정소담 / AI전략팀] 9/18(금)까지 임직원 활용 가이드 게시\n   - [디지털혁신팀] SharePoint 연동 권한 동기화 점검`;
        source = '회의록_2026-09-17_사내정례';
      } else if (promptToSend.includes('규정') || promptToSend.includes('여비') || promptToSend.includes('출장')) {
        reply = `KPC 사내 여비 규정 제14조(국내 출장 여비)에 따른 안내입니다.\n\n■ **일비 및 식비 기준**: 1일 기준 일비 25,000원, 식비 25,000원 정액 지급\n■ **숙박비 실비 인정**: 서울 및 광역시 1박 80,000원 한도 내 법인카드 결제\n■ **정산 필수 증빙**: 출장신청서, 고속철도(KTX) 영수증, 숙박 영수증 첨부\n\n추가 예외 사항은 경영기획실 총무인사팀 규정 매뉴얼을 참고하시기 바랍니다.`;
        source = 'KPC_여비지급규정_2026.pdf';
      } else if (promptToSend.includes('교육') || promptToSend.includes('추천')) {
        reply = `임직원 직무 역량 강화를 위한 추천 교육과정 목록입니다.\n\n1. **생성형 AI 비즈니스 프롬프트 엔지니어링 실무** (3일/21시간)\n   - 주관: KPC 디지털혁신센터\n   - 주요 내용: 사내 업무 자동화 및 Agent 커스텀 빌드 실습\n\n2. **데이터 기반 성과관리 및 KPI 분석 실무** (2일/14시간)\n   - 직급 추천: 전 직급 및 팀장 후보자`;
        source = '2026_KPC_공개교육_카탈로그.xlsx';
      } else {
        reply = `**[${title || 'AI Agent'} 업무 수행 결과]**\n\n입력하신 내용("${promptToSend.slice(0, 30)}...")에 대해 설정된 **시스템 지침** 및 연결된 **사내 지식(${knowledgeList[0]?.name || '표준 가이드'})**을 바탕으로 분석을 완료했습니다.\n\n- **적용 지침**: ${systemPrompt.split('\n')[0]}\n- **연동 커넥터**: ${activeConns.map(c => c.name).join(', ') || '기본 커넥터'}\n- **보안 검증**: DLP 민감정보 필터링 통과`;
        source = knowledgeList[0]?.name || '사내 지식베이스';
      }

      const agentMsg: TestMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: reply,
        model: modelChoice === 'auto' ? '자동 선택 (Gemini 2.5 Flash)' : modelChoice.toUpperCase(),
        usedConnectors: activeConns.map(c => c.name),
        sourceDoc: source,
        executionTime: '240ms',
        showDetails: false
      };

      setTestMessages(prev => [...prev, agentMsg]);
      setIsTesting(false);
    }, 700);
  };

  const handleToggleMessageDetails = (msgId: string) => {
    setTestMessages(prev => 
      prev.map(m => m.id === msgId ? { ...m, showDetails: !m.showDetails } : m)
    );
  };

  const handleResetChat = () => {
    setTestMessages([
      {
        id: `msg-reset-${Date.now()}`,
        sender: 'agent',
        text: `채팅이 초기화되었습니다. 현재 설정된 **${title}** 상태로 테스트를 다시 시작할 수 있습니다.`,
        model: modelChoice === 'auto' ? '자동 선택' : modelChoice.toUpperCase(),
        usedConnectors: activeConnectorIds.map(id => ALL_CONNECTORS.find(c => c.id === id)?.name || id),
        sourceDoc: 'KPC 회의 운영 가이드',
        executionTime: '150ms',
        showDetails: false
      }
    ]);
    onShowToast('테스트 채팅창이 초기화되었습니다.');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F8F9FA] overflow-hidden">
      
      {/* ─────────────────────────────────────────────────────────────
          상단 고정 헤더:
          뒤로가기: AI Community | Agent 이름 | 상태: 초안 | 저장 상태 | [초안 저장] [Community에 게시]
          ───────────────────────────────────────────────────────────── */}
      <header className="h-16 bg-white border-b border-neutral-200 px-6 flex items-center justify-between shrink-0 z-20 shadow-2xs">
        <div className="flex items-center gap-4 min-w-0">
          {/* 뒤로가기 버튼 */}
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 px-2.5 py-1.5 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">AI Community</span>
          </button>

          <div className="h-4 w-px bg-neutral-200" />

          {/* Agent Title & Status Badge */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-red-50 text-[#E60012] border border-red-200 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-bold text-neutral-900 text-sm sm:text-base truncate max-w-[180px] sm:max-w-xs">
                {title || '새 AI Agent'}
              </span>
              <span className="shrink-0 px-2 py-0.5 rounded-full text-[11px] font-bold border bg-neutral-100 text-neutral-700 border-neutral-200">
                {status}
              </span>
              <span className="hidden md:inline-flex items-center text-[11px] text-neutral-400 font-mono">
                {isDirty ? '● 수정 중' : '✓ 방금 저장됨'}
              </span>
            </div>
          </div>
        </div>

        {/* 우측 상단 액션 버튼군 */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* [초안 저장] 버튼 */}
          <button
            type="button"
            id="btn-save-draft"
            onClick={handleSaveDraft}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-800 text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
          >
            <Save className="w-3.5 h-3.5 text-neutral-500" />
            <span>초안 저장</span>
          </button>

          {/* [Community에 게시] 버튼 */}
          <button
            type="button"
            id="btn-publish-community"
            onClick={handlePublishDirect}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#E60012] hover:bg-[#CC0010] text-white text-xs font-bold transition-all cursor-pointer shadow-xs active:scale-98"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Community에 게시</span>
          </button>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2열 편집 레이아웃:
          좌측 약 60% : Agent 설정 (6개 메뉴)
          우측 약 40% : Agent 테스트 (실시간 상호작용 채팅)
          ───────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
        
        {/* =========================================================
            좌측 (약 60%): Agent 설정 패널
            ========================================================= */}
        <div className="flex-1 lg:w-[60%] flex flex-col bg-white border-r border-neutral-200 overflow-hidden">
          
          {/* 설정 서브 메뉴 탭바 (6개) */}
          <div className="border-b border-neutral-200 bg-neutral-50/70 px-6 shrink-0 flex items-center gap-1 overflow-x-auto no-scrollbar">
            {[
              { id: 'basic', label: '1. 기본 정보', icon: <Info className="w-3.5 h-3.5" /> },
              { id: 'instructions', label: '2. 지침', icon: <Sliders className="w-3.5 h-3.5" /> },
              { id: 'knowledge', label: '3. 지식', icon: <BookOpen className="w-3.5 h-3.5" /> },
              { id: 'connectors', label: '4. 도구·커넥터', icon: <Cloud className="w-3.5 h-3.5" /> },
              { id: 'model', label: '5. 모델', icon: <Cpu className="w-3.5 h-3.5" /> },
              { id: 'permissions', label: '6. 권한', icon: <Lock className="w-3.5 h-3.5" /> }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 py-3 px-3 text-xs font-semibold border-b-2 whitespace-nowrap cursor-pointer transition-all ${
                  activeTab === tab.id
                    ? 'border-[#E60012] text-[#E60012] bg-white'
                    : 'border-transparent text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100/60'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* 탭 본문 스크롤 영역 */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
            
            {/* ─────────────────────────────────────────────────────
                1. 기본 정보 탭
                ───────────────────────────────────────────────────── */}
            {activeTab === 'basic' && (
              <div className="space-y-6 max-w-2xl">
                {/* Agent 이름 */}
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                    Agent 이름 <span className="text-[#E60012]">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => { setTitle(e.target.value); setIsDirty(true); }}
                    placeholder="예: 회의 정리 도우미"
                    className="w-full text-sm text-neutral-900 border border-neutral-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-neutral-900 transition-colors"
                  />
                </div>

                {/* 카드 예시 화면 이미지 업로드 섹션 (설명 위에 위치) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-neutral-800">
                      카드 예시 화면 이미지 <span className="text-neutral-400 font-normal">(선택)</span>
                    </label>
                    <span className="text-[11px] text-neutral-400">
                      Community 카드에 노출될 대표 예시 화면
                    </span>
                  </div>

                  <input
                    type="file"
                    ref={cardImageInputRef}
                    onChange={handleCardImageUpload}
                    accept="image/*"
                    className="hidden"
                  />

                  {cardImageUrl ? (
                    <div className="relative rounded-xl border border-neutral-200 overflow-hidden bg-neutral-50 group">
                      <img
                        src={cardImageUrl}
                        alt="Card Example Preview"
                        className="w-full h-44 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => cardImageInputRef.current?.click()}
                          className="px-3 py-1.5 rounded-lg bg-white/95 hover:bg-white text-neutral-800 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>이미지 변경</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setCardImageUrl('');
                            setIsDirty(true);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>삭제</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => cardImageInputRef.current?.click()}
                      className="border-2 border-dashed border-neutral-200 hover:border-neutral-400 rounded-xl p-5 text-center bg-neutral-50/50 hover:bg-neutral-50 transition-colors cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-xl bg-white shadow-2xs border border-neutral-200 flex items-center justify-center mx-auto mb-1.5 text-neutral-500">
                        <Upload className="w-4 h-4 text-neutral-400" />
                      </div>
                      <p className="text-xs font-bold text-neutral-700">
                        클릭하여 카드 예시 화면 이미지를 업로드하세요
                      </p>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        PNG, JPG, WEBP 지원 · 미등록 시 기본 카테고리 그래픽 적용
                      </p>
                    </div>
                  )}
                </div>

                {/* Agent 설명 */}
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                    설명 <span className="text-[#E60012]">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => { setDescription(e.target.value); setIsDirty(true); }}
                    placeholder="회의 내용을 분석하여 핵심 안건과 담당자별 할 일을 정리합니다."
                    className="w-full text-sm text-neutral-900 border border-neutral-300 rounded-xl p-3.5 focus:outline-none focus:border-neutral-900 transition-colors resize-none leading-relaxed"
                  />
                </div>

                {/* 활용 목적 */}
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                    활용 목적
                  </label>
                  <input
                    type="text"
                    value={targetPurpose}
                    onChange={(e) => { setTargetPurpose(e.target.value); setIsDirty(true); }}
                    placeholder="어떤 사내 업무에 사용하는지 간단히 작성하세요 (예: 회의 요약 및 액션 아이템 추출)"
                    className="w-full text-sm text-neutral-900 border border-neutral-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-neutral-900 transition-colors"
                  />
                </div>

                {/* 태그 설정 */}
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                    태그
                  </label>

                  {/* 텍스트필드 (태그 칩 포함, placeholder 설명 삭제) */}
                  <div className="flex flex-wrap items-center gap-1.5 p-2 bg-white border border-neutral-300 rounded-xl focus-within:border-neutral-900 transition-colors">
                    {selectedTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-medium border border-neutral-200"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedTags(prev => prev.filter(t => t !== tag));
                            setIsDirty(true);
                          }}
                          className="text-neutral-400 hover:text-[#E60012] cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}

                    <input
                      type="text"
                      value={customTagInput}
                      onChange={(e) => setCustomTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if ((e.key === 'Enter' || e.key === ',') && customTagInput.trim()) {
                          e.preventDefault();
                          const cleanTag = customTagInput.trim().replace(/^#/, '');
                          if (cleanTag && !selectedTags.includes(cleanTag)) {
                            setSelectedTags(prev => [...prev, cleanTag]);
                            setIsDirty(true);
                          }
                          setCustomTagInput('');
                        }
                      }}
                      placeholder=""
                      className="flex-1 min-w-[120px] text-xs text-neutral-900 border-none outline-none bg-transparent py-1 px-1"
                    />
                  </div>

                  {/* 텍스트필드 아래 기본 태그들 (클릭 시 텍스트필드로 들어감) */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    {['회의', '요약', '업무지원', '기획', '규정', '데이터분석', '교육', '보고서', '일정관리', '고객응대'].map((p) => {
                      const isSelected = selectedTags.includes(p);
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => {
                            if (!isSelected) {
                              setSelectedTags(prev => [...prev, p]);
                            } else {
                              setSelectedTags(prev => prev.filter(t => t !== p));
                            }
                            setIsDirty(true);
                          }}
                          className={`px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors border ${
                            isSelected
                              ? 'bg-red-50 text-[#E60012] border-red-200 font-semibold'
                              : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-600 border-neutral-200'
                          }`}
                        >
                          {isSelected ? `✓ #${p}` : `+ #${p}`}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Agent 아이콘 테마 */}
                <div>
                  <label className="block text-xs font-bold text-neutral-800 mb-2">
                    Agent 아이콘
                  </label>
                  <div className="flex items-center gap-3">
                    {[
                      { label: 'KPC Red', bg: 'bg-red-50 text-[#E60012] border-red-200' },
                      { label: 'Blue', bg: 'bg-blue-50 text-blue-600 border-blue-200' },
                      { label: 'Emerald', bg: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
                      { label: 'Purple', bg: 'bg-purple-50 text-purple-600 border-purple-200' },
                      { label: 'Dark', bg: 'bg-neutral-900 text-white border-neutral-800' }
                    ].map(item => (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => {
                          setSelectedIconBg(item.bg);
                          setCustomIconUrl('');
                          setIsDirty(true);
                        }}
                        className={`w-9 h-9 rounded-xl border flex items-center justify-center cursor-pointer transition-all ${item.bg} ${
                          selectedIconBg === item.bg && !customIconUrl ? 'ring-2 ring-neutral-900 ring-offset-2' : 'hover:opacity-80'
                        }`}
                      >
                        <Bot className="w-5 h-5" />
                      </button>
                    ))}

                    {/* 아이콘 맨 오른쪽에 같은 사이즈의 추가 버튼 (+) */}
                    <input
                      type="file"
                      ref={iconFileInputRef}
                      onChange={handleCustomIconUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      title="사용자 아이콘 등록 (이미지 업로드)"
                      onClick={() => iconFileInputRef.current?.click()}
                      className={`w-9 h-9 rounded-xl border flex items-center justify-center cursor-pointer transition-all overflow-hidden ${
                        customIconUrl
                          ? 'ring-2 ring-neutral-900 ring-offset-2 border-neutral-400 bg-white'
                          : 'border-dashed border-neutral-300 bg-neutral-50 hover:bg-neutral-100 text-neutral-500 hover:text-neutral-800'
                      }`}
                    >
                      {customIconUrl ? (
                        <img src={customIconUrl} alt="Custom Icon" className="w-full h-full object-cover" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ─────────────────────────────────────────────────────
                2. 지침 탭 (Agent 지침 & AI로 개선)
                ───────────────────────────────────────────────────── */}
            {activeTab === 'instructions' && (
              <div className="space-y-5 max-w-3xl">
                <div className="flex items-center justify-end">
                  {/* [AI로 개선] 버튼 */}
                  <button
                    type="button"
                    onClick={handleTriggerAiImprove}
                    disabled={isImprovingPrompt}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-black text-white text-xs font-bold shadow-xs cursor-pointer transition-all shrink-0"
                  >
                    <Wand2 className="w-3.5 h-3.5 text-red-400" />
                    <span>AI로 개선</span>
                  </button>
                </div>

                {/* 큰 텍스트 입력창 */}
                <div className="relative">
                  <textarea
                    rows={12}
                    value={systemPrompt}
                    onChange={(e) => { setSystemPrompt(e.target.value); setIsDirty(true); }}
                    placeholder="당신은 KPC 임직원의 회의 정리를 지원하는 AI Agent입니다.&#10;&#10;1. 회의의 핵심 논의사항을 요약합니다.&#10;2. 주요 의사결정 사항을 별도로 정리합니다.&#10;3. 담당자별 Action Item을 정리합니다.&#10;4. 확인되지 않은 내용은 임의로 생성하지 않습니다."
                    className="w-full text-sm font-mono text-neutral-900 bg-neutral-50/50 border border-neutral-300 rounded-xl p-4 focus:outline-none focus:border-neutral-900 focus:bg-white transition-all resize-none leading-relaxed"
                  />
                  <div className="absolute bottom-3 right-3 text-[11px] text-neutral-400 font-mono">
                    {systemPrompt.length}자
                  </div>
                </div>

                <div className="bg-neutral-50 rounded-xl p-3.5 border border-neutral-200/80 flex items-start gap-2.5 text-xs text-neutral-600">
                  <Info className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong>작성 팁:</strong> Agent가 수행해야 할 업무 순서(1, 2, 3단계)와 지켜야 할 제약 조건(예: 확인되지 않은 사실 작성 금지, 표준 서식 준수)을 번호로 구분하여 명확히 명시하면 답변 정확도가 대폭 향상됩니다.
                  </p>
                </div>
              </div>
            )}

            {/* ─────────────────────────────────────────────────────
                3. 지식 탭 (문서, Knowledge AI, M365)
                ───────────────────────────────────────────────────── */}
            {activeTab === 'knowledge' && (
              <div className="space-y-6 max-w-3xl">
                <div className="flex items-center justify-end">
                  {/* [+ 지식 추가] 버튼 */}
                  <button
                    type="button"
                    onClick={() => setShowAddKnowledgeModal(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#E60012] hover:bg-[#CC0010] text-white text-xs font-bold transition-all cursor-pointer shadow-xs shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ 지식 추가</span>
                  </button>
                </div>

                {/* 중요 보안 안내 배너 (사용자 요구사항) */}
                <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-4 flex items-start gap-3 text-xs text-amber-900">
                  <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold">접근 권한 보호 원칙</p>
                    <p className="text-amber-800 leading-relaxed">
                      사용자가 Agent를 공유하더라도 연결된 원본 문서의 접근 권한은 변경되지 않습니다. 사용자가 접근할 권한이 없는 문서는 Agent를 통해서도 조회할 수 없습니다.
                    </p>
                  </div>
                </div>

                {/* 연결된 지식 카드 목록 */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                    연결된 지식 목록 ({knowledgeList.length}건)
                  </h3>

                  {knowledgeList.length === 0 ? (
                    <div className="p-8 text-center border-2 border-dashed border-neutral-200 rounded-xl bg-neutral-50">
                      <BookOpen className="w-6 h-6 text-neutral-400 mx-auto mb-2" />
                      <p className="text-xs font-semibold text-neutral-600">연결된 지식이 없습니다.</p>
                      <p className="text-[11px] text-neutral-400 mt-0.5">상단의 '+ 지식 추가' 버튼을 눌러 문서를 연결해보세요.</p>
                    </div>
                  ) : (
                    knowledgeList.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white border border-neutral-200 rounded-xl p-4 flex items-center justify-between gap-4 hover:border-neutral-300 transition-colors shadow-2xs"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-neutral-100 flex items-center justify-center shrink-0 border border-neutral-200">
                            {item.type === 'SharePoint' ? (
                              <Globe className="w-4 h-4 text-blue-600" />
                            ) : item.type === 'Knowledge AI' ? (
                              <Database className="w-4 h-4 text-[#E60012]" />
                            ) : (
                              <FileText className="w-4 h-4 text-neutral-700" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-xs sm:text-sm text-neutral-900 truncate">
                                {item.name}
                              </h4>
                              <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-100 text-neutral-600">
                                {item.type}
                              </span>
                            </div>
                            <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                              {item.location} {item.size && `· ${item.size}`}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 shrink-0">
                          {/* 권한 적용 여부 배지 */}
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold border border-emerald-200">
                            <Lock className="w-3 h-3 text-emerald-600" />
                            <span>접근 권한 적용</span>
                          </span>

                          {/* 삭제 버튼 */}
                          <button
                            type="button"
                            onClick={() => handleRemoveKnowledge(item.id)}
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="지식 연결 삭제"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* ─────────────────────────────────────────────────────
                4. 도구·커넥터 탭 (업무시스템, M365, 기타)
                ───────────────────────────────────────────────────── */}
            {activeTab === 'connectors' && (
              <div className="space-y-6 max-w-3xl">
                {/* 커넥터 카테고리별 섹션 */}
                {[
                  { cat: 'business', title: '업무 시스템', desc: 'KPC 사내 직무 및 행정 시스템 연계' },
                  { cat: 'm365', title: 'Microsoft 365', desc: '팀즈, 셰어포인트, 원드라이브 데이터 연계' },
                  { cat: 'other', title: '기타 시스템', desc: '외부 API 및 마이크로서비스 연동' }
                ].map(group => {
                  const items = ALL_CONNECTORS.filter(c => c.category === group.cat);
                  return (
                    <div key={group.cat} className="space-y-3">
                      <div className="border-b border-neutral-100 pb-1.5">
                        <h3 className="text-xs font-bold text-neutral-800">{group.title}</h3>
                        <p className="text-[11px] text-neutral-400">{group.desc}</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {items.map((conn) => {
                          const isEnabled = activeConnectorIds.includes(conn.id);
                          const isRestricted = conn.permissionStatus === 'restricted';

                          return (
                            <div
                              key={conn.id}
                              className={`p-4 rounded-xl border transition-all ${
                                isRestricted
                                  ? 'bg-neutral-50/70 border-neutral-200 opacity-60'
                                  : isEnabled
                                  ? 'bg-white border-[#E60012]/40 shadow-xs'
                                  : 'bg-white border-neutral-200 hover:border-neutral-300'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2 mb-1.5">
                                <div className="flex items-center gap-2">
                                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                                    isEnabled ? 'bg-red-50 text-[#E60012]' : 'bg-neutral-100 text-neutral-500'
                                  }`}>
                                    <Cloud className="w-3.5 h-3.5" />
                                  </div>
                                  <h4 className="text-xs font-bold text-neutral-900">{conn.name}</h4>
                                </div>

                                <button
                                  type="button"
                                  disabled={isRestricted}
                                  onClick={() => handleToggleConnector(conn.id)}
                                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                                    isRestricted
                                      ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                                      : isEnabled
                                      ? 'bg-[#E60012] text-white shadow-2xs'
                                      : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
                                  }`}
                                >
                                  {isRestricted ? '권한 필요' : isEnabled ? '연결됨' : '연결하기'}
                                </button>
                              </div>

                              <p className="text-[11px] text-neutral-500 line-clamp-2 leading-relaxed mb-2.5">
                                {conn.description}
                              </p>

                              <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-2 border-t border-neutral-100">
                                <span>시스템: {conn.systemName}</span>
                                <span className={`font-semibold ${
                                  conn.permissionStatus === 'available' ? 'text-emerald-600' : 'text-amber-600'
                                }`}>
                                  {conn.permissionStatus === 'available' ? '● 사용 가능' : '▲ 사전 승인 필요'}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ─────────────────────────────────────────────────────
                5. 모델 탭 (자동 선택 권장 및 승인 모델)
                ───────────────────────────────────────────────────── */}
            {activeTab === 'model' && (
              <div className="space-y-6 max-w-2xl">
                {/* 기본 옵션: 자동 선택 (권장) */}
                <div 
                  onClick={() => { setModelChoice('auto'); setIsDirty(true); }}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    modelChoice === 'auto'
                      ? 'border-[#E60012] bg-red-50/20 shadow-xs'
                      : 'border-neutral-200 bg-white hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-[#E60012] flex items-center justify-center">
                        {modelChoice === 'auto' && <div className="w-2 h-2 rounded-full bg-[#E60012]" />}
                      </div>
                      <span className="text-sm font-bold text-neutral-900">
                        ● 자동 선택 (권장)
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E60012] text-white">
                      추천
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 pl-5.5 leading-relaxed">
                    데이터 등급, 비용, 업무 유형에 따라 관리자가 설정한 범위에서 적절한 AI 모델을 자동 선택합니다.
                  </p>
                </div>

                {/* 관리자 승인 추가 선택 옵션 */}
                <div className="space-y-2.5">
                  <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-wider">
                    관리자 승인 모델 직접 지정
                  </h3>

                  {[
                    { id: 'gpt', name: 'GPT', sub: 'OpenAI GPT-4o / GPT-4o Mini', desc: '복잡한 추론 및 다국어, 고난도 보고서 분석에 최적화' },
                    { id: 'claude', name: 'Claude', sub: 'Anthropic Claude 3.5 Sonnet', desc: '장문 문서 요약 및 자연스러운 비즈니스 서식 작성에 우수' },
                    { id: 'gemini', name: 'Gemini', sub: 'Google Gemini 2.5 Flash / Pro', desc: '초고속 응답 속도 및 대용량 멀티모달 컨텍스트 처리에 최적화' }
                  ].map(item => (
                    <div
                      key={item.id}
                      onClick={() => { setModelChoice(item.id as any); setIsDirty(true); }}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        modelChoice === item.id
                          ? 'border-neutral-900 bg-neutral-50 shadow-xs'
                          : 'border-neutral-200 bg-white hover:border-neutral-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div className="w-3.5 h-3.5 rounded-full border border-neutral-400 flex items-center justify-center">
                            {modelChoice === item.id && <div className="w-2 h-2 rounded-full bg-neutral-900" />}
                          </div>
                          <span className="text-xs font-bold text-neutral-900">{item.name}</span>
                          <span className="text-[11px] text-neutral-400">({item.sub})</span>
                        </div>
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          승인됨
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 pl-5.5">{item.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-500 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-neutral-400 shrink-0" />
                  <span>KPC 사내 보안 및 AI 거버넌스 가이드라인에 따라 모든 질의는 DLP 보안 프록시를 경유합니다.</span>
                </div>
              </div>
            )}

            {/* ─────────────────────────────────────────────────────
                6. 권한 탭 (사용 권한 & 데이터 분리 원칙)
                ───────────────────────────────────────────────────── */}
            {activeTab === 'permissions' && (
              <div className="space-y-6 max-w-2xl">
                {/* 사용 권한 라디오 그룹 */}
                <div className="space-y-2.5">
                  {[
                    { id: '나만 사용', label: '나만 사용 (비공개)', desc: '제작자 본인만 테스트 및 실행할 수 있는 비공개 상태입니다.' },
                    { id: '특정 부서', label: '특정 부서', desc: '소속 부서(AI전략팀 등) 임직원만 접근하여 활용할 수 있습니다.' },
                    { id: '특정 그룹', label: '특정 프로젝트 그룹', desc: '지정된 TF 또는 프로젝트 팀원에게만 실행 권한을 부여합니다.' },
                    { id: '전사', label: '전사 공개', desc: 'KPC 사내 모든 임직원이 Community에서 검색하고 실행할 수 있습니다.' }
                  ].map(scope => (
                    <label
                      key={scope.id}
                      className={`p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                        visibilityScope === scope.id
                          ? 'border-[#E60012] bg-red-50/20'
                          : 'border-neutral-200 bg-white hover:border-neutral-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="permission-scope"
                        checked={visibilityScope === scope.id}
                        onChange={() => { setVisibilityScope(scope.id as any); setIsDirty(true); }}
                        className="mt-0.5 text-[#E60012] focus:ring-[#E60012]"
                      />
                      <div>
                        <span className="text-xs font-bold text-neutral-900">{scope.label}</span>
                        <p className="text-[11px] text-neutral-500 mt-0.5">{scope.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {/* 부서 선택 (특정 부서 선택 시) */}
                {visibilityScope === '특정 부서' && (
                  <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2">
                    <label className="block text-xs font-bold text-neutral-800">
                      허용 부서 선택
                    </label>
                    <select
                      value={targetDepartment}
                      onChange={(e) => { setTargetDepartment(e.target.value); setIsDirty(true); }}
                      className="w-full text-xs text-neutral-900 border border-neutral-300 rounded-lg p-2 bg-white"
                    >
                      <option value="AI전략팀">AI전략팀</option>
                      <option value="디지털혁신센터">디지털혁신센터</option>
                      <option value="교육사업본부">교육사업본부</option>
                      <option value="자격인증본부">자격인증본부</option>
                      <option value="경영기획실">경영기획실</option>
                    </select>
                  </div>
                )}

                {/* 중요 권한 분리 안내 배너 (사용자 요구사항 필수 명시) */}
                <div className="bg-neutral-900 text-white rounded-xl p-4 flex items-start gap-3 text-xs">
                  <ShieldCheck className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold text-white">Agent 공개 범위와 데이터 접근 권한 분리 안내</p>
                    <p className="text-neutral-300 leading-relaxed text-[11px]">
                      Agent 공개 범위가 '전사'로 설정되더라도, 연결된 SharePoint 내부 문서나 ERP 데이터에 대한 개별 직원의 원본 접근 권한은 기존 Microsoft 365 보안 정책이 그대로 적용됩니다. 즉, 권한이 없는 직원은 Agent를 통하더라도 해당 문서를 조회할 수 없습니다.
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* =========================================================
            우측 (약 40%): Agent 실시간 테스트 영역 (Copilot Studio UX)
            ========================================================= */}
        <div className="flex-1 lg:w-[40%] flex flex-col bg-neutral-50 min-h-0">
          
          {/* 테스트 헤더 */}
          <div className="h-12 bg-white border-b border-neutral-200 px-5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-xs font-bold text-neutral-900">Agent 테스트</h3>
              <span className="text-[11px] text-neutral-400 hidden sm:inline">| 실시간 동작 검증</span>
            </div>

            <button
              type="button"
              onClick={handleResetChat}
              className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
              title="대화 내용 초기화"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 안내 바 */}
          <div className="bg-neutral-100/80 px-4 py-2 text-[11px] text-neutral-500 border-b border-neutral-200 shrink-0 flex items-center justify-between">
            <span>현재 설정으로 Agent를 테스트해보세요.</span>
            <span className="font-mono text-[10px] text-neutral-400">
              모델: {modelChoice === 'auto' ? '자동 선택' : modelChoice.toUpperCase()}
            </span>
          </div>

          {/* 채팅 메시지 스크롤 뷰 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {testMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-neutral-900 text-white rounded-tr-xs'
                      : 'bg-white text-neutral-900 border border-neutral-200/80 rounded-tl-xs shadow-2xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>

                {/* Agent 답변 하단: [실행 정보 보기] 토글 (사용자 요구사항) */}
                {msg.sender === 'agent' && (
                  <div className="mt-1.5 max-w-[88%]">
                    <button
                      type="button"
                      onClick={() => handleToggleMessageDetails(msg.id)}
                      className="inline-flex items-center gap-1 text-[10px] font-semibold text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer"
                    >
                      <Info className="w-3 h-3 text-neutral-400" />
                      <span>{msg.showDetails ? '실행 정보 닫기' : '[실행 정보 보기]'}</span>
                      {msg.showDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>

                    {/* 펼쳐진 실행 정보 카드 */}
                    {msg.showDetails && (
                      <div className="mt-1.5 p-3 rounded-xl bg-neutral-100/90 border border-neutral-200 text-[10px] text-neutral-600 space-y-1 animate-in fade-in duration-150">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-neutral-700">사용 모델:</span>
                          <span className="font-mono">{msg.model || '자동 선택'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-neutral-700">참고한 출처:</span>
                          <span className="truncate max-w-[150px]">{msg.sourceDoc || '사내 지식베이스'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-neutral-700">호출된 커넥터:</span>
                          <span className="truncate max-w-[150px]">
                            {msg.usedConnectors && msg.usedConnectors.length > 0
                              ? msg.usedConnectors.join(', ')
                              : 'Teams, SharePoint'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between pt-1 border-t border-neutral-200/60">
                          <span className="font-bold text-neutral-700">오류 발생 여부:</span>
                          <span className="text-emerald-700 font-semibold">정상 실행 (오류 없음)</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {isTesting && (
              <div className="flex items-center gap-2 text-xs text-neutral-500 bg-white border border-neutral-200/80 p-3 rounded-xl max-w-[200px] shadow-2xs">
                <div className="w-2 h-2 rounded-full bg-[#E60012] animate-ping" />
                <span>지침 분석 및 답변 생성 중...</span>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* 추천 테스트 질문 칩 */}
          <div className="p-2.5 bg-white border-t border-neutral-200 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
            {[
              '오늘 회의 내용을 정리해줘.',
              '출장 여비 정산 규정 알려줘.',
              'KPC 추천 교육과정 찾아줘.'
            ].map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => handleExecuteTest(q)}
                disabled={isTesting}
                className="px-2.5 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 text-[11px] whitespace-nowrap cursor-pointer transition-colors shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* 메시지 입력창 */}
          <div className="p-3 bg-white border-t border-neutral-200 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleExecuteTest();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                placeholder="테스트할 질문이나 업무를 입력하세요..."
                disabled={isTesting}
                className="flex-1 text-xs text-neutral-900 border border-neutral-300 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-neutral-900 bg-neutral-50/50 focus:bg-white transition-all disabled:bg-neutral-100"
              />
              <button
                type="submit"
                disabled={isTesting || !testInput.trim()}
                className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                  isTesting || !testInput.trim()
                    ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                    : 'bg-[#E60012] hover:bg-[#CC0010] text-white shadow-xs'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

      </div>

      {/* ─────────────────────────────────────────────────────────────
          모달 1: AI로 지침 개선 확인 모달
          ───────────────────────────────────────────────────────────── */}
      {showAiImproveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-neutral-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-50 text-[#E60012] flex items-center justify-center">
                  <Wand2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">AI 지침 자동 개선 결과</h3>
                  <p className="text-xs text-neutral-500">더 명확하고 구조화된 Agent 지침으로 정제되었습니다.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAiImproveModal(false)}
                className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-xs font-mono text-neutral-800 whitespace-pre-line leading-relaxed max-h-[380px] overflow-y-auto">
                {improvedPromptDraft}
              </div>
            </div>

            <div className="px-6 py-3.5 border-t border-neutral-200 bg-neutral-50 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowAiImproveModal(false)}
                className="px-4 py-2 rounded-lg border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-700 text-xs font-semibold cursor-pointer"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleApplyImprovedPrompt}
                className="px-4 py-2 rounded-lg bg-[#E60012] hover:bg-[#CC0010] text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                개선 지침 적용하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          모달 2: + 지식 추가 모달 (파일, Knowledge AI, M365)
          ───────────────────────────────────────────────────────────── */}
      {showAddKnowledgeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-neutral-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-neutral-100 text-neutral-700 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-neutral-900">새 지식 추가</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddKnowledgeModal(false)}
                className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* 카테고리 탭 */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'file', label: '파일 업로드' },
                  { id: 'knowledge_ai', label: 'Knowledge AI' },
                  { id: 'm365', label: 'Microsoft 365' }
                ].map(c => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedKnowledgeCategory(c.id as any)}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      selectedKnowledgeCategory === c.id
                        ? 'border-[#E60012] bg-red-50 text-[#E60012]'
                        : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>

              {selectedKnowledgeCategory === 'file' && (
                <div className="space-y-3">
                  <div className="p-6 border-2 border-dashed border-neutral-300 rounded-xl text-center bg-neutral-50/50 hover:bg-neutral-50 transition-colors">
                    <Upload className="w-6 h-6 text-neutral-400 mx-auto mb-2" />
                    <p className="text-xs font-bold text-neutral-800">PDF, Word, Excel, PowerPoint 파일 선택</p>
                    <p className="text-[11px] text-neutral-400 mt-1">파일당 최대 50MB 지원</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[11px] font-bold text-neutral-600">추천 샘플 파일:</p>
                    {[
                      { name: 'KPC_사내_교육운영_표준매뉴얼_v3.pdf', type: 'PDF', loc: '사내 표준 서식' },
                      { name: '2026_직무별_역량개발_체계도.docx', type: 'Word', loc: '인사팀 문서함' }
                    ].map(f => (
                      <button
                        key={f.name}
                        type="button"
                        onClick={() => handleAddKnowledge(f.name, f.type as any, f.loc)}
                        className="w-full text-left p-2.5 rounded-lg border border-neutral-200 hover:border-[#E60012] flex items-center justify-between text-xs cursor-pointer"
                      >
                        <span className="truncate">{f.name}</span>
                        <span className="text-[10px] text-neutral-400 shrink-0">선택</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {selectedKnowledgeCategory === 'knowledge_ai' && (
                <div className="space-y-2">
                  <p className="text-xs text-neutral-600 mb-2">KPC 사내 공인 지식베이스에서 선택하세요:</p>
                  {[
                    { name: 'KPC 취업규칙 및 복무 규정 전문', loc: 'Knowledge AI > 사내 규정집' },
                    { name: '국내외 출장 여비 정산 매뉴얼', loc: 'Knowledge AI > 총무인사 DB' },
                    { name: 'KPC 공개교육 연간 일정표', loc: 'Knowledge AI > 교육 DB' }
                  ].map(item => (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => handleAddKnowledge(item.name, 'Knowledge AI', item.loc)}
                      className="w-full text-left p-2.5 rounded-lg border border-neutral-200 hover:border-[#E60012] flex items-center justify-between text-xs cursor-pointer"
                    >
                      <div>
                        <p className="font-bold text-neutral-800">{item.name}</p>
                        <p className="text-[11px] text-neutral-400">{item.loc}</p>
                      </div>
                      <Plus className="w-4 h-4 text-neutral-400 shrink-0" />
                    </button>
                  ))}
                </div>
              )}

              {selectedKnowledgeCategory === 'm365' && (
                <div className="space-y-2">
                  <p className="text-xs text-neutral-600 mb-2">Microsoft 365 연동 사이트 및 채널:</p>
                  {[
                    { name: 'SharePoint > KPC_전사공지문서함', type: 'SharePoint', loc: 'SharePoint' },
                    { name: 'OneDrive > 사업계획서_공유폴더', type: 'OneDrive', loc: 'OneDrive' },
                    { name: 'Teams > AI전략팀_정례회의채널', type: 'Teams', loc: 'Teams' }
                  ].map(item => (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => handleAddKnowledge(item.name, item.type as any, item.loc)}
                      className="w-full text-left p-2.5 rounded-lg border border-neutral-200 hover:border-[#E60012] flex items-center justify-between text-xs cursor-pointer"
                    >
                      <span className="font-bold text-neutral-800 text-xs">{item.name}</span>
                      <Plus className="w-4 h-4 text-neutral-400 shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 모달 2 끝 */}
    </div>
  );
};
