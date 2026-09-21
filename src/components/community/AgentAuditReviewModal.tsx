import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Check, 
  XCircle, 
  AlertTriangle, 
  FileText, 
  Cpu, 
  Database, 
  DollarSign, 
  Lock, 
  CheckCircle2, 
  Sparkles,
  Layers,
  ArrowRight,
  Info,
  Bot,
  Layout,
  Edit3,
  Sliders
} from 'lucide-react';
import { CommunityAgent } from '../../types';

interface AgentAuditReviewModalProps {
  agent: CommunityAgent;
  isOpen: boolean;
  onClose: () => void;
  onApproveAsAgent: (agent: CommunityAgent, refinedData?: any) => void;
  onApproveAsCustomAi: (agent: CommunityAgent, refinedData?: any) => void;
  onReject: (postId: string, rejectReason: string) => void;
  onShowToast: (msg: string) => void;
}

export const AgentAuditReviewModal: React.FC<AgentAuditReviewModalProps> = ({
  agent,
  isOpen,
  onClose,
  onApproveAsAgent,
  onApproveAsCustomAi,
  onReject,
  onShowToast
}) => {
  const [rejectMode, setRejectMode] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  // 6-Dimension Checklists
  const [checklist, setChecklist] = useState({
    serviceSuitability: true,
    serviceDistinctness: true,
    aiPromptSafety: true,
    aiModelQuality: true,
    dataAccessPerm: true,
    dataPrivacyMasking: true,
    integrationAuth: true,
    securitySsoLog: true,
    opsCostCapacity: true
  });

  // Admin Refinement (관리자 정제 데이터)
  const [refinedName, setRefinedName] = useState(agent.officialSubmission?.aiName || agent.title);
  const [refinedDesc, setRefinedDesc] = useState(agent.officialSubmission?.keyFeatures || agent.oneLineDesc || agent.description);
  const [refinedCategory, setRefinedCategory] = useState('업무자동화');
  const [refinedModel, setRefinedModel] = useState('GPT-4o Enterprise');
  const [targetServiceType, setTargetServiceType] = useState<'agent' | 'custom_ai'>(
    agent.developmentType === 'custom_ai' || agent.devType === 'Custom AI 개발' ? 'custom_ai' : 'agent'
  );

  if (!isOpen) return null;

  const toggleCheck = (key: keyof typeof checklist) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleApprove = () => {
    const refinedData = {
      name: refinedName.trim(),
      description: refinedDesc.trim(),
      category: refinedCategory,
      model: refinedModel
    };

    if (targetServiceType === 'custom_ai') {
      onApproveAsCustomAi(agent, refinedData);
    } else {
      onApproveAsAgent(agent, refinedData);
    }
    onClose();
  };

  const handleConfirmReject = () => {
    if (!rejectReason.trim()) {
      onShowToast('반려 사유를 입력해주세요.');
      return;
    }
    onReject(agent.id, rejectReason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl border border-neutral-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E60012] text-white flex items-center justify-center shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">공식 AI 서비스 승인 심의 및 정제</h2>
                <span className="px-2 py-0.5 text-xs font-semibold rounded bg-neutral-800 text-neutral-200">
                  관리자 심의
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                신청 AI: <strong className="text-white">{agent.title}</strong> ({agent.version}) • 신청자: {agent.author} ({agent.department})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-neutral-800">
          
          {/* 1. Submission Overview */}
          <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs text-neutral-500 uppercase tracking-wider">
                1. 제출 내역 및 커뮤니티 이력
              </h3>
              <span className="px-2 py-0.5 rounded bg-neutral-200 text-neutral-800 text-xs font-mono font-bold">
                제출일: {agent.officialSubmission?.submittedAt || agent.updatedAt}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-neutral-400 block">원작자/부서</span>
                <span className="font-bold text-neutral-900">{agent.author} ({agent.department})</span>
              </div>
              <div>
                <span className="text-neutral-400 block">제출 버전</span>
                <span className="font-bold text-neutral-900 font-mono">{agent.version}</span>
              </div>
              <div>
                <span className="text-neutral-400 block">신청 개발 유형</span>
                <span className="font-bold text-neutral-900">{agent.devType || agent.developmentType}</span>
              </div>
              <div>
                <span className="text-neutral-400 block">커뮤니티 반응</span>
                <span className="font-bold text-neutral-900">좋아요 {agent.likes} · 피드백 {agent.commentsCount || agent.comments?.length || 0}건</span>
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-200 text-xs space-y-1">
              <p><strong className="text-neutral-700">해결 문제: </strong>{agent.officialSubmission?.problemSolved || agent.problemAndBackground || agent.description}</p>
              <p><strong className="text-neutral-700">핵심 기능: </strong>{agent.officialSubmission?.keyFeatures || agent.implementedFeatures || agent.shortDesc}</p>
            </div>
          </div>

          {/* 2. 6-Dimension Audit Scorecard */}
          <div className="space-y-3">
            <h3 className="font-bold text-xs text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#E60012]" />
              2. 6대 영역 공식 검수 항목
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              {/* Service */}
              <label className="flex items-start gap-2.5 p-3 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-white transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.serviceSuitability}
                  onChange={() => toggleCheck('serviceSuitability')}
                  className="mt-0.5 w-4 h-4 accent-[#E60012]"
                />
                <div>
                  <span className="font-bold text-neutral-900 block">[서비스] KPC 업무 적합성 및 실활용성</span>
                  <span className="text-neutral-500 text-[11px]">기존 공식 서비스와의 중복 여부 및 완성도 검증 완료</span>
                </div>
              </label>

              {/* AI */}
              <label className="flex items-start gap-2.5 p-3 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-white transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.aiPromptSafety}
                  onChange={() => toggleCheck('aiPromptSafety')}
                  className="mt-0.5 w-4 h-4 accent-[#E60012]"
                />
                <div>
                  <span className="font-bold text-neutral-900 block">[AI/프롬프트] 답변 품질 및 프롬프트 인젝션 방어</span>
                  <span className="text-neutral-500 text-[11px]">Hallucination 방지 가이드라인 및 출력 서식 표준화 준수</span>
                </div>
              </label>

              {/* Data */}
              <label className="flex items-start gap-2.5 p-3 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-white transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.dataPrivacyMasking}
                  onChange={() => toggleCheck('dataPrivacyMasking')}
                  className="mt-0.5 w-4 h-4 accent-[#E60012]"
                />
                <div>
                  <span className="font-bold text-neutral-900 block">[데이터] 개인정보 및 기밀 데이터 비식별화</span>
                  <span className="text-neutral-500 text-[11px]">DLP 개인정보 필터링 및 열람 권한 범위 적정성 확인</span>
                </div>
              </label>

              {/* Integration */}
              <label className="flex items-start gap-2.5 p-3 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-white transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.integrationAuth}
                  onChange={() => toggleCheck('integrationAuth')}
                  className="mt-0.5 w-4 h-4 accent-[#E60012]"
                />
                <div>
                  <span className="font-bold text-neutral-900 block">[연동] API/MCP/커넥터 보안 인증</span>
                  <span className="text-neutral-500 text-[11px]">사내 SharePoint, DB 연동 시 최소 권한 원칙 적용</span>
                </div>
              </label>

              {/* Security */}
              <label className="flex items-start gap-2.5 p-3 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-white transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.securitySsoLog}
                  onChange={() => toggleCheck('securitySsoLog')}
                  className="mt-0.5 w-4 h-4 accent-[#E60012]"
                />
                <div>
                  <span className="font-bold text-neutral-900 block">[보안] Entra ID SSO 및 감사 로깅</span>
                  <span className="text-neutral-500 text-[11px]">사내 정보보호 규정 및 실행 로그 추적성 확보</span>
                </div>
              </label>

              {/* Operations */}
              <label className="flex items-start gap-2.5 p-3 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-white transition-colors cursor-pointer">
                <input
                  type="checkbox"
                  checked={checklist.opsCostCapacity}
                  onChange={() => toggleCheck('opsCostCapacity')}
                  className="mt-0.5 w-4 h-4 accent-[#E60012]"
                />
                <div>
                  <span className="font-bold text-neutral-900 block">[운영] 토큰 예산 및 지속 운영성</span>
                  <span className="text-neutral-500 text-[11px]">예상 토큰 한도 및 담당 운영자 배정 확인</span>
                </div>
              </label>
            </div>
          </div>

          {/* 3. Admin Refinement (관리자 정제) */}
          <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-4">
            <h3 className="font-bold text-xs text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
              <Edit3 className="w-4 h-4 text-[#E60012]" />
              3. 관리자 서비스 정제 (Refinement)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-neutral-700 mb-1">
                  공식 서비스 표기명 정제
                </label>
                <input
                  type="text"
                  value={refinedName}
                  onChange={e => setRefinedName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl font-bold focus:outline-hidden focus:border-neutral-900"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">
                  공식 배포 파운데이션 모델
                </label>
                <select
                  value={refinedModel}
                  onChange={e => setRefinedModel(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl font-semibold focus:outline-hidden focus:border-neutral-900 cursor-pointer"
                >
                  <option value="GPT-4o Enterprise">GPT-4o Enterprise (고성능 표준)</option>
                  <option value="Gemini 2.5 Flash">Gemini 2.5 Flash (초고속 저비용)</option>
                  <option value="Claude 3.7 Sonnet">Claude 3.7 Sonnet (정밀 분석)</option>
                  <option value="KPC Enterprise Core">KPC Enterprise Core (On-prem 보안)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-neutral-700 mb-1 text-xs">
                공식 서비스 한 줄 설명 정제
              </label>
              <input
                type="text"
                value={refinedDesc}
                onChange={e => setRefinedDesc(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl text-xs focus:outline-hidden focus:border-neutral-900"
              />
            </div>
          </div>

          {/* 4. Decision: Target Service GNB */}
          <div className="p-4 bg-neutral-900 text-white rounded-2xl space-y-3">
            <h3 className="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-[#E60012]" />
              4. 최종 공식 서비스 유형 결정 (관리자 판정)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <button
                type="button"
                onClick={() => setTargetServiceType('agent')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  targetServiceType === 'agent'
                    ? 'bg-neutral-800 border-[#E60012] ring-1 ring-[#E60012]'
                    : 'bg-neutral-800/50 border-neutral-700 hover:bg-neutral-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 font-bold text-white">
                    <Bot className="w-4 h-4 text-[#E60012]" />
                    <span>AI Agent 로 공식 등록</span>
                  </div>
                  {targetServiceType === 'agent' && <CheckCircle2 className="w-4 h-4 text-[#E60012]" />}
                </div>
                <p className="text-[11px] text-neutral-300 leading-relaxed">
                  표준 프롬프트, 지식 검색 및 커넥터 기반의 경량 업무 자동화 Agent (GNB `AI Agent`에 배포)
                </p>
              </button>

              <button
                type="button"
                onClick={() => setTargetServiceType('custom_ai')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  targetServiceType === 'custom_ai'
                    ? 'bg-purple-950/80 border-purple-500 ring-1 ring-purple-500'
                    : 'bg-neutral-800/50 border-neutral-700 hover:bg-neutral-800'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 font-bold text-white">
                    <Layout className="w-4 h-4 text-purple-400" />
                    <span>Custom AI 로 공식 등록</span>
                  </div>
                  {targetServiceType === 'custom_ai' && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
                </div>
                <p className="text-[11px] text-neutral-300 leading-relaxed">
                  독립 UI/다화면 웹 애플리케이션 및 복합 프로세스 특화 솔루션 (GNB `Custom AI`에 배포)
                </p>
              </button>
            </div>
          </div>

          {/* Reject Mode UI */}
          {rejectMode && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl space-y-2 animate-in fade-in">
              <label className="block text-xs font-bold text-[#E60012]">
                반려 및 보완 요청 사유 입력
              </label>
              <textarea
                rows={2}
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                placeholder="예: 사내 SharePoint 연동 권한 범위 재설정 및 프롬프트 인젝션 방어 보강 필요"
                className="w-full p-2.5 bg-white border border-red-200 rounded-xl text-xs focus:outline-hidden focus:border-red-500 text-neutral-800"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRejectMode(false)}
                  className="px-3 py-1.5 text-xs text-neutral-600 hover:text-neutral-900"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReject}
                  className="px-4 py-1.5 bg-[#E60012] text-white rounded-xl text-xs font-bold"
                >
                  반려 통보 확정
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={() => setRejectMode(true)}
            className="px-4 py-2 text-xs font-bold text-[#E60012] hover:bg-red-50 rounded-xl border border-red-200 transition-colors cursor-pointer"
          >
            반려 / 보완 요청
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-neutral-600 hover:text-neutral-900 rounded-xl cursor-pointer"
            >
              닫기
            </button>
            <button
              type="button"
              onClick={handleApprove}
              className="px-6 py-2.5 bg-[#E60012] hover:bg-[#CC0010] text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>
                {targetServiceType === 'custom_ai' ? '[Custom AI] 로 공식 등록 승인' : '[AI Agent] 로 공식 등록 승인'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
