import React, { useState } from 'react';
import { WorkerDocument, TaskAttachedFile } from '../../types';
import { 
  INITIAL_WORKER_DOCUMENTS, 
  INITIAL_CONVERSATIONS, 
  WorkerConversation, 
  WorkerChatMessage,
  WorkerDocCitation 
} from '../../data/workerMockData';
import { WorkerLeftSidebar, WorkerMode } from './WorkerLeftSidebar';
import { WorkerHistoryPanel } from './WorkerHistoryPanel';
import { WorkerChatArea } from './WorkerChatArea';
import { FileManageModal } from './FileManageModal';
import { TaskFileManageModal } from './TaskFileManageModal';

interface AiWorkerProps {
  onShowToast: (msg: string) => void;
}

// 사용자 첫 질문 기반 간결한 대화 제목 자동 생성기
function generateCleanTitle(prompt: string): string {
  let clean = prompt.trim();
  clean = clean.replace(/(정리해줘|요약해줘|작성해줘|알려줘|부탁해|분석해줘|추천해줘|설명해줘|해줘|줘요|주세요|해\s*주세요)$/g, '');
  clean = clean.trim();
  if (clean.length > 20) {
    clean = clean.slice(0, 20) + '...';
  }
  return clean || '새 업무 대화';
}

export const AiWorker: React.FC<AiWorkerProps> = ({ onShowToast }) => {
  // Mode: 'task' (업무 도우미 - 요구사항에 따라 기본 활성) | 'document' (문서 도우미)
  const [currentMode, setCurrentMode] = useState<WorkerMode>('task');

  // 문서 도우미용 RAG Documents State (초기 5건, 3건 기본 선택)
  const [documents, setDocuments] = useState<WorkerDocument[]>(INITIAL_WORKER_DOCUMENTS);
  const [isFileManagerOpen, setIsFileManagerOpen] = useState(false);

  // 업무 도우미용 일반 첨부 파일 State (요구사항: 초기 0건에서 첨부 시 자동 증가)
  const [taskFiles, setTaskFiles] = useState<TaskAttachedFile[]>([]);
  const [isTaskFileManagerOpen, setIsTaskFileManagerOpen] = useState(false);

  // Multi-LLM 현재 선택 모델 (기본: GPT-5.5)
  const [selectedModel, setSelectedModel] = useState<string>('GPT-5.5');

  // Conversation & History State
  const [conversations, setConversations] = useState<WorkerConversation[]>(INITIAL_CONVERSATIONS);
  const [activeConversationId, setActiveConversationId] = useState<string | null>('conv-1');

  // UI Panels Collapse State
  const [isLeftCollapsed, setIsLeftCollapsed] = useState(false);
  const [isRightCollapsed, setIsRightCollapsed] = useState(false);

  // AI Generation State
  const [isThinking, setIsThinking] = useState(false);

  // Computed values
  const selectedDocs = documents.filter(d => d.selected);
  const selectedDocCount = selectedDocs.length;

  const currentConversation = conversations.find(c => c.id === activeConversationId) || null;
  const currentMessages = currentConversation ? currentConversation.messages : [];

  // ==================== 문서 도우미 (RAG 문서 관리함) 핸들러 ====================
  const handleToggleDocumentSelect = (id: string) => {
    setDocuments(prev =>
      prev.map(doc =>
        doc.id === id ? { ...doc, selected: !doc.selected } : doc
      )
    );
  };

  const handleSelectAllDocuments = () => {
    setDocuments(prev => prev.map(doc => ({ ...doc, selected: true })));
    onShowToast('전체 문서를 검색 대상으로 선택했습니다.');
  };

  const handleDeselectAllDocuments = () => {
    setDocuments(prev => prev.map(doc => ({ ...doc, selected: false })));
    onShowToast('전체 문서 선택을 해제했습니다.');
  };

  const handleDeleteFile = (id: string) => {
    const target = documents.find(d => d.id === id);
    setDocuments(prev => prev.filter(d => d.id !== id));
    if (target) {
      onShowToast(`'${target.name}' 문서가 삭제되었습니다.`);
    }
  };

  const handleDeleteSelectedFiles = () => {
    const count = documents.filter(d => d.selected).length;
    setDocuments(prev => prev.filter(d => !d.selected));
    onShowToast(`선택된 검색 문서 ${count}건이 삭제되었습니다.`);
  };

  const handleUploadFiles = (files: FileList) => {
    const newDocs: WorkerDocument[] = Array.from(files).map((file, idx) => {
      const ext = file.name.split('.').pop()?.toUpperCase() || 'PDF';
      const format = (['PDF', 'HWP', 'DOCX', 'XLSX', 'PPTX', 'TXT'].includes(ext) ? ext : 'PDF') as any;
      return {
        id: `doc-upload-${Date.now()}-${idx}`,
        name: file.name,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        pages: Math.floor(Math.random() * 20) + 5,
        format,
        uploadedAt: '방금 전',
        uploader: '정소담 (AI사업본부)',
        category: '개인업로드',
        status: '인덱싱 완료',
        extractedChunks: Math.floor(Math.random() * 40) + 15,
        summary: '사용자 지정 업로드 파일 (RAG 검색 색인 완료)',
        selected: true
      };
    });

    setDocuments(prev => [...newDocs, ...prev]);
    onShowToast(`문서 ${newDocs.length}건이 업로드되어 검색 대상에 자동 추가되었습니다.`);
  };

  const handleConfirmFileManager = () => {
    setIsFileManagerOpen(false);
    onShowToast(`검색 대상 문서가 ${selectedDocCount}건으로 갱신되었습니다.`);
  };

  // ==================== 업무 도우미 (일반 파일 관리함) 핸들러 ====================
  const handleToggleTaskFileSelect = (id: string) => {
    setTaskFiles(prev =>
      prev.map(f => f.id === id ? { ...f, selected: !f.selected } : f)
    );
  };

  const handleSelectAllTaskFiles = () => {
    setTaskFiles(prev => prev.map(f => ({ ...f, selected: true })));
    onShowToast('전체 첨부 파일을 선택했습니다.');
  };

  const handleDeselectAllTaskFiles = () => {
    setTaskFiles(prev => prev.map(f => ({ ...f, selected: false })));
    onShowToast('전체 첨부 파일 선택을 해제했습니다.');
  };

  const handleDeleteTaskFile = (id: string) => {
    const target = taskFiles.find(f => f.id === id);
    setTaskFiles(prev => prev.filter(f => f.id !== id));
    if (target) {
      onShowToast(`'${target.name}' 파일이 삭제되었습니다.`);
    }
  };

  const handleDeleteSelectedTaskFiles = () => {
    const count = taskFiles.filter(f => f.selected).length;
    setTaskFiles(prev => prev.filter(f => !f.selected));
    onShowToast(`선택된 첨부 파일 ${count}건이 삭제되었습니다.`);
  };

  const handleUploadTaskFiles = (fileList: FileList) => {
    const newItems: TaskAttachedFile[] = Array.from(fileList).map((f, i) => {
      const ext = f.name.split('.').pop()?.toUpperCase() || 'TXT';
      let format: TaskAttachedFile['format'] = 'TXT';
      if (ext === 'PDF') format = 'PDF';
      else if (['DOCX', 'DOC'].includes(ext)) format = 'DOCX';
      else if (['XLSX', 'XLS'].includes(ext)) format = 'XLSX';
      else if (['PPTX', 'PPT'].includes(ext)) format = 'PPTX';
      else if (['PNG', 'JPG', 'JPEG'].includes(ext)) format = 'IMAGE';

      return {
        id: `task-file-${Date.now()}-${i}`,
        name: f.name,
        size: `${(f.size / 1024).toFixed(1)} KB`,
        format,
        uploadedAt: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        selected: true
      };
    });

    setTaskFiles(prev => [...newItems, ...prev]);
    onShowToast(`파일 ${newItems.length}건이 첨부 파일 목록에 추가되었습니다.`);
  };

  const handleQuickAttachFile = (file: File) => {
    const ext = file.name.split('.').pop()?.toUpperCase() || 'TXT';
    let format: TaskAttachedFile['format'] = 'TXT';
    if (ext === 'PDF') format = 'PDF';
    else if (['DOCX', 'DOC'].includes(ext)) format = 'DOCX';
    else if (['XLSX', 'XLS'].includes(ext)) format = 'XLSX';
    else if (['PPTX', 'PPT'].includes(ext)) format = 'PPTX';
    else if (['PNG', 'JPG', 'JPEG'].includes(ext)) format = 'IMAGE';

    const newItem: TaskAttachedFile = {
      id: `task-file-${Date.now()}`,
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      format,
      uploadedAt: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      selected: true
    };
    setTaskFiles(prev => [newItem, ...prev]);
  };

  // ==================== Multi-LLM 모델 변경 핸들러 (Section 9) ====================
  const handleSelectModel = (newModel: string) => {
    if (newModel === selectedModel) return;
    setSelectedModel(newModel);

    // 대화 도중 모델을 변경하면 채팅창 중앙에 시스템 안내 메시지 표시
    const nowTime = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    const systemMsg: WorkerChatMessage = {
      id: `sys-${Date.now()}`,
      sender: 'system',
      content: `${newModel}(으)로 모델이 변경되었습니다.`,
      timestamp: nowTime
    };

    if (activeConversationId) {
      setConversations(prev => prev.map(c => {
        if (c.id === activeConversationId) {
          return {
            ...c,
            model: newModel,
            messages: [...c.messages, systemMsg]
          };
        }
        return c;
      }));
    }

    onShowToast(`${newModel}(으)로 모델이 변경되었습니다.`);
  };

  // ==================== Mode & History Handlers ====================
  const handleSelectMode = (mode: WorkerMode) => {
    setCurrentMode(mode);
    if (currentConversation && currentConversation.mode !== mode) {
      const matched = conversations.find(c => c.mode === mode);
      if (matched) {
        setActiveConversationId(matched.id);
        if (matched.model) {
          setSelectedModel(matched.model);
        }
      } else {
        setActiveConversationId(null);
      }
    }
    onShowToast(`[${mode === 'document' ? '문서 도우미' : '업무 도우미'}] 모드로 전환되었습니다.`);
  };

  const handleSelectConversation = (id: string) => {
    const conv = conversations.find(c => c.id === id);
    if (conv) {
      setActiveConversationId(id);
      setCurrentMode(conv.mode);
      if (conv.model) {
        setSelectedModel(conv.model);
      }
    }
  };

  const handleNewChat = () => {
    setActiveConversationId(null);
    onShowToast('새로운 대화 작업 공간이 준비되었습니다.');
  };

  const handleDeleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConversations(prev => prev.filter(c => c.id !== id));
    if (activeConversationId === id) {
      setActiveConversationId(null);
    }
    onShowToast('대화 기록이 삭제되었습니다.');
  };

  // ==================== AI 응답 리액션 및 재생성 ====================
  const handleToggleMessageReaction = (msgId: string, type: 'like' | 'dislike') => {
    if (!activeConversationId) return;

    setConversations(prev => prev.map(c => {
      if (c.id === activeConversationId) {
        return {
          ...c,
          messages: c.messages.map(m => {
            if (m.id === msgId) {
              if (type === 'like') {
                return { ...m, liked: !m.liked, disliked: false };
              } else {
                return { ...m, disliked: !m.disliked, liked: false };
              }
            }
            return m;
          })
        };
      }
      return c;
    }));

    if (type === 'like') {
      onShowToast('좋아요 피드백이 반영되었습니다.');
    } else {
      onShowToast('의견이 접수되었습니다. 모델 응답 개선에 반영합니다.');
    }
  };

  const handleRegenerateResponse = () => {
    if (!activeConversationId || !currentConversation || isThinking) return;

    // 마지막 사용자 메시지 찾기
    const userMessages = currentConversation.messages.filter(m => m.sender === 'user');
    if (userMessages.length === 0) return;
    const lastUserMsg = userMessages[userMessages.length - 1];

    setIsThinking(true);
    setTimeout(() => {
      const nowTime = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
      const regeneratedContent = `[${selectedModel} 재작성 응답]\n\n앞선 답변을 보완하여 더욱 구체적이고 실무적인 관점에서 재구성한 결과입니다.\n\n### 1. 핵심 실행 과제 세분화\n• **단기 추진 (1~3개월)**: 현안 부서 요구 수렴 및 우선순위 매트릭스 도출\n• **중기 추진 (4~6개월)**: KPC 표준 템플릿과 연계한 파일럿 테스트 시행\n• **확산 단계**: 전사 확산 및 지속적인 모델 파라미터 최적화\n\n### 2. 기대 효과 및 위험 관리\n• 업무 생산성 약 35% 향상 기대\n• 사내 보안 규정 준수 및 온프레미스 망분리 안전성 유지`;

      const newAiMsg: WorkerChatMessage = {
        id: `msg-${Date.now()}-regen`,
        sender: 'assistant',
        content: regeneratedContent,
        timestamp: nowTime,
        model: selectedModel
      };

      setConversations(prev => prev.map(c => {
        if (c.id === activeConversationId) {
          return {
            ...c,
            lastMessage: regeneratedContent.slice(0, 30) + '...',
            updatedAt: nowTime,
            messages: [...c.messages, newAiMsg]
          };
        }
        return c;
      }));

      setIsThinking(false);
      onShowToast('새로운 답변이 생성되었습니다.');
    }, 800);
  };

  // ==================== Chat Message Handler (Section 12) ====================
  const handleSendMessage = (userText: string, attachedFiles?: string[]) => {
    const nowTime = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
    const userMsg: WorkerChatMessage = {
      id: `msg-${Date.now()}-u`,
      sender: 'user',
      content: userText,
      timestamp: nowTime,
      attachedFiles: attachedFiles && attachedFiles.length > 0 ? attachedFiles : undefined
    };

    let targetConvId = activeConversationId;
    let updatedConversations = [...conversations];

    if (!targetConvId) {
      // 12. 대화 기록 동작: 대화 제목은 첫 질문을 기반으로 AI가 자동 생성
      targetConvId = `conv-${Date.now()}`;
      const generatedTitle = generateCleanTitle(userText);
      const currentMonth = '2026-09';

      const newConv: WorkerConversation = {
        id: targetConvId,
        mode: currentMode,
        title: generatedTitle,
        lastMessage: userText,
        updatedAt: nowTime,
        month: currentMonth,
        model: selectedModel,
        selectedDocCount: currentMode === 'document' ? selectedDocCount : undefined,
        messages: [userMsg]
      };
      updatedConversations = [newConv, ...conversations];
      setConversations(updatedConversations);
      setActiveConversationId(targetConvId);
    } else {
      // Append to existing conversation
      updatedConversations = conversations.map(c => {
        if (c.id === targetConvId) {
          return {
            ...c,
            lastMessage: userText,
            updatedAt: nowTime,
            model: selectedModel,
            messages: [...c.messages, userMsg]
          };
        }
        return c;
      });
      setConversations(updatedConversations);
    }

    // AI Response Simulation
    setIsThinking(true);
    setTimeout(() => {
      let aiContent = '';
      let citations: WorkerDocCitation[] = [];

      if (currentMode === 'document') {
        // 문서 도우미 응답
        const docNames = selectedDocs.map(d => d.name).join(', ');
        
        if (userText.includes('요구사항') || userText.includes('RFP') || userText.includes('플랫폼')) {
          aiContent = `선택하신 검색 대상 문서 **[${selectedDocs[0]?.name || 'KPC_AI플랫폼_RFP.pdf'}]**를 대조 분석한 **KPC AI 플랫폼 주요 구축 요구사항**입니다.\n\n### 1. 보안 및 온프레미스 망분리 요건\n• 사내 폐쇄망에 생성형 AI 엔진 및 RAG 벡터 DB를 직접 구축하여 외부 데이터 유출을 원천 방지합니다.\n• 사용자의 프롬프트와 업로드 문서 내 개인정보(주민등록번호, 계좌 등)를 실시간 마스킹하는 DLP 게이트웨이를 전단에 배치합니다.\n\n### 2. 한정 검색(RAG) 및 팩트 기반 응답\n• 외부 웹 모델의 환각 현상을 차단하고, 사용자가 선택한 **${selectedDocCount}건의 내부 문서 내용만을 100% 근거**로 답변합니다.\n• 모든 답변 문맥에 원본 문서명과 해당 페이지, 조항 인용구를 자동 첨부합니다.\n\n### 3. 실무자 중심 업무/문서 도우미 작업 공간\n• 복잡한 대시보드나 에이전트 나열 대신, 직관적인 문서 관리함과 넓은 채팅 공간을 통해 실무 효율성을 극대화합니다.`;
          citations = [
            {
              name: selectedDocs[0]?.name || 'KPC_AI플랫폼_RFP.pdf',
              page: 14,
              section: '제3장 과업 상세 규격 - 3.2 AI 모델 연동 요건',
              quote: '생성형 AI 모델 및 RAG 벡터 DB는 사내 온프레미스 망분리 환경에 독립 설치되어야 하며, 외부 인터넷망으로의 프롬프트 및 문서 데이터 유출을 물리적으로 원천 차단해야 한다.'
            },
            {
              name: selectedDocs[1]?.name || '2026_KPC_사업계획서.pdf',
              page: 8,
              section: '제1장 전사 목표 - 1.3 디지털 전환 전략',
              quote: '임직원 누구나 손쉽게 활용할 수 있는 문서 도우미·업무 도우미 중심의 실무형 AI 인터페이스를 선제적으로 도입한다.'
            }
          ];
        } else {
          aiContent = `선택하신 **${selectedDocCount}건의 검색 문서(${docNames})**의 원문을 정밀 검색하여 도출한 결과입니다.\n\n• **핵심 요약**: 질의하신 내용과 관련된 핵심 데이터 포인트가 선택 문서의 본문 섹션에 일치하여 요약 정리되었습니다.\n• **세부 사항**: 각 항목별 규정 및 가이드라인에 부합하는 수치와 기준이 확인되었습니다.\n\n상세 내용은 아래 첨부된 참고 문서 출처 및 원본 페이지를 확인해주세요.`;
          citations = selectedDocs.slice(0, 2).map((d, i) => ({
            name: d.name,
            page: (i + 1) * 7,
            section: `제${i + 1}편 관련 규정 및 통계 항목`,
            quote: `${d.name} 원본 문서의 본문에서 질의와 일치하는 키워드 및 연관 문맥이 추출되었습니다.`
          }));
        }
      } else {
        // 10. 업무 도우미 응답 (Multi-LLM 모델 반영)
        const attachedNote = attachedFiles && attachedFiles.length > 0 
          ? `\n\n> 📎 **참고 첨부 파일**: ${attachedFiles.join(', ')}의 본문 구조를 파악하여 반영했습니다.`
          : '';

        aiContent = `**${selectedModel}** 모델 기반으로 질의하신 내용에 대해 분석한 업무 가이드 및 해결 방안입니다.${attachedNote}\n\n### 1. 주요 핵심 개요 및 구조화\n• 요청사항: **"${userText.slice(0, 30)}${userText.length > 30 ? '...' : ''}"**\n• 목표: 비즈니스 의사결정 속도 단축 및 실행 리스크 최소화\n• 접근 방식: KPC 기업 표준 프로세스 준용 및 실무 중심 체크리스트 적용\n\n### 2. 세부 실행 방안 및 단계별 가이드\n1. **현황 분석 및 범위 설정**: 유관 부서와의 R&R 정립 및 사전 자원 배분\n2. **핵심 산출물 작성**: 표준 서식 기반 초안 작성 및 타당성 검토\n3. **품질 검증 및 공유**: 핵심 성과 지표(KPI) 매칭 및 최종 승인 절차 진행\n\n추가 보완이나 상세 기획서 초안 양식이 필요하시면 언제든 추가 질문을 입력해 주세요!`;
      }

      const aiMsg: WorkerChatMessage = {
        id: `msg-${Date.now()}-a`,
        sender: 'assistant',
        content: aiContent,
        timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        referencedDocs: citations.length > 0 ? citations : undefined,
        isStrictGrounding: currentMode === 'document',
        model: currentMode === 'task' ? selectedModel : undefined
      };

      setConversations(prev => prev.map(c => {
        if (c.id === targetConvId) {
          return {
            ...c,
            lastMessage: aiContent.slice(0, 30) + '...',
            messages: [...c.messages, aiMsg]
          };
        }
        return c;
      }));

      setIsThinking(false);
    }, 700);
  };

  return (
    <div 
      id="ai-worker-root"
      className="flex-1 flex overflow-hidden bg-white h-full"
    >
      {/* ① 왼쪽 AI Worker 사이드바 영역 */}
      <WorkerLeftSidebar
        currentMode={currentMode}
        onSelectMode={handleSelectMode}
        documents={documents}
        onOpenFileManager={() => setIsFileManagerOpen(true)}
        taskFiles={taskFiles}
        onOpenTaskFileManager={() => setIsTaskFileManagerOpen(true)}
        isCollapsed={isLeftCollapsed}
        onToggleCollapse={() => setIsLeftCollapsed(!isLeftCollapsed)}
      />

      {/* ② & ③ 중앙 업무 도우미 채팅 영역 & 하단 입력창 */}
      <WorkerChatArea
        mode={currentMode}
        selectedDocCount={selectedDocCount}
        messages={currentMessages}
        isThinking={isThinking}
        onSendMessage={handleSendMessage}
        onOpenFileManager={() => setIsFileManagerOpen(true)}
        onShowToast={onShowToast}
        taskFiles={taskFiles}
        onOpenTaskFileManager={() => setIsTaskFileManagerOpen(true)}
        selectedModel={selectedModel}
        onSelectModel={handleSelectModel}
        onRegenerateResponse={handleRegenerateResponse}
        onToggleMessageReaction={handleToggleMessageReaction}
        onQuickAttachFile={handleQuickAttachFile}
      />

      {/* ④ 오른쪽 이전 대화 기록 영역 */}
      <WorkerHistoryPanel
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        onNewChat={handleNewChat}
        onDeleteConversation={handleDeleteConversation}
        isCollapsed={isRightCollapsed}
        onToggleCollapse={() => setIsRightCollapsed(!isRightCollapsed)}
      />

      {/* 8. 「업무 도우미」 파일 관리 Modal */}
      <TaskFileManageModal
        isOpen={isTaskFileManagerOpen}
        onClose={() => setIsTaskFileManagerOpen(false)}
        files={taskFiles}
        onToggleSelect={handleToggleTaskFileSelect}
        onSelectAll={handleSelectAllTaskFiles}
        onDeselectAll={handleDeselectAllTaskFiles}
        onDeleteFile={handleDeleteTaskFile}
        onDeleteSelectedFiles={handleDeleteSelectedTaskFiles}
        onUploadFiles={handleUploadTaskFiles}
        onConfirm={() => {
          setIsTaskFileManagerOpen(false);
          onShowToast(`첨부 파일 ${taskFiles.length}건이 적용되었습니다.`);
        }}
      />

      {/* 「문서 도우미」 RAG 문서 관리 Modal (유지) */}
      <FileManageModal
        isOpen={isFileManagerOpen}
        onClose={() => setIsFileManagerOpen(false)}
        documents={documents}
        onToggleSelect={handleToggleDocumentSelect}
        onSelectAll={handleSelectAllDocuments}
        onDeselectAll={handleDeselectAllDocuments}
        onDeleteFile={handleDeleteFile}
        onDeleteSelectedFiles={handleDeleteSelectedFiles}
        onUploadFiles={handleUploadFiles}
        onConfirm={handleConfirmFileManager}
      />
    </div>
  );
};
