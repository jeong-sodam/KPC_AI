import React, { useState, useCallback } from 'react';
import { Header } from './components/common/Header';
import { Toast } from './components/common/Toast';
import { DiaChat } from './components/dia/DiaChat';
import { ProposalNav } from './components/proposals/ProposalNav';
import { OpportunitySearch } from './components/proposals/OpportunitySearch';
import { PipelineBoard } from './components/proposals/PipelineBoard';
import { RfpDetail } from './components/proposals/RfpDetail';
import { ProjectRegistrationView } from './components/proposals/ProjectRegistrationView';
import { ProjectReviewDetail } from './components/proposals/ProjectReviewDetail';
import { ProposalSetupView } from './components/proposals/ProposalSetupView';
import { ProposalConvertModal } from './components/proposals/ProposalConvertModal';
import { RfpUploadView, UploadedProposalFile, INITIAL_PROJECT_FILES, SAMPLE_REFERENCE_MATERIALS } from './components/proposals/RfpUploadView';
import { AiAnalysisView } from './components/proposals/AiAnalysisView';
import { RequirementsView, ChecklistRequirement, INITIAL_KPC_CHECKLIST } from './components/proposals/RequirementsView';
import { ProposalStructureView } from './components/proposals/ProposalStructureView';
import { RequirementsMatrix } from './components/proposals/RequirementsMatrix';
import { TaskManagementView } from './components/proposals/TaskManagementView';
import { EditorView, ProposalSectionItem, INITIAL_PROPOSAL_SECTIONS } from './components/proposals/EditorView';
import { MyTasksView } from './components/proposals/MyTasksView';
import { ProposalLibrary } from './components/proposals/ProposalLibrary';
import { ProposalSettingsView } from './components/proposals/ProposalSettingsView';
import { ProposalProjectsList } from './components/proposals/ProposalProjectsList';
import { ReportsView } from './components/reports/ReportsView';
import { AiWorker } from './components/worker/AiWorker';
import { CustomAiView } from './components/custom_ai/CustomAiView';
import { AiAgentView } from './components/agent/AiAgentView';
import { AiCommunityView } from './components/community/AiCommunityView';
import { AdminConsoleView } from './components/admin/AdminConsoleView';
import { InteractiveDemoModal } from './components/community/InteractiveDemoModal';

import { GnbTab, ProposalLnbTab, ProposalProject, RfpOpportunity, Department, UserRole, VerifiedAgent, CommunityAgent, CommunityAgentStatus } from './types';
import { SAMPLE_PROJECTS, SAMPLE_RFPS } from './data/mockData';
import { VERIFIED_AGENTS_DATA } from './data/agentMockData';
import { INITIAL_COMMUNITY_AGENTS } from './data/communityMockData';

export default function App() {
  // GNB navigation
  const [activeGnb, setActiveGnb] = useState<GnbTab>('knowledge_ai');

  // Permission / Role State for testing ('user' | 'admin')
  const [userRole, setUserRole] = useState<UserRole>('admin');

  // Proposal LNB navigation
  const [activeProposalLnb, setActiveProposalLnb] = useState<ProposalLnbTab>('pipeline');

  // Department Filter
  const [selectedDepartment, setSelectedDepartment] = useState<Department>('전체');

  // Active Selected Project & RFP
  const [projects, setProjects] = useState<ProposalProject[]>(SAMPLE_PROJECTS);
  const [rfpList, setRfpList] = useState<RfpOpportunity[]>(SAMPLE_RFPS);
  const [activeProject, setActiveProject] = useState<ProposalProject>(SAMPLE_PROJECTS[2]); // Default to a '진행' project
  const [selectedRfp, setSelectedRfp] = useState<RfpOpportunity>(SAMPLE_RFPS[0]);
  const [selectedReviewProject, setSelectedReviewProject] = useState<ProposalProject | null>(SAMPLE_PROJECTS[0]);

  // AI Agent & Community Persistent State
  const [verifiedAgents, setVerifiedAgents] = useState<VerifiedAgent[]>(VERIFIED_AGENTS_DATA);
  const [communityPosts, setCommunityPosts] = useState<CommunityAgent[]>(INITIAL_COMMUNITY_AGENTS);

  // Standalone Prototype / Demo Mode via query param (e.g. ?demo=comm-meeting-ai)
  const [standaloneDemoId, setStandaloneDemoId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('demo');
    }
    return null;
  });

  // Per-project files map to ensure uploaded files stay attached to their projects
  const [projectFilesMap, setProjectFilesMap] = useState<Record<string, UploadedProposalFile[]>>({
    'proj-1': INITIAL_PROJECT_FILES
  });

  // Shared Checklist Requirements State (Synced across Step 3 Checklist and Step 4 Editor)
  const [checklistRequirements, setChecklistRequirements] = useState<ChecklistRequirement[]>(INITIAL_KPC_CHECKLIST);

  // Shared Proposal Sections State (Synced across Step 4 Editor and Step 5 Review/Consolidated Full Document View)
  const [proposalSections, setProposalSections] = useState<ProposalSectionItem[]>(INITIAL_PROPOSAL_SECTIONS);
  const [selectedEditorSectionId, setSelectedEditorSectionId] = useState<string | null>(null);

  const getFilesForProject = useCallback((project?: ProposalProject | null): UploadedProposalFile[] => {
    if (!project) return [];
    if (projectFilesMap[project.id]) {
      return projectFilesMap[project.id];
    }
    const defaultRfpFile: UploadedProposalFile = {
      id: `rfp-${project.id}`,
      fileName: `${(project.title || '제안사업').replace(/\s+/g, '_')}_RFP.pdf`,
      category: 'RFP 문서',
      size: '7.4 MB',
      pages: 64,
      uploader: project.manager || '정소담',
      uploadDate: '26.09.14',
      status: '분석 준비 완료',
      type: 'PDF'
    };
    return [defaultRfpFile, ...SAMPLE_REFERENCE_MATERIALS];
  }, [projectFilesMap]);

  const handleUpdateProjectFiles = useCallback((projectId: string, newFiles: UploadedProposalFile[]) => {
    setProjectFilesMap(prev => ({
      ...prev,
      [projectId]: newFiles
    }));
  }, []);

  // Convert Modal state
  const [convertModalOpen, setConvertModalOpen] = useState(false);
  const [rfpToConvert, setRfpToConvert] = useState<RfpOpportunity>(SAMPLE_RFPS[0]);

  // Global Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  const handleCloseToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  // Convert Modal Actions
  const handleOpenConvertModal = (rfp: RfpOpportunity) => {
    setRfpToConvert(rfp);
    setConvertModalOpen(true);
  };

  const handleConfirmConvert = (projectData: {
    title: string;
    targetPrice: number;
    teamLead: string;
    members: string[];
    deadline: string;
    agency: string;
  }) => {
    const newProj: ProposalProject = {
      id: `proj-${Date.now()}`,
      title: projectData.title,
      agency: projectData.agency,
      budget: projectData.targetPrice,
      deadline: projectData.deadline,
      dDay: 28,
      status: '제안 착수',
      stage: 'kickoff',
      manager: projectData.teamLead,
      teamMembers: projectData.members,
      pWin: 85,
      rfpId: rfpToConvert.id
    };

    setProjects(prev => [newProj, ...prev]);
    setActiveProject(newProj);
    setConvertModalOpen(false);
    showToast(`'${newProj.title}' 제안 사업이 성공적으로 등록되었습니다.`);
    setActiveProposalLnb('rfp_upload');
  };

  // AI Community -> Official AI Agent registration handler
  const handleRegisterCommunityAsAgent = (post: CommunityAgent) => {
    const newAgentId = `agent-reg-${post.id}`;
    const newAgent: VerifiedAgent = {
      id: newAgentId,
      name: post.title,
      code: `AGENT-COMM-${post.id.slice(-4).toUpperCase()}`,
      version: post.version || 'v1.0',
      category: post.category === '아이디어' ? '문서작성' : 'RFP·제안',
      description: post.shortDesc || post.description,
      longDescription: post.description,
      author: post.author,
      department: post.department,
      maintainer: `${post.author} (${post.department})`,
      auditDate: '2026.09.10',
      createdAt: post.createdAt,
      updatedAt: '2026.09.10',
      auditScore: 99.4,
      auditPassed: true,
      securityCertification: 'KPC-SEC-VERIFIED',
      executionCount: 1,
      rating: 5.0,
      reviewCount: 1,
      likes: post.likes,
      commentsCount: post.commentsCount,
      tags: [...post.tags, '공식승인'],
      status: '전사 배포',
      capabilities: [post.shortDesc || post.description, '사내 커뮤니티 우수 개발 Agent 공식 등재'],
      tools: ['KPC Enterprise AI Core'],
      systemPromptSample: post.promptPreview || '사내 검증 승인 프롬프트...',
      inputsSample: [
        { key: 'input', label: '업무 입력 데이터', placeholder: post.exampleInputs || '데이터를 입력하세요', type: 'textarea' }
      ],
      outputSample: post.exampleOutput || '분석 및 생성 결과가 제공됩니다.'
    };

    setVerifiedAgents(prev => [newAgent, ...prev]);

    setCommunityPosts(prev => prev.map(p => {
      if (p.id === post.id) {
        return {
          ...p,
          status: '승인 완료',
          registeredType: 'agent',
          registeredTargetId: newAgentId,
          linkedVerifiedAgentId: newAgentId
        };
      }
      return p;
    }));

    showToast(`'${post.title}' 게시글이 공식 AI Agent로 승인 및 등록되었습니다.`);
  };

  // AI Community -> Official Custom AI registration handler
  const handleRegisterCommunityAsCustomAi = (post: CommunityAgent) => {
    const targetId = `custom-ai-${post.id}`;
    setCommunityPosts(prev => prev.map(p => {
      if (p.id === post.id) {
        return {
          ...p,
          status: '승인 완료',
          registeredType: 'custom_ai',
          registeredTargetId: targetId
        };
      }
      return p;
    }));

    showToast(`'${post.title}' 게시글이 공식 Custom AI 서비스로 승인 및 등록되었습니다.`);
  };

  // AI Community -> Hold audit handler (검수 보류 토글 및 원복)
  const handleHoldCommunityAudit = (postId: string) => {
    let toastMessage = '';
    setCommunityPosts(prev => prev.map(p => {
      if (p.id === postId) {
        if (p.status === '검수 보류') {
          const restoredStatus: CommunityAgentStatus =
            p.previousStatus ||
            (p.auditRequestData
              ? '검수 요청'
              : p.devStatus === '개발 중'
              ? '개발 중'
              : p.devStatus === '기획 중' || p.visibilityScope === '나만 사용'
              ? '초안'
              : '개발 중');
          toastMessage = `'${p.title}' 검수 보류가 해제되어 기존 상태인 [${restoredStatus}](으)로 복원되었습니다.`;
          return {
            ...p,
            status: restoredStatus,
            previousStatus: undefined
          };
        } else {
          toastMessage = `'${p.title}'이(가) [검수 보류] 상태로 지정되었습니다.`;
          return {
            ...p,
            previousStatus: p.status,
            status: '검수 보류'
          };
        }
      }
      return p;
    }));
    if (toastMessage) {
      showToast(toastMessage);
    }
  };

  const getGnbName = (tab: GnbTab) => {
    switch (tab) {
      case 'dia':
      case 'knowledge_ai': return 'Knowledge AI';
      case 'ai_worker': return 'AI Worker';
      case 'proposals': return '제안서 AI';
      case 'custom_ai': return 'Custom AI';
      case 'ai_agent': return 'AI Agent';
      case 'ai_community': return 'AI Community';
      case 'reports': return '보고서 생성';
      case 'admin': return '관리자 콘솔';
      default: return tab;
    }
  };

  const handleBackToWorkspace = useCallback(() => {
    setActiveGnb('knowledge_ai');
    showToast('일반 워크스페이스(Knowledge AI)로 복귀했습니다.');
  }, [showToast]);

  const handleSwitchToUserFromAdmin = useCallback(() => {
    setUserRole('user');
    setActiveGnb('knowledge_ai');
    showToast("👤 '일반사용자' 권한으로 전환되어 워크스페이스로 복귀했습니다.");
  }, [showToast]);

  const handleOpenAdminConsole = useCallback(() => {
    setUserRole('admin');
    setActiveGnb('admin');
    showToast('🛡️ [관리자 콘솔] 대시보드로 이동했습니다.');
  }, [showToast]);

  const handleRoleChange = useCallback((newRole: UserRole) => {
    setUserRole(newRole);
    if (newRole === 'admin') {
      showToast("🛡️ '관리자' 권한으로 전환되었습니다. (시스템 설정 및 관리자 기능 활성화)");
    } else {
      showToast("👤 '일반사용자' 권한으로 전환되었습니다. (일반 사용자 권한 모드로 테스트)");
    }
  }, [showToast]);

  if (activeGnb === 'admin') {
    return (
      <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#F9FAFB] text-neutral-900 font-sans antialiased">
        <AdminConsoleView
          onBackToWorkspace={handleBackToWorkspace}
          onSwitchToUser={handleSwitchToUserFromAdmin}
          onShowToast={showToast}
          userRole={userRole}
          onRoleChange={handleRoleChange}
        />
        {toastMessage && (
          <Toast
            message={toastMessage}
            onClose={handleCloseToast}
          />
        )}
      </div>
    );
  }

  // If standalone demo query parameter is active, render dedicated demonstration sandbox
  if (standaloneDemoId) {
    const standalonePost = communityPosts.find(p => p.id === standaloneDemoId) || communityPosts[0];
    if (standalonePost) {
      return (
        <InteractiveDemoModal
          isOpen={true}
          onClose={() => {
            if (typeof window !== 'undefined') {
              const url = new URL(window.location.href);
              url.searchParams.delete('demo');
              window.history.replaceState({}, '', url.pathname);
            }
            setStandaloneDemoId(null);
          }}
          post={standalonePost}
          isStandalone={true}
        />
      );
    }
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-white text-[#111111] font-sans antialiased">
      {/* 1. Global Navigation Bar (GNB) */}
      <Header
        activeTab={activeGnb}
        userRole={userRole}
        onRoleChange={handleRoleChange}
        onOpenAdminConsole={handleOpenAdminConsole}
        onTabChange={tab => {
          setActiveGnb(tab);
          showToast(`[${getGnbName(tab)}] 화면으로 전환되었습니다.`);
        }}
        onSelectTab={tab => {
          setActiveGnb(tab);
          showToast(`[${getGnbName(tab)}] 화면으로 전환되었습니다.`);
        }}
        onShowToast={showToast}
      />

      {/* 2. Main Body Container */}
      <div className="flex-1 flex overflow-hidden pt-14 h-full">
        {/* VIEW 1: Knowledge AI (구 DIA Chat) */}
        {(activeGnb === 'dia' || activeGnb === 'knowledge_ai') && (
          <DiaChat onShowToast={showToast} />
        )}

        {/* VIEW 2: Proposal Generator (with LNB) */}
        {activeGnb === 'proposals' && (
          <div className="flex-1 flex h-full overflow-hidden">
            {/* LNB Sidebar */}
            <ProposalNav
              currentLnb={activeProposalLnb}
              activeTab={activeProposalLnb}
              onLnbChange={tab => {
                setActiveProposalLnb(tab as any);
              }}
              onSelectTab={tab => {
                setActiveProposalLnb(tab as any);
              }}
              selectedDepartment={selectedDepartment}
              onSelectDepartment={dept => {
                setSelectedDepartment(dept);
                setActiveProposalLnb('pipeline');
                showToast(`[${dept}] 부서로 필터링되었습니다.`);
              }}
              currentProjectTab={activeProposalLnb as any}
              onProjectTabChange={tab => {
                setActiveProposalLnb(tab as any);
              }}
              activeProject={['rfp_upload', 'rfp-docs', 'setup', 'ai_analysis', 'ai-analysis', 'requirements', 'editor', 'structure', 'tasks', 'task-mgmt', 'matrix', 'inputs', 'resources', 'proj-settings'].includes(activeProposalLnb) ? activeProject : null}
              projects={projects}
              onSelectProject={p => {
                if (p.stage === '진행') {
                  setActiveProject(p);
                  setActiveProposalLnb('rfp_upload');
                  showToast(`'${p.title}' 제안서 작성 설정(1단계)으로 이동했습니다.`);
                } else {
                  setSelectedReviewProject(p);
                  setActiveProposalLnb('project_review');
                  showToast(`'${p.title}' 검토 화면으로 이동했습니다.`);
                }
              }}
              onExitProject={() => {
                setActiveProposalLnb('pipeline');
                showToast('제안 목록으로 이동했습니다.');
              }}
              userRole={userRole}
              onShowToast={showToast}
            />

            {/* Proposal Content Views */}
            <div className="flex-1 flex overflow-hidden">
              {/* 1. 신규 프로젝트 등록 화면 */}
              {activeProposalLnb === 'project_register' && (
                <ProjectRegistrationView
                  onBack={() => {
                    setActiveProposalLnb('pipeline');
                    showToast('프로젝트 등록을 취소하고 제안 목록으로 복귀했습니다.');
                  }}
                  onCancel={() => {
                    setActiveProposalLnb('pipeline');
                    showToast('프로젝트 등록을 취소하고 제안 목록으로 복귀했습니다.');
                  }}
                  onRegisterComplete={(newProj) => {
                    setProjects(prev => [newProj, ...prev]);
                    const newRfp: RfpOpportunity = {
                      id: newProj.rfpId || `rfp-${newProj.id}`,
                      title: newProj.title,
                      agency: newProj.agency,
                      budget: newProj.budget,
                      budgetFormatted: `₩${newProj.budget.toLocaleString()}`,
                      deadline: newProj.deadline,
                      announcementDate: newProj.announcementDate || '2026.09.18',
                      contractType: 'AI 시스템 구축',
                      country: '대한민국',
                      currency: 'KRW',
                      language: '한국어',
                      status: '모집 중',
                      department: (newProj.department as any) || 'AI산업본부',
                      stage: '검토 대기',
                      pwin: newProj.pWin || 74,
                      assignee: newProj.manager || '정소담',
                      participants: newProj.teamMembers || ['정소담'],
                      purpose: newProj.purpose || '',
                      tasks: [],
                      requirementsSummary: '',
                      evalSummary: '',
                      source: '직접 등록',
                      lastModified: '2026.09.18',
                      primaryRfpFileName: newProj.primaryRfpFileName
                    };
                    setRfpList(prev => [newRfp, ...prev]);
                    setActiveProposalLnb('pipeline');
                    showToast(`'${newProj.title}' 프로젝트가 [검토 대기] 상태로 등록되었습니다.`);
                  }}
                  onStartReview={(newProj) => {
                    setProjects(prev => [newProj, ...prev]);
                    const newRfp: RfpOpportunity = {
                      id: newProj.rfpId || `rfp-${newProj.id}`,
                      title: newProj.title,
                      agency: newProj.agency,
                      budget: newProj.budget,
                      budgetFormatted: `₩${newProj.budget.toLocaleString()}`,
                      deadline: newProj.deadline,
                      announcementDate: newProj.announcementDate || '2026.09.18',
                      contractType: 'AI 시스템 구축',
                      country: '대한민국',
                      currency: 'KRW',
                      language: '한국어',
                      status: '모집 중',
                      department: (newProj.department as any) || 'AI산업본부',
                      stage: '검토 대기',
                      pwin: newProj.pWin || 74,
                      assignee: newProj.manager || '정소담',
                      participants: newProj.teamMembers || ['정소담'],
                      purpose: newProj.purpose || '',
                      tasks: [],
                      requirementsSummary: '',
                      evalSummary: '',
                      source: '직접 등록',
                      lastModified: '2026.09.18',
                      primaryRfpFileName: newProj.primaryRfpFileName
                    };
                    setRfpList(prev => [newRfp, ...prev]);
                    setSelectedReviewProject(newProj);
                    setActiveProposalLnb('project_review');
                    showToast(`'${newProj.title}' 2열 검토 화면으로 바로 이동했습니다.`);
                  }}
                  onShowToast={showToast}
                />
              )}

              {/* 2. 프로젝트 상세 2열 검토 화면 (RFP 뷰어 + 수주 검토 정보) */}
              {activeProposalLnb === 'project_review' && (selectedReviewProject || activeProject) && (
                <ProjectReviewDetail
                  userRole={userRole}
                  project={selectedReviewProject || activeProject}
                  onBack={() => {
                    setActiveProposalLnb('pipeline');
                    showToast('제안 목록 보드로 복귀했습니다.');
                  }}
                  onUpdateProjectStage={(projectId, newStage, extraData) => {
                    setProjects(prev => prev.map(p => {
                      if (p.id === projectId || p.rfpId === projectId) {
                        const updated = { ...p, stage: newStage as any, status: newStage as any, ...extraData };
                        setSelectedReviewProject(updated);
                        return updated;
                      }
                      return p;
                    }));
                    setRfpList(prev => prev.map(r => {
                      if (r.id === projectId || (selectedReviewProject && r.id === selectedReviewProject.rfpId)) {
                        return { ...r, stage: newStage, rejectionReason: extraData?.rejectionReason };
                      }
                      return r;
                    }));
                  }}
                  onUpdateProject={(updatedProj) => {
                    setSelectedReviewProject(updatedProj);
                    setProjects(prev => prev.map(p => p.id === updatedProj.id ? updatedProj : p));
                    setRfpList(prev => prev.map(r => (r.id === updatedProj.rfpId || r.id === updatedProj.id) ? { 
                      ...r, 
                      stage: updatedProj.stage as any, 
                      rejectionReason: updatedProj.rejectionReason 
                    } : r));
                  }}
                  onStartProposalWriting={(proj) => {
                    if (proj.stage === '진행') {
                      setActiveProject(proj);
                      setActiveProposalLnb('rfp_upload');
                      showToast(`'${proj.title}' 제안서 작성 프로세스(1단계 작성 설정)로 이동했습니다.`);
                    } else {
                      showToast('제안서 작성은 관리자 검토를 통해 [진행]으로 승인된 프로젝트만 가능합니다.');
                    }
                  }}
                  onStartProposal={() => {
                    const currentProj = selectedReviewProject || activeProject;
                    if (currentProj.stage === '진행') {
                      setActiveProject(currentProj);
                      setActiveProposalLnb('rfp_upload');
                      showToast(`'${currentProj.title}' 제안서 작성 프로세스(1단계 작성 설정)로 이동했습니다.`);
                    } else {
                      showToast('제안서 작성은 관리자 검토를 통해 [진행]으로 승인된 프로젝트만 가능합니다.');
                    }
                  }}
                  onShowToast={showToast}
                />
              )}

              {/* 3. 제안 목록 (4단계 칸반 & 리스트 뷰) */}
              {(activeProposalLnb === 'pipeline' || activeProposalLnb === 'proposals') && (
                <PipelineBoard
                  userRole={userRole}
                  rfpList={rfpList}
                  projects={projects}
                  selectedDepartment={selectedDepartment}
                  onSelectDepartment={dept => {
                    setSelectedDepartment(dept);
                    showToast(`[${dept}] 부서로 필터링되었습니다.`);
                  }}
                  onOpenProjectRegister={() => {
                    setActiveProposalLnb('project_register');
                    showToast('새 프로젝트 등록 화면으로 이동했습니다.');
                  }}
                  onUpdateStage={(rfpId, newStage) => {
                    setRfpList(prev => prev.map(r => r.id === rfpId ? { ...r, stage: newStage } : r));
                    setProjects(prev => prev.map(p => (p.rfpId === rfpId || p.id === rfpId) ? { ...p, stage: newStage as any } : p));
                  }}
                  onOpenRfpDetail={rfp => {
                    const matched = projects.find(p => p.rfpId === rfp.id || p.id === rfp.id) || {
                      id: `proj-${rfp.id}`,
                      title: rfp.title,
                      agency: rfp.agency,
                      budget: rfp.budget,
                      deadline: rfp.deadline,
                      dDay: 28,
                      status: rfp.stage,
                      stage: rfp.stage as any,
                      manager: rfp.assignee || '정소담',
                      teamMembers: rfp.participants || ['정소담'],
                      pWin: rfp.pwin || 74,
                      rfpId: rfp.id,
                      primaryRfpFileName: rfp.primaryRfpFileName || `${rfp.title}_RFP.pdf`
                    };
                    setSelectedReviewProject(matched);
                    setActiveProposalLnb('project_review');
                    showToast(`'${rfp.title}' 프로젝트 검토 화면으로 이동했습니다.`);
                  }}
                  onSelectProject={proj => {
                    setSelectedReviewProject(proj);
                    setActiveProposalLnb('project_review');
                    showToast(`'${proj.title}' 프로젝트 검토 화면으로 이동했습니다.`);
                  }}
                  onStartProposalProcess={rfp => {
                    if (rfp.stage !== '진행') {
                      showToast('제안서 작성은 관리자 검토를 통해 [진행]으로 승인된 프로젝트만 가능합니다.');
                      const matched = projects.find(p => p.rfpId === rfp.id || p.id === rfp.id) || {
                        id: `proj-${rfp.id}`,
                        title: rfp.title,
                        agency: rfp.agency,
                        budget: rfp.budget,
                        deadline: rfp.deadline,
                        dDay: 28,
                        status: rfp.stage,
                        stage: rfp.stage as any,
                        manager: rfp.assignee || '정소담',
                        teamMembers: rfp.participants || ['정소담'],
                        pWin: rfp.pwin || 74,
                        rfpId: rfp.id,
                        primaryRfpFileName: rfp.primaryRfpFileName || `${rfp.title}_RFP.pdf`
                      };
                      setSelectedReviewProject(matched);
                      setActiveProposalLnb('project_review');
                      return;
                    }

                    const matchedProj = projects.find(p => p.rfpId === rfp.id || p.id === rfp.id) || {
                      id: `proj-${rfp.id}`,
                      title: rfp.title,
                      agency: rfp.agency,
                      budget: rfp.budget,
                      deadline: rfp.deadline,
                      dDay: 28,
                      status: '진행',
                      stage: '진행',
                      manager: rfp.assignee || '정소담',
                      teamMembers: rfp.participants || ['정소담'],
                      pWin: rfp.pwin || 74,
                      rfpId: rfp.id,
                      primaryRfpFileName: rfp.primaryRfpFileName || `${rfp.title}_RFP.pdf`
                    };
                    setActiveProject(matchedProj);
                    setActiveProposalLnb('rfp_upload');
                    showToast(`'${matchedProj.title}' 제안서 작성 프로세스(1단계 작성 설정)로 진입했습니다.`);
                  }}
                  onShowToast={showToast}
                />
              )}

              {/* 4. 제안서 작성 1단계: 작성 설정 화면 */}
              {(activeProposalLnb === 'rfp_upload' || activeProposalLnb === 'setup' || activeProposalLnb === 'rfp-docs') && (
                activeProject.stage === '진행' ? (
                  <ProposalSetupView
                    project={activeProject}
                    onStartAnalysis={() => {
                      const updatedProject = { ...activeProject, analysisStatus: '분석 완료' as const };
                      setActiveProject(updatedProject);
                      setProjects(prev => prev.map(p => p.id === activeProject.id ? updatedProject : p));
                      setActiveProposalLnb('ai_analysis');
                      showToast('RFP 심층 분석(2단계)이 활성화되어 이동했습니다.');
                    }}
                    onShowToast={showToast}
                  />
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 bg-[#F8F9FA] text-center">
                    <div className="max-w-md bg-white p-8 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
                      <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-600 font-bold text-lg">
                        !
                      </div>
                      <h2 className="text-base font-black text-[#111111]">
                        제안서 작성 권한 제한
                      </h2>
                      <p className="text-xs text-neutral-600 leading-relaxed">
                        선택하신 프로젝트는 현재 <strong>[{activeProject.stage || '검토 대기'}]</strong> 상태입니다.
                        제안서 작성은 관리자 검토를 거쳐 <strong>[진행]</strong>으로 승인된 프로젝트만 가능합니다.
                      </p>
                      <div className="pt-2 flex items-center justify-center gap-2.5">
                        <button
                          onClick={() => {
                            setSelectedReviewProject(activeProject);
                            setActiveProposalLnb('project_review');
                          }}
                          className="px-4 py-2 rounded-xl bg-[#111111] text-white text-xs font-bold hover:bg-neutral-800 transition-colors cursor-pointer"
                        >
                          검토 화면으로 이동
                        </button>
                        <button
                          onClick={() => setActiveProposalLnb('pipeline')}
                          className="px-4 py-2 rounded-xl border border-neutral-300 text-neutral-700 text-xs font-bold hover:bg-neutral-100 transition-colors cursor-pointer"
                        >
                          제안 목록으로 돌아가기
                        </button>
                      </div>
                    </div>
                  </div>
                )
              )}

              {/* AI 공고 분석 결과 */}
              {(activeProposalLnb === 'ai_analysis' || activeProposalLnb === 'ai-analysis') && (
                <AiAnalysisView
                  activeProject={activeProject}
                  uploadedFiles={activeProject ? getFilesForProject(activeProject) : undefined}
                  onNavigateToProjects={() => {
                    setActiveProposalLnb('pipeline');
                    showToast('전체 프로젝트 목록으로 이동했습니다.');
                  }}
                  onNavigateToProjectRoot={() => {
                    setActiveProposalLnb('rfp_upload');
                    showToast(`'${activeProject?.title || '제안 사업'}' 01 문서 업로드 화면으로 이동했습니다.`);
                  }}
                  onNavigateNext={() => {
                    setActiveProposalLnb('requirements');
                    showToast('요구사항 관리 화면으로 이동했습니다.');
                  }}
                  onShowToast={showToast}
                />
              )}

              {/* 요구사항 관리 (03 체크리스트) */}
              {activeProposalLnb === 'requirements' && (
                <RequirementsView
                  activeProject={activeProject}
                  requirementsList={checklistRequirements}
                  onUpdateRequirements={setChecklistRequirements}
                  onNavigateToProjects={() => {
                    setActiveProposalLnb('pipeline');
                    showToast('전체 프로젝트 목록으로 이동했습니다.');
                  }}
                  onNavigateToProjectRoot={() => {
                    setActiveProposalLnb('rfp_upload');
                    showToast(`'${activeProject?.title || '제안 사업'}' 01 문서 업로드 화면으로 이동했습니다.`);
                  }}
                  onNavigateNext={() => {
                    setActiveProposalLnb('editor');
                    showToast('04 제안서 작성 화면으로 이동했습니다.');
                  }}
                  onShowToast={showToast}
                />
              )}

              {/* 제안서 구조 (목차 트리) */}
              {activeProposalLnb === 'structure' && (
                <ProposalStructureView
                  onNavigateNext={() => {
                    setActiveProposalLnb('tasks');
                    showToast('작성 관리 화면으로 이동했습니다.');
                  }}
                  onShowToast={showToast}
                />
              )}

              {/* 05 검토 및 완성 (현재상황전체보기) */}
              {activeProposalLnb === 'matrix' && (
                <RequirementsMatrix
                  activeProject={activeProject}
                  sections={proposalSections}
                  uploadedFiles={activeProject ? getFilesForProject(activeProject) : undefined}
                  onUpdateSections={setProposalSections}
                  onNavigateToProjects={() => {
                    setActiveProposalLnb('pipeline');
                    showToast('전체 프로젝트 목록으로 이동했습니다.');
                  }}
                  onNavigateToProjectRoot={() => {
                    setActiveProposalLnb('rfp_upload');
                    showToast(`'${activeProject?.title || '제안 사업'}' 01 문서 업로드 화면으로 이동했습니다.`);
                  }}
                  onShowToast={showToast}
                  onOpenEditorSection={secId => {
                    setSelectedEditorSectionId(secId);
                    setActiveProposalLnb('editor');
                    const sec = proposalSections.find(s => s.id === secId);
                    showToast(`'${sec?.title || '선택한 섹션'}' 편집 화면으로 이동했습니다.`);
                  }}
                />
              )}

              {/* 작성 관리 (태스크) */}
              {(activeProposalLnb === 'tasks' || activeProposalLnb === 'task-mgmt') && (
                <TaskManagementView
                  onOpenEditor={secId => {
                    setActiveProposalLnb('editor');
                    showToast(`에디터 집필 화면으로 전환되었습니다.`);
                  }}
                  onShowToast={showToast}
                />
              )}

              {/* 제안서 에디터 및 하위 프로세스 (스토리보드, 검토, 내보내기 등) */}
              {(activeProposalLnb === 'editor' || 
                activeProposalLnb === 'inputs' || 
                activeProposalLnb === 'review' || 
                activeProposalLnb === 'export') && (
                <EditorView
                  activeProject={activeProject}
                  uploadedFiles={activeProject ? getFilesForProject(activeProject) : undefined}
                  checklistRequirements={checklistRequirements}
                  onUpdateChecklistRequirements={setChecklistRequirements}
                  sections={proposalSections}
                  onUpdateSections={setProposalSections}
                  initialSelectedSectionId={selectedEditorSectionId}
                  onNavigateToProjects={() => {
                    setActiveProposalLnb('pipeline');
                    showToast('전체 프로젝트 목록으로 이동했습니다.');
                  }}
                  onNavigateToProjectRoot={() => {
                    setActiveProposalLnb('rfp_upload');
                    showToast(`'${activeProject?.title || '제안 사업'}' 01 문서 업로드 화면으로 이동했습니다.`);
                  }}
                  onShowToast={showToast}
                  onExportDone={() => {
                    showToast('제안서 내보내기가 완료되었습니다.');
                  }}
                  userRole={userRole}
                />
              )}

              {/* 내 작업 */}
              {(activeProposalLnb === 'my_tasks' || activeProposalLnb === 'my-tasks') && (
                <MyTasksView
                  onOpenTask={secId => {
                    setActiveProposalLnb('editor');
                    showToast(`섹션 집필 에디터로 전환되었습니다.`);
                  }}
                  onShowToast={showToast}
                />
              )}

              {/* 제안 자료 라이브러리 및 리소스 */}
              {(activeProposalLnb === 'library' || 
                activeProposalLnb === 'resources') && (
                <ProposalLibrary 
                  activeProject={activeProject}
                  onShowToast={showToast} 
                />
              )}

              {/* 제안 사업 관리 설정 */}
              {(activeProposalLnb === 'settings' || 
                activeProposalLnb === 'proj-settings') && (
                <ProposalSettingsView userRole={userRole} onShowToast={showToast} />
              )}
            </div>
          </div>
        )}

        {/* VIEW: Custom AI (맞춤형 AI 솔루션 갤러리) */}
        {activeGnb === 'custom_ai' && (
          <CustomAiView 
            onShowToast={showToast} 
            onNavigateTab={(tab) => setActiveGnb(tab as GnbTab)} 
          />
        )}

        {/* VIEW 3: Reports View */}
        {activeGnb === 'reports' && (
          <ReportsView userRole={userRole} onShowToast={showToast} />
        )}

        {/* VIEW 4: AI Worker (업로드 항목 전용 문서검색 및 업무도우미) */}
        {activeGnb === 'ai_worker' && (
          <AiWorker onShowToast={showToast} />
        )}

        {/* VIEW 5: AI Agent (KPC 검증 완료 공식 Agent) */}
        {activeGnb === 'ai_agent' && (
          <AiAgentView 
            userRole={userRole} 
            agents={verifiedAgents}
            setAgents={setVerifiedAgents}
            onShowToast={showToast} 
            onNavigateTab={(tab) => setActiveGnb(tab as GnbTab)}
          />
        )}

        {/* VIEW 6: AI Community (검토 전 Agent 자유 공유 커뮤니티 공간) */}
        {activeGnb === 'ai_community' && (
          <AiCommunityView 
            userRole={userRole}
            posts={communityPosts}
            setPosts={setCommunityPosts}
            onRegisterAsAgent={handleRegisterCommunityAsAgent}
            onRegisterAsCustomAi={handleRegisterCommunityAsCustomAi}
            onHoldAudit={handleHoldCommunityAudit}
            onShowToast={showToast} 
            onNavigateTab={(tab) => setActiveGnb(tab as GnbTab)}
          />
        )}
      </div>

      {/* Global Toast Notification */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={handleCloseToast}
        />
      )}

      {/* Proposal Conversion Modal */}
      {convertModalOpen && (
        <ProposalConvertModal
          isOpen={convertModalOpen}
          onClose={() => setConvertModalOpen(false)}
          rfp={rfpToConvert}
          initialTitle={rfpToConvert?.title}
          onConfirm={handleConfirmConvert}
        />
      )}
    </div>
  );
}
