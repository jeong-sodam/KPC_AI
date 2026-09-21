import React, { useState } from 'react';
import { 
  ArrowLeft,
  ExternalLink, 
  Copy, 
  Check, 
  Bookmark, 
  RotateCcw,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Layout,
  Layers,
  Globe
} from 'lucide-react';
import { CustomAiApp } from '../../data/customAiMockData';
import { CustomAiStandaloneApp } from './CustomAiStandaloneApp';
import { UserRole } from '../../types';

interface CustomAiDetailViewProps {
  app: CustomAiApp;
  onBack: () => void;
  onShowToast: (msg: string) => void;
  onToggleSave?: (appId: string) => void;
  userRole?: UserRole;
}

export const CustomAiDetailView: React.FC<CustomAiDetailViewProps> = ({
  app,
  onBack,
  onShowToast,
  onToggleSave,
  userRole = 'user'
}) => {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const serviceUrl = app.serviceUrl || `https://custom-ai.kpc.or.kr/${app.id.replace('app-', '')}`;

  const handleOpenExternal = () => {
    try {
      window.open(serviceUrl, '_blank', 'noopener,noreferrer');
      onShowToast(`'${app.name}' 서비스를 새 브라우저 창에서 열었습니다.`);
    } catch {
      onShowToast('새 창 열기 권한이 차단되었습니다. 팝업 차단을 해제해주세요.');
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(serviceUrl);
    setCopiedUrl(true);
    onShowToast('서비스 고유 접속 URL이 복사되었습니다.');
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleResetApp = () => {
    setReloadKey(prev => prev + 1);
    onShowToast(`'${app.name}' 작업 화면이 초기화되었습니다.`);
  };

  return (
    <div id="custom-ai-detail-view" className="flex-1 flex flex-col h-full bg-[#F8F9FA] overflow-y-auto">
      {/* ─────────────────────────────────────────────────────────────
          1. Top Navigation Bar (Full screen tab header)
          ───────────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-neutral-200 sticky top-0 z-20 shrink-0 shadow-2xs">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-3 flex items-center justify-between gap-4">
          {/* Left: Back Button & Breadcrumb */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-bold transition-all cursor-pointer shadow-2xs hover:border-neutral-400 shrink-0"
            >
              <ArrowLeft className="w-4 h-4 text-neutral-500" />
              <span>Custom AI 목록</span>
            </button>
            <div className="h-4 w-px bg-neutral-200 hidden sm:block" />
            <nav className="hidden sm:flex items-center gap-1.5 text-xs text-neutral-500 truncate">
              <span>Custom AI</span>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
              <span className="font-medium text-neutral-600 truncate">{app.category || '사내 업무 도구'}</span>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
              <span className="font-bold text-neutral-900 truncate">{app.name}</span>
            </nav>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Status badge */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>운영중 (v2.4)</span>
            </div>

            {/* Bookmark Save */}
            {onToggleSave && (
              <button
                type="button"
                id={`custom-ai-save-btn-${app.id}`}
                onClick={() => onToggleSave(app.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  app.isSaved
                    ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold shadow-2xs'
                    : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                }`}
                title={app.isSaved ? '보관함에서 제거' : '내 보관함에 저장'}
              >
                <Bookmark className={`w-3.5 h-3.5 ${app.isSaved ? 'fill-amber-500 text-amber-500' : 'text-neutral-400'}`} />
                <span className="hidden sm:inline">{app.isSaved ? '보관됨' : '보관'}</span>
              </button>
            )}

            {/* Copy URL */}
            <button
              type="button"
              onClick={handleCopyUrl}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-semibold transition-colors cursor-pointer"
              title="서비스 접속 URL 복사"
            >
              {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-neutral-500" />}
              <span className="hidden sm:inline">{copiedUrl ? '복사됨' : 'URL 복사'}</span>
            </button>

            {/* Reset App */}
            <button
              type="button"
              onClick={handleResetApp}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-semibold transition-colors cursor-pointer"
              title="작업 화면 초기화"
            >
              <RotateCcw className="w-3.5 h-3.5 text-neutral-500" />
              <span className="hidden md:inline">초기화</span>
            </button>

            {/* External New Tab */}
            <button
              type="button"
              onClick={handleOpenExternal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
              title="새 브라우저 탭에서 독립 실행"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>새 창에서 열기</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. Full Workspace Container
          ───────────────────────────────────────────────────────────── */}
      <main className="max-w-7xl mx-auto px-6 sm:px-8 py-6 w-full flex-1 flex flex-col">
        {/* App Info Header Bar */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-5 mb-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-neutral-900 text-white flex items-center justify-center shrink-0 shadow-2xs font-bold">
              <Sparkles className="w-6 h-6 text-[#E60012]" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-lg sm:text-xl font-bold text-neutral-900">{app.name}</h1>
                <span className="px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 text-xs font-medium border border-neutral-200">
                  {app.shortDesc || app.category}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-3xl">
                {app.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-neutral-500 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-neutral-100">
            <div className="flex items-center gap-1.5 bg-neutral-50 px-3 py-1.5 rounded-xl border border-neutral-200">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>KPC 전사 보안 규정 검증 완료</span>
            </div>
          </div>
        </div>

        {/* Standalone Interactive Application View */}
        <div key={reloadKey} className="flex-1 bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
          <CustomAiStandaloneApp
            app={app}
            onBack={onBack}
            onShowToast={onShowToast}
          />
        </div>
      </main>
    </div>
  );
};
