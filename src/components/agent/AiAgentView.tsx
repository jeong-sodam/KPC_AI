import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ArrowUpDown, 
  CheckCircle2, 
  AlertCircle,
  Bot,
  Sparkles,
  Bookmark
} from 'lucide-react';
import { VerifiedAgent, UserRole } from '../../types';
import { VERIFIED_AGENTS_DATA, AGENT_CATEGORIES, AGENT_SORT_OPTIONS } from '../../data/agentMockData';
import { AiAgentCard } from './AiAgentCard';
import { AiAgentDetailView } from './AiAgentDetailView';
import { AiAgentChatRunner } from './AiAgentChatRunner';
import { DeleteReasonModal } from '../community/DeleteReasonModal';

interface AiAgentViewProps {
  userRole?: UserRole;
  agents?: VerifiedAgent[];
  setAgents?: React.Dispatch<React.SetStateAction<VerifiedAgent[]>>;
  onShowToast: (msg: string) => void;
  onNavigateTab?: (tab: string) => void;
}

export const AiAgentView: React.FC<AiAgentViewProps> = ({
  userRole = 'admin',
  agents: externalAgents,
  setAgents: setExternalAgents,
  onShowToast,
  onNavigateTab
}) => {
  // Agent state (external if passed, internal otherwise)
  const [internalAgents, setInternalAgents] = useState<VerifiedAgent[]>(VERIFIED_AGENTS_DATA);
  const agents = externalAgents || internalAgents;
  const setAgents = setExternalAgents || setInternalAgents;

  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [showOnlySaved, setShowOnlySaved] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOption, setSortOption] = useState<typeof AGENT_SORT_OPTIONS[number]>('최신순');

  // Modals & Runners
  const [selectedDetailAgent, setSelectedDetailAgent] = useState<VerifiedAgent | null>(null);
  const [runningAgent, setRunningAgent] = useState<VerifiedAgent | null>(null);

  // Admin Delete Reason Modal State
  const [deleteModalAgent, setDeleteModalAgent] = useState<VerifiedAgent | null>(null);

  // Toggle Like Handler
  const handleToggleLike = (agentId: string) => {
    setAgents(prev =>
      prev.map(a => {
        if (a.id === agentId) {
          const isLiked = !a.userLiked;
          return {
            ...a,
            likes: isLiked ? a.likes + 1 : a.likes - 1,
            userLiked: isLiked
          };
        }
        return a;
      })
    );

    // Also update detail modal if open
    if (selectedDetailAgent && selectedDetailAgent.id === agentId) {
      setSelectedDetailAgent(prev => {
        if (!prev) return null;
        const isLiked = !prev.userLiked;
        return {
          ...prev,
          likes: isLiked ? prev.likes + 1 : prev.likes - 1,
          userLiked: isLiked
        };
      });
    }

    const target = agents.find(a => a.id === agentId);
    if (target && !target.userLiked) {
      onShowToast(`'${target.name}'에 좋아요를 눌렀습니다.`);
    }
  };

  // Toggle Save (Bookmark) Handler
  const handleToggleSave = (agentId: string) => {
    setAgents(prev =>
      prev.map(a => {
        if (a.id === agentId) {
          const nextSaved = !a.isSaved;
          return {
            ...a,
            isSaved: nextSaved
          };
        }
        return a;
      })
    );

    // Also update detail modal if open
    if (selectedDetailAgent && selectedDetailAgent.id === agentId) {
      setSelectedDetailAgent(prev => {
        if (!prev) return null;
        return {
          ...prev,
          isSaved: !prev.isSaved
        };
      });
    }

    const target = agents.find(a => a.id === agentId);
    if (target) {
      if (!target.isSaved) {
        onShowToast(`'${target.name}'을(를) 내 보관함에 저장했습니다.`);
      } else {
        onShowToast(`'${target.name}' 저장을 취소했습니다.`);
      }
    }
  };

  // Admin Status Handler (일시중단 / 전사 배포)
  const handleToggleStatus = (agentId: string, newStatus: '전사 배포' | '부서 한정' | '정기 검수 중' | '일시중단') => {
    setAgents(prev =>
      prev.map(a => (a.id === agentId ? { ...a, status: newStatus } : a))
    );
    const target = agents.find(a => a.id === agentId);
    if (target) {
      onShowToast(`[관리자] '${target.name}' 상태가 '${newStatus}'(으)로 변경되었습니다.`);
    }
  };

  // Admin Hide Handler (숨기기 / 숨김 해제)
  const handleToggleHide = (agentId: string) => {
    setAgents(prev =>
      prev.map(a => (a.id === agentId ? { ...a, isHidden: !a.isHidden } : a))
    );
    const target = agents.find(a => a.id === agentId);
    if (target) {
      const nextHidden = !target.isHidden;
      onShowToast(`[관리자] '${target.name}'이(가) ${nextHidden ? '숨김 처리' : '숨김 해제'}되었습니다.`);
    }
  };

  // Delete Agent Handler
  const handleDeleteAgent = (agentId: string, reason?: string) => {
    const target = agents.find(a => a.id === agentId);
    setAgents(prev => prev.filter(a => a.id !== agentId));
    if (selectedDetailAgent?.id === agentId) {
      setSelectedDetailAgent(null);
    }
    if (target) {
      if (reason) {
        onShowToast(`[관리자 삭제] '${target.name}'이(가) 삭제되었습니다. (사유: ${reason})`);
      } else {
        onShowToast(`'${target.name}'이(가) 삭제되었습니다.`);
      }
    }
  };

  // Request Delete with Reason (For non-author admin delete)
  const handleRequestDeleteWithReason = (agent: VerifiedAgent) => {
    setDeleteModalAgent(agent);
  };

  // Filter and Sort Agents
  const filteredAndSortedAgents = useMemo(() => {
    return agents
      .filter((agent) => {
        // Non-admin hide check
        if (userRole !== 'admin' && agent.isHidden) {
          return false;
        }

        // Bookmark Filter
        if (showOnlySaved && !agent.isSaved) {
          return false;
        }

        // Category Filter
        if (selectedCategory !== '전체' && agent.category !== selectedCategory) {
          return false;
        }

        // Search Query Filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = (agent.name || '').toLowerCase().includes(q);
          const matchDesc = (agent.description || '').toLowerCase().includes(q);
          const matchTags = (agent.tags || []).some(t => (t || '').toLowerCase().includes(q));
          const matchAuthor = (agent.author || '').toLowerCase().includes(q);
          const matchCode = (agent.code || '').toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchTags && !matchAuthor && !matchCode) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        switch (sortOption) {
          case '좋아요순':
            return (b.likes || 0) - (a.likes || 0);
          case '댓글순':
            return (b.commentsCount || 0) - (a.commentsCount || 0);
          case '사용량순':
            return (b.executionCount || 0) - (a.executionCount || 0);
          case '최신순':
          default:
            return (b.createdAt || '').localeCompare(a.createdAt || '');
        }
      });
  }, [agents, selectedCategory, showOnlySaved, searchQuery, sortOption, userRole]);

  // Saved agents count
  const savedCount = useMemo(() => agents.filter(a => a.isSaved).length, [agents]);

  // Category count helper
  const getCategoryCount = (cat: string) => {
    let list = agents;
    if (userRole !== 'SUPER_ADMIN') {
      list = list.filter(a => a.status !== 'SUSPENDED');
    }
    if (cat === '전체') return list.length;
    return list.filter(a => a.category === cat).length;
  };

  // If in dedicated detail view, render detail full-page screen
  if (selectedDetailAgent) {
    return (
      <>
        <AiAgentDetailView
          agent={selectedDetailAgent}
          userRole={userRole}
          onBack={() => setSelectedDetailAgent(null)}
          onRunAgent={(ag) => {
            setSelectedDetailAgent(null);
            setRunningAgent(ag);
          }}
          onToggleLike={handleToggleLike}
          onToggleSave={handleToggleSave}
          onDeleteAgent={handleDeleteAgent}
          onRequestDeleteWithReason={handleRequestDeleteWithReason}
          onShowToast={onShowToast}
        />
        {deleteModalAgent && (
          <DeleteReasonModal
            isOpen={!!deleteModalAgent}
            agent={{
              id: deleteModalAgent.id,
              title: deleteModalAgent.name,
              author: deleteModalAgent.author,
              department: deleteModalAgent.department
            }}
            onClose={() => setDeleteModalAgent(null)}
            onConfirmDelete={(agentId, reason) => {
              handleDeleteAgent(agentId, reason);
              setDeleteModalAgent(null);
            }}
          />
        )}
      </>
    );
  }

  // If in dedicated chat runner view, render runner
  if (runningAgent) {
    return (
      <AiAgentChatRunner
        agent={runningAgent}
        onBack={() => setRunningAgent(null)}
        onShowToast={onShowToast}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-gradient-to-b from-[#FAFBFD] via-white to-[#F8F9FA] overflow-y-auto">
      {/* ─────────────────────────────────────────────
          AI Agent 상단 고정 컨트롤 영역 (Custom AI와 규격 완전 통일)
          ───────────────────────────────────────────── */}
      <div className="bg-white/95 backdrop-blur-md border-b border-neutral-200/80 sticky top-0 z-20 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto px-6 py-3.5 sm:px-8">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5">

            {/* Right: 보관함, 정렬, 검색창 (Custom AI와 동일한 flex-row 일렬 정렬) */}
            <div className="flex items-center gap-2.5 shrink-0">
              {/* 보관함(저장된 Agent) 빠른 필터: 고정 너비(w-[88px])로 숫자가 변해도 크기 유지 */}
              <button
                type="button"
                id="filter-saved-agents-btn"
                onClick={() => {
                  setShowOnlySaved(!showOnlySaved);
                  if (!showOnlySaved) setSelectedCategory('전체');
                }}
                className={`flex items-center justify-center gap-1.5 w-[88px] h-8 rounded-lg text-xs font-semibold border transition-all cursor-pointer shrink-0 ${
                  showOnlySaved
                    ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold shadow-2xs'
                    : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 shrink-0 ${showOnlySaved ? 'fill-amber-500 text-amber-500' : 'text-neutral-400'}`} />
                <span className="truncate">보관함 ({savedCount})</span>
              </button>

              {/* 정렬/필터 Dropdown (보관함 오른쪽) */}
              <div className="relative shrink-0">
                <select
                  id="ai-agent-sort-select"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as typeof AGENT_SORT_OPTIONS[number])}
                  aria-label="Agent 정렬 기준"
                  className="appearance-none pl-3 pr-8 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs font-semibold text-neutral-700 hover:border-neutral-300 focus:outline-none focus:border-neutral-400 transition-colors cursor-pointer"
                >
                  {AGENT_SORT_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* 검색창: 맨 오른쪽 */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                <input
                  type="text"
                  id="ai-agent-search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Agent 검색..."
                  className="w-full pl-8.5 pr-7 py-1.5 bg-neutral-50 hover:bg-white focus:bg-white rounded-lg border border-neutral-200 focus:border-neutral-400 text-xs text-neutral-900 placeholder:text-neutral-400 transition-all outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 text-xs font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────
          구분선 아래: Agent 카드 Grid 시작
          - 정상적인 document flow 안에서 시작
          - Custom AI 기준과 동일한 여백 규격 (max-w-7xl mx-auto px-6 py-6 sm:px-8)
          - 첫 번째 카드 행이 상단 영역과 겹치거나 잘리지 않음
          ───────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-6 py-6 sm:px-8 flex-1 w-full">
        {filteredAndSortedAgents.length === 0 ? (
          <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center my-8">
            <AlertCircle className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-neutral-800">
              {showOnlySaved ? '보관함에 저장된 AI Agent가 없습니다' : '일치하는 AI Agent가 없습니다'}
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              {showOnlySaved ? 'Agent 카드의 북마크 아이콘을 눌러 관심 있는 Agent를 보관해보세요.' : '검색어나 카테고리 필터를 변경해보세요.'}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('전체');
                setShowOnlySaved(false);
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer"
            >
              전체 Agent 보기
            </button>
          </div>
        ) : (
          <div 
            id="ai-agent-grid"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredAndSortedAgents.map((agent) => (
              <AiAgentCard
                key={agent.id}
                agent={agent}
                userRole={userRole}
                onSelectDetail={(ag) => setSelectedDetailAgent(ag)}
                onRunAgent={(ag) => setRunningAgent(ag)}
                onToggleLike={handleToggleLike}
                onToggleSave={handleToggleSave}
                onToggleStatus={handleToggleStatus}
                onToggleHide={handleToggleHide}
                onDeleteAgent={handleDeleteAgent}
                onRequestDeleteWithReason={handleRequestDeleteWithReason}
              />
            ))}
          </div>
        )}
      </main>

      {/* 관리자 삭제 사유 입력 팝업 모달 */}
      {deleteModalAgent && (
        <DeleteReasonModal
          isOpen={!!deleteModalAgent}
          agent={{
            id: deleteModalAgent.id,
            title: deleteModalAgent.name,
            author: deleteModalAgent.author,
            department: deleteModalAgent.department
          }}
          onClose={() => setDeleteModalAgent(null)}
          onConfirmDelete={(agentId, reason) => {
            handleDeleteAgent(agentId, reason);
            setDeleteModalAgent(null);
          }}
        />
      )}
    </div>
  );
};
