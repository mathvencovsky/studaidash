
-- ============================================================================
-- STUDAI DATABASE SCHEMA - Full migration
-- ============================================================================

-- 1. PROFILES TABLE
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Helper: check if user is admin via app_metadata
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    false
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (user_id = auth.uid());

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.raw_user_meta_data ->> 'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. CONTENTS TABLE
CREATE TABLE public.contents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'youtube_video' CHECK (type IN ('youtube_video', 'article', 'quiz', 'assignment', 'lab')),
  duration_in_seconds INTEGER NOT NULL DEFAULT 0,
  link TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT '',
  level TEXT DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  thumbnail_url TEXT,
  author TEXT,
  published_at TIMESTAMPTZ,
  language TEXT DEFAULT 'pt-BR',
  ai_transcript TEXT,
  ai_summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.contents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read contents" ON public.contents FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert contents" ON public.contents FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update contents" ON public.contents FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can delete contents" ON public.contents FOR DELETE TO authenticated USING (public.is_admin());

-- 3. MODULES TABLE
CREATE TABLE public.modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  upvote_count INTEGER NOT NULL DEFAULT 0,
  downvote_count INTEGER NOT NULL DEFAULT 0,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read modules" ON public.modules FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert modules" ON public.modules FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update modules" ON public.modules FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can delete modules" ON public.modules FOR DELETE TO authenticated USING (public.is_admin());

-- 4. MODULE_CONTENTS (junction table)
CREATE TABLE public.module_contents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES public.contents(id) ON DELETE CASCADE,
  position INTEGER NOT NULL DEFAULT 0,
  is_required BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.module_contents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read module_contents" ON public.module_contents FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert module_contents" ON public.module_contents FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update module_contents" ON public.module_contents FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can delete module_contents" ON public.module_contents FOR DELETE TO authenticated USING (public.is_admin());

-- 5. TRACKS TABLE
CREATE TABLE public.tracks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  root_module_id UUID NOT NULL REFERENCES public.modules(id),
  parent_by_module_id JSONB NOT NULL DEFAULT '{}',
  position_by_module_id JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read tracks" ON public.tracks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert tracks" ON public.tracks FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update tracks" ON public.tracks FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can delete tracks" ON public.tracks FOR DELETE TO authenticated USING (public.is_admin());

-- 6. USER_TRACK_PROGRESS
CREATE TABLE public.user_track_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  track_id UUID NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
  start_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  completion_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, track_id)
);
ALTER TABLE public.user_track_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own their track progress" ON public.user_track_progress FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- 7. USER_MODULE_PROGRESS
CREATE TABLE public.user_module_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  start_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  completion_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, module_id)
);
ALTER TABLE public.user_module_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own their module progress" ON public.user_module_progress FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- 8. USER_CONTENT_PROGRESS
CREATE TABLE public.user_content_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES public.contents(id) ON DELETE CASCADE,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  completion_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, module_id, content_id)
);
ALTER TABLE public.user_content_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own their content progress" ON public.user_content_progress FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- 9. VOTES
CREATE TABLE public.votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  value INTEGER NOT NULL CHECK (value IN (-1, 1)),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, module_id)
);
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own their votes" ON public.votes FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Authenticated can read all votes" ON public.votes FOR SELECT TO authenticated USING (true);

-- 10. FEEDBACK
CREATE TABLE public.feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own their feedback" ON public.feedback FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- 11. FAVOURITE_CONTENTS
CREATE TABLE public.favourite_contents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES public.contents(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, content_id)
);
ALTER TABLE public.favourite_contents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own their favourite contents" ON public.favourite_contents FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- 12. FAVOURITE_MODULES
CREATE TABLE public.favourite_modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, module_id)
);
ALTER TABLE public.favourite_modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own their favourite modules" ON public.favourite_modules FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- 13. LEARNING_PREFERENCES
CREATE TABLE public.learning_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  interests TEXT[] NOT NULL DEFAULT '{}',
  minutes_per_day INTEGER,
  days TEXT[] DEFAULT '{}',
  formats TEXT[] DEFAULT '{}',
  content_length TEXT DEFAULT 'medium' CHECK (content_length IN ('bite_sized', 'short', 'medium', 'deep_dive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.learning_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own their learning preferences" ON public.learning_preferences FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert own preferences" ON public.learning_preferences FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own preferences" ON public.learning_preferences FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- 14. USER_LOGIN_DAYS
CREATE TABLE public.user_login_days (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, date)
);
ALTER TABLE public.user_login_days ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own their login days" ON public.user_login_days FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Users can insert own login days" ON public.user_login_days FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

-- 15. UPDATED_AT TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_contents_updated_at BEFORE UPDATE ON public.contents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_modules_updated_at BEFORE UPDATE ON public.modules FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_tracks_updated_at BEFORE UPDATE ON public.tracks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_track_progress_updated_at BEFORE UPDATE ON public.user_track_progress FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_module_progress_updated_at BEFORE UPDATE ON public.user_module_progress FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_user_content_progress_updated_at BEFORE UPDATE ON public.user_content_progress FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_votes_updated_at BEFORE UPDATE ON public.votes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_learning_preferences_updated_at BEFORE UPDATE ON public.learning_preferences FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 16. INDEXES for performance
CREATE INDEX idx_module_contents_module_id ON public.module_contents(module_id);
CREATE INDEX idx_module_contents_content_id ON public.module_contents(content_id);
CREATE INDEX idx_user_track_progress_user_id ON public.user_track_progress(user_id);
CREATE INDEX idx_user_module_progress_user_id ON public.user_module_progress(user_id);
CREATE INDEX idx_user_content_progress_user_id ON public.user_content_progress(user_id);
CREATE INDEX idx_votes_module_id ON public.votes(module_id);
CREATE INDEX idx_favourite_contents_user_id ON public.favourite_contents(user_id);
CREATE INDEX idx_favourite_modules_user_id ON public.favourite_modules(user_id);
CREATE INDEX idx_user_login_days_user_id ON public.user_login_days(user_id);
