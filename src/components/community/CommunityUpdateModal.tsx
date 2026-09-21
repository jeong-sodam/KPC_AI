import React, { useState } from 'react';
import { X, History, Sparkles, Plus, Trash2, GitBranch } from 'lucide-react';
import { CommunityTimelineUpdate } from '../../types';

interface CommunityUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentVersion: string;
  onAddUpdate: (update: CommunityTimelineUpdate) => void;
  onShowToast: (msg: string) => void;
}

export const CommunityUpdateModal: React.FC<CommunityUpdateModalProps> = ({
  isOpen,
  onClose,
  currentVersion,
  onAddUpdate,
  onShowToast
}) => {
  const [version, setVersion] = useState(
    currentVersion.startsWith('v') 
      ? `v${(parseFloat(currentVersion.replace('v', '')) + 0.1).toFixed(1)}` 
      : 'v0.2'
  );
  const [title, setTitle] = useState('');
  const [changeInput, setChangeInput] = useState('');
  const [changesList, setChangesList] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleAddChange = () => {
    if (!changeInput.trim()) return;
    setChangesList([...changesList, changeInput.trim()]);
    setChangeInput('');
  };

  const handleRemoveChange = (index: number) => {
    setChangesList(changesList.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      onShowToast('업데이트 제목을 입력해주세요.');
      return;
    }
    if (changesList.length === 0 && !changeInput.trim()) {
      onShowToast('최소 1개 이상의 변경/개선 내용을 입력해주세요.');
      return;
    }

    const finalChanges = [...changesList];
    if (changeInput.trim()) {
      finalChanges.push(changeInput.trim());
    }

    const newUpdate: CommunityTimelineUpdate = {
      version: version.trim() || 'v0.2',
      date: new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
      title: title.trim(),
      changes: finalChanges,
      author: '정소담'
    };

    onAddUpdate(newUpdate);
    onShowToast(`버전 ${newUpdate.version} 업데이트가 타임라인에 등록되었습니다.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="community-update-modal"
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-neutral-200 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E60012] flex items-center justify-center text-white">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">개발 진행 상황 및 업데이트 작성</h2>
              <p className="text-[11px] text-neutral-400">새 버전의 주요 변경점과 개선 사항을 동료들에게 공유합니다.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-neutral-700 mb-1">
                업데이트 버전 <span className="text-[#E60012]">*</span>
              </label>
              <input
                type="text"
                required
                value={version}
                onChange={e => setVersion(e.target.value)}
                placeholder="예: v0.4, v1.0"
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl font-mono font-bold focus:outline-hidden focus:border-neutral-900 focus:bg-white"
              />
            </div>
            <div>
              <label className="block font-bold text-neutral-700 mb-1">
                작성일
              </label>
              <input
                type="text"
                disabled
                value={new Date().toISOString().slice(0, 10).replace(/-/g, '.')}
                className="w-full px-3 py-2 bg-neutral-100 border border-neutral-200 rounded-xl text-neutral-500 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-neutral-700 mb-1">
              업데이트 핵심 타이틀 <span className="text-[#E60012]">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="예: 화자 분리 알고리즘 탑재 및 KPC 내부 용어 사전 연결"
              className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl font-semibold focus:outline-hidden focus:border-neutral-900 focus:bg-white"
            />
          </div>

          <div>
            <label className="block font-bold text-neutral-700 mb-1">
              주요 변경 및 기능 개선 내역
            </label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={changeInput}
                onChange={e => setChangeInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddChange(); } }}
                placeholder="항목 입력 후 [추가] 또는 Enter (예: 회의 요약 정확도 개선)"
                className="flex-1 px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-hidden focus:border-neutral-900 focus:bg-white"
              />
              <button
                type="button"
                onClick={handleAddChange}
                className="px-3 py-2 bg-neutral-900 text-white rounded-xl font-bold hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                추가
              </button>
            </div>

            {/* List of changes */}
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {changesList.map((ch, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-neutral-50 rounded-lg border border-neutral-200">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E60012]" />
                    <span className="text-neutral-800 font-medium">{ch}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveChange(idx)}
                    className="text-neutral-400 hover:text-red-600 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-neutral-600 hover:bg-neutral-200/60 rounded-xl transition-colors cursor-pointer"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 bg-[#E60012] hover:bg-[#CC0010] text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>업데이트 등록</span>
          </button>
        </div>
      </div>
    </div>
  );
};
