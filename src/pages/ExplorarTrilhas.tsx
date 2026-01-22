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
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[#1A237E] to-[#255FF1] text-white">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Explorar Trilhas</h1>
              <p className="text-white/80 text-sm md:text-base">
                Descubra sua próxima jornada de aprendizado
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <BookOpen className="w-4 h-4" />
                <span className="text-xl font-bold">{tracks.length}</span>
              </div>
              <p className="text-[10px] text-white/70 uppercase tracking-wide">Trilhas</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xl font-bold">6</span>
              </div>
              <p className="text-[10px] text-white/70 uppercase tracking-wide">Categorias</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Sparkles className="w-4 h-4" />
                <span className="text-xl font-bold">IA</span>
              </div>
              <p className="text-[10px] text-white/70 uppercase tracking-wide">Copiloto</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Filters */}
        <TrackFilters 
          filters={filters} 
          onFiltersChange={setFilters} 
          resultCount={filteredTracks.length} 
        />

        <div className="mt-6 flex gap-6">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden md:block w-64 shrink-0">
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
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
