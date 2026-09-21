import React, { useState } from 'react';
import { 
  X, 
  Play, 
  Sparkles, 
  CheckCircle2, 
  Copy, 
  Check, 
  Layers, 
  ShieldCheck, 
  ExternalLink,
  ArrowRight,
  RefreshCw,
  FileText,
  BarChart2,
  TrendingUp,
  Cpu,
  Coins,
  Building2
} from 'lucide-react';
import { CustomAiApp } from '../../data/customAiMockData';

interface CustomAiDetailModalProps {
  app: CustomAiApp | null;
  onClose: () => void;
  onNavigateTab?: (tab: string) => void;
  onShowToast: (msg: string) => void;
}

export const CustomAiDetailModal: React.FC<CustomAiDetailModalProps> = ({
  app,
  onClose,
  onNavigateTab,
  onShowToast
}) => {
  if (!app) return null;

  const [activeTab, setActiveTab] = useState<'overview' | 'analytics'>('overview');
  const [inputVal, setInputVal] = useState(app.sampleInput);
  const [isRunning, setIsRunning] = useState(false);
  const [outputResult, setOutputResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleRun = () => {
    setIsRunning(true);
    setOutputResult(null);
    setTimeout(() => {
      setIsRunning(false);
      setOutputResult(app.sampleOutput);
      onShowToast(`'${app.name}' 실행이 완료되었습니다.`);
    }, 600);
  };

  const handleCopy = () => {
    if (outputResult) {
      navigator.clipboard.writeText(outputResult);
      setCopied(true);
      onShowToast('결과가 클립보드에 복사되었습니다.');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleGoToProposal = () => {
    onClose();
    if (onNavigateTab) {
      onNavigateTab('proposals');
      onShowToast('제안서 생성 프로세스 화면으로 이동했습니다.');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        id="custom-ai-detail-modal"
        className="bg-white rounded-xl shadow-2xl border border-neutral-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-neutral-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-neutral-900 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5 text-[#E60012]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-neutral-900">{app.name}</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-200 text-neutral-700">
                  {app.category}
                </span>
                <span className="text-xs text-neutral-400 font-mono">{app.version}</span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">{app.shortDesc}</p>
            </div>
          </div>

          <button
            id="modal-close-btn"
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-neutral-200 px-6 bg-neutral-50 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'border-[#E60012] text-[#E60012]'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>서비스 개요 & 테스트</span>
          </button>
          <button
            type="button"
            id="custom-ai-tab-analytics-btn"
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'analytics'
                ? 'border-[#E60012] text-[#E60012]'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>사용 현황</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 min-h-0 text-xs text-neutral-700">
          {activeTab === 'overview' ? (
            <>
          {/* Detailed Description */}
          <div>
            <h4 className="font-bold text-neutral-900 mb-1">서비스 개요</h4>
            <p className="leading-relaxed text-neutral-600 bg-neutral-50 p-3 rounded-lg border border-neutral-200/80">
              {app.description}
            </p>
          </div>

          {/* Key Features */}
          <div>
            <h4 className="font-bold text-neutral-900 mb-2">주요 핵심 기능</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {app.features.map((feat, idx) => (
                <div 
                  key={idx} 
                  className="flex items-start gap-2 p-2.5 rounded-lg border border-neutral-200 bg-white"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#E60012] shrink-0 mt-0.5" />
                  <span className="text-[11.5px] leading-tight text-neutral-700">{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Live Demo Runner */}
          <div className="border border-neutral-200 rounded-xl p-4 bg-neutral-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-neutral-900 flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5 text-[#E60012]" />
                <span>서비스 즉시 실행 테스트</span>
              </h4>
              <span className="text-[11px] text-neutral-500">사내 망분리 sLLM 연동</span>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-neutral-600 mb-1">
                테스트 입력 대상 (샘플 파일/텍스트)
              </label>
              <textarea
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                rows={2}
                className="w-full text-xs p-2.5 rounded-lg border border-neutral-300 bg-white outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <button
                  id="modal-run-test-btn"
                  onClick={handleRun}
                  disabled={isRunning || !inputVal.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-bold text-white bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 transition-all cursor-pointer shadow-xs"
                >
                  {isRunning ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#E60012]" />
                      <span>분석 및 처리 중...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current text-[#E60012]" />
                      <span>실행하기</span>
                    </>
                  )}
                </button>

                {app.id === 'app-rfp-review' && (
                  <button
                    id="modal-goto-proposal-btn"
                    onClick={handleGoToProposal}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-semibold text-neutral-700 bg-white border border-neutral-300 hover:bg-neutral-100 transition-colors cursor-pointer"
                  >
                    <span>제안서 프로세스에서 열기</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <span className="text-[11px] text-neutral-400">
                운영 부서: {app.department}
              </span>
            </div>

            {/* Output Result */}
            {outputResult && (
              <div className="mt-3 p-3.5 rounded-lg bg-white border border-neutral-200 space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-700 flex items-center gap-1 text-[11.5px]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>실행 결과</span>
                  </span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1 text-[11px] text-neutral-500 hover:text-neutral-800 px-2 py-0.5 rounded hover:bg-neutral-100 transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-600">복사됨</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>복사</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="text-xs text-neutral-800 leading-relaxed whitespace-pre-line bg-neutral-50 p-2.5 rounded border border-neutral-100">
                  {outputResult}
                </p>
              </div>
            )}
          </div>
        </>
      ) : (
        /* 사용 현황 (Analytics) */
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* 4대 주요 메트릭 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
              <div className="flex items-center justify-between text-neutral-500 mb-1">
                <span className="text-[11px] font-medium">전체 실행 횟수</span>
                <TrendingUp className="w-3.5 h-3.5 text-[#E60012]" />
              </div>
              <div className="text-lg font-extrabold text-neutral-900 font-mono">
                {app.usageCount.toLocaleString()}회
              </div>
              <span className="text-[10px] text-emerald-600 font-medium">전월 대비 +24.1%</span>
            </div>

            <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
              <div className="flex items-center justify-between text-neutral-500 mb-1">
                <span className="text-[11px] font-medium">토큰 사용량 (Token)</span>
                <Cpu className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <div className="text-lg font-extrabold text-neutral-900 font-mono">
                {(app.usageCount * 55 / 1000).toFixed(0)}K
              </div>
              <span className="text-[10px] text-neutral-400">누적 {((app.usageCount * 55)).toLocaleString()} Token</span>
            </div>

            <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
              <div className="flex items-center justify-between text-neutral-500 mb-1">
                <span className="text-[11px] font-medium">발생 비용 (예상)</span>
                <Coins className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div className="text-lg font-extrabold text-neutral-900 font-mono">
                ₩{Math.round(app.usageCount * 3.4).toLocaleString()}
              </div>
              <span className="text-[10px] text-neutral-400">당월 발생 누적</span>
            </div>

            <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
              <div className="flex items-center justify-between text-neutral-500 mb-1">
                <span className="text-[11px] font-medium">주요 사용 부서</span>
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <div className="text-xs font-bold text-neutral-900 truncate">
                {app.department.split('/')[0].trim()}
              </div>
              <span className="text-[10px] text-neutral-500">점유율 46.8%</span>
            </div>
          </div>

          {/* 일별 실행 추이 (Bar Chart) */}
          <div className="p-4 bg-white rounded-xl border border-neutral-200 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                  <BarChart2 className="w-4 h-4 text-[#E60012]" />
                  <span>최근 7일간 일별 실행 추이</span>
                </h4>
                <span className="text-[11px] text-neutral-500">일일 평균 약 {Math.round(app.usageCount / 14)}회 실행</span>
              </div>
              <span className="text-[11px] font-mono text-neutral-400">2026.09.07 ~ 09.13</span>
            </div>

            <div className="h-28 flex items-end justify-between gap-3 pt-3 px-2 border-b border-neutral-100">
              {[
                { day: '09.07', count: 48, height: '45%' },
                { day: '09.08', count: 62, height: '60%' },
                { day: '09.09', count: 95, height: '90%' },
                { day: '09.10', count: 80, height: '75%' },
                { day: '09.11', count: 104, height: '100%' },
                { day: '09.12', count: 72, height: '68%' },
                { day: '오늘', count: 58, height: '55%', active: true }
              ].map((bar, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1 group h-full justify-end">
                  <span className="text-[10px] font-mono font-bold text-neutral-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    {bar.count}회
                  </span>
                  <div className="w-full max-w-[32px] bg-neutral-100 rounded-t-md h-full flex items-end overflow-hidden">
                    <div 
                      className={`w-full rounded-t-md transition-all ${
                        bar.active ? 'bg-[#E60012]' : 'bg-neutral-800'
                      }`}
                      style={{ height: bar.height }}
                    />
                  </div>
                  <span className={`text-[10px] ${bar.active ? 'font-bold text-[#E60012]' : 'text-neutral-500'}`}>
                    {bar.day}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 부서별 사용 비중 */}
          <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
            <h4 className="text-xs font-bold text-neutral-900 mb-2.5">부서별 토큰 소진 비율</h4>
            <div className="space-y-2">
              {[
                { dept: '공공컨설팅본부', pct: 46, tokens: '312K Token' },
                { dept: 'AI사업본부', pct: 29, tokens: '197K Token' },
                { dept: '경영기획실', pct: 15, tokens: '102K Token' },
                { dept: '생산성혁신단', pct: 10, tokens: '68K Token' }
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-neutral-700 font-medium">{item.dept}</span>
                    <span className="text-neutral-900 font-mono font-semibold">{item.pct}% ({item.tokens})</span>
                  </div>
                  <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${idx === 0 ? 'bg-[#E60012]' : 'bg-neutral-700'}`} 
                      style={{ width: `${item.pct}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] text-neutral-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>KPC 보안 검증 완료 솔루션</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-neutral-700 bg-white border border-neutral-300 rounded hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
