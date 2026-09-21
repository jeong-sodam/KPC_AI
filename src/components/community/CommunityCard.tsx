import React, { useState, useRef, useEffect } from 'react';
import { 
  Heart, 
  MessageSquare, 
  History, 
  Bot, 
  Layout, 
  Lightbulb, 
  Clock, 
  Calendar,
  Sparkles,
  Zap,
  BarChart2,
  FileText,
  Search,
  BrainCircuit,
  Wand2,
  ShieldCheck,
  Eye,
  Bookmark,
  MoreVertical,
  Trash2,
  Settings
} from 'lucide-react';
import { CommunityAgent, UserRole } from '../../types';

interface CommunityCardProps {
  post: CommunityAgent;
  userRole?: UserRole;
  onOpenDetail: (post: CommunityAgent) => void;
  onToggleLike: (postId: string) => void;
  onToggleSave?: (postId: string) => void;
  onDeletePost?: (postId: string) => void;
  onNavigateToAgent?: (agentId?: string) => void;
  onNavigateToCustomAi?: (targetId?: string) => void;
  onRequestOfficialRegister?: (post: CommunityAgent) => void;
}

export const CommunityCard: React.FC<CommunityCardProps> = ({
  post,
  userRole = 'user',
  onOpenDetail,
  onToggleLike,
  onToggleSave,
  onDeletePost,
  onRequestOfficialRegister
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  const previewImage = post.screenshots?.[0] || post.mainImageUrl || post.thumbnailUrl;

  return (
    <div
      id={`community-card-${post.id}`}
      onClick={() => onOpenDetail(post)}
      className={`group bg-white rounded-2xl border border-neutral-200/80 hover:border-neutral-400 hover:shadow-xl transition-all duration-200 flex flex-col cursor-pointer relative ${
        showMenu ? 'z-50 overflow-visible' : 'z-0 overflow-hidden'
      }`}
    >
      {/* Top Banner Image or Solid Color Format (단색 채움으로 전체적인 포맷 통일) */}
      <div className="relative w-full h-40 bg-neutral-100 shrink-0 border-b border-neutral-100 rounded-t-2xl">
        <div className="w-full h-full rounded-t-2xl overflow-hidden">
          {previewImage ? (
            <img
              src={previewImage}
              alt={post.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-100 text-neutral-400 group-hover:bg-neutral-200/60 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-2xs border border-neutral-200/80 flex items-center justify-center text-neutral-500 group-hover:scale-110 group-hover:text-[#E60012] transition-all duration-300">
                <Sparkles className="w-6 h-6 text-[#E60012]" />
              </div>
              <span className="mt-2 text-[11px] font-semibold text-neutral-500">
                {post.devStatus || post.status || 'AI 프로젝트'}
              </span>
            </div>
          )}
        </div>

        {/* Top-Right Controls: Bookmark (left), Settings / More (right) */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20">
          {/* Bookmark Button (설정 아이콘 왼쪽) */}
          {onToggleSave && (
            <button
              type="button"
              id={`community-bookmark-btn-${post.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave(post.id);
              }}
              className={`w-7 h-7 rounded-lg bg-white/95 hover:bg-white flex items-center justify-center border border-neutral-200/80 shadow-xs transition-colors cursor-pointer ${
                post.isSaved ? 'text-amber-500 font-bold' : 'text-neutral-500 hover:text-neutral-900'
              }`}
              title={post.isSaved ? '보관 취소' : '보관함에 저장'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${post.isSaved ? 'fill-amber-500 text-amber-500' : ''}`} />
            </button>
          )}

          {/* Settings / More Menu (⋮) */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              id={`community-menu-btn-${post.id}`}
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all cursor-pointer shadow-xs ${
                showMenu
                  ? 'bg-neutral-900 text-white border-neutral-900'
                  : 'bg-white/95 text-neutral-600 border-neutral-200/80 hover:bg-white hover:text-neutral-900'
              }`}
              title="게시글 설정"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-full mt-1.5 w-44 bg-white rounded-xl shadow-2xl border border-neutral-200 py-1 z-50 text-xs animate-in fade-in zoom-in-95 duration-100 text-left"
              >
                <div className="px-3 py-1.5 text-[10px] font-bold text-neutral-400 uppercase tracking-wider border-b border-neutral-100">
                  게시글 설정
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    onOpenDetail(post);
                  }}
                  className="w-full px-3 py-2 text-xs text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                  <span>상세 보기 및 피드백</span>
                </button>

                {onRequestOfficialRegister && post.status !== '승인 완료' && post.devStatus !== '검증 완료' && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      onRequestOfficialRegister(post);
                    }}
                    className="w-full px-3 py-2 text-xs text-[#E60012] hover:bg-red-50 flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-[#E60012] shrink-0" />
                    <span>공식 승격 검수</span>
                  </button>
                )}

                {(userRole === 'admin' || post.author === '정소담') && onDeletePost && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowMenu(false);
                      if (confirm(`'${post.title}' 게시글을 삭제하시겠습니까?`)) {
                        onDeletePost(post.id);
                      }
                    }}
                    className="w-full px-3 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer transition-colors border-t border-neutral-100"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <span>삭제</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3.5">
        <div className="space-y-2.5">
          {/* 1. Title & Icon at the Top */}
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-neutral-900 text-white flex items-center justify-center shrink-0 shadow-2xs overflow-hidden mt-0.5">
              {post.icon && (post.icon.startsWith('data:image') || post.icon.startsWith('http') || post.icon.startsWith('/')) ? (
                <img src={post.icon} alt={post.title} className="w-full h-full object-cover" />
              ) : post.icon === 'sparkles' ? (
                <Sparkles className="w-4 h-4 text-[#E60012]" />
              ) : post.icon === 'lightbulb' ? (
                <Lightbulb className="w-4 h-4 text-amber-400" />
              ) : post.icon === 'layout' ? (
                <Layout className="w-4 h-4 text-purple-400" />
              ) : post.icon === 'file-text' ? (
                <FileText className="w-4 h-4 text-blue-400" />
              ) : post.icon === 'chart' ? (
                <BarChart2 className="w-4 h-4 text-emerald-400" />
              ) : post.icon === 'zap' ? (
                <Zap className="w-4 h-4 text-yellow-400" />
              ) : post.icon === 'search' ? (
                <Search className="w-4 h-4 text-cyan-400" />
              ) : post.icon === 'brain' ? (
                <BrainCircuit className="w-4 h-4 text-pink-400" />
              ) : post.icon === 'wand' ? (
                <Wand2 className="w-4 h-4 text-indigo-400" />
              ) : post.icon === 'message' ? (
                <MessageSquare className="w-4 h-4 text-green-400" />
              ) : post.icon === 'shield' ? (
                <ShieldCheck className="w-4 h-4 text-blue-500" />
              ) : (
                <Sparkles className="w-4 h-4 text-[#E60012]" />
              )}
            </div>
            <h3 className="text-base font-bold text-neutral-900 line-clamp-2 group-hover:text-[#E60012] transition-colors leading-snug h-[44px] flex items-center">
              {post.title}
            </h3>
          </div>

          {/* 2. Description */}
          <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed h-[36px]">
            {post.oneLineDesc || post.shortDesc || post.description}
          </p>
        </div>

        {/* 3. Badges, Status & Update Date (Moved BELOW title & description) */}
        <div className="space-y-2 pt-1 border-t border-neutral-100">
          {/* Badges Row */}
          <div className="flex items-center flex-wrap gap-1.5 text-[11px] min-h-[22px]">
            {/* Version */}
            <span className="px-1.5 py-0.5 rounded-md font-mono font-bold bg-neutral-100 text-neutral-700 text-[10px] border border-neutral-200">
              {post.version}
            </span>

            {/* Status */}
            <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
              post.status === '검수 요청' || post.devStatus === '공식 등록 검토 중'
                ? 'bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-0.5'
                : 'bg-neutral-100 text-neutral-700 border border-neutral-200'
            }`}>
              {(post.status === '검수 요청' || post.devStatus === '공식 등록 검토 중') && <Clock className="w-2.5 h-2.5" />}
              <span>{post.devStatus || post.status}</span>
            </span>
          </div>

          {/* Update Date & Tags Row */}
          <div className="flex items-center justify-between text-[11px] text-neutral-500 min-h-[22px]">
            <span className="flex items-center gap-1 text-[11px] text-neutral-500 font-medium shrink-0">
              <Calendar className="w-3 h-3 text-neutral-400" />
              <span>최근 업데이트: {post.updatedAt}</span>
            </span>

            {/* Tags */}
            <div className="flex items-center gap-1 shrink-0">
              {post.tags.slice(0, 2).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-1.5 py-0.2 rounded bg-neutral-50 text-neutral-500 text-[10px] whitespace-nowrap"
                >
                  #{tag}
                </span>
              ))}
              {post.tags.length > 2 && (
                <span className="text-[10px] text-neutral-400 whitespace-nowrap">
                  +{post.tags.length - 2}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 4. Footer: Author & Metrics */}
        <div className="pt-2.5 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-[10px]">
              {post.author.slice(0, 1)}
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-neutral-800 text-[11px]">{post.author}</span>
              <span className="text-[9px] text-neutral-400">{post.department}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            {/* Likes */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleLike(post.id);
              }}
              className={`flex items-center gap-1 hover:text-[#E60012] transition-colors cursor-pointer ${
                post.userLiked ? 'text-[#E60012] font-bold' : ''
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${post.userLiked ? 'fill-current' : ''}`} />
              <span>{post.likes}</span>
            </button>

            {/* Comments */}
            <div className="flex items-center gap-1 text-neutral-500" title="댓글">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{post.comments ? post.comments.reduce((acc, c) => acc + 1 + (c.replies?.length || 0), 0) : (post.commentsCount || 0)}</span>
            </div>

            {/* Views (조회수) */}
            <div className="flex items-center gap-1 text-neutral-500" title="조회수">
              <Eye className="w-3.5 h-3.5 text-neutral-400" />
              <span>{(post.views || 0).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
