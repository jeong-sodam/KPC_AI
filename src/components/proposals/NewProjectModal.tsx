import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  FileText, 
  FolderPlus, 
  Check, 
  Building2,
  Calendar,
  ArrowRight,
  ListChecks,
  HelpCircle,
  FileEdit,
  Info
} from 'lucide-react';
import { ProposalProject, ProjectType, ProposalWorkflowType } from '../../types';

export interface WorkflowOption {
  id: ProposalWorkflowType;
  title: string;
  enTitle: string;
  desc: string;
  icon: React.ReactNode;
  badge?: string;
}

export const WORKFLOW_OPTIONS: WorkflowOption[] = [
  {
    id: 'requirements',
    title: '요구사항 기반 제안서',
    enTitle: 'Smart Requirements Workflow',
    desc: 'RFP에 구조화된 요구사항이 포함되어 있고, 각 요구사항에 대응하는 방식으로 제안서를 작성하는 경우 사용',
    badge: '기본 권장',
    icon: <ListChecks className="w-5 h-5 text-[#E60012]" />
  },
  {
    id: 'qa',
    title: '질의응답 기반 제안서',
    enTitle: 'Smart Questions Workflow',
    desc: 'RFP에 개별 질문이나 작성 항목이 제시되어 있고, 각 질문별로 답변을 작성해야 하는 경우 사용',
    icon: <HelpCircle className="w-5 h-5 text-blue-600" />
  },
  {
    id: 'blank',
    title: '자유 작성',
    enTitle: 'Blank Workflow',
    desc: '정형화된 요구사항이나 질문 구조 없이 사용자가 원하는 구성으로 제안서를 처음부터 작성하는 경우 사용',
    icon: <FileEdit className="w-5 h-5 text-neutral-700" />
  }
];

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (newProj: ProposalProject & { creationMethod?: string; rfpName?: string }) => void;
  onShowToast: (msg: string) => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  onCreateProject,
  onShowToast
}) => {
  const [projectName, setProjectName] = useState('');
  const [workflowType, setWorkflowType] = useState<ProposalWorkflowType>('requirements');
  const [agencyName, setAgencyName] = useState('한국생산성본부');
  const [deadline, setDeadline] = useState('2026.11.30');
  const [projectType, setProjectType] = useState<ProjectType>('Proposal AI');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) {
      onShowToast('프로젝트명을 입력해 주세요.');
      return;
    }

    const selectedWorkflow = WORKFLOW_OPTIONS.find(w => w.id === workflowType);

    const newProj: ProposalProject & { creationMethod: string; rfpName?: string } = {
      id: `proj-${Date.now()}`,
      title: projectName.trim(),
      agency: agencyName.trim() || '한국생산성본부',
      rfpName: `${projectName.trim()} RFP`,
      budget: 1000000000,
      deadline: deadline || '2026.11.30',
      dDay: 45,
      status: '진행',
      stage: 'kickoff' as any,
      manager: '정소담',
      teamMembers: ['정소담'],
      pWin: 85,
      rfpId: `rfp-custom-${Date.now()}`,
      projectType: projectType,
      workflowType: workflowType,
      creationMethod: workflowType,
      analysisStatus: 'RFP 미등록',
      analysisProgress: 0,
      documents: []
    };

    onCreateProject(newProj);
    onShowToast(`'${newProj.title}' 프로젝트가 생성되었습니다. [${selectedWorkflow?.title}] 방식으로 RFP를 업로드해 주세요.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-neutral-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-[#E60012]">
              <FolderPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-[#111111]">신규 제안 프로젝트 생성</h2>
              <p className="text-xs text-neutral-500">프로젝트명을 입력하고 제안서 작성 Workflow를 선택하세요.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
          {/* 1. 프로젝트명 입력 */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-[#111111] flex items-center gap-1">
                <span>1. 프로젝트명 입력</span>
                <span className="text-[#E60012] font-black">*</span>
              </label>
              <span className="text-[11px] text-neutral-400">제안서 대상 사업명을 입력합니다</span>
            </div>
            <input
              id="new-project-title-input"
              type="text"
              required
              autoFocus
              placeholder="예: 2026 KPC AI 플랫폼 구축 사업"
              value={projectName}
              onChange={e => setProjectName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-neutral-300 text-sm text-[#111111] placeholder-neutral-400 focus:outline-none focus:border-[#E60012] focus:ring-3 focus:ring-[#E60012]/10 transition-all font-semibold"
            />
          </div>

          {/* 2. 제안서 작성 방식 선택 (AutoGenAI 카드형 Radio UI) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-[#111111] flex items-center gap-1">
                <span>2. 제안서 작성 방식 선택</span>
                <span className="text-[#E60012] font-black">*</span>
              </label>
              <span className="text-[11px] text-neutral-500">
                작성 방식에 맞춰 AI 구조화 및 섹션 레이아웃이 최적화됩니다.
              </span>
            </div>

            <div className="space-y-3">
              {WORKFLOW_OPTIONS.map(opt => {
                const isSelected = workflowType === opt.id;
                return (
                  <div
                    key={opt.id}
                    id={`workflow-card-${opt.id}`}
                    onClick={() => setWorkflowType(opt.id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3.5 relative ${
                      isSelected
                        ? 'border-[#E60012] bg-red-50/20 shadow-xs ring-1 ring-[#E60012]/20'
                        : 'border-neutral-200 hover:border-neutral-300 bg-white hover:bg-neutral-50/50'
                    }`}
                  >
                    {/* Radio Indicator */}
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                      isSelected
                        ? 'bg-[#E60012] text-white border-2 border-[#E60012]'
                        : 'border-2 border-neutral-300 bg-white'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-[#111111]">
                            {opt.title}
                          </span>
                          <span className="text-[11px] font-medium text-neutral-400 font-mono">
                            ({opt.enTitle})
                          </span>
                        </div>
                        {opt.badge && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-[#E60012] border border-red-200">
                            {opt.badge}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed">
                        {opt.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Optional Meta Info (발주기관, 마감일) */}
          <div className="bg-neutral-50/70 p-4 rounded-xl border border-neutral-200 space-y-3">
            <div className="text-[11px] font-bold text-neutral-600 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-neutral-400" />
              <span>기본 프로젝트 정보 (선택 사항)</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                  발주기관
                </label>
                <div className="relative">
                  <Building2 className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="예: 한국생산성본부"
                    value={agencyName}
                    onChange={e => setAgencyName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-neutral-300 text-xs text-[#111111] bg-white focus:outline-none focus:border-[#E60012]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-neutral-600 mb-1">
                  제안 마감일
                </label>
                <div className="relative">
                  <Calendar className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
                  <input
                    type="date"
                    value={deadline}
                    onChange={e => setDeadline(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-neutral-300 text-xs text-[#111111] bg-white focus:outline-none focus:border-[#E60012]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Workflow Guide Notice */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-[#E60012] shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <strong>다음 단계:</strong> 프로젝트 생성 후 1단계에서 RFP 문서를 등록하게 됩니다. 
              RFP 문서를 업로드한 후 화면 하단의 <strong className="text-[#E60012]">[RFP 분석 시작]</strong> 버튼을 클릭해야 AI 분석이 진행되며 2~5단계 기능이 활성화됩니다.
            </div>
          </div>

          {/* Modal Footer Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-neutral-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#E60012] text-white text-xs font-bold hover:bg-[#CC0010] shadow-xs hover:shadow transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>프로젝트 만들기 및 RFP 등록으로 이동</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
