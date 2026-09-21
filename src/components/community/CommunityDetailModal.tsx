import React, { useState } from 'react';
import { 
  X, 
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
  CornerDownRight,
  Play
} from 'lucide-react';
import { 
  CommunityAgent, 
  CommunityComment, 
  UserRole, 
  CommunityTimelineUpdate 
} from '../../types';
import { CommunityUpdateModal } from './CommunityUpdateModal';
import { OfficialSubmissionModal } from './OfficialSubmissionModal';

interface CommunityDetailModalProps {
  post: CommunityAgent | null;
  userRole?: UserRole;
  onClose: () => void;
  onToggleLike: (postId: string) => void;
  onNavigateToAgent?: (agentId?: string) => void;
  onNavigateToCustomAi?: (targetId?: string) => void;
  onShowToast: (msg: string) => void;
  onAddComment?: (postId: string, comment: Partial<CommunityComment> & { parentCommentId?: string }) => void;
  onAddUpdate?: (postId: string, update: CommunityTimelineUpdate) => void;
  onSubmitOfficial?: (postId: string, submissionData: any) => void;
}

export const CommunityDetailModal: React.FC<CommunityDetailModalProps> = ({
  post,
  userRole = 'user',
  onClose,
  onToggleLike,
  onNavigateToAgent,
  onNavigateToCustomAi,
  onShowToast,
  onAddComment,
  onAddUpdate,
  onSubmitOfficial
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
    if (!post) return;
    try {
      const fullUrl = `${window.location.origin}${window.location.pathname}?demo=${post.id}`;
      window.open(fullUrl, '_blank');
    } catch {
      // ignore
    }
  };

  if (!post) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="community-detail-modal"
        className="relative w-full max-w-4xl max-h-[92vh] bg-white rounded-2xl shadow-2xl border border-neutral-200 flex flex-col overflow-hidden"
      >
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-900 text-white shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#E60012] flex items-center justify-center text-white shrink-0 shadow-xs">
              {isIdeaStage ? (
                <Lightbulb className="w-5 h-5" />
              ) : (
                <Sparkles className="w-5 h-5" />
              )}
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-white truncate">
                {post.title}
              </h2>
              <div className="flex items-center gap-2 flex-wrap mt-1 text-xs text-neutral-300">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-neutral-800 text-neutral-200">
                  {isIdeaStage ? 'AI 아이디어' : 'AI 개발'}
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-neutral-800 text-neutral-300">
                  {post.version}
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-neutral-700 text-neutral-100">
                  {post.devStatus || post.status}
                </span>
                {isReviewing && (
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500 text-white flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>공식 등록 검토 중</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Toolbar Header */}
        <div className="px-6 py-3 bg-neutral-50 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 text-xs">
          <div className="flex items-center gap-3 text-neutral-500 flex-wrap">
            <div className="flex items-center gap-1.5 font-semibold text-neutral-800">
              <span className="w-6 h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-[10px]">
                {post.author.slice(0, 1)}
              </span>
              <span>{post.author} ({post.department})</span>
            </div>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-neutral-400" />
              최초 등록: {post.createdAt}
            </span>
            <span>•</span>
            <span>최근 업데이트: {post.updatedAt}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Like Button */}
            <button
              type="button"
              onClick={() => onToggleLike(post.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                post.userLiked
                  ? 'bg-red-50 text-[#E60012] border-red-200 shadow-2xs'
                  : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${post.userLiked ? 'fill-current' : ''}`} />
              <span>좋아요 {post.likes}</span>
            </button>

            {/* Author Actions */}
            {isAuthor && (
              <>
                <button
                  type="button"
                  onClick={() => setIsUpdateModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-300 hover:bg-neutral-100 text-neutral-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#E60012]" />
                  <span>업데이트 작성</span>
                </button>

                {!isIdeaStage && (
                  <button
                    type="button"
                    onClick={() => setIsOfficialSubmitModalOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-neutral-900 hover:bg-black text-white rounded-xl text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#E60012]" />
                    <span>공식 등록 제출</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
          
          {/* One-Line Description Banner */}
          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/80">
            <p className="text-sm sm:text-base font-semibold text-neutral-900 leading-relaxed">
              {post.oneLineDesc || post.shortDesc || post.description}
            </p>
          </div>

          {/* Screenshot Gallery or Solid Color Placeholder */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-[#E60012]" />
              화면 이미지 및 미리보기
            </h3>
            {post.screenshots && post.screenshots.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {post.screenshots.map((src, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedImage(src)}
                    className="relative rounded-xl border border-neutral-200 overflow-hidden cursor-pointer hover:border-neutral-400 group"
                  >
                    <img
                      src={src}
                      alt={`화면 스크린샷 ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1">
                      <span>크게 보기</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full h-36 bg-neutral-100 rounded-xl border border-neutral-200/80 flex flex-col items-center justify-center text-neutral-400 p-4">
                <div className="w-10 h-10 rounded-xl bg-white shadow-2xs border border-neutral-200 flex items-center justify-center text-neutral-400 mb-1.5">
                  {isIdeaStage ? (
                    <Lightbulb className="w-5 h-5 text-amber-500" />
                  ) : (
                    <Sparkles className="w-5 h-5 text-[#E60012]" />
                  )}
                </div>
                <p className="text-xs font-semibold text-neutral-600">등록된 화면 이미지가 없습니다.</p>
                <p className="text-[11px] text-neutral-400">
                  {isIdeaStage ? '아이디어 기획 단계의 프로젝트입니다.' : 'UI 화면 외 내부 프롬프트 및 파이프라인 개발 중인 프로젝트입니다.'}
                </p>
              </div>
            )}
          </div>

          {/* Prototype / Demo link */}
          <div className="p-4 bg-gradient-to-r from-purple-50 via-purple-50/80 to-indigo-50/60 rounded-2xl border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
            <div className="space-y-0.5">
              <span className="font-bold text-purple-900 block flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                프로토타입 및 데모 실행 링크
              </span>
              <span className="text-purple-700 font-mono text-[11px] block truncate max-w-md">
                {post.prototypeUrl || post.serviceUrl || post.demoVideoUrl || `https://demo.kpc.ai/prototype/${post.id}`}
              </span>
            </div>
            <button
              type="button"
              onClick={handleDemoClick}
              className="px-4 py-2 bg-purple-900 hover:bg-purple-800 text-white rounded-xl font-bold flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-xs transition-all hover:shadow-md"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>데모 체험하기</span>
            </button>
          </div>

          {/* 5-Section Structured Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Problem & Background */}
            <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200 space-y-2">
              <h3 className="font-bold text-xs text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#E60012]" />
                1. 해결하려는 문제 & 아이디어 배경
              </h3>
              <p className="text-xs text-neutral-700 whitespace-pre-line leading-relaxed">
                {post.problemAndBackground || post.description}
              </p>
            </div>

            {/* 2. Implemented Features */}
            <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200 space-y-2">
              <h3 className="font-bold text-xs text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                2. 현재 구현된 기능
              </h3>
              <p className="text-xs text-neutral-700 whitespace-pre-line leading-relaxed">
                {post.implementedFeatures || '기본 AI 프롬프트 및 로직 테스트 완료'}
              </p>
            </div>

            {/* 3. Testing Progress */}
            <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200 space-y-2">
              <h3 className="font-bold text-xs text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                3. 개발 진행 & 테스트 현황
              </h3>
              <p className="text-xs text-neutral-700 whitespace-pre-line leading-relaxed">
                {post.testingProgress || '사내 부서 파일럿 테스트 및 피드백 수렴 중'}
              </p>
            </div>

            {/* 4. Planned Features */}
            <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200 space-y-2">
              <h3 className="font-bold text-xs text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                4. 추가 예정 기능 (로드맵)
              </h3>
              <p className="text-xs text-neutral-700 whitespace-pre-line leading-relaxed">
                {post.plannedFeatures || '임직원 피드백 수렴 후 세부 기능 고도화 예정'}
              </p>
            </div>
          </div>

          {/* 5. Feedback Wanted Section */}
          {post.feedbackWanted && (
            <div className="p-4 bg-red-50/50 rounded-2xl border border-red-100 space-y-2">
              <h3 className="font-bold text-xs text-red-900 uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-[#E60012]" />
                동료 임직원들에게 의견을 받고 싶은 부분
              </h3>
              <p className="text-xs text-neutral-800 whitespace-pre-line leading-relaxed">
                {post.feedbackWanted}
              </p>
            </div>
          )}

          {/* Timeline & Version Updates */}
          {post.timelineUpdates && post.timelineUpdates.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-[#E60012]" />
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

              <div className="space-y-2.5">
                {post.timelineUpdates.map((update, idx) => (
                  <div key={idx} className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-neutral-900 text-white font-mono font-bold text-[10px]">
                          {update.version}
                        </span>
                        <span className="font-bold text-neutral-900">{update.title}</span>
                      </div>
                      <span className="text-neutral-400 font-mono text-[11px]">{update.date}</span>
                    </div>
                    <ul className="list-disc list-inside text-neutral-600 space-y-0.5 pl-1">
                      {update.changes.map((ch, cIdx) => (
                        <li key={cIdx}>{ch}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              Comments & Peer Feedback Section (댓글로만 소통)
              ───────────────────────────────────────────────────────────── */}
          <div className="pt-6 border-t border-neutral-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-neutral-900 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-[#E60012]" />
                <span>댓글 ({totalCommentsCount})</span>
              </h3>
            </div>

            {/* Add Comment Input Form */}
            <form onSubmit={handleAddCommentSubmit} className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3">
              <textarea
                rows={2}
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder="동료의 AI 개발 아이디어에 피드백이나 질문, 응원의 댓글을 남겨주세요."
                className="w-full p-3 bg-white border border-neutral-300 rounded-xl text-xs focus:outline-hidden focus:border-neutral-900 resize-none"
              />

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-neutral-400">
                  작성자: 정소담 (AI전략팀)
                </span>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#E60012] hover:bg-[#CC0010] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>댓글 등록</span>
                </button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-3">
              {comments.length === 0 ? (
                <div className="p-6 text-center text-xs text-neutral-400 bg-neutral-50 rounded-xl">
                  첫 번째 댓글을 남겨 동료와 의견을 나눠보세요.
                </div>
              ) : (
                comments.map(c => (
                  <div key={c.id} className="p-4 bg-white rounded-2xl border border-neutral-200 space-y-2.5">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-[10px]">
                          {c.author.slice(0, 1)}
                        </div>
                        <span className="font-bold text-xs text-neutral-900">{c.author}</span>
                        <span className="text-[11px] text-neutral-400">{c.department}</span>
                        <span className="text-[11px] text-neutral-400">· {c.createdAt}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleStartReply(c.id, c.author)}
                        className="text-xs font-bold text-neutral-500 hover:text-[#E60012] cursor-pointer flex items-center gap-1"
                      >
                        <CornerDownRight className="w-3.5 h-3.5" />
                        <span>답글 달기</span>
                      </button>
                    </div>

                    <div className="text-xs text-neutral-800 leading-relaxed pl-8">
                      {renderContentWithMentions(c.content)}
                    </div>

                    {/* Subordinated Replies list */}
                    {c.replies && c.replies.length > 0 && (
                      <div className="pl-6 ml-4 border-l-2 border-neutral-200 space-y-2 pt-1">
                        {c.replies.map(rep => (
                          <div key={rep.id} className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs space-y-1 group">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <CornerDownRight className="w-3 h-3 text-neutral-400 shrink-0" />
                                <span className="font-bold text-neutral-900">{rep.author}</span>
                                <span className="text-[10px] text-neutral-400">{rep.department} · {rep.createdAt}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleStartReply(c.id, rep.author)}
                                className="opacity-0 group-hover:opacity-100 text-[10px] font-bold text-neutral-500 hover:text-[#E60012] cursor-pointer"
                              >
                                답글
                              </button>
                            </div>
                            <div className="text-neutral-700 pl-5">
                              {renderContentWithMentions(rep.content)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Subordinated Reply Input Form */}
                    {replyingToCommentId === c.id && (
                      <div className="pl-6 ml-4 border-l-2 border-red-300 pt-2 space-y-2">
                        <div className="flex items-center justify-between px-3 py-1 bg-red-50 text-[11px] rounded-lg border border-red-200">
                          <span className="text-neutral-700 font-medium flex items-center gap-1">
                            <CornerDownRight className="w-3 h-3 text-[#E60012]" />
                            <span><strong className="text-[#E60012]">@{replyingToAuthor || c.author}</strong> 님에게 답글</span>
                          </span>
                          <button
                            type="button"
                            onClick={handleCancelReply}
                            className="text-neutral-400 hover:text-neutral-700"
                          >
                            ✕
                          </button>
                        </div>
                        <textarea
                          rows={2}
                          autoFocus
                          value={replyText}
                          onChange={e => setReplyText(e.target.value)}
                          placeholder={`@${replyingToAuthor || c.author} 님에게 답글을 입력하세요...`}
                          className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs focus:outline-hidden focus:border-neutral-900"
                        />
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={handleCancelReply}
                            className="px-3 py-1 text-xs text-neutral-500 hover:text-neutral-900 cursor-pointer"
                          >
                            취소
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAddReplySubmit(c.id, replyingToAuthor || c.author)}
                            className="px-3 py-1 bg-neutral-900 hover:bg-black text-white rounded-lg text-xs font-bold cursor-pointer"
                          >
                            답글 등록
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between shrink-0 text-xs">
          <div className="flex items-center gap-2 text-neutral-500">
            <Tag className="w-3.5 h-3.5" />
            <div className="flex flex-wrap gap-1">
              {post.tags.map((t, idx) => (
                <span key={idx} className="font-semibold text-neutral-700">#{t}</span>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl font-bold cursor-pointer transition-colors"
          >
            닫기
          </button>
        </div>
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
