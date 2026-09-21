import React, { useState, useEffect } from 'react';
import { X, Sparkles, ListChecks, HelpCircle, ArrowRight, Building, DollarSign, Calendar, UserCheck } from 'lucide-react';
import { RfpOpportunity } from '../../types';

interface ProposalConvertModalProps {
  isOpen?: boolean;
  rfp?: RfpOpportunity | null;
  initialTitle?: string;
  onClose: () => void;
  onConfirm: (projectData: {
    title: string;
    targetPrice: number;
    teamLead: string;
    members: string[];
    deadline: string;
    agency: string;
    method?: string;
  }) => void;
}

export const ProposalConvertModal: React.FC<ProposalConvertModalProps> = ({
  isOpen = true,
  rfp,
  initialTitle,
  onClose,
  onConfirm
}) => {
  const getInitialTitle = () => {
    const raw = initialTitle || rfp?.title || '공공 정보화 구축 사업';
    if (typeof raw === 'string' && raw.endsWith('제안서')) {
      return raw;
    }
    return `${raw} 제안서`;
  };

  const [title, setTitle] = useState(getInitialTitle);
  const [agency, setAgency] = useState(() => rfp?.agency || '한국지능정보사회진흥원');
  const [targetPrice, setTargetPrice] = useState<number>(() => rfp?.budget || 350000000);
  const [teamLead, setTeamLead] = useState('정소담 책임컨설턴트');
  const [deadline, setDeadline] = useState(() => rfp?.deadline || '2026.04.15');
  const [selectedMethod, setSelectedMethod] = useState<string>('full_analysis');

  useEffect(() => {
    if (rfp || initialTitle) {
      setTitle(getInitialTitle());
      if (rfp?.agency) setAgency(rfp.agency);
      if (rfp?.budget) setTargetPrice(rfp.budget);
      if (rfp?.deadline) setDeadline(rfp.deadline);
    }
  }, [rfp, initialTitle]);

  if (!isOpen) {
    return null;
  }

  const methods = [
    {
      id: 'full_analysis',
      title: '1. AI 전체 분석 (KPC 표준 권장)',
      desc: 'AI가 전체 RFP를 심층 분석하여 요구사항, 평가기준, 과업내용을 종합한 최적의 수주 목차와 전략을 도출합니다.',
      icon: Sparkles,
      recommended: true
    },
    {
      id: 'requirements_focused',
      title: '2. 요구사항 중심',
      desc: 'RFP에서 추출한 필수/기능 요구사항을 1:1로 매핑하여 빈틈없는 컴플라이언스 기준 제안서 구조를 생성합니다.',
      icon: ListChecks,
      recommended: false
    },
    {
      id: 'questions_focused',
      title: '3. 질문·답변 중심',
      desc: '발주처의 주요 질의사항 및 평가 위원 인터뷰 예상 질문 항목을 중심으로 답변형 제안서 구조를 생성합니다.',
      icon: HelpCircle,
      recommended: false
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({
      title: title.trim() || '신규 KPC 제안서',
      targetPrice: Number(targetPrice) || 300000000,
      teamLead: teamLead || '정소담 책임컨설턴트',
      members: ['정소담(PM)', '김생산(Tech)', '이혁신(QA)', '박인재(컨설턴트)'],
      deadline: deadline || '2026.04.15',
      agency: agency || '공공 발주처',
      method: selectedMethod
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl border border-neutral-200 max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-neutral-200 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E60012] text-white flex items-center justify-center text-xs font-black shadow-xs">
              KPC
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#111111]">
                새 제안서 생성 및 사업 등록
              </h3>
              <p className="text-[11px] text-neutral-500">
                사업 정보를 바탕으로 맞춤형 제안서 프로젝트를 초기화합니다.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title Input */}
          <div>
            <label className="block text-xs font-bold text-neutral-800 mb-1.5">
              제안서 프로젝트명 <span className="text-[#E60012]">*</span>
            </label>
            <input
              id="proposal-title-input"
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-[#F8F9FA] px-3.5 py-2.5 rounded-md border border-neutral-300 text-xs font-semibold text-[#111111] focus:outline-none focus:border-[#E60012] focus:bg-white"
              placeholder="예: 한국지능정보사회진흥원 2026 차세대 지능형 플랫폼 구축 제안서"
            />
          </div>

          {/* Agency & Budget Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1.5 flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-neutral-500" />
                발주 기관
              </label>
              <input
                id="proposal-agency-input"
                type="text"
                value={agency}
                onChange={e => setAgency(e.target.value)}
                className="w-full bg-[#F8F9FA] px-3 py-2 rounded-md border border-neutral-300 text-xs text-[#111111] focus:outline-none focus:border-[#E60012] focus:bg-white"
                placeholder="예: 한국지능정보사회진흥원"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1.5 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-neutral-500" />
                목표 제안금액 (원)
              </label>
              <input
                id="proposal-budget-input"
                type="number"
                value={targetPrice}
                onChange={e => setTargetPrice(Number(e.target.value))}
                className="w-full bg-[#F8F9FA] px-3 py-2 rounded-md border border-neutral-300 text-xs font-mono text-[#111111] focus:outline-none focus:border-[#E60012] focus:bg-white"
                placeholder="350000000"
              />
            </div>
          </div>

          {/* PM & Deadline Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1.5 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-neutral-500" />
                제안 총괄 PM
              </label>
              <input
                id="proposal-pm-input"
                type="text"
                value={teamLead}
                onChange={e => setTeamLead(e.target.value)}
                className="w-full bg-[#F8F9FA] px-3 py-2 rounded-md border border-neutral-300 text-xs text-[#111111] focus:outline-none focus:border-[#E60012] focus:bg-white"
                placeholder="정소담 책임컨설턴트"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                제출 마감일
              </label>
              <input
                id="proposal-deadline-input"
                type="text"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                className="w-full bg-[#F8F9FA] px-3 py-2 rounded-md border border-neutral-300 text-xs font-mono text-[#111111] focus:outline-none focus:border-[#E60012] focus:bg-white"
                placeholder="2026.04.15"
              />
            </div>
          </div>

          {/* 3 Creation Method Cards */}
          <div>
            <label className="block text-xs font-bold text-neutral-800 mb-2">
              제안서 초기화 방식 선택
            </label>
            <div className="space-y-2">
              {methods.map(m => {
                const Icon = m.icon;
                const isSelected = selectedMethod === m.id;
                return (
                  <div
                    key={m.id}
                    id={`method-card-${m.id}`}
                    onClick={() => setSelectedMethod(m.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'border-[#E60012] bg-red-50/40 shadow-2xs'
                        : 'border-neutral-200 hover:border-neutral-300 bg-white'
                    }`}
                  >
                    <div className={`mt-0.5 w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected ? 'border-[#E60012] bg-[#E60012]' : 'border-neutral-300'
                    }`}>
                      {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs font-bold text-[#111111] flex items-center gap-1.5">
                          <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#E60012]' : 'text-neutral-500'}`} />
                          {m.title}
                        </span>
                        {m.recommended && (
                          <span className="text-[10px] font-bold text-[#E60012] bg-red-100/70 px-1.5 py-0.2 rounded border border-[#E60012]/30">
                            KPC 표준
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-600 leading-relaxed">
                        {m.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition-colors"
            >
              취소
            </button>
            <button
              id="confirm-convert-proposal-btn"
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-md text-xs font-bold text-white bg-[#E60012] hover:bg-[#CC0010] shadow-sm transition-all"
            >
              <span>제안서 프로젝트 생성</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
