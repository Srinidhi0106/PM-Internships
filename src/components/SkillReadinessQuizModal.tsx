import React, { useState } from 'react';
import {
  Brain,
  CheckCircle2,
  XCircle,
  Award,
  Sparkles,
  X,
  ChevronRight,
  RotateCcw,
  Star,
  Target
} from 'lucide-react';
import { User } from '../types';

interface SkillReadinessQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onUpdateUser?: (updated: Partial<User>) => void;
  onNavigateToInternships?: () => void;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    question: "What is the primary role of Generative AI in modern software development?",
    options: [
      "Replacing physical computer hardware",
      "Assisting in code generation, debugging, and automated testing",
      "Managing physical network cables",
      "Decreasing internet connection bandwidth"
    ],
    correctAnswer: 1,
    explanation: "Generative AI models assist developers by generating boilerplate code, identifying bugs, writing tests, and accelerating workflow productivity."
  },
  {
    id: 2,
    question: "Under the PM Internship Scheme, what is the monthly stipend provided to selected candidates?",
    options: [
      "₹2,000 / month",
      "₹5,000 / month (₹4,500 Govt + ₹500 Company) + ₹6,000 one-time grant",
      "₹10,000 / month",
      "No monetary allowance is provided"
    ],
    correctAnswer: 1,
    explanation: "Candidates receive ₹5,000 monthly allowance along with a one-time ₹6,000 incidental assistance grant upon joining."
  },
  {
    id: 3,
    question: "Which python library is most widely used for data analysis and dataframe manipulation?",
    options: [
      "Pandas",
      "HTML5",
      "CSS3",
      "Photoshop"
    ],
    correctAnswer: 0,
    explanation: "Pandas is the standard open-source Python data analysis library used across top corporate data science teams."
  },
  {
    id: 4,
    question: "What does 'Rest API' stand for in web service architecture?",
    options: [
      "Restart Program Standard",
      "Representational State Transfer Application Programming Interface",
      "Remote System Transmission Protocol",
      "Realtime Sync Time"
    ],
    correctAnswer: 1,
    explanation: "REST stands for Representational State Transfer, an architectural style for creating lightweight web services."
  },
  {
    id: 5,
    question: "What is the key benefit of Agile Software Development methodology?",
    options: [
      "No testing is required",
      "Iterative delivery, continuous feedback, and rapid adaptation to change",
      "Writing 100,000 lines of code without documentation",
      "Only working on weekends"
    ],
    correctAnswer: 1,
    explanation: "Agile emphasizes short iterative sprints, continuous team collaboration, and quick adaptation to changing requirements."
  }
];

export const SkillReadinessQuizModal: React.FC<SkillReadinessQuizModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdateUser,
  onNavigateToInternships
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [showResult, setShowResult] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentQ = QUIZ_QUESTIONS[currentQuestionIndex];
  const isSelected = selectedAnswers[currentQ.id] !== undefined;

  const handleSelectOption = (optIndex: number) => {
    if (selectedAnswers[currentQ.id] !== undefined) return; // Prevent re-selecting
    setSelectedAnswers((prev) => ({ ...prev, [currentQ.id]: optIndex }));
  };

  const calculateScore = () => {
    let score = 0;
    QUIZ_QUESTIONS.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        score += 20; // 5 questions = 100 max
      }
    });
    return score;
  };

  const handleNextOrFinish = () => {
    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setShowResult(true);
      const score = calculateScore();
      if (onUpdateUser) {
        const earnedXP = (user.xp || 0) + score * 5;
        onUpdateUser({
          xp: earnedXP,
          level: earnedXP > 1000 ? 'Advanced Ready Practitioner' : 'Intermediate Skill Ready'
        });
      }
    }
  };

  const handleReset = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResult(false);
  };

  const finalScore = calculateScore();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
        {/* Top Accent Strip */}
        <div className="bg-gradient-to-r from-teal-500 via-indigo-600 to-amber-500 h-2 w-full" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/80 border border-teal-300 dark:border-teal-800 flex items-center justify-center shrink-0">
              <Brain className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                PM Internship Skill Readiness Assessment
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                5-Question AI & Aptitude Quiz • Earn +250 XP & Skill Badge
              </p>
            </div>
          </div>

          {!showResult ? (
            <div className="space-y-6">
              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-extrabold text-slate-700 dark:text-slate-300">
                  <span>Question {currentQuestionIndex + 1} of {QUIZ_QUESTIONS.length}</span>
                  <span className="text-teal-600 dark:text-teal-400">
                    {Math.round(((currentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100)}% Complete
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-teal-500 to-indigo-600 h-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Box */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-4">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white leading-snug">
                  {currentQ.question}
                </h3>

                {/* Options */}
                <div className="space-y-2.5">
                  {currentQ.options.map((opt, idx) => {
                    const userChosen = selectedAnswers[currentQ.id] === idx;
                    const isCorrect = idx === currentQ.correctAnswer;
                    const revealed = selectedAnswers[currentQ.id] !== undefined;

                    let btnStyle = 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:border-teal-500';

                    if (revealed) {
                      if (isCorrect) {
                        btnStyle = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-200 font-extrabold';
                      } else if (userChosen && !isCorrect) {
                        btnStyle = 'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-950 dark:text-rose-200 font-extrabold';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectOption(idx)}
                        disabled={revealed}
                        className={`w-full p-3.5 rounded-xl border text-xs sm:text-sm text-left transition flex items-center justify-between cursor-pointer ${btnStyle}`}
                      >
                        <span className="flex items-center gap-2.5">
                          <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span>{opt}</span>
                        </span>

                        {revealed && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                        {revealed && userChosen && !isCorrect && <XCircle className="w-5 h-5 text-rose-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Box when answered */}
                {isSelected && (
                  <div className="p-3.5 bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/60 rounded-xl text-xs text-indigo-950 dark:text-indigo-200 space-y-1 animate-in fade-in">
                    <span className="font-black uppercase text-[10px] text-indigo-600 dark:text-indigo-400 block">
                      Explanation:
                    </span>
                    <p>{currentQ.explanation}</p>
                  </div>
                )}
              </div>

              {/* Next / Finish Button */}
              <button
                type="button"
                disabled={!isSelected}
                onClick={handleNextOrFinish}
                className={`w-full py-4 rounded-2xl font-black text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 ${
                  isSelected
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>{currentQuestionIndex < QUIZ_QUESTIONS.length - 1 ? 'Next Question' : 'View Skill Assessment Report'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Results Screen */
            <div className="space-y-6 text-center py-2 animate-in fade-in">
              <div className="w-20 h-20 bg-amber-100 dark:bg-amber-950/80 border-2 border-amber-500 rounded-full flex items-center justify-center mx-auto text-amber-600 dark:text-amber-400 shadow-xl">
                <Award className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <span className="bg-teal-100 dark:bg-teal-950/80 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-800 px-3 py-1 rounded-full text-xs font-extrabold uppercase">
                  Assessment Completed
                </span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white pt-2">
                  Your Readiness Score: {finalScore} / 100
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  {finalScore >= 80
                    ? 'Outstanding performance! You are top-ranked for AI & Software internships under PM Scheme.'
                    : 'Good attempt! You earned XP points and unlocked tailored internship opportunities.'}
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 grid grid-cols-2 gap-3 text-left">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">XP Reward Earned</span>
                  <span className="text-lg font-black text-amber-600 dark:text-amber-400">+{finalScore * 5} XP Points</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Skill Profile Badge</span>
                  <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">PM Scheme Certified</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleReset}
                  className="py-3 px-5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retake Quiz</span>
                </button>

                {onNavigateToInternships && (
                  <button
                    onClick={() => {
                      onClose();
                      onNavigateToInternships();
                    }}
                    className="flex-1 py-3 px-5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Explore Matched PM Internships</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
