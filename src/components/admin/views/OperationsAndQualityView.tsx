import React, { useState } from 'react';
import { 
  ScrollText, 
  MessageSquareWarning, 
  Sparkles, 
  AlertOctagon, 
  Download, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  ThumbsDown,
  ThumbsUp,
  ExternalLink
} from 'lucide-react';
import { 
  DetailedAuditLogEntry, 
  AiUserFeedbackItem, 
  AiQualityPerformanceMetric, 
  AdminSystemAlert,
  AdminMenuTab
} from '../../../types';

interface OperationsAndQualityViewProps {
  subTab: 'feedback' | 'quality' | 'audit_logs' | 'alerts';
  onShowToast: (msg: string) => void;
  auditLogs: DetailedAuditLogEntry[];
  feedbackList: AiUserFeedbackItem[];
  qualityMetrics: AiQualityPerformanceMetric[];
  alerts: AdminSystemAlert[];
  onNavigateMenu: (menu: AdminMenuTab) => void;
}

export const OperationsAndQualityView: React.FC<OperationsAndQualityViewProps> = ({
  subTab,
  onShowToast,
  auditLogs,
  feedbackList,
  qualityMetrics,
  alerts,
  onNavigateMenu
}) => {
  const [logSearch, setLogSearch] = useState('');
  const [logCategory, setLogCategory] = useState('all');

  const filteredLogs = auditLogs.filter(l => {
    const matchesSearch = l.userName.includes(logSearch) || l.action.includes(logSearch) || l.target.includes(logSearch);
    const matchesCategory = logCategory === 'all' || l.category === logCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ─────────────────────────────────────────────────────────────
          1. 사용자 피드백 및 만족도 분석
          ───────────────────────────────────────────────────────────── */}
      {subTab === 'feedback' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-neutral-900">AI 서비스별 사용자 피드백 및 불만족 분석</h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                임직원이 AI 답변에 남긴 긍정/부정(👍/👎) 평가율 및 부정 피드백 사유를 분석하여 품질을 개선합니다.
              </p>
            </div>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
              품질 개선 필요 서비스 1건
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {feedbackList.map(fb => (
              <div key={fb.id} className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <h3 className="font-bold text-sm text-neutral-900">{fb.serviceName}</h3>
                  {fb.needsQualityImprovement ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-[#E60012] border border-red-200">
                      품질 개선 필요
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      우수 품질
                    </span>
                  )}
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500">긍정 응답율:</span>
                    <span className="font-bold text-base text-neutral-900">{fb.positiveRate}%</span>
                  </div>

                  <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        fb.positiveRate < 80 ? 'bg-amber-500' : 'bg-neutral-900'
                      }`}
                      style={{ width: `${fb.positiveRate}%` }}
                    />
                  </div>

                  <div className="flex justify-between text-[11px] text-neutral-400 pt-1">
                    <span>총 평가 {fb.totalRatings}건</span>
                    <span>부정 피드백 {fb.negativeCount}건</span>
                  </div>
                </div>

                {/* Recent Negative Feedback */}
                {fb.recentNegativeFeedback.length > 0 && (
                  <div className="pt-2 border-t border-neutral-100 space-y-2">
                    <span className="text-[10px] font-bold text-neutral-400 block uppercase">
                      최근 부정 피드백 사유
                    </span>
                    {fb.recentNegativeFeedback.map(nfb => (
                      <div key={nfb.id} className="p-2.5 bg-neutral-50 rounded-xl text-xs space-y-1">
                        <div className="font-semibold text-neutral-800 text-[11px] truncate">
                          Q: {nfb.query}
                        </div>
                        <div className="text-[10px] text-[#E60012] font-medium">
                          불만: {nfb.reason}
                        </div>
                        <div className="text-[10px] text-neutral-400 text-right">
                          {nfb.userName} · {nfb.timestamp}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. AI 품질 / 성능 모니터링
          ───────────────────────────────────────────────────────────── */}
      {subTab === 'quality' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-neutral-900">AI 모델 및 Agent 성능·품질 모니터링</h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                응답 속도, 호출 성공률/에러율, 할루시네이션 방지 그라운딩 정확도 및 출처 인용률 모니터링
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {qualityMetrics.map(qm => (
              <div key={qm.id} className="bg-white rounded-2xl border border-neutral-200 p-5 shadow-2xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <div>
                    <h3 className="font-bold text-sm text-neutral-900">{qm.targetName}</h3>
                    <span className="text-[10px] text-neutral-400 font-mono">구분: {qm.type}</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    성공률 {qm.successRatePercent}%
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2 bg-neutral-50 rounded-xl">
                    <span className="text-[10px] text-neutral-400 block">평균 응답 속도</span>
                    <span className="font-bold font-mono text-neutral-900">{qm.avgResponseTimeSec}초</span>
                  </div>
                  <div className="p-2 bg-neutral-50 rounded-xl">
                    <span className="text-[10px] text-neutral-400 block">에러 발생율</span>
                    <span className="font-bold font-mono text-neutral-900">{qm.errorRatePercent}%</span>
                  </div>
                  <div className="p-2 bg-neutral-50 rounded-xl">
                    <span className="text-[10px] text-neutral-400 block">그라운딩 정확도</span>
                    <span className="font-bold font-mono text-neutral-900">{qm.groundingAccuracyScore}점</span>
                  </div>
                  <div className="p-2 bg-neutral-50 rounded-xl">
                    <span className="text-[10px] text-neutral-400 block">출처 인용율</span>
                    <span className="font-bold font-mono text-neutral-900">{qm.sourceCitationRate}%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 text-xs">
                  <span className="text-neutral-500">호출당 평균 토큰: {qm.avgTokensPerCall} Token</span>
                  <span className="font-bold text-neutral-800">사용자 만족 지수: {qm.userSatisfactionScore} / 100</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          3. 감사 로그 (Audit Logs)
          ───────────────────────────────────────────────────────────── */}
      {subTab === 'audit_logs' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-neutral-900">보안 감사 및 시스템 이벤트 로그</h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                토큰 할당 승인, API Key 변경, 프롬프트 수정, 미인가 데이터 접근 차단 내역을 영구 보존합니다.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onShowToast('보안 감사 로그 원장이 성공적으로 다운로드되었습니다 (.csv)')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-200 hover:bg-neutral-50 rounded-xl text-xs font-bold text-neutral-700 shadow-2xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>로그 원장 내보내기</span>
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-neutral-200 shadow-2xs">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="사용자명, 조치 내용, 대상 검색..."
                value={logSearch}
                onChange={e => setLogSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#E60012]"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-500 font-medium">카테고리:</span>
              <select
                value={logCategory}
                onChange={e => setLogCategory(e.target.value)}
                className="text-xs bg-neutral-50 border border-neutral-200 rounded-xl px-2.5 py-1.5 focus:outline-none"
              >
                <option value="all">전체 로그</option>
                <option value="토큰 관리">토큰 관리</option>
                <option value="Agent 관리">Agent 관리</option>
                <option value="프롬프트 관리">프롬프트 관리</option>
                <option value="보안 정책">보안 정책</option>
                <option value="비용/한도">비용/한도</option>
                <option value="API 관리">API 관리</option>
              </select>
            </div>
          </div>

          {/* Logs Table */}
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-bold">
                    <th className="py-3 px-4">시각</th>
                    <th className="py-3 px-3">사용자 / 관리자</th>
                    <th className="py-3 px-3">분류</th>
                    <th className="py-3 px-3">수행 액션</th>
                    <th className="py-3 px-4">조치 대상 및 상세</th>
                    <th className="py-3 px-3">수행 결과</th>
                    <th className="py-3 px-3 text-right">클라이언트 IP</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 font-mono">
                  {filteredLogs.map(log => (
                    <tr key={log.id} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="py-3 px-4 text-neutral-400 text-[11px]">{log.time}</td>
                      <td className="py-3 px-3 font-sans font-bold text-neutral-900">{log.userName}</td>
                      <td className="py-3 px-3">
                        <span className="px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-700 text-[10px] font-sans">
                          {log.category}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-sans font-semibold text-neutral-800">{log.action}</td>
                      <td className="py-3 px-4 font-sans text-neutral-600">{log.target}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-sans font-bold ${
                          log.result === '성공'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-red-50 text-[#E60012] border border-red-200'
                        }`}>
                          {log.result}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right text-neutral-400 text-[11px]">{log.clientIp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          4. 시스템 경고 및 긴급 알림 센터
          ───────────────────────────────────────────────────────────── */}
      {subTab === 'alerts' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-neutral-900">시스템 경고 및 이상 징후 알림 센터</h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Token 한도 임박, API 에러 스파이크, 이상 사용량 급증 등 시스템 전반의 이벤트 알림
              </p>
            </div>
            <button
              type="button"
              onClick={() => onShowToast('모든 알림을 읽음 처리했습니다.')}
              className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              모두 읽음 표시
            </button>
          </div>

          <div className="space-y-3">
            {alerts.map(alert => (
              <div key={alert.id} className={`bg-white rounded-2xl border p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                alert.severity === 'critical' ? 'border-red-200 bg-red-50/10' : alert.severity === 'warning' ? 'border-amber-200' : 'border-neutral-200'
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-xl mt-0.5 shrink-0 ${
                    alert.severity === 'critical' ? 'bg-red-100 text-[#E60012]' : alert.severity === 'warning' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-700'
                  }`}>
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-neutral-900">{alert.title}</h3>
                      <span className="text-[10px] text-neutral-400">{alert.timestamp}</span>
                    </div>
                    <p className="text-xs text-neutral-600 mt-0.5">{alert.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      onNavigateMenu(alert.targetMenu);
                      onShowToast(`관련 메뉴 [${alert.targetMenu}]로 바로 이동합니다.`);
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    <span>해당 메뉴로 이동</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
