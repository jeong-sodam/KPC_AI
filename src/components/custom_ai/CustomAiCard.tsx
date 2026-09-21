import React, { useState, useRef, useEffect } from 'react';
import { 
  ScanText, 
  Languages, 
  MessageSquareQuote, 
  FileCheck, 
  BookOpenCheck, 
  ShieldAlert, 
  ChevronRight,
  Sparkles,
  FileText,
  CheckCircle2,
  Heart,
  MessageSquare,
  Play,
  Bookmark,
  MoreVertical,
  Settings,
  PauseCircle,
  PlayCircle,
  Eye,
  EyeOff,
  Trash2,
  Calendar,
  Bot,
  TrendingUp
} from 'lucide-react';
import { CustomAiApp } from '../../data/customAiMockData';
import { UserRole } from '../../types';

interface CustomAiCardProps {
  app: CustomAiApp;
  onClick: () => void;
  onExecute: (e?: React.MouseEvent) => void;
  onToggleSave?: (appId: string) => void;
  onToggleStatus?: (appId: string, newStatus: '운영중' | '일시중단') => void;
  onToggleHide?: (appId: string) => void;
  onDeleteApp?: (appId: string) => void;
  userRole?: UserRole;
}

export const CustomAiCard: React.FC<CustomAiCardProps> = ({
  app,
  onClick,
  onExecute,
  onToggleSave,
  onToggleStatus,
  onToggleHide,
  onDeleteApp,
  userRole = 'admin'
}) => {
  const [liked, setLiked] = useState(app.userLiked ?? false);
  const [likeCount, setLikeCount] = useState(app.likes ?? 120);
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const adminMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (adminMenuRef.current && !adminMenuRef.current.contains(e.target as Node)) {
        setShowAdminMenu(false);
      }
    };
    if (showAdminMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAdminMenu]);

  const isSuspended = app.status === '일시중단';

  const handleToggleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (liked) {
      setLiked(false);
      setLikeCount(prev => Math.max(0, prev - 1));
    } else {
      setLiked(true);
      setLikeCount(prev => prev + 1);
    }
  };
  const getAppIcon = (iconType: CustomAiApp['iconType']) => {
    switch (iconType) {
      case 'ocr':
        return <ScanText className="w-5 h-5 text-neutral-900 shrink-0" />;
      case 'translate':
        return <Languages className="w-5 h-5 text-neutral-900 shrink-0" />;
      case 'meeting':
        return <MessageSquareQuote className="w-5 h-5 text-neutral-900 shrink-0" />;
      case 'rfp':
        return <FileCheck className="w-5 h-5 text-neutral-900 shrink-0" />;
      case 'research':
        return <BookOpenCheck className="w-5 h-5 text-neutral-900 shrink-0" />;
      case 'regulation':
        return <ShieldAlert className="w-5 h-5 text-neutral-900 shrink-0" />;
      default:
        return <Sparkles className="w-5 h-5 text-neutral-900 shrink-0" />;
    }
  };

  // Render representative UI screenshot / demo graphic with consistent h-52 height
  // Render Bright, Soft, High-Quality UI Mockup Previews (Light Theme)
  const renderPreviewScreenshot = (appId: string) => {
    switch (appId) {
      case 'app-daom':
        // DAOM: AI OCR Scanner Screenshot Graphic
        return (
          <div className="w-full h-full bg-[#F3F4F6] p-2 text-[10px] text-neutral-700 font-sans flex flex-col justify-between overflow-hidden relative select-none pointer-events-none">
            {/* Browser / App Window Mockup Frame */}
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200/90 flex-1 flex flex-col overflow-hidden">
              {/* Browser Window Header */}
              <div className="h-6 px-2.5 bg-neutral-100/90 border-b border-neutral-200/80 flex items-center shrink-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#FF5F56] inline-block" />
                  <span className="w-2 h-2 rounded-full bg-[#FFBD2E] inline-block" />
                  <span className="w-2 h-2 rounded-full bg-[#27C93F] inline-block" />
                  <div className="ml-2 px-2 py-0.5 rounded bg-white border border-neutral-200/70 text-[9px] text-neutral-400 font-mono flex items-center gap-1">
                    <span className="text-neutral-300">https://</span>daom.kpc.or.kr/scan-studio
                  </div>
                </div>
              </div>

              {/* Graphic Screenshot Body (Dual Pane: Scanned Doc with Stamp & Extracted Table) */}
              <div className="p-2.5 grid grid-cols-2 gap-2 flex-1 min-h-0 bg-neutral-50/50">
                {/* Left: Scanned Document Page Graphic */}
                <div className="bg-white rounded border border-neutral-200 p-2 flex flex-col justify-between relative shadow-2xs">
                  <div>
                    {/* Document Header & Red Seal Stamp Graphic */}
                    <div className="flex items-start justify-between pb-1 mb-1.5 border-b border-neutral-150">
                      <div>
                        <span className="text-[8px] font-bold text-neutral-400 block tracking-wider uppercase">과업지시서 (원문 스캔본)</span>
                        <span className="text-[9px] font-bold text-neutral-800">2026 차세대 공공 AI 플랫폼</span>
                      </div>
                      {/* Red Stamp Circle Graphic */}
                      <div className="w-6 h-6 rounded-full border border-red-500/80 flex items-center justify-center rotate-[-12deg] bg-red-50/40">
                        <span className="text-[6px] font-bold text-[#E60012] leading-none text-center">KPC<br/>공인</span>
                      </div>
                    </div>

                    {/* Bounding Box Banners */}
                    <div className="space-y-1">
                      <div className="border border-red-400/80 bg-red-50/70 px-1.5 py-0.5 rounded text-[8.5px] text-red-900 font-medium flex items-center justify-between">
                        <span>#1 과업명: 공공 스마트 업무망 구축</span>
                        <span className="text-[7.5px] text-red-600 font-mono">0.99</span>
                      </div>
                      <div className="border border-blue-400/80 bg-blue-50/70 px-1.5 py-0.5 rounded text-[8.5px] text-blue-900 font-medium flex items-center justify-between">
                        <span>#2 사업예산: 금 2,500,000,000원</span>
                        <span className="text-[7.5px] text-blue-600 font-mono">0.98</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-[8px] text-neutral-400 flex items-center justify-between pt-1 border-t border-neutral-100">
                    <span>PDF 32p 스캔 분석</span>
                    <span className="text-emerald-600 font-medium">검출 영역 24개</span>
                  </div>
                </div>

                {/* Right: Structured Output Spreadsheet Grid */}
                <div className="bg-white rounded border border-neutral-200 flex flex-col justify-between overflow-hidden shadow-2xs">
                  <div>
                    {/* Table Header Bar */}
                    <div className="bg-emerald-600 text-white px-2 py-1 text-[8.5px] font-bold flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        <span>정형 데이터 추출</span>
                      </span>
                      <span className="text-[7.5px] font-normal opacity-90">0.8초</span>
                    </div>

                    {/* Table Rows */}
                    <div className="divide-y divide-neutral-100 text-[8.5px]">
                      <div className="px-2 py-1 flex items-center justify-between bg-neutral-50/40">
                        <span className="text-neutral-400">과업명</span>
                        <span className="font-semibold text-neutral-800 truncate ml-1">공공 스마트 업무망 구축</span>
                      </div>
                      <div className="px-2 py-1 flex items-center justify-between">
                        <span className="text-neutral-400">예산</span>
                        <span className="font-semibold text-neutral-800">25억 원 (VAT포함)</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-1.5 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between text-[8px] text-neutral-500">
                    <span>개인정보 마스킹 완료</span>
                    <span className="font-bold text-[#E60012]">변환 완료</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Screen Glass Photo Sheen Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 pointer-events-none" />
          </div>
        );

      case 'app-daruda':
        // DARUDA: Document Translation Screenshot Graphic
        return (
          <div className="w-full h-full bg-[#F3F4F6] p-2 text-[10px] text-neutral-700 font-sans flex flex-col justify-between overflow-hidden relative select-none pointer-events-none">
            {/* Browser / App Window Mockup Frame */}
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200/90 flex-1 flex flex-col overflow-hidden">
              {/* Browser Window Header */}
              <div className="h-6 px-2.5 bg-neutral-100/90 border-b border-neutral-200/80 flex items-center shrink-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#FF5F56] inline-block" />
                  <span className="w-2 h-2 rounded-full bg-[#FFBD2E] inline-block" />
                  <span className="w-2 h-2 rounded-full bg-[#27C93F] inline-block" />
                  <div className="ml-2 px-2 py-0.5 rounded bg-white border border-neutral-200/70 text-[9px] text-neutral-400 font-mono flex items-center gap-1">
                    <span className="text-neutral-300">https://</span>daruda.kpc.or.kr/workspace
                  </div>
                </div>
              </div>

              {/* Graphic Screenshot Body (Parallel Split-Screen Workbench) */}
              <div className="p-2.5 grid grid-cols-2 gap-2 flex-1 min-h-0 bg-neutral-50/50">
                {/* Left: English Source Document Panel */}
                <div className="bg-white rounded border border-neutral-200 p-2 flex flex-col justify-between shadow-2xs">
                  <div>
                    <div className="flex items-center justify-between pb-1 mb-1 border-b border-neutral-150">
                      <span className="text-[8.5px] font-bold text-neutral-500 flex items-center gap-1">
                        <FileText className="w-3 h-3 text-blue-600" />
                        <span>원문 (English)</span>
                      </span>
                    </div>
                    <div className="mt-1 space-y-1">
                      <p className="text-[9px] text-neutral-800 leading-relaxed font-sans line-clamp-2">
                        "The strategic adoption of on-premise generative AI frameworks ensures enterprise security."
                      </p>
                    </div>
                  </div>
                  <div className="text-[8px] text-neutral-400 pt-1 border-t border-neutral-100 flex items-center justify-between">
                    <span>1,840 words</span>
                    <span className="text-neutral-600 font-medium">검증 통과</span>
                  </div>
                </div>

                {/* Right: Korean Translated Target Document Panel */}
                <div className="bg-white rounded border border-emerald-200/80 p-2 flex flex-col justify-between shadow-2xs bg-emerald-50/15">
                  <div>
                    <div className="flex items-center justify-between pb-1 mb-1 border-b border-emerald-100">
                      <span className="text-[8.5px] font-bold text-emerald-700 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>번역본 (한국어)</span>
                      </span>
                    </div>
                    <div className="mt-1 space-y-1">
                      <p className="text-[9px] text-neutral-900 leading-relaxed font-medium line-clamp-2">
                        "온프레미스 생성형 AI 프레임워크의 도입은 엔터프라이즈 보안을 보장합니다."
                      </p>
                    </div>
                  </div>
                  <div className="text-[8px] text-neutral-500 pt-1 border-t border-emerald-100 flex items-center justify-between">
                    <span>Word 내보내기</span>
                    <span className="font-bold text-[#E60012]">일치율 99.8%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Screen Glass Photo Sheen Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 pointer-events-none" />
          </div>
        );

      case 'app-dadam':
        // DADAM: Meeting Summary Video Demo Graphic
        return (
          <div className="w-full h-full bg-[#F3F4F6] p-2 text-[10px] text-neutral-700 font-sans flex flex-col justify-between overflow-hidden relative select-none pointer-events-none">
            {/* Captured Video Player Window Frame */}
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200/90 flex-1 flex flex-col overflow-hidden relative">
              {/* Media Player Top Bar */}
              <div className="h-6 px-2.5 bg-neutral-100/90 border-b border-neutral-200/80 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#FF5F56] inline-block" />
                  <span className="w-2 h-2 rounded-full bg-[#FFBD2E] inline-block" />
                  <span className="w-2 h-2 rounded-full bg-[#27C93F] inline-block" />
                  <div className="ml-2 px-2 py-0.5 rounded bg-white border border-neutral-200/70 text-[9px] text-neutral-400 font-mono flex items-center gap-1">
                    <span className="text-neutral-300">kpc://</span>dadam-meeting-recorder.ai
                  </div>
                </div>
                <span className="text-[8.5px] text-neutral-500 font-mono">01:15 / 52:14</span>
              </div>

              {/* Graphic Screenshot Body (Waveform & Transcript UI) */}
              <div className="p-2 flex-1 min-h-0 flex flex-col justify-between bg-neutral-50/60">
                {/* Audio Waveform Graphic Mockup */}
                <div className="h-5 bg-white rounded px-2 flex items-center justify-between border border-neutral-200 shadow-2xs">
                  <div className="flex items-end gap-0.5 h-3 w-full">
                    {[4, 8, 12, 6, 14, 10, 8, 16, 12, 6, 10, 14, 8, 12, 16, 10, 6, 14, 12, 8, 16, 10, 14, 8, 6, 12, 16, 8, 10, 14, 8, 12, 6, 10, 14, 8, 16, 12, 6, 8, 14].map((h, i) => (
                      <span 
                        key={i} 
                        style={{ height: `${h * 0.7}px` }} 
                        className={`w-1 rounded-xs inline-block ${i < 16 ? 'bg-[#E60012]' : 'bg-neutral-300'}`} 
                      />
                    ))}
                  </div>
                </div>

                {/* Split Content: Speaker Dialogue & Extracted Agenda */}
                <div className="grid grid-cols-2 gap-2 mt-1 flex-1 min-h-0">
                  {/* Left: Speaker Speech Stream */}
                  <div className="bg-white rounded p-1.5 border border-neutral-200 shadow-2xs space-y-1 text-[8.5px]">
                    <div>
                      <span className="text-[#E60012] font-bold block">김민수 팀장 (09:15)</span>
                      <p className="text-neutral-700 truncate">"사내 AI Agent 시범 도입..."</p>
                    </div>
                  </div>

                  {/* Right: AI Summary Box */}
                  <div className="bg-white rounded p-1.5 border border-neutral-200 shadow-2xs flex flex-col justify-between text-[8.5px]">
                    <div>
                      <span className="text-amber-700 font-bold block mb-0.5">핵심 안건</span>
                      <p className="text-neutral-800 truncate">• 전사 배포 (10/1)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Screen Glass Photo Sheen Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 pointer-events-none" />
          </div>
        );

      case 'app-rfp-review':
        // RFP Review Screenshot Graphic
        return (
          <div className="w-full h-full bg-[#F3F4F6] p-2 text-[10px] text-neutral-700 font-sans flex flex-col justify-between overflow-hidden relative select-none pointer-events-none">
            {/* Browser / App Window Mockup Frame */}
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200/90 flex-1 flex flex-col overflow-hidden">
              {/* Browser Window Header */}
              <div className="h-6 px-2.5 bg-neutral-100/90 border-b border-neutral-200/80 flex items-center shrink-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#FF5F56] inline-block" />
                  <span className="w-2 h-2 rounded-full bg-[#FFBD2E] inline-block" />
                  <span className="w-2 h-2 rounded-full bg-[#27C93F] inline-block" />
                  <div className="ml-2 px-2 py-0.5 rounded bg-white border border-neutral-200/70 text-[9px] text-neutral-400 font-mono flex items-center gap-1">
                    <span className="text-neutral-300">https://</span>rfp.kpc.or.kr/evaluation-cockpit
                  </div>
                </div>
              </div>

              {/* Graphic Screenshot Body (Cockpit Dashboard) */}
              <div className="p-2 flex-1 min-h-0 flex flex-col justify-between bg-neutral-50/50">
                {/* Score Summary Meter Graphic */}
                <div className="bg-white rounded border border-neutral-200 p-1.5 flex items-center justify-between shadow-2xs">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full border-2 border-emerald-500 flex items-center justify-center font-bold text-emerald-700 text-[10px] bg-emerald-50">
                      88
                    </div>
                    <div>
                      <span className="text-[8px] font-bold text-neutral-400 block uppercase">수주 승률</span>
                      <span className="text-[9px] font-bold text-neutral-900">상위 5% 판정</span>
                    </div>
                  </div>
                </div>

                {/* Qualification Matrix Items */}
                <div className="mt-1 space-y-1 flex-1 min-h-0">
                  <div className="bg-white p-1 rounded border border-neutral-200 flex items-center justify-between text-[8px]">
                    <span className="text-neutral-800 font-medium truncate">✓ 필수 상주인력 요건</span>
                    <span className="bg-emerald-50 text-emerald-700 px-1 py-0.2 rounded font-bold">충족</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Screen Glass Photo Sheen Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 pointer-events-none" />
          </div>
        );

      case 'app-research-curator':
        // Research Curator Video Demo Graphic
        return (
          <div className="w-full h-full bg-[#F3F4F6] p-2 text-[10px] text-neutral-700 font-sans flex flex-col justify-between overflow-hidden relative select-none pointer-events-none">
            {/* Captured Video Player Window Frame */}
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200/90 flex-1 flex flex-col overflow-hidden relative">
              {/* Media Player Top Bar */}
              <div className="h-6 px-2.5 bg-neutral-100/90 border-b border-neutral-200/80 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#FF5F56] inline-block" />
                  <span className="w-2 h-2 rounded-full bg-[#FFBD2E] inline-block" />
                  <span className="w-2 h-2 rounded-full bg-[#27C93F] inline-block" />
                  <div className="ml-2 px-2 py-0.5 rounded bg-white border border-neutral-200/70 text-[9px] text-neutral-400 font-mono flex items-center gap-1">
                    <span className="text-neutral-300">kpc://</span>curator-academic-demo.mp4
                  </div>
                </div>
              </div>

              {/* Graphic Screenshot Body (Academic Paper & Knowledge Graph) */}
              <div className="p-2 flex-1 min-h-0 flex flex-col justify-between bg-neutral-50/60">
                {/* Paper Summary Box */}
                <div className="bg-white rounded p-1.5 border border-neutral-200 shadow-2xs">
                  <span className="text-[8px] bg-blue-50 text-blue-700 font-bold px-1 rounded">
                    KCI 논문 연계
                  </span>
                  <p className="text-[9px] font-bold text-neutral-900 mt-0.5 leading-snug truncate">
                    생성형 AI 도입에 따른 생산성 혁신
                  </p>
                </div>
              </div>
            </div>

            {/* Screen Glass Photo Sheen Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 pointer-events-none" />
          </div>
        );

      case 'app-regulation-compass':
      default:
        // Regulation Compass Screenshot Graphic
        return (
          <div className="w-full h-full bg-[#F3F4F6] p-2 text-[10px] text-neutral-700 font-sans flex flex-col justify-between overflow-hidden relative select-none pointer-events-none">
            {/* Browser / App Window Mockup Frame */}
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200/90 flex-1 flex flex-col overflow-hidden">
              {/* Browser Window Header */}
              <div className="h-6 px-2.5 bg-neutral-100/90 border-b border-neutral-200/80 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#FF5F56] inline-block" />
                  <span className="w-2 h-2 rounded-full bg-[#FFBD2E] inline-block" />
                  <span className="w-2 h-2 rounded-full bg-[#27C93F] inline-block" />
                  <div className="ml-2 px-2 py-0.5 rounded bg-white border border-neutral-200/70 text-[9px] text-neutral-400 font-mono flex items-center gap-1">
                    <span className="text-neutral-300">https://</span>compass.kpc.or.kr
                  </div>
                </div>
              </div>

              {/* Graphic Screenshot Body (Statute Q&A Layout) */}
              <div className="p-2 flex-1 min-h-0 flex flex-col justify-between bg-neutral-50/50">
                <div className="bg-white rounded border border-neutral-200 px-2 py-1 flex items-center justify-between shadow-2xs">
                  <span className="text-[8.5px] text-neutral-800 font-medium truncate">
                    질의: "출장 숙박비 및 외부 강의 신고 절차"
                  </span>
                </div>
                <div className="mt-1 space-y-1">
                  <div className="bg-white p-1 rounded border border-neutral-200 shadow-2xs">
                    <span className="text-[8px] text-[#E60012] font-bold block">여비규정 제14조</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Screen Glass Photo Sheen Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 pointer-events-none" />
          </div>
        );
    }
  };

  return (
    <div
      id={`custom-ai-card-${app.id}`}
      onClick={onClick}
      className={`group bg-white rounded-2xl border border-neutral-200/80 hover:border-neutral-400 hover:shadow-xl transition-all duration-200 flex flex-col overflow-hidden cursor-pointer relative ${
        showAdminMenu ? 'z-30' : 'z-0'
      } ${app.isHidden ? 'opacity-60 bg-neutral-50/80' : ''}`}
    >
      {/* ─────────────────────────────────────────────────────────────
          1. Top Banner Image Preview Area (AI Agent & AI Community와 100% 동일 포맷)
          ───────────────────────────────────────────────────────────── */}
      <div className="relative w-full h-40 bg-neutral-100 shrink-0 border-b border-neutral-100 overflow-hidden">
        <div className="w-full h-full overflow-hidden">
          {renderPreviewScreenshot(app.id)}
        </div>

        {/* Top-Left Status Badge */}
        {(isSuspended || app.isHidden) && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
            {isSuspended && (
              <span className="px-2 py-1 rounded-lg bg-amber-500 text-white text-[10px] font-bold shadow-xs">
                일시중단
              </span>
            )}
            {app.isHidden && (
              <span className="px-2 py-1 rounded-lg bg-neutral-900 text-white text-[10px] font-bold shadow-xs">
                숨김
              </span>
            )}
          </div>
        )}

        {/* Top-Right Controls: Bookmark & Admin Menu */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20">
          {onToggleSave && (
            <button
              type="button"
              id={`custom-ai-bookmark-btn-${app.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave(app.id);
              }}
              className={`w-7 h-7 rounded-lg bg-white/95 hover:bg-white flex items-center justify-center border border-neutral-200/80 shadow-xs transition-colors cursor-pointer ${
                app.isSaved ? 'text-amber-500 font-bold' : 'text-neutral-400 hover:text-neutral-700'
              }`}
              title={app.isSaved ? '저장 취소' : '내 보관함에 저장'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${app.isSaved ? 'fill-amber-500' : ''}`} />
            </button>
          )}

          {userRole === 'admin' && (
            <div className="relative" ref={adminMenuRef}>
              <button
                type="button"
                id={`custom-ai-admin-btn-${app.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAdminMenu(!showAdminMenu);
                }}
                className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all cursor-pointer shadow-xs ${
                  showAdminMenu
                    ? 'bg-neutral-900 text-white border-neutral-900'
                    : 'bg-white/95 text-neutral-600 border-neutral-200/80 hover:bg-white hover:text-neutral-900'
                }`}
                title="관리자 권한 설정"
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </button>

              {showAdminMenu && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-full mt-1.5 w-44 bg-white rounded-xl shadow-2xl border border-neutral-200 py-1 z-50 text-xs animate-in fade-in zoom-in-95 duration-100 text-left"
                >
                  <div className="px-3 py-1.5 text-[10px] font-bold text-neutral-400 uppercase tracking-wider border-b border-neutral-100">
                    관리자 권한 설정
                  </div>

                  {isSuspended ? (
                    <button
                      type="button"
                      onClick={() => {
                        setShowAdminMenu(false);
                        onToggleStatus?.(app.id, '운영중');
                      }}
                      className="w-full px-3 py-2 text-xs text-emerald-700 hover:bg-emerald-50 flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <PlayCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>운영 재개</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setShowAdminMenu(false);
                        onToggleStatus?.(app.id, '일시중단');
                      }}
                      className="w-full px-3 py-2 text-xs text-amber-700 hover:bg-amber-50 flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <PauseCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>중지</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setShowAdminMenu(false);
                      onToggleHide?.(app.id);
                    }}
                    className="w-full px-3 py-2 text-xs text-neutral-700 hover:bg-neutral-50 flex items-center gap-2 cursor-pointer transition-colors"
                  >
                    {app.isHidden ? (
                      <>
                        <Eye className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                        <span>숨김 해제</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                        <span>숨기기</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowAdminMenu(false);
                      if (confirm(`'${app.name}' Custom AI 서비스를 삭제하시겠습니까?\n삭제된 내용은 복구할 수 없습니다.`)) {
                        onDeleteApp?.(app.id);
                      }
                    }}
                    className="w-full px-3 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer transition-colors border-t border-neutral-100"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    <span>삭제</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. Card Body Content (AI Agent 카드와 100% 동일 규격 및 레이아웃)
          ───────────────────────────────────────────────────────────── */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3.5">
        <div className="space-y-2.5">
          {/* 1. Title & Icon at the Top */}
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-neutral-900 text-white flex items-center justify-center shrink-0 shadow-2xs overflow-hidden mt-0.5">
              {getAppIcon(app.iconType)}
            </div>
            <h3 className="text-base font-bold text-neutral-900 line-clamp-2 group-hover:text-[#E60012] transition-colors leading-snug h-[44px] flex items-center">
              {app.name}
            </h3>
          </div>

          {/* 2. Description */}
          <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed h-[36px]">
            {app.description || app.shortDesc}
          </p>
        </div>

        {/* 3. Badges, Status & Update Date (AI Agent와 동일한 구조) */}
        <div className="space-y-2 pt-1 border-t border-neutral-100">
          {/* Badges Row */}
          <div className="flex items-center flex-wrap gap-1.5 text-[11px] min-h-[22px]">
            {/* Dev Type Badge */}
            <span className="px-2 py-0.5 rounded-md font-bold flex items-center gap-1 bg-neutral-100 text-neutral-900 border border-neutral-200">
              <Sparkles className="w-3 h-3 text-[#E60012]" />
              <span>Custom AI</span>
            </span>

            {/* Version */}
            <span className="px-1.5 py-0.5 rounded-md font-mono font-bold bg-neutral-100 text-neutral-700 text-[10px] border border-neutral-200">
              {app.version}
            </span>

            {/* Status */}
            {isSuspended ? (
              <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                <PauseCircle className="w-3 h-3 text-amber-600" />
                <span>일시중단</span>
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>{app.status || '운영중'}</span>
              </span>
            )}
          </div>

          {/* Update Date & Category Tag Row */}
          <div className="flex items-center justify-between text-[11px] text-neutral-500 min-h-[22px]">
            <span className="flex items-center gap-1 text-[11px] text-neutral-500 font-medium shrink-0">
              <Calendar className="w-3 h-3 text-neutral-400" />
              <span>최근 업데이트: {app.createdAt || '2026.03.15'}</span>
            </span>

            {/* Category Tag */}
            <span className="px-1.5 py-0.2 rounded bg-neutral-50 text-neutral-500 text-[10px] whitespace-nowrap shrink-0">
              #{app.category}
            </span>
          </div>
        </div>

        {/* 4. Footer: Author & Metrics + Action Button */}
        <div className="pt-2.5 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
              {app.department.slice(0, 1)}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-neutral-800 text-[11px] truncate max-w-[85px]">
                {app.department.split('/')[0].trim()}
              </span>
              <span className="text-[9px] text-neutral-400 truncate max-w-[85px]">
                {app.department.split('/')[1]?.trim() || app.department}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 text-[11px] shrink-0">
            {/* Likes */}
            <button
              type="button"
              id={`custom-ai-like-btn-${app.id}`}
              onClick={handleToggleLike}
              className={`flex items-center gap-1 hover:text-[#E60012] transition-colors cursor-pointer ${
                liked ? 'text-[#E60012] font-bold' : ''
              }`}
              title="좋아요"
            >
              <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-current' : ''}`} />
              <span>{likeCount}</span>
            </button>

            {/* Comments */}
            <div className="flex items-center gap-1 text-neutral-500" title="댓글">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>{app.commentsCount || 0}</span>
            </div>

            {/* Usage */}
            <div className="flex items-center gap-1 text-neutral-500 font-medium" title="실행 횟수">
              <TrendingUp className="w-3.5 h-3.5 text-neutral-400" />
              <span>{app.usageCount.toLocaleString()}</span>
            </div>

            {/* Action Button */}
            <button
              type="button"
              id={`execute-btn-${app.id}`}
              onClick={(e) => {
                e.stopPropagation();
                onExecute(e);
              }}
              className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#E60012] hover:bg-[#c90010] text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer shrink-0 whitespace-nowrap ml-1"
              title="Custom AI 실행"
            >
              <Play className="w-3 h-3 fill-current shrink-0" />
              <span>사용해보기</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
