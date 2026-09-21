export interface CustomAiApp {
  id: string;
  name: string;
  shortDesc: string;
  description: string;
  category: '문서/분석' | '번역' | '회의/요약' | 'RFP/제안' | '연구지원';
  iconType: 'ocr' | 'translate' | 'meeting' | 'rfp' | 'research' | 'regulation';
  badge?: string;
  version: string;
  department: string;
  serviceUrl?: string;
  rating: number;
  usageCount: number;
  likes?: number;
  commentsCount?: number;
  userLiked?: boolean;
  isSaved?: boolean;
  status?: '운영중' | '일시중단';
  isHidden?: boolean;
  mediaType?: 'video' | 'image';
  createdAt: string;
  features: string[];
  sampleInput: string;
  sampleOutput: string;
}

export const CUSTOM_AI_APPS: CustomAiApp[] = [
  {
    id: 'app-daom',
    name: 'DAOM',
    shortDesc: 'AI OCR',
    description: '문서 업로드 후 텍스트를 고정밀 광학 인식하고 추출하는 AI OCR 시스템',
    category: '문서/분석',
    iconType: 'ocr',
    badge: '인기',
    version: 'v2.4',
    department: 'AI혁신본부 / 데이터분석팀',
    serviceUrl: 'https://custom-ai.kpc.or.kr/daom',
    rating: 4.9,
    usageCount: 3820,
    likes: 142,
    commentsCount: 18,
    userLiked: false,
    isSaved: true,
    mediaType: 'image',
    createdAt: '2026.09.10',
    features: [
      '스캔 PDF, 이미지(JPG, PNG), 비정형 양식 100% 텍스트 디지털화',
      '표(Table) 구조 보존 및 엑셀(XLSX) 자동 변환',
      '주민등록번호, 계좌번호 등 개인정보(PII) 자동 블러/마스킹 처리',
      '인식 정확도 99.4% KPC 독자 경량 OCR 엔진 탑재'
    ],
    sampleInput: '2026_KPC_공공제안_과업요청서_스캔본.pdf (32페이지 이미지 문서)',
    sampleOutput: '총 32페이지 중 12,450자 텍스트 추출 완료. 표 14개 구조 복원 및 개인정보 8건 자동 마스킹 완료.'
  },
  {
    id: 'app-daruda',
    name: 'DARUDA',
    shortDesc: '문서 번역 앱',
    description: '왼쪽에 원문, 오른쪽에 번역 결과를 실시간 표시하는 고품질 문서 번역 UI',
    category: '번역',
    iconType: 'translate',
    badge: '추천',
    version: 'v3.1',
    department: '글로벌협력처 / AI솔루션실',
    serviceUrl: 'https://custom-ai.kpc.or.kr/daruda',
    rating: 4.8,
    usageCount: 4210,
    likes: 128,
    commentsCount: 24,
    userLiked: true,
    mediaType: 'image',
    createdAt: '2026.09.09',
    features: [
      '원문 레이아웃 및 폰트 서식을 그대로 유지하는 스마트 문서 번역',
      'KPC 표준 경영·컨설팅·IT 전문 용어 사전(Glossary) 자동 적용',
      '한/영, 한/일, 한/중 및 희귀어종 포함 42개국 언어 지원',
      'PDF, DOCX, PPTX 대용량 파일 원클릭 일괄 번역'
    ],
    sampleInput: 'Global_Productivity_Report_2026_Executive_Summary.docx (영문 보고서)',
    sampleOutput: '원문 서식 유지 100% 한글화 완료. KPC 표준 경영용어 34건 일치 번역 적용.'
  },
  {
    id: 'app-dadam',
    name: 'DADAM',
    shortDesc: '회의록 등록, 번역, 요약 시스템',
    category: '회의/요약',
    iconType: 'meeting',
    badge: '사내 표준',
    version: 'v2.0',
    department: '경영지원처 / 총무팀',
    serviceUrl: 'https://custom-ai.kpc.or.kr/dadam',
    rating: 4.9,
    usageCount: 5640,
    likes: 215,
    commentsCount: 32,
    userLiked: false,
    mediaType: 'video',
    createdAt: '2026.09.08',
    description: '회의 목록과 회의 요약 결과, Action Item이 일목요연하게 표시되는 시스템',
    features: [
      '회의 녹음 음성 파일(MP3, M4A, WAV) 실시간 화자 분리(STT)',
      '핵심 3대 아젠다, 찬반 토론 내역, 의결사항 자동 구조화',
      '후속 액션 아이템(담당자, 마감기한) 자동 추출 및 캘린더 연동',
      '글로벌 화상회의 음성 실시간 다국어 번역 자막 지원'
    ],
    sampleInput: '20260908_AI사업본부_주간기획회의_녹음.m4a (52분)',
    sampleOutput: '참석자 6명 발화 분리 완료. [주요 결정 3건, 차주 실행 과제 5건, 담당자별 마감일 지정] 요약본 생성 완료.'
  },
  {
    id: 'app-rfp-review',
    name: '제안요청서 검토 자동화',
    shortDesc: 'RFP 요구사항 및 평가 항목 자동 분석',
    description: 'RFP 요구사항, 평가 기준, 감점 및 독소 리스크 등을 종합 진단하는 분석 화면',
    category: 'RFP/제안',
    iconType: 'rfp',
    badge: '수주 특화',
    version: 'v1.8',
    department: '공공컨설팅본부 / 제안기획팀',
    serviceUrl: 'https://custom-ai.kpc.or.kr/rfp-review',
    rating: 4.9,
    usageCount: 2950,
    likes: 96,
    commentsCount: 15,
    userLiked: false,
    mediaType: 'image',
    createdAt: '2026.09.07',
    features: [
      '나라장터 공고문 즉시 파싱 및 입찰 필수 참여 자격 자동 대조',
      '기술 평가 배점 기준표 분석 및 KPC 보유 실적 자동 매칭',
      '과업 수행 시 감점 유발 조항 및 독소 조항(Penalty) 사전 탐지',
      'PWin(수주 확률) 예측 모델 기반 제안 전략 가이드라인 도출'
    ],
    sampleInput: '행정안전부_스마트업무플랫폼구축_제안요청서.pdf',
    sampleOutput: '필수 요건 28건 중 26건 충족(적합도 93%). 보안 폐쇄망 단독 구축 조항 주의 필요. 수주 승률 지수 88점 산출.'
  },
  {
    id: 'app-research-curator',
    name: '연구 큐레이터',
    shortDesc: '연구자료 검색 및 요약 지원',
    description: '연구자료 검색 결과와 정책·학술 보고서 핵심 AI 요약 결과가 표시되는 화면',
    category: '연구지원',
    iconType: 'research',
    badge: '학술 연계',
    version: 'v1.5',
    department: '연구개발처 / 정책연구실',
    serviceUrl: 'https://custom-ai.kpc.or.kr/research-curator',
    rating: 4.7,
    usageCount: 1840,
    likes: 68,
    commentsCount: 9,
    userLiked: false,
    mediaType: 'video',
    createdAt: '2026.09.06',
    features: [
      'KCI, DBpia, RISS 등 국내 학술 논문 및 글로벌 연구 보고서 통합 검색',
      '방대한 학술 논문의 핵심 가설, 연구 방법론, 결론 3단계 자동 브리핑',
      '연구 주제별 키워드 연관도 지식 그래프(Knowledge Graph) 시각화',
      '연구계획서 및 정책 건의서 작성 시 인용 출처 자동 각주 생성'
    ],
    sampleInput: '국내 공공부문 생성형 AI 도입에 따른 노동생산성 변화 실증 연구',
    sampleOutput: '관련 논문 14편 분석 완료. 핵심 실증 지표(시간당 산출 28% 증가) 및 정책 제언 3개 항 추출.'
  },
  {
    id: 'app-regulation-compass',
    name: '규정·지침 스마트 나침반',
    shortDesc: '사내 규정 및 법률 지침 질의응답',
    description: 'KPC 사내 인사·취업·여비 사규 및 감사 가이드라인 실시간 조회 및 유권해석 화면',
    category: '문서/분석',
    iconType: 'regulation',
    badge: '사규 전용',
    version: 'v2.1',
    department: '감사실 / 법무준법팀',
    serviceUrl: 'https://custom-ai.kpc.or.kr/regulation-compass',
    rating: 4.8,
    usageCount: 3120,
    likes: 114,
    commentsCount: 14,
    userLiked: false,
    mediaType: 'image',
    createdAt: '2026.09.05',
    features: [
      'KPC 취업규칙, 여비규정, 연구용역 표준계약서 100% 팩트 검색',
      '상황별 유권해석 및 과거 노무·감사 지적 사례 대조 제공',
      '개정 연혁 및 조항별 최신 효력 유효성 즉시 검증',
      '임직원 익명 질의 시 개인정보 보호 및 엄격한 보안 세션 유지'
    ],
    sampleInput: '출장비 지급 기준 및 외부 강의 사전 신고 절차 기준',
    sampleOutput: '여비규정 제14조(출장여비 지급) 및 행동강령 제22조(외부강의등의 사례금 수수 제한) 근거 조항 발췌 완료.'
  }
];

export const CUSTOM_AI_CATEGORIES = [
  '전체',
  '문서/분석',
  '번역',
  '회의/요약',
  'RFP/제안',
  '연구지원'
] as const;
