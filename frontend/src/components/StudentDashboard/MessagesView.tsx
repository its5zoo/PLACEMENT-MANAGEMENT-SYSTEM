import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Search, Building2, GraduationCap, ArrowLeft, 
  RotateCcw, Sparkles, ShieldCheck, Loader2,
  CheckCheck
} from 'lucide-react';
import { api } from '../../services/api';

interface ChatMessage {
  id: string | number;
  sender: string;
  senderTitle?: string;
  text: string;
  time: string;
  isMe: boolean;
}

interface ChatChannel {
  id: string;
  name: string;
  contactTitle: string;
  companyName?: string;
  roleApplied?: string;
  applicationStatus?: string;
  isInstitutional: boolean;
  avatarText: string;
  avatarBg: string;
  unreadCount?: number;
}

export const MessagesView: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<any>(() => api.getCurrentUser());
  const [channels, setChannels] = useState<ChatChannel[]>([]);
  const [activeChannelId, setActiveChannelId] = useState<string>('tnp_placement_cell');
  const [chatThreads, setChatThreads] = useState<Record<string, ChatMessage[]>>({});
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inputText, setInputText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [mobileShowChat, setMobileShowChat] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const studentName = currentUser?.name || 'Student';
  const studentFirstName = studentName.split(' ')[0] || 'Student';
  const storageKey = `tnp_chat_history_${currentUser?._id || currentUser?.email || 'faizaan'}`;

  // 1. Fetch Student profile & applied companies
  useEffect(() => {
    loadChannelsAndHistory();
  }, []);

  // Auto-scroll on new message or channel change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatThreads, activeChannelId, isTyping]);

  const loadChannelsAndHistory = async () => {
    try {
      setLoading(true);
      const user = api.getCurrentUser();
      if (user) setCurrentUser(user);

      // Fetch student's real applications from DB
      const res = await api.getMyApplications().catch(() => ({ data: [] }));
      const applications = res?.data || [];

      // 1. Permanent Institutional Channel (TNP Placement Cell)
      const tnpChannel: ChatChannel = {
        id: 'tnp_placement_cell',
        name: 'TNP Placement Cell Officer',
        contactTitle: 'Prof. Rajesh Mohanty (Head, T&P GIET)',
        isInstitutional: true,
        avatarText: 'TNP',
        avatarBg: '#1E3A8A', // Deep navy
        unreadCount: 0,
      };

      // 2. Company Recruiter Channels: ONLY for companies the student has actually applied to!
      // Deduplicate applications by company name
      const companyMap = new Map<string, any>();
      applications.forEach((app: any) => {
        const comp = (app.companyName || app.company?.name || '').trim();
        if (comp && !companyMap.has(comp)) {
          companyMap.set(comp, app);
        }
      });

      const companyChannels: ChatChannel[] = [];
      companyMap.forEach((app, compName) => {
        // Vibrant brand colors
        let bg = '#0284C7';
        if (compName.toLowerCase().includes('google')) bg = '#1E293B';
        else if (compName.toLowerCase().includes('amazon')) bg = '#D97706';
        else if (compName.toLowerCase().includes('microsoft')) bg = '#0369A1';
        else if (compName.toLowerCase().includes('tcs') || compName.toLowerCase().includes('tata')) bg = '#0F766E';

        const logoText = (app.logo || compName.slice(0, 3)).toUpperCase();

        companyChannels.push({
          id: `channel_${compName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}`,
          name: `${compName} Campus Recruiter`,
          contactTitle: `${compName} University Talent Acquisition`,
          companyName: compName,
          roleApplied: app.role || 'Campus Graduate Program',
          applicationStatus: app.status || 'APPLIED',
          isInstitutional: false,
          avatarText: logoText.length > 3 ? logoText.slice(0, 2) : logoText,
          avatarBg: bg,
          unreadCount: 0,
        });
      });

      const allChannels = [tnpChannel, ...companyChannels];
      setChannels(allChannels);

      // Load or initialize chat threads
      const savedThreads = localStorage.getItem(storageKey);
      if (savedThreads) {
        try {
          const parsed = JSON.parse(savedThreads);
          setChatThreads(parsed);
          setLoading(false);
          return;
        } catch {
          // fallback to seed
        }
      }

      // Initialize realistic seed messages for each channel
      const initialThreads: Record<string, ChatMessage[]> = {
        tnp_placement_cell: [
          {
            id: 'tnp_1',
            sender: 'Prof. Rajesh Mohanty',
            senderTitle: 'TNP Placement Officer',
            text: `Hi ${studentFirstName}, welcome to GIET Placement Portal. Please ensure all your verified documents are uploaded and your resume profile is complete.`,
            time: '10:15 AM',
            isMe: false,
          },
          {
            id: 'tnp_2',
            sender: 'You',
            text: 'Thank you Sir! I have uploaded my academic marksheets and verified my tech stack.',
            time: '10:20 AM',
            isMe: true,
          },
          {
            id: 'tnp_3',
            sender: 'Prof. Rajesh Mohanty',
            senderTitle: 'TNP Placement Officer',
            text: 'Excellent! All the best for the upcoming recruitment drives and technical rounds.',
            time: '10:22 AM',
            isMe: false,
          },
        ]
      };

      // Add seed threads for each applied company channel
      companyChannels.forEach((ch) => {
        if (ch.companyName?.toLowerCase().includes('google')) {
          initialThreads[ch.id] = [
            {
              id: `${ch.id}_1`,
              sender: 'Google Campus Recruiter',
              senderTitle: 'Google India Talent Team',
              text: `Greetings ${studentFirstName}! We have received your application for the ${ch.roleApplied} role.`,
              time: '11:00 AM',
              isMe: false,
            },
            {
              id: `${ch.id}_2`,
              sender: 'Google Campus Recruiter',
              senderTitle: 'Google India Talent Team',
              text: 'Our campus evaluation team has reviewed your profile. Shortlisted candidates will be invited for the online coding assessment round.',
              time: '11:01 AM',
              isMe: false,
            }
          ];
        } else if (ch.companyName?.toLowerCase().includes('amazon')) {
          initialThreads[ch.id] = [
            {
              id: `${ch.id}_1`,
              sender: 'AWS University Recruiting',
              senderTitle: 'Amazon Web Services',
              text: `Hello ${studentFirstName}! Thanks for applying to Amazon Web Services for ${ch.roleApplied}.`,
              time: 'Yesterday',
              isMe: false,
            },
            {
              id: `${ch.id}_2`,
              sender: 'AWS University Recruiting',
              senderTitle: 'Amazon Web Services',
              text: 'Your application is currently Under Review with our technical screening team. Make sure to review our leadership principles.',
              time: 'Yesterday',
              isMe: false,
            }
          ];
        } else if (ch.companyName?.toLowerCase().includes('microsoft')) {
          initialThreads[ch.id] = [
            {
              id: `${ch.id}_1`,
              sender: 'Microsoft University Relations',
              senderTitle: 'Microsoft Recruitment',
              text: `Hi ${studentFirstName}! Welcome to the Microsoft Campus Drive. We are currently processing applications for ${ch.roleApplied}.`,
              time: '2 days ago',
              isMe: false,
            },
            {
              id: `${ch.id}_2`,
              sender: 'Microsoft University Relations',
              senderTitle: 'Microsoft Recruitment',
              text: 'Keep your technical projects and GitHub repository accessible for evaluation by our engineering panel.',
              time: '2 days ago',
              isMe: false,
            }
          ];
        } else {
          initialThreads[ch.id] = [
            {
              id: `${ch.id}_1`,
              sender: `${ch.companyName} Recruiter`,
              senderTitle: `${ch.companyName} Talent Acquisition`,
              text: `Greetings from ${ch.companyName}! We have received your application for ${ch.roleApplied}.`,
              time: 'Recently',
              isMe: false,
            },
            {
              id: `${ch.id}_2`,
              sender: `${ch.companyName} Recruiter`,
              senderTitle: `${ch.companyName} Talent Acquisition`,
              text: 'Our campus hiring team will coordinate selection rounds and interview slots via this portal.',
              time: 'Recently',
              isMe: false,
            }
          ];
        }
      });

      setChatThreads(initialThreads);
      localStorage.setItem(storageKey, JSON.stringify(initialThreads));
    } catch (err) {
      console.error('Failed to load chat channels:', err);
    } finally {
      setLoading(false);
    }
  };

  const activeChannel = channels.find((c) => c.id === activeChannelId) || channels[0];
  const currentMessages = chatThreads[activeChannelId] || [];

  const formatCurrentTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  // Automated intelligent bot reply generator
  const generateRecruiterReply = (userMsg: string, channel: ChatChannel): string => {
    const q = userMsg.toLowerCase();

    if (channel.isInstitutional) {
      if (q.includes('document') || q.includes('marksheet') || q.includes('transcript') || q.includes('verify')) {
        return 'Your uploaded academic marksheets and identity documents have been approved by the placement cell. No further action is required.';
      }
      if (q.includes('interview') || q.includes('drive') || q.includes('date') || q.includes('slot') || q.includes('time')) {
        return 'Drive interview slots will be published on the Drive Schedule page. Shortlisted students will also receive SMS and portal alerts.';
      }
      if (q.includes('eligibility') || q.includes('cgpa') || q.includes('backlog') || q.includes('criteria')) {
        return 'Campus drive eligibility cutoffs are configured automatically according to each company’s recruitment criteria.';
      }
      return `Thank you ${studentFirstName}. Your note regarding "${userMsg}" has been logged by the TNP placement desk. We will assist you promptly.`;
    }

    // Company Recruiter Responses
    const comp = channel.companyName || 'Our company';
    const role = channel.roleApplied || 'the role';

    if (q.includes('interview') || q.includes('round') || q.includes('slot') || q.includes('date')) {
      return `Our technical interviews for ${role} are planned via video conference. Qualified candidates will receive their scheduled time slot link 24 hours in advance.`;
    }
    if (q.includes('assessment') || q.includes('test') || q.includes('pattern') || q.includes('syllabus') || q.includes('coding')) {
      return `The online assessment consists of 2 Algorithmic Coding challenges (DSA) and 15 Computer Science Fundamentals MCQs. Total duration is 90 minutes.`;
    }
    if (q.includes('status') || q.includes('result') || q.includes('shortlist') || q.includes('update')) {
      return `Your application for ${role} is currently marked as "${channel.applicationStatus || 'In Progress'}". Shortlist results are synchronized with the GIET TNP office.`;
    }
    if (q.includes('location') || q.includes('relocation') || q.includes('stipend') || q.includes('package') || q.includes('salary')) {
      return `Work locations and compensation details are aligned with the official placement drive charter. Relocation and onboarding allowances will be provided upon offer acceptance.`;
    }
    if (q.includes('project') || q.includes('github') || q.includes('resume') || q.includes('portfolio')) {
      return `We have received your verified resume profile and project links directly through your campus portal. The technical panel will review them before the interview.`;
    }

    return `Thank you for following up, ${studentFirstName}! We have received your query regarding "${userMsg}". The ${comp} campus recruiting panel will update this channel shortly.`;
  };

  const handleSendMessage = (messageToSend?: string) => {
    const text = (messageToSend || inputText).trim();
    if (!text || !activeChannel) return;

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'You',
      text: text,
      time: formatCurrentTime(),
      isMe: true,
    };

    const updated = {
      ...chatThreads,
      [activeChannelId]: [...currentMessages, newMsg],
    };

    setChatThreads(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setInputText('');

    // Trigger typing simulation & automated response
    setIsTyping(true);
    setTimeout(() => {
      const replyText = generateRecruiterReply(text, activeChannel);
      const replyMsg: ChatMessage = {
        id: `reply_${Date.now()}`,
        sender: activeChannel.isInstitutional ? 'Prof. Rajesh Mohanty' : `${activeChannel.companyName} Recruiter`,
        senderTitle: activeChannel.contactTitle,
        text: replyText,
        time: formatCurrentTime(),
        isMe: false,
      };

      setChatThreads((prev) => {
        const finalThreads = {
          ...prev,
          [activeChannelId]: [...(prev[activeChannelId] || []), replyMsg],
        };
        localStorage.setItem(storageKey, JSON.stringify(finalThreads));
        return finalThreads;
      });
      setIsTyping(false);
    }, 1200);
  };

  const handleResetChat = () => {
    if (window.confirm('Reset this conversation to its initial demo state?')) {
      localStorage.removeItem(storageKey);
      loadChannelsAndHistory();
    }
  };

  const filteredChannels = channels.filter((c) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      (c.companyName && c.companyName.toLowerCase().includes(q)) ||
      (c.roleApplied && c.roleApplied.toLowerCase().includes(q))
    );
  });

  const appliedCompaniesCount = channels.filter((c) => !c.isInstitutional).length;

  if (loading) {
    return (
      <div className="view-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '380px', color: '#64748B' }}>
        <Loader2 size={24} style={{ marginRight: '10px', animation: 'spin 1s linear infinite', color: '#2563EB' }} />
        <span>Loading verified recruiter and placement channels...</span>
      </div>
    );
  }

  return (
    <div className="view-container">
      <style>{`
        .chat-layout-grid {
          display: grid;
          grid-template-columns: 320px 1fr;
          min-height: 620px;
        }
        @media (max-width: 768px) {
          .chat-layout-grid {
            display: flex !important;
            flex-direction: column !important;
            min-height: 550px;
          }
          .chat-sidebar-hidden-mobile {
            display: none !important;
          }
          .chat-window-hidden-mobile {
            display: none !important;
          }
        }
      `}</style>

      {/* Outer Card Container */}
      <div 
        className="section-card chat-layout-grid" 
        style={{ 
          padding: 0, 
          overflow: 'hidden', 
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)'
        }}
      >
        {/* =========================================================
            LEFT PANEL: Inboxes & Applied Companies
            ========================================================= */}
        <div 
          className={mobileShowChat ? 'chat-sidebar-hidden-mobile' : ''}
          style={{ 
            borderRight: '1px solid #E2E8F0', 
            backgroundColor: '#F8FAFC', 
            display: 'flex', 
            flexDirection: 'column',
            height: '100%' 
          }}
        >
          {/* Channel Header */}
          <div style={{ padding: '16px', borderBottom: '1px solid #E2E8F0', backgroundColor: '#FFFFFF' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>Messages & Inboxes</h3>
                <span style={{ fontSize: '0.74rem', color: '#64748B' }}>
                  {appliedCompaniesCount} Applied {appliedCompaniesCount === 1 ? 'Company' : 'Companies'} Connected
                </span>
              </div>
              <span 
                style={{ 
                  backgroundColor: '#EFF6FF', 
                  color: '#2563EB', 
                  fontSize: '0.72rem', 
                  fontWeight: 700, 
                  padding: '3px 8px', 
                  borderRadius: '999px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22C55E' }}></span>
                Live Sync
              </span>
            </div>

            {/* Search filter */}
            <div style={{ position: 'relative' }}>
              <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input
                type="text"
                placeholder="Search recruiter or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px 8px 32px',
                  fontSize: '0.82rem',
                  border: '1px solid #E2E8F0',
                  borderRadius: '6px',
                  backgroundColor: '#F8FAFC',
                  outline: 'none',
                  color: '#1E293B',
                }}
              />
            </div>
          </div>

          {/* Channels List */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
            {/* Category: Institutional */}
            <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B', padding: '6px 8px' }}>
              Institutional Channel
            </div>

            {filteredChannels.filter(c => c.isInstitutional).map((ch) => {
              const isSelected = activeChannelId === ch.id;
              const lastMsg = (chatThreads[ch.id] || [])[chatThreads[ch.id]?.length - 1];

              return (
                <div
                  key={ch.id}
                  onClick={() => {
                    setActiveChannelId(ch.id);
                    setMobileShowChat(true);
                  }}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF',
                    border: isSelected ? '1px solid #BFDBFE' : '1px solid #E2E8F0',
                    cursor: 'pointer',
                    marginBottom: '8px',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 1px 3px rgba(37, 99, 235, 0.1)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div 
                      style={{ 
                        width: '38px', 
                        height: '38px', 
                        borderRadius: '8px', 
                        backgroundColor: ch.avatarBg, 
                        color: '#FFFFFF', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.85rem',
                        flexShrink: 0
                      }}
                    >
                      <GraduationCap size={20} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '0.88rem', fontWeight: 700, color: isSelected ? '#1D4ED8' : '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {ch.name}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>{lastMsg ? lastMsg.time : ''}</span>
                      </div>
                      <div style={{ fontSize: '0.76rem', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '2px' }}>
                        {lastMsg ? lastMsg.text : 'GIET Central Placement Desk'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Category: Applied Companies */}
            <div style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748B', padding: '12px 8px 6px 8px' }}>
              Applied Companies ({appliedCompaniesCount})
            </div>

            {appliedCompaniesCount === 0 ? (
              <div 
                style={{ 
                  padding: '16px 12px', 
                  backgroundColor: '#FFFFFF', 
                  borderRadius: '8px', 
                  border: '1px dashed #CBD5E1', 
                  textAlign: 'center',
                  margin: '4px 0'
                }}
              >
                <Building2 size={24} style={{ color: '#94A3B8', margin: '0 auto 8px auto', display: 'block' }} />
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                  No Applied Companies Yet
                </div>
                <div style={{ fontSize: '0.74rem', color: '#64748B', lineHeight: '1.4' }}>
                  When you apply to a campus placement drive, recruiter direct chat unlocks here automatically.
                </div>
              </div>
            ) : (
              filteredChannels.filter(c => !c.isInstitutional).map((ch) => {
                const isSelected = activeChannelId === ch.id;
                const lastMsg = (chatThreads[ch.id] || [])[chatThreads[ch.id]?.length - 1];

                return (
                  <div
                    key={ch.id}
                    onClick={() => {
                      setActiveChannelId(ch.id);
                      setMobileShowChat(true);
                    }}
                    style={{
                      padding: '12px',
                      borderRadius: '8px',
                      backgroundColor: isSelected ? '#EFF6FF' : '#FFFFFF',
                      border: isSelected ? '1px solid #BFDBFE' : '1px solid #E2E8F0',
                      cursor: 'pointer',
                      marginBottom: '8px',
                      transition: 'all 0.15s ease',
                      boxShadow: isSelected ? '0 1px 3px rgba(37, 99, 235, 0.1)' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <div 
                        style={{ 
                          width: '38px', 
                          height: '38px', 
                          borderRadius: '8px', 
                          backgroundColor: ch.avatarBg, 
                          color: '#FFFFFF', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          flexShrink: 0
                        }}
                      >
                        {ch.avatarText}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.86rem', fontWeight: 700, color: isSelected ? '#1D4ED8' : '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {ch.companyName}
                          </span>
                          <span style={{ fontSize: '0.68rem', color: '#94A3B8' }}>{lastMsg ? lastMsg.time : ''}</span>
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#475569', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '1px' }}>
                          {ch.roleApplied}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                          <span 
                            style={{ 
                              fontSize: '0.68rem', 
                              fontWeight: 700, 
                              color: ch.applicationStatus === 'SHORTLISTED' ? '#15803D' : '#2563EB',
                              textTransform: 'uppercase',
                              letterSpacing: '0.04em'
                            }}
                          >
                            ● {ch.applicationStatus || 'APPLIED'}
                          </span>
                          <span style={{ fontSize: '0.68rem', color: '#64748B' }}>Recruiter Desk</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* =========================================================
            RIGHT PANEL: Interactive Active Chat Window
            ========================================================= */}
        <div 
          className={!mobileShowChat ? 'chat-window-hidden-mobile' : ''}
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            height: '100%',
            backgroundColor: '#FFFFFF'
          }}
        >
          {/* Active Chat Header */}
          <div 
            style={{ 
              padding: '14px 20px', 
              borderBottom: '1px solid #E2E8F0', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              backgroundColor: '#FFFFFF',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {/* Mobile Back Button */}
              <button 
                onClick={() => setMobileShowChat(false)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  padding: '6px', 
                  borderRadius: '6px', 
                  border: '1px solid #E2E8F0', 
                  backgroundColor: '#F8FAFC', 
                  cursor: 'pointer',
                  marginRight: '2px'
                }}
                className="md:hidden"
                title="Back to inbox"
              >
                <ArrowLeft size={16} color="#334155" />
              </button>

              <div 
                style={{ 
                  width: '42px', 
                  height: '42px', 
                  borderRadius: '10px', 
                  backgroundColor: activeChannel.avatarBg, 
                  color: '#FFFFFF', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  flexShrink: 0
                }}
              >
                {activeChannel.isInstitutional ? <GraduationCap size={22} /> : activeChannel.avatarText}
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h4 style={{ fontSize: '0.96rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                    {activeChannel.name}
                  </h4>
                  <span 
                    style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '4px', 
                      fontSize: '0.7rem', 
                      color: '#16A34A', 
                      fontWeight: 600 
                    }}
                  >
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#22C55E' }}></span>
                    Online
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                  <span>{activeChannel.contactTitle}</span>
                  {activeChannel.roleApplied && (
                    <>
                      <span>•</span>
                      <span style={{ color: '#2563EB', fontWeight: 600 }}>{activeChannel.roleApplied}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right actions in header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={handleResetChat}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: '#64748B',
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  cursor: 'pointer',
                }}
                title="Reset demo chat history"
              >
                <RotateCcw size={13} />
                <span>Reset Thread</span>
              </button>
            </div>
          </div>

          {/* Chat Messages Area */}
          <div 
            style={{ 
              flex: 1, 
              padding: '20px', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '14px', 
              overflowY: 'auto',
              backgroundColor: '#F8FAFC' 
            }}
          >
            {/* Channel Context Banner */}
            <div 
              style={{ 
                margin: '0 auto 10px auto', 
                backgroundColor: '#FFFFFF', 
                border: '1px solid #E2E8F0', 
                borderRadius: '8px', 
                padding: '8px 14px', 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '8px',
                fontSize: '0.76rem',
                color: '#64748B',
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
              }}
            >
              <ShieldCheck size={15} color="#2563EB" />
              <span>
                {activeChannel.isInstitutional 
                  ? 'Official communication channel with GIET Training & Placement Cell Office.' 
                  : `Verified campus recruitment desk for ${activeChannel.companyName}. Communication is monitored for compliance.`}
              </span>
            </div>

            {/* Messages */}
            {currentMessages.map((m) => (
              <div 
                key={m.id} 
                style={{ 
                  display: 'flex', 
                  justifyContent: m.isMe ? 'flex-end' : 'flex-start',
                  width: '100%'
                }}
              >
                <div 
                  style={{
                    maxWidth: '75%',
                    minWidth: '180px',
                    padding: '12px 16px',
                    borderRadius: m.isMe ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                    backgroundColor: m.isMe ? '#2563EB' : '#FFFFFF',
                    border: m.isMe ? 'none' : '1px solid #E2E8F0',
                    color: m.isMe ? '#FFFFFF' : '#1E293B',
                    boxShadow: m.isMe 
                      ? '0 2px 6px rgba(37, 99, 235, 0.25)' 
                      : '0 2px 4px rgba(0, 0, 0, 0.04)',
                    fontSize: '0.88rem',
                    lineHeight: '1.45',
                  }}
                >
                  {!m.isMe && (
                    <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#2563EB', marginBottom: '4px' }}>
                      {m.sender}
                    </div>
                  )}
                  <div style={{ wordBreak: 'break-word' }}>{m.text}</div>
                  <div 
                    style={{ 
                      fontSize: '0.68rem', 
                      color: m.isMe ? '#DBEAFE' : '#94A3B8', 
                      textAlign: 'right', 
                      marginTop: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: '4px'
                    }}
                  >
                    <span>{m.time}</span>
                    {m.isMe && <CheckCheck size={13} color="#DBEAFE" />}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
                <div 
                  style={{
                    padding: '8px 14px',
                    borderRadius: '12px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    fontSize: '0.76rem',
                    color: '#64748B',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.03)'
                  }}
                >
                  <span style={{ fontWeight: 600, color: '#1E293B' }}>
                    {activeChannel.isInstitutional ? 'Prof. Rajesh Mohanty' : `${activeChannel.companyName} Recruiter`}
                  </span>
                  <span>is typing...</span>
                  <span className="flex gap-1 items-center">
                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#2563EB', animation: 'bounce 1s infinite 0.1s' }}></span>
                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#2563EB', animation: 'bounce 1s infinite 0.2s' }}></span>
                    <span style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: '#2563EB', animation: 'bounce 1s infinite 0.3s' }}></span>
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Chips */}
          <div 
            style={{ 
              padding: '8px 16px', 
              borderTop: '1px solid #E2E8F0', 
              backgroundColor: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              overflowX: 'auto'
            }}
          >
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={12} color="#2563EB" /> Quick Ask:
            </span>
            {[
              activeChannel.isInstitutional ? 'Are my documents fully verified?' : 'What is the online test pattern?',
              activeChannel.isInstitutional ? 'When will drive slots be published?' : 'Interview schedule details?',
              'Work location and relocation policy?',
              'Expected shortlist announcement date?'
            ].map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '999px',
                  border: '1px solid #CBD5E1',
                  backgroundColor: '#F8FAFC',
                  fontSize: '0.74rem',
                  color: '#334155',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease',
                  flexShrink: 0
                }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#EFF6FF')}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Bottom Message Input Bar */}
          <div 
            style={{ 
              padding: '14px 16px', 
              borderTop: '1px solid #E2E8F0', 
              display: 'flex', 
              gap: '10px', 
              backgroundColor: '#FFFFFF',
              alignItems: 'center'
            }}
          >
            <input 
              type="text" 
              placeholder={`Type a message to ${activeChannel.name}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              style={{ 
                flex: 1, 
                padding: '11px 16px', 
                border: '1px solid #CBD5E1', 
                borderRadius: '8px', 
                outline: 'none',
                fontSize: '0.88rem',
                color: '#0F172A',
                backgroundColor: '#F8FAFC',
              }}
            />
            <button 
              className="btn-primary" 
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim()}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '11px 18px',
                borderRadius: '8px',
                backgroundColor: inputText.trim() ? '#2563EB' : '#94A3B8',
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: inputText.trim() ? 'pointer' : 'not-allowed',
                border: 'none',
                transition: 'background-color 0.15s ease'
              }}
            >
              <span>Send</span>
              <Send size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
