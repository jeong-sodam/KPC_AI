import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Paperclip, 
  Mic, 
  MicOff, 
  Image as ImageIcon,
  ChevronDown,
  Sparkles, 
  FileText, 
  BookOpen, 
  Copy, 
  Check, 
  ThumbsUp,
  ThumbsDown,
  RefreshCcw,
  Bot, 
  User, 
  X,
  FileSpreadsheet,
  FileCheck2,
  File as FileGeneric
} from 'lucide-react';
import { WorkerChatMessage, WorkerDocCitation } from '../../data/workerMockData';
import { WorkerMode } from './WorkerLeftSidebar';
import { TaskAttachedFile } from '../../types';

export const AVAILABLE_LLM_MODELS = [
  { group: 'GPT', models: ['GPT-5.5', 'GPT-5 Mini', 'GPT-4o'] },
  { group: 'Claude', models: ['Claude 3.7 Sonnet', 'Claude 3.5 Haiku'] },
  { group: 'Gemini', models: ['Gemini 2.5 Pro', 'Gemini 2.5 Flash'] },
  { group: 'HyperCLOVA X', models: ['HyperCLOVA X Enterprise'] },
];

interface WorkerChatAreaProps {
  mode: WorkerMode;
  selectedDocCount: number;
  messages: WorkerChatMessage[];
  isThinking: boolean;
  onSendMessage: (text: string, attachedFiles?: string[]) => void;
  onOpenFileManager: () => void;
  onShowToast: (msg: string) => void;
  // 업무 도우미 전용 Props
  taskFiles?: TaskAttachedFile[];
  onOpenTaskFileManager?: () => void;
  selectedModel?: string;
  onSelectModel?: (model: string) => void;
  onRegenerateResponse?: () => void;
  onToggleMessageReaction?: (msgId: string, type: 'like' | 'dislike') => void;
  onQuickAttachFile?: (file: File) => void;
}

export const WorkerChatArea: React.FC<WorkerChatAreaProps> = ({
  mode,
  selectedDocCount,
  messages,
  isThinking,
  onSendMessage,
  onOpenFileManager,
  onShowToast,
  taskFiles = [],
  onOpenTaskFileManager,
  selectedModel = 'GPT-5.5',
  onSelectModel,
  onRegenerateResponse,
  onToggleMessageReaction,
  onQuickAttachFile
}) => {
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [selectedCitation, setSelectedCitation] = useState<WorkerDocCitation | null>(null);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  
  // 현재 입력창에 첨부 대기 중인 파일들 (Chips)
  const [stagedFiles, setStagedFiles] = useState<{ id: string; name: string; size: string; format: string }[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isDocMode = mode === 'document';
  const canSendInDocMode = !isDocMode || selectedDocCount > 0;

  // 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // 바깥 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsModelDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSend = () => {
    const trimmed = inputText.trim();
    const hasStaged = stagedFiles.length > 0;

    if ((!trimmed && !hasStaged) || isThinking) return;

    if (isDocMode && selectedDocCount === 0) {
      onShowToast('내용을 검색할 문서를 최소 1개 이상 선택해주세요.');
      onOpenFileManager();
      return;
    }

    const attachedNames = stagedFiles.map(f => f.name);
    onSendMessage(trimmed || (hasStaged ? `[첨부 파일 분석 요청: ${attachedNames.join(', ')}]` : ''), attachedNames);
    
    setInputText('');
    setStagedFiles([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 180)}px`;
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      onShowToast('음성 입력을 종료했습니다.');
    } else {
      setIsRecording(true);
      onShowToast('음성 입력을 시작합니다. (데모)');
      setTimeout(() => {
        setInputText(prev => prev + (prev ? ' ' : '') + 'KPC AI 플랫폼 핵심 추진 과제를 요약해줘');
        setIsRecording(false);
      }, 2000);
    }
  };

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content);
    setCopiedMsgId(id);
    onShowToast('답변 내용이 클립보드에 복사되었습니다.');
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const handleModelSelect = (modelName: string) => {
    if (onSelectModel) {
      onSelectModel(modelName);
    }
    setIsModelDropdownOpen(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const newStaged = {
        id: `img-${Date.now()}`,
        name: file.name,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        format: 'IMAGE'
      };
      setStagedFiles(prev => [...prev, newStaged]);
      if (onQuickAttachFile) {
        onQuickAttachFile(file);
      }
      onShowToast(`이미지 '${file.name}'이(가) 첨부되었습니다.`);
    }
  };

  const removeStagedFile = (id: string) => {
    setStagedFiles(prev => prev.filter(f => f.id !== id));
    onShowToast('첨부 파일이 제거되었습니다.');
  };

  const canSend = (inputText.trim().length > 0 || stagedFiles.length > 0) && !isThinking && canSendInDocMode;

  const getFileFormatIcon = (name: string) => {
    const ext = name.split('.').pop()?.toUpperCase() || '';
    if (ext === 'PDF') return <FileText className="w-3.5 h-3.5 text-red-500" />;
    if (['XLSX', 'XLS', 'CSV'].includes(ext)) return <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />;
    if (['DOCX', 'DOC'].includes(ext)) return <FileCheck2 className="w-3.5 h-3.5 text-blue-600" />;
    if (['PNG', 'JPG', 'JPEG'].includes(ext)) return <ImageIcon className="w-3.5 h-3.5 text-violet-600" />;
    return <FileGeneric className="w-3.5 h-3.5 text-neutral-400" />;
  };

  return (
    <div 
      id="worker-center-workspace"
      className="flex-1 flex flex-col h-full bg-white relative overflow-hidden"
    >
      {/* 3. 중앙 상단 영역 */}
      <header className="px-6 py-3.5 border-b border-neutral-200 flex items-center justify-between shrink-0 bg-white">
        <div className="flex items-center gap-3">
          <h1 className="text-base font-bold text-neutral-900 tracking-tight">
            {isDocMode ? '문서 도우미' : '업무 도우미'}
          </h1>
          
          {/* 작은 배지 또는 연한 배경의 안내 문구 */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200/80 text-xs text-neutral-600">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E60012]" />
            <span>
              {isDocMode
                ? '문서에 도움이 필요하시면 언제든 저와 함께해주세요!'
                : '업무에 도움이 필요하시면 언제든 저와 함께해주세요!'}
            </span>
          </div>
        </div>

        {/* Status / Document Count Tag */}
        <div className="flex items-center gap-2">
          {isDocMode ? (
            <button
              id="header-doc-count-btn"
              onClick={onOpenFileManager}
              className="text-xs text-neutral-600 hover:text-neutral-900 bg-neutral-50 hover:bg-neutral-100 px-2.5 py-1 rounded-md border border-neutral-200 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-[#E60012]" />
              <span>검색 문서: <strong className="text-neutral-900">{selectedDocCount}건</strong></span>
            </button>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-neutral-500 bg-neutral-50 px-2.5 py-1 rounded-md border border-neutral-200">
              <span className="text-neutral-400">현재 모델:</span>
              <span className="font-semibold text-neutral-800 font-mono">{selectedModel}</span>
            </div>
          )}
        </div>
      </header>

      {/* Message List or Empty State */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {messages.length === 0 ? (
          /* 4. 중앙 빈 화면 (요구사항 엄격 준수) */
          <div 
            id="worker-empty-state"
            className="h-full flex flex-col items-center justify-center text-center select-none"
          >
            <div className="w-16 h-16 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center justify-center mb-4 shadow-2xs">
              <Bot className="w-8 h-8 text-[#E60012]" />
            </div>

            <p className="text-sm text-neutral-600 leading-relaxed max-w-md">
              <span className="text-[#E60012] font-semibold">이전 대화 기록</span>을 선택하시거나,
              <br />
              하단에 <span className="text-[#E60012] font-semibold">질문을 입력</span>해 대화를 시작해 보세요.
            </p>

            {isDocMode && selectedDocCount === 0 && (
              <button
                id="empty-select-doc-btn"
                onClick={onOpenFileManager}
                className="mt-4 px-3.5 py-1.5 text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 rounded-md transition-colors cursor-pointer"
              >
                문서 관리함에서 검색할 문서 선택하기
              </button>
            )}
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map(msg => {
              // 9. 모델 변경 안내 메시지 (시스템 메시지)
              if (msg.sender === 'system') {
                return (
                  <div key={msg.id} className="flex justify-center my-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-600 text-xs shadow-2xs">
                      <Sparkles className="w-3 h-3 text-neutral-400" />
                      <span>{msg.content}</span>
                    </div>
                  </div>
                );
              }

              const isUser = msg.sender === 'user';
              return (
                <div 
                  key={msg.id}
                  id={`chat-msg-${msg.id}`}
                  className={`flex gap-3.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                      <Sparkles className="w-4 h-4 text-[#E60012]" />
                    </div>
                  )}

                  <div className={`flex flex-col space-y-1.5 max-w-[85%] ${isUser ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-2 px-1">
                      <span className="text-xs font-bold text-neutral-900">
                        {isUser ? '나 (정소담)' : (isDocMode ? 'KPC 문서 도우미' : 'KPC 업무 도우미')}
                      </span>
                      {msg.model && !isUser && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600 border border-neutral-200">
                          {msg.model}
                        </span>
                      )}
                      <span className="text-[10px] text-neutral-400">{msg.timestamp}</span>
                    </div>

                    <div 
                      className={`p-4 rounded-xl text-xs leading-relaxed transition-all shadow-2xs ${
                        isUser 
                          ? 'bg-neutral-900 text-white rounded-tr-xs' 
                          : 'bg-white text-neutral-800 border border-neutral-200 rounded-tl-xs'
                      }`}
                    >
                      {/* Attached Files Chips on User Message */}
                      {msg.attachedFiles && msg.attachedFiles.length > 0 && (
                        <div className="mb-2.5 pb-2 border-b border-neutral-700/60 flex flex-wrap gap-1.5">
                          {msg.attachedFiles.map((fn, fIdx) => (
                            <span 
                              key={fIdx} 
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-[11px] text-neutral-300"
                            >
                              <Paperclip className="w-3 h-3 text-[#E60012]" />
                              <span>{fn}</span>
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="whitespace-pre-line break-words space-y-2">
                        {msg.content}
                      </div>

                      {/* Cited Reference Documents (문서 도우미 모드) */}
                      {msg.referencedDocs && msg.referencedDocs.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-neutral-100 space-y-1.5">
                          <span className="text-[11px] font-bold text-neutral-700 flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-[#E60012]" />
                            <span>참고 문서 및 출처 ({msg.referencedDocs.length}건)</span>
                          </span>

                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {msg.referencedDocs.map((doc, idx) => (
                              <button
                                key={idx}
                                id={`citation-tag-${idx}`}
                                onClick={() => setSelectedCitation(doc)}
                                className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-neutral-100 hover:bg-red-50 text-[11px] text-neutral-700 hover:text-[#E60012] border border-neutral-200 hover:border-red-200 transition-colors cursor-pointer"
                                title="원문 인용구 보기"
                              >
                                <FileText className="w-3 h-3 text-neutral-400" />
                                <span className="font-medium truncate max-w-xs">{doc.name}</span>
                                <span className="text-[10px] text-neutral-500 font-mono">p.{doc.page}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* 10. AI 응답 하단 기능: 복사, 좋아요, 싫어요, 다시 생성 */}
                    {!isUser && (
                      <div className="flex items-center gap-1.5 pl-1 pt-0.5">
                        {/* 복사 */}
                        <button
                          id={`copy-btn-${msg.id}`}
                          onClick={() => handleCopy(msg.content, msg.id)}
                          className="flex items-center gap-1 text-[11px] text-neutral-500 hover:text-neutral-800 px-2 py-1 rounded-md hover:bg-neutral-100 border border-neutral-200 transition-colors cursor-pointer"
                          title="답변 복사"
                        >
                          {copiedMsgId === msg.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-600 font-medium">복사됨</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-neutral-500" />
                              <span>복사</span>
                            </>
                          )}
                        </button>

                        {/* 좋아요 */}
                        <button
                          id={`like-btn-${msg.id}`}
                          onClick={() => onToggleMessageReaction && onToggleMessageReaction(msg.id, 'like')}
                          className={`flex items-center gap-1 text-[11px] px-2 py-1 rounded-md border transition-colors cursor-pointer ${
                            msg.liked 
                              ? 'bg-red-50 text-[#E60012] border-red-200' 
                              : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 border-neutral-200'
                          }`}
                          title="좋아요"
                        >
                          <ThumbsUp className="w-3 h-3" />
                          <span>좋아요</span>
                        </button>

                        {/* 싫어요 */}
                        <button
                          id={`dislike-btn-${msg.id}`}
                          onClick={() => onToggleMessageReaction && onToggleMessageReaction(msg.id, 'dislike')}
                          className={`flex items-center gap-1 text-[11px] px-2 py-1 rounded-md border transition-colors cursor-pointer ${
                            msg.disliked 
                              ? 'bg-neutral-200 text-neutral-900 border-neutral-300 font-medium' 
                              : 'text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 border-neutral-200'
                          }`}
                          title="싫어요"
                        >
                          <ThumbsDown className="w-3 h-3" />
                          <span>싫어요</span>
                        </button>

                        {/* 다시 생성 */}
                        {onRegenerateResponse && (
                          <button
                            id={`regenerate-btn-${msg.id}`}
                            onClick={onRegenerateResponse}
                            className="flex items-center gap-1 text-[11px] text-neutral-500 hover:text-neutral-800 px-2 py-1 rounded-md hover:bg-neutral-100 border border-neutral-200 transition-colors cursor-pointer"
                            title="답변 다시 생성"
                          >
                            <RefreshCcw className="w-3 h-3 text-neutral-500" />
                            <span>다시 생성</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {isUser && (
                    <div className="w-8 h-8 rounded-lg bg-neutral-200 text-neutral-700 flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Thinking / Streaming Indicator */}
            {isThinking && (
              <div className="flex gap-3.5 justify-start">
                <div className="w-8 h-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center shrink-0 shadow-2xs mt-0.5 animate-pulse">
                  <Sparkles className="w-4 h-4 text-[#E60012]" />
                </div>
                <div className="bg-white border border-neutral-200 p-4 rounded-xl rounded-tl-xs shadow-2xs flex items-center gap-2 text-xs text-neutral-500">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-[#E60012] rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-[#E60012] rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-[#E60012] rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                  <span>
                    {isDocMode 
                      ? '선택된 문서를 분석하고 답변을 생성하는 중입니다...' 
                      : `${selectedModel} 모델이 답변을 생성하는 중입니다...`}
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* 5, 6, 7. 하단 채팅 입력창 (요구사항 엄격 준수) */}
      <div className="p-4 border-t border-neutral-200 bg-white shrink-0">
        <div className="max-w-3xl mx-auto space-y-2">
          {/* Main Input Box Container */}
          <div 
            id="chat-input-box"
            className={`flex flex-col rounded-xl border bg-white shadow-2xs transition-all ${
              !canSendInDocMode 
                ? 'border-neutral-200 bg-neutral-50/50' 
                : 'border-neutral-300 focus-within:border-neutral-900 focus-within:ring-1 focus-within:ring-neutral-900'
            }`}
          >
            {/* 8. 첨부된 파일 칩(Chips) 영역 */}
            {stagedFiles.length > 0 && (
              <div className="flex flex-wrap gap-1.5 px-3.5 pt-3 pb-1 border-b border-neutral-100">
                {stagedFiles.map(file => (
                  <div 
                    key={file.id} 
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-100 border border-neutral-200 text-xs text-neutral-800 font-medium"
                  >
                    {getFileFormatIcon(file.name)}
                    <span className="truncate max-w-[180px]">{file.name}</span>
                    <button 
                      type="button"
                      onClick={() => removeStagedFile(file.id)} 
                      className="text-neutral-400 hover:text-red-600 p-0.5 rounded-full hover:bg-neutral-200 cursor-pointer"
                      title="첨부 해제"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              id="worker-chat-textarea"
              rows={2}
              value={inputText}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder={isDocMode ? (selectedDocCount === 0 ? '문서를 선택 후 메시지를 작성하세요.' : '선택된 문서를 기반으로 질문을 입력하세요...') : '메시지를 작성하세요.'}
              disabled={isDocMode && selectedDocCount === 0}
              className="w-full resize-none outline-none text-xs text-neutral-900 placeholder:text-neutral-400 bg-transparent p-3.5 leading-relaxed min-h-[58px]"
            />

            {/* Bottom Row of Input Box: Multi-LLM Dropdown (Left) & Action Icons (Right) */}
            <div className="flex items-center justify-between px-3 pb-2.5 pt-1">
              {/* 6. Multi-LLM 선택 기능 (하단 입력창 내부 왼쪽 아래) */}
              <div className="relative" ref={dropdownRef}>
                {!isDocMode ? (
                  <>
                    <button
                      id="worker-model-selector-btn"
                      type="button"
                      onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-xs font-semibold text-neutral-800 transition-colors cursor-pointer shadow-2xs"
                    >
                      <span className="font-mono text-neutral-900">{selectedModel}</span>
                      <ChevronDown className={`w-3.5 h-3.5 text-neutral-500 transition-transform ${isModelDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {isModelDropdownOpen && (
                      <div 
                        id="worker-model-dropdown-menu"
                        className="absolute bottom-full left-0 mb-1.5 w-60 bg-white rounded-xl shadow-xl border border-neutral-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                      >
                        <div className="px-2 py-1.5 text-[11px] font-bold text-neutral-400 border-b border-neutral-100 mb-1">
                          AI 모델 선택 (Multi-LLM)
                        </div>
                        <div className="max-h-64 overflow-y-auto space-y-2 py-1">
                          {AVAILABLE_LLM_MODELS.map(group => (
                            <div key={group.group} className="space-y-0.5">
                              <div className="px-2 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                                {group.group}
                              </div>
                              {group.models.map(m => {
                                const isSelected = selectedModel === m;
                                return (
                                  <button
                                    key={m}
                                    type="button"
                                    onClick={() => handleModelSelect(m)}
                                    className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-medium text-left transition-colors cursor-pointer ${
                                      isSelected 
                                        ? 'bg-red-50 text-[#E60012] font-semibold' 
                                        : 'text-neutral-700 hover:bg-neutral-100'
                                    }`}
                                  >
                                    <span>{m}</span>
                                    {isSelected && <Check className="w-3.5 h-3.5 text-[#E60012]" />}
                                  </button>
                                );
                              })}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <span className="text-[11px] text-neutral-400 font-medium pl-1">
                    문서 RAG 모드 (KPC Secure Index)
                  </span>
                )}
              </div>

              {/* 7. 입력창 하단 아이콘 구성 (오른쪽 아래 순서 엄격 준수) */}
              {/* ① 이미지 첨부 -> ② 파일 첨부 -> ③ 음성 입력 -> ④ 메시지 전송 */}
              <div className="flex items-center gap-1.5">
                {/* Hidden input for image */}
                <input 
                  ref={imageInputRef}
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleImageUpload}
                />

                {/* ① 이미지 첨부 아이콘 */}
                <button
                  id="worker-attach-image-btn"
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 transition-colors cursor-pointer"
                  title="이미지 첨부"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>

                {/* ② 파일 첨부 아이콘 */}
                <button
                  id="worker-attach-file-btn"
                  type="button"
                  onClick={isDocMode ? onOpenFileManager : (onOpenTaskFileManager || onOpenFileManager)}
                  className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 transition-colors cursor-pointer"
                  title="파일 첨부"
                >
                  <Paperclip className="w-4 h-4" />
                </button>

                {/* ③ 음성 입력 아이콘 */}
                <button
                  id="worker-voice-input-btn"
                  type="button"
                  onClick={toggleRecording}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    isRecording 
                      ? 'bg-red-50 text-[#E60012] animate-pulse' 
                      : 'text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100'
                  }`}
                  title="음성 입력"
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                {/* ④ 메시지 전송 아이콘 */}
                <button
                  id="worker-send-msg-btn"
                  type="button"
                  onClick={handleSend}
                  disabled={!canSend}
                  className={`p-2 rounded-lg transition-all cursor-pointer ${
                    !canSend
                      ? 'bg-neutral-100 text-neutral-300 cursor-not-allowed'
                      : 'bg-neutral-900 hover:bg-neutral-800 text-white shadow-xs'
                  }`}
                  title="메시지 전송"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* 안내 문구 */}
          <p className="text-[11px] text-neutral-400 text-center select-none">
            대화내용은 모델 학습에 사용되지 않습니다.
          </p>
        </div>
      </div>

      {/* Citation Modal / Detail Popup (문서 도우미 모드) */}
      {selectedCitation && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in"
          onClick={() => setSelectedCitation(null)}
        >
          <div 
            id="citation-detail-modal"
            className="bg-white rounded-xl shadow-2xl border border-neutral-200 max-w-lg w-full p-6 space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-neutral-100 pb-3">
              <div>
                <span className="text-[11px] font-semibold text-[#E60012] uppercase tracking-wider block">
                  원문 인용구 확인
                </span>
                <h3 className="text-sm font-bold text-neutral-900 mt-0.5">
                  {selectedCitation.name}
                </h3>
              </div>
              <button 
                onClick={() => setSelectedCitation(null)}
                className="p-1 text-neutral-400 hover:text-neutral-700 rounded-md hover:bg-neutral-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-neutral-500 bg-neutral-50 p-2.5 rounded-lg">
                <span>섹션: <strong className="text-neutral-800">{selectedCitation.section}</strong></span>
                <span>페이지: <strong className="text-neutral-800 font-mono">p.{selectedCitation.page}</strong></span>
              </div>

              <div className="bg-neutral-50/70 border border-neutral-200 p-4 rounded-lg text-xs leading-relaxed text-neutral-700 italic">
                "{selectedCitation.quote}"
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedCitation(null)}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
