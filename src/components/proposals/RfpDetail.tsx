import React, { useState } from 'react';
import { 
  RfpItem, 
  DocumentItem, 
  PWinEvaluation,
  PipelineStage 
} from '../../types';
import { 
  ArrowLeft, 
  FileText, 
  Upload, 
  Trash2, 
  Download, 
  Eye, 
  Edit2, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  Calendar,
  Coins,
  Share2,
  ChevronRight,
  X
} from 'lucide-react';
import { INITIAL_DOCUMENTS, SAMPLE_PWIN_EVALUATION, SAMPLE_RFPS } from '../../data/mockData';

interface RfpDetailProps {
  rfp?: RfpItem;
  onBackToPipeline?: () => void;
  onOpenConvertModal?: () => void;
  onStartProposal?: () => void;
  onShowToast: (msg: string) => void;
}

export const RfpDetail: React.FC<RfpDetailProps> = ({
  rfp: passedRfp,
  onBackToPipeline,
  onOpenConvertModal,
  onStartProposal,
  onShowToast
}) => {
  const rfp = passedRfp || SAMPLE_RFPS[0];
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'pwin'>('overview');
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [currentStage, setCurrentStage] = useState<PipelineStage>(rfp?.stage || '검토 중');

  const handleBack = () => {
    if (onBackToPipeline) onBackToPipeline();
  };

  const handleStartProposal = () => {
    if (onOpenConvertModal) onOpenConvertModal();
    else if (onStartProposal) onStartProposal();
  };

  // PWin State
  const [pwinMode, setPwinMode] = useState<'self' | 'ai'>('ai');
  const [pwinEval, setPwinEval] = useState<PWinEvaluation>(SAMPLE_PWIN_EVALUATION);
  const [selfScores, setSelfScores] = useState({
    competitive: '우수',
    pastExp: '우수',
    techCap: '보통',
    clientFit: '보통'
  });
  const [selfOverall, setSelfOverall] = useState<number>(70);

  // Document Preview Modal
  const [previewDoc, setPreviewDoc] = useState<DocumentItem | null>(null);

  // Self Evaluation Calculator
  const handleSelfScoreChange = (key: keyof typeof selfScores, value: string) => {
    const updated = { ...selfScores, [key]: value };
    setSelfScores(updated);

    const scoreMap: Record<string, number> = {
      '매우 우수': 100,
      '우수': 80,
      '보통': 60,
      '미흡': 40,
      '매우 미흡': 20
    };

    const calculated = Math.round(
      scoreMap[updated.competitive] * 0.25 +
      scoreMap[updated.pastExp] * 0.25 +
      scoreMap[updated.techCap] * 0.25 +
      scoreMap[updated.clientFit] * 0.25
    );
    setSelfOverall(calculated);
    onShowToast(`자가평가 PWin 점수가 ${calculated}%로 갱신되었습니다.`);
  };

  const handleRunAiPwin = () => {
    onShowToast('AI가 나라장터 RFP와 KPC 사내 실적 DB를 교차 분석 중입니다...');
    setTimeout(() => {
      setPwinEval(SAMPLE_PWIN_EVALUATION);
      setPwinMode('ai');
      onShowToast('AI PWin 평가가 완료되었습니다 (최종 수주확률 76%).');
    }, 600);
  };

  const handleAddSampleDoc = () => {
    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      fileName: '추가_행정안전부_보안지침_2026.pdf',
      type: 'PDF',
      size: '5.1 MB',
      uploader: '정소담',
      updatedAt: '2026.09.07',
      status: '업로드 완료'
    };
    setDocuments(prev => [newDoc, ...prev]);
    onShowToast('파일 업로드가 완료되었습니다.');
  };

  const handleDeleteDoc = (id: string, name: string) => {
    setDocuments(prev => prev.filter(d => d.id !== id));
    onShowToast(`'${name}' 문서가 삭제되었습니다.`);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[#F8F9FA] p-6">
      <div className="max-w-7xl mx-auto w-full space-y-5">
        {/* Top Header & Breadcrumb */}
        <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-1">
              <button onClick={handleBack} className="hover:text-[#111111]">
                파이프라인
              </button>
              <ChevronRight className="w-3 h-3 text-neutral-400" />
              <span>{rfp.department}</span>
              <ChevronRight className="w-3 h-3 text-neutral-400" />
              <span className="text-[#111111] font-semibold truncate max-w-xs">{rfp.title}</span>
            </div>
            <h1 className="text-xl font-black text-[#111111] tracking-tight">
              {rfp.title}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="back-to-pipeline-btn"
              onClick={handleBack}
              className="px-3 py-1.5 rounded-md text-xs font-semibold text-neutral-700 bg-white border border-neutral-300 hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              파이프라인으로 돌아가기
            </button>
            <button
              id="rfp-convert-proposal-btn"
              onClick={handleStartProposal}
              className="flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold text-white bg-neutral-900 hover:bg-neutral-800 shadow-sm transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-neutral-400" />
              <span>제안서 프로세스 시작 (작성 착수)</span>
            </button>
          </div>
        </div>

        {/* 3 Main Tabs: 1. 사업 개요, 2. 관련 문서, 3. PWin */}
        <div className="flex items-center gap-2 border-b border-neutral-200">
          {[
            { id: 'overview', label: '1. 사업 개요' },
            { id: 'documents', label: `2. 관련 문서 (${documents.length})` },
            { id: 'pwin', label: '3. PWin 수주가능성' }
          ].map(tab => (
            <button
              key={tab.id}
              id={`rfp-detail-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 px-4 text-xs font-bold transition-all relative ${
                activeTab === tab.id
                  ? 'text-[#111111]'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#E60012]" />
              )}
            </button>
          ))}
        </div>

        {/* TAB 1: 사업 개요 */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-3 gap-6">
            {/* Left 2 Cols: Main Info */}
            <div className="col-span-2 space-y-4">
              <div className="bg-white rounded-lg border border-neutral-200 p-5 shadow-2xs space-y-4">
                <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider pb-2 border-b border-neutral-100">
                  사업 기본 정보
                </h3>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-neutral-500 block mb-1">사업명</span>
                    <span className="font-bold text-[#111111]">{rfp.title}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block mb-1">발주기관</span>
                    <span className="font-bold text-[#111111]">{rfp.agency}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block mb-1">공고일</span>
                    <span className="text-neutral-800">{rfp.announcementDate}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block mb-1">제출 마감일</span>
                    <span className="font-bold text-[#E60012]">{rfp.deadline} 14:00</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block mb-1">계약금액</span>
                    <span className="font-bold text-neutral-900 text-sm">{rfp.budgetFormatted}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block mb-1">계약유형</span>
                    <span className="text-neutral-800">{rfp.contractType}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block mb-1">국가 / 언어</span>
                    <span className="text-neutral-800">{rfp.country} / {rfp.language}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block mb-1">담당자</span>
                    <span className="font-semibold text-neutral-800">{rfp.assignee} 수석컨설턴트</span>
                  </div>
                </div>
              </div>

              {/* Purpose & Tasks */}
              <div className="bg-white rounded-lg border border-neutral-200 p-5 shadow-2xs space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-[#111111] mb-1.5">사업 목적</h4>
                  <p className="text-xs text-neutral-700 leading-relaxed bg-[#F8F9FA] p-3 rounded border border-neutral-200">
                    {rfp.purpose}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-[#111111] mb-1.5">주요 과업 내용</h4>
                  <ul className="space-y-1.5 text-xs text-neutral-700 list-disc pl-4 leading-relaxed">
                    {rfp.tasks.map((task, idx) => (
                      <li key={idx}>
                        <strong>{task}</strong>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Right 1 Col: Properties Panel */}
            <div className="space-y-4">
              <div className="bg-white rounded-lg border border-neutral-200 p-4 shadow-2xs space-y-3.5 text-xs">
                <h3 className="font-bold text-neutral-900 pb-2 border-b border-neutral-100">
                  사업 속성 (Properties)
                </h3>

                <div>
                  <label className="text-neutral-500 block mb-1 text-[11px] font-semibold">
                    진행 상태
                  </label>
                  <select
                    value={currentStage}
                    onChange={e => {
                      setCurrentStage(e.target.value as PipelineStage);
                      onShowToast(`진행 상태가 [${e.target.value}]로 변경되었습니다.`);
                    }}
                    className="w-full bg-white border border-neutral-300 rounded p-1.5 font-semibold text-[#111111]"
                  >
                    <option value="검토 대기">검토 대기</option>
                    <option value="검토 중">검토 중</option>
                    <option value="진행">진행</option>
                    <option value="진행 안 함">진행 안 함</option>
                  </select>
                </div>

                <div>
                  <label className="text-neutral-500 block mb-1 text-[11px] font-semibold">
                    수주 가능성 (PWin)
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-neutral-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-[#E60012] h-full rounded-full transition-all duration-500"
                        style={{ width: `${rfp.pwin}%` }}
                      />
                    </div>
                    <span className="font-bold text-[#E60012]">{rfp.pwin}%</span>
                  </div>
                </div>

                <div>
                  <label className="text-neutral-500 block mb-1 text-[11px] font-semibold">
                    공고 출처 (Source)
                  </label>
                  <span className="text-neutral-700 block truncate font-medium">
                    {rfp.source}
                  </span>
                </div>

                <div>
                  <label className="text-neutral-500 block mb-1 text-[11px] font-semibold">
                    담당자
                  </label>
                  <span className="font-bold text-neutral-900">{rfp.assignee}</span>
                </div>

                <div>
                  <label className="text-neutral-500 block mb-1 text-[11px] font-semibold">
                    참여자
                  </label>
                  <div className="flex flex-wrap gap-1">
                    {rfp.participants.map((p, idx) => (
                      <span key={idx} className="bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded text-[11px]">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-neutral-500 block mb-1 text-[11px] font-semibold">
                    마지막 수정
                  </label>
                  <span className="text-neutral-600">{rfp.lastModified}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: 관련 문서 */}
        {activeTab === 'documents' && (
          <div className="bg-white rounded-lg border border-neutral-200 p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div>
                <h3 className="text-xs font-bold text-[#111111]">
                  프로젝트 첨부 및 참고 문서 (PDF, DOCX, PPTX, XLSX, HWP, TXT)
                </h3>
                <p className="text-[11px] text-neutral-500">
                  RFP 원문 및 수주 제안 시 참고할 기술자료, 유사실적을 관리합니다.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  id="add-document-btn"
                  onClick={handleAddSampleDoc}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-md text-xs font-semibold"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>문서 추가</span>
                </button>
              </div>
            </div>

            {/* Document Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-[#F8F9FA] border-b border-neutral-200 text-neutral-600 font-bold">
                    <th className="py-2 px-3">파일명</th>
                    <th className="py-2 px-3">유형</th>
                    <th className="py-2 px-3">크기</th>
                    <th className="py-2 px-3">업로드자</th>
                    <th className="py-2 px-3">업데이트 날짜</th>
                    <th className="py-2 px-3">상태</th>
                    <th className="py-2 px-3 text-right">작업</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {documents.map(doc => (
                    <tr key={doc.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-[#111111] flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#E60012] shrink-0" />
                        <span className="truncate max-w-sm">{doc.fileName}</span>
                        {doc.isRfp && (
                          <span className="text-[9px] bg-red-50 text-[#E60012] px-1 py-0.2 rounded font-bold border border-[#E60012]/30">
                            RFP
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-neutral-600">{doc.type}</td>
                      <td className="py-2.5 px-3 text-neutral-500">{doc.size}</td>
                      <td className="py-2.5 px-3 text-neutral-700">{doc.uploader}</td>
                      <td className="py-2.5 px-3 text-neutral-500">{doc.updatedAt}</td>
                      <td className="py-2.5 px-3">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 font-medium">
                          {doc.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setPreviewDoc(doc)}
                            className="p-1 hover:text-[#E60012] text-neutral-500"
                            title="미리보기"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onShowToast(`'${doc.fileName}' 파일 다운로드를 시작합니다.`)}
                            className="p-1 hover:text-[#111111] text-neutral-500"
                            title="다운로드"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteDoc(doc.id, doc.fileName)}
                            className="p-1 hover:text-red-700 text-neutral-400"
                            title="삭제"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: PWin (Probability of Win) */}
        {activeTab === 'pwin' && (
          <div className="space-y-5">
            {/* Top Score Gauge Card */}
            <div className="bg-white rounded-lg border border-neutral-200 p-6 shadow-2xs flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                  Probability of Win
                </span>
                <h3 className="text-lg font-black text-[#111111]">
                  PWin 수주 가능성 분석
                </h3>
                <p className="text-xs text-neutral-600">
                  경쟁 포지션, 과거 유사 실적, 기술 수행 역량, 고객사 적합도를 종합 평가합니다.
                </p>

                {/* Evaluation Mode Toggle */}
                <div className="flex items-center gap-2 pt-2">
                  <button
                    id="pwin-self-mode-btn"
                    onClick={() => setPwinMode('self')}
                    className={`px-3 py-1.5 rounded text-xs font-semibold border transition-all ${
                      pwinMode === 'self'
                        ? 'bg-[#111111] text-white border-[#111111]'
                        : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
                    }`}
                  >
                    자가평가
                  </button>
                  <button
                    id="pwin-ai-mode-btn"
                    onClick={() => setPwinMode('ai')}
                    className={`px-3 py-1.5 rounded text-xs font-semibold border transition-all ${
                      pwinMode === 'ai'
                        ? 'bg-[#E60012] text-white border-[#E60012]'
                        : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
                    }`}
                  >
                    AI 평가
                  </button>
                </div>
              </div>

              {/* Gauge Display */}
              <div className="flex items-center gap-4 pr-6">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#E9ECEF"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="#E60012"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 40}
                      strokeDashoffset={
                        2 * Math.PI * 40 * (1 - (pwinMode === 'ai' ? pwinEval.overallScore : selfOverall) / 100)
                      }
                      strokeLinecap="round"
                      className="transition-all duration-700"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-2xl font-black text-[#111111]">
                      {pwinMode === 'ai' ? pwinEval.overallScore : selfOverall}%
                    </span>
                    <span className="text-[10px] text-neutral-500 font-semibold">
                      {pwinMode === 'ai' ? 'AI 예측치' : '자가평가'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Self Evaluation View */}
            {pwinMode === 'self' && (
              <div className="bg-white rounded-lg border border-neutral-200 p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                  <h4 className="text-xs font-bold text-[#111111]">
                    자가평가 항목 (각 영역 가중치 25% 균등 배분)
                  </h4>
                  <span className="text-xs font-bold text-[#E60012]">
                    총합: {selfOverall}%
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  {/* 1. 경쟁 포지션 */}
                  <div className="p-3 bg-[#F8F9FA] rounded-md border border-neutral-200">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-neutral-800">1. 경쟁 포지션</span>
                      <span className="text-[11px] text-neutral-500 font-semibold">가중치 25%</span>
                    </div>
                    <select
                      value={selfScores.competitive}
                      onChange={e => handleSelfScoreChange('competitive', e.target.value)}
                      className="w-full bg-white border border-neutral-300 rounded p-1.5 font-medium text-neutral-800"
                    >
                      <option value="매우 우수">매우 우수 (100점)</option>
                      <option value="우수">우수 (80점)</option>
                      <option value="보통">보통 (60점)</option>
                      <option value="미흡">미흡 (40점)</option>
                      <option value="매우 미흡">매우 미흡 (20점)</option>
                    </select>
                  </div>

                  {/* 2. 과거 수행 경험 */}
                  <div className="p-3 bg-[#F8F9FA] rounded-md border border-neutral-200">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-neutral-800">2. 과거 수행 경험</span>
                      <span className="text-[11px] text-neutral-500 font-semibold">가중치 25%</span>
                    </div>
                    <select
                      value={selfScores.pastExp}
                      onChange={e => handleSelfScoreChange('pastExp', e.target.value)}
                      className="w-full bg-white border border-neutral-300 rounded p-1.5 font-medium text-neutral-800"
                    >
                      <option value="매우 우수">매우 우수 (100점)</option>
                      <option value="우수">우수 (80점)</option>
                      <option value="보통">보통 (60점)</option>
                      <option value="미흡">미흡 (40점)</option>
                      <option value="매우 미흡">매우 미흡 (20점)</option>
                    </select>
                  </div>

                  {/* 3. 기술 및 수행 역량 */}
                  <div className="p-3 bg-[#F8F9FA] rounded-md border border-neutral-200">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-neutral-800">3. 기술 및 수행 역량</span>
                      <span className="text-[11px] text-neutral-500 font-semibold">가중치 25%</span>
                    </div>
                    <select
                      value={selfScores.techCap}
                      onChange={e => handleSelfScoreChange('techCap', e.target.value)}
                      className="w-full bg-white border border-neutral-300 rounded p-1.5 font-medium text-neutral-800"
                    >
                      <option value="매우 우수">매우 우수 (100점)</option>
                      <option value="우수">우수 (80점)</option>
                      <option value="보통">보통 (60점)</option>
                      <option value="미흡">미흡 (40점)</option>
                      <option value="매우 미흡">매우 미흡 (20점)</option>
                    </select>
                  </div>

                  {/* 4. 고객 요구사항 적합도 */}
                  <div className="p-3 bg-[#F8F9FA] rounded-md border border-neutral-200">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-bold text-neutral-800">4. 고객 요구사항 적합도</span>
                      <span className="text-[11px] text-neutral-500 font-semibold">가중치 25%</span>
                    </div>
                    <select
                      value={selfScores.clientFit}
                      onChange={e => handleSelfScoreChange('clientFit', e.target.value)}
                      className="w-full bg-white border border-neutral-300 rounded p-1.5 font-medium text-neutral-800"
                    >
                      <option value="매우 우수">매우 우수 (100점)</option>
                      <option value="우수">우수 (80점)</option>
                      <option value="보통">보통 (60점)</option>
                      <option value="미흡">미흡 (40점)</option>
                      <option value="매우 미흡">매우 미흡 (20점)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* AI Evaluation View */}
            {pwinMode === 'ai' && (
              <div className="bg-white rounded-lg border border-neutral-200 p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                  <div>
                    <h4 className="text-xs font-bold text-[#111111] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#E60012]" />
                      AI 수주 가능성 심층 분석 결과
                    </h4>
                    <span className="text-[11px] text-neutral-500">
                      신뢰도: {pwinEval.confidence}% (RFP 정밀 매칭 및 사내 유사 실적 검증 기반)
                    </span>
                  </div>

                  <button
                    id="run-ai-pwin-btn"
                    onClick={handleRunAiPwin}
                    className="flex items-center gap-1 px-3 py-1.5 rounded bg-[#E60012] hover:bg-[#CC0010] text-white text-xs font-bold"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI로 다시 평가</span>
                  </button>
                </div>

                {/* AI Scores Breakdown Table */}
                <div className="space-y-3">
                  {[
                    {
                      label: '경쟁 포지션',
                      score: pwinEval.competitivePosition,
                      reason: pwinEval.reasoning.competitivePosition
                    },
                    {
                      label: '과거 수행 경험',
                      score: pwinEval.pastExperience,
                      reason: pwinEval.reasoning.pastExperience
                    },
                    {
                      label: '기술 및 수행 역량',
                      score: pwinEval.technicalCapability,
                      reason: pwinEval.reasoning.technicalCapability
                    },
                    {
                      label: '고객 요구사항 적합도',
                      score: pwinEval.clientFit,
                      reason: pwinEval.reasoning.clientFit
                    }
                  ].map((item, idx) => (
                    <div key={idx} className="p-3 rounded-md bg-[#F8F9FA] border border-neutral-200 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-neutral-900">{item.label}</span>
                        <span className="font-black text-[#E60012] text-sm">{item.score}점</span>
                      </div>
                      <p className="text-[11px] text-neutral-600 leading-relaxed mb-1">
                        {item.reason}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Sources & Evidence */}
                <div className="p-3 bg-neutral-100 rounded text-[11px] text-neutral-600 space-y-1">
                  <span className="font-bold text-neutral-800 block">AI 판단 근거 및 출처:</span>
                  {pwinEval.sources.map((src, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-[#E60012]" />
                      <span>{src}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Document Preview Simple Modal */}
      {previewDoc && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-neutral-200 max-w-lg w-full p-5 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 mb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#E60012]" />
                <h3 className="text-xs font-bold text-[#111111] truncate max-w-sm">
                  {previewDoc.fileName}
                </h3>
              </div>
              <button onClick={() => setPreviewDoc(null)}>
                <X className="w-4 h-4 text-neutral-400" />
              </button>
            </div>
            <div className="bg-[#F8F9FA] p-4 rounded border border-neutral-200 text-xs text-neutral-700 space-y-2 mb-4">
              <p><strong>파일 크기:</strong> {previewDoc.size}</p>
              <p><strong>업로더:</strong> {previewDoc.uploader}</p>
              <p><strong>등록일:</strong> {previewDoc.updatedAt}</p>
              <p><strong>문서 상태:</strong> {previewDoc.status}</p>
              <div className="p-3 bg-white rounded border border-neutral-200 text-[11px] text-neutral-600">
                본 문서는 한국생산성본부 보안 규정에 따라 암호화 저장되어 있으며, AI 분석 엔진에 정상 연동되어 있습니다.
              </div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-1.5 bg-neutral-900 text-white rounded text-xs font-semibold"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
