import { CommunityAgent, AgentConnectorItem } from '../types';

export const INITIAL_COMMUNITY_AGENTS: CommunityAgent[] = [
  {
    id: 'comm-meeting-ai',
    title: '회의록 정리 AI를 만들어보고 있습니다',
    devType: 'AI Agent 개발',
    devStatus: '테스트 중',
    version: 'v0.4',
    oneLineDesc: '회의 내용을 자동으로 분석해 핵심 논의사항, 주요 의사결정, 담당자별 Action Item을 정리하는 AI입니다.',
    shortDesc: '회의 내용을 자동으로 분석해 핵심 논의사항, 주요 의사결정, 담당자별 Action Item을 정리하는 AI입니다.',
    description: `회의 내용을 자동으로 분석해\n- 핵심 논의사항\n- 주요 의사결정\n- 담당자별 Action Item\n을 정리하는 기능을 개발하고 있습니다.\n\n현재는 기본적인 회의 요약 기능까지 구현했습니다. 임직원분들의 피드백을 받아 화자 분리와 KPC 내부 용어 사전 연결을 계속 고도화하고 있습니다.`,
    problemAndBackground: '매주 2~3회 이상 진행되는 대면/화상 미팅 후 회의록 작성 및 후속 조치 전파에 1시간 이상 소요되는 비효율을 해소하고, 논의 중 발생한 업무 할 일이 누락되지 않도록 자동화하고자 시작했습니다.',
    implementedFeatures: '• 회의 대화록 및 음성 전사 텍스트 자동 요약\n• [안건명 - 결정사항 - 담당자/마감일] 3단 표준 표 생성\n• KPC 내부 직제 및 주요 프로젝트 코드 자동 매핑\n• 화자(발화자) 분리 및 발언 맥락 분석 (v0.4 신규)',
    testingProgress: '현재 AI전략팀 및 DX추진단 주간 미팅 5회에 걸쳐 실전 파일럿 테스트를 진행 중이며, 요약 정확도 92% 이상을 기록하고 있습니다.',
    plannedFeatures: '• Teams/Zoom 실시간 전사 연동 및 자동 녹음 파일 수신\n• Action Item 확정 시 사내 메일 및 캘린더 자동 등록\n• 기밀 안건 감지 시 마스킹 필터링',
    feedbackWanted: '1. 본부별로 특별히 자주 쓰는 회의록 양식이 있으신가요?\n2. 회의록 내 [보안 등급 분류] 기능이 필요할지 현업 의견이 궁금합니다!\n3. 화자 분리 시 동명이인 처리에 대한 아이디어를 공유해주세요.',
    author: '정소담',
    department: 'AI전략팀',
    category: '회의·요약',
    createdAt: '2026.09.11',
    updatedAt: '2026.09.17',
    likes: 38,
    userLiked: false,
    views: 480,
    commentsCount: 6,
    status: '테스트 중',
    developmentType: 'agent',
    tags: ['회의', '업무자동화', '문서요약'],
    screenshots: [
      'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80'
    ],
    prototypeUrl: 'https://demo.kpc.ai/prototype/meeting-summarizer',
    timelineUpdates: [
      {
        version: 'v0.4',
        date: '2026.09.17',
        title: '화자 분리 및 KPC 내부 용어 사전 적용',
        changes: [
          '화자(Speaker) 대화 분리 알고리즘 탑재',
          'KPC 2026 표준 직제 및 용어 사전 DB 연결',
          'Action Item 추출 정확도 대폭 개선 (+18%p)',
          '담당자 마감일 자동 D-Day 뱃지 렌더링'
        ],
        author: '정소담'
      },
      {
        version: 'v0.3',
        date: '2026.09.14',
        title: 'Action Item 추출 및 표 서식화 추가',
        changes: [
          '회의록 하단 Action Item 분리 추출 기능 탑재',
          '마감일(YYYY.MM.DD) 자동 인식 로직 적용'
        ],
        author: '정소담'
      },
      {
        version: 'v0.2',
        date: '2026.09.08',
        title: '회의 요약 기본 기능 구현',
        changes: [
          '긴 텍스트 입력 시 3개 핵심 안건 자동 요약',
          '불필요한 인사말 및 추임새 필터링'
        ],
        author: '정소담'
      },
      {
        version: 'v0.1',
        date: '2026.09.01',
        title: '아이디어 공유 및 초기 프롬프트 테스트',
        changes: [
          '사내 개발 커뮤니티 최초 발의 및 피드백 요청'
        ],
        author: '정소담'
      }
    ],
    comments: [
      {
        id: 'comm-c-1',
        author: '김OO',
        department: 'DX본부',
        content: '회의에서 화자별로 내용을 구분해서 보여줄 수 있나요? 특히 다자간 회의 때 발언자가 뒤섞이면 확인이 어렵더라고요.',
        createdAt: '2026.09.12 14:20',
        likes: 5,
        replies: [
          {
            id: 'comm-c-1-rep',
            author: '정소담 (작성자)',
            department: 'AI전략팀',
            content: '@김OO 좋은 의견 감사합니다! v0.4 업데이트에 음성 지문 및 화자 분리 기능을 바로 추가하여 반영했습니다.',
            createdAt: '2026.09.17 09:30',
            likes: 4
          },
          {
            id: 'comm-c-1-rep2',
            author: '김OO',
            department: 'DX본부',
            content: '@정소담 (작성자) 빠른 반영 정말 감사드립니다! 다음 주 본부 주간회의 때 바로 테스트해보고 피드백 드릴게요.',
            createdAt: '2026.09.17 11:05',
            likes: 2
          }
        ]
      },
      {
        id: 'comm-c-2',
        author: '박OO',
        department: '컨설팅본부',
        content: 'KPC 내부 약어(예: DIA, K-DX, 산인공 등)를 별도로 연결시키면 요약 품질이 훨씬 좋아질 것 같습니다.',
        createdAt: '2026.09.13 11:15',
        likes: 7,
        replies: [
          {
            id: 'comm-c-2-rep',
            author: '정소담 (작성자)',
            department: 'AI전략팀',
            content: '@박OO v0.4에 1차 용어 사전을 적용했으며, 다음 버전에 본부별 전문 용어집 업로드 기능을 추가할 예정입니다.',
            createdAt: '2026.09.17 10:10',
            likes: 3
          }
        ]
      },
      {
        id: 'comm-c-3',
        author: '이OO',
        department: '인재개발원',
        content: 'Teams 화상회의 녹음본이나 텍스트를 복사할 필요 없이 원클릭으로 바로 가져올 수 있으면 좋겠습니다.',
        createdAt: '2026.09.15 16:40',
        likes: 3,
        replies: [
          {
            id: 'comm-c-3-rep',
            author: '정소담 (작성자)',
            department: 'AI전략팀',
            content: '@이OO Teams 웹훅 연동 API를 DX추진단과 검토 중입니다. v0.5 계획에 반영하겠습니다!',
            createdAt: '2026.09.16 09:12',
            likes: 2
          }
        ]
      },
      {
        id: 'comm-c-3-b',
        author: '조OO',
        department: '사업기획팀',
        content: '회의록 내 담당자별 Action Item을 추출할 때 완료 마감일(D-Day)까지 캘린더에 바로 등록되는 연동도 가능할까요?',
        createdAt: '2026.09.16 14:10',
        likes: 6,
        replies: [
          {
            id: 'comm-c-3-b-rep',
            author: '정소담 (작성자)',
            department: 'AI전략팀',
            content: '@조OO 네, 마이크로소프트 365 캘린더 및 To-Do 연동 커넥터와 결합을 준비하고 있습니다.',
            createdAt: '2026.09.16 16:50',
            likes: 3
          }
        ]
      },
      {
        id: 'comm-c-3-c',
        author: '한OO',
        department: '정보보안팀',
        content: '보안 등급이 높은 회의록의 경우 사내 외부 LLM 전송 시 마스킹 필터링이 잘 동작하는지 보안성 검토 시 확인 부탁드립니다.',
        createdAt: '2026.09.17 08:45',
        likes: 4,
        replies: [
          {
            id: 'comm-c-3-c-rep',
            author: '정소담 (작성자)',
            department: 'AI전략팀',
            content: '@한OO 주민번호, 계좌번호 등 개인정보 및 대외비 문구 자동 마스킹 모듈을 기본 탑재해 두었습니다!',
            createdAt: '2026.09.17 09:15',
            likes: 3
          }
        ]
      }
    ]
  },
  {
    id: 'comm-receipt-ocr',
    title: '법인카드 영수증 OCR 및 규정 검증 AI 개발 중',
    devType: 'Custom AI 개발',
    devStatus: '개발 중',
    version: 'v0.7',
    oneLineDesc: '영수증 사진을 올리면 사용처, 금액, 부가세를 추출하고 KPC 여비/회계 규정 위반 여부를 검증합니다.',
    shortDesc: '영수증 사진을 올리면 사용처, 금액, 부가세를 추출하고 KPC 여비/회계 규정 위반 여부를 검증합니다.',
    description: '스마트폰으로 촬영한 법인카드 영수증 이미지를 업로드하면 OCR로 필수 항목을 추출하고, 야간/주말 사용 기준 및 1인당 식대 한도 초과 여부를 사내 규정 엔진으로 자동 대조해주는 독립 UI 기반 서비스입니다.',
    problemAndBackground: '매월 말 경비 정산 시 영수증 내역을 수기 입력하고 품의 규정을 일일이 확인하는 데 전 직원의 시간이 과도하게 낭비되는 문제를 해결하고자 합니다.',
    implementedFeatures: '• 모바일/PC 영수증 사진 Drag & Drop OCR 인식\n• 사용 시간(심야/주말), 주류 항목, 1인당 한도(3만원) 규정 필터링\n• ERP 전자결재 상신용 엑셀 및 JSON 양식 변환',
    testingProgress: '경영지원본부 및 총무팀 8명을 대상으로 100장의 영수증 샘플 인식 테스트 완료 (인식률 96.8%).',
    plannedFeatures: '• 국세청 홈택스 사업자등록 상태 실시간 진단\n• 여러 장의 영수증 일괄 묶음 정산 대시보드',
    feedbackWanted: '회계 전표 작성 시 가장 번거로운 입력 항목이 무엇인지 알려주시면 반영하겠습니다.',
    author: '박OO',
    department: '경영지원본부',
    category: '행정·회계',
    createdAt: '2026.09.08',
    updatedAt: '2026.09.16',
    likes: 42,
    userLiked: false,
    views: 520,
    commentsCount: 5,
    status: '개발 중',
    developmentType: 'custom_ai',
    tags: ['영수증', '회계', 'CustomAI', 'OCR'],
    screenshots: [
      'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80'
    ],
    prototypeUrl: 'https://demo.kpc.ai/prototype/receipt-validator',
    timelineUpdates: [
      {
        version: 'v0.7',
        date: '2026.09.16',
        title: 'ERP 연동 포맷 표준화',
        changes: ['사내 ERP 양식에 맞는 CSV 내보내기 기능 추가', '흐릿한 영수증 전처리 필터 개선'],
        author: '박OO'
      },
      {
        version: 'v0.4',
        date: '2026.09.09',
        title: '규정 위반 감지 로직 적용',
        changes: ['1인당 식비 초과 및 휴일 사용 시 붉은색 경고 뱃지 표시'],
        author: '박OO'
      }
    ],
    comments: [
      {
        id: 'comm-c-4',
        author: '최OO',
        department: '총무팀',
        content: '식대 분할 결제 시 참석자 명단 입력 필드가 영수증 옆에 바로 있으면 품의서 쓰기 정말 편할 것 같습니다.',
        createdAt: '2026.09.10 10:20',
        likes: 6,
        replies: [
          {
            id: 'comm-c-4-rep1',
            author: '박OO (작성자)',
            department: '경영지원본부',
            content: '@최OO 좋은 아이디어입니다! 사내 주소록과 연동해 참석자 이름을 타이핑하면 사번과 부서가 자동 완성되도록 개발하겠습니다.',
            createdAt: '2026.09.11 15:40',
            likes: 4
          }
        ]
      },
      {
        id: 'comm-c-4-b',
        author: '임OO',
        department: '회계팀',
        content: '주말이나 공휴일 결제 건의 경우 업무 관련 사유서를 의무적으로 첨부하도록 팝업 알림을 띄워줄 수 있나요?',
        createdAt: '2026.09.12 11:30',
        likes: 8,
        replies: [
          {
            id: 'comm-c-4-b-rep',
            author: '박OO (작성자)',
            department: '경영지원본부',
            content: '@임OO 네! 휴일/심야 결제 감지 시 사유서 작성 템플릿 모달이 자동으로 뜨도록 로직을 추가했습니다.',
            createdAt: '2026.09.13 09:20',
            likes: 5
          }
        ]
      },
      {
        id: 'comm-c-4-c',
        author: '송OO',
        department: '컨설팅본부',
        content: '구겨지거나 영수증 글씨가 흐릿하게 찍힌 사진도 보정해서 인식되나요?',
        createdAt: '2026.09.14 16:15',
        likes: 3,
        replies: [
          {
            id: 'comm-c-4-c-rep',
            author: '박OO (작성자)',
            department: '경영지원본부',
            content: '@송OO v0.7에서 대비(Contrast) 자동 보정 필터를 적용해 흐릿한 감열지 영수증 인식률을 90% 이상으로 끌어올렸습니다.',
            createdAt: '2026.09.15 10:05',
            likes: 4
          }
        ]
      }
    ]
  },
  {
    id: 'comm-rfp-agent',
    title: 'RFP 제안요건 및 평가기준 분석 AI (제출 완료)',
    devType: 'AI Agent 개발',
    devStatus: '공식 등록 검토 중',
    version: 'v0.9',
    oneLineDesc: 'RFP 공고문을 넣으면 필수 입찰 자격, 기술평가 배점표, 감점 조항을 도출하여 제안 리스크를 사전 점검합니다.',
    shortDesc: 'RFP 공고문을 넣으면 필수 입찰 자격, 기술평가 배점표, 감점 조항을 도출하여 제안 리스크를 사전 점검합니다.',
    description: '제안서 작업 초기에 수백 페이지의 과업지시서와 제안요청서를 분석하는 시간을 단축하기 위해 제작했습니다. 10여 차례의 사내 실전 테스트를 거쳐 완성도를 높였으며 공식 AI 등록을 위해 관리자에게 제출했습니다.',
    problemAndBackground: '공공/민간 입찰 공고마다 상이한 평가 기준을 수작업으로 검토하다가 필수 자격을 놓치는 치명적 리스크를 사전에 예방하기 위해 기획되었습니다.',
    implementedFeatures: '• PDF/HWP 제안요청서 자동 파싱\n• 기술 80 / 가격 20 배점 체계 및 정량평가 지표 표 추출\n• 부정당업자 감점, 지역제한, CMMI 등 필수 자격 조건 하이라이트\n• KPC 수주 전략 권고사항 3선 도출',
    testingProgress: '최근 6개월간 공공입찰 15건을 대상으로 검증하였으며, 평가 배점 누락률 0% 달성.',
    plannedFeatures: '관리자 승인 후 공식 AI 서비스로 전사 배포 예정',
    feedbackWanted: '관리자 검수 전 추가로 점검할 보안 사항이 있는지 의견 부탁드립니다.',
    author: '정소담',
    department: 'AI전략팀',
    category: 'RFP·제안',
    createdAt: '2026.09.05',
    updatedAt: '2026.09.16',
    likes: 65,
    userLiked: true,
    views: 890,
    commentsCount: 9,
    status: '검수 요청',
    developmentType: 'agent',
    tags: ['RFP', '제안서', '업무자동화', '공식제출'],
    prototypeUrl: 'https://demo.kpc.ai/prototype/rfp-analyzer',
    officialSubmission: {
      submittedAt: '2026.09.16 15:30',
      aiName: 'RFP 제안요건 및 평가배점 분석 AI',
      keyFeatures: '제안요청서 내 필수 자격 요건, 기술평가 배점표, 감점 조항, 차별화 전략 자동 추출',
      problemSolved: '초기 RFP 분석 시간 단축 (평균 3일 -> 10분) 및 입찰 리스크 사전 탐지',
      targetUsers: '제안PM, 사업기획 담당자, 영업 대표',
      currentDevStatus: '제출 준비 완료 (사내 검증 15건 통과)',
      version: 'v0.9',
      howToUse: 'RFP 원문 텍스트 또는 파일 업로드 후 분석 버튼 클릭',
      usedModels: ['GPT-4o Enterprise', 'Gemini 2.5 Flash'],
      usedInternalData: 'KPC 과거 수주 제안서 평가 사례 DB, 공공입찰 법령집',
      usedExternalData: '조달청 나라장터 공고 API',
      usedApisAndConnectors: '사내 RAG 검색 커넥터, SharePoint',
      hasPersonalInfo: false,
      hasSensitiveInfo: false,
      usesInternalSystem: true,
      usesExternalLlmAnonymization: true,
      developerName: '정소담',
      department: 'AI전략팀',
      coDevelopers: '김OO (컨설팅본부)',
      operatorName: '정소담 책임',
      adminReviewStatus: '검토 중'
    },
    timelineUpdates: [
      {
        version: 'v0.9',
        date: '2026.09.16',
        title: '관리자 공식 등록 제출 완료',
        changes: ['공식 AI 등록 심의를 위한 보안성 점검표 및 평가 데이터 제출'],
        author: '정소담'
      },
      {
        version: 'v0.8',
        date: '2026.09.10',
        title: '3단 구조화 출력 및 배점 계산 로직 탑재',
        changes: ['정량 배점 자동 계산기 추가', '신용평가등급 매핑 테이블 연결'],
        author: '정소담'
      }
    ],
    comments: [
      {
        id: 'comm-c-5',
        author: '박OO',
        department: '제안사업본부',
        content: '실제 제안 공고 2건 돌려봤는데 평가표가 완벽하게 뽑힙니다. 빨리 공식 등록 승인되었으면 좋겠네요!',
        createdAt: '2026.09.15 14:00',
        likes: 9,
        replies: [
          {
            id: 'comm-c-5-rep',
            author: '정소담 (작성자)',
            department: 'AI전략팀',
            content: '@박OO 좋은 테스트 후기 감사합니다! 관리자 검수 통과 즉시 전사 공식 서비스로 제공될 예정입니다.',
            createdAt: '2026.09.15 17:20',
            likes: 5
          }
        ]
      },
      {
        id: 'comm-c-5-b',
        author: '윤OO',
        department: '공공컨설팅팀',
        content: 'HWP 한글 파일로 된 제안요청서도 표 깨짐 없이 파싱이 원활한가요?',
        createdAt: '2026.09.16 10:45',
        likes: 4,
        replies: [
          {
            id: 'comm-c-5-b-rep',
            author: '정소담 (작성자)',
            department: 'AI전략팀',
            content: '@윤OO 네, 사내 HWP 전용 파서 엔진을 연동하여 복잡한 중첩 표 구조도 깔끔하게 마크다운 표로 변환됩니다.',
            createdAt: '2026.09.16 13:10',
            likes: 3
          }
        ]
      },
      {
        id: 'comm-c-5-c',
        author: '오OO',
        department: '경영전략실',
        content: '과거 3개년 동안 KPC가 수주했던 유사 사업 제안서 데이터베이스와도 연계되나요?',
        createdAt: '2026.09.16 16:30',
        likes: 6,
        replies: [
          {
            id: 'comm-c-5-c-rep',
            author: '정소담 (작성자)',
            department: 'AI전략팀',
            content: '@오OO 네, 과거 수주 제안서의 핵심 강점 목차를 추천해 주는 RAG 모듈이 공식 버전 출시 때 함께 활성화됩니다.',
            createdAt: '2026.09.16 18:00',
            likes: 4
          }
        ]
      }
    ]
  },
  {
    id: 'comm-data-cleansing',
    title: '공공 교육 이력 데이터 정제 및 이상치 탐지 AI',
    devType: 'AI Agent 개발',
    devStatus: '개발 중',
    version: 'v0.3',
    oneLineDesc: 'HRD-Net 등 공공 연계 교육 훈련생 데이터의 중복 번호, 결측치, 이상치를 자동으로 탐지하고 정제합니다.',
    shortDesc: 'HRD-Net 등 공공 연계 교육 훈련생 데이터의 중복 번호, 결측치, 이상치를 자동으로 탐지하고 정제합니다.',
    description: '매월 수만 건에 달하는 국비지원 및 공공위탁 교육 수료생 데이터에서 주민번호 오기, 수료시간 결측, 중복 등록 데이터를 사내 표준 검증 규칙으로 전처리해주는 에이전트입니다.',
    problemAndBackground: '사후 정산 및 노동부 지도점검 시 데이터 오류로 인한 행정처분 위험을 선제적으로 예방하고자 개발 중입니다.',
    implementedFeatures: '• 엑셀 파일 업로드 시 결측치/중복 항목 히트맵 시각화\n• 표준 전화번호, 주민번호 형식 정규식 자동 보정\n• 노동부 보고용 CSV 출력',
    testingProgress: '자격사업본부 2026년 상반기 데이터 5,000건 샘플 테스트 진행 중.',
    plannedFeatures: '• 이상 징후 발생 시 담당자 자동 알림 봇 연동',
    feedbackWanted: '사업부서별로 자주 발생하는 특이 데이터 케이스를 공유해주시면 검증 규칙에 추가하겠습니다.',
    author: '강OO',
    department: 'DX추진단',
    category: '데이터 정제',
    createdAt: '2026.09.14',
    updatedAt: '2026.09.17',
    likes: 24,
    userLiked: false,
    views: 310,
    commentsCount: 5,
    status: '개발 중',
    developmentType: 'agent',
    tags: ['데이터정제', '교육행정', '이상치탐지'],
    prototypeUrl: 'https://demo.kpc.ai/prototype/data-cleansing',
    screenshots: [
      'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&auto=format&fit=crop&q=80'
    ],
    timelineUpdates: [
      {
        version: 'v0.3',
        date: '2026.09.17',
        title: '대용량 엑셀 스트리밍 처리 추가',
        changes: ['5만 행 이상 파일 처리 속도 개선 (30초 -> 3초)'],
        author: '강OO'
      }
    ],
    comments: [
      {
        id: 'comm-c-dc-1',
        author: '윤OO',
        department: '고용사업팀',
        content: '외국인 훈련생의 외국인등록번호 형식도 함께 검증되도록 해주실 수 있나요?',
        createdAt: '2026.09.15 11:20',
        likes: 4,
        replies: [
          {
            id: 'comm-c-dc-1-rep',
            author: '강OO (작성자)',
            department: 'DX추진단',
            content: '@윤OO 좋은 지적 감사합니다! 외국인등록번호 체크섬 유효성 검사식을 정규식 필터에 추가했습니다.',
            createdAt: '2026.09.15 15:40',
            likes: 3
          }
        ]
      },
      {
        id: 'comm-c-dc-2',
        author: '서OO',
        department: '자격인증팀',
        content: '성명 앞뒤에 들어간 공백(스페이스)이나 특수문자 전처리도 같이 되나요?',
        createdAt: '2026.09.16 09:50',
        likes: 5,
        replies: [
          {
            id: 'comm-c-dc-2-rep',
            author: '강OO (작성자)',
            department: 'DX추진단',
            content: '@서OO 네! Trimming 및 유니코드 보이지 않는 공백 문자까지 일괄 정제됩니다.',
            createdAt: '2026.09.16 11:10',
            likes: 2
          }
        ]
      },
      {
        id: 'comm-c-dc-3',
        author: '김OO',
        department: '인재개발본부',
        content: '대용량 파일 업로드 시 브라우저가 멈추지 않고 진행률(%)이 표시되면 더 좋겠습니다.',
        createdAt: '2026.09.17 10:00',
        likes: 3
      }
    ]
  },
  {
    id: 'comm-onboarding-idea',
    title: '신규 입사자 온보딩 가이드 AI 아이디어 제안',
    devType: 'AI 아이디어',
    devStatus: '아이디어 단계',
    version: 'v0.1',
    oneLineDesc: '신규 입사자가 사내 시스템, 복지, 결재선, 메신저 사용법을 대화형으로 질문할 수 있는 AI 아이디어입니다.',
    shortDesc: '신규 입사자가 사내 시스템, 복지, 결재선, 메신저 사용법을 대화형으로 질문할 수 있는 AI 아이디어입니다.',
    description: '입사 첫 달 동안 선배들에게 매번 사소한 사내 규정이나 결재 경로를 물어보기 부담스러워하는 신규 입사자들을 위해, 사내 편람과 FAQ를 기반으로 친절하게 알려주는 온보딩 비서를 기획하고 있습니다.',
    problemAndBackground: '신규 입사자의 조직 적응 시간을 단축하고 온보딩 멘토의 반복적인 안내 업무를 줄이기 위해 발의했습니다.',
    implementedFeatures: '현재는 아이디어 및 사내 온보딩 매뉴얼 목차 취합 단계입니다.',
    testingProgress: '아이디어 구상 중',
    plannedFeatures: '• 입사 1주차/2주차 필수 체크리스트 알림\n• 사내 ERP 결재라인 자동 추천 봇\n• 부서별 웰컴 가이드북 자동 생성',
    feedbackWanted: '신규 입사했을 때 가장 헷갈렸던 규정이나 시스템이 무엇이었는지 댓글로 남겨주시면 개발에 큰 힘이 됩니다!',
    author: '정소담',
    department: 'AI전략팀',
    category: '인사·총무',
    createdAt: '2026.09.16',
    updatedAt: '2026.09.16',
    likes: 29,
    userLiked: false,
    views: 310,
    commentsCount: 6,
    status: '아이디어',
    developmentType: 'agent',
    tags: ['온보딩', '아이디어', '인사', '신규입사자'],
    prototypeUrl: 'https://demo.kpc.ai/prototype/onboarding-guide',
    timelineUpdates: [
      {
        version: 'v0.1',
        date: '2026.09.16',
        title: '사내 AI 개발 커뮤니티에 아이디어 발의',
        changes: ['온보딩 비서 기획안 공유 및 임직원 의견 수렴 시작'],
        author: '정소담'
      }
    ],
    comments: [
      {
        id: 'comm-c-8',
        author: '강OO',
        department: '인사팀',
        content: '인사팀에서도 정말 필요했던 아이디어입니다! 인사팀 매뉴얼 및 FAQ 최신본을 적극 공유해 드리겠습니다.',
        createdAt: '2026.09.16 17:30',
        likes: 12,
        replies: [
          {
            id: 'comm-c-8-rep1',
            author: '정소담 (작성자)',
            department: 'AI전략팀',
            content: '@강OO 인사팀 지원 감사드립니다! 제공해주시는 FAQ를 기반으로 RAG 인덱싱을 먼저 구성해보겠습니다.',
            createdAt: '2026.09.16 18:20',
            likes: 6
          },
          {
            id: 'comm-c-8-rep2',
            author: '강OO',
            department: '인사팀',
            content: '@정소담 (작성자) 네, 내일 오전 중으로 최신 2026년 인사편람 문서 보내드리겠습니다.',
            createdAt: '2026.09.17 08:30',
            likes: 3
          }
        ]
      },
      {
        id: 'comm-c-9',
        author: '신OO',
        department: '신사업개발팀',
        content: '처음 입사했을 때 복지포인트 신청 방법과 연차 상신 규정이 제일 헷갈렸는데, 그런 실생활 가이드도 포함되면 좋겠습니다.',
        createdAt: '2026.09.17 09:10',
        likes: 7,
        replies: [
          {
            id: 'comm-c-9-rep',
            author: '정소담 (작성자)',
            department: 'AI전략팀',
            content: '@신OO 복지포인트, 건강검진, 휴가 신청 등 자주 묻는 질문을 Top 10 시나리오로 우선 구현하겠습니다!',
            createdAt: '2026.09.17 10:15',
            likes: 4
          }
        ]
      },
      {
        id: 'comm-c-10',
        author: '배OO',
        department: 'IT인프라팀',
        content: '사내 와이파이 설정법이나 복합기 드라이버 설치 가이드도 봇에서 안내 가능할까요?',
        createdAt: '2026.09.17 11:40',
        likes: 5
      }
    ]
  }
];

export const DEFAULT_AGENT_CONNECTORS: AgentConnectorItem[] = [
  {
    id: 'conn-internal-search',
    name: '내부 검색',
    desc: 'KPC 지식 포털 및 사내 규정 고속 검색',
    status: '연결됨',
    permStatus: '승인됨',
    enabled: true,
    iconType: 'search'
  },
  {
    id: 'conn-sharepoint',
    name: 'SharePoint',
    desc: 'M365 부서 문서 보관소 실시간 검색 및 색인',
    status: '연결됨',
    permStatus: '승인됨',
    enabled: true,
    iconType: 'file-text'
  },
  {
    id: 'conn-onedrive',
    name: 'OneDrive',
    desc: '개인 클라우드 저장소 업무자료 연동',
    status: '연결됨',
    permStatus: '승인됨',
    enabled: false,
    iconType: 'cloud'
  },
  {
    id: 'conn-teams',
    name: 'Teams',
    desc: '사내 메신저 알림 및 채널 실시간 연동',
    status: '연결됨',
    permStatus: '승인됨',
    enabled: false,
    iconType: 'message-square'
  },
  {
    id: 'conn-erp',
    name: 'ERP 조회',
    desc: '사내 프로젝트 코드 및 예산 집행 현황',
    status: '미연결',
    permStatus: '권한 필요',
    enabled: false,
    iconType: 'database'
  },
  {
    id: 'conn-education',
    name: '교육과정 조회',
    desc: 'KPC 연간 교육과정 및 수강 정보 검색',
    status: '연결됨',
    permStatus: '승인됨',
    enabled: true,
    iconType: 'book-open'
  },
  {
    id: 'conn-certification',
    name: '자격정보 조회',
    desc: '공인 자격시험 일정 및 규정 데이터베이스',
    status: '연결됨',
    permStatus: '승인됨',
    enabled: false,
    iconType: 'award'
  },
  {
    id: 'conn-external-api',
    name: '외부 API',
    desc: '조달청 나라장터 공고 및 통계 API',
    status: '연결됨',
    permStatus: '승인됨',
    enabled: false,
    iconType: 'globe'
  }
];

export const AGENT_MODELS = [
  { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', provider: 'Google', speed: '초고속 (0.4s)', cost: '저비용', desc: '실시간 지식 검색 및 빠른 일상 업무 처리에 최적화' },
  { id: 'gpt-4o', name: 'GPT-4o Enterprise', provider: 'OpenAI', speed: '고속 (0.9s)', cost: '표준', desc: '복합 비즈니스 논리 및 심층 문서 분석 추천' },
  { id: 'claude-3.7-sonnet', name: 'Claude 3.7 Sonnet', provider: 'Anthropic', speed: '보통 (1.4s)', cost: '고품질', desc: '정교한 지침 준수 및 장문 제안서 분석' },
  { id: 'kpc-core-slm', name: 'KPC Enterprise Core', provider: 'KPC 자체 On-prem', speed: '초고속 (0.3s)', cost: '사내 무제한', desc: '사내 민감 정보 처리 및 내부 보안 가이드 준수' }
];

export const COMMUNITY_FILTERS = [
  '전체',
  '내가 작성한 글',
  '내가 보관한 글'
] as const;

export const COMMUNITY_SORT_OPTIONS = [
  '최신순',
  '좋아요순',
  '댓글순',
  '사용량순'
] as const;

export const AGENT_TAG_PRESETS = [
  '업무자동화',
  '문서작성',
  '회의록',
  '컨설팅',
  '자격시험',
  '데이터분석',
  '기획',
  '인사/교육',
  '고객응대',
  '보안/규정'
];

export const AGENT_CATEGORIES = [
  '업무자동화',
  '문서작성',
  '컨설팅지원',
  '자격/교육',
  '데이터분석',
  '기타'
];
