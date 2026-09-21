import {
  RfpItem,
  DocumentItem,
  AiAnalysisSection,
  RequirementItem,
  ProposalOutlineItem,
  StoryboardSection,
  EditorVersion,
  SummaryOption,
  CaseStudyOption,
  CitationItem,
  CommentItem,
  ReviewScore,
  ReviewSuggestion,
  SourceSettings,
  RequirementsMatrixItem,
  ProposalLibraryItem,
  MyTaskItem,
  ReportItem,
  ChatMessage,
  PWinEvaluation,
  ProjectType,
  RfpAnalysisStatus
} from '../types';

export const INITIAL_RFPS: RfpItem[] = [
  {
    id: 'rfp-001',
    title: '공공기관 생성형 AI 업무혁신 플랫폼 구축',
    agency: '한국산업진흥원',
    budget: 1200000000,
    budgetFormatted: '₩1,200,000,000',
    deadline: '2026.10.15',
    announcementDate: '2026.08.20',
    contractType: 'AI 시스템 구축',
    country: '대한민국',
    currency: 'KRW',
    language: '한국어',
    status: '모집 중',
    department: 'AI산업본부',
    stage: '검토 대기',
    pwin: 76,
    assignee: '정소담',
    participants: ['정소담', '김민수', '이서연'],
    purpose: '공공 행정 업무 자동화 및 사내 지식 기반 RAG 생성형 AI 플랫폼 구축을 통한 업무 생산성 40% 향상',
    tasks: [
      '보안 등급별 멀티 LLM 연계 및 하이브리드 인프라 아키텍처 설계',
      '기관 내부 규정, 보고서 등 비정형 데이터 정밀 임베딩 RAG 구축',
      '공공 행정 서식 자동 작성 및 지능형 문서 요약 서비스 구현',
      '행정망 분리 환경 준수 및 망연계 보안 게이트웨이 연동'
    ],
    requirementsSummary: '공공기관 행정망 분리 요건 완벽 준수, RAG 검색 정확도 92% 이상 보장, CSAP 인증 보안 가이드라인 준수 필수.',
    evalSummary: '기술평가 90% (수행능력 30%, 기술 및 기능 40%, 프로젝트 관리 20%) + 가격평가 10%',
    source: '조달청 나라장터 입찰공고 제202608-44912호',
    lastModified: '2026.09.05'
  },
  {
    id: 'rfp-002',
    title: '공공기관 AI 기반 교육서비스 혁신 컨설팅',
    agency: '한국교육진흥원',
    budget: 450000000,
    budgetFormatted: '₩450,000,000',
    deadline: '2026.09.30',
    announcementDate: '2026.08.15',
    contractType: '컨설팅',
    country: '대한민국',
    currency: 'KRW',
    language: '한국어',
    status: '마감 임박',
    department: '교육사업본부',
    stage: '검토 중',
    pwin: 82,
    assignee: '김민수',
    participants: ['김민수', '박지훈'],
    purpose: '맞춤형 AI 학습 경로 추천 모델 수립 및 교직원 AI 리터러시 진단 체계 마련',
    tasks: ['학습자 역량 진단 체계 고도화', '생성형 AI 튜터 도입 타당성 검토', '개인정보 비식별화 및 윤리 기준 수립'],
    requirementsSummary: 'K-에듀테크 표준 프레임워크 부합, 교육 도메인 데이터셋 100만 건 정제 방안 제시.',
    evalSummary: '기술평가 80% + 가격평가 20%',
    source: '조달청 나라장터 입찰공고 제202608-31201호',
    lastModified: '2026.09.02'
  },
  {
    id: 'rfp-003',
    title: '제조업 특화 산업 데이터 연계 AI 자율공정 PoC 구축',
    agency: '한국스마트제조혁신추진단',
    budget: 850000000,
    budgetFormatted: '₩850,000,000',
    deadline: '2026.11.20',
    announcementDate: '2026.08.28',
    contractType: '시스템 구축',
    country: '대한민국',
    currency: 'KRW',
    language: '한국어',
    status: '모집 중',
    department: '생산성본부',
    stage: '진행',
    pwin: 68,
    assignee: '이서연',
    participants: ['이서연', '정소담'],
    purpose: '중소·중견 제조 현장 스마트 팩토리 설비 예지보전 및 이상탐지 AI 모델 현장 적용',
    tasks: ['SCADA/MES 센서 시계열 데이터 파이프라인 구축', '도메인 특화 딥러닝 예지보전 알고리즘 개발'],
    requirementsSummary: '99.5% 이상 장비 가동률 확보, 이상 징후 조기 감지 30분 전 알림 필수.',
    evalSummary: '기술평가 85% + 가격평가 15%',
    source: '나라장터 202608-59200호',
    lastModified: '2026.09.04'
  },
  {
    id: 'rfp-004',
    title: '공공 DX 및 생성형 AI 도입 전략 ISP 수립 컨설팅',
    agency: '정보통신산업진흥원',
    budget: 320000000,
    budgetFormatted: '₩320,000,000',
    deadline: '2026.10.05',
    announcementDate: '2026.08.18',
    contractType: '컨설팅',
    country: '대한민국',
    currency: 'KRW',
    language: '한국어',
    status: '모집 중',
    department: '컨설팅본부',
    stage: '검토 대기',
    pwin: 74,
    assignee: '최유진',
    participants: ['최유진', '박지훈'],
    purpose: '차세대 지능형 정보화 전략계획(ISP) 수립 및 산하 12개 공공기관 AI 거버넌스 가이드라인 제정',
    tasks: ['현행 정보화 수준 및 데이터 성숙도 진단', 'To-Be AI 플랫폼 마스터플랜 및 소요예산 산정'],
    requirementsSummary: '전자정부법 제67조 감리 기준 부합, 클라우드 네이티브 전환 전략 포함.',
    evalSummary: '기술평가 90% + 가격평가 10%',
    source: '나라장터 202608-20419호',
    lastModified: '2026.09.01'
  },
  {
    id: 'rfp-005',
    title: '국가 공공 서비스 지능형 고객경험(CX) 고도화 진단',
    agency: '공공행정혁신원',
    budget: 280000000,
    budgetFormatted: '₩280,000,000',
    deadline: '2026.10.25',
    announcementDate: '2026.08.30',
    contractType: '컨설팅',
    country: '대한민국',
    currency: 'KRW',
    language: '한국어',
    status: '모집 중',
    department: 'CX본부',
    stage: '검토 중',
    pwin: 88,
    assignee: '박지훈',
    participants: ['박지훈', '김민수'],
    purpose: '대국민 포털 및 민원 서비스 이용자 여정(Journey Map) 분석 및 AI 기반 감성·불만 요인 선제 추출',
    tasks: ['민원 보이스 데이터(VOC) 20만 건 감성 분석', '옴니채널 고객 경험 지수 체계 수립'],
    requirementsSummary: 'KPC 보유 국가고객만족도(NCSI) 모델 연계 가중치 산출 권장.',
    evalSummary: '기술평가 80% + 가격평가 20%',
    source: '나라장터 202608-81920호',
    lastModified: '2026.09.06'
  },
  {
    id: 'rfp-006',
    title: '지능형 디지털 인재양성 AI 교육 통합 플랫폼 구축',
    agency: '한국지역정보개발원',
    budget: 620000000,
    budgetFormatted: '₩620,000,000',
    deadline: '2026.11.10',
    announcementDate: '2026.08.25',
    contractType: '시스템 구축',
    country: '대한민국',
    currency: 'KRW',
    language: '한국어',
    status: '모집 중',
    department: '교육사업본부',
    stage: '진행',
    pwin: 64,
    assignee: '김민수',
    participants: ['김민수', '이서연'],
    purpose: '전국 지자체 공무원 대상 AI/데이터 실습형 이러닝 및 온오프라인 블렌디드 러닝 포털 구축',
    tasks: ['LMS 고도화 및 LLM 기반 대화형 코칭 에이전트 연동', '동시 접속 5,000명 트래픽 안정성 확보'],
    requirementsSummary: '국가정보원 보안적합성 검증 필증 획득, 장애 복구 RTO 1시간 이내.',
    evalSummary: '기술평가 85% + 가격평가 15%',
    source: '나라장터 202608-72109호',
    lastModified: '2026.09.03'
  },
  {
    id: 'rfp-007',
    title: '기업 생산성 향상 지수(K-PI) 측정 및 진단 시스템 고도화',
    agency: '중소벤처기업진흥공단',
    budget: 180000000,
    budgetFormatted: '₩180,000,000',
    deadline: '2026.12.01',
    announcementDate: '2026.09.01',
    contractType: '연구',
    country: '대한민국',
    currency: 'KRW',
    language: '한국어',
    status: '예정',
    department: '생산성본부',
    stage: '검토 대기',
    pwin: 91,
    assignee: '이서연',
    participants: ['이서연', '최유진'],
    purpose: '국내 중소기업 총요소생산성(TFP) 정량 지표 통계 모델 개편 및 온라인 자가진단 툴 개발',
    tasks: ['업종별 생산성 벤치마크 데이터베이스 갱신', 'KPC 생산성 방법론 기반 온라인 진단 알고리즘 구현'],
    requirementsSummary: '통계청 국가통계작성기관 지정 규정 충족.',
    evalSummary: '기술평가 90% + 가격평가 10%',
    source: '나라장터 202609-10023호',
    lastModified: '2026.09.05'
  },
  {
    id: 'rfp-008',
    title: '글로벌 공급망 ESG 데이터 분석 및 AI 리포팅 엔진 개발',
    agency: '한국무역협회',
    budget: 540000000,
    budgetFormatted: '₩540,000,000',
    deadline: '2026.10.18',
    announcementDate: '2026.08.22',
    contractType: '시스템 구축',
    country: '대한민국',
    currency: 'KRW',
    language: '한국어',
    status: '모집 중',
    department: 'AI산업본부',
    stage: '진행 안 함',
    pwin: 45,
    assignee: '정소담',
    participants: ['정소담'],
    purpose: 'EU 탄소국경조정제도(CBAM) 대응 수출 중소기업 스코프 1, 2, 3 탄소배출량 자동 산출 및 영문 공시서 생성',
    tasks: ['글로벌 ESG 공시 프레임워크(GRI, ISSB) 매핑', '다국어 자동 생성 리포팅 템플릿 엔진 개발'],
    requirementsSummary: '글로벌 표준 온실가스 프로토콜 공인 데이터 적합성 인증.',
    evalSummary: '기술평가 80% + 가격평가 20%',
    source: '나라장터 202608-49033호',
    lastModified: '2026.08.29'
  },
  {
    id: 'rfp-009',
    title: '초거대 AI 기반 맞춤형 지능 행정업무 에이전트 구축',
    agency: '행정안전부',
    budget: 980000000,
    budgetFormatted: '₩980,000,000',
    deadline: '2026.10.30',
    announcementDate: '2026.08.26',
    contractType: 'AI 시스템 구축',
    country: '대한민국',
    currency: 'KRW',
    language: '한국어',
    status: '모집 중',
    department: 'AI산업본부',
    stage: '진행',
    pwin: 84,
    assignee: '정소담',
    participants: ['정소담', '이서연'],
    purpose: '대민 민원 답변 및 내부 공문서 초안 작성 자동화를 지원하는 자율형 AI 행정 비서 에이전트 구현',
    tasks: ['보안 온프레미스 LLM 서빙 환경 구성', '행정업무 특화 프롬프트 템플릿 및 자동 검증 파이프라인'],
    requirementsSummary: '행정안전부 모바일 신분증 연계 및 전자인장 암호화 인증 준수.',
    evalSummary: '기술평가 90% + 가격평가 10%',
    source: '나라장터 202608-99410호',
    lastModified: '2026.09.05'
  },
  {
    id: 'rfp-010',
    title: '공공 DX 혁신을 위한 AI 거버넌스 및 전략 수립 컨설팅',
    agency: '한국지능정보사회진흥원',
    budget: 410000000,
    budgetFormatted: '₩410,000,000',
    deadline: '2026.11.05',
    announcementDate: '2026.08.27',
    contractType: '컨설팅',
    country: '대한민국',
    currency: 'KRW',
    language: '한국어',
    status: '모집 중',
    department: '컨설팅본부',
    stage: '검토 중',
    pwin: 79,
    assignee: '최유진',
    participants: ['최유진', '정소담'],
    purpose: '공공부문 AI 윤리, 위험 평가, 데이터 품질관리 체계 및 전사 도입 가이드라인 수립',
    tasks: ['국내외 AI 규제 및 거버넌스 프레임워크 벤치마킹', '기관 맞춤형 AI 리스크 진단 지표 개발'],
    requirementsSummary: 'EU AI Act 및 국내 인공지능기본법안 정합성 확보.',
    evalSummary: '기술평가 85% + 가격평가 15%',
    source: '나라장터 202608-88123호',
    lastModified: '2026.09.04'
  }
];

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-001',
    fileName: 'RFP_생성형AI플랫폼구축.pdf',
    type: 'PDF',
    size: '24.8 MB',
    uploader: '조달청 나라장터',
    updatedAt: '2026.08.20',
    status: '분석 준비 완료',
    isRfp: true,
    previewContent: {
      summary: '한국산업진흥원 발주 공공기관 생성형 AI 업무혁신 플랫폼 구축 제안요청서(RFP) 본안 문서입니다. 사업규모 12억 원, 계약기간 8개월이며, 내부 온프레미스 망분리 환경 내 고성능 RAG 검색 및 행정서식 자동 작성 시스템 구축을 핵심 과업으로 합니다.',
      keyHighlights: [
        '사업예산: 금 1,200,000,000원 (VAT 포함) / 기간: 계약체결일로부터 8개월',
        '핵심과업 1: 공공기관 망분리(인터넷망/업무망) 연계형 하이브리드 LLM 인프라 설계',
        '핵심과업 2: 사내 비정형 규정·결재문서 1,000만 건 RAG 지식베이스 색인 및 검색 정확도 92% 이상',
        '기술평가 90% (수행역량 30, 기술/기능 40, 프로젝트관리 20) + 가격평가 10%'
      ],
      toc: [
        'Ⅰ. 사업 개요 (추진배경 및 필요성, 사업범위, 기대효과)',
        'Ⅱ. 현황 및 문제점 (정보화 현황, 데이터 인프라 실태, 개선 과제)',
        'Ⅲ. 사업추진 방안 (추진목표, 추진전략, 추진체계 및 역할)',
        'Ⅳ. 제안요청 내용 (목표시스템 개념도, 요구사항 총괄표, 기능/보안 요구사항)',
        'Ⅴ. 제안서 작성요령 및 서식 (작성지침, 목차, 별지서식 1~12호)'
      ],
      sampleText: `[제안요청서 발췌문: 제4장 제안요청 내용 - SFR-001 하이브리드 AI 인프라 구축]
1. 제안사는 국가정보원 '국가 정보보안 기본지침' 및 행정안전부 '클라우드 컴퓨팅 보안 가이드'를 준수하여 기관 내부 업무망과 안전하게 연동되는 독립 온프레미스 sLLM 서빙 클러스터를 구축하여야 한다.
2. 외부 상용 파운데이션 모델(OpenAI, Claude 등) 연계 시에는 기관 내부의 개인정보(주민번호, 전화번호, 계좌 등) 및 비공개 업무정보가 외부로 반출되지 않도록 실시간 마스킹(Data Masking) 게이트웨이를 필수로 경유하도록 구성하여야 한다.
3. RAG(검색 증강 생성) 파이프라인은 최소 1,000만 건 이상의 HWP, PDF, Office 문서를 실시간 색인(Embedding)할 수 있어야 하며 질의 응답 시간은 평균 1.5초 이내여야 한다.`,
      metadata: {
        '공고번호': '조달청 나라장터 제202608-44912호',
        '발주기관': '한국산업진흥원 디지털혁신본부',
        '입찰방식': '제한경쟁입찰 (협상에 의한 계약)',
        '페이지수': '총 148페이지'
      }
    }
  },
  {
    id: 'doc-002',
    fileName: 'RFP_제안요청서_첨부자료.pdf',
    type: 'PDF',
    size: '12.4 MB',
    uploader: '조달청 나라장터',
    updatedAt: '2026.08.20',
    status: '분석 준비 완료',
    isRfp: true,
    previewContent: {
      summary: '제안요청서에 부속된 현행 업무시스템 구성도, 데이터베이스 테이블 목록, 기술 규격 및 별지 입찰 서식집입니다.',
      keyHighlights: [
        '현행 온프레미스 서버(x86 24노드) 및 SAN 스토리지 구성 명세',
        '전자정부 표준프레임워크 3.10 기반 레거시 ERP 및 그룹웨어 연계 규격',
        '공공 보안성 검토 점검표 및 투입인력 경력증명 양식'
      ],
      toc: [
        '별첨 1: 현행 정보시스템 구성도 및 하드웨어/소프트웨어 현황',
        '별첨 2: 연계 대상 12개 레거시 시스템 인터페이스 명세서',
        '별첨 3: 보안성 검토 체크리스트 (총 48개 점검항목)',
        '별첨 4: 기술평가 자격기준 및 투입인력 등급 산정표'
      ],
      sampleText: `[별첨 2 발췌문: 내부 행정포털 연계 인터페이스 규격]
기존 업무포털(전자결재, 그룹웨어) 데이터베이스(Oracle 19c)로부터 최근 5개년 비공개 결재완료 공문서를 배치(Batch)로 추출하여, KPC 제안 RAG 벡터 스토어로 일 1회 증분 동기화하는 CDC(Change Data Capture) 연계 인터페이스를 준수해야 함.`,
      metadata: {
        '문서종류': 'RFP 부속 첨부서류 및 서식집',
        '발주부서': '한국산업진흥원 정보화운영실',
        '분량': '86페이지'
      }
    }
  },
  {
    id: 'doc-003',
    fileName: 'KPC_AI전략_v3.pptx',
    type: 'PPTX',
    size: '18.2 MB',
    uploader: '정소담',
    updatedAt: '2026.09.02',
    status: '업로드 완료',
    previewContent: {
      summary: '한국생산성본부(KPC) 생성형 AI 사업단 공공부문 특화 제안 전략 슬라이드 데크입니다. 차별화된 3대 제안 테마와 경쟁사 대비 비교우위 요소가 수록되어 있습니다.',
      keyHighlights: [
        'Theme 1: 대한민국 최초 공공행정 특화 거버넌스 방법론(PRO-AI™) 적용',
        'Theme 2: 국정원 보안성 검토 100% 무결점 통과 보장 아키텍처',
        'Theme 3: 공공 5대 핵심 업무(보고서, 민원, 법령, 통계, 보도자료) 표준 프롬프트 사전 탑재'
      ],
      toc: [
        '1. 사업 수주 목표 및 포지셔닝',
        '2. 제안사 핵심 경쟁우위 (수행실적, 전문인력, 기술력)',
        '3. 3대 전략적 차별화 포인트',
        '4. 고객 감동 및 파격적 무상 기술지원 제안'
      ],
      sampleText: `[슬라이드 14 발췌문: KPC 3대 차별화 전략]
우리는 단순한 시스템 납품업체가 아닙니다. 지난 60년간 대한민국 정부와 공공기관의 생산성 혁신을 이끌어온 KPC의 전문 지식을 생성형 AI 엔진에 직접 이식하여, 발주기관 공무원들이 첫날부터 업무에 바로 활용할 수 있는 '살아있는 행정 AI'를 납품합니다.`,
      metadata: {
        '작성자': '정소담 수석컨설턴트 (AI사업본부)',
        '슬라이드수': '45장',
        '최종수정': '2026-09-02'
      }
    }
  },
  {
    id: 'doc-004',
    fileName: '유사사업_수행실적.docx',
    type: 'DOCX',
    size: '4.5 MB',
    uploader: '김민수',
    updatedAt: '2026.08.25',
    status: '업로드 완료',
    previewContent: {
      summary: '최근 3년 간 KPC가 단독 또는 주사업자로 수행 완료한 공공부문 AI 및 빅데이터 플랫폼 구축 유사 사업 실적 요약 보고서입니다.',
      keyHighlights: [
        '기획재정부 차세대 예산분석 지능화 플랫폼 구축 (28.5억 원)',
        '행정안전부 디지털 행정지원 LLM 어시스턴트 시범구축 (35억 원)',
        '한국전력공사 전력설비 이상감지 빅데이터 AI 분석 (42억 원)'
      ],
      toc: ['1. 실적 총괄표', '2. 건별 주요 과업 및 성과', '3. 발주처 평가 의견 및 수상 내역'],
      sampleText: `[실적 1호 발췌문: 행정안전부 디지털 행정지원 어시스턴트]
- 사업규모: 35억 원 (KPC 지분율 60%, 주사업자)
- 주요성과: 350개 중앙부처 공무원 대상 내부 지식 검색 서비스 오픈, 문서 검색 시간 일평균 45분 절감, 행안부 디지털혁신 우수사례 선정 표창 수상.`,
      metadata: { '실적건수': '총 8건', '총 계약금액': '210억 원', '담당자': '김민수 선임연구원' }
    }
  },
  {
    id: 'doc-005',
    fileName: '2025_AI플랫폼_유사제안서.docx',
    type: 'DOCX',
    size: '8.9 MB',
    uploader: '이서연',
    updatedAt: '2026.09.01',
    status: '업로드 완료',
    previewContent: {
      summary: '2025년 중앙부처 인공지능 플랫폼 구축 입찰 당시 1위 낙찰된 제안서 텍스트 완본입니다. 제안서 각 장별 상세 문안과 기능 구현 방안을 포함합니다.',
      keyHighlights: [
        '기술평가 1위(98.8점) 획득 제안서 본문 구조',
        '망분리 RAG 기술 아키텍처 및 데이터 흐름도 상세 명세',
        '투입인력 조직도 및 비상대응 장애관리 체계'
      ],
      toc: ['제1장 제안 개요', '제2장 제안사 일반현황', '제3장 기술 및 기능부문', '제4장 사업관리부문', '제5장 지원부문'],
      sampleText: `[제3장 2절 발췌문: 지능형 행정문서 임베딩 방안]
KPC는 표, 차트, 각주 등 복합 레이아웃이 포함된 공공 행정 한글(HWP) 문서를 문맥 손실 없이 파싱하는 전용 파서 엔진을 적용하여 일반 텍스트 변환 대비 표 구조 인식률 99.4%를 달성합니다.`,
      metadata: { '낙찰사업': '2025 중앙부처 AI 지식플랫폼', '페이지수': '320페이지' }
    }
  },
  {
    id: 'doc-006',
    fileName: '공공기관_AI사례.pdf',
    type: 'PDF',
    size: '6.2 MB',
    uploader: '정소담',
    updatedAt: '2026.09.03',
    status: '업로드 완료',
    previewContent: {
      summary: '국내 공공기관 및 해외 공공부문(영국 GDS, 싱가포르 GovTech)의 생성형 AI 실제 도입 성공/실패 사례를 분석한 벤치마킹 레포트입니다.',
      keyHighlights: [
        '국내외 12개 공공기관 생성형 AI 도입 성과 지표 벤치마크',
        '직원 활용도 80% 달성을 위한 체인지 매니지먼트 및 교육 전략',
        '공공 데이터 보안 사고 방지 5대 원칙'
      ],
      toc: ['1. 서론', '2. 국내 공공 AI 선도 사례', '3. 해외 정부 AI 도입 모델', '4. 시사점 및 제안 전략 반영안'],
      sampleText: `[보고서 3장 발췌문: 해외 선도사례 벤치마킹]
영국 정부 디지털청(GDS)의 실증 결과에 따르면, 프롬프트 가이드라인만 배포한 그룹 대비 내부 결재문서 RAG가 직접 연계된 어시스턴트를 사용한 행정관의 초안 작성 완료율이 3.2배 높게 측정되었습니다.`,
      metadata: { '보고서명': '2026 공공 생성형 AI 벤치마킹 분석', '발행': 'KPC 연구원' }
    }
  }
];

export const SAMPLE_PWIN_EVALUATION: PWinEvaluation = {
  competitivePosition: 80,
  pastExperience: 85,
  technicalCapability: 75,
  clientFit: 65,
  overallScore: 76,
  isAiEvaluated: true,
  reasoning: {
    competitivePosition: 'KPC는 공공기관 생산성 및 DX 컨설팅 국내 최다 레퍼런스를 보유하여 대형 SI 경쟁사 대비 공공 업무 프로세스 이해도에서 절대적 우위 점유.',
    pastExperience: '최근 3년 간 중앙부처 및 공공기관 대상 AI/빅데이터 관련 유사 실적 14건(누적 수주액 140억 원)으로 RFP 필수 자격조건 완벽 충족.',
    technicalCapability: '자체 RAG 엔진 및 Multi-LLM 보안 라우팅 기술을 확보하였으나, 대규모 동시접속 온프레미스 인프라 구축 파트너사와의 컨소시엄 조율 필요.',
    clientFit: '한국산업진흥원의 직무 분석 및 조직 개편 프로젝트를 KPC가 기 수행하여 발주처 핵심 의사결정자 및 현장 Pain Point에 대한 사전 교감 우수.'
  },
  sources: [
    'RFP 5장 제안평가 배점표 (기술능력 90점, 입찰가격 10점)',
    'KPC 경영전략본부 사내 실적 데이터베이스 (2023~2025 공공 AI 레퍼런스)',
    '2025 한국산업진흥원 직무분석 컨설팅 완료보고서'
  ],
  confidence: 94
};

export const SAMPLE_AI_ANALYSIS_SECTIONS: AiAnalysisSection[] = [
  {
    id: 1,
    title: '1. 사업 요약',
    content: '본 사업은 한국산업진흥원 본원 및 4개 권역센터의 행정 프로세스 효율화를 위해 보안이 담보된 사내 전용 생성형 AI 업무혁신 플랫폼을 구축하는 프로젝트입니다. 총 사업예산 12억 원(VAT 포함), 사업기간은 계약체결일로부터 8개월이며, 주요 목표는 공공 서식 자동 작성, 사내 지식 RAG 검색, 망분리 규격 준수입니다.',
    rfpPage: 3,
    rfpQuote: '사업명: 공공기관 생성형 AI 업무혁신 플랫폼 구축 / 사업기간: 계약체결일로부터 8개월 / 사업예산: 1,200,000,000원'
  },
  {
    id: 2,
    title: '2. 사업 범위',
    content: '1) 사내 비정형 문서(규정, 매뉴얼, 기안문) 데이터 수집 및 고성능 벡터 임베딩 파이프라인 구축\n2) 보안 등급별 Multi-LLM 라우터 및 사내 온프레미스 경량화 모델(sLLM)과 상용 LLM 하이브리드 연동\n3) 업무 포털 연계 플러그인(문서 요약, 결재안 초안 작성, 법령 질의응답)\n4) 망분리 환경 특화 보안 게이트웨이 및 개인정보 필터링(DLP) 시스템 구축',
    rfpPage: 5,
    rfpQuote: '과업범위: 1. 사내 지식 기반 생성형 AI 플랫폼 아키텍처 수립 2. 업무지원 서비스 5종 개발 3. 망분리 보안체계 구축'
  },
  {
    id: 3,
    title: '3. 주요 일정',
    content: '• 입찰 마감: 2026년 10월 15일 14:00\n• 제안서 평가(PT 발표): 2026년 10월 22일(예정)\n• 우선협상대상자 선정: 2026년 10월 26일\n• 계약 체결 및 착수 보고: 2026년 11월 초순\n• 중간 보고: 착수 후 4개월 차 (2027년 3월)\n• 최종 완료 및 검수: 착수 후 8개월 차 (2027년 7월)',
    rfpPage: 8,
    rfpQuote: '제출기한: 2026.10.15 14:00 나라장터 전자접수 / 제안서 설명회: 제안서 접수 후 개별 통보'
  },
  {
    id: 4,
    title: '4. 계약 정보',
    content: '• 계약 방식: 제한경쟁입찰(협상에 의한 계약)\n• 낙찰자 결정: 기술능력평가 90점 + 입찰가격평가 10점\n• 공동수급(공동이행방식): 허용 (대표사 지분율 50% 이상, 최대 3개사 이내)\n• 중소기업자간 경쟁제품 해당 없음 (일반 용역)',
    rfpPage: 9,
    rfpQuote: '계약방법: 협상에 의한 계약 체결기준(기획재정부계약예규) 적용'
  },
  {
    id: 5,
    title: '5. 지침',
    content: '• 행정안전부 「행정기관 및 공공기관 정보시스템 구축·운영 지침」 철저 준수\n• 국가정보원 「국가·공공기관 클라우드 컴퓨팅 보안 가이드라인」 준수\n• 제안서 분량: 본문 100페이지 이내(별첨 제외), 요약본 30페이지 이내 제출',
    rfpPage: 12,
    rfpQuote: '제안서 분량은 증빙자료를 제외한 본문 기준 100페이지 이내로 작성하여 PDF 파일로 제출하여야 함.'
  },
  {
    id: 6,
    title: '6. 평가 기준',
    content: '• 정량평가(20점): 경영상태(신용평가등급 5점), 유사사업 수행실적(최근 3년 10점), 투입인력 기술등급(5점)\n• 정성평가(70점): 전략 및 방법론(20점), 기술 및 기능 요구사항 부합도(25점), 성능 및 품질(15점), 프로젝트 관리 및 지원(10점)\n• 가격평가(10점): 기획재정부 협상에 의한 계약체결기준 가격평점 산식 적용',
    rfpPage: 15,
    rfpQuote: '기술능력평가 배점한도: 정량적 평가분야 20점, 정성적 평가분야 70점, 가격평가 10점 총 100점 만점'
  },
  {
    id: 7,
    title: '7. 제출 서류 및 법적 요구사항',
    content: '• 제안서 원본 및 발표자료(PDF 형식, 회사 식별 표식 제외된 블라인드 평가본 1부 포함)\n• 소프트웨어사업자 일반 현황 관리확인서\n• 신용평가등급 확인서 및 최근 3년간 결산 재무제표\n• 개인정보보호 서약서, 청렴계약이행서약서, 보안서약서 각 1부',
    rfpPage: 19,
    rfpQuote: '제출서류 목록: 제안서 1부(평가본 1부), 제안요약서 1부, 기타 제안서 관련 증빙서류 일체'
  },
  {
    id: 8,
    title: '8. 누락 정보 및 잠재 리스크',
    content: '• 기관 내부 문서 포맷의 HWP/HWPX 비율이 70% 이상으로 예상되나, 본문 표/도표 정밀 OCR 파싱 규격이 RFP에 명시되지 않음\n• 망분리 연계 시 기존 DLP 솔루션과의 API 호환성 보장 여부 미공개\n• 온프레미스 서버 상면 공간 및 전력 소요량(GPU 클러스터) 수용 한계 사전 점검 필요',
    rfpPage: 23,
    rfpQuote: '기존 행정망 서버실 공간 및 네트워크 스위치 포트 수용 능력은 협상 대상자와 별도 협의함.'
  },
  {
    id: 9,
    title: '9. 예상 질의',
    content: 'Q1. 공공 데이터의 보안 유출 방지를 위한 망분리 환경에서 RAG 갱신 주기는 어떻게 보장할 것인가?\nQ2. 할루시네이션(환각) 방지를 위한 공공 행정 문서 특화 검증 레이어는 무엇인가?\nQ3. 향후 타 부처 표준 AI 허브 및 정부 초거대 AI 플랫폼 연계 확장성을 어떻게 담보하는가?',
    rfpPage: 27,
    rfpQuote: '제안서 설명회 평가위원 질의응답: 질의 15분, 답변 15분 총 30분 진행'
  },
  {
    id: 10,
    title: '10. 차별화 포인트',
    content: '• KPC 고유 공공 생산성 진단 지표와 연계된 실시간 AI 업무 효율 측정 대시보드 무상 탑재\n• 한국어 공공 행정 서식에 최적화된 Multi-LLM 지능형 라우터 및 RAG 하이브리드 캐싱 기술\n• 기관 실무진 500명 대상 즉시 실무 적용 가능한 KPC 맞춤형 AI 리터러시 사후 교육 패키지 결합',
    rfpPage: 31,
    rfpQuote: '제안사는 타 사업자와 차별화되는 고유의 수행 방법론 및 기술적 장점을 명확히 기술할 것.'
  },
  {
    id: 11,
    title: '11. 고객 Pain Point',
    content: '• 매년 반복되는 공공기관 경영평가 및 감사 자료 작성 시 방대한 문서 탐색에 평균 40시간 이상 소요\n• 기존 룰 기반 키워드 검색 엔진의 낮은 정확도로 실무자 만족도 저조\n• 생성형 AI 도입을 원하나 개인정보 유출 및 국가정보원 보안 감사 지적에 대한 막연한 불안감',
    rfpPage: 34,
    rfpQuote: '도입 배경: 내부 규정 및 과거 기안문서에 대한 비효율적 검색으로 인한 중복 작업 최소화'
  },
  {
    id: 12,
    title: '12. 수주 핵심 전략',
    content: '• [신뢰성] KPC의 60년 공공 신뢰도와 최고 수준의 보안 컴플라이언스(CSAP 기준) 선제 충족\n• [완성도] 단순 솔루션 납품이 아닌 공공기관 업무 프로세스 리엔지니어링(BPR) 연계 플랫폼 제시\n• [효과성] 도입 3개월 내 일상 결재문서 작성 시간 50% 단축 보장 실증 시나리오 제시',
    rfpPage: 36,
    rfpQuote: '종합 추진전략: 공공기관 업무 환경에 적합한 실용성과 보안성을 겸비한 전략 제시 필수'
  }
];

export const SAMPLE_REQUIREMENTS: RequirementItem[] = [
  {
    id: 'REQ-001',
    reqId: 'REQ-001',
    name: '제안서는 본문 기준 100페이지 이내로 작성 및 제출하여야 함',
    text: '제안서는 본문 기준 100페이지 이내로 작성 및 제출하여야 함',
    type: '필수',
    category: '필수',
    priority: '높음',
    importance: '상',
    status: '미반영',
    rfpPage: 'RFP 12p',
    sourcePage: 12,
    rfpQuote: '제안서 분량은 본문 기준 100페이지 이내로 작성하여야 하며, 증빙서류는 별첨으로 분리 제출',
    sourceSnippet: '제안서 분량은 본문 기준 100페이지 이내로 작성하여야 하며, 증빙서류는 별첨으로 분리 제출',
    checked: false
  },
  {
    id: 'REQ-002',
    reqId: 'REQ-002',
    name: '최근 3년 간 단일 계약 5억 원 이상 공공기관 유사 AI/데이터 사업 수행실적 3건 이상 제시',
    text: '최근 3년 간 단일 계약 5억 원 이상 공공기관 유사 AI/데이터 사업 수행실적 3건 이상 제시',
    type: '필수',
    category: '필수',
    priority: '높음',
    importance: '상',
    status: '반영',
    rfpPage: 'RFP 24p',
    sourcePage: 24,
    rfpQuote: '공고일 기준 최근 3년 이내 국가, 지자체, 공공기관 대상 AI 또는 빅데이터 플랫폼 단일 5억 이상 실적 3건',
    sourceSnippet: '공고일 기준 최근 3년 이내 국가, 지자체, 공공기관 대상 AI 또는 빅데이터 플랫폼 단일 5억 이상 실적 3건',
    checked: true
  },
  {
    id: 'REQ-003',
    reqId: 'REQ-003',
    name: '국가정보원 국가·공공기관 클라우드 및 AI 시스템 보안대책 지침 준수 방안 제시',
    text: '국가정보원 국가·공공기관 클라우드 및 AI 시스템 보안대책 지침 준수 방안 제시',
    type: '평가',
    category: '평가',
    priority: '높음',
    importance: '상',
    status: '작성 중',
    rfpPage: 'RFP 37p',
    sourcePage: 37,
    rfpQuote: '국가정보원 보안성 검토 기준 및 정보시스템 구축운영 지침에 의거한 체계적인 보안 대책을 기술할 것',
    sourceSnippet: '국가정보원 보안성 검토 기준 및 정보시스템 구축운영 지침에 의거한 체계적인 보안 대책을 기술할 것',
    checked: false
  },
  {
    id: 'REQ-004',
    reqId: 'REQ-004',
    name: '사내 지식 RAG 벡터 검색 질의응답 정확도(Top-3 Hit Rate) 90% 이상 보장',
    text: '사내 지식 RAG 벡터 검색 질의응답 정확도(Top-3 Hit Rate) 90% 이상 보장',
    type: '평가',
    category: '평가',
    priority: '높음',
    importance: '상',
    status: '작성 중',
    rfpPage: 'RFP 18p',
    sourcePage: 18,
    rfpQuote: '비정형 문서 검색 시 적합한 근거 문서 추출 정확도 90% 이상을 객관적으로 입증할 수 있는 방안 제시',
    sourceSnippet: '비정형 문서 검색 시 적합한 근거 문서 추출 정확도 90% 이상을 객관적으로 입증할 수 있는 방안 제시',
    checked: false
  },
  {
    id: 'REQ-005',
    reqId: 'REQ-005',
    name: '제안서 제출 시 회사 식별 표식을 제거한 블라인드 심사용 평가본 1부 별도 제출',
    text: '제안서 제출 시 회사 식별 표식을 제거한 블라인드 심사용 평가본 1부 별도 제출',
    type: '제출',
    category: '제출',
    priority: '보통',
    importance: '중',
    status: '미반영',
    rfpPage: 'RFP 10p',
    sourcePage: 10,
    rfpQuote: '공정한 기술평가를 위하여 제안서 평가본에는 제안사명, 로고 등 특정 기업임을 유추할 수 있는 표식 금지',
    sourceSnippet: '공정한 기술평가를 위하여 제안서 평가본에는 제안사명, 로고 등 특정 기업임을 유추할 수 있는 표식 금지',
    checked: false
  },
  {
    id: 'REQ-006',
    reqId: 'REQ-006',
    name: '착수 후 30일 이내 프로토타입 UI/UX 시연회 개최 및 사용자 피드백 반영',
    text: '착수 후 30일 이내 프로토타입 UI/UX 시연회 개최 및 사용자 피드백 반영',
    type: '계약',
    category: '계약',
    priority: '보통',
    importance: '중',
    status: '미반영',
    rfpPage: 'RFP 28p',
    sourcePage: 28,
    rfpQuote: '사업 착수 30일 이내 핵심 서비스 2종에 대한 프로토타입 시연을 실시하여 현장 요구사항을 조기 확정함',
    sourceSnippet: '사업 착수 30일 이내 핵심 서비스 2종에 대한 프로토타입 시연을 실시하여 현장 요구사항을 조기 확정함',
    checked: false
  }
];

export const INITIAL_PROPOSAL_OUTLINE: ProposalOutlineItem[] = [
  {
    id: 'out-1',
    code: '1',
    title: '1. 제안 개요',
    level: 1,
    status: '완료',
    author: '정소담',
    reviewer: '김민수',
    deadline: '2026.09.15',
    targetPages: 10,
    targetWords: 3500,
    currentWords: 3480,
    isExpanded: true,
    children: [
      {
        id: 'out-1-1',
        code: '1.1',
        title: '1.1 사업 이해 및 배경',
        level: 2,
        status: '완료',
        author: '정소담',
        reviewer: '김민수',
        deadline: '2026.09.12',
        targetPages: 3,
        targetWords: 1200,
        currentWords: 1250,
        sourceReqId: 'REQ-001',
        sourceText: 'RFP 1.1 사업 배경 및 목적'
      },
      {
        id: 'out-1-2',
        code: '1.2',
        title: '1.2 제안 목적 및 비전',
        level: 2,
        status: '완료',
        author: '정소담',
        reviewer: '김민수',
        deadline: '2026.09.13',
        targetPages: 3,
        targetWords: 1100,
        currentWords: 1120,
        sourceReqId: 'REQ-001'
      },
      {
        id: 'out-1-3',
        code: '1.3',
        title: '1.3 제안의 특징 및 기대효과',
        level: 2,
        status: '완료',
        author: '정소담',
        reviewer: '김민수',
        deadline: '2026.09.15',
        targetPages: 4,
        targetWords: 1200,
        currentWords: 1110,
        sourceReqId: 'REQ-002'
      }
    ]
  },
  {
    id: 'out-2',
    code: '2',
    title: '2. 사업 이해 및 추진 전략',
    level: 1,
    status: '검토 중',
    author: '정소담',
    reviewer: '이서연',
    deadline: '2026.09.20',
    targetPages: 18,
    targetWords: 6000,
    currentWords: 5800,
    isExpanded: true,
    children: [
      {
        id: 'out-2-1',
        code: '2.1',
        title: '2.1 요구사항 분석 및 해결방안',
        level: 2,
        status: '검토 중',
        author: '정소담',
        reviewer: '이서연',
        deadline: '2026.09.18',
        targetPages: 8,
        targetWords: 2800,
        currentWords: 2750,
        sourceReqId: 'REQ-004'
      },
      {
        id: 'out-2-2',
        code: '2.2',
        title: '2.2 추진 방향 및 핵심 성공요인(CSF)',
        level: 2,
        status: '검토 준비',
        author: '정소담',
        reviewer: '이서연',
        deadline: '2026.09.20',
        targetPages: 10,
        targetWords: 3200,
        currentWords: 3050,
        sourceReqId: 'REQ-002'
      }
    ]
  },
  {
    id: 'out-3',
    code: '3',
    title: '3. 수행 방안',
    level: 1,
    status: '작성 중',
    author: '정소담',
    reviewer: '김민수',
    deadline: '2026.09.25',
    targetPages: 42,
    targetWords: 15000,
    currentWords: 8400,
    isExpanded: true,
    children: [
      {
        id: 'out-3-1',
        code: '3.1',
        title: '3.1 AI 플랫폼 구축 방안',
        level: 2,
        status: '작성 중',
        author: '정소담',
        reviewer: '김민수',
        deadline: '2026.09.22',
        targetPages: 14,
        targetWords: 5000,
        currentWords: 3200,
        sourceReqId: 'REQ-004',
        sourceText: 'RFP 3.1 AI 플랫폼 아키텍처 및 RAG 구현'
      },
      {
        id: 'out-3-2',
        code: '3.2',
        title: '3.2 사내 데이터 연계 및 벡터화',
        level: 2,
        status: '작성 준비',
        author: '김민수',
        reviewer: '박지훈',
        deadline: '2026.09.23',
        targetPages: 10,
        targetWords: 3500,
        currentWords: 900,
        sourceReqId: 'REQ-004'
      },
      {
        id: 'out-3-3',
        code: '3.3',
        title: '3.3 보안 체계 및 망연계 방안',
        level: 2,
        status: '작성 중',
        author: '김민수',
        reviewer: '정소담',
        deadline: '2026.09.24',
        targetPages: 10,
        targetWords: 3500,
        currentWords: 2400,
        sourceReqId: 'REQ-003'
      },
      {
        id: 'out-3-4',
        code: '3.4',
        title: '3.4 시스템 운영 및 장애 대응 방안',
        level: 2,
        status: '작성 대기',
        author: '이서연',
        reviewer: '최유진',
        deadline: '2026.09.25',
        targetPages: 8,
        targetWords: 3000,
        currentWords: 0,
        sourceReqId: 'REQ-006'
      }
    ]
  },
  {
    id: 'out-4',
    code: '4',
    title: '4. 프로젝트 관리 방안',
    level: 1,
    status: '작성 대기',
    author: '최유진',
    reviewer: '정소담',
    deadline: '2026.09.28',
    targetPages: 12,
    targetWords: 4000,
    currentWords: 0,
    isExpanded: false
  },
  {
    id: 'out-5',
    code: '5',
    title: '5. 수행 조직 및 투입 인력',
    level: 1,
    status: '작성 대기',
    author: '박지훈',
    reviewer: '김민수',
    deadline: '2026.09.29',
    targetPages: 8,
    targetWords: 2500,
    currentWords: 0,
    isExpanded: false
  },
  {
    id: 'out-6',
    code: '6',
    title: '6. 기대 효과 및 지원 방안',
    level: 1,
    status: '작성 대기',
    author: '정소담',
    reviewer: '이서연',
    deadline: '2026.09.30',
    targetPages: 8,
    targetWords: 2500,
    currentWords: 0,
    isExpanded: false
  }
];

export const INITIAL_STORYBOARD: StoryboardSection = {
  id: 'story-3-1',
  guidelines: 'RFP 5.1의 구축 요구사항을 모두 반영하고, 공공기관 망분리 특성에 부합하는 하이브리드 아키텍처를 상세히 제시할 것.',
  evaluationCriteria: '기술능력평가 - AI 아키텍처 완성도(15점), RAG 지식 검색 정확도(10점), 안정성 및 확장성(10점)',
  taskDescription: '보안 등급별 멀티 LLM 연계 라우터, 온프레미스 sLLM 모델 구축, RAG 임베딩 파이프라인 및 행정 포털 통합 UI 개발.',
  otherRequirements: 'CSAP 클라우드 인증 규격 준수, 국가정보원 암호화 알고리즘(ARIA 256) 적용, 동시접속 1,000명 응답 1.5초 이내 보장.',
  winStrategy: '단순 상용 API 호출이 아닌, KPC가 검증한 공공 행정 도메인 특화 경량 LLM 모델과 최신 멀티모달 RAG 캐싱 알고리즘을 결합하여 속도와 보안을 동시 확보.',
  differentiators: [
    'KPC 업무 특화 AI 엔진 (공공 행정 서식 40종 사전 학습 모델)',
    'Multi-LLM 하이브리드 인텔리전트 라우터',
    '내부 비정형 문서 기반 하이브리드 RAG (BM25 + Dense Vector Search)',
    '보안 등급별 AI Routing 및 데이터 누출 방지(DLP) 자동 마스킹',
    'GPU 자원 스케줄링을 통한 연간 운영 비용 35% 최적화'
  ],
  painPoints: [
    '공공 행정 HWP 문서 내 복합 표·차트 인식 실패로 인한 검색 누락',
    '보안 감사 시 민감 개인정보 외부 LLM 전송 위험에 대한 우려',
    '기존 키워드 검색의 한계로 방대한 규정집 열람 시 비효율 발생'
  ],
  targetPages: 14,
  targetWords: 5000,
  author: '정소담',
  reviewer: '김민수'
};

export const INITIAL_EDITOR_CONTENT = `3.1 AI 플랫폼 구축 방안

[1. 개요 및 추진 목표]
한국산업진흥원의 지속 가능한 디지털 혁신과 행정 생산성 극대화를 위하여, 본 제안사는 보안성이 검증된 공공 맞춤형 생성형 AI 업무혁신 플랫폼 아키텍처를 제시합니다. [1] 본 플랫폼은 단순 질의응답 솔루션을 넘어, 사내에 축적된 10만 건 이상의 내부 규정, 연구 보고서, 과거 기안문서를 지능적으로 융합 분석하는 엔터프라이즈 지식 허브로 구축됩니다.

[2. 시스템 아키텍처 구성]
본 시스템은 크게 3계층(프리젠테이션 계층, AI 인텔리전스 라우팅 계층, 지능형 RAG 데이터 계층)으로 설계되며, 철저한 망분리 규격과 국가정보원 보안 가이드라인을 준수합니다.
1) 사용자 접점 계층: 웹 포털 플러그인 및 반응형 대시보드를 제공하여 사용자가 별도의 교육 없이 직관적으로 문서를 요약하고 초안을 작성할 수 있도록 지원합니다.
2) 지능형 Multi-LLM 라우팅 계층: 보안 등급이 높은 대외비 문서는 내부 온프레미스 경량화 모델(sLLM)에서 폐쇄망 처리하고, 일반 대국민 공개 자료는 상용 고성능 LLM을 선별 연계하여 최적의 성능과 비용 효율성을 달성합니다. [2]
3) 하이브리드 RAG 데이터 파이프라인: 공공기관 특유의 복합 한글(HWP/HWPX) 표와 계층형 양식을 온전히 해석하는 전용 파서 엔진을 탑재하여 벡터 검색 정확도를 92% 이상으로 보장합니다.

[3. 기대 효과 및 실행 계획]
플랫폼 구축 후 한국산업진흥원 실무진의 일상적인 보고서 탐색 및 결재 초안 작성 시간이 주당 평균 8.5시간 단축될 것으로 분석되며, 이는 연간 18억 원 규모의 정량적 행정 비용 절감 효과를 창출할 것입니다.`;

export const SAMPLE_SUMMARY_OPTIONS: SummaryOption[] = [
  {
    id: 1,
    title: 'Option 1: 짧고 핵심적인 요약',
    desc: '의사결정권자 보고를 위한 초압축 핵심 요약',
    charCount: 220,
    reductionRate: '68%',
    content: '한국산업진흥원 맞춤형 생성형 AI 플랫폼은 망분리 환경에서 안전한 폐쇄형 sLLM과 고성능 상용 LLM을 지능형으로 라우팅하며, HWP 특화 하이브리드 RAG를 통해 사내 규정 및 보고서 검색 정확도를 92% 이상 보장합니다. 이를 통해 주당 업무 시간 8.5시간 단축 및 연간 18억 원의 행정 비용 절감을 실현합니다.',
    diffAddition: '망분리 환경에서 안전한 폐쇄형 sLLM과 고성능 상용 LLM을 지능형으로 라우팅하며, HWP 특화 하이브리드 RAG를 통해 사내 규정 및 보고서 검색 정확도를 92% 이상 보장합니다.',
    diffDeletion: '기존의 상세 3계층 설명 및 장황한 부가 서술'
  },
  {
    id: 2,
    title: 'Option 2: 원문 의미를 최대한 유지한 요약',
    desc: '주요 기술 아키텍처와 기대수익 지표의 논리적 연결성을 보존한 균형 요약',
    charCount: 380,
    reductionRate: '45%',
    content: '한국산업진흥원의 행정 생산성 극대화를 위한 AI 플랫폼은 국가정보원 보안 가이드라인을 충족하는 3계층 아키텍처로 구축됩니다. [1] 보안 대외비 문서는 온프레미스 sLLM에서 전담 처리하고 공개 자료는 상용 LLM과 하이브리드 연동하여 비용과 보안을 동시 확보합니다. [2] 특히 HWP 전용 파서 기반의 하이브리드 RAG를 적용하여 벡터 검색 정확도 92%를 달성하고, 실무진 일상 업무 시간 8.5시간 단축과 연간 18억 원 절감 효과를 창출합니다.',
    diffAddition: '국가정보원 보안 가이드라인을 충족하는 3계층 아키텍처로 구축되며, 보안 대외비 문서는 온프레미스 sLLM에서 전담 처리하고 공개 자료는 상용 LLM과 하이브리드 연동합니다.',
    diffDeletion: '일부 서두 수식어구 및 중복 표현'
  },
  {
    id: 3,
    title: 'Option 3: 제안서 문체로 재구성한 요약',
    desc: '공공기관 제안서 공식 개조식 보고 문체로 구조화된 요약',
    charCount: 310,
    reductionRate: '55%',
    content: '가. [보안 완벽] 국가정보원 보안 가이드라인 준수 및 온프레미스 sLLM 폐쇄망 처리\n나. [기술 혁신] HWP 정밀 파서 탑재 하이브리드 RAG로 검색 정확도 92% 달성\n다. [경영 성과] 일상 행정 소요시간 주 8.5시간 단축 및 연간 18억 원 예산 절감 실현',
    diffAddition: '가. [보안 완벽] ... 나. [기술 혁신] ... 다. [경영 성과] ... 개조식 서식',
    diffDeletion: '산문형 문단 구조 전체'
  }
];

export const SAMPLE_CASE_STUDIES: CaseStudyOption[] = [
  {
    id: 1,
    title: '공공기관 AI 상담서비스 및 행정문서 지능화 구축 사례',
    content: '한국산업기술진흥원 사내 규정 12,000건 및 기술지원 매뉴얼 RAG 기반 자동 검색 시스템 구축 (검색 정확도 94.2% 달성, 행정 상담 대기시간 65% 단축)',
    source: '2024 한국산업기술진흥원 정보화 성과 보고서',
    dataset: 'KPC 공공 DX 사업실적 DB'
  },
  {
    id: 2,
    title: '교육기관 생성형 AI 업무지원 플랫폼 구축 사례',
    content: '전국 교직원 대상 사내 지식 기반 생성형 AI 업무 어시스턴트 도입 (일일 사용자 3,200명, 공문서 기안 작성 소요시간 50% 단축 실증)',
    source: '2025 서울시 교육청 DX 파일럿 실증보고서',
    dataset: 'KPC 에듀테크 레퍼런스'
  },
  {
    id: 3,
    title: '컨설팅 조직 내부 Knowledge AI 도입 및 Multi-LLM 적용 사례',
    content: 'KPC 사내 60년 컨설팅 자산 50만 건 Multi-LLM 하이브리드 라우터 연동 RAG 시스템 가동 (제안서 작성 주기 14일 → 4일로 단축)',
    source: '2025 KPC 사내 경영혁신 성과지표',
    dataset: 'KPC 내부 혁신 백서'
  }
];

export const SAMPLE_CITATIONS: CitationItem[] = [
  {
    id: 1,
    marker: '[1]',
    fileName: 'RFP_생성형AI플랫폼구축.pdf',
    page: '18p',
    originalQuote: '공공기관 사내 지식 검색 및 문서 자동 생성을 위한 생성형 AI 플랫폼 구축 요구사항 부합 (Hit Rate 90% 이상)',
    relevance: '98%',
    dataType: '발주처 제안요청서'
  },
  {
    id: 2,
    marker: '[2]',
    fileName: 'KPC_AI전략_v3.pptx',
    page: '14p',
    originalQuote: '보안등급별 Multi-LLM 라우터 기술 규격: 내부 대외비 문서는 폐쇄망 온프레미스 sLLM, 일반 공개문서는 하이브리드 연동',
    relevance: '95%',
    dataType: 'KPC 기술자산'
  },
  {
    id: 3,
    marker: '[3]',
    fileName: '국가정보원_보안가이드.pdf',
    page: '27p',
    originalQuote: '공공기관 생성형 AI 도입 시 개인정보 및 국가기밀 보호를 위한 필수 암호화 통신(ARIA 256) 및 망연계 게이트웨이 요건',
    relevance: '91%',
    dataType: '정부 보안 규정'
  }
];

export const SAMPLE_COMMENTS: CommentItem[] = [
  {
    id: 'cmt-1',
    text: '이 부분에 한국산업기술진흥원 최신 수행사례를 추가해주세요. @김민수 수석님 레퍼런스 수치 확인 부탁드립니다.',
    author: '정소담',
    date: '2026.09.07 10:15',
    resolved: false,
    selectedTextSnippet: '본 제안사는 보안성이 검증된 공공 맞춤형 생성형 AI 업무혁신 플랫폼 아키텍처를 제시합니다.',
    replies: [
      {
        id: 'rep-1',
        author: '김민수',
        text: '네 정소담 수석님, 2024년 사업실적 94.2% 정확도 데이터 반영 완료했습니다.',
        date: '2026.09.07 10:28'
      }
    ]
  },
  {
    id: 'cmt-2',
    text: '국가정보원 CSAP 인증 가이드라인 문구가 최신 개정판 기준으로 잘 반영되었는지 확인했습니다.',
    author: '이서연',
    date: '2026.09.06 17:40',
    resolved: true,
    selectedTextSnippet: '철저한 망분리 규격과 국가정보원 보안 가이드라인을 준수합니다.'
  }
];

export const INITIAL_SOURCE_SETTINGS: SourceSettings = {
  internalKpc: true,
  currentProjectDocs: true,
  datasets: true,
  webSearch: true,
  internalSubtypes: {
    all: true,
    proposals: true,
    reports: true,
    trackRecord: true,
    methodology: true,
    companyIntro: true
  },
  allowedWebsites: ['example.com', 'kpc.or.kr', 'nia.or.kr', 'data.go.kr'],
  blockedWebsites: ['wikipedia.org', 'namu.wiki', 'blog.naver.com']
};

export const SAMPLE_REVIEW_SCORES: ReviewScore[] = [
  { category: '요구사항 준수', score: 92, maxScore: 100, description: 'RFP 필수 및 평가 항목의 96%가 본문에 충실히 반영됨' },
  { category: '수주전략 반영', score: 78, maxScore: 100, description: 'KPC 고유 생산성 방법론 연계 차별화 포인트 보강 권장' },
  { category: '접근방식 및 방법론', score: 84, maxScore: 100, description: '착수부터 안정화까지의 단계별 절차 구체화 필요' },
  { category: '근거 적절성', score: 71, maxScore: 100, description: '정량적 기대수익 산출 근거 통계 및 참고문헌 추가 보완 필요' },
  { category: '견고성', score: 82, maxScore: 100, description: '동시 접속 트래픽 폭증 시 페일오버 및 부하분산 구체성 검증 완료' },
  { category: '차별성', score: 74, maxScore: 100, description: '경쟁사 대비 KPC만의 공공 컨설팅 역량 우위성 강조 필요' },
  { category: '철자 및 문법', score: 96, maxScore: 100, description: '공공 행정 표준 맞춤법 및 띄어쓰기 매우 우수' }
];

export const SAMPLE_REVIEW_SUGGESTIONS: ReviewSuggestion[] = [
  {
    id: 'sug-1',
    category: '접근방식 및 방법론',
    issue: '수행 절차에 대한 구체적인 단계가 부족합니다.',
    aiSuggestion: '착수 → 분석 → 설계 → 구축 → 검증 → 안정화의 단계별 방법론을 제시하세요.',
    originalSnippet: '본 시스템은 크게 3계층으로 설계되며, 철저한 망분리 규격과 국가정보원 보안 가이드라인을 준수합니다.',
    revisedSnippet: '본 시스템은 체계적인 6단계 수행방법론(1단계: 요건분석 → 2단계: 아키텍처설계 → 3단계: 하이브리드구축 → 4단계: 보안검증 → 5단계: 시범운영 → 6단계: 서비스안정화)에 입각하여 추진하며, 철저한 망분리 규격과 국가정보원 보안 가이드라인을 완벽 준수합니다.'
  },
  {
    id: 'sug-2',
    category: '수주전략 반영',
    issue: 'KPC만의 공공 생산성 진단 노하우 결합 명시가 다소 약합니다.',
    aiSuggestion: '국가고객만족도(NCSI) 및 생산성 지표(K-PI)와의 실시간 연계 대시보드 무상 제공을 명시하세요.',
    originalSnippet: '실무진의 일상적인 보고서 탐색 및 결재 초안 작성 시간이 주당 평균 8.5시간 단축될 것으로 분석되며',
    revisedSnippet: 'KPC 고유 생산성 지수(K-PI)와 연동되는 업무효율 모니터링 대시보드를 무상 제공함으로써, 실무진의 보고서 탐색 및 결재 초안 작성 시간을 주당 8.5시간 이상 혁신적으로 단축하고'
  },
  {
    id: 'sug-3',
    category: '근거 적절성',
    issue: '연간 18억 절감 산출 근거에 대한 세부 공식 제시가 필요합니다.',
    aiSuggestion: '임직원 수(500명) × 시간당 평균인건비(45,000원) × 연간 단축시간(80시간)의 산식 주석을 부기하세요.',
    originalSnippet: '연간 18억 원 규모의 정량적 행정 비용 절감 효과를 창출할 것입니다.',
    revisedSnippet: '연간 18억 원 규모의 정량적 행정 비용 절감 효과(근거: 전직원 500명 × 연간 80시간 절감 × 시간당 인건비 45,000원 산출)를 명확히 창출할 것입니다.'
  }
];

export const INITIAL_VERSIONS: EditorVersion[] = [
  {
    id: 'ver-1',
    versionCode: 'v1',
    title: 'AI 초안',
    time: '10:22',
    author: '정소담',
    content: INITIAL_EDITOR_CONTENT
  }
];

export const SAMPLE_REQUIREMENTS_MATRIX: RequirementsMatrixItem[] = [
  {
    id: 'REQ-001',
    reqId: 'REQ-001',
    requirementName: '제안서 본문 100페이지 이내 작성 및 제출',
    rfpRequirement: '제안서 본문 100페이지 이내 작성 및 제출',
    source: 'RFP p.12',
    rfpPage: 12,
    proposalLocation: '전체 구성 계획',
    proposalSectionNumber: '총괄',
    proposalSectionTitle: '전체 구성 계획',
    assignee: '정소담',
    status: '작성 완료',
    compliance: '수용',
    notes: '본문 96페이지 구성 완료, 증빙서류는 별첨 1~3으로 분리',
    reviewResult: '충족'
  },
  {
    id: 'REQ-002',
    reqId: 'REQ-002',
    requirementName: '최근 3년 공공 AI 유사 실적 3건 이상',
    rfpRequirement: '최근 3년 공공 AI 유사 실적 3건 이상',
    source: 'RFP p.24',
    rfpPage: 24,
    proposalLocation: '1.3 제안의 특징 및 실적',
    proposalSectionNumber: '1.3',
    proposalSectionTitle: '제안의 특징 및 실적',
    assignee: '김민수',
    status: '작성 완료',
    compliance: '수용',
    notes: '중앙부처 및 공공기관 실적 4건 증빙서 첨부 완료',
    reviewResult: '충족'
  },
  {
    id: 'REQ-003',
    reqId: 'REQ-003',
    requirementName: '국가정보원 보안대책 및 암호화 규정 준수',
    rfpRequirement: '국가정보원 보안대책 및 암호화 규정 준수',
    source: 'RFP p.37',
    rfpPage: 37,
    proposalLocation: '3.3 보안 체계 및 망연계 방안',
    proposalSectionNumber: '3.3',
    proposalSectionTitle: '보안 체계 및 망연계 방안',
    assignee: '김민수',
    status: '작성 완료',
    compliance: '수용',
    notes: '국정원 보안성 검토 기준 및 국정원 인증 암호화 모듈 적용',
    reviewResult: '충족'
  },
  {
    id: 'REQ-004',
    reqId: 'REQ-004',
    requirementName: 'RAG 지식 검색 정확도(Hit Rate) 90% 이상 보장',
    rfpRequirement: 'RAG 지식 검색 정확도(Hit Rate) 90% 이상 보장',
    source: 'RFP p.18',
    rfpPage: 18,
    proposalLocation: '3.1 AI 플랫폼 구축 방안',
    proposalSectionNumber: '3.1',
    proposalSectionTitle: 'AI 플랫폼 구축 방안',
    assignee: '정소담',
    status: '작성 중',
    compliance: '일부수용',
    notes: 'KPC 자체 벤치마크 88.5% 달성, 파인튜닝으로 92% 목표 기술 중',
    reviewResult: '부분 충족'
  },
  {
    id: 'REQ-005',
    reqId: 'REQ-005',
    requirementName: '블라인드 심사용 평가본 별도 제출',
    rfpRequirement: '블라인드 심사용 평가본 별도 제출',
    source: 'RFP p.10',
    rfpPage: 10,
    proposalLocation: '제출 서류 관리',
    proposalSectionNumber: '별첨',
    proposalSectionTitle: '제출 서류 관리',
    assignee: '이서연',
    status: '작성 완료',
    compliance: '수용',
    notes: '제안사 로고 및 고유 식별 명칭 완전 비식별화 처리 프로세스 수립',
    reviewResult: '충족'
  },
  {
    id: 'REQ-006',
    reqId: 'REQ-006',
    requirementName: '착수 30일 이내 프로토타입 UI/UX 시연회',
    rfpRequirement: '착수 30일 이내 프로토타입 UI/UX 시연회',
    source: 'RFP p.28',
    rfpPage: 28,
    proposalLocation: '4.2 일정 및 마일스톤 관리',
    proposalSectionNumber: '4.2',
    proposalSectionTitle: '일정 및 마일스톤 관리',
    assignee: '최유진',
    status: '작성 대기',
    compliance: '해당없음',
    notes: '사업 착수 보고회 시 협의 후 추진 방안으로 조건부 기술 예정',
    reviewResult: '미충족'
  }
];

export const SAMPLE_LIBRARY_ITEMS: ProposalLibraryItem[] = [
  {
    id: 'lib-1',
    title: 'KPC 공공행정 특화 생성형 AI 방법론(PRO-AI™) 백서',
    category: '방법론',
    description: '공공부문 생성형 AI 구축 시 요구되는 거버넌스 및 단계별 실행 절차 수록',
    tags: ['방법론', 'PRO-AI', '백서', '공공AI', '생산성'],
    size: '14.2 MB',
    lastModified: '2026.08.30',
    updatedAt: '2026.08.30',
    useCount: 42,
    fileFormat: 'PDF',
    department: 'AI사업본부',
    previewContent: {
      summary: 'KPC가 자체 정립한 공공부문 초거대 AI 사업수행 전용 방법론(PRO-AI™)의 표준 프레임워크 문서입니다. 국가정보원 보안 지침, 망분리 규제, 행안부 공공데이터 개방 가이드라인을 100% 충족하도록 5단계(분석-설계-학습-검증-전개)로 체계화되어 있습니다.',
      keyHighlights: [
        '공공기관 망분리(인터넷망/업무망) 연동형 하이브리드 RAG 아키텍처',
        '환각(Hallucination) 방지 3단계 필터링 및 사실검증(Grounding) 프로토콜',
        '개인정보보호법 제29조에 따른 비식별화(Masking) 및 감사로그 기록 모듈',
        '공공 RFP 기술평가 1위 수주 방법론 차별화 포인트 6종 완비'
      ],
      toc: [
        '1. PRO-AI™ 방법론 개요 및 공공 특수성 정의',
        '2. 요구사항 기반 프롬프트 엔지니어링 & 지식 임베딩',
        '3. 파인튜닝 및 온프레미스 LLM 서빙 프레임워크',
        '4. 보안 검토(국정원 보안성 검토) 체크리스트 및 대응 규격',
        '5. 유지보수 및 프롬프트 지속 개선(Continuous Feedback) 체계'
      ],
      sampleText: `[발췌문: PRO-AI™ 3장 2절 - 공공 거버넌스 준수 AI 파이프라인]
본 사업단이 제안하는 공공 AI 플랫폼은 모델 레이어와 행정 데이터 레이어를 완벽히 격리하는 KPC-Secure Gateway를 기반으로 작동합니다. 발주기관 내부 온프레미스 망에서 전처리된 벡터 DB(Pgvector/FAISS)만을 질의 참조하며, 외부 상용 LLM API 호출 시 주민번호, 계좌번호 등 18개 민감 개인정보 속성을 0.05초 내 자동 마스킹 처리하여 데이터 유출 위험을 원천 차단합니다.`,
      metadata: {
        '발행처': '한국생산성본부 AI사업본부 R&D센터',
        '문서등급': '사내 1급 수주자산',
        '최종개정일': '2026-08-30',
        '적용사례': '중앙부처, 산하 8개 공공기관 기적용'
      }
    }
  },
  {
    id: 'lib-2',
    title: '2025 중앙부처 AI 지식관리시스템 수주 제안서 표준본',
    category: '기존 제안서',
    description: '조달청 우수 제안 선정 및 1위 낙찰 제안서 구성 템플릿',
    tags: ['제안서', '표준본', '지식관리', '조달청', '중앙부처'],
    size: '8.7 MB',
    lastModified: '2026.07.15',
    updatedAt: '2026.07.15',
    useCount: 28,
    fileFormat: 'DOCX',
    department: 'AI사업본부',
    previewContent: {
      summary: '2025년 행정안전부 및 소속기관 대상 AI 지식검색 구축사업에서 기술점수 1위(98.8점)로 낙찰 수주한 실전 제안서 표준 템플릿입니다. 최적화된 목차 구조와 강력한 제안 스토리보드가 포함되어 있습니다.',
      keyHighlights: [
        '조달청 협상에 의한 계약 기술평가위원 최고 호평 목차 구조',
        '전체 제안 전략: 3대 핵심 목표(정확성 99%, 검색속도 1초, 사용자 만족도 95%)',
        '아키텍처 구성도 및 행정문서(HWP, PDF) 실시간 인덱싱 구성안',
        '발주기관 맞춤형 정량/정성 기대효과 분석표 완비'
      ],
      toc: [
        '제1장 제안 개요 (추진 배경 및 목적, 제안의 특징 및 장점)',
        '제2장 제안사 일반 현황 (일반현황, 주요 사업내용, 유사분야 사업실적)',
        '제3장 기술 및 기능 부문 (시스템 구조, AI 지식검색, RAG 엔진 연동)',
        '제4장 사업관리 부문 (수행조직, 투입인력, 품질보증, 위험관리)',
        '제5장 지원 부문 (교육훈련, 기술이전, 하자보수 및 유지관리)'
      ],
      sampleText: `[발췌문: 제3장 1.2절 - 대민/행정 지식통합 연계 방안]
KPC 컨소시엄은 분산된 1,200만 건의 행정 결재문서 및 민원 질의응답 이력을 메타데이터 계층화 구조로 재분류하고, 하이브리드 검색(BM25 키워드 매칭 + 다국어 Dense Vector 임베딩)을 결합하여 공공 행정 전문용어 검색 정확도를 99.2%까지 견인합니다.`,
      metadata: {
        '낙찰사업명': '2025 중앙부처 지능형 행정업무지원 AI 구축',
        '수주금액': '48억 5천만 원',
        '기술점수': '98.8점 / 100점 만점',
        '원문분량': '총 320페이지 완본'
      }
    }
  },
  {
    id: 'lib-3',
    title: '한국생산성본부 60년 연혁 및 국가공공신인도 증빙집',
    category: '회사 소개',
    description: '산업통상자원부 산하 특별법인 신인도, 감사보고서, 조직도 총괄 증빙',
    tags: ['회사소개', '연혁', '신인도', '법정단체', '조직도'],
    size: '5.1 MB',
    lastModified: '2026.08.10',
    updatedAt: '2026.08.10',
    useCount: 89,
    fileFormat: 'PDF',
    department: '경영지원본부',
    previewContent: {
      summary: '1957년 설립된 대한민국 최초의 경영·생산성 종합 컨설팅 기관인 한국생산성본부(KPC)의 공공기관 입찰 필수 제출 공식 신인도 및 재정건전성 증빙 자료집입니다.',
      keyHighlights: [
        '산업발전법 제32조에 근거한 특별법인 설립 인가서 및 사업자등록증',
        '신용평가등급 AAA(공공기관 입찰 최고등급 보증)',
        '최근 3개년 외부 회계법인 감사보고서 및 무차입 재무건전성 지표',
        '정부포상(대통령표창, 국무총리표창 등) 수훈 목록 15건'
      ],
      toc: [
        '1. 설립 근거 법률 및 경영진 소개',
        '2. 본부별 전문 인력 보유 현황 (석·박사 420명, 전문자격 보유자 280명)',
        '3. 공공기관 입찰 신용평가등급 확인서',
        '4. 사회적 책임 및 윤리경영 실천 증빙',
        '5. 사업자등록증 및 법인인감증명원 사본'
      ],
      sampleText: `[발췌문: 신인도 및 재무건전성 요약]
한국생산성본부는 국가 공공 정책 및 산업 지능화를 선도하는 법정 전문기관으로서, 신용보증기금 및 나이스평가정보 기준 기업신용평가 최고 등급(AAA)을 유지하고 있으며, 부채비율 18.2%의 견고한 재무건전성을 바탕으로 대형 공공사업의 무결점 완수를 보장합니다.`,
      metadata: {
        '설립일자': '1957년 8월 28일',
        '신용평가사': 'NICE평가정보 (평가등급: AAA)',
        '임직원수': '본사 및 전국 지역본부 총 850명',
        '인증상태': '조달청 나라장터 공식 등록 증빙'
      }
    }
  },
  {
    id: 'lib-4',
    title: '공공기관 유사 AI·빅데이터 사업수행실적 증명원 묶음(14건)',
    category: '수행 사례',
    description: '발주기관 직인이 날인된 단일 5억 원 이상 최근 3년 실적증명원',
    tags: ['수행실적', '실적증명', '빅데이터', '공공실적', 'AI사업'],
    size: '19.5 MB',
    lastModified: '2026.09.01',
    updatedAt: '2026.09.01',
    useCount: 63,
    fileFormat: 'PDF',
    department: '컨설팅본부',
    previewContent: {
      summary: '최근 3년 이내 공공기관 및 중앙부처에서 주관한 AI 플랫폼 구축, 빅데이터 분석, 생성형 지식베이스 사업 실적증명원 14건 묶음(발주처 직인 날인 완결본)입니다.',
      keyHighlights: [
        '기획재정부 차세대 예산분석 지능화 플랫폼 구축 (28억 원)',
        '행정안전부 디지털 행정지원 LLM 어시스턴트 구축 (35억 원)',
        '한국전력공사 전력설비 이상감지 빅데이터 및 AI 분석 (42억 원)',
        '총 수행누적금액 320억 원 이상, 전 건 사업평가 우수/매우우수 획득'
      ],
      toc: [
        '실적총괄표 (사업명, 발주처, 계약기간, 계약금액, 증명번호)',
        '실적증명원 1~5호 (중앙행정기관 실적)',
        '실적증명원 6~10호 (공기업 및 준정부기관 실적)',
        '실적증명원 11~14호 (지자체 및 연구기관 실적)'
      ],
      sampleText: `[발췌문: 기획재정부 사업 실적증명원 주요 기재사항]
- 건명: 2024~2025 지능형 재정데이터 분석 및 생성형 질의시스템 고도화
- 계약기간: 2024.03.01 ~ 2025.02.28 (12개월)
- 계약금액: 2,850,000,000원 (VAT 포함)
- 발주처 평가의견: 요구기한 내 하자율 0%로 완수하였으며, 시스템 응답속도 및 보안성에서 최우수 성과를 달성함.`,
      metadata: {
        '총 실적건수': '14건 (공공 11건, 공기업 3건)',
        '합산 계약금액': '324억 8천만 원',
        '증빙유효성': '발주기관 전자직인 진위확인 완료'
      }
    }
  },
  {
    id: 'lib-5',
    title: 'AI 전문인력 프로필 및 특급감리원·데이터분석기사 자격원부',
    category: '인력 정보',
    description: '투입 예정 핵심 인력 12인의 학력, 경력, 자격증, 재직증명원 일체',
    tags: ['투입인력', '전문가', '자격증', '프로필', '감리원'],
    size: '6.3 MB',
    lastModified: '2026.08.28',
    updatedAt: '2026.08.28',
    useCount: 35,
    fileFormat: 'HWP',
    department: 'AI사업본부',
    previewContent: {
      summary: '본 제안 사업에 참여율 100%로 투입 확약된 PM(총괄 사업관리자), AI 아키텍트, 데이터 사이언티스트 12인의 기술경력증명서(소프트웨어산업협회 발급), 국가기술자격증 사본집입니다.',
      keyHighlights: [
        '총괄 PM: 공공 정보화 사업수행 18년 경력, 정보관리기술사/특급기술자',
        'AI 리드 아키텍트: 카이스트 AI 박사, 공공 RAG 및 온프레미스 LLM 파이프라인 특허 4건 보유',
        '정보보안 감리 전문가: 정보시스템수석감리원, 국정원 보안성 검토 심사위원 역임',
        'SW산업협회(KOSA) 공식 SW기술자 경력증명서 및 4대보험 가입증명 완비'
      ],
      toc: [
        '1. 사업 수행 조직도 및 역할 분담 체계',
        '2. 핵심 인력 12인 프로필 요약 카드 (경력, 학력, 주요 프로젝트)',
        '3. 한국소프트웨어산업협회 기술등급 확인서 모음',
        '4. 국가공인 자격증(정보관리기술사, 빅데이터분석기사, PMP 등) 사본',
        '5. 건강보험자격득실확인서(재직증빙)'
      ],
      sampleText: `[발췌문: 총괄 PM 김수현 수석연구원 프로필]
- 학력: 서울대학교 컴퓨터공학 석사
- 경력: 한국생산성본부 14년 재직, 통산 공공 수주 사업 24건 총괄 성공
- 보유자격: 정보관리기술사, 공인감리원, PMP(국제프로젝트관리전문가)
- 최근 대표 프로젝트: 2025 중앙행정기관 대규모 AI 지식베이스 구축사업 총괄 (100% 적기 납품 달성)`,
      metadata: {
        '투입인원': '총 12인 (특급 4명, 고급 5명, 중급 3명)',
        '평균 경력': '13.4년',
        '증빙 서류': 'KOSA 경력확인서 + 재직증명원 첨부'
      }
    }
  },
  {
    id: 'lib-6',
    title: 'ISO 27001 정보보안인증 및 CSAP 클라우드 적합성 기술문서',
    category: '인증 및 증빙',
    description: '국제 표준 정보보호 인증서 및 공공 클라우드 보안적합성 검증 확인서',
    tags: ['보안인증', 'ISO27001', 'CSAP', '클라우드', '정보보안'],
    size: '4.8 MB',
    lastModified: '2026.06.20',
    updatedAt: '2026.06.20',
    useCount: 51,
    fileFormat: 'PDF',
    department: '기술보안팀',
    previewContent: {
      summary: '공공부문 입찰 시 보안평가 만점을 충족하기 위한 국제 표준 정보보호 인증서(ISO/IEC 27001:2022) 및 한국인터넷진흥원(KISA) CSAP(클라우드 보안인증) 보안성 검증 증빙서류입니다.',
      keyHighlights: [
        'ISO/IEC 27001(정보보안경영시스템) 전사 인증 유지',
        'ISO/IEC 27701(개인정보보호경영시스템) 획득',
        'KISA CSAP SaaS 표준등급 보안인증 연계 기술규격서',
        '취약점 점검 및 모의해킹 결과 보고서(조치율 100%)'
      ],
      toc: [
        '1. 국제표준 정보보호 인증서(ISO 27001, 27701) 원본 사본',
        '2. KPC 정보보안 기본지침 및 물리적/관리적/기술적 보안 통제 규격',
        '3. 외부 침입탐지 및 망연계 게이트웨이 보안 아키텍처 다이어그램',
        '4. 백업 및 재해복구(DR) 체계 계획서'
      ],
      sampleText: `[발췌문: 정보보안 통제 규정 제12조 준수 방안]
본 제안사는 개발부터 운영 이관에 이르는 전 주기에 걸쳐 국정원 국가정보보안기본지침과 공공기관 CSAP 보안통제 117개 항목을 철저히 준수합니다. 소스코드 시큐어코딩 진단 도구(SonarQube 등)를 통해 취약점 점검을 자동화하고 보안 결함율 0건을 확인한 후 배포합니다.`,
      metadata: {
        '인증기관': 'BSI Group Korea / 한국인터넷진흥원(KISA)',
        '유효기간': '2024.11 ~ 2027.11',
        '적용범위': 'IT 및 AI 컨설팅, 시스템 구축 및 유지관리 전 부문'
      }
    }
  }
];

export const SAMPLE_MY_TASKS: MyTaskItem[] = [
  {
    id: 'task-1',
    project: '공공기관 생성형 AI 업무혁신 플랫폼 구축',
    section: '3.1 AI 플랫폼 구축 방안',
    role: '작성자',
    status: '작성 중',
    deadline: '2026.09.22',
    progress: 65
  },
  {
    id: 'task-2',
    project: '공공기관 생성형 AI 업무혁신 플랫폼 구축',
    section: '1. 제안 개요 (전체 총괄)',
    role: '작성자',
    status: '작성 대기',
    deadline: '2026.09.15',
    progress: 100
  },
  {
    id: 'task-3',
    project: '공공기관 생성형 AI 업무혁신 플랫폼 구축',
    section: '2. 사업 이해 및 추진 전략',
    role: '작성자',
    status: '검토 요청',
    deadline: '2026.09.20',
    progress: 90
  },
  {
    id: 'task-4',
    project: '공공기관 AI 기반 교육서비스 혁신 컨설팅',
    section: '3.2 AI 튜터 아키텍처 설계',
    role: '검토자',
    status: '검토 중',
    deadline: '2026.09.18',
    progress: 80
  },
  {
    id: 'task-5',
    project: '공공 DX 및 생성형 AI 도입 전략 ISP 수립',
    section: '4.1 마스터플랜 수립 방안',
    role: '작성자',
    status: '작성 대기',
    deadline: '2026.10.02',
    progress: 20
  }
];

export const SAMPLE_REPORTS: ReportItem[] = [
  {
    id: 'rep-01',
    title: '2026 공공부문 초거대 AI 도입 타당성 및 ROI 진단 보고서',
    type: '컨설팅 진단',
    author: '정소담 수석',
    department: 'AI사업본부',
    createdAt: '2026.09.05',
    updatedAt: '2026.09.05',
    status: '작성 완료',
    pages: 38,
    summary: '국내 공공 부문 초거대 AI 도입 예산 추이 및 2026년 하반기 조달청 나라장터 주요 발주 사업군 심층 타당성 및 비용편익 분석'
  },
  {
    id: 'rep-02',
    title: '글로벌 생성형 AI 엔터프라이즈 도입 트렌드 및 산업별 시장 조사',
    type: '시장 조사·트렌드',
    author: '최유진 선임',
    department: '경영연구원',
    createdAt: '2026.09.04',
    updatedAt: '2026.09.04',
    status: '작성 완료',
    pages: 42,
    summary: '북미 및 아태지역 500개 대기업의 LLM 아키텍처 도입 현황, 온프레미스 sLLM 전환율 및 벤더별 시장 점유율 분석'
  },
  {
    id: 'rep-03',
    title: '공공기관 지능형 고객경험(CX) 고도화 및 민원 VOC 감성 분석 보고서',
    type: '고객만족도(NCSI)',
    author: '박지훈 선임',
    department: 'CX본부',
    createdAt: '2026.09.03',
    updatedAt: '2026.09.03',
    status: '작성 중',
    pages: 28,
    summary: '민원 보이스 데이터(VOC) 20만 건 분석에 기반한 지능형 고객경험 지표(NCSI 모델 연계) 개선방안 실증 연구'
  },
  {
    id: 'rep-04',
    title: '제조 스마트팩토리 총요소생산성(TFP) 실증 및 지표(K-PI) 분석',
    type: '생산성·TFP 지표',
    author: '이서연 수석',
    department: '생산성본부',
    createdAt: '2026.08.31',
    updatedAt: '2026.08.31',
    status: '검토 중',
    pages: 52,
    summary: '국내 중소·중견 120개 스마트 공장 설비 가동률 데이터와 KPC 총요소생산성(TFP) 지표 간 상관관계 실증 통계'
  },
  {
    id: 'rep-05',
    title: '2025년 하반기 KPC 디지털 혁신 아카데미 사업 성과 및 ROI 종합 보고서',
    type: '사업 성과·KPI',
    author: '김민수 팀장',
    department: '교육사업본부',
    createdAt: '2026.08.28',
    updatedAt: '2026.08.28',
    status: '작성 완료',
    pages: 24,
    summary: '전국 5,000명 공무원 및 기업 재직자 대상 AI 리터러시 교육 이수율 98.4% 달성 및 현업 생산성 개선 28% 기여 성과'
  },
  {
    id: 'rep-06',
    title: '공공 인공지능 윤리 기준 및 망분리 개인정보보호 규정 준수 검토 보고서',
    type: '정책·규정 분석',
    author: '정소담 수석',
    department: 'AI사업본부',
    createdAt: '2026.08.25',
    updatedAt: '2026.08.25',
    status: '작성 완료',
    pages: 31,
    summary: '국가정보원 보안 가이드라인 및 개인정보보호위원회 생성형 AI 프라이버시 준수 점검표 45개 항목 적합성 평가'
  },
  {
    id: 'rep-07',
    title: '국내 100대 중견기업 공급망 ESG 실사 및 탄소 배출량 공시 대응 진단',
    type: 'ESG·지속가능경영',
    author: '강동원 팀장',
    department: 'ESG컨설팅센터',
    createdAt: '2026.08.20',
    updatedAt: '2026.08.20',
    status: '작성 완료',
    pages: 45,
    summary: 'EU 공급망 실사 지침(CSDDD) 대응 현황 점검 및 중견 수출기업 Scope 1, 2, 3 온실가스 배출량 산정 체계 수립'
  },
  {
    id: 'rep-08',
    title: '지자체 행정업무 자동화를 위한 생성형 AI Agent 단계별 도입 로드맵',
    type: 'AI·DX 혁신 전략',
    author: '이서연 수석',
    department: 'AI사업본부',
    createdAt: '2026.08.15',
    updatedAt: '2026.08.15',
    status: '작성 완료',
    pages: 36,
    summary: '반복 기안 문서 작성, 법령 조례 질의응답, 민원 자동분류 등 3대 시범 과제 선정 및 3개년 인프라 구축 마스터플랜'
  }
];

export const INITIAL_DIA_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'dia-msg-1',
    sender: 'assistant',
    content: '안녕하세요, 한국생산성본부(KPC) 전사 지식 기반 AI 어시스턴트 **DIA**입니다.\n사내 축적된 컨설팅 방법론, 생산성 지표(NCSI, K-PI), 제안서 및 공공 사업 규정에 기반하여 전문적인 분석과 답변을 제공합니다.\n\n무엇을 도와드릴까요?',
    timestamp: '오전 09:30',
    citations: []
  }
];

export const DIA_SAMPLE_HISTORY = [
  { id: 'h-1', title: '2026 공공기관 DX 전략 보고서 검토', date: '2026.09.07', category: '경영전략' },
  { id: 'h-2', title: '생산성 지표 분석 프레임워크 산출식', date: '2026.09.06', category: '생산성' },
  { id: 'h-3', title: 'CX 고객경험 만족도 개선방안 사례', date: '2026.09.04', category: 'CX' },
  { id: 'h-4', title: '사내 보안 및 생성형 AI 활용 규정 질의', date: '2026.09.02', category: '내부규정' },
  { id: 'h-5', title: '에듀테크 공공 교육사업 제안 골자', date: '2026.08.29', category: '교육' }
];

export const SAMPLE_RFPS = INITIAL_RFPS;

export const SAMPLE_PROJECTS = INITIAL_RFPS.map((r, i) => ({
  id: `proj-${i + 1}`,
  title: r.title,
  agency: r.agency,
  budget: r.budget,
  deadline: r.deadline,
  dDay: 28 - i * 3,
  status: r.stage,
  stage: r.stage as any, // '검토 대기' | '검토 중' | '진행' | '진행 안 함'
  manager: r.assignee || '정소담',
  teamMembers: r.participants || ['정소담', '김민수'],
  pWin: r.pwin || 74,
  rfpId: r.id,
  primaryRfpFileName: `${r.title}_RFP_공고안.pdf`,
  announcementDate: r.announcementDate || '2026.09.18',
  rejectionReason: r.stage === '진행 안 함' ? '경쟁환경 불리 (타사 기선점 가능성 높음)' : undefined,
  relatedDocs: [
    {
      id: `doc-${r.id}-1`,
      fileName: `${r.title}_RFP_공고안.pdf`,
      docType: 'RFP' as const,
      uploader: r.assignee || '정소담',
      uploadDate: r.announcementDate || '2026.09.18',
      size: '7.4 MB',
      isPrimaryRfp: true,
      pageCount: 64
    },
    {
      id: `doc-${r.id}-2`,
      fileName: `과업지시서_세부과업내역서_v1.0.docx`,
      docType: '사업 관련 문서' as const,
      uploader: r.assignee || '정소담',
      uploadDate: r.announcementDate || '2026.09.18',
      size: '2.8 MB',
      isPrimaryRfp: false,
      pageCount: 22
    }
  ],
  projectType: (i % 3 === 0 ? 'Proposal AI' : i % 3 === 1 ? 'Knowledge AI' : 'AI Platform & Agent') as ProjectType,
  analysisStatus: '등록 완료' as RfpAnalysisStatus,
  analysisProgress: (r.stage === '진행' ? 100 : 0),
  teamInvited: true
}));

export const AI_ANALYSIS_SECTIONS = SAMPLE_AI_ANALYSIS_SECTIONS.map(s => ({
  ...s,
  sourcePage: s.rfpPage,
  sourceSnippet: s.rfpQuote
}));

export const SAMPLE_STORYBOARD = INITIAL_STORYBOARD;

export const SAMPLE_EDITOR_VERSIONS: EditorVersion[] = [
  {
    id: 'v2',
    versionCode: 'v2',
    versionName: 'v2 (사용자 편집 및 세부 목차 추가)',
    title: '사용자 편집 및 세부 목차 추가',
    time: '14:30',
    createdAt: '14:30',
    author: '정소담',
    content: INITIAL_EDITOR_CONTENT
  },
  {
    id: 'v1',
    versionCode: 'v1',
    versionName: 'v1 (AI 최초 초안 생성)',
    title: 'AI 최초 초안 생성',
    time: '10:22',
    createdAt: '10:22',
    author: 'AI & 정소담',
    content: INITIAL_EDITOR_CONTENT
  }
];

export const SAMPLE_AI_REVIEW = {
  overallScore: 88,
  items: SAMPLE_REVIEW_SUGGESTIONS.map(s => ({
    id: s.id,
    title: s.category,
    category: s.category,
    severity: '높음' as const,
    description: s.issue,
    suggestion: s.aiSuggestion
  }))
};

export const SAMPLE_CITATION_SOURCES = SAMPLE_CITATIONS.map(c => ({
  id: c.id,
  title: c.fileName,
  page: c.page,
  section: c.dataType,
  snippet: c.originalQuote
}));

export const SAMPLE_TASKS = SAMPLE_MY_TASKS.map((t, idx) => ({
  ...t,
  sectionNumber: `${idx + 1}.1`,
  sectionTitle: t.section,
  targetPages: 8,
  targetWords: 3000,
  currentWords: 2100,
  assignee: '정소담',
  reviewer: '김민수'
}));

export const INITIAL_PROPOSAL_STRUCTURE = INITIAL_PROPOSAL_OUTLINE.map(item => ({
  ...item,
  sectionNumber: item.code,
  pageEstimate: item.targetPages || 6,
  assignee: item.author || '정소담',
  children: item.children?.map(sub => ({
    ...sub,
    sectionNumber: sub.code,
    pageEstimate: sub.targetPages || 4,
    assignee: sub.author || '정소담',
    rfpMappingReqs: ['REQ-001', 'REQ-002']
  }))
}));

