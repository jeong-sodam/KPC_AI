import React, { useState } from 'react';
import { 
  PanelLeftClose, 
  PanelLeftOpen, 
  Search, 
  Sparkles, 
  Check, 
  Filter, 
  Layers,
  ChevronRight,
  X
} from 'lucide-react';
import { CustomAiApp, CUSTOM_AI_CATEGORIES } from '../../data/customAiMockData';

interface CustomAiSidebarProps {
  apps: CustomAiApp[];
  selectedAppId: string | null;
  onSelectApp: (id: string | null) => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const CustomAiSidebar: React.FC<CustomAiSidebarProps> = ({
  apps,
  selectedAppId,
  onSelectApp,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  isCollapsed,
  onToggleCollapse
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  if (isCollapsed) {
    return (
      <aside
        id="custom-ai-sidebar-collapsed"
        className="w-14 border-r border-neutral-200 bg-white flex flex-col items-center py-4 justify-between transition-all shrink-0 select-none"
      >
        <div className="flex flex-col items-center gap-4 w-full">
          <button
            id="custom-ai-expand-btn"
            onClick={onToggleCollapse}
            className="p-2 rounded-md text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer"
            title="사이드바 펼치기"
          >
            <PanelLeftOpen className="w-5 h-5" />
          </button>

          <div className="w-8 h-px bg-neutral-200 my-1" />

          {/* Quick Category / All Icon */}
          <button
            id="custom-ai-all-mini-btn"
            onClick={() => {
              onSelectCategory('전체');
              onSelectApp(null);
            }}
            className={`p-2.5 rounded-lg transition-colors cursor-pointer ${
              selectedCategory === '전체' && selectedAppId === null
                ? 'bg-red-50 text-[#E60012]'
                : 'text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900'
            }`}
            title="전체 AI 앱"
          >
            <Layers className="w-5 h-5" />
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside
      id="custom-ai-sidebar"
      className="w-64 border-r border-neutral-200 bg-white flex flex-col justify-between transition-all shrink-0 select-none"
    >
      {/* Top Header */}
      <div className="p-3.5 border-b border-neutral-200 flex items-center justify-between">
        <span className="text-xs font-bold text-neutral-900 tracking-tight flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#E60012]" />
          <span>Custom AI 목록</span>
        </span>
        <div className="flex items-center gap-1">
          <button
            id="custom-ai-search-toggle-btn"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={`p-1.5 rounded-md transition-colors cursor-pointer ${
              isSearchOpen || searchQuery 
                ? 'text-[#E60012] bg-red-50' 
                : 'text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100'
            }`}
            title="AI 앱 검색"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            id="custom-ai-collapse-btn"
            onClick={onToggleCollapse}
            className="p-1.5 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
            title="사이드바 접기"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search Bar (Collapsible or if text exists) */}
      {(isSearchOpen || searchQuery) && (
        <div className="px-3 py-2 border-b border-neutral-100 bg-neutral-50 flex items-center gap-1.5">
          <Search className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
          <input
            id="custom-ai-search-input"
            type="text"
            placeholder="AI 이름 또는 키워드 검색..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="flex-1 bg-transparent text-xs text-neutral-900 outline-none placeholder:text-neutral-400"
            autoFocus
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="p-0.5 text-neutral-400 hover:text-neutral-700 cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {/* Main Sidebar Content */}
      <div className="p-3 space-y-4 flex-1 overflow-y-auto">
        {/* Category Filters */}
        <div>
          <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block mb-1.5 px-1">
            카테고리
          </span>
          <div className="space-y-0.5">
            {CUSTOM_AI_CATEGORIES.map(cat => {
              const isCatActive = selectedCategory === cat && selectedAppId === null;
              return (
                <button
                  key={cat}
                  id={`cat-btn-${cat}`}
                  onClick={() => {
                    onSelectCategory(cat);
                    onSelectApp(null);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer text-left ${
                    isCatActive
                      ? 'bg-red-50 text-[#E60012] font-semibold'
                      : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
                  }`}
                >
                  <span>{cat}</span>
                  {cat === '전체' ? (
                    <span className="text-[10px] text-neutral-400 font-mono">{apps.length}</span>
                  ) : (
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {apps.filter(a => a.category === cat).length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Individual AI App List (요구사항: DAOM, DARUDA, DADAM, 제안요청서 검토 자동화 등) */}
        <div className="pt-2 border-t border-neutral-100">
          <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block mb-1.5 px-1">
            맞춤형 AI 앱 목록
          </span>
          <div className="space-y-1">
            {apps.map(app => {
              const isSelected = selectedAppId === app.id;
              return (
                <button
                  key={app.id}
                  id={`sidebar-app-btn-${app.id}`}
                  onClick={() => {
                    onSelectApp(app.id);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs transition-colors cursor-pointer text-left ${
                    isSelected
                      ? 'bg-red-50/90 text-[#E60012] font-bold border border-red-200 shadow-2xs'
                      : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 border border-transparent'
                  }`}
                >
                  <div className="min-w-0 pr-1">
                    <span className="block truncate font-semibold">{app.name}</span>
                    <span className="block text-[10px] text-neutral-400 truncate mt-0.5">
                      {app.shortDesc}
                    </span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-[#E60012]' : 'text-neutral-300'}`} />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-neutral-200 bg-white text-[11px] text-neutral-500">
        <div className="flex items-center justify-between font-medium">
          <span>KPC 사내 배포 AI</span>
          <span className="text-neutral-800 font-bold">{apps.length}개 운영 중</span>
        </div>
        <span className="text-[10px] text-neutral-400 block mt-0.5">망분리 인프라 보안 인증 솔루션</span>
      </div>
    </aside>
  );
};
