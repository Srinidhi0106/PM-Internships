import React, { useState } from 'react';
import {
  Bell,
  Mail,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Send,
  Trash2,
  X,
  Radio,
  Layers,
  HelpCircle,
  Check,
  ShieldCheck,
  Award,
  DollarSign,
  Briefcase,
  FileCheck
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  channel: 'Email' | 'SMS' | 'Push';
  type: 'APPLICATION' | 'RECOMMENDATION' | 'STIPEND' | 'INTERVIEW' | 'SCHEME_UPDATE' | 'CERTIFICATE';
  timestamp: string;
  read: boolean;
  status: 'DELIVERED' | 'SENT' | 'QUEUED';
}

interface NotificationSystemModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
  userName?: string;
  onNavigate?: (tab: string) => void;
  openCertModal?: () => void;
  openStipendModal?: () => void;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Shortlisted for AI & Cloud Internship',
    body: 'Congratulations! Tata Consultancy Services (TCS) reviewed your AI candidate match score (94%) and shortlisted your application for Phase 2 technical interview.',
    channel: 'Email',
    type: 'APPLICATION',
    timestamp: '10 minutes ago',
    read: false,
    status: 'DELIVERED'
  },
  {
    id: 'notif-2',
    title: 'SMS Alert: Monthly DBT Stipend Disbursed',
    body: 'Govt of India MCA DBT: ₹5,000 monthly PM Scheme internship allowance successfully credited to your Aadhaar-linked bank account ending in **4821.',
    channel: 'SMS',
    type: 'STIPEND',
    timestamp: '2 hours ago',
    read: false,
    status: 'DELIVERED'
  },
  {
    id: 'notif-3',
    title: 'Push: 3 New Top 20 PM Internships Matched',
    body: 'Based on your Python, Machine Learning & SQL profile, new high-match openings have been posted by Infosys and Larsen & Toubro.',
    channel: 'Push',
    type: 'RECOMMENDATION',
    timestamp: 'Yesterday',
    read: true,
    status: 'DELIVERED'
  },
  {
    id: 'notif-4',
    title: 'PM Scheme Verified Completion Certificate Ready',
    body: 'Your Ministry-approved Digital Internship Completion Certificate with verifiable cryptographic QR signature is generated and ready to download.',
    channel: 'Email',
    type: 'CERTIFICATE',
    timestamp: '2 days ago',
    read: true,
    status: 'DELIVERED'
  }
];

export const NotificationSystemModal: React.FC<NotificationSystemModalProps> = ({
  isOpen,
  onClose,
  userEmail = 'student@example.com',
  userName = 'Candidate',
  onNavigate,
  openCertModal,
  openStipendModal
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'INBOX' | 'EXPLAINER' | 'PRESETS'>('INBOX');
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [selectedChannel, setSelectedChannel] = useState<'ALL' | 'Email' | 'SMS' | 'Push'>('ALL');
  
  // Custom trigger broadcast state
  const [testChannel, setTestChannel] = useState<'Email' | 'SMS' | 'Push'>('Push');
  const [testType, setTestType] = useState<'APPLICATION' | 'RECOMMENDATION' | 'STIPEND' | 'INTERVIEW' | 'SCHEME_UPDATE' | 'CERTIFICATE'>('RECOMMENDATION');
  const [testTitle, setTestTitle] = useState('');
  const [testBody, setTestBody] = useState('');
  const [broadcastSent, setBroadcastSent] = useState(false);

  // User Notification Gateway Toggles
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(true);

  // Play pleasant chime on alert trigger
  const playAlertChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      }
    } catch {
      // AudioContext unavailable or restricted
    }
  };

  if (!isOpen) return null;

  const filtered = selectedChannel === 'ALL'
    ? notifications
    : notifications.filter(n => n.channel === selectedChannel);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const dispatchNativePushIfSupported = (title: string, body: string) => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        try {
          new Notification(title, {
            body,
            icon: '/favicon.ico'
          });
        } catch {
          // Native notification constructor notice
        }
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((perm) => {
          if (perm === 'granted') {
            try {
              new Notification(title, { body, icon: '/favicon.ico' });
            } catch {}
          }
        });
      }
    }
  };

  const handleSendTestNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testTitle.trim()) return;

    playAlertChime();

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: testTitle,
      body: testBody || `Official alert dispatched via ${testChannel} gateway to ${userName} (${userEmail})`,
      channel: testChannel,
      type: testType,
      timestamp: 'Just now',
      read: false,
      status: 'DELIVERED'
    };

    setNotifications(prev => [newNotif, ...prev]);

    if (testChannel === 'Push' && pushEnabled) {
      dispatchNativePushIfSupported(newNotif.title, newNotif.body);
    }

    setTestTitle('');
    setTestBody('');
    setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 3000);
  };

  const handleTriggerPreset = (preset: {
    title: string;
    body: string;
    channel: 'Email' | 'SMS' | 'Push';
    type: 'APPLICATION' | 'RECOMMENDATION' | 'STIPEND' | 'INTERVIEW' | 'SCHEME_UPDATE' | 'CERTIFICATE';
  }) => {
    playAlertChime();

    const item: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: preset.title,
      body: preset.body,
      channel: preset.channel,
      type: preset.type,
      timestamp: 'Just now',
      read: false,
      status: 'DELIVERED'
    };

    setNotifications(prev => [item, ...prev]);
    if (preset.channel === 'Push' && pushEnabled) {
      dispatchNativePushIfSupported(preset.title, preset.body);
    }
    setActiveTab('INBOX');
    setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 3000);
  };

  const handleNotificationAction = (item: NotificationItem) => {
    onClose();
    if (item.type === 'APPLICATION') {
      if (onNavigate) onNavigate('dashboard');
    } else if (item.type === 'RECOMMENDATION') {
      if (onNavigate) onNavigate('ai-recommendation');
    } else if (item.type === 'STIPEND') {
      if (openStipendModal) openStipendModal();
      else if (onNavigate) onNavigate('dashboard');
    } else if (item.type === 'INTERVIEW') {
      if (onNavigate) onNavigate('ai-interview');
    } else if (item.type === 'CERTIFICATE') {
      if (openCertModal) openCertModal();
      else if (onNavigate) onNavigate('dashboard');
    } else {
      if (onNavigate) onNavigate('internships');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-6 bg-slate-50 dark:bg-slate-950/70 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-sm shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  Multi-Channel Notification Hub
                </h2>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-500 text-white">
                    {unreadCount} New
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Direct Email, SMS & Push Alert Dispatcher for PM Internship Candidates & Ministry
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 pb-0 bg-slate-50/50 dark:bg-slate-950/40 border-b border-slate-200 dark:border-slate-800 flex gap-2">
          <button
            onClick={() => setActiveTab('INBOX')}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'INBOX'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Alerts Inbox ({notifications.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('EXPLAINER')}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'EXPLAINER'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>How It Works (Architecture)</span>
          </button>

          <button
            onClick={() => setActiveTab('PRESETS')}
            className={`px-4 py-2 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'PRESETS'
                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>1-Click Test Scenarios</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* TAB 1: INBOX & DISPATCHER */}
          {activeTab === 'INBOX' && (
            <>
              {/* Notification Gateway Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Email Gateway</p>
                      <p className="text-[10px] text-slate-500">Official offers & letters</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailEnabled}
                    onChange={(e) => setEmailEnabled(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 cursor-pointer"
                  />
                </div>

                <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <Smartphone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">SMS Gateway</p>
                      <p className="text-[10px] text-slate-500">DBT & urgent interview OTP</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={smsEnabled}
                    onChange={(e) => setSmsEnabled(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 cursor-pointer"
                  />
                </div>

                <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                      <Radio className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">Browser Push</p>
                      <p className="text-[10px] text-slate-500">Real-time match alerts</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={pushEnabled}
                    onChange={(e) => setPushEnabled(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Test Trigger / Broadcast Form */}
              <div className="p-4 rounded-2xl border border-amber-300/60 dark:border-amber-800/60 bg-amber-50/40 dark:bg-amber-950/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <h4 className="text-xs font-black uppercase text-amber-900 dark:text-amber-300">
                      Instant Multi-Channel Dispatcher (Email + SMS + Push)
                    </h4>
                  </div>
                  {broadcastSent && (
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Dispatched Successfully!
                    </span>
                  )}
                </div>

                <form onSubmit={handleSendTestNotification} className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                  <select
                    value={testChannel}
                    onChange={(e) => setTestChannel(e.target.value as any)}
                    className="sm:col-span-3 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white"
                  >
                    <option value="Push">🔔 Push Alert</option>
                    <option value="Email">📧 Email Letter</option>
                    <option value="SMS">📱 SMS / DBT</option>
                  </select>

                  <select
                    value={testType}
                    onChange={(e) => setTestType(e.target.value as any)}
                    className="sm:col-span-3 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white"
                  >
                    <option value="RECOMMENDATION">AI Recommendations</option>
                    <option value="APPLICATION">Candidate Shortlist</option>
                    <option value="INTERVIEW">Mock Interview Call</option>
                    <option value="STIPEND">₹5,000 DBT Stipend</option>
                    <option value="CERTIFICATE">PM Certificate</option>
                    <option value="SCHEME_UPDATE">Scheme Alert</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Alert Subject / Headline..."
                    value={testTitle}
                    onChange={(e) => setTestTitle(e.target.value)}
                    className="sm:col-span-4 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white"
                  />

                  <button
                    type="submit"
                    className="sm:col-span-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </form>
              </div>

              {/* Filter Bar and Mark Read */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-1.5">
                  {(['ALL', 'Email', 'SMS', 'Push'] as const).map((channel) => (
                    <button
                      key={channel}
                      onClick={() => setSelectedChannel(channel)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        selectedChannel === channel
                          ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      {channel}
                    </button>
                  ))}
                </div>

                <button
                  onClick={markAllAsRead}
                  className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark all as read</span>
                </button>
              </div>

              {/* Notifications List */}
              <div className="space-y-3">
                {filtered.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl border transition flex items-start justify-between gap-3 ${
                      item.read
                        ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-85'
                        : 'bg-amber-50/30 dark:bg-slate-800/80 border-amber-300/70 dark:border-amber-700/60 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start space-x-3 flex-1">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                          item.channel === 'Email'
                            ? 'bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400'
                            : item.channel === 'SMS'
                            ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'
                            : 'bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-400'
                        }`}
                      >
                        {item.channel === 'Email' ? (
                          <Mail className="w-4 h-4" />
                        ) : item.channel === 'SMS' ? (
                          <Smartphone className="w-4 h-4" />
                        ) : (
                          <Radio className="w-4 h-4" />
                        )}
                      </div>

                      <div className="space-y-1.5 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">
                            {item.title}
                          </h4>
                          <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {item.channel}
                          </span>
                          <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                            <CheckCircle2 className="w-2.5 h-2.5" /> Delivered
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {item.body}
                        </p>
                        
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                          <p className="text-[10px] text-slate-400 font-medium">
                            {item.timestamp}
                          </p>

                          <button
                            type="button"
                            onClick={() => handleNotificationAction(item)}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-400 hover:text-amber-800 bg-amber-100/60 dark:bg-amber-950/60 hover:bg-amber-200/80 px-2.5 py-1 rounded-lg transition cursor-pointer"
                          >
                            <span>
                              {item.type === 'APPLICATION' && 'View in Student Portal →'}
                              {item.type === 'RECOMMENDATION' && 'Explore Matched Roles →'}
                              {item.type === 'STIPEND' && 'Open Stipend Calculator →'}
                              {item.type === 'INTERVIEW' && 'Launch Mock Interview →'}
                              {item.type === 'CERTIFICATE' && 'View PM Certificate →'}
                              {item.type === 'SCHEME_UPDATE' && 'Explore Openings →'}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setNotifications(prev => prev.filter(n => n.id !== item.id))}
                      className="text-slate-400 hover:text-rose-500 p-1 transition cursor-pointer shrink-0"
                      title="Dismiss notification"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* TAB 2: ARCHITECTURAL EXPLAINER */}
          {activeTab === 'EXPLAINER' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <h3 className="text-sm font-black text-amber-900 dark:text-amber-300 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  How the PM Internship Multi-Channel Notification Engine Works
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                  The PM Internship Scheme utilizes a synchronized 3-tier notification architecture to guarantee zero-miss communication across rural, semi-urban, and metro youth:
                </p>
              </div>

              {/* 3 Gateway Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/30 space-y-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-500 text-white flex items-center justify-center font-bold">
                    <Mail className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    1. Official Email Gateway
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Dispatches formal selection letters, company interview call letters (TCS, Infosys, Reliance), and verified internship completion certificates with verifiable cryptographic QR stamps.
                  </p>
                  <div className="pt-2 border-t border-blue-200 dark:border-blue-900 text-[10px] text-blue-700 dark:text-blue-300 font-semibold">
                    Protocol: SMTP / Amazon SES / NIC Gov Mail
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/30 space-y-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    2. SMS & DBT Gateway
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Sends time-critical SMS alerts for ₹5,000 monthly Direct Benefit Transfer (DBT) stipend credits, Aadhaar linking confirmations, and login/interview verification OTPs to feature phones & smartphones.
                  </p>
                  <div className="pt-2 border-t border-emerald-200 dark:border-emerald-900 text-[10px] text-emerald-700 dark:text-emerald-300 font-semibold">
                    Protocol: CDAC Gov SMS / Twilio / NIC Gateway
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-purple-200 dark:border-purple-900 bg-purple-50/50 dark:bg-purple-950/30 space-y-2.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-500 text-white flex items-center justify-center font-bold">
                    <Radio className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    3. Browser & Mobile Push
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Delivers real-time AI matching alerts whenever corporate partners post vacancies matching the candidate's verified skills, plus live roadmap milestone and mock interview score notifications.
                  </p>
                  <div className="pt-2 border-t border-purple-200 dark:border-purple-900 text-[10px] text-purple-700 dark:text-purple-300 font-semibold">
                    Protocol: W3C Web Push API / Service Worker
                  </div>
                </div>
              </div>

              {/* Lifecycle Flow */}
              <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 space-y-3">
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Automated Event Dispatch Flow
                </h4>
                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-[10px] shrink-0">1</span>
                    <span><strong>Candidate Uploads Resume</strong> → Parsed via AI → Profile verified & stored in database.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-[10px] shrink-0">2</span>
                    <span><strong>Enterprise Partner Posts Opening</strong> → AI matching calculates score (e.g. 94%) → Push alert dispatched.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-[10px] shrink-0">3</span>
                    <span><strong>Interview & Selection</strong> → Official confirmation sent via Email + SMS OTP confirmation.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-[10px] shrink-0">4</span>
                    <span><strong>Monthly Stipend & Certificate</strong> → ₹5,000 DBT sent with SMS alert + digitally signed certificate sent to email.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 1-CLICK PRESETS */}
          {activeTab === 'PRESETS' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Click any simulated PM Scheme scenario below to trigger a live multi-channel broadcast across Email, SMS, or Push:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() =>
                    handleTriggerPreset({
                      title: 'Govt MCA DBT: ₹5,000 Monthly Stipend Credited',
                      body: 'Your ₹5,000 PM Internship Scheme monthly allowance for August 2026 has been credited to your bank account via Aadhaar DBT.',
                      channel: 'SMS',
                      type: 'STIPEND'
                    })
                  }
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 bg-white dark:bg-slate-900 text-left transition group space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4" /> SMS DBT Stipend
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold">
                      Trigger
                    </span>
                  </div>
                  <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">
                    Simulate Monthly ₹5,000 Stipend SMS
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Dispatches instant SMS notification simulating Direct Benefit Transfer to bank.
                  </p>
                </button>

                <button
                  onClick={() =>
                    handleTriggerPreset({
                      title: 'TCS: Shortlisted for Cloud & AI Internship',
                      body: 'Tata Consultancy Services reviewed your verified resume and shortlisted you for technical round 2. Check your registered email for interview calendar invite.',
                      channel: 'Email',
                      type: 'APPLICATION'
                    })
                  }
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 bg-white dark:bg-slate-900 text-left transition group space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4" /> Official Email Letter
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold">
                      Trigger
                    </span>
                  </div>
                  <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">
                    Simulate TCS Interview Shortlist Email
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Dispatches formal enterprise interview call notification to candidate inbox.
                  </p>
                </button>

                <button
                  onClick={() =>
                    handleTriggerPreset({
                      title: 'AI Match Alert: 5 New High-Match Roles Available',
                      body: 'Based on your Python and AI skills, Reliance Industries and Mahindra Tech have listed 5 top internship openings with 92%+ match scores.',
                      channel: 'Push',
                      type: 'RECOMMENDATION'
                    })
                  }
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-purple-500 bg-white dark:bg-slate-900 text-left transition group space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                      <Radio className="w-4 h-4" /> Web Push Notification
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold">
                      Trigger
                    </span>
                  </div>
                  <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">
                    Simulate Real-Time AI Match Push
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Dispatches real-time web push notification with audio cue directly to browser.
                  </p>
                </button>

                <button
                  onClick={() =>
                    handleTriggerPreset({
                      title: 'Verified Digital PM Internship Certificate Issued',
                      body: 'Your 12-month PM Internship Scheme Digital Certificate with MCA authenticity verification ID #PMIS-2026-9481 is ready for download.',
                      channel: 'Email',
                      type: 'CERTIFICATE'
                    })
                  }
                  className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-amber-500 bg-white dark:bg-slate-900 text-left transition group space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                      <Award className="w-4 h-4" /> Certificate Email
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold">
                      Trigger
                    </span>
                  </div>
                  <h4 className="text-xs font-extrabold text-slate-900 dark:text-white">
                    Simulate PM Certificate Generation
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Dispatches government digital certificate issuance notification.
                  </p>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950/70 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Target Recipient: <strong className="text-slate-700 dark:text-slate-300">{userName} ({userEmail})</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 font-bold text-slate-800 dark:text-white rounded-xl transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
