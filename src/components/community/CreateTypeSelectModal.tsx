import React from 'react';
import { 
  X, 
  Bot, 
  Layout, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Terminal, 
  Cpu, 
  Globe,
  SlidersHorizontal,
  Wand2,
  Share2
} from 'lucide-react';

interface CreateTypeSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAgent?: () => void;
  onSelectCustomAi?: () => void;
  onSelectType?: (type: 'ai_agent' | 'custom_ai') => void;
}

export const CreateTypeSelectModal: React.FC<CreateTypeSelectModalProps> = ({
  isOpen,
  onClose,
  onSelectAgent,
  onSelectCustomAi,
  onSelectType
}) => {
  if (!isOpen) return null;

  const handleSelectAgent = () => {
    onClose();
    if (onSelectAgent) onSelectAgent();
    if (onSelectType) onSelectType('ai_agent');
  };

  const handleSelectCustomAi = () => {
    onClose();
    if (onSelectCustomAi) onSelectCustomAi();
    if (onSelectType) onSelectType('custom_ai');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="create-type-select-modal"
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-6 sm:px-8 border-b border-neutral-100 flex items-start justify-between bg-gradient-to-b from-neutral-50/70 to-white">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-50 text-[#E60012] text-xs font-bold border border-red-100">
                <Sparkles className="w-3 h-3" />
                AI Community 신규 등록
              </span>
              <span className="text-xs text-neutral-400 font-medium">· KPC 임직원 전용</span>
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">
              무엇을 만들거나 공유하시겠어요?
            </h2>
            <p className="text-sm text-neutral-600 mt-1">
              AI Agent를 직접 만들거나, 별도로 개발한 Custom AI를 Community에 등록할 수 있습니다.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
            title="닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content: 2 Cards Selection */}
        <div className="p-6 sm:p-8 bg-[#FAFBFD] flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Card 1: AI Agent */}
            <div 
              id="card-select-ai-agent"
              className="group relative bg-white rounded-2xl border-2 border-neutral-200 hover:border-neutral-900 hover:shadow-xl transition-all duration-200 p-6 sm:p-7 flex flex-col justify-between"
            >
              {/* Top badge & Icon */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-neutral-900 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                    <Bot className="w-6 h-6 text-red-500" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-bold border border-neutral-200">
                    스튜디오 직접 제작
                  </span>
                </div>

                <div className="mb-2">
                  <h3 className="text-xl font-bold text-neutral-900 group-hover:text-[#E60012] transition-colors">
                    AI Agent
                  </h3>
                  <p className="text-xs text-neutral-500 font-mono mt-0.5">
                    Internal Agent Builder
                  </p>
                </div>

                <p className="text-sm text-neutral-700 leading-relaxed mb-5">
                  프롬프트, 지식, 커넥터를 활용해 가볍게 실행되는 업무용 Agent를 직접 만들어보세요.
                </p>

                {/* 핵심 특징 7가지 목록 */}
                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100 mb-6 space-y-2">
                  <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                    핵심 제작 특징
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-700">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-neutral-900 shrink-0" />
                      <span>자연어로 Agent 생성</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-neutral-900 shrink-0" />
                      <span>시스템 지침 설정</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-neutral-900 shrink-0" />
                      <span>내부 지식 연결</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-neutral-900 shrink-0" />
                      <span>커넥터 연결</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-neutral-900 shrink-0" />
                      <span>AI 모델 설정</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-neutral-900 shrink-0" />
                      <span>권한 설정</span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:col-span-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#E60012] shrink-0" />
                      <span className="font-semibold text-neutral-900">실시간 대화형 테스트 지원</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div>
                <div className="text-[11px] text-neutral-400 mb-2 flex items-center gap-1">
                  <span>승인 완료 시:</span>
                  <strong className="text-neutral-700 font-semibold">AI Agent GNB 공식 등록</strong>
                </div>
                <button
                  type="button"
                  id="btn-confirm-select-agent"
                  onClick={handleSelectAgent}
                  className="w-full py-3 px-4 rounded-xl bg-neutral-900 hover:bg-black text-white text-sm font-bold shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Bot className="w-4 h-4 text-red-500" />
                  <span>AI Agent 만들기</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Card 2: Custom AI */}
            <div 
              id="card-select-custom-ai"
              className="group relative bg-white rounded-2xl border-2 border-neutral-200 hover:border-[#E60012] hover:shadow-xl transition-all duration-200 p-6 sm:p-7 flex flex-col justify-between"
            >
              {/* Top badge & Icon */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-red-50 text-[#E60012] border border-red-200 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                    <Layout className="w-6 h-6 text-[#E60012]" />
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-red-50 text-[#E60012] text-xs font-bold border border-red-200">
                    별도 서비스 등록
                  </span>
                </div>

                <div className="mb-2">
                  <h3 className="text-xl font-bold text-neutral-900 group-hover:text-[#E60012] transition-colors">
                    Custom AI
                  </h3>
                  <p className="text-xs text-neutral-500 font-mono mt-0.5">
                    External / Standalone AI Service
                  </p>
                </div>

                <p className="text-sm text-neutral-700 leading-relaxed mb-5">
                  별도의 화면과 업무 흐름을 가진 AI 서비스를 Community에 등록하고 공유하세요.
                </p>

                {/* 핵심 특징 6가지 목록 */}
                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100 mb-6 space-y-2">
                  <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                    핵심 서비스 특징
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-700">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#E60012] shrink-0" />
                      <span>별도 UI를 가진 AI 서비스</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#E60012] shrink-0" />
                      <span>Web App 형태 가능</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#E60012] shrink-0" />
                      <span>Prototype 형태 가능</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#E60012] shrink-0" />
                      <span>API / MCP 연동 가능</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#E60012] shrink-0" />
                      <span>독립적인 업무 프로세스</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#E60012] shrink-0" />
                      <span>별도 개발 결과물 등록</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div>
                <div className="text-[11px] text-neutral-400 mb-2 flex items-center gap-1">
                  <span>승인 완료 시:</span>
                  <strong className="text-neutral-700 font-semibold">Custom AI GNB 공식 등록</strong>
                </div>
                <button
                  type="button"
                  id="btn-confirm-select-custom-ai"
                  onClick={handleSelectCustomAi}
                  className="w-full py-3 px-4 rounded-xl bg-[#E60012] hover:bg-[#CC0010] text-white text-sm font-bold shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Layout className="w-4 h-4" />
                  <span>Custom AI 업로드 하기</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Footer info banner */}
        <div className="px-6 py-3.5 sm:px-8 bg-neutral-100 border-t border-neutral-200 text-xs text-neutral-600 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>AI Community에서 사내 임직원 피드백을 받은 후 관리자 검수를 거쳐 전사 공식 서비스로 배포됩니다.</span>
          </div>
          <span className="text-neutral-400 font-mono text-[11px]">KPC Enterprise AI Platform</span>
        </div>

      </div>
    </div>
  );
};
