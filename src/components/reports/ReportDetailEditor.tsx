import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Save, 
  Sparkles, 
  FileText, 
  Download, 
  Printer, 
  Plus, 
  Trash2, 
  Check, 
  RefreshCw, 
  Edit3, 
  Layers, 
  MessageSquare, 
  Bot, 
  CheckCircle2, 
  AlertCircle, 
  ChevronDown, 
  ChevronUp,
  Tag,
  Calendar,
  User,
  Building2,
  Undo2
} from 'lucide-react';
import { ReportItem, ReportSection } from '../../types';

interface ReportDetailEditorProps {
  report: ReportItem;
  onBack: () => void;
  onSave: (updatedReport: ReportItem) => void;
  onShowToast: (msg: string) => void;
}

// Helper to generate default sections if report doesn't have sections
const generateDefaultSections = (rep: ReportItem): ReportSection[] => {
  return [
    {
      id: 'sec-1',
      title: '1. 개요 및 추진 배경',
      category: '추진 개요',
      content: `본 보고서는 '${rep.title}' 과제와 관련하여, 급변하는 대내외 산업 환경 및 정부 정책 기조를 심층 진단하고 실효성 있는 대응 전략을 제시하고자 작성되었습니다.\n\n주요 목표:\n- 당면 과제에 대한 종합 현황 및 핵심 이슈 분석\n- 사내 축적 지식(RAG)과 공공 데이터 결합을 통한 실증 지표 도출\n- 단계별 실행 방안 및 구체적 이행 과제 제언`,
      lastModified: '2026.09.08 14:00'
    },
    {
      id: 'sec-2',
      title: '2. 현황 진단 및 핵심 환경 분석',
      category: '환경 분석',
      content: `최근 3개년 동안의 정량적 통계 및 유관 공공·민간 사례 분석 결과, 당해 영역에서의 혁신 및 체질 개선 요구가 급증하고 있습니다.\n\n주요 진단 지표:\n1) 인프라 도입률: 전년 대비 34.2% 증가\n2) 운영 효율성 및 TFP: 초기 도입 비용 대비 중장기 운영 생산성 22.8% 향상 가능성 확인\n3) 주요 리스크 요인: 제도적 규제 가이드라인 미비 및 사내 전담 전문 인력 부족`,
      lastModified: '2026.09.08 14:15'
    },
    {
      id: 'sec-3',
      title: '3. 세부 분석 및 실증 비교',
      category: '실증 분석',
      content: `${rep.summary}\n\n사내외 유사 프로젝트 15건의 벤치마킹을 통하여 도출된 성공 핵심 요소(CSF)는 다음과 같습니다:\n- 데이터 주도적 의사결정 체계 조기 정착\n- 부서 간 칸막이 제거를 위한 전사 거버넌스 협의체 구성\n- 단계적 성과 관리 KPI 측정 및 분기별 피드백 루프 운영`,
      lastModified: '2026.09.08 14:30'
    },
    {
      id: 'sec-4',
      title: '4. KPC 전략적 제언 및 실행 로드맵',
      category: '전략 제언',
      content: `한국생산성본부(KPC)의 전문 진단 모델을 바탕으로 한 단계별 실행 로드맵:\n\n[1단계: 기반 구축(1~3개월)] - 내부 거버넌스 정립 및 실무진 역량 강화 교육\n[2단계: 시범 고도화(4~8개월)] - 핵심 파일럿 과제 수행 및 성과 지표 검증\n[3단계: 전사 확산(9~12개월)] - 모범 사례 표준화 및 전사 통합 시스템 연계 구축`,
      lastModified: '2026.09.08 14:45'
    }
  ];
};

export const ReportDetailEditor: React.FC<ReportDetailEditorProps> = ({
  report,
  onBack,
  onSave,
  onShowToast
}) => {
  // Report state
  const [title, setTitle] = useState(report.title);
  const [type, setType] = useState(report.type);
  const [summary, setSummary] = useState(report.summary);
  const [status, setStatus] = useState(report.status || '초안 완료');
  const [sections, setSections] = useState<ReportSection[]>(() => {
    if (report.sections && report.sections.length > 0) {
      return report.sections;
    }
    return generateDefaultSections(report);
  });

  // Editor active state
  const [activeSectionId, setActiveSectionId] = useState<string>(sections[0]?.id || 'sec-1');
  const [isSaved, setIsSaved] = useState(true);

  // AI Modification state
  const [aiTargetSection, setAiTargetSection] = useState<'all' | string>(sections[0]?.id || 'sec-1');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<{
    targetTitle: string;
    original: string;
    revised: string;
    explanation: string;
  } | null>(null);

  // Mark unsaved when changes occur
  const handleContentChange = (sectionId: string, newContent: string) => {
    setSections(prev => prev.map(s => s.id === sectionId ? { ...s, content: newContent, lastModified: '방금 수정됨' } : s));
    setIsSaved(false);
  };

  const handleTitleChange = (sectionId: string, newTitle: string) => {
    setSections(prev => prev.map(s => s.id === sectionId ? { ...s, title: newTitle } : s));
    setIsSaved(false);
  };

  // Add new section
  const handleAddSection = () => {
    const newIdx = sections.length + 1;
    const newSec: ReportSection = {
      id: `sec-${Date.now()}`,
      title: `${newIdx}. 신규 분석 항목`,
      category: '추가 분석',
      content: '이 영역에 신규 분석 내용, 데이터 및 제언 사항을 직접 입력하거나 AI 수정을 요청하세요.',
      lastModified: '방금 생성됨'
    };
    setSections(prev => [...prev, newSec]);
    setActiveSectionId(newSec.id);
    setIsSaved(false);
    onShowToast(`'${newSec.title}' 섹션이 추가되었습니다.`);
  };

  // Delete section
  const handleDeleteSection = (secId: string, secTitle: string) => {
    if (sections.length <= 1) {
      onShowToast('최소 1개 이상의 섹션이 유지되어야 합니다.');
      return;
    }
    setSections(prev => prev.filter(s => s.id !== secId));
    if (activeSectionId === secId) {
      const remaining = sections.filter(s => s.id !== secId);
      if (remaining.length > 0) setActiveSectionId(remaining[0].id);
    }
    setIsSaved(false);
    onShowToast(`'${secTitle}' 섹션이 삭제되었습니다.`);
  };

  // Direct Save
  const handleDirectSave = () => {
    const updated: ReportItem = {
      ...report,
      title: title.trim(),
      type,
      summary: summary.trim(),
      status,
      updatedAt: '2026.09.08',
      sections
    };
    onSave(updated);
    setIsSaved(true);
    onShowToast(`'${updated.title}' 보고서 수정 사항이 저장되었습니다.`);
  };

  // AI Modification Preset triggers
  const handleRunAiQuickAction = (actionType: string) => {
    setIsAiProcessing(true);
    setAiSuggestion(null);

    const targetSec = sections.find(s => s.id === aiTargetSection);
    const targetName = targetSec ? targetSec.title : '전체 보고서';
    const originalText = targetSec ? targetSec.content : summary;

    setTimeout(() => {
      let revisedText = '';
      let explanation = '';

      if (actionType === 'tone') {
        revisedText = originalText
          .replace(/작성되었습니다/g, '체계적으로 정립하여 제시합니다')
          .replace(/요구가 급증하고 있습니다/g, '요구가 전년 동기 대비 급격히 고조되고 있는 실정입니다')
          .replace(/다음과 같습니다:/g, '다음과 같이 종합적으로 규명되었습니다:')
          .concat('\n\n[KPC 전문 총평]: 공공 부문의 신뢰성 및 투명성 제고를 위해 객관적 지표 중심의 종결형 문체로 격식도를 최상위로 통일하였습니다.');
        explanation = '공공기관 및 경영진 보고용 공식 격식체(종결형)로 문맥과 어조를 다듬었습니다.';
      } else if (actionType === 'data') {
        revisedText = originalText + `\n\n[KPC 실증 통계 및 비교 지표 (2026년 기준)]\n- 예산 대비 비용 절감 효과(ROI): 연간 약 18.7% 절감 기대\n- 전사 업무 프로세스 자동화 리드타임: 기존 14일 → 3.5일로 75% 단축\n- 유사 공공기관 30개사 만족도 평균: 89.4점 (전년 대비 +6.2p)`;
        explanation = '신뢰도를 뒷받침할 구체적인 수치, 연간 ROI 지표 및 리드타임 비교 데이터를 추가했습니다.';
      } else if (actionType === 'recommendation') {
        revisedText = originalText + `\n\n[KPC 3대 핵심 추진 전략 과제]\n1. 범부처·전사 통합 AI 표준 데이터 거버넌스 가이드라인 제정\n2. 실무자 중심 현장 밀착형 실습 교육 및 AI Worker 도입 확산\n3. 조달청·기재부 표준 평가 지표와 연계된 분기별 성과 모니터링 체계 구축`;
        explanation = '실행력을 극대화하는 KPC 3대 핵심 추진 과제와 성과 모니터링 방안을 보강했습니다.';
      } else if (actionType === 'proofread') {
        revisedText = originalText.trim() + '\n\n(문법 오탈자 3건 교정 완료: 비문 수정 및 공공 용어 표준화 반영)';
        explanation = '어색한 비문을 수정하고, 공공 조달 및 표준 보고서 용어로 교정했습니다.';
      } else if (actionType === 'summary') {
        revisedText = `[임원 보고용 3줄 핵심 결론 요약]\n1. ${title}과 관련하여 공공·산업계 도입 필요성이 급격히 증대됨.\n2. 사내 RAG 기반 실증 분석 결과, 업무 생산성 22% 향상 및 리드타임 75% 단축 가능성을 확인.\n3. 조기 성과 창출을 위해 3단계 실행 로드맵 및 전사 거버넌스 협의체 가동을 강력 제언함.`;
        explanation = '임원 및 경영진 신속 의사결정을 위한 3줄 핵심 요약문을 신규 구성했습니다.';
      }

      setAiSuggestion({
        targetTitle: targetName,
        original: originalText,
        revised: revisedText,
        explanation
      });
      setIsAiProcessing(false);
      onShowToast(`AI가 '${targetName}'에 대한 수정안을 생성했습니다.`);
    }, 1100);
  };

  // Custom AI Prompt Submit
  const handleRunCustomAiPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) {
      onShowToast('AI에게 요청할 수정 지시사항을 입력해주세요.');
      return;
    }

    setIsAiProcessing(true);
    setAiSuggestion(null);

    const targetSec = sections.find(s => s.id === aiTargetSection);
    const targetName = targetSec ? targetSec.title : '보고서 전체';
    const originalText = targetSec ? targetSec.content : summary;

    setTimeout(() => {
      const revisedText = `${originalText}\n\n[AI 맞춤 수정 반영: "${aiPrompt.trim()}"]\n- 지시사항에 따라 최신 산업 트렌드 및 사내 축적 지식베이스(RAG)를 인용하여 내용을 보강하였습니다.\n- 정책 적합성 및 세부 규제 준수 방안을 논리적으로 상호 보완하였습니다.`;
      
      setAiSuggestion({
        targetTitle: targetName,
        original: originalText,
        revised: revisedText,
        explanation: `사용자 프롬프트("${aiPrompt.slice(0, 20)}...")에 따라 맞춤 수정을 완료했습니다.`
      });
      setIsAiProcessing(false);
      setAiPrompt('');
      onShowToast(`AI 수정안이 생성되었습니다.`);
    }, 1200);
  };

  // Apply AI Suggestion
  const handleApplyAiSuggestion = () => {
    if (!aiSuggestion) return;

    if (aiTargetSection === 'all') {
      setSummary(aiSuggestion.revised);
    } else {
      setSections(prev => prev.map(s => 
        s.id === aiTargetSection 
          ? { ...s, content: aiSuggestion.revised, lastModified: 'AI 수정 반영됨' } 
          : s
      ));
    }

    setIsSaved(false);
    onShowToast(`'${aiSuggestion.targetTitle}'에 AI 수정안이 성공적으로 반영되었습니다.`);
    setAiSuggestion(null);
  };

  const currentSection = sections.find(s => s.id === activeSectionId) || sections[0];

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#F8F9FA]">
      {/* Top Header Bar */}
      <div className="h-14 bg-white border-b border-neutral-200 px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onBack}
            className="p-1.5 rounded-md hover:bg-neutral-100 text-neutral-600 hover:text-[#111111] transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
            title="보고서 목록으로 돌아가기"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">목록으로</span>
          </button>

          <div className="h-4 w-px bg-neutral-200" />

          {/* Title & Badge */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[10px] font-bold text-[#E60012] bg-red-50 px-2 py-0.5 rounded-full border border-red-100 shrink-0">
              {type}
            </span>
            <input
              type="text"
              value={title}
              onChange={e => {
                setTitle(e.target.value);
                setIsSaved(false);
              }}
              className="font-bold text-sm text-[#111111] truncate bg-transparent hover:bg-neutral-50 focus:bg-white focus:outline-none px-1.5 py-0.5 rounded border border-transparent focus:border-neutral-300 transition-colors w-[220px] sm:w-[380px] md:w-[500px]"
              title="클릭하여 보고서 제목 수정"
            />
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] text-neutral-400 hidden md:inline">
            {isSaved ? '모든 변경사항 저장됨' : '수정 사항 있음 (미저장)'}
          </span>

          <select
            value={status}
            onChange={e => {
              setStatus(e.target.value as any);
              setIsSaved(false);
            }}
            className="text-[11px] font-bold px-2 py-1 rounded border border-neutral-200 bg-white text-neutral-700 focus:outline-none"
          >
            <option value="초안 완료">초안 완료</option>
            <option value="작성 중">작성 중</option>
            <option value="검토 중">검토 중</option>
            <option value="작성 완료">작성 완료</option>
          </select>

          <button
            onClick={handleDirectSave}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-bold transition-all shadow-2xs cursor-pointer ${
              !isSaved 
                ? 'bg-[#E60012] hover:bg-[#CC0010] text-white shadow-xs animate-pulse'
                : 'bg-neutral-800 hover:bg-black text-white'
            }`}
          >
            <Save className="w-3.5 h-3.5" />
            <span>직접 저장</span>
          </button>

          <button
            onClick={() => onShowToast(`'${title}' 문서를 DOCX/PDF로 내보냈습니다.`)}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 bg-white border border-neutral-200 hover:bg-neutral-50 text-neutral-700 rounded-md text-xs font-semibold transition-colors cursor-pointer"
            title="문서 내보내기"
          >
            <Download className="w-3.5 h-3.5 text-neutral-500" />
            <span>내보내기</span>
          </button>
        </div>
      </div>

      {/* Main Workspace (Split View: Direct Editor on Left, AI Modification on Right) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left / Center: Direct Content Editor */}
        <div className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-6 space-y-5 border-r border-neutral-200">
          {/* Executive Summary Card */}
          <div className="bg-white rounded-xl border border-neutral-200 p-4 shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#E60012]" />
                보고서 핵심 요약 (Executive Summary)
              </label>
              <span className="text-[10px] text-neutral-400">
                {summary.length}자
              </span>
            </div>
            <textarea
              rows={3}
              value={summary}
              onChange={e => {
                setSummary(e.target.value);
                setIsSaved(false);
              }}
              className="w-full text-xs text-neutral-700 bg-neutral-50/50 hover:bg-neutral-50 focus:bg-white rounded-lg border border-neutral-200 p-3 leading-relaxed focus:outline-none focus:border-[#E60012] transition-colors resize-y"
              placeholder="보고서의 핵심 목적, 주요 진단 결과 및 전략적 제언을 요약 입력하세요."
            />
          </div>

          {/* Sections Navigation Tabs */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
              {sections.map((sec, idx) => (
                <button
                  key={sec.id}
                  onClick={() => setActiveSectionId(sec.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeSectionId === sec.id
                      ? 'bg-neutral-900 text-white shadow-2xs'
                      : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
                  }`}
                >
                  <span>{idx + 1}장</span>
                  <span className="truncate max-w-[120px]">{sec.title.replace(/^\d+\.\s*/, '')}</span>
                </button>
              ))}

              <button
                onClick={handleAddSection}
                className="px-2.5 py-1.5 bg-white border border-dashed border-neutral-300 hover:border-[#E60012] text-neutral-500 hover:text-[#E60012] rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer ml-1 whitespace-nowrap transition-colors"
                title="신규 섹션 추가"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>섹션 추가</span>
              </button>
            </div>
          </div>

          {/* Active Section Content Editor */}
          {currentSection && (
            <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-2xs flex-1 flex flex-col space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-neutral-100 gap-2">
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-[11px] font-bold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded shrink-0">
                    섹션 제목
                  </span>
                  <input
                    type="text"
                    value={currentSection.title}
                    onChange={e => handleTitleChange(currentSection.id, e.target.value)}
                    className="font-bold text-sm text-[#111111] flex-1 bg-transparent hover:bg-neutral-50 focus:bg-white px-2 py-1 rounded border border-transparent focus:border-neutral-300 transition-colors"
                    placeholder="섹션 제목을 입력하세요"
                  />
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-neutral-400">
                    {currentSection.lastModified || '최근 수정'}
                  </span>
                  <button
                    onClick={() => handleDeleteSection(currentSection.id, currentSection.title)}
                    className="p-1 text-neutral-400 hover:text-red-600 rounded transition-colors cursor-pointer"
                    title="이 섹션 삭제"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Direct Content Textarea */}
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-1.5 text-[11px] text-neutral-500">
                  <span className="font-semibold text-neutral-700">본문 내용 직접 편집</span>
                  <span>{currentSection.content.length}자</span>
                </div>
                <textarea
                  rows={14}
                  value={currentSection.content}
                  onChange={e => handleContentChange(currentSection.id, e.target.value)}
                  className="w-full flex-1 text-xs sm:text-sm text-neutral-800 bg-[#FAFAFA] hover:bg-white focus:bg-white rounded-lg border border-neutral-200 p-4 leading-relaxed font-sans focus:outline-none focus:border-[#E60012] transition-colors resize-y min-h-[280px]"
                  placeholder="본문 내용을 입력하세요. 상단의 'AI로 수정' 메뉴를 활용하여 어조 변경, 통계 보강, 요약 생성을 즉시 수행할 수 있습니다."
                />
              </div>

              {/* Footer info */}
              <div className="flex items-center justify-between pt-2 text-[11px] text-neutral-400 border-t border-neutral-100">
                <span>작성자: {report.author} ({report.department || 'KPC'})</span>
                <button
                  onClick={() => {
                    setAiTargetSection(currentSection.id);
                    onShowToast(`'${currentSection.title}'이(가) AI 수정 대상으로 선택되었습니다.`);
                  }}
                  className="text-[#E60012] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>이 섹션을 AI로 수정하기</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: AI Modification Assistant (AI로 수정) */}
        <div className="w-full lg:w-[420px] bg-white flex flex-col h-auto lg:h-full border-t lg:border-t-0 lg:border-l border-neutral-200 p-4 sm:p-5 overflow-y-auto space-y-4 shrink-0">
          {/* AI Header */}
          <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-red-50 text-[#E60012] flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#111111]">AI 보고서 어시스턴트 (AI로 수정)</h3>
                <p className="text-[10px] text-neutral-500">어조 교정, 데이터 보강, 전략 제언 자동 생성</p>
              </div>
            </div>
          </div>

          {/* AI Target Selector */}
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1.5">
              수정 대상 영역 선택
            </label>
            <select
              value={aiTargetSection}
              onChange={e => setAiTargetSection(e.target.value)}
              className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-neutral-800 focus:outline-none focus:border-[#E60012]"
            >
              <option value="all">전체 보고서 (요약문 및 종합)</option>
              {sections.map(sec => (
                <option key={sec.id} value={sec.id}>
                  {sec.title}
                </option>
              ))}
            </select>
          </div>

          {/* Quick AI Action Buttons */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-neutral-700">
              원클릭 빠른 AI 수정
            </label>
            <div className="grid grid-cols-1 gap-1.5">
              <button
                onClick={() => handleRunAiQuickAction('tone')}
                disabled={isAiProcessing}
                className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-50 hover:bg-red-50 hover:border-red-200 border border-neutral-200 text-left transition-colors cursor-pointer group disabled:opacity-50"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#E60012]" />
                  <span className="text-xs font-semibold text-neutral-700 group-hover:text-[#E60012]">
                    공문서·컨설팅 격식체로 다듬기
                  </span>
                </div>
                <span className="text-[10px] text-neutral-400">문맥/어조</span>
              </button>

              <button
                onClick={() => handleRunAiQuickAction('data')}
                disabled={isAiProcessing}
                className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-50 hover:bg-red-50 hover:border-red-200 border border-neutral-200 text-left transition-colors cursor-pointer group disabled:opacity-50"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#E60012]" />
                  <span className="text-xs font-semibold text-neutral-700 group-hover:text-[#E60012]">
                    KPC 실증 통계 및 ROI 지표 보강
                  </span>
                </div>
                <span className="text-[10px] text-neutral-400">데이터 확장</span>
              </button>

              <button
                onClick={() => handleRunAiQuickAction('recommendation')}
                disabled={isAiProcessing}
                className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-50 hover:bg-red-50 hover:border-red-200 border border-neutral-200 text-left transition-colors cursor-pointer group disabled:opacity-50"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#E60012]" />
                  <span className="text-xs font-semibold text-neutral-700 group-hover:text-[#E60012]">
                    KPC 3대 핵심 추진 전략 과제 도출
                  </span>
                </div>
                <span className="text-[10px] text-neutral-400">전략 제언</span>
              </button>

              <button
                onClick={() => handleRunAiQuickAction('summary')}
                disabled={isAiProcessing}
                className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-50 hover:bg-red-50 hover:border-red-200 border border-neutral-200 text-left transition-colors cursor-pointer group disabled:opacity-50"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#E60012]" />
                  <span className="text-xs font-semibold text-neutral-700 group-hover:text-[#E60012]">
                    임원 보고용 3줄 핵심 결론 생성
                  </span>
                </div>
                <span className="text-[10px] text-neutral-400">핵심 요약</span>
              </button>
            </div>
          </div>

          {/* Custom Prompt Input */}
          <form onSubmit={handleRunCustomAiPrompt} className="space-y-2 pt-2 border-t border-neutral-100">
            <label className="block text-xs font-bold text-neutral-700">
              맞춤 AI 지시사항 (자유 프롬프트)
            </label>
            <textarea
              rows={3}
              value={aiPrompt}
              onChange={e => setAiPrompt(e.target.value)}
              placeholder="예: 2026년 공공 DX 예산 감축에 따른 민간 협력 방안 문단을 추가해줘"
              className="w-full text-xs text-neutral-800 bg-neutral-50 rounded-lg border border-neutral-200 p-2.5 leading-relaxed focus:outline-none focus:border-[#E60012] focus:bg-white transition-colors resize-none"
            />
            <button
              type="submit"
              disabled={isAiProcessing || !aiPrompt.trim()}
              className="w-full flex items-center justify-center gap-1.5 py-2 bg-[#E60012] hover:bg-[#CC0010] text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {isAiProcessing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>AI 수정안 생성 중...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI 수정 요청 실행</span>
                </>
              )}
            </button>
          </form>

          {/* AI Suggestion / Diff Preview Card */}
          {aiSuggestion && (
            <div className="bg-red-50/50 rounded-xl border border-red-200 p-4 space-y-3 animate-in fade-in-50 duration-150">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#E60012] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  AI 수정 제안 ({aiSuggestion.targetTitle})
                </span>
                <span className="text-[10px] text-neutral-500">
                  {aiSuggestion.explanation}
                </span>
              </div>

              <div className="max-h-56 overflow-y-auto bg-white rounded-lg border border-red-100 p-3 text-xs text-neutral-800 leading-relaxed font-sans whitespace-pre-wrap">
                {aiSuggestion.revised}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleApplyAiSuggestion}
                  className="flex-1 flex items-center justify-center gap-1 py-1.5 bg-[#E60012] hover:bg-[#CC0010] text-white rounded-md text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>보고서에 즉시 반영</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAiSuggestion(null)}
                  className="px-3 py-1.5 bg-white hover:bg-neutral-100 text-neutral-600 rounded-md text-xs font-medium border border-neutral-200 transition-colors cursor-pointer"
                >
                  취소
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
