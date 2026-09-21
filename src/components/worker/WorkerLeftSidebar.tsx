import React from 'react';
import { 
  FileText, 
  Briefcase, 
  FolderOpen, 
  PanelLeftClose, 
  PanelLeftOpen, 
  Search,
  CheckCircle2,
  Sparkles,
  Paperclip
} from 'lucide-react';
import { WorkerDocument, TaskAttachedFile } from '../../types';

export type WorkerMode = 'document' | 'task';

interface WorkerLeftSidebarProps {
  currentMode: WorkerMode;
  onSelectMode: (mode: WorkerMode) => void;
  documents: WorkerDocument[];
  onOpenFileManager: () => void;
  taskFiles?: TaskAttachedFile[];
  onOpenTaskFileManager?: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const WorkerLeftSidebar: React.FC<WorkerLeftSidebarProps> = ({
  currentMode,
  onSelectMode,
  documents,
  onOpenFileManager,
  taskFiles = [],
  onOpenTaskFileManager,
  isCollapsed,
  onToggleCollapse
}) => {
  const selectedDocs = documents.filter(d => d.selected);
  const selectedCount = selectedDocs.length;
  const taskFileCount = taskFiles.length;

  if (isCollapsed) {
    return (
      <aside 
        id="worker-left-sidebar-collapsed"
        className="w-14 border-r border-neutral-200 bg-white flex flex-col items-center py-4 justify-between transition-all shrink-0"
      >
        <div className="flex flex-col items-center gap-4 w-full">
          <button
            id="worker-sidebar-expand-btn"
            onClick={onToggleCollapse}
            className="p-2 rounded-md text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
            title="사이드바 펼치기"
          >
            <PanelLeftOpen className="w-5 h-5" />
          </button>

          <div className="w-8 h-px bg-neutral-200 my-1" />

          {/* Mode Icons */}
          <button
            id="worker-mode-task-mini-btn"
            onClick={() => onSelectMode('task')}
            className={`p-2.5 rounded-lg transition-colors cursor-pointer ${
              currentMode === 'task'
                ? 'bg-red-50 text-[#E60012]'
                : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900'
            }`}
            title="업무 도우미"
          >
            <Briefcase className="w-5 h-5" />
          </button>

          <button
            id="worker-mode-doc-mini-btn"
            onClick={() => onSelectMode('document')}
            className={`relative p-2.5 rounded-lg transition-colors cursor-pointer ${
              currentMode === 'document'
                ? 'bg-red-50 text-[#E60012]'
                : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900'
            }`}
            title="문서 도우미"
          >
            <FileText className="w-5 h-5" />
            {selectedCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#E60012] text-white text-[10px] font-bold flex items-center justify-center">
                {selectedCount}
              </span>
            )}
          </button>
        </div>

        <button
          id="worker-file-manager-mini-btn"
          onClick={onOpenFileManager}
          className="p-2 rounded-md text-neutral-500 hover:text-[#E60012] hover:bg-neutral-100 transition-colors cursor-pointer"
          title="문서 관리함"
        >
          <FolderOpen className="w-5 h-5" />
        </button>
      </aside>
    );
  }

  return (
    <aside 
      id="worker-left-sidebar"
      className="w-64 border-r border-neutral-200 bg-white flex flex-col justify-between transition-all shrink-0 select-none"
    >
      {/* Top Header & Icons */}
      <div className="p-3.5 border-b border-neutral-200 flex items-center justify-between">
        <span className="text-xs font-bold text-neutral-900 tracking-tight flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#E60012]" />
          <span>AI Worker 메뉴</span>
        </span>
        <div className="flex items-center gap-1">
          <button
            id="worker-quick-search-icon-btn"
            onClick={onOpenFileManager}
            className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
            title="문서 검색 및 관리"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            id="worker-sidebar-collapse-btn"
            onClick={onToggleCollapse}
            className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
            title="사이드바 접기"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Menu Area */}
      <div className="p-3 space-y-3 flex-1 overflow-y-auto">
        {/* Navigation Items */}
        <div className="space-y-1">
          {/* 업무 도우미 */}
          <button
            id="worker-menu-task-btn"
            onClick={() => onSelectMode('task')}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer text-left ${
              currentMode === 'task'
                ? 'bg-red-50/80 text-[#E60012] border border-red-200 shadow-2xs'
                : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900'
            }`}
          >
            <Briefcase className={`w-4 h-4 shrink-0 ${currentMode === 'task' ? 'text-[#E60012]' : 'text-neutral-500'}`} />
            <span>업무 도우미</span>
          </button>

          {/* 문서 도우미 */}
          <button
            id="worker-menu-doc-btn"
            onClick={() => onSelectMode('document')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer text-left ${
              currentMode === 'document'
                ? 'bg-red-50/80 text-[#E60012] border border-red-200 shadow-2xs'
                : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FileText className={`w-4 h-4 shrink-0 ${currentMode === 'document' ? 'text-[#E60012]' : 'text-neutral-500'}`} />
              <span>문서 도우미</span>
            </div>
            {selectedCount > 0 && (
              <span className="text-[10px] font-bold bg-[#E60012] text-white px-1.5 py-0.2 rounded-full">
                {selectedCount}
              </span>
            )}
          </button>
        </div>

        {/* 문서 도우미 하단 전용 영역: 검색 대상 문서 & 문서 관리함 */}
        {currentMode === 'document' && (
          <div className="mt-3 pt-3 border-t border-neutral-100 space-y-2.5 bg-neutral-50/80 p-3 rounded-lg border border-neutral-200/80">
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-700 font-medium">
                검색 대상 문서 : <strong className="text-neutral-900 font-bold">{selectedCount}</strong>
              </span>
              <button
                id="worker-open-file-manager-btn"
                onClick={onOpenFileManager}
                className="px-2.5 py-1 text-xs font-semibold text-neutral-800 bg-white hover:bg-neutral-100 border border-neutral-300 rounded shadow-2xs transition-colors cursor-pointer"
              >
                문서 관리함
              </button>
            </div>

            <p className="text-[11px] text-neutral-500 leading-tight">
              내용을 검색할 문서를 선택해주세요.
            </p>

            {/* 선택된 문서 리스트 프리뷰 */}
            {selectedCount > 0 ? (
              <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
                {selectedDocs.map(doc => (
                  <div 
                    key={doc.id} 
                    className="flex items-center gap-1.5 text-[11px] text-neutral-700 bg-white px-2 py-1.5 rounded border border-neutral-200/80 shadow-2xs"
                    title={doc.name}
                  >
                    <CheckCircle2 className="w-3 h-3 text-[#E60012] shrink-0" />
                    <span className="truncate">{doc.name}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-[11px] text-neutral-400 bg-white/60 p-2 rounded border border-dashed border-neutral-200 text-center">
                선택된 문서가 없습니다.
              </div>
            )}
          </div>
        )}

        {/* 업무 도우미 하단: 첨부 파일 : N 및 [관리] 버튼 */}
        {currentMode === 'task' && (
          <div className="mt-3 pt-3 border-t border-neutral-100 space-y-2.5 bg-neutral-50/80 p-3 rounded-lg border border-neutral-200/80">
            <div className="flex items-center justify-between">
              <span className="text-xs text-neutral-700 font-medium">
                첨부 파일 : <strong className="text-neutral-900 font-bold">{taskFileCount}</strong>
              </span>
              <button
                id="worker-open-task-file-manager-btn"
                onClick={onOpenTaskFileManager}
                className="px-2.5 py-1 text-xs font-semibold text-neutral-800 bg-white hover:bg-neutral-100 border border-neutral-300 rounded shadow-2xs transition-colors cursor-pointer"
              >
                관리
              </button>
            </div>

            {taskFileCount === 0 ? (
              <p className="text-[11px] text-neutral-400 leading-tight">
                아직 업로드된 파일이 없습니다.
              </p>
            ) : (
              <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                {taskFiles.map(file => (
                  <div
                    key={file.id}
                    className="flex items-center gap-1.5 text-[11px] text-neutral-700 bg-white px-2 py-1.5 rounded border border-neutral-200/80 shadow-2xs"
                    title={file.name}
                  >
                    <Paperclip className="w-3 h-3 text-[#E60012] shrink-0" />
                    <span className="truncate">{file.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-neutral-200 bg-white text-[11px] text-neutral-500">
        <div className="flex items-center justify-between font-medium">
          <span>KPC 사내 보안 통제</span>
          <span className="text-emerald-600 font-bold">안전</span>
        </div>
        <span className="text-[10px] text-neutral-400 block mt-0.5">망분리 온프레미스 인프라 보호</span>
      </div>
    </aside>
  );
};
