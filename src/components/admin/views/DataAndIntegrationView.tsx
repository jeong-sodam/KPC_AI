import React, { useState } from 'react';
import { 
  Database, 
  Share2, 
  Cloud, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  Lock, 
  FileText, 
  Server,
  Layers
} from 'lucide-react';
import { KnowledgeRagSource, SystemConnectorItem } from '../../../types';

interface DataAndIntegrationViewProps {
  subTab: 'knowledge_rag' | 'connectors' | 'm365';
  onShowToast: (msg: string) => void;
  ragSources: KnowledgeRagSource[];
  setRagSources: React.Dispatch<React.SetStateAction<KnowledgeRagSource[]>>;
  connectors: SystemConnectorItem[];
  setConnectors: React.Dispatch<React.SetStateAction<SystemConnectorItem[]>>;
}

export const DataAndIntegrationView: React.FC<DataAndIntegrationViewProps> = ({
  subTab,
  onShowToast,
  ragSources,
  setRagSources,
  connectors,
  setConnectors
}) => {
  // Sync source action
  const handleSyncSource = (sourceId: string, name: string) => {
    onShowToast(`[${name}] RAG 지식 색인 동기화 요청을 전송했습니다...`);
    setTimeout(() => {
      setRagSources(prev => prev.map(s => {
        if (s.id === sourceId) {
          return {
            ...s,
            status: '정상',
            lastSyncedAt: '방금 전 (동기화 완료)',
            errorCount: 0,
            indexingStatus: '최신 (색인 100%)'
          };
        }
        return s;
      }));
      onShowToast(`[${name}] 지식 색인 100% 동기화가 완료되었습니다.`);
    }, 800);
  };

  // Test connector action
  const handleTestConnector = (connId: string, name: string) => {
    onShowToast(`[${name}] 연계 테스트 중...`);
    setTimeout(() => {
      onShowToast(`[${name}] 통신 정상: HTTP 200 OK (평균 지연: 48ms)`);
    }, 600);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ─────────────────────────────────────────────────────────────
          1. Knowledge / RAG 관리 (8대 연계 소스)
          ───────────────────────────────────────────────────────────── */}
      {subTab === 'knowledge_rag' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-neutral-900">사내 지식 자산(RAG) 연동 및 색인 모니터링</h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                SharePoint, OneDrive, Teams, KPC 사내문서, 교육/이러닝/자격/ERP 8대 소스의 실시간 동기화 및 권한 상속 상태
              </p>
            </div>
            <button
              type="button"
              onClick={() => onShowToast('전체 8개 지식 저장소 일괄 백그라운드 색인 배치를 시작했습니다.')}
              className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold shadow-2xs transition-colors cursor-pointer"
            >
              전체 지식 일괄 동기화
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ragSources.map(src => (
              <div key={src.id} className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs space-y-4">
                <div className="flex items-start justify-between pb-3 border-b border-neutral-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center font-bold text-neutral-700">
                      <Database className="w-4 h-4 text-[#E60012]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-neutral-900">{src.sourceName}</h3>
                      <span className="text-[11px] text-neutral-400 block font-mono">
                        분류: {src.type} · {src.docCount.toLocaleString()}건 문서
                      </span>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    src.status === '정상'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {src.status}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">최근 동기화:</span>
                    <span className="font-mono text-neutral-800">{src.lastSyncedAt}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">벡터 색인 상태:</span>
                    <span className="font-bold text-neutral-900">{src.indexingStatus}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">보안 권한 매핑:</span>
                    <span className="text-neutral-700 font-medium">{src.permissionSyncStatus}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-[11px] text-neutral-400">
                    오류 발생: {src.errorCount}건
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSyncSource(src.id, src.sourceName)}
                    className="flex items-center gap-1 px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-lg text-xs font-bold cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>지금 동기화</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. 시스템 연계 및 커넥터 관리
          ───────────────────────────────────────────────────────────── */}
      {subTab === 'connectors' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-neutral-900">외부 및 사내 시스템 커넥터 상태</h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Microsoft 365, SharePoint Online, 사내 ERP 및 교육정보망 API Gateway의 실시간 헬스체크 및 장애 모니터링
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {connectors.map(conn => (
              <div key={conn.id} className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-neutral-600" />
                    <h3 className="font-bold text-sm text-neutral-900">{conn.name}</h3>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      conn.status === '정상'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {conn.status}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500">{conn.description}</p>
                  <div className="flex items-center gap-3 text-[11px] text-neutral-400 pt-1 font-mono">
                    <span>응답 상태: {conn.apiStatus}</span>
                    <span>·</span>
                    <span>평균 RTT: {conn.avgLatencyMs}ms</span>
                    <span>·</span>
                    <span>최근 호출: {conn.lastCallTime}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleTestConnector(conn.id, conn.name)}
                    className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                  >
                    통신 테스트
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          3. Microsoft 365 연동 현황
          ───────────────────────────────────────────────────────────── */}
      {subTab === 'm365' && (
        <div className="space-y-5">
          <div>
            <h2 className="text-xl font-bold text-neutral-900">Microsoft 365 및 Entra ID 연동 아키텍처</h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              사내 싱글사인온(SSO), Graph API 권한 스코프(User.Read, Files.Read.All, Mail.Read) 및 동기화 정책을 점검합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">AUTH & SSO</span>
              <h3 className="font-bold text-sm text-neutral-900">Microsoft Entra ID</h3>
              <p className="text-xs text-neutral-600">
                임직원 사내 이메일 계정 기반 OAuth 2.0 PKCE 인증. 사내 보안 규정에 따른 MFA(2단계 인증) 강제 적용 중.
              </p>
              <div className="pt-2 text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>정상 연결 (동기화 활성)</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">DOCUMENT GRAPH</span>
              <h3 className="font-bold text-sm text-neutral-900">SharePoint / OneDrive</h3>
              <p className="text-xs text-neutral-600">
                사내 문서함 실시간 변경 Webhook 감지 및 증분 색인(Delta Query). 열람 권한 1:1 자동 상속.
              </p>
              <div className="pt-2 text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>28,500건 인덱싱 완료</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">COLLABORATION</span>
              <h3 className="font-bold text-sm text-neutral-900">Teams / Exchange Bot</h3>
              <p className="text-xs text-neutral-600">
                팀즈 채널 회의록 요약 봇 및 아웃룩 캘린더 연계. 주간 보고서 자동 발송 알림 연동.
              </p>
              <div className="pt-2 text-xs font-bold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>웹훅 게이트웨이 정상</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
