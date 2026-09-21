import { WorkerDocument, WorkerSearchSnippet } from '../types';

export interface WorkerDocCitation {
  name: string;
  page: number;
  section: string;
  quote: string;
}

export interface WorkerChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  referencedDocs?: WorkerDocCitation[];
  isStrictGrounding?: boolean;
  attachedFiles?: string[];
  model?: string;
  liked?: boolean;
  disliked?: boolean;
}

export interface WorkerConversation {
  id: string;
  mode: 'document' | 'task'; // 'document' = 문서 도우미, 'task' = 업무 도우미
  title: string;
  lastMessage: string;
  updatedAt: string;
  month?: string; // '2026-09' | '2026-08'
  model?: string;
  messages: WorkerChatMessage[];
  selectedDocCount?: number;
}

// 12. 데모용 샘플 데이터 (요구사항 명시 파일 5건)
export const INITIAL_WORKER_DOCUMENTS: WorkerDocument[] = [
  {
    id: 'doc-w1',
    name: 'KPC_AI플랫폼_RFP.pdf',
    size: '14.2 MB',
    pages: 45,
    format: 'PDF',
    uploadedAt: '2026.09.07 14:20',
    uploader: '정소담 (AI사업본부)',
    category: '제안요청서',
    status: '인덱싱 완료',
    extractedChunks: 132,
    summary: 'KPC 사내 업무 효율화 및 온프레미스 AI 서비스 구축 과업요청서 (RAG, 망분리 보안 규격)',
    selected: true
  },
  {
    id: 'doc-w2',
    name: '2026_KPC_사업계획서.pdf',
    size: '8.5 MB',
    pages: 32,
    format: 'PDF',
    uploadedAt: '2026.09.06 10:15',
    uploader: '김민수 (경영기획처)',
    category: '경영계획',
    status: '인덱싱 완료',
    extractedChunks: 94,
    summary: '2026년도 KPC 3대 중점 추진전략, 본부별 사업 목표 및 디지털 전환·AI 인재 양성 예산 계획',
    selected: true
  },
  {
    id: 'doc-w3',
    name: '교육사업_운영현황.xlsx',
    size: '2.4 MB',
    pages: 12,
    format: 'XLSX',
    uploadedAt: '2026.09.05 16:45',
    uploader: '박성훈 (교육사업본부)',
    category: '사업현황',
    status: '인덱싱 완료',
    extractedChunks: 42,
    summary: '2025~2026년 공개교육 및 맞춤형 연수 실적, 분기별 수강 인원 및 AI 관련 강좌 운영 통계',
    selected: true
  },
  {
    id: 'doc-w4',
    name: '자격사업_현황보고서.docx',
    size: '5.1 MB',
    pages: 24,
    format: 'DOCX',
    uploadedAt: '2026.09.04 11:30',
    uploader: '이서연 (자격인증실)',
    category: '인증보고서',
    status: '인덱싱 완료',
    extractedChunks: 58,
    summary: '국가공인 정보기술자격(ITQ), 디지털 비즈니스 자격 응시 추이 및 차세대 CBT 시험 도입 현황',
    selected: false
  },
  {
    id: 'doc-w5',
    name: 'KPC_AI플랫폼_제안서.pptx',
    size: '18.3 MB',
    pages: 56,
    format: 'PPTX',
    uploadedAt: '2026.09.03 09:10',
    uploader: '정소담 (AI사업본부)',
    category: '제안서식',
    status: '인덱싱 완료',
    extractedChunks: 88,
    summary: '공공·민간 고객사 대상 KPC 수주 지능화 및 생성형 AI 전환 컨설팅 종합 제안서 프레임워크',
    selected: false
  }
];

export const INITIAL_CONVERSATIONS: WorkerConversation[] = [
  // 2026-09 대화 목록
  {
    id: 'conv-task-1',
    mode: 'task',
    title: 'KPC AI 플랫폼 검토',
    lastMessage: 'KPC AI 플랫폼의 핵심 요구사항을 정리해줘',
    updatedAt: '오전 10:24',
    month: '2026-09',
    model: 'GPT-5.5',
    messages: [
      {
        id: 'msg-t1-1',
        sender: 'user',
        content: 'KPC AI 플랫폼의 핵심 요구사항을 정리해줘',
        timestamp: '오전 10:24',
        model: 'GPT-5.5'
      },
      {
        id: 'msg-t1-2',
        sender: 'assistant',
        content: `KPC Enterprise AI 플랫폼 구축을 위한 핵심 요구사항을 3대 영역으로 정리해 드립니다.\n\n### 1. 전사 보안 및 데이터 주권 (Data Sovereignty)\n• **온프레미스/폐쇄망 지원**: 외부 인터넷망과 차단된 사내 환경에 생성형 AI 엔진 및 RAG 벡터 DB 구축\n• **실시간 PII DLP 필터**: 프롬프트 및 첨부파일 내 주민등록번호, 계좌, 내부 기밀 마스킹\n• **권한 기반 접근 제어**: 임직원 직급·부서별 데이터 조회 인가 체계 연동\n\n### 2. 고성능 멀티 LLM 및 사내 맞춤형 엔진\n• 업무 목적에 따른 모델 선택권 부여 (GPT-5.5, Claude 3.7 Sonnet, Gemini 2.5 Pro, HyperCLOVA X)\n• KPC 사내 표준 양식, 교육 및 컨설팅 사업 지식 기반의 파인튜닝/프롬프트 최적화\n\n### 3. 실무자 중심 통합 워크스페이스 (AI Worker)\n• **업무 도우미**: 즉시 질의응답, 보고서 초안 작성, 첨부파일 실시간 분석\n• **문서 도우미**: 사내 규정 및 사업 문서 한정 RAG 검색 및 100% 팩트 기반 출처 제공\n\n추가적으로 세부 과업 일정이나 WBS 구성이 필요하시면 말씀해 주세요!`,
        timestamp: '오전 10:24',
        model: 'GPT-5.5'
      }
    ]
  },
  {
    id: 'conv-task-2',
    mode: 'task',
    title: '회의자료 요약',
    lastMessage: '이번 주 회의자료의 핵심 내용을 요약해줘.',
    updatedAt: '어제 15:40',
    month: '2026-09',
    model: 'Claude 3.7 Sonnet',
    messages: [
      {
        id: 'msg-t2-1',
        sender: 'user',
        content: '이번 주 회의자료의 핵심 내용을 요약해줘.',
        timestamp: '어제 15:40',
        attachedFiles: ['2026_주간_사업본부_회의록.docx'],
        model: 'Claude 3.7 Sonnet'
      },
      {
        id: 'msg-t2-2',
        sender: 'assistant',
        content: `첨부된 자료 **[2026_주간_사업본부_회의록.docx]**를 기준으로 핵심 내용을 정리했습니다.\n\n### 1. 사업별 주요 진행 현황\n• **AI사업본부**: 공공부문 디지털 전환 제안서 제출 완료 (결과 발표 대기 중)\n• **교육사업본부**: 3분기 기업 맞춤형 AI 역량 강화 연수 과정 수강생 1,200명 돌파\n• **자격인증실**: 차세대 CBT 시험 플랫폼 클라우드 전환 1단계 검수 통과\n\n### 2. 이번 주 전사 협조 및 결정 사항\n• 사내 AI Worker 시범 운영 기간 임직원 피드백 수렴 (~09.15까지)\n• 4분기 전사 예산 조기 집행 가이드라인 배포 예정\n\n### 3. 다음 주 액션 아이템\n1. AI 제안서 기술 평가 대비 발표 자료 최종 리허설\n2. 사내 망분리 LLM 게이트웨이 보안 취약점 사전 점검`,
        timestamp: '어제 15:41',
        model: 'Claude 3.7 Sonnet'
      }
    ]
  },
  {
    id: 'conv-task-3',
    mode: 'task',
    title: '교육사업 분석',
    lastMessage: '2026년도 상반기 교육사업 통계 분석 및 하반기 전략 제안',
    updatedAt: '09.04 11:20',
    month: '2026-09',
    model: 'Gemini 2.5 Pro',
    messages: [
      {
        id: 'msg-t3-1',
        sender: 'user',
        content: '2026년도 상반기 교육사업 통계 분석 및 하반기 전략 제안을 작성해줘.',
        timestamp: '09.04 11:20',
        model: 'Gemini 2.5 Pro'
      },
      {
        id: 'msg-t3-2',
        sender: 'assistant',
        content: `2026년도 상반기 KPC 교육사업 실적 분석 및 하반기 대응 전략입니다.\n\n• **상반기 주요 성과**: AI·빅데이터 실무 과정 수강생 전년 동기 대비 42% 증가\n• **개선 과제**: 지방 공공기관 맞춤형 방문 교육 수요 증가에 따른 강사진 확충 필요\n• **하반기 권장 전략**: 생성형 AI 에이전트 실습 기반의 B2B 프리미엄 트랙 신설 추진`,
        timestamp: '09.04 11:21',
        model: 'Gemini 2.5 Pro'
      }
    ]
  },
  // 2026-08 대화 목록
  {
    id: 'conv-task-4',
    mode: 'task',
    title: '다루다',
    lastMessage: 'DARUDA AI 코딩 및 데이터 분석 에이전트 연계 방안 검토',
    updatedAt: '08.28 14:15',
    month: '2026-08',
    model: 'HyperCLOVA X',
    messages: [
      {
        id: 'msg-t4-1',
        sender: 'user',
        content: 'DARUDA AI 코딩 및 데이터 분석 에이전트 연계 방안을 검토해줘.',
        timestamp: '08.28 14:15',
        model: 'HyperCLOVA X'
      },
      {
        id: 'msg-t4-2',
        sender: 'assistant',
        content: `Custom AI 서비스 중 하나인 **다루다(DARUDA)**는 비개발 임직원을 위한 노코드 데이터 분석 및 자동화 어시스턴트입니다.\n\n• Excel 및 CSV 데이터를 업로드하면 즉시 통계 그래프 및 인사이트 도출\n• 파이썬 코드 실행 샌드박스를 격리 환경에서 구동하여 보안성 확보\n• 사내 ERP 및 수주 시스템 데이터셋과의 API 파이프라인 연계 방안 수립 완료`,
        timestamp: '08.28 14:16',
        model: 'HyperCLOVA X'
      }
    ]
  },
  {
    id: 'conv-task-5',
    mode: 'task',
    title: 'AI 사업 검토',
    lastMessage: '생성형 AI 컨설팅 사업 모델 및 시장 타당성 검토',
    updatedAt: '08.14 09:30',
    month: '2026-08',
    model: 'GPT-5.5',
    messages: [
      {
        id: 'msg-t5-1',
        sender: 'user',
        content: '생성형 AI 컨설팅 사업 모델 및 시장 타당성을 검토해줘.',
        timestamp: '08.14 09:30',
        model: 'GPT-5.5'
      },
      {
        id: 'msg-t5-2',
        sender: 'assistant',
        content: `국내 공공 및 제조·금융 분야의 생성형 AI 도입 컨설팅 시장 검토 결과입니다.\n\n1. **시장 기회**: 보안 및 내부 데이터 유출 우려로 인한 프라이빗 sLLM 컨설팅 수요 급증\n2. **KPC 차별화 요인**: 60년 이상의 생산성 향상 방법론 및 경영 진단 노하우 결합\n3. **목표 고객군**: 지자체, 공공기관, 중견 제조기업 중심 타겟팅 추천`,
        timestamp: '08.14 09:31',
        model: 'GPT-5.5'
      }
    ]
  },
  // 문서 도우미 기존 대화
  {
    id: 'conv-doc-1',
    mode: 'document',
    title: 'KPC AI 플랫폼 구축 요구사항 (RAG 문서검색)',
    lastMessage: 'KPC AI 플랫폼의 주요 구축 요구사항을 정리해줘',
    updatedAt: '09.07 10:24',
    month: '2026-09',
    selectedDocCount: 3,
    messages: [
      {
        id: 'msg-d1-1',
        sender: 'user',
        content: 'KPC AI 플랫폼의 주요 구축 요구사항을 정리해줘',
        timestamp: '09.07 10:24'
      },
      {
        id: 'msg-d1-2',
        sender: 'assistant',
        content: `선택하신 검색 대상 문서 **[KPC_AI플랫폼_RFP.pdf]** 및 **[2026_KPC_사업계획서.pdf]**를 바탕으로 분석한 **KPC AI 플랫폼 주요 구축 요구사항**입니다.\n\n### 1. 보안 및 온프레미스 망분리 아키텍처\n• **사내 폐쇄망 탑재**: 생성형 AI 모델(sLLM)과 벡터 데이터베이스는 외부 인터넷망과 물리적으로 분리된 내부 인프라에 단독 구축됩니다. *(KPC_AI플랫폼_RFP.pdf, p.14 §3.2)*\n• **실시간 개인정보(PII) 비식별화**: 프롬프트 및 문서 검색 시 주민등록번호, 연락처, 내부 기밀을 실시간 탐지·마스킹 처리하는 DLP 필터를 전단에 배치합니다. *(KPC_AI플랫폼_RFP.pdf, p.27 §4.1)*\n\n### 2. 정확도 100% 한정 검색(RAG) 엔진\n• **환각(Hallucination) 방지**: 외부 웹 지식의 임의 생성을 배제하고 사용자가 지정·체크한 사내 문서만 100% 기반으로 답변합니다.\n• **출처 투명성 보장**: 생성된 모든 답변 문장에 원본 문서명, 해당 페이지, 문단 인용구를 자동으로 매핑하여 표시합니다. *(KPC_AI플랫폼_RFP.pdf, p.18 §3.5)*`,
        timestamp: '09.07 10:24',
        isStrictGrounding: true,
        referencedDocs: [
          {
            name: 'KPC_AI플랫폼_RFP.pdf',
            page: 14,
            section: '§3.2 AI 모델 연동 및 폐쇄망 구축 요건',
            quote: '생성형 AI 모델 및 RAG 벡터 DB는 사내 온프레미스 망분리 환경에 독립 설치되어야 하며, 외부 인터넷망으로의 프롬프트 및 문서 데이터 유출을 물리적으로 원천 차단해야 한다.'
          }
        ]
      }
    ]
  }
];

export const SAMPLE_WORKER_SEARCH_SNIPPETS: WorkerSearchSnippet[] = [
  {
    id: 'snip-1',
    documentId: 'doc-w1',
    documentName: 'KPC_AI플랫폼_RFP.pdf',
    page: 14,
    section: '제3장 과업 상세 규격 - 3.2 AI 모델 연동 요건',
    content: '생성형 AI 모델은 사내 온프레미스 폐쇄망(망분리 환경)에 설치되어야 하며, 외부 공용 인터넷망으로의 프롬프트 및 문서 데이터 유출이 물리적으로 차단되어야 한다. RAG 검색 시 임베딩 벡터 데이터베이스는 AES-256 암호화 통신을 필수 적용한다.',
    matchScore: 98
  },
  {
    id: 'snip-2',
    documentId: 'doc-w1',
    documentName: 'KPC_AI플랫폼_RFP.pdf',
    page: 27,
    section: '제4장 보안 관리 - 4.1 DLP 및 개인정보 필터링',
    content: '사용자가 입력한 질의문 및 업로드된 문서에서 주민등록번호, 계좌번호, 여권번호, 휴대폰번호 등 개인식별정보(PII)를 실시간 자동 마스킹(비식별화) 처리하는 보안 게이트웨이를 플랫폼 전단에 반드시 배치해야 한다.',
    matchScore: 96
  },
  {
    id: 'snip-3',
    documentId: 'doc-w2',
    documentName: '2026_KPC_사업계획서.pdf',
    page: 8,
    section: '제1장 전사 목표 - 1.3 디지털 전환 전략',
    content: '임직원 누구나 손쉽게 활용할 수 있는 문서 도우미·업무 도우미 중심의 실무형 AI 인터페이스를 선제적으로 도입하여 전사 노동생산성을 30% 이상 향상시킨다.',
    matchScore: 94
  }
];
