import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModuleVotesQuery, useUserVoteQuery, useCastVote } from "@/hooks/use-votes";

interface VoteButtonsProps {
  moduleId: string;
  compact?: boolean;
}

export function VoteButtons({ moduleId, compact = false }: VoteButtonsProps) {
  const { data: votes = [] } = useModuleVotesQuery(moduleId);
  const { data: userVote } = useUserVoteQuery(moduleId);
  const castVote = useCastVote();

  const upvotes = votes.filter(v => v.value === 1).length;
  const downvotes = votes.filter(v => v.value === -1).length;

  const handleVote = (value: 1 | -1) => {
    castVote.mutate({ moduleId, value });
  };

  const size = compact ? "h-7 w-7" : "h-8 px-2";
  const iconSize = compact ? "w-3.5 h-3.5" : "w-4 h-4";

  return (
    <div className="flex items-center gap-1">
      <Button
        variant={userVote?.value === 1 ? "default" : "ghost"}
        size="icon"
        className={size}
        onClick={(e) => { e.stopPropagation(); handleVote(1); }}
        disabled={castVote.isPending}
      >
        <ThumbsUp className={iconSize} />
      </Button>
      <span className="text-xs font-medium min-w-[1.5rem] text-center text-muted-foreground">
        {upvotes - downvotes}
      </span>
      <Button
        variant={userVote?.value === -1 ? "destructive" : "ghost"}
        size="icon"
        className={size}
        onClick={(e) => { e.stopPropagation(); handleVote(-1); }}
        disabled={castVote.isPending}
      >
        <ThumbsDown className={iconSize} />
      </Button>
    </div>
  );
}
