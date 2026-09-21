import React, { useState } from 'react';
import { 
  Server, 
  KeyRound, 
  Check, 
  X, 
  Plus, 
  Search, 
  RotateCcw, 
  ShieldCheck, 
  Activity, 
  AlertTriangle,
  Play,
  Save,
  Lock,
  Layers
} from 'lucide-react';

interface ApiMcpManagementViewProps {
  onShowToast: (msg: string) => void;
}

interface ApiMcpToolItem {
  id: string;
  name: string;
  type: 'MCP Server' | 'REST API' | '사내 내부 API' | '외부 API' | '검색 Tool';
  status: '정상' | '오류' | '점검 중';
  usedServices: string[];
  allowedAgents: string[];
  department: string;
  authType: 'OAuth 2.0' | 'API Key' | 'Bearer Token' | 'mTLS' | 'None';
  securityGrade: '공개' | '내부' | '민감';
  callCount: number;
  recentErrors: number;
  isActive: boolean;
}

const INITIAL_TOOLS: ApiMcpToolItem[] = [
  {
    id: 'tool-1',
    name: 'KPC SharePoint M365 MCP Connector',
    type: 'MCP Server',
    status: '정상',
    usedServices: ['Knowledge AI', '제안서 AI', 'AI Worker'],
    allowedAgents: ['전사 공통 Agent', 'RFP 분석 Agent'],
    department: '디지털혁신처',
    authType: 'OAuth 2.0',
    securityGrade: '내부',
    callCount: 142000,
    recentErrors: 2,
    isActive: true
  },
  {
    id: 'tool-[#',
    name: '국가종합전자조달 (나라장터 g2b) API',
    type: 'REST API',
    status: '정상',
    usedServices: ['제안서 AI', 'AI Worker'],
    allowedAgents: ['RFP 수주 분석 워커'],
    department: 'AI사업본부',
    authType: 'API Key',
    securityGrade: '공개',
    callCount: 89000,
    recentErrors: 0,
    isActive: true
  },
  {
    id: 'tool-3',
    name: 'KPC ERP 사업예산 / 실적 조회 API',
    type: '사내 내부 API',
    status: '정상',
    usedServices: ['AI Worker', 'Custom AI'],
    allowedAgents: ['재무계약 검토 워커'],
    department: '경영기획처',
    authType: 'mTLS',
    securityGrade: '민감',
    callCount: 34000,
    recentErrors: 1,
    isActive: true
  },
  {
    id: 'tool-4',
    name: 'Google Custom Web Search Tool',
    type: '검색 Tool',
    status: '정상',
    usedServices: ['Knowledge AI', 'AI Worker'],
    allowedAgents: ['전사 Agent'],
    department: 'AI사업본부',
    authType: 'API Key',
    securityGrade: '공개',
    callCount: 210000,
    recentErrors: 5,
    isActive: true
  }
];

export const ApiMcpManagementView: React.FC<ApiMcpManagementViewProps> = ({ onShowToast }) => {
  const [tools, setTools] = useState<ApiMcpToolItem[]>(INITIAL_TOOLS);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('전체');

  const handleToggleActive = (id: string) => {
    const targetTool = tools.find(t => t.id === id);
    setTools(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, isActive: !t.isActive };
      }
      return t;
    }));
    if (targetTool) {
      onShowToast(`${targetTool.name} Tool이 [${!targetTool.isActive ? '활성화' : '비활성화'}] 되었습니다.`);
    }
  };

  const filteredTools = tools.filter(t => {
    const matchType = typeFilter === '전체' || t.type === typeFilter;
    const matchQuery = t.name.includes(searchTerm) || t.department.includes(searchTerm);
    return matchType && matchQuery;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-[#E60012]" />
            <h2 className="text-lg font-bold text-neutral-900">API / MCP 중앙 관리 콘솔</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E60012] text-white">
              MCP Server & REST Tool 중앙 등록 센터
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            AI Worker 및 AI Agent가 연동 호출하는 MCP Server, REST API, 사내 연동 Tool의 연결 상태, 보안 등급 및 호출 이력을 관리합니다.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onShowToast('신규 API/MCP Tool 등록 양식이 생성됩니다.')}
          className="px-4 py-2 bg-[#E60012] hover:bg-[#CC0010] text-white rounded-xl text-xs font-black transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>신규 Tool / MCP 등록</span>
        </button>
      </div>

      {/* Filter & Toolbar */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {['전체', 'MCP Server', 'REST API', '사내 내부 API', '검색 Tool'].map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setTypeFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                typeFilter === cat
                  ? 'bg-neutral-900 text-white shadow-2xs'
                  : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Tool 명 또는 부서 검색..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-8 pr-3 py-1.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs focus:outline-none focus:border-[#E60012] w-64"
          />
        </div>
      </div>

      {/* Main Tools Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden text-xs">
        <table className="w-full text-left">
          <thead className="bg-neutral-100 text-neutral-700 font-bold border-b border-neutral-200">
            <tr>
              <th className="py-3 px-4">Tool / MCP 이름</th>
              <th className="py-3 px-4">유형</th>
              <th className="py-3 px-4">연결 상태</th>
              <th className="py-3 px-4">사용 서비스</th>
              <th className="py-3 px-4">관리 부서 / 인증</th>
              <th className="py-3 px-4">데이터 등급</th>
              <th className="py-3 px-4 text-right">월간 호출 수</th>
              <th className="py-3 px-4 text-center">활성화</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {filteredTools.map(t => (
              <tr key={t.id} className="hover:bg-neutral-50/50">
                <td className="py-3.5 px-4 font-bold text-neutral-900">
                  {t.name}
                </td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-neutral-100 text-neutral-700 border border-neutral-200">
                    {t.type}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                    {t.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-neutral-600">
                  <div className="flex flex-wrap gap-1">
                    {t.usedServices.map(s => (
                      <span key={s} className="px-1.5 py-0.5 rounded bg-neutral-100 text-[10px] font-medium text-neutral-600">
                        {s}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <span className="font-bold text-neutral-800 block">{t.department}</span>
                  <span className="text-[10px] text-neutral-400 font-mono">{t.authType}</span>
                </td>
                <td className="py-3.5 px-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    t.securityGrade === '민감' ? 'bg-red-100 text-red-800 border border-red-300'
                    : t.securityGrade === '내부' ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-blue-100 text-blue-800 border border-blue-300'
                  }`}>
                    {t.securityGrade}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right font-mono font-bold text-neutral-900">
                  {t.callCount.toLocaleString()} 회
                </td>
                <td className="py-3.5 px-4 text-center">
                  <button
                    type="button"
                    onClick={() => handleToggleActive(t.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      t.isActive
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-neutral-200 text-neutral-600'
                    }`}
                  >
                    {t.isActive ? '사용 중' : '중지됨'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
