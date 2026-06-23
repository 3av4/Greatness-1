import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, MessageCircle, Music, Settings as SettingsIcon, Shield, Link2,
  LogIn, Play, Pause, SkipForward, SkipBack, Crown, Volume2, VolumeX, X,
} from "lucide-react";
import { useApp } from "../AppContext";

type Screen = "home" | "chat" | "music" | "settings" | "admin" | "links" | "login";

export default function NavBar({ screen, onNav }: { screen: Screen; onNav: (s: Screen) => void }) {
  const {
    currentUser, isGuest, isOwner, currentTrack, isPlaying, togglePlay,
    nextTrack, prevTrack, progress, duration, seekTo, volume, isMuted, toggleMute,
  } = useApp();

  const [playerHidden, setPlayerHidden] = useState(false);

  const items: { key: Screen; label: string; icon: any; show: boolean }[] = [
    { key: "home", label: "الرئيسية", icon: Home, show: true },
    { key: "chat", label: "شات", icon: MessageCircle, show: true },
    { key: "music", label: "موسيقى", icon: Music, show: true },
    { key: "links", label: "روابط", icon: Link2, show: true },
    { key: "settings", label: "إعدادات", icon: SettingsIcon, show: !isGuest || !!currentUser },
    { key: "admin", label: "Admin", icon: Shield, show: !!isOwner },
  ];

  const visibleItems = items.filter((i) => i.show);

  const formatTime = (s: number) => {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <>
      {/* Mini player */}
      <AnimatePresence>
        {currentTrack && !playerHidden && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-[68px] left-2 right-2 md:left-1/2 md:-translate-x-1/2 md:right-auto md:w-[420px] z-40 glass-strong rounded-xl p-2 shadow-2xl"
            style={{ borderColor: "var(--brand)", borderWidth: 1, transform: "translateZ(0)", WebkitTransform: "translateZ(0)" }}
          >
            {/* Close button */}
            <button
              onClick={() => setPlayerHidden(true)}
              className="absolute -top-2.5 -left-2.5 w-7 h-7 rounded-full bg-[var(--bg-2)] border border-[var(--border)] flex items-center justify-center z-10 hover:bg-[var(--brand)]/20 transition"
              title="إخفاء المشغل"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <div onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              seekTo((e.clientX - rect.left) / rect.width);
            }} className="h-1 bg-white/10 rounded-full overflow-hidden cursor-pointer mb-2">
              <div className="h-full bg-[var(--brand)] rounded-full transition-all" style={{ width: `${duration ? (progress / duration) * 100 : 0}%` }} />
            </div>

            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "linear-gradient(135deg, var(--brand), #6b0710)" }}>
                <Music className="w-4 h-4 text-[var(--gold)]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold truncate">{currentTrack.title}</div>
                <div className="text-[9px] text-muted truncate">{currentTrack.artist}</div>
              </div>

              <div className="flex items-center gap-0.5">
                <button onClick={prevTrack} className="w-7 h-7 rounded-lg btn-ghost flex items-center justify-center">
                  <SkipBack className="w-3.5 h-3.5" />
                </button>
                <button onClick={togglePlay} className="w-9 h-9 rounded-lg btn-brand flex items-center justify-center">
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 mr-0.5" />}
                </button>
                <button onClick={nextTrack} className="w-7 h-7 rounded-lg btn-ghost flex items-center justify-center">
                  <SkipForward className="w-3.5 h-3.5" />
                </button>
              </div>

              <button onClick={toggleMute} className="w-7 h-7 rounded-lg btn-ghost flex items-center justify-center hidden sm:flex">
                {isMuted || volume === 0 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="flex justify-between text-[8px] text-muted mt-1 px-0.5">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating music button when player is hidden */}
      <AnimatePresence>
        {currentTrack && playerHidden && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            onClick={() => setPlayerHidden(false)}
            className="fixed bottom-[80px] left-4 z-40 w-12 h-12 rounded-full btn-brand flex items-center justify-center shadow-2xl"
            style={{ boxShadow: "0 8px 30px rgba(177,18,26,0.4)" }}
            title="إظهار المشغل"
          >
            <Music className="w-5 h-5 text-[var(--gold)]" />
            {isPlaying && (
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[var(--gold)] border-2 border-[var(--bg-1)]" />
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 inset-x-0 z-30 safe-bottom">
        <div className="max-w-lg mx-auto px-1.5 pb-1.5 pt-0.5">
          <div className="glass-strong rounded-xl flex items-center justify-around p-0.5 shadow-xl border border-[var(--border)]">
            {visibleItems.map((item) => {
              const active = screen === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => onNav(item.key)}
                  className={`relative flex-1 flex flex-col items-center gap-0.5 py-1.5 px-0.5 rounded-lg transition ${
                    active ? "text-[var(--brand)]" : "text-[var(--text-2)] hover:text-white"
                  }`}
                >
                  {active && (
                    <motion.div layoutId="navActive" className="absolute inset-0 rounded-lg"
                      style={{ background: "rgba(177,18,26,0.1)" }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                  )}
                  <item.icon className="w-[18px] h-[18px] relative z-10" />
                  <span className="text-[9px] font-bold relative z-10">{item.label}</span>
                </button>
              );
            })}
            {!currentUser && !isGuest && (
              <button onClick={() => onNav("login")}
                className="flex-1 flex flex-col items-center gap-0.5 py-1.5 px-0.5 rounded-lg text-[var(--text-2)] hover:text-white">
                <LogIn className="w-[18px] h-[18px]" />
                <span className="text-[9px] font-bold">دخول</span>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Top bar */}
      <header className="sticky top-0 z-20 glass-strong border-b border-[var(--border)] safe-top">
        <div className="max-w-5xl mx-auto px-3 py-2.5 flex items-center justify-between">
          <button onClick={() => onNav("home")} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, var(--brand), #6b0710)" }}>
              <Crown className="w-4 h-4 text-[var(--gold)]" />
            </div>
            <div className="text-right">
              <div className="font-black font-display text-xs text-shimmer">العظمة</div>
              <div className="text-[9px] text-muted leading-none">The Greatness</div>
            </div>
          </button>

          {currentUser && (
            <div className="flex items-center gap-1.5 glass rounded-full px-2.5 py-1">
              <img src={currentUser.imageUrl} alt="" className="w-6 h-6 rounded-md object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/30"; }} />
              <span className="text-[10px] font-bold truncate max-w-[80px]">{currentUser.handle}</span>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
