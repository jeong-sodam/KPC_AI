import React, { useState, useRef } from 'react';
import { 
  ArrowLeft,
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
  Info,
  X,
  Smile,
  Zap,
  BarChart2,
  FileText,
  Search,
  Settings,
  MessageSquare,
  Cpu,
  BrainCircuit,
  Wand2,
  ShieldCheck,
  FolderOpen
} from 'lucide-react';
import { CommunityAgent, CommunityDevType, CommunityDevStatus } from '../../types';

interface CommunityPostCreateViewProps {
  onBack: () => void;
  onSubmit: (newPost: Partial<CommunityAgent>) => void;
  onShowToast: (msg: string) => void;
}

// Preset Screenshots
const PRESET_SCREENSHOTS = [
  { id: 'screen-1', label: '문서 분석 & 요약 UI', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80' },
  { id: 'screen-2', label: '대시보드 & 통계 UI', url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80' },
  { id: 'screen-3', label: '회의록 & 텍스트 UI', url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80' },
  { id: 'screen-4', label: '회계 & 영수증 검증 UI', url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80' }
];

// Preset Icon Options
const PRESET_ICONS = [
  { id: 'bot', label: '에이전트', icon: Bot },
  { id: 'sparkles', label: 'AI 생성', icon: Sparkles },
  { id: 'lightbulb', label: '아이디어', icon: Lightbulb },
  { id: 'layout', label: '커스텀 UI', icon: Layout },
  { id: 'file-text', label: '문서·서식', icon: FileText },
  { id: 'chart', label: '데이터·통계', icon: BarChart2 },
  { id: 'zap', label: '자동화', icon: Zap },
  { id: 'search', label: '지식 검색', icon: Search },
  { id: 'brain', label: '추론 엔진', icon: BrainCircuit },
  { id: 'wand', label: '마법 도구', icon: Wand2 },
  { id: 'message', label: '대화·챗봇', icon: MessageSquare },
  { id: 'shield', label: '보안·검증', icon: ShieldCheck }
];

export const CommunityPostCreateView: React.FC<CommunityPostCreateViewProps> = ({
  onBack,
  onSubmit,
  onShowToast
}) => {
  const [title, setTitle] = useState('');
  const [devStatus, setDevStatus] = useState<CommunityDevStatus>('테스트 중');
  const [version, setVersion] = useState('v0.1');
  const [oneLineDesc, setOneLineDesc] = useState('');
  
  // Icon Selection
  const [selectedIconId, setSelectedIconId] = useState<string>('bot');
  const [customIconImage, setCustomIconImage] = useState<string | null>(null);
  const iconFileInputRef = useRef<HTMLInputElement>(null);

  // 5 Structured Sections
  const [problemAndBackground, setProblemAndBackground] = useState('');
  const [implementedFeatures, setImplementedFeatures] = useState('');
  const [testingProgress, setTestingProgress] = useState('');
  const [plannedFeatures, setPlannedFeatures] = useState('');
  const [feedbackWanted, setFeedbackWanted] = useState('');

  // Media & Screenshots
  const [selectedScreenshots, setSelectedScreenshots] = useState<string[]>([]);
  const [customUploadedImages, setCustomUploadedImages] = useState<string[]>([]);
  const screenshotFileInputRef = useRef<HTMLInputElement>(null);
  const [prototypeUrl, setPrototypeUrl] = useState('');
  const [demoVideoUrl, setDemoVideoUrl] = useState('');
  
  // Tags
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['업무자동화']);

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

  // Icon upload handler (Local image / base64 or URL)
  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        onShowToast('아이콘 이미지는 2MB 이하로 등록해주세요.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setCustomIconImage(reader.result as string);
        setSelectedIconId('custom');
        onShowToast('커스텀 아이콘이 등록되었습니다.');
      };
      reader.readAsDataURL(file);
    }
  };

  // Screenshot preset toggle
  const togglePresetScreenshot = (url: string) => {
    if (selectedScreenshots.includes(url)) {
      setSelectedScreenshots(selectedScreenshots.filter(u => u !== url));
    } else {
      setSelectedScreenshots([...selectedScreenshots, url]);
    }
  };

  // Direct screenshot file upload handler
  const handleScreenshotFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      if (file.size > 5 * 1024 * 1024) {
        onShowToast('5MB 이하의 이미지 파일만 업로드할 수 있습니다.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setCustomUploadedImages(prev => [...prev, result]);
        setSelectedScreenshots(prev => [...prev, result]);
      };
      reader.readAsDataURL(file);
    });

    onShowToast('예시 이미지가 추가되었습니다.');
    if (screenshotFileInputRef.current) {
      screenshotFileInputRef.current.value = '';
    }
  };

  const handleRemoveScreenshot = (urlToRemove: string) => {
    setSelectedScreenshots(selectedScreenshots.filter(u => u !== urlToRemove));
    setCustomUploadedImages(customUploadedImages.filter(u => u !== urlToRemove));
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
      icon: selectedIconId === 'custom' && customIconImage ? customIconImage : selectedIconId,
      screenshots: selectedScreenshots,
      prototypeUrl: prototypeUrl.trim() || undefined,
      demoVideoUrl: demoVideoUrl.trim() || undefined,
      tags: tags.length > 0 ? tags : ['AI개발'],
      category: 'AI 개발',
      author: '정소담',
      department: 'AI전략팀',
      developmentType: 'agent',
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
    onShowToast('아이디어 및 개발 진행 상황이 성공적으로 등록되었습니다.');
    onBack();
  };

  return (
    <div id="community-create-view" className="flex-1 flex flex-col h-full overflow-y-auto bg-[#F8F9FA] animate-in fade-in duration-200">
      
      {/* ─────────────────────────────────────────────────────────────
          Sticky Top Action & Navigation Bar
          ───────────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-200/90 shadow-2xs">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="group flex items-center gap-2 text-xs sm:text-sm font-bold text-neutral-700 hover:text-neutral-950 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-neutral-100 group-hover:bg-neutral-200 flex items-center justify-center text-neutral-600 group-hover:text-neutral-900 transition-colors">
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            </div>
            <span>커뮤니티 목록으로 돌아가기</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2 text-xs font-bold text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer"
            >
              작성 취소
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-[#E60012] hover:bg-[#CC0010] text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>아이디어 등록 및 공유하기</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          Form Main Content
          ───────────────────────────────────────────────────────────── */}
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        
        {/* Header Title Card */}
        <div className="bg-neutral-900 text-white rounded-2xl p-6 sm:p-8 shadow-xs space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E60012] flex items-center justify-center text-white shadow-xs">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white">
                새로운 AI 아이디어 및 개발 진행 상황 공유
              </h1>
              <p className="text-xs text-neutral-300">
                개발 중인 AI 아이디어, 프로토타입, 예시 화면을 동료들과 공유하고 유익한 피드백을 받아보세요.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-800 flex items-start gap-2.5 text-xs text-neutral-300">
            <Info className="w-4 h-4 text-[#E60012] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              작성하신 글은 사내 AI 커뮤니티에 즉시 공유되며, 개발 고도화 후 언제든지 <strong>[공식 등록 제출]</strong>을 통해 전사 공용 서비스로 신청할 수 있습니다.
            </p>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ─────────────────────────────────────────────────────────────
              1. 기본 정보 및 대표 아이콘
              ───────────────────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 sm:p-8 shadow-xs space-y-6">
            <h2 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#E60012]" />
              1. 기본 정보 및 대표 아이콘
            </h2>

            {/* Icon Selection Section */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-2">
                대표 아이콘 선택 (또는 직접 업로드)
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5">
                {/* Preset Icon list */}
                {PRESET_ICONS.map(item => {
                  const IconComp = item.icon;
                  const isSelected = selectedIconId === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setSelectedIconId(item.id);
                        setCustomIconImage(null);
                      }}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs scale-102' 
                          : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-700'
                      }`}
                    >
                      <IconComp className={`w-5 h-5 ${isSelected ? 'text-[#E60012]' : 'text-neutral-600'}`} />
                      <span className="text-[10px] font-bold truncate max-w-full">{item.label}</span>
                    </button>
                  );
                })}

                {/* Direct Custom Icon Upload (At the end) */}
                <div className="relative">
                  <input
                    type="file"
                    ref={iconFileInputRef}
                    accept="image/*"
                    onChange={handleIconUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => iconFileInputRef.current?.click()}
                    className={`w-full h-full min-h-[64px] p-2 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      selectedIconId === 'custom' && customIconImage
                        ? 'border-[#E60012] bg-red-50/40 text-neutral-900 ring-2 ring-[#E60012]/20'
                        : 'border-neutral-300 hover:border-neutral-500 bg-neutral-50 hover:bg-neutral-100 text-neutral-600'
                    }`}
                  >
                    {customIconImage ? (
                      <div className="relative w-7 h-7 rounded-lg overflow-hidden border border-neutral-300 shadow-2xs">
                        <img src={customIconImage} alt="커스텀 아이콘" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <Upload className="w-4 h-4 text-[#E60012]" />
                    )}
                    <span className="text-[10px] font-bold text-center leading-tight">
                      {customIconImage ? '아이콘 변경' : '직접 업로드'}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                게시물 제목 <span className="text-[#E60012]">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="예: 회의록 정리 AI를 만들어보고 있습니다"
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-300 rounded-xl text-xs sm:text-sm font-semibold focus:outline-hidden focus:border-neutral-900 focus:bg-white transition-all shadow-2xs"
              />
            </div>

            {/* Status & Version Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Dev Status */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                  개발 상태 <span className="text-[#E60012]">*</span>
                </label>
                <select
                  value={devStatus}
                  onChange={e => setDevStatus(e.target.value as CommunityDevStatus)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-medium focus:outline-hidden focus:border-neutral-900 focus:bg-white cursor-pointer shadow-2xs"
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
                <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                  현재 버전
                </label>
                <input
                  type="text"
                  value={version}
                  onChange={e => setVersion(e.target.value)}
                  placeholder="예: v0.1, v0.4, Beta"
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-mono font-medium focus:outline-hidden focus:border-neutral-900 focus:bg-white shadow-2xs"
                />
              </div>
            </div>

            {/* One line description */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                한 줄 설명 <span className="text-[#E60012]">*</span>
              </label>
              <input
                type="text"
                required
                value={oneLineDesc}
                onChange={e => setOneLineDesc(e.target.value)}
                placeholder="예: 회의 대화록을 분석해 핵심 논의사항과 Action Item을 정리하는 AI입니다."
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-neutral-900 focus:bg-white shadow-2xs"
              />
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              2. 예시 이미지 및 화면 스크린샷 업로드 섹션
              ───────────────────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#E60012]" />
                2. 예시 이미지 및 화면 스크린샷 등록
              </h2>
              <span className="text-xs text-neutral-400 font-medium">다중 등록 가능</span>
            </div>

            {/* Direct Upload Box */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-neutral-700">
                직접 파일 업로드 (PC 이미지 등록)
              </label>
              <div 
                onClick={() => screenshotFileInputRef.current?.click()}
                className="border-2 border-dashed border-neutral-300 hover:border-neutral-500 bg-neutral-50/70 hover:bg-neutral-100/70 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2"
              >
                <input
                  type="file"
                  ref={screenshotFileInputRef}
                  multiple
                  accept="image/*"
                  onChange={handleScreenshotFileUpload}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-2xl bg-white border border-neutral-200 flex items-center justify-center text-neutral-600 shadow-2xs">
                  <Upload className="w-6 h-6 text-[#E60012]" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm font-bold text-neutral-800">
                    클릭하여 예시 이미지 또는 UI 캡처본을 업로드하세요
                  </p>
                  <p className="text-[11px] text-neutral-400">
                    PNG, JPG, GIF 지원 (개별 파일 최대 5MB)
                  </p>
                </div>
              </div>
            </div>

            {/* Preset Screenshot Library */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold text-neutral-700">
                추천 예시 템플릿 이미지에서 선택
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {PRESET_SCREENSHOTS.map(preset => {
                  const isSelected = selectedScreenshots.includes(preset.url);
                  return (
                    <div
                      key={preset.id}
                      onClick={() => togglePresetScreenshot(preset.url)}
                      className={`relative rounded-xl border overflow-hidden cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-[#E60012] ring-2 ring-[#E60012]/20 shadow-xs' 
                          : 'border-neutral-200 hover:border-neutral-400 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img 
                        src={preset.url} 
                        alt={preset.label}
                        referrerPolicy="no-referrer"
                        className="w-full h-24 object-cover" 
                      />
                      <div className="p-2 bg-white text-[11px] font-bold text-neutral-800 truncate text-center">
                        {preset.label}
                      </div>
                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-[#E60012] text-white p-1 rounded-full shadow-xs">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Registered Image Preview List */}
            {selectedScreenshots.length > 0 && (
              <div className="pt-4 border-t border-neutral-100 space-y-2.5">
                <label className="block text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  등록된 이미지 목록 ({selectedScreenshots.length}개)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {selectedScreenshots.map((url, idx) => (
                    <div key={idx} className="relative group rounded-xl border border-neutral-200 overflow-hidden aspect-video bg-neutral-100 shadow-2xs">
                      <img src={url} alt={`등록 이미지 ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveScreenshot(url)}
                        className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/70 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ─────────────────────────────────────────────────────────────
              3. 상세 구조화 내용 (5대 섹션)
              ───────────────────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 sm:p-8 shadow-xs space-y-6">
            <h2 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[#E60012]" />
              3. 상세 내용 및 개발 진행 상황 (5대 섹션)
            </h2>

            {/* Problem & Background */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-700">
                1. 해결하려는 문제 및 아이디어 배경
              </label>
              <textarea
                rows={3}
                value={problemAndBackground}
                onChange={e => setProblemAndBackground(e.target.value)}
                placeholder="어떤 업무적 비효율이나 불편을 해결하기 위해 이 AI를 기획/개발하게 되었는지 적어주세요."
                className="w-full p-3.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-neutral-900 focus:bg-white resize-none shadow-2xs"
              />
            </div>

            {/* Implemented Features */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-700">
                2. 현재 구현된 기능
              </label>
              <textarea
                rows={3}
                value={implementedFeatures}
                onChange={e => setImplementedFeatures(e.target.value)}
                placeholder="• 현재까지 구현 완료된 기능들을 항목별로 적어주세요."
                className="w-full p-3.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-neutral-900 focus:bg-white resize-none shadow-2xs"
              />
            </div>

            {/* Testing Progress */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-700">
                3. 현재 테스트 중인 내용 및 진행 상황
              </label>
              <textarea
                rows={3}
                value={testingProgress}
                onChange={e => setTestingProgress(e.target.value)}
                placeholder="현재 누구를 대상으로 어떤 테스트를 진행하고 있는지, 어떤 점을 검증 중인지 적어주세요."
                className="w-full p-3.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-neutral-900 focus:bg-white resize-none shadow-2xs"
              />
            </div>

            {/* Planned Features */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-neutral-700">
                4. 추가 예정 기능 (로드맵)
              </label>
              <textarea
                rows={3}
                value={plannedFeatures}
                onChange={e => setPlannedFeatures(e.target.value)}
                placeholder="향후 버전에 추가하거나 개선하고 싶은 기능들을 적어주세요."
                className="w-full p-3.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-neutral-900 focus:bg-white resize-none shadow-2xs"
              />
            </div>

            {/* Feedback Wanted */}
            <div className="p-5 bg-red-50/50 rounded-2xl border border-red-100 space-y-2">
              <label className="block text-xs font-bold text-red-900 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-[#E60012]" />
                동료 임직원들에게 의견을 받고 싶은 부분 (피드백 질문)
              </label>
              <textarea
                rows={3}
                value={feedbackWanted}
                onChange={e => setFeedbackWanted(e.target.value)}
                placeholder="예: 1. 본부별로 특별히 자주 쓰는 회의록 양식이 있으신가요? 2. 화자 분리 시 동명이인 처리 아이디어가 있을까요?"
                className="w-full p-3.5 bg-white border border-red-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-red-500 resize-none text-neutral-800 shadow-2xs"
              />
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              4. 링크 및 태그
              ───────────────────────────────────────────────────────────── */}
          <div className="bg-white rounded-2xl border border-neutral-200/80 p-6 sm:p-8 shadow-xs space-y-6">
            <h2 className="text-xs font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
              <Link className="w-4 h-4 text-[#E60012]" />
              4. 실행 링크 및 태그
            </h2>

            {/* Prototype & Demo Video URL */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5 flex items-center gap-1">
                  <Link className="w-3.5 h-3.5 text-neutral-400" />
                  프로토타입 / 실행 URL (선택)
                </label>
                <input
                  type="url"
                  value={prototypeUrl}
                  onChange={e => setPrototypeUrl(e.target.value)}
                  placeholder="https://prototype.kpc.or.kr/my-app"
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs focus:outline-hidden focus:border-neutral-900 focus:bg-white shadow-2xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-700 mb-1.5 flex items-center gap-1">
                  <Link className="w-3.5 h-3.5 text-neutral-400" />
                  데모 영상 URL (선택)
                </label>
                <input
                  type="url"
                  value={demoVideoUrl}
                  onChange={e => setDemoVideoUrl(e.target.value)}
                  placeholder="https://video.kpc.or.kr/demo-video"
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs focus:outline-hidden focus:border-neutral-900 focus:bg-white shadow-2xs"
                />
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-neutral-700">
                태그 (키워드)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                  placeholder="태그 입력 후 Enter 또는 추가 버튼 클릭 (예: 회의, RFP, OCR)"
                  className="flex-1 px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs focus:outline-hidden focus:border-neutral-900 focus:bg-white shadow-2xs"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  추가
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-neutral-100 text-neutral-800 text-xs font-medium border border-neutral-200"
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

          {/* Bottom Action Submit Button Bar */}
          <div className="pt-2 flex items-center justify-end gap-3 pb-12">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-3 bg-white border border-neutral-300 hover:bg-neutral-50 text-neutral-800 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-2xs cursor-pointer"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-[#E60012] hover:bg-[#CC0010] text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>아이디어 및 개발 진행 공유하기</span>
            </button>
          </div>

        </form>
      </div>

    </div>
  );
};
