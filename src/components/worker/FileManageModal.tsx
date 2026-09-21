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
  AlertCircle,
  CheckCircle2,
  File
} from 'lucide-react';
import { WorkerDocument } from '../../types';

interface FileManageModalProps {
  isOpen: boolean;
  onClose: () => void;
  documents: WorkerDocument[];
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onDeleteFile: (id: string) => void;
  onDeleteSelectedFiles: () => void;
  onUploadFiles: (files: FileList) => void;
  onConfirm: () => void;
}

export const FileManageModal: React.FC<FileManageModalProps> = ({
  isOpen,
  onClose,
  documents,
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

  const selectedCount = documents.filter(d => d.selected).length;

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
      case 'HWP':
      case 'HWPX':
        return <span className="px-1.5 py-0.5 text-[11px] font-semibold bg-purple-50 text-purple-700 rounded border border-purple-200">HWP</span>;
      default:
        return <span className="px-1.5 py-0.5 text-[11px] font-semibold bg-neutral-100 text-neutral-600 rounded border border-neutral-200">{format}</span>;
    }
  };

  const getFormatIcon = (format: string) => {
    const f = format.toUpperCase();
    if (f === 'PDF') return <FileText className="w-4 h-4 text-red-500 shrink-0" />;
    if (f === 'XLSX' || f === 'XLS') return <FileSpreadsheet className="w-4 h-4 text-emerald-600 shrink-0" />;
    if (f === 'DOCX' || f === 'DOC') return <FileCheck2 className="w-4 h-4 text-blue-600 shrink-0" />;
    return <File className="w-4 h-4 text-neutral-500 shrink-0" />;
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        id="file-manage-modal"
        className="bg-white rounded-xl shadow-2xl border border-neutral-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-neutral-900">파일 관리</h2>
            <span className="text-xs text-neutral-500 font-normal">
              (검색 대상 선택: <strong className="text-[#E60012] font-semibold">{selectedCount}</strong> / {documents.length}개)
            </span>
          </div>
          <button
            id="file-modal-close-btn"
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
            aria-label="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 min-h-0">
          {/* 유의사항 배너 */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 text-xs text-neutral-700">
            <div className="flex items-center gap-1.5 font-bold text-neutral-900 mb-2">
              <AlertCircle className="w-4 h-4 text-[#E60012]" />
              <span>유의사항</span>
            </div>
            <ul className="space-y-1 text-neutral-600 pl-4 list-disc marker:text-neutral-400 leading-relaxed">
              <li>개인 파일 업로드 개수는 최대 100개입니다.</li>
              <li>파일당 용량은 1,000MB로 제한됩니다.</li>
              <li>지원 파일 형식: docx, doc, pptx, ppt, hwp, hwpx, pdf</li>
              <li>문서 내 이미지는 현재 인식하지 않습니다.</li>
              <li>
                <strong className="text-neutral-900">현재 채팅에서 사용할 문서를 체크해주세요.</strong> (사이드바에 표시됩니다.)
              </li>
            </ul>
          </div>

          {/* Drag & Drop 업로드 영역 */}
          <div
            id="file-upload-dropzone"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors ${
              isDragging 
                ? 'border-[#E60012] bg-red-50/50' 
                : 'border-neutral-300 hover:border-neutral-400 bg-neutral-50/50'
            }`}
          >
            <input 
              ref={fileInputRef} 
              type="file" 
              multiple 
              accept=".pdf,.docx,.doc,.pptx,.ppt,.hwp,.hwpx,.xlsx,.xls,.txt" 
              className="hidden" 
              onChange={handleFileInputChange} 
            />
            <div className="w-10 h-10 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-500 shadow-2xs">
              <UploadCloud className="w-5 h-5 text-[#E60012]" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-neutral-800">파일 업로드</p>
              <p className="text-xs text-neutral-500 mt-0.5">클릭하거나 파일을 여기로 끌어다 놓으세요</p>
            </div>
          </div>

          {/* 파일 목록 테이블 */}
          <div className="border border-neutral-200 rounded-lg overflow-hidden">
            <div className="max-h-72 overflow-y-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-neutral-50 text-neutral-600 font-semibold border-b border-neutral-200 sticky top-0 z-10">
                  <tr>
                    <th className="p-3 w-10 text-center">선택</th>
                    <th className="p-3">파일명</th>
                    <th className="p-3 w-20 text-center">파일 형식</th>
                    <th className="p-3 w-20 text-right">파일 크기</th>
                    <th className="p-3 w-28 text-center">업로드 상태</th>
                    <th className="p-3 w-16 text-center">삭제</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {documents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-10 text-neutral-400">
                        업로드된 파일이 없습니다. 상단에서 파일을 업로드해주세요.
                      </td>
                    </tr>
                  ) : (
                    documents.map(doc => {
                      const isSelected = !!doc.selected;
                      return (
                        <tr 
                          key={doc.id}
                          onClick={() => onToggleSelect(doc.id)}
                          className={`hover:bg-neutral-50/80 transition-colors cursor-pointer ${
                            isSelected ? 'bg-red-50/20' : ''
                          }`}
                        >
                          <td className="p-3 text-center" onClick={e => e.stopPropagation()}>
                            <button
                              id={`checkbox-doc-${doc.id}`}
                              onClick={() => onToggleSelect(doc.id)}
                              className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
                            >
                              {isSelected ? (
                                <CheckSquare className="w-4 h-4 text-[#E60012]" />
                              ) : (
                                <Square className="w-4 h-4 text-neutral-300" />
                              )}
                            </button>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              {getFormatIcon(doc.format)}
                              <span className={`font-medium truncate max-w-sm ${isSelected ? 'text-neutral-900 font-semibold' : 'text-neutral-700'}`}>
                                {doc.name}
                              </span>
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            {getFormatBadge(doc.format)}
                          </td>
                          <td className="p-3 text-right text-neutral-500 font-mono">
                            {doc.size}
                          </td>
                          <td className="p-3 text-center">
                            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>{doc.status || '인덱싱 완료'}</span>
                            </span>
                          </td>
                          <td className="p-3 text-center" onClick={e => e.stopPropagation()}>
                            <button
                              id={`delete-doc-${doc.id}`}
                              onClick={() => onDeleteFile(doc.id)}
                              className="p-1 rounded text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              title="파일 삭제"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer Controls */}
        <div className="px-6 py-3.5 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              id="file-select-all-btn"
              onClick={onSelectAll}
              className="px-2.5 py-1.5 text-xs font-medium text-neutral-700 bg-white border border-neutral-300 rounded hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              전체 선택
            </button>
            <button
              id="file-deselect-all-btn"
              onClick={onDeselectAll}
              className="px-2.5 py-1.5 text-xs font-medium text-neutral-700 bg-white border border-neutral-300 rounded hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              선택 해제
            </button>
            <button
              id="file-delete-selected-btn"
              onClick={onDeleteSelectedFiles}
              disabled={selectedCount === 0}
              className="px-2.5 py-1.5 text-xs font-medium text-red-600 bg-white border border-red-200 rounded hover:bg-red-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              삭제 파일 선택
            </button>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-neutral-600 font-medium">
              현재 업로드된 파일 수 : <strong className="text-neutral-900">{documents.length}개</strong>
            </span>
            <button
              id="file-modal-confirm-btn"
              onClick={onConfirm}
              className="px-5 py-2 text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 rounded-md shadow-xs transition-colors cursor-pointer"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
