import React, { useState } from 'react';
import { 
  ArrowLeft,
  CheckCircle2, 
  Play, 
  Heart, 
  MessageSquare, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  Copy, 
  Check, 
  Send,
  TrendingUp,
  FileText,
  BarChart2,
  Users,
  Cpu,
  Coins,
  Timer,
  Bookmark,
  Trash2,
  ChevronRight,
  Bot
} from 'lucide-react';
import { VerifiedAgent, UserRole } from '../../types';

interface AiAgentDetailViewProps {
  agent: VerifiedAgent;
  userRole?: UserRole;
  onBack: () => void;
  onRunAgent: (agent: VerifiedAgent) => void;
  onToggleLike: (agentId: string) => void;
  onToggleSave?: (agentId: string) => void;
  onDeleteAgent?: (agentId: string, reason?: string) => void;
  onRequestDeleteWithReason?: (agent: VerifiedAgent) => void;
  onShowToast: (msg: string) => void;
}

export const AiAgentDetailView: React.FC<AiAgentDetailViewProps> = ({
  agent,
  userRole = 'user',
  onBack,
  onRunAgent,
  onToggleLike,
  onToggleSave,
  onDeleteAgent,
  onRequestDeleteWithReason,
  onShowToast
}) => {
  const [activeTab, setActiveTab] = useState<'intro' | 'guide' | 'analytics' | 'changelog' | 'comments'>('intro');
  const [commentInput, setCommentInput] = useState('');
  const [commentsList, setCommentsList] = useState([
    {
      id: 'c-1',
      author: '김민수',
      department: '경영기획실',
      content: '주요 리스크 항목 분석 정확도가 뛰어나 입찰 심의 회의 준비 시간이 반 이상 줄었습니다. 추천합니다!',
      createdAt: '2026.09.09 15:20',
      likes: 8
    },
    {
      id: 'c-2',
      author: '박지현',
      department: '공공컨설팅팀',
      content: '지자체 과업지시서의 까다로운 보안 상주 조항까지 정확히 잡아주네요. 아주 유용합니다.',
      createdAt: '2026.09.08 11:40',
      likes: 5
    }
  ]);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  const isAuthor = agent.author === '정소담';

  const handleDelete = () => {
    if (isAuthor) {
      if (confirm(`'${agent.name}' Agent를 삭제하시겠습니까?\n삭제된 내용은 복구할 수 없습니다.`)) {
        onDeleteAgent?.(agent.id);
        onBack();
      }
    } else {
      onRequestDeleteWithReason?.(agent);
      onBack();
    }
  };

  const handleAddComment = () => {
    if (!commentInput.trim()) return;
    const newComment = {
      id: `c-${Date.now()}`,
      author: '정소담',
      department: 'AI전략팀 (나)',
      content: commentInput.trim(),
      createdAt: '방금 전',
      likes: 0
    };
    setCommentsList([newComment, ...commentsList]);
    setCommentInput('');
    onShowToast('댓글이 등록되었습니다.');
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(agent.systemPromptSample);
    setCopiedPrompt(true);
    onShowToast('프롬프트 샘플이 클립보드에 복사되었습니다.');
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div id="ai-agent-detail-view" className="flex-1 flex flex-col h-full bg-[#F8F9FA] overflow-y-auto">
      {/* ─────────────────────────────────────────────────────────────
          1. Top Navigation Bar (Sticky with Back Button & Direct Actions)
          ───────────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-20 shrink-0 shadow-2xs">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-bold transition-all cursor-pointer shadow-2xs hover:border-neutral-400 shrink-0"
            >
              <ArrowLeft className="w-4 h-4 text-neutral-500" />
              <span>AI Agent 목록</span>
            </button>
            <div className="h-4 w-px bg-neutral-200 hidden sm:block" />
            <nav className="hidden sm:flex items-center gap-1.5 text-xs text-neutral-500 truncate">
              <span>AI Agent</span>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
              <span className="font-medium text-neutral-600 truncate">{agent.category}</span>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
              <span className="font-bold text-neutral-900 truncate">{agent.name}</span>
            </nav>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Save (Bookmark) */}
            {onToggleSave && (
              <button
                type="button"
                id={`agent-detail-save-btn-${agent.id}`}
                onClick={() => onToggleSave(agent.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  agent.isSaved
                    ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold shadow-2xs'
                    : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                }`}
                title={agent.isSaved ? '보관함에서 제거' : '내 보관함에 저장'}
              >
                <Bookmark className={`w-3.5 h-3.5 ${agent.isSaved ? 'fill-amber-500 text-amber-500' : 'text-neutral-400'}`} />
                <span className="hidden sm:inline">{agent.isSaved ? '보관됨' : '보관'}</span>
              </button>
            )}

            {/* Like */}
            <button
              type="button"
              onClick={() => onToggleLike(agent.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                agent.userLiked
                  ? 'bg-red-50 border-red-200 text-[#E60012] font-bold shadow-2xs'
                  : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-50'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${agent.userLiked ? 'fill-current text-[#E60012]' : 'text-neutral-400'}`} />
              <span>{agent.likes}</span>
            </button>

            {/* Delete button for author/admin */}
            {(isAuthor || userRole === 'admin') && (
              <button
                type="button"
                id={`agent-detail-delete-btn-${agent.id}`}
                onClick={handleDelete}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 transition-colors cursor-pointer text-xs font-semibold"
                title={isAuthor ? '내 Agent 삭제' : '관리자 권한 삭제'}
              >
                <Trash2 className="w-3.5 h-3.5 text-red-600" />
                <span className="hidden md:inline">{isAuthor ? 'Agent 삭제' : '삭제'}</span>
              </button>
            )}

            {/* Main CTA: Agent Run Button */}
            <button
              type="button"
              id="agent-detail-run-cta-btn"
              onClick={() => onRunAgent(agent)}
              className="flex items-center gap-2 px-4.5 py-1.5 rounded-xl bg-[#E60012] hover:bg-[#CC0010] text-white font-bold text-xs shadow-xs transition-all cursor-pointer hover:shadow-md active:scale-98"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Agent 사용하기</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. Main Body Container
          ───────────────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-6 sm:px-8 py-6 w-full flex-1 space-y-6">
        {/* Hero Banner Header */}
        <div className="relative bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-neutral-800 overflow-hidden">
          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#E60012]/15 rounded-full blur-3xl pointer-events-none" />

          {/* Badges */}
          <div className="flex items-center flex-wrap gap-2 mb-3 relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E60012] text-white text-xs font-bold shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>검수 완료 (공식 Agent)</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white/90 text-xs font-mono font-semibold border border-white/20">
              {agent.version}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-neutral-200 text-xs font-medium border border-white/10">
              {agent.category}
            </span>
          </div>

          {/* Title & Description */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 tracking-tight relative z-10">
            {agent.name}
          </h1>
          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-3xl mb-5 relative z-10">
            {agent.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-1.5 mb-6 relative z-10">
            {agent.tags.map((t, idx) => (
              <span key={idx} className="px-2.5 py-0.5 rounded-full bg-white/10 text-neutral-200 text-xs font-medium">
                #{t}
              </span>
            ))}
          </div>

          {/* Author & Stats Footer */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-5 border-t border-white/10 text-xs relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-white border border-white/30 text-sm">
                {agent.author.slice(0, 1)}
              </div>
              <div>
                <div className="font-bold text-white text-sm">
                  {agent.author} <span className="text-neutral-400 font-normal text-xs">· {agent.department}</span>
                </div>
                <div className="text-neutral-400 text-xs">
                  최초 등록일 {agent.createdAt} · 최근 업데이트 {agent.updatedAt}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-neutral-200">
                <TrendingUp className="w-4 h-4 text-[#E60012]" />
                <span className="font-bold font-mono">{agent.executionCount.toLocaleString()}회</span>
                <span className="text-neutral-400 text-[11px]">실행</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-neutral-200">
                <Heart className="w-4 h-4 text-red-400 fill-red-400" />
                <span className="font-bold font-mono">{agent.likes}개</span>
                <span className="text-neutral-400 text-[11px]">추천</span>
              </div>
            </div>
          </div>
        </div>

        {/* ─────────────────────────────────────────────────────────────
            3. Tab Navigation & Content
            ───────────────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden">
          {/* Tab Headers */}
          <div className="flex items-center border-b border-neutral-200 px-6 bg-neutral-50/70 overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveTab('intro')}
              className={`px-5 py-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'intro'
                  ? 'border-[#E60012] text-[#E60012]'
                  : 'border-transparent text-neutral-500 hover:text-neutral-800'
              }`}
            >
              Agent 소개
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('guide')}
              className={`px-5 py-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'guide'
                  ? 'border-[#E60012] text-[#E60012]'
                  : 'border-transparent text-neutral-500 hover:text-neutral-800'
              }`}
            >
              사용 방법 & 샘플
            </button>
            <button
              type="button"
              id="agent-tab-analytics-btn"
              onClick={() => setActiveTab('analytics')}
              className={`px-5 py-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'analytics'
                  ? 'border-[#E60012] text-[#E60012]'
                  : 'border-transparent text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <BarChart2 className="w-4 h-4" />
              <span>사용 현황</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('changelog')}
              className={`px-5 py-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'changelog'
                  ? 'border-[#E60012] text-[#E60012]'
                  : 'border-transparent text-neutral-500 hover:text-neutral-800'
              }`}
            >
              업데이트 내역
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('comments')}
              className={`px-5 py-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'comments'
                  ? 'border-[#E60012] text-[#E60012]'
                  : 'border-transparent text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <span>댓글 & 피드백</span>
              <span className="text-xs px-2 py-0.5 bg-neutral-200 text-neutral-800 rounded-full font-mono">
                {commentsList.length}
              </span>
            </button>
          </div>

          {/* Tab Body */}
          <div className="p-6 sm:p-8 space-y-8">
            {activeTab === 'intro' && (
              <div className="space-y-8">
                {/* Screenshots Gallery Preview */}
                {agent.screenshots && agent.screenshots.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
                      실행 화면 스크린샷 미리보기
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {agent.screenshots.map((src, idx) => (
                        <div key={idx} className="relative rounded-2xl overflow-hidden border border-neutral-200 bg-neutral-100 group shadow-2xs aspect-video">
                          <img
                            src={src}
                            alt={`${agent.name} 스크린샷 ${idx + 1}`}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">상세 소개</h3>
                  <p className="text-sm text-neutral-700 leading-relaxed bg-neutral-50 p-5 rounded-2xl border border-neutral-200/80">
                    {agent.longDescription}
                  </p>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">
                    핵심 수행 역량 (Capabilities)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {agent.capabilities.map((cap, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 p-4 rounded-xl border border-neutral-200 bg-white shadow-2xs">
                        <CheckCircle2 className="w-4 h-4 text-[#E60012] shrink-0 mt-0.5" />
                        <span className="text-xs text-neutral-700 font-medium leading-relaxed">{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                    연동 Tool & 프롬프트 요약
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {agent.tools.map((t, idx) => (
                      <span key={idx} className="px-3 py-1.5 rounded-lg bg-neutral-100 text-neutral-800 text-xs font-mono font-medium border border-neutral-200">
                        🛠️ {t}
                      </span>
                    ))}
                  </div>
                  <div className="relative bg-neutral-900 text-neutral-200 p-4 rounded-2xl font-mono text-xs overflow-hidden">
                    <div className="flex items-center justify-between mb-2 text-neutral-400 text-xs">
                      <span>System Prompt Preview</span>
                      <button
                        type="button"
                        onClick={handleCopyPrompt}
                        className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                      >
                        {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedPrompt ? '복사됨' : '프롬프트 복사'}</span>
                      </button>
                    </div>
                    <div className="text-neutral-300 line-clamp-4 leading-relaxed">
                      {agent.systemPromptSample}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'guide' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">권장 입력 형식</h3>
                  <div className="space-y-3">
                    {agent.inputsSample.map((inp, idx) => (
                      <div key={idx} className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
                        <div className="text-xs font-bold text-neutral-800 mb-1.5">{inp.label}</div>
                        <div className="text-xs text-neutral-600 font-mono bg-white p-3 rounded-xl border border-neutral-200">
                          {inp.placeholder}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3">출력 결과 예시</h3>
                  <pre className="p-5 bg-neutral-900 text-emerald-300 rounded-2xl text-xs font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto">
                    {agent.outputSample}
                  </pre>
                </div>
              </div>
            )}

            {/* 사용 현황 (Analytics) */}
            {activeTab === 'analytics' && (
              <div className="space-y-8 animate-in fade-in duration-150">
                {/* 5대 핵심 지표 KPI 카드 */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
                  <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
                    <div className="flex items-center justify-between text-neutral-500 mb-1.5">
                      <span className="text-xs font-medium">총 실행 횟수</span>
                      <TrendingUp className="w-4 h-4 text-[#E60012]" />
                    </div>
                    <div className="text-xl font-extrabold text-neutral-900 font-mono">
                      {agent.executionCount > 100 ? agent.executionCount.toLocaleString() : '1,420'}회
                    </div>
                    <span className="text-xs text-emerald-600 font-medium">전주 대비 +18.4%</span>
                  </div>

                  <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
                    <div className="flex items-center justify-between text-neutral-500 mb-1.5">
                      <span className="text-xs font-medium">실사용자 수</span>
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="text-xl font-extrabold text-neutral-900 font-mono">84명</div>
                    <span className="text-xs text-neutral-400">사내 6개 부서</span>
                  </div>

                  <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
                    <div className="flex items-center justify-between text-neutral-500 mb-1.5">
                      <span className="text-xs font-medium">토큰 사용량</span>
                      <Cpu className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="text-xl font-extrabold text-neutral-900 font-mono">1.28M</div>
                    <span className="text-xs text-neutral-400">건당 평균 901 Token</span>
                  </div>

                  <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
                    <div className="flex items-center justify-between text-neutral-500 mb-1.5">
                      <span className="text-xs font-medium">예상 비용</span>
                      <Coins className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-xl font-extrabold text-neutral-900 font-mono">₩76,800</div>
                    <span className="text-xs text-neutral-400">당월 누적 기준</span>
                  </div>

                  <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 col-span-2 sm:col-span-1">
                    <div className="flex items-center justify-between text-neutral-500 mb-1.5">
                      <span className="text-xs font-medium">평균 응답 속도</span>
                      <Timer className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="text-xl font-extrabold text-neutral-900 font-mono">1.4초</div>
                    <span className="text-xs text-emerald-600 font-medium">99.8% 정상 응답</span>
                  </div>
                </div>

                {/* 사용량 추이 그래프 (최근 7일) */}
                <div className="p-5 bg-white rounded-2xl border border-neutral-200 shadow-2xs">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
                        <BarChart2 className="w-4 h-4 text-[#E60012]" />
                        <span>최근 7일간 일별 실행 추이</span>
                      </h4>
                      <span className="text-xs text-neutral-500">일일 평균 약 203회 실행</span>
                    </div>
                    <span className="text-xs font-mono text-neutral-400">2026.09.07 ~ 09.13</span>
                  </div>

                  <div className="h-40 flex items-end justify-between gap-4 pt-4 px-2 border-b border-neutral-100">
                    {[
                      { day: '09.07', count: 142, height: '52%' },
                      { day: '09.08', count: 188, height: '68%' },
                      { day: '09.09', count: 245, height: '88%' },
                      { day: '09.10', count: 210, height: '76%' },
                      { day: '09.11', count: 275, height: '100%' },
                      { day: '09.12', count: 195, height: '70%' },
                      { day: '오늘', count: 165, height: '60%', active: true }
                    ].map((bar, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                        <span className="text-xs font-mono font-bold text-neutral-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          {bar.count}회
                        </span>
                        <div className="w-full max-w-[44px] bg-neutral-100 rounded-t-lg h-full flex items-end overflow-hidden">
                          <div 
                            className={`w-full rounded-t-lg transition-all group-hover:opacity-90 ${
                              bar.active ? 'bg-[#E60012]' : 'bg-neutral-800'
                            }`}
                            style={{ height: bar.height }}
                          />
                        </div>
                        <span className={`text-xs ${bar.active ? 'font-bold text-[#E60012]' : 'text-neutral-500'}`}>
                          {bar.day}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 팀별 사용 비율 & 최다 활용자 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 팀별 비율 */}
                  <div className="p-5 bg-neutral-50 rounded-2xl border border-neutral-200">
                    <h4 className="text-xs font-bold text-neutral-900 mb-4 uppercase tracking-wider">부서별 사용 점유율</h4>
                    <div className="space-y-3">
                      {[
                        { team: '공공컨설팅본부', pct: 42, color: 'bg-[#E60012]' },
                        { team: '경영기획실', pct: 28, color: 'bg-neutral-800' },
                        { team: 'AI사업본부', pct: 18, color: 'bg-neutral-500' },
                        { team: '자격인증센터 / 기타', pct: 12, color: 'bg-neutral-300' }
                      ].map((item, idx) => (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex justify-between text-xs font-medium">
                            <span className="text-neutral-700">{item.team}</span>
                            <span className="font-bold font-mono text-neutral-900">{item.pct}%</span>
                          </div>
                          <div className="w-full bg-neutral-200 h-2.5 rounded-full overflow-hidden">
                            <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 주요 사용 사용자 TOP 3 */}
                  <div className="p-5 bg-neutral-50 rounded-2xl border border-neutral-200">
                    <h4 className="text-xs font-bold text-neutral-900 mb-4 uppercase tracking-wider">최다 호출 사용자 TOP 3</h4>
                    <div className="space-y-2.5">
                      {[
                        { rank: 1, name: '정소담 선임', dept: 'AI사업본부', calls: 312, tokens: '280K' },
                        { rank: 2, name: '김민수 수석', dept: '경영기획실', calls: 245, tokens: '220K' },
                        { rank: 3, name: '박지현 팀장', dept: '공공컨설팅본부', calls: 198, tokens: '178K' }
                      ].map((top, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-xl border border-neutral-200/80 text-xs">
                          <div className="flex items-center gap-2.5">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                              top.rank === 1 ? 'bg-[#E60012] text-white' : 'bg-neutral-100 text-neutral-700'
                            }`}>
                              {top.rank}
                            </span>
                            <div>
                              <span className="font-bold text-neutral-800">{top.name}</span>
                              <span className="text-xs text-neutral-400 ml-2">{top.dept}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-neutral-800 font-mono">{top.calls}회</span>
                            <span className="text-[11px] text-neutral-400 block">{top.tokens} Token</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'changelog' && (
              <div className="space-y-6">
                <div className="border-l-2 border-[#E60012] pl-5 space-y-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-bold text-neutral-900 text-base">{agent.version} (최신 공식 배포)</span>
                      <span className="text-xs text-neutral-400">{agent.updatedAt}</span>
                    </div>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      - KPC 2026 규정 및 보안성 심의 100% 반영<br />
                      - 비정형 표 서식 구조화 속도 개선 및 오류 예외 처리 강화
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-bold text-neutral-700 text-base">v1.0 (사내 정식 배포)</span>
                      <span className="text-xs text-neutral-400">2026.08.15</span>
                    </div>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      - AI Community 검수 추천 및 관리자 심사 통과 후 정식 등록
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'comments' && (
              <div className="space-y-6">
                {/* 댓글 작성창 */}
                <div className="flex gap-2.5">
                  <input
                    type="text"
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                    placeholder="Agent 사용 후기나 개선 의견을 남겨주세요..."
                    className="flex-1 px-4 py-3 rounded-xl border border-neutral-300 text-xs focus:outline-hidden focus:border-[#E60012] bg-neutral-50 focus:bg-white transition-colors"
                  />
                  <button
                    type="button"
                    onClick={handleAddComment}
                    className="px-5 py-3 rounded-xl bg-[#E60012] hover:bg-[#CC0010] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>등록</span>
                  </button>
                </div>

                {/* 댓글 목록 */}
                <div className="space-y-3.5">
                  {commentsList.map((comm) => (
                    <div key={comm.id} className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/80">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xs font-bold">
                            {comm.author.slice(0, 1)}
                          </div>
                          <span className="text-xs font-bold text-neutral-900">{comm.author}</span>
                          <span className="text-xs text-neutral-500">· {comm.department}</span>
                        </div>
                        <span className="text-xs text-neutral-400">{comm.createdAt}</span>
                      </div>
                      <p className="text-xs text-neutral-700 pl-9 leading-relaxed">
                        {comm.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Bar: Back & Execute Actions */}
          <div className="p-5 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-700 text-xs font-bold transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-neutral-500" />
              <span>목록으로 돌아가기</span>
            </button>
            <button
              type="button"
              onClick={() => onRunAgent(agent)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#E60012] hover:bg-[#CC0010] text-white text-xs font-bold shadow-xs transition-all cursor-pointer hover:shadow-md"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Agent 즉시 사용하기</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
