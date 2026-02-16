import { ReactNode, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useMyLearningPreference } from "@/hooks/use-learning-preference";
import { OnboardingQuestionnaire } from "@/components/onboarding/OnboardingQuestionnaire";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const { data: preference, isLoading: prefLoading } = useMyLearningPreference();
  const [onboardingDone, setOnboardingDone] = useState(false);

  if (loading || (user && prefLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Show onboarding if no learning preferences exist yet
  if (!preference && !onboardingDone) {
    return <OnboardingQuestionnaire onComplete={() => setOnboardingDone(true)} />;
  }

  return <>{children}</>;
}
