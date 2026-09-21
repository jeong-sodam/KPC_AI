import React, { useState, useMemo } from 'react';
import { Search, AlertCircle, ArrowUpDown, Sparkles, Layers, Bookmark } from 'lucide-react';
import { CUSTOM_AI_APPS, CustomAiApp } from '../../data/customAiMockData';
import { CustomAiCard } from './CustomAiCard';
import { CustomAiDetailView } from './CustomAiDetailView';
import { UserRole } from '../../types';

interface CustomAiViewProps {
  onShowToast: (msg: string) => void;
  onNavigateTab?: (tab: string) => void;
  userRole?: UserRole;
}

type SortOption = '최신순' | '좋아요순' | '댓글순' | '사용량순';

export const CustomAiView: React.FC<CustomAiViewProps> = ({
  onShowToast,
  onNavigateTab,
  userRole = 'admin'
}) => {
  const [apps, setApps] = useState<CustomAiApp[]>(CUSTOM_AI_APPS);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('최신순');
  const [showOnlySaved, setShowOnlySaved] = useState(false);
  const [activeWindowApp, setActiveWindowApp] = useState<CustomAiApp | null>(null);

  const savedCount = useMemo(() => apps.filter(a => a.isSaved).length, [apps]);

  const handleToggleSave = (appId: string) => {
    setApps(prev => prev.map(item => {
      if (item.id === appId) {
        const nextSaved = !item.isSaved;
        onShowToast(nextSaved ? `'${item.name}' 서비스를 보관함에 저장했습니다.` : `'${item.name}' 서비스 저장을 해제했습니다.`);
        return { ...item, isSaved: nextSaved };
      }
      return item;
    }));
  };

  const handleToggleStatus = (appId: string, newStatus: '운영중' | '일시중단') => {
    setApps(prev => prev.map(item => {
      if (item.id === appId) {
        const updated = { ...item, status: newStatus };
        onShowToast(`'${item.name}' 서비스가 ${newStatus === '일시중단' ? '일시중단' : '운영 재개'}되었습니다.`);
        return updated;
      }
      return item;
    }));
  };

  const handleToggleHide = (appId: string) => {
    setApps(prev => prev.map(item => {
      if (item.id === appId) {
        const nextHidden = !item.isHidden;
        onShowToast(nextHidden ? `'${item.name}' 서비스를 숨김 처리했습니다.` : `'${item.name}' 서비스 숨김을 해제했습니다.`);
        return { ...item, isHidden: nextHidden };
      }
      return item;
    }));
  };

  const handleDeleteApp = (appId: string) => {
    const target = apps.find(a => a.id === appId);
    setApps(prev => prev.filter(item => item.id !== appId));
    onShowToast(`'${target?.name || '선택한'}' Custom AI 서비스가 삭제되었습니다.`);
  };

  // Filtered & Sorted Apps (Supports Search, Saved filter, and Sorting)
  const filteredAndSortedApps = useMemo(() => {
    let result = apps.filter(app => {
      if (userRole !== 'admin' && app.isHidden) return false;
      if (showOnlySaved && !app.isSaved) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        (app.name || '').toLowerCase().includes(q) ||
        (app.description || '').toLowerCase().includes(q) ||
        (app.shortDesc || '').toLowerCase().includes(q) ||
        (app.features || []).some(f => (f || '').toLowerCase().includes(q))
      );
    });

    // Sorting
    return result.sort((a, b) => {
      if (sortOption === '좋아요순') {
        return (b.likes || 0) - (a.likes || 0);
      }
      if (sortOption === '댓글순') {
        return (b.commentsCount || 0) - (a.commentsCount || 0);
      }
      if (sortOption === '사용량순') {
        return (b.usageCount || 0) - (a.usageCount || 0);
      }
      // default: 최신순
      return (b.createdAt || '').localeCompare(a.createdAt || '');
    });
  }, [apps, searchQuery, sortOption, showOnlySaved, userRole]);

  const handleOpenApp = (app: CustomAiApp) => {
    setActiveWindowApp(app);
  };

  // If in dedicated Custom AI App Screen view, render full-page screen
  if (activeWindowApp) {
    return (
      <CustomAiDetailView
        app={activeWindowApp}
        onBack={() => setActiveWindowApp(null)}
        onShowToast={onShowToast}
        onToggleSave={handleToggleSave}
        userRole={userRole}
      />
    );
  }

  return (
    <div 
      id="custom-ai-root"
      className="flex-1 flex flex-col bg-gradient-to-b from-[#FAFBFD] via-white to-[#F8F9FA] h-full overflow-y-auto"
    >
      {/* 상단 헤더 영역: 보관함 필터, 정렬 드롭다운, 검색창 */}
      <div className="bg-white/95 backdrop-blur-md border-b border-neutral-200/80 sticky top-0 z-20 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="max-w-7xl mx-auto px-6 py-3.5 sm:px-8">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2.5">

            {/* 우측 컨트롤 */}
            <div className="flex items-center gap-2.5 shrink-0">
              {/* 보관함(저장된 Custom AI) 빠른 필터: 고정 너비(w-[88px])로 숫자가 변해도 크기 유지 */}
              <button
                type="button"
                id="filter-saved-custom-ai-btn"
                onClick={() => setShowOnlySaved(!showOnlySaved)}
                className={`flex items-center justify-center gap-1.5 w-[88px] h-8 rounded-lg text-xs font-semibold border transition-all cursor-pointer shrink-0 ${
                  showOnlySaved
                    ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold shadow-2xs'
                    : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 shrink-0 ${showOnlySaved ? 'fill-amber-500 text-amber-500' : 'text-neutral-400'}`} />
                <span className="truncate">보관함 ({savedCount})</span>
              </button>

              {/* 정렬/필터 Dropdown: 검색창 바로 왼쪽 */}
              <div className="relative shrink-0">
                <select
                  id="custom-ai-sort-select"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as SortOption)}
                  aria-label="서비스 정렬 기준"
                  className="appearance-none pl-3 pr-8 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs font-semibold text-neutral-700 hover:border-neutral-300 focus:outline-none focus:border-neutral-400 transition-colors cursor-pointer"
                >
                  <option value="최신순">최신순</option>
                  <option value="좋아요순">좋아요순</option>
                  <option value="댓글순">댓글순</option>
                  <option value="사용량순">사용량순</option>
                </select>
                <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* 검색창: 맨 오른쪽 */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  id="custom-ai-search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="서비스 이름 또는 기능 검색"
                  className="w-full pl-8.5 pr-7 py-1.5 bg-neutral-50 hover:bg-white focus:bg-white rounded-lg border border-neutral-200 focus:border-neutral-400 text-xs text-neutral-900 placeholder:text-neutral-400 transition-all outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 text-xs font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 중앙 메인: 2열 중심의 넉넉한 여백의 카드 Grid 레이아웃 */}
      <main className="max-w-7xl mx-auto px-6 py-6 sm:px-8 flex-1 w-full">
        {filteredAndSortedApps.length === 0 ? (
          <div className="bg-white rounded-2xl border border-neutral-200/80 p-12 text-center my-8 shadow-xs">
            <AlertCircle className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-neutral-800">
              {showOnlySaved ? '보관함에 저장된 Custom AI 서비스가 없습니다' : '일치하는 Custom AI 서비스가 없습니다'}
            </h3>
            <p className="text-xs text-neutral-500 mt-1">
              {showOnlySaved ? '카드 상단의 북마크 아이콘을 클릭하여 자주 사용하는 서비스를 보관함에 담아보세요.' : '검색어를 다시 확인해보세요.'}
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setShowOnlySaved(false);
              }}
              className="mt-4 px-4 py-2 text-xs font-semibold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors cursor-pointer"
            >
              전체 서비스 보기
            </button>
          </div>
        ) : (
          <div 
            id="custom-ai-card-grid"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredAndSortedApps.map(app => (
              <CustomAiCard
                key={app.id}
                app={app}
                userRole={userRole}
                onClick={() => handleOpenApp(app)}
                onExecute={() => handleOpenApp(app)}
                onToggleSave={handleToggleSave}
                onToggleStatus={handleToggleStatus}
                onToggleHide={handleToggleHide}
                onDeleteApp={handleDeleteApp}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

