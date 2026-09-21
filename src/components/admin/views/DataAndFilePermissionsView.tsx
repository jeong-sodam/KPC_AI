import React, { useState } from 'react';
import { 
  Database, 
  Cloud, 
  Server, 
  Check, 
  X, 
  Lock, 
  ShieldCheck, 
  Layers, 
  Save, 
  Building, 
  RefreshCw,
  Search
} from 'lucide-react';

interface DataAndFilePermissionsViewProps {
  onShowToast: (msg: string) => void;
}

interface DataSourceItem {
  id: string;
  name: string;
  type: string;
  status: '연결됨' | '동기화 중' | '오류';
  department: string;
  allowedOrgs: string;
  aiSearchAllowed: boolean;
  ragIndexingAllowed: boolean;
  externalLlmAllowed: boolean;
  securityGrade: '공개' | '내부' | '민감';
  inheritM365Perms: boolean;
}

const INITIAL_SOURCES: DataSourceItem[] = [
  {
    id: 'ds-1',
    name: 'SharePoint 사내 공통 라이브러리',
    type: 'Microsoft 365',
    status: '연결됨',
    department: '디지털혁신처',
    allowedOrgs: '전사 임직원',
    aiSearchAllowed: true,
    ragIndexingAllowed: true,
    externalLlmAllowed: false,
    securityGrade: '내부',
    inheritM365Perms: true
  },
  {
    id: 'ds-2',
    name: 'OneDrive 사용자 및 부서 공유 폴더',
    type: 'Microsoft 365',
    status: '연결됨',
    department: '디지털혁신처',
    allowedOrgs: '소속 부서원',
    aiSearchAllowed: true,
    ragIndexingAllowed: true,
    externalLlmAllowed: false,
    securityGrade: '내부',
    inheritM365Perms: true
  },
  {
    id: 'ds-3',
    name: 'KPC ERP 경영정보 & 과제 실적 DB',
    type: '사내 DB',
    status: '연결됨',
    department: '경영기획처',
    allowedOrgs: '팀장급 이상 / PM',
    aiSearchAllowed: true,
    ragIndexingAllowed: false,
    externalLlmAllowed: false,
    securityGrade: '민감',
    inheritM365Perms: false
  },
  {
    id: 'ds-4',
    name: 'KPC 교육/이러닝 수료증 자격 데이터',
    type: '교육 LMS DB',
    status: '연결됨',
    department: '생산성혁신TF',
    allowedOrgs: '전사 임직원',
    aiSearchAllowed: true,
    ragIndexingAllowed: true,
    externalLlmAllowed: false,
    securityGrade: '내부',
    inheritM365Perms: false
  }
];

export const DataAndFilePermissionsView: React.FC<DataAndFilePermissionsViewProps> = ({ onShowToast }) => {
  const [sources, setSources] = useState<DataSourceItem[]>(INITIAL_SOURCES);
  const [searchTerm, setSearchTerm] = useState('');

  const handleTogglePerm = (id: string, permKey: 'aiSearchAllowed' | 'ragIndexingAllowed' | 'externalLlmAllowed' | 'inheritM365Perms') => {
    const targetSource = sources.find(s => s.id === id);
    setSources(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, [permKey]: !s[permKey] };
      }
      return s;
    }));
    if (targetSource) {
      onShowToast(`${targetSource.name} 데이터 권한 설정이 변경되었습니다.`);
    }
  };

  const filteredSources = sources.filter(s => 
    s.name.includes(searchTerm) || s.department.includes(searchTerm) || s.type.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-[#E60012]" />
            <h2 className="text-lg font-bold text-neutral-900">데이터 및 파일 접근권한 관리</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E60012] text-white">
              SharePoint / M365 RBAC 권한 상속 엔진
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            SharePoint, OneDrive, ERP, 교육 LMS 등 사내 연동 데이터 소스의 AI 검색/색인 허용 여부 및 M365 파일 권한 상속을 설정합니다.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onShowToast('사내 데이터 소스 연결 및 권한 변경 사항이 저장되었습니다.')}
          className="px-4 py-2 bg-[#E60012] hover:bg-[#CC0010] text-white rounded-xl text-xs font-black transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>권한 설정 저장</span>
        </button>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden text-xs">
        <table className="w-full text-left">
          <thead className="bg-neutral-100 text-neutral-700 font-bold border-b border-neutral-200">
            <tr>
              <th className="py-3 px-4">연결 데이터 소스명</th>
              <th className="py-3 px-4">관리 부서</th>
              <th className="py-3 px-4">접근 가능 조직</th>
              <th className="py-3 px-4 text-center">AI 검색 허용</th>
              <th className="py-3 px-4 text-center">RAG 색인 허용</th>
              <th className="py-3 px-4 text-center">외부 LLM 전송</th>
              <th className="py-3 px-4 text-center">M365 권한 상속</th>
              <th className="py-3 px-4">보안 등급</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {filteredSources.map(s => (
              <tr key={s.id} className="hover:bg-neutral-50/50">
                <td className="py-3.5 px-4 font-bold text-neutral-900">
                  <span className="block">{s.name}</span>
                  <span className="text-[10px] text-neutral-400 font-mono">{s.type}</span>
                </td>
                <td className="py-3.5 px-4 font-bold text-neutral-800">{s.department}</td>
                <td className="py-3.5 px-4 text-neutral-600 font-medium">{s.allowedOrgs}</td>
                
                {(['aiSearchAllowed', 'ragIndexingAllowed', 'externalLlmAllowed', 'inheritM365Perms'] as const).map(pKey => (
                  <td key={pKey} className="py-3.5 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => handleTogglePerm(s.id, pKey)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        s[pKey]
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-neutral-100 text-neutral-400'
                      }`}
                    >
                      {s[pKey] ? '허용' : '차단'}
                    </button>
                  </td>
                ))}

                <td className="py-3.5 px-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    s.securityGrade === '민감' ? 'bg-red-100 text-red-800 border border-red-300'
                    : 'bg-amber-100 text-amber-800 border border-amber-300'
                  }`}>
                    {s.securityGrade}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
