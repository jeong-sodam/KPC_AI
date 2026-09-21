import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Send, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Cpu, 
  Database, 
  Lock, 
  Users, 
  FileText,
  Info,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { CommunityAgent, OfficialSubmissionData } from '../../types';

interface OfficialSubmissionModalProps {
  post: CommunityAgent;
  isOpen: boolean;
  onClose: () => void;
  onSubmitOfficial: (postId: string, submissionData: OfficialSubmissionData) => void;
  onShowToast: (msg: string) => void;
}

export const OfficialSubmissionModal: React.FC<OfficialSubmissionModalProps> = ({
  post,
  isOpen,
  onClose,
  onSubmitOfficial,
  onShowToast
}) => {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);

  // 1. Basic Info
  const [aiName, setAiName] = useState(post.title || '');
  const [keyFeatures, setKeyFeatures] = useState(post.implementedFeatures || post.shortDesc || '');
  const [problemSolved, setProblemSolved] = useState(post.problemAndBackground || post.description || '');
  const [targetUsers, setTargetUsers] = useState('전사 임직원 및 사업 담당자');
  const [currentDevStatus, setCurrentDevStatus] = useState(post.devStatus || '테스트 중 (완성도 90% 이상)');
  const [version, setVersion] = useState(post.version || 'v1.0');
  const [howToUse, setHowToUse] = useState('1. 입력 데이터 업로드 또는 텍스트 입력\n2. AI 실행 버튼 클릭\n3. 구조화된 분석 결과 확인 및 다운로드');
  const [prototypeUrl, setPrototypeUrl] = useState(post.prototypeUrl || post.serviceUrl || '');

  // 2. Tech Info
  const [selectedModels, setSelectedModels] = useState<string[]>(['GPT-4o Enterprise', 'Gemini 2.5 Flash']);
  const [usedInternalData, setUsedInternalData] = useState('KPC 사내 규정집, 표준 서식 DB, 과거 프로젝트 데이터');
  const [usedExternalData, setUsedExternalData] = useState('공공기관 입찰 공고 및 통계청 표준 데이터');
  const [usedApisAndConnectors, setUsedApisAndConnectors] = useState('SharePoint 문서 검색, KPC 내부 검색 API, 사내 메일 알림');

  // 3. Security Info
  const [hasPersonalInfo, setHasPersonalInfo] = useState(false);
  const [personalInfoDesc, setPersonalInfoDesc] = useState('');
  const [hasSensitiveInfo, setHasSensitiveInfo] = useState(false);
  const [sensitiveInfoDesc, setSensitiveInfoDesc] = useState('');
  const [usesInternalSystem, setUsesInternalSystem] = useState(true);
  const [usesExternalLlmAnonymization, setUsesExternalLlmAnonymization] = useState(true);

  // 4. Team Info
  const [developerName, setDeveloperName] = useState(post.author || '정소담');
  const [department, setDepartment] = useState(post.department || 'AI전략팀');
  const [coDevelopers, setCoDevelopers] = useState('김OO (컨설팅본부), 박OO (경영지원본부)');
  const [operatorName, setOperatorName] = useState('정소담 책임 (AI전략팀)');

  if (!isOpen) return null;

  const toggleModel = (modelName: string) => {
    if (selectedModels.includes(modelName)) {
      if (selectedModels.length > 1) {
        setSelectedModels(selectedModels.filter(m => m !== modelName));
      }
    } else {
      setSelectedModels([...selectedModels, modelName]);
    }
  };

  const handleFinalSubmit = () => {
    if (!aiName.trim()) {
      onShowToast('AI 서비스 이름을 입력해주세요.');
      return;
    }

    const submissionData: OfficialSubmissionData = {
      submittedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      aiName: aiName.trim(),
      keyFeatures: keyFeatures.trim(),
      problemSolved: problemSolved.trim(),
      targetUsers: targetUsers.trim(),
      currentDevStatus: currentDevStatus.trim(),
      version: version.trim(),
      howToUse: howToUse.trim(),
      prototypeUrl: prototypeUrl.trim() || undefined,
      usedModels: selectedModels,
      usedInternalData: usedInternalData.trim(),
      usedExternalData: usedExternalData.trim(),
      usedApisAndConnectors: usedApisAndConnectors.trim(),
      hasPersonalInfo,
      personalInfoDesc: hasPersonalInfo ? personalInfoDesc.trim() : undefined,
      hasSensitiveInfo,
      sensitiveInfoDesc: hasSensitiveInfo ? sensitiveInfoDesc.trim() : undefined,
      usesInternalSystem,
      usesExternalLlmAnonymization,
      developerName: developerName.trim(),
      department: department.trim(),
      coDevelopers: coDevelopers.trim(),
      operatorName: operatorName.trim(),
      adminReviewStatus: '접수'
    };

    onSubmitOfficial(post.id, submissionData);
    onShowToast(`'${aiName}'의 공식 등록 제출이 완료되었습니다. 관리자 검수 및 정제 후 서비스 영역에 공식 배포됩니다.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="official-submission-modal"
        className="relative w-full max-w-3xl max-h-[92vh] bg-white rounded-2xl shadow-2xl border border-neutral-200 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E60012] flex items-center justify-center text-white shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">공식 서비스 등록 제출 (관리자 심의 요청)</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-800 text-neutral-300">
                  {post.version}
                </span>
              </div>
              <p className="text-xs text-neutral-300">
                완성된 AI 결과물을 관리자에게 제출하여 보안·품질 검수 및 정제를 거쳐 공식 서비스(AI Agent 또는 Custom AI)로 승격합니다.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-4 border-b border-neutral-200 bg-neutral-50 shrink-0 text-xs">
          <button
            type="button"
            onClick={() => setActiveStep(1)}
            className={`py-3 px-3 font-bold border-b-2 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeStep === 1 
                ? 'border-[#E60012] text-[#E60012] bg-white' 
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              activeStep === 1 ? 'bg-[#E60012] text-white' : 'bg-neutral-200 text-neutral-700'
            }`}>1</span>
            <span>기본 정보</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveStep(2)}
            className={`py-3 px-3 font-bold border-b-2 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeStep === 2 
                ? 'border-[#E60012] text-[#E60012] bg-white' 
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              activeStep === 2 ? 'bg-[#E60012] text-white' : 'bg-neutral-200 text-neutral-700'
            }`}>2</span>
            <span>사용 기술</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveStep(3)}
            className={`py-3 px-3 font-bold border-b-2 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeStep === 3 
                ? 'border-[#E60012] text-[#E60012] bg-white' 
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              activeStep === 3 ? 'bg-[#E60012] text-white' : 'bg-neutral-200 text-neutral-700'
            }`}>3</span>
            <span>보안·규정 점검</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveStep(4)}
            className={`py-3 px-3 font-bold border-b-2 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeStep === 4 
                ? 'border-[#E60012] text-[#E60012] bg-white' 
                : 'border-transparent text-neutral-500 hover:text-neutral-900'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
              activeStep === 4 ? 'bg-[#E60012] text-white' : 'bg-neutral-200 text-neutral-700'
            }`}>4</span>
            <span>담당·운영 정보</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 text-xs text-neutral-800 space-y-4">
          
          {/* Step 1: Basic Info */}
          {activeStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3 bg-red-50/60 rounded-xl border border-red-100 flex items-start gap-2 text-neutral-800">
                <Info className="w-4 h-4 text-[#E60012] shrink-0 mt-0.5" />
                <p>
                  직원은 결과물을 관리자에게 제출하는 역할까지 수행하며, 최종적으로 <strong>[AI Agent]</strong> 또는 <strong>[Custom AI]</strong> 중 어디에 등록될지는 관리자가 결과물 완성도 및 UI 형태를 검수한 후 결정합니다.
                </p>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">
                  공식 등록용 AI 서비스 이름 <span className="text-[#E60012]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={aiName}
                  onChange={e => setAiName(e.target.value)}
                  placeholder="예: 회의록 정리 및 Action Item 자동 추출 AI"
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl font-bold focus:outline-hidden focus:border-neutral-900 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">
                    현재 개발 상태 <span className="text-[#E60012]">*</span>
                  </label>
                  <input
                    type="text"
                    value={currentDevStatus}
                    onChange={e => setCurrentDevStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-hidden focus:border-neutral-900 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">
                    제출 버전 <span className="text-[#E60012]">*</span>
                  </label>
                  <input
                    type="text"
                    value={version}
                    onChange={e => setVersion(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl font-mono font-bold focus:outline-hidden focus:border-neutral-900 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">
                  해결하려는 업무 문제 및 기여 효과 <span className="text-[#E60012]">*</span>
                </label>
                <textarea
                  rows={3}
                  value={problemSolved}
                  onChange={e => setProblemSolved(e.target.value)}
                  className="w-full p-3 bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-hidden focus:border-neutral-900 focus:bg-white resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">
                  주요 핵심 기능 요약 <span className="text-[#E60012]">*</span>
                </label>
                <textarea
                  rows={3}
                  value={keyFeatures}
                  onChange={e => setKeyFeatures(e.target.value)}
                  className="w-full p-3 bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-hidden focus:border-neutral-900 focus:bg-white resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">
                    주요 대상 사용자 / 활용 부서
                  </label>
                  <input
                    type="text"
                    value={targetUsers}
                    onChange={e => setTargetUsers(e.target.value)}
                    placeholder="예: 전사 임직원, 컨설팅본부, 자격사업팀"
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-hidden focus:border-neutral-900 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">
                    결과물 / 프로토타입 URL (선택)
                  </label>
                  <input
                    type="url"
                    value={prototypeUrl}
                    onChange={e => setPrototypeUrl(e.target.value)}
                    placeholder="https://prototype.kpc.or.kr/..."
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-hidden focus:border-neutral-900 focus:bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Tech Info */}
          {activeStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div>
                <label className="block font-bold text-neutral-700 mb-2">
                  사용 중인 AI 파운데이션 모델 (다중 선택 가능)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['GPT-4o Enterprise', 'Gemini 2.5 Flash', 'Claude 3.7 Sonnet', 'KPC Enterprise Core (On-prem)'].map(model => {
                    const isSelected = selectedModels.includes(model);
                    return (
                      <button
                        type="button"
                        key={model}
                        onClick={() => toggleModel(model)}
                        className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs' 
                            : 'bg-neutral-50 text-neutral-800 border-neutral-200 hover:bg-neutral-100'
                        }`}
                      >
                        <span className="font-bold">{model}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-[#E60012]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">
                  활용 내부 데이터 (RAG 지식 / 문서 / DB)
                </label>
                <textarea
                  rows={2}
                  value={usedInternalData}
                  onChange={e => setUsedInternalData(e.target.value)}
                  placeholder="예: KPC 지식포털, 사내 표준 서식, 과거 제안서 수주 사례집"
                  className="w-full p-3 bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-hidden focus:border-neutral-900 focus:bg-white resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">
                  활용 외부 데이터
                </label>
                <textarea
                  rows={2}
                  value={usedExternalData}
                  onChange={e => setUsedExternalData(e.target.value)}
                  placeholder="예: 조달청 나라장터 공고, 공공데이터포털 통계 등"
                  className="w-full p-3 bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-hidden focus:border-neutral-900 focus:bg-white resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">
                  연동 API / MCP / 커넥터
                </label>
                <input
                  type="text"
                  value={usedApisAndConnectors}
                  onChange={e => setUsedApisAndConnectors(e.target.value)}
                  placeholder="예: SharePoint Connector, Teams 메신저 알림, 사내 ERP 결재 API"
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-hidden focus:border-neutral-900 focus:bg-white"
                />
              </div>
            </div>
          )}

          {/* Step 3: Security & Governance */}
          {activeStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-3 bg-neutral-100 rounded-xl text-neutral-700 font-medium">
                관리자가 사내 보안 심의를 신속히 진행할 수 있도록 아래 항목을 정직하게 체크해주세요.
              </div>

              {/* Personal Info */}
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-neutral-900">개인정보(이름, 주민번호, 연락처 등) 포함 여부</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setHasPersonalInfo(false)}
                      className={`px-3 py-1 rounded-lg font-bold ${!hasPersonalInfo ? 'bg-neutral-900 text-white' : 'bg-neutral-200 text-neutral-600'}`}
                    >
                      미포함 (안전)
                    </button>
                    <button
                      type="button"
                      onClick={() => setHasPersonalInfo(true)}
                      className={`px-3 py-1 rounded-lg font-bold ${hasPersonalInfo ? 'bg-[#E60012] text-white' : 'bg-neutral-200 text-neutral-600'}`}
                    >
                      포함됨
                    </button>
                  </div>
                </div>
                {hasPersonalInfo && (
                  <input
                    type="text"
                    value={personalInfoDesc}
                    onChange={e => setPersonalInfoDesc(e.target.value)}
                    placeholder="취급하는 개인정보 항목 및 마스킹 방식을 기술해주세요."
                    className="w-full px-3 py-2 bg-white border border-red-200 rounded-xl focus:outline-hidden focus:border-red-500"
                  />
                )}
              </div>

              {/* Sensitive Info */}
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-neutral-900">사내 기밀 및 대외비 문서 포함 여부</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setHasSensitiveInfo(false)}
                      className={`px-3 py-1 rounded-lg font-bold ${!hasSensitiveInfo ? 'bg-neutral-900 text-white' : 'bg-neutral-200 text-neutral-600'}`}
                    >
                      해당 없음
                    </button>
                    <button
                      type="button"
                      onClick={() => setHasSensitiveInfo(true)}
                      className={`px-3 py-1 rounded-lg font-bold ${hasSensitiveInfo ? 'bg-[#E60012] text-white' : 'bg-neutral-200 text-neutral-600'}`}
                    >
                      대외비 포함
                    </button>
                  </div>
                </div>
                {hasSensitiveInfo && (
                  <input
                    type="text"
                    value={sensitiveInfoDesc}
                    onChange={e => setSensitiveInfoDesc(e.target.value)}
                    placeholder="대외비 등급 및 인가된 열람 권한 범위를 기술해주세요."
                    className="w-full px-3 py-2 bg-white border border-red-200 rounded-xl focus:outline-hidden focus:border-red-500"
                  />
                )}
              </div>

              {/* Security Toggles */}
              <div className="space-y-2 pt-2">
                <label className="flex items-center gap-2.5 p-3 bg-neutral-50 rounded-xl border border-neutral-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={usesInternalSystem}
                    onChange={e => setUsesInternalSystem(e.target.checked)}
                    className="w-4 h-4 accent-[#E60012]"
                  />
                  <div>
                    <span className="font-bold text-neutral-900 block">사내 전산망 및 인증 연계 준수</span>
                    <span className="text-neutral-500 text-[11px]">KPC Entra ID 단일 로그인(SSO) 및 접근 권한 통제를 준수합니다.</span>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 p-3 bg-neutral-50 rounded-xl border border-neutral-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={usesExternalLlmAnonymization}
                    onChange={e => setUsesExternalLlmAnonymization(e.target.checked)}
                    className="w-4 h-4 accent-[#E60012]"
                  />
                  <div>
                    <span className="font-bold text-neutral-900 block">외부 LLM 전송 시 자동 비식별화 필터링</span>
                    <span className="text-neutral-500 text-[11px]">프롬프트 전송 전 사내 보안 필터를 통한 주민번호/계좌번호 자동 마스킹을 적용합니다.</span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Step 4: Team & Operations */}
          {activeStep === 4 && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">
                    대표 개발자 <span className="text-[#E60012]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={developerName}
                    onChange={e => setDeveloperName(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl font-bold focus:outline-hidden focus:border-neutral-900 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-neutral-700 mb-1">
                    소속 부서 <span className="text-[#E60012]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={department}
                    onChange={e => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl font-bold focus:outline-hidden focus:border-neutral-900 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">
                  공동 개발자 및 기여자
                </label>
                <input
                  type="text"
                  value={coDevelopers}
                  onChange={e => setCoDevelopers(e.target.value)}
                  placeholder="예: 김OO (컨설팅본부), 박OO (경영지원본부)"
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-hidden focus:border-neutral-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">
                  향후 운영 및 유지관리 담당자
                </label>
                <input
                  type="text"
                  value={operatorName}
                  onChange={e => setOperatorName(e.target.value)}
                  placeholder="예: 정소담 책임 (AI전략팀)"
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-hidden focus:border-neutral-900 focus:bg-white"
                />
              </div>

              <div className="p-4 bg-neutral-900 text-white rounded-xl space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-[#E60012]" />
                  <span>제출 후 진행 프로세스</span>
                </div>
                <div className="text-xs text-neutral-300 space-y-1 leading-relaxed">
                  <p>1. 관리자가 제출된 명세서를 접수하고 6대 영역(서비스/AI/데이터/연동/보안/운영)을 검수합니다.</p>
                  <p>2. 프롬프트 및 메타데이터 정제를 거쳐 <strong>[AI Agent]</strong> 또는 <strong>[Custom AI]</strong> 공식 영역으로 확정 배포됩니다.</p>
                  <p>3. 본 커뮤니티 글은 [검증 완료] 뱃지로 자동 변경되며 [공식 서비스 보기] 링크가 연결됩니다.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between shrink-0">
          <div>
            {activeStep > 1 && (
              <button
                type="button"
                onClick={() => setActiveStep((activeStep - 1) as any)}
                className="px-4 py-2 text-xs font-bold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60 rounded-xl transition-colors cursor-pointer"
              >
                이전 단계
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-neutral-600 hover:text-neutral-900 rounded-xl transition-colors cursor-pointer"
            >
              취소
            </button>

            {activeStep < 4 ? (
              <button
                type="button"
                onClick={() => setActiveStep((activeStep + 1) as any)}
                className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>다음 단계</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinalSubmit}
                className="px-6 py-2.5 bg-[#E60012] hover:bg-[#CC0010] text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>관리자에게 공식 등록 제출하기</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
