import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Star, 
  Paperclip, 
  Mic, 
  Send, 
  RotateCw, 
  Folder, 
  FileText, 
  Check, 
  Copy, 
  ThumbsUp, 
  ThumbsDown,
  Sparkles,
  Bookmark,
  ChevronRight,
  ShieldCheck,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  History,
  Menu
} from 'lucide-react';
import { ChatMessage } from '../../types';
import { INITIAL_DIA_CHAT_MESSAGES, DIA_SAMPLE_HISTORY } from '../../data/mockData';

interface DiaChatProps {
  onShowToast: (msg: string) => void;
}

const CATEGORIES = [
  '경영전략',
  '생산성',
  'CX',
  '교육',
  '자격',
  '내부규정'
];

export const DiaChat: React.FC<DiaChatProps> = ({ onShowToast }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('경영전략');
  const [searchQuery, setSearchQuery] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_DIA_CHAT_MESSAGES);
  const [chatHistory, setChatHistory] = useState(DIA_SAMPLE_HISTORY);
  const [isAiResponding, setIsAiResponding] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(['생산성 모델 가이드라인', '공공 제안서 작성 표준']);
  const [showLeftSidebar, setShowLeftSidebar] = useState(true);
  const [showRightSidebar, setShowRightSidebar] = useState(true);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() && attachedFiles.length === 0) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      category: selectedCategory,
      attachedFiles: [...attachedFiles]
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setAttachedFiles([]);
    setIsAiResponding(true);

    // AI answer generation simulation with KPC Domain knowledge
    setTimeout(() => {
      let aiContent = '';
      let citations: { id: number; label: string; text: string }[] = [];

      if (text.includes('생산성') || text.includes('요약')) {
        aiContent = `한국생산성본부(KPC) 생산성혁신연구소의 최신 데이터 및 주요 지표 분석 결과입니다.\n\n### 1. 2026 공공·제조 총요소생산성(TFP) 동향\n• **생산성 지수(K-PI) 변화**: 공공기관 디지털 전환 가속화로 전년 대비 프로세스 효율성이 평균 **12.4%** 향상되었습니다.\n• **주요 병목 요인**: 비정형 행정 문서 처리 및 이중 결재 절차로 인해 주당 약 14.8시간의 간접 지연이 발생하고 있습니다.\n\n### 2. 혁신 권고사항\n1) 사내 지식 기반 RAG 생성형 AI 플랫폼 구축을 통한 행정 기안 시간 50% 단축 [1]\n2) 국가고객만족도(NCSI) 모델 연계 실시간 업무 모니터링 체계 수립 [2]`;
        citations = [
          { id: 1, label: 'KPC-2025-PRD-01', text: '한국생산성본부 생산성 혁신 프레임워크 연구보고서 p.42' },
          { id: 2, label: 'NCSI-METRIC-2026', text: '공공부문 국가고객만족도 측정 매뉴얼' }
        ];
      } else if (text.includes('CX') || text.includes('사례')) {
        aiContent = `한국생산성본부 CX컨설팅본부에서 수행한 공공 및 금융권 고객경험(CX) 혁신 모범사례입니다.\n\n### 주요 사례: 공공행정 민원 VOC 지능형 분석 플랫폼\n• **대상 기관**: 중앙 행정부처 산하 공공기관\n• **추진 내용**: 연간 25만 건의 민원 데이터(VOC)에 대한 감성 분석 및 AI 자동 분류 체계 구축 [1]\n• **주요 성과**: 불만 민원 사전 감지율 89% 달성, 처리 소요 시간 평균 3.4일 → 1.1일로 단축.`;
        citations = [
          { id: 1, label: 'KPC-CX-2024-CASE', text: '2024 공공기관 CX 혁신 우수사례집 p.18' }
        ];
      } else if (text.includes('교육사업') || text.includes('보고서')) {
        aiContent = `KPC 디지털인재개발센터의 교육사업 성과 데이터 분석 결과입니다.\n\n• **수료 인원**: 2025년 총 42,000명 수료 (공공기관 임직원 비율 62%)\n• **과정 만족도**: 종합 만족도 94.8점 (강사 전문성 96.2점, 실무 적용도 93.4점)\n• **생성형 AI 과정 현황**: 재직자 맞춤형 AI 리터러시 및 프롬프트 엔지니어링 과정 수강생 320% 급증 [1]\n\n해당 통계를 토대로 [보고서 생성] 탭에서 공공 제안 및 사내 기안 보고서로 즉시 전환할 수 있습니다.`;
        citations = [
          { id: 1, label: 'KPC-EDU-STAT-2025', text: '2025 KPC 디지털 교육사업 통계연보' }
        ];
      } else {
        aiContent = `**${selectedCategory}** 분야 사내 축적 지식과 KPC 표준 방법론을 종합 분석한 답변입니다.\n\n• 요청하신 내용에 대해 사내 표준 가이드라인 및 공공 조달 규정을 검토하였습니다.\n• 한국생산성본부의 공공 사업 수행 방법론(PRO-AI™)에 부합하도록 단계별 실행 방안을 제안할 수 있습니다.\n• 상세 제안서 작성이 필요하시다면 상단 **'제안서 생성'** 메뉴의 파이프라인과 연동하여 목차 및 초안을 자동 생성할 수 있습니다.`;
        citations = [
          { id: 1, label: 'KPC-KNOWLEDGE-BASE', text: 'KPC 전사 컨설팅 지식 자산 아카이브 v4' }
        ];
      }

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        content: aiContent,
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        citations
      };

      setMessages(prev => [...prev, assistantMsg]);
      setIsAiResponding(false);
    }, 900);
  };

  const handleSelectHistory = (historyItem: typeof DIA_SAMPLE_HISTORY[0]) => {
    setSelectedCategory(historyItem.category);
    setMessages([
      ...INITIAL_DIA_CHAT_MESSAGES,
      {
        id: `h-q-${historyItem.id}`,
        sender: 'user',
        content: historyItem.title,
        timestamp: '어제 16:20',
        category: historyItem.category
      },
      {
        id: `h-a-${historyItem.id}`,
        sender: 'assistant',
        content: `한국생산성본부 사내 지식 베이스에서 **'${historyItem.title}'** 관련 문서 14건을 검색하여 요약한 내용입니다.\n\n• 본 사안은 KPC 표준 방법론에 따라 추진되었으며, 산출물 가이드라인 및 과거 유사 프로젝트 제안서가 등록되어 있습니다.\n• 추가적인 비교 분석이나 제안서 초안 작성이 필요하시면 언제든 말씀해 주세요.`,
        timestamp: '어제 16:21',
        citations: [{ id: 1, label: 'KPC-REF', text: `${historyItem.category} 사내 표준 편람` }]
      }
    ]);
    onShowToast(`'${historyItem.title}' 대화 기록을 불러왔습니다.`);
  };

  const handleNewChat = () => {
    setMessages(INITIAL_DIA_CHAT_MESSAGES);
    setInputMessage('');
    setAttachedFiles([]);
    onShowToast('새 대화를 시작했습니다.');
  };

  const handleAddSampleAttachment = () => {
    setAttachedFiles(prev => [...prev, '한국산업진흥원_RFP_발췌문.pdf']);
    onShowToast('참고 문서가 첨부되었습니다.');
  };

  return (
    <div className="flex-1 w-full flex h-full overflow-hidden bg-white">
      {/* 1. Left LNB */}
      {showLeftSidebar && (
        <aside className="w-64 xl:w-72 border-r border-neutral-200 bg-[#F8F9FA] flex flex-col shrink-0 select-none transition-all duration-200">
          {/* New Chat & Search */}
          <div className="p-3 border-b border-neutral-200 space-y-2">
            <button
              id="dia-new-chat-btn"
              onClick={handleNewChat}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-[#E60012] text-white rounded-md text-xs font-semibold hover:bg-[#CC0010] transition-colors shadow-2xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              새 대화
            </button>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="카테고리/지식 검색..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-white pl-8 pr-2.5 py-1.5 rounded-md border border-neutral-200 text-xs text-[#111111] placeholder:text-neutral-400 focus:outline-none focus:border-[#E60012]"
              />
            </div>
          </div>

          {/* Categories & Favorites */}
          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {/* Favorites */}
            <div>
              <div className="flex items-center gap-1.5 px-2 mb-1.5 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                <Star className="w-3 h-3 text-neutral-600" />
                즐겨찾기
              </div>
              <div className="space-y-0.5">
                {favorites.map((fav, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(`${fav}에 대해 핵심만 요약해줘.`)}
                    className="w-full text-left px-2.5 py-1.5 rounded text-xs text-neutral-700 hover:bg-neutral-200/60 truncate transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Bookmark className="w-3 h-3 text-neutral-400 shrink-0" />
                    <span className="truncate">{fav}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div>
              <div className="flex items-center gap-1.5 px-2 mb-1.5 text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                <Folder className="w-3 h-3 text-neutral-600" />
                사내 지식 카테고리
              </div>
              <div className="space-y-1">
                {(CATEGORIES || []).filter(c => !searchQuery.trim() || (c || '').includes(searchQuery)).map(cat => {
                  const isSelected = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      id={`dia-cat-${cat}`}
                      onClick={() => {
                        setSelectedCategory(cat);
                        onShowToast(`카테고리가 '${cat}'(으)로 전환되었습니다.`);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-red-50 text-[#E60012] border-l-2 border-[#E60012] font-bold shadow-2xs'
                          : 'text-neutral-700 hover:bg-neutral-200/60'
                      }`}
                    >
                      <span>{cat}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded ${
                        isSelected ? 'bg-[#E60012]/10 text-[#E60012]' : 'text-neutral-400'
                      }`}>
                        {cat === '경영전략' ? '124' : cat === '생산성' ? '98' : '65'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Security Badge */}
          <div className="p-3 border-t border-neutral-200 bg-white/60">
            <div className="flex items-center gap-2 text-[11px] text-neutral-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="truncate">KPC 보안망 전용 엔터프라이즈 AI</span>
            </div>
          </div>
        </aside>
      )}

      {/* 2. Center: Chat Area */}
      <main className="flex-1 flex flex-col h-full bg-white overflow-hidden min-w-0">
        {/* Center Header */}
        <div className="h-13 border-b border-neutral-200 px-4 sm:px-6 flex items-center justify-between shrink-0 bg-white gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={() => setShowLeftSidebar(!showLeftSidebar)}
              className="p-1.5 text-neutral-500 hover:text-[#111111] hover:bg-neutral-100 rounded-md transition-colors shrink-0 cursor-pointer"
              title={showLeftSidebar ? "카테고리 패널 접기" : "카테고리 패널 열기"}
            >
              {showLeftSidebar ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
            </button>

            <div className="flex items-center gap-2 min-w-0">
              <span className="font-bold text-sm text-[#111111] whitespace-nowrap">
                Knowledge AI &gt; <span className="text-[#E60012]">{selectedCategory}</span>
              </span>
              <span className="text-xs text-neutral-500 border-l border-neutral-200 pl-2.5 truncate hidden md:inline-block">
                선택한 사내 지식과 AI를 기반으로 답변합니다.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] text-neutral-600 bg-neutral-100 px-2 py-1 rounded border border-neutral-200 font-medium hidden sm:inline-block">
              KPC Enterprise RAG v4.2
            </span>

            <button
              onClick={() => setShowRightSidebar(!showRightSidebar)}
              className={`p-1.5 rounded-md transition-colors flex items-center gap-1 text-xs font-medium cursor-pointer ${
                showRightSidebar 
                  ? 'text-neutral-500 hover:text-[#111111] hover:bg-neutral-100' 
                  : 'text-[#E60012] bg-red-50 hover:bg-red-100'
              }`}
              title={showRightSidebar ? "대화 기록 패널 접기" : "대화 기록 패널 열기"}
            >
              {showRightSidebar ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
              <span className="hidden lg:inline text-[11px]">대화 기록</span>
            </button>
          </div>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Welcome and Recommendation Cards if only initial message */}
          {messages.length === 1 && (
            <div className="max-w-4xl xl:max-w-5xl 2xl:max-w-6xl w-full mx-auto my-4 sm:my-8 text-center animate-in fade-in duration-300 px-2">
              <div className="w-12 h-12 rounded-xl bg-[#E60012]/10 text-[#E60012] flex items-center justify-center mx-auto mb-3 border border-[#E60012]/20 shadow-2xs">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#111111] mb-1">
                KPC AI에게 무엇이든 물어보세요.
              </h2>
              <p className="text-xs sm:text-sm text-neutral-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
                60년 축적된 한국생산성본부의 컨설팅 프레임워크, 수주 제안 노하우, 산업별 데이터를 실시간 검색합니다.
              </p>

              {/* 4 Recommended Question Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left">
                {[
                  {
                    title: '최근 생산성 주요 자료 요약',
                    desc: '공공기관 및 제조 혁신 TFP 지표 요약',
                    category: '생산성'
                  },
                  {
                    title: 'CX 내부 혁신 사례 탐색',
                    desc: '국가고객만족도(NCSI) 기반 공공 혁신 사례',
                    category: 'CX'
                  },
                  {
                    title: '교육사업 데이터 기반 보고서',
                    desc: '재직자 AI 리터러시 교육 성과 데이터셋',
                    category: '교육'
                  },
                  {
                    title: '공공 RFP 및 규정 분석',
                    desc: 'RFP 또는 규정 파일 업로드 후 심층 검토',
                    category: '경영전략'
                  }
                ].map((card, idx) => (
                  <div
                    key={idx}
                    id={`dia-rec-card-${idx}`}
                    onClick={() => {
                      setSelectedCategory(card.category);
                      handleSendMessage(card.title);
                    }}
                    className="p-4 rounded-xl border border-neutral-200 bg-neutral-50/70 hover:bg-white hover:border-[#E60012] cursor-pointer transition-all group shadow-2xs hover:shadow-xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-[#111111] group-hover:text-[#E60012] transition-colors leading-snug">
                          {card.title}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#E60012] transition-transform group-hover:translate-x-0.5 shrink-0" />
                      </div>
                      <p className="text-[11px] text-neutral-500 leading-relaxed">
                        {card.desc}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-neutral-200/50 flex items-center justify-between text-[10px] text-neutral-400 font-medium">
                      <span>카테고리: {card.category}</span>
                      <span className="text-[#E60012] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">질문하기 →</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Message List */}
          <div className="max-w-4xl xl:max-w-5xl 2xl:max-w-6xl w-full mx-auto space-y-4 px-2">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-8 h-8 rounded-lg bg-[#E60012] text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5 shadow-2xs tracking-tight">
                    KPC
                  </div>
                )}

                <div className={`max-w-[88%] md:max-w-[82%] rounded-xl p-4 text-xs sm:text-[13px] leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-[#111111] text-white shadow-xs'
                    : 'bg-neutral-50 border border-neutral-200 text-[#111111] shadow-2xs'
                }`}>
                  {/* Category Pill for user message */}
                  {msg.sender === 'user' && msg.category && (
                    <div className="text-[10px] text-neutral-400 font-medium mb-1">
                      [{msg.category}]
                    </div>
                  )}

                  {/* Attached Files display */}
                  {msg.attachedFiles && msg.attachedFiles.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {msg.attachedFiles.map((file, i) => (
                        <span key={i} className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-white/20 text-white">
                          <Paperclip className="w-2.5 h-2.5" />
                          {file}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Message Body */}
                  <div className="whitespace-pre-line">
                    {msg.content}
                  </div>

                  {/* Citations block */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-neutral-200">
                      <div className="text-[11px] font-bold text-neutral-700 mb-1.5">
                        참고 사내 지식 및 출처:
                      </div>
                      <div className="space-y-1">
                        {msg.citations.map((c, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-[11px] text-neutral-600">
                            <span className="font-bold text-[#E60012] bg-[#E60012]/10 px-1 py-0.2 rounded text-[10px]">
                              [{c.id}]
                            </span>
                            <span className="font-medium text-neutral-800">{c.label}</span>
                            <span className="text-neutral-400">-</span>
                            <span>{c.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Message Bottom Action Icons for Assistant */}
                  {msg.sender === 'assistant' && msg.id !== 'dia-msg-1' && (
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-neutral-200/80 text-neutral-400">
                      <span className="text-[10px]">{msg.timestamp}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(msg.content);
                            onShowToast('답변 내용이 클립보드에 복사되었습니다.');
                          }}
                          className="flex items-center gap-1 text-[11px] text-neutral-500 hover:text-neutral-800 px-1.5 py-0.5 rounded hover:bg-neutral-100 transition-colors cursor-pointer"
                          title="답변 복사"
                        >
                          <Copy className="w-3 h-3" />
                          <span>복사</span>
                        </button>
                        <button
                          onClick={() => onShowToast('피드백이 반영되었습니다 (도움 됨).')}
                          className="flex items-center gap-1 text-[11px] text-neutral-500 hover:text-neutral-800 px-1.5 py-0.5 rounded hover:bg-neutral-100 transition-colors cursor-pointer"
                          title="도움 됨"
                        >
                          <ThumbsUp className="w-3 h-3" />
                          <span>추천</span>
                        </button>
                        <button
                          onClick={() => onShowToast('피드백이 접수되었습니다.')}
                          className="flex items-center gap-1 text-[11px] text-neutral-500 hover:text-neutral-800 px-1.5 py-0.5 rounded hover:bg-neutral-100 transition-colors cursor-pointer"
                          title="도움 안 됨"
                        >
                          <ThumbsDown className="w-3 h-3" />
                          <span>비추천</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-neutral-800 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    정
                  </div>
                )}
              </div>
            ))}

            {isAiResponding && (
              <div className="flex gap-3 items-center text-xs text-neutral-500 pl-11">
                <div className="w-2 h-2 rounded-full bg-[#E60012] animate-ping" />
                <span>KPC 지식 베이스 검색 및 답변 생성 중...</span>
              </div>
            )}
          </div>
        </div>

        {/* 3. Bottom Chat Input Area - Fluid Proportional Width */}
        <div className="p-4 border-t border-neutral-200 bg-white shrink-0">
          <div className="max-w-4xl xl:max-w-5xl 2xl:max-w-6xl w-full mx-auto">
            {/* Attached file badges */}
            {attachedFiles.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {attachedFiles.map((file, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 text-xs bg-neutral-100 text-neutral-700 px-2.5 py-1 rounded-md border border-neutral-200"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#E60012]" />
                    {file}
                    <button
                      onClick={() => setAttachedFiles(prev => prev.filter((_, i) => i !== idx))}
                      className="text-neutral-400 hover:text-neutral-700 ml-1 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Input Box */}
            <div className="relative rounded-xl border border-neutral-300 focus-within:border-[#E60012] focus-within:ring-1 focus-within:ring-[#E60012] bg-white transition-all shadow-2xs">
              <textarea
                id="dia-chat-input"
                rows={3}
                placeholder="KPC 사내 지식에 대해 무엇이든 질문하세요. (Enter로 전송, Shift+Enter로 줄바꿈)"
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                className="w-full px-4 py-3 text-xs sm:text-sm text-[#111111] placeholder:text-neutral-400 focus:outline-none resize-none"
              />

              {/* Input Action Controls */}
              <div className="flex items-center justify-between px-3.5 py-2.5 border-t border-neutral-100 bg-neutral-50/60 rounded-b-xl">
                <div className="flex items-center gap-2">
                  <button
                    id="dia-attach-file-btn"
                    onClick={handleAddSampleAttachment}
                    className="p-1.5 text-neutral-500 hover:text-[#111111] hover:bg-neutral-200/60 rounded transition-colors cursor-pointer"
                    title="파일 첨부 (PDF, HWP, DOCX)"
                  >
                    <Paperclip className="w-4 h-4" />
                  </button>
                  <button
                    id="dia-voice-input-btn"
                    onClick={() => {
                      setIsRecording(!isRecording);
                      if (!isRecording) {
                        onShowToast('음성 인식 시뮬레이션이 활성화되었습니다.');
                        setInputMessage('공공기관 생성형 AI 업무혁신 사업 제안 전략을 알려줘.');
                      } else {
                        onShowToast('음성 인식이 종료되었습니다.');
                      }
                    }}
                    className={`p-1.5 rounded transition-colors cursor-pointer ${
                      isRecording ? 'text-[#E60012] bg-red-50' : 'text-neutral-500 hover:text-[#111111] hover:bg-neutral-200/60'
                    }`}
                    title="음성 입력"
                  >
                    <Mic className="w-4 h-4" />
                  </button>
                  <span className="text-[11px] text-neutral-600 hidden sm:inline">
                    참고 대상: <strong className="text-neutral-700">{selectedCategory}</strong> 지식 베이스
                  </span>
                </div>

                <button
                  id="dia-send-msg-btn"
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() && attachedFiles.length === 0}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#E60012] hover:bg-[#CC0010] disabled:bg-neutral-200 disabled:text-neutral-400 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  <span>전송</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 4. Right Panel: Conversation History */}
      {showRightSidebar && (
        <aside className="w-68 xl:w-72 border-l border-neutral-200 bg-[#F8F9FA] flex flex-col shrink-0 select-none transition-all duration-200">
          <div className="h-13 border-b border-neutral-200 px-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-neutral-500" />
              <span className="text-xs font-bold text-[#111111]">최근 대화 기록</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setChatHistory([...DIA_SAMPLE_HISTORY]);
                  onShowToast('대화 기록을 새로고침했습니다.');
                }}
                className="p-1.5 text-neutral-500 hover:text-[#111111] hover:bg-neutral-200/60 rounded transition-colors cursor-pointer"
                title="새로고침"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setShowRightSidebar(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded transition-colors cursor-pointer"
                title="패널 닫기"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {chatHistory.map(item => (
              <div
                key={item.id}
                onClick={() => handleSelectHistory(item)}
                className="p-2.5 rounded-lg border border-neutral-200 bg-white hover:border-[#E60012] cursor-pointer transition-all shadow-2xs group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-semibold text-[#E60012] bg-red-50 px-1.5 py-0.2 rounded">
                    {item.category}
                  </span>
                  <span className="text-[10px] text-neutral-400">{item.date}</span>
                </div>
                <h4 className="text-xs font-semibold text-neutral-800 line-clamp-2 group-hover:text-[#E60012] transition-colors leading-snug">
                  {item.title}
                </h4>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-neutral-200 text-center">
            <span className="text-[11px] text-neutral-600">
              총 5건의 이전 세션 저장됨
            </span>
          </div>
        </aside>
      )}
    </div>
  );
};
