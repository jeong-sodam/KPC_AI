import React, { useState } from 'react';
import { 
  Cpu, 
  KeyRound, 
  Shuffle, 
  BarChart3, 
  Coins, 
  Inbox, 
  ShieldAlert, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle, 
  Eye, 
  EyeOff, 
  RefreshCw, 
  Sliders, 
  Check, 
  X,
  Search,
  Filter,
  DollarSign,
  ArrowUpRight,
  PowerOff,
  Play,
  Save,
  Key
} from 'lucide-react';
import { 
  MultiLlmModelInfo, 
  ProviderKeyInfo, 
  LlmRoutingRule, 
  UsageBreakdownItem, 
  PlatformTokenBudgetConfig, 
  TokenRequest, 
  CostCapRateLimitConfig,
  OrgTeamPolicy,
  EntraUserAccount
} from '../../../types';

interface ModelAndCostViewProps {
  subTab: 'multi_llm' | 'api_provider' | 'routing' | 'usage_cost' | 'budget' | 'requests' | 'cost_cap';
  onShowToast: (msg: string) => void;
  models: MultiLlmModelInfo[];
  setModels: React.Dispatch<React.SetStateAction<MultiLlmModelInfo[]>>;
  providerKeys: ProviderKeyInfo[];
  setProviderKeys: React.Dispatch<React.SetStateAction<ProviderKeyInfo[]>>;
  routingRules: LlmRoutingRule[];
  setRoutingRules: React.Dispatch<React.SetStateAction<LlmRoutingRule[]>>;
  usageBreakdowns: Record<'all' | 'users' | 'teams' | 'models' | 'agents' | 'custom_ai', UsageBreakdownItem[]>;
  budgetConfig: PlatformTokenBudgetConfig;
  setBudgetConfig: React.Dispatch<React.SetStateAction<PlatformTokenBudgetConfig>>;
  requests: TokenRequest[];
  setRequests: React.Dispatch<React.SetStateAction<TokenRequest[]>>;
  costCaps: CostCapRateLimitConfig[];
  setCostCaps: React.Dispatch<React.SetStateAction<CostCapRateLimitConfig[]>>;
  teams: OrgTeamPolicy[];
  users?: EntraUserAccount[];
  setUsers?: React.Dispatch<React.SetStateAction<EntraUserAccount[]>>;
}

export const ModelAndCostView: React.FC<ModelAndCostViewProps> = ({
  subTab,
  onShowToast,
  models,
  setModels,
  providerKeys,
  setProviderKeys,
  routingRules,
  setRoutingRules,
  usageBreakdowns,
  budgetConfig,
  setBudgetConfig,
  requests,
  setRequests,
  costCaps,
  setCostCaps,
  teams,
  users,
  setUsers
}) => {
  // Key unmasking simulation state
  const [unmaskedKeys, setUnmaskedKeys] = useState<Record<string, boolean>>({});
  const [activeUsageTab, setActiveUsageTab] = useState<'all' | 'users' | 'teams' | 'models' | 'agents' | 'custom_ai'>('all');

  // Provider test connection loading state
  const [testingProvId, setTestingProvId] = useState<string | null>(null);

  // Provider API Key Edit Modal state
  const [editingProvider, setEditingProvider] = useState<ProviderKeyInfo | null>(null);
  const [newKeyInput, setNewKeyInput] = useState('');
  const [isTestingNewKey, setIsTestingNewKey] = useState(false);
  const [newKeyTestResult, setNewKeyTestResult] = useState<string | null>(null);

  // Toggle Model Active Status
  const handleToggleModelActive = (modelId: string) => {
    const targetModel = models.find(m => m.id === modelId);
    setModels(prev => prev.map(m => {
      if (m.id === modelId) {
        return { ...m, isActive: !m.isActive };
      }
      return m;
    }));
    if (targetModel) {
      onShowToast(`${targetModel.name} 사용 상태가 [${!targetModel.isActive ? '활성화' : '비활성화'}] 되었습니다.`);
    }
  };

  // Toggle Key Mask
  const toggleKeyMask = (id: string) => {
    setUnmaskedKeys(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Provider healthcheck / test connection
  const handleTestConnection = (prov: ProviderKeyInfo) => {
    setTestingProvId(prov.id);
    setTimeout(() => {
      setTestingProvId(null);
      setProviderKeys(prev => prev.map(p => {
        if (p.id === prov.id) {
          return {
            ...p,
            lastApiCallTime: '방금 전 (연결 정상 확인)',
            status: p.status === '사용 중지' ? '정상 연결' : p.status
          };
        }
        return p;
      }));
      onShowToast(`[연결 테스트 성공] ${prov.providerName} API 엔드포인트 응답속도: 84ms (Status 200 OK)`);
    }, 600);
  };

  // Toggle Provider Status (정상 연결 <-> 사용 중지)
  const handleToggleProviderStatus = (prov: ProviderKeyInfo) => {
    const nextStatus = prov.status === '정상 연결' ? '사용 중지' : '정상 연결';
    setProviderKeys(prev => prev.map(p => {
      if (p.id === prov.id) {
        return {
          ...p,
          status: nextStatus
        };
      }
      return p;
    }));
    onShowToast(`[${nextStatus}] ${prov.providerName} Provider 서비스 상태가 업데이트되었습니다.`);
  };

  // Open Edit API Key Modal
  const handleOpenEditKey = (prov: ProviderKeyInfo) => {
    setEditingProvider(prov);
    setNewKeyInput('');
    setNewKeyTestResult(null);
  };

  // Test New Key inside Modal
  const handleTestNewKey = () => {
    if (!newKeyInput.trim()) {
      onShowToast('새로운 API Key를 먼저 입력해주세요.');
      return;
    }
    setIsTestingNewKey(true);
    setNewKeyTestResult(null);
    setTimeout(() => {
      setIsTestingNewKey(false);
      setNewKeyTestResult('검증 성공: 엔드포인트 응답 시간 88ms (Status 200 OK)');
      onShowToast(`${editingProvider?.providerName} 새 API Key 유효성 검증 완료!`);
    }, 600);
  };

  // Save New API Key
  const handleSaveNewApiKey = () => {
    if (!editingProvider) return;
    if (!newKeyInput.trim()) {
      onShowToast('새로운 API Key를 입력하세요.');
      return;
    }

    const trimmed = newKeyInput.trim();
    const prefix = trimmed.length > 7 ? trimmed.slice(0, 7) : 'sk-proj';
    const suffix = trimmed.length > 4 ? trimmed.slice(-4) : '8F2A';
    const masked = `${prefix}••••••••••${suffix}`;

    setProviderKeys(prev => prev.map(p => {
      if (p.id === editingProvider.id) {
        return {
          ...p,
          maskedApiKey: masked,
          status: '정상 연결',
          lastApiCallTime: '방금 전 (새 키 갱신 완료)'
        };
      }
      return p;
    }));

    onShowToast(`${editingProvider.providerName}의 API Key가 안전하게 갱신 및 암호화되었습니다.`);
    setEditingProvider(null);
  };

  // Token Request Action
  const handleApproveRequest = (req: TokenRequest, isPartial = false) => {
    const amount = isPartial ? Math.round(req.requestedAmount / 2) : req.requestedAmount;
    
    // 1. Update requests status
    setRequests(prev => prev.map(r => {
      if (r.id === req.id) {
        return {
          ...r,
          status: isPartial ? '일부 승인' : '승인 완료',
          approvedAmount: amount,
          processedAt: '2026.09.13 16:40',
          processedBy: '관리자 (정소담)'
        };
      }
      return r;
    }));

    // 2. Update user's token quota in Entra users state
    if (setUsers) {
      setUsers(prev => prev.map(u => {
        if (u.name === req.requesterName) {
          const nextStatus = u.status === '사용 제한' ? '활성' : u.status;
          return {
            ...u,
            monthlyQuota: u.monthlyQuota + amount,
            status: nextStatus
          };
        }
        return u;
      }));
    }

    onShowToast(`[${isPartial ? '일부 승인' : '승인 완료'}] ${req.requesterName} (${req.team}) 님의 추가 사용량 요청(+${amount.toLocaleString()} Token)이 승인되어 사용자 할당량에 즉시 반영되었습니다.`);
  };

  const handleRejectRequest = (req: TokenRequest) => {
    setRequests(prev => prev.map(r => {
      if (r.id === req.id) {
        return {
          ...r,
          status: '반려',
          approvedAmount: 0,
          processedAt: '2026.09.13 16:40',
          processedBy: '관리자 (정소담)'
        };
      }
      return r;
    }));
    onShowToast(`${req.requesterName} 님의 추가 사용량 요청이 반려되었습니다.`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ─────────────────────────────────────────────────────────────
          1. Multi-LLM 모델 관리
          ───────────────────────────────────────────────────────────── */}
      {subTab === 'multi_llm' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-neutral-900">Multi-LLM 파운데이션 모델 연동 관리</h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                OpenAI, Anthropic, Google Gemini, NAVER HyperCLOVA X 및 사내 온프레미스 LLM의 연동 상태와 지연시간을 모니터링합니다.
              </p>
            </div>
            <span className="text-xs text-neutral-500 font-medium">연동 모델 총 {models.length}종</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {models.map(m => (
              <div key={m.id} className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs space-y-4">
                <div className="flex items-start justify-between pb-3 border-b border-neutral-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-neutral-900">{m.name}</h3>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        m.type === 'Enterprise' ? 'bg-red-50 text-[#E60012] border border-red-200' : 'bg-blue-50 text-blue-700'
                      }`}>
                        {m.type}
                      </span>
                    </div>
                    <span className="text-[11px] text-neutral-400 font-mono mt-0.5 block">{m.provider} · {m.version}</span>
                  </div>

                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {m.connectionStatus}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 bg-neutral-50 rounded-xl">
                    <span className="text-[10px] text-neutral-400 block">응답 지연(RTT)</span>
                    <span className="font-bold font-mono text-neutral-900">{m.latencyMs}ms</span>
                  </div>
                  <div className="p-2 bg-neutral-50 rounded-xl">
                    <span className="text-[10px] text-neutral-400 block">월 누적 토큰</span>
                    <span className="font-bold font-mono text-neutral-900">{(m.monthlyTokensUsed / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="p-2 bg-neutral-50 rounded-xl">
                    <span className="text-[10px] text-neutral-400 block">예상 비용</span>
                    <span className="font-bold font-mono text-neutral-900">
                      {m.estimatedCostKrw === 0 ? '사내GPU' : `₩${(m.estimatedCostKrw / 1000).toFixed(0)}K`}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleToggleModelActive(m.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                      m.isActive
                        ? 'bg-neutral-900 text-white'
                        : 'bg-neutral-100 text-neutral-500'
                    }`}
                  >
                    {m.isActive ? '서비스 활성' : '서비스 비활성'}
                  </button>

                  <button
                    type="button"
                    onClick={() => onShowToast(`${m.name} 세부 파라미터(Temperature 등) 설정창을 열었습니다.`)}
                    className="text-xs text-[#E60012] font-bold hover:underline"
                  >
                    파라미터 설정 →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. API Provider / Key 관리 (마스킹)
          ───────────────────────────────────────────────────────────── */}
      {subTab === 'api_provider' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-neutral-900">AI Provider 및 API Key 보안 관리</h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                외부 LLM 공급사 연결 Key는 플랫폼 보안 정책에 따라 앞뒤를 제외하고 마스킹(••••) 암호화 보관됩니다.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onShowToast('신규 AI Provider 등록 양식이 열렸습니다.')}
              className="px-3 py-1.5 bg-[#E60012] hover:bg-[#CC0010] text-white rounded-xl text-xs font-bold shadow-2xs transition-colors cursor-pointer"
            >
              + 공급사 추가
            </button>
          </div>

          <div className="space-y-4">
            {providerKeys.map(prov => {
              const isUnmasked = unmaskedKeys[prov.id];
              const isTesting = testingProvId === prov.id;
              const isSuspended = prov.status === '사용 중지';

              return (
                <div key={prov.id} className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs space-y-4">
                  {/* Provider Header & Connection Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center font-bold text-neutral-800 text-sm">
                        {prov.providerName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-base text-neutral-900">{prov.providerName}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            isSuspended 
                              ? 'bg-red-50 text-[#E60012] border-red-200' 
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}>
                            {prov.status}
                          </span>
                        </div>
                        <span className="text-[11px] text-neutral-400">
                          최근 호출: {prov.lastApiCallTime}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons: 연결 테스트 / API Key 변경 / 사용 중지 */}
                    <div className="flex flex-wrap items-center gap-2">
                      {/* 1. 연결 테스트 */}
                      <button
                        type="button"
                        onClick={() => handleTestConnection(prov)}
                        disabled={isTesting}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-800 text-xs font-bold cursor-pointer transition-colors shadow-2xs disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 text-neutral-600 ${isTesting ? 'animate-spin' : ''}`} />
                        <span>{isTesting ? '엔드포인트 점검 중...' : '연결 테스트'}</span>
                      </button>

                      {/* 2. API Key 변경 */}
                      <button
                        type="button"
                        onClick={() => handleOpenEditKey(prov)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                      >
                        <Key className="w-3.5 h-3.5" />
                        <span>API Key 변경</span>
                      </button>

                      {/* 3. 사용 중지 / 사용 재개 */}
                      <button
                        type="button"
                        onClick={() => handleToggleProviderStatus(prov)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-colors border ${
                          isSuspended
                            ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
                            : 'bg-red-50 hover:bg-red-100 text-[#E60012] border-red-200'
                        }`}
                      >
                        {isSuspended ? (
                          <>
                            <Play className="w-3.5 h-3.5" />
                            <span>사용 재개</span>
                          </>
                        ) : (
                          <>
                            <PowerOff className="w-3.5 h-3.5" />
                            <span>사용 중지</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Provider Model & Cost Metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs">
                    <div>
                      <span className="text-neutral-400 block text-[11px]">사용 모델</span>
                      <span className="font-bold text-neutral-800 break-words mt-0.5 block">
                        {prov.usedModels.join(', ')}
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block text-[11px]">이번 달 Token</span>
                      <span className="font-mono font-bold text-neutral-900 text-sm mt-0.5 block">
                        {(prov.monthlyTokenCount / 1000000).toFixed(2)}M Token
                      </span>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        ({prov.monthlyTokenCount.toLocaleString()} tokens)
                      </span>
                    </div>
                    <div>
                      <span className="text-neutral-400 block text-[11px]">예상 비용</span>
                      <span className="font-bold text-[#E60012] text-sm mt-0.5 block">
                        ₩{prov.monthlyCostKrw.toLocaleString()}원
                      </span>
                      <span className="text-[10px] text-neutral-400">
                        환율 1,380원 기준 정산
                      </span>
                    </div>
                  </div>

                  {/* API Key Masked Box */}
                  <div className="p-3 bg-white rounded-xl border border-neutral-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <KeyRound className="w-4 h-4 text-neutral-500 shrink-0" />
                      <div>
                        <span className="text-[10px] text-neutral-400 block">암호화 저장된 API Key</span>
                        <span className="text-xs font-mono font-bold text-neutral-800">
                          {isUnmasked ? `${prov.maskedApiKey.slice(0, 7)}SECRET99824X` : prov.maskedApiKey}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleKeyMask(prov.id)}
                        className="text-xs text-neutral-500 hover:text-neutral-800 font-semibold cursor-pointer underline"
                      >
                        {isUnmasked ? '마스킹 적용' : '키 마스킹 해제 (감사 기록)'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          3. LLM 라우팅 정책 관리
          ───────────────────────────────────────────────────────────── */}
      {subTab === 'routing' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-neutral-900">지능형 LLM 라우팅 정책 규칙</h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                데이터 보안 등급(민감/내부/공개) 및 업무 목적(제안서/요약/일반)에 따라 최적의 모델로 자동 디스패치합니다.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onShowToast('새 라우팅 룰 생성 모달을 열었습니다.')}
              className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold shadow-2xs transition-colors cursor-pointer"
            >
              + 라우팅 규칙 추가
            </button>
          </div>

          <div className="space-y-3">
            {routingRules.map(rule => (
              <div key={rule.id} className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-neutral-100 text-neutral-700 font-bold text-[11px] flex items-center justify-center">
                      {rule.priority}
                    </span>
                    <h3 className="font-bold text-sm text-neutral-900">{rule.ruleName}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                      {rule.conditionType}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600">{rule.description}</p>
                  <div className="flex items-center gap-2 text-[11px] pt-1">
                    <span className="font-bold text-neutral-500">조건:</span>
                    <span className="font-mono text-neutral-800 bg-neutral-100 px-1.5 py-0.5 rounded">{rule.conditionDetail}</span>
                    <span>→</span>
                    <span className="font-bold text-[#E60012]">타깃 모델:</span>
                    <span className="font-semibold text-neutral-900">{rule.targetModel}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setRoutingRules(prev => prev.map(r => r.id === rule.id ? { ...r, isActive: !r.isActive } : r));
                      onShowToast(`[${rule.ruleName}] 규칙이 [${!rule.isActive ? '활성' : '비활성'}] 되었습니다.`);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                      rule.isActive
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-neutral-100 text-neutral-500'
                    }`}
                  >
                    {rule.isActive ? '규칙 적용 중' : '미적용'}
                  </button>
                  <button
                    type="button"
                    onClick={() => onShowToast(`[${rule.ruleName}] 규칙 수정 팝업을 열었습니다.`)}
                    className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg text-xs font-bold cursor-pointer"
                  >
                    수정
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          4. AI 사용량 및 비용 상세 분석
          ───────────────────────────────────────────────────────────── */}
      {subTab === 'usage_cost' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-neutral-900">AI 사용량 및 비용 다차원 분석</h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                사용자별, 부서별, 파운데이션 모델별, Agent별, Custom AI별 상세 토큰/비용 및 급증(Anomaly) 징후를 감지합니다.
              </p>
            </div>
            <span className="text-xs font-bold text-[#E60012] bg-red-50 px-2.5 py-1 rounded-lg border border-red-200">
              🚨 사용량 급증 서비스 3건 감지됨
            </span>
          </div>

          {/* Breakdown Tabs */}
          <div className="flex border-b border-neutral-200 gap-2 overflow-x-auto scrollbar-none">
            {[
              { id: 'all', label: '전체 종합' },
              { id: 'users', label: '사용자별' },
              { id: 'teams', label: '부서별' },
              { id: 'models', label: '모델별' },
              { id: 'agents', label: 'AI Agent별' },
              { id: 'custom_ai', label: 'Custom AI별' }
            ].map(tab => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveUsageTab(tab.id as any)}
                className={`py-2 px-3 text-xs font-semibold border-b-2 whitespace-nowrap cursor-pointer transition-colors ${
                  activeUsageTab === tab.id
                    ? 'border-[#E60012] text-[#E60012] font-bold'
                    : 'border-transparent text-neutral-500 hover:text-neutral-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-bold">
                  <th className="py-3 px-4">대상 명칭 / 구분</th>
                  <th className="py-3 px-3">호출 수</th>
                  <th className="py-3 px-3">입력 Token</th>
                  <th className="py-3 px-3">출력 Token</th>
                  <th className="py-3 px-3">총 Token</th>
                  <th className="py-3 px-3">예상 발생 비용</th>
                  <th className="py-3 px-3">전월 대비 증감</th>
                  <th className="py-3 px-4 text-right">이상 징후</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {usageBreakdowns[activeUsageTab].map(item => (
                  <tr key={item.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-bold text-neutral-900 block">{item.name}</span>
                      <span className="text-[10px] text-neutral-400">{item.category}</span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-neutral-700">
                      {item.callsCount.toLocaleString()}회
                    </td>
                    <td className="py-3 px-3 font-mono text-neutral-600">
                      {(item.inputTokens / 1000).toLocaleString()}K
                    </td>
                    <td className="py-3 px-3 font-mono text-neutral-600">
                      {(item.outputTokens / 1000).toLocaleString()}K
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-neutral-900">
                      {(item.totalTokens / 1000000).toFixed(2)}M
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-neutral-900">
                      ₩{item.estimatedCostKrw.toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`font-bold font-mono text-[11px] ${
                        item.momChangeRate > 50 ? 'text-[#E60012]' : 'text-emerald-700'
                      }`}>
                        +{item.momChangeRate}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {item.isSurging ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-[#E60012] border border-red-200">
                          급증 징후
                        </span>
                      ) : (
                        <span className="text-[11px] text-neutral-400">정상 추세</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          5. 계층적 Token Budget 관리
          ───────────────────────────────────────────────────────────── */}
      {subTab === 'budget' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-neutral-900">3단계 계층적 Token Budget 한도 관리</h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                플랫폼 전체 예산 → 부서 단위 예산 → 개인별 할당량 계층 구조 및 80%(주의), 90%(경고), 100%(차단) 임계치 제어
              </p>
            </div>
            <button
              type="button"
              onClick={() => onShowToast('Budget 정책이 안전하게 저장되었습니다.')}
              className="px-3 py-1.5 bg-[#E60012] hover:bg-[#CC0010] text-white rounded-xl text-xs font-bold shadow-2xs transition-colors cursor-pointer"
            >
              정책 변경 저장
            </button>
          </div>

          {/* 1 Level: Platform Total */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">LEVEL 1</span>
                <h3 className="text-base font-bold text-neutral-900">KPC 플랫폼 전체 월간 Token Budget</h3>
              </div>
              <span className="text-xs font-bold text-neutral-800">
                사용률 {Math.round((budgetConfig.platformCurrentTokens / budgetConfig.platformMonthlyTokenQuota) * 100)}%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3 bg-neutral-50 rounded-xl">
                <span className="text-[11px] text-neutral-400 block">월간 총 토큰 한도</span>
                <span className="text-lg font-bold font-mono text-neutral-900">
                  {(budgetConfig.platformMonthlyTokenQuota / 1000000).toFixed(0)}M Token
                </span>
              </div>
              <div className="p-3 bg-neutral-50 rounded-xl">
                <span className="text-[11px] text-neutral-400 block">현재 소진 토큰</span>
                <span className="text-lg font-bold font-mono text-[#E60012]">
                  {(budgetConfig.platformCurrentTokens / 1000000).toFixed(2)}M Token
                </span>
              </div>
              <div className="p-3 bg-neutral-50 rounded-xl">
                <span className="text-[11px] text-neutral-400 block">월간 비용 상한선</span>
                <span className="text-lg font-bold font-mono text-neutral-900">
                  ₩{(budgetConfig.platformMonthlyCostBudgetKrw / 10000).toFixed(0)}만원
                </span>
              </div>
            </div>

            {/* Threshold sliders simulation */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl border border-neutral-200 bg-white">
                <span className="font-bold text-neutral-800 block">주의 경고 임계치</span>
                <span className="text-sm font-bold text-amber-600">80% 도달 시</span>
                <p className="text-[10px] text-neutral-400 mt-1">부서장 및 담당자에게 자동 알림 발송</p>
              </div>
              <div className="p-3 rounded-xl border border-red-200 bg-red-50/30">
                <span className="font-bold text-neutral-800 block">위험 경고 임계치</span>
                <span className="text-sm font-bold text-[#E60012]">90% 도달 시</span>
                <p className="text-[10px] text-neutral-400 mt-1">관리자 콘솔 긴급 알림 및 잔여량 경고</p>
              </div>
              <div className="p-3 rounded-xl border border-neutral-300 bg-neutral-50">
                <span className="font-bold text-neutral-800 block">한도 초과 차단 (Cutoff)</span>
                <span className="text-sm font-bold text-neutral-900">100% 도달 시</span>
                <p className="text-[10px] text-neutral-400 mt-1">자동 스로틀링(Throttling) 및 사용 제한</p>
              </div>
            </div>
          </div>

          {/* 2 Level: Department View */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-2xs space-y-3">
            <div className="pb-2 border-b border-neutral-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">LEVEL 2</span>
                <h3 className="text-sm font-bold text-neutral-900">부서(조직)별 Token Budget 현황</h3>
              </div>
              <span className="text-xs text-neutral-400">총 {teams.length}개 조직 할당</span>
            </div>

            <div className="divide-y divide-neutral-100 text-xs">
              {teams.map(t => (
                <div key={t.id} className="py-2.5 flex items-center justify-between">
                  <span className="font-bold text-neutral-800 w-36">{t.teamName}</span>
                  <div className="flex-1 max-w-xs mx-4">
                    <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          t.usedTokens / t.monthlyTokenQuota >= 0.9 ? 'bg-[#E60012]' : 'bg-neutral-800'
                        }`}
                        style={{ width: `${Math.round((t.usedTokens / t.monthlyTokenQuota) * 100)}%` }}
                      />
                    </div>
                  </div>
                  <span className="font-mono text-neutral-600">
                    {(t.usedTokens / 1000000).toFixed(1)}M / {(t.monthlyTokenQuota / 1000000).toFixed(1)}M Token
                  </span>
                  <span className="font-bold text-neutral-800 ml-4">
                    {Math.round((t.usedTokens / t.monthlyTokenQuota) * 100)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          6. 추가 사용량 요청 관리 (Workflow)
          ───────────────────────────────────────────────────────────── */}
      {subTab === 'requests' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-neutral-900">추가 사용량(토큰) 요청 및 승인 워크플로우</h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                월간 할당량을 모두 소진한 임직원의 추가 쿼터 신청을 심사하고 [승인 / 일부 승인 / 반려] 처리합니다.
              </p>
            </div>
            <span className="text-xs font-bold text-[#E60012] bg-red-50 px-2.5 py-1 rounded-lg border border-red-200">
              대기 중 요청 {requests.filter(r => r.status === '대기').length}건
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-bold">
                  <th className="py-3 px-4">신청자 / 부서</th>
                  <th className="py-3 px-3">현재 소진량</th>
                  <th className="py-3 px-3">신청 추가량</th>
                  <th className="py-3 px-4">신청 사유</th>
                  <th className="py-3 px-3">신청 시각</th>
                  <th className="py-3 px-3">처리 상태</th>
                  <th className="py-3 px-4 text-right">결재 조치</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {requests.map(req => (
                  <tr key={req.id} className="hover:bg-neutral-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-bold text-neutral-900 block">{req.requesterName}</span>
                      <span className="text-[11px] text-neutral-400">{req.team} · {req.role}</span>
                    </td>
                    <td className="py-3 px-3 font-mono">
                      {req.currentUsage.toLocaleString()} / {req.existingQuota.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-[#E60012]">
                      +{req.requestedAmount.toLocaleString()} Token
                    </td>
                    <td className="py-3 px-4 text-neutral-700 max-w-xs truncate" title={req.reason}>
                      {req.reason}
                    </td>
                    <td className="py-3 px-3 text-neutral-400 font-mono text-[11px]">
                      {req.requestedAt}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        req.status === '대기'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : req.status.includes('승인')
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-neutral-100 text-neutral-500 border border-neutral-200'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {req.status === '대기' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleApproveRequest(req, false)}
                            className="px-2.5 py-1 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-[11px] font-bold cursor-pointer"
                          >
                            전액 승인
                          </button>
                          <button
                            type="button"
                            onClick={() => handleApproveRequest(req, true)}
                            className="px-2 py-1 bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-200 rounded-lg text-[11px] font-bold cursor-pointer"
                          >
                            일부 승인 (50%)
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRejectRequest(req)}
                            className="px-2 py-1 bg-red-50 hover:bg-red-100 text-[#E60012] border border-red-200 rounded-lg text-[11px] font-bold cursor-pointer"
                          >
                            반려
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-neutral-400">
                          {req.processedBy || '처리 완료'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          7. Cost Cap / Rate Limit 관리
          ───────────────────────────────────────────────────────────── */}
      {subTab === 'cost_cap' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-neutral-900">Cost Cap 및 Rate Limit 안전 제어</h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                파운데이션 모델별 월 지출 상한선(Cost Cap)과 분당 호출 제한(RPM), 일일 최대 호출수를 제한하여 과도한 청구를 방어합니다.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {costCaps.map(cap => {
              const costPercent = Math.round((cap.currentEstimatedCostKrw / cap.monthlyCostCapKrw) * 100);
              return (
                <div key={cap.id} className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                    <div>
                      <h3 className="font-bold text-sm text-neutral-900">{cap.modelName}</h3>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        분당 최대 {cap.rpmLimit} RPM 제한
                      </span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      costPercent >= 80
                        ? 'bg-red-50 text-[#E60012] border border-red-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      지출률 {costPercent}% ({cap.warningStatus})
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500">월간 지출 상한(Cost Cap):</span>
                      <span className="font-mono font-bold text-neutral-900">
                        ₩{(cap.monthlyCostCapKrw / 10000).toFixed(0)}만원
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500">현재 발생 누적 비용:</span>
                      <span className="font-mono font-bold text-[#E60012]">
                        ₩{cap.currentEstimatedCostKrw.toLocaleString()}원
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500">사용자당 분당 호출(RPM):</span>
                      <span className="font-bold text-neutral-800">{cap.perUserRateLimitRpm} RPM</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500">팀별 월간 토큰 제한:</span>
                      <span className="font-mono text-neutral-800">{(cap.perTeamMonthlyTokenLimit / 1000000).toFixed(0)}M Token</span>
                    </div>

                    <div className="pt-2">
                      <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            costPercent >= 80 ? 'bg-[#E60012]' : 'bg-neutral-800'
                          }`}
                          style={{ width: `${Math.min(100, costPercent)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => onShowToast(`${cap.modelName} 한도 설정 변경 팝업을 열었습니다.`)}
                      className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg text-xs font-bold cursor-pointer"
                    >
                      상한선 변경
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          API Key 변경 Modal (Requirement 8)
          ───────────────────────────────────────────────────────────── */}
      {editingProvider && (
        <div 
          id="api-key-edit-modal"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-neutral-900 text-white flex items-center justify-center shadow-xs">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-neutral-900">
                    {editingProvider.providerName} API Key 변경
                  </h3>
                  <span className="text-[11px] text-neutral-500">
                    엔터프라이즈 보안 감사 로깅 대상
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingProvider(null)}
                className="w-8 h-8 rounded-lg hover:bg-neutral-200 text-neutral-500 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {/* Existing Masked Key Info */}
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1">
                <span className="text-[11px] text-neutral-400 font-semibold block">현재 등록된 키 (마스킹)</span>
                <span className="font-mono text-xs font-bold text-neutral-700 block">
                  {editingProvider.maskedApiKey}
                </span>
                <span className="text-[10px] text-neutral-400 block pt-0.5">
                  최근 연동 모델: {editingProvider.usedModels.join(', ')}
                </span>
              </div>

              {/* New Key Input Field */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-800 flex items-center justify-between">
                  <span>신규 API Key 입력</span>
                  <span className="text-[11px] text-[#E60012] font-normal">* 암호화 저장</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={newKeyInput}
                    onChange={(e) => setNewKeyInput(e.target.value)}
                    placeholder="예: sk-proj-••••••••••••••••••••••••••••••••"
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-[#E60012] focus:bg-white transition-all"
                  />
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  저장 시 플랫폼 보안 볼트(Vault)에 즉시 암호화되며, UI에는 앞/뒤 식별자만 마스킹 처리되어 노출됩니다.
                </p>
              </div>

              {/* Key Validation Test Result */}
              {newKeyTestResult && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{newKeyTestResult}</span>
                </div>
              )}

              {/* Test Key Button inside Modal */}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleTestNewKey}
                  disabled={isTestingNewKey || !newKeyInput.trim()}
                  className="px-3 py-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-40 transition-colors shadow-2xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-neutral-500 ${isTestingNewKey ? 'animate-spin' : ''}`} />
                  <span>{isTestingNewKey ? '키 유효성 검증 중...' : '새 키 연결 테스트'}</span>
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-neutral-50/70 border-t border-neutral-200 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingProvider(null)}
                className="px-4 py-2 rounded-xl border border-neutral-200 hover:bg-neutral-100 text-neutral-700 text-xs font-bold cursor-pointer transition-colors"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleSaveNewApiKey}
                disabled={!newKeyInput.trim()}
                className="px-5 py-2 rounded-xl bg-[#E60012] hover:bg-[#CC0010] text-white text-xs font-bold shadow-2xs cursor-pointer disabled:opacity-40 transition-colors flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>저장 및 키 갱신</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
