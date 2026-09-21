import React from 'react';
import { X, CheckCircle2, ShieldCheck, Sparkles, Layout, Bot, ArrowRight } from 'lucide-react';
import { CommunityAgent } from '../../types';

interface RegisterAgentConfirmModalProps {
  post: CommunityAgent | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (post: CommunityAgent) => void;
}

export const RegisterAgentConfirmModal: React.FC<RegisterAgentConfirmModalProps> = ({
  post,
  isOpen,
  onClose,
  onConfirm
}) => {
  if (!isOpen || !post) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        id="register-agent-confirm-modal"
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-neutral-200 bg-neutral-50/70 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-[#E60012] border border-red-200 flex items-center justify-center shadow-2xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">
                공식 AI Agent로 등록
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Community 게시글을 사내 검수 완료된 공식 AI Agent로 등재합니다.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-neutral-700 leading-relaxed">
            이 Community 게시글을 <strong>검수 완료된 공식 AI Agent</strong>로 등록하시겠습니까?
          </p>

          {/* 대상 정보 요약 카드 */}
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-800 text-[10px] font-mono font-bold">
                  {post.version}
                </span>
                <span className="text-xs font-semibold text-neutral-600">
                  {post.category}
                </span>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                <CheckCircle2 className="w-3 h-3" />
                <span>검수 완료 (예정)</span>
              </span>
            </div>

            <div className="text-sm font-bold text-neutral-900 leading-snug">
              {post.title}
            </div>

            <p className="text-xs text-neutral-600 line-clamp-2">
              {post.shortDesc || post.description}
            </p>

            <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-2 border-t border-neutral-200/80">
              <span>제작자: <strong>{post.author}</strong> ({post.department})</span>
              <span>좋아요 {post.likes} · 댓글 {post.commentsCount}</span>
            </div>
          </div>

          {/* 안전 정책 안내 */}
          <div className="p-3 bg-red-50/50 rounded-xl border border-red-100 text-[11px] text-neutral-600 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-[#E60012] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-neutral-800 block">원본 게시글 보존 원칙</span>
              Community 원본 게시글은 삭제되지 않고, <strong>[AI Agent 등록 완료]</strong> 뱃지가 부여되어 공식 화면으로 연동됩니다.
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50/50 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-700 text-xs font-semibold cursor-pointer"
          >
            취소
          </button>
          <button
            type="button"
            id="confirm-register-agent-btn"
            onClick={() => {
              onConfirm(post);
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-[#E60012] hover:bg-[#CC0010] text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>AI Agent로 등록</span>
          </button>
        </div>
      </div>
    </div>
  );
};

interface RegisterCustomAiConfirmModalProps {
  post: CommunityAgent | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (post: CommunityAgent) => void;
}

export const RegisterCustomAiConfirmModal: React.FC<RegisterCustomAiConfirmModalProps> = ({
  post,
  isOpen,
  onClose,
  onConfirm
}) => {
  if (!isOpen || !post) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        id="register-custom-ai-confirm-modal"
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-neutral-200 bg-neutral-50/70 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-[#E60012] border border-red-200 flex items-center justify-center shadow-2xs">
              <Layout className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900">
                공식 Custom AI로 등록
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                Community 프로젝트를 공식 Custom AI 서비스 화면으로 등재합니다.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-neutral-700 leading-relaxed">
            이 Community 프로젝트를 <strong>공식 Custom AI 서비스</strong>로 등록하시겠습니까?
          </p>

          {/* 대상 정보 요약 카드 */}
          <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-red-200 bg-red-50 text-[#E60012] text-[11px] font-bold">
                <Layout className="w-3 h-3" />
                <span>Custom AI Application</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-800 text-[10px] font-mono font-bold">
                {post.version}
              </span>
            </div>

            <div className="text-sm font-bold text-neutral-900 leading-snug">
              {post.title}
            </div>

            <p className="text-xs text-neutral-600 line-clamp-2">
              {post.shortDesc || post.description}
            </p>

            <div className="grid grid-cols-2 gap-2 text-[11px] text-neutral-600 pt-2 border-t border-neutral-200/80">
              <div>
                <span className="text-neutral-400 block text-[10px]">서비스 기획/제작</span>
                <strong>{post.author}</strong> ({post.department})
              </div>
              <div>
                <span className="text-neutral-400 block text-[10px]">실행 인터페이스</span>
                <strong>화면 기반 독립형 UI</strong>
              </div>
            </div>
          </div>

          {/* 안전 정책 안내 */}
          <div className="p-3 bg-red-50/50 rounded-xl border border-red-100 text-[11px] text-neutral-600 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-[#E60012] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-neutral-800 block">원본 게시글 보존 원칙</span>
              Community 원본 게시글은 삭제되지 않으며, <strong>[Custom AI 등록 완료]</strong> 뱃지가 부여되어 공식 서비스로 즉시 이동할 수 있습니다.
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50/50 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-700 text-xs font-semibold cursor-pointer"
          >
            취소
          </button>
          <button
            type="button"
            id="confirm-register-custom-ai-btn"
            onClick={() => {
              onConfirm(post);
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-[#E60012] hover:bg-[#CC0010] text-white text-xs font-bold shadow-xs cursor-pointer flex items-center gap-1.5"
          >
            <Layout className="w-3.5 h-3.5" />
            <span>Custom AI로 등록</span>
          </button>
        </div>
      </div>
    </div>
  );
};
