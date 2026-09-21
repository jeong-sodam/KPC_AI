import React, { useState } from 'react';
import { 
  FolderPlus, 
  Search, 
  Building2, 
  Calendar, 
  Clock, 
  User, 
  FileText, 
  ArrowRight, 
  Layers, 
  CheckCircle2, 
  SlidersHorizontal,
  ChevronRight,
  MoreVertical,
  Plus,
  Sparkles,
  BarChart2
} from 'lucide-react';
import { ProposalProject } from '../../types';
import { NewProjectModal } from './NewProjectModal';

export interface ProposalProjectExtended extends ProposalProject {
  rfpName?: string;
  currentStep?: string;
  progressPercent?: number;
  lastModified?: string;
  creationMethod?: 'requirements' | 'qa' | 'blank';
}

interface ProposalProjectsListProps {
  projects: ProposalProjectExtended[];
  onSelectProject: (proj: ProposalProjectExtended, initialStep?: string) => void;
  onCreateProject: (proj: ProposalProjectExtended) => void;
  onShowToast: (msg: string) => void;
}

export const ProposalProjectsList: React.FC<ProposalProjectsListProps> = ({
  projects,
  onSelectProject,
  onCreateProject,
  onShowToast
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStage, setFilterStage] = useState('전체');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const filteredProjects = (projects || []).filter(p => {
    const matchesSearch = 
      !searchQuery.trim() || 
      (p.title || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
      (p.agency && p.agency.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.rfpName && p.rfpName.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStage = filterStage === '전체' || (p.currentStep || p.stage) === filterStage;
    return matchesSearch && matchesStage;
  });

  return (
    <div className="flex-1 flex flex-col h-full overflow-y-auto bg-[#F8F9FA] p-6">
      <div className="max-w-7xl mx-auto w-full space-y-5">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-neutral-200">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-black text-[#111111] tracking-tight">
                제안 프로젝트
              </h1>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-50 text-[#E60012] border border-[#E60012]/30">
                총 {projects.length}개 프로젝트
              </span>
            </div>
            <p className="text-xs text-neutral-600 mt-1">
              RFP 등록부터 AI 분석, 체크리스트, 제안서 집필, 요구사항 매트릭스까지 5단계 파이프라인으로 관리합니다.
            </p>
          </div>

          <button
            onClick={() => setIsNewModalOpen(true)}
            className="px-4 py-2.5 rounded-lg bg-[#E60012] text-white text-xs font-bold hover:bg-[#CC0010] shadow-xs hover:shadow transition-all flex items-center justify-center gap-2 shrink-0 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>+ 새 프로젝트</span>
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-2xs">
            <span className="text-[11px] font-bold text-neutral-500">전체 프로젝트</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xl font-black text-[#111111]">{projects.length}</span>
              <span className="text-xs text-neutral-500">진행 중</span>
            </div>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-2xs">
            <span className="text-[11px] font-bold text-neutral-500">제안서 작성 중</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xl font-black text-[#E60012]">
                {projects.filter(p => (p.currentStep || '').includes('작성')).length || 1}
              </span>
              <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">집필 활성</span>
            </div>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-2xs">
            <span className="text-[11px] font-bold text-neutral-500">RFP / 체크리스트</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xl font-black text-neutral-800">
                {projects.filter(p => (p.currentStep || '').includes('RFP') || (p.currentStep || '').includes('체크')).length || 2}
              </span>
              <span className="text-[10px] text-neutral-500">분석 단계</span>
            </div>
          </div>
          <div className="bg-white p-3.5 rounded-xl border border-neutral-200 shadow-2xs">
            <span className="text-[11px] font-bold text-neutral-500">마감 임박 (30일 이내)</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-xl font-black text-amber-600">
                {projects.filter(p => (p.dDay || 99) <= 45).length || 3}
              </span>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">집중 관리</span>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl border border-neutral-200 p-3.5 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            {['전체', '문서 업로드', 'RFP 분석', '체크리스트', '제안서 작성', '매트릭스'].map(stage => (
              <button
                key={stage}
                onClick={() => setFilterStage(stage)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                  filterStage === stage
                    ? 'bg-[#111111] text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {stage}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-full md:w-72">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="프로젝트명, 발주기관, RFP 검색..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-[#F8F9FA] pl-8 pr-3 py-1.5 rounded-lg border border-neutral-300 text-xs text-[#111111] focus:outline-none focus:border-[#E60012]"
              />
            </div>
          </div>
        </div>

        {/* Project Table */}
        <div className="bg-white rounded-xl border border-neutral-200 shadow-2xs overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-[#F8F9FA] border-b border-neutral-200 text-neutral-600 font-bold">
                <th className="py-3 px-4 w-72">프로젝트명</th>
                <th className="py-3 px-3 w-36">발주기관</th>
                <th className="py-3 px-3 w-48">RFP명</th>
                <th className="py-3 px-3 w-28">마감일</th>
                <th className="py-3 px-3 w-28 text-center">진행 단계</th>
                <th className="py-3 px-3 w-36">전체 진행률</th>
                <th className="py-3 px-3 w-24">담당자</th>
                <th className="py-3 px-3 w-24 text-center">최종 수정</th>
                <th className="py-3 px-4 w-20 text-center">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredProjects.map(proj => {
                const stepName = proj.currentStep || '제안서 작성';
                const progress = proj.progressPercent ?? (stepName.includes('작성') ? 64 : stepName.includes('체크') ? 50 : stepName.includes('분석') ? 35 : 15);
                const isKpcSample = (proj.title || '').includes('KPC') || (proj.agency || '').includes('생산성본부');

                return (
                  <tr
                    key={proj.id}
                    onClick={() => onSelectProject(proj)}
                    className="hover:bg-neutral-50/90 cursor-pointer transition-colors group"
                  >
                    {/* Project Name */}
                    <td className="py-3.5 px-4 font-bold text-[#111111]">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-md bg-red-50 text-[#E60012] flex items-center justify-center shrink-0 group-hover:bg-[#E60012] group-hover:text-white transition-colors">
                          <FileText className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="group-hover:text-[#E60012] transition-colors line-clamp-1">
                            {proj.title}
                          </span>
                          {isKpcSample && (
                            <span className="text-[10px] font-bold text-[#E60012] bg-red-50 px-1.5 py-0.2 rounded border border-[#E60012]/20">
                              메인 프로젝트
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Agency */}
                    <td className="py-3.5 px-3 text-neutral-700 font-medium">
                      {proj.agency || '한국생산성본부'}
                    </td>

                    {/* RFP Name */}
                    <td className="py-3.5 px-3 text-neutral-600 truncate max-w-xs">
                      {proj.rfpName || `${proj.title} RFP`}
                    </td>

                    {/* Deadline */}
                    <td className="py-3.5 px-3 font-semibold text-neutral-800">
                      <span>{proj.deadline}</span>
                    </td>

                    {/* Current Step */}
                    <td className="py-3.5 px-3 text-center">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        stepName.includes('작성')
                          ? 'bg-red-50 text-[#E60012] border border-[#E60012]/30'
                          : stepName.includes('체크')
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : stepName.includes('분석')
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-neutral-100 text-neutral-700'
                      }`}>
                        {stepName}
                      </span>
                    </td>

                    {/* Overall Progress */}
                    <td className="py-3.5 px-3">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-bold">
                          <span className="text-neutral-600">진행률</span>
                          <span className="text-[#E60012]">{progress}%</span>
                        </div>
                        <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-[#E60012] h-full rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Manager */}
                    <td className="py-3.5 px-3 font-medium text-neutral-700">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-full bg-neutral-200 text-neutral-700 text-[10px] font-bold flex items-center justify-center">
                          {proj.manager?.slice(0, 1) || '정'}
                        </div>
                        <span>{proj.manager || '정소담'}</span>
                      </div>
                    </td>

                    {/* Last Modified */}
                    <td className="py-3.5 px-3 text-center text-neutral-500 font-medium">
                      {proj.lastModified || '10분 전'}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-center" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => onSelectProject(proj)}
                        className="px-2.5 py-1 rounded bg-neutral-100 hover:bg-[#E60012] text-neutral-700 hover:text-white font-bold text-[11px] transition-colors flex items-center gap-1 mx-auto"
                      >
                        <span>진입</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredProjects.length === 0 && (
            <div className="py-12 text-center text-neutral-400 text-xs">
              검색 조건에 일치하는 제안 프로젝트가 없습니다.
            </div>
          )}
        </div>
      </div>

      {/* New Project Modal */}
      <NewProjectModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onCreateProject={proj => {
          onCreateProject(proj);
          onSelectProject(proj, 'rfp_upload');
        }}
        onShowToast={onShowToast}
      />
    </div>
  );
};
