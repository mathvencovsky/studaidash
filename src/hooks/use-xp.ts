import { useState, useEffect, useCallback } from "react";
import { DEFAULT_USER_PROGRESS, getXPForNextLevel, getLevelProgress } from "@/data/cfa-mock-data";
import type { UserProgress } from "@/types/studai";

// ============================================================================
// CENTRALIZED XP SYSTEM
// ============================================================================

const STORAGE_KEY = "studai_user_progress";
const XP_UPDATED_EVENT = "xp:updated";

// XP values for different activities
export const XP_VALUES = {
  STEP_COMPLETE: 15,        // Per step in AI study session
  SESSION_COMPLETE: 50,     // Bonus for completing full session
  CONFIDENCE_BONUS: 10,     // Per confidence level (1-5 = 10-50 XP)
  QUIZ_COMPLETE: 30,        // Base XP for quiz completion
  QUIZ_PERFECT: 50,         // Bonus for 100% score
  QUIZ_GOOD: 25,            // Bonus for 80%+ score
  TASK_COMPLETE: 25,        // Manual task completion
  STREAK_BONUS: 10,         // Per day of streak
};

// Helper to calculate level from XP
function calculateLevel(xp: number): number {
  // Each level requires 500 XP more than the previous
  // Level 1: 0-499, Level 2: 500-999, Level 3: 1000-1499, etc.
  return Math.floor(xp / 500) + 1;
}

// Load progress from localStorage
function loadProgress(): UserProgress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_USER_PROGRESS;
    const parsed = JSON.parse(stored);
    // Merge with defaults to ensure all fields exist
    return { ...DEFAULT_USER_PROGRESS, ...parsed };
  } catch {
    return DEFAULT_USER_PROGRESS;
  }
}

// Save progress to localStorage
function saveProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error("Failed to save XP progress:", e);
  }
}

// Dispatch XP update event for cross-component sync
function dispatchXPUpdate(progress: UserProgress, xpAdded: number): void {
  window.dispatchEvent(new CustomEvent(XP_UPDATED_EVENT, {
    detail: { progress, xpAdded }
  }));
}

// ============================================================================
// GLOBAL XP FUNCTIONS (can be called from anywhere)
// ============================================================================

/**
 * Add XP to the user's total. Automatically recalculates level.
 * Returns the updated progress and whether a level up occurred.
 */
export function addXP(amount: number, source?: string): { 
  progress: UserProgress; 
  leveledUp: boolean; 
  previousLevel: number;
} {
  const currentProgress = loadProgress();
  const previousLevel = currentProgress.level;
  const newXP = currentProgress.xp + amount;
  const newLevel = calculateLevel(newXP);
  const leveledUp = newLevel > previousLevel;

  const updatedProgress: UserProgress = {
    ...currentProgress,
    xp: newXP,
    level: newLevel,
  };

  saveProgress(updatedProgress);
  dispatchXPUpdate(updatedProgress, amount);

  if (source) {
    console.log(`[XP] +${amount} from ${source} (Total: ${newXP}, Level: ${newLevel})`);
  }

  return { progress: updatedProgress, leveledUp, previousLevel };
}

/**
 * Award XP for completing an AI study session step
 */
export function awardStepXP(): { progress: UserProgress; leveledUp: boolean } {
  const result = addXP(XP_VALUES.STEP_COMPLETE, "step_complete");
  return { progress: result.progress, leveledUp: result.leveledUp };
}

/**
 * Award XP for completing an entire AI study session
 */
export function awardSessionCompleteXP(confidenceRating: number): { 
  progress: UserProgress; 
  totalXP: number;
  leveledUp: boolean;
} {
  const sessionBonus = XP_VALUES.SESSION_COMPLETE;
  const confidenceBonus = confidenceRating * XP_VALUES.CONFIDENCE_BONUS;
  const totalXP = sessionBonus + confidenceBonus;
  
  const result = addXP(totalXP, `session_complete (confidence: ${confidenceRating})`);
  return { progress: result.progress, totalXP, leveledUp: result.leveledUp };
}

/**
 * Award XP for completing a quiz
 */
export function awardQuizXP(scorePercent: number): { 
  progress: UserProgress; 
  totalXP: number;
  leveledUp: boolean;
} {
  let totalXP = XP_VALUES.QUIZ_COMPLETE;
  
  if (scorePercent === 100) {
    totalXP += XP_VALUES.QUIZ_PERFECT;
  } else if (scorePercent >= 80) {
    totalXP += XP_VALUES.QUIZ_GOOD;
  }
  
  const result = addXP(totalXP, `quiz_complete (score: ${scorePercent}%)`);
  return { progress: result.progress, totalXP, leveledUp: result.leveledUp };
}

/**
 * Award XP for manually completing a task
 */
export function awardTaskXP(): { progress: UserProgress; leveledUp: boolean } {
  const result = addXP(XP_VALUES.TASK_COMPLETE, "task_complete");
  return { progress: result.progress, leveledUp: result.leveledUp };
}

/**
 * Get current XP progress (for read-only access)
 */
export function getXPProgress(): UserProgress {
  return loadProgress();
}

/**
 * Update weekly progress (study minutes)
 */
export function addWeeklyProgress(minutes: number): UserProgress {
  const currentProgress = loadProgress();
  const updatedProgress: UserProgress = {
    ...currentProgress,
    weeklyProgress: currentProgress.weeklyProgress + minutes,
  };
  saveProgress(updatedProgress);
  dispatchXPUpdate(updatedProgress, 0);
  return updatedProgress;
}

// ============================================================================
// REACT HOOK - For reactive UI updates
// ============================================================================

export function useXP() {
  const [progress, setProgress] = useState<UserProgress>(loadProgress);

  // Listen for XP updates from other components
  useEffect(() => {
    const handleXPUpdate = (event: CustomEvent<{ progress: UserProgress; xpAdded: number }>) => {
      setProgress(event.detail.progress);
    };

    window.addEventListener(XP_UPDATED_EVENT, handleXPUpdate as EventListener);
    return () => {
      window.removeEventListener(XP_UPDATED_EVENT, handleXPUpdate as EventListener);
    };
  }, []);

  // Reload on mount to get latest state
  useEffect(() => {
    setProgress(loadProgress());
  }, []);

  const addXPLocal = useCallback((amount: number, source?: string) => {
    const result = addXP(amount, source);
    setProgress(result.progress);
    return result;
  }, []);

  const levelProgress = getLevelProgress(progress.xp, progress.level);
  const xpForNextLevel = getXPForNextLevel(progress.level);

  return {
    progress,
    levelProgress,
    xpForNextLevel,
    addXP: addXPLocal,
    awardStepXP: () => {
      const result = awardStepXP();
      setProgress(result.progress);
      return result;
    },
    awardSessionCompleteXP: (confidenceRating: number) => {
      const result = awardSessionCompleteXP(confidenceRating);
      setProgress(result.progress);
      return result;
    },
    awardQuizXP: (scorePercent: number) => {
      const result = awardQuizXP(scorePercent);
      setProgress(result.progress);
      return result;
    },
    awardTaskXP: () => {
      const result = awardTaskXP();
      setProgress(result.progress);
      return result;
    },
  };
}
