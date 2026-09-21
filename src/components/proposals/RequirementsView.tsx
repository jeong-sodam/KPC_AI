import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  Square, 
  Plus, 
  Download, 
  Search, 
  Edit3, 
  Trash2, 
  ArrowRight,
  BookOpen,
  X,
  FileCheck,
  AlertCircle,
  FileText,
  Copy,
  Check,
  Clock,
  User,
  ShieldAlert,
  Info,
  Calendar,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { ProposalProject } from '../../types';
import { RfpAnalysisRequiredState } from './RfpAnalysisRequiredState';

export interface ChecklistRequirement {
  id: string;
  category: '제출기한/장소' | '제출부수/매체' | '서식/규격' | '날인/밀봉' | '증빙/별첨' | '발표/기타' | string;
  text: string;                  // 실제 확인하거나 수행해야 하는 체크리스트 내용
  source: string;                // RFP 출처 (예: RFP p.42 / 7. 제안서 제출방법)
  rfpPage?: number;               // 해당 RFP 페이지 번호 (뷰어 이동용)
  rfpQuote?: string;             // RFP 원문 발췌문
  checked: boolean;              // 완료 여부
  completedBy?: string;          // 완료한 사용자의 이름 (예: 정소담, 김민수, -)
  completedAt?: string;          // 완료 일시 (예: 2026-09-17 14:30)
  type?: string;                 // 레거시 호환용 필드
  assignedSection?: string;
  bodyPage?: string;
}

export function formatRfpPageOnly(source?: string, rfpPage?: number): string {
  if (rfpPage) return `p.${rfpPage}`;
  if (!source) return 'p.1';
  const match = source.match(/p\.\s*(\d+)/i) || source.match(/(\d+)\s*p/i) || source.match(/(\d+)\s*페이지/i);
  if (match && match[1]) return `p.${match[1]}`;
  const digits = source.replace(/[^\d]/g, '');
  if (digits) return `p.${digits}`;
  return source.split(' ')[0] || 'p.1';
}

export function formatProposalBodyPage(item: ChecklistRequirement): string {
  if (item.bodyPage) return item.bodyPage.startsWith('p.') ? item.bodyPage : `p.${item.bodyPage}`;
  return '-';
}

// 실무적인 제출·준수 사항 중심의 AI 추출 초기 체크리스트
export const INITIAL_KPC_CHECKLIST: ChecklistRequirement[] = [
  {
    id: 'CHK-001',
    category: '제출기한/장소',
    text: '제안서 제출 마감 일시 (2026년 10월 15일 17:00까지) 엄수',
    source: 'RFP p.4 / 1. 입찰 및 제안 안내',
    rfpPage: 4,
    rfpQuote: '입찰 마감 일시: 2026년 10월 15일(목) 17:00까지 (마감시간 이후 정각 제출 불가)',
    checked: true,
    completedBy: '정소담',
    completedAt: '2026-09-16 11:20',
    type: '체크사항'
  },
  {
    id: 'CHK-002',
    category: '제출기한/장소',
    text: '제출 장소: 서울 종로구 KPC 본사 10층 사업관리팀 직접 방문 제출 (우편 및 이메일 제출 불가)',
    source: 'RFP p.4 / 1. 입찰 및 제안 안내',
    rfpPage: 4,
    rfpQuote: '제출 장소: 서울시 종로구 적선동 KPC 본사 10층 사업관리팀 직접 방문 제출 (우편 접수 불가)',
    checked: true,
    completedBy: '정소담',
    completedAt: '2026-09-16 11:22',
    type: '체크사항'
  },
  {
    id: 'CHK-003',
    category: '제출기한/장소',
    text: '나라장터 e-발주 시스템 온라인 전송 및 오프라인 방문 제출 동시 완료 확인',
    source: 'RFP p.4 / 1. 제출방법',
    rfpPage: 4,
    rfpQuote: '나라장터 e-발주 시스템 전자 제출 및 오프라인 서류 방문 제출을 마감 전 모두 완료해야 함',
    checked: true,
    completedBy: '김민수',
    completedAt: '2026-09-16 14:05',
    type: '체크사항'
  },
  {
    id: 'CHK-004',
    category: '제출부수/매체',
    text: '제안서 원본 1부 (대표자 법인인감 직인 날인본) 제출',
    source: 'RFP p.5 / 2. 제출서류 목록',
    rfpPage: 5,
    rfpQuote: '제안서 원본 1부: 표지에 법인인감(또는 사용인감) 날인 및 인감증명서 필수 첨부',
    checked: true,
    completedBy: '김민수',
    completedAt: '2026-09-16 15:30',
    type: '체크사항'
  },
  {
    id: 'CHK-005',
    category: '제출부수/매체',
    text: '제안서 사본 9부 (심사용, 업체명 및 직인 날인 생략) 제출',
    source: 'RFP p.5 / 2. 제출서류 목록',
    rfpPage: 5,
    rfpQuote: '제안서 사본 9부: 블라인드 평가용으로 표지 및 본문의 업체명/로고/직인 날인 엄격히 금지',
    checked: true,
    completedBy: '정소담',
    completedAt: '2026-09-17 09:10',
    type: '체크사항'
  },
  {
    id: 'CHK-006',
    category: '제출부수/매체',
    text: '제안서 최종 PDF 파일 및 발표자료(PPT)를 저장한 USB 메모리 1개 제출',
    source: 'RFP p.5 / 2. 제출서류 목록',
    rfpPage: 5,
    rfpQuote: '제안서 및 발표자료 최종 전자파일을 USB 메모리 1개에 저장하여 제안서 서류와 함께 제출',
    checked: false,
    completedBy: '-',
    type: '체크사항'
  },
  {
    id: 'CHK-007',
    category: '서식/규격',
    text: '제안서 본문 A4 규격 세로 방향 150쪽 이내 작성 (요약본 30쪽 이내 별도 작성)',
    source: 'RFP p.7 / 3. 제안서 작성지침',
    rfpPage: 7,
    rfpQuote: '제안서 본문 분량: A4 세로 규격 150쪽 이내 (요약본은 30쪽 이내 별도 작성하여 제출)',
    checked: true,
    completedBy: '정소담',
    completedAt: '2026-09-17 10:15',
    type: '체크사항'
  },
  {
    id: 'CHK-008',
    category: '서식/규격',
    text: '제안서 인쇄본 A4 양면 인쇄 후 좌철 책자 제본 (스프링/바인더/무선제본 금지)',
    source: 'RFP p.7 / 3. 제안서 작성지침',
    rfpPage: 7,
    rfpQuote: '인쇄 및 제본 규격: A4 양면 인쇄, 좌철 책자 제본 (스프링 및 바인더 사용 시 감점 처리)',
    checked: false,
    completedBy: '-',
    type: '체크사항'
  },
  {
    id: 'CHK-009',
    category: '서식/규격',
    text: '전자파일 제출 명명 규칙 [2026_KPC_생성형AI_제안서_기관명.pdf] 준수',
    source: 'RFP p.8 / 4. 파일제출 유의사항',
    rfpPage: 8,
    rfpQuote: '전자파일 파일명 지정 규칙: [연도_사업명_서류명_업체명.pdf] 형식 지정 필수',
    checked: true,
    completedBy: '김민수',
    completedAt: '2026-09-17 11:00',
    type: '체크사항'
  },
  {
    id: 'CHK-010',
    category: '날인/밀봉',
    text: '가격제안서(별지 제1호) 및 세부산출내역서 별도 작성 후 밀봉 봉투에 넣어 제출',
    source: 'RFP p.9 / 5. 가격제안서 제출',
    rfpPage: 9,
    rfpQuote: '가격제안서 및 세부산출내역서는 기술제안서와 분리하여 별도 봉투에 넣고 밀봉하여 제출',
    checked: false,
    completedBy: '-',
    type: '체크사항'
  },
  {
    id: 'CHK-011',
    category: '날인/밀봉',
    text: '가격제안서 밀봉 봉투 봉합 부위 3곳에 법인인감(또는 사용인감) 간인 날인 필수',
    source: 'RFP p.9 / 5. 가격제안서 제출',
    rfpPage: 9,
    rfpQuote: '밀봉 봉투의 봉합 부위 3곳에 법인인감(또는 사용인감)으로 간인 날인해야 유효함',
    checked: false,
    completedBy: '-',
    type: '체크사항'
  },
  {
    id: 'CHK-012',
    category: '증빙/별첨',
    text: '투입인력 전원 보안서약서(별지 제4호) 및 개인정보 처리 확약서 날인본 별첨 제출',
    source: 'RFP p.12 / 별첨 서식',
    rfpPage: 12,
    rfpQuote: '참여인력 전원의 보안서약서 원본 및 개인정보 보호 확약서를 제안서 별첨으로 수록할 것',
    checked: true,
    completedBy: '정소담',
    completedAt: '2026-09-17 13:40',
    type: '체크사항'
  },
  {
    id: 'CHK-013',
    category: '증빙/별첨',
    text: '최근 3개년 유사사업 실적증명서(발주기관 원본 확인 필) 증빙 서류 첨부',
    source: 'RFP p.14 / 제출서류 안내 표',
    rfpPage: 14,
    rfpQuote: '실적증명서: 발주기관 원본 확인 필 또는 조달청 발행 실적증명서 원본만 정량평가에 인정',
    checked: true,
    completedBy: '김민수',
    completedAt: '2026-09-17 14:15',
    type: '체크사항'
  },
  {
    id: 'CHK-014',
    category: '발표/기타',
    text: '발표평가용 PPT 발표자료 10월 18일 12:00까지 담당자 이메일 사전 제출',
    source: 'RFP p.15 / 6. 발표평가 유의사항',
    rfpPage: 15,
    rfpQuote: '발표자료 제출: 발표일 2일 전 12:00까지 이메일(ai_proposal@kpc.or.kr) 사전 제출 필수',
    checked: false,
    completedBy: '-',
    type: '체크사항'
  },
  {
    id: 'CHK-015',
    category: '발표/기타',
    text: '발표 당일 발표자(투입 PM) 재직증명서, 신분증 및 위임장 지참 (발표자 변경 불가)',
    source: 'RFP p.15 / 6. 발표평가 각주',
    rfpPage: 15,
    rfpQuote: '발표자는 본 사업 투입예정 PM에 한하며 발표 당일 재직증명서 및 신분증 지참 필수',
    checked: false,
    completedBy: '-',
    type: '체크사항'
  }
];

interface RequirementsViewProps {
  activeProject?: ProposalProject | null;
  onNavigateToProjects?: () => void;
  onNavigateToProjectRoot?: () => void;
  onNavigateNext: () => void;
  onShowToast: (msg: string) => void;
  requirementsList?: ChecklistRequirement[];
  onUpdateRequirements?: (list: ChecklistRequirement[]) => void;
  currentUserName?: string;
}

export const RequirementsView: React.FC<RequirementsViewProps> = ({
  activeProject,
  onNavigateToProjects,
  onNavigateToProjectRoot,
  onNavigateNext,
  onShowToast,
  requirementsList,
  onUpdateRequirements,
  currentUserName = '정소담'
}) => {
  // Lock screen if RFP analysis is not completed
  if (activeProject && activeProject.analysisStatus && activeProject.analysisStatus !== '분석 완료') {
    return (
      <RfpAnalysisRequiredState
        stepNumber="03"
        stepTitle="체크리스트"
        projectName={activeProject.title}
        onNavigateToStep1={() => {
          if (onNavigateToProjectRoot) onNavigateToProjectRoot();
        }}
      />
    );
  }

  const [items, setItems] = useState<ChecklistRequirement[]>(
    requirementsList || INITIAL_KPC_CHECKLIST
  );

  useEffect(() => {
    if (requirementsList) {
      setItems(requirementsList);
    }
  }, [requirementsList]);

  // Modals & Active Item State
  const [citationModalItem, setCitationModalItem] = useState<ChecklistRequirement | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ChecklistRequirement | null>(null);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<ChecklistRequirement | null>(null);

  // Form State
  const [formText, setFormText] = useState('');
  const [formCategory, setFormCategory] = useState<string>('제출기한/장소');
  const [formSource, setFormSource] = useState('RFP p.10 / 제출안내');
  const [formRfpQuote, setFormRfpQuote] = useState('');

  const syncItems = (newItems: ChecklistRequirement[]) => {
    setItems(newItems);
    if (onUpdateRequirements) {
      onUpdateRequirements(newItems);
    }
  };

  // Toggle Complete Check
  const handleToggleCheck = (id: string) => {
    const nowStr = new Date().toISOString().slice(0, 16).replace('T', ' ');
    const next = items.map(item => {
      if (item.id === id) {
        const nextChecked = !item.checked;
        const nextCompletedBy = nextChecked ? currentUserName : '-';
        const nextCompletedAt = nextChecked ? nowStr : undefined;

        if (nextChecked) {
          onShowToast(`'${item.text.slice(0, 20)}...' 항목을 완료 처리했습니다. (완료자: ${currentUserName})`);
        } else {
          onShowToast(`'${item.text.slice(0, 20)}...' 항목의 완료 상태를 해제했습니다.`);
        }

        return {
          ...item,
          checked: nextChecked,
          completedBy: nextCompletedBy,
          completedAt: nextCompletedAt
        };
      }
      return item;
    });
    syncItems(next);
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormText('');
    setFormCategory('제출기한/장소');
    setFormSource('RFP p.10 / 제출안내');
    setFormRfpQuote('');
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (item: ChecklistRequirement) => {
    setEditingItem(item);
    setFormText(item.text);
    setFormCategory(item.category || '제출기한/장소');
    setFormSource(item.source);
    setFormRfpQuote(item.rfpQuote || '');
    setIsAddModalOpen(true);
  };

  // Save Form (Add / Edit)
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formText.trim()) return;

    if (editingItem) {
      const updated = items.map(it => it.id === editingItem.id ? {
        ...it,
        text: formText.trim(),
        category: formCategory,
        source: formSource.trim() || 'RFP 출처 미기재',
        rfpQuote: formRfpQuote.trim() || it.rfpQuote
      } : it);
      syncItems(updated);
      onShowToast('체크리스트 항목이 수정되었습니다.');
    } else {
      const count = items.length + 1;
      const newItem: ChecklistRequirement = {
        id: `CHK-${String(count).padStart(3, '0')}`,
        category: formCategory,
        text: formText.trim(),
        source: formSource.trim() || 'RFP 직접 추가',
        rfpQuote: formRfpQuote.trim() || undefined,
        checked: false,
        completedBy: '-',
        type: '체크사항'
      };
      syncItems([newItem, ...items]);
      onShowToast('새 제출 체크리스트 항목이 추가되었습니다.');
    }

    setIsAddModalOpen(false);
  };

  // Delete Item
  const handleConfirmDelete = () => {
    if (!deleteConfirmItem) return;
    const updated = items.filter(it => it.id !== deleteConfirmItem.id);
    syncItems(updated);
    onShowToast(`'${deleteConfirmItem.text.slice(0, 20)}...' 항목이 삭제되었습니다.`);
    setDeleteConfirmItem(null);
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = ['완료여부', '카테고리', '체크리스트 항목 내용', 'RFP 출처', '완료한 사람', '완료 일시'];
    const rows = items.map(it => [
      it.checked ? '완료' : '미완료',
      `"${it.category}"`,
      `"${it.text.replace(/"/g, '""')}"`,
      `"${it.source.replace(/"/g, '""')}"`,
      `"${it.completedBy || '-'}"`,
      `"${it.completedAt || '-'}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `제출_체크리스트_${activeProject?.title || 'KPC'}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('체크리스트가 CSV 파일로 내보내기 되었습니다.');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#F8F9FA] overflow-y-auto">
      <div className="p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* Main Checklist Table */}
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-100/70 border-b border-neutral-200 text-[11px] font-bold text-neutral-600 uppercase tracking-wider">
                  <th className="py-3 px-4 w-14 text-center">완료</th>
                  <th className="py-3 px-4">항목 내용</th>
                  <th className="py-3 px-4 w-48 sm:w-56">RFP 출처</th>
                  <th className="py-3 px-4 w-32">완료한 사람</th>
                  <th className="py-3 px-4 w-28 text-center">작업</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200/80 text-xs">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-neutral-400 bg-neutral-50/30">
                      <FileText className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      <p className="font-semibold text-xs">제출 체크리스트 항목이 없습니다.</p>
                      <button
                        type="button"
                        onClick={handleOpenAddModal}
                        className="mt-3 text-xs font-bold text-[#E60012] hover:underline cursor-pointer"
                      >
                        + 새 체크리스트 직접 추가하기
                      </button>
                    </td>
                  </tr>
                ) : (
                  items.map(item => {
                    const isDone = item.checked;
                    return (
                      <tr 
                        key={item.id} 
                        className={`transition-colors ${
                          isDone 
                            ? 'bg-neutral-50/40 hover:bg-neutral-50/80 text-neutral-600' 
                            : 'hover:bg-neutral-50/80 text-[#111111]'
                        }`}
                      >
                        {/* 1. 완료 체크박스 */}
                        <td className="py-3.5 px-4 text-center align-middle">
                          <button
                            type="button"
                            onClick={() => handleToggleCheck(item.id)}
                            className="p-1 rounded hover:bg-neutral-200/60 transition-colors cursor-pointer inline-flex items-center justify-center"
                            title={isDone ? '완료 취소하기' : '완료 처리하기'}
                          >
                            {isDone ? (
                              <CheckSquare className="w-4 h-4 text-[#E60012]" />
                            ) : (
                              <Square className="w-4 h-4 text-neutral-300 hover:text-neutral-500" />
                            )}
                          </button>
                        </td>

                        {/* 2. 항목 내용 */}
                        <td className="py-3.5 px-4 align-middle">
                          <span className={`font-semibold leading-relaxed ${isDone ? 'opacity-70 font-normal' : 'text-[#111111] font-bold'}`}>
                            {item.text}
                          </span>
                        </td>

                        {/* 3. RFP 출처 (클릭 시 RFP 원문 뷰어/팝업 확인) */}
                        <td className="py-3.5 px-4 align-middle">
                          <button
                            type="button"
                            onClick={() => setCitationModalItem(item)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-neutral-700 hover:text-[#E60012] bg-neutral-100 hover:bg-red-50/60 px-2.5 py-1 rounded-md border border-neutral-200/80 transition-colors cursor-pointer text-left truncate max-w-[220px]"
                            title="클릭하여 RFP 원문 근거 확인"
                          >
                            <FileText className="w-3.5 h-3.5 text-[#E60012] shrink-0" />
                            <span className="truncate">{item.source}</span>
                          </button>
                        </td>

                        {/* 4. 완료한 사람 */}
                        <td className="py-3.5 px-4 align-middle text-neutral-600 font-semibold">
                          <div className="flex items-center gap-1.5">
                            <User className={`w-3.5 h-3.5 ${isDone ? 'text-neutral-500' : 'text-neutral-300'}`} />
                            <span className={isDone ? 'font-bold text-[#111111]' : 'text-neutral-400'}>
                              {item.completedBy || '-'}
                            </span>
                          </div>
                        </td>

                        {/* 5. 작업 (수정 / 삭제) */}
                        <td className="py-3.5 px-4 text-center align-middle shrink-0">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(item)}
                              className="p-1.5 text-neutral-500 hover:text-[#111111] hover:bg-neutral-100 rounded-md transition-colors cursor-pointer"
                              title="항목 수정"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => setDeleteConfirmItem(item)}
                              className="p-1.5 text-neutral-400 hover:text-[#E60012] hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                              title="항목 삭제"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MODAL 1: RFP 원문 근거 뷰어 팝업 (Citation Reader Modal) */}
      {/* ============================================================ */}
      {citationModalItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl border border-neutral-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#E60012]" />
                <h3 className="text-sm font-black text-[#111111]">
                  RFP 원문 근거 및 출처 위치
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCitationModalItem(null)}
                className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] font-bold text-neutral-400 block mb-1">체크리스트 항목</span>
                <p className="font-bold text-[#111111] bg-neutral-50 p-3 rounded-xl border border-neutral-200 leading-relaxed">
                  [{citationModalItem.category}] {citationModalItem.text}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold text-neutral-400 block mb-1">추출 위치 및 RFP 출처</span>
                <p className="font-bold text-[#E60012] bg-red-50/50 p-2.5 rounded-lg border border-red-100 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#E60012] shrink-0" />
                  <span>{citationModalItem.source}</span>
                </p>
              </div>

              {citationModalItem.rfpQuote && (
                <div>
                  <span className="text-[10px] font-bold text-neutral-400 block mb-1">RFP 원문 발췌 내용</span>
                  <div className="p-3.5 bg-amber-50/50 border border-amber-200 rounded-xl text-neutral-800 leading-relaxed font-mono text-[11px] relative">
                    <span className="absolute left-2 top-2 text-amber-400 text-lg">&quot;</span>
                    <p className="pl-3">{citationModalItem.rfpQuote}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 flex items-center justify-end gap-2 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setCitationModalItem(null)}
                className="px-5 py-2 text-xs font-bold text-white bg-[#111111] hover:bg-black rounded-xl transition-colors cursor-pointer"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: 체크리스트 추가 / 수정 모달 (Add / Edit Modal) */}
      {/* ============================================================ */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <form 
            onSubmit={handleSaveForm}
            className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-neutral-200"
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <h3 className="text-sm font-black text-[#111111]">
                {editingItem ? '체크리스트 항목 수정' : '+ 새 체크리스트 추가'}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#111111] mb-1">
                  구분 카테고리 <span className="text-[#E60012]">*</span>
                </label>
                <select
                  value={formCategory}
                  onChange={e => setFormCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-bold text-[#111111] focus:outline-none focus:border-[#E60012]"
                >
                  <option value="제출기한/장소">제출기한/장소</option>
                  <option value="제출부수/매체">제출부수/매체</option>
                  <option value="서식/규격">서식/규격</option>
                  <option value="날인/밀봉">날인/밀봉</option>
                  <option value="증빙/별첨">증빙/별첨</option>
                  <option value="발표/기타">발표/기타</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#111111] mb-1">
                  체크리스트 내용 <span className="text-[#E60012]">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="예: 제안서 원본 1부(법인인감 직인) 및 사본 9부 제출"
                  value={formText}
                  onChange={e => setFormText(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs text-[#111111] focus:outline-none focus:border-[#E60012] leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-bold text-[#111111] mb-1">
                  RFP 출처 위치 (선택/수정 가능)
                </label>
                <input
                  type="text"
                  placeholder="예: RFP p.42 / 7. 제안서 제출방법"
                  value={formSource}
                  onChange={e => setFormSource(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl text-xs text-[#111111] focus:outline-none focus:border-[#E60012]"
                />
              </div>

              <div>
                <label className="block font-bold text-neutral-600 mb-1">
                  RFP 원문 근거 문장 (선택 사항)
                </label>
                <textarea
                  rows={2}
                  placeholder="예: 제안서 원본 1부 및 사본 9부를 기한 내 직접 방문하여 제출하여야 함"
                  value={formRfpQuote}
                  onChange={e => setFormRfpQuote(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl text-xs text-[#111111] focus:outline-none focus:border-[#E60012]"
                />
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end gap-2 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-black text-white bg-[#E60012] hover:bg-[#CC0010] rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                {editingItem ? '수정 완료' : '추가하기'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 3: 항목 삭제 확인 모달 (Delete Confirmation Modal) */}
      {/* ============================================================ */}
      {deleteConfirmItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-neutral-200">
            <div className="flex items-center gap-3 text-[#E60012]">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="text-sm font-black text-[#111111]">
                체크리스트 항목 삭제 Confirm
              </h3>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed">
              &quot;<span className="font-bold text-[#111111]">{deleteConfirmItem.text}</span>&quot;<br />
              항목을 체크리스트에서 삭제하시겠습니까? 삭제된 항목은 복구할 수 없습니다.
            </p>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => setDeleteConfirmItem(null)}
                className="px-4 py-2 text-xs font-bold text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 text-xs font-black text-white bg-[#E60012] hover:bg-[#CC0010] rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                삭제하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
