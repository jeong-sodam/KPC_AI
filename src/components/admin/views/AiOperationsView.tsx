import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  MessageSquare, 
  FileCode, 
  Search, 
  Plus, 
  Check, 
  X, 
  AlertTriangle, 
  Eye, 
  Flame, 
  ShieldCheck, 
  Sliders,
  History,
  TrendingUp,
  CheckCircle2,
  Settings,
  PowerOff,
  Play,
  Save,
  Globe,
  Coins,
  Lock,
  Layers,
  ArrowRight
} from 'lucide-react';
import { 
  ManagedAiAgent, 
  ManagedCustomAi, 
  CommunityManagedPost, 
  SystemPromptTemplate 
} from '../../../types';

interface AiOperationsViewProps {
  subTab: 'agents' | 'custom_ai' | 'community' | 'prompts';
  onShowToast: (msg: string) => void;
  agents: ManagedAiAgent[];
  setAgents: React.Dispatch<React.SetStateAction<ManagedAiAgent[]>>;
  customAiList: ManagedCustomAi[];
  setCustomAiList: React.Dispatch<React.SetStateAction<ManagedCustomAi[]>>;
  communityPosts: CommunityManagedPost[];
  setCommunityPosts: React.Dispatch<React.SetStateAction<CommunityManagedPost[]>>;
  systemPrompts: SystemPromptTemplate[];
  setSystemPrompts: React.Dispatch<React.SetStateAction<SystemPromptTemplate[]>>;
}

export const AiOperationsView: React.FC<AiOperationsViewProps> = ({
  subTab,
  onShowToast,
  agents,
  setAgents,
  customAiList,
  setCustomAiList,
  communityPosts,
  setCommunityPosts,
  systemPrompts,
  setSystemPrompts
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState<SystemPromptTemplate | null>(null);

  // Agent Management Modal State
  const [managingAgent, setManagingAgent] = useState<ManagedAiAgent | null>(null);
  const [editAgentStatus, setEditAgentStatus] = useState<'운영 중' | '검토 중' | '사용 중지'>('운영 중');
  const [editAgentScope, setEditAgentScope] = useState<'전사 공개' | '부서 한정' | '비공개'>('전사 공개');
  const [editAgentTokenLimit, setEditAgentTokenLimit] = useState<number>(1000000);
  const [editAgentModel, setEditAgentModel] = useState<string>('GPT-4o Enterprise');

  // Custom AI Management Modal State
  const [managingCustomAi, setManagingCustomAi] = useState<ManagedCustomAi | null>(null);
  const [editCustomAiStatus, setEditCustomAiStatus] = useState<'운영 중' | '개발 중' | '보관' | '사용 중지'>('운영 중');
  const [editCustomAiScope, setEditCustomAiScope] = useState<'전사 공개' | '팀 공개' | '비공개'>('전사 공개');
  const [editCustomAiTokenLimit, setEditCustomAiTokenLimit] = useState<number>(500000);
  const [editCustomAiModel, setEditCustomAiModel] = useState<string>('GPT-4o Enterprise');

  // Open Agent Manage Modal
  const handleOpenManageAgent = (ag: ManagedAiAgent) => {
    setManagingAgent(ag);
    setEditAgentStatus(ag.status === '개발 중' ? '검토 중' : ag.status);
    setEditAgentScope(ag.sharingScope || '전사 공개');
    setEditAgentTokenLimit(ag.tokenLimit || 1000000);
    setEditAgentModel(ag.connectedModel || 'GPT-4o Enterprise');
  };

  // Save Agent Manage Changes
  const handleSaveManageAgent = () => {
    if (!managingAgent) return;
    setAgents(prev => prev.map(a => {
      if (a.id === managingAgent.id) {
        return {
          ...a,
          status: editAgentStatus,
          sharingScope: editAgentScope,
          tokenLimit: editAgentTokenLimit,
          connectedModel: editAgentModel
        };
      }
      return a;
    }));
    onShowToast(`[운영 정책 저장] '${managingAgent.name}'의 상태(${editAgentStatus}), 모델(${editAgentModel}), 할당량이 반영되었습니다.`);
    setManagingAgent(null);
  };

  // Open Custom AI Manage Modal
  const handleOpenManageCustomAi = (cai: ManagedCustomAi) => {
    setManagingCustomAi(cai);
    setEditCustomAiStatus(cai.status);
    setEditCustomAiScope(cai.sharingScope);
    setEditCustomAiTokenLimit(cai.tokenLimit || 500000);
    setEditCustomAiModel(cai.usedModel || 'GPT-4o Enterprise');
  };

  // Save Custom AI Manage Changes
  const handleSaveManageCustomAi = () => {
    if (!managingCustomAi) return;
    setCustomAiList(prev => prev.map(c => {
      if (c.id === managingCustomAi.id) {
        return {
          ...c,
          status: editCustomAiStatus,
          sharingScope: editCustomAiScope,
          tokenLimit: editCustomAiTokenLimit,
          usedModel: editCustomAiModel
        };
      }
      return c;
    }));
    onShowToast(`[운영 정책 저장] '${managingCustomAi.name}'의 상태(${editCustomAiStatus}), 공유범위(${editCustomAiScope})가 반영되었습니다.`);
    setManagingCustomAi(null);
  };

  // Moderate Community Post
  const handleModeratePost = (postId: string, newStatus: CommunityManagedPost['status']) => {
    setCommunityPosts(prev => prev.map(p => {
      if (p.id === postId) {
        onShowToast(`게시물 조치 완료: [${newStatus}]`);
        return { ...p, status: newStatus };
      }
      return p;
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ─────────────────────────────────────────────────────────────
          1. AI Agent 관리 테이블 (Requirement 7)
          형태: Agent 이름 | 개발자 | 사용자 | 실행 | Token | 비용 | 상태 | 관리
          ───────────────────────────────────────────────────────────── */}
      {subTab === 'agents' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-neutral-900">AI Agent 라이프사이클 및 운영 관리</h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                사내 등록된 자율형 AI Agent의 운영 승인, 사용 중지, 공개 범위, Token 제한 및 연계 모델을 총괄 제어합니다.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onShowToast('신규 공식 AI Agent 등록 신청 창이 열렸습니다.')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#E60012] hover:bg-[#CC0010] text-white rounded-xl text-xs font-bold shadow-2xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>신규 Agent 등록</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-bold">
                  <th className="py-3.5 px-4">Agent 이름</th>
                  <th className="py-3.5 px-3">개발자</th>
                  <th className="py-3.5 px-3">사용자</th>
                  <th className="py-3.5 px-3">실행</th>
                  <th className="py-3.5 px-3">Token</th>
                  <th className="py-3.5 px-3">비용</th>
                  <th className="py-3.5 px-3">상태</th>
                  <th className="py-3.5 px-4 text-right">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {agents.map(ag => (
                  <tr key={ag.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-bold shrink-0 shadow-2xs">
                          <Bot className="w-4 h-4 text-[#E60012]" />
                        </div>
                        <div>
                          <span className="font-bold text-neutral-900 block text-xs">{ag.name}</span>
                          <span className="text-[10px] text-neutral-400 font-mono">
                            {ag.connectedModel}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-bold text-neutral-800 block">{ag.developer}</span>
                      <span className="text-[11px] text-neutral-400">{ag.department}</span>
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-neutral-900">
                      {ag.usersCount.toLocaleString()}명
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-neutral-900">
                      {ag.executionCount.toLocaleString()}회
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-neutral-900">
                      {(ag.tokensUsed / 1000000).toFixed(2)}M Token
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-neutral-900">
                      ₩{ag.estimatedCostKrw.toLocaleString()}원
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        ag.status === '운영 중'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : ag.status === '사용 중지'
                          ? 'bg-red-50 text-[#E60012] border-red-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {ag.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        id={`btn-manage-agent-${ag.id}`}
                        onClick={() => handleOpenManageAgent(ag)}
                        className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                      >
                        관리
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. Custom AI 관리 테이블 (Requirement 7)
          형태: 서비스 이름 | 생성자 | 사용자 | 실행 | Token | 비용 | 상태 | 관리
          ───────────────────────────────────────────────────────────── */}
      {subTab === 'custom_ai' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-neutral-900">Custom AI 운영 관리</h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                사내 임직원이 생성한 Custom AI(사내 GPTs)의 운영 승인, 사용 중지, 공개 범위 및 모델 정책을 통제합니다.
              </p>
            </div>
            <span className="text-xs text-neutral-500 font-medium">총 {customAiList.length}개 등록</span>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-bold">
                  <th className="py-3.5 px-4">서비스 이름</th>
                  <th className="py-3.5 px-3">생성자</th>
                  <th className="py-3.5 px-3">사용자</th>
                  <th className="py-3.5 px-3">실행</th>
                  <th className="py-3.5 px-3">Token</th>
                  <th className="py-3.5 px-3">비용</th>
                  <th className="py-3.5 px-3">상태</th>
                  <th className="py-3.5 px-4 text-right">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {customAiList.map(cai => (
                  <tr key={cai.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div>
                        <span className="font-bold text-neutral-900 block text-xs">{cai.name}</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="px-1.5 py-0.2 rounded bg-neutral-100 text-neutral-600 text-[10px] font-semibold">
                            {cai.category}
                          </span>
                          <span className="text-[10px] text-neutral-400 font-mono">
                            {cai.usedModel}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="font-bold text-neutral-800 block">{cai.creator}</span>
                      <span className="text-[11px] text-neutral-400">{cai.department}</span>
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-neutral-900">
                      {cai.usersCount.toLocaleString()}명
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-neutral-900">
                      {cai.executionCount.toLocaleString()}회
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-neutral-900">
                      {(cai.tokensUsed / 1000).toLocaleString()}K
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-neutral-900">
                      ₩{cai.estimatedCostKrw.toLocaleString()}원
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        cai.status === '운영 중'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : cai.status === '사용 중지'
                          ? 'bg-red-50 text-[#E60012] border-red-200'
                          : 'bg-neutral-100 text-neutral-700 border-neutral-200'
                      }`}>
                        {cai.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        id={`btn-manage-customai-${cai.id}`}
                        onClick={() => handleOpenManageCustomAi(cai)}
                        className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                      >
                        관리
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          3. AI Community 관리
          ───────────────────────────────────────────────────────────── */}
      {subTab === 'community' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-neutral-900">AI Community 운영 및 모니터링</h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                임직원이 사내 공유한 프롬프트/에이전트 게시물, 사용 횟수 순위, 신고 내역 모니터링 및 공식 AI 승격을 관리합니다.
              </p>
            </div>
            <span className="text-xs text-neutral-500 font-medium">총 {communityPosts.length}건 등록됨</span>
          </div>

          <div className="space-y-3">
            {communityPosts.map(post => (
              <div key={post.id} className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-100 text-neutral-700">
                      {post.aiType}
                    </span>
                    <h3 className="font-bold text-sm text-neutral-900">{post.title}</h3>
                    {post.reportsCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-[#E60012] border border-red-200 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        신고 {post.reportsCount}건
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-neutral-400">
                    <span>작성자: {post.author} ({post.department})</span>
                    <span>·</span>
                    <span>등록일: {post.createdAt}</span>
                    <span>·</span>
                    <span>조회 {post.views}회 · 사용 {post.usesCount}회 · 추천 {post.likes}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`px-2 py-1 rounded-lg text-[11px] font-bold ${
                    post.status.includes('승격')
                      ? 'bg-purple-50 text-purple-700 border border-purple-200'
                      : post.status === '게시물 숨김'
                      ? 'bg-red-50 text-[#E60012] border border-red-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {post.status}
                  </span>

                  {post.status === '정상' ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleModeratePost(post.id, '승격 완료 (Custom AI)')}
                        className="px-2 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[11px] font-bold cursor-pointer"
                      >
                        공식 승격
                      </button>
                      <button
                        type="button"
                        onClick={() => handleModeratePost(post.id, '게시물 숨김')}
                        className="px-2 py-1 bg-red-50 hover:bg-red-100 text-[#E60012] rounded-lg text-[11px] font-bold border border-red-200 cursor-pointer"
                      >
                        숨김 조치
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleModeratePost(post.id, '정상')}
                      className="px-2 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-[11px] font-bold cursor-pointer"
                    >
                      정상 복구
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          4. 시스템 프롬프트 관리
          ───────────────────────────────────────────────────────────── */}
      {subTab === 'prompts' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-neutral-900">시스템 프롬프트 버전 관리</h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                DIA (Knowledge AI), 제안서 생성 등 핵심 서비스별 시스템 프롬프트의 버전 이력, 배포 상태 및 변경 내역을 관리합니다.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onShowToast('신규 프롬프트 템플릿 등록 양식을 열었습니다.')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E60012] hover:bg-[#CC0010] text-white rounded-xl text-xs font-bold shadow-2xs transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>새 프롬프트 버전 작성</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {systemPrompts.map(prmpt => (
              <div key={prmpt.id} className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs space-y-3">
                <div className="flex items-start justify-between gap-2 pb-2 border-b border-neutral-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-neutral-900">{prmpt.serviceName}</h3>
                      <span className="px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-800 font-mono text-[11px] font-bold">
                        {prmpt.version}
                      </span>
                    </div>
                    <span className="text-[11px] text-neutral-400">
                      수정: {prmpt.author} · {prmpt.updatedAt}
                    </span>
                  </div>

                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {prmpt.status}
                  </span>
                </div>

                {/* Prompt Content Preview */}
                <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 font-mono text-xs text-neutral-700 leading-relaxed max-h-28 overflow-y-auto">
                  {prmpt.content}
                </div>

                <div className="flex items-center justify-between pt-2 text-xs">
                  <span className="text-neutral-400 text-[11px]">
                    누적 버전: {prmpt.historyCount}개 기록됨
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onShowToast(`[${prmpt.serviceName}] 버전 이력 비교 팝업을 열었습니다.`)}
                      className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-[11px] font-bold cursor-pointer"
                    >
                      버전 이력 ({prmpt.historyCount})
                    </button>
                    <button
                      type="button"
                      onClick={() => onShowToast(`[${prmpt.serviceName}] 프롬프트 테스트 환경(Playground)으로 이동합니다.`)}
                      className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-[11px] font-bold cursor-pointer"
                    >
                      테스트 / 편집
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          AI Agent 관리 Modal (Requirement 7)
          운영 승인 | 사용 중지 | 공개 범위 변경 | Token 제한 설정 | 연결 모델 변경
          ───────────────────────────────────────────────────────────── */}
      {managingAgent && (
        <div 
          id="manage-agent-modal"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-neutral-900 text-white flex items-center justify-center shadow-xs">
                  <Bot className="w-4 h-4 text-[#E60012]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-neutral-900">
                    {managingAgent.name} 운영 정책 설정
                  </h3>
                  <span className="text-[11px] text-neutral-500">
                    개발자: {managingAgent.developer} ({managingAgent.department})
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setManagingAgent(null)}
                className="w-8 h-8 rounded-lg hover:bg-neutral-200 text-neutral-500 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              {/* 1. 운영 상태 전환 (운영 승인 / 사용 중지) */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-800 block">
                  1. 서비스 운영 상태 관리
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditAgentStatus('운영 중')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      editAgentStatus === '운영 중'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-neutral-200'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>운영 승인</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditAgentStatus('사용 중지')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      editAgentStatus === '사용 중지'
                        ? 'bg-[#E60012] text-white border-[#E60012] shadow-xs'
                        : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-neutral-200'
                    }`}
                  >
                    <PowerOff className="w-3.5 h-3.5" />
                    <span>사용 중지</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditAgentStatus('검토 중')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      editAgentStatus === '검토 중'
                        ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                        : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-neutral-200'
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>검토 중</span>
                  </button>
                </div>
              </div>

              {/* 2. 공개 범위 변경 */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-800 flex items-center justify-between">
                  <span>2. 공개 범위 설정</span>
                  <span className="text-[11px] text-neutral-400 font-normal">사내 가시성 제어</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['전사 공개', '부서 한정', '비공개'] as const).map(scope => (
                    <button
                      key={scope}
                      type="button"
                      onClick={() => setEditAgentScope(scope)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        editAgentScope === scope
                          ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                          : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-neutral-200'
                      }`}
                    >
                      {scope === '전사 공개' && <Globe className="w-3.5 h-3.5" />}
                      {scope === '부서 한정' && <Layers className="w-3.5 h-3.5" />}
                      {scope === '비공개' && <Lock className="w-3.5 h-3.5" />}
                      <span>{scope}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Token 제한 설정 */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-800 flex items-center justify-between">
                  <span>3. 월간 Token 사용 한도</span>
                  <span className="text-[11px] font-mono font-bold text-neutral-600">
                    현재 소진: {(managingAgent.tokensUsed / 1000000).toFixed(2)}M Token
                  </span>
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      step={100000}
                      value={editAgentTokenLimit}
                      onChange={(e) => setEditAgentTokenLimit(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-mono font-bold focus:outline-hidden focus:ring-2 focus:ring-[#E60012] focus:bg-white transition-all"
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-neutral-400 font-semibold">
                      Token
                    </span>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  {[500000, 1000000, 2000000, 5000000].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setEditAgentTokenLimit(amt)}
                      className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-[11px] font-bold cursor-pointer transition-colors"
                    >
                      {(amt / 1000000).toFixed(1)}M
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. 연결 모델 변경 */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-800 block">
                  4. 연계 파운데이션 모델 변경
                </label>
                <select
                  value={editAgentModel}
                  onChange={(e) => setEditAgentModel(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#E60012] focus:bg-white transition-all"
                >
                  <option value="GPT-4o Enterprise">OpenAI GPT-4o Enterprise (사내 기본)</option>
                  <option value="Claude 3.5 Sonnet">Anthropic Claude 3.5 Sonnet (코딩/분석)</option>
                  <option value="Google Gemini 1.5 Pro">Google Gemini 1.5 Pro (멀티모달 대용량)</option>
                  <option value="HyperCLOVA X">Naver HyperCLOVA X (한국어 공공/금융)</option>
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-neutral-50/70 border-t border-neutral-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setManagingAgent(null)}
                className="px-4 py-2 rounded-xl border border-neutral-200 hover:bg-neutral-100 text-neutral-700 text-xs font-bold cursor-pointer transition-colors"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleSaveManageAgent}
                className="px-5 py-2 rounded-xl bg-[#E60012] hover:bg-[#CC0010] text-white text-xs font-bold shadow-2xs cursor-pointer transition-colors flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>정책 저장 및 반영</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          Custom AI 관리 Modal (Requirement 7)
          운영 승인 | 사용 중지 | 공개 범위 변경 | Token 제한 설정 | 연결 모델 변경
          ───────────────────────────────────────────────────────────── */}
      {managingCustomAi && (
        <div 
          id="manage-customai-modal"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-neutral-900">
                    {managingCustomAi.name} 운영 관리
                  </h3>
                  <span className="text-[11px] text-neutral-500">
                    생성자: {managingCustomAi.creator} ({managingCustomAi.department})
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setManagingCustomAi(null)}
                className="w-8 h-8 rounded-lg hover:bg-neutral-200 text-neutral-500 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              {/* 1. 운영 상태 전환 */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-800 block">
                  1. 서비스 운영 상태 관리
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditCustomAiStatus('운영 중')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      editCustomAiStatus === '운영 중'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                        : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-neutral-200'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>운영 승인 (활성)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditCustomAiStatus('사용 중지')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      editCustomAiStatus === '사용 중지'
                        ? 'bg-[#E60012] text-white border-[#E60012] shadow-xs'
                        : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-neutral-200'
                    }`}
                  >
                    <PowerOff className="w-3.5 h-3.5" />
                    <span>사용 중지</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditCustomAiStatus('보관')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      editCustomAiStatus === '보관'
                        ? 'bg-neutral-700 text-white border-neutral-700 shadow-xs'
                        : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-neutral-200'
                    }`}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>보관 처리</span>
                  </button>
                </div>
              </div>

              {/* 2. 공개 범위 변경 */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-800 flex items-center justify-between">
                  <span>2. 사내 공유 범위</span>
                  <span className="text-[11px] text-neutral-400 font-normal">열람 권한 통제</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['전사 공개', '팀 공개', '비공개'] as const).map(scope => (
                    <button
                      key={scope}
                      type="button"
                      onClick={() => setEditCustomAiScope(scope)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        editCustomAiScope === scope
                          ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                          : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-neutral-200'
                      }`}
                    >
                      {scope === '전사 공개' && <Globe className="w-3.5 h-3.5" />}
                      {scope === '팀 공개' && <Layers className="w-3.5 h-3.5" />}
                      {scope === '비공개' && <Lock className="w-3.5 h-3.5" />}
                      <span>{scope}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Token 제한 설정 */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-800 flex items-center justify-between">
                  <span>3. 월간 Token 사용 한도</span>
                  <span className="text-[11px] font-mono font-bold text-neutral-600">
                    현재 소진: {(managingCustomAi.tokensUsed / 1000).toLocaleString()}K Token
                  </span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step={50000}
                    value={editCustomAiTokenLimit}
                    onChange={(e) => setEditCustomAiTokenLimit(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-mono font-bold focus:outline-hidden focus:ring-2 focus:ring-[#E60012] focus:bg-white transition-all"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-neutral-400 font-semibold">
                    Token
                  </span>
                </div>
                <div className="flex gap-1.5">
                  {[200000, 500000, 1000000, 2000000].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setEditCustomAiTokenLimit(amt)}
                      className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-[11px] font-bold cursor-pointer transition-colors"
                    >
                      {(amt / 1000).toLocaleString()}K
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. 연결 모델 변경 */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-800 block">
                  4. 구동 파운데이션 모델 변경
                </label>
                <select
                  value={editCustomAiModel}
                  onChange={(e) => setEditCustomAiModel(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-2 focus:ring-[#E60012] focus:bg-white transition-all"
                >
                  <option value="GPT-4o Enterprise">OpenAI GPT-4o Enterprise</option>
                  <option value="Claude 3.5 Sonnet">Anthropic Claude 3.5 Sonnet</option>
                  <option value="Google Gemini 1.5 Pro">Google Gemini 1.5 Pro</option>
                  <option value="HyperCLOVA X">Naver HyperCLOVA X</option>
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-neutral-50/70 border-t border-neutral-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setManagingCustomAi(null)}
                className="px-4 py-2 rounded-xl border border-neutral-200 hover:bg-neutral-100 text-neutral-700 text-xs font-bold cursor-pointer transition-colors"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleSaveManageCustomAi}
                className="px-5 py-2 rounded-xl bg-[#E60012] hover:bg-[#CC0010] text-white text-xs font-bold shadow-2xs cursor-pointer transition-colors flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>정책 저장 및 반영</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
