import React, { useState, useRef, useEffect } from 'react';
import { 
  Heart, 
  MessageSquare, 
  CheckCircle2, 
  Calendar,
  Sparkles, 
  Search, 
  Users, 
  FileText, 
  FileCheck, 
  Eye, 
  MoreVertical, 
  PauseCircle, 
  PlayCircle, 
  Trash2, 
  Bot, 
  Play, 
  Bookmark, 
  EyeOff, 
  ShieldCheck, 
  TrendingUp,
  Layout,
  BarChart2,
  Zap,
  BrainCircuit,
  Wand2
} from 'lucide-react';
import { VerifiedAgent, UserRole } from '../../types';

interface AiAgentCardProps {
  agent: VerifiedAgent;
  userRole?: UserRole;
  onSelectDetail: (agent: VerifiedAgent) => void;
  onRunAgent: (agent: VerifiedAgent) => void;
  onToggleLike: (agentId: string) => void;
  onToggleSave?: (agentId: string) => void;
  onToggleStatus?: (agentId: string, newStatus: '전사 배포' | '부서 한정' | '정기 검수 중' | '일시중단') => void;
  onToggleHide?: (agentId: string) => void;
  onDeleteAgent?: (agentId: string, reason?: string) => void;
  onRequestDeleteWithReason?: (agent: VerifiedAgent) => void;
}

export const AiAgentCard: React.FC<AiAgentCardProps> = ({
  agent,
  userRole = 'user',
  onSelectDetail,
  onRunAgent,
  onToggleLike,
  onToggleSave,
  onToggleStatus,
  onToggleHide,
  onDeleteAgent,
  onRequestDeleteWithReason
}) => {
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const adminMenuRef = useRef<HTMLDivElement>(null);

  // Close admin menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (adminMenuRef.current && !adminMenuRef.current.contains(e.target as Node)) {
        setShowAdminMenu(false);
      }
    };
    if (showAdminMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAdminMenu]);

  // Category Theme Icon Helper
  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'RFP·제안':
        return <FileCheck className="w-4 h-4 text-red-500" />;
      case '회의·요약':
        return <Users className="w-4 h-4 text-amber-500" />;
      case '검색·분석':
        return <Search className="w-4 h-4 text-blue-500" />;
      case '문서작성':
        return <FileText className="w-4 h-4 text-emerald-500" />;
      case '교육':
        return <Sparkles className="w-4 h-4 text-purple-500" />;
      default:
        return <Bot className="w-4 h-4 text-[#E60012]" />;
    }
  };

  const isAuthor = agent.author === '정소담';
  const isSuspended = agent.status === '일시중단';
  const previewImage = agent.screenshots?.[0] || agent.mainImageUrl || agent.thumbnailUrl;

  return (
    <div
      id={`ai-agent-card-${agent.id}`}
      onClick={() => onSelectDetail(agent)}
      className={`group bg-white rounded-2xl border border-neutral-200/80 hover:border-neutral-400 hover:shadow-xl transition-all duration-200 flex flex-col overflow-hidden cursor-pointer relative ${
        showAdminMenu ? 'z-30' : 'z-0'
      } ${agent.isHidden ? 'opacity-60 bg-neutral-50/80' : ''}`}
    >
      {/* ─────────────────────────────────────────────────────────────
          Top Banner Image or Solid Color Format (AI 커뮤니티와 100% 동일 포맷)
          ───────────────────────────────────────────────────────────── */}
      <div className="relative w-full h-40 bg-neutral-100 shrink-0 border-b border-neutral-100">
        <div className="w-full h-full overflow-hidden">
          {previewImage ? (
            <img
              src={previewImage}
              alt={agent.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-100 text-neutral-400 group-hover:bg-neutral-200/60 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-2xs border border-neutral-200/80 flex items-center justify-center text-neutral-500 group-hover:scale-110 group-hover:text-[#E60012] transition-all duration-300">
                {getCategoryIcon(agent.category)}
              </div>
              <span className="mt-2 text-[11px] font-semibold text-neutral-500">
                {agent.category || 'AI Agent'}
              </span>
            </div>
          )}
        </div>

        {/* Top-Left Status Badge */}
        {(isSuspended || agent.isHidden) && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
            {isSuspended && (
              <span className="px-2 py-1 rounded-lg bg-amber-500 text-white text-[10px] font-bold shadow-xs">
                일시중단
              </span>
            )}
            {agent.isHidden && (
              <span className="px-2 py-1 rounded-lg bg-neutral-900 text-white text-[10px] font-bold shadow-xs">
                숨김
              </span>
            )}
          </div>
        )}

        {/* Top-Right Controls: Bookmark, Admin Menu (⋮) */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20">
          {/* Bookmark Button */}
          {onToggleSave && (
            <button
              type="button"
              id={`agent-bookmark-btn-${agent.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave(agent.id);
              }}
              className={`w-7 h-7 rounded-lg bg-white/95 hover:bg-white flex items-center justify-center border border-neutral-200/80 shadow-xs transition-colors cursor-pointer ${
                agent.isSaved ? 'text-amber-500 font-bold' : 'text-neutral-400 hover:text-neutral-700'
              }`}
              title={agent.isSaved ? '저장 취소' : '내 보관함에 저장'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${agent.isSaved ? 'fill-amber-500' : ''}`} />
            </button>
          )}

          {/* Admin / Author More Menu (⋮) */}
          {(userRole === 'admin' || isAuthor) && (
            <div className="relative" ref={adminMenuRef}>
              <button
                type="button"
                id={`agent-admin-menu-btn-${agent.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAdminMenu(!showAdminMenu);
                }}
                className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all cursor-pointer shadow-xs ${
                  showAdminMenu
                    ? 'bg-neutral-900 text-white border-neutral-900'
                    : 'bg-white/95 text-neutral-600 border-neutral-200/80 hover:bg-white hover:text-neutral-900'
                }`}
                title={userRole === 'admin' ? "관리자 설정" : "내 Agent 설정"}
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </button>

              {/* Dropdown Menu */}
              {showAdminMenu && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-full mt-1.5 w-44 bg-white rounded-xl shadow-2xl border border-neutral-200 py-1 z-50 text-xs animate-in fade-in zoom-in-95 duration-100 text-left"
                >
                  <div className="px-3 py-1.5 text-[10px] font-bold text-neutral-400 uppercase tracking-wider border-b border-neutral-100">
                    {userRole === 'admin' ? '관리자 권한 설정' : '내 Agent 관리'}
                  </div>

                  {/* 1. Suspend / Resume (Admin only) */}
                  {userRole === 'admin' && (
                    isSuspended ? (
                      <button
                        type="button"
                        onClick={() => {
                          setShowAdminMenu(false);
                          onToggleStatus?.(agent.id, '전사 배포');
                        }}
                        className="w-full px-3 py-2 text-xs text-emerald-700 hover:bg-emerald-50 flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <PlayCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>운영 재개</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setShowAdminMenu(false);
                          onToggleStatus?.(agent.id, '일시중단');
                        }}
                        className="w-full px-3 py-2 text-xs text-amber-700 hover:bg-amber-50 flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <PauseCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>중지</span>
                      </button>
                    )
                  )}

                  {/* 2. Hide / Unhide (Admin only) */}
                  {userRole === 'admin' && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowAdminMenu(false);
                        onToggleHide?.(agent.id);
                      }}
                      className="w-full px-3 py-2 text-xs text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      {agent.isHidden ? (
                        <>
                          <Eye className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                          <span>숨김 해제</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                          <span>숨기기</span>
                        </>
                      )}
                    </button>
                  )}

                  {/* 3. Delete */}
                  <button
                    type="button"
                    onClick={() => {
                      setShowAdminMenu(false);
                      if (isAuthor) {
                        if (confirm(`'${agent.name}' Agent를 삭제하시겠습니까?\n삭제된 내용은 복구할 수 없습니다.`)) {
                          onDeleteAgent?.(agent.id);
                        }
                      } else {
                        onRequestDeleteWithReason?.(agent);
                      }
                    }}
                    className={`w-full px-3 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer transition-colors ${
                      userRole === 'admin' ? 'border-t border-neutral-100' : ''
                    }`}
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <span>{isAuthor ? '내 Agent 삭제' : '삭제'}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          Card Content: AI 커뮤니티 카드와 동일한 타이포그래피 & 레이아웃
          ───────────────────────────────────────────────────────────── */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3.5">
        <div className="space-y-2.5">
          {/* 1. Title & Icon at the Top */}
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-neutral-900 text-white flex items-center justify-center shrink-0 shadow-2xs overflow-hidden mt-0.5">
              {agent.icon && (agent.icon.startsWith('data:image') || agent.icon.startsWith('http') || agent.icon.startsWith('/')) ? (
                <img src={agent.icon} alt={agent.name} className="w-full h-full object-cover" />
              ) : (
                <Bot className="w-4 h-4 text-[#E60012]" />
              )}
            </div>
            <h3 className="text-base font-bold text-neutral-900 line-clamp-2 group-hover:text-[#E60012] transition-colors leading-snug h-[44px] flex items-center">
              {agent.name}
            </h3>
          </div>

          {/* 2. Description */}
          <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed h-[36px]">
            {agent.oneLineDesc || agent.description}
          </p>
        </div>

        {/* 3. Badges, Status & Update Date (Moved BELOW title & description) */}
        <div className="space-y-2 pt-1 border-t border-neutral-100">
          {/* Badges Row */}
          <div className="flex items-center flex-wrap gap-1.5 text-[11px] min-h-[22px]">
            {/* Dev Type Badge */}
            <span className="px-2 py-0.5 rounded-md font-bold flex items-center gap-1 bg-neutral-100 text-neutral-900 border border-neutral-200">
              <Bot className="w-3 h-3 text-[#E60012]" />
              <span>AI Agent</span>
            </span>

            {/* Version */}
            <span className="px-1.5 py-0.5 rounded-md font-mono font-bold bg-neutral-100 text-neutral-700 text-[10px] border border-neutral-200">
              {agent.version}
            </span>

            {/* Status */}
            {isSuspended ? (
              <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                <PauseCircle className="w-3 h-3 text-amber-600" />
                <span>일시중단</span>
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>{agent.status || '전사 배포'}</span>
              </span>
            )}
          </div>

          {/* Update Date & Tags Row */}
          <div className="flex items-center justify-between text-[11px] text-neutral-500 min-h-[22px]">
            <span className="flex items-center gap-1 text-[11px] text-neutral-500 font-medium shrink-0">
              <Calendar className="w-3 h-3 text-neutral-400" />
              <span>최근 업데이트: {agent.updatedAt}</span>
            </span>

            {/* Tags */}
            <div className="flex items-center gap-1 shrink-0">
              {agent.tags.slice(0, 2).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-1.5 py-0.2 rounded bg-neutral-50 text-neutral-500 text-[10px] whitespace-nowrap"
                >
                  #{tag}
                </span>
              ))}
              {agent.tags.length > 2 && (
                <span className="text-[10px] text-neutral-400 whitespace-nowrap">
                  +{agent.tags.length - 2}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 4. Footer: Author & Metrics + Action Button */}
        <div className="pt-2.5 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-[10px]">
              {agent.author.slice(0, 1)}
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-neutral-800 text-[11px]">{agent.author}</span>
              <span className="text-[9px] text-neutral-400">{agent.department}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-[11px]">
            {/* Likes */}
            <button
              type="button"
              id={`agent-like-btn-${agent.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleLike(agent.id);
              }}
              className={`flex items-center gap-1 hover:text-[#E60012] transition-colors cursor-pointer ${
                agent.userLiked ? 'text-[#E60012] font-bold' : ''
              }`}
              title="좋아요"
            >
              <Heart className={`w-3.5 h-3.5 ${agent.userLiked ? 'fill-current' : ''}`} />
              <span>{agent.likes}</span>
            </button>

            {/* Comments */}
            <div className="flex items-center gap-1 text-neutral-500" title="댓글">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{agent.commentsCount || 0}</span>
            </div>

            {/* Usage (사용량) */}
            <div className="flex items-center gap-1 text-neutral-500 font-medium" title="실행 횟수 / 사용량">
              <TrendingUp className="w-3.5 h-3.5 text-neutral-400" />
              <span>{agent.executionCount.toLocaleString()}</span>
            </div>

            {/* [사용해보기] Action Button */}
            <button
              type="button"
              id={`run-agent-btn-${agent.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onRunAgent(agent);
              }}
              className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#E60012] hover:bg-[#c90010] text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer shrink-0 whitespace-nowrap ml-1"
              title="Agent 대화형 실행"
            >
              <Play className="w-3 h-3 fill-current shrink-0" />
              <span>사용해보기</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
