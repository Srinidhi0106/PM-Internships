import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Video,
  Building2,
  CheckCircle2,
  ExternalLink,
  Plus,
  Globe,
  MapPin,
  Sparkles,
  Award,
  AlertCircle,
  FileText,
  Download,
  Share2,
  ChevronRight,
  Filter,
  UserCheck,
  Zap,
  Info
} from 'lucide-react';
import { AppliedInterview } from '../types';
import { useTimezone, SUPPORTED_TIMEZONES, TimeFormat } from '../context/TimezoneContext';

interface AppliedInterviewsTrackerProps {
  interviews: AppliedInterview[];
  onJoinInterview?: (interview: AppliedInterview) => void;
  onPracticeRole?: (role: string, company: string) => void;
  onScheduleNew?: (newInterview: AppliedInterview) => void;
}

export const AppliedInterviewsTracker: React.FC<AppliedInterviewsTrackerProps> = ({
  interviews,
  onJoinInterview,
  onPracticeRole,
  onScheduleNew
}) => {
  const {
    timeFormat,
    setTimeFormat,
    timezone,
    setTimezone,
    selectedZone,
    formatTime,
    formatDateTime
  } = useTimezone();

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'SCHEDULED' | 'COMPLETED' | 'UNDER_REVIEW'>('ALL');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedInterviewForDetails, setSelectedInterviewForDetails] = useState<AppliedInterview | null>(null);

  // New Interview Form state
  const [newRole, setNewRole] = useState('AI & Data Engineering Intern');
  const [newCompany, setNewCompany] = useState('Tata Consultancy Services (TCS)');
  const [newDate, setNewDate] = useState('2026-08-28');
  const [newTime, setNewTime] = useState('11:30');
  const [newLocationType, setNewLocationType] = useState<'AI_PORTAL_ROOM' | 'GOOGLE_MEET' | 'TEAMS' | 'IN_PERSON'>('AI_PORTAL_ROOM');
  const [newInterviewer, setNewInterviewer] = useState('Dr. Ananya Sharma');
  const [newInterviewerZone, setNewInterviewerZone] = useState('IST');
  const [newNotes, setNewNotes] = useState('Technical live coding & system architecture assessment.');

  const totalCount = interviews.length;
  const scheduledCount = interviews.filter((i) => i.status === 'SCHEDULED').length;
  const completedCount = interviews.filter((i) => i.status === 'COMPLETED').length;
  const reviewCount = interviews.filter((i) => i.status === 'UNDER_REVIEW').length;

  const filteredInterviews = interviews.filter((item) => {
    if (activeFilter === 'ALL') return true;
    return item.status === activeFilter;
  });

  const handleCreateSlot = (e: React.FormEvent) => {
    e.preventDefault();
    const scheduledISO = new Date(`${newDate}T${newTime}:00`).toISOString();

    const created: AppliedInterview = {
      id: `intv-app-${Date.now()}`,
      role: newRole,
      companyName: newCompany,
      interviewerName: newInterviewer,
      interviewerRole: 'Lead Interview Panelist',
      interviewerTimezone: newInterviewerZone,
      scheduledDateTime: scheduledISO,
      durationMinutes: 45,
      locationType: newLocationType,
      locationDetail:
        newLocationType === 'AI_PORTAL_ROOM'
          ? 'PM Scheme AI Live Interview Room #501'
          : newLocationType === 'GOOGLE_MEET'
          ? 'https://meet.google.com/pm-scheme-eval'
          : newLocationType === 'TEAMS'
          ? 'https://teams.microsoft.com/l/meetup-join/pm-session'
          : 'Corporate Innovation Campus, Conference Hall 2A',
      meetingLink:
        newLocationType === 'AI_PORTAL_ROOM'
          ? undefined
          : newLocationType === 'GOOGLE_MEET'
          ? 'https://meet.google.com/pm-scheme-eval'
          : 'https://teams.microsoft.com/l/meetup-join/pm-session',
      status: 'SCHEDULED',
      interviewType: 'Technical',
      difficulty: 'Intermediate',
      notes: newNotes
    };

    if (onScheduleNew) {
      onScheduleNew(created);
    }
    setShowScheduleModal(false);
  };

  const generateGoogleCalendarUrl = (item: AppliedInterview) => {
    const start = new Date(item.scheduledDateTime);
    const end = new Date(start.getTime() + item.durationMinutes * 60000);
    const formatDate = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');
    const title = encodeURIComponent(`PM Scheme Interview: ${item.role} @ ${item.companyName}`);
    const details = encodeURIComponent(
      `Interviewer: ${item.interviewerName} (${item.interviewerRole})\nLocation: ${item.locationDetail}\nNotes: ${item.notes || 'PM Scheme Technical Assessment'}`
    );
    const location = encodeURIComponent(item.locationDetail);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formatDate(start)}/${formatDate(end)}&details=${details}&location=${location}`;
  };

  const downloadICSFile = (item: AppliedInterview) => {
    const start = new Date(item.scheduledDateTime);
    const end = new Date(start.getTime() + item.durationMinutes * 60000);
    const formatICSDate = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//PM Internship Scheme//Interview Scheduler//EN',
      'BEGIN:VEVENT',
      `UID:${item.id}@pminternship.mca.gov.in`,
      `DTSTAMP:${formatICSDate(new Date())}`,
      `DTSTART:${formatICSDate(start)}`,
      `DTEND:${formatICSDate(end)}`,
      `SUMMARY:PM Scheme Interview: ${item.role} - ${item.companyName}`,
      `DESCRIPTION:Interview with ${item.interviewerName} (${item.interviewerRole}). Location: ${item.locationDetail}.`,
      `LOCATION:${item.locationDetail}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `interview_${item.companyName.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getRelativeTimeBadge = (dateTimeStr: string, status: string) => {
    if (status === 'COMPLETED') {
      return (
        <span className="bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          <span>Evaluation Completed</span>
        </span>
      );
    }
    if (status === 'UNDER_REVIEW') {
      return (
        <span className="bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>Profile In Final Review</span>
        </span>
      );
    }

    const target = new Date(dateTimeStr);
    const now = new Date();
    const diffMs = target.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      return (
        <span className="bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse flex items-center gap-1">
          <Zap className="w-3 h-3" />
          <span>Today / Active Now</span>
        </span>
      );
    } else if (diffDays === 1) {
      return (
        <span className="bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>Tomorrow</span>
        </span>
      );
    } else {
      return (
        <span className="bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          <span>In {diffDays} Days</span>
        </span>
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Multi-Timezone / 12h-24h Control Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-xs font-bold">
              <Calendar className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>CANDIDATE INTERVIEW SCHEDULE & TRACKER</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              Applied & Scheduled Interviews ({totalCount})
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-2xl font-medium">
              View all enterprise interviews you have applied for, track exact date, time, and location, and convert timestamps across international timezones effortlessly.
            </p>
          </div>

          {/* Time Format & Timezone Switcher Controls */}
          <div className="flex flex-wrap items-center gap-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shrink-0">
            {/* 12h / 24h Toggle */}
            <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-1 shadow-2xs">
              <button
                type="button"
                onClick={() => setTimeFormat('12h')}
                className={`px-2.5 py-1 text-xs font-black rounded-lg transition cursor-pointer ${
                  timeFormat === '12h'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                }`}
              >
                12 Hrs (AM/PM)
              </button>
              <button
                type="button"
                onClick={() => setTimeFormat('24h')}
                className={`px-2.5 py-1 text-xs font-black rounded-lg transition cursor-pointer ${
                  timeFormat === '24h'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
                }`}
              >
                24 Hrs
              </button>
            </div>

            {/* Timezone Selector */}
            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl shadow-2xs">
              <Globe className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
              >
                {SUPPORTED_TIMEZONES.map((zone) => (
                  <option key={zone.id} value={zone.id} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    {zone.id} ({zone.offset}) — {zone.city}
                  </option>
                ))}
              </select>
            </div>

            {/* Action to schedule / book new slot */}
            <button
              type="button"
              onClick={() => setShowScheduleModal(true)}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Book Slot</span>
            </button>
          </div>
        </div>

        {/* Multi-Timezone Cross-Border Notification Info */}
        <div className="mt-4 p-3.5 bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/60 rounded-xl flex items-center gap-3 text-xs text-indigo-950 dark:text-indigo-200">
          <Info className="w-4 h-4 text-indigo-600 shrink-0" />
          <p className="text-[11px] sm:text-xs">
            <strong>Cross-Timezone Synchronization Active:</strong> All interview hours automatically convert to <strong>{selectedZone.label} ({timeFormat.toUpperCase()})</strong>. When your corporate evaluator or interviewer joins from another region (e.g. US, UK, Europe, or Japan), the system computes both parties' local clocks seamlessly.
          </p>
        </div>

        {/* 4 Stat Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Applied</span>
            <span className="text-2xl font-black text-slate-900 dark:text-white">{totalCount}</span>
          </div>
          <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900 text-center">
            <span className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400 block">Scheduled & Upcoming</span>
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{scheduledCount}</span>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 text-center">
            <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 block">Completed Scorecards</span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{completedCount}</span>
          </div>
          <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900 text-center">
            <span className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 block">Under Final Review</span>
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400">{reviewCount}</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-6 text-xs font-bold overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setActiveFilter('ALL')}
          className={`pb-2.5 transition border-b-2 shrink-0 cursor-pointer ${
            activeFilter === 'ALL'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          All Applied Interviews ({totalCount})
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('SCHEDULED')}
          className={`pb-2.5 transition border-b-2 shrink-0 cursor-pointer ${
            activeFilter === 'SCHEDULED'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Upcoming / Scheduled ({scheduledCount})
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('COMPLETED')}
          className={`pb-2.5 transition border-b-2 shrink-0 cursor-pointer ${
            activeFilter === 'COMPLETED'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Completed Evaluations ({completedCount})
        </button>
        <button
          type="button"
          onClick={() => setActiveFilter('UNDER_REVIEW')}
          className={`pb-2.5 transition border-b-2 shrink-0 cursor-pointer ${
            activeFilter === 'UNDER_REVIEW'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Under Review ({reviewCount})
        </button>
      </div>

      {/* Interview Cards List */}
      <div className="space-y-4">
        {filteredInterviews.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
            <Calendar className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
              No interview records found for this filter.
            </h3>
            <p className="text-xs text-slate-500">
              You can schedule an AI mock slot or apply for more internships on the portal.
            </p>
          </div>
        ) : (
          filteredInterviews.map((item) => {
            const dateFormatted = formatDateTime(item.scheduledDateTime, selectedZone.id);
            const interviewerZoneObj = SUPPORTED_TIMEZONES.find((z) => z.id === item.interviewerTimezone) || SUPPORTED_TIMEZONES[0];
            const interviewerTimeFormatted = formatTime(item.scheduledDateTime, timeFormat, interviewerZoneObj.id);

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs hover:shadow-md transition space-y-4"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-start space-x-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700 shrink-0 overflow-hidden flex items-center justify-center font-black text-indigo-600">
                      {item.companyLogo ? (
                        <img
                          src={item.companyLogo}
                          alt={item.companyName}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <Building2 className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                          {item.role}
                        </h3>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-md">
                          {item.interviewType} Round
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md">
                          {item.difficulty}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-500 mt-0.5 flex items-center gap-1.5">
                        <span>{item.companyName}</span>
                        <span>•</span>
                        <span className="text-emerald-600 font-bold">MCA Verified Top 500 Partner</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {getRelativeTimeBadge(item.scheduledDateTime, item.status)}
                    {item.score && (
                      <span className="bg-indigo-600 text-white text-xs font-black px-3 py-1 rounded-xl shadow-2xs">
                        Score: {item.score}/100
                      </span>
                    )}
                  </div>
                </div>

                {/* 4 Detail Grid Pills: Date/When, Time (Dual-zone), Where/Platform, Panel */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  {/* 1. Date & When */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800/80 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-indigo-500" />
                      <span>Date & When</span>
                    </span>
                    <p className="font-extrabold text-slate-900 dark:text-white text-xs">
                      {dateFormatted.split(',')[0]}
                    </p>
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold block">
                      Duration: {item.durationMinutes} Minutes
                    </span>
                  </div>

                  {/* 2. Time & Timezone Conversion */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800/80 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-500" />
                      <span>Time ({selectedZone.id})</span>
                    </span>
                    <p className="font-extrabold text-slate-900 dark:text-white text-xs">
                      {formatTime(item.scheduledDateTime, timeFormat, selectedZone.id)}
                    </p>
                    {item.interviewerTimezone && item.interviewerTimezone !== selectedZone.id && (
                      <span className="text-[10px] text-slate-500 block font-medium">
                        Interviewer Clock: <strong>{interviewerTimeFormatted}</strong>
                      </span>
                    )}
                  </div>

                  {/* 3. Where / Location / Platform */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800/80 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                      {item.locationType === 'IN_PERSON' ? (
                        <MapPin className="w-3 h-3 text-rose-500" />
                      ) : (
                        <Video className="w-3 h-3 text-emerald-500" />
                      )}
                      <span>Where / Location</span>
                    </span>
                    <p className="font-extrabold text-slate-900 dark:text-white text-xs truncate" title={item.locationDetail}>
                      {item.locationDetail}
                    </p>
                    <span className="text-[10px] text-slate-500 block capitalize">
                      {item.locationType.replace(/_/g, ' ').toLowerCase()}
                    </span>
                  </div>

                  {/* 4. Evaluator / Interviewer Panel */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800/80 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400 flex items-center gap-1">
                      <UserCheck className="w-3 h-3 text-purple-500" />
                      <span>Interviewer Panel</span>
                    </span>
                    <p className="font-extrabold text-slate-900 dark:text-white text-xs truncate" title={item.interviewerName}>
                      {item.interviewerName}
                    </p>
                    <span className="text-[10px] text-slate-500 block truncate" title={item.interviewerRole}>
                      {item.interviewerRole}
                    </span>
                  </div>
                </div>

                {/* Notes or Feedback if present */}
                {item.feedback ? (
                  <div className="p-3.5 bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 rounded-2xl text-xs space-y-1">
                    <span className="font-bold text-emerald-800 dark:text-emerald-300 block">
                      ★ Official Evaluator Scorecard Feedback:
                    </span>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                      {item.feedback}
                    </p>
                  </div>
                ) : item.notes ? (
                  <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
                    <strong className="text-slate-800 dark:text-slate-200">Preparation Guidance:</strong> {item.notes}
                  </div>
                ) : null}

                {/* Action Buttons Row */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    {/* Add to Calendar Button */}
                    <a
                      href={generateGoogleCalendarUrl(item)}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Calendar className="w-3 h-3 text-indigo-500" />
                      <span>Google Cal</span>
                    </a>
                    <button
                      type="button"
                      onClick={() => downloadICSFile(item)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                      title="Download .ics calendar file for Outlook / Apple Calendar"
                    >
                      <Download className="w-3 h-3" />
                      <span>.ICS</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2.5">
                    {/* Practice AI Mock for this exact role */}
                    {onPracticeRole && (
                      <button
                        type="button"
                        onClick={() => onPracticeRole(item.role, item.companyName)}
                        className="px-3.5 py-2 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800 font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                        <span>Practice AI Mock for {item.companyName.split(' ')[0]}</span>
                      </button>
                    )}

                    {/* Join Interview Room Button */}
                    {item.status === 'SCHEDULED' && (
                      <button
                        type="button"
                        onClick={() => {
                          if (item.locationType === 'AI_PORTAL_ROOM' && onJoinInterview) {
                            onJoinInterview(item);
                          } else if (item.meetingLink) {
                            window.open(item.meetingLink, '_blank');
                          } else if (onJoinInterview) {
                            onJoinInterview(item);
                          }
                        }}
                        className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Join Live Room Now</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Book / Schedule New Interview Slot */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Schedule New Interview / Mock Slot
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSlot} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300">Target Role Title</label>
                <input
                  type="text"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300">Company / Enterprise Partner</label>
                <input
                  type="text"
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs font-semibold text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Time</label>
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs font-semibold text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Meeting Platform</label>
                  <select
                    value={newLocationType}
                    onChange={(e) => setNewLocationType(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs font-semibold text-slate-900 dark:text-white"
                  >
                    <option value="AI_PORTAL_ROOM">PM Scheme AI Live Room</option>
                    <option value="GOOGLE_MEET">Google Meet</option>
                    <option value="TEAMS">Microsoft Teams</option>
                    <option value="IN_PERSON">In-Person Corporate Office</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Interviewer Timezone</label>
                  <select
                    value={newInterviewerZone}
                    onChange={(e) => setNewInterviewerZone(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs font-semibold text-slate-900 dark:text-white"
                  >
                    {SUPPORTED_TIMEZONES.map((z) => (
                      <option key={z.id} value={z.id}>
                        {z.id} ({z.city})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300">Interviewer Name / Panel</label>
                <input
                  type="text"
                  value={newInterviewer}
                  onChange={(e) => setNewInterviewer(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs font-semibold text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700 dark:text-slate-300">Preparation Focus / Topics</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2 text-xs font-medium text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer"
                >
                  Confirm & Save Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
