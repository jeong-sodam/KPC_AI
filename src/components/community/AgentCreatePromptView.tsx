import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowLeft, 
  Wand2, 
  FileText, 
  FileCheck, 
  GraduationCap, 
  BookOpen, 
  BarChart3, 
  Layers, 
  CheckCircle2, 
  Loader2,
  Bot
} from 'lucide-react';
import { CommunityAgent } from '../../types';

interface AgentCreatePromptViewProps {
  onBack: () => void;
  onGenerateComplete: (draftAgent: CommunityAgent) => void;
  onStartBlank: () => void;
  onShowToast: (msg: string) => void;
}

interface PresetCard {
  id: string;
  title: string;
  category: string;
  icon: React.ReactNode;
  prompt: string;
  suggestedName: string;
  suggestedTags: string[];
  suggestedConnectors: string[];
}

const PRESET_CARDS: PresetCard[] = [
  {
    id: 'preset-meeting',
    title: '회의록 정리 Agent',
    category: '문서/요약',
    icon: <FileText className="w-4 h-4 text-[#E60012]" />,
    prompt: '회의 내용을 분석해서 핵심 논의사항, 의사결정 사항, 담당자별 할 일을 정리해주는 Agent를 만들어줘.',
    suggestedName: '회의 정리 도우미',
    suggestedTags: ['회의', '요약', '업무지원'],
    suggestedConnectors: ['m365-teams', 'm365-sharepoint']
  },
  {
    id: 'preset-report',
    title: '보고서 초안 작성 Agent',
    category: '기획/보고서',
    icon: <FileCheck className="w-4 h-4 text-blue-600" />,
    prompt: 'KPC 표준 서식에 맞춰 사업 기획 및 실적 보고서 초안을 작성하고 보완점을 제시하는 Agent를 만들어줘.',
    suggestedName: '보고서 기획 지원 비서',
    suggestedTags: ['보고서', '기획서', '표준서식'],
    suggestedConnectors: ['m365-sharepoint', 'm365-onedrive']
  },
  {
    id: 'preset-education',
    title: '교육과정 추천 Agent',
    category: '인재개발',
    icon: <GraduationCap className="w-4 h-4 text-emerald-600" />,
    prompt: '임직원 직무와 역량 개발 목표를 분석하여 최적의 KPC 사내·외 교육과정과 수강 일정을 추천해주는 Agent를 만들어줘.',
    suggestedName: 'KPC 교육과정 추천 코치',
    suggestedTags: ['교육과정', '역량개발', '사내연수'],
    suggestedConnectors: ['sys-kpc-edu', 'sys-kpc-cert']
  },
  {
    id: 'preset-policy',
    title: '사내 규정 검색 Agent',
    category: '규정/행정',
    icon: <BookOpen className="w-4 h-4 text-amber-600" />,
    prompt: 'KPC 인사 규정, 출장 여비 지급 기준, 복리후생 제도를 검색하고 질문에 명확한 조항과 함께 답해주는 Agent를 만들어줘.',
    suggestedName: '사내 규정 Q&A 안내관',
    suggestedTags: ['사내규정', '취업규칙', '여비지급'],
    suggestedConnectors: ['m365-sharepoint']
  },
  {
    id: 'preset-analysis',
    title: '데이터 분석 Agent',
    category: '데이터/통계',
    icon: <BarChart3 className="w-4 h-4 text-indigo-600" />,
    prompt: 'CSV 또는 Excel 업무 실적 데이터를 입력받아 주요 지표 추이와 이상치를 분석하고 인사이트 요약을 제공하는 Agent를 만들어줘.',
    suggestedName: '실적 데이터 분석 보좌관',
    suggestedTags: ['데이터분석', '성과관리', '엑셀분석'],
    suggestedConnectors: ['sys-kpc-erp', 'm365-onedrive']
  },
  {
    id: 'preset-summary',
    title: '문서 요약 Agent',
    category: '지식/리서치',
    icon: <Layers className="w-4 h-4 text-purple-600" />,
    prompt: '장문의 연구 보고서나 제안요청서(RFP)를 입력받아 핵심 요약, 기대효과, 체크리스트로 신속하게 추출해주는 Agent를 만들어줘.',
    suggestedName: '스마트 문서 요약기',
    suggestedTags: ['문서요약', 'RFP분석', '핵심발췌'],
    suggestedConnectors: ['m365-sharepoint']
  }
];

export const AgentCreatePromptView: React.FC<AgentCreatePromptViewProps> = ({
  onBack,
  onGenerateComplete,
  onStartBlank,
  onShowToast
}) => {
  const [promptText, setPromptText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);

  const generationStepLabels = [
    '자연어 역할 및 요구사항 분석 중...',
    '최적 시스템 지침 및 수행 절차 설계 중...',
    '추천 사내 지식 및 업무 커넥터 매핑 중...',
    '거버넌스 승인 AI 모델 및 보안 권한 구성 완료!'
  ];

  // Handle Preset Click
  const handleSelectPreset = (preset: PresetCard) => {
    setPromptText(preset.prompt);
    onShowToast(`'${preset.title}' 추천 프롬프트가 입력되었습니다.`);
  };

  // Handle Generate
  const handleGenerate = () => {
    const input = promptText.trim();
    if (!input) {
      onShowToast('만들고 싶은 Agent의 역할을 설명해주세요.');
      return;
    }

    setIsGenerating(true);
    setGenerationStep(0);

    // Simulate multi-step progressive synthesis
    const stepInterval = setInterval(() => {
      setGenerationStep(prev => {
        if (prev < generationStepLabels.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 450);

    setTimeout(() => {
      clearInterval(stepInterval);
      
      // Determine context from prompt
      let title = '업무 지원 AI Agent';
      let description = '사용자의 업무를 지원하고 표준 서식에 맞춰 결과를 정리합니다.';
      let systemPrompt = `당신은 한국생산성본부(KPC)의 전문 업무 지원 AI Agent입니다.\n\n1. 사용자의 요청 내용을 정확히 파악하여 체계적인 구조로 답변합니다.\n2. 확인되지 않은 사실은 임의로 지어내지 않으며 사내 규정과 지침을 준수합니다.\n3. 담당자가 바로 실행할 수 있도록 명확한 가이드를 제공합니다.`;
      let tags = ['업무지원', '자동화', 'KPC'];
      let targetPurpose = input;
      let connectors = ['m365-sharepoint', 'm365-teams'];

      // Match keywords
      if (input.includes('회의') || input.includes('미팅')) {
        title = '회의 정리 도우미';
        description = '회의 내용을 분석하여 핵심 안건, 주요 의사결정 및 담당자별 할 일을 자동으로 정리합니다.';
        systemPrompt = `당신은 KPC 임직원의 회의 정리를 지원하는 AI Agent입니다.\n\n[주요 업무 지침]\n1. 회의의 핵심 논의사항을 간결하게 요약합니다.\n2. 주요 의사결정 사항을 별도 항목으로 명확히 정리합니다.\n3. 담당자별 Action Item과 목표 기한을 표 또는 체크리스트로 도출합니다.\n4. 확인되지 않은 내용은 임의로 생성하지 않으며 추가 확인 필요 사항으로 분류합니다.`;
        tags = ['회의', '요약', '업무지원'];
        connectors = ['m365-teams', 'm365-sharepoint'];
      } else if (input.includes('보고서') || input.includes('기획')) {
        title = '보고서 기획 지원 비서';
        description = 'KPC 표준 서식에 맞춰 사업 기획서 및 실적 보고서 초안을 체계적으로 작성합니다.';
        systemPrompt = `당신은 KPC 표준 보고서 작성을 전문적으로 보조하는 AI Agent입니다.\n\n[주요 업무 지침]\n1. 추진 배경, 현황 분석, 세부 실행계획, 기대효과의 4단 구성을 기본으로 작성합니다.\n2. 공공·민간 제안서 수준의 정제된 비즈니스 개조식 문체를 사용합니다.\n3. 정량적 지표와 추진 일정을 명확한 표 형태로 제시합니다.`;
        tags = ['보고서', '기획서', '표준서식'];
        connectors = ['m365-sharepoint', 'm365-onedrive'];
      } else if (input.includes('교육') || input.includes('연수')) {
        title = 'KPC 교육과정 추천 코치';
        description = '임직원의 직무와 역량 개발 목표를 분석하여 최적의 사내·외 교육과정을 맞춤 추천합니다.';
        systemPrompt = `당신은 KPC 인재개발 및 교육과정 매칭 전문 AI Agent입니다.\n\n[주요 업무 지침]\n1. 직원의 직급, 직무 분야, 필요 역량을 질문을 통해 구체화합니다.\n2. KPC의 최신 공개교육, 자격증 연계 과정, 온라인 마이크로러닝 중 최적 과정을 매칭합니다.\n3. 교육 수강 일정, 신청 기한, 필요 선수 지식을 함께 안내합니다.`;
        tags = ['교육과정', '역량개발', '사내연수'];
        connectors = ['sys-kpc-edu', 'sys-kpc-cert'];
      } else if (input.includes('규정') || input.includes('여비') || input.includes('복무')) {
        title = '사내 규정 Q&A 안내관';
        description = 'KPC 사내 규정집을 기반으로 임직원 복무, 여비 정산, 복리후생 질문에 조항과 함께 답변합니다.';
        systemPrompt = `당신은 KPC 사내 규정 전문 안내 AI Agent입니다.\n\n[주요 업무 지침]\n1. KPC 취업규칙, 여비규정, 복리후생 매뉴얼의 근거 조항을 명시하여 답변합니다.\n2. 모호하거나 예외적인 사안은 주관 부서(경영지원팀/인사팀) 담당자와 상담할 것을 권고합니다.\n3. 개인정보나 사내 기밀 사항은 안전하게 보호하며 규정 외 임의 해석을 금지합니다.`;
        tags = ['사내규정', '취업규칙', '여비지급'];
        connectors = ['m365-sharepoint'];
      } else if (input.includes('데이터') || input.includes('실적') || input.includes('통계')) {
        title = '실적 데이터 분석 보좌관';
        description = '업무 실적 및 지표 데이터를 분석하여 추이, 이상치, 핵심 시사점을 도출합니다.';
        systemPrompt = `당신은 KPC 업무 실적 데이터 분석 전문 AI Agent입니다.\n\n[주요 업무 지침]\n1. 입력된 표 또는 데이터의 주요 총합, 평균, 전년 대비 증감율을 정확히 계산합니다.\n2. 목표 달성률 미달 부문이나 급격한 이상치를 강조하여 리스크를 사전 경고합니다.\n3. 경영진 보고용 1페이지 핵심 시사점(Key Takeaway)을 요약합니다.`;
        tags = ['데이터분석', '성과관리', '엑셀분석'];
        connectors = ['sys-kpc-erp', 'm365-onedrive'];
      } else if (input.includes('요약') || input.includes('RFP')) {
        title = '스마트 문서 요약기';
        description = '장문 문서 및 제안요청서를 신속 분석하여 1페이지 요약 및 핵심 체크리스트를 생성합니다.';
        systemPrompt = `당신은 KPC 전문 문서 요약 및 핵심 발췌 AI Agent입니다.\n\n[주요 업무 지침]\n1. 문서의 핵심 목적, 주관 기관 요구사항, 제출 기한을 최우선 발췌합니다.\n2. 복잡한 문맥을 한눈에 파악할 수 있는 불릿 포인트 개조식으로 요약합니다.\n3. 업무 수행 시 주의해야 할 필수 체크리스트 항목을 도출합니다.`;
        tags = ['문서요약', 'RFP분석', '핵심발췌'];
        connectors = ['m365-sharepoint'];
      }

      const draftAgent: CommunityAgent = {
        id: `comm-agent-${Date.now()}`,
        title,
        version: 'v0.1 (초안)',
        category: tags[0] || '업무지원',
        status: '초안',
        description,
        shortDesc: description,
        reasonCreated: targetPurpose,
        howToUse: '1. 프롬프트 창에 관련 자료 입력\n2. AI의 체계적 분석 및 가이드 확인\n3. 필요시 후속 질문으로 결과 구체화',
        tags,
        author: '정소담',
        department: 'AI전략팀',
        createdAt: '2026.09.17',
        updatedAt: '2026.09.17',
        likes: 0,
        userLiked: false,
        views: 1,
        forks: 0,
        commentsCount: 0,
        auditNominated: false,
        nominationCount: 0,
        promptPreview: systemPrompt.slice(0, 150) + '...',
        systemPrompt,
        exampleInputs: '회의 녹취록 및 안건 메모 입력',
        exampleOutput: '핵심 결정사항 요약 및 Action Item 리스트',
        developmentType: 'agent',
        targetPurpose,
        selectedModel: 'auto',
        visibilityScope: '나만 사용',
        iconBg: 'bg-red-50 text-[#E60012] border-red-200',
        knowledgeFiles: [
          {
            id: `kf-${Date.now()}-1`,
            name: `${title.replace(/\s+/g, '_')}_업무가이드.pdf`,
            format: 'PDF',
            size: '1.8 MB',
            date: '2026.09.17'
          }
        ],
        knowledgeSources: {
          knowledgeAi: true,
          sharePoint: true,
          oneDrive: false,
          approvedInternal: true,
          teams: true
        },
        connectors: connectors.map(cid => ({
          id: cid,
          name: cid.includes('sharepoint') ? 'SharePoint' : cid.includes('teams') ? 'Teams' : cid.includes('edu') ? '교육과정 조회' : 'ERP 조회',
          desc: '사내 시스템 데이터 실시간 연동',
          status: '연결됨' as const,
          permStatus: '승인됨' as const,
          enabled: true
        })),
        comments: [],
        changelog: [
          {
            version: 'v0.1',
            date: '2026.09.17',
            changes: ['자연어 프롬프트 기반 AI 자동 초안 생성']
          }
        ]
      };

      setIsGenerating(false);
      onGenerateComplete(draftAgent);
      onShowToast(`'${title}' 초안이 자동 생성되었습니다. Studio에서 세부 설정을 수정하고 테스트해보세요.`);
    }, 1800);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F8F9FA] overflow-y-auto">
      {/* Top Header Navigation */}
      <div className="bg-white border-b border-neutral-200 shrink-0 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 text-xs font-semibold px-2.5 py-1.5 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>AI Community로 돌아가기</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-[#E60012] text-xs font-bold border border-red-200/80">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Copilot Studio AI Builder</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Creation Card Container */}
      <div className="max-w-3xl mx-auto w-full px-6 py-10 sm:py-14 flex-1 flex flex-col justify-center">
        
        {/* Title & Guidance Header */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#E60012] border border-red-200 flex items-center justify-center mx-auto mb-4 shadow-2xs">
            <Bot className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight mb-2">
            새 AI Agent 만들기
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 max-w-lg mx-auto leading-relaxed">
            원하는 Agent의 역할을 설명하면 기본 설정을 자동으로 만들어드립니다.
          </p>
        </div>

        {/* Central Natural Language Input Box */}
        <div className="bg-white rounded-2xl border border-neutral-300 shadow-sm p-5 sm:p-6 mb-8 transition-all focus-within:border-neutral-900 focus-within:ring-2 focus-within:ring-neutral-900/5">
          <label 
            htmlFor="agent-prompt-input"
            className="block text-sm font-bold text-neutral-800 mb-2 flex items-center justify-between"
          >
            <span>어떤 Agent를 만들고 싶으신가요?</span>
            <span className="text-xs font-normal text-neutral-400">자연어로 자유롭게 작성</span>
          </label>

          <textarea
            id="agent-prompt-input"
            rows={4}
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            disabled={isGenerating}
            placeholder="회의 내용을 분석해서 핵심 논의사항, 의사결정 사항, 담당자별 할 일을 정리해주는 Agent를 만들어줘."
            className="w-full text-sm sm:text-base text-neutral-900 placeholder:text-neutral-400 border border-neutral-200 rounded-xl p-3.5 focus:outline-none focus:border-neutral-400 transition-colors resize-none leading-relaxed disabled:bg-neutral-50"
          />

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4 pt-3 border-t border-neutral-100">
            {/* Left: Start Blank button */}
            <button
              type="button"
              onClick={onStartBlank}
              disabled={isGenerating}
              className="text-xs text-neutral-500 hover:text-neutral-800 hover:underline font-medium cursor-pointer transition-colors text-left"
            >
              [빈 Agent로 시작]
            </button>

            {/* Right: Agent 생성 Primary Button */}
            <button
              type="button"
              id="btn-create-agent-prompt"
              onClick={handleGenerate}
              disabled={isGenerating || !promptText.trim()}
              className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all cursor-pointer ${
                isGenerating || !promptText.trim()
                  ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                  : 'bg-[#E60012] hover:bg-[#CC0010] text-white active:scale-98'
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Agent 초안 생성 중...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4" />
                  <span>Agent 생성</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* AI Synthesis Progress Overlay Modal/Card when generating */}
        {isGenerating && (
          <div className="bg-white rounded-xl border border-red-200 p-5 mb-8 shadow-md animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-red-50 text-[#E60012] flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-900">
                  AI가 Agent 초안을 설계하고 있습니다
                </h3>
                <p className="text-xs text-neutral-500">
                  {generationStepLabels[generationStep]}
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-[#E60012] h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${((generationStep + 1) / generationStepLabels.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* 2. 추천 Agent 예시 (6 cards) */}
        <div>
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#E60012]" />
              <h2 className="text-sm font-bold text-neutral-800">
                추천 Agent 예시
              </h2>
            </div>
            <span className="text-xs text-neutral-400">
              클릭 시 프롬프트에 자동 입력됩니다
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {PRESET_CARDS.map((card) => (
              <button
                key={card.id}
                type="button"
                onClick={() => handleSelectPreset(card)}
                className="flex flex-col text-left p-3.5 rounded-xl bg-white border border-neutral-200 hover:border-[#E60012] hover:shadow-xs transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-neutral-50 border border-neutral-200/80 flex items-center justify-center shrink-0 group-hover:bg-red-50 group-hover:border-red-200 transition-colors">
                      {card.icon}
                    </div>
                    <span className="text-xs font-bold text-neutral-800 group-hover:text-[#E60012] transition-colors truncate">
                      {card.title}
                    </span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600 font-medium shrink-0">
                    {card.category}
                  </span>
                </div>

                <p className="text-[11px] text-neutral-500 line-clamp-2 leading-relaxed">
                  {card.prompt}
                </p>
              </button>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
