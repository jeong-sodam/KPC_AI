import React, { useState } from 'react';
import { 
  Database, 
  Sparkles, 
  Layers, 
  Shield, 
  Sliders, 
  Check, 
  RotateCcw, 
  Info, 
  Save, 
  FileText, 
  Lock, 
  Share2,
  Server,
  Cpu
} from 'lucide-react';

interface ServiceKnowledgeAiViewProps {
  onShowToast: (msg: string) => void;
}

export const ServiceKnowledgeAiView: React.FC<ServiceKnowledgeAiViewProps> = ({ onShowToast }) => {
  // Inheritance State
  const [usePlatformDefault, setUsePlatformDefault] = useState(true);

  // Settings State
  const [searchModel, setSearchModel] = useState('KPC Hybrid RAG Vector Search (v2.1)');
  const [embeddingModel, setEmbeddingModel] = useState('text-embedding-3-large (OpenAI)');
  const [rerankingModel, setRerankingModel] = useState('Cohere Rerank v3.5 Multilingual');
  const [answerLlm, setAnswerLlm] = useState('Claude 3.5 Sonnet (Enterprise)');
  const [fallbackLlm, setFallbackLlm] = useState('GPT-4o Enterprise');

  // RAG Configuration
  const [chunkSize, setChunkSize] = useState(512);
  const [chunkOverlap, setChunkOverlap] = useState(64);
  const [topK, setTopK] = useState(10);
  const [enableReranking, setEnableReranking] = useState(true);
  const [showCitation, setShowCitation] = useState(true);
  const [showPageNumber, setShowPageNumber] = useState(true);

  // Sources Toggle
  const [sources, setSources] = useState({
    sharepoint: true,
    onedrive: true,
    teams: true,
    internalDb: true,
    elarning: true
  });

  // Security Toggles
  const [maskPii, setMaskPii] = useState(true);
  const [blockExternalLlm, setBlockExternalLlm] = useState(true);
  const [restrictDownload, setRestrictDownload] = useState(false);

  const handleSave = () => {
    onShowToast('Knowledge AI 관리자 설정이 성공적으로 저장되었습니다.');
  };

  const handleResetToDefault = () => {
    setUsePlatformDefault(true);
    setSearchModel('KPC Hybrid RAG Vector Search (v2.1)');
    setEmbeddingModel('text-embedding-3-large (OpenAI)');
    setRerankingModel('Cohere Rerank v3.5 Multilingual');
    setAnswerLlm('Claude 3.5 Sonnet (Enterprise)');
    setChunkSize(512);
    setTopK(10);
    setMaskPii(true);
    setBlockExternalLlm(true);
    onShowToast('Knowledge AI 설정이 [플랫폼 기본 설정]으로 초기화되었습니다.');
  };

  return (
    <div className="space-y-6">
      {/* Header & Inheritance Banner */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-[#E60012]" />
            <h2 className="text-lg font-bold text-neutral-900">Knowledge AI 관리자 설정</h2>
            {usePlatformDefault ? (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-neutral-100 text-neutral-700 border border-neutral-200">
                [✓] 플랫폼 기본 설정 사용 중
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-50 text-[#E60012] border border-red-200">
                ● Knowledge AI 개별 설정 적용
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            사내 지식 검색(RAG), 검색·임베딩 모델, 문서 접근 권한 및 보안 마스킹 정책을 관리합니다.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>플랫폼 기본값으로 복원</span>
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-[#E60012] hover:bg-[#CC0010] text-white rounded-xl text-xs font-black transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>설정 저장</span>
          </button>
        </div>
      </div>

      {/* Mode Switch Card */}
      <div className="bg-neutral-50 rounded-2xl border border-neutral-200 p-5">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Sliders className="w-5 h-5 text-neutral-600" />
            <div>
              <h3 className="text-sm font-bold text-neutral-900">정책 상속 설정</h3>
              <p className="text-xs text-neutral-500">상위 플랫폼 정책을 상속받을지, Knowledge AI 전용 설정을 적용할지 선택합니다.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white p-1 rounded-xl border border-neutral-200">
            <button
              type="button"
              onClick={() => {
                setUsePlatformDefault(true);
                onShowToast('플랫폼 기본 정책이 상속되었습니다.');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                usePlatformDefault 
                  ? 'bg-neutral-900 text-white shadow-2xs' 
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              ✓ 플랫폼 기본 설정 사용
            </button>
            <button
              type="button"
              onClick={() => {
                setUsePlatformDefault(false);
                onShowToast('Knowledge AI 개별 오버라이드 모드가 활성화되었습니다.');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                !usePlatformDefault 
                  ? 'bg-[#E60012] text-white shadow-2xs' 
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              ● 서비스 개별 설정 적용
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Models & RAG Parameters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. AI Models Configuration */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-2xs space-y-5">
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
            <Cpu className="w-4 h-4 text-[#E60012]" />
            <h3 className="text-sm font-bold text-neutral-900">AI 모델 구성 (RAG Pipeline)</h3>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-neutral-700 mb-1">검색 모델 (Search Engine)</label>
              <select
                value={searchModel}
                onChange={e => { setSearchModel(e.target.value); setUsePlatformDefault(false); }}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 font-semibold focus:outline-none focus:border-[#E60012]"
              >
                <option value="KPC Hybrid RAG Vector Search (v2.1)">KPC Hybrid RAG Vector Search (Dense + Sparse Hybrid)</option>
                <option value="ElasticSearch BM25 + Vector">ElasticSearch BM25 + Vector</option>
                <option value="Azure AI Search Hybrid">Azure AI Search Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-neutral-700 mb-1">임베딩 모델 (Embedding Model)</label>
              <select
                value={embeddingModel}
                onChange={e => { setEmbeddingModel(e.target.value); setUsePlatformDefault(false); }}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 font-semibold focus:outline-none focus:border-[#E60012]"
              >
                <option value="text-embedding-3-large (OpenAI)">text-embedding-3-large (OpenAI 3072 dims)</option>
                <option value="text-embedding-gecko-003 (Google)">text-embedding-gecko-003 (Google)</option>
                <option value="bge-m3-multilingual (Open-Source)">bge-m3-multilingual (Open Source)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-neutral-700 mb-1">리랭킹 모델 (Reranking Model)</label>
              <select
                value={rerankingModel}
                onChange={e => { setRerankingModel(e.target.value); setUsePlatformDefault(false); }}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 font-semibold focus:outline-none focus:border-[#E60012]"
              >
                <option value="Cohere Rerank v3.5 Multilingual">Cohere Rerank v3.5 Multilingual</option>
                <option value="BGE-Reranker-v2-m3">BGE-Reranker-v2-m3</option>
                <option value="bge-reranker-large">bge-reranker-large</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-neutral-700 mb-1">답변 생성 생성형 LLM (Answer Generator)</label>
              <select
                value={answerLlm}
                onChange={e => { setAnswerLlm(e.target.value); setUsePlatformDefault(false); }}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-900 font-semibold focus:outline-none focus:border-[#E60012]"
              >
                <option value="Claude 3.5 Sonnet (Enterprise)">Claude 3.5 Sonnet (Enterprise API)</option>
                <option value="GPT-4o Enterprise">GPT-4o Enterprise</option>
                <option value="Gemini 1.5 Pro Enterprise">Gemini 1.5 Pro Enterprise</option>
                <option value="HyperCLOVA X HCX-003">HyperCLOVA X HCX-003 (Naver)</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2. RAG Chunking & Retrieval Parameters */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-2xs space-y-5">
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
            <Layers className="w-4 h-4 text-[#E60012]" />
            <h3 className="text-sm font-bold text-neutral-900">RAG 검색 및 청크 세부 파라미터</h3>
          </div>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-neutral-700 mb-1">청크 크기 (Chunk Size)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={chunkSize}
                    onChange={e => { setChunkSize(Number(e.target.value)); setUsePlatformDefault(false); }}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl font-mono text-neutral-900 font-bold focus:outline-none focus:border-[#E60012]"
                  />
                  <span className="text-neutral-400 font-mono">tokens</span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 mb-1">청크 오버랩 (Overlap)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={chunkOverlap}
                    onChange={e => { setChunkOverlap(Number(e.target.value)); setUsePlatformDefault(false); }}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl font-mono text-neutral-900 font-bold focus:outline-none focus:border-[#E60012]"
                  />
                  <span className="text-neutral-400 font-mono">tokens</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block font-bold text-neutral-700 mb-1">검색 개수 (Top-K Retrieval)</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="3"
                  max="30"
                  value={topK}
                  onChange={e => { setTopK(Number(e.target.value)); setUsePlatformDefault(false); }}
                  className="w-full accent-[#E60012]"
                />
                <span className="font-mono font-bold text-neutral-900 px-2 py-1 bg-neutral-100 rounded-lg text-xs shrink-0">
                  Top {topK}
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-100 space-y-2.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableReranking}
                  onChange={e => { setEnableReranking(e.target.checked); setUsePlatformDefault(false); }}
                  className="rounded text-[#E60012] focus:ring-[#E60012]"
                />
                <span className="font-bold text-neutral-800">2차 Reranking 필터 활성화</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showCitation}
                  onChange={e => { setShowCitation(e.target.checked); setUsePlatformDefault(false); }}
                  className="rounded text-[#E60012] focus:ring-[#E60012]"
                />
                <span className="font-bold text-neutral-800">답변 내 출처 문서 배지 표시</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showPageNumber}
                  onChange={e => { setShowPageNumber(e.target.checked); setUsePlatformDefault(false); }}
                  className="rounded text-[#E60012] focus:ring-[#E60012]"
                />
                <span className="font-bold text-neutral-800">원문 페이지 번호 및 하이라이팅 표시</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Sources & Security Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Knowledge Source Targets */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
            <Server className="w-4 h-4 text-[#E60012]" />
            <h3 className="text-sm font-bold text-neutral-900">연결 지식 데이터 소스 (Knowledge Sources)</h3>
          </div>

          <div className="space-y-3 text-xs">
            {Object.entries({
              sharepoint: '사내 SharePoint 라이브러리 및 문서',
              onedrive: '조직 사용자 OneDrive 업무 공유 파일',
              teams: 'Microsoft Teams 채널 메시지 및 수신 파일',
              internalDb: 'KPC 사내 ERP/LMS 데이터베이스 및 표준 서식',
              elarning: '이러닝/교육 시스템 지식 콘텐츠'
            }).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                <span className="font-bold text-neutral-800">{label}</span>
                <button
                  type="button"
                  onClick={() => {
                    setSources(prev => ({ ...prev, [key]: !prev[key as keyof typeof prev] }));
                    setUsePlatformDefault(false);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    sources[key as keyof typeof sources]
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-neutral-200 text-neutral-600'
                  }`}
                >
                  {sources[key as keyof typeof sources] ? '연결 허용' : '차단됨'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Security & Access Policies */}
        <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
            <Shield className="w-4 h-4 text-[#E60012]" />
            <h3 className="text-sm font-bold text-neutral-900">보안 및 데이터 접근 통제 Policy</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-neutral-800 block">민감정보(주민번호/계좌/인적) Masking</span>
                <span className="text-[11px] text-neutral-500">LLM 프롬프트 전달 전 자동 난독화 처리</span>
              </div>
              <input
                type="checkbox"
                checked={maskPii}
                onChange={e => { setMaskPii(e.target.checked); setUsePlatformDefault(false); }}
                className="w-4 h-4 rounded text-[#E60012] focus:ring-[#E60012]"
              />
            </div>

            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-neutral-800 block">외부 상용 LLM으로 전송 제한</span>
                <span className="text-[11px] text-neutral-500">내부/민감문서는 Enterprise LLM 전용 격리</span>
              </div>
              <input
                type="checkbox"
                checked={blockExternalLlm}
                onChange={e => { setBlockExternalLlm(e.target.checked); setUsePlatformDefault(false); }}
                className="w-4 h-4 rounded text-[#E60012] focus:ring-[#E60012]"
              />
            </div>

            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-neutral-800 block">원문 문서 파일 다운로드 금지</span>
                <span className="text-[11px] text-neutral-500">뷰어 내 즉시 열람만 허용하고 PC 다운로드 차단</span>
              </div>
              <input
                type="checkbox"
                checked={restrictDownload}
                onChange={e => { setRestrictDownload(e.target.checked); setUsePlatformDefault(false); }}
                className="w-4 h-4 rounded text-[#E60012] focus:ring-[#E60012]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
