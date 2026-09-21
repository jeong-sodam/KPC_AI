import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  Maximize2, 
  Minimize2, 
  Copy, 
  Check, 
  Globe, 
  ShieldCheck, 
  Layout, 
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { CustomAiApp } from '../../data/customAiMockData';
import { CustomAiStandaloneApp } from './CustomAiStandaloneApp';

interface CustomAiWindowModalProps {
  app: CustomAiApp | null;
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const CustomAiWindowModal: React.FC<CustomAiWindowModalProps> = ({
  app,
  isOpen,
  onClose,
  onShowToast
}) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  if (!isOpen || !app) return null;

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

  return (
    <div 
      id="custom-ai-window-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-2 sm:p-4 animate-in fade-in duration-200"
    >
      <div 
        id="custom-ai-standalone-window"
        className={`bg-white flex flex-col shadow-2xl border border-neutral-300 overflow-hidden transition-all duration-200 ${
          isMaximized 
            ? 'w-full h-full rounded-none' 
            : 'w-full max-w-6xl h-[92vh] max-h-[920px] rounded-2xl'
        }`}
      >
        {/* 브라우저 / 윈도우 스타일 크롬 상단 바 */}
        <div className="bg-neutral-900 text-white px-4 py-2.5 flex items-center justify-between gap-3 shrink-0 select-none">
          
          {/* 좌측: 윈도우 신호등 버튼 및 앱 타이틀 */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="w-3 h-3 rounded-full bg-[#FF5F56] hover:brightness-90 transition-all cursor-pointer"
                title="창 닫기"
              />
              <button
                type="button"
                onClick={() => setIsMaximized(!isMaximized)}
                className="w-3 h-3 rounded-full bg-[#FFBD2E] hover:brightness-90 transition-all cursor-pointer"
                title={isMaximized ? "창 복원" : "창 최대화"}
              />
              <button
                type="button"
                onClick={() => setIsMaximized(!isMaximized)}
                className="w-3 h-3 rounded-full bg-[#27C93F] hover:brightness-90 transition-all cursor-pointer"
                title={isMaximized ? "창 복원" : "전체 화면"}
              />
            </div>

            <div className="h-4 w-px bg-neutral-700 mx-1 hidden sm:block" />

            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-md bg-[#E60012] flex items-center justify-center shrink-0">
                <Layout className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-xs sm:text-sm truncate text-neutral-100">
                {app.name}
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-neutral-800 text-neutral-300 border border-neutral-700">
                {app.version}
              </span>
              <span className="hidden md:inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-red-950 text-red-300 border border-red-800">
                별도 실행 서비스
              </span>
            </div>
          </div>

          {/* 중앙: URL 주소창 */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-neutral-800/90 rounded-lg border border-neutral-700 text-xs text-neutral-300 max-w-md w-full justify-between">
            <div className="flex items-center gap-1.5 truncate">
              <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate font-mono text-[11px] select-all">{serviceUrl}</span>
            </div>
            <button
              type="button"
              onClick={handleCopyUrl}
              className="text-neutral-400 hover:text-white transition-colors cursor-pointer shrink-0 ml-1"
              title="URL 복사"
            >
              {copiedUrl ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>

          {/* 우측 조작 버튼: 새 탭 열기, 최대화, 닫기 */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleOpenExternal}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium transition-colors cursor-pointer border border-neutral-700"
              title="외부 새 브라우저 창/탭에서 실행"
            >
              <ExternalLink className="w-3.5 h-3.5 text-neutral-300" />
              <span className="hidden sm:inline">새 탭에서 열기</span>
            </button>

            <button
              type="button"
              onClick={() => setIsMaximized(!isMaximized)}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer hidden sm:flex"
              title={isMaximized ? "이전 크기로 복원" : "전체화면"}
            >
              {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
              title="창 닫기 (ESC)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* 윈도우 본문: CustomAiStandaloneApp 임베드 */}
        <div className="flex-1 min-h-0 overflow-y-auto bg-neutral-100 flex flex-col">
          <CustomAiStandaloneApp
            app={app}
            onBack={onClose}
            onShowToast={onShowToast}
          />
        </div>

      </div>
    </div>
  );
};
