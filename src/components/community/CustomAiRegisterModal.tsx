import React, { useState, useRef } from 'react';
import { 
  X, 
  Layout, 
  Sparkles, 
  Globe, 
  Link2, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  Cpu, 
  Database, 
  Server, 
  UserCheck, 
  Layers, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  Info,
  Upload,
  Video,
  Film,
  Star
} from 'lucide-react';
import { CommunityAgent } from '../../types';

interface CustomAiRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (agentData: CommunityAgent) => void;
  onShowToast: (msg: string) => void;
  initialData?: CommunityAgent | null;
  currentUserName?: string;
}

export interface UploadedMediaItem {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video';
  size?: string;
  isPrimary: boolean;
}

const CATEGORY_OPTIONS = [
  '제안서',
  '문서작성',
  '데이터분석',
  '교육',
  '업무자동화',
  '기타'
];

const DEV_STATUS_OPTIONS: Array<'기획 중' | '개발 중' | 'Prototype' | '테스트 가능' | '운영 중'> = [
  '기획 중',
  '개발 중',
  'Prototype',
  '테스트 가능',
  '운영 중'
];

const ACCESS_TYPE_OPTIONS: Array<'Web App' | 'Prototype' | '사내 시스템' | 'API' | 'MCP' | '기타'> = [
  'Web App',
  'Prototype',
  '사내 시스템',
  'API',
  'MCP',
  '기타'
];

const AI_MODEL_OPTIONS = ['GPT-4o', 'Claude 3.7 Sonnet', 'Gemini 2.5 Flash', '사내 온프레미스 LLM', '기타'];

const DATA_SOURCE_OPTIONS = [
  'Knowledge AI',
  'SharePoint',
  'OneDrive',
  'Teams',
  'ERP',
  '파일',
  '외부 데이터'
];

const CONNECTOR_OPTIONS = [
  '교육과정 조회',
  '자격정보 조회',
  'ERP',
  'SharePoint',
  'Teams',
  'MCP Connector',
  'REST API'
];

const PRESET_SCREENSHOTS = [
  {
    name: 'RFP 제안서 생성 워크스페이스',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: '데이터 분석 대시보드 UI',
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: '사내 규정 Q&A 인터페이스',
    url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80'
  },
  {
    name: '교육과정 추천 웹앱',
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80'
  }
];

export const CustomAiRegisterModal: React.FC<CustomAiRegisterModalProps> = ({
  isOpen,
  onClose,
  onPublish,
  onShowToast,
  initialData,
  currentUserName = '정소담'
}) => {
  const isEditing = Boolean(initialData);

  // 1. 기본 정보
  const [title, setTitle] = useState(initialData?.title || '');
  const [shortDesc, setShortDesc] = useState(initialData?.shortDesc || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [category, setCategory] = useState(initialData?.category || '제안서');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(initialData?.tags || ['RFP', '제안서', '문서자동화']);

  // 2. 개발 상태
  const [devStatus, setDevStatus] = useState<'기획 중' | '개발 중' | 'Prototype' | '테스트 가능' | '운영 중'>(
    initialData?.devStatus || '테스트 가능'
  );

  // 3. 대표 화면 & 미디어 업로드 (최대 10개)
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const initialMediaList = (): UploadedMediaItem[] => {
    if (initialData?.screenshots && initialData.screenshots.length > 0) {
      return initialData.screenshots.slice(0, 10).map((url, idx) => ({
        id: `init-media-${idx}`,
        name: `등록된 화면 ${idx + 1}`,
        url: url,
        type: (url.includes('.mp4') || url.includes('.webm')) ? 'video' : 'image',
        size: '1.5 MB',
        isPrimary: idx === 0 || url === initialData.mainImageUrl
      }));
    }
    if (initialData?.mainImageUrl) {
      return [{
        id: 'init-media-main',
        name: '대표 화면 썸네일',
        url: initialData.mainImageUrl,
        type: 'image',
        size: '1.2 MB',
        isPrimary: true
      }];
    }
    // 기본 샘플 1개
    return [{
      id: 'default-media-1',
      name: 'RFP 제안서 생성 워크스페이스',
      url: PRESET_SCREENSHOTS[0].url,
      type: 'image',
      size: '1.2 MB',
      isPrimary: true
    }];
  };

  const [mediaItems, setMediaItems] = useState<UploadedMediaItem[]>(initialMediaList);
  const [mainImageUrl, setMainImageUrl] = useState(
    initialData?.mainImageUrl || PRESET_SCREENSHOTS[0].url
  );
  const [screenshots, setScreenshots] = useState<string[]>(
    initialData?.screenshots || [PRESET_SCREENSHOTS[0].url]
  );
  const [isDragging, setIsDragging] = useState(false);
  const [manualUrlInput, setManualUrlInput] = useState('');
  const [demoGifUrl, setDemoGifUrl] = useState(initialData?.demoGifUrl || '');
  const [demoVideoUrl, setDemoVideoUrl] = useState(initialData?.demoVideoUrl || '');

  // 4. 접속 정보
  const [accessType, setAccessType] = useState<'Web App' | 'Prototype' | '사내 시스템' | 'API' | 'MCP' | '기타'>(
    initialData?.accessType || 'Web App'
  );
  const [serviceUrl, setServiceUrl] = useState(
    initialData?.serviceUrl || 'https://custom-ai.kpc.or.kr/rfp-generator'
  );
  const [prototypeUrl, setPrototypeUrl] = useState(
    initialData?.prototypeUrl || 'https://figma.com/proto/kpc-rfp-ai-sample'
  );
  const [apiEndpoint, setApiEndpoint] = useState(
    initialData?.apiEndpoint || 'https://api-internal.kpc.or.kr/v1/rfp/generate'
  );

  // 5. AI 구성 정보
  const [selectedModels, setSelectedModels] = useState<string[]>(
    initialData?.usedModels || ['Claude 3.7 Sonnet', 'GPT-4o']
  );
  const [selectedDataSources, setSelectedDataSources] = useState<string[]>(
    initialData?.usedDataSources || ['Knowledge AI', 'SharePoint', '파일']
  );
  const [selectedConnectors, setSelectedConnectors] = useState<string[]>(
    initialData?.connectedConnectorsList || ['교육과정 조회', 'ERP', 'REST API']
  );

  // 6. 담당 정보
  const [coAuthors, setCoAuthors] = useState<string[]>(
    initialData?.coAuthors || ['김민준 (컨설팅본부)', '이서연 (DX혁신팀)']
  );
  const [newCoAuthor, setNewCoAuthor] = useState('');
  const [operatorDept, setOperatorDept] = useState(
    initialData?.operatorDept || '컨설팅본부 / AI전략팀'
  );
  const [maintainerName, setMaintainerName] = useState(
    initialData?.maintainerName || '정소담 (AI전략팀)'
  );

  // 7. 상세 소개 및 기능
  const [howToUse, setHowToUse] = useState(
    initialData?.howToUse || 
    '1. 과업지시서 또는 RFP PDF 파일을 업로드합니다.\n2. AI가 필수 제안요구조건과 평가항목을 자동 분석합니다.\n3. 사내 수주 성공 템플릿 기반으로 장·절 목차와 초안을 생성합니다.'
  );

  if (!isOpen) return null;

  // Add Tag
  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    const clean = tagInput.trim().replace(/^#/, '');
    if (!tags.includes(clean)) {
      setTags([...tags, clean]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  // 미디어 업로드 및 관리 (최대 10개)
  const handleFilesUpload = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    const currentCount = mediaItems.length;
    const availableSlots = 10 - currentCount;

    if (availableSlots <= 0) {
      onShowToast('미디어는 최대 10개까지 업로드할 수 있습니다.');
      return;
    }

    const filesToProcess = fileArray.slice(0, availableSlots);
    if (fileArray.length > availableSlots) {
      onShowToast(`최대 10개 제한으로 인해 ${filesToProcess.length}개 파일만 추가되었습니다.`);
    }

    filesToProcess.forEach(file => {
      const isVideo = file.type.startsWith('video/');
      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${Math.round(file.size / 1024)} KB`;

      const reader = new FileReader();
      reader.onload = (e) => {
        const resultUrl = e.target?.result as string;
        if (!resultUrl) return;

        setMediaItems(prev => {
          if (prev.length >= 10) return prev;
          const isFirstItem = prev.length === 0;
          const newItem: UploadedMediaItem = {
            id: `media-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
            name: file.name,
            url: resultUrl,
            type: isVideo ? 'video' : 'image',
            size: sizeStr,
            isPrimary: isFirstItem
          };
          const updated = [...prev, newItem];
          if (isFirstItem) {
            setMainImageUrl(resultUrl);
          }
          setScreenshots(updated.map(u => u.url));
          return updated;
        });
      };
      reader.readAsDataURL(file);
    });

    onShowToast(`${filesToProcess.length}개의 미디어 파일이 추가되었습니다.`);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesUpload(e.dataTransfer.files);
    }
  };

  const handleSetPrimary = (id: string) => {
    setMediaItems(prev => {
      const updated = prev.map(m => ({
        ...m,
        isPrimary: m.id === id
      }));
      const primary = updated.find(m => m.id === id);
      if (primary) {
        setMainImageUrl(primary.url);
      }
      return updated;
    });
    onShowToast('선택한 미디어가 대표 화면(썸네일)으로 지정되었습니다.');
  };

  const handleRemoveMedia = (id: string) => {
    setMediaItems(prev => {
      const remaining = prev.filter(m => m.id !== id);
      if (remaining.length > 0 && !remaining.some(m => m.isPrimary)) {
        remaining[0].isPrimary = true;
        setMainImageUrl(remaining[0].url);
      } else if (remaining.length === 0) {
        setMainImageUrl('');
      }
      setScreenshots(remaining.map(r => r.url));
      return remaining;
    });
    onShowToast('미디어가 삭제되었습니다.');
  };

  const handleAddSamplePreset = () => {
    if (mediaItems.length >= 10) {
      onShowToast('미디어는 최대 10개까지 업로드할 수 있습니다.');
      return;
    }
    const presetIndex = mediaItems.length % PRESET_SCREENSHOTS.length;
    const sample = PRESET_SCREENSHOTS[presetIndex];
    const newItem: UploadedMediaItem = {
      id: `sample-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: sample.name,
      url: sample.url,
      type: 'image',
      size: '1.2 MB',
      isPrimary: mediaItems.length === 0
    };
    const updated = [...mediaItems, newItem];
    setMediaItems(updated);
    if (newItem.isPrimary) {
      setMainImageUrl(newItem.url);
    }
    setScreenshots(updated.map(u => u.url));
    onShowToast(`샘플 [${sample.name}] 이미지가 추가되었습니다. (${updated.length}/10)`);
  };

  const handleAddManualUrl = () => {
    if (!manualUrlInput.trim()) return;
    if (mediaItems.length >= 10) {
      onShowToast('미디어는 최대 10개까지 등록할 수 있습니다.');
      return;
    }
    const isVideo = manualUrlInput.includes('.mp4') || manualUrlInput.includes('.webm');
    const newItem: UploadedMediaItem = {
      id: `url-media-${Date.now()}`,
      name: `외부 미디어 (${mediaItems.length + 1})`,
      url: manualUrlInput.trim(),
      type: isVideo ? 'video' : 'image',
      size: '외부 링크',
      isPrimary: mediaItems.length === 0
    };
    const updated = [...mediaItems, newItem];
    setMediaItems(updated);
    if (newItem.isPrimary) {
      setMainImageUrl(newItem.url);
    }
    setScreenshots(updated.map(u => u.url));
    setManualUrlInput('');
    onShowToast('외부 미디어 URL이 등록되었습니다.');
  };

  // Toggle Checkboxes
  const toggleModel = (model: string) => {
    setSelectedModels(prev => 
      prev.includes(model) ? prev.filter(m => m !== model) : [...prev, model]
    );
  };

  const toggleDataSource = (ds: string) => {
    setSelectedDataSources(prev => 
      prev.includes(ds) ? prev.filter(d => d !== ds) : [...prev, ds]
    );
  };

  const toggleConnector = (c: string) => {
    setSelectedConnectors(prev => 
      prev.includes(c) ? prev.filter(item => item !== c) : [...prev, c]
    );
  };

  // Add Co-Author
  const handleAddCoAuthor = () => {
    if (!newCoAuthor.trim()) return;
    setCoAuthors([...coAuthors, newCoAuthor.trim()]);
    setNewCoAuthor('');
  };

  const handleRemoveCoAuthor = (idx: number) => {
    setCoAuthors(coAuthors.filter((_, i) => i !== idx));
  };

  // Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      onShowToast('서비스명을 입력해주세요.');
      return;
    }
    if (!shortDesc.trim()) {
      onShowToast('한 줄 설명을 입력해주세요.');
      return;
    }

    const primaryMedia = mediaItems.find(m => m.isPrimary) || mediaItems[0];
    const finalMainImageUrl = primaryMedia?.url || mainImageUrl || PRESET_SCREENSHOTS[0].url;
    const finalScreenshots = mediaItems.map(m => m.url);
    const finalVideoUrl = mediaItems.find(m => m.type === 'video')?.url || demoVideoUrl;

    const postData: CommunityAgent = {
      id: initialData?.id || `custom-ai-${Date.now()}`,
      title: title.trim(),
      shortDesc: shortDesc.trim(),
      description: description.trim() || shortDesc.trim(),
      category: category,
      tags: tags.length > 0 ? tags : ['CustomAI'],
      author: initialData?.author || currentUserName,
      department: initialData?.department || 'AI전략팀',
      createdAt: initialData?.createdAt || '2026.09.17',
      updatedAt: '2026.09.17',
      version: initialData?.version || 'v1.0',
      status: initialData?.status || 'Community 게시',
      likes: initialData?.likes || 0,
      userLiked: initialData?.userLiked || false,
      views: initialData?.views || 1,
      forks: initialData?.forks || 0,
      runs: initialData?.runs || 0,
      commentsCount: initialData?.commentsCount || 0,
      comments: initialData?.comments || [],
      auditNominated: false,
      nominationCount: 0,
      developmentType: 'custom_ai',
      registeredType: initialData?.registeredType || null,
      registeredTargetId: initialData?.registeredTargetId,
      linkedVerifiedAgentId: initialData?.linkedVerifiedAgentId,
      promptPreview: `Custom AI 서비스 (${title}) - ${accessType} 연동`,
      exampleInputs: 'RFP 문서 업로드 및 제안 요구조건 파라미터 선택',
      exampleOutput: '제안서 전체 초안 및 장절 구조화 결과물 문서 생성',
      howToUse: howToUse,
      reasonCreated: '사내 다양한 복합 업무를 지원하기 위해 독립 UI와 자체 프로세스를 탑재한 AI 서비스 개발',
      changelog: initialData?.changelog || [
        {
          version: 'v1.0',
          date: '2026.09.17',
          changes: ['Custom AI 서비스 Community 최초 등록 및 화면 공유']
        }
      ],
      // Custom AI 전용 속성
      devStatus: devStatus,
      mainImageUrl: finalMainImageUrl,
      screenshots: finalScreenshots,
      demoGifUrl: demoGifUrl,
      demoVideoUrl: finalVideoUrl,
      accessType: accessType,
      serviceUrl: serviceUrl,
      prototypeUrl: prototypeUrl,
      apiEndpoint: apiEndpoint,
      coAuthors: coAuthors,
      operatorDept: operatorDept,
      maintainerName: maintainerName,
      usedModels: selectedModels,
      usedDataSources: selectedDataSources,
      connectedConnectorsList: selectedConnectors
    };

    onPublish(postData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        id="custom-ai-register-modal"
        className="relative w-full max-w-4xl max-h-[92vh] bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-5 sm:px-8 border-b border-neutral-200 flex items-center justify-between bg-gradient-to-r from-red-500/10 via-neutral-50 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E60012] text-white flex items-center justify-center shadow-xs">
              <Layout className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-neutral-900">
                  {isEditing ? 'Custom AI 서비스 정보 수정' : 'Custom AI 등록하기'}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-red-50 text-[#E60012] text-xs font-bold border border-red-200">
                  Custom AI 개발
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                별도로 개발된 UI와 자체 업무 흐름을 가진 AI 서비스를 AI Community에 등록하고 공유합니다.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body - Scrollable */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 text-xs">
          
          {/* Section 1: 기본 정보 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-neutral-200 pb-2">
              <span className="w-2 h-2 rounded-full bg-[#E60012]" />
              <h3 className="text-sm font-bold text-neutral-900">1. 기본 정보</h3>
              <span className="text-[11px] text-neutral-400">서비스명, 설명, 카테고리 설정</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-neutral-800 mb-1.5">
                  서비스명 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="예: RFP 제안서 생성 AI"
                  className="w-full px-3 py-2 bg-neutral-50 focus:bg-white border border-neutral-200 rounded-lg text-xs text-neutral-900 focus:border-neutral-900 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-800 mb-1.5">
                  카테고리 <span className="text-red-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 focus:bg-white border border-neutral-200 rounded-lg text-xs text-neutral-900 focus:border-neutral-900 outline-none transition-all"
                >
                  {CATEGORY_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-neutral-800 mb-1.5">
                한 줄 설명 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={shortDesc}
                onChange={e => setShortDesc(e.target.value)}
                placeholder="예: RFP 분석부터 제안서 작성까지 지원하는 업무 특화 AI 서비스입니다."
                className="w-full px-3 py-2 bg-neutral-50 focus:bg-white border border-neutral-200 rounded-lg text-xs text-neutral-900 focus:border-neutral-900 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block font-bold text-neutral-800 mb-1.5">
                상세 설명 (서비스 목적 및 주요 기능)
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="해당 서비스가 해결하는 주요 업무 페인포인트와 핵심 기능 구성을 설명해주세요."
                className="w-full px-3 py-2 bg-neutral-50 focus:bg-white border border-neutral-200 rounded-lg text-xs text-neutral-900 focus:border-neutral-900 outline-none transition-all"
              />
            </div>

            {/* 태그 입력 */}
            <div>
              <label className="block font-bold text-neutral-800 mb-1.5">
                태그 (키워드)
              </label>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="태그 입력 후 Enter (예: RFP, 제안서, 문서자동화)"
                  className="flex-1 px-3 py-2 bg-neutral-50 focus:bg-white border border-neutral-200 rounded-lg text-xs text-neutral-900 focus:border-neutral-900 outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3.5 py-2 bg-neutral-900 text-white rounded-lg font-semibold hover:bg-black cursor-pointer"
                >
                  추가
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-700 text-xs font-medium"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-neutral-400 hover:text-neutral-700 ml-0.5 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: 개발 상태 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-neutral-200 pb-2">
              <span className="w-2 h-2 rounded-full bg-[#E60012]" />
              <h3 className="text-sm font-bold text-neutral-900">2. 개발 상태</h3>
              <span className="text-[11px] text-neutral-400">Community 카드에 배지로 표기됩니다</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {DEV_STATUS_OPTIONS.map(status => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setDevStatus(status)}
                  className={`p-3 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                    devStatus === status
                      ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                      : 'bg-neutral-50 text-neutral-600 border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  <span>{status}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ─────────────────────────────────────────────
              Section 3: 대표 화면 및 이미지/동영상 업로드 (최대 10개)
              ───────────────────────────────────────────── */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#E60012]" />
                <h3 className="text-sm font-bold text-neutral-900">3. Custom AI 대표 화면 및 미디어 업로드</h3>
                <span className="text-[11px] text-neutral-400">실제 UI 스크린샷 이미지 또는 시연 동영상 업로드</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono border ${
                  mediaItems.length >= 10 
                    ? 'bg-amber-50 text-amber-700 border-amber-300' 
                    : 'bg-neutral-100 text-neutral-700 border-neutral-200'
                }`}>
                  업로드: <strong>{mediaItems.length}</strong> / 10개
                </span>
              </div>
            </div>

            {/* 파일 업로드 드롭존 (Drag & Drop + 파일 선택) */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3
                ${isDragging 
                  ? 'border-[#E60012] bg-red-50/70 shadow-md scale-[0.99]' 
                  : 'border-neutral-300 bg-neutral-50 hover:bg-neutral-100/80 hover:border-neutral-400'
                }
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files) {
                    handleFilesUpload(e.target.files);
                    e.target.value = '';
                  }
                }}
              />

              <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-neutral-200 flex items-center justify-center text-[#E60012]">
                <Upload className="w-6 h-6" />
              </div>

              <div>
                <div className="text-sm font-bold text-neutral-800">
                  클릭하여 이미지 또는 동영상 업로드, 혹은 여기에 파일을 끌어다 놓으세요
                </div>
                <div className="text-xs text-neutral-500 mt-1">
                  지원 형식: <strong>PNG, JPG, JPEG, WebP, GIF, MP4, WebM</strong> (복수 업로드 가능, <strong>최대 10개</strong>)
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="px-4 py-2 bg-neutral-900 hover:bg-black text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>내 컴퓨터에서 파일 선택</span>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddSamplePreset();
                  }}
                  className="px-3.5 py-2 bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-700 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#E60012]" />
                  <span>샘플 이미지 추가</span>
                </button>
              </div>
            </div>

            {/* 업로드된 미디어 갤러리 및 대표 화면 설정 목록 (최대 10개) */}
            {mediaItems.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-neutral-600 px-0.5">
                  <span className="font-bold flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#E60012]" />
                    등록된 화면 목록 ({mediaItems.length}/10)
                  </span>
                  <span className="text-[11px] text-neutral-400">
                    * [대표 지정]을 누르면 Community 카드 썸네일로 사용됩니다.
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                  {mediaItems.map((item, idx) => (
                    <div
                      key={item.id}
                      className={`
                        group relative rounded-xl overflow-hidden border-2 bg-white flex flex-col transition-all shadow-2xs
                        ${item.isPrimary 
                          ? 'border-[#E60012] ring-2 ring-red-200 shadow-md' 
                          : 'border-neutral-200 hover:border-neutral-400'
                        }
                      `}
                    >
                      {/* 미디어 썸네일 / 미리보기 */}
                      <div className="relative h-28 bg-neutral-900 overflow-hidden flex items-center justify-center">
                        {item.type === 'video' ? (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900 text-white p-2">
                            <Film className="w-8 h-8 text-neutral-400 mb-1" />
                            <span className="text-[10px] text-neutral-300 truncate w-full text-center">{item.name}</span>
                          </div>
                        ) : (
                          <img
                            src={item.url}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        )}

                        {/* 상단 배지: 대표 화면 또는 미디어 타입 */}
                        <div className="absolute top-1.5 left-1.5 flex items-center gap-1">
                          {item.isPrimary ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#E60012] text-white text-[10px] font-bold shadow-xs">
                              <Star className="w-2.5 h-2.5 fill-current" />
                              대표 화면
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded bg-black/60 text-white text-[10px] font-medium backdrop-blur-xs">
                              {idx + 1}
                            </span>
                          )}
                          <span className="px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px] font-semibold backdrop-blur-xs">
                            {item.type === 'video' ? '동영상' : '이미지'}
                          </span>
                        </div>

                        {/* 삭제 버튼 */}
                        <button
                          type="button"
                          onClick={() => handleRemoveMedia(item.id)}
                          className="absolute top-1.5 right-1.5 p-1 rounded-md bg-black/70 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-xs"
                          title="미디어 삭제"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                      {/* 하단 컨트롤 바 */}
                      <div className="p-2 flex flex-col justify-between gap-1.5 bg-neutral-50 border-t border-neutral-100">
                        <div className="text-[11px] font-bold text-neutral-800 truncate" title={item.name}>
                          {item.name}
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-neutral-400">
                          <span>{item.size || '1.2 MB'}</span>
                          {!item.isPrimary ? (
                            <button
                              type="button"
                              onClick={() => handleSetPrimary(item.id)}
                              className="px-2 py-0.5 rounded bg-white hover:bg-neutral-200 border border-neutral-300 text-neutral-700 font-bold hover:text-neutral-900 transition-colors cursor-pointer"
                            >
                              대표 지정
                            </button>
                          ) : (
                            <span className="text-[#E60012] font-bold">대표</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 외부 URL 직접 입력 (선택사항) */}
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3">
              <span className="font-bold text-neutral-800 block text-xs">
                외부 미디어 URL 직접 등록 (선택)
              </span>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={manualUrlInput}
                  onChange={e => setManualUrlInput(e.target.value)}
                  placeholder="이미지 또는 동영상 URL 직접 입력 (예: https://.../screenshot.png)"
                  className="flex-1 px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs text-neutral-900 focus:border-neutral-900 outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddManualUrl}
                  disabled={mediaItems.length >= 10}
                  className="px-3.5 py-2 bg-neutral-900 disabled:bg-neutral-300 text-white rounded-lg font-semibold hover:bg-black cursor-pointer shrink-0"
                >
                  URL 추가
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-neutral-200/80">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1 text-[11px]">
                    유튜브 / 사내 스트리밍 영상 링크
                  </label>
                  <input
                    type="text"
                    value={demoVideoUrl}
                    onChange={e => setDemoVideoUrl(e.target.value)}
                    placeholder="선택: https://youtube.com/watch?v=..."
                    className="w-full px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs text-neutral-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1 text-[11px]">
                    데모 애니메이션 GIF 링크
                  </label>
                  <input
                    type="text"
                    value={demoGifUrl}
                    onChange={e => setDemoGifUrl(e.target.value)}
                    placeholder="선택: https://.../demo.gif"
                    className="w-full px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs text-neutral-900 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Custom AI 접속 정보 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-neutral-200 pb-2">
              <span className="w-2 h-2 rounded-full bg-[#E60012]" />
              <h3 className="text-sm font-bold text-neutral-900">4. Custom AI 접속 정보</h3>
              <span className="text-[11px] text-neutral-400">서비스 접속 방식 및 실행 링크</span>
            </div>

            {/* 보안 안내 배너 (Section 8 강조 사항) */}
            <div className="p-3.5 bg-neutral-100 rounded-xl border border-neutral-200 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-neutral-600 shrink-0 mt-0.5" />
              <div className="text-[11px] text-neutral-700 leading-relaxed">
                <strong>보안 주의 안내:</strong> Community 카드에는 민감한 내부 IP, Secret 키, 관리자 API Endpoint를 직접 노출하지 않습니다. 직원은 권한에 따라 승인된 서비스 URL 또는 Prototype 화면을 통해 안전하게 접근합니다.
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-neutral-800 mb-1.5">
                  서비스 접속 방식 <span className="text-red-500">*</span>
                </label>
                <select
                  value={accessType}
                  onChange={e => setAccessType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-neutral-50 focus:bg-white border border-neutral-200 rounded-lg text-xs text-neutral-900 outline-none"
                >
                  {ACCESS_TYPE_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-neutral-800 mb-1.5">
                  서비스 URL (실행 주소) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={serviceUrl}
                  onChange={e => setServiceUrl(e.target.value)}
                  placeholder="예: https://custom-ai.kpc.or.kr/service"
                  className="w-full px-3 py-2 bg-neutral-50 focus:bg-white border border-neutral-200 rounded-lg text-xs text-neutral-900 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-neutral-800 mb-1.5">
                  Prototype URL (Figma 또는 시제품 링크)
                </label>
                <input
                  type="text"
                  value={prototypeUrl}
                  onChange={e => setPrototypeUrl(e.target.value)}
                  placeholder="선택 입력: https://figma.com/proto/..."
                  className="w-full px-3 py-2 bg-neutral-50 focus:bg-white border border-neutral-200 rounded-lg text-xs text-neutral-900 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-800 mb-1.5">
                  API Endpoint (연동 개발용)
                </label>
                <input
                  type="text"
                  value={apiEndpoint}
                  onChange={e => setApiEndpoint(e.target.value)}
                  placeholder="선택 입력: https://api.kpc.or.kr/..."
                  className="w-full px-3 py-2 bg-neutral-50 focus:bg-white border border-neutral-200 rounded-lg text-xs text-neutral-900 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Custom AI의 AI 구성 정보 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-neutral-200 pb-2">
              <span className="w-2 h-2 rounded-full bg-[#E60012]" />
              <h3 className="text-sm font-bold text-neutral-900">5. AI 구성 정보</h3>
              <span className="text-[11px] text-neutral-400">사용한 모델, 데이터 소스, 커넥터</span>
            </div>

            {/* 사용 AI 모델 */}
            <div>
              <label className="block font-bold text-neutral-800 mb-2">
                사용 AI 모델 (복수 선택 가능)
              </label>
              <div className="flex flex-wrap gap-2">
                {AI_MODEL_OPTIONS.map(model => (
                  <button
                    key={model}
                    type="button"
                    onClick={() => toggleModel(model)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                      selectedModels.includes(model)
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    {model}
                  </button>
                ))}
              </div>
            </div>

            {/* 사용하는 데이터 */}
            <div>
              <label className="block font-bold text-neutral-800 mb-2">
                사용하는 데이터 (지식 및 저장소)
              </label>
              <div className="flex flex-wrap gap-2">
                {DATA_SOURCE_OPTIONS.map(ds => (
                  <button
                    key={ds}
                    type="button"
                    onClick={() => toggleDataSource(ds)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                      selectedDataSources.includes(ds)
                        ? 'bg-[#E60012] text-white border-[#E60012]'
                        : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    {ds}
                  </button>
                ))}
              </div>
            </div>

            {/* 연결된 커넥터 */}
            <div>
              <label className="block font-bold text-neutral-800 mb-2">
                연결된 커넥터 (업무 시스템 & API 연동)
              </label>
              <div className="flex flex-wrap gap-2">
                {CONNECTOR_OPTIONS.map(conn => (
                  <button
                    key={conn}
                    type="button"
                    onClick={() => toggleConnector(conn)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                      selectedConnectors.includes(conn)
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    {conn}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 6: 활용 방법 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-neutral-200 pb-2">
              <span className="w-2 h-2 rounded-full bg-[#E60012]" />
              <h3 className="text-sm font-bold text-neutral-900">6. 활용 방법</h3>
              <span className="text-[11px] text-neutral-400">임직원이 서비스를 효과적으로 사용하는 단계별 가이드</span>
            </div>

            <textarea
              rows={3}
              value={howToUse}
              onChange={e => setHowToUse(e.target.value)}
              placeholder="예: 1. 파일 업로드 -> 2. AI 분석 실행 -> 3. 결과 다운로드"
              className="w-full px-3 py-2 bg-neutral-50 focus:bg-white border border-neutral-200 rounded-lg text-xs text-neutral-900 outline-none leading-relaxed"
            />
          </div>

          {/* Section 7: 담당 정보 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-neutral-200 pb-2">
              <span className="w-2 h-2 rounded-full bg-[#E60012]" />
              <h3 className="text-sm font-bold text-neutral-900">7. 담당 정보</h3>
              <span className="text-[11px] text-neutral-400">등록자, 공동 개발자, 운영 부서</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-neutral-50 rounded-xl border border-neutral-200/80">
              <div>
                <span className="text-neutral-400 block text-[11px] mb-1">등록자</span>
                <span className="font-bold text-neutral-900">{currentUserName}</span>
              </div>
              <div>
                <span className="text-neutral-400 block text-[11px] mb-1">부서</span>
                <span className="font-bold text-neutral-900">AI전략팀</span>
              </div>
              <div>
                <span className="text-neutral-400 block text-[11px] mb-1">등록일</span>
                <span className="font-bold text-neutral-900">2026.09.17</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-neutral-800 mb-1.5">
                  운영 담당 부서
                </label>
                <input
                  type="text"
                  value={operatorDept}
                  onChange={e => setOperatorDept(e.target.value)}
                  placeholder="예: 컨설팅본부 / AI전략팀"
                  className="w-full px-3 py-2 bg-neutral-50 focus:bg-white border border-neutral-200 rounded-lg text-xs text-neutral-900 outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-800 mb-1.5">
                  주 담당자명
                </label>
                <input
                  type="text"
                  value={maintainerName}
                  onChange={e => setMaintainerName(e.target.value)}
                  placeholder="예: 정소담 (AI전략팀)"
                  className="w-full px-3 py-2 bg-neutral-50 focus:bg-white border border-neutral-200 rounded-lg text-xs text-neutral-900 outline-none"
                />
              </div>
            </div>

            {/* 공동 개발자 추가 */}
            <div>
              <label className="block font-bold text-neutral-800 mb-1.5">
                공동 개발자
              </label>
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  value={newCoAuthor}
                  onChange={e => setNewCoAuthor(e.target.value)}
                  placeholder="이름 (부서) 입력 후 추가"
                  className="flex-1 px-3 py-2 bg-neutral-50 focus:bg-white border border-neutral-200 rounded-lg text-xs text-neutral-900 outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddCoAuthor}
                  className="px-3.5 py-2 bg-neutral-900 text-white rounded-lg font-semibold hover:bg-black cursor-pointer"
                >
                  + 공동 개발자 추가
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {coAuthors.map((ca, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-medium"
                  >
                    <span>{ca}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCoAuthor(idx)}
                      className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

        </form>

        {/* Footer */}
        <div className="px-6 py-4 sm:px-8 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-700 text-xs font-bold cursor-pointer transition-colors"
          >
            취소
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#E60012] hover:bg-[#CC0010] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isEditing ? '서비스 정보 수정 저장' : 'Community에 게시'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
