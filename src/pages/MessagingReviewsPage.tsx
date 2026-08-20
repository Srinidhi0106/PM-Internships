import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Star,
  Building2,
  Send,
  Paperclip,
  CheckCheck,
  Search,
  Filter,
  ThumbsUp,
  Award,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  User,
  Plus,
  HelpCircle,
  PhoneCall,
  Video,
  Smile,
  AlertCircle
} from 'lucide-react';
import { User as UserType } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface MessagingReviewsPageProps {
  user: UserType;
}

interface ChatMessage {
  id: string;
  sender: 'student' | 'company' | 'mca';
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  attachment?: {
    name: string;
    type: 'pdf' | 'doc' | 'image';
    size: string;
  };
}

interface Conversation {
  id: string;
  companyName: string;
  contactPerson: string;
  roleTitle: string;
  avatar: string;
  online: boolean;
  lastActive: string;
  unreadCount: number;
  verifiedPartner: boolean;
  schemeQuota: string;
  messages: ChatMessage[];
}

interface CompanyReview {
  id: string;
  companyName: string;
  logo: string;
  reviewerName: string;
  reviewerCollege: string;
  internshipRole: string;
  overallRating: number;
  learningRating: number;
  cultureRating: number;
  stipendRating: number;
  ppoRating: number;
  date: string;
  headline: string;
  reviewText: string;
  pros: string;
  cons: string;
  helpfulCount: number;
  userUpvoted?: boolean;
}

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-tcs',
    companyName: 'Tata Consultancy Services (TCS)',
    contactPerson: 'Aditi Deshmukh (Lead University Relations)',
    roleTitle: 'AI & Data Engineering Intern Hiring Team',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150',
    online: true,
    lastActive: 'Active now',
    unreadCount: 1,
    verifiedPartner: true,
    schemeQuota: '500+ PM Scheme Slots',
    messages: [
      {
        id: 'm1',
        sender: 'company',
        text: 'Hello candidate! Welcome to the PM Internship Scheme channel for TCS. We have reviewed your profile and resume credentials.',
        timestamp: '10:30 AM',
        status: 'read'
      },
      {
        id: 'm2',
        sender: 'company',
        text: 'Your application for AI & Data Engineering Intern is currently under technical review. Do you have any prior experience in Python or Data Analytics pipelines?',
        timestamp: '10:31 AM',
        status: 'read'
      },
      {
        id: 'm3',
        sender: 'student',
        text: 'Thank you! Yes, I have built predictive ML models and worked with PostgreSQL and FastAPI during my academic project.',
        timestamp: '10:34 AM',
        status: 'read'
      },
      {
        id: 'm4',
        sender: 'company',
        text: 'That aligns well with our enterprise analytics domain under the PM Scheme! We will schedule your interactive mock assessment round soon.',
        timestamp: '10:36 AM',
        status: 'read'
      }
    ]
  },
  {
    id: 'conv-tatamotors',
    companyName: 'Tata Motors (EV Division)',
    contactPerson: 'Vikram Sengupta (Campus Talent Head)',
    roleTitle: 'EV Battery Tech & Powertrain Desk',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    online: true,
    lastActive: 'Active now',
    unreadCount: 0,
    verifiedPartner: true,
    schemeQuota: '350+ PM Scheme Slots',
    messages: [
      {
        id: 'm-tm-1',
        sender: 'company',
        text: 'Greetings from Tata Motors EV Campus Recruitment! We are looking for passionate candidates for our Pune & Sanand electric mobility facilities.',
        timestamp: 'Yesterday',
        status: 'read'
      },
      {
        id: 'm-tm-2',
        sender: 'student',
        text: 'Hi Vikram! What is the relocation allowance and accommodation support provided for outstation interns?',
        timestamp: 'Yesterday',
        status: 'read'
      },
      {
        id: 'm-tm-3',
        sender: 'company',
        text: 'Under the PM Scheme, you receive the ₹6,000 one-time relocation grant from MCA, and Tata Motors provides subsidized hostel/transit accommodation for the initial 2 weeks!',
        timestamp: 'Yesterday',
        status: 'read'
      }
    ]
  },
  {
    id: 'conv-infosys',
    companyName: 'Infosys Limited',
    contactPerson: 'Rohit Kulkarni (Early Careers Manager)',
    roleTitle: 'Full Stack & Cloud Solutions Team',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    online: false,
    lastActive: 'Active 20m ago',
    unreadCount: 0,
    verifiedPartner: true,
    schemeQuota: '600+ PM Scheme Slots',
    messages: [
      {
        id: 'm-inf-1',
        sender: 'company',
        text: 'Hello! Infosys Springboard & PM Internship programs offer training at our Mysuru campus before project deployment.',
        timestamp: 'Aug 12',
        status: 'read'
      }
    ]
  },
  {
    id: 'conv-hdfc',
    companyName: 'HDFC Bank',
    contactPerson: 'Pooja Nair (FinTech Talent Acquisition)',
    roleTitle: 'Digital Banking & Analytics Cell',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150',
    online: true,
    lastActive: 'Active now',
    unreadCount: 0,
    verifiedPartner: true,
    schemeQuota: '400+ PM Scheme Slots',
    messages: [
      {
        id: 'm-hdfc-1',
        sender: 'company',
        text: 'Welcome! HDFC Bank digital internship offers hands-on exposure to Core Banking, Fraud Prevention, and UPI transaction analytics.',
        timestamp: 'Aug 10',
        status: 'read'
      }
    ]
  },
  {
    id: 'conv-mca',
    companyName: 'Ministry of Corporate Affairs (MCA)',
    contactPerson: 'PM Scheme Helpdesk Officer #MCA-402',
    roleTitle: 'Official Grievance & Stipend Support',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150',
    online: true,
    lastActive: '24/7 Official MCA Bot',
    unreadCount: 0,
    verifiedPartner: true,
    schemeQuota: 'Govt. Regulatory Desk',
    messages: [
      {
        id: 'm-mca-1',
        sender: 'mca',
        text: 'Namaste! Welcome to the PM Internship Scheme Official MCA Grievance & Information Desk. How may we assist with your eligibility, DBT bank account seeding, or verification?',
        timestamp: 'Aug 08',
        status: 'read'
      }
    ]
  }
];

const INITIAL_REVIEWS: CompanyReview[] = [
  {
    id: 'rev-1',
    companyName: 'Tata Consultancy Services (TCS)',
    logo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100',
    reviewerName: 'Siddharth Rao',
    reviewerCollege: 'IIT Kharagpur',
    internshipRole: 'AI & Data Engineering Intern (Batch 2024-25)',
    overallRating: 4.8,
    learningRating: 4.9,
    cultureRating: 4.8,
    stipendRating: 5.0,
    ppoRating: 4.7,
    date: 'July 2025',
    headline: 'Exceptional mentorship and seamless monthly stipend disbursement!',
    reviewText: 'Worked on real enterprise machine learning pipelines. The monthly ₹5,000 stipend was credited promptly by the 1st of every month via DBT. Managers were very supportive of academic schedules.',
    pros: 'Direct exposure to Fortune 500 clients, excellent cloud compute resources, strong chance of full-time conversion.',
    cons: 'Initial onboarding documentation in the first week takes time.',
    helpfulCount: 42
  },
  {
    id: 'rev-2',
    companyName: 'Tata Motors (EV Division)',
    logo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100',
    reviewerName: 'Ananya Iyer',
    reviewerCollege: 'Anna University, Chennai',
    internshipRole: 'EV Powertrain & Battery Systems Intern',
    overallRating: 4.9,
    learningRating: 5.0,
    cultureRating: 4.7,
    stipendRating: 4.9,
    ppoRating: 4.8,
    date: 'June 2025',
    headline: 'Cutting-edge clean mobility lab with great technical leadership',
    reviewText: 'Got hands-on experience in Battery Management Systems and thermal safety tests. The ₹6,000 one-time grant arrived in my Aadhaar-linked account within 5 days of joining.',
    pros: 'High quality technical mentoring, state-of-the-art testing rigs, high conversion rate to Junior EV Engineer.',
    cons: 'Plant location requires utilizing the provided company transit bus.',
    helpfulCount: 38
  },
  {
    id: 'rev-3',
    companyName: 'Infosys Limited',
    logo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
    reviewerName: 'Harsh Vardhan',
    reviewerCollege: 'NIT Trichy',
    internshipRole: 'Cloud Solutions & Full Stack Intern',
    overallRating: 4.7,
    learningRating: 4.8,
    cultureRating: 4.9,
    stipendRating: 4.8,
    ppoRating: 4.5,
    date: 'May 2025',
    headline: 'World-class training facilities and collaborative developer culture',
    reviewText: 'The Mysore training phase was phenomenal. We worked on React, Node.js, and Azure microservices. The PM scheme team at Infosys was very helpful throughout.',
    pros: 'Springboard library access, structured sprint cycles, friendly team leads.',
    cons: 'Strict badge attendance policy for in-office hybrid days.',
    helpfulCount: 29
  },
  {
    id: 'rev-4',
    companyName: 'HDFC Bank',
    logo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=100',
    reviewerName: 'Pooja Verma',
    reviewerCollege: 'St. Xavier’s College, Mumbai',
    internshipRole: 'FinTech Analytics & Risk Intern',
    overallRating: 4.6,
    learningRating: 4.7,
    cultureRating: 4.5,
    stipendRating: 4.9,
    ppoRating: 4.6,
    date: 'April 2025',
    headline: 'Valuable insights into digital payments and banking security',
    reviewText: 'Great exposure to fraud prevention algorithms and UPI transaction volume analysis. Gained immense confidence in corporate finance workflows.',
    pros: 'High brand credibility on resume, fast-paced projects, punctual stipend release.',
    cons: 'Banking compliance rules are strict with internet access restrictions on office PCs.',
    helpfulCount: 21
  }
];

export const MessagingReviewsPage: React.FC<MessagingReviewsPageProps> = ({ user }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'messages' | 'reviews'>('messages');
  
  // Conversations State
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [selectedConvId, setSelectedConvId] = useState<string>('conv-tcs');
  const [searchConvText, setSearchConvText] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [isTypingReply, setIsTypingReply] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Reviews State
  const [reviews, setReviews] = useState<CompanyReview[]>(INITIAL_REVIEWS);
  const [filterCompany, setFilterCompany] = useState<string>('all');
  const [searchReviewText, setSearchReviewText] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);

  // New Review Form State
  const [newCompanyName, setNewCompanyName] = useState('Tata Consultancy Services (TCS)');
  const [newRoleTitle, setNewRoleTitle] = useState('AI & Data Engineering Intern');
  const [newRating, setNewRating] = useState(5);
  const [newHeadline, setNewHeadline] = useState('');
  const [newReviewText, setNewReviewText] = useState('');
  const [newPros, setNewPros] = useState('');
  const [newCons, setNewCons] = useState('');
  const [reviewSuccessToast, setReviewSuccessToast] = useState(false);

  const selectedConv = conversations.find((c) => c.id === selectedConvId) || conversations[0];

  const filteredConversations = conversations.filter((c) =>
    c.companyName.toLowerCase().includes(searchConvText.toLowerCase()) ||
    c.contactPerson.toLowerCase().includes(searchConvText.toLowerCase()) ||
    c.roleTitle.toLowerCase().includes(searchConvText.toLowerCase())
  );

  const filteredReviews = reviews.filter((r) => {
    const matchCompany = filterCompany === 'all' || r.companyName === filterCompany;
    const matchSearch =
      r.companyName.toLowerCase().includes(searchReviewText.toLowerCase()) ||
      r.headline.toLowerCase().includes(searchReviewText.toLowerCase()) ||
      r.reviewText.toLowerCase().includes(searchReviewText.toLowerCase()) ||
      r.internshipRole.toLowerCase().includes(searchReviewText.toLowerCase());
    return matchCompany && matchSearch;
  });

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (activeTab === 'messages' && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedConv?.messages, isTypingReply, activeTab]);

  const handleSendMessage = (customText?: string) => {
    const textToSend = customText || messageInput.trim();
    if (!textToSend || !selectedConv) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'student',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === selectedConvId) {
          return {
            ...c,
            messages: [...c.messages, newMessage]
          };
        }
        return c;
      })
    );

    if (!customText) {
      setMessageInput('');
    }

    // Simulate smart enterprise recruiter reply
    setIsTypingReply(true);
    setTimeout(() => {
      let replyText = `Thank you for your message regarding the PM Internship Scheme at ${selectedConv.companyName}. Our talent desk has logged your response, and our team will update your candidate portal shortly!`;
      
      const lower = textToSend.toLowerCase();
      if (lower.includes('interview') || lower.includes('schedule')) {
        replyText = `Our technical interview assessment is conducted through the AI Mock Interview simulator. Once you achieve an 80%+ benchmark score, our panel sends the official Google Meet invite!`;
      } else if (lower.includes('stipend') || lower.includes('money') || lower.includes('payment') || lower.includes('5000')) {
        replyText = `The ₹5,000 monthly allowance (₹4,500 from MCA + ₹500 corporate CSR) is directly credited via Direct Benefit Transfer (DBT) into your Aadhaar-seeded bank account by the 1st week of every month.`;
      } else if (lower.includes('relocation') || lower.includes('6000') || lower.includes('grant')) {
        replyText = `The one-time ₹6,000 incidental and relocation grant is disbursed upon joining confirmation and submission of your joining report on the MCA portal.`;
      } else if (lower.includes('ppo') || lower.includes('full time') || lower.includes('job') || lower.includes('convert')) {
        replyText = `Top performers under the PM Internship Scheme are eligible for Pre-Placement Offers (PPOs) into Junior Executive & Associate Engineer roles at ${selectedConv.companyName}.`;
      } else if (lower.includes('resume') || lower.includes('cv') || lower.includes('portfolio')) {
        replyText = `Your verified resume and ATS score have been attached to your recruiter dashboard. The hiring manager is currently reviewing domain matching.`;
      }

      const incomingReply: ChatMessage = {
        id: `reply-${Date.now()}`,
        sender: selectedConv.id === 'conv-mca' ? 'mca' : 'company',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'read'
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === selectedConvId) {
            return {
              ...c,
              messages: [...c.messages, incomingReply]
            };
          }
          return c;
        })
      );
      setIsTypingReply(false);
    }, 1200);
  };

  const handleUpvoteReview = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id === reviewId) {
          const isUpvoted = r.userUpvoted;
          return {
            ...r,
            helpfulCount: isUpvoted ? r.helpfulCount - 1 : r.helpfulCount + 1,
            userUpvoted: !isUpvoted
          };
        }
        return r;
      })
    );
  };

  const handleCreateReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHeadline.trim() || !newReviewText.trim()) return;

    const created: CompanyReview = {
      id: `rev-${Date.now()}`,
      companyName: newCompanyName,
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=100',
      reviewerName: user.name || 'Verified PM Intern',
      reviewerCollege: user.college || 'Government College of Engineering',
      internshipRole: `${newRoleTitle} (Batch 2025)`,
      overallRating: newRating,
      learningRating: Math.min(5, newRating),
      cultureRating: Math.min(5, newRating),
      stipendRating: 5.0,
      ppoRating: Math.max(4, newRating - 0.2),
      date: 'Just now',
      headline: newHeadline.trim(),
      reviewText: newReviewText.trim(),
      pros: newPros.trim() || 'Structured mentorship, prompt stipend payment.',
      cons: newCons.trim() || 'Standard enterprise guidelines apply.',
      helpfulCount: 1,
      userUpvoted: true
    };

    setReviews([created, ...reviews]);
    setShowReviewModal(false);
    setNewHeadline('');
    setNewReviewText('');
    setNewPros('');
    setNewCons('');
    setReviewSuccessToast(true);
    setTimeout(() => setReviewSuccessToast(false), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800 px-3 py-1 rounded-full text-xs font-bold">
            <MessageSquare className="w-3.5 h-3.5 fill-purple-400" />
            <span>ENTERPRISE RECRUITER CHAT & VERIFIED EMPLOYER REVIEWS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Messaging & Employer Reviews Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl font-medium leading-relaxed">
            Directly message verified recruiters from India's top 500 partner enterprises, resolve scheme inquiries with the MCA desk, and read transparent reviews from fellow PM Scheme interns.
          </p>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-8 text-xs font-bold">
        <button
          onClick={() => setActiveTab('messages')}
          className={`pb-3 transition border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'messages'
              ? 'border-purple-600 text-purple-600 dark:text-purple-400 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Direct Recruiter Messaging ({conversations.reduce((acc, c) => acc + c.unreadCount, 0)} New)</span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`pb-3 transition border-b-2 flex items-center gap-2 cursor-pointer ${
            activeTab === 'reviews'
              ? 'border-purple-600 text-purple-600 dark:text-purple-400 font-extrabold'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
          <span>Verified Employer Ratings & Reviews ({reviews.length})</span>
        </button>
      </div>

      {/* TAB 1: DIRECT MESSAGING PORTAL */}
      {activeTab === 'messages' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">
          
          {/* Left Sidebar: Conversations List (4 cols) */}
          <div className="lg:col-span-4 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/50 dark:bg-slate-950/40">
            {/* Search Box */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchConvText}
                  onChange={(e) => setSearchConvText(e.target.value)}
                  placeholder="Search recruiters or companies..."
                  className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold px-1">
                <span>ACTIVE CONVERSATIONS</span>
                <span className="bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full">
                  {filteredConversations.length} Channels
                </span>
              </div>
            </div>

            {/* Conversation Threads */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredConversations.map((conv) => {
                const isSelected = conv.id === selectedConvId;
                const lastMsg = conv.messages[conv.messages.length - 1];

                return (
                  <button
                    key={conv.id}
                    onClick={() => {
                      setSelectedConvId(conv.id);
                      // Clear unread
                      setConversations((prev) =>
                        prev.map((c) => (c.id === conv.id ? { ...c, unreadCount: 0 } : c))
                      );
                    }}
                    className={`w-full p-4 text-left transition flex items-start gap-3 cursor-pointer hover:bg-slate-100/80 dark:hover:bg-slate-800/50 ${
                      isSelected
                        ? 'bg-purple-50/80 dark:bg-purple-950/30 border-l-4 border-purple-600'
                        : ''
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={conv.avatar}
                        alt={conv.contactPerson}
                        className="w-11 h-11 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-xs"
                      />
                      {conv.online && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">
                          {conv.companyName}
                        </h4>
                        <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                          {lastMsg ? lastMsg.timestamp : ''}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">
                        {conv.contactPerson}
                      </p>

                      <div className="flex items-center justify-between pt-0.5">
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 truncate max-w-[180px]">
                          {lastMsg ? lastMsg.text : 'Start conversation...'}
                        </p>
                        {conv.unreadCount > 0 && (
                          <span className="bg-purple-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full shrink-0">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Area: Active Chat Window (8 cols) */}
          <div className="lg:col-span-8 flex flex-col h-full min-h-[580px]">
            {/* Active Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={selectedConv.avatar}
                    alt={selectedConv.contactPerson}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                  />
                  {selectedConv.online && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">
                      {selectedConv.companyName}
                    </h3>
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    {selectedConv.contactPerson} • <span className="text-emerald-600 dark:text-emerald-400 font-bold">{selectedConv.lastActive}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="hidden sm:inline-flex bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full">
                  {selectedConv.schemeQuota}
                </span>
              </div>
            </div>

            {/* Quick Inquiry Chips */}
            <div className="px-4 py-2 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto text-[11px]">
              <span className="font-bold text-slate-400 shrink-0 text-[10px] uppercase">Quick Inquiries:</span>
              {[
                '📅 When is my interview scheduled?',
                '💰 How is the ₹5,000 monthly stipend credited?',
                '📄 Can I get my PM Scheme offer letter status?',
                '🎯 What is the PPO full-time conversion rate?'
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(chip)}
                  className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-purple-400 dark:hover:border-purple-500 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-lg shrink-0 font-medium transition cursor-pointer hover:text-purple-600"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Chat Messages Stream */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/40 dark:bg-slate-950/20">
              {/* Official Verification Security Notice */}
              <div className="p-3 bg-purple-50/60 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40 rounded-2xl text-[11px] text-purple-950 dark:text-purple-200 text-center font-medium max-w-xl mx-auto flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0" />
                <span>End-to-End verified PM Internship Scheme communications channel. No personal banking credentials will ever be requested.</span>
              </div>

              {selectedConv.messages.map((msg) => {
                const isMe = msg.sender === 'student';
                return (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    {!isMe && (
                      <img
                        src={selectedConv.avatar}
                        alt="Recruiter"
                        className="w-7 h-7 rounded-lg object-cover mb-1 border border-slate-200 dark:border-slate-700"
                      />
                    )}

                    <div
                      className={`max-w-md p-3.5 rounded-2xl text-xs space-y-1 shadow-xs ${
                        isMe
                          ? 'bg-purple-600 text-white rounded-br-xs'
                          : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-bl-xs'
                      }`}
                    >
                      <p className="leading-relaxed font-medium">{msg.text}</p>
                      <div className={`flex items-center justify-end gap-1 text-[10px] ${isMe ? 'text-purple-200' : 'text-slate-400'}`}>
                        <span>{msg.timestamp}</span>
                        {isMe && <CheckCheck className="w-3.5 h-3.5 text-purple-200" />}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Typing Indicator */}
              {isTypingReply && (
                <div className="flex items-center gap-2 text-xs text-slate-400 animate-pulse pl-2">
                  <img
                    src={selectedConv.avatar}
                    alt="Typing"
                    className="w-6 h-6 rounded-md object-cover border"
                  />
                  <span>{selectedConv.companyName} is typing response...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Message Input Box */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2"
            >
              <button
                type="button"
                onClick={() => {
                  alert('Resume & Candidate Portfolio successfully attached to current recruiter chat thread!');
                  handleSendMessage('📎 [Attached: Candidate_PM_Internship_Resume.pdf]');
                }}
                className="p-2.5 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                title="Attach Resume / Document"
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder={`Message ${selectedConv.companyName}...`}
                className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />

              <button
                type="submit"
                disabled={!messageInput.trim()}
                className="p-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white rounded-xl transition shadow-md cursor-pointer disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: VERIFIED EMPLOYER REVIEWS PORTAL */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          {/* Top Review Stats & Action Bar */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 font-black text-2xl flex items-center justify-center shadow-md">
                4.8
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                  <span className="text-xs font-black text-slate-900 dark:text-white ml-1">Overall Scheme Partner Rating</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                  Based on 1,420+ verified reviews by PM Internship Scheme alumni across Top 500 companies.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowReviewModal(true)}
              className="px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Write a Verified Review</span>
            </button>
          </div>

          {/* Toast message if review posted */}
          {reviewSuccessToast && (
            <div className="bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800 p-4 rounded-2xl text-xs font-bold flex items-center gap-2 animate-bounce">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>Your verified employer review has been published to the PM Scheme candidate network!</span>
            </div>
          )}

          {/* Filters & Search Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1 shrink-0">
                <Filter className="w-3.5 h-3.5" /> Company:
              </span>
              {[
                { id: 'all', label: 'All Companies' },
                { id: 'Tata Consultancy Services (TCS)', label: 'TCS' },
                { id: 'Tata Motors (EV Division)', label: 'Tata Motors' },
                { id: 'Infosys Limited', label: 'Infosys' },
                { id: 'HDFC Bank', label: 'HDFC Bank' }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilterCompany(f.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
                    filterCompany === f.id
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchReviewText}
                onChange={(e) => setSearchReviewText(e.target.value)}
                placeholder="Search reviews by keyword..."
                className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Reviews List Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                          {rev.companyName}
                        </h3>
                        <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Verified Intern
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">
                        {rev.reviewerName} • {rev.reviewerCollege}
                      </p>
                      <p className="text-[11px] text-purple-600 dark:text-purple-400 font-bold">
                        {rev.internshipRole}
                      </p>
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 px-2.5 py-1 rounded-xl text-center shrink-0">
                      <span className="text-xs font-black text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        {rev.overallRating}
                      </span>
                    </div>
                  </div>

                  {/* Rating Breakdown Pill Bar */}
                  <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] bg-slate-50 dark:bg-slate-950 p-2 rounded-xl border border-slate-100 dark:border-slate-800/80">
                    <div>
                      <span className="text-slate-400 block font-medium">Learning</span>
                      <span className="font-bold text-slate-900 dark:text-white">{rev.learningRating}★</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Culture</span>
                      <span className="font-bold text-slate-900 dark:text-white">{rev.cultureRating}★</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Stipend</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">{rev.stipendRating}★</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">PPO Rate</span>
                      <span className="font-bold text-indigo-600 dark:text-indigo-400">{rev.ppoRating}★</span>
                    </div>
                  </div>

                  {/* Headline & Body */}
                  <div className="space-y-1.5 pt-1">
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                      "{rev.headline}"
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                      {rev.reviewText}
                    </p>
                  </div>

                  {/* Pros & Cons */}
                  <div className="space-y-1.5 pt-1 text-[11px]">
                    <div className="p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 text-emerald-950 dark:text-emerald-200">
                      <strong className="text-emerald-700 dark:text-emerald-300">Pros: </strong>
                      <span>{rev.pros}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 text-rose-950 dark:text-rose-200">
                      <strong className="text-rose-700 dark:text-rose-300">Cons: </strong>
                      <span>{rev.cons}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Bar */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400 font-medium">{rev.date}</span>
                  <button
                    type="button"
                    onClick={() => handleUpvoteReview(rev.id)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition text-[11px] cursor-pointer ${
                      rev.userUpvoted
                        ? 'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300'
                        : 'text-slate-500 hover:text-purple-600 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Helpful ({rev.helpfulCount})</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Modal: Write a Verified Review */}
          {showReviewModal && (
            <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6 my-8 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-500" />
                    <h2 className="text-lg font-black text-slate-900 dark:text-white">
                      Submit Verified Employer Review
                    </h2>
                  </div>
                  <button
                    onClick={() => setShowReviewModal(false)}
                    className="text-slate-400 hover:text-slate-600 font-bold text-base cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleCreateReview} className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      Partner Enterprise Company
                    </label>
                    <select
                      value={newCompanyName}
                      onChange={(e) => setNewCompanyName(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 font-semibold text-slate-900 dark:text-white"
                    >
                      <option value="Tata Consultancy Services (TCS)">Tata Consultancy Services (TCS)</option>
                      <option value="Tata Motors (EV Division)">Tata Motors (EV Division)</option>
                      <option value="Infosys Limited">Infosys Limited</option>
                      <option value="HDFC Bank">HDFC Bank</option>
                      <option value="Larsen & Toubro (L&T)">Larsen & Toubro (L&T)</option>
                      <option value="Reliance Industries Limited">Reliance Industries Limited</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      Internship Role Title
                    </label>
                    <input
                      type="text"
                      required
                      value={newRoleTitle}
                      onChange={(e) => setNewRoleTitle(e.target.value)}
                      placeholder="e.g. AI & Data Engineering Intern"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      Overall Rating (1 to 5 Stars)
                    </label>
                    <div className="flex items-center gap-2 pt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className="p-1 cursor-pointer transition transform hover:scale-110"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= newRating
                                ? 'fill-amber-400 text-amber-500'
                                : 'text-slate-300 dark:text-slate-700'
                            }`}
                          />
                        </button>
                      ))}
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white ml-2">
                        {newRating}.0 / 5.0
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      Review Headline
                    </label>
                    <input
                      type="text"
                      required
                      value={newHeadline}
                      onChange={(e) => setNewHeadline(e.target.value)}
                      placeholder="e.g. Great learning curve and supportive engineering team"
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-600 dark:text-slate-400 block mb-1">
                      Detailed Experience & Feedback
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={newReviewText}
                      onChange={(e) => setNewReviewText(e.target.value)}
                      placeholder="Describe your day-to-day projects, stipend timeliness, and mentoring support..."
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-emerald-600 block mb-1">Key Pros</label>
                      <input
                        type="text"
                        value={newPros}
                        onChange={(e) => setNewPros(e.target.value)}
                        placeholder="e.g. Prompt DBT stipend, free lunch"
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-rose-600 block mb-1">Key Cons</label>
                      <input
                        type="text"
                        value={newCons}
                        onChange={(e) => setNewCons(e.target.value)}
                        placeholder="e.g. Strict attendance logging"
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setShowReviewModal(false)}
                      className="px-4 py-2.5 text-slate-600 dark:text-slate-400 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-xl shadow-md transition cursor-pointer"
                    >
                      Publish Verified Review
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
