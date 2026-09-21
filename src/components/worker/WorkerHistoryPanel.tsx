import React from 'react';
import { 
  History, 
  Plus, 
  Trash2, 
  MessageSquare, 
  FileText, 
  Briefcase,
  PanelRightClose, 
  PanelRightOpen,
  Calendar
} from 'lucide-react';
import { WorkerConversation } from '../../data/workerMockData';

interface WorkerHistoryPanelProps {
  conversations: WorkerConversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onDeleteConversation: (id: string, e: React.MouseEvent) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const WorkerHistoryPanel: React.FC<WorkerHistoryPanelProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  isCollapsed,
  onToggleCollapse
}) => {
  if (isCollapsed) {
    return (
      <aside 
        id="worker-history-panel-collapsed"
        className="w-12 border-l border-neutral-200 bg-white flex flex-col items-center py-4 justify-between transition-all shrink-0"
      >
        <div className="flex flex-col items-center gap-3">
          <button
            id="worker-history-expand-btn"
            onClick={onToggleCollapse}
            className="p-2 rounded-md text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
            title="대화 기록 펼치기"
          >
            <PanelRightOpen className="w-5 h-5" />
          </button>

          <button
            id="worker-history-new-mini-btn"
            onClick={onNewChat}
            className="p-2 rounded-md text-neutral-700 hover:text-[#E60012] hover:bg-red-50 transition-colors cursor-pointer"
            title="새 대화 시작"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </aside>
    );
  }

  // 월별 그룹화 (2026-09, 2026-08 등)
  const groupedByMonth: Record<string, WorkerConversation[]> = {};
  conversations.forEach(conv => {
    const monthKey = conv.month || '2026-09';
    if (!groupedByMonth[monthKey]) {
      groupedByMonth[monthKey] = [];
    }
    groupedByMonth[monthKey].push(conv);
  });

  const sortedMonths = Object.keys(groupedByMonth).sort((a, b) => b.localeCompare(a));

  return (
    <aside 
      id="worker-history-panel"
      className="w-64 border-l border-neutral-200 bg-white flex flex-col justify-between transition-all shrink-0 select-none"
    >
      {/* Top Header with History Icon */}
      <div className="p-3.5 border-b border-neutral-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-neutral-600" />
          <h3 className="text-xs font-bold text-neutral-900">대화 기록</h3>
          <span className="text-[10px] text-neutral-400 font-mono">({conversations.length})</span>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            id="worker-history-new-chat-btn"
            onClick={onNewChat}
            className="flex items-center gap-1 px-2 py-1 text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 rounded transition-colors cursor-pointer shadow-2xs"
            title="새 대화 시작"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>새 대화</span>
          </button>
          
          <button
            id="worker-history-collapse-btn"
            onClick={onToggleCollapse}
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
            title="대화 기록 접기"
          >
            <PanelRightClose className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* History List with Month Headers */}
      <div className="flex-1 overflow-y-auto p-2 space-y-4">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center text-neutral-400">
            <MessageSquare className="w-8 h-8 text-neutral-300 stroke-1 mb-2" />
            <p className="text-xs font-medium text-neutral-500">저장된 대화 기록이 없습니다.</p>
            <p className="text-[11px] text-neutral-400 mt-1">새 질문을 전송하면 여기에 기록됩니다.</p>
          </div>
        ) : (
          sortedMonths.map(month => {
            const monthConvs = groupedByMonth[month];
            return (
              <div key={month} className="space-y-1">
                {/* Month Section Header */}
                <div className="px-2 pt-1 pb-1 flex items-center gap-1.5 text-[11px] font-bold text-neutral-500 tracking-tight">
                  <Calendar className="w-3 h-3 text-neutral-400" />
                  <span>{month}</span>
                  <span className="text-[10px] text-neutral-400 font-normal">({monthConvs.length})</span>
                </div>

                {/* Conversation Items under this month */}
                <div className="space-y-1">
                  {monthConvs.map(conv => {
                    const isActive = activeConversationId === conv.id;
                    return (
                      <div
                        key={conv.id}
                        id={`history-item-${conv.id}`}
                        onClick={() => onSelectConversation(conv.id)}
                        className={`group relative flex flex-col p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                          isActive
                            ? 'bg-red-50/60 border-red-200 shadow-2xs'
                            : 'bg-white hover:bg-neutral-50 border-transparent hover:border-neutral-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <div className="flex items-center gap-1.5 min-w-0 flex-1">
                            {conv.mode === 'document' ? (
                              <FileText className="w-3 h-3 text-[#E60012] shrink-0" />
                            ) : (
                              <Briefcase className="w-3 h-3 text-neutral-500 shrink-0" />
                            )}
                            <span className={`text-xs font-semibold truncate ${
                              isActive ? 'text-[#E60012]' : 'text-neutral-800'
                            }`}>
                              {conv.title}
                            </span>
                          </div>

                          <button
                            id={`delete-conv-${conv.id}`}
                            onClick={(e) => onDeleteConversation(conv.id, e)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-red-600 rounded transition-opacity cursor-pointer shrink-0"
                            title="대화 삭제"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>

                        <p className="text-[11px] text-neutral-500 truncate mt-1">
                          {conv.lastMessage}
                        </p>

                        <div className="flex items-center justify-between text-[10px] text-neutral-400 mt-1.5 pt-1 border-t border-neutral-100">
                          <div className="flex items-center gap-1.5">
                            <span>{conv.mode === 'document' ? '문서 도우미' : '업무 도우미'}</span>
                            {conv.model && (
                              <span className="font-mono bg-neutral-100 px-1 py-0.2 rounded text-[9px] text-neutral-600">
                                {conv.model}
                              </span>
                            )}
                          </div>
                          <span>{conv.updatedAt}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-neutral-200 bg-neutral-50/50 text-[10px] text-neutral-400 text-center">
        대화는 브라우저 및 사내 작업 공간에 안전하게 동기화됩니다.
      </div>
    </aside>
  );
};
