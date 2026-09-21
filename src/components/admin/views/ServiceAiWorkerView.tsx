import React, { useState } from 'react';
import { 
  Bot, 
  Play, 
  ShieldCheck, 
  KeyRound, 
  Cpu, 
  Search, 
  Plus, 
  Check, 
  X, 
  Sliders, 
  RotateCcw, 
  Save, 
  CheckCircle2, 
  AlertTriangle,
  Lock,
  Layers,
  FileText
} from 'lucide-react';

interface ServiceAiWorkerViewProps {
  onShowToast: (msg: string) => void;
}

interface WorkerConfigItem {
  id: string;
  name: string;
  duty: string;
  dept: string;
  primaryLlm: string;
  analysisLlm: string;
  mcpCount: number;
  apiCount: number;
  externalSearch: boolean;
  dailyMaxExecutions: number;
  maxTokens: number;
  // 4-Stage Action Policy
  actionDocRead: '자동' | '확인' | '승인' | '금지';
  actionDocCreate: '자동' | '확인' | '승인' | '금지';
  actionExternalSend: '자동' | '확인' | '승인' | '금지';
  actionDataModify: '자동' | '확인' | '승인' | '금지';
  actionDataDelete: '자동' | '확인' | '승인' | '금지';
  status: '운영 중' | '점검 중' | '비활성';
}

const INITIAL_WORKERS: WorkerConfigItem[] = [
  {
    id: 'worker-1',
    name: 'RFP 수주 분석 워커',
    duty: '공공/기업 RFP 자동 수집, 발주처 분석, 사업 수행 적합도 파악',
    dept: 'AI사업본부',
    primaryLlm: 'GPT-4o Enterprise',
    analysisLlm: 'Claude 3.5 Sonnet (Enterprise)',
    mcpCount: 4,
    apiCount: 6,
    externalSearch: true,
    dailyMaxExecutions: 500,
    maxTokens: 2000000,
    actionDocRead: '자동',
    actionDocCreate: '자동',
    actionExternalSend: '확인',
    actionDataModify: '승인',
    actionDataDelete: '금지',
    status: '운영 중'
  },
  {
    id: 'worker-2',
    name: '교육 연수 운영 보조 워커',
    duty: '연수생 명단 검증, 수료증 자동 발급, 교육 자격 체크',
    dept: '생산성혁신TF',
    primaryLlm: 'Claude 3.5 Sonnet (Enterprise)',
    analysisLlm: 'GPT-4o Enterprise',
    mcpCount: 3,
    apiCount: 5,
    externalSearch: false,
    dailyMaxExecutions: 300,
    maxTokens: 1000000,
    actionDocRead: '자동',
    actionDocCreate: '자동',
    actionExternalSend: '확인',
    actionDataModify: '승인',
    actionDataDelete: '금지',
    status: '운영 중'
  },
  {
    id: 'worker-3',
    name: '재무/계약 자동 검토 워커',
    duty: '전자계약서 법률 조항 검토, 날인 유무 체크, 사업비 계산기',
    dept: '경영기획처',
    primaryLlm: 'Claude 3.5 Sonnet (Enterprise)',
    analysisLlm: 'GPT-4o Enterprise',
    mcpCount: 5,
    apiCount: 8,
    externalSearch: false,
    dailyMaxExecutions: 200,
    maxTokens: 1500000,
    actionDocRead: '자동',
    actionDocCreate: '자동',
    actionExternalSend: '승인',
    actionDataModify: '승인',
    actionDataDelete: '금지',
    status: '운영 중'
  }
];

export const ServiceAiWorkerView: React.FC<ServiceAiWorkerViewProps> = ({ onShowToast }) => {
  const [workers, setWorkers] = useState<WorkerConfigItem[]>(INITIAL_WORKERS);
  const [selectedWorker, setSelectedWorker] = useState<WorkerConfigItem | null>(INITIAL_WORKERS[0]);
  const [searchTerm, setSearchTerm] = useState('');

  const handleUpdateActionPolicy = (
    workerId: string, 
    key: 'actionDocRead' | 'actionDocCreate' | 'actionExternalSend' | 'actionDataModify' | 'actionDataDelete',
    val: '자동' | '확인' | '승인' | '금지'
  ) => {
    setWorkers(prev => prev.map(w => {
      if (w.id === workerId) {
        return { ...w, [key]: val };
      }
      return w;
    }));
    if (selectedWorker && selectedWorker.id === workerId) {
      setSelectedWorker(prev => prev ? { ...prev, [key]: val } : null);
    }
    onShowToast(`Worker Action 권한이 [${val}]로 수정되었습니다.`);
  };

  const filteredWorkers = workers.filter(w => 
    w.name.includes(searchTerm) || w.duty.includes(searchTerm) || w.dept.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-[#E60012]" />
            <h2 className="text-lg font-bold text-neutral-900">AI Worker 관리자 설정</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-neutral-100 text-neutral-700 border border-neutral-200">
              [✓] 서비스별 업무 실행 정책 및 Action 권한 관리
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            담당 업무별 AI Worker의 LLM, MCP/API 연동, 일일 실행 제한 및 4단계 Action 실행 권한(자동/확인/승인/금지)을 제어합니다.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onShowToast('새로운 AI Worker 등록 양식이 생성되었습니다.')}
          className="px-4 py-2 bg-[#E60012] hover:bg-[#CC0010] text-white rounded-xl text-xs font-black transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>신규 AI Worker 추가</span>
        </button>
      </div>

      {/* Grid: Worker List & Selected Worker Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Worker List Panel */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-neutral-900">등록된 AI Worker ({workers.length})</h3>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Worker 명 또는 부서 검색..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-[#E60012]"
            />
          </div>

          <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
            {filteredWorkers.map(w => {
              const isSelected = selectedWorker?.id === w.id;
              return (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setSelectedWorker(w)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-red-50/60 border-[#E60012] shadow-2xs' 
                      : 'bg-neutral-50/80 hover:bg-neutral-100 border-neutral-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-900">{w.name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white text-neutral-600 border border-neutral-200">
                      {w.dept}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
                    {w.duty}
                  </p>
                  <div className="mt-2 pt-2 border-t border-neutral-200/60 flex items-center justify-between text-[10px] text-neutral-400 font-mono">
                    <span>MCP {w.mcpCount}개 · API {w.apiCount}개</span>
                    <span className="text-[#E60012] font-bold">{w.primaryLlm.split(' ')[0]}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Worker Details & Action Policy Controls */}
        {selectedWorker ? (
          <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-200 p-6 shadow-2xs space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-neutral-900 text-white">
                    {selectedWorker.dept}
                  </span>
                  <h3 className="text-base font-bold text-neutral-900">{selectedWorker.name}</h3>
                </div>
                <p className="text-xs text-neutral-500 mt-1">{selectedWorker.duty}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onShowToast(`${selectedWorker.name} 설정이 저장되었습니다.`)}
                  className="px-4 py-2 bg-[#E60012] hover:bg-[#CC0010] text-white rounded-xl text-xs font-black transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>설정 저장</span>
                </button>
              </div>
            </div>

            {/* Model & Resource Allocation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-neutral-700 mb-1">기본 LLM (Primary Model)</label>
                <select
                  value={selectedWorker.primaryLlm}
                  onChange={e => {
                    const val = e.target.value;
                    setSelectedWorker(prev => prev ? { ...prev, primaryLlm: val } : null);
                  }}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 font-semibold focus:outline-none focus:border-[#E60012]"
                >
                  <option value="GPT-4o Enterprise">GPT-4o Enterprise API</option>
                  <option value="Claude 3.5 Sonnet (Enterprise)">Claude 3.5 Sonnet Enterprise</option>
                  <option value="Gemini 1.5 Pro Enterprise">Gemini 1.5 Pro Enterprise</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">복잡 분석 LLM (Analysis Model)</label>
                <select
                  value={selectedWorker.analysisLlm}
                  onChange={e => {
                    const val = e.target.value;
                    setSelectedWorker(prev => prev ? { ...prev, analysisLlm: val } : null);
                  }}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 font-semibold focus:outline-none focus:border-[#E60012]"
                >
                  <option value="Claude 3.5 Sonnet (Enterprise)">Claude 3.5 Sonnet Enterprise</option>
                  <option value="GPT-4o Enterprise">GPT-4o Enterprise API</option>
                  <option value="O1 Reasoning Model">O1 Reasoning Model</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">일일 최대 실행 횟수</label>
                <input
                  type="number"
                  value={selectedWorker.dailyMaxExecutions}
                  onChange={e => {
                    const val = Number(e.target.value);
                    setSelectedWorker(prev => prev ? { ...prev, dailyMaxExecutions: val } : null);
                  }}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl font-mono text-neutral-900 font-bold focus:outline-none focus:border-[#E60012]"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">월간 최대 Token Limit</label>
                <input
                  type="number"
                  value={selectedWorker.maxTokens}
                  onChange={e => {
                    const val = Number(e.target.value);
                    setSelectedWorker(prev => prev ? { ...prev, maxTokens: val } : null);
                  }}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl font-mono text-neutral-900 font-bold focus:outline-none focus:border-[#E60012]"
                />
              </div>
            </div>

            {/* 4-Stage Action Permissions Table (핵심 요구사항) */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#E60012]" />
                  <span>4단계 Action 실행 통제 권한 (Execution Policy)</span>
                </h4>
                <span className="text-[11px] text-neutral-400">자동 실행 / 사용자 확인 / 관리자 승인 / 금지</span>
              </div>

              <div className="border border-neutral-200 rounded-xl overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-neutral-100 text-neutral-600 font-bold border-b border-neutral-200">
                    <tr>
                      <th className="py-2.5 px-4">Action 단계</th>
                      <th className="py-2.5 px-4 text-center">자동 실행 (Auto)</th>
                      <th className="py-2.5 px-4 text-center">사용자 확인 (User)</th>
                      <th className="py-2.5 px-4 text-center">관리자 승인 (Admin)</th>
                      <th className="py-2.5 px-4 text-center">실행 금지 (Forbidden)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {[
                      { key: 'actionDocRead', label: '1. 사내 문서 및 파일 조회', current: selectedWorker.actionDocRead },
                      { key: 'actionDocCreate', label: '2. 요약보고서 및 문서 생성', current: selectedWorker.actionDocCreate },
                      { key: 'actionExternalSend', label: '3. 외부 시스템 / API 데이터 전송', current: selectedWorker.actionExternalSend },
                      { key: 'actionDataModify', label: '4. 사내 데이터베이스 / 레코드 수정', current: selectedWorker.actionDataModify },
                      { key: 'actionDataDelete', label: '5. 데이터 영구 삭제 / 폐기', current: selectedWorker.actionDataDelete },
                    ].map(act => (
                      <tr key={act.key} className="hover:bg-neutral-50/50">
                        <td className="py-3 px-4 font-bold text-neutral-800">{act.label}</td>
                        {(['자동', '확인', '승인', '금지'] as const).map(policyVal => {
                          const isChecked = act.current === policyVal;
                          return (
                            <td key={policyVal} className="py-3 px-4 text-center">
                              <button
                                type="button"
                                onClick={() => handleUpdateActionPolicy(selectedWorker.id, act.key as any, policyVal)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                  isChecked
                                    ? policyVal === '자동' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : policyVal === '확인' ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                    : policyVal === '승인' ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                    : 'bg-red-100 text-red-800 border border-red-300'
                                    : 'bg-neutral-100 text-neutral-400 hover:text-neutral-700'
                                }`}
                              >
                                {policyVal}
                              </button>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 bg-white rounded-2xl border border-neutral-200 p-12 text-center text-neutral-400">
            좌측 목록에서 관리할 AI Worker를 선택해주세요.
          </div>
        )}
      </div>
    </div>
  );
};
