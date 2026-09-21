import React, { useState } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  ChevronDown, 
  Building2, 
  Calendar, 
  Coins, 
  FileText, 
  Plus, 
  Eye, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Filter,
  Layers
} from 'lucide-react';
import { RfpItem, Department } from '../../types';
import { SAMPLE_RFPS } from '../../data/mockData';

interface OpportunitySearchProps {
  rfpList?: RfpItem[];
  onAddToPipeline?: (rfpId: string, department: Department) => void;
  onGoToPipeline?: () => void;
  onShowToast: (msg: string) => void;
  onOpenRfpDetail?: (rfp: RfpItem) => void;
  onStartProposal?: (rfp: RfpItem) => void;
  onViewRfpDetail?: (rfp: RfpItem) => void;
  initialSearchQuery?: string;
}

export const OpportunitySearch: React.FC<OpportunitySearchProps> = ({
  rfpList = SAMPLE_RFPS,
  onAddToPipeline,
  onGoToPipeline,
  onShowToast,
  onOpenRfpDetail,
  onStartProposal,
  onViewRfpDetail,
  initialSearchQuery = ''
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedProfile, setSelectedProfile] = useState<string>('전체');
  const [showDetailedFilter, setShowDetailedFilter] = useState(false);

  // Filters state
  const [filterValue, setFilterValue] = useState<string>('전체');
  const [filterStatus, setFilterStatus] = useState<string>('전체');
  const [filterType, setFilterType] = useState<string>('전체');
  const [filterCountry, setFilterCountry] = useState<string>('대한민국');
  const [filterCurrency, setFilterCurrency] = useState<string>('KRW');
  const [filterLanguage, setFilterLanguage] = useState<string>('한국어');

  // Pipeline Add Modal State
  const [modalRfp, setModalRfp] = useState<RfpItem | null>(null);
  const [selectedDeptForModal, setSelectedDeptForModal] = useState<Department>('AI사업본부');

  // RFP Original Document Preview Drawer State
  const [previewRfp, setPreviewRfp] = useState<RfpItem | null>(null);
  const [previewPage, setPreviewPage] = useState<number>(1);

  const handleOpenDetail = (rfp: RfpItem) => {
    if (onOpenRfpDetail) onOpenRfpDetail(rfp);
    else if (onViewRfpDetail) onViewRfpDetail(rfp);
  };

  const handleAddToPipeline = (rfpId: string, dept: Department) => {
    if (onAddToPipeline) {
      onAddToPipeline(rfpId, dept);
    } else {
      onShowToast(`사업이 [${dept}] 수주 목록에 추가되었습니다.`);
      if (onGoToPipeline) onGoToPipeline();
    }
  };

  const handleProfileChange = (profile: string) => {
    setSelectedProfile(profile);
    if (profile === 'KPC 기본 수주 프로필') {
      setFilterValue('1억~3억원');
      setFilterCountry('대한민국');
      setFilterLanguage('한국어');
      onShowToast('\'KPC 기본 수주 프로필\'(공공·1억 이상·한국어) 조건이 적용되었습니다.');
    } else if (profile === 'AI·DX 사업') {
      setSearchQuery('AI');
      onShowToast('\'AI·DX 사업\' 필터가 적용되었습니다.');
    } else if (profile === '교육·컨설팅 사업') {
      setFilterType('컨설팅');
      onShowToast('\'교육·컨설팅 사업\' 필터가 적용되었습니다.');
    }
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedProfile('전체');
    setFilterValue('전체');
    setFilterStatus('전체');
    setFilterType('전체');
    setFilterCountry('대한민국');
    setFilterCurrency('KRW');
    setFilterLanguage('한국어');
    onShowToast('필터가 초기화되었습니다.');
  };

  // Filtered RFPs logic
  const listToUse = (rfpList && rfpList.length > 0) ? rfpList : SAMPLE_RFPS;
  const filteredList = (listToUse || []).filter(item => {
    if (!item) return false;
    const title = item.title || '';
    const agency = item.agency || '';
    const contractType = item.contractType || '';
    const matchesSearch = 
      !searchQuery.trim() || 
      title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      agency.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contractType.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === '전체' || item.status === filterStatus;
    const matchesType = filterType === '전체' || contractType.includes(filterType);

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[#F8F9FA] p-6 relative">
      <div className="max-w-7xl mx-auto w-full space-y-5">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-[#111111] tracking-tight">
              사업 찾기
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-neutral-200 text-neutral-800 border border-neutral-300">
              조달청 실시간 연동 중 (총 8건 탐색됨)
            </span>
            {onGoToPipeline && (
              <button
                id="goto-pipeline-header-btn"
                onClick={onGoToPipeline}
                className="flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold bg-[#111111] hover:bg-neutral-800 text-white shadow-2xs transition-all cursor-pointer"
                title="수주 목록 칸반 보드로 이동"
              >
                <Layers className="w-3.5 h-3.5 text-[#E60012]" />
                <span>수주 목록으로 이동</span>
              </button>
            )}
          </div>
        </div>

        {/* Search Bar & Profile Bar */}
        <div className="bg-white rounded-lg border border-neutral-200 p-4 shadow-2xs space-y-3">
          {/* Main Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
            <input
              id="opportunity-search-input"
              type="text"
              placeholder="사업명, 기관명, 키워드를 입력하세요. (예: AI 교육, 컨설팅, 공공기관 DX)"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#F8F9FA] pl-10 pr-24 py-2.5 rounded-md border border-neutral-300 text-xs font-medium text-[#111111] placeholder:text-neutral-400 focus:outline-none focus:border-[#E60012] focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-neutral-400 hover:text-neutral-700"
              >
                지우기
              </button>
            )}
          </div>

          {/* Controls: Profile Dropdown + Detailed Filter Button */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            {/* Suju Profile Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-neutral-700">
                수주 프로필:
              </span>
              <select
                id="suju-profile-select"
                value={selectedProfile}
                onChange={e => handleProfileChange(e.target.value)}
                className="bg-white border border-neutral-300 rounded-md px-3 py-1.5 text-xs text-[#111111] font-semibold focus:outline-none focus:border-[#E60012]"
              >
                <option value="전체">전체</option>
                <option value="KPC 기본 수주 프로필">KPC 기본 수주 프로필</option>
                <option value="AI·DX 사업">AI·DX 사업</option>
                <option value="교육·컨설팅 사업">교육·컨설팅 사업</option>
                <option value="공공기관 우선">공공기관 우선</option>
                <option value="대형 사업 우선">대형 사업 우선</option>
              </select>

              {selectedProfile === 'KPC 기본 수주 프로필' && (
                <span className="text-[11px] text-[#E60012] bg-red-50 border border-[#E60012]/30 px-2 py-0.5 rounded font-medium">
                  조건: 국내 공공기관 · 60일 이내 · 1억 이상 · 컨설팅/교육/AI · 한국어 RFP
                </span>
              )}
            </div>

            {/* Detail Filter Toggle */}
            <div className="flex items-center gap-2">
              <button
                id="detail-filter-toggle-btn"
                onClick={() => setShowDetailedFilter(!showDetailedFilter)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border transition-all ${
                  showDetailedFilter
                    ? 'bg-[#111111] text-white border-[#111111]'
                    : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>상세 필터 {showDetailedFilter ? '접기' : '열기'}</span>
              </button>

              <button
                onClick={resetFilters}
                className="text-xs text-neutral-500 hover:text-[#E60012] px-2 py-1 underline font-medium"
              >
                초기화
              </button>
            </div>
          </div>

          {/* Expanded Detailed Filter Area */}
          {showDetailedFilter && (
            <div className="pt-3 mt-3 border-t border-neutral-200 grid grid-cols-4 gap-3 text-xs animate-in fade-in duration-150">
              {/* 계약가치 */}
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">계약가치</label>
                <select
                  value={filterValue}
                  onChange={e => setFilterValue(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded p-1.5 text-xs text-[#111111]"
                >
                  <option value="전체">전체</option>
                  <option value="5천만원 이하">5천만원 이하</option>
                  <option value="5천만원~1억원">5천만원~1억원</option>
                  <option value="1억~3억원">1억~3억원</option>
                  <option value="3억~5억원">3억~5억원</option>
                  <option value="5억원 이상">5억원 이상</option>
                </select>
              </div>

              {/* 상태 */}
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">상태</label>
                <select
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded p-1.5 text-xs text-[#111111]"
                >
                  <option value="전체">전체</option>
                  <option value="모집 중">모집 중</option>
                  <option value="마감 임박">마감 임박</option>
                  <option value="예정">예정</option>
                  <option value="마감">마감</option>
                </select>
              </div>

              {/* 계약유형 */}
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">계약유형</label>
                <select
                  value={filterType}
                  onChange={e => setFilterType(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded p-1.5 text-xs text-[#111111]"
                >
                  <option value="전체">전체</option>
                  <option value="컨설팅">컨설팅</option>
                  <option value="교육">교육</option>
                  <option value="시스템 구축">시스템 구축</option>
                  <option value="연구">연구</option>
                  <option value="운영">운영</option>
                </select>
              </div>

              {/* 국가 & 언어 */}
              <div>
                <label className="block text-[11px] font-bold text-neutral-600 mb-1">국가 / 언어</label>
                <div className="flex gap-1.5">
                  <select
                    value={filterCountry}
                    onChange={e => setFilterCountry(e.target.value)}
                    className="w-1/2 bg-white border border-neutral-300 rounded p-1.5 text-xs"
                  >
                    <option value="대한민국">대한민국</option>
                    <option value="미국">미국</option>
                    <option value="일본">일본</option>
                    <option value="기타">기타</option>
                  </select>
                  <select
                    value={filterLanguage}
                    onChange={e => setFilterLanguage(e.target.value)}
                    className="w-1/2 bg-white border border-neutral-300 rounded p-1.5 text-xs"
                  >
                    <option value="한국어">한국어</option>
                    <option value="영어">영어</option>
                    <option value="일본어">일본어</option>
                  </select>
                </div>
              </div>

              <div className="col-span-4 flex justify-end gap-2 pt-2 border-t border-neutral-100">
                <button
                  onClick={resetFilters}
                  className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded text-xs font-semibold"
                >
                  초기화
                </button>
                <button
                  onClick={() => onShowToast('필터가 성공적으로 적용되었습니다.')}
                  className="px-3 py-1.5 bg-[#E60012] hover:bg-[#CC0010] text-white rounded text-xs font-semibold"
                >
                  필터 적용
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 8+ RFP Search Result Cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-neutral-700">
              검색 결과: <strong className="text-[#E60012]">{filteredList.length}</strong> 건의 공공 RFP
            </span>
            <span className="text-[11px] text-neutral-500">
              정렬: 수주 적합도 순 (KPC 알고리즘)
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {filteredList.map(rfp => (
              <div
                key={rfp.id}
                id={`rfp-card-${rfp.id}`}
                className="bg-white rounded-lg border border-neutral-200 hover:border-neutral-400 p-4 transition-all shadow-2xs flex flex-col justify-between"
              >
                <div>
                  {/* Status & Department Badges */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        rfp.status === '마감 임박'
                          ? 'bg-neutral-900 text-white border-neutral-900'
                          : 'bg-neutral-100 text-neutral-700 border-neutral-200'
                      }`}>
                        {rfp.status}
                      </span>
                      <span className="text-[10px] font-semibold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded border border-neutral-200">
                        {rfp.contractType}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] font-bold text-[#111111]">
                      <span>PWin</span>
                      <span className="text-[#E60012]">{rfp.pwin}%</span>
                    </div>
                  </div>

                  {/* Title & Agency */}
                  <h3 
                    onClick={() => handleOpenDetail(rfp)}
                    className="text-sm font-bold text-[#111111] hover:text-[#E60012] cursor-pointer transition-colors leading-snug mb-2"
                  >
                    {rfp.title}
                  </h3>

                  {/* Key Info Grid */}
                  <div className="grid grid-cols-2 gap-y-1.5 text-xs text-neutral-600 bg-[#F8F9FA] p-2.5 rounded-md border border-neutral-200 mb-3">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span className="truncate">{rfp.agency}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Coins className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span className="font-bold text-neutral-900">{rfp.budgetFormatted}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span>마감: {rfp.deadline}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] bg-neutral-200 px-1.5 py-0.2 rounded font-medium text-neutral-700">
                        {rfp.country} / {rfp.language}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-neutral-600 line-clamp-2 leading-relaxed mb-3">
                    {rfp.purpose}
                  </p>
                </div>

                {/* Card Actions: [파이프라인 추가] & [원문 보기] */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
                  <button
                    id={`preview-rfp-${rfp.id}-btn`}
                    onClick={() => {
                      setPreviewRfp(rfp);
                      setPreviewPage(1);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>원문 보기</span>
                  </button>

                  <button
                    id={`add-pipeline-${rfp.id}-btn`}
                    onClick={() => {
                      setModalRfp(rfp);
                      setSelectedDeptForModal(rfp.department || 'AI사업본부');
                    }}
                    className="flex items-center gap-1 px-3.5 py-1.5 rounded-md text-xs font-semibold text-white bg-[#E60012] hover:bg-[#CC0010] shadow-2xs transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>파이프라인 추가</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 7. Modal: 파이프라인에 사업 추가 */}
      {modalRfp && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-neutral-200 max-w-md w-full p-5 shadow-xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 mb-3">
              <h3 className="text-sm font-bold text-[#111111]">
                파이프라인에 사업 추가
              </h3>
              <button
                onClick={() => setModalRfp(null)}
                className="text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-600 mb-3">
              사업을 담당할 부서를 선택하세요.
            </p>

            <div className="bg-[#F8F9FA] p-3 rounded-md border border-neutral-200 text-xs text-neutral-700 mb-4">
              <strong className="block text-[#111111] font-bold truncate mb-0.5">
                {modalRfp.title}
              </strong>
              <span className="text-[11px] text-neutral-500">
                {modalRfp.agency} · {modalRfp.budgetFormatted}
              </span>
            </div>

            <div className="mb-5">
              <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                담당 부서
              </label>
              <select
                id="modal-dept-select"
                value={selectedDeptForModal}
                onChange={e => setSelectedDeptForModal(e.target.value as Department)}
                className="w-full bg-white border border-neutral-300 rounded-md px-3 py-2 text-xs font-semibold text-[#111111] focus:outline-none focus:border-[#E60012]"
              >
                <option value="AI사업본부">AI사업본부</option>
                <option value="컨설팅본부">컨설팅본부</option>
                <option value="교육사업본부">교육사업본부</option>
                <option value="생산성본부">생산성본부</option>
                <option value="CX본부">CX본부</option>
                <option value="자격사업본부">자격사업본부</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                id="cancel-pipeline-modal-btn"
                onClick={() => setModalRfp(null)}
                className="px-3.5 py-1.5 rounded-md text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200"
              >
                취소
              </button>
              <button
                id="confirm-pipeline-modal-btn"
                onClick={() => {
                  handleAddToPipeline(modalRfp.id, selectedDeptForModal);
                  setModalRfp(null);
                }}
                className="px-4 py-1.5 rounded-md text-xs font-semibold text-white bg-[#E60012] hover:bg-[#CC0010]"
              >
                추가
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Right Drawer: RFP 원문 Preview (PDF Style Page Viewer) */}
      {previewRfp && (
        <div className="fixed inset-y-0 right-0 w-[540px] bg-white border-l border-neutral-300 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-200">
          {/* Drawer Header */}
          <div className="h-14 px-5 border-b border-neutral-200 flex items-center justify-between shrink-0 bg-neutral-50">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#E60012]" />
              <span className="text-xs font-bold text-[#111111] truncate max-w-[340px]">
                RFP 원문 미리보기: {previewRfp.title}
              </span>
            </div>
            <button
              onClick={() => setPreviewRfp(null)}
              className="p-1 text-neutral-400 hover:text-neutral-700 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* PDF Page Controls Bar */}
          <div className="px-5 py-2 border-b border-neutral-200 flex items-center justify-between text-xs bg-white">
            <div className="flex items-center gap-2">
              <button
                disabled={previewPage <= 1}
                onClick={() => setPreviewPage(p => Math.max(1, p - 1))}
                className="p-1 border border-neutral-300 rounded disabled:opacity-40 hover:bg-neutral-100"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="font-semibold text-neutral-700">
                페이지 {previewPage} / 4
              </span>
              <button
                disabled={previewPage >= 4}
                onClick={() => setPreviewPage(p => Math.min(4, p + 1))}
                className="p-1 border border-neutral-300 rounded disabled:opacity-40 hover:bg-neutral-100"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <span className="text-[11px] text-neutral-500">
              출처: {previewRfp.source}
            </span>
          </div>

          {/* PDF Page Content Simulation */}
          <div className="flex-1 overflow-y-auto p-6 bg-neutral-100 flex justify-center">
            <div className="w-full max-w-md bg-white border border-neutral-300 shadow-sm p-6 text-xs text-[#111111] space-y-4 min-h-[580px]">
              {previewPage === 1 && (
                <div className="space-y-3">
                  <div className="text-center pb-3 border-b-2 border-neutral-800">
                    <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">제안요청서 (RFP)</span>
                    <h2 className="text-base font-black text-[#111111] mt-1">{previewRfp.title}</h2>
                    <span className="text-xs text-neutral-600 mt-1 block">발주기관: {previewRfp.agency}</span>
                  </div>

                  <div>
                    <h4 className="font-bold text-xs text-neutral-900 mb-1">1. 사업개요</h4>
                    <table className="w-full border-collapse border border-neutral-200 text-[11px]">
                      <tbody>
                        <tr className="border-b border-neutral-200">
                          <td className="bg-neutral-100 p-1.5 font-bold w-24">사업명</td>
                          <td className="p-1.5">{previewRfp.title}</td>
                        </tr>
                        <tr className="border-b border-neutral-200">
                          <td className="bg-neutral-100 p-1.5 font-bold">발주기관</td>
                          <td className="p-1.5">{previewRfp.agency}</td>
                        </tr>
                        <tr className="border-b border-neutral-200">
                          <td className="bg-neutral-100 p-1.5 font-bold">계약가치</td>
                          <td className="p-1.5 font-bold text-[#E60012]">{previewRfp.budgetFormatted}</td>
                        </tr>
                        <tr>
                          <td className="bg-neutral-100 p-1.5 font-bold">마감일시</td>
                          <td className="p-1.5">{previewRfp.deadline} 14:00 나라장터</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div>
                    <h4 className="font-bold text-xs text-neutral-900 mb-1">2. 사업 목적</h4>
                    <p className="text-[11px] text-neutral-700 leading-relaxed bg-neutral-50 p-2 rounded border border-neutral-200">
                      {previewRfp.purpose}
                    </p>
                  </div>
                </div>
              )}

              {previewPage === 2 && (
                <div className="space-y-3">
                  <h4 className="font-bold text-xs text-neutral-900 pb-1 border-b border-neutral-200">
                    3. 과업 내용 (주요 요구사항)
                  </h4>
                  <ul className="space-y-2 text-[11px] text-neutral-700 list-disc pl-4 leading-relaxed">
                    {previewRfp.tasks.map((task, i) => (
                      <li key={i} className="pl-1">
                        <strong className="text-neutral-900">{task}</strong>
                      </li>
                    ))}
                  </ul>
                  <div className="p-2.5 bg-red-50/70 border border-[#E60012]/30 rounded text-[11px] text-neutral-800">
                    <strong className="text-[#E60012] block mb-1">※ 핵심 기술 요건:</strong>
                    {previewRfp.requirementsSummary}
                  </div>
                </div>
              )}

              {previewPage === 3 && (
                <div className="space-y-3">
                  <h4 className="font-bold text-xs text-neutral-900 pb-1 border-b border-neutral-200">
                    4. 제안서 평가 기준
                  </h4>
                  <p className="text-[11px] text-neutral-700 leading-relaxed">
                    {previewRfp.evalSummary}
                  </p>
                  <table className="w-full border-collapse border border-neutral-200 text-[10px] mt-2">
                    <thead>
                      <tr className="bg-neutral-100 border-b border-neutral-200">
                        <th className="p-1.5 text-left">평가항목</th>
                        <th className="p-1.5 text-right">배점</th>
                        <th className="p-1.5 text-left">평가방식</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-neutral-200">
                        <td className="p-1.5 font-medium">정량평가 (경영상태, 유사실적)</td>
                        <td className="p-1.5 text-right font-bold">20점</td>
                        <td className="p-1.5">객관적 증빙 서류 심사</td>
                      </tr>
                      <tr className="border-b border-neutral-200">
                        <td className="p-1.5 font-medium">정성평가 (기술 및 수행방안)</td>
                        <td className="p-1.5 text-right font-bold">70점</td>
                        <td className="p-1.5">제안서 평가위원회 PT 심사</td>
                      </tr>
                      <tr>
                        <td className="p-1.5 font-medium">입찰가격평가</td>
                        <td className="p-1.5 text-right font-bold">10점</td>
                        <td className="p-1.5">기획재정부 계약예규 산식</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {previewPage === 4 && (
                <div className="space-y-3">
                  <h4 className="font-bold text-xs text-neutral-900 pb-1 border-b border-neutral-200">
                    5. 제출 서류 및 유의사항
                  </h4>
                  <ul className="text-[11px] text-neutral-700 space-y-1.5 list-disc pl-4">
                    <li>제안서 본문 100페이지 이내 작성 (PDF 형식)</li>
                    <li>블라인드 심사용 회사 식별 표식 제거본 1부 필히 동봉</li>
                    <li>최근 3년 간 유사 사업 수행실적 증명서 첨부</li>
                    <li>소프트웨어사업자 일반 현황 관리확인서 제출</li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Drawer Footer */}
          <div className="p-4 border-t border-neutral-200 bg-white flex items-center justify-between shrink-0">
            <span className="text-xs text-neutral-500">
              확인 후 수주 목록에 추가하세요.
            </span>
            <button
              onClick={() => {
                setModalRfp(previewRfp);
                setSelectedDeptForModal(previewRfp.department || 'AI사업본부');
                setPreviewRfp(null);
              }}
              className="px-4 py-2 rounded-md text-xs font-bold text-white bg-[#E60012] hover:bg-[#CC0010]"
            >
              수주 목록 추가
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
