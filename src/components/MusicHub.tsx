import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Music, ThumbsUp, ThumbsDown, Trash2, Play, Pause,
  SkipForward, SkipBack, Search, Sparkles, Disc3, ListMusic,
  TrendingUp, Clock, Volume2, VolumeX, Repeat, Shuffle,
  X, ExternalLink, Eye, BarChart3
} from "lucide-react";
import { useApp } from "../AppContext";

// CSS Visualizer - pure CSS, no canvas, no glitch
function CSSVisualizer({ isPlaying }: { isPlaying: boolean }) {
  if (!isPlaying) {
    return (
      <div className="w-full h-[40px] md:h-[50px] flex items-end justify-between gap-[2px] px-1"
        style={{ transform: "translateZ(0)", WebkitTransform: "translateZ(0)" }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="flex-1 h-[3px] rounded-sm" style={{ background: "rgba(255,255,255,0.08)" }} />
        ))}
      </div>
    );
  }
  return (
    <div className="w-full h-[40px] md:h-[50px] flex items-end justify-between gap-[2px] px-1"
      style={{ transform: "translateZ(0)", WebkitTransform: "translateZ(0)" }}>
      {Array.from({ length: 20 }).map((_, i) => {
        const delay = (i * 0.05) + (Math.random() * 0.3);
        const duration = 0.4 + Math.random() * 0.5;
        return (
          <div key={i} className="flex-1 flex items-end" style={{ height: "100%" }}>
            <div
              className="w-full rounded-sm"
              style={{
                background: i % 3 === 0 ? "linear-gradient(to top, #f5c542, #b1121a)" : "linear-gradient(to top, rgba(177,18,26,0.7), rgba(177,18,26,0.3))",
                height: "100%",
                animation: `vizBounce ${duration}s ease-in-out ${delay}s infinite alternate`,
                transformOrigin: "bottom",
                transform: "translateZ(0)",
                WebkitTransform: "translateZ(0)",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}

export default function MusicHub() {
  const {
    songs, currentUser, isGuest, addSong, deleteSong, reactSong,
    currentTrack, isPlaying, playTrack, togglePlay, nextTrack, prevTrack,
    progress, duration, seekTo, volume, setVolume, isMuted, toggleMute,
    isRepeat, toggleRepeat, isShuffle, toggleShuffle, isOwner
  } = useApp();

  const [tab, setTab] = useState<"local" | "spotify">("local");
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [songTitle, setSongTitle] = useState("");
  const [songArtist, setSongArtist] = useState("");
  const [songUrl, setSongUrl] = useState("");
  const [addMsg, setAddMsg] = useState("");
  const [adding, setAdding] = useState(false);
  const [spotifyQuery, setSpotifyQuery] = useState("arabic trap");
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [sortBy, setSortBy] = useState<"popular" | "newest">("popular");

  const sortedSongs = useMemo(() => {
    const list = [...songs];
    if (sortBy === "popular") {
      list.sort((a, b) => {
        const scoreA = (a.likes.length - a.dislikes.length) + ((a.views || 0) * 0.1);
        const scoreB = (b.likes.length - b.dislikes.length) + ((b.views || 0) * 0.1);
        if (scoreB !== scoreA) return scoreB - scoreA;
        return (b.createdAt || 0) - (a.createdAt || 0);
      });
    } else {
      list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    }
    return list;
  }, [songs, sortBy]);

  const filtered = useMemo(() => {
    if (!search) return sortedSongs;
    const q = search.toLowerCase();
    return sortedSongs.filter((s) => s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q));
  }, [sortedSongs, search]);

  const formatTime = (s: number) => {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const doAdd = async () => {
    if (!songTitle || !songUrl) { setAddMsg("أدخل العنوان والرابط"); return; }
    setAdding(true);
    const r = await addSong(songTitle, songArtist || currentUser?.handle || "مجهول", songUrl);
    setAddMsg(r.msg);
    if (r.ok) { setSongTitle(""); setSongArtist(""); setSongUrl(""); setShowAdd(false); }
    setAdding(false);
  };

  const spotifyEmbed = `https://open.spotify.com/embed/search/${encodeURIComponent(spotifyQuery)}?utm_source=generator&theme=0`;

  return (
    <div className="min-h-screen p-3 md:p-5 pb-28"
      style={{ transform: "translateZ(0)", WebkitTransform: "translateZ(0)", touchAction: "pan-y" }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-2xl p-4 md:p-5 mb-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 md:w-12 md:h-12 rounded-xl flex items-center justify-center btn-brand">
                <Music className="w-5 h-5 md:w-6 md:h-6" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-black font-display text-shimmer">Music Hub</h1>
                <p className="text-muted text-[10px] md:text-xs flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[var(--gold)]" /> صوت العظمة
                </p>
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              {currentUser && !isGuest && (
                <button onClick={() => setShowAdd(true)} className="btn-gold px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 text-xs flex-1 sm:flex-none justify-center">
                  <Disc3 className="w-3.5 h-3.5" /> أضف أغنية
                </button>
              )}
              <button onClick={() => setShowPlaylist(!showPlaylist)} className="btn-ghost px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 text-xs">
                <ListMusic className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">القائمة</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4 p-1 glass rounded-xl w-fit">
          <button onClick={() => setTab("local")}
            className={`px-4 py-2 rounded-lg font-bold text-xs transition flex items-center gap-1.5 ${tab === "local" ? "btn-brand" : "text-muted hover:text-white"}`}>
            <Disc3 className="w-3.5 h-3.5" /> أغاني العظمة
          </button>
          <button onClick={() => setTab("spotify")}
            className={`px-4 py-2 rounded-lg font-bold text-xs transition flex items-center gap-1.5 ${tab === "spotify" ? "btn-brand" : "text-muted hover:text-white"}`}>
            <Music className="w-3.5 h-3.5" /> Spotify
          </button>
        </div>

        {tab === "local" && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
              <StatCard icon={ListMusic} value={songs.length} label="أغنية" color="var(--brand)" />
              <StatCard icon={TrendingUp} value={songs.reduce((a, s) => a + s.likes.length, 0)} label="إعجاب" color="#10b981" />
              <StatCard icon={Eye} value={songs.reduce((a, s) => a + (s.views || 0), 0)} label="مشاهدة" color="#3b82f6" />
              <StatCard icon={Clock} value={formatTime(duration)} label="المدة" color="#8b5cf6" />
            </div>

            {/* Now Playing - SOLID background, NO backdrop-filter */}
            {currentTrack && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl p-3 md:p-4 mb-4"
                style={{
                  background: "linear-gradient(180deg, #1a080c 0%, #0d0406 100%)",
                  border: "1px solid rgba(177,18,26,0.2)",
                  transform: "translateZ(0)",
                  WebkitTransform: "translateZ(0)",
                }}>
                {/* CSS Visualizer - NO CANVAS */}
                <CSSVisualizer isPlaying={isPlaying} />

                <div className="flex items-center gap-2 md:gap-3 mt-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "linear-gradient(135deg, var(--brand), #6b0710)", transform: "translateZ(0)", WebkitTransform: "translateZ(0)" }}>
                    <Music className="w-5 h-5 md:w-6 md:h-6 text-[var(--gold)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm truncate">{currentTrack.title}</h3>
                    <p className="text-[10px] md:text-xs text-muted truncate">{currentTrack.artist}</p>
                  </div>
                  <div className="flex items-center gap-0.5 md:gap-1">
                    <button onClick={toggleShuffle} className={`w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center ${isShuffle ? "bg-[var(--brand)]/20 text-[var(--brand)]" : "btn-ghost"}`}>
                      <Shuffle className="w-3 h-3 md:w-3.5 md:h-3.5" />
                    </button>
                    <button onClick={prevTrack} className="w-8 h-8 md:w-9 md:h-9 rounded-lg btn-ghost flex items-center justify-center">
                      <SkipBack className="w-4 h-4" />
                    </button>
                    <button onClick={togglePlay} className="w-10 h-10 md:w-12 md:h-12 rounded-xl btn-brand flex items-center justify-center">
                      {isPlaying ? <Pause className="w-5 h-5 md:w-6 md:h-6" /> : <Play className="w-5 h-5 md:w-6 md:h-6 mr-0.5" />}
                    </button>
                    <button onClick={nextTrack} className="w-8 h-8 md:w-9 md:h-9 rounded-lg btn-ghost flex items-center justify-center">
                      <SkipForward className="w-4 h-4" />
                    </button>
                    <button onClick={toggleRepeat} className={`w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center ${isRepeat ? "bg-[var(--brand)]/20 text-[var(--brand)]" : "btn-ghost"}`}>
                      <Repeat className="w-3 h-3 md:w-3.5 md:h-3.5" />
                    </button>
                  </div>
                </div>
                <div onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  seekTo((e.clientX - rect.left) / rect.width);
                }} className="h-1.5 rounded-full overflow-hidden cursor-pointer mt-3" style={{ background: "rgba(255,255,255,0.1)" }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${duration ? (progress / duration) * 100 : 0}%`, background: "var(--brand)" }} />
                </div>
                <div className="flex justify-between text-[9px] text-muted mt-1">
                  <span>{formatTime(progress)}</span><span>{formatTime(duration)}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={toggleMute} className="w-7 h-7 rounded-lg btn-ghost flex items-center justify-center">
                    {isMuted || volume === 0 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>
                  <input type="range" min="0" max="1" step="0.01" value={isMuted ? 0 : volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="flex-1 h-1 rounded-full appearance-none cursor-pointer accent-[var(--brand)]"
                    style={{ background: "rgba(255,255,255,0.1)" }} />
                </div>
              </motion.div>
            )}

            {/* Search & Sort */}
            <div className="flex flex-col sm:flex-row gap-2 mb-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-3)]" />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="ابحث عن أغنية..." className="input pr-9 text-sm py-2" />
              </div>
              <div className="flex gap-2">
                <button onClick={() => setSortBy("popular")}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition ${sortBy === "popular" ? "btn-brand" : "btn-ghost"}`}>
                  <BarChart3 className="w-3 h-3 inline ml-1" /> الشعبية
                </button>
                <button onClick={() => setSortBy("newest")}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition ${sortBy === "newest" ? "btn-brand" : "btn-ghost"}`}>
                  <Clock className="w-3 h-3 inline ml-1" /> الأحدث
                </button>
              </div>
            </div>

            {/* Top 3 */}
            {filtered.slice(0, 3).length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                {filtered.slice(0, 3).map((s, i) => (
                  <TopCard key={s.id} song={s} index={i} currentTrack={currentTrack} isPlaying={isPlaying}
                    togglePlay={togglePlay} playTrack={playTrack} currentUser={currentUser} isGuest={isGuest}
                    reactSong={reactSong} isOwner={isOwner} deleteSong={deleteSong} />
                ))}
              </div>
            )}

            {/* Rest */}
            <div className="space-y-2">
              {filtered.length === 0 && (
                <div className="text-center py-10 glass rounded-2xl">
                  <Music className="w-10 h-10 mx-auto text-[var(--text-3)] mb-2" />
                  <p className="text-muted text-sm">لا توجد أغاني بعد</p>
                </div>
              )}
              {filtered.slice(3).map((s, i) => (
                <SongRow key={s.id} song={s} index={i + 4} currentTrack={currentTrack} isPlaying={isPlaying}
                  togglePlay={togglePlay} playTrack={playTrack} currentUser={currentUser} isGuest={isGuest}
                  reactSong={reactSong} isOwner={isOwner} deleteSong={deleteSong} />
              ))}
            </div>
          </>
        )}

        {tab === "spotify" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <div className="glass-strong rounded-2xl p-4">
              <label className="text-xs text-muted mb-2 block">ابحث في Spotify</label>
              <div className="flex gap-2">
                <input type="text" value={spotifyQuery} onChange={(e) => setSpotifyQuery(e.target.value)}
                  placeholder="مثال: wegz..." className="input flex-1 text-sm py-2" />
                <button onClick={() => window.open(`https://open.spotify.com/search/${encodeURIComponent(spotifyQuery)}`, "_blank")}
                  className="btn-brand px-4 rounded-xl font-bold text-xs">فتح</button>
              </div>
            </div>
            <div className="glass rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
              <iframe key={spotifyQuery} src={spotifyEmbed} width="100%" height="380" frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" title="Spotify" />
            </div>
          </motion.div>
        )}
      </div>

      {/* Playlist Drawer */}
      <AnimatePresence>
        {showPlaylist && (
          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-72 md:w-80 z-50 glass-strong border-l border-[var(--border)] p-4 overflow-y-auto"
            style={{ overscrollBehavior: "none", WebkitOverflowScrolling: "touch", transform: "translateZ(0)", WebkitTransform: "translateZ(0)" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black font-display flex items-center gap-2">
                <ListMusic className="w-4 h-4 text-[var(--brand)]" /> القائمة
              </h3>
              <button onClick={() => setShowPlaylist(false)} className="w-8 h-8 rounded-lg btn-ghost flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1.5">
              {songs.map((s, i) => {
                const isCurrent = currentTrack?.id === s.id;
                return (
                  <button key={s.id} onClick={() => { playTrack(s); setShowPlaylist(false); }}
                    className={`w-full text-right p-2.5 rounded-xl transition flex items-center gap-2.5 ${
                      isCurrent ? "bg-[var(--brand)]/12 ring-1 ring-[var(--brand)]" : "hover:bg-white/5"
                    }`}>
                    <span className="text-[10px] text-muted w-4">{i + 1}</span>
                    <div className="w-8 h-8 rounded-lg btn-brand flex items-center justify-center flex-shrink-0">
                      {isCurrent && isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 mr-0.5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-bold text-xs truncate ${isCurrent ? "text-[var(--brand)]" : ""}`}>{s.title}</div>
                      <div className="text-[10px] text-muted truncate">{s.artist}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Song Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.8)", transform: "translateZ(0)", WebkitTransform: "translateZ(0)" }}
            onClick={() => setShowAdd(false)}>
            <motion.div initial={{ scale: 0.92, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 16 }}
              className="glass-strong rounded-2xl p-5 max-w-sm w-full max-h-[90vh] overflow-y-auto"
              style={{ overscrollBehavior: "none", transform: "translateZ(0)", WebkitTransform: "translateZ(0)" }}
              onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-black font-display mb-3 flex items-center gap-2">
                <Disc3 className="w-5 h-5 text-[var(--gold)]" /> إضافة أغنية
              </h3>

              <div className="rounded-xl p-3 mb-3"
                style={{ background: "rgba(177,18,26,0.08)", border: "1px solid rgba(177,18,26,0.15)" }}>
                <p className="text-xs text-muted mb-2">كيفية إضافة أغنية:</p>
                <ol className="text-[10px] text-muted space-y-1 list-decimal list-inside">
                  <li>ادخل إلى <strong>catbox.moe</strong></li>
                  <li>ارفع ملف MP3</li>
                  <li>انسخ الرابط المباشر</li>
                  <li>ألصقه هنا</li>
                </ol>
                <a href="https://catbox.moe" target="_blank" rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-xs text-[var(--brand)] font-bold hover:underline">
                  <ExternalLink className="w-3 h-3" /> فتح Catbox
                </a>
              </div>

              <div className="space-y-2.5">
                <input type="text" value={songTitle} onChange={(e) => setSongTitle(e.target.value)}
                  placeholder="اسم الأغنية *" className="input text-sm py-2" />
                <input type="text" value={songArtist} onChange={(e) => setSongArtist(e.target.value)}
                  placeholder="الفنان (اختياري)" className="input text-sm py-2" />
                <input type="text" value={songUrl} onChange={(e) => setSongUrl(e.target.value)}
                  placeholder="رابط MP3 مباشر *" className="input text-sm py-2" />
                {addMsg && (
                  <p className={`text-xs p-2 rounded-lg ${addMsg.includes("تم") ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                    {addMsg}
                  </p>
                )}
                <div className="flex gap-2 pt-1">
                  <button onClick={doAdd} disabled={adding} className="flex-1 btn-brand py-2.5 rounded-xl font-bold text-xs">
                    {adding ? "جاري..." : "إضافة"}
                  </button>
                  <button onClick={() => setShowAdd(false)} className="btn-ghost px-4 py-2.5 rounded-xl font-bold text-xs">إلغاء</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ icon: Icon, value, label, color }: { icon: any; value: string | number; label: string; color: string }) {
  return (
    <div className="glass rounded-xl p-3 flex items-center gap-2.5"
      style={{ transform: "translateZ(0)", WebkitTransform: "translateZ(0)" }}>
      <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${color}15` }}>
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
      <div>
        <div className="text-lg font-black">{value}</div>
        <div className="text-[10px] text-muted">{label}</div>
      </div>
    </div>
  );
}

function TopCard({ song, index, currentTrack, isPlaying, togglePlay, playTrack, currentUser, isGuest, reactSong, isOwner, deleteSong }: any) {
  const isCurrent = currentTrack?.id === song.id;
  const score = (song.likes.length - song.dislikes.length);
  const isLiked = currentUser ? song.likes.includes(currentUser.id) : false;
  const isDisliked = currentUser ? song.dislikes.includes(currentUser.id) : false;
  const medalColors = ["from-[#FFD700] to-[#FF8C00]", "from-[#C0C0C0] to-[#808080]", "from-[#CD7F32] to-[#8B4513]"];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
      className={`glass rounded-xl p-4 relative overflow-hidden ${isCurrent ? "ring-1 ring-[var(--brand)]" : ""}`}
      style={{ transform: "translateZ(0)", WebkitTransform: "translateZ(0)" }}>
      <div className={`absolute top-0 right-0 px-2.5 py-0.5 rounded-bl-lg text-[10px] font-black text-white bg-gradient-to-br ${medalColors[index]}`}>
        #{index + 1}
      </div>
      <div className="flex items-center gap-2.5 mb-2.5">
        <button onClick={() => (isCurrent ? togglePlay() : playTrack(song))}
          className="w-10 h-10 rounded-lg btn-brand flex items-center justify-center flex-shrink-0">
          {isCurrent && isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 mr-0.5" />}
        </button>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm truncate">{song.title}</h3>
          <p className="text-[10px] text-muted truncate">{song.artist}</p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => currentUser && !isGuest && reactSong(song.id, "like")} disabled={isGuest || !currentUser}
            className={`text-[10px] flex items-center gap-1 transition ${isLiked ? "text-emerald-400" : "text-muted hover:text-emerald-400"}`}>
            <ThumbsUp className="w-3 h-3" /> {song.likes.length}
          </button>
          <button onClick={() => currentUser && !isGuest && reactSong(song.id, "dislike")} disabled={isGuest || !currentUser}
            className={`text-[10px] flex items-center gap-1 transition ${isDisliked ? "text-red-400" : "text-muted hover:text-red-400"}`}>
            <ThumbsDown className="w-3 h-3" /> {song.dislikes.length}
          </button>
          <span className="text-[10px] text-muted flex items-center gap-0.5">
            <Eye className="w-3 h-3" /> {song.views || 0}
          </span>
        </div>
        <span className={`text-xs font-black ${score > 0 ? "text-emerald-400" : score < 0 ? "text-red-400" : "text-muted"}`}>
          {score > 0 ? "+" : ""}{score}
        </span>
      </div>
      {isOwner && (
        <button onClick={() => { if (confirm("حذف؟")) deleteSong(song.id); }}
          className="absolute bottom-2.5 left-2.5 w-6 h-6 rounded-md flex items-center justify-center bg-red-500/20 text-red-400 hover:bg-red-500/30">
          <Trash2 className="w-2.5 h-2.5" />
        </button>
      )}
    </motion.div>
  );
}

function SongRow({ song, index, currentTrack, isPlaying, togglePlay, playTrack, currentUser, isGuest, reactSong, isOwner, deleteSong }: any) {
  const isCurrent = currentTrack?.id === song.id;
  const score = song.likes.length - song.dislikes.length;
  const isLiked = currentUser ? song.likes.includes(currentUser.id) : false;
  const isDisliked = currentUser ? song.dislikes.includes(currentUser.id) : false;

  return (
    <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: (index - 4) * 0.01 }}
      className={`glass rounded-lg p-2 flex items-center gap-2 ${isCurrent ? "ring-1 ring-[var(--brand)]" : ""}`}
      style={{ transform: "translateZ(0)", WebkitTransform: "translateZ(0)" }}>
      <div className="text-xs font-black w-5 text-center text-[var(--text-3)]">{index}</div>
      <button onClick={() => (isCurrent ? togglePlay() : playTrack(song))}
        className="w-9 h-9 rounded-lg flex items-center justify-center btn-brand flex-shrink-0">
        {isCurrent && isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 mr-0.5" />}
      </button>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-xs truncate">{song.title}</h3>
        <p className="text-[10px] text-muted truncate">{song.artist}</p>
      </div>
      <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 glass rounded-md">
        <span className={`text-[10px] font-black ${score > 0 ? "text-emerald-400" : score < 0 ? "text-red-400" : "text-muted"}`}>
          {score > 0 ? "+" : ""}{score}
        </span>
      </div>
      <div className="flex items-center gap-0.5">
        <button onClick={() => currentUser && !isGuest && reactSong(song.id, "like")} disabled={isGuest || !currentUser}
          className={`w-7 h-7 rounded-md flex items-center justify-center transition ${isLiked ? "bg-emerald-500/20 text-emerald-400" : "btn-ghost"}`}>
          <ThumbsUp className="w-3 h-3" />
        </button>
        <button onClick={() => currentUser && !isGuest && reactSong(song.id, "dislike")} disabled={isGuest || !currentUser}
          className={`w-7 h-7 rounded-md flex items-center justify-center transition ${isDisliked ? "bg-red-500/20 text-red-400" : "btn-ghost"}`}>
          <ThumbsDown className="w-3 h-3" />
        </button>
        {isOwner && (
          <button onClick={() => { if (confirm("حذف؟")) deleteSong(song.id); }}
            className="w-7 h-7 rounded-md flex items-center justify-center bg-red-500/20 text-red-400 hover:bg-red-500/30">
            <Trash2 className="w-3 h-3" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
