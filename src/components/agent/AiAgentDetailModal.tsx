import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Play, 
  Heart, 
  MessageSquare, 
  Share2, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  Terminal, 
  Copy, 
  Check, 
  Send,
  User,
  ChevronRight,
  TrendingUp,
  FileText,
  HelpCircle,
  History,
  BarChart2,
  Users,
  Cpu,
  Coins,
  Timer,
  Bookmark,
  Trash2
} from 'lucide-react';
import { VerifiedAgent, UserRole } from '../../types';

interface AiAgentDetailModalProps {
  agent: VerifiedAgent | null;
  userRole?: UserRole;
  onClose: () => void;
  onRunAgent: (agent: VerifiedAgent) => void;
  onToggleLike: (agentId: string) => void;
  onToggleSave?: (agentId: string) => void;
  onDeleteAgent?: (agentId: string, reason?: string) => void;
  onRequestDeleteWithReason?: (agent: VerifiedAgent) => void;
  onShowToast: (msg: string) => void;
}

export const AiAgentDetailModal: React.FC<AiAgentDetailModalProps> = ({
  agent,
  userRole = 'user',
  onClose,
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

  if (!agent) return null;

  const isAuthor = agent.author === '정소담';

  const handleDelete = () => {
    if (isAuthor) {
      if (confirm(`'${agent.name}' Agent를 삭제하시겠습니까?\n삭제된 내용은 복구할 수 없습니다.`)) {
        onDeleteAgent?.(agent.id);
        onClose();
      }
    } else {
      onRequestDeleteWithReason?.(agent);
      onClose();
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="ai-agent-detail-modal"
        className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-neutral-200 flex flex-col overflow-hidden"
      >
        {/* 모달 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-neutral-100 text-neutral-500 hover:text-neutral-800 transition-colors cursor-pointer shadow-2xs"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 상단 Hero 영역 */}
        <div className="relative bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 text-white p-6 sm:p-7 shrink-0 overflow-hidden">
          {/* Subtle glow decorative background */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

          {/* 상단 뱃지 라인 */}
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E60012] text-white text-xs font-bold shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>검수 완료</span>
            </span>

            <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white/90 text-xs font-mono font-semibold border border-white/20">
              {agent.version}
            </span>

            <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-neutral-300 text-xs font-medium">
              {agent.category}
            </span>
          </div>

          {/* 제목 & 설명 */}
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
            {agent.name}
          </h2>
          <p className="text-sm text-neutral-300 leading-relaxed max-w-2xl mb-4">
            {agent.description}
          </p>

          {/* 태그 목록 */}
          <div className="flex flex-wrap items-center gap-1.5 mb-5">
            {agent.tags.map((t, idx) => (
              <span key={idx} className="px-2.5 py-0.5 rounded-full bg-white/10 text-neutral-200 text-xs font-medium">
                #{t}
              </span>
            ))}
          </div>

          {/* 작성자 정보 및 통계 바 */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-white border border-white/30">
                {agent.author.slice(0, 1)}
              </div>
              <div>
                <div className="font-semibold text-white">{agent.author} <span className="text-neutral-400 font-normal">·</span> {agent.department}</div>
                <div className="text-neutral-400 text-[11px]">등록일 {agent.createdAt} (최근 업데이트 {agent.updatedAt})</div>
              </div>
            </div>

            {/* 통계 & CTA 버튼 */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* 내 Agent 또는 관리자 전용 삭제 버튼 */}
              {(isAuthor || userRole === 'admin') && (
                <button
                  type="button"
                  id={`detail-delete-btn-${agent.id}`}
                  onClick={handleDelete}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 border border-red-500/40 text-red-300 hover:text-red-200 transition-colors cursor-pointer text-xs font-semibold"
                  title={isAuthor ? '내 Agent 삭제' : '관리자 권한 삭제'}
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  <span>{isAuthor ? 'Agent 삭제' : '삭제'}</span>
                </button>
              )}

              {onToggleSave && (
                <button
                  type="button"
                  id={`detail-agent-bookmark-btn-${agent.id}`}
                  onClick={() => onToggleSave(agent.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                    agent.isSaved
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-semibold'
                      : 'bg-white/10 border-white/20 text-neutral-300 hover:bg-white/20'
                  }`}
                  title={agent.isSaved ? '저장 취소' : '내 보관함에 저장'}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${agent.isSaved ? 'fill-amber-400 text-amber-400' : ''}`} />
                  <span>{agent.isSaved ? '저장됨' : '저장'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => onToggleLike(agent.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                  agent.userLiked
                    ? 'bg-red-500/20 border-red-500/50 text-red-300'
                    : 'bg-white/10 border-white/20 text-neutral-300 hover:bg-white/20'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${agent.userLiked ? 'fill-red-400 text-red-400' : ''}`} />
                <span>좋아요 {agent.likes}</span>
              </button>

              <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 border border-white/20 text-neutral-300">
                <TrendingUp className="w-3.5 h-3.5 text-[#E60012]" />
                <span>실행 {agent.executionCount.toLocaleString()}회</span>
              </div>

              {/* 주요 CTA 버튼: [Agent 사용하기] */}
              <button
                type="button"
                onClick={() => onRunAgent(agent)}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#E60012] hover:bg-[#CC0010] text-white font-bold text-sm shadow-md transition-all cursor-pointer hover:shadow-lg active:scale-98"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Agent 사용하기</span>
              </button>
            </div>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex items-center border-b border-neutral-200 px-6 bg-neutral-50 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('intro')}
            className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
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
            className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
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
            className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
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
            className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer ${
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
            className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'comments'
                ? 'border-[#E60012] text-[#E60012]'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <span>댓글 & 피드백</span>
            <span className="text-xs px-1.5 py-0.2 bg-neutral-200 rounded-full font-mono">
              {commentsList.length}
            </span>
          </button>
        </div>

        {/* 탭 본문 영역 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'intro' && (
            <div className="space-y-6">
              {/* Screenshots Gallery Preview */}
              {agent.screenshots && agent.screenshots.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2.5">실행 화면 스크린샷</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {agent.screenshots.map((src, idx) => (
                      <div key={idx} className="relative rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100 group shadow-2xs aspect-video">
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
                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">상세 소개</h4>
                <p className="text-sm text-neutral-700 leading-relaxed bg-neutral-50 p-4 rounded-xl border border-neutral-200/80">
                  {agent.longDescription}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2.5">핵심 수행 역량 (Capabilities)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {agent.capabilities.map((cap, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-3 rounded-lg border border-neutral-200 bg-white">
                      <CheckCircle2 className="w-4 h-4 text-[#E60012] shrink-0 mt-0.5" />
                      <span className="text-xs text-neutral-700 font-medium">{cap}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">연동 Tool & 프롬프트 요약</h4>
                <div className="flex flex-wrap gap-2 mb-3">
                  {agent.tools.map((t, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-800 text-xs font-mono font-medium border border-neutral-200">
                      🛠️ {t}
                    </span>
                  ))}
                </div>
                <div className="relative bg-neutral-900 text-neutral-200 p-3.5 rounded-xl font-mono text-xs overflow-hidden">
                  <div className="flex items-center justify-between mb-1.5 text-neutral-400 text-[11px]">
                    <span>System Prompt Preview</span>
                    <button
                      type="button"
                      onClick={handleCopyPrompt}
                      className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
                    >
                      {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedPrompt ? '복사됨' : '복사'}</span>
                    </button>
                  </div>
                  <div className="text-neutral-300 line-clamp-3">
                    {agent.systemPromptSample}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">권장 입력 형식</h4>
                <div className="space-y-2">
                  {agent.inputsSample.map((inp, idx) => (
                    <div key={idx} className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                      <div className="text-xs font-bold text-neutral-800 mb-1">{inp.label}</div>
                      <div className="text-xs text-neutral-500 font-mono">{inp.placeholder}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">출력 결과 예시</h4>
                <pre className="p-4 bg-neutral-900 text-emerald-300 rounded-xl text-xs font-mono whitespace-pre-wrap leading-relaxed overflow-x-auto">
                  {agent.outputSample}
                </pre>
              </div>
            </div>
          )}

          {/* 사용 현황 (Analytics) */}
          {activeTab === 'analytics' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* 5대 핵심 지표 KPI 카드 */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
                  <div className="flex items-center justify-between text-neutral-500 mb-1.5">
                    <span className="text-[11px] font-medium">총 실행 횟수</span>
                    <TrendingUp className="w-3.5 h-3.5 text-[#E60012]" />
                  </div>
                  <div className="text-lg font-extrabold text-neutral-900 font-mono">
                    {agent.executionCount > 100 ? agent.executionCount.toLocaleString() : '1,420'}회
                  </div>
                  <span className="text-[10px] text-emerald-600 font-medium">전주 대비 +18.4%</span>
                </div>

                <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
                  <div className="flex items-center justify-between text-neutral-500 mb-1.5">
                    <span className="text-[11px] font-medium">실사용자 수</span>
                    <Users className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <div className="text-lg font-extrabold text-neutral-900 font-mono">84명</div>
                  <span className="text-[10px] text-neutral-400">사내 6개 부서</span>
                </div>

                <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
                  <div className="flex items-center justify-between text-neutral-500 mb-1.5">
                    <span className="text-[11px] font-medium">토큰 사용량 (Token)</span>
                    <Cpu className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <div className="text-lg font-extrabold text-neutral-900 font-mono">1.28M</div>
                  <span className="text-[10px] text-neutral-400">건당 평균 901 Token</span>
                </div>

                <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
                  <div className="flex items-center justify-between text-neutral-500 mb-1.5">
                    <span className="text-[11px] font-medium">예상 비용</span>
                    <Coins className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <div className="text-lg font-extrabold text-neutral-900 font-mono">₩76,800</div>
                  <span className="text-[10px] text-neutral-400">당월 누적 기준</span>
                </div>

                <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 col-span-2 sm:col-span-1">
                  <div className="flex items-center justify-between text-neutral-500 mb-1.5">
                    <span className="text-[11px] font-medium">평균 응답 속도</span>
                    <Timer className="w-3.5 h-3.5 text-purple-600" />
                  </div>
                  <div className="text-lg font-extrabold text-neutral-900 font-mono">1.4초</div>
                  <span className="text-[10px] text-emerald-600 font-medium">99.8% 정상 응답</span>
                </div>
              </div>

              {/* 사용량 추이 그래프 (최근 7일) */}
              <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-2xs">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                      <BarChart2 className="w-4 h-4 text-[#E60012]" />
                      <span>최근 7일간 일별 실행 추이</span>
                    </h4>
                    <span className="text-[11px] text-neutral-500">일일 평균 약 203회 실행</span>
                  </div>
                  <span className="text-[11px] font-mono text-neutral-400">2026.09.07 ~ 09.13</span>
                </div>

                <div className="h-32 flex items-end justify-between gap-3 pt-4 px-2 border-b border-neutral-100">
                  {[
                    { day: '09.07', count: 142, height: '52%' },
                    { day: '09.08', count: 188, height: '68%' },
                    { day: '09.09', count: 245, height: '88%' },
                    { day: '09.10', count: 210, height: '76%' },
                    { day: '09.11', count: 275, height: '100%' },
                    { day: '09.12', count: 195, height: '70%' },
                    { day: '오늘', count: 165, height: '60%', active: true }
                  ].map((bar, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group h-full justify-end">
                      <span className="text-[10px] font-mono font-bold text-neutral-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        {bar.count}회
                      </span>
                      <div className="w-full max-w-[36px] bg-neutral-100 rounded-t-md h-full flex items-end overflow-hidden">
                        <div 
                          className={`w-full rounded-t-md transition-all group-hover:opacity-90 ${
                            bar.active ? 'bg-[#E60012]' : 'bg-neutral-800'
                          }`}
                          style={{ height: bar.height }}
                        />
                      </div>
                      <span className={`text-[10px] ${bar.active ? 'font-bold text-[#E60012]' : 'text-neutral-500'}`}>
                        {bar.day}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 팀별 사용 비율 & 최다 활용자 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 팀별 비율 */}
                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                  <h4 className="text-xs font-bold text-neutral-900 mb-3">부서별 사용 점유율</h4>
                  <div className="space-y-2.5">
                    {[
                      { team: '공공컨설팅본부', pct: 42, color: 'bg-[#E60012]' },
                      { team: '경영기획실', pct: 28, color: 'bg-neutral-800' },
                      { team: 'AI사업본부', pct: 18, color: 'bg-neutral-500' },
                      { team: '자격인증센터 / 기타', pct: 12, color: 'bg-neutral-300' }
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-neutral-700">{item.team}</span>
                          <span className="font-bold font-mono text-neutral-900">{item.pct}%</span>
                        </div>
                        <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
                          <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 주요 사용 사용자 TOP 3 */}
                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                  <h4 className="text-xs font-bold text-neutral-900 mb-3">최다 호출 사용자 TOP 3</h4>
                  <div className="space-y-2">
                    {[
                      { rank: 1, name: '정소담 선임', dept: 'AI사업본부', calls: 312, tokens: '280K' },
                      { rank: 2, name: '김민수 수석', dept: '경영기획실', calls: 245, tokens: '220K' },
                      { rank: 3, name: '박지현 팀장', dept: '공공컨설팅본부', calls: 198, tokens: '178K' }
                    ].map((top, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-white rounded-lg border border-neutral-200/80 text-xs">
                        <div className="flex items-center gap-2">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                            top.rank === 1 ? 'bg-[#E60012] text-white' : 'bg-neutral-100 text-neutral-700'
                          }`}>
                            {top.rank}
                          </span>
                          <div>
                            <span className="font-bold text-neutral-800">{top.name}</span>
                            <span className="text-[11px] text-neutral-400 ml-1.5">{top.dept}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-neutral-800 font-mono">{top.calls}회</span>
                          <span className="text-[10px] text-neutral-400 block">{top.tokens} Token</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'changelog' && (
            <div className="space-y-4">
              <div className="border-l-2 border-[#E60012] pl-4 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-neutral-900 text-sm">{agent.version} (최신 공식 배포)</span>
                    <span className="text-xs text-neutral-400">{agent.updatedAt}</span>
                  </div>
                  <p className="text-xs text-neutral-600">
                    - KPC 2026 규정 및 보안성 심의 100% 반영<br />
                    - 비정형 표 서식 구조화 속도 개선 및 오류 예외 처리 강화
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-neutral-700 text-sm">v1.0 (사내 정식 배포)</span>
                    <span className="text-xs text-neutral-400">2026.08.15</span>
                  </div>
                  <p className="text-xs text-neutral-600">
                    - AI Community 검수 추천 및 관리자 심사 통과 후 정식 등록
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="space-y-5">
              {/* 댓글 작성창 */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                  placeholder="Agent 사용 후기나 개선 의견을 남겨주세요..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-[#E60012]"
                />
                <button
                  type="button"
                  onClick={handleAddComment}
                  className="px-4 py-2.5 rounded-xl bg-[#E60012] hover:bg-[#CC0010] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>등록</span>
                </button>
              </div>

              {/* 댓글 목록 */}
              <div className="space-y-3">
                {commentsList.map((comm) => (
                  <div key={comm.id} className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/80">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center text-[11px] font-bold text-neutral-700">
                          {comm.author.slice(0, 1)}
                        </div>
                        <span className="text-xs font-bold text-neutral-900">{comm.author}</span>
                        <span className="text-xs text-neutral-500">· {comm.department}</span>
                      </div>
                      <span className="text-[11px] text-neutral-400">{comm.createdAt}</span>
                    </div>
                    <p className="text-xs text-neutral-700 pl-8 leading-relaxed">
                      {comm.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 모달 하단 닫기 & 사용 바 */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-700 text-xs font-semibold transition-colors cursor-pointer"
          >
            닫기
          </button>
          <button
            type="button"
            onClick={() => onRunAgent(agent)}
            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-[#E60012] hover:bg-[#CC0010] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>사용해보기</span>
          </button>
        </div>
      </div>
    </div>
  );
};
