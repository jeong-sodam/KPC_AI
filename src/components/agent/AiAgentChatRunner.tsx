import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Send, 
  Paperclip, 
  CheckCircle2, 
  Sparkles, 
  RotateCcw, 
  Copy, 
  Check, 
  FileText, 
  Bot, 
  User,
  Download,
  AlertCircle,
  HelpCircle,
  FileCheck,
  Cpu,
  ShieldCheck,
  Database,
  TrendingUp,
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';
import { VerifiedAgent } from '../../types';

interface AiAgentChatRunnerProps {
  agent: VerifiedAgent;
  onBack: () => void;
  onShowToast: (msg: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  attachedFile?: string;
  citations?: string[];
}

export const AiAgentChatRunner: React.FC<AiAgentChatRunnerProps> = ({
  agent,
  onBack,
  onShowToast
}) => {
  // Initial Agent Welcome Message based on agent archetype
  const getInitialMessage = (ag: VerifiedAgent) => {
    switch (ag.category) {
      case 'RFP·제안':
        return `안녕하세요! 검증 완료된 **${ag.name} (${ag.version})**입니다.\n\n검토하실 **나라장터 입찰공고문 또는 RFP(과업지시서) 문서**를 업로드해주시거나 본문을 붙여넣어주세요.\n\n- 12대 영역 필수 요구사항 및 자격 요건 정밀 분석\n- 기술/가격 평가 기준표 및 감점 리스크 사전 도출\n- KPC 수주 전략 및 착안 사항을 요약해 드립니다.`;
      case '회의·요약':
        return `반갑습니다. 검증 완료된 **${ag.name} (${ag.version})**입니다.\n\n정리할 **회의 대화록 텍스트나 음성 변환 파일**을 업로드해주세요.\n\n- 주요 논의 안건 3대 핵심 요약\n- 결정 사항 및 찬반 쟁점 구조화\n- 후속 조치(Action Item: 담당자, 완료일정)를 일목요연하게 추출해 드립니다.`;
      case '검색·분석':
        return `안녕하세요! 검증 완료된 **${ag.name} (${ag.version})**입니다.\n\n조사하시고자 하는 **산업 분야, 경쟁사, 특정 시장 키워드**를 입력해주세요.\n\n- 국내외 시장 규모(TAM/SAM/SOM) 및 성장률 전망\n- 주요 플레이어 포지셔닝 및 SWOT 분석\n- 제안 및 경영 보고용 핵심 인사이트를 구조화해 드립니다.`;
      case '문서작성':
        return `안녕하세요. 검증 완료된 **${ag.name} (${ag.version})**입니다.\n\n검토하실 **계약서 조항 또는 표준 서식 문안**을 입력해주세요.\n\n- KPC 사규 및 공공계약 표준 규정 대조\n- 지체상금율, 손해배상, 지식재산권 귀속 등 독소 조항 자동 스크리닝 소견을 작성해 드립니다.`;
      default:
        return `안녕하세요! KPC 공식 검증을 통과한 **${ag.name} (${ag.version})**입니다.\n\n무엇을 도와드릴까요? 아래에 요청 사항을 자유롭게 입력하시거나 필요한 문서를 첨부해주세요.`;
    }
  };

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'agent',
      text: getInitialMessage(agent),
      timestamp: '방금 전'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [attachedFile, setAttachedFile] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showSidebarMobile, setShowSidebarMobile] = useState(false);

  // Quick preset action prompts based on agent
  const getPromptSuggestions = (ag: VerifiedAgent) => {
    switch (ag.category) {
      case 'RFP·제안':
        return [
          '과업지시서 필수 참가자격 및 결격사유 점검',
          '기술평가 90점 배점 기준표 요약',
          '보안 통제 및 인력 상주 조건 리스크 분석',
          'KPC 차별화 제안 전략 키워드 도출'
        ];
      case '회의·요약':
        return [
          '회의록에서 Action Item(담당자/기한)만 표로 정리',
          '참석자 간 주요 이견 및 최종 결정사항 요약',
          'KPC 주간 업무보고 서식으로 3단 변환',
          '핵심 의사결정 사항 3줄 브리프'
        ];
      case '검색·분석':
        return [
          '국내 공공 클라우드·AI 시장 규모 및 전망 브리프',
          '대형 SI 경쟁사 대비 KPC 차별화 강점 분석',
          '2026년 공공 IT 조달 시장 주요 제도 변화 요약',
          'SWOT 및 포지셔닝 맵 구조화'
        ];
      default:
        return [
          '핵심 내용 3줄 요약',
          '주요 리스크 및 주의사항 확인',
          'KPC 표준 양식으로 정리',
          '후속 조치 일정표 생성'
        ];
    }
  };

  const handleSendMessage = (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim() && !attachedFile) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend || (attachedFile ? `${attachedFile} 문서를 업로드했습니다. 분석해주세요.` : ''),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachedFile: attachedFile || undefined
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setAttachedFile(null);
    setIsProcessing(true);

    // Realistic Simulated Agent Response
    setTimeout(() => {
      let agentReply = '';
      let citations: string[] = [];

      if (agent.category === 'RFP·제안') {
        agentReply = `### [제안서 검토 Agent 분석 보고서]\n\n**1. 과업 기본 개요**\n- 사업명: 2026년 공공 지능형 플랫폼 구축 및 고도화 용역\n- 추정예산: 24.5억 원 (VAT 포함) / 사업기간: 계약체결일로부터 9개월\n- 계약방식: 협상에 의한 계약 (기술 90%, 가격 10%)\n\n**2. 필수 자격 및 감점 리스크 점검**\n- **소프트웨어사업자 등록**: 컴퓨터관련서비스사업(1468) 신고 필수 (적합)\n- **인력 상주 요건**: 총괄 PM 소프트웨어기술자 특급 이상, 투입 기간 전원 80% 이상 오프라인 상주 요건 명시 ⚠️ (인력 운용 계획 시 유의 필요)\n- **부정당 제재**: 공고일 기준 최근 1년 이내 제재 이력 없을 것 (적합)\n\n**3. 기술 평가 배점 요약 (90점 만점)**\n- 전략 및 방법론 (25점): 공공 데이터 주권 및 보안 아키텍처 이해도 중점\n- 기술 및 기능 (35점): 온프레미스 sLLM 모델 서빙 안정성 및 연동성\n- 사업수행 능력 (20점): 최근 3년 이내 유사 지자체/공공 레퍼런스 실적\n- 프로젝트 관리 및 사후지원 (10점): 보안 침해사고 대응 및 비상 대책\n\n**4. KPC 착안사항 및 제안 전략**\n- 경쟁사 대비 KPC의 공공 컨설팅 역량과 AI 기술 융합 모델을 제안서 1장 슬로건으로 강력히 부각할 것을 권장합니다.`;
        citations = ['2026_공공플랫폼_과업지시서.pdf', 'KPC_제안전략_가이드라인_v2'];
      } else if (agent.category === '회의·요약') {
        agentReply = `### [회의록 핵심 요약 & Action Items]\n\n**1. 핵심 아젠다 및 결정 사항**\n- 4분기 사내 AI Agent 공식 배포 일정 10월 초 확정\n- 보안성 검토 위원회 심사 기준 통과 건에 한해 전사 배포 권한 부여 승인\n- 부서별 파일럿 테스트 기간 2주 운영 합의\n\n**2. Action Item (후속 실행 과제)**\n| 담당자 | 소속 부서 | 세부 과제 | 마감 기한 |\n| :--- | :--- | :--- | :--- |\n| 정소담 | AI전략팀 | Agent 검수 체크리스트 매뉴얼 배포 | 9월 18일(금) |\n| 김OO | 디지털혁신팀 | GPU 인프라 부하 테스트 결과 보고 | 9월 22일(화) |\n| 박OO | 컨설팅본부 | 시범 도입 부서 피드백 취합 양식 배포 | 9월 25일(금) |`;
        citations = ['KPC_주간업무회의_20260916.docx'];
      } else {
        agentReply = `### [${agent.name} 처리 결과 보고서]\n\n요청하신 사항에 대한 분석과 검토가 사내 표준 지침에 따라 성공적으로 완료되었습니다.\n\n**1. 분석 요약**\n- 대상 항목: ${userMsg.text.slice(0, 40)}...\n- 검토 기준: KPC 사내 표준 운영 지침 및 ${agent.category} 표준 방법론\n- 상태: 정상 처리 완료\n\n**2. 핵심 시사점**\n- 사내 지식베이스와 연계하여 최신 검증 데이터를 즉시 반영하였습니다.\n- 추가 세부 질문이나 심화 분석이 필요하시면 언제든 말씀해 주세요.`;
        citations = ['KPC 사내 지식 포털 DB', 'SharePoint 부서 문서함'];
      }

      setMessages(prev => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          sender: 'agent',
          text: agentReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          citations
        }
      ]);
      setIsProcessing(false);
      onShowToast(`${agent.name}의 답변 작성이 완료되었습니다.`);
    }, 1100);
  };

  const handleSimulateAttach = () => {
    const sampleFiles = [
      '2026_지자체_공공플랫폼_과업지시서.pdf',
      'KPC_주간회의록_20260916.docx',
      '신규_용역표준계약서_초안.hwpx'
    ];
    const picked = sampleFiles[Math.floor(Math.random() * sampleFiles.length)];
    setAttachedFile(picked);
    onShowToast(`샘플 문서 [${picked}]가 첨부되었습니다.`);
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    onShowToast('답변 내용이 클립보드에 복사되었습니다.');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `init-${Date.now()}`,
        sender: 'agent',
        text: getInitialMessage(agent),
        timestamp: '방금 전'
      }
    ]);
    setAttachedFile(null);
    onShowToast('대화가 초기화되었습니다.');
  };

  return (
    <div className="w-full h-full flex-1 flex flex-col min-w-0 bg-[#F8F9FA] overflow-hidden">
      {/* ─────────────────────────────────────────────
          1. 상단 헤더 바 (전체 너비 100% 매칭)
          ───────────────────────────────────────────── */}
      <header className="h-16 px-6 sm:px-8 bg-white border-b border-neutral-200 flex items-center justify-between shrink-0 shadow-2xs z-10">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-neutral-200 text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100 text-xs font-bold transition-colors cursor-pointer shrink-0 shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Agent 목록으로</span>
          </button>

          <div className="h-5 w-px bg-neutral-200 shrink-0" />

          {/* Agent 메타 정보 헤더 */}
          <div className="min-w-0 flex items-center gap-2.5 flex-wrap">
            <h1 className="font-bold text-neutral-900 text-base truncate">{agent.name}</h1>
            <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 text-xs font-mono font-bold border border-neutral-200">
              {agent.version}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-50 text-[#E60012] text-xs font-bold border border-red-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#E60012]" />
              <span>검수 완료 공식 Agent</span>
            </span>
            <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-medium text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded">
              <TrendingUp className="w-3 h-3 text-[#E60012]" />
              <span>실행 {agent.executionCount.toLocaleString()}회</span>
            </span>
          </div>
        </div>

        {/* 우측 조작 버튼 */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowSidebarMobile(!showSidebarMobile)}
            className="lg:hidden p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg text-xs flex items-center gap-1 cursor-pointer border border-neutral-200"
            title="Agent 스펙 및 프리셋 보기"
          >
            <Info className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleResetChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-neutral-600 text-xs font-semibold transition-colors cursor-pointer"
            title="대화 초기화"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">대화 초기화</span>
          </button>
        </div>
      </header>

      {/* ─────────────────────────────────────────────
          2. 2열 스튜디오 바디 (16:10 ~ 16:9 와이드 비율 완벽 최적화)
          ───────────────────────────────────────────── */}
      <div className="flex-1 flex min-h-0 overflow-hidden relative">
        
        {/* 좌측 사이드바: Agent 프로필, 실행 스펙 및 원클릭 추천 프리셋 */}
        <aside 
          className={`
            w-80 xl:w-88 border-r border-neutral-200 bg-white flex flex-col shrink-0 overflow-y-auto p-5 space-y-5
            ${showSidebarMobile ? 'absolute inset-y-0 left-0 z-30 bg-white shadow-2xl flex' : 'hidden lg:flex'}
          `}
        >
          {/* Agent 개요 & 프로필 */}
          <div>
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-2">
              Agent 프로필 & 개요
            </span>
            <div className="bg-[#FAFBFD] rounded-xl p-4 border border-neutral-200/90 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-red-50 text-[#E60012] border border-red-200">
                  {agent.category}
                </span>
                <span className="text-[11px] font-mono text-neutral-400">
                  코드: {agent.code}
                </span>
              </div>
              <p className="text-xs text-neutral-700 leading-relaxed font-normal">
                {agent.description}
              </p>
              <div className="pt-2 border-t border-neutral-200/60 flex items-center justify-between text-[11px] text-neutral-500">
                <span>담당: <strong>{agent.author}</strong> ({agent.department})</span>
                <span>정확도: <strong className="text-neutral-900">{agent.auditScore}점</strong></span>
              </div>
            </div>
          </div>

          {/* AI 실행 엔진 & 보안 스펙 */}
          <div>
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-2">
              실행 엔진 & 보안 준수
            </span>
            <div className="bg-[#FAFBFD] rounded-xl p-4 border border-neutral-200/90 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-500 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-[#E60012]" />
                  기반 모델
                </span>
                <span className="font-semibold text-neutral-900 font-mono text-[11px]">
                  Gemini 2.5 Flash
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  보안 통제
                </span>
                <span className="font-semibold text-emerald-700 text-[11px]">
                  KPC DLP 보호 활성
                </span>
              </div>
              <div className="pt-2 border-t border-neutral-200/60">
                <span className="text-[11px] font-semibold text-neutral-600 block mb-1.5">
                  연계 지식 소스
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {agent.capabilities.map((cap, cIdx) => (
                    <span 
                      key={cIdx}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white text-neutral-700 text-[11px] font-medium border border-neutral-200 shadow-2xs"
                    >
                      <Database className="w-2.5 h-2.5 text-neutral-400" />
                      {cap}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 원클릭 테스트 시나리오 프리셋 */}
          <div className="flex-1">
            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-2 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#E60012]" />
              추천 질의 프리셋
            </span>
            <div className="space-y-2">
              {getPromptSuggestions(agent).map((sugg, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(sugg)}
                  className="w-full text-left p-3 rounded-xl bg-white hover:bg-neutral-50 border border-neutral-200 hover:border-neutral-400 text-xs text-neutral-800 transition-all shadow-2xs group cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold leading-relaxed line-clamp-2">{sugg}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 group-hover:text-[#E60012] transition-all shrink-0" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* 메인 대화 작업 영역 */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#FAFBFD] overflow-hidden">
          {/* 메시지 리스트 스크롤 영역 */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-5 max-w-4xl xl:max-w-5xl w-full mx-auto">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'agent' && (
                  <div className="w-9 h-9 rounded-xl bg-[#E60012] text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                    <Bot className="w-5 h-5" />
                  </div>
                )}

                <div
                  className={`max-w-2xl xl:max-w-3xl rounded-2xl p-5 text-xs leading-relaxed shadow-2xs transition-all ${
                    msg.sender === 'user'
                      ? 'bg-neutral-900 text-white rounded-tr-xs'
                      : 'bg-white text-neutral-800 border border-neutral-200/90 rounded-tl-xs'
                  }`}
                >
                  {/* 첨부 파일 배지 */}
                  {msg.attachedFile && (
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-3 text-xs font-medium ${
                      msg.sender === 'user' ? 'bg-neutral-800 text-neutral-200 border border-neutral-700' : 'bg-neutral-100 text-neutral-800'
                    }`}>
                      <FileText className="w-4 h-4 text-[#E60012]" />
                      <span>첨부 문서: {msg.attachedFile}</span>
                    </div>
                  )}

                  {/* 본문 메시지 마크다운 렌더링 */}
                  <div className="whitespace-pre-wrap font-sans space-y-2">
                    {msg.text.split('\n').map((line, lIdx) => {
                      if (line.startsWith('### ')) {
                        return (
                          <h4 key={lIdx} className="font-bold text-sm text-[#E60012] my-2 pb-1 border-b border-neutral-100">
                            {line.replace('### ', '')}
                          </h4>
                        );
                      }
                      if (line.startsWith('**') && line.endsWith('**')) {
                        return (
                          <strong key={lIdx} className="font-bold block mt-3 text-neutral-900">
                            {line.replace(/\*\*/g, '')}
                          </strong>
                        );
                      }
                      if (line.startsWith('|')) {
                        return (
                          <div key={lIdx} className="font-mono text-[11px] bg-neutral-50 px-2 py-0.5 rounded overflow-x-auto">
                            {line}
                          </div>
                        );
                      }
                      return <p key={lIdx} className={line === '' ? 'h-1.5' : ''}>{line}</p>;
                    })}
                  </div>

                  {/* 인용 출처 표시 */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-3.5 pt-2.5 border-t border-neutral-100 flex items-center gap-1.5 text-[11px] text-neutral-400 flex-wrap">
                      <span className="font-semibold text-neutral-500">참조 지식 소스:</span>
                      {msg.citations.map((c, cI) => (
                        <span key={cI} className="bg-neutral-100 px-2 py-0.5 rounded text-neutral-600 font-mono">
                          {c}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* 하단 시간 및 복사 버튼 */}
                  <div className="mt-3 pt-2 border-t border-neutral-100/80 flex items-center justify-between text-[10px] text-neutral-400">
                    <span>{msg.timestamp}</span>
                    {msg.sender === 'agent' && (
                      <button
                        type="button"
                        onClick={() => handleCopyMessage(msg.id, msg.text)}
                        className="flex items-center gap-1 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer px-1.5 py-0.5 rounded hover:bg-neutral-100"
                        title="답변 복사"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-emerald-600 font-bold">복사됨</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>복사</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-9 h-9 rounded-xl bg-neutral-200 text-neutral-700 flex items-center justify-center shrink-0 text-xs font-bold border border-neutral-300 mt-0.5">
                    나
                  </div>
                )}
              </div>
            ))}

            {isProcessing && (
              <div className="flex gap-3 items-center text-xs text-neutral-500 pl-12 py-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#E60012] animate-ping" />
                <span>{agent.name}이(가) 문서를 분석하고 답변을 생성하고 있습니다...</span>
              </div>
            )}
          </div>

          {/* 하단 입력 영역 */}
          <div className="p-4 sm:p-5 bg-white border-t border-neutral-200 shrink-0">
            <div className="max-w-4xl xl:max-w-5xl mx-auto space-y-2.5">
              {/* 프롬프트 추천 칩 */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
                <span className="text-[11px] font-bold text-neutral-400 shrink-0 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#E60012]" />
                  빠른 질의:
                </span>
                {getPromptSuggestions(agent).slice(0, 3).map((sugg, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(sugg)}
                    className="px-3 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs whitespace-nowrap transition-colors cursor-pointer border border-neutral-200 font-medium"
                  >
                    {sugg}
                  </button>
                ))}
              </div>

              {/* 첨부된 파일 표시 */}
              {attachedFile && (
                <div className="flex items-center justify-between px-3.5 py-2 bg-red-50 border border-red-200 rounded-lg text-xs text-[#E60012]">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4" />
                    <span className="font-semibold">첨부됨: {attachedFile}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAttachedFile(null)}
                    className="text-neutral-400 hover:text-neutral-700 font-bold ml-2 cursor-pointer p-0.5"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* 인풋 바 */}
              <div className="flex items-end gap-2 bg-neutral-50 border border-neutral-300 rounded-xl p-2.5 focus-within:border-[#E60012] focus-within:bg-white transition-all shadow-2xs">
                <button
                  type="button"
                  onClick={handleSimulateAttach}
                  className="p-2 text-neutral-500 hover:text-[#E60012] hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer shrink-0"
                  title="문서 파일 첨부 (PDF/HWP/DOCX)"
                >
                  <Paperclip className="w-5 h-5" />
                </button>

                <textarea
                  rows={2}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={`"${agent.name}"에게 요청할 내용을 입력하세요. (Enter 전송, Shift+Enter 줄바꿈)`}
                  className="flex-1 bg-transparent border-none text-xs text-neutral-800 placeholder:text-neutral-400 focus:outline-none resize-none py-1.5 max-h-28"
                />

                <button
                  type="button"
                  onClick={() => handleSendMessage()}
                  disabled={isProcessing || (!inputText.trim() && !attachedFile)}
                  className="px-4 py-2.5 rounded-lg bg-[#E60012] hover:bg-[#CC0010] disabled:bg-neutral-300 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-2xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>전송</span>
                </button>
              </div>

              <div className="text-[11px] text-neutral-400 text-center">
                검증 완료된 사내 AI Agent는 KPC 데이터 보안 규정(DLP)을 준수하며 사외로 데이터가 유출되지 않습니다.
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

