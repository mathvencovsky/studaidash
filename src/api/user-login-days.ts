import { supabase } from "@/integrations/supabase/client";

export interface UserLoginDay {
  id: string;
  user_id: string;
  date: string;
  created_at: string;
}

export const recordLoginDay = async (): Promise<void> => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const today = new Date().toISOString().split("T")[0];

  // Upsert - ignore conflict if already recorded today
  await supabase
    .from("user_login_days")
    .upsert({ user_id: user.id, date: today }, { onConflict: "user_id,date", ignoreDuplicates: true });
};

export const getLoginDays = async (): Promise<UserLoginDay[]> => {
  const { data, error } = await supabase
    .from("user_login_days")
    .select("*")
    .order("date", { ascending: false });
  if (error) throw error;
  return data ?? [];
};

export const getStreak = async (): Promise<number> => {
  const { data, error } = await supabase
    .from("user_login_days")
    .select("date")
    .order("date", { ascending: false })
    .limit(365);
  if (error) throw error;
  if (!data?.length) return 0;

  let streak = 1;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const firstDate = new Date(data[0].date);
  firstDate.setHours(0, 0, 0, 0);

  // If last login isn't today or yesterday, streak is 0
  const diffFromToday = Math.floor((today.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24));
  if (diffFromToday > 1) return 0;

  for (let i = 1; i < data.length; i++) {
    const prev = new Date(data[i - 1].date);
    const curr = new Date(data[i].date);
    prev.setHours(0, 0, 0, 0);
    curr.setHours(0, 0, 0, 0);
    const diff = Math.floor((prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};
