import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { DailyTask } from '../types';
import confetti from 'canvas-confetti';
import {
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  HelpCircle,
  AlertCircle,
  Zap,
  ArrowRight
} from 'lucide-react';

interface DailyTasksViewProps {
  onOpenDeposit: () => void;
  setActiveTab: (tab: string) => void;
}

export const DailyTasksView: React.FC<DailyTasksViewProps> = ({
  onOpenDeposit,
  setActiveTab
}) => {
  const { tasks, currentUser, plans, completeTask } = useApp();

  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, number>>({});
  const [submissionFeedback, setSubmissionFeedback] = useState<Record<string, { success: boolean; message: string }>>({});

  const userPlan = plans.find((p) => p.id === currentUser.currentPlanId);
  const maxDailyTasks = userPlan?.dailyTasksCount || 0;
  const completedTodayCount = currentUser.completedTasksToday?.length || 0;
  const canDoMoreTasks = completedTodayCount < maxDailyTasks;

  const handleSelectOption = (taskId: string, index: number) => {
    setSelectedOptions((prev) => ({ ...prev, [taskId]: index }));
  };

  const handleVerifyAnswer = (task: DailyTask) => {
    const chosenIndex = selectedOptions[task.id];
    if (chosenIndex === undefined) return;

    const res = completeTask(task.id, chosenIndex);
    setSubmissionFeedback((prev) => ({
      ...prev,
      [task.id]: { success: res.success, message: res.message }
    }));

    if (res.success) {
      // Fire celebration confetti!
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#e5b842', '#f59e0b', '#ffffff', '#10b981']
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#171924] via-[#12141c] to-[#0c0d12] border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[11px] font-bold uppercase">
              Skill Micro-Tasks
            </span>
            <span className="text-zinc-500">•</span>
            <span className="text-xs text-zinc-300 font-mono">
              Tier: <strong className="text-amber-300 uppercase">{currentUser.currentPlanId || 'No Plan'}</strong>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white mt-2 font-display">
            DAILY VERIFIED SKILL TASKS
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl leading-relaxed">
            Read the bite-sized skill insight, answer the practical comprehension check, and receive instant cash rewards credited to your wallet balance.
          </p>
        </div>

        {/* Counter Card */}
        <div className="bg-[#0b0c10] px-5 py-4 rounded-xl border border-zinc-800 text-center min-w-[180px] w-full md:w-auto">
          <span className="text-[11px] text-zinc-400 uppercase tracking-wider font-mono block">
            Tasks Completed Today
          </span>
          <div className="flex items-baseline justify-center gap-1.5 mt-1">
            <span className="text-3xl font-extrabold text-amber-300 font-mono-numbers">
              {completedTodayCount}
            </span>
            <span className="text-zinc-500 font-mono">/ {maxDailyTasks}</span>
          </div>
          <p className="text-[11px] text-zinc-400 font-mono mt-1">
            {canDoMoreTasks
              ? `${maxDailyTasks - completedTodayCount} tasks remaining today`
              : 'Daily limit reached for your tier'}
          </p>
        </div>
      </div>

      {/* Warning if no plan */}
      {!currentUser.currentPlanId && (
        <div className="p-5 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                Enrollment Required to Earn Task Rewards
              </h4>
              <p className="text-xs text-zinc-300 mt-0.5">
                Choose an academy membership plan to unlock daily tasks, courses, and 10% referral rewards.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('plans')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-black font-bold text-xs uppercase tracking-wider flex-shrink-0"
          >
            Explore Plans (From Rs 500)
          </button>
        </div>
      )}

      {/* Task List */}
      <div className="space-y-4">
        {tasks.map((task, index) => {
          const isCompleted = currentUser.completedTasksToday?.includes(task.id);
          const feedback = submissionFeedback[task.id];
          const isExpanded = activeTaskId === task.id || isCompleted;

          return (
            <div
              key={task.id}
              className={`rounded-2xl transition-all duration-200 border ${
                isCompleted
                  ? 'bg-[#101319]/80 border-emerald-500/30'
                  : 'bg-[#12141e] border-zinc-800 hover:border-amber-500/40'
              }`}
            >
              {/* Task Header Bar */}
              <div
                onClick={() => setActiveTaskId(activeTaskId === task.id ? null : task.id)}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-xs ${
                      isCompleted
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : `0${index + 1}`}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono uppercase">
                        {task.category}
                      </span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-[11px] text-zinc-400 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {task.estimatedMinutes} min check
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-white mt-1">
                      {task.title}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 self-end sm:self-center">
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-400 block font-mono">Reward</span>
                    <span className="text-sm font-bold text-amber-300 font-mono-numbers">
                      +Rs {task.rewardPKR}
                    </span>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                      isCompleted
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700'
                    }`}
                  >
                    {isCompleted ? 'Completed ✓' : activeTaskId === task.id ? 'Hide Task' : 'Open Task'}
                  </span>
                </div>
              </div>

              {/* Expanded Interactive Task Content */}
              {isExpanded && (
                <div className="px-4 sm:px-6 pb-6 pt-2 border-t border-zinc-800/80 space-y-4 animate-in fade-in">
                  {/* Learning Snippet */}
                  <div className="p-4 rounded-xl bg-[#090a10] border border-amber-500/20">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1 font-mono">
                      <BookOpen className="w-3.5 h-3.5" />
                      1. Actionable Skill Lesson
                    </div>
                    <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed">
                      {task.learningSnippet}
                    </p>
                  </div>

                  {/* Practical Quiz / Verification */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-zinc-300 uppercase tracking-wider font-mono">
                      <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                      2. Practical Verification Question
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-white">
                      {task.practicalQuestion}
                    </p>

                    {/* Options list */}
                    <div className="space-y-2 pt-1">
                      {task.options.map((option, optIdx) => {
                        const isSelected = selectedOptions[task.id] === optIdx;
                        const isCorrectOption = task.correctOptionIndex === optIdx;

                        let optionStyle = 'bg-zinc-900/60 border-zinc-800 text-zinc-300 hover:bg-zinc-800/60';
                        if (isCompleted && isCorrectOption) {
                          optionStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-200 font-semibold';
                        } else if (isSelected) {
                          optionStyle = 'bg-amber-500/20 border-amber-400 text-white font-semibold';
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            disabled={isCompleted}
                            onClick={() => handleSelectOption(task.id, optIdx)}
                            className={`w-full p-3 rounded-xl border text-left text-xs sm:text-sm flex items-center justify-between transition-all ${optionStyle}`}
                          >
                            <span className="flex-1 pr-3">{option}</span>
                            {isCompleted && isCorrectOption && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Verification action button / feedback */}
                  {!isCompleted && (
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                      {feedback && !feedback.success && (
                        <p className="text-xs text-rose-400 font-medium">
                          {feedback.message}
                        </p>
                      )}
                      <div className="ml-auto w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={() => handleVerifyAnswer(task)}
                          disabled={selectedOptions[task.id] === undefined || !canDoMoreTasks || !currentUser.currentPlanId}
                          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-98 transition-all disabled:opacity-50"
                        >
                          <Zap className="w-3.5 h-3.5 fill-black" />
                          Verify &amp; Claim Rs {task.rewardPKR}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Completion confirmation */}
                  {isCompleted && (
                    <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Task verified! +Rs {task.rewardPKR} credited to your wallet balance.</span>
                      </div>
                      <span className="font-mono text-[11px] text-zinc-400">
                        {task.explanation.substring(0, 50)}...
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
