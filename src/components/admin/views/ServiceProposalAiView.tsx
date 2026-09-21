import React, { useState } from 'react';
import { 
  FileText, 
  Cpu, 
  Users, 
  Lock, 
  Sliders, 
  Sparkles, 
  Check, 
  RotateCcw, 
  Save, 
  Search, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  ChevronRight, 
  Layers, 
  KeyRound, 
  Coins, 
  Clock, 
  Building,
  FileCode,
  DollarSign
} from 'lucide-react';
import { ProposalProject } from '../../../types';
import { SAMPLE_PROJECTS } from '../../../data/mockData';

interface ServiceProposalAiViewProps {
  onShowToast: (msg: string) => void;
}

export const ServiceProposalAiView: React.FC<ServiceProposalAiViewProps> = ({ onShowToast }) => {
  // Active Selected Project
  const [projects, setProjects] = useState<ProposalProject[]>(SAMPLE_PROJECTS);
  const [selectedProjectId, setSelectedProjectId] = useState<string>(SAMPLE_PROJECTS[0].id);
  const [projectTab, setProjectTab] = useState<
    'routing' | 'users' | 'documents' | 'prompts' | 'budget' | 'security'
  >('routing');

  const selectedProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  // Routing Mode: Auto vs Manual
  const [routingMode, setRoutingMode] = useState<'auto' | 'manual'>('manual');

  // Task Granular LLM Configuration State
  const [taskLlmConfig, setTaskLlmConfig] = useState([
    {
      taskId: 'rfp_search',
      taskName: '1. RFP 검색 및 탐색',
      desc: '공공/기업 RFP 키워드 검색 및 관련 유사 사업 탐색',
      primaryModel: 'Gemini 1.5 Flash Enterprise',
      fallbackModel: 'GPT-4o mini',
      reason: '대용량 RFP 문서의 고속 검색 및 빠른 토큰 처리 성능 우수',
      estCost: '₩0.12 / 요청',
      estSpeed: '< 0.5초'
    },
    {
      taskId: 'rfp_analysis',
      taskName: '2. RFP 심층 분석 & 추론',
      desc: '제안요청서의 사업 목적, 핵심 과제, 발주처 니즈 심층 분석',
      primaryModel: 'Claude 3.5 Sonnet (Enterprise)',
      fallbackModel: 'GPT-4o Enterprise',
      reason: '복잡한 맥락 및 기술 요구사항 추론/분석 성능 최고 등급',
      estCost: '₩1.45 / 요청',
      estSpeed: '1.8초'
    },
    {
      taskId: 'req_extraction',
      taskName: '3. 요구사항 및 절차 추출',
      desc: '제출 서류, 자격 요건, 기술 규격 및 준수 사항 자동 추출',
      primaryModel: 'GPT-4o Enterprise',
      fallbackModel: 'Claude 3.5 Sonnet (Enterprise)',
      reason: '구조화된 JSON/테이블 형태의 정밀 요구사항 매핑 우수',
      estCost: '₩0.85 / 요청',
      estSpeed: '1.2초'
    },
    {
      taskId: 'win_strategy',
      taskName: '4. Win Theme & 제안 전략',
      desc: '수주 전략, 차별화 포인트, 경쟁사 대비 우위 전략 수립',
      primaryModel: 'Claude 3.5 Sonnet (Enterprise)',
      fallbackModel: 'O1 Reasoning Model',
      reason: '공공/Enterprise 제안 수주 논리 및 창의적 전략 도출 우수',
      estCost: '₩2.10 / 요청',
      estSpeed: '2.4초'
    },
    {
      taskId: 'draft_writing',
      taskName: '5. 제안서 초안 작성 (Long-Form)',
      desc: '목차별 제안 내용 장문 자동 작성 및 기술 구현 방안 수립',
      primaryModel: 'Claude 3.5 Sonnet (Enterprise)',
      fallbackModel: 'GPT-4o Enterprise',
      reason: '자연스러운 한국어 문체, 장문 문단 구성 및 가독성 최상',
      estCost: '₩3.50 / 요청',
      estSpeed: '3.1초'
    },
    {
      taskId: 'polishing_edit',
      taskName: '6. 문장 수정 & 표현 다듬기',
      desc: '개조식 문장 변환, 전문 용어 정제 및 톤앤매너 교정',
      primaryModel: 'GPT-4o Enterprise',
      fallbackModel: 'HyperCLOVA X HCX-003',
      reason: '빠른 응답 속도 및 개조식/공공 문서 표준 표현 정제',
      estCost: '₩0.35 / 요청',
      estSpeed: '0.6초'
    },
    {
      taskId: 'grounding_verify',
      taskName: '7. 근거 검증 & 출처 확인',
      desc: '제안서 기재 내용과 RFP 원문/수행 실적 간 부합 여부 검증',
      primaryModel: 'Gemini 1.5 Pro Enterprise',
      fallbackModel: 'Claude 3.5 Sonnet (Enterprise)',
      reason: 'Long Context (2M) 기반 전수 원문 일치성/Grounding 검증',
      estCost: '₩1.80 / 요청',
      estSpeed: '2.0초'
    },
    {
      taskId: 'multilingual_trans',
      taskName: '8. 다국어 제안서 번역',
      desc: '영문/글로벌 제안서 매끄러운 전문 기술 번역',
      primaryModel: 'GPT-4o Enterprise',
      fallbackModel: 'Claude 3.5 Sonnet (Enterprise)',
      reason: 'IT/기술 도메인 전문 용어 표준화 번역 성능 우수',
      estCost: '₩0.90 / 요청',
      estSpeed: '1.1초'
    }
  ]);

  // Project Members & Roles
  const [projectMembers, setProjectMembers] = useState([
    { id: 'm-1', name: '정소담', role: 'PM', dept: 'AI사업본부', job: '수석연구원', access: '전체 권한 (PM)' },
    { id: 'm-2', name: '김태완', role: '작성자', dept: 'AI사업본부', job: '책임연구원', access: '작성/수정 권한' },
    { id: 'm-3', name: '이수진', role: '검토자', dept: '기술개발처', job: '선임연구원', access: '열람/댓글 권한' },
    { id: 'm-4', name: '박민우', role: '승인자', dept: '경영기획처', job: '팀장', access: '최종 승인 권한' }
  ]);

  // Project Document Permissions
  const [projectDocs, setProjectDocs] = useState([
    { id: 'd-1', name: '2026_KPC_AI플랫폼_RFP.pdf', type: 'RFP 본문', aiSearch: true, aiRef: true, userView: true, download: false },
    { id: 'd-2', name: '사내_유사_수행실적_증명서.pdf', type: '수행실적', aiSearch: true, aiRef: true, userView: true, download: true },
    { id: 'd-3', name: 'KPC_표준_회사소개서_2026.pptx', type: '회사소개', aiSearch: true, aiRef: true, userView: true, download: true },
    { id: 'd-4', name: '기존_망연계_보안_제안서_참고.pdf', type: '참고자료', aiSearch: true, aiRef: true, userView: true, download: false }
  ]);

  const handleUpdateTaskModel = (taskId: string, field: 'primaryModel' | 'fallbackModel', val: string) => {
    setTaskLlmConfig(prev => prev.map(t => {
      if (t.taskId === taskId) {
        return { ...t, [field]: val };
      }
      return t;
    }));
    onShowToast(`[${taskId}] 업무 단계 모델 설정이 변경되었습니다.`);
  };

  const handleToggleDocPerm = (docId: string, permKey: 'aiSearch' | 'aiRef' | 'userView' | 'download') => {
    setProjectDocs(prev => prev.map(d => {
      if (d.id === docId) {
        return { ...d, [permKey]: !d[permKey] };
      }
      return d;
    }));
    onShowToast('문서 권한 정책이 업데이트되었습니다.');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#E60012]" />
            <h2 className="text-lg font-bold text-neutral-900">제안서 AI 프로젝트별 관리자 콘솔</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E60012] text-white">
              업무 단계별 LLM 오버라이드 라우팅
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            제안서 작성 사업(프로젝트)별로 업무 단계별 최적 LLM, 참여자 권한, RFP 문서 보안 통제 정책을 정밀 설정합니다.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onShowToast('제안서 AI 서비스 전체 설정이 저장되었습니다.')}
          className="px-4 py-2 bg-[#E60012] hover:bg-[#CC0010] text-white rounded-xl text-xs font-black transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>전체 프로젝트 정책 저장</span>
        </button>
      </div>

      {/* Project Selector Strip */}
      <div className="bg-neutral-50 rounded-2xl border border-neutral-200 p-4 flex items-center gap-3 overflow-x-auto">
        <span className="text-xs font-bold text-neutral-700 shrink-0">대상 제안 프로젝트:</span>
        <div className="flex items-center gap-2">
          {projects.map(p => {
            const isSelected = p.id === selectedProjectId;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedProjectId(p.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-neutral-900 text-white shadow-2xs'
                    : 'bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200'
                }`}
              >
                {p.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Project Control Panel */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden">
        {/* Project Header Summary */}
        <div className="p-6 border-b border-neutral-200 bg-neutral-50/50 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#E60012] text-white">
                {selectedProject.department}
              </span>
              <h3 className="text-base font-bold text-neutral-900">{selectedProject.title}</h3>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              발주처: <span className="font-bold text-neutral-800">{selectedProject.client}</span> · 사업예산: <span className="font-bold text-[#E60012]">{selectedProject.budget}</span> · PM: <span className="font-bold text-neutral-800">{selectedProject.manager}</span>
            </p>
          </div>

          {/* Inner Tabs Navigation */}
          <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl border border-neutral-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setProjectTab('routing')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                projectTab === 'routing' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-500'
              }`}
            >
              업무별 LLM 라우팅
            </button>
            <button
              type="button"
              onClick={() => setProjectTab('users')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                projectTab === 'users' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-500'
              }`}
            >
              참여자/권한 ({projectMembers.length})
            </button>
            <button
              type="button"
              onClick={() => setProjectTab('documents')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                projectTab === 'documents' ? 'bg-white text-neutral-900 shadow-2xs' : 'text-neutral-500'
              }`}
            >
              문서 보안 권한 ({projectDocs.length})
            </button>
          </div>
        </div>

        {/* Tab Content 1: Task-specific Granular LLM Routing (핵심 요구사항 #14) */}
        {projectTab === 'routing' && (
          <div className="p-6 space-y-6">
            {/* Auto vs Manual Mode Bar */}
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <Cpu className="w-5 h-5 text-[#E60012]" />
                <div>
                  <h4 className="text-xs font-bold text-neutral-900">제안서 업무 단계별 AI 모델 설정 모드</h4>
                  <p className="text-[11px] text-neutral-500">자동 추천 모드는 사내 라우팅 정책을 따르며, 직접 설정은 업무 단계별 LLM을 오버라이드합니다.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white p-1 rounded-xl border border-neutral-200">
                <button
                  type="button"
                  onClick={() => {
                    setRoutingMode('auto');
                    onShowToast('플랫폼 LLM 자동 추천 라우팅으로 전환되었습니다.');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    routingMode === 'auto' ? 'bg-neutral-900 text-white shadow-2xs' : 'text-neutral-600'
                  }`}
                >
                  ○ AI 자동 추천 모드
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRoutingMode('manual');
                    onShowToast('관리자 직접 설정 (Manual Override) 모드가 활성화되었습니다.');
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    routingMode === 'manual' ? 'bg-[#E60012] text-white shadow-2xs' : 'text-neutral-600'
                  }`}
                >
                  ● 직접 설정 모드
                </button>
              </div>
            </div>

            {/* Task Granular LLM Table */}
            <div className="border border-neutral-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-neutral-100 text-neutral-700 font-bold border-b border-neutral-200">
                  <tr>
                    <th className="py-3 px-4">제안서 업무 단계</th>
                    <th className="py-3 px-4">우선 적용 모델 (Primary)</th>
                    <th className="py-3 px-4">대체 모델 (Fallback)</th>
                    <th className="py-3 px-4">선택 사유 / 특성</th>
                    <th className="py-3 px-4 text-right">예상 비용 / 속도</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {taskLlmConfig.map(t => (
                    <tr key={t.taskId} className="hover:bg-neutral-50/50">
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-neutral-900 block">{t.taskName}</span>
                        <span className="text-[11px] text-neutral-500">{t.desc}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <select
                          disabled={routingMode === 'auto'}
                          value={t.primaryModel}
                          onChange={e => handleUpdateTaskModel(t.taskId, 'primaryModel', e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-neutral-50 border border-neutral-300 rounded-lg font-bold text-neutral-900 focus:outline-none focus:border-[#E60012] disabled:opacity-50"
                        >
                          <option value="Claude 3.5 Sonnet (Enterprise)">Claude 3.5 Sonnet (Enterprise)</option>
                          <option value="GPT-4o Enterprise">GPT-4o Enterprise</option>
                          <option value="Gemini 1.5 Pro Enterprise">Gemini 1.5 Pro Enterprise</option>
                          <option value="Gemini 1.5 Flash Enterprise">Gemini 1.5 Flash Enterprise</option>
                          <option value="O1 Reasoning Model">O1 Reasoning Model</option>
                          <option value="HyperCLOVA X HCX-003">HyperCLOVA X HCX-003</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4">
                        <select
                          disabled={routingMode === 'auto'}
                          value={t.fallbackModel}
                          onChange={e => handleUpdateTaskModel(t.taskId, 'fallbackModel', e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-neutral-50 border border-neutral-300 rounded-lg text-neutral-700 focus:outline-none focus:border-[#E60012] disabled:opacity-50"
                        >
                          <option value="GPT-4o Enterprise">GPT-4o Enterprise</option>
                          <option value="GPT-4o mini">GPT-4o mini</option>
                          <option value="Claude 3.5 Sonnet (Enterprise)">Claude 3.5 Sonnet</option>
                          <option value="HyperCLOVA X HCX-003">HyperCLOVA X HCX-003</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4 text-neutral-600 leading-relaxed text-[11px]">
                        {t.reason}
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono text-[11px]">
                        <span className="font-bold text-neutral-900 block">{t.estCost}</span>
                        <span className="text-neutral-400">{t.estSpeed}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content 2: Project Users & Roles (핵심 요구사항 #15) */}
        {projectTab === 'users' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#E60012]" />
                <span>프로젝트 참여자 역할 및 권한 관리 (RBAC)</span>
              </h4>
              <button
                type="button"
                onClick={() => onShowToast('새로운 프로젝트 팀원 추가 창이 열립니다.')}
                className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>팀원 추가</span>
              </button>
            </div>

            <div className="border border-neutral-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-neutral-100 text-neutral-700 font-bold border-b border-neutral-200">
                  <tr>
                    <th className="py-2.5 px-4">이름 / 직급</th>
                    <th className="py-2.5 px-4">소속 부서</th>
                    <th className="py-2.5 px-4">프로젝트 Role</th>
                    <th className="py-2.5 px-4">세부 작업 권한</th>
                    <th className="py-2.5 px-4 text-center">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {projectMembers.map(m => (
                    <tr key={m.id} className="hover:bg-neutral-50/50">
                      <td className="py-3 px-4 font-bold text-neutral-900">
                        {m.name} <span className="text-[11px] font-normal text-neutral-500">({m.job})</span>
                      </td>
                      <td className="py-3 px-4 text-neutral-600">{m.dept}</td>
                      <td className="py-3 px-4">
                        <select
                          value={m.role}
                          onChange={e => {
                            const val = e.target.value;
                            setProjectMembers(prev => prev.map(item => item.id === m.id ? { ...item, role: val } : item));
                            onShowToast(`${m.name} 님의 역할이 [${val}]로 변경되었습니다.`);
                          }}
                          className="px-2.5 py-1 bg-neutral-50 border border-neutral-300 rounded-lg text-xs font-bold text-neutral-900"
                        >
                          <option value="PM">PM (전체 총괄 & 승인)</option>
                          <option value="작성자">작성자 (Draft 생성/수정)</option>
                          <option value="검토자">검토자 (열람 & 피드백)</option>
                          <option value="승인자">승인자 (최종 결재)</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-neutral-600 text-[11px] font-mono">{m.access}</td>
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            setProjectMembers(prev => prev.filter(item => item.id !== m.id));
                            onShowToast(`${m.name} 님이 프로젝트에서 제외되었습니다.`);
                          }}
                          className="text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content 3: Project Document Permissions (핵심 요구사항 #16) */}
        {projectTab === 'documents' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-[#E60012]" />
                <span>프로젝트 참고 문서 및 RFP 세부 접근 보안 통제</span>
              </h4>
            </div>

            <div className="border border-neutral-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-neutral-100 text-neutral-700 font-bold border-b border-neutral-200">
                  <tr>
                    <th className="py-2.5 px-4">문서명</th>
                    <th className="py-2.5 px-4">구분</th>
                    <th className="py-2.5 px-4 text-center">AI 검색 허용</th>
                    <th className="py-2.5 px-4 text-center">AI 작성 참고 허용</th>
                    <th className="py-2.5 px-4 text-center">사용자 열람</th>
                    <th className="py-2.5 px-4 text-center">파일 다운로드</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {projectDocs.map(doc => (
                    <tr key={doc.id} className="hover:bg-neutral-50/50">
                      <td className="py-3 px-4 font-bold text-neutral-900">{doc.name}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-100 text-neutral-600">
                          {doc.type}
                        </span>
                      </td>
                      {(['aiSearch', 'aiRef', 'userView', 'download'] as const).map(pKey => (
                        <td key={pKey} className="py-3 px-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleDocPerm(doc.id, pKey)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              doc[pKey]
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-neutral-100 text-neutral-400'
                            }`}
                          >
                            {doc[pKey] ? '허용' : '제한'}
                          </button>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
