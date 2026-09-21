import React, { useState } from 'react';
import { 
  Sparkles, 
  Upload, 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  Copy, 
  FileText, 
  Languages, 
  Mic, 
  Play, 
  Pause,
  ExternalLink,
  ShieldCheck,
  Search,
  BookOpen
} from 'lucide-react';
import { CustomAiApp } from '../../data/customAiMockData';

interface CustomAiStandaloneAppProps {
  app: CustomAiApp;
  onBack?: () => void;
  onShowToast: (msg: string) => void;
}

export const CustomAiStandaloneApp: React.FC<CustomAiStandaloneAppProps> = ({
  app,
  onShowToast
}) => {
  // DADAM States
  const [dadamLanguage, setDadamLanguage] = useState<'ko' | 'en' | 'ja' | 'zh'>('ko');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // DARUDA States
  const [darudaSourceText, setDarudaSourceText] = useState(
    'The Korea Productivity Center (KPC) provides enterprise consulting, management education, and national digital productivity certifications.'
  );
  const [darudaTargetLang, setDarudaTargetLang] = useState('한국어 (Korean)');
  const [darudaIsTranslating, setDarudaIsTranslating] = useState(false);
  const [darudaResult, setDarudaResult] = useState(
    '한국생산성본부(KPC)는 기업 컨설팅, 경영 교육 및 국가 디지털 생산성 공인 자격 인증을 제공합니다.'
  );

  // DAOM States
  const [daomSelectedFile, setDaomSelectedFile] = useState('2026_KPC_사업자등록증_스캔본.pdf');
  const [daomConfidence, setDaomConfidence] = useState(99.4);

  const handleRunDaruda = () => {
    setDarudaIsTranslating(true);
    setTimeout(() => {
      setDarudaIsTranslating(false);
      setDarudaResult(
        (darudaTargetLang || '').includes('한국어')
          ? '한국생산성본부(KPC)는 기업 컨설팅, 경영 직무 교육 및 국가 디지털 생산성 공인 자격을 선도적으로 제공합니다. (용어집: KPC 표준 번역 매칭 완료)'
          : 'Korea Productivity Center (KPC) delivers specialized corporate consulting and digital capability enhancement programs.'
      );
      onShowToast('전문 문서 번역이 완료되었습니다.');
    }, 800);
  };

  return (
    <div className="flex flex-col h-full bg-[#FAFBFD] overflow-hidden">
      {/* 각 앱별 특화된 실제 독립 서비스 화면 */}
      <div className="flex-1 overflow-y-auto p-6 max-w-7xl w-full mx-auto">
        {/* CASE 1: DADAM (스마트 회의록 등록, 번역, 요약 시스템) */}
        {(app.name || '').includes('DADAM') && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-2xs">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-neutral-100">
                <div>
                  <h3 className="text-lg font-bold text-neutral-900">회의록 등록 및 자동 요약 스튜디오</h3>
                  <p className="text-xs text-neutral-500">
                    음성 파일 또는 회의 텍스트를 등록하면 STT 화자 분리, 다국어 번역, 핵심 3대 아젠다 요약을 일괄 처리합니다.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsPlayingAudio(!isPlayingAudio);
                      onShowToast(isPlayingAudio ? '오디오 재생 일시정지' : '회의 녹음 오디오 재생 중...');
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    {isPlayingAudio ? <Pause className="w-3.5 h-3.5 text-[#E60012]" /> : <Play className="w-3.5 h-3.5 text-[#E60012]" />}
                    <span>{isPlayingAudio ? '녹음 일시정지' : '회의 녹음 청취 (04:21)'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onShowToast('회의록이 KPC 표준 서식(.docx)으로 다운로드되었습니다.')}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#E60012] hover:bg-[#CC0010] text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>회의록 다운로드</span>
                  </button>
                </div>
              </div>

              {/* 2열 레이아웃: 좌측 STT 화자분리 스크립트 / 우측 요약 & Action Item */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-5">
                {/* 좌측: 실시간 화자 분리 대화록 */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-700 flex items-center gap-1.5">
                      <Mic className="w-3.5 h-3.5 text-[#E60012]" />
                      <span>화자 분리 녹취록 (STT Script)</span>
                    </span>
                    <span className="text-[11px] text-neutral-400">화자 3인 인식 완료</span>
                  </div>
                  <div className="h-96 overflow-y-auto p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3 text-xs">
                    <div className="p-3 bg-white rounded-lg border border-neutral-200 shadow-2xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-neutral-900">화자 1 (정소담 팀장)</span>
                        <span className="text-[10px] text-neutral-400 font-mono">00:02</span>
                      </div>
                      <p className="text-neutral-700 leading-relaxed">
                        금일 회의에서는 4분기 사내 AI Agent 공식 배포 일정과 보안 검수 기준에 대해 최종 점검하겠습니다.
                      </p>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-neutral-200 shadow-2xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-neutral-900">화자 2 (김OO 수석)</span>
                        <span className="text-[10px] text-neutral-400 font-mono">01:15</span>
                      </div>
                      <p className="text-neutral-700 leading-relaxed">
                        서버 GPU 인프라 부하 테스트는 완료되었으며, 동시 500명 접속까지 지연 시간 없이 정상 응답합니다.
                      </p>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-neutral-200 shadow-2xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-neutral-900">화자 3 (박OO 팀장)</span>
                        <span className="text-[10px] text-neutral-400 font-mono">02:40</span>
                      </div>
                      <p className="text-neutral-700 leading-relaxed">
                        컨설팅본부에서도 제안서 검토 Agent 시범 적용 결과 매우 긍정적이며, 9월 말 전사 교육을 요청합니다.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 우측: 핵심 요약 & Action Item */}
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-bold text-neutral-700 block mb-2">
                      💡 3대 핵심 아젠다 요약 (AI Summary)
                    </span>
                    <div className="p-4 bg-neutral-900 text-neutral-200 rounded-xl text-xs space-y-2 leading-relaxed">
                      <p><strong>1. 배포 일정:</strong> 2026년 10월 초 전사 AI Agent 마켓플레이스 공식 오픈 확정</p>
                      <p><strong>2. 인프라 준비:</strong> 동시접속 500명 기준 온프레미스 GPU 클러스터 벤치마크 통과</p>
                      <p><strong>3. 현업 피드백:</strong> 제안서·보고서 분석 만족도 94%, 전사 사용자 교육 9월 말 실시</p>
                    </div>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-neutral-700 block mb-2">
                      📋 후속 조치 (Action Item)
                    </span>
                    <div className="overflow-x-auto rounded-xl border border-neutral-200">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-neutral-100 text-neutral-700 font-bold border-b border-neutral-200">
                          <tr>
                            <th className="p-2.5">담당자</th>
                            <th className="p-2.5">실행 과제</th>
                            <th className="p-2.5">마감 기한</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 bg-white">
                          <tr>
                            <td className="p-2.5 font-bold text-[#E60012]">정소담</td>
                            <td className="p-2.5">보안 검수 가이드라인 배포</td>
                            <td className="p-2.5 font-mono text-neutral-500">09.18</td>
                          </tr>
                          <tr>
                            <td className="p-2.5 font-bold text-neutral-800">김OO</td>
                            <td className="p-2.5">인프라 모니터링 대시보드 구축</td>
                            <td className="p-2.5 font-mono text-neutral-500">09.22</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CASE 2: DARUDA (전문 문서 번역 서비스 화면) */}
        {(app.name || '').includes('DARUDA') && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-2xs">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-5">
                <div>
                  <h3 className="text-lg font-bold text-neutral-900">전문 비즈니스 문서 번역 스튜디오</h3>
                  <p className="text-xs text-neutral-500">
                    KPC 사내 표준 용어집(Glossary)을 자동으로 적용하며 문서 서식(Word/PPT/PDF)을 원본 그대로 유지합니다.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={darudaTargetLang}
                    onChange={(e) => setDarudaTargetLang(e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-neutral-300 text-xs bg-white font-medium"
                  >
                    <option value="한국어 (Korean)">도착어: 한국어 (KO)</option>
                    <option value="영어 (English)">도착어: 영어 (EN)</option>
                    <option value="일본어 (Japanese)">도착어: 일본어 (JA)</option>
                    <option value="중국어 (Chinese)">도착어: 중국어 (ZH)</option>
                  </select>

                  <button
                    type="button"
                    onClick={handleRunDaruda}
                    disabled={darudaIsTranslating}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#E60012] hover:bg-[#CC0010] text-white text-xs font-semibold cursor-pointer shadow-2xs"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${darudaIsTranslating ? 'animate-spin' : ''}`} />
                    <span>번역 실행</span>
                  </button>
                </div>
              </div>

              {/* 2-Panel 번역 대조창 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* 원문 입력 패널 */}
                <div className="flex flex-col border border-neutral-200 rounded-xl overflow-hidden">
                  <div className="px-4 py-2.5 bg-neutral-50 border-b border-neutral-200 text-xs font-bold text-neutral-700 flex justify-between items-center">
                    <span>원문 (Source Text)</span>
                    <span className="text-neutral-400 font-normal">언어 자동 감지: English</span>
                  </div>
                  <textarea
                    rows={8}
                    value={darudaSourceText}
                    onChange={(e) => setDarudaSourceText(e.target.value)}
                    className="p-4 text-xs text-neutral-800 leading-relaxed outline-none resize-none flex-1 font-mono"
                  />
                </div>

                {/* 번역 결과 패널 */}
                <div className="flex flex-col border border-neutral-200 rounded-xl overflow-hidden bg-neutral-50/50">
                  <div className="px-4 py-2.5 bg-neutral-100 border-b border-neutral-200 text-xs font-bold text-neutral-700 flex justify-between items-center">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#E60012]" />
                      <span>KPC 표준 용어 적용 번역문</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(darudaResult);
                        onShowToast('번역문이 클립보드에 복사되었습니다.');
                      }}
                      className="text-neutral-500 hover:text-neutral-900 cursor-pointer flex items-center gap-1 text-[11px]"
                    >
                      <Copy className="w-3 h-3" />
                      <span>복사</span>
                    </button>
                  </div>
                  <div className="p-4 text-xs text-neutral-900 leading-relaxed flex-1 bg-white font-sans">
                    {darudaResult}
                  </div>
                </div>
              </div>

              {/* 하단 용어집 매칭 안내 */}
              <div className="mt-4 p-3 bg-red-50/50 border border-red-100 rounded-xl flex items-center justify-between text-xs text-[#E60012]">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  <span className="font-semibold">KPC 경영·컨설팅 표준 용어 사전(Glossary) v3.4 연동 활성화</span>
                </div>
                <span className="text-[11px] text-neutral-500">정확도 99.1% 보장</span>
              </div>
            </div>
          </div>
        )}

        {/* CASE 3: DAOM (AI OCR 서비스 화면) */}
        {(app.name || '').includes('DAOM') && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-2xs">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100 mb-5">
                <div>
                  <h3 className="text-lg font-bold text-neutral-900">비정형 문서 AI OCR 스튜디오</h3>
                  <p className="text-xs text-neutral-500">
                    스캔 PDF, 이미지, 서식 문서의 바운딩 박스를 실시간 추출하고 표 구조를 엑셀 형식으로 완벽 복원합니다.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onShowToast('Excel(.xlsx) 다운로드가 완료되었습니다.')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-black text-white text-xs font-semibold cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Excel로 내보내기</span>
                  </button>
                </div>
              </div>

              {/* OCR 뷰어 2열 그리드 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 좌측: 스캔 이미지 및 바운딩 박스 오버레이 */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-neutral-700">스캔 원본 뷰어 (바운딩 박스 인식)</span>
                  <div className="relative h-80 bg-neutral-100 border border-neutral-300 rounded-xl p-4 flex flex-col justify-center items-center overflow-hidden">
                    <div className="w-64 h-64 bg-white border border-neutral-300 shadow-md p-3 relative text-[9px] font-mono">
                      <div className="font-bold border-b pb-1 mb-2 text-center text-xs">사업자등록증</div>
                      {/* Bounding box simulation */}
                      <div className="absolute top-10 left-4 w-44 h-4 border border-red-500 bg-red-500/10 flex items-center px-1 text-[8px] text-[#E60012]">
                        상호: 한국생산성본부
                      </div>
                      <div className="absolute top-16 left-4 w-44 h-4 border border-blue-500 bg-blue-500/10 flex items-center px-1 text-[8px] text-blue-600">
                        등록번호: 101-82-00000
                      </div>
                      <div className="absolute top-22 left-4 w-52 h-12 border border-emerald-500 bg-emerald-500/10 flex items-center px-1 text-[8px] text-emerald-700">
                        사업장 소재지: 서울특별시 종로구 새문안로 5가길 32
                      </div>
                    </div>
                  </div>
                </div>

                {/* 우측: 추출된 텍스트 및 표 구조 */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-neutral-700">구조화 텍스트 및 속성 추출 (추출 정확도 {daomConfidence}%)</span>
                  <div className="h-80 bg-neutral-900 text-neutral-200 rounded-xl p-4 font-mono text-xs overflow-y-auto space-y-2">
                    <div className="text-neutral-400 border-b border-neutral-800 pb-1 text-[11px]">
                      // DAOM OCR Structured JSON & Table Output
                    </div>
                    <pre className="text-emerald-300 text-xs leading-relaxed whitespace-pre-wrap">
{`{
  "문서유형": "사업자등록증",
  "상호명": "한국생산성본부 (KPC)",
  "사업자등록번호": "101-82-05459",
  "대표자": "안완기",
  "개업연월일": "1957.08.28",
  "사업장소재지": "서울특별시 종로구 새문안로 5가길 32",
  "업태": "서비스, 교육, 연구개발",
  "종목": "경영진단, 컨설팅, 국가공인자격인증"
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 기타 맞춤형 앱의 경우 일반 전용 작업 화면 제공 */}
        {!(app.name || '').includes('DADAM') && !(app.name || '').includes('DARUDA') && !(app.name || '').includes('DAOM') && (
          <div className="bg-white rounded-xl border border-neutral-200 p-8 shadow-2xs space-y-5">
            <h3 className="text-lg font-bold text-neutral-900">{app.name} 전용 서비스 콘솔</h3>
            <p className="text-xs text-neutral-600 max-w-2xl leading-relaxed">
              {app.description}
            </p>
            <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 space-y-3">
              <span className="text-xs font-bold text-neutral-700">작업 파라미터 입력</span>
              <textarea
                rows={4}
                defaultValue={app.sampleInput}
                className="w-full p-3 bg-white border border-neutral-300 rounded-lg text-xs outline-none focus:border-[#E60012]"
              />
              <button
                type="button"
                onClick={() => onShowToast(`'${app.name}' 작업이 성공적으로 실행되었습니다.`)}
                className="px-4 py-2 bg-[#E60012] text-white rounded-lg text-xs font-bold cursor-pointer"
              >
                실행하기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
