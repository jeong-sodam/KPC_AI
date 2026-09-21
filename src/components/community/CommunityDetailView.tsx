import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Heart, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Lightbulb, 
  Sparkles, 
  ExternalLink,
  ShieldCheck, 
  History, 
  Tag, 
  Bot, 
  Layout, 
  Plus, 
  Image as ImageIcon,
  Calendar,
  Share2,
  Bookmark,
  Zap,
  BarChart2,
  Search,
  BrainCircuit,
  Wand2,
  CornerDownRight,
  Play,
  Eye
} from 'lucide-react';
import { 
  CommunityAgent, 
  CommunityComment, 
  UserRole, 
  CommunityTimelineUpdate 
} from '../../types';
import { CommunityUpdateModal } from './CommunityUpdateModal';
import { OfficialSubmissionModal } from './OfficialSubmissionModal';

interface CommunityDetailViewProps {
  post: CommunityAgent;
  userRole?: UserRole;
  onBack: () => void;
  onToggleLike: (postId: string) => void;
  onToggleSave?: (postId: string) => void;
  onNavigateToAgent?: (agentId?: string) => void;
  onNavigateToCustomAi?: (targetId?: string) => void;
  onShowToast: (msg: string) => void;
  onAddComment?: (postId: string, comment: Partial<CommunityComment> & { parentCommentId?: string }) => void;
  onAddUpdate?: (postId: string, update: CommunityTimelineUpdate) => void;
  onSubmitOfficial?: (postId: string, submissionData: any) => void;
  onOpenAdminReview?: (post: CommunityAgent) => void;
}

export const CommunityDetailView: React.FC<CommunityDetailViewProps> = ({
  post,
  userRole = 'user',
  onBack,
  onToggleLike,
  onToggleSave,
  onNavigateToAgent,
  onNavigateToCustomAi,
  onShowToast,
  onAddComment,
  onAddUpdate,
  onSubmitOfficial,
  onOpenAdminReview
}) => {
  const [commentText, setCommentText] = useState('');
  const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(null);
  const [replyingToAuthor, setReplyingToAuthor] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Submodals
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isOfficialSubmitModalOpen, setIsOfficialSubmitModalOpen] = useState(false);

  const handleDemoClick = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    try {
      const fullUrl = `${window.location.origin}${window.location.pathname}?demo=${post.id}`;
      window.open(fullUrl, '_blank');
    } catch {
      // ignore
    }
  };

  const isAuthor = post.author === '정소담';
  const isReviewing = post.status === '검수 요청' || post.status === '검수 중' || post.devStatus === '공식 등록 검토 중';
  const isIdeaStage = 
    post.devStatus === '아이디어 단계' || 
    post.devStatus === '아이디어' ||
    post.status === '아이디어' || 
    post.devType === 'AI 아이디어' ||
    post.category === '아이디어' ||
    Boolean(post.devStatus?.includes('아이디어')) ||
    Boolean(post.status?.includes('아이디어'));

  const comments = post.comments || [];
  const totalCommentsCount = comments.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0);

  const renderContentWithMentions = (text: string) => {
    const parts = text.split(/(@[a-zA-Z0-9가-힣_-]+)/g);
    return parts.map((part, i) => {
      if (part.startsWith('@')) {
        return (
          <span
            key={i}
            className="inline-flex items-center px-1.5 py-0.5 mr-1 rounded-md bg-red-50 text-[#E60012] font-semibold text-xs border border-red-100 align-baseline"
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const handleAddCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    if (onAddComment) {
      onAddComment(post.id, {
        author: '정소담',
        department: 'AI전략팀',
        content: commentText.trim(),
        createdAt: '방금 전',
        likes: 0
      });
    }

    setCommentText('');
    onShowToast('댓글이 등록되었습니다.');
  };

  const handleStartReply = (commentId: string, authorToMention: string) => {
    setReplyingToCommentId(commentId);
    setReplyingToAuthor(authorToMention);
    setReplyText(`@${authorToMention} `);
  };

  const handleCancelReply = () => {
    setReplyingToCommentId(null);
    setReplyingToAuthor(null);
    setReplyText('');
  };

  const handleAddReplySubmit = (parentCommentId: string, defaultMentionAuthor?: string) => {
    if (!replyText.trim()) return;

    let content = replyText.trim();
    if (defaultMentionAuthor && !content.includes(`@${defaultMentionAuthor}`)) {
      content = `@${defaultMentionAuthor} ${content}`;
    }

    if (onAddComment) {
      onAddComment(post.id, {
        author: '정소담 (작성자)',
        department: 'AI전략팀',
        content,
        createdAt: '방금 전',
        likes: 0,
        parentCommentId
      });
    }

    setReplyingToCommentId(null);
    setReplyingToAuthor(null);
    setReplyText('');
    onShowToast('답글이 등록되었습니다.');
  };

  return (
    <div id="community-detail-page" className="flex-1 flex flex-col h-full overflow-y-auto bg-[#F8F9FA] animate-in fade-in duration-200">
      
      {/* ─────────────────────────────────────────────────────────────
          Top Breadcrumb & Action Navigation Bar (Sticky Top)
          ───────────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200/90 shadow-2xs">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="group flex items-center gap-2 text-xs sm:text-sm font-bold text-neutral-700 hover:text-neutral-950 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-neutral-100 group-hover:bg-neutral-200 flex items-center justify-center text-neutral-600 group-hover:text-neutral-900 transition-colors">
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            </div>
            <span>커뮤니티 목록으로 돌아가기</span>
          </button>

          {/* Quick Right Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleLike(post.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                post.userLiked
                  ? 'bg-red-50 text-[#E60012] border-red-200 shadow-2xs'
                  : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
              }`}
            >
              <Heart className={`w-4 h-4 ${post.userLiked ? 'fill-current' : ''}`} />
              <span>좋아요 {post.likes}</span>
            </button>

            {/* Views (조회수) */}
            <div className="flex items-center gap-1.5 px-3 py-2 bg-neutral-100 rounded-xl text-xs font-semibold text-neutral-600">
              <Eye className="w-3.5 h-3.5 text-neutral-400" />
              <span>{(post.views || 0).toLocaleString()}</span>
            </div>

            {/* Bookmark right after Views */}
            {onToggleSave && (
              <button
                type="button"
                id={`community-detail-bookmark-btn-${post.id}`}
                onClick={() => onToggleSave(post.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  post.isSaved
                    ? 'bg-amber-50 text-amber-700 border-amber-200 shadow-2xs'
                    : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
                }`}
                title="북마크"
              >
                <Bookmark className={`w-3.5 h-3.5 ${post.isSaved ? 'fill-amber-500 text-amber-500' : ''}`} />
                <span>{post.isSaved ? '보관됨' : '보관'}</span>
              </button>
            )}

            {/* Author Action Buttons */}
            {isAuthor && (
              <>
                <button
                  type="button"
                  onClick={() => setIsUpdateModalOpen(true)}
                  className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-[#E60012]" />
                  <span>업데이트 작성</span>
                </button>

                {!isIdeaStage && (
                  <button
                    type="button"
                    onClick={() => setIsOfficialSubmitModalOpen(true)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-neutral-900 hover:bg-black text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#E60012]" />
                    <span>공식 등록 제출</span>
                  </button>
                )}
              </>
            )}

            {/* Admin Review Action Button */}
            {userRole === 'admin' && !isIdeaStage && onOpenAdminReview && (
              <button
                type="button"
                onClick={() => onOpenAdminReview(post)}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#E60012] hover:bg-[#CC0010] text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>관리자 검수·승인</span>
              </button>
            )}

            {/* If officially registered, navigate buttons */}
            {(post.status === '승인 완료' || post.officialRegisteredType === 'agent' || post.registeredType === 'agent') && onNavigateToAgent && (
              <button
                type="button"
                onClick={() => onNavigateToAgent(post.registeredTargetId || post.id)}
                className="flex items-center gap-1.5 px-4 py-2 bg-neutral-900 hover:bg-black text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#E60012]" />
                <span>공식 서비스로 이동</span>
              </button>
            )}
            {(post.status === '승인 완료' || post.officialRegisteredType === 'custom_ai' || post.registeredType === 'custom_ai') && onNavigateToCustomAi && (
              <button
                type="button"
                onClick={() => onNavigateToCustomAi(post.registeredTargetId || post.id)}
                className="flex items-center gap-1.5 px-4 py-2 bg-neutral-900 hover:bg-black text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#E60012]" />
                <span>공식 서비스로 이동</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          Page Main Content
          ───────────────────────────────────────────────────────────── */}
      <div className="w-full max-w-5xl mx-auto px-6 sm:px-8 py-6 space-y-6">

        {/* 1. Header Hero Card */}
        <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          
          {/* Header Top: Icon, Title & Badges */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-white flex items-center justify-center shrink-0 shadow-xs overflow-hidden">
              {post.icon && (post.icon.startsWith('data:image') || post.icon.startsWith('http') || post.icon.startsWith('/')) ? (
                <img src={post.icon} alt={post.title} className="w-full h-full object-cover" />
              ) : post.icon === 'sparkles' ? (
                <Sparkles className="w-6 h-6 text-[#E60012]" />
              ) : post.icon === 'lightbulb' ? (
                <Lightbulb className="w-6 h-6 text-amber-400" />
              ) : post.icon === 'layout' ? (
                <Layout className="w-6 h-6 text-purple-400" />
              ) : post.icon === 'file-text' ? (
                <FileText className="w-6 h-6 text-blue-400" />
              ) : post.icon === 'chart' ? (
                <BarChart2 className="w-6 h-6 text-emerald-400" />
              ) : post.icon === 'zap' ? (
                <Zap className="w-6 h-6 text-yellow-400" />
              ) : post.icon === 'search' ? (
                <Search className="w-6 h-6 text-cyan-400" />
              ) : post.icon === 'brain' ? (
                <BrainCircuit className="w-6 h-6 text-pink-400" />
              ) : post.icon === 'wand' ? (
                <Wand2 className="w-6 h-6 text-indigo-400" />
              ) : post.icon === 'message' ? (
                <MessageSquare className="w-6 h-6 text-green-400" />
              ) : post.icon === 'shield' ? (
                <ShieldCheck className="w-6 h-6 text-blue-500" />
              ) : isIdeaStage ? (
                <Lightbulb className="w-6 h-6 text-amber-400" />
              ) : (
                <Sparkles className="w-6 h-6 text-[#E60012]" />
              )}
            </div>

            <div className="space-y-2 flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 leading-snug">
                {post.title}
              </h1>

              {/* Description */}
              <p className="text-sm text-neutral-600 leading-relaxed">
                {post.oneLineDesc || post.shortDesc || post.description}
              </p>
            </div>
          </div>

          {/* Badges & Meta Info Row (Below Title & Description) */}
          <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Badges */}
            <div className="flex items-center flex-wrap gap-2 text-xs">
              {/* Version */}
              <span className="px-2.5 py-1 rounded-lg font-mono font-bold bg-neutral-100 text-neutral-800 border border-neutral-200">
                {post.version}
              </span>

              {/* Status */}
              <span className={`px-2.5 py-1 rounded-lg font-bold ${
                post.status === '검수 요청' || post.devStatus === '공식 등록 검토 중'
                  ? 'bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-1'
                  : 'bg-neutral-100 text-neutral-700 border border-neutral-200'
              }`}>
                {(post.status === '검수 요청' || post.devStatus === '공식 등록 검토 중') && <Clock className="w-3.5 h-3.5" />}
                <span>{post.devStatus || post.status}</span>
              </span>

              {isReviewing && (
                <span className="px-2.5 py-1 rounded-lg font-bold bg-amber-500 text-white flex items-center gap-1 shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>공식 등록 심의 중</span>
                </span>
              )}
            </div>

            {/* Author & Timestamps */}
            <div className="flex items-center gap-3 text-xs text-neutral-500">
              <div className="flex items-center gap-2 font-bold text-neutral-800">
                <span className="w-7 h-7 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-xs">
                  {post.author.slice(0, 1)}
                </span>
                <span>{post.author} ({post.department})</span>
              </div>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                최근 업데이트: {post.updatedAt}
              </span>
            </div>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="pt-3 border-t border-neutral-100 flex items-center gap-2 text-xs text-neutral-500">
              <Tag className="w-3.5 h-3.5 text-neutral-400" />
              <div className="flex flex-wrap gap-1.5">
                {post.tags.map((t, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 font-medium text-[11px]">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 2. Screenshot Gallery or Solid Color Placeholder */}
        <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-[#E60012]" />
            화면 이미지 및 미리보기
          </h3>
          {post.screenshots && post.screenshots.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {post.screenshots.map((src, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImage(src)}
                  className="relative rounded-xl border border-neutral-200 overflow-hidden cursor-pointer hover:border-neutral-400 group aspect-video bg-neutral-100"
                >
                  <img
                    src={src}
                    alt={`화면 스크린샷 ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                    <span>크게 보기 🔍</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full h-44 bg-neutral-100 rounded-xl border border-neutral-200/80 flex flex-col items-center justify-center text-neutral-400 p-6">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-2xs border border-neutral-200 flex items-center justify-center text-neutral-400 mb-2">
                {isIdeaStage ? (
                  <Lightbulb className="w-6 h-6 text-amber-500" />
                ) : (
                  <Sparkles className="w-6 h-6 text-[#E60012]" />
                )}
              </div>
              <p className="text-xs font-semibold text-neutral-600">등록된 화면 이미지가 없습니다.</p>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                {isIdeaStage ? '아이디어 기획 단계의 프로젝트입니다.' : 'UI 화면 외 내부 프롬프트 및 파이프라인 개발 중인 프로젝트입니다.'}
              </p>
            </div>
          )}
        </div>

        {/* 3. Prototype / Demo Link Box */}
        <div className="p-5 bg-gradient-to-r from-purple-50 via-purple-50/80 to-indigo-50/60 rounded-2xl border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs shadow-xs">
          <div className="space-y-1">
            <span className="font-bold text-purple-900 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              프로토타입 및 데모 실행 링크
            </span>
            <span className="text-purple-700 text-xs block font-mono">
              {post.prototypeUrl || post.serviceUrl || post.demoVideoUrl || `https://demo.kpc.ai/prototype/${post.id}`}
            </span>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={handleDemoClick}
              className="px-5 py-2.5 bg-purple-900 hover:bg-purple-800 text-white rounded-xl font-bold flex items-center gap-2 cursor-pointer transition-all hover:shadow-md shadow-xs"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>데모 체험하기 →</span>
            </button>
          </div>
        </div>

        {/* 4. Structured 5 Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Section 1: Problem & Background */}
          <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs space-y-3">
            <h3 className="font-bold text-xs text-neutral-900 uppercase tracking-wider flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#E60012]" />
              1. 해결하려는 문제 & 아이디어 배경
            </h3>
            <p className="text-xs sm:text-sm text-neutral-700 whitespace-pre-line leading-relaxed">
              {post.problemAndBackground || post.description}
            </p>
          </div>

          {/* Section 2: Implemented Features */}
          <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs space-y-3">
            <h3 className="font-bold text-xs text-neutral-900 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              2. 현재 구현된 기능
            </h3>
            <p className="text-xs sm:text-sm text-neutral-700 whitespace-pre-line leading-relaxed">
              {post.implementedFeatures || '기본 AI 프롬프트 및 로직 테스트 완료'}
            </p>
          </div>

          {/* Section 3: Testing Progress */}
          <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs space-y-3">
            <h3 className="font-bold text-xs text-neutral-900 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              3. 개발 진행 & 테스트 현황
            </h3>
            <p className="text-xs sm:text-sm text-neutral-700 whitespace-pre-line leading-relaxed">
              {post.testingProgress || '사내 부서 파일럿 테스트 및 피드백 수렴 중'}
            </p>
          </div>

          {/* Section 4: Planned Features */}
          <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs space-y-3">
            <h3 className="font-bold text-xs text-neutral-900 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              4. 추가 예정 기능 (로드맵)
            </h3>
            <p className="text-xs sm:text-sm text-neutral-700 whitespace-pre-line leading-relaxed">
              {post.plannedFeatures || '임직원 피드백 수렴 후 세부 기능 고도화 예정'}
            </p>
          </div>
        </div>

        {/* Section 5: Feedback Wanted */}
        {post.feedbackWanted && (
          <div className="p-6 bg-red-50/50 rounded-2xl border border-red-100 shadow-xs space-y-3">
            <h3 className="font-bold text-xs text-red-900 uppercase tracking-wider flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-[#E60012]" />
              동료 임직원들에게 의견을 받고 싶은 부분
            </h3>
            <p className="text-xs sm:text-sm text-neutral-800 whitespace-pre-line leading-relaxed">
              {post.feedbackWanted}
            </p>
          </div>
        )}

        {/* 5. Version Timeline Updates */}
        {post.timelineUpdates && post.timelineUpdates.length > 0 && (
          <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
                <History className="w-4 h-4 text-[#E60012]" />
                버전별 개발 진행 이력 (업데이트 타임라인)
              </h3>
              {isAuthor && (
                <button
                  type="button"
                  onClick={() => setIsUpdateModalOpen(true)}
                  className="text-xs font-bold text-[#E60012] hover:underline cursor-pointer"
                >
                  + 새 업데이트 추가
                </button>
              )}
            </div>

            <div className="space-y-3">
              {post.timelineUpdates.map((update, idx) => (
                <div key={idx} className="p-4 bg-neutral-50 rounded-xl border border-neutral-200/80 text-xs space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md bg-neutral-900 text-white font-mono font-bold text-[11px]">
                        {update.version}
                      </span>
                      <span className="font-bold text-neutral-900 text-xs sm:text-sm">{update.title}</span>
                    </div>
                    <span className="text-neutral-400 font-mono text-[11px]">{update.date}</span>
                  </div>
                  <ul className="list-disc list-inside text-neutral-600 space-y-1 pl-1">
                    {update.changes.map((ch, cIdx) => (
                      <li key={cIdx}>{ch}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. Comments & Peer Feedback Section (댓글 소통) */}
        <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-neutral-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-[#E60012]" />
              <span>댓글 ({totalCommentsCount})</span>
            </h3>
          </div>

          {/* Add Comment Input Form */}
          <form onSubmit={handleAddCommentSubmit} className="p-4 sm:p-5 bg-neutral-50 rounded-2xl border border-neutral-200/90 space-y-3">
            <textarea
              rows={3}
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              placeholder="동료의 AI 개발 아이디어에 피드백이나 질문, 응원의 댓글을 남겨주세요."
              className="w-full p-3.5 bg-white border border-neutral-300 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-neutral-900 resize-none shadow-2xs"
            />

            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-400 font-medium">
                작성자: 정소담 (AI전략팀)
              </span>
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#E60012] hover:bg-[#CC0010] text-white rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
              >
                <Send className="w-4 h-4" />
                <span>댓글 등록</span>
              </button>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <div className="p-8 text-center text-xs sm:text-sm text-neutral-400 bg-neutral-50 rounded-2xl">
                첫 번째 댓글을 남겨 동료와 의견을 나눠보세요.
              </div>
            ) : (
              comments.map(c => (
                <div key={c.id} className="p-5 bg-neutral-50/70 rounded-2xl border border-neutral-200/80 space-y-3.5">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-xs">
                        {c.author.slice(0, 1)}
                      </div>
                      <span className="font-bold text-xs sm:text-sm text-neutral-900">{c.author}</span>
                      <span className="text-xs text-neutral-400">{c.department}</span>
                      <span className="text-xs text-neutral-400">· {c.createdAt}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleStartReply(c.id, c.author)}
                      className="text-xs font-bold text-neutral-500 hover:text-[#E60012] cursor-pointer transition-colors flex items-center gap-1"
                    >
                      <CornerDownRight className="w-3.5 h-3.5" />
                      <span>답글 달기</span>
                    </button>
                  </div>

                  <div className="text-xs sm:text-sm text-neutral-800 leading-relaxed pl-9">
                    {renderContentWithMentions(c.content)}
                  </div>

                  {/* Subordinated Replies list */}
                  {c.replies && c.replies.length > 0 && (
                    <div className="relative pl-4 sm:pl-5 ml-4 sm:ml-5 border-l-2 border-neutral-200 space-y-2.5 pt-1">
                      {c.replies.map(rep => (
                        <div
                          key={rep.id}
                          className="p-3.5 bg-white rounded-xl border border-neutral-200/90 text-xs space-y-1.5 shadow-2xs group hover:border-neutral-300 transition-colors"
                        >
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                              <CornerDownRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                              <div className="w-5 h-5 rounded-full bg-neutral-800 text-white flex items-center justify-center font-bold text-[10px]">
                                {rep.author.slice(0, 1)}
                              </div>
                              <span className="font-bold text-neutral-900">{rep.author}</span>
                              <span className="text-[11px] text-neutral-400">{rep.department} · {rep.createdAt}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleStartReply(c.id, rep.author)}
                              className="opacity-0 group-hover:opacity-100 text-[11px] font-bold text-neutral-500 hover:text-[#E60012] transition-opacity cursor-pointer flex items-center gap-1"
                            >
                              <CornerDownRight className="w-3 h-3" />
                              <span>답글</span>
                            </button>
                          </div>
                          <div className="text-neutral-800 leading-relaxed pl-6">
                            {renderContentWithMentions(rep.content)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Subordinated Reply Input Form */}
                  {replyingToCommentId === c.id && (
                    <div className="pl-4 sm:pl-5 ml-4 sm:ml-5 border-l-2 border-red-300 pt-2 space-y-2">
                      <div className="flex items-center justify-between px-3 py-1.5 bg-red-50/80 border border-red-200/80 rounded-xl text-xs">
                        <span className="flex items-center gap-1.5 text-neutral-700 font-medium">
                          <CornerDownRight className="w-3.5 h-3.5 text-[#E60012]" />
                          <span><strong className="text-[#E60012]">@{replyingToAuthor || c.author}</strong> 님에게 답글 작성 중</span>
                        </span>
                        <button
                          type="button"
                          onClick={handleCancelReply}
                          className="text-neutral-400 hover:text-neutral-700 text-xs font-semibold cursor-pointer"
                        >
                          ✕ 취소
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        autoFocus
                        value={replyText}
                        onChange={e => setReplyText(e.target.value)}
                        placeholder={`@${replyingToAuthor || c.author} 님에게 답글을 입력하세요...`}
                        className="w-full p-3 bg-white border border-neutral-300 rounded-xl text-xs focus:outline-hidden focus:border-neutral-900 shadow-2xs"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={handleCancelReply}
                          className="px-3 py-1.5 text-xs text-neutral-500 hover:text-neutral-900 cursor-pointer font-medium"
                        >
                          취소
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddReplySubmit(c.id, replyingToAuthor || c.author)}
                          className="px-4 py-1.5 bg-neutral-900 hover:bg-black text-white rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-1"
                        >
                          <span>답글 등록</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Bottom Spacing */}
        <div className="pb-12" />
      </div>

      {/* Submodal: Update version */}
      {isUpdateModalOpen && (
        <CommunityUpdateModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          currentVersion={post.version}
          onAddUpdate={(update) => {
            if (onAddUpdate) onAddUpdate(post.id, update);
          }}
          onShowToast={onShowToast}
        />
      )}

      {/* Submodal: Official Submission */}
      {isOfficialSubmitModalOpen && (
        <OfficialSubmissionModal
          post={post}
          isOpen={isOfficialSubmitModalOpen}
          onClose={() => setIsOfficialSubmitModalOpen(false)}
          onSubmitOfficial={(postId, data) => {
            if (onSubmitOfficial) onSubmitOfficial(postId, data);
          }}
          onShowToast={onShowToast}
        />
      )}

      {/* Image Preview Lightbox */}
      {selectedImage && (
        <div 
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img 
              src={selectedImage} 
              alt="확대 이미지" 
              referrerPolicy="no-referrer"
              className="max-w-full max-h-[85vh] rounded-xl object-contain shadow-2xl" 
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-red-400 font-bold text-sm"
            >
              닫기 ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
