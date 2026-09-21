import React, { useState } from 'react';
import { 
  Users, 
  Shield, 
  Search, 
  Filter, 
  UserCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Sliders, 
  Lock, 
  Check, 
  X,
  Sparkles,
  Layers,
  ChevronRight,
  Coins,
  PlusCircle,
  ShieldAlert,
  PowerOff
} from 'lucide-react';
import { EntraUserAccount, OrgTeamPolicy, SecurityAccessPolicyConfig } from '../../../types';

interface UserAndOrgViewProps {
  subTab: 'users' | 'teams' | 'permissions';
  onShowToast: (msg: string) => void;
  users: EntraUserAccount[];
  setUsers: React.Dispatch<React.SetStateAction<EntraUserAccount[]>>;
  teams: OrgTeamPolicy[];
  setTeams: React.Dispatch<React.SetStateAction<OrgTeamPolicy[]>>;
  securityPolicy: SecurityAccessPolicyConfig;
}

export const UserAndOrgView: React.FC<UserAndOrgViewProps> = ({
  subTab,
  onShowToast,
  users,
  setUsers,
  teams,
  setTeams,
  securityPolicy
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<EntraUserAccount | null>(null);

  // User Management Drawer State
  const [managingUser, setManagingUser] = useState<EntraUserAccount | null>(null);
  const [editRole, setEditRole] = useState<EntraUserAccount['role']>('일반 사용자');
  const [editQuota, setEditQuota] = useState<number>(100000);
  const [editAllowedModels, setEditAllowedModels] = useState<string[]>([]);
  const [editAllowedAi, setEditAllowedAi] = useState<string[]>([]);
  const [editStatus, setEditStatus] = useState<EntraUserAccount['status']>('활성');

  const ALL_AVAILABLE_MODELS = [
    'GPT Enterprise',
    'Claude Enterprise',
    'Gemini 2.5 Pro',
    'Gemini 2.5 Flash',
    'HyperCLOVA X',
    'KPC On-Premise'
  ];

  const ALL_AVAILABLE_AGENTS = [
    'Knowledge AI',
    'AI Worker',
    '제안서 생성',
    'Custom AI',
    'AI Agent',
    'Community'
  ];

  const handleOpenManage = (u: EntraUserAccount) => {
    setManagingUser(u);
    setEditRole(u.role);
    setEditQuota(u.monthlyQuota);
    setEditAllowedModels([...u.allowedLlms]);
    setEditAllowedAi([...u.allowedAi]);
    setEditStatus(u.status);
  };

  const handleToggleModel = (m: string) => {
    setEditAllowedModels(prev =>
      prev.includes(m) ? (prev.length > 1 ? prev.filter(x => x !== m) : prev) : [...prev, m]
    );
  };

  const handleToggleAi = (ai: string) => {
    setEditAllowedAi(prev =>
      prev.includes(ai) ? (prev.length > 1 ? prev.filter(x => x !== ai) : prev) : [...prev, ai]
    );
  };

  // 1. 저장 버튼
  const handleSaveManage = () => {
    if (!managingUser) return;
    setUsers(prev => prev.map(u => {
      if (u.id === managingUser.id) {
        return {
          ...u,
          role: editRole,
          monthlyQuota: editQuota,
          allowedLlms: editAllowedModels,
          allowedAi: editAllowedAi,
          status: editStatus
        };
      }
      return u;
    }));
    onShowToast(`${managingUser.name} 님의 AI 사용 정책 및 계정 설정이 안전하게 저장되었습니다.`);
    setManagingUser(null);
  };

  // 2. 사용량 추가 버튼 (+50,000 Token)
  const handleAddQuota = () => {
    if (!managingUser) return;
    const additional = 50000;
    const newQuota = editQuota + additional;
    setEditQuota(newQuota);
    setUsers(prev => prev.map(u => {
      if (u.id === managingUser.id) {
        const nextStatus = u.status === '사용 제한' ? '활성' : u.status;
        return {
          ...u,
          monthlyQuota: newQuota,
          status: nextStatus
        };
      }
      return u;
    }));
    onShowToast(`[사용량 추가] ${managingUser.name} 님에게 +50,000 Token이 즉시 지급되었습니다. (총 할당량: ${(newQuota / 1000).toFixed(0)}K)`);
  };

  // 3. AI 사용 제한 버튼
  const handleRestrictAi = () => {
    if (!managingUser) return;
    setEditStatus('사용 제한');
    setUsers(prev => prev.map(u => {
      if (u.id === managingUser.id) {
        return { ...u, status: '사용 제한' };
      }
      return u;
    }));
    onShowToast(`[사용 제한] ${managingUser.name} 님의 AI 모델 호출 및 서비스 사용이 즉시 제한되었습니다.`);
  };

  // 4. 계정 비활성화 / 활성화 버튼
  const handleToggleActive = () => {
    if (!managingUser) return;
    const nextStatus: EntraUserAccount['status'] = editStatus === '활성' ? '비활성' : '활성';
    setEditStatus(nextStatus);
    setUsers(prev => prev.map(u => {
      if (u.id === managingUser.id) {
        return { ...u, status: nextStatus };
      }
      return u;
    }));
    onShowToast(`${managingUser.name} 님의 계정이 [${nextStatus}] 상태로 전환되었습니다.`);
  };

  // Toggle user status from table quick action
  const handleToggleUserStatus = (userId: string) => {
    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) return;
    const nextStatus = targetUser.status === '활성' ? '비활성' : '활성';
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, status: nextStatus };
      }
      return u;
    }));
    onShowToast(`${targetUser.name} 님의 계정 상태가 [${nextStatus}]로 변경되었습니다.`);
  };

  // Change user role
  const handleChangeRole = (userId: string, newRole: EntraUserAccount['role']) => {
    const targetUser = users.find(u => u.id === userId);
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return { ...u, role: newRole };
      }
      return u;
    }));
    if (targetUser) {
      onShowToast(`${targetUser.name} 님의 권한 역할이 [${newRole}]로 변경되었습니다.`);
    }
    if (selectedUser?.id === userId) {
      setSelectedUser(prev => prev ? { ...prev, role: newRole } : null);
    }
    if (managingUser?.id === userId) {
      setEditRole(newRole);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.includes(searchTerm) || u.department.includes(searchTerm) || u.email.includes(searchTerm);
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ─────────────────────────────────────────────────────────────
          1. 사용자 관리 (Microsoft Entra ID 기반)
          ───────────────────────────────────────────────────────────── */}
      {subTab === 'users' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-neutral-900">사용자 계정 관리</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  Microsoft Entra ID 동기화
                </span>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                사내 임직원 계정 정보, 소속 부서, 역할, 권한 및 모델/AI 서비스 접근 범위를 제어합니다.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-500 font-medium">총 {users.length}명 등록됨</span>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-neutral-200 shadow-2xs">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="이름, 부서, 이메일 검색..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#E60012]"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-500 font-medium">역할 구분:</span>
              <select
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value)}
                className="text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-2.5 py-1.5 focus:outline-none"
              >
                <option value="all">전체 역할</option>
                <option value="플랫폼 관리자">플랫폼 관리자</option>
                <option value="부서 관리자">부서 관리자</option>
                <option value="AI 제작자">AI 제작자</option>
                <option value="일반 사용자">일반 사용자</option>
                <option value="외부 사용자">외부 사용자</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-bold">
                    <th className="py-3 px-4">임직원 / 이메일</th>
                    <th className="py-3 px-3">소속 부서</th>
                    <th className="py-3 px-3">권한 역할</th>
                    <th className="py-3 px-3">토큰 사용 / 할당량</th>
                    <th className="py-3 px-3">허용 모델</th>
                    <th className="py-3 px-3">최근 로그인</th>
                    <th className="py-3 px-3">계정 상태</th>
                    <th className="py-3 px-4 text-right">관리 조치</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-neutral-800 text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                            {u.name.slice(0, 1)}
                          </div>
                          <div>
                            <span className="font-bold text-neutral-900 block">{u.name}</span>
                            <span className="text-[11px] text-neutral-400 font-mono">{u.email}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3 font-semibold text-neutral-700">
                        {u.department}
                      </td>

                      <td className="py-3 px-3">
                        <select
                          value={u.role}
                          onChange={e => handleChangeRole(u.id, e.target.value as any)}
                          className={`text-[11px] font-bold px-2 py-1 rounded-lg border focus:outline-none ${
                            u.role === '플랫폼 관리자'
                              ? 'bg-red-50 text-[#E60012] border-red-200'
                              : u.role === '부서 관리자'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : u.role === 'AI 제작자'
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : 'bg-neutral-100 text-neutral-800 border-neutral-200'
                          }`}
                        >
                          <option value="플랫폼 관리자">플랫폼 관리자</option>
                          <option value="부서 관리자">부서 관리자</option>
                          <option value="AI 제작자">AI 제작자</option>
                          <option value="일반 사용자">일반 사용자</option>
                          <option value="외부 사용자">외부 사용자</option>
                        </select>
                      </td>

                      <td className="py-3 px-3">
                        <div>
                          <div className="flex items-center justify-between text-[11px] mb-1">
                            <span className="font-mono font-bold text-neutral-900">
                              {(u.usedTokens / 1000).toFixed(0)}K
                            </span>
                            <span className="text-neutral-400 font-mono">
                              / {(u.monthlyQuota / 1000).toFixed(0)}K
                            </span>
                          </div>
                          <div className="w-28 bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                u.usedTokens / u.monthlyQuota >= 0.95
                                  ? 'bg-[#E60012]'
                                  : u.usedTokens / u.monthlyQuota >= 0.8
                                  ? 'bg-amber-500'
                                  : 'bg-neutral-800'
                              }`}
                              style={{ width: `${Math.min(100, Math.round((u.usedTokens / u.monthlyQuota) * 100))}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="text-[11px] text-neutral-600 truncate block max-w-[140px]" title={u.allowedLlms.join(', ')}>
                          {u.allowedLlms.slice(0, 2).join(', ')}
                          {u.allowedLlms.length > 2 && ` 외 ${u.allowedLlms.length - 2}종`}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-[11px] text-neutral-400 font-mono">
                        {u.lastLogin}
                      </td>

                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          u.status === '활성'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-neutral-100 text-neutral-500 border border-neutral-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${u.status === '활성' ? 'bg-emerald-500' : 'bg-neutral-400'}`} />
                          {u.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenManage(u)}
                          className="px-3 py-1.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold transition-all shadow-2xs cursor-pointer flex items-center gap-1.5 ml-auto"
                        >
                          <Sliders className="w-3.5 h-3.5" />
                          <span>관리</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. 조직 / 부서 관리
          ───────────────────────────────────────────────────────────── */}
      {subTab === 'teams' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-neutral-900">조직 및 부서별 정책 관리</h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                부서 단위 Token Budget, 비용 예산, 기본 부여 권한 및 허용 파운데이션 모델을 관리합니다.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onShowToast('Entra ID 부서 조직도 동기화가 완료되었습니다.')}
              className="px-3 py-1.5 bg-white border border-neutral-200 hover:bg-neutral-50 rounded-xl text-xs font-bold text-neutral-700 shadow-2xs transition-colors cursor-pointer"
            >
              조직도 동기화 (Entra ID)
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.map(team => {
              const usagePercent = Math.round((team.usedTokens / team.monthlyTokenQuota) * 100);
              return (
                <div key={team.id} className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                    <div>
                      <h3 className="font-bold text-sm text-neutral-900">{team.teamName}</h3>
                      <span className="text-[10px] font-mono text-neutral-400">{team.entraGroupName}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      team.status === '위험'
                        ? 'bg-red-50 text-[#E60012] border border-red-200'
                        : team.status === '주의'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {team.status} ({usagePercent}%)
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500">소속 임직원:</span>
                      <span className="font-bold text-neutral-900">{team.memberCount}명</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500">월간 Token 할당:</span>
                      <span className="font-mono font-bold text-neutral-900">
                        {(team.monthlyTokenQuota / 1000000).toFixed(1)}M Token
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500">월간 비용 예산:</span>
                      <span className="font-mono font-bold text-neutral-900">
                        ₩{(team.costBudgetKrw / 1000).toLocaleString()}K
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500">기본 부여 역할:</span>
                      <span className="font-bold text-neutral-700">{team.defaultRole}</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="pt-2">
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-neutral-400">사용 현황</span>
                        <span className="font-mono font-bold text-neutral-800">
                          {(team.usedTokens / 1000000).toFixed(2)}M / {(team.monthlyTokenQuota / 1000000).toFixed(1)}M
                        </span>
                      </div>
                      <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            usagePercent >= 90 ? 'bg-[#E60012]' : usagePercent >= 80 ? 'bg-amber-500' : 'bg-neutral-800'
                          }`}
                          style={{ width: `${Math.min(100, usagePercent)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-neutral-400">
                      허용 모델: {team.allowedModels.length}개
                    </span>
                    <button
                      type="button"
                      onClick={() => onShowToast(`${team.teamName} 정책 설정 팝업을 열었습니다.`)}
                      className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg font-bold text-[11px] cursor-pointer"
                    >
                      한도/모델 설정
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          3. 권한 / 역할 관리 (Role & Permission)
          ───────────────────────────────────────────────────────────── */}
      {subTab === 'permissions' && (
        <div className="space-y-5">
          <div>
            <h2 className="text-xl font-bold text-neutral-900">권한 및 역할(RBAC) 체계 관리</h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              플랫폼 내 5대 역할과 각 역할별 AI 기능 및 데이터 접근 통제 매트릭스를 정의합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              {
                role: '일반 사용자',
                desc: '사내 AI 서비스 기본 조회 및 프롬프트 질의 사용',
                color: 'border-neutral-200',
                tokens: '월 100K 기본',
                features: ['Knowledge AI 조회', 'AI Worker 기본 도구', 'Community 열람']
              },
              {
                role: 'AI 제작자',
                desc: 'Custom AI 및 AI Agent 생성/수정/테스트 권한 보유',
                color: 'border-purple-200 bg-purple-50/20',
                tokens: '월 200K 확장',
                features: ['Custom AI 빌더', 'AI Agent 스킬 연결', 'Community 배포 신청']
              },
              {
                role: '부서 관리자',
                desc: '소속 부서의 Token 예산 모니터링 및 팀원 사용량 통제',
                color: 'border-blue-200 bg-blue-50/20',
                tokens: '월 150K',
                features: ['부서 사용 통계 열람', '1차 토큰 요청 승인', '부서 공유 범위 제어']
              },
              {
                role: '플랫폼 관리자',
                desc: '전사 관리자 콘솔 전체 제어, 비용 한도, LLM 연동 관리',
                color: 'border-red-200 bg-red-50/20',
                tokens: '월 500K 무제한급',
                features: ['전사 정책/보안 통제', 'API Key 마스킹 관리', 'Audit Log 감사']
              },
              {
                role: '외부 사용자',
                desc: '외부 협력 컨설턴트 및 파트너사 제한적 계정',
                color: 'border-amber-200 bg-amber-50/20',
                tokens: '월 50K 엄격 제한',
                features: ['지정 RFP 제안서만 접근', '온프레미스 LLM 강제', '다운로드 차단']
              }
            ].map(r => (
              <div key={r.role} className={`bg-white rounded-2xl border p-4 shadow-2xs space-y-3 ${r.color}`}>
                <div className="pb-2 border-b border-neutral-100">
                  <span className="font-bold text-sm text-neutral-900 block">{r.role}</span>
                  <span className="text-[10px] text-neutral-400 block mt-0.5">{r.desc}</span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="text-[11px] text-neutral-500 font-bold">기본 토큰:</div>
                  <div className="text-neutral-800 font-mono font-semibold">{r.tokens}</div>

                  <div className="text-[11px] text-neutral-500 font-bold pt-1">주요 권한:</div>
                  <ul className="space-y-1 text-[11px] text-neutral-600">
                    {r.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-[#E60012] shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* 데이터 보안 등급별 LLM 강제 라우팅 매트릭스 안내 */}
          <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs space-y-3">
            <h3 className="font-bold text-sm text-neutral-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#E60012]" />
              <span>데이터 보안 등급별 AI 모델 접근 통제 정책</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {securityPolicy.dataClassifications.map(dc => (
                <div key={dc.level} className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-neutral-900">등급: {dc.level} 데이터</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      dc.badgeColor === 'red' ? 'bg-red-100 text-[#E60012]' : dc.badgeColor === 'amber' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {dc.level === '민감' ? '최고 보안' : dc.level === '내부' ? '사내 한정' : '일반'}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-600">{dc.policyDescription}</p>
                  <div className="text-[10px] font-mono text-neutral-500 bg-white p-1.5 rounded border border-neutral-200">
                    허용 모델: {dc.appliedModels.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* User Management Drawer */}
      {managingUser && (
        <div className="fixed inset-0 z-50 bg-black/40 flex justify-end backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300 border-l border-neutral-200">
            {/* Drawer Header */}
            <div className="p-5 border-b border-neutral-200 bg-neutral-50/70 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-sm shadow-2xs">
                  {managingUser.name.slice(0, 1)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-neutral-900">{managingUser.name}</h3>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      editStatus === '활성'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : editStatus === '사용 제한'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-neutral-100 text-neutral-500 border border-neutral-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        editStatus === '활성' ? 'bg-emerald-500' : editStatus === '사용 제한' ? 'bg-amber-500' : 'bg-neutral-400'
                      }`} />
                      {editStatus}
                    </span>
                  </div>
                  <span className="text-xs text-neutral-400 font-mono">{managingUser.email}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setManagingUser(null)}
                className="w-8 h-8 rounded-full hover:bg-neutral-200 flex items-center justify-center text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body (Scrollable) */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* 1. 기본 정보 */}
              <div className="space-y-4">
                <h4 className="font-bold text-neutral-900 text-sm flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-neutral-600" />
                  <span>기본 계정 및 권한 정보</span>
                </h4>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                    <span className="text-neutral-400 block text-[11px] mb-1">사용자명</span>
                    <span className="font-bold text-neutral-900 text-sm">{managingUser.name}</span>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                    <span className="text-neutral-400 block text-[11px] mb-1">소속 부서</span>
                    <span className="font-bold text-neutral-900 text-sm">{managingUser.department}</span>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 mb-1.5">
                    역할 (Role)
                  </label>
                  <select
                    value={editRole}
                    onChange={e => setEditRole(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-white border border-neutral-300 rounded-xl font-bold focus:outline-none focus:border-[#E60012]"
                  >
                    <option value="플랫폼 관리자">플랫폼 관리자 (전사 모델/비용/보안 총괄)</option>
                    <option value="부서 관리자">부서 관리자 (부서원 토큰 및 에이전트 승인)</option>
                    <option value="AI 제작자">AI 제작자 (Agent & Custom AI 등록 권한)</option>
                    <option value="일반 사용자">일반 사용자 (표준 Knowledge AI 및 제안서 작성)</option>
                    <option value="외부 사용자">외부 사용자 (제한된 프롬프트 조회)</option>
                  </select>
                </div>
              </div>

              {/* 2. Token 사용량 및 할당량 관리 */}
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3.5">
                <h4 className="font-bold text-neutral-900 text-sm flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-neutral-600" />
                    <span>Token 사용량 및 할당량</span>
                  </span>
                  <span className="font-mono text-xs font-bold text-neutral-600">
                    잔여: {Math.max(0, editQuota - managingUser.usedTokens).toLocaleString()} Token
                  </span>
                </h4>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-neutral-500">현재 Token 사용량</span>
                    <span className="font-bold font-mono text-neutral-900">
                      {managingUser.usedTokens.toLocaleString()} Token
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        managingUser.usedTokens / editQuota >= 0.95
                          ? 'bg-[#E60012]'
                          : managingUser.usedTokens / editQuota >= 0.8
                          ? 'bg-amber-500'
                          : 'bg-neutral-800'
                      }`}
                      style={{ width: `${Math.min(100, Math.round((managingUser.usedTokens / editQuota) * 100))}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-neutral-400">
                    <span>사용률: {Math.round((managingUser.usedTokens / editQuota) * 100)}%</span>
                    <span>월 할당: {editQuota.toLocaleString()} Token</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-200/60">
                  <label className="block font-bold text-neutral-700 mb-1.5">
                    월 Token 할당량 (Token Quota)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step={10000}
                      min={10000}
                      value={editQuota}
                      onChange={e => setEditQuota(Math.max(0, parseInt(e.target.value) || 0))}
                      className="flex-1 px-3 py-2 text-xs font-mono font-bold bg-white border border-neutral-300 rounded-xl focus:outline-none focus:border-[#E60012]"
                    />
                    <span className="text-neutral-500 font-bold">Token</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <button
                      type="button"
                      onClick={() => setEditQuota(q => q + 10000)}
                      className="px-2 py-1 rounded-lg bg-neutral-200/70 hover:bg-neutral-200 text-[11px] font-bold text-neutral-700 cursor-pointer"
                    >
                      +1만
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditQuota(q => q + 50000)}
                      className="px-2 py-1 rounded-lg bg-neutral-200/70 hover:bg-neutral-200 text-[11px] font-bold text-neutral-700 cursor-pointer"
                    >
                      +5만
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditQuota(q => q + 100000)}
                      className="px-2 py-1 rounded-lg bg-neutral-200/70 hover:bg-neutral-200 text-[11px] font-bold text-neutral-700 cursor-pointer"
                    >
                      +10만
                    </button>
                  </div>
                </div>
              </div>

              {/* 3. 사용 가능한 모델 */}
              <div className="space-y-2.5">
                <label className="block font-bold text-neutral-900 text-sm">
                  사용 가능한 모델 (Multi-LLM 권한)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ALL_AVAILABLE_MODELS.map(m => {
                    const isChecked = editAllowedModels.includes(m);
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => handleToggleModel(m)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                          isChecked
                            ? 'bg-neutral-900 text-white border-neutral-900 shadow-2xs'
                            : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                        }`}
                      >
                        <span className="font-semibold text-[11px]">{m}</span>
                        <Check className={`w-3.5 h-3.5 ${isChecked ? 'opacity-100' : 'opacity-0'}`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. 사용 가능한 Agent / 서비스 */}
              <div className="space-y-2.5">
                <label className="block font-bold text-neutral-900 text-sm">
                  사용 가능한 Agent & 서비스
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ALL_AVAILABLE_AGENTS.map(ai => {
                    const isChecked = editAllowedAi.includes(ai);
                    return (
                      <button
                        key={ai}
                        type="button"
                        onClick={() => handleToggleAi(ai)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                          isChecked
                            ? 'bg-neutral-900 text-white border-neutral-900 shadow-2xs'
                            : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                        }`}
                      >
                        <span className="font-semibold text-[11px]">{ai}</span>
                        <Check className={`w-3.5 h-3.5 ${isChecked ? 'opacity-100' : 'opacity-0'}`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 5. 계정 상태 요약 */}
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between">
                <div>
                  <span className="text-neutral-400 block text-[10px]">계정 상태 (Account Status)</span>
                  <span className="font-bold text-neutral-900 text-xs">
                    {editStatus === '활성' ? '정상 활동 중' : editStatus === '사용 제한' ? 'AI 서비스 일시 중단' : '계정 로그인 비활성화'}
                  </span>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  editStatus === '활성'
                    ? 'bg-emerald-100 text-emerald-800'
                    : editStatus === '사용 제한'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-neutral-200 text-neutral-700'
                }`}>
                  {editStatus}
                </span>
              </div>
            </div>

            {/* Drawer Footer with 4 Mandatory Buttons */}
            <div className="p-4 border-t border-neutral-200 bg-white space-y-2">
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={handleAddQuota}
                  className="px-3 py-2 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>사용량 추가</span>
                </button>

                <button
                  type="button"
                  onClick={handleRestrictAi}
                  className="px-3 py-2 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>AI 사용 제한</span>
                </button>

                <button
                  type="button"
                  onClick={handleToggleActive}
                  className={`px-3 py-2 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs border ${
                    editStatus === '활성'
                      ? 'bg-red-50 text-[#E60012] border-red-200 hover:bg-red-100'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  <PowerOff className="w-3.5 h-3.5" />
                  <span>{editStatus === '활성' ? '계정 비활성화' : '계정 활성화'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setManagingUser(null)}
                  className="flex-1 py-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleSaveManage}
                  className="flex-2 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>저장</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4 border border-neutral-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-xs">
                  {selectedUser.name.slice(0, 1)}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-neutral-900">{selectedUser.name} 임직원 상세</h3>
                  <span className="text-[11px] text-neutral-400 font-mono">{selectedUser.email}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 bg-neutral-50 rounded-xl">
                  <span className="text-neutral-400 block text-[10px]">소속 부서</span>
                  <span className="font-bold text-neutral-800">{selectedUser.department}</span>
                </div>
                <div className="p-2.5 bg-neutral-50 rounded-xl">
                  <span className="text-neutral-400 block text-[10px]">Entra ID 보안그룹</span>
                  <span className="font-bold text-neutral-800 font-mono text-[11px]">{selectedUser.entraGroupId}</span>
                </div>
              </div>

              <div className="p-3 bg-neutral-50 rounded-xl space-y-1.5">
                <span className="text-neutral-400 block text-[10px]">허용된 AI 서비스</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedUser.allowedAi.map((ai, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-white text-neutral-700 border border-neutral-200 text-[10px] font-semibold">
                      {ai}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-neutral-50 rounded-xl space-y-1.5">
                <span className="text-neutral-400 block text-[10px]">허용된 파운데이션 LLM</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedUser.allowedLlms.map((m, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-white text-neutral-700 border border-neutral-200 text-[10px] font-semibold">
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-neutral-800"
              >
                확인 닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
