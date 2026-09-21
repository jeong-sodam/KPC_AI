import React, { useState, useEffect } from 'react';
import { 
  X, ExternalLink, RefreshCw, Maximize2, Minimize2, CheckCircle2, 
  Sparkles, FileText, Play, Copy, Download, ShieldCheck, AlertTriangle, 
  ArrowRight, MessageSquare, Send, Check, UserCheck, Calendar, Clock,
  Table, ChevronRight, Terminal, Globe, Lock
} from 'lucide-react';
import { CommunityAgent } from '../../types';

interface InteractiveDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: CommunityAgent | null;
  isStandalone?: boolean;
}

export const InteractiveDemoModal: React.FC<InteractiveDemoModalProps> = ({
  isOpen,
  onClose,
  post,
  isStandalone = false
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [runProgress, setRunProgress] = useState(0);
  const [copiedUrl, setCopiedUrl] = useState(false);

  // Scenario state for different types
  const [selectedScenario, setSelectedScenario] = useState<number>(0);
  
  // Meeting AI specific state
  const [speakerSeparation, setSpeakerSeparation] = useState(true);
  const [kpcGlossary, setKpcGlossary] = useState(true);
  const [actionItemExtract, setActionItemExtract] = useState(true);
  const [customMeetingText, setCustomMeetingText] = useState('');

  // Receipt OCR specific state
  const [receiptPreset, setReceiptPreset] = useState<'normal' | 'late_bar' | 'over_limit'>('normal');

  // Onboarding Q&A state
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'ai'; text: string; time: string }>>([
    {
      role: 'ai',
      text: '안녕하세요! KPC 신규 입사자 온보딩 도우미 AI입니다. 사내 규정, 복지, 결재선, IT 계정 설정 등 궁금한 점을 무엇이든 편하게 물어보세요.',
      time: '방금 전'
    }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Reset state when post changes or modal opens
  useEffect(() => {
    if (isOpen && post) {
      setHasRun(false);
      setIsRunning(false);
      setRunProgress(0);
      setSelectedScenario(0);

      // Initialize meeting text sample
      if (post.id === 'comm-meeting-ai' || post.title.includes('회의')) {
        setCustomMeetingText(`[정소담 책임 / AI전략팀]
안녕하십니까, 오늘 DX추진단과 AI전략팀 9월 3주차 회의를 시작하겠습니다. 주요 안건은 KPC 사내 AI 커뮤니티 정식 런칭 일정 및 공공사업 제안용 LLM 모델 보안성 검토 건입니다.

[김OO 수석 / DX본부]
제안서 작성 지원 AI 모듈의 경우 이번 주 금요일까지 공공입찰 RFP 배점 분석 알고리즘 테스트가 마무리됩니다. 다음 주 월요일부터 시범 운영에 들어갈 수 있습니다.

[박OO 팀장 / 경영지원본부]
영수증 OCR 및 전표 자동화 시스템도 재무회계팀과 연동 테스트 중입니다. 법인카드 규정 위반 필터링(1인 3만원, 심야 사용)은 정상 작동하고 있습니다.

[정소담 책임 / AI전략팀]
감사합니다. 그럼 AI전략팀은 9월 20일까지 보안성 검토 문서를 정보보안팀에 제출하고, DX본부 김 수석님은 9월 22일까지 RFP 배점표 샘플 데이터를 취합해주시기 바랍니다.`);
      }
    }
  }, [isOpen, post]);

  if (!isOpen || !post) return null;

  const demoUrl = `https://demo.kpc.ai/prototype/${post.id}?version=${post.version || 'v1.0'}`;

  const handleCopyUrl = () => {
    navigator.clipboard?.writeText(demoUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleOpenNewBrowserTab = () => {
    const fullUrl = `${window.location.origin}${window.location.pathname}?demo=${post.id}`;
    window.open(fullUrl, '_blank');
  };

  const handleRunDemo = () => {
    setIsRunning(true);
    setRunProgress(15);
    setHasRun(false);

    const timer1 = setTimeout(() => setRunProgress(45), 250);
    const timer2 = setTimeout(() => setRunProgress(80), 500);
    const timer3 = setTimeout(() => {
      setRunProgress(100);
      setIsRunning(false);
      setHasRun(true);
    }, 750);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  };

  const handleSendChatMessage = (textToSend?: string) => {
    const message = textToSend || chatInput;
    if (!message.trim()) return;

    const userMsg = {
      role: 'user' as const,
      text: message,
      time: '방금 전'
    };

    setChatMessages(prev => [...prev, userMsg]);
    if (!textToSend) setChatInput('');

    // AI answer response simulation
    setTimeout(() => {
      let aiReply = 'KPC 사내 편람 규정에 따라 안내해 드립니다.';
      if (message.includes('연차') || message.includes('휴가')) {
        aiReply = '【연차 휴가 신청 안내】\n1. 그룹웨어 > 전자결재 > [근태신청서] 작성\n2. 사용일 최소 1일 전 부서장 결재 득 필요 (반차는 당일 오전 신청 가능)\n3. 입사 1년 미만 신규 입사자는 1개월 개근 시 1일씩 총 11일 발생합니다.';
      } else if (message.includes('와이파이') || message.includes('인터넷') || message.includes('보안')) {
        aiReply = '【사내 Wi-Fi & 보안 솔루션 안내】\n• SSID: KPC_Employee_5G (사내 포털 ID/PW로 접속)\n• 필수 설치: V3 Endpoint Security, 사내 DLP 문서보안 프로그램 (사내 인트라넷 > 소프트웨어 자료실 다운로드)';
      } else if (message.includes('법인카드') || message.includes('영수증') || message.includes('정산')) {
        aiReply = '【법인카드 발급 및 정산 기준】\n• 발급: 신규 입사자 OT 후 3일 이내 총무팀에서 수령\n• 정산 기한: 익월 5일까지 ERP 지출결의서 작성 및 영수증 첨부\n• 식대 기준: 1인당 30,000원 이하 (야근식대는 20시 이후 식사 시 인정)';
      } else {
        aiReply = `문의하신 "${message}" 건에 대해 사내 업무 매뉴얼(2026 개정판)을 검색했습니다. 추가 세부 절차는 사내 인트라넷 [업무지원 FAQ] 게시판 또는 담당 부서(경영기획실 / 인사총무팀)에 문의하시면 가장 정확한 안내를 받으실 수 있습니다.`;
      }

      setChatMessages(prev => [...prev, {
        role: 'ai',
        text: aiReply,
        time: '방금 전'
      }]);
    }, 450);
  };

  // Determine what type of demo to render
  const isMeetingAi = post.id === 'comm-meeting-ai' || post.title.includes('회의') || post.category?.includes('회의');
  const isReceiptAi = post.id === 'comm-receipt-ocr' || post.title.includes('영수증') || post.category?.includes('회계');
  const isRfpAi = post.id === 'comm-rfp-agent' || post.title.includes('RFP') || post.category?.includes('RFP') || post.tags?.includes('RFP');
  const isDataAi = post.id === 'comm-data-cleansing' || post.title.includes('데이터') || post.category?.includes('데이터');
  const isOnboardingAi = post.id === 'comm-onboarding-idea' || post.title.includes('온보딩') || post.title.includes('입사자');

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 ${
      isStandalone ? 'bg-neutral-900' : 'bg-neutral-900/80 backdrop-blur-xs'
    }`}>
      {/* Browser Window Outer Frame */}
      <div 
        className={`w-full bg-white rounded-2xl shadow-2xl flex flex-col border border-neutral-700/50 overflow-hidden transition-all duration-200 ${
          isFullscreen || isStandalone ? 'h-[98vh] max-w-[98vw]' : 'h-[92vh] max-w-6xl'
        }`}
      >
        {/* 1. Realistic Browser Chrome Title Bar */}
        <div className="bg-neutral-900 text-neutral-200 px-4 py-3 flex items-center justify-between gap-3 border-b border-neutral-800 select-none">
          {/* Left Traffic Lights (Mac style) */}
          <div className="flex items-center gap-2">
            <button 
              type="button" 
              onClick={onClose}
              className="w-3 h-3 rounded-full bg-rose-500 hover:bg-rose-600 transition-colors cursor-pointer"
              title="닫기"
            />
            <button 
              type="button" 
              onClick={() => { setHasRun(false); setIsRunning(false); }}
              className="w-3 h-3 rounded-full bg-amber-500 hover:bg-amber-600 transition-colors cursor-pointer"
              title="새로고침/초기화"
            />
            <button 
              type="button" 
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="w-3 h-3 rounded-full bg-emerald-500 hover:bg-emerald-600 transition-colors cursor-pointer"
              title="전체화면 전환"
            />
            <div className="ml-3 hidden sm:flex items-center gap-1.5 text-xs text-neutral-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>KPC AI Prototype Live Sandbox</span>
            </div>
          </div>

          {/* Center: Realistic Browser Address Bar */}
          <div className="flex-1 max-w-xl mx-2">
            <div className="bg-neutral-800/90 hover:bg-neutral-800 transition-colors rounded-xl px-3 py-1.5 flex items-center justify-between text-xs text-neutral-300 border border-neutral-700">
              <div className="flex items-center gap-2 truncate">
                <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate font-mono text-[11px] text-neutral-300">
                  {demoUrl}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopyUrl}
                className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-700 hover:bg-neutral-600 text-neutral-300 cursor-pointer shrink-0 transition-colors ml-2"
              >
                {copiedUrl ? '복사됨 ✓' : '주소 복사'}
              </button>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            {!isStandalone && (
              <button
                type="button"
                onClick={handleOpenNewBrowserTab}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-xs"
                title="실제 독립된 새 브라우저 창/탭으로 분리"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>새 브라우저 탭으로 열기</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              title={isFullscreen ? '화면 축소' : '전체화면'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 hover:bg-rose-900/40 text-neutral-400 hover:text-rose-300 rounded-lg transition-colors cursor-pointer"
              title="창 닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. Sub-Header: Service Info Banner */}
        <div className="bg-neutral-50 px-6 py-3.5 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
              <Sparkles className="w-5 h-5 text-[#E60012]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-neutral-900">
                  {post.title}
                </h2>
                <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 font-mono text-[10px] font-bold">
                  {post.version || 'v0.4'}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  데모 시연 모드
                </span>
              </div>
              <p className="text-xs text-neutral-500 line-clamp-1">
                작성자: {post.author} ({post.department}) · {post.oneLineDesc || post.shortDesc}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="hidden md:inline text-neutral-500">
              ⚡ 시연용 대화형 샌드박스
            </span>
            <button
              type="button"
              onClick={() => {
                setHasRun(false);
                setIsRunning(false);
                setRunProgress(0);
              }}
              className="px-3 py-1.5 bg-white border border-neutral-300 hover:bg-neutral-100 text-neutral-700 rounded-xl font-medium flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>처음 상태로 초기화</span>
            </button>
          </div>
        </div>

        {/* 3. Main Demo Area (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-neutral-100/60 space-y-6">

          {/* ─────────────────────────────────────────────────────────────
              CASE 1: 회의록 정리 AI (comm-meeting-ai)
              ───────────────────────────────────────────────────────────── */}
          {isMeetingAi && (
            <div className="space-y-6 max-w-5xl mx-auto">
              {/* Presets Bar */}
              <div className="bg-white rounded-2xl p-4 border border-neutral-200/80 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                    <Terminal className="w-4 h-4 text-purple-600" />
                    시연용 회의 녹취 시나리오 선택
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    원하는 시나리오를 누르면 실제 회의 텍스트가 즉시 채워집니다.
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedScenario(0);
                      setCustomMeetingText(`[정소담 책임 / AI전략팀]
안녕하십니까, 오늘 DX추진단과 AI전략팀 9월 3주차 회의를 시작하겠습니다. 주요 안건은 KPC 사내 AI 커뮤니티 정식 런칭 일정 및 공공사업 제안용 LLM 모델 보안성 검토 건입니다.

[김OO 수석 / DX본부]
제안서 작성 지원 AI 모듈의 경우 이번 주 금요일까지 공공입찰 RFP 배점 분석 알고리즘 테스트가 마무리됩니다. 다음 주 월요일부터 시범 운영에 들어갈 수 있습니다.

[박OO 팀장 / 경영지원본부]
영수증 OCR 및 전표 자동화 시스템도 재무회계팀과 연동 테스트 중입니다. 법인카드 규정 위반 필터링(1인 3만원, 심야 사용)은 정상 작동하고 있습니다.

[정소담 책임 / AI전략팀]
감사합니다. 그럼 AI전략팀은 9월 20일까지 보안성 검토 문서를 정보보안팀에 제출하고, DX본부 김 수석님은 9월 22일까지 RFP 배점표 샘플 데이터를 취합해주시기 바랍니다.`);
                      setHasRun(false);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                      selectedScenario === 0 
                        ? 'bg-purple-900 text-white shadow-xs' 
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    1. DX추진단 주간 업무회의 (오디오 전사록)
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedScenario(1);
                      setCustomMeetingText(`[이OO 상무 / 컨설팅본부]
한국재정정보원 차세대 클라우드 인프라 구축 제안사업 킥오프 시작하겠습니다. 예산 규모는 85억이며, 제안서 제출 마감은 10월 15일입니다.

[최OO 책임 / 솔루션아키텍트팀]
기술평가 비중이 80%로 매우 높습니다. 특히 클라우드 보안 CMMI Level 3 충족 여부와 AI 장애 관제 자동화 구현 능력이 당락을 좌우할 것으로 보입니다.

[이OO 상무 / 컨설팅본부]
좋습니다. 최 책임은 9월 28일까지 기술제안서 3장 아키텍처 초안을 완성하고, 경영지원팀 송 대리는 9월 25일까지 입찰 참가 자격 증빙서류 일체를 조달청 나라장터에 사전 등록하세요.`);
                      setHasRun(false);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                      selectedScenario === 1 
                        ? 'bg-purple-900 text-white shadow-xs' 
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    2. 재정정보원 차세대 제안사업 킥오프 회의
                  </button>
                </div>
              </div>

              {/* Input Area */}
              <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-neutral-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#E60012]" />
                    회의 녹취 원문 텍스트 (직접 수정 가능)
                  </label>
                  <div className="flex items-center gap-3 text-xs">
                    <label className="flex items-center gap-1 text-neutral-600 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={speakerSeparation} 
                        onChange={e => setSpeakerSeparation(e.target.checked)}
                        className="accent-purple-900 rounded" 
                      />
                      <span>화자 분리</span>
                    </label>
                    <label className="flex items-center gap-1 text-neutral-600 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={kpcGlossary} 
                        onChange={e => setKpcGlossary(e.target.checked)}
                        className="accent-purple-900 rounded" 
                      />
                      <span>KPC 사내 용어 매핑</span>
                    </label>
                    <label className="flex items-center gap-1 text-neutral-600 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={actionItemExtract} 
                        onChange={e => setActionItemExtract(e.target.checked)}
                        className="accent-purple-900 rounded" 
                      />
                      <span>Action Item 추출</span>
                    </label>
                  </div>
                </div>

                <textarea
                  value={customMeetingText}
                  onChange={e => setCustomMeetingText(e.target.value)}
                  rows={6}
                  className="w-full p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-mono leading-relaxed focus:outline-hidden focus:bg-white focus:border-purple-600 transition-colors"
                  placeholder="회의록 텍스트를 입력하거나 위 시나리오 버튼을 클릭하세요..."
                />

                {/* Run Button */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-neutral-500">
                    💡 버튼을 누르면 AI가 화자를 구분하고 핵심 의사결정 및 할 일 목록을 즉시 정리합니다.
                  </span>
                  <button
                    type="button"
                    disabled={isRunning || !customMeetingText.trim()}
                    onClick={handleRunDemo}
                    className="px-6 py-2.5 bg-purple-900 hover:bg-purple-800 disabled:bg-neutral-300 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-2 shadow-xs"
                  >
                    {isRunning ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>AI 심층 분석 및 정리 중 ({runProgress}%)...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-white" />
                        <span>회의록 AI 분석 실행</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Live Output Section */}
              {hasRun && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  {/* Results Header */}
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>AI 회의록 분석 및 구조화 결과</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        분석 완료 (소요시간 0.7초)
                      </span>
                    </h3>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => alert('정리된 회의록이 Word 문서(.docx)로 다운로드되었습니다.')}
                        className="px-3 py-1.5 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Word 다운로드</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => alert('회의 참석자들에게 Teams 메신저 알림이 발송되었습니다.')}
                        className="px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-900 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Teams 참석자 전송</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 1. 3-Bullet Summary */}
                    <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs space-y-3">
                      <h4 className="font-bold text-xs text-neutral-900 uppercase tracking-wider flex items-center gap-2 border-b border-neutral-100 pb-2">
                        <Sparkles className="w-4 h-4 text-[#E60012]" />
                        1. 핵심 논의 및 주요 의사결정 요약
                      </h4>
                      <ul className="space-y-2 text-xs text-neutral-700 leading-relaxed">
                        <li className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5 shrink-0" />
                          <span><strong>사내 AI 커뮤니티 런칭:</strong> 주간 테스트 완료 후 다음 주 월요일부터 전사 오픈 시범 운영 추진 확정.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5 shrink-0" />
                          <span><strong>제안서 작성 지원 AI 모듈:</strong> 공공입찰 배점 분석 알고리즘 테스트 마무리 및 시범 적용.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-600 mt-1.5 shrink-0" />
                          <span><strong>보안성 심의 절차:</strong> 전산정보팀 및 정보보안 가이드라인 준수 점검표 작성 및 사전 보고.</span>
                        </li>
                      </ul>
                    </div>

                    {/* 2. Speaker Breakdown */}
                    <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs space-y-3">
                      <h4 className="font-bold text-xs text-neutral-900 uppercase tracking-wider flex items-center gap-2 border-b border-neutral-100 pb-2">
                        <UserCheck className="w-4 h-4 text-blue-600" />
                        2. 화자별 핵심 발언 타임라인
                      </h4>
                      <div className="space-y-2 text-xs text-neutral-700">
                        <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-200/60">
                          <div className="font-bold text-neutral-900 text-[11px] mb-1 text-purple-900">
                            • 정소담 책임 (AI전략팀):
                          </div>
                          <p className="text-[11px] text-neutral-600">
                            사내 AI 커뮤니티 런칭 일정 조율 및 정보보안팀 대상 보안성 검토 신청서 9/20 제출 총괄.
                          </p>
                        </div>
                        <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-200/60">
                          <div className="font-bold text-neutral-900 text-[11px] mb-1 text-blue-900">
                            • 김OO 수석 (DX본부):
                          </div>
                          <p className="text-[11px] text-neutral-600">
                            제안서 RFP 배점 분석 알고리즘 테스트 완료 및 샘플 데이터 9/22까지 최종 취합.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 3. Action Items Table */}
                  <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs space-y-3">
                    <h4 className="font-bold text-xs text-neutral-900 uppercase tracking-wider flex items-center justify-between border-b border-neutral-100 pb-2">
                      <span className="flex items-center gap-2">
                        <Table className="w-4 h-4 text-emerald-600" />
                        3. 추출된 후속 Action Item (자동 마감일 계산)
                      </span>
                      <span className="text-[11px] text-neutral-400 font-normal">
                        총 3건 추출됨
                      </span>
                    </h4>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-neutral-50 text-neutral-600 border-b border-neutral-200 text-[11px]">
                            <th className="py-2.5 px-3 font-bold">과제명</th>
                            <th className="py-2.5 px-3 font-bold">담당자</th>
                            <th className="py-2.5 px-3 font-bold">소속 부서</th>
                            <th className="py-2.5 px-3 font-bold">마감일</th>
                            <th className="py-2.5 px-3 font-bold">상태</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 text-neutral-800">
                          <tr className="hover:bg-purple-50/40 transition-colors">
                            <td className="py-2.5 px-3 font-medium">보안성 검토 신청서 작성 및 정보보안팀 제출</td>
                            <td className="py-2.5 px-3 font-bold text-purple-900">정소담 책임</td>
                            <td className="py-2.5 px-3 text-neutral-500">AI전략팀</td>
                            <td className="py-2.5 px-3 font-mono font-bold text-[#E60012]">2026.09.20 (D-3)</td>
                            <td className="py-2.5 px-3">
                              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">진행 대기</span>
                            </td>
                          </tr>
                          <tr className="hover:bg-purple-50/40 transition-colors">
                            <td className="py-2.5 px-3 font-medium">RFP 배점표 샘플 데이터 취합 및 최종 점검</td>
                            <td className="py-2.5 px-3 font-bold text-blue-900">김OO 수석</td>
                            <td className="py-2.5 px-3 text-neutral-500">DX본부</td>
                            <td className="py-2.5 px-3 font-mono font-bold text-neutral-700">2026.09.22 (D-5)</td>
                            <td className="py-2.5 px-3">
                              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">준비 중</span>
                            </td>
                          </tr>
                          <tr className="hover:bg-purple-50/40 transition-colors">
                            <td className="py-2.5 px-3 font-medium">영수증 OCR 전표 연동 재무팀 피드백 회신</td>
                            <td className="py-2.5 px-3 font-bold text-emerald-900">박OO 팀장</td>
                            <td className="py-2.5 px-3 text-neutral-500">경영지원본부</td>
                            <td className="py-2.5 px-3 font-mono font-bold text-neutral-700">2026.09.25 (D-8)</td>
                            <td className="py-2.5 px-3">
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">협의 중</span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              CASE 2: 법인카드 영수증 증빙 검증 AI (comm-receipt-ocr)
              ───────────────────────────────────────────────────────────── */}
          {isReceiptAi && (
            <div className="space-y-6 max-w-5xl mx-auto">
              {/* Presets Bar */}
              <div className="bg-white rounded-2xl p-4 border border-neutral-200/80 shadow-xs space-y-3">
                <span className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-purple-600" />
                  영수증 샘플 시나리오 선택 (규정 준수 vs 위반 테스트)
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => { setReceiptPreset('normal'); setHasRun(false); }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                      receiptPreset === 'normal' 
                        ? 'bg-emerald-700 text-white shadow-xs' 
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    1. [정상] 야근 식대 영수증 (2인 48,000원, 20:45)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setReceiptPreset('late_bar'); setHasRun(false); }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                      receiptPreset === 'late_bar' 
                        ? 'bg-rose-700 text-white shadow-xs' 
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    2. [규정 위반] 심야 유흥업종 결제 (01:25, 180,000원)
                  </button>
                  <button
                    type="button"
                    onClick={() => { setReceiptPreset('over_limit'); setHasRun(false); }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                      receiptPreset === 'over_limit' 
                        ? 'bg-amber-700 text-white shadow-xs' 
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    3. [한도 초과 주의] 1인 한도 3만원 초과 식대 (72,000원)
                  </button>
                </div>
              </div>

              {/* Receipt Visual Simulator */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Left: Receipt Paper Card */}
                <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                      <span className="font-mono text-xs text-neutral-500">법인카드 신용카드 매출전표</span>
                      <span className="px-2 py-0.5 rounded bg-neutral-100 text-neutral-600 font-mono text-[10px]">
                        가맹점 보관용
                      </span>
                    </div>

                    {receiptPreset === 'normal' && (
                      <div className="font-mono text-xs space-y-1.5 text-neutral-800">
                        <div className="text-center font-bold text-sm text-neutral-900 py-1">
                          본가 한우 광화문점
                        </div>
                        <div className="flex justify-between text-[11px] text-neutral-500">
                          <span>사업자: 101-86-12345</span>
                          <span>대표: 이순신</span>
                        </div>
                        <div className="flex justify-between">
                          <span>결제일시:</span>
                          <span className="font-bold">2026-09-16 20:42:15</span>
                        </div>
                        <div className="flex justify-between">
                          <span>카드번호:</span>
                          <span>9410-****-****-3312</span>
                        </div>
                        <div className="flex justify-between">
                          <span>승인번호:</span>
                          <span className="font-bold">48291032</span>
                        </div>
                        <div className="border-t border-dashed border-neutral-300 my-2 pt-2 flex justify-between font-bold text-sm">
                          <span>합계금액:</span>
                          <span className="text-emerald-700">48,000원 (2인)</span>
                        </div>
                      </div>
                    )}

                    {receiptPreset === 'late_bar' && (
                      <div className="font-mono text-xs space-y-1.5 text-neutral-800">
                        <div className="text-center font-bold text-sm text-neutral-900 py-1">
                          청담 라운지 바 & 펍
                        </div>
                        <div className="flex justify-between text-[11px] text-neutral-500">
                          <span>사업자: 211-81-99881</span>
                          <span>업종: 주점/유흥</span>
                        </div>
                        <div className="flex justify-between">
                          <span>결제일시:</span>
                          <span className="font-bold text-rose-600">2026-09-17 01:25:40</span>
                        </div>
                        <div className="flex justify-between">
                          <span>카드번호:</span>
                          <span>9410-****-****-3312</span>
                        </div>
                        <div className="flex justify-between">
                          <span>승인번호:</span>
                          <span className="font-bold">88210943</span>
                        </div>
                        <div className="border-t border-dashed border-neutral-300 my-2 pt-2 flex justify-between font-bold text-sm">
                          <span>합계금액:</span>
                          <span className="text-rose-700">180,000원</span>
                        </div>
                      </div>
                    )}

                    {receiptPreset === 'over_limit' && (
                      <div className="font-mono text-xs space-y-1.5 text-neutral-800">
                        <div className="text-center font-bold text-sm text-neutral-900 py-1">
                          호텔 프리미엄 다이닝
                        </div>
                        <div className="flex justify-between text-[11px] text-neutral-500">
                          <span>사업자: 104-81-55231</span>
                          <span>업종: 양식</span>
                        </div>
                        <div className="flex justify-between">
                          <span>결제일시:</span>
                          <span className="font-bold">2026-09-16 12:45:10</span>
                        </div>
                        <div className="flex justify-between">
                          <span>카드번호:</span>
                          <span>9410-****-****-3312</span>
                        </div>
                        <div className="flex justify-between">
                          <span>승인번호:</span>
                          <span className="font-bold">55920138</span>
                        </div>
                        <div className="border-t border-dashed border-neutral-300 my-2 pt-2 flex justify-between font-bold text-sm">
                          <span>합계금액:</span>
                          <span className="text-amber-700">72,000원 (1인)</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={isRunning}
                    onClick={handleRunDemo}
                    className="w-full mt-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors"
                  >
                    {isRunning ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>영수증 OCR 및 규정 검증 중...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>영수증 OCR 및 규정 검증 실행</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Right: Validation Results */}
                <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs space-y-4">
                  <h4 className="font-bold text-xs text-neutral-900 uppercase tracking-wider flex items-center justify-between border-b border-neutral-100 pb-3">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#E60012]" />
                      KPC 사내 경비 집행 규정 자동 검증 결과
                    </span>
                    {hasRun && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        receiptPreset === 'normal' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : receiptPreset === 'late_bar'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {receiptPreset === 'normal' ? '전 항목 적합' : receiptPreset === 'late_bar' ? '규정 위반 감지' : '소명 필요'}
                      </span>
                    )}
                  </h4>

                  {!hasRun ? (
                    <div className="p-8 text-center text-neutral-400 text-xs space-y-2">
                      <ShieldCheck className="w-8 h-8 text-neutral-300 mx-auto" />
                      <p>좌측의 [영수증 OCR 및 규정 검증 실행] 버튼을 누르면 실시간 검증이 진행됩니다.</p>
                    </div>
                  ) : (
                    <div className="space-y-3 text-xs">
                      {/* Check 1: 1인당 한도 */}
                      <div className={`p-3 rounded-xl border flex items-center justify-between ${
                        receiptPreset === 'over_limit' ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                      }`}>
                        <div className="space-y-0.5">
                          <span className="font-bold block">1. 1인당 식대 한도 (30,000원 이하)</span>
                          <span className="text-[11px] opacity-80">
                            {receiptPreset === 'normal' ? '2인 48,000원 (1인당 24,000원) - 정상' : receiptPreset === 'over_limit' ? '1인당 72,000원 (기준 3만원 초과: 사전결재 소명 필요)' : '기준치 적합'}
                          </span>
                        </div>
                        <span className="font-bold text-xs">
                          {receiptPreset === 'over_limit' ? '⚠️ 초과' : '✓ 적합'}
                        </span>
                      </div>

                      {/* Check 2: 심야 시간대 */}
                      <div className={`p-3 rounded-xl border flex items-center justify-between ${
                        receiptPreset === 'late_bar' ? 'bg-rose-50 border-rose-200 text-rose-900' : 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                      }`}>
                        <div className="space-y-0.5">
                          <span className="font-bold block">2. 심야 사용 제한 (23:00 ~ 06:00)</span>
                          <span className="text-[11px] opacity-80">
                            {receiptPreset === 'late_bar' ? '새벽 01:25 결제: 사내 복무규정상 심야 사용 불가' : '20:42 결제: 정상 야근 시간대'}
                          </span>
                        </div>
                        <span className="font-bold text-xs">
                          {receiptPreset === 'late_bar' ? '✕ 불가' : '✓ 통과'}
                        </span>
                      </div>

                      {/* Check 3: 클린카드 제한업종 */}
                      <div className={`p-3 rounded-xl border flex items-center justify-between ${
                        receiptPreset === 'late_bar' ? 'bg-rose-50 border-rose-200 text-rose-900' : 'bg-emerald-50/50 border-emerald-200 text-emerald-900'
                      }`}>
                        <div className="space-y-0.5">
                          <span className="font-bold block">3. 클린카드 제한 업종 (유흥/주점)</span>
                          <span className="text-[11px] opacity-80">
                            {receiptPreset === 'late_bar' ? '주점/바 업종: 법인카드 결제 제한 업종에 해당' : '일반음식점(한식): 승인 가능 업종'}
                          </span>
                        </div>
                        <span className="font-bold text-xs">
                          {receiptPreset === 'late_bar' ? '✕ 제한' : '✓ 승인'}
                        </span>
                      </div>

                      {/* ERP Auto mapping */}
                      <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
                        <span className="text-neutral-500 font-medium">추천 계정과목:</span>
                        <span className="font-bold font-mono text-purple-900">
                          {receiptPreset === 'normal' ? '복리후생비(야근식대) · PRJ-2026-DX-01' : '지출결의 반려 대상'}
                        </span>
                      </div>

                      {receiptPreset === 'normal' && (
                        <button
                          type="button"
                          onClick={() => alert('KPC 사내 ERP 지출결의서에 전표가 자동 생성되었습니다.')}
                          className="w-full py-2 bg-purple-900 hover:bg-purple-800 text-white rounded-xl font-bold text-xs cursor-pointer shadow-xs transition-colors"
                        >
                          KPC 사내 ERP 지출결의서로 전송 (1-Click)
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              CASE 3: RFP 제안요건 및 평가기준 분석 AI (comm-rfp-agent)
              ───────────────────────────────────────────────────────────── */}
          {isRfpAi && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-800 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#E60012]" />
                    조달청 공공입찰 공고문 샘플 (과업지시서 발췌본)
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    사업명: 2026 차세대 지능형 클라우드 인프라 구축
                  </span>
                </div>

                <div className="p-3.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-mono leading-relaxed text-neutral-700">
                  <p><strong>[입찰 자격]</strong> 소프트웨어산업진흥법 제24조에 의한 소프트웨어사업자(컴퓨터관련서비스사업) 등록 업체로서 최근 3년 이내 국가·공공기관 대상 단일 계약 30억 이상 클라우드 인프라 구축 실적 보유자.</p>
                  <p className="mt-2"><strong>[평가 배점]</strong> 기술능력평가 80점(정량 20점, 정성 60점) 및 입찰가격평가 20점으로 배점함. 기술평가 68점(85%) 미만일 경우 협상 대상에서 제외.</p>
                  <p className="mt-2"><strong>[감점 조항]</strong> 최근 3년 이내 부정당업자 제재 처분을 받은 사실이 있는 경우 건당 0.5점(최대 1.5점) 감점 처리함.</p>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    disabled={isRunning}
                    onClick={handleRunDemo}
                    className="px-6 py-2.5 bg-purple-900 hover:bg-purple-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
                  >
                    {isRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
                    <span>RFP 배점표 및 입찰 리스크 심층 분석 실행</span>
                  </button>
                </div>
              </div>

              {hasRun && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs space-y-2">
                      <span className="text-[11px] font-bold text-neutral-500">1. 평가 배점 구조</span>
                      <div className="text-xl font-bold text-purple-900">기술 80 / 가격 20</div>
                      <p className="text-xs text-neutral-600">
                        정성평가 60점이 핵심 승부처 (협상기준선 68점 이상 획득 필수)
                      </p>
                    </div>
                    <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs space-y-2">
                      <span className="text-[11px] font-bold text-neutral-500">2. 필수 참가 자격 검토</span>
                      <div className="text-xl font-bold text-emerald-600">전 항목 충족 가능 ✓</div>
                      <p className="text-xs text-neutral-600">
                        KPC 클라우드 유사 실적(42억) 보유로 실적 배점 만점(10점) 확보
                      </p>
                    </div>
                    <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs space-y-2">
                      <span className="text-[11px] font-bold text-neutral-500">3. 감점 리스크 점검</span>
                      <div className="text-xl font-bold text-neutral-800">감점 리스크 0점</div>
                      <p className="text-xs text-neutral-600">
                        최근 3개년 부정당업자 제재 내역 없음 확인 완료
                      </p>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs space-y-3">
                    <h4 className="font-bold text-xs text-neutral-900 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#E60012]" />
                      KPC 차별화 수주 전략 AI 권고안
                    </h4>
                    <div className="space-y-2 text-xs text-neutral-700">
                      <div className="p-3 bg-neutral-50 rounded-xl">
                        <strong>1. 지능형 AI 관제 아키텍처 제안:</strong> 타사 대비 LLM 기반 이상 징후 실시간 탐지 기능 강조 시 정성평가 3~5점 우위 선점 가능.
                      </div>
                      <div className="p-3 bg-neutral-50 rounded-xl">
                        <strong>2. 공공 클라우드 전환 전담 인력 투입:</strong> 투입 인력 전원 클라우드 공인 자격증 보유 증빙을 제안서 4장에 별도 배치 권장.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              CASE 4: 공공 교육 데이터 정제 AI (comm-data-cleansing)
              ───────────────────────────────────────────────────────────── */}
          {isDataAi && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-800">
                    샘플 훈련생 데이터셋: 2026_상반기_HRD-Net_수료생_5000명.xlsx
                  </span>
                  <span className="text-xs text-neutral-500">
                    용량: 14.2 MB · 5,000행
                  </span>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    disabled={isRunning}
                    onClick={handleRunDemo}
                    className="px-6 py-2.5 bg-purple-900 hover:bg-purple-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
                  >
                    {isRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
                    <span>데이터 정제 및 이상치 탐지 알고리즘 실행</span>
                  </button>
                </div>
              </div>

              {hasRun && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs">
                      <span className="text-xs text-neutral-500">총 검사 데이터</span>
                      <div className="text-2xl font-bold text-neutral-900">5,000건</div>
                    </div>
                    <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs">
                      <span className="text-xs text-emerald-600 font-bold">정상 유효 데이터</span>
                      <div className="text-2xl font-bold text-emerald-600">4,872건 (97.4%)</div>
                    </div>
                    <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs">
                      <span className="text-xs text-amber-600 font-bold">이상치 자동 보정</span>
                      <div className="text-2xl font-bold text-amber-600">128건 (100% 정제 완료)</div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs space-y-3">
                    <h4 className="text-xs font-bold text-neutral-900">자동 정제 내역 요약</h4>
                    <div className="space-y-2 text-xs text-neutral-700">
                      <div className="flex justify-between p-2.5 bg-neutral-50 rounded-xl">
                        <span>• 주민번호 체크섬 오류 및 하이픈 누락 자동 보정</span>
                        <span className="font-bold text-purple-900">42건 보정 완료</span>
                      </div>
                      <div className="flex justify-between p-2.5 bg-neutral-50 rounded-xl">
                        <span>• 수료 시간 누락값(결측치) 입퇴실 기록 기반 자동 보간</span>
                        <span className="font-bold text-purple-900">30건 보정 완료</span>
                      </div>
                      <div className="flex justify-between p-2.5 bg-neutral-50 rounded-xl">
                        <span>• 동일 사업장 중복 등록 수료생 단일 레코드 병합</span>
                        <span className="font-bold text-purple-900">56건 통합 완료</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => alert('정제 완료된 엑셀 파일(Cleaned_HRD_2026.xlsx)이 다운로드되었습니다.')}
                      className="mt-3 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>정제 완료 엑셀 파일 다운로드</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              CASE 5: 신규 입사자 온보딩 AI (comm-onboarding-idea)
              ───────────────────────────────────────────────────────────── */}
          {isOnboardingAi && (
            <div className="space-y-4 max-w-4xl mx-auto">
              {/* Question Chips */}
              <div className="bg-white rounded-2xl p-4 border border-neutral-200/80 shadow-xs space-y-2">
                <span className="text-xs font-bold text-neutral-700">
                  💡 자주 묻는 신규 입사자 질문 (클릭 시 실시간 응답 시연):
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    '연차 휴가 신청 방법 및 결재선은 어떻게 되나요?',
                    '사내 와이파이(Wi-Fi) 접속 및 보안 프로그램 설치는?',
                    '법인카드 발급 및 월말 영수증 정산 기한은 언제인가요?'
                  ].map(q => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => handleSendChatMessage(q)}
                      className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-900 rounded-xl text-xs font-medium cursor-pointer transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Window */}
              <div className="bg-white rounded-2xl border border-neutral-200/80 shadow-xs flex flex-col h-[460px] overflow-hidden">
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {chatMessages.map((msg, i) => (
                    <div 
                      key={i} 
                      className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <div className={`max-w-[85%] p-3.5 rounded-2xl text-xs whitespace-pre-line leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-purple-900 text-white rounded-tr-none'
                          : 'bg-neutral-100 text-neutral-800 rounded-tl-none border border-neutral-200/60'
                      }`}>
                        {msg.text}
                      </div>
                      <span className="text-[10px] text-neutral-400 mt-1 px-1">{msg.time}</span>
                    </div>
                  ))}
                </div>

                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSendChatMessage(); }}
                  className="p-3 bg-neutral-50 border-t border-neutral-200 flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    placeholder="사내 규정이나 시스템에 대해 질문해보세요..."
                    className="flex-1 px-3.5 py-2 bg-white border border-neutral-300 rounded-xl text-xs focus:outline-hidden focus:border-purple-900"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-900 hover:bg-purple-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>전송</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              CASE 6: Fallback for any other post
              ───────────────────────────────────────────────────────────── */}
          {!isMeetingAi && !isReceiptAi && !isRfpAi && !isDataAi && !isOnboardingAi && (
            <div className="space-y-6 max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs space-y-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-neutral-900">{post.title} 프로토타입 실행기</h3>
                  <p className="text-xs text-neutral-500">
                    현재 구현된 기능: {post.implementedFeatures || '기본 프롬프트 및 사내 RAG 연동 로직 테스트 완료'}
                  </p>
                </div>

                <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl text-xs space-y-2">
                  <span className="font-bold text-neutral-700 block">테스트 입력 프롬프트</span>
                  <input
                    type="text"
                    defaultValue="KPC 내부 기준에 따라 테스트 데이터를 분석하고 결과를 도출해주세요."
                    className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg text-xs"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    disabled={isRunning}
                    onClick={handleRunDemo}
                    className="px-6 py-2.5 bg-purple-900 hover:bg-purple-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
                  >
                    {isRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
                    <span>AI 시연 실행</span>
                  </button>
                </div>
              </div>

              {hasRun && (
                <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs space-y-3 animate-in fade-in duration-300">
                  <h4 className="font-bold text-xs text-emerald-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    AI 시연 결과 도출 완료 (정상 작동)
                  </h4>
                  <p className="text-xs text-neutral-700 whitespace-pre-line leading-relaxed">
                    {post.oneLineDesc}
                    {'\n\n'}
                    • [KPC 내부 표준 검증]: 통과{'\n'}
                    • [응답 레이턴시]: 0.42초{'\n'}
                    • [적용 모델]: Gemini 2.5 Flash Enterprise
                  </p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
