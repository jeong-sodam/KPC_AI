import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Lightbulb, 
  Bot, 
  Layout, 
  Upload, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  Image as ImageIcon,
  Link,
  Code2,
  Info
} from 'lucide-react';
import { CommunityAgent, CommunityDevType, CommunityDevStatus } from '../../types';

interface CommunityPostCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newPost: Partial<CommunityAgent>) => void;
  onShowToast: (msg: string) => void;
}

const PRESET_SCREENSHOTS = [
  { id: 'screen-1', label: '문서 분석 & 요약 UI', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80' },
  { id: 'screen-2', label: '대시보드 & 통계 UI', url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80' },
  { id: 'screen-3', label: '회의록 & 텍스트 UI', url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80' },
  { id: 'screen-4', label: '회계 & 영수증 검증 UI', url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80' }
];

export const CommunityPostCreateModal: React.FC<CommunityPostCreateModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  onShowToast
}) => {
  const [title, setTitle] = useState('');
  const [devType, setDevType] = useState<CommunityDevType>('AI 개발');
  const [devStatus, setDevStatus] = useState<CommunityDevStatus>('테스트 중');
  const [version, setVersion] = useState('v0.1');
  const [oneLineDesc, setOneLineDesc] = useState('');
  
  // 5 Structured Sections
  const [problemAndBackground, setProblemAndBackground] = useState('');
  const [implementedFeatures, setImplementedFeatures] = useState('');
  const [testingProgress, setTestingProgress] = useState('');
  const [plannedFeatures, setPlannedFeatures] = useState('');
  const [feedbackWanted, setFeedbackWanted] = useState('');

  // Media & Links
  const [selectedScreenshots, setSelectedScreenshots] = useState<string[]>([]);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [prototypeUrl, setPrototypeUrl] = useState('');
  const [demoVideoUrl, setDemoVideoUrl] = useState('');
  
  // Tags
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['업무자동화']);

  if (!isOpen) return null;

  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    const cleanTag = tagInput.trim().replace(/^#/, '');
    if (!tags.includes(cleanTag)) {
      setTags([...tags, cleanTag]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const toggleScreenshot = (url: string) => {
    if (selectedScreenshots.includes(url)) {
      setSelectedScreenshots(selectedScreenshots.filter(u => u !== url));
    } else {
      setSelectedScreenshots([...selectedScreenshots, url]);
    }
  };

  const handleAddCustomImage = () => {
    if (!customImageUrl.trim()) return;
    if (!selectedScreenshots.includes(customImageUrl.trim())) {
      setSelectedScreenshots([...selectedScreenshots, customImageUrl.trim()]);
    }
    setCustomImageUrl('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      onShowToast('게시물 제목을 입력해주세요.');
      return;
    }
    if (!oneLineDesc.trim()) {
      onShowToast('한 줄 설명을 입력해주세요.');
      return;
    }

    const newPostData: Partial<CommunityAgent> = {
      title: title.trim(),
      devType,
      devStatus,
      version: version.trim() || 'v0.1',
      oneLineDesc: oneLineDesc.trim(),
      shortDesc: oneLineDesc.trim(),
      description: problemAndBackground || oneLineDesc,
      problemAndBackground: problemAndBackground.trim(),
      implementedFeatures: implementedFeatures.trim(),
      testingProgress: testingProgress.trim(),
      plannedFeatures: plannedFeatures.trim(),
      feedbackWanted: feedbackWanted.trim(),
      screenshots: selectedScreenshots,
      prototypeUrl: prototypeUrl.trim() || undefined,
      demoVideoUrl: demoVideoUrl.trim() || undefined,
      tags: tags.length > 0 ? tags : ['AI개발'],
      category: devType === 'AI Agent 개발' ? 'AI Agent' : devType === 'Custom AI 개발' ? 'Custom AI' : '아이디어',
      author: '정소담',
      department: 'AI전략팀',
      developmentType: devType === 'Custom AI 개발' ? 'custom_ai' : 'agent',
      status: devStatus === '아이디어 단계' ? '아이디어' : devStatus === '초기 개발' || devStatus === '개발 중' ? '개발 중' : '테스트 중',
      timelineUpdates: [
        {
          version: version.trim() || 'v0.1',
          date: new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
          title: '사내 AI 커뮤니티에 개발 아이디어 공유',
          changes: [
            problemAndBackground ? '문제 정의 및 개발 배경 등록' : '초기 기획안 공유',
            implementedFeatures ? '현재 구현 기능 소개' : '기능 명세 작성'
          ],
          author: '정소담'
        }
      ]
    };

    onSubmit(newPostData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="community-post-create-modal"
        className="relative w-full max-w-3xl max-h-[92vh] bg-white rounded-2xl shadow-2xl border border-neutral-200 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E60012] flex items-center justify-center text-white shadow-xs">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                AI 개발 아이디어 및 진행 상황 공유
              </h2>
              <p className="text-xs text-neutral-300">
                개발 중인 AI 아이디어, 프로토타입, 화면을 동료들과 공유하고 피드백을 받아보세요.
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
          {/* Important Notice */}
          <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 flex items-start gap-2.5 text-xs text-neutral-700">
            <Info className="w-4 h-4 text-[#E60012] shrink-0 mt-0.5" />
            <div className="space-y-1 leading-relaxed">
              <p className="font-bold text-neutral-900">
                AI Community는 아이디어와 개발 과정을 공유하고 피드백을 주고받는 열린 공간입니다.
              </p>
              <p className="text-neutral-500">
                개발 유형 태그는 현재 개발 방향을 설명하기 위한 항목이며, 최종 공식 서비스 결정은 완성 후 <strong>[공식 등록 제출]</strong> 시 관리자 검수를 통해 확정됩니다.
              </p>
            </div>
          </div>

          {/* 1. Basic Info */}
          <div className="space-y-4">
            <h3 className="font-bold text-xs text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#E60012]" />
              1. 기본 정보
            </h3>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                게시물 제목 <span className="text-[#E60012]">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="예: 회의록 정리 AI를 만들어보고 있습니다"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-neutral-900 focus:bg-white transition-all"
              />
            </div>

            {/* Type & Status & Version Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Development Type */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  개발 유형 (진행 방향) <span className="text-[#E60012]">*</span>
                </label>
                <select
                  value={devType}
                  onChange={e => setDevType(e.target.value as CommunityDevType)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-medium focus:outline-hidden focus:border-neutral-900 focus:bg-white cursor-pointer"
                >
                  <option value="AI 개발">AI 개발 (사내 업무 자동화/도구 개발)</option>
                  <option value="AI 아이디어">AI 아이디어 (기획/발의 단계)</option>
                  <option value="기타 AI 개발">기타 AI 개발</option>
                </select>
              </div>

              {/* Dev Status */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  개발 상태 <span className="text-[#E60012]">*</span>
                </label>
                <select
                  value={devStatus}
                  onChange={e => setDevStatus(e.target.value as CommunityDevStatus)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-medium focus:outline-hidden focus:border-neutral-900 focus:bg-white cursor-pointer"
                >
                  <option value="아이디어 단계">아이디어 단계</option>
                  <option value="초기 개발">초기 개발</option>
                  <option value="개발 중">개발 중</option>
                  <option value="테스트 중">테스트 중</option>
                  <option value="개선 중">개선 중</option>
                  <option value="제출 준비">제출 준비 완료</option>
                </select>
              </div>

              {/* Version */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1">
                  현재 버전
                </label>
                <input
                  type="text"
                  value={version}
                  onChange={e => setVersion(e.target.value)}
                  placeholder="예: v0.1, v0.4, Beta"
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-mono font-medium focus:outline-hidden focus:border-neutral-900 focus:bg-white"
                />
              </div>
            </div>

            {/* One line description */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                한 줄 설명 <span className="text-[#E60012]">*</span>
              </label>
              <input
                type="text"
                required
                value={oneLineDesc}
                onChange={e => setOneLineDesc(e.target.value)}
                placeholder="예: 회의 대화록을 분석해 핵심 논의사항과 Action Item을 정리하는 AI입니다."
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs focus:outline-hidden focus:border-neutral-900 focus:bg-white"
              />
            </div>
          </div>

          {/* 2. Structured Content */}
          <div className="space-y-4 pt-4 border-t border-neutral-200">
            <h3 className="font-bold text-xs text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-[#E60012]" />
              2. 상세 내용 및 개발 진행 상황
            </h3>

            {/* Problem & Background */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                해결하려는 문제 및 아이디어 배경
              </label>
              <textarea
                rows={2}
                value={problemAndBackground}
                onChange={e => setProblemAndBackground(e.target.value)}
                placeholder="어떤 업무적 비효율이나 문제를 해결하기 위해 이 AI를 기획/개발하게 되었는지 적어주세요."
                className="w-full p-3 bg-neutral-50 border border-neutral-300 rounded-xl text-xs focus:outline-hidden focus:border-neutral-900 focus:bg-white resize-none"
              />
            </div>

            {/* Implemented Features */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                현재 구현된 기능
              </label>
              <textarea
                rows={2}
                value={implementedFeatures}
                onChange={e => setImplementedFeatures(e.target.value)}
                placeholder="• 현재까지 구현 완료된 기능들을 항목별로 적어주세요."
                className="w-full p-3 bg-neutral-50 border border-neutral-300 rounded-xl text-xs focus:outline-hidden focus:border-neutral-900 focus:bg-white resize-none"
              />
            </div>

            {/* Testing Progress */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                현재 테스트 중인 내용 및 진행 상황
              </label>
              <textarea
                rows={2}
                value={testingProgress}
                onChange={e => setTestingProgress(e.target.value)}
                placeholder="현재 누구를 대상으로 어떤 테스트를 진행하고 있는지, 어떤 점을 검증 중인지 적어주세요."
                className="w-full p-3 bg-neutral-50 border border-neutral-300 rounded-xl text-xs focus:outline-hidden focus:border-neutral-900 focus:bg-white resize-none"
              />
            </div>

            {/* Planned Features */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                추가 예정 기능 (로드맵)
              </label>
              <textarea
                rows={2}
                value={plannedFeatures}
                onChange={e => setPlannedFeatures(e.target.value)}
                placeholder="향후 버전에 추가하거나 개선하고 싶은 기능들을 적어주세요."
                className="w-full p-3 bg-neutral-50 border border-neutral-300 rounded-xl text-xs focus:outline-hidden focus:border-neutral-900 focus:bg-white resize-none"
              />
            </div>

            {/* Feedback Wanted */}
            <div className="p-3.5 bg-red-50/50 rounded-xl border border-red-100">
              <label className="block text-xs font-bold text-red-900 mb-1 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-[#E60012]" />
                동료 임직원들에게 의견을 받고 싶은 부분 (피드백 질문)
              </label>
              <textarea
                rows={2}
                value={feedbackWanted}
                onChange={e => setFeedbackWanted(e.target.value)}
                placeholder="예: 1. 본부별로 특별히 자주 쓰는 회의록 양식이 있으신가요? 2. 화자 분리 시 동명이인 처리 아이디어가 있을까요?"
                className="w-full p-3 bg-white border border-red-200 rounded-xl text-xs focus:outline-hidden focus:border-red-500 resize-none text-neutral-800"
              />
            </div>
          </div>

          {/* 3. Media & Prototype Link */}
          <div className="space-y-4 pt-4 border-t border-neutral-200">
            <h3 className="font-bold text-xs text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-[#E60012]" />
              3. 이미지 / 화면 스크린샷 및 프로토타입 링크
            </h3>

            {/* Screenshot Presets Selection */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                화면 이미지 선택 (다중 선택 가능)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {PRESET_SCREENSHOTS.map(preset => {
                  const isSelected = selectedScreenshots.includes(preset.url);
                  return (
                    <div
                      key={preset.id}
                      onClick={() => toggleScreenshot(preset.url)}
                      className={`relative rounded-xl border overflow-hidden cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-[#E60012] ring-2 ring-[#E60012]/20 shadow-xs' 
                          : 'border-neutral-200 hover:border-neutral-400 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img 
                        src={preset.url} 
                        alt={preset.label}
                        referrerPolicy="no-referrer"
                        className="w-full h-20 object-cover" 
                      />
                      <div className="p-1.5 bg-white text-[10px] font-bold text-neutral-800 truncate text-center">
                        {preset.label}
                      </div>
                      {isSelected && (
                        <div className="absolute top-1 right-1 bg-[#E60012] text-white p-0.5 rounded-full shadow-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Prototype & Demo Video URL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1 flex items-center gap-1">
                  <Link className="w-3 h-3 text-neutral-400" />
                  프로토타입 / 실행 URL (선택)
                </label>
                <input
                  type="url"
                  value={prototypeUrl}
                  onChange={e => setPrototypeUrl(e.target.value)}
                  placeholder="https://prototype.kpc.or.kr/my-app"
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-xs focus:outline-hidden focus:border-neutral-900 focus:bg-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1 flex items-center gap-1">
                  <Link className="w-3 h-3 text-neutral-400" />
                  데모 영상 URL (선택)
                </label>
                <input
                  type="url"
                  value={demoVideoUrl}
                  onChange={e => setDemoVideoUrl(e.target.value)}
                  placeholder="https://video.kpc.or.kr/demo-video"
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-xs focus:outline-hidden focus:border-neutral-900 focus:bg-white"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1">
                태그 (키워드)
              </label>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                  placeholder="태그 입력 후 Enter (예: 회의, RFP, OCR)"
                  className="flex-1 px-3 py-1.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs focus:outline-hidden focus:border-neutral-900 focus:bg-white"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 py-1.5 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  추가
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-800 text-xs font-medium border border-neutral-200"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-neutral-400 hover:text-neutral-900 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200/60 rounded-xl transition-colors cursor-pointer"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2.5 bg-[#E60012] hover:bg-[#CC0010] text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>아이디어 및 개발 진행 공유하기</span>
          </button>
        </div>
      </div>
    </div>
  );
};
