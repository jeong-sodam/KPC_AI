import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Sparkles, 
  Tag, 
  Globe, 
  Lock, 
  Users, 
  Building2, 
  Bot, 
  Check, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { CommunityAgent } from '../../types';

interface CommunityPublishModalProps {
  agent: CommunityAgent;
  isOpen: boolean;
  onClose: () => void;
  onPublish: (publishedData: Partial<CommunityAgent>) => void;
  onShowToast: (msg: string) => void;
}

export const CommunityPublishModal: React.FC<CommunityPublishModalProps> = ({
  agent,
  isOpen,
  onClose,
  onPublish,
  onShowToast
}) => {
  const [title, setTitle] = useState(agent.title);
  const [shortDesc, setShortDesc] = useState(agent.shortDesc || '');
  const [description, setDescription] = useState(agent.description || '');
  const [keyFeatures, setKeyFeatures] = useState(
    agent.howToUse || '1. 핵심 프롬프트 기반 자동 분석\n2. 사내 규정 및 지식 RAG 실시간 연동\n3. KPC 표준 보고서 양식 즉시 생성'
  );
  const [useCase, setUseCase] = useState(
    agent.reasonCreated || '부서 내 반복적인 문서 정리 및 요약 업무를 표준화하여 작성 소요 시간을 70% 단축'
  );
  const [tagsInput, setTagsInput] = useState(agent.tags.join(', '));
  const [visibilityScope, setVisibilityScope] = useState<'나만 사용' | '특정 부서' | '특정 사용자' | '전사 공개'>(
    agent.visibilityScope || '전사 공개'
  );
  const [version, setVersion] = useState(agent.version === '초안' ? 'v1.0' : agent.version || 'v1.0');
  const [iconColor, setIconColor] = useState(agent.iconBg || 'bg-red-50 text-[#E60012] border-red-200');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      onShowToast('게시글 제목을 입력해주세요.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const publishedData: Partial<CommunityAgent> = {
      title,
      shortDesc: shortDesc || description.slice(0, 80),
      description,
      howToUse: keyFeatures,
      reasonCreated: useCase,
      tags: tags.length > 0 ? tags : ['Agent', '업무자동화'],
      visibilityScope,
      version,
      iconBg: iconColor,
      status: 'Community 게시',
      updatedAt: '2026.09.11'
    };

    onPublish(publishedData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-neutral-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E60012] text-white flex items-center justify-center shadow-xs">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#111111]">Community에 Agent 게시하기</h2>
              <p className="text-xs text-neutral-500">사내 동료들과 제작한 Agent를 공유하고 피드백을 받습니다.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/60 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-sm text-neutral-800">
          
          {/* Readonly Author Info */}
          <div className="grid grid-cols-3 gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200/80 text-xs">
            <div>
              <span className="text-neutral-400 block mb-0.5">작성자 (자동)</span>
              <span className="font-semibold text-neutral-900">{agent.author || '정소담'}</span>
            </div>
            <div>
              <span className="text-neutral-400 block mb-0.5">작성자 부서 (자동)</span>
              <span className="font-semibold text-neutral-900">{agent.department || 'AI전략팀'}</span>
            </div>
            <div>
              <span className="text-neutral-400 block mb-0.5">게시일 (자동)</span>
              <span className="font-semibold text-neutral-900">2026.09.11</span>
            </div>
          </div>

          {/* Title & Version */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-3">
              <label className="block font-semibold text-xs text-neutral-700 mb-1">
                게시글 제목 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="동료들이 알아보기 쉬운 Agent 제목을 입력하세요"
                className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 text-sm"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-xs text-neutral-700 mb-1">
                배포 버전 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={version}
                onChange={e => setVersion(e.target.value)}
                placeholder="v1.0"
                className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 text-sm font-mono"
                required
              />
            </div>
          </div>

          {/* Short Desc & Detailed Desc */}
          <div>
            <label className="block font-semibold text-xs text-neutral-700 mb-1">
              한 줄 소개 (카드에 노출) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={shortDesc}
              onChange={e => setShortDesc(e.target.value)}
              placeholder="예: 회의 메모를 입력하면 주요 결정사항과 Action Item을 정리합니다."
              className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 text-sm"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-xs text-neutral-700 mb-1">
              Agent 상세 소개
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Agent 제작 배경, 문제점, 기대효과 등을 자유롭게 작성해주세요."
              rows={3}
              className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 text-sm resize-none"
            />
          </div>

          {/* Key Features & Use Case */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-xs text-neutral-700 mb-1">
                주요 기능
              </label>
              <textarea
                value={keyFeatures}
                onChange={e => setKeyFeatures(e.target.value)}
                placeholder="Agent의 핵심 동작 방식을 개조식으로 입력하세요."
                rows={3}
                className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 text-xs resize-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-xs text-neutral-700 mb-1">
                활용 사례 (실무 적용 예시)
              </label>
              <textarea
                value={useCase}
                onChange={e => setUseCase(e.target.value)}
                placeholder="실제 어떤 업무에서 유용하게 쓰일 수 있는지 작성하세요."
                rows={3}
                className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 text-xs resize-none"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block font-semibold text-xs text-neutral-700 mb-1">
              태그 (쉼표로 구분)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
              placeholder="예: 회의, 보고서, 업무자동화"
              className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900 text-sm"
            />
          </div>

          {/* Visibility Scope */}
          <div>
            <label className="block font-semibold text-xs text-neutral-700 mb-1.5">
              공개 범위 설정 <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { key: '전사 공개', icon: Globe, desc: '모든 임직원 조회 가능' },
                { key: '특정 부서', icon: Building2, desc: '소속 본부/부서 한정' },
                { key: '특정 사용자', icon: Users, desc: '지정된 동료 한정' },
                { key: '나만 사용', icon: Lock, desc: '비공개 테스트' }
              ].map(opt => {
                const Icon = opt.icon;
                const isSelected = visibilityScope === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => setVisibilityScope(opt.key as any)}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-neutral-900 bg-neutral-900 text-white shadow-xs'
                        : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Icon className="w-4 h-4" />
                      {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <div>
                      <div className="font-bold text-xs">{opt.key}</div>
                      <div className={`text-[10px] ${isSelected ? 'text-neutral-300' : 'text-neutral-400'}`}>
                        {opt.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 연결 정보 (사용하는 지식, 사용하는 커넥터 - 민감 데이터 비노출 원칙) */}
          <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#E60012]" />
                연결 정보 확인
              </span>
              <span className="text-[10px] text-neutral-400">시스템 연동 요약</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-white border border-neutral-200">
                <span className="text-[11px] font-semibold text-neutral-500 block mb-1">사용하는 지식:</span>
                <span className="text-xs text-neutral-800 font-medium truncate block">
                  {agent.knowledgeFiles && agent.knowledgeFiles.length > 0 
                    ? agent.knowledgeFiles.map(f => f.name).join(', ')
                    : 'KPC 업무 표준 운영 가이드라인.pdf 외 사내 지식'}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-neutral-200">
                <span className="text-[11px] font-semibold text-neutral-500 block mb-1">사용하는 커넥터:</span>
                <span className="text-xs text-neutral-800 font-medium truncate block">
                  {agent.connectors && agent.connectors.length > 0
                    ? 'Microsoft Teams, SharePoint, 사내 ERP'
                    : 'Teams, SharePoint (기본 커넥터)'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-neutral-500 pt-1">
              <Lock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <span>민감한 내부 데이터 자체는 Community 게시글에 노출되지 않으며 연동 명칭만 공유됩니다.</span>
            </div>
          </div>

          {/* Notice Banner */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex gap-2 text-xs text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>게시 안내:</strong> Community에 게시된 Agent는 임직원들이 자유롭게 사용해보고 댓글 피드백을 남길 수 있습니다. 검증이 완료된 Agent는 이후 <span className="underline font-semibold">[공식 Agent 등록 신청]</span>을 통해 정식 AI Agent 탭으로 승격될 수 있습니다.
            </div>
          </div>

        </form>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-neutral-200 flex items-center justify-end gap-2.5 bg-neutral-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2 text-xs font-bold text-white bg-[#E60012] hover:bg-[#c90010] rounded-lg transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5" />
            Community에 게시하기
          </button>
        </div>

      </div>
    </div>
  );
};
