import { useState, useEffect, useMemo } from "react";
import { BookOpen, TrendingUp } from "lucide-react";
import { 
  loadTracksCatalog, 
  filterTracks, 
  getDefaultFilters,
  isTrackInUserPlan,
  type Track,
  type TrackFilters as FiltersType 
} from "@/data/tracks-catalog-data";
import { 
  TrackCard, 
  TrackFilters, 
  DesktopFilters, 
  AddToPlanModal, 
  EmptyState, 
  TrackGridSkeleton 
} from "@/components/explore";

export default function ExplorarTrilhas() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [filters, setFilters] = useState<FiltersType>(getDefaultFilters());
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTrack, setSelectedTrack] = useState<Track | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userTrackIds, setUserTrackIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 300));
      const catalog = loadTracksCatalog();
      setTracks(catalog);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const refreshUserTracks = () => {
    const ids = new Set<string>();
    tracks.forEach(t => {
      if (isTrackInUserPlan(t.id)) {
        ids.add(t.id);
      }
    });
    setUserTrackIds(ids);
  };

  useEffect(() => {
    if (tracks.length > 0) {
      refreshUserTracks();
    }
  }, [tracks]);

  const filteredTracks = useMemo(() => {
    return filterTracks(tracks, filters);
  }, [tracks, filters]);

  const handleAddToPlan = (trackId: string) => {
    const track = tracks.find(t => t.id === trackId);
    if (track) {
      setSelectedTrack(track);
      setIsModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTrack(null);
  };

  const handleModalSuccess = () => {
    refreshUserTracks();
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-6xl mx-auto">
          <h1 className="text-lg font-medium text-foreground">Explorar</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Trilhas disponíveis.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground">{tracks.length} trilhas</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-foreground">6 categorias</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-6xl mx-auto">
        {/* Filters */}
        <div className="sticky top-0 z-30 bg-background -mx-4 px-4 py-3 sm:static sm:mx-0 sm:px-0 sm:py-0 border-b sm:border-b-0 mb-4 sm:mb-0">
          <TrackFilters 
            filters={filters} 
            onFiltersChange={setFilters} 
            resultCount={filteredTracks.length} 
          />
        </div>

        <div className="mt-6 flex gap-6">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-4">
              <DesktopFilters filters={filters} onFiltersChange={setFilters} />
            </div>
          </aside>

          {/* Tracks Grid */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <TrackGridSkeleton count={6} />
            ) : filteredTracks.length === 0 ? (
              <EmptyState 
                type="no-results" 
                onClearFilters={() => setFilters(getDefaultFilters())} 
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredTracks.map((track) => (
                  <TrackCard
                    key={track.id}
                    track={track}
                    isInUserPlan={userTrackIds.has(track.id)}
                    onAddToPlan={handleAddToPlan}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <AddToPlanModal
        track={selectedTrack}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}
