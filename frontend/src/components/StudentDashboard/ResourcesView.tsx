import React, { useState, useEffect } from 'react';
import { 
  Download, ExternalLink, BookOpen, 
  Building2, Search, CheckCircle2, Sparkles, Clock, 
  ShieldCheck, Loader2
} from 'lucide-react';
import { api } from '../../services/api';

interface StudyResource {
  id: string;
  title: string;
  companyName: string;
  companyLogo: string;
  companyBg: string;
  type: 'INTERVIEW_GUIDE' | 'CODING_OA' | 'SYSTEM_DESIGN' | 'VIDEO_WALKTHROUGH' | 'HANDBOOK';
  category: string;
  roleSpecific: string;
  description: string;
  sharedDate: string;
  estimatedReadTime: string;
  fileSize?: string;
  guideDetails?: {
    overview: string;
    interviewRounds: { round: string; duration: string; focus: string; tips: string }[];
    coreTopics: string[];
    sampleQuestions: { question: string; difficulty: string; topic: string }[];
    recruiterTips: string[];
  };
  externalUrl?: string;
}

export const ResourcesView: React.FC = () => {
  const [appliedCompanies, setAppliedCompanies] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadStudentApplications();
  }, []);

  const loadStudentApplications = async () => {
    try {
      setLoading(true);

      const res = await api.getMyApplications().catch(() => ({ data: [] }));
      const apps = res?.data || [];

      // Extract unique company names student applied to
      const comps = Array.from(
        new Set(
          apps
            .map((a: any) => (a.companyName || a.company?.name || '').trim())
            .filter(Boolean)
        )
      ) as string[];

      setAppliedCompanies(comps);
    } catch (err) {
      console.error('Failed to load applications for study resources:', err);
    } finally {
      setLoading(false);
    }
  };

  // Curated company-shared preparation material
  const allCompanyResources: StudyResource[] = [
    // -------------------------------------------------------------
    // GOOGLE INDIA RESOURCES (Shared for Faizaan's application)
    // -------------------------------------------------------------
    {
      id: 'goog_interview_guide',
      title: 'Google Technical Interview Guide: Campus 2027 SWE',
      companyName: 'Google India',
      companyLogo: 'G',
      companyBg: '#1E293B',
      type: 'INTERVIEW_GUIDE',
      category: 'Interview Preparation',
      roleSpecific: 'Software Engineer - Campus 2027',
      description: 'Official candidate guide shared by Google University Programs explaining the 4-round technical interview process, whiteboard coding rubric, and Googleyness criteria.',
      sharedDate: 'Shared 2 days ago',
      estimatedReadTime: '12 min read',
      fileSize: 'Interactive Guide',
      guideDetails: {
        overview: 'This comprehensive guide is prepared by Google India Engineering Recruiters specifically for campus hiring candidates. We focus on foundational computer science principles, scalable problem solving, and collaborative thinking.',
        interviewRounds: [
          {
            round: 'Round 1: Online Coding Assessment (OA)',
            duration: '90 Minutes (2 Problems)',
            focus: 'Data Structures, Graph Traversal, & Dynamic Programming',
            tips: 'Focus on optimal time complexity. Google automated graders test for memory limits and large scale corner test cases.'
          },
          {
            round: 'Round 2: Technical Problem Solving I',
            duration: '45 Minutes with Senior SWE',
            focus: 'Live Coding on Google Workspace Sandbox',
            tips: 'Think out loud. Our interviewers evaluate your thought process and how you navigate ambiguity more than memorized code.'
          },
          {
            round: 'Round 3: Systems & Data Structures Deep-Dive',
            duration: '45 Minutes with Staff Engineer',
            focus: 'API Design, Concurrency, & Trade-off Analysis',
            tips: 'Always ask clarifying questions regarding scale, throughput, and error boundaries before designing data structures.'
          },
          {
            round: 'Round 4: Googleyness & Collaborative Leadership',
            duration: '45 Minutes with Engineering Manager',
            focus: 'Intellectual humility, handling peer conflict, and bias for action',
            tips: 'Use the STAR method (Situation, Task, Action, Result). Highlight examples of teamwork and learning from failures.'
          }
        ],
        coreTopics: [
          'Binary Search & Two Pointers on Sorted Arrays',
          'Breadth-First Search (BFS) & Depth-First Search (DFS) on Graphs',
          'Dynamic Programming (State Transitions & Memoization)',
          'Trie & Prefix Tree String Implementations',
          'Hash Tables with Custom Hash Functions & Collision Resolution'
        ],
        sampleQuestions: [
          {
            question: 'Given a distributed stream of user queries, find the Top K trending keywords in real-time with O(1) latency.',
            difficulty: 'Hard',
            topic: 'Min-Heap & Hash Map'
          },
          {
            question: 'Find the minimum time required to deliver packages across an undirected weighted graph with road congestion.',
            difficulty: 'Medium',
            topic: 'Dijkstra / Shortest Path'
          },
          {
            question: 'Implement an in-memory Key-Value store with TTL (Time-To-Live) expiration and transaction rollback support.',
            difficulty: 'Medium-Hard',
            topic: 'System Data Structures'
          }
        ],
        recruiterTips: [
          'Never jump straight into coding. Spend 5-7 minutes confirming constraints, inputs, and edge scenarios.',
          'State brute-force complexity first (e.g. O(N^2)), then brainstorm optimizations (e.g. O(N log N)).',
          'Write clean, modular code with descriptive variable names — clean code is evaluated as part of the rubric.',
          'Test your solution step-by-step with a sample trace before declaring your code complete.'
        ]
      }
    },
    {
      id: 'goog_oa_practice',
      title: 'Google OA Practice Sandbox: 10 High-Frequency Problems',
      companyName: 'Google India',
      companyLogo: 'G',
      companyBg: '#1E293B',
      type: 'CODING_OA',
      category: 'Online Assessment Prep',
      roleSpecific: 'Software Engineer & Cloud Native Architect',
      description: 'Direct practice kit with previous Google campus OA questions, automated test runners, and time-complexity benchmarks.',
      sharedDate: 'Shared 3 days ago',
      estimatedReadTime: '45 min practice',
      fileSize: 'Interactive Sandbox',
      guideDetails: {
        overview: 'Directly provided by Google India Campus Hiring to prepare candidates for the upcoming HackerEarth/HackerRank assessment window.',
        interviewRounds: [
          {
            round: 'Practice Problem Set A',
            duration: '45 Minutes',
            focus: 'Array manipulation, sliding windows, and bitwise arithmetic',
            tips: 'Pay close attention to 64-bit integer overflows and null pointer validations.'
          },
          {
            round: 'Practice Problem Set B',
            duration: '45 Minutes',
            focus: 'Tree serialization and topological sorting',
            tips: 'Optimize auxiliary space complexity to pass Google high-memory constraints.'
          }
        ],
        coreTopics: [
          'Sliding Window & Monotonic Queue',
          'Topological Sorting (Kahns Algorithm)',
          'Segment Trees & Fenwick Trees for Range Queries',
          'Bit Manipulation & XOR Trickery'
        ],
        sampleQuestions: [
          {
            question: 'Count the number of sub-arrays where the difference between max and min element is at most K.',
            difficulty: 'Medium',
            topic: 'Two Pointers & Monotonic Deque'
          },
          {
            question: 'Given server dependencies in a Google Cloud cluster, find the optimal parallel deployment order.',
            difficulty: 'Medium',
            topic: 'Topological Sort / DAG'
          }
        ],
        recruiterTips: [
          'Run edge cases like empty lists, maximum possible inputs (N = 10^5), and duplicate values.',
          'Avoid recursion depth limits in Python; prefer iterative solutions or increase recursion limit.'
        ]
      }
    },
    {
      id: 'goog_video_walkthrough',
      title: 'How Google Evaluates Engineering Candidates: Video Session',
      companyName: 'Google India',
      companyLogo: 'G',
      companyBg: '#1E293B',
      type: 'VIDEO_WALKTHROUGH',
      category: 'Recruiter Video Masterclass',
      roleSpecific: 'Software Engineer - Campus 2027',
      description: 'Watch a 25-minute recorded workshop by Google Bangalore engineering leads demonstrating a live mock interview and feedback rubric.',
      sharedDate: 'Shared 1 week ago',
      estimatedReadTime: '25 min video',
      fileSize: 'Video Stream',
      externalUrl: 'https://careers.google.com/how-we-hire/interviewing/',
      guideDetails: {
        overview: 'Official walkthrough recording hosted by Google Bangalore Campus Talent Acquisition team.',
        interviewRounds: [
          {
            round: 'Module 1: What Interviewers Look For',
            duration: '8 Minutes',
            focus: 'Communication & Problem Solving',
            tips: 'Demonstrating how to formulate questions when the problem statement is ambiguous.'
          },
          {
            round: 'Module 2: Live Mock Interview Demonstration',
            duration: '12 Minutes',
            focus: 'Real-time coding & handling interviewer hints',
            tips: 'How to gracefully accept hints without losing confidence.'
          },
          {
            round: 'Module 3: Post-Interview Feedback & Calibration',
            duration: '5 Minutes',
            focus: 'Hiring Committee (HC) Review Process',
            tips: 'Understand how interview scores (Strong Hire, Hire, Leaning Hire) are calibrated.'
          }
        ],
        coreTopics: ['Live Coding Etiquette', 'Accepting Feedback', 'System Modeling'],
        sampleQuestions: [],
        recruiterTips: [
          'Treat your interviewer like a colleague you are pairing with on a production bug.',
          'If you realize your initial approach has flaws, pause and explain why you are pivoting.'
        ]
      }
    },

    // -------------------------------------------------------------
    // AMAZON WEB SERVICES RESOURCES (Shared for Faizaan's AWS SDE-1)
    // -------------------------------------------------------------
    {
      id: 'amz_leadership_guide',
      title: 'Amazon Leadership Principles in SDE Technical Interviews',
      companyName: 'Amazon Web Services',
      companyLogo: 'AMZ',
      companyBg: '#D97706',
      type: 'INTERVIEW_GUIDE',
      category: 'Behavioral & Leadership',
      roleSpecific: 'SDE-1 (Graduate Engineer)',
      description: 'Curated handbook on how AWS engineering managers evaluate Customer Obsession, Ownership, Bias for Action, and Deliver Results during technical rounds.',
      sharedDate: 'Shared 4 days ago',
      estimatedReadTime: '15 min read',
      fileSize: '3.2 MB PDF',
      guideDetails: {
        overview: 'At Amazon, 50% of the interview weighting is based on our 16 Leadership Principles (LPs). Every technical round dedicates 15-20 minutes to behavioral deep dives.',
        interviewRounds: [
          {
            round: 'Customer Obsession & Ownership',
            duration: '15 Minutes',
            focus: 'User impact and taking accountability',
            tips: 'Share examples where you went beyond your project scope to fix customer friction.'
          },
          {
            round: 'Bias for Action & Frugality',
            duration: '15 Minutes',
            focus: 'Making calculated decisions under time pressure',
            tips: 'Discuss two-way door decisions where taking calculated risks saved engineering effort.'
          }
        ],
        coreTopics: ['STAR Framework', 'Quantifiable Metrics', 'Ownership Mindset'],
        sampleQuestions: [
          {
            question: 'Tell me about a time you had to make a technical decision with incomplete requirements.',
            difficulty: 'Behavioral',
            topic: 'Bias for Action'
          },
          {
            question: 'Describe a project where you noticed an impending issue that no one else was addressing.',
            difficulty: 'Behavioral',
            topic: 'Ownership'
          }
        ],
        recruiterTips: [
          'Avoid generic answers like "we did this" — use "I designed", "I investigated", "I implemented".',
          'Have 3-4 distinct project stories ready that can map to multiple leadership principles.'
        ]
      }
    },
    {
      id: 'amz_sys_design_primer',
      title: 'AWS SDE-1 Distributed Systems Primer & Object-Oriented Design',
      companyName: 'Amazon Web Services',
      companyLogo: 'AMZ',
      companyBg: '#D97706',
      type: 'SYSTEM_DESIGN',
      category: 'Architecture & OOD',
      roleSpecific: 'SDE-1 (Graduate Engineer)',
      description: 'Foundational architectural guide covering low-level class diagrams, message queues (SQS), DynamoDB design patterns, and caching tiers.',
      sharedDate: 'Shared 5 days ago',
      estimatedReadTime: '20 min read',
      fileSize: '4.5 MB PDF',
      guideDetails: {
        overview: 'AWS SDE-1 candidates are expected to demonstrate clean Object-Oriented Design (SOLID principles) and fundamental understanding of distributed system bottlenecks.',
        interviewRounds: [
          {
            round: 'Object-Oriented Design (Low Level Design)',
            duration: '45 Minutes',
            focus: 'Design Patterns & Extensibility',
            tips: 'Use Factory, Strategy, and Observer patterns to build maintainable, testable classes.'
          }
        ],
        coreTopics: ['SOLID Principles', 'Pub/Sub Architecture', 'Database Sharding & Caching'],
        sampleQuestions: [
          {
            question: 'Design an Amazon Locker Delivery System with locker reservation, authentication, and pickup timeouts.',
            difficulty: 'Medium-Hard',
            topic: 'Low Level System Design'
          },
          {
            question: 'Design a scalable URL Shortening Service capable of handling 10,000 requests/second.',
            difficulty: 'Medium',
            topic: 'Distributed Systems'
          }
        ],
        recruiterTips: [
          'Identify the single point of failure (SPOF) in your architecture and propose mitigation.',
          'Be prepared to justify SQL vs NoSQL selection based on query access patterns.'
        ]
      }
    },

    // -------------------------------------------------------------
    // MICROSOFT CORPORATION RESOURCES (Shared for Faizaan's MS application)
    // -------------------------------------------------------------
    {
      id: 'ms_screening_breakdown',
      title: 'Microsoft Codility Screening & Technical Rubric Handbook',
      companyName: 'Microsoft Corporation',
      companyLogo: 'MS',
      companyBg: '#0284C7',
      type: 'CODING_OA',
      category: 'Codility Assessment Prep',
      roleSpecific: 'Frontend & Full Stack Software Engineer',
      description: 'Preparation blueprint shared by Microsoft India University Relations for their online Codility test and subsequent virtual interviews.',
      sharedDate: 'Shared 6 days ago',
      estimatedReadTime: '10 min read',
      fileSize: '2.1 MB PDF',
      guideDetails: {
        overview: 'Microsoft evaluates candidates on code cleanliness, test-driven thinking, and clear modularity.',
        interviewRounds: [
          {
            round: 'Online Codility Challenge',
            duration: '60 Minutes (3 Questions)',
            focus: 'Algorithmic efficiency and boundary condition handling',
            tips: 'Codility tests against performance benchmarks; O(N log N) is mandatory for large datasets.'
          }
        ],
        coreTopics: ['Strings & Hash Maps', 'Tree Inversions & Binary Heaps', 'Concurrency Basics'],
        sampleQuestions: [
          {
            question: 'Find the longest semi-alternating substring in a binary string with at most 2 consecutive identical characters.',
            difficulty: 'Medium',
            topic: 'String / Two Pointers'
          },
          {
            question: 'Calculate minimum meeting rooms required for overlapping calendar schedules.',
            difficulty: 'Medium',
            topic: 'Interval Scheduling & Min-Heap'
          }
        ],
        recruiterTips: [
          'Microsoft values unit test mindset. Always write out test assertions for edge cases.',
          'Ensure your code is clean and adheres to production style guidelines.'
        ]
      }
    }
  ];

  // Filter resources based on student's actual applied companies
  // If the student has applied to Google India, show Google resources.
  // If student has applied to AWS, show AWS resources.
  // If student hasn't applied to a company, that company's resources are NOT shown!
  const studentEligibleResources = allCompanyResources.filter((resource) => {
    // If student applied to companies, only show resources matching applied companies
    if (appliedCompanies.length > 0) {
      return appliedCompanies.some((comp) => 
        resource.companyName.toLowerCase().includes(comp.toLowerCase()) ||
        comp.toLowerCase().includes(resource.companyName.toLowerCase())
      );
    }
    return false;
  });

  // Filter by active tab & search query
  const displayedResources = studentEligibleResources.filter((r) => {
    const matchesTab = 
      activeTab === 'ALL' ||
      (activeTab === 'GUIDES' && r.type === 'INTERVIEW_GUIDE') ||
      (activeTab === 'CODING' && r.type === 'CODING_OA') ||
      (activeTab === 'SYSTEM_DESIGN' && r.type === 'SYSTEM_DESIGN') ||
      (activeTab === 'VIDEOS' && r.type === 'VIDEO_WALKTHROUGH') ||
      r.companyName.toLowerCase() === activeTab.toLowerCase();

    const matchesSearch = 
      !searchQuery ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.companyName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  // Download simulation
  const handleDownload = (resource: StudyResource) => {
    const content = `
================================================================================
${resource.companyName.toUpperCase()} - OFFICIAL CAMPUS PREPARATION RESOURCE
Title: ${resource.title}
Target Role: ${resource.roleSpecific}
Shared By: ${resource.companyName} University Recruitment
Timestamp: ${new Date().toLocaleString()}
================================================================================

OVERVIEW:
${resource.guideDetails?.overview || resource.description}

INTERVIEW ROUNDS BREAKDOWN:
${(resource.guideDetails?.interviewRounds || []).map((r, i) => `
[Round ${i + 1}] ${r.round} (${r.duration})
Focus: ${r.focus}
Recruiter Advice: ${r.tips}
`).join('\n')}

CORE TOPICS TO MASTER:
${(resource.guideDetails?.coreTopics || []).map((t) => ` - ${t}`).join('\n')}

SAMPLE PROBLEMS:
${(resource.guideDetails?.sampleQuestions || []).map((q, i) => `
${i + 1}. [${q.difficulty}] ${q.question} (Topic: ${q.topic})
`).join('\n')}

RECRUITER DO'S & DON'TS:
${(resource.guideDetails?.recruiterTips || []).map((t) => ` * ${t}`).join('\n')}

GIET Training & Placement Cell • Verified Campus Resource
`.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${resource.companyName.replace(/\s+/g, '_')}_Prep_Guide.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccess(resource.title);
    setTimeout(() => setDownloadSuccess(null), 3500);
  };

  if (loading) {
    return (
      <div className="view-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '360px', color: '#64748B' }}>
        <Loader2 size={24} style={{ marginRight: '10px', animation: 'spin 1s linear infinite', color: '#2563EB' }} />
        <span>Loading study resources shared by your applied companies...</span>
      </div>
    );
  }

  return (
    <div className="view-container">
      {/* Download Alert Toast */}
      {downloadSuccess && (
        <div 
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
            padding: '12px 18px',
            borderRadius: '8px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.86rem',
            zIndex: 9999,
            animation: 'fadeIn 0.2s ease-out'
          }}
        >
          <CheckCircle2 size={18} color="#22C55E" />
          <span>Downloaded: <strong>{downloadSuccess}</strong></span>
        </div>
      )}

      {/* Header Banner */}
      <div 
        className="section-card" 
        style={{ 
          marginBottom: '20px', 
          background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%)',
          color: '#FFFFFF',
          padding: '24px',
          border: 'none',
          borderRadius: '12px',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '780px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(255, 255, 255, 0.12)', padding: '4px 10px', borderRadius: '999px', fontSize: '0.74rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '12px' }}>
            <Sparkles size={13} color="#60A5FA" />
            Applied Company Resource Hub
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, margin: '0 0 8px 0', color: '#FFFFFF' }}>
            Company-Shared Study Resources & Interview Guides
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#CBD5E1', lineHeight: '1.5', margin: 0 }}>
            Materials, interview rubrics, coding practice problems, and walkthroughs shared directly by the recruiters of companies you have applied to for campus placements.
          </p>
        </div>
      </div>

      {/* Main Section */}
      <div className="section-card" style={{ padding: '20px' }}>
        {/* Filters and Search Bar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          {/* Filter Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={() => setActiveTab('ALL')}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                backgroundColor: activeTab === 'ALL' ? '#2563EB' : '#F1F5F9',
                color: activeTab === 'ALL' ? '#FFFFFF' : '#475569',
                border: activeTab === 'ALL' ? 'none' : '1px solid #E2E8F0',
                transition: 'all 0.15s ease'
              }}
            >
              All Materials ({studentEligibleResources.length})
            </button>

            {appliedCompanies.map((comp) => {
              const compCount = studentEligibleResources.filter(r => r.companyName.toLowerCase().includes(comp.toLowerCase())).length;
              const isSelected = activeTab.toLowerCase() === comp.toLowerCase();
              return (
                <button
                  key={comp}
                  onClick={() => setActiveTab(comp)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    backgroundColor: isSelected ? '#0F172A' : '#FFFFFF',
                    color: isSelected ? '#FFFFFF' : '#334155',
                    border: isSelected ? 'none' : '1px solid #CBD5E1',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Building2 size={13} color={isSelected ? '#60A5FA' : '#64748B'} />
                  <span>{comp} ({compCount})</span>
                </button>
              );
            })}

            <button
              onClick={() => setActiveTab('GUIDES')}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                backgroundColor: activeTab === 'GUIDES' ? '#2563EB' : '#F8FAFC',
                color: activeTab === 'GUIDES' ? '#FFFFFF' : '#64748B',
                border: '1px solid #E2E8F0'
              }}
            >
              Interview Guides
            </button>
            <button
              onClick={() => setActiveTab('CODING')}
              style={{
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                backgroundColor: activeTab === 'CODING' ? '#2563EB' : '#F8FAFC',
                color: activeTab === 'CODING' ? '#FFFFFF' : '#64748B',
                border: '1px solid #E2E8F0'
              }}
            >
              Coding & OA Practice
            </button>
          </div>

          {/* Search Box */}
          <div style={{ position: 'relative', minWidth: '240px' }}>
            <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input
              type="text"
              placeholder="Search guides, topics, questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 10px 8px 32px',
                fontSize: '0.82rem',
                border: '1px solid #CBD5E1',
                borderRadius: '6px',
                backgroundColor: '#F8FAFC',
                outline: 'none',
                color: '#1E293B',
              }}
            />
          </div>
        </div>

        {/* =========================================================
            STATE A: If student has NOT applied to any company (e.g. Dilip / Sravan)
            ========================================================= */}
        {appliedCompanies.length === 0 ? (
          <div 
            style={{ 
              padding: '48px 24px', 
              textAlign: 'center', 
              backgroundColor: '#F8FAFC', 
              borderRadius: '12px', 
              border: '1px dashed #CBD5E1',
              maxWidth: '640px',
              margin: '30px auto'
            }}
          >
            <div 
              style={{ 
                width: '54px', 
                height: '54px', 
                borderRadius: '12px', 
                backgroundColor: '#EFF6FF', 
                color: '#2563EB', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                margin: '0 auto 16px auto'
              }}
            >
              <BookOpen size={28} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
              No Company-Shared Resources Available Yet
            </h3>
            <p style={{ fontSize: '0.86rem', color: '#64748B', lineHeight: '1.5', marginBottom: '20px' }}>
              Companies share official preparation blueprints, technical interview guides, and online assessment sandboxes directly with candidates who apply to their placement drives.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 16px', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.82rem', color: '#334155' }}>
              <ShieldCheck size={16} color="#16A34A" />
              <span>Apply to <strong>Google</strong>, <strong>Amazon</strong>, or <strong>Microsoft</strong> in the Smart Matches tab to unlock their official prep kits.</span>
            </div>
          </div>
        ) : displayedResources.length === 0 ? (
          /* STATE B: No results matching filter */
          <div style={{ padding: '36px', textAlign: 'center', color: '#64748B' }}>
            <p>No study resources matched your search filter.</p>
            <button 
              className="btn-secondary" 
              onClick={() => { setActiveTab('ALL'); setSearchQuery(''); }}
              style={{ marginTop: '8px', padding: '6px 14px', fontSize: '0.82rem' }}
            >
              Clear Filter
            </button>
          </div>
        ) : (
          /* =========================================================
              STATE C: Grid of Curated Applied Company Resources
              ========================================================= */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '18px' }}>
            {displayedResources.map((res) => {
              return (
                <div 
                  key={res.id} 
                  style={{ 
                    border: '1px solid #E2E8F0', 
                    borderRadius: '12px', 
                    backgroundColor: '#FFFFFF',
                    padding: '20px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'space-between', 
                    gap: '16px',
                    transition: 'all 0.15s ease',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = '#93C5FD';
                    e.currentTarget.style.boxShadow = '0 6px 12px -2px rgba(37, 99, 235, 0.08)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = '#E2E8F0';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.03)';
                  }}
                >
                  {/* Top Header */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div 
                          style={{ 
                            width: '36px', 
                            height: '36px', 
                            borderRadius: '8px', 
                            backgroundColor: res.companyBg, 
                            color: '#FFFFFF', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '0.88rem'
                          }}
                        >
                          {res.companyLogo}
                        </div>
                        <div>
                          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>
                            {res.companyName}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                            {res.sharedDate}
                          </div>
                        </div>
                      </div>

                      {/* Resource Type Badge (No Box) */}
                      <span 
                        style={{ 
                          fontSize: '0.74rem', 
                          fontWeight: 700, 
                          color: res.type === 'INTERVIEW_GUIDE' ? '#2563EB' : res.type === 'CODING_OA' ? '#059669' : '#475569',
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em'
                        }}
                      >
                        {res.category}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0F172A', lineHeight: '1.4', margin: '0 0 8px 0' }}>
                      {res.title}
                    </h4>

                    <div style={{ fontSize: '0.75rem', color: '#2563EB', fontWeight: 600, marginBottom: '8px' }}>
                      For: {res.roleSpecific}
                    </div>

                    <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: '1.5', margin: 0 }}>
                      {res.description}
                    </p>
                  </div>

                  {/* Metadata and Actions */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.74rem', color: '#64748B', paddingTop: '12px', borderTop: '1px solid #F1F5F9', marginBottom: '12px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={13} />
                        {res.estimatedReadTime}
                      </span>
                      <span>{res.fileSize || 'Online Module'}</span>
                    </div>

                    {/* Single Action Button (No Read Guide) */}
                    <div>
                      {res.externalUrl ? (
                        <a
                          href={res.externalUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            width: '100%',
                            padding: '10px 14px',
                            borderRadius: '8px',
                            backgroundColor: '#2563EB',
                            color: '#FFFFFF',
                            fontSize: '0.84rem',
                            fontWeight: 600,
                            textDecoration: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            boxSizing: 'border-box'
                          }}
                        >
                          <ExternalLink size={15} />
                          <span>Visit Official Portal</span>
                        </a>
                      ) : (
                        <button
                          onClick={() => handleDownload(res)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            width: '100%',
                            padding: '10px 14px',
                            borderRadius: '8px',
                            backgroundColor: '#2563EB',
                            color: '#FFFFFF',
                            fontSize: '0.84rem',
                            fontWeight: 600,
                            border: 'none',
                            cursor: 'pointer'
                          }}
                        >
                          <Download size={15} />
                          <span>Download Material</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
