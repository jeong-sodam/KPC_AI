import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Sparkles, 
  Filter, 
  Lightbulb, 
  Bot, 
  Layout, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Plus, 
  History, 
  MessageSquare, 
  TrendingUp,
  SlidersHorizontal,
  ChevronRight,
  Info,
  ArrowUpDown,
  Bookmark
} from 'lucide-react';
import { 
  CommunityAgent, 
  CommunityComment,
  UserRole, 
  CommunityDevType, 
  FeatureProposalStatus,
  CommunityTimelineUpdate 
} from '../../types';
import { COMMUNITY_SORT_OPTIONS } from '../../data/communityMockData';
import { CommunityCard } from './CommunityCard';
import { CommunityDetailView } from './CommunityDetailView';
import { CommunityPostCreateView } from './CommunityPostCreateView';
import { AgentAuditReviewModal } from './AgentAuditReviewModal';

interface AiCommunityViewProps {
  posts: CommunityAgent[];
  setPosts: React.Dispatch<React.SetStateAction<CommunityAgent[]>>;
  userRole?: UserRole;
  onNavigateToAgent?: (agentId?: string) => void;
  onNavigateToCustomAi?: (targetId?: string) => void;
  onRequestRegisterAgent?: (post: CommunityAgent) => void;
  onRequestRegisterCustomAi?: (post: CommunityAgent) => void;
  onRegisterAsAgent?: (post: CommunityAgent) => void;
  onRegisterAsCustomAi?: (post: CommunityAgent) => void;
  onHoldAudit?: (postId: string) => void;
  onNavigateTab?: (tab: string) => void;
  onShowToast: (msg: string) => void;
}

export const AiCommunityView: React.FC<AiCommunityViewProps> = ({
  posts,
  setPosts,
  userRole = 'user',
  onNavigateToAgent,
  onNavigateToCustomAi,
  onRequestRegisterAgent,
  onRequestRegisterCustomAi,
  onRegisterAsAgent,
  onRegisterAsCustomAi,
  onHoldAudit,
  onNavigateTab,
  onShowToast
}) => {
  // Navigation & Filter States
  const [activeSubTab, setActiveSubTab] = useState<'all' | 'my'>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('전체');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [activeSort, setActiveSort] = useState<string>('최신순');
  const [showOnlySaved, setShowOnlySaved] = useState(false);

  const savedCount = useMemo(() => posts.filter(p => p.isSaved).length, [posts]);

  // Navigation & Page/Modal States (Derived to avoid state synchronization mutations during render)
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [adminReviewPostId, setAdminReviewPostId] = useState<string | null>(null);

  const selectedPost = useMemo(() => {
    if (!selectedPostId) return null;
    return posts.find(p => p.id === selectedPostId) || null;
  }, [posts, selectedPostId]);

  const adminReviewPost = useMemo(() => {
    if (!adminReviewPostId) return null;
    return posts.find(p => p.id === adminReviewPostId) || null;
  }, [posts, adminReviewPostId]);

  // Navigation Helpers
  const handleNavigateToAgent = (agentId?: string) => {
    if (onNavigateToAgent) {
      onNavigateToAgent(agentId);
    } else if (onNavigateTab) {
      onNavigateTab('ai_agent');
    }
  };

  const handleNavigateToCustomAi = (targetId?: string) => {
    if (onNavigateToCustomAi) {
      onNavigateToCustomAi(targetId);
    } else if (onNavigateTab) {
      onNavigateTab('custom_ai');
    }
  };

  const handleRegisterAgent = (agent: CommunityAgent) => {
    if (onRequestRegisterAgent) {
      onRequestRegisterAgent(agent);
    } else if (onRegisterAsAgent) {
      onRegisterAsAgent(agent);
    }
  };

  const handleRegisterCustomAi = (agent: CommunityAgent) => {
    if (onRequestRegisterCustomAi) {
      onRequestRegisterCustomAi(agent);
    } else if (onRegisterAsCustomAi) {
      onRegisterAsCustomAi(agent);
    }
  };

  // Toggle Like
  const handleToggleLike = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const nextLiked = !p.userLiked;
        const nextLikes = nextLiked ? p.likes + 1 : Math.max(0, p.likes - 1);
        return {
          ...p,
          userLiked: nextLiked,
          likes: nextLikes
        };
      }
      return p;
    }));
  };

  // Toggle Save (Bookmark)
  const handleToggleSave = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const nextSaved = !p.isSaved;
        onShowToast(nextSaved ? `'${p.title}' 글을 보관함에 추가했습니다.` : `'${p.title}' 보관을 취소했습니다.`);
        return {
          ...p,
          isSaved: nextSaved
        };
      }
      return p;
    }));
  };

  // Add Comment / Subordinated Reply
  const handleAddComment = (postId: string, commentData: any) => {
    const newComment: CommunityComment = {
      id: `c-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      author: commentData.author || '정소담',
      department: commentData.department || 'AI전략팀',
      content: commentData.content,
      createdAt: '방금 전',
      likes: 0,
      isFeatureProposal: commentData.isFeatureProposal,
      proposalStatus: commentData.proposalStatus,
      replies: []
    };

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        let nextComments: CommunityComment[];
        if (commentData.parentCommentId) {
          // Subordinate directly under parent comment
          nextComments = (p.comments || []).map(c => {
            if (c.id === commentData.parentCommentId) {
              return {
                ...c,
                replies: [...(c.replies || []), newComment]
              };
            }
            return c;
          });
        } else {
          nextComments = [...(p.comments || []), newComment];
        }

        const totalCount = nextComments.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0);
        return {
          ...p,
          comments: nextComments,
          commentsCount: totalCount
        };
      }
      return p;
    }));
  };

  // Update Feature Proposal Status
  const handleUpdateProposalStatus = (postId: string, commentId: string, newStatus: FeatureProposalStatus) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const nextComments = (p.comments || []).map(c => {
          if (c.id === commentId) {
            return { ...c, proposalStatus: newStatus };
          }
          return c;
        });
        return { ...p, comments: nextComments };
      }
      return p;
    }));
    onShowToast(`기능 제안 상태가 [${newStatus}](으)로 변경되었습니다.`);
  };

  // Add Timeline Update
  const handleAddUpdate = (postId: string, newUpdate: CommunityTimelineUpdate) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const nextUpdates = [newUpdate, ...(p.timelineUpdates || [])];
        return {
          ...p,
          version: newUpdate.version,
          updatedAt: newUpdate.date,
          timelineUpdates: nextUpdates
        };
      }
      return p;
    }));
  };

  // Official Registration Submission
  const handleSubmitOfficial = (postId: string, submissionData: any) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          status: '검수 요청',
          devStatus: '공식 등록 검토 중',
          officialSubmission: submissionData,
          timelineUpdates: [
            {
              version: p.version,
              date: new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
              title: '관리자에게 공식 서비스 등록 제출 완료',
              changes: ['보안·품질 검수 요청서 접수 완료'],
              author: p.author
            },
            ...(p.timelineUpdates || [])
          ]
        };
      }
      return p;
    }));
  };

  // Admin Approve as AI Agent
  const handleAdminApproveAsAgent = (agent: CommunityAgent, refinedData?: any) => {
    setPosts(prev => prev.map(p => {
      if (p.id === agent.id) {
        return {
          ...p,
          status: '승인 완료',
          devStatus: '검증 완료',
          officialRegisteredType: 'agent'
        };
      }
      return p;
    }));
    const updatedAgent: CommunityAgent = {
      ...agent,
      title: refinedData?.name || agent.title,
      shortDesc: refinedData?.description || agent.shortDesc,
      description: refinedData?.description || agent.description,
      selectedModel: refinedData?.model || agent.selectedModel
    };
    handleRegisterAgent(updatedAgent);
  };

  // Admin Approve as Custom AI
  const handleAdminApproveAsCustomAi = (agent: CommunityAgent, refinedData?: any) => {
    setPosts(prev => prev.map(p => {
      if (p.id === agent.id) {
        return {
          ...p,
          status: '승인 완료',
          devStatus: '검증 완료',
          officialRegisteredType: 'custom_ai'
        };
      }
      return p;
    }));
    const updatedAgent: CommunityAgent = {
      ...agent,
      title: refinedData?.name || agent.title,
      shortDesc: refinedData?.description || agent.shortDesc,
      description: refinedData?.description || agent.description,
      selectedModel: refinedData?.model || agent.selectedModel
    };
    handleRegisterCustomAi(updatedAgent);
  };

  // Admin Reject
  const handleAdminReject = (postId: string, reason: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          status: '반려',
          devStatus: '개선 중 (반려)',
          timelineUpdates: [
            {
              version: p.version,
              date: new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
              title: '관리자 검수 반려 및 보완 요청',
              changes: [`보완 요청 사유: ${reason}`],
              author: 'AI관리위원회'
            },
            ...(p.timelineUpdates || [])
          ]
        };
      }
      return p;
    }));
    onShowToast('해당 신청이 반려 처리되었습니다.');
  };

  // Delete Community Post
  const handleDeletePost = (postId: string) => {
    const target = posts.find(p => p.id === postId);
    setPosts(prev => prev.filter(p => p.id !== postId));
    onShowToast(`'${target?.title || '선택한'}' 게시물이 삭제되었습니다.`);
    if (selectedPostId === postId) {
      setSelectedPostId(null);
    }
  };

  // Create new Community Post
  const handleCreatePost = (newPostData: Partial<CommunityAgent>) => {
    const newId = `comm-${Date.now()}`;
    const newPost: CommunityAgent = {
      id: newId,
      title: newPostData.title || '새 AI 아이디어',
      shortDesc: newPostData.shortDesc || '',
      description: newPostData.description || '',
      devType: newPostData.devType || 'AI Agent 개발',
      devStatus: newPostData.devStatus || '개발 중',
      version: newPostData.version || 'v0.1',
      oneLineDesc: newPostData.oneLineDesc || newPostData.shortDesc || '',
      author: '정소담',
      department: 'AI전략팀',
      category: newPostData.category || '업무자동화',
      createdAt: new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
      updatedAt: new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
      likes: 1,
      userLiked: true,
      views: 1,
      commentsCount: 0,
      status: '개발 중',
      developmentType: newPostData.developmentType || 'agent',
      tags: newPostData.tags || ['AI개발'],
      icon: newPostData.icon,
      screenshots: newPostData.screenshots || [],
      prototypeUrl: newPostData.prototypeUrl,
      demoVideoUrl: newPostData.demoVideoUrl,
      problemAndBackground: newPostData.problemAndBackground,
      implementedFeatures: newPostData.implementedFeatures,
      testingProgress: newPostData.testingProgress,
      plannedFeatures: newPostData.plannedFeatures,
      feedbackWanted: newPostData.feedbackWanted,
      timelineUpdates: newPostData.timelineUpdates || [],
      comments: []
    };

    setPosts(prev => [newPost, ...prev]);
    onShowToast(`'${newPost.title}' 아이디어가 커뮤니티에 성공적으로 공유되었습니다.`);
  };

  // Filtering & Sorting
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      // Exclude posts that are approved / officially registered
      const isOfficiallyRegistered = post.status === '승인 완료' || 
        !!post.officialRegisteredType || 
        !!post.registeredType || 
        post.devStatus === '검증 완료';
      if (isOfficiallyRegistered) return false;

      // Subtab
      if (activeSubTab === 'my' && post.author !== '정소담') return false;

      // Saved Filter (보관함)
      if (showOnlySaved && !post.isSaved) return false;

      // Status
      if (selectedStatus !== '전체') {
        if (selectedStatus === '공식 검토 중') {
          if (post.status !== '검수 요청' && post.devStatus !== '공식 등록 검토 중') return false;
        } else if (selectedStatus === '테스트 중') {
          if (post.devStatus !== '테스트 중' && post.status !== '테스트 중') return false;
        } else if (selectedStatus === '개발 중') {
          if (post.devStatus !== '개발 중' && post.devStatus !== '초기 개발' && post.status !== '개발 중') return false;
        } else if (selectedStatus === '아이디어') {
          if (post.devStatus !== '아이디어 단계' && post.devType !== 'AI 아이디어' && post.status !== '아이디어') return false;
        }
      }

      // Search keyword
      if (searchKeyword.trim()) {
        const kw = searchKeyword.toLowerCase();
        const inTitle = post.title.toLowerCase().includes(kw);
        const inDesc = (post.description || '').toLowerCase().includes(kw);
        const inAuthor = post.author.toLowerCase().includes(kw);
        const inTags = post.tags.some(t => t.toLowerCase().includes(kw));
        if (!inTitle && !inDesc && !inAuthor && !inTags) return false;
      }

      return true;
    }).sort((a, b) => {
      if (activeSort === '좋아요순') return (b.likes || 0) - (a.likes || 0);
      if (activeSort === '댓글순') return (b.comments?.length || b.commentsCount || 0) - (a.comments?.length || a.commentsCount || 0);
      if (activeSort === '사용량순') return ((b.runs || 0) + (b.views || 0)) - ((a.runs || 0) + (a.views || 0));
      // default: 최신순
      return (b.createdAt || '').localeCompare(a.createdAt || '');
    });
  }, [posts, activeSubTab, selectedStatus, searchKeyword, activeSort, showOnlySaved]);

  // Full-page Screen Navigation for Creating New Community Post
  if (isCreatingPost) {
    return (
      <CommunityPostCreateView
        onBack={() => setIsCreatingPost(false)}
        onSubmit={handleCreatePost}
        onShowToast={onShowToast}
      />
    );
  }

  // Full-page Screen Navigation for Selected Community Post
  if (selectedPost) {
    return (
      <CommunityDetailView
        post={selectedPost}
        userRole={userRole}
        onBack={() => setSelectedPostId(null)}
        onToggleLike={handleToggleLike}
        onToggleSave={handleToggleSave}
        onNavigateToAgent={handleNavigateToAgent}
        onNavigateToCustomAi={handleNavigateToCustomAi}
        onShowToast={onShowToast}
        onAddComment={handleAddComment}
        onAddUpdate={handleAddUpdate}
        onSubmitOfficial={handleSubmitOfficial}
        onOpenAdminReview={(p) => setAdminReviewPostId(p.id)}
      />
    );
  }

  return (
    <div id="ai-community-root" className="flex-1 flex flex-col h-full overflow-y-auto bg-gradient-to-b from-[#FAFBFD] via-white to-[#F8F9FA]">
      {/* ─────────────────────────────────────────────────────────────
          상단 고정 컨트롤 영역 (Custom AI, AI Agent와 완전 동일한 여백/위치 규격)
          ───────────────────────────────────────────────────────────── */}
      <div className="bg-white/95 backdrop-blur-md border-b border-neutral-200/80 sticky top-0 z-20 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto px-6 py-3.5 sm:px-8">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
            {/* Navigation Subtabs (좌측) */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                id="tab-community-all-posts"
                onClick={() => setActiveSubTab('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeSubTab === 'all'
                    ? 'bg-neutral-900 text-white shadow-2xs'
                    : 'bg-white text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 border border-neutral-200'
                }`}
              >
                전체 글
              </button>

              <button
                type="button"
                id="tab-community-my-posts"
                onClick={() => setActiveSubTab('my')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeSubTab === 'my'
                    ? 'bg-neutral-900 text-white shadow-2xs'
                    : 'bg-white text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 border border-neutral-200'
                }`}
              >
                작성 글
              </button>
            </div>

            {/* Right: 개발 아이디어 공유 버튼 + 보관함 + 최신순 정렬 + 검색창 (한 줄 일렬 정렬) */}
            <div className="flex items-center gap-2.5 shrink-0 flex-wrap sm:flex-nowrap">
              {/* Primary Action Button: 보관함 왼쪽 */}
              <button
                type="button"
                id="btn-create-community-post"
                onClick={() => setIsCreatingPost(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E60012] hover:bg-[#CC0010] text-white rounded-lg text-xs font-bold shadow-xs transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>개발 아이디어 공유</span>
              </button>

              {/* 보관함 빠른 필터: 고정 너비(w-[88px])로 숫자가 변해도 크기 유지 */}
              <button
                type="button"
                id="community-filter-saved-btn"
                onClick={() => setShowOnlySaved(!showOnlySaved)}
                className={`flex items-center justify-center gap-1.5 w-[88px] h-8 rounded-lg text-xs font-semibold border transition-all cursor-pointer shrink-0 ${
                  showOnlySaved
                    ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold shadow-2xs'
                    : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                }`}
                title="보관한 글만 모아보기"
              >
                <Bookmark className={`w-3.5 h-3.5 shrink-0 ${showOnlySaved ? 'fill-amber-500 text-amber-500' : 'text-neutral-400'}`} />
                <span className="truncate">보관함 ({savedCount})</span>
              </button>

              {/* 정렬 Dropdown: 검색창 바로 왼쪽 */}
              <div className="relative shrink-0">
                <select
                  id="community-sort-select"
                  value={activeSort}
                  onChange={(e) => setActiveSort(e.target.value)}
                  aria-label="커뮤니티 정렬 기준"
                  className="appearance-none pl-3 pr-8 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs font-semibold text-neutral-700 hover:border-neutral-300 focus:outline-none focus:border-neutral-400 transition-colors cursor-pointer"
                >
                  {COMMUNITY_SORT_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Search Bar on the Right */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
                <input
                  type="text"
                  id="community-search-input"
                  value={searchKeyword}
                  onChange={e => setSearchKeyword(e.target.value)}
                  placeholder="아이디어, 기능, 작성자 검색..."
                  className="w-full pl-8.5 pr-7 py-1.5 bg-neutral-50 hover:bg-white focus:bg-white rounded-lg border border-neutral-200 focus:border-neutral-400 text-xs text-neutral-900 placeholder:text-neutral-400 transition-all outline-none"
                />
                {searchKeyword && (
                  <button
                    type="button"
                    onClick={() => setSearchKeyword('')}
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

      {/* 카드 그리드 본문: Custom AI, AI Agent와 동일한 max-w-7xl mx-auto px-6 py-6 sm:px-8 */}
      <main className="max-w-7xl mx-auto px-6 py-6 sm:px-8 flex-1 w-full space-y-6">

      {/* ─────────────────────────────────────────────────────────────
          Post Grid (Cards)
          ───────────────────────────────────────────────────────────── */}
      {filteredPosts.length === 0 ? (
        <div className="bg-neutral-50 rounded-2xl border border-neutral-200 p-12 text-center space-y-3">
          <Lightbulb className="w-10 h-10 text-neutral-400 mx-auto" />
          <h3 className="text-base font-bold text-neutral-800">
            조건에 맞는 AI 아이디어 또는 개발 진행 게시물이 없습니다.
          </h3>
          <p className="text-xs text-neutral-500 max-w-md mx-auto">
            새로운 AI 아이디어나 직접 테스트 중인 프로토타입을 등록하여 동료들의 피드백을 받아보세요.
          </p>
          <button
            type="button"
            onClick={() => setIsCreatingPost(true)}
            className="px-4 py-2 bg-[#E60012] text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>첫 번째 아이디어 공유하기</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map(post => (
            <CommunityCard
              key={post.id}
              post={post}
              userRole={userRole}
              onOpenDetail={(p) => setSelectedPostId(p.id)}
              onToggleLike={handleToggleLike}
              onToggleSave={handleToggleSave}
              onDeletePost={handleDeletePost}
              onNavigateToAgent={handleNavigateToAgent}
              onNavigateToCustomAi={handleNavigateToCustomAi}
              onRequestOfficialRegister={(p) => setAdminReviewPostId(p.id)}
            />
          ))}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          Modals
          ───────────────────────────────────────────────────────────── */}
      {/* Admin Review & Refinement Modal */}
      {adminReviewPost && (
        <AgentAuditReviewModal
          agent={adminReviewPost}
          isOpen={!!adminReviewPost}
          onClose={() => setAdminReviewPostId(null)}
          onApproveAsAgent={handleAdminApproveAsAgent}
          onApproveAsCustomAi={handleAdminApproveAsCustomAi}
          onReject={handleAdminReject}
          onShowToast={onShowToast}
        />
      )}
      </main>
    </div>
  );
};
