import React, { useState, useRef } from 'react';
import { 
  X, 
  UploadCloud, 
  Trash2, 
  CheckSquare, 
  Square, 
  FileText, 
  FileSpreadsheet, 
  FileCheck2, 
  Image as ImageIcon,
  File,
  Paperclip,
  CheckCircle2
} from 'lucide-react';
import { TaskAttachedFile } from '../../types';

interface TaskFileManageModalProps {
  isOpen: boolean;
  onClose: () => void;
  files: TaskAttachedFile[];
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onDeleteFile: (id: string) => void;
  onDeleteSelectedFiles: () => void;
  onUploadFiles: (fileList: FileList) => void;
  onConfirm: () => void;
}

export const TaskFileManageModal: React.FC<TaskFileManageModalProps> = ({
  isOpen,
  onClose,
  files,
  onToggleSelect,
  onSelectAll,
  onDeselectAll,
  onDeleteFile,
  onDeleteSelectedFiles,
  onUploadFiles,
  onConfirm
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const selectedCount = files.filter(f => f.selected).length;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUploadFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onUploadFiles(e.target.files);
    }
  };

  const getFormatBadge = (format: string) => {
    const f = format.toUpperCase();
    switch (f) {
      case 'PDF':
        return <span className="px-1.5 py-0.5 text-[11px] font-semibold bg-red-50 text-red-600 rounded border border-red-200">PDF</span>;
      case 'XLSX':
      case 'XLS':
        return <span className="px-1.5 py-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-700 rounded border border-emerald-200">XLSX</span>;
      case 'DOCX':
      case 'DOC':
        return <span className="px-1.5 py-0.5 text-[11px] font-semibold bg-blue-50 text-blue-700 rounded border border-blue-200">DOCX</span>;
      case 'PPTX':
      case 'PPT':
        return <span className="px-1.5 py-0.5 text-[11px] font-semibold bg-amber-50 text-amber-700 rounded border border-amber-200">PPTX</span>;
      case 'IMAGE':
      case 'PNG':
      case 'JPG':
      case 'JPEG':
        return <span className="px-1.5 py-0.5 text-[11px] font-semibold bg-violet-50 text-violet-700 rounded border border-violet-200">IMAGE</span>;
      default:
        return <span className="px-1.5 py-0.5 text-[11px] font-semibold bg-neutral-100 text-neutral-600 rounded border border-neutral-200">{format}</span>;
    }
  };

  const getFormatIcon = (format: string) => {
    const f = format.toUpperCase();
    if (f === 'PDF') return <FileText className="w-4 h-4 text-red-500 shrink-0" />;
    if (f === 'XLSX' || f === 'XLS') return <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />;
    if (f === 'DOCX' || f === 'DOC') return <FileCheck2 className="w-4 h-4 text-blue-600 shrink-0" />;
    if (f === 'IMAGE' || f === 'PNG' || f === 'JPG') return <ImageIcon className="w-4 h-4 text-violet-600 shrink-0" />;
    return <File className="w-4 h-4 text-neutral-500 shrink-0" />;
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        id="task-file-manage-modal"
        className="bg-white rounded-xl shadow-2xl border border-neutral-200 w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-[#E60012]">
              <Paperclip className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-neutral-900 tracking-tight">파일 관리</h2>
              <p className="text-[11px] text-neutral-500">업무 대화에서 AI 분석 및 참고에 사용할 첨부 파일을 관리합니다.</p>
            </div>
          </div>
          <button 
            id="close-task-file-manager-btn"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Drag and Drop Upload Area */}
          <div 
            id="task-file-dropzone"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer select-none ${
              isDragging 
                ? 'border-[#E60012] bg-red-50/50 scale-[0.99]' 
                : 'border-neutral-300 hover:border-neutral-400 bg-neutral-50/50 hover:bg-neutral-50'
            }`}
          >
            <input 
              ref={fileInputRef}
              type="file" 
              multiple 
              accept=".pdf,.docx,.doc,.xlsx,.xls,.pptx,.ppt,.png,.jpg,.jpeg,.txt"
              className="hidden" 
              onChange={handleFileInputChange}
            />
            <div className="w-12 h-12 rounded-full bg-white shadow-2xs border border-neutral-200 flex items-center justify-center text-neutral-600 mb-2">
              <UploadCloud className="w-6 h-6 text-[#E60012]" />
            </div>
            <p className="text-xs font-semibold text-neutral-800">
              분석할 파일을 드래그하여 놓거나 <span className="text-[#E60012] underline decoration-1 underline-offset-2">내 컴퓨터에서 찾기</span>
            </p>
            <p className="text-[11px] text-neutral-400 mt-1">
              지원 형식: PDF, Word(DOCX), Excel(XLSX), PowerPoint(PPTX), 이미지(PNG, JPG)
            </p>
          </div>

          {/* Control Bar: Total Count, Select All, Deselect All, Delete Selected */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-neutral-900">
                첨부 파일 목록 <span className="text-[#E60012]">({files.length})</span>
              </span>
              {selectedCount > 0 && (
                <span className="text-[11px] bg-red-50 text-[#E60012] font-semibold px-2 py-0.5 rounded-full border border-red-200">
                  {selectedCount}개 선택됨
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <button
                id="task-file-select-all-btn"
                onClick={onSelectAll}
                className="px-2.5 py-1 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded border border-neutral-200 transition-colors cursor-pointer flex items-center gap-1"
              >
                <CheckSquare className="w-3.5 h-3.5" />
                <span>전체 선택</span>
              </button>
              <button
                id="task-file-deselect-all-btn"
                onClick={onDeselectAll}
                className="px-2.5 py-1 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded border border-neutral-200 transition-colors cursor-pointer flex items-center gap-1"
              >
                <Square className="w-3.5 h-3.5" />
                <span>선택 해제</span>
              </button>
              {selectedCount > 0 && (
                <button
                  id="task-file-delete-selected-btn"
                  onClick={onDeleteSelectedFiles}
                  className="px-2.5 py-1 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded border border-red-200 transition-colors cursor-pointer flex items-center gap-1 font-semibold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>선택 삭제 ({selectedCount})</span>
                </button>
              )}
            </div>
          </div>

          {/* File List Table */}
          <div className="border border-neutral-200 rounded-xl overflow-hidden shadow-2xs">
            {files.length === 0 ? (
              <div className="py-12 px-4 text-center text-neutral-400 bg-white">
                <File className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-neutral-600">아직 업로드된 파일이 없습니다.</p>
                <p className="text-[11px] text-neutral-400 mt-1">상단 업로드 영역을 통해 파일을 추가해보세요.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 font-semibold">
                    <th className="py-2.5 px-3 w-10 text-center">선택</th>
                    <th className="py-2.5 px-3">파일명</th>
                    <th className="py-2.5 px-3 w-20 text-center">형식</th>
                    <th className="py-2.5 px-3 w-24 text-center">크기</th>
                    <th className="py-2.5 px-3 w-24 text-center">업로드 일시</th>
                    <th className="py-2.5 px-3 w-14 text-center">삭제</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 bg-white">
                  {files.map(file => (
                    <tr 
                      key={file.id} 
                      className={`hover:bg-neutral-50/80 transition-colors cursor-pointer ${
                        file.selected ? 'bg-red-50/20' : ''
                      }`}
                      onClick={() => onToggleSelect(file.id)}
                    >
                      <td className="py-2.5 px-3 text-center" onClick={e => e.stopPropagation()}>
                        <input 
                          type="checkbox"
                          checked={file.selected}
                          onChange={() => onToggleSelect(file.id)}
                          className="rounded border-neutral-300 text-[#E60012] focus:ring-[#E60012] cursor-pointer"
                        />
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2">
                          {getFormatIcon(file.format)}
                          <span className="font-semibold text-neutral-800 truncate max-w-xs" title={file.name}>
                            {file.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {getFormatBadge(file.format)}
                      </td>
                      <td className="py-2.5 px-3 text-center text-neutral-500 font-mono text-[11px]">
                        {file.size}
                      </td>
                      <td className="py-2.5 px-3 text-center text-neutral-500 text-[11px]">
                        {file.uploadedAt}
                      </td>
                      <td className="py-2.5 px-3 text-center" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => onDeleteFile(file.id)}
                          className="p-1 text-neutral-400 hover:text-red-600 rounded hover:bg-neutral-100 transition-colors cursor-pointer"
                          title="파일 삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between">
          <span className="text-[11px] text-neutral-500">
            총 <strong className="text-neutral-900 font-semibold">{files.length}개</strong>의 첨부 파일 중 <strong className="text-[#E60012] font-semibold">{selectedCount}개</strong>가 활성화되었습니다.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold text-neutral-700 bg-white hover:bg-neutral-100 border border-neutral-300 rounded-lg transition-colors cursor-pointer shadow-2xs"
            >
              취소
            </button>
            <button
              id="confirm-task-file-manager-btn"
              onClick={onConfirm}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>확인 적용</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
