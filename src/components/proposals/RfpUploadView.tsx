import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  Trash2, 
  Eye, 
  ArrowRight, 
  Building, 
  Sparkles, 
  AlertCircle, 
  Clock, 
  Plus, 
  Info, 
  ChevronDown,
  ChevronUp,
  FolderPlus,
  Lock,
  RefreshCw,
  AlertTriangle,
  Check,
  Calendar,
  DollarSign,
  ListChecks,
  HelpCircle,
  FileEdit,
  Edit2,
  Users
} from 'lucide-react';
import { ProposalProject, DocumentItem, ProjectType, RfpAnalysisStatus, ProposalWorkflowType, UserRole } from '../../types';
import { DocumentPreviewModal } from './DocumentPreviewModal';
import { WORKFLOW_OPTIONS, WorkflowOption } from './NewProjectModal';

export type ProposalFileCategory = 'RFP 문서' | '참고자료';

export interface UploadedProposalFile {
  id: string;
  fileName: string;
  category: ProposalFileCategory;
  size: string;
  pages: number;
  uploader: string;
  uploadDate: string;
  status: '분석 완료' | '등록 완료' | '분석 준비 완료' | '업로드 완료';
  type: string;
}

export const SAMPLE_REFERENCE_MATERIALS: UploadedProposalFile[] = [
  {
    id: 'f-ref-001',
    fileName: 'KPC_회사소개서_2026.pdf',
    category: '참고자료',
    size: '5.2 MB',
    pages: 42,
    uploader: '정소담',
    uploadDate: '26.09.14',
    status: '등록 완료',
    type: 'PDF'
  },
  {
    id: 'f-ref-002',
    fileName: 'KPC_공공기관_생성형AI_구축_수행실적증명원.pdf',
    category: '참고자료',
    size: '4.5 MB',
    pages: 28,
    uploader: '정소담',
    uploadDate: '26.09.14',
    status: '등록 완료',
    type: 'PDF'
  },
  {
    id: 'f-ref-003',
    fileName: 'KPC_클라우드_보안인증_CSAP_및_ISMS-P_인증서.pdf',
    category: '참고자료',
    size: '3.1 MB',
    pages: 16,
    uploader: '김민수',
    uploadDate: '26.09.14',
    status: '등록 완료',
    type: 'PDF'
  },
  {
    id: 'f-ref-004',
    fileName: '생성형AI_기술아키텍처_및_망연계_표준가이드.docx',
    category: '참고자료',
    size: '4.2 MB',
    pages: 35,
    uploader: '박성훈',
    uploadDate: '26.09.14',
    status: '등록 완료',
    type: 'DOCX'
  },
  {
    id: 'f-ref-005',
    fileName: 'KPC_표준_프로젝트수행방법론_산출물양식집.pptx',
    category: '참고자료',
    size: '8.8 MB',
    pages: 54,
    uploader: '이서연',
    uploadDate: '26.09.14',
    status: '등록 완료',
    type: 'PPTX'
  },
  {
    id: 'f-ref-006',
    fileName: '핵심투입인력_이력사항_및_경력증명서철.pdf',
    category: '참고자료',
    size: '6.0 MB',
    pages: 32,
    uploader: '정소담',
    uploadDate: '26.09.14',
    status: '등록 완료',
    type: 'PDF'
  },
  {
    id: 'f-ref-007',
    fileName: '공공기관_생성형AI_도입_우수사례집_2026.pdf',
    category: '참고자료',
    size: '11.4 MB',
    pages: 48,
    uploader: '최지호',
    uploadDate: '26.09.14',
    status: '등록 완료',
    type: 'PDF'
  }
];

export const INITIAL_PROJECT_FILES: UploadedProposalFile[] = [
  {
    id: 'f-001',
    fileName: 'KPC_AI플랫폼_RFP.pdf',
    category: 'RFP 문서',
    size: '8.4 MB',
    pages: 86,
    uploader: '정소담',
    uploadDate: '26.09.14',
    status: '등록 완료',
    type: 'PDF'
  },
  ...SAMPLE_REFERENCE_MATERIALS
];

interface RfpUploadViewProps {
  activeProject?: ProposalProject | null;
  onUpdateProject?: (updated: ProposalProject) => void;
  fileList?: UploadedProposalFile[];
  onFilesChange?: (files: UploadedProposalFile[]) => void;
  onNavigateToProjects?: () => void;
  onNavigateToProjectRoot?: () => void;
  onStartAnalysis?: () => void;
  onAnalysisComplete?: () => void;
  onShowToast: (msg: string) => void;
  userRole?: UserRole;
  onNavigateToSettings?: () => void;
}

export const RfpUploadView: React.FC<RfpUploadViewProps> = ({
  activeProject,
  onUpdateProject,
  fileList: propFileList,
  onFilesChange,
  onNavigateToProjects,
  onNavigateToProjectRoot,
  onStartAnalysis,
  onAnalysisComplete,
  onShowToast,
  userRole = 'admin',
  onNavigateToSettings
}) => {
  const [internalFileList, setInternalFileList] = useState<UploadedProposalFile[]>(propFileList || INITIAL_PROJECT_FILES);

  // Sync internal state if prop changes
  useEffect(() => {
    if (propFileList) {
      setInternalFileList(propFileList);
    }
  }, [propFileList]);

  const fileList = propFileList || internalFileList;

  const updateFiles = (updater: (prev: UploadedProposalFile[]) => UploadedProposalFile[]) => {
    const updated = updater(fileList);
    setInternalFileList(updated);
    if (onFilesChange) {
      onFilesChange(updated);
    }
  };

  const [activeCategoryTab, setActiveCategoryTab] = useState<'전체' | ProposalFileCategory>('전체');
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState<number>(0);
  const [analysisStageText, setAnalysisStageText] = useState<string>('');
  const [previewFile, setPreviewFile] = useState<DocumentItem | null>(null);

  // Workflow section accordion: Open when first starting proposal work (before analysis is completed), collapsed afterwards
  const [isWorkflowExpanded, setIsWorkflowExpanded] = useState<boolean>(() => {
    return activeProject?.analysisStatus !== '분석 완료';
  });

  // Inline Project Title Editing
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitleValue, setEditTitleValue] = useState(activeProject?.title || '2026 KPC AI 플랫폼 구축 사업');

  useEffect(() => {
    if (activeProject?.title) {
      setEditTitleValue(activeProject.title);
    }
  }, [activeProject?.title]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const rfpFiles = fileList.filter(f => f.category === 'RFP 문서');
  const rfpFilesCount = rfpFiles.length;
  const refFilesCount = fileList.filter(f => f.category === '참고자료').length;

  // Determine current project analysis status and workflow
  const currentStatus: RfpAnalysisStatus = activeProject?.analysisStatus || (rfpFilesCount > 0 ? '등록 완료' : 'RFP 미등록');
  const currentWorkflow: ProposalWorkflowType = activeProject?.workflowType || (activeProject?.creationMethod as any) || 'requirements';
  const currentWorkflowObj = WORKFLOW_OPTIONS.find(w => w.id === currentWorkflow) || WORKFLOW_OPTIONS[0];

  const filteredFiles = fileList.filter(f => 
    activeCategoryTab === '전체' || f.category === activeCategoryTab
  );

  // Helper to update project analysis status
  const setProjectAnalysisStatus = (newStatus: RfpAnalysisStatus, progress: number = 0) => {
    if (activeProject && onUpdateProject) {
      onUpdateProject({
        ...activeProject,
        analysisStatus: newStatus,
        analysisProgress: progress
      });
    }
  };

  // Helper to change proposal workflow
  const handleSelectWorkflow = (workflow: ProposalWorkflowType) => {
    if (userRole !== 'admin') {
      onShowToast('제안서 작성 방식은 프로젝트 관리자만 변경할 수 있습니다.');
      return;
    }
    if (activeProject && onUpdateProject) {
      const selected = WORKFLOW_OPTIONS.find(w => w.id === workflow);
      onUpdateProject({
        ...activeProject,
        workflowType: workflow,
        creationMethod: workflow
      });
      onShowToast(`제안서 작성 방식이 [${selected?.title || workflow}](으)로 설정되었습니다.`);
      // Automatically collapse section after selection
      setIsWorkflowExpanded(false);
    }
  };

  const handleSaveTitle = () => {
    if (userRole !== 'admin') {
      onShowToast('프로젝트명은 프로젝트 관리자만 변경할 수 있습니다.');
      return;
    }
    if (!editTitleValue.trim()) {
      onShowToast('프로젝트명을 입력해 주세요.');
      return;
    }
    if (activeProject && onUpdateProject) {
      onUpdateProject({
        ...activeProject,
        title: editTitleValue.trim()
      });
      setIsEditingTitle(false);
      onShowToast('프로젝트명이 변경되었습니다.');
    }
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const newUploadedFiles: UploadedProposalFile[] = [];

    // 일반 사용자는 오직 '참고자료'만 등록 가능, 관리자는 탭 설정에 따라 등록
    const defaultCategory: ProposalFileCategory = 
      userRole !== 'admin'
        ? '참고자료'
        : (activeCategoryTab === '참고자료' ? '참고자료' : 'RFP 문서');

    const MAX_SIZE_BYTES = 2 * 1024 * 1024 * 1024; // 2GB

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      if (file.size > MAX_SIZE_BYTES) {
        onShowToast(`'${file.name}' 파일이 최대 허용 용량(2GB)을 초과하여 제외되었습니다.`);
        continue;
      }

      const newFile: UploadedProposalFile = {
        id: `f-${Date.now()}-${i}`,
        fileName: file.name,
        category: defaultCategory,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        pages: Math.min(500, Math.floor(Math.random() * 30) + 12),
        uploader: userRole === 'admin' ? (activeProject?.manager || '김민수 (PM)') : '정소담 (팀원)',
        uploadDate: new Date().toISOString().slice(0, 10).replace(/-/g, '.'),
        status: '등록 완료',
        type: file.name.split('.').pop()?.toUpperCase() || 'PDF'
      };
      newUploadedFiles.push(newFile);
    }

    if (newUploadedFiles.length === 0) return;

    const updatedList = [...newUploadedFiles, ...fileList];
    updateFiles(() => updatedList);

    // CRITICAL: Uploading does NOT run analysis!
    // Set to '등록 완료' if previously 'RFP 미등록'
    const hasRfpNow = updatedList.some(f => f.category === 'RFP 문서');
    if (hasRfpNow && (!activeProject?.analysisStatus || activeProject.analysisStatus === 'RFP 미등록')) {
      setProjectAnalysisStatus('등록 완료', 0);
    }

    if (userRole !== 'admin') {
      if (newUploadedFiles.length === 1) {
        onShowToast(`'${newUploadedFiles[0].fileName}' 참고자료 문서가 성공적으로 등록되었습니다.`);
      } else {
        onShowToast(`총 ${newUploadedFiles.length}건의 참고자료 문서가 성공적으로 등록되었습니다.`);
      }
    } else {
      if (newUploadedFiles.length === 1) {
        onShowToast(`'${newUploadedFiles[0].fileName}' 파일이 업로드되었습니다. [RFP 분석 시작] 버튼을 눌러 AI 분석을 실행하세요.`);
      } else {
        onShowToast(`총 ${newUploadedFiles.length}개의 파일이 업로드되었습니다. [RFP 분석 시작] 버튼을 눌러주세요.`);
      }
    }
  };

  const handleCategoryChange = (fileId: string, newCategory: ProposalFileCategory) => {
    if (userRole !== 'admin') {
      onShowToast('문서 구분 변경은 프로젝트 관리자만 가능합니다.');
      return;
    }
    const updated = fileList.map(f => {
      if (f.id === fileId) {
        return {
          ...f,
          category: newCategory,
          status: f.status === '분석 완료' ? '분석 완료' : '등록 완료'
        };
      }
      return f;
    });

    updateFiles(() => updated);

    // If no RFP documents left, change to 'RFP 미등록'
    const hasRfp = updated.some(f => f.category === 'RFP 문서');
    if (!hasRfp && activeProject?.analysisStatus !== 'RFP 미등록') {
      setProjectAnalysisStatus('RFP 미등록', 0);
    } else if (hasRfp && activeProject?.analysisStatus === 'RFP 미등록') {
      setProjectAnalysisStatus('등록 완료', 0);
    }

    const target = fileList.find(f => f.id === fileId);
    onShowToast(`'${target?.fileName || '문서'}'의 구분이 [${newCategory}](으)로 변경되었습니다.`);
  };

  const handleDeleteFile = (id: string, name: string) => {
    if (userRole !== 'admin') {
      onShowToast('문서 삭제는 프로젝트 관리자만 가능합니다.');
      return;
    }
    const updated = fileList.filter(f => f.id !== id);
    updateFiles(() => updated);

    const hasRfp = updated.some(f => f.category === 'RFP 문서');
    if (!hasRfp) {
      setProjectAnalysisStatus('RFP 미등록', 0);
    }

    onShowToast(`'${name}' 파일이 삭제되었습니다.`);
  };

  // Trigger analysis explicitly when user clicks [RFP 분석 시작]
  const handleRunAnalysis = () => {
    if (userRole !== 'admin') {
      onShowToast('RFP 심층 분석은 프로젝트 관리자만 시작할 수 있습니다.');
      return;
    }
    if (rfpFilesCount === 0) {
      onShowToast('RFP 문서가 최소 1건 이상 등록되어 있어야 분석을 시작할 수 있습니다.');
      return;
    }

    setIsWorkflowExpanded(false);
    setIsAnalyzing(true);
    setAnalysisProgress(12);
    setAnalysisStageText('RFP 텍스트 추출 및 표/도표 정밀 구조화 중...');
    setProjectAnalysisStatus('분석 중', 12);
    onShowToast('RFP 심층 분석을 시작합니다. 요구사항과 제안 전략을 도출합니다.');

    // Multi-phase progress simulation
    setTimeout(() => {
      setAnalysisProgress(45);
      setAnalysisStageText('발주처 필수 요구사항(SFR), 평가 배점 및 준수 조건 식별 중...');
      setProjectAnalysisStatus('분석 중', 45);
    }, 700);

    setTimeout(() => {
      setAnalysisProgress(78);
      setAnalysisStageText('KPC 차별화 Win-Theme 및 전략적 제안 방향 도출 중...');
      setProjectAnalysisStatus('분석 중', 78);
    }, 1500);

    setTimeout(() => {
      setAnalysisProgress(100);
      setAnalysisStageText('RFP 분석 완료!');
      setIsAnalyzing(false);

      // Mark all RFP files as '분석 완료'
      updateFiles(prev => prev.map(f => f.category === 'RFP 문서' ? { ...f, status: '분석 완료' } : f));
      setProjectAnalysisStatus('분석 완료', 100);

      onShowToast('RFP 분석이 완료되었습니다! 2~5단계 기능이 모두 활성화되었습니다.');

      if (onAnalysisComplete) {
        onAnalysisComplete();
      } else if (onStartAnalysis) {
        onStartAnalysis();
      }
    }, 2200);
  };

  const handleOpenPreview = (file: UploadedProposalFile) => {
    let previewContent: DocumentItem['previewContent'] = {
      summary: `${file.fileName} 문서의 주요 내용 요약 및 분석 데이터입니다. 한국생산성본부 맞춤형 제안서 작성에 즉시 인용될 수 있도록 임베딩 색인이 완료되었습니다.`,
      keyHighlights: [
        'Enterprise LLM 보안 무보존(ZDR) 적용 요건 수록',
        'Microsoft Entra ID 기반 SSO 및 사내 시스템 MCP/REST 연계 명세',
        'RAG 기반 행정 지식베이스 및 Multi-LLM 지능형 라우팅 구조 정의'
      ],
      sampleText: `[원문 발췌문 - ${file.fileName}]\n본 문서는 KPC 생성형 AI 플랫폼 구축을 위한 핵심 제안요청서 및 기술 규격서로서, 발주사의 요구조건 및 평가항목, 프로젝트 추진 일정과 보안 가이드라인을 상세히 규정하고 있습니다.`,
      toc: ['1. 사업 개요', '2. 현황 및 문제점', '3. 제안요청 내용', '4. 제안서 작성요령', '5. 제안 안내사항'],
      metadata: {
        '페이지수': `${file.pages} 페이지`,
        '등록구분': file.category,
        '등록자': file.uploader,
        '분석상태': file.status
      }
    };

    const fName = file.fileName || '';
    if (fName.includes('회사소개서')) {
      previewContent = {
        summary: '한국생산성본부(KPC) 2026년도 공식 회사소개서입니다. 경영현황, 공공 IT/컨설팅 수행 조직체계, 신용평가등급(AAA), 기술인력 보유현황 및 주요 재무 건전성 지표가 수록되어 있습니다.',
        keyHighlights: [
          '신용평가등급: AAA (나이스신용평가 기준 최우수 판정)',
          'AI 및 IT 전문 인력: 280여 명 보유 및 수주지원 전담조직 운영',
          '공공기관 생산성 혁신 컨설팅 및 SI 수행 60년 업력'
        ],
        sampleText: `[발췌문: KPC 2026 회사소개서 제2장 일반현황]\n한국생산성본부는 공공과 민간의 지능정보화와 디지털 생산성 향상을 견인해 온 전문기관으로서, 본 제안 사업의 성공적인 완수를 위해 사내 최고의 생성형 AI 전문 아키텍트와 프로젝트 관리 전문가로 구성된 드림팀을 투입합니다.`,
        toc: ['1. 기관 소개 및 비전', '2. 일반현황 및 연혁', '3. 조직 및 인력 구성', '4. 재무상태 및 신용평가등급', '5. 주요 사업영역 및 역량'],
        metadata: {
          '페이지수': `${file.pages} 페이지`,
          '등록구분': '참고자료 (회사소개서)',
          '등록자': file.uploader,
          '분석상태': file.status
        }
      };
    } else if (fName.includes('실적')) {
      previewContent = {
        summary: '최근 3개년(2023~2025) 행정안전부, 한국지능정보사회진흥원(NIA), 조달청 등 공공기관 및 준정부기관 대상 생성형 AI, LLM 인프라 및 RAG 지식관리 구축 사업 실적증명서 원본 철입니다.',
        keyHighlights: [
          '누적 실적 18건 (총 사업규모 240억 원 이상 준공)',
          '행안부 공공AI 어시스턴트 시범구축 우수사례 선정',
          '모든 실적 발주처 직인 날인 완료된 적격 증명원 보유'
        ],
        sampleText: `[실적증명서 발췌 - 실적번호 2025-AI-014]\n- 사업명: 차세대 지능형 행정업무지원 생성형 AI 시범플랫폼 구축\n- 발주처: 한국지능정보사회진흥원\n- 계약금액: 금 1,850,000,000원\n- 이행기간: 2025.04.01 ~ 2025.12.15\n- 이행내용: 온프레미스 sLLM 도입, 내부 규정 1,500만 건 RAG 구축, ZDR 보안체계 구축 완료`,
        toc: ['1. 주요 사업실적 총괄표', '2. 실적증명서 원본 사본 (1호~18호)', '3. 유사사업 인정범위 비교 검토서'],
        metadata: {
          '페이지수': `${file.pages} 페이지`,
          '등록구분': '참고자료 (수행실적증명원)',
          '등록자': file.uploader,
          '분석상태': file.status
        }
      };
    }

    const docItem: DocumentItem = {
      id: file.id,
      fileName: file.fileName,
      type: file.type as any,
      size: file.size,
      uploader: file.uploader,
      updatedAt: file.uploadDate,
      status: file.status,
      isRfp: file.category === 'RFP 문서',
      previewContent
    };
    setPreviewFile(docItem);
  };

  const isRfpReady = rfpFilesCount > 0;

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[#F8F9FA] p-6 pb-24">
      <div className="max-w-7xl mx-auto w-full space-y-6">
        
        {/* 1. Breadcrumb & Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-200 gap-3">
          <div>
            <div className="flex items-center gap-2 text-xs text-neutral-500 font-semibold mb-1">
              <button
                type="button"
                onClick={onNavigateToProjects}
                className="hover:text-[#E60012] hover:underline cursor-pointer transition-colors"
              >
                전체 프로젝트
              </button>
              <span className="text-neutral-400">&gt;</span>
              <button
                type="button"
                onClick={onNavigateToProjectRoot}
                className="text-[#111111] font-bold hover:text-[#E60012] hover:underline cursor-pointer transition-colors line-clamp-1 max-w-[280px]"
                title={activeProject?.title || '2026 KPC AI 플랫폼 구축 사업'}
              >
                {activeProject?.title || '2026 KPC AI 플랫폼 구축 사업'}
              </button>
              <span className="text-neutral-400">&gt;</span>
              <span className="text-[#E60012] font-black">
                {userRole === 'admin' ? '01 문서 업로드' : '01 참고문서 등록'}
              </span>
            </div>
            <h1 className="text-2xl font-black text-[#111111] tracking-tight">
              {userRole === 'admin' ? '문서 업로드' : '참고문서 등록'}
            </h1>
          </div>

          {/* Analysis Status Badge */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-500 font-semibold">분석 상태:</span>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
              currentStatus === '분석 완료'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : currentStatus === '분석 중'
                ? 'bg-blue-50 text-blue-700 border-blue-200 animate-pulse'
                : currentStatus === '등록 완료'
                ? 'bg-blue-50 text-blue-800 border-blue-200'
                : currentStatus === '분석 실패'
                ? 'bg-red-50 text-[#E60012] border-red-200'
                : 'bg-neutral-100 text-neutral-600 border-neutral-200'
            }`}>
              {currentStatus === '분석 완료' ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              ) : currentStatus === '분석 중' ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
              ) : currentStatus === '분석 실패' ? (
                <AlertTriangle className="w-3.5 h-3.5 text-[#E60012]" />
              ) : (
                <Info className="w-3.5 h-3.5 text-neutral-500" />
              )}
              <span>{currentStatus}</span>
            </span>
          </div>
        </div>

        {/* 2. [Step 1-1] 프로젝트명 및 기본 정보 설정 (관리자 전용) */}
        {userRole === 'admin' && (
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#111111] text-white flex items-center justify-center text-xs font-black">
                  1
                </span>
                <h2 className="text-base font-black text-[#111111]">
                  프로젝트명 설정
                </h2>
              </div>
              <span className="text-[11px] text-neutral-400">
                * 상단 프로젝트명 입력 필드
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {isEditingTitle ? (
                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="text"
                    value={editTitleValue}
                    onChange={e => setEditTitleValue(e.target.value)}
                    placeholder="예: 2026 KPC AI 플랫폼 구축 사업"
                    className="flex-1 px-3.5 py-2 rounded-lg border border-neutral-300 text-sm font-bold text-[#111111] focus:outline-none focus:border-[#E60012] focus:ring-2 focus:ring-[#E60012]/10"
                  />
                  <button
                    onClick={handleSaveTitle}
                    className="px-4 py-2 rounded-lg bg-[#E60012] text-white text-xs font-bold hover:bg-[#CC0010] cursor-pointer shadow-2xs"
                  >
                    저장
                  </button>
                  <button
                    onClick={() => {
                      setEditTitleValue(activeProject?.title || '');
                      setIsEditingTitle(false);
                    }}
                    className="px-3 py-2 rounded-lg border border-neutral-300 text-neutral-600 text-xs font-medium hover:bg-neutral-50 cursor-pointer"
                  >
                    취소
                  </button>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-between bg-neutral-50/80 px-4 py-3 rounded-xl border border-neutral-200">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-[#111111]">
                      {activeProject?.title || '2026 KPC AI 플랫폼 구축 사업'}
                    </span>
                    <button
                      onClick={() => setIsEditingTitle(true)}
                      className="p-1 text-neutral-400 hover:text-neutral-800 transition-colors cursor-pointer"
                      title="프로젝트명 수정 (관리자 전용)"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-neutral-500">
                    <span className="flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-neutral-400" />
                      {activeProject?.agency || '한국생산성본부'}
                    </span>
                    <span className="text-neutral-300">|</span>
                    <span className="flex items-center gap-1">
                      마감: {activeProject?.deadline || '2026.11.30'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. [Step 1-2] 제안서 작성 방식 설정 (관리자 전용 - Collapsible Section) */}
        {userRole === 'admin' && (
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden transition-all">
            {/* Header & Toggle Bar */}
            <div 
              onClick={() => setIsWorkflowExpanded(!isWorkflowExpanded)}
              className="p-5 flex items-center justify-between cursor-pointer hover:bg-neutral-50/70 transition-colors select-none"
            >
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-[#111111] text-white flex items-center justify-center text-xs font-black">
                  2
                </span>
                <h2 className="text-base font-black text-[#111111] flex items-center gap-2">
                  <span>제안서 작성 방식 설정</span>
                </h2>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="hidden sm:flex items-center px-3 py-1 rounded-full bg-red-50/80 border border-red-200 text-xs font-bold text-[#E60012]">
                  <span>{currentWorkflowObj.title}</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsWorkflowExpanded(!isWorkflowExpanded);
                  }}
                  className="px-3.5 py-1.5 rounded-lg border border-neutral-300 hover:bg-white text-neutral-800 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                >
                  {isWorkflowExpanded ? '설정 닫기' : '방식 변경'}
                </button>
              </div>
            </div>

            {/* Collapsible Content */}
            {isWorkflowExpanded ? (
              <div className="px-5 pb-5 pt-1 border-t border-neutral-100 space-y-3.5 animate-in fade-in duration-150">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  {WORKFLOW_OPTIONS.map(opt => {
                    const isSelected = currentWorkflow === opt.id;
                    return (
                      <div
                        key={opt.id}
                        id={`view-workflow-${opt.id}`}
                        onClick={() => handleSelectWorkflow(opt.id)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between relative ${
                          isSelected
                            ? 'border-[#E60012] bg-red-50/20 shadow-xs ring-1 ring-[#E60012]/20'
                            : 'border-neutral-200 hover:border-neutral-300 bg-white hover:bg-neutral-50/50'
                        }`}
                      >
                        <div>
                          {/* Top Row: Icon + Radio */}
                          <div className="flex items-start justify-between gap-2 mb-2.5">
                            <div className="flex items-center gap-2">
                              {opt.icon}
                              <span className="text-xs font-black text-[#111111]">
                                {opt.title}
                              </span>
                            </div>
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                              isSelected
                                ? 'bg-[#E60012] text-white border-2 border-[#E60012]'
                                : 'border-2 border-neutral-300 bg-white'
                            }`}>
                              {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </div>
                          </div>

                          <div className="text-[10px] text-neutral-400 font-mono mb-2">
                            {opt.enTitle}
                          </div>

                          <p className="text-xs text-neutral-600 leading-relaxed">
                            {opt.desc}
                          </p>
                        </div>

                        {opt.badge && (
                          <div className="mt-3 pt-2 border-t border-neutral-100 flex justify-end">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-[#E60012] border border-red-200">
                              {opt.badge}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* Summary Bar when collapsed */
              <div 
                onClick={() => setIsWorkflowExpanded(true)}
                className="px-5 py-3.5 bg-neutral-50/70 border-t border-neutral-100 text-xs cursor-pointer hover:bg-neutral-100/70 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="font-black text-[#111111]">{currentWorkflowObj.title}</span>
                  <span className="text-[10px] text-neutral-400 font-mono hidden sm:inline">({currentWorkflowObj.enTitle})</span>
                  {currentWorkflowObj.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-[#E60012] border border-red-200">
                      {currentWorkflowObj.badge}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. [Step 1-3] RFP 문서 및 참고자료 업로드 (Common Drag & Drop) */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#111111] text-white flex items-center justify-center text-xs font-black">
                {userRole === 'admin' ? '3' : '1'}
              </span>
              <h2 className="text-base font-black text-[#111111]">
                {userRole === 'admin' ? 'RFP 및 참고 문서 등록' : '참고문서 등록'}
              </h2>
            </div>
            <div className="text-xs text-neutral-500 flex items-center gap-2">
              {userRole === 'admin' ? (
                <>
                  <span className="font-bold text-[#E60012]">RFP 문서: {rfpFilesCount}건</span>
                  <span className="text-neutral-300">|</span>
                  <span className="text-neutral-700">참고자료: {refFilesCount}건</span>
                </>
              ) : (
                <span className="font-bold text-neutral-800">등록된 참고자료: {refFilesCount}건</span>
              )}
            </div>
          </div>

          {/* Upload Dropzone (Both admin and general users can upload; general users upload reference documents) */}
          <div
            onDragOver={e => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={e => {
              e.preventDefault();
              setIsDragging(false);
              handleFileUpload(e.dataTransfer.files);
            }}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all bg-neutral-50/50 ${
              isDragging ? 'border-[#E60012] bg-[#E60012]/5' : 'border-neutral-300 hover:border-neutral-400'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.csv,.txt,.hwp,.hwpx"
              onChange={e => handleFileUpload(e.target.files)}
            />

            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xs ${
              userRole === 'admin' ? 'bg-red-50 text-[#E60012]' : 'bg-neutral-100 text-neutral-700'
            }`}>
              <Upload className="w-7 h-7" />
            </div>
            <h3 className="text-base font-black text-[#111111]">
              {userRole === 'admin'
                ? 'RFP(제안요청서) 및 제안 참고자료를 여기에 끌어다 놓으세요'
                : '제안 참고자료 문서를 여기에 끌어다 놓으세요'}
            </h3>
            <p className="text-xs text-neutral-500 mt-1 max-w-lg mx-auto">
              {userRole === 'admin'
                ? 'RFP 문서는 필수이며, 회사소개서나 유사 수행실적증명원 등 참고자료를 함께 업로드하면 AI가 더욱 정교한 수주 전략을 도출합니다.'
                : '회사소개서, 유사 수행실적증명원, CSAP 인증서, 기술 아키텍처 가이드 등 제안서 작성에 활용할 참고자료를 등록해 주세요. (RFP 문서는 프로젝트 관리자가 등록합니다)'}
            </p>

            <div className="flex items-center justify-center gap-3 mt-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-2.5 rounded-xl bg-[#111111] text-white text-xs font-bold hover:bg-neutral-800 shadow-xs hover:shadow transition-all flex items-center gap-2 cursor-pointer"
              >
                <Upload className={`w-4 h-4 ${userRole === 'admin' ? 'text-[#E60012]' : 'text-neutral-300'}`} />
                <span>{userRole === 'admin' ? '내 PC에서 파일 선택' : '내 PC에서 참고자료 선택'}</span>
              </button>
            </div>

            <div className="mt-5 pt-4 border-t border-neutral-200 flex flex-wrap items-center justify-center gap-4 text-[11px] text-neutral-500">
              <span className="font-semibold text-neutral-700">지원 포맷: PDF, DOC, DOCX, HWP, HWPX, PPT, PPTX</span>
              <span className="text-neutral-300">|</span>
              <span className="font-bold text-neutral-800">파일 제한: 최대 2GB, 500page</span>
            </div>
          </div>

          {/* Uploaded Documents Table */}
          <div className="border border-neutral-200 rounded-xl overflow-hidden">
            {/* Table Header Bar */}
            <div className="px-5 py-3 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-50">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveCategoryTab('전체')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeCategoryTab === '전체'
                      ? 'bg-[#111111] text-white shadow-2xs'
                      : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  전체 ({fileList.length})
                </button>
                <button
                  onClick={() => setActiveCategoryTab('RFP 문서')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeCategoryTab === 'RFP 문서'
                      ? 'bg-[#E60012] text-white shadow-2xs'
                      : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  RFP 문서 ({rfpFilesCount})
                </button>
                <button
                  onClick={() => setActiveCategoryTab('참고자료')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeCategoryTab === '참고자료'
                      ? 'bg-neutral-800 text-white shadow-2xs'
                      : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  참고자료 ({refFilesCount})
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
                <span>총 등록 문서: <strong className="text-neutral-900 font-bold">{fileList.length}</strong>건</span>
              </div>
            </div>

            {/* Table Body */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-700">
                <thead className="bg-neutral-100 text-neutral-700 text-[11px] font-bold uppercase tracking-wider border-b border-neutral-200">
                  <tr>
                    <th className="py-3 px-4">파일명</th>
                    <th className="py-3 px-3 w-36 text-center">문서 구분</th>
                    <th className="py-3 px-3 w-24">용량</th>
                    <th className="py-3 px-3 w-20 text-center">페이지</th>
                    <th className="py-3 px-3 w-28">업로드 사용자</th>
                    <th className="py-3 px-3 w-28 text-center">업로드 날짜</th>
                    <th className="py-3 px-3 w-28 text-center">상태</th>
                    <th className="py-3 px-4 w-28 text-center">작업</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {filteredFiles.map(file => (
                    <tr key={file.id} className="hover:bg-neutral-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#111111]">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${
                            file.category === 'RFP 문서'
                              ? 'bg-red-50 text-[#E60012]'
                              : 'bg-neutral-100 text-neutral-700'
                          }`}>
                            <FileText className="w-3.5 h-3.5" />
                          </div>
                          <span className="truncate max-w-sm" title={file.fileName}>
                            {file.fileName}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        {userRole === 'admin' ? (
                          <div className="relative inline-block">
                            <select
                              value={file.category}
                              onChange={e => handleCategoryChange(file.id, e.target.value as ProposalFileCategory)}
                              className={`appearance-none font-bold text-xs pl-3 pr-7 py-1 rounded-full border cursor-pointer transition-all outline-none focus:ring-2 focus:ring-neutral-400 ${
                                file.category === 'RFP 문서'
                                  ? 'bg-red-50 text-[#E60012] border-red-200 hover:bg-red-100'
                                  : 'bg-neutral-100 text-neutral-800 border-neutral-300 hover:bg-neutral-200'
                              }`}
                              title="문서 구분 변경"
                            >
                              <option value="RFP 문서">RFP 문서</option>
                              <option value="참고자료">참고자료</option>
                            </select>
                            <ChevronDown className={`w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none ${
                              file.category === 'RFP 문서' ? 'text-[#E60012]' : 'text-neutral-500'
                            }`} />
                          </div>
                        ) : (
                          <span className={`inline-block font-bold text-xs px-3 py-1 rounded-full border ${
                            file.category === 'RFP 문서'
                              ? 'bg-red-50 text-[#E60012] border-red-200'
                              : 'bg-neutral-100 text-neutral-800 border-neutral-300'
                          }`}>
                            {file.category}
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-3 text-neutral-600 font-medium">
                        {file.size}
                      </td>

                      <td className="py-3.5 px-3 text-center font-medium text-neutral-700">
                        {file.pages}p
                      </td>

                      <td className="py-3.5 px-3 font-medium text-neutral-700">
                        {file.uploader}
                      </td>

                      <td className="py-3.5 px-3 text-center text-neutral-500 font-mono">
                        {file.uploadDate}
                      </td>

                      <td className="py-3.5 px-3 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          file.status === '분석 완료'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : file.status === '등록 완료'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{file.status}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenPreview(file)}
                            className="p-1.5 rounded hover:bg-neutral-100 text-neutral-600 hover:text-[#111111] transition-colors cursor-pointer"
                            title="미리보기"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          {userRole === 'admin' && (
                            <button
                              onClick={() => handleDeleteFile(file.id, file.fileName)}
                              className="p-1.5 rounded hover:bg-red-50 text-neutral-400 hover:text-[#E60012] transition-colors cursor-pointer"
                              title="삭제"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredFiles.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-10 text-center text-neutral-400 text-xs">
                        등록된 파일이 없습니다. 상단에서 파일을 업로드해 주세요.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 5. Progress Card when Analyzing */}
        {isAnalyzing && (
          <div className="bg-white rounded-2xl border-2 border-red-300 shadow-md p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <RefreshCw className="w-5 h-5 animate-spin text-[#E60012]" />
                <span className="text-sm font-black text-[#111111]">
                  RFP 핵심 요구사항 및 제안 전략을 심층 분석하고 있습니다...
                </span>
              </div>
              <span className="text-sm font-mono font-black text-[#E60012]">{analysisProgress}%</span>
            </div>

            <div className="w-full bg-neutral-100 rounded-full h-3 overflow-hidden mb-2.5">
              <div 
                className="bg-[#E60012] h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${analysisProgress}%` }}
              />
            </div>

            <p className="text-xs font-semibold text-neutral-600 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#E60012]" />
              <span>{analysisStageText}</span>
            </p>
          </div>
        )}

        {/* 6. 하단 고정/강조 [ RFP 분석 시작 ] 메인 액션 패널 */}
        <div className="bg-white rounded-2xl border-2 border-neutral-200 shadow-md p-6 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-start gap-3.5">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              isRfpReady ? 'bg-red-50 text-[#E60012]' : 'bg-neutral-100 text-neutral-400'
            }`}>
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-[#111111]">
                  RFP 심층 분석 실행
                </h3>
                {isRfpReady && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    분석 준비 완료
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-500 mt-1 max-w-xl">
                {userRole !== 'admin'
                  ? '참고자료를 자유롭게 등록하실 수 있습니다. 첫 문서 업로드 및 AI 분석 시작은 프로젝트 관리자(Admin) 권한으로 실행됩니다.'
                  : isRfpReady
                  ? '프로젝트 기본 정보 설정 및 RFP 문서 등록이 완료되었습니다. 아래 버튼을 눌러 AI 심층 분석을 시작하세요.'
                  : 'RFP 문서가 최소 1건 이상 등록되어야 분석을 시작할 수 있습니다. 상단에서 RFP 문서를 등록해 주세요.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            {userRole !== 'admin' ? (
              <div className="flex flex-col sm:flex-row items-center gap-2.5">
                {currentStatus === '분석 완료' ? (
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>RFP 분석 완료 ({activeProject?.teamInvited ? '팀원 분석 열람 가능' : '관리자 팀원 초대 대기 중'})</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-600 text-xs font-bold">
                    <Lock className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <span>AI 분석 시작 대기 (관리자 전용)</span>
                  </div>
                )}
                {onNavigateToSettings && (
                  <button
                    onClick={onNavigateToSettings}
                    className="px-4 py-2.5 rounded-xl border border-neutral-300 hover:bg-neutral-50 text-neutral-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>프로젝트 참여 팀원 확인</span>
                  </button>
                )}
              </div>
            ) : currentStatus === '분석 완료' ? (
              <div className="flex flex-wrap items-center gap-2.5 justify-end">
                {!activeProject?.teamInvited ? (
                  <button
                    onClick={() => {
                      if (activeProject && onUpdateProject) {
                        onUpdateProject({ ...activeProject, teamInvited: true });
                        onShowToast('🎉 팀원 초대가 완료되었습니다. 이제 일반 팀원들이 제안서 작성에 참여할 수 있습니다.');
                      } else if (onNavigateToSettings) {
                        onNavigateToSettings();
                      }
                    }}
                    className="px-5 py-3 rounded-xl bg-[#111111] hover:bg-neutral-800 text-white text-xs font-black shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer"
                    title="프로젝트 설정에서 팀원을 초대하고 제안서 작성을 오픈합니다"
                  >
                    <Users className="w-3.5 h-3.5 text-[#E60012]" />
                    <span>팀원 전체 초대하고 제안서 작성 오픈하기</span>
                  </button>
                ) : (
                  <button
                    onClick={onNavigateToSettings}
                    className="px-4 py-2.5 rounded-xl border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
                    title="프로젝트 설정에서 팀원 및 권한 관리"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>팀원 초대 완료 (설정 관리)</span>
                  </button>
                )}
                <button
                  id="bottom-re-analysis-btn"
                  onClick={handleRunAnalysis}
                  disabled={isAnalyzing || !isRfpReady}
                  className="px-5 py-3 rounded-xl bg-neutral-100 text-neutral-800 hover:bg-neutral-200 text-xs font-bold shadow-2xs transition-all flex items-center gap-2 cursor-pointer"
                  title="RFP 문서를 재분석합니다"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                  <span>{isAnalyzing ? 'AI 재분석 진행 중...' : '재분석 실행'}</span>
                </button>
              </div>
            ) : (
              <div className="relative group w-full md:w-auto">
                <button
                  id="bottom-start-rfp-analysis-btn"
                  onClick={handleRunAnalysis}
                  disabled={isAnalyzing || !isRfpReady}
                  className={`w-full md:w-auto px-8 py-3.5 rounded-xl text-sm font-black shadow-md transition-all flex items-center justify-center gap-2.5 ${
                    !isRfpReady
                      ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed shadow-none'
                      : isAnalyzing
                      ? 'bg-[#CC0010] text-white cursor-wait opacity-90'
                      : 'bg-[#E60012] text-white hover:bg-[#CC0010] hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
                  }`}
                >
                  <Sparkles className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
                  <span>{isAnalyzing ? 'AI 분석 진행 중...' : 'RFP 분석 시작'}</span>
                  {!isAnalyzing && <ArrowRight className="w-4 h-4" />}
                </button>

                {!isRfpReady && (
                  <div className="absolute right-0 top-full mt-2 hidden group-hover:block z-30 w-72 p-2.5 bg-neutral-900 text-white text-xs rounded-lg shadow-xl text-center">
                    RFP 문서가 1건 이상 등록되어야 분석을 시작할 수 있습니다.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Document Preview Modal */}
      {previewFile && (
        <DocumentPreviewModal
          doc={previewFile}
          onClose={() => setPreviewFile(null)}
          onShowToast={onShowToast}
        />
      )}
    </div>
  );
};
