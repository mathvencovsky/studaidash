import { useState, useCallback, useEffect } from "react";
import type { DailyMission, MissionTask } from "@/types/studai";
import { getTodayMission } from "@/data/cfa-mock-data";

const STORAGE_KEY = "studai_daily_mission";

// Helper to load from localStorage
function loadMission(): DailyMission {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return getTodayMission();
    const parsed = JSON.parse(stored) as DailyMission;
    
    // Check if mission is from today
    const today = new Date().toISOString().split("T")[0];
    if (parsed.date !== today) {
      // New day, new mission
      const newMission = getTodayMission();
      saveMission(newMission);
      return newMission;
    }
    
    return parsed;
  } catch {
    return getTodayMission();
  }
}

// Helper to save to localStorage
function saveMission(mission: DailyMission): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mission));
  } catch (e) {
    console.error("Failed to save mission:", e);
  }
}

// Static function to mark a task as completed (can be called from anywhere)
export function markTaskCompleted(taskType: MissionTask["type"]): boolean {
  try {
    const mission = loadMission();
    
    // Find the first uncompleted task of this type
    const taskIndex = mission.tasks.findIndex(
      t => t.type === taskType && !t.completed
    );
    
    if (taskIndex === -1) return false;
    
    // Mark it as completed
    mission.tasks[taskIndex].completed = true;
    
    // Update mission status
    const completedCount = mission.tasks.filter(t => t.completed).length;
    mission.status = completedCount === mission.tasks.length 
      ? "completed" 
      : completedCount > 0 
        ? "in_progress" 
        : "not_started";
    
    saveMission(mission);
    
    // Dispatch a custom event so other components can react
    window.dispatchEvent(new CustomEvent("dailyplan:updated", { 
      detail: { mission, completedTaskId: mission.tasks[taskIndex].id } 
    }));
    
    return true;
  } catch {
    return false;
  }
}

// Hook for components that need to display/manage the daily plan
export function useDailyPlan() {
  const [mission, setMission] = useState<DailyMission>(loadMission);

  // Listen for updates from other components
  useEffect(() => {
    const handleUpdate = (e: CustomEvent<{ mission: DailyMission }>) => {
      setMission(e.detail.mission);
    };
    
    window.addEventListener("dailyplan:updated", handleUpdate as EventListener);
    return () => {
      window.removeEventListener("dailyplan:updated", handleUpdate as EventListener);
    };
  }, []);

  // Persist mission changes
  useEffect(() => {
    saveMission(mission);
  }, [mission]);

  const toggleTask = useCallback((taskId: string) => {
    setMission(prev => {
      const updatedTasks = prev.tasks.map(t => 
        t.id === taskId ? { ...t, completed: !t.completed } : t
      );
      const completedCount = updatedTasks.filter(t => t.completed).length;
      const newStatus = completedCount === updatedTasks.length 
        ? "completed" 
        : completedCount > 0 
          ? "in_progress" 
          : "not_started";

      return {
        ...prev,
        tasks: updatedTasks,
        status: newStatus,
      };
    });
  }, []);

  const startMission = useCallback(() => {
    setMission(prev => ({
      ...prev,
      status: prev.status === "not_started" ? "in_progress" : prev.status,
    }));
  }, []);

  const completeTaskByType = useCallback((taskType: MissionTask["type"]) => {
    setMission(prev => {
      // Find the first uncompleted task of this type
      const taskIndex = prev.tasks.findIndex(
        t => t.type === taskType && !t.completed
      );
      
      if (taskIndex === -1) return prev;
      
      const updatedTasks = [...prev.tasks];
      updatedTasks[taskIndex] = { ...updatedTasks[taskIndex], completed: true };
      
      const completedCount = updatedTasks.filter(t => t.completed).length;
      const newStatus = completedCount === updatedTasks.length 
        ? "completed" 
        : "in_progress";

      return {
        ...prev,
        tasks: updatedTasks,
        status: newStatus,
      };
    });
  }, []);

  return {
    mission,
    toggleTask,
    startMission,
    completeTaskByType,
  };
}
