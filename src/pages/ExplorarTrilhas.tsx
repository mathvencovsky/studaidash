import { useState, useEffect, useMemo } from "react";
import { Compass, BookOpen, TrendingUp, Sparkles } from "lucide-react";
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

  // Load tracks catalog
  useEffect(() => {
    // TODO API: GET /api/tracks/catalog
    const loadData = async () => {
      setIsLoading(true);
      // Simulate network delay for skeleton demo
      await new Promise(resolve => setTimeout(resolve, 500));
      const catalog = loadTracksCatalog();
      setTracks(catalog);
      setIsLoading(false);
    };
    loadData();
  }, []);

  // Update user tracks status
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

  // Filter tracks
  const filteredTracks = useMemo(() => {
    return filterTracks(tracks, filters);
  }, [tracks, filters]);

  // Handle add to plan
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

  // Featured tracks (for hero section)
  const featuredTracks = useMemo(() => {
    return tracks.filter(t => t.badge === "popular" || t.badge === "recommended").slice(0, 3);
  }, [tracks]);

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-8">
      {/* Hero Section - More compact on mobile */}
      <div className="bg-gradient-to-br from-[#1A237E] to-[#255FF1] text-white">
        <div className="container mx-auto px-4 py-6 sm:py-8 md:py-12">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Compass className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Explorar Trilhas</h1>
              <p className="text-white/80 text-xs sm:text-sm md:text-base">
                Descubra sua próxima jornada de aprendizado
              </p>
            </div>
          </div>

          {/* Stats - Smaller on mobile */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4 sm:mt-6">
            <div className="bg-white/10 rounded-lg p-2 sm:p-3 text-center">
              <div className="flex items-center justify-center gap-1 mb-0.5 sm:mb-1">
                <BookOpen className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-lg sm:text-xl font-bold">{tracks.length}</span>
              </div>
              <p className="text-[8px] sm:text-[10px] text-white/70 uppercase tracking-wide">Trilhas</p>
            </div>
            <div className="bg-white/10 rounded-lg p-2 sm:p-3 text-center">
              <div className="flex items-center justify-center gap-1 mb-0.5 sm:mb-1">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-lg sm:text-xl font-bold">6</span>
              </div>
              <p className="text-[8px] sm:text-[10px] text-white/70 uppercase tracking-wide">Categorias</p>
            </div>
            <div className="bg-white/10 rounded-lg p-2 sm:p-3 text-center">
              <div className="flex items-center justify-center gap-1 mb-0.5 sm:mb-1">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-lg sm:text-xl font-bold">IA</span>
              </div>
              <p className="text-[8px] sm:text-[10px] text-white/70 uppercase tracking-wide">Copiloto</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Filters - Sticky on mobile */}
        <div className="sticky top-0 z-30 bg-background -mx-3 sm:-mx-4 px-3 sm:px-4 py-3 sm:py-0 sm:static sm:bg-transparent border-b sm:border-b-0 mb-4 sm:mb-0">
          <TrackFilters 
            filters={filters} 
            onFiltersChange={setFilters} 
            resultCount={filteredTracks.length} 
          />
        </div>

        <div className="mt-4 sm:mt-6 flex gap-6">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-4">
              <DesktopFilters filters={filters} onFiltersChange={setFilters} />
            </div>
          </aside>

          {/* Tracks Grid - Better responsive */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <TrackGridSkeleton count={6} />
            ) : filteredTracks.length === 0 ? (
              <EmptyState 
                type="no-results" 
                onClearFilters={() => setFilters(getDefaultFilters())} 
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
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

      {/* Add to Plan Modal */}
      <AddToPlanModal
        track={selectedTrack}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}
