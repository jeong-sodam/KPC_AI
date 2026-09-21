import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  CheckCircle2, 
  FileText, 
  RefreshCw, 
  Cpu, 
  ArrowRight,
  Database,
  Search,
  Copy,
  Check,
  ShieldCheck,
  Sliders,
  Paperclip,
  Info,
  Maximize2,
  ChevronRight
} from 'lucide-react';
import { CommunityAgent } from '../../types';

interface CommunityTestRunnerModalProps {
  agent: CommunityAgent;
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
  onNavigateTab?: (tab: string) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  citations?: string[];
  usedConnectors?: string[];
}

export const CommunityTestRunnerModal: React.FC<CommunityTestRunnerModalProps> = ({
  agent,
  isOpen,
  onClose,
  onShowToast,
  onNavigateTab
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'agent',
      text: `안녕하세요! **${agent.title}**입니다.\n${agent.shortDesc || agent.description}\n\n궁금하신 사항이나 테스트할 내용을 입력해주시면 사내 지식 기반으로 신속하게 답변해 드리겠습니다.`,
      timestamp: '방금 전',
      usedConnectors: agent.connectors?.filter(c => c.enabled).map(c => c.name) || ['내부 검색', '지식 연동']
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);

  if (!isOpen) return null;

  const handleSend = (textOverride?: string) => {
    const textToSend = (textOverride || inputText).trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: '방금 전'
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textOverride) setInputText('');
    setIsLoading(true);

    setTimeout(() => {
      let replyText = '';
      let citations: string[] = [];
      const connectors = agent.connectors?.filter(c => c.enabled).map(c => c.name) || ['내부 지식 검색', 'KPC 사내 규정집'];

      if (agent.exampleOutput && (textToSend.includes('제안') || textToSend.includes('RFP') || textToSend.includes('테스트') || textToSend.includes('샘플'))) {
        replyText = `### [${agent.title} 분석 결과 보고서]\n\n${agent.exampleOutput}\n\n**주요 권고사항**\n- 1. 사내 표준 프로세스에 따라 과업 범위를 재확인하세요.\n- 2. 예산 배정 기준표와 연동하여 실시간 집행 계획을 점검하세요.`;
        citations = ['KPC_표준_업무규정_2026.pdf (p.14)', '사내 지식베이스 RAG v2.4'];
      } else if (textToSend.includes('리스크') || textToSend.includes('주의')) {
        replyText = `### [${agent.title} 리스크 진단 분석]\n\n**1. 주요 잠재 위험 요인**\n- 마감 시한 준수 가능 여부 및 인력 상주 투입 여건 점검 필요\n- 지체상금율 및 보안 통제 요건(DLP 기준) 준수 의무\n\n**2. 대응 방안**\n- 사전 협의체를 가동하여 과업 변경 요구에 대비한 예비비 책정 권고`;
        citations = ['2026_리스크관리_가이드라인.pdf', 'KPC_법무감사_지침_v3'];
      } else {
        replyText = `### [${agent.title} 응답 안내]\n\n입력해주신 질의 내용을 사내 지식 기반으로 분석하였습니다.\n\n**1. 진단 요약**\n- 요청하신 항목에 대해 최적화된 업무 가이드를 도출했습니다.\n- 연계 커넥터(${connectors.join(', ')})를 통해 최신 데이터 검증을 완료하였습니다.\n\n**2. 후속 실행 과제**\n- 부서 담당자 협의 후 즉시 결재 및 배포가 가능합니다.`;
        citations = ['KPC 사내 지식 포털', 'SharePoint 부서 문서함'];
      }

      const agentMsg: ChatMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: replyText,
        timestamp: '방금 전',
        citations,
        usedConnectors: connectors
      };

      setMessages(prev => [...prev, agentMsg]);
      setIsLoading(false);
    }, 600);
  };

  const handleApplyPreset = (promptText: string) => {
    setInputText(promptText);
    handleSend(promptText);
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    onShowToast('응답 내용이 클립보드에 복사되었습니다.');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleReset = () => {
    setMessages([
      {
        id: `reset-${Date.now()}`,
        sender: 'agent',
        text: `대화가 초기화되었습니다. **${agent.title}** 테스트를 다시 시작해보세요.`,
        timestamp: '방금 전',
        usedConnectors: agent.connectors?.filter(c => c.enabled).map(c => c.name)
      }
    ]);
    onShowToast('테스트 대화 내역이 초기화되었습니다.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-5 animate-in fade-in duration-200">
      {/* 
        화면 비율 최적화:
        기존 max-w-3xl (768px, 세로로 기형적으로 길쭉한 비율) -> 
        w-full max-w-5xl xl:max-w-6xl h-[88vh] max-h-[860px] (16:10 데스크탑 와이드 비율)
      */}
      <div 
        id="community-test-runner-modal"
        className="bg-white rounded-2xl w-full max-w-5xl xl:max-w-6xl h-[88vh] max-h-[860px] flex flex-col shadow-2xl border border-neutral-300 overflow-hidden"
      >
        {/* 상단 통합 바 */}
        <header className="px-6 py-3.5 border-b border-neutral-200/90 flex items-center justify-between bg-neutral-50/90 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-neutral-900 text-white flex items-center justify-center shrink-0 shadow-xs overflow-hidden border border-neutral-700">
              {agent.icon ? (
                <img src={agent.icon} alt={agent.title} className="w-full h-full object-cover" />
              ) : (
                <Bot className="w-5 h-5 text-[#E60012]" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm font-bold text-neutral-900 truncate">{agent.title}</h2>
                <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-neutral-200/80 text-neutral-800">
                  {agent.version || 'v1.0'}
                </span>
                <span className="px-2 py-0.5 text-[11px] font-bold rounded-md bg-red-50 text-[#E60012] border border-red-200">
                  대화형 테스트 환경
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  실시간 응답 준비 완료
                </span>
              </div>
              <p className="text-xs text-neutral-500 truncate mt-0.5">
                제작: {agent.author} ({agent.department}) • 모델: {agent.selectedModel || 'Gemini 2.5 Flash'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowMobileSidebar(!showMobileSidebar)}
              className="md:hidden p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60 rounded-lg text-xs flex items-center gap-1 cursor-pointer"
              title="Agent 스펙 보기"
            >
              <Info className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60 rounded-lg transition-colors text-xs font-semibold flex items-center gap-1.5 cursor-pointer border border-neutral-200"
              title="대화 내역 초기화"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">대화 초기화</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-800 hover:bg-neutral-200/60 rounded-lg transition-colors cursor-pointer"
              title="창 닫기 (ESC)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* 2열 스튜디오 메인 바디 (16:10 균형잡힌 비율) */}
        <div className="flex-1 flex min-h-0 overflow-hidden relative">
          
          {/* 좌측 사이드바: Agent 프로필, 스펙 및 원클릭 테스트 프리셋 */}
          <aside 
            className={`
              w-80 xl:w-84 border-r border-neutral-200 bg-[#FAFBFD] flex flex-col shrink-0 overflow-y-auto p-5 space-y-5
              ${showMobileSidebar ? 'absolute inset-y-0 left-0 z-30 bg-white shadow-xl flex' : 'hidden md:flex'}
            `}
          >
            {/* Agent 개요 */}
            <div>
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-2">
                Agent 프로필 & 개요
              </span>
              <div className="bg-white rounded-xl p-3.5 border border-neutral-200/80 shadow-2xs space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-neutral-100 text-neutral-700">
                    {agent.category || 'AI Agent'}
                  </span>
                  <span className="text-[11px] text-neutral-400">
                    등록: {agent.createdAt}
                  </span>
                </div>
                <p className="text-xs text-neutral-700 leading-relaxed font-normal">
                  {agent.description || agent.shortDesc}
                </p>
                {agent.reasonCreated && (
                  <div className="pt-2 border-t border-neutral-100">
                    <span className="text-[11px] font-semibold text-neutral-500 block mb-0.5">개발 목적</span>
                    <p className="text-[11px] text-neutral-600 line-clamp-3">{agent.reasonCreated}</p>
                  </div>
                )}
              </div>
            </div>

            {/* AI 엔진 & 인프라 사양 */}
            <div>
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-2">
                실행 엔진 & 연계 인프라
              </span>
              <div className="bg-white rounded-xl p-3.5 border border-neutral-200/80 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-500 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-[#E60012]" />
                    기반 모델
                  </span>
                  <span className="font-semibold text-neutral-900 font-mono text-[11px]">
                    {agent.selectedModel || 'Gemini 2.5 Flash'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-500 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    보안 등급
                  </span>
                  <span className="font-semibold text-emerald-700 text-[11px]">
                    KPC-DLP 안심 세션
                  </span>
                </div>
                <div className="pt-2 border-t border-neutral-100">
                  <span className="text-[11px] font-semibold text-neutral-500 block mb-1.5">
                    연결 커넥터 / 지식 소스
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(agent.connectors?.filter(c => c.enabled).map(c => c.name) || ['내부 지식 검색', '사내 규정 DB']).map((conn, idx) => (
                      <span 
                        key={idx}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 text-[11px] font-medium border border-neutral-200"
                      >
                        <Database className="w-2.5 h-2.5 text-neutral-500" />
                        {conn}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 원클릭 테스트 시나리오 프리셋 */}
            <div className="flex-1">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#E60012]" />
                원클릭 테스트 시나리오
              </span>
              <div className="space-y-2">
                {agent.exampleInputs && (
                  <button
                    type="button"
                    onClick={() => handleApplyPreset(agent.exampleInputs!)}
                    className="w-full text-left p-3 rounded-xl bg-white hover:bg-neutral-100/90 border border-neutral-200 text-xs text-neutral-800 transition-all shadow-2xs group cursor-pointer"
                  >
                    <div className="font-bold text-[11px] text-[#E60012] mb-1 flex items-center justify-between">
                      <span>💡 제작자 추천 샘플 질의</span>
                      <ChevronRight className="w-3 h-3 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <p className="line-clamp-2 text-neutral-600 text-[11px]">{agent.exampleInputs}</p>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleApplyPreset('이 Agent가 수행할 수 있는 핵심 업무 3가지와 권장 입력 양식을 알려줘.')}
                  className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-neutral-100/90 border border-neutral-200 text-xs text-neutral-700 transition-all shadow-2xs group cursor-pointer"
                >
                  <div className="font-semibold text-[11px] text-neutral-800 mb-0.5 flex items-center justify-between">
                    <span>📌 핵심 역량 및 가이드 질의</span>
                    <ChevronRight className="w-3 h-3 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <p className="text-neutral-500 text-[10px]">권장 입력 포맷 및 결과 도출 범위 안내</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleApplyPreset('핵심 리스크와 주의해야 할 감점/독소 조항 체크리스트를 분석해줘.')}
                  className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-neutral-100/90 border border-neutral-200 text-xs text-neutral-700 transition-all shadow-2xs group cursor-pointer"
                >
                  <div className="font-semibold text-[11px] text-neutral-800 mb-0.5 flex items-center justify-between">
                    <span>🔍 리스크 및 주의사항 스크리닝</span>
                    <ChevronRight className="w-3 h-3 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                  <p className="text-neutral-500 text-[10px]">사내 규정 위반 및 리스크 사전 감지</p>
                </button>
              </div>
            </div>

            {/* 공식 Agent 이동 링크 안내 */}
            {agent.status === '승인 완료' && onNavigateTab && (
              <div className="pt-3 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onNavigateTab('ai_agent');
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                >
                  <span>공식 AI Agent 탭에서 실행</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </aside>

          {/* 우측 메인 영역: 대화형 테스트 콘솔 & 인터랙티브 스트림 */}
          <main className="flex-1 flex flex-col min-w-0 bg-[#FBFBFD] h-full overflow-hidden">
            
            {/* 대화 메시지 영역 */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-5">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3.5 max-w-[85%] ${
                    msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                  }`}
                >
                  {/* 아바타 */}
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold overflow-hidden shadow-2xs ${
                      msg.sender === 'user'
                        ? 'bg-neutral-900 text-white'
                        : 'bg-white text-[#E60012] border border-neutral-200'
                    }`}
                  >
                    {msg.sender === 'user' ? (
                      <User className="w-4 h-4" />
                    ) : agent.icon ? (
                      <img src={agent.icon} alt={agent.title} className="w-full h-full object-cover" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>

                  {/* 말풍선 본문 */}
                  <div className="space-y-2 min-w-0 flex-1">
                    <div
                      className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-neutral-900 text-white rounded-tr-none shadow-xs'
                          : 'bg-white text-neutral-900 border border-neutral-200/90 shadow-2xs rounded-tl-none'
                      }`}
                    >
                      {/* 서식화된 메시지 파싱 */}
                      <div className="whitespace-pre-wrap font-sans space-y-1">
                        {msg.text.split('\n').map((line, idx) => {
                          if (line.startsWith('### ')) {
                            return (
                              <h4 key={idx} className={`font-bold text-sm my-1.5 ${msg.sender === 'user' ? 'text-red-300' : 'text-[#E60012]'}`}>
                                {line.replace('### ', '')}
                              </h4>
                            );
                          }
                          if (line.startsWith('**') && line.endsWith('**')) {
                            return (
                              <strong key={idx} className={`font-bold block mt-1.5 ${msg.sender === 'user' ? 'text-white' : 'text-neutral-900'}`}>
                                {line.replace(/\*\*/g, '')}
                              </strong>
                            );
                          }
                          if (line.startsWith('- ')) {
                            return (
                              <div key={idx} className="flex items-start gap-1.5 pl-1 my-0.5">
                                <span className={`text-[10px] mt-1 ${msg.sender === 'user' ? 'text-red-300' : 'text-[#E60012]'}`}>•</span>
                                <span>{line.replace('- ', '')}</span>
                              </div>
                            );
                          }
                          return <p key={idx} className={line === '' ? 'h-2' : ''}>{line}</p>;
                        })}
                      </div>

                      {/* 에이전트 답변 복사 액션 버튼 */}
                      {msg.sender === 'agent' && (
                        <div className="pt-2.5 mt-2.5 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
                          <span>{msg.timestamp}</span>
                          <button
                            type="button"
                            onClick={() => handleCopyText(msg.id, msg.text)}
                            className="flex items-center gap-1 hover:text-neutral-700 transition-colors cursor-pointer text-[11px] font-medium"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-600 font-semibold">복사 완료</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>텍스트 복사</span>
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Citations & Connectors Metadata */}
                    {msg.sender === 'agent' && (msg.citations?.length || msg.usedConnectors?.length) && (
                      <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[11px] text-neutral-500 pl-1">
                        {msg.usedConnectors && msg.usedConnectors.length > 0 && (
                          <span className="flex items-center gap-1 bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-md font-medium border border-neutral-200">
                            <Database className="w-3 h-3 text-neutral-500" />
                            {msg.usedConnectors.join(', ')}
                          </span>
                        )}
                        {msg.citations && msg.citations.length > 0 && (
                          <span className="flex items-center gap-1 bg-red-50 text-[#E60012] px-2 py-0.5 rounded-md font-medium border border-red-200/60">
                            <FileText className="w-3 h-3" />
                            출처: {msg.citations.join(', ')}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3 max-w-[80%] items-start">
                  <div className="w-8 h-8 rounded-xl bg-white border border-neutral-200 text-[#E60012] flex items-center justify-center shrink-0 shadow-2xs">
                    <Bot className="w-4 h-4 animate-spin" />
                  </div>
                  <div className="bg-white border border-neutral-200/90 p-3.5 rounded-2xl rounded-tl-none shadow-2xs text-xs text-neutral-600 flex items-center gap-2.5">
                    <div className="w-2 h-2 rounded-full bg-[#E60012] animate-ping" />
                    <span>Agent가 프롬프트 및 사내 RAG 문서를 분석하여 답변을 생성 중입니다...</span>
                  </div>
                </div>
              )}
            </div>

            {/* 하단 입력 영역 (넓은 폭에 맞춘 최적화 레이아웃) */}
            <footer className="p-4 sm:p-5 border-t border-neutral-200/90 bg-white shrink-0">
              <div className="max-w-4xl mx-auto space-y-2.5">
                
                {/* 인풋 추천 칩 */}
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5 text-xs">
                  <span className="text-neutral-400 text-[11px] font-bold shrink-0 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#E60012]" />
                    질의 추천:
                  </span>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('KPC 사내 표준 양식에 맞춘 3단 구성 보고서로 요약해줘.')}
                    className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-full shrink-0 transition-colors cursor-pointer border border-neutral-200 text-xs font-medium"
                  >
                    KPC 표준 3단 보고서 요약
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('과업 지시서에서 결격 사유 및 사전 인허가 요건 추출')}
                    className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-full shrink-0 transition-colors cursor-pointer border border-neutral-200 text-xs font-medium"
                  >
                    결격 사유 및 인허가 요건 확인
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset('예산 집행 절차와 계약 체결 시 주의사항 정리')}
                    className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-full shrink-0 transition-colors cursor-pointer border border-neutral-200 text-xs font-medium"
                  >
                    예산 집행 및 계약 주의사항
                  </button>
                </div>

                {/* 입력창 & 전송 버튼 */}
                <div className="flex items-end gap-2 bg-neutral-50 border border-neutral-300 rounded-xl p-2.5 focus-within:border-[#E60012] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#E60012]/30 transition-all shadow-2xs">
                  <button
                    type="button"
                    onClick={() => onShowToast('테스트용 문서 첨부 기능이 활성화되었습니다.')}
                    className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 rounded-lg transition-colors cursor-pointer shrink-0"
                    title="참고 문서 첨부 (PDF/DOCX/HWP)"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>

                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder={`"${agent.title}"에게 질문하거나 테스트할 텍스트를 입력하세요... (Enter 전송, Shift+Enter 줄바꿈)`}
                    rows={2}
                    className="flex-1 bg-transparent text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none resize-none py-1 max-h-28"
                  />

                  <button
                    type="button"
                    id="btn-runner-send"
                    onClick={() => handleSend()}
                    disabled={!inputText.trim() || isLoading}
                    className="px-4 py-2 bg-[#E60012] hover:bg-[#CC0010] disabled:bg-neutral-300 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shrink-0 shadow-2xs cursor-pointer active:scale-98"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>전송</span>
                  </button>
                </div>

                {/* 하단 고지 사항 */}
                <div className="flex items-center justify-between text-[11px] text-neutral-400 px-1">
                  <span>※ 본 테스트 콘솔은 AI Community 실시간 검증 환경으로, DLP 보안 규정을 엄격히 준수합니다.</span>
                  <span className="hidden sm:inline">단축키: Enter 전송 • Shift+Enter 줄바꿈</span>
                </div>

              </div>
            </footer>

          </main>
        </div>

      </div>
    </div>
  );
};
