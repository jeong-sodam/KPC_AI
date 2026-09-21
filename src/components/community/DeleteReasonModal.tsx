import React, { useState } from 'react';
import { Trash2, X } from 'lucide-react';

interface DeleteReasonItem {
  id: string;
  title: string;
  author: string;
  department: string;
}

interface DeleteReasonModalProps {
  agent: DeleteReasonItem | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: (agentId: string, reason: string) => void;
}

export const DeleteReasonModal: React.FC<DeleteReasonModalProps> = ({
  agent,
  isOpen,
  onClose,
  onConfirmDelete,
}) => {
  const [reason, setReason] = useState('');

  if (!isOpen || !agent) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;
    onConfirmDelete(agent.id, reason.trim());
    setReason('');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-neutral-50/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
              <Trash2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-neutral-900">
              관리자 삭제 사유 입력
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 본문 폼 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80">
            <span className="text-[11px] font-bold text-neutral-500 block mb-0.5">삭제 대상</span>
            <div className="text-xs font-bold text-neutral-900 truncate">
              {agent.title}
            </div>
            <div className="text-[11px] text-neutral-500 mt-0.5">
              작성자: {agent.author} ({agent.department})
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1.5">
              삭제 사유 <span className="text-red-500">*</span>
            </label>
            <textarea
              autoFocus
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="삭제 사유를 입력하세요 (예: 보안 검수 기준 미충족, 중복 등록, 서비스 운영 정책 위반 등)"
              rows={4}
              className="w-full px-3.5 py-2.5 bg-neutral-50 focus:bg-white rounded-xl border border-neutral-200 focus:border-red-500 text-xs text-neutral-900 placeholder:text-neutral-400 outline-none transition-all resize-none"
            />
          </div>

          {/* 버튼 영역 */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-neutral-300 text-neutral-700 hover:bg-neutral-100 text-xs font-semibold cursor-pointer transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!reason.trim()}
              className="px-4 py-2 rounded-lg bg-[#E60012] hover:bg-[#CC0010] disabled:bg-neutral-300 disabled:cursor-not-allowed text-white text-xs font-bold shadow-2xs cursor-pointer transition-all"
            >
              삭제 실행
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
