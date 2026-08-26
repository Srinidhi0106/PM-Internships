import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Trophy,
  Award,
  Zap,
  Star,
  Target,
  Flame,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Lock,
  TrendingUp,
  Medal,
  Users,
  ShieldCheck
} from 'lucide-react';
import { User } from '../types';

interface GamificationLevelUpProps {
  user: User;
}

interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  category: 'AI' | 'Profile' | 'Interview' | 'Application';
  points: number;
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  college: string;
  points: number;
  badgesCount: number;
  avatar: string;
  isCurrentUser?: boolean;
}

export const GamificationLevelUp: React.FC<GamificationLevelUpProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'skills' | 'badges' | 'leaderboard'>('skills');

  // Gamification Metrics
  const userPoints = 2450;
  const userLevel = 5;
  const nextLevelPoints = 3000;
  const streakDays = 7;
  const progressPercent = Math.round((userPoints / nextLevelPoints) * 100);

  const skillsProgression = [
    { skill: 'Python & Data Science', level: 8, points: 650, progress: 85, color: 'bg-indigo-600' },
    { skill: 'Machine Learning & AI', level: 7, points: 520, progress: 78, color: 'bg-emerald-600' },
    { skill: 'React & Web Engineering', level: 9, points: 720, progress: 92, color: 'bg-amber-500' },
    { skill: 'Communication & Interview', level: 6, points: 410, progress: 65, color: 'bg-purple-600' },
    { skill: 'Cloud & Docker Deployment', level: 4, points: 280, progress: 45, color: 'bg-blue-600' },
  ];

  const badges: Badge[] = [
    {
      id: 'b1',
      title: 'PM Scheme Pioneer',
      description: 'Completed student profile with 100% verified credentials',
      icon: '🇮🇳',
      unlocked: true,
      category: 'Profile',
      points: 200
    },
    {
      id: 'b2',
      title: 'AI Recommendation Master',
      description: 'Explored and saved Top 20 AI recommended internships',
      icon: '🤖',
      unlocked: true,
      category: 'AI',
      points: 350
    },
    {
      id: 'b3',
      title: 'Interview Ace',
      description: 'Scored over 90% on AI Voice Mock Interview',
      icon: '🎯',
      unlocked: true,
      category: 'Interview',
      points: 500
    },
    {
      id: 'b4',
      title: 'ATS Resume Certified',
      description: 'Achieved an ATS score above 90% on AI Portfolio Analyzer',
      icon: '📄',
      unlocked: true,
      category: 'Profile',
      points: 400
    },
    {
      id: 'b5',
      title: 'Top Candidate Shortlist',
      description: 'Shortlisted by host company for final interview round',
      icon: '⭐',
      unlocked: true,
      category: 'Application',
      points: 600
    },
    {
      id: 'b6',
      title: 'National Ranker Top 10',
      description: 'Reach top 10 position on PM Internship National Leaderboard',
      icon: '👑',
      unlocked: false,
      category: 'AI',
      points: 1000
    }
  ];

  const leaderboard: LeaderboardEntry[] = [
    {
      rank: 1,
      name: 'Aarav Sharma',
      college: 'IIT Bombay',
      points: 3820,
      badgesCount: 12,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
    },
    {
      rank: 2,
      name: 'Priya Patel',
      college: 'BITS Pilani',
      points: 3450,
      badgesCount: 10,
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80'
    },
    {
      rank: 3,
      name: user.name || 'Ananya Sharma',
      college: user.college || 'IIT Delhi',
      points: userPoints,
      badgesCount: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      isCurrentUser: true
    },
    {
      rank: 4,
      name: 'Rohan Gupta',
      college: 'NIT Trichy',
      points: 2310,
      badgesCount: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'
    },
    {
      rank: 5,
      name: 'Sneha Reddy',
      college: 'IIT Hyderabad',
      points: 2180,
      badgesCount: 4,
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&auto=format&fit=crop&q=80'
    }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-8">
      {/* Level Up Top Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-amber-100">
              <Zap className="w-4 h-4 text-amber-300 animate-bounce" />
              <span>Skill Progression & Level Up</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Level {userLevel} PM Scheme Scholar</h2>
            <p className="text-xs sm:text-sm text-amber-100 max-w-lg">
              Earn points by completing mock interviews, updating resume skills, and saving AI recommended internships!
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-950/40 backdrop-blur-md p-4 rounded-xl border border-white/20">
            <div className="text-center">
              <span className="text-[10px] text-amber-200 uppercase font-bold tracking-wider">Total XP Points</span>
              <div className="text-2xl font-black text-amber-300 flex items-center justify-center gap-1">
                <Star className="w-5 h-5 fill-amber-300 text-amber-300" />
                <span>{userPoints} XP</span>
              </div>
            </div>

            <div className="h-8 w-px bg-white/20" />

            <div className="text-center">
              <span className="text-[10px] text-amber-200 uppercase font-bold tracking-wider">Daily Streak</span>
              <div className="text-2xl font-black text-orange-400 flex items-center justify-center gap-1">
                <Flame className="w-5 h-5 fill-orange-400 text-orange-400 animate-pulse" />
                <span>{streakDays} Days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Level XP Progress Bar */}
        <div className="mt-6 pt-4 border-t border-white/20 space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-amber-100">
            <span>Level {userLevel} Progression</span>
            <span>{userPoints} / {nextLevelPoints} XP ({progressPercent}%)</span>
          </div>
          <div className="w-full h-3 bg-slate-900/50 rounded-full overflow-hidden p-0.5 border border-white/20">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-300 to-emerald-400 rounded-full shadow-inner"
              initial={{ width: '0%' }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-4 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('skills')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition ${
            activeTab === 'skills'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Skill Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab('badges')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition ${
            activeTab === 'badges'
              ? 'border-amber-500 text-amber-600 dark:text-amber-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Earned Badges ({badges.filter(b => b.unlocked).length}/{badges.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition ${
            activeTab === 'leaderboard'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>National Leaderboard</span>
        </button>
      </div>

      {/* TAB 1: SKILL PROGRESSION */}
      {activeTab === 'skills' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skillsProgression.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.08 }}
                className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{item.skill}</h4>
                    <span className="text-xs text-slate-500 font-medium">Level {item.level} Mastery • {item.points} XP</span>
                  </div>
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-2.5 py-1 rounded-full border border-indigo-200 dark:border-indigo-800">
                    {item.progress}%
                  </span>
                </div>

                <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${item.color} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${item.progress}%` }}
                    transition={{ duration: 0.8, delay: 0.1 * index }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* TAB 2: BADGES */}
      {activeTab === 'badges' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {badges.map((badge, idx) => (
            <motion.div
              key={badge.id}
              whileHover={{ scale: 1.02 }}
              className={`p-5 rounded-2xl border transition relative overflow-hidden ${
                badge.unlocked
                  ? 'bg-gradient-to-br from-amber-500/10 via-white to-emerald-500/10 dark:from-amber-950/20 dark:via-slate-900 dark:to-emerald-950/20 border-amber-300 dark:border-amber-800 shadow-md'
                  : 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="text-3xl p-2 bg-white dark:bg-slate-800 rounded-xl shadow-xs border border-slate-200 dark:border-slate-700">
                  {badge.icon}
                </div>
                {badge.unlocked ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="w-3 h-3" /> Unlocked (+{badge.points} XP)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                    <Lock className="w-3 h-3" /> Locked
                  </span>
                )}
              </div>

              <div className="mt-4 space-y-1">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">{badge.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{badge.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* TAB 3: LEADERBOARD */}
      {activeTab === 'leaderboard' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-4 bg-slate-900 text-white font-bold text-xs grid grid-cols-12 gap-2">
              <span className="col-span-2 sm:col-span-1 text-center">Rank</span>
              <span className="col-span-6 sm:col-span-6">Student & Institute</span>
              <span className="col-span-2 sm:col-span-3 text-center">Badges</span>
              <span className="col-span-2 sm:col-span-2 text-right">XP Points</span>
            </div>

            <div className="divide-y divide-slate-200 dark:divide-slate-800">
              {leaderboard.map((item) => (
                <motion.div
                  key={item.rank}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`p-4 grid grid-cols-12 gap-2 items-center text-xs font-medium transition ${
                    item.isCurrentUser
                      ? 'bg-amber-500/10 dark:bg-amber-950/40 font-bold border-l-4 border-amber-500'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {/* Rank Badge */}
                  <div className="col-span-2 sm:col-span-1 flex items-center justify-center">
                    {item.rank === 1 && <Medal className="w-5 h-5 text-amber-500" />}
                    {item.rank === 2 && <Medal className="w-5 h-5 text-slate-400" />}
                    {item.rank === 3 && <Medal className="w-5 h-5 text-amber-700" />}
                    {item.rank > 3 && <span className="font-bold text-slate-500">#{item.rank}</span>}
                  </div>

                  {/* Student Info */}
                  <div className="col-span-6 sm:col-span-6 flex items-center space-x-3">
                    <img src={item.avatar} alt={item.name} className="w-8 h-8 rounded-full object-cover border border-slate-300" />
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>{item.name}</span>
                        {item.isCurrentUser && (
                          <span className="text-[9px] bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded font-black">
                            YOU
                          </span>
                        )}
                      </p>
                      <p className="text-[10px] text-slate-500">{item.college}</p>
                    </div>
                  </div>

                  {/* Badges count */}
                  <div className="col-span-2 sm:col-span-3 text-center">
                    <span className="bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded-md text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                      🏅 {item.badgesCount} Badges
                    </span>
                  </div>

                  {/* XP Points */}
                  <div className="col-span-2 sm:col-span-2 text-right font-black text-amber-600 dark:text-amber-400">
                    {item.points} XP
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
