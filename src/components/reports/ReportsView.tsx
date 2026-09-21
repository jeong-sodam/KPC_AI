import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Download, 
  Eye, 
  Sparkles, 
  Calendar, 
  User, 
  CheckCircle2, 
  X, 
  Upload,
  Loader2,
  Trash2,
  Sliders,
  AlertTriangle,
  FolderPlus,
  FileCheck,
  Building2,
  Tag,
  Share2,
  Printer,
  Edit3
} from 'lucide-react';
import { SAMPLE_REPORTS } from '../../data/mockData';
import { ReportItem, UserRole } from '../../types';
import { ReportDetailEditor } from './ReportDetailEditor';

interface ReportsViewProps {
  onShowToast: (msg: string) => void;
  userRole?: UserRole;
}

const DEFAULT_REPORT_TYPES = [
  '컨설팅 진단',
  '시장 조사·트렌드',
  '사업 성과·KPI',
  '정책·규정 분석',
  '고객만족도(NCSI)',
  '생산성·TFP 지표',
  'ESG·지속가능경영',
  'AI·DX 혁신 전략',
  '교육·역량 평가'
];

export const ReportsView: React.FC<ReportsViewProps> = ({ onShowToast, userRole = 'admin' }) => {
  const [reports, setReports] = useState<ReportItem[]>(SAMPLE_REPORTS);
  const [reportTypes, setReportTypes] = useState<string[]>(DEFAULT_REPORT_TYPES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('전체');

  // Active Report being edited (Direct edit & AI edit)
  const [activeReportForEdit, setActiveReportForEdit] = useState<ReportItem | null>(null);

  // Type Management Modals
  const [showTypeManagerModal, setShowTypeManagerModal] = useState(false);
  const [newTypeNameInput, setNewTypeNameInput] = useState('');
  const [typeToDelete, setTypeToDelete] = useState<string | null>(null);

  // New Report Modal
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState('컨설팅 진단');
  const [isCustomTypeInCreate, setIsCustomTypeInCreate] = useState(false);
  const [customTypeInCreate, setCustomTypeInCreate] = useState('');
  const [newSummary, setNewSummary] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Report Actions
  const [reportToDelete, setReportToDelete] = useState<ReportItem | null>(null);
  const [previewReport, setPreviewReport] = useState<ReportItem | null>(null);

  // Filtered reports
  const filtered = (reports || []).filter(r => {
    if (!r) return false;
    const matchType = selectedType === '전체' || r.type === selectedType;
    const title = r.title || '';
    const dept = r.department || '';
    const author = r.author || '';
    const matchSearch = 
      !searchQuery.trim() || 
      title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      dept.toLowerCase().includes(searchQuery.toLowerCase()) ||
      author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchSearch;
  });

  // Calculate count per type
  const getCountForType = (type: string) => {
    if (type === '전체') return reports.length;
    return reports.filter(r => r.type === type).length;
  };

  // Add a new report type
  const handleAddType = (typeName?: string) => {
    const target = (typeName || newTypeNameInput).trim();
    if (!target) {
      onShowToast('유형 명칭을 입력해주세요.');
      return false;
    }
    if (target === '전체') {
      onShowToast("'전체'는 예약된 필터 명칭입니다.");
      return false;
    }
    if (reportTypes.includes(target)) {
      onShowToast(`'${target}' 유형이 이미 존재합니다.`);
      return false;
    }

    setReportTypes(prev => [...prev, target]);
    setNewTypeNameInput('');
    onShowToast(`'${target}' 보고서 유형이 새로 추가되었습니다.`);
    return true;
  };

  // Delete a report type
  const handleConfirmDeleteType = () => {
    if (!typeToDelete) return;

    const deleting = typeToDelete;
    setReportTypes(prev => prev.filter(t => t !== deleting));

    // If current filter was this type, reset to '전체'
    if (selectedType === deleting) {
      setSelectedType('전체');
    }

    // Reassign existing reports of this type to '기타'
    setReports(prev => prev.map(r => r.type === deleting ? { ...r, type: '기타' } : r));

    setTypeToDelete(null);
    onShowToast(`'${deleting}' 유형이 삭제되었습니다.`);
  };

  // Create a new report
  const handleCreateReport = () => {
    if (!newTitle.trim()) {
      onShowToast('보고서 제목을 입력해주세요.');
      return;
    }

    let resolvedType = newType;
    if (isCustomTypeInCreate) {
      const custom = customTypeInCreate.trim();
      if (!custom) {
        onShowToast('새 보고서 유형을 입력해주세요.');
        return;
      }
      if (!reportTypes.includes(custom)) {
        setReportTypes(prev => [...prev, custom]);
      }
      resolvedType = custom;
    }

    setIsGenerating(true);

    setTimeout(() => {
      const created: ReportItem = {
        id: `rep-${Date.now()}`,
        title: newTitle.trim(),
        type: resolvedType,
        createdAt: '2026.09.08',
        author: userRole === 'admin' ? '정소담 수석 (Admin)' : '정소담 선임연구원',
        department: 'AI산업본부',
        status: '초안 완료',
        pages: Math.floor(Math.random() * 25) + 20,
        summary: newSummary.trim() || 
          `KPC 사내 지식 기반 RAG와 '${resolvedType}' 전문 프레임워크를 결합하여 자동 생성된 공공·기업 맞춤형 종합 분석 보고서입니다.`,
        sections: [
          {
            id: 'sec-1',
            title: '1. 개요 및 추진 배경',
            category: '추진 개요',
            content: `본 보고서는 '${newTitle.trim()}' 과제와 관련하여, 급변하는 산업 환경 및 정부 정책 기조를 심층 진단하고 실효성 있는 대응 전략을 제시하고자 작성되었습니다.\n\n주요 목표:\n- 당면 과제에 대한 종합 현황 및 핵심 이슈 분석\n- 사내 축적 지식(RAG)과 공공 데이터 결합을 통한 실증 지표 도출\n- 단계별 실행 방안 및 구체적 이행 과제 제언`,
            lastModified: '방금 생성됨'
          },
          {
            id: 'sec-2',
            title: '2. 현황 진단 및 핵심 환경 분석',
            category: '환경 분석',
            content: `최근 3개년 동안의 산업별 통계 및 유관 공공·민간 사례 분석 결과, 당해 영역에서의 혁신 및 체질 개선 요구가 급증하고 있습니다.\n\n주요 진단 지표:\n1) 인프라 도입률: 전년 대비 34.2% 증가\n2) 운영 효율성: 도입 1년 차 이후 운영 생산성 22.8% 향상 기대\n3) 주요 리스크 요인: 제도적 가이드라인 미비 및 사내 전담 전문 인력 부족`,
            lastModified: '방금 생성됨'
          },
          {
            id: 'sec-3',
            title: '3. 세부 분석 및 데이터 실증 비교',
            category: '실증 분석',
            content: `${newSummary.trim() || 'KPC 축적 지식 15만 건을 교차 검증한 결과, 부서 간 협업 체계와 표준 데이터 거버넌스 도입이 성공의 핵심 요인으로 분석되었습니다.'}\n\n사내외 유사 프로젝트 15건의 벤치마킹을 통하여 도출된 성공 핵심 요소(CSF):\n- 데이터 주도적 의사결정 체계 조기 정착\n- 부서 간 칸막이 제거를 위한 전사 거버넌스 협의체 구성\n- 단계적 성과 관리 KPI 측정 및 분기별 피드백 루프 운영`,
            lastModified: '방금 생성됨'
          },
          {
            id: 'sec-4',
            title: '4. KPC 전략적 제언 및 실행 로드맵',
            category: '전략 제언',
            content: `한국생산성본부(KPC)의 전문 진단 모델을 바탕으로 한 단계별 실행 로드맵:\n\n[1단계: 기반 구축(1~3개월)] - 내부 거버넌스 정립 및 실무진 역량 강화 교육\n[2단계: 시범 고도화(4~8개월)] - 핵심 파일럿 과제 수행 및 성과 지표 검증\n[3단계: 전사 확산(9~12개월)] - 모범 사례 표준화 및 전사 통합 시스템 연계 구축`,
            lastModified: '방금 생성됨'
          }
        ]
      };

      setReports(prev => [created, ...prev]);
      setIsGenerating(false);
      setShowNewModal(false);
      setNewTitle('');
      setNewSummary('');
      setIsCustomTypeInCreate(false);
      setCustomTypeInCreate('');
      setActiveReportForEdit(created);
      onShowToast(`'${created.title}' 보고서가 생성되어 편집 화면으로 이동했습니다.`);
    }, 1200);
  };

  // Save report from editor
  const handleSaveEditedReport = (updated: ReportItem) => {
    setReports(prev => prev.map(r => r.id === updated.id ? updated : r));
    setActiveReportForEdit(updated);
  };

  // Delete a report
  const handleConfirmDeleteReport = () => {
    if (!reportToDelete) return;
    const targetTitle = reportToDelete.title;
    setReports(prev => prev.filter(r => r.id !== reportToDelete.id));
    setReportToDelete(null);
    onShowToast(`'${targetTitle}' 보고서가 삭제되었습니다.`);
  };

  // If editing a report, render the editor directly
  if (activeReportForEdit) {
    return (
      <ReportDetailEditor
        report={activeReportForEdit}
        onBack={() => setActiveReportForEdit(null)}
        onSave={handleSaveEditedReport}
        onShowToast={onShowToast}
      />
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[#F8F9FA] p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto w-full space-y-6">
        {/* Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-5 border-b border-neutral-200 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-[#E60012]" />
              <h1 className="text-xl sm:text-2xl font-black text-[#111111] tracking-tight">
                보고서 생성
              </h1>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-[#E60012] border border-red-200">
                총 {reports.length}종 수록
              </span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-600">
              한국생산성본부의 60년 조사 연구, 산업별 실증 지표, 사내 지식 RAG를 결합하여 전문 보고서를 즉시 기획·생성합니다.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              id="manage-report-types-btn"
              onClick={() => setShowTypeManagerModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200 rounded-lg text-xs font-bold transition-all shadow-2xs cursor-pointer"
              title="보고서 유형 관리 (추가/삭제)"
            >
              <Sliders className="w-3.5 h-3.5 text-neutral-500" />
              <span>유형 관리 ({reportTypes.length})</span>
            </button>

            <button
              id="new-report-modal-btn"
              onClick={() => setShowNewModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#E60012] hover:bg-[#CC0010] text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ 새 보고서 생성</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-2xs space-y-3">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full lg:w-80">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="보고서 제목, 담당자, 부서 검색..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-[#F8F9FA] pl-9 pr-3 py-2 rounded-lg border border-neutral-200 text-xs text-[#111111] focus:outline-none focus:border-[#E60012] transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-neutral-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <span>표시 결과: <strong className="text-[#111111] font-bold">{filtered.length}</strong>건</span>
              <span className="text-neutral-300">|</span>
              <span className="text-[11px] text-neutral-400">원하는 유형 버튼을 클릭하여 필터링하세요.</span>
            </div>
          </div>

          {/* Type Filter Buttons with horizontal scroll */}
          <div className="pt-2 border-t border-neutral-100 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {/* '전체' Filter */}
            <button
              onClick={() => setSelectedType('전체')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedType === '전체'
                  ? 'bg-[#111111] text-white shadow-2xs'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              <span>전체</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                selectedType === '전체' ? 'bg-neutral-700 text-white' : 'bg-white text-neutral-500'
              }`}>
                {reports.length}
              </span>
            </button>

            {/* Dynamic Types */}
            {reportTypes.map(t => {
              const count = getCountForType(t);
              const isSelected = selectedType === t;
              return (
                <div key={t} className="relative group/tag flex items-center shrink-0">
                  <button
                    onClick={() => setSelectedType(t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#E60012] text-white shadow-2xs font-bold'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    <span>{t}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected ? 'bg-red-800 text-white' : 'bg-white text-neutral-500'
                    }`}>
                      {count}
                    </span>
                  </button>

                  {/* Quick Delete Type Button on hover */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setTypeToDelete(t);
                    }}
                    className="hidden group-hover/tag:flex items-center justify-center absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-neutral-800 hover:bg-red-600 text-white transition-all shadow-xs cursor-pointer"
                    title={`'${t}' 유형 삭제`}
                  >
                    <X className="w-2.5 h-2.5" />
                  </button>
                </div>
              );
            })}

            {/* Inline Quick Add Type Button */}
            <button
              onClick={() => setShowTypeManagerModal(true)}
              className="px-2.5 py-1.5 rounded-lg border border-dashed border-neutral-300 hover:border-[#E60012] hover:text-[#E60012] text-neutral-500 text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 cursor-pointer ml-1"
              title="새 보고서 유형 추가하기"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>유형 추가</span>
            </button>
          </div>
        </div>

        {/* Reports Grid */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-neutral-800">
              해당 조건의 보고서가 없습니다.
            </h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              다른 유형 필터를 선택하거나, 상단의 [+ 새 보고서 생성] 버튼을 통해 이 유형의 첫 보고서를 생성해보세요.
            </p>
            <button
              onClick={() => {
                setSelectedType('전체');
                setSearchQuery('');
              }}
              className="px-3.5 py-1.5 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer"
            >
              필터 초기화
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(report => (
              <div
                key={report.id}
                className="bg-white rounded-xl border border-neutral-200 p-5 shadow-2xs hover:border-[#E60012] hover:shadow-xs transition-all flex flex-col justify-between group relative"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[10px] font-bold text-[#E60012] bg-red-50 px-2.5 py-0.5 rounded-full border border-red-100">
                      {report.type}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {report.pages && (
                        <span className="text-[10px] font-medium text-neutral-400">
                          {report.pages}p
                        </span>
                      )}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                        report.status === '작성 완료'
                          ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                          : report.status === '초안 완료'
                          ? 'text-blue-700 bg-blue-50 border-blue-200'
                          : 'text-amber-700 bg-amber-50 border-amber-200'
                      }`}>
                        {report.status}
                      </span>
                    </div>
                  </div>

                  <h3 
                    onClick={() => setActiveReportForEdit(report)}
                    className="text-sm font-bold text-[#111111] mb-2 line-clamp-2 leading-snug group-hover:text-[#E60012] transition-colors cursor-pointer"
                    title="클릭하여 보고서로 이동 (직접 수정 / AI 수정)"
                  >
                    {report.title}
                  </h3>

                  <p className="text-xs text-neutral-600 mb-4 line-clamp-3 leading-relaxed">
                    {report.summary}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-neutral-100">
                  <div className="flex items-center justify-between text-[11px] text-neutral-500">
                    <span className="font-medium text-neutral-600 truncate max-w-[140px]">
                      {report.department} · {report.author}
                    </span>
                    <span>{report.createdAt}</span>
                  </div>

                  <div className="flex items-center justify-between gap-1.5 pt-1">
                    {/* Delete Report Button */}
                    <button
                      onClick={() => setReportToDelete(report)}
                      className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="보고서 삭제"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setActiveReportForEdit(report)}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-[#E60012] bg-red-50 hover:bg-red-100 rounded-md border border-red-200 transition-colors cursor-pointer"
                        title="보고서 직접 수정 및 AI 수정"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#E60012]" />
                        <span>수정</span>
                      </button>
                      <button
                        onClick={() => setPreviewReport(report)}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-md border border-neutral-200 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-neutral-500" />
                        <span>열람</span>
                      </button>
                      <button
                        onClick={() => onShowToast(`'${report.title}' 정식 보고서(DOCX/PDF) 다운로드를 시작합니다.`)}
                        className="flex items-center gap-1 px-3 py-1 text-xs font-bold text-white bg-neutral-900 hover:bg-black rounded-md shadow-2xs transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>다운로드</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===================== MODAL 1: Manage Report Types (추가/삭제) ===================== */}
      {showTypeManagerModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-neutral-200 max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#E60012]" />
                <h3 className="text-sm font-bold text-[#111111]">
                  보고서 유형 관리 (추가 및 삭제)
                </h3>
              </div>
              <button 
                onClick={() => setShowTypeManagerModal(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-500">
              보고서 생성 시 분류 기준으로 사용되는 유형 카테고리를 자유롭게 추가하거나 삭제할 수 있습니다.
            </p>

            {/* Input to add new type */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700 block">
                새 보고서 유형 추가
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="예: 스마트제조 DX, 인사조직 평가"
                  value={newTypeNameInput}
                  onChange={e => setNewTypeNameInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      handleAddType();
                    }
                  }}
                  className="flex-1 px-3 py-2 bg-[#F8F9FA] border border-neutral-200 rounded-lg text-xs text-[#111111] focus:outline-none focus:border-[#E60012]"
                />
                <button
                  onClick={() => handleAddType()}
                  disabled={!newTypeNameInput.trim()}
                  className="px-3.5 py-2 bg-[#E60012] hover:bg-[#CC0010] disabled:bg-neutral-200 disabled:text-neutral-400 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0"
                >
                  추가
                </button>
              </div>
            </div>

            {/* List of current types */}
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-neutral-700">
                  현재 등록된 유형 목록 ({reportTypes.length})
                </label>
                <span className="text-[11px] text-neutral-400">보고서 개수</span>
              </div>
              <div className="border border-neutral-200 rounded-lg divide-y divide-neutral-100 max-h-60 overflow-y-auto pr-1">
                {reportTypes.map(t => {
                  const count = getCountForType(t);
                  return (
                    <div
                      key={t}
                      className="p-2.5 flex items-center justify-between hover:bg-neutral-50 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E60012]" />
                        <span className="text-xs font-semibold text-[#111111]">{t}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 font-medium">
                          {count}건
                        </span>
                        <button
                          onClick={() => setTypeToDelete(t)}
                          className="p-1 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                          title="유형 삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-neutral-200">
              <button
                onClick={() => setShowTypeManagerModal(false)}
                className="px-4 py-2 bg-neutral-900 text-white rounded-lg text-xs font-bold hover:bg-black transition-colors cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== MODAL 2: Delete Type Confirmation ===================== */}
      {typeToDelete && (
        <div className="fixed inset-0 bg-black/50 z-60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-neutral-200 max-w-sm w-full p-5 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#111111]">
                  유형을 삭제하시겠습니까?
                </h4>
                <p className="text-xs text-neutral-500 mt-0.5">
                  '{typeToDelete}' 유형이 목록에서 제거됩니다.
                </p>
              </div>
            </div>

            {getCountForType(typeToDelete) > 0 && (
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-800">
                ⚠️ 이 유형에 속한 <strong>{getCountForType(typeToDelete)}건</strong>의 보고서는 '기타' 유형으로 자동 재분류됩니다.
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
              <button
                onClick={() => setTypeToDelete(null)}
                className="px-3.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-xs font-semibold cursor-pointer"
              >
                취소
              </button>
              <button
                onClick={handleConfirmDeleteType}
                className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                삭제 확인
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== MODAL 3: Delete Report Confirmation ===================== */}
      {reportToDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-neutral-200 max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#111111]">
                  보고서를 삭제하시겠습니까?
                </h4>
                <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">
                  '{reportToDelete.title}'
                </p>
              </div>
            </div>

            <p className="text-xs text-neutral-600">
              삭제된 보고서는 목록에서 완전히 제거되며 복구할 수 없습니다. 계속 진행하시겠습니까?
            </p>

            <div className="flex justify-end gap-2 pt-3 border-t border-neutral-100">
              <button
                onClick={() => setReportToDelete(null)}
                className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-xs font-semibold cursor-pointer"
              >
                취소
              </button>
              <button
                onClick={handleConfirmDeleteReport}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                보고서 삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== MODAL 4: New Report Creation ===================== */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-neutral-200 max-w-xl w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#E60012]" />
                <h3 className="text-sm font-bold text-[#111111]">
                  새 맞춤형 보고서 자동 생성
                </h3>
              </div>
              <button 
                onClick={() => setShowNewModal(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                보고서 제목 <span className="text-[#E60012]">*</span>
              </label>
              <input
                type="text"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="예: 2026 공공기관 생성형 AI 도입 타당성 및 ROI 분석 보고서"
                className="w-full bg-[#F8F9FA] px-3 py-2 rounded-lg border border-neutral-300 text-xs text-[#111111] focus:outline-none focus:border-[#E60012]"
              />
            </div>

            {/* Type Selector with direct "+ 새 유형" toggle */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-neutral-800">
                  보고서 유형 <span className="text-[#E60012]">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setIsCustomTypeInCreate(!isCustomTypeInCreate)}
                  className="text-[11px] text-[#E60012] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  {isCustomTypeInCreate ? '기존 목록에서 선택' : '새 유형 직접 입력'}
                </button>
              </div>

              {isCustomTypeInCreate ? (
                <input
                  type="text"
                  value={customTypeInCreate}
                  onChange={e => setCustomTypeInCreate(e.target.value)}
                  placeholder="추가할 새 보고서 유형을 입력하세요 (예: 스마트팩토리 품질진단)"
                  className="w-full bg-[#F8F9FA] px-3 py-2 rounded-lg border border-[#E60012] text-xs text-[#111111] focus:outline-none"
                  autoFocus
                />
              ) : (
                <select
                  value={newType}
                  onChange={e => setNewType(e.target.value)}
                  className="w-full bg-[#F8F9FA] px-3 py-2 rounded-lg border border-neutral-300 text-xs text-[#111111] font-semibold focus:outline-none focus:border-[#E60012]"
                >
                  {reportTypes.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Summary/Scope */}
            <div>
              <label className="block text-xs font-bold text-neutral-800 mb-1.5">
                연구 범위 및 주요 분석 관점 (선택)
              </label>
              <textarea
                rows={2}
                value={newSummary}
                onChange={e => setNewSummary(e.target.value)}
                placeholder="예: 공공기관 클라우드 네이티브 전환 비용, 보안 규정 준수 방안, 향후 3개년 생산성 기대치 수록"
                className="w-full bg-[#F8F9FA] px-3 py-2 rounded-lg border border-neutral-300 text-xs text-[#111111] focus:outline-none focus:border-[#E60012] resize-none"
              />
            </div>

            {/* Reference Upload Simulation */}
            <div className="border border-dashed border-neutral-300 rounded-lg p-4 text-center bg-[#F8F9FA] hover:bg-neutral-50 transition-colors">
              <Upload className="w-5 h-5 text-neutral-400 mx-auto mb-1" />
              <span className="text-xs text-neutral-600 block font-medium">
                참고할 기초 통계 자료, 공공 데이터셋, 설문 조사 문서를 첨부하세요.
              </span>
              <span className="text-[10px] text-neutral-400">PDF, XLSX, HWP 지원 (최대 50MB)</span>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-neutral-200">
              <button
                onClick={() => setShowNewModal(false)}
                className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-xs font-semibold cursor-pointer"
              >
                취소
              </button>
              <button
                disabled={!newTitle.trim() || isGenerating}
                onClick={handleCreateReport}
                className="flex items-center gap-1.5 px-5 py-2 bg-[#E60012] hover:bg-[#CC0010] disabled:bg-neutral-300 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>AI 보고서 기획 및 생성 중...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>초안 생성 시작</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== MODAL 5: Report Preview (열람) ===================== */}
      {previewReport && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-neutral-200 max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-5 border-b border-neutral-200 flex items-center justify-between shrink-0 bg-[#F8F9FA] rounded-t-xl">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-[#E60012] bg-red-50 px-2 py-0.5 rounded border border-red-200">
                    {previewReport.type}
                  </span>
                  <span className="text-xs text-neutral-500 font-medium">
                    {previewReport.department} · {previewReport.author} · {previewReport.createdAt}
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#111111]">
                  {previewReport.title}
                </h3>
              </div>
              <button 
                onClick={() => setPreviewReport(null)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-neutral-700 leading-relaxed">
              <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                <h4 className="font-bold text-[#111111] mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#E60012]" />
                  Executive Summary (AI 요약)
                </h4>
                <p className="text-neutral-600 leading-relaxed">
                  {previewReport.summary}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-neutral-900 mb-2 border-b border-neutral-200 pb-1">
                  보고서 목차 구성 (Table of Contents)
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-neutral-600 pl-1 font-medium">
                  <li>사업 개요 및 추진 배경 (환경 분석 및 필요성)</li>
                  <li>국내외 기술 및 정책 동향 분석 (조달 통계 및 벤치마킹)</li>
                  <li>KPC 특화 지표 기반 현황 진단 및 Gap 분석</li>
                  <li>단계별 추진 전략 및 거버넌스 수립 모델</li>
                  <li>기대 효과, 정량적 ROI 및 정성적 생산성 향상 지표</li>
                  <li>결론 및 정책 제언 (별첨 데이터셋 포함)</li>
                </ol>
              </div>

              <div className="p-3 bg-red-50/50 rounded-lg border border-red-100 flex items-center justify-between text-[11px]">
                <span className="text-neutral-600">
                  생성 엔진: <strong>KPC RAG v4.2 + Gemini 2.5 Flash</strong>
                </span>
                <span className="text-neutral-500">
                  예상 분량: 약 {previewReport.pages || 32}페이지
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-neutral-200 flex items-center justify-between shrink-0 bg-white rounded-b-xl">
              <span className="text-[11px] text-neutral-400">
                KPC 사내 인텔리전스 보고서 아카이브
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onShowToast(`'${previewReport.title}' 인쇄 창을 호출합니다.`)}
                  className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>인쇄</span>
                </button>
                <button
                  onClick={() => onShowToast(`'${previewReport.title}' 다운로드를 시작합니다.`)}
                  className="px-4 py-1.5 bg-[#E60012] hover:bg-[#CC0010] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>다운로드 (DOCX/PDF)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
