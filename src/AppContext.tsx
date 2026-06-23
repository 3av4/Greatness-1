import React, {
  createContext, useContext, useEffect, useMemo, useRef, useState, useCallback, ReactNode,
} from "react";
import {
  firebaseReady, db, collection, doc, setDoc, updateDoc, deleteDoc,
  onSnapshot, query, orderBy, serverTimestamp, writeBatch,
} from "./firebase";
import { Member, SEED_MEMBERS, SEED_SONGS, SEED_MESSAGES } from "./seedData";

export type ThemeMode = "dark" | "night";

interface Song {
  id: string; title: string; artist: string; fileUrl: string;
  uploadedBy: string; likes: string[]; dislikes: string[]; views: number; createdAt: number;
}
interface ChatMessage {
  id: string; memberId: string; memberName: string; memberAvatar: string;
  message: string; timestamp: number;
}
interface SiteSettings {
  primaryColor: string; themeMode: ThemeMode;
}

interface AppContextValue {
  currentUser: Member | null; isGuest: boolean;
  login: (handle: string, password: string) => { ok: boolean; msg: string };
  logout: () => void; enterGuest: () => void;
  changePassword: (oldP: string, newP: string) => { ok: boolean; msg: string };

  members: Member[];
  updateMember: (id: string, patch: Partial<Member>) => Promise<void>;
  addMember: (m: Member) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  banMember: (id: string, banned: boolean) => Promise<void>;

  songs: Song[];
  addSong: (title: string, artist: string, fileUrl: string) => Promise<{ ok: boolean; msg: string }>;
  deleteSong: (id: string) => Promise<void>;
  reactSong: (id: string, type: "like" | "dislike") => Promise<void>;
  incrementViews: (id: string) => Promise<void>;

  messages: ChatMessage[];
  sendMessage: (msg: string) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;

  settings: SiteSettings;
  setPrimaryColor: (c: string) => void;
  setThemeMode: (m: ThemeMode) => void;

  currentTrack: Song | null; isPlaying: boolean;
  playTrack: (s: Song) => void; togglePlay: () => void;
  nextTrack: () => void; prevTrack: () => void;
  seekTo: (pct: number) => void;
  progress: number; duration: number;
  volume: number; setVolume: (v: number) => void;
  isMuted: boolean; toggleMute: () => void;
  isRepeat: boolean; toggleRepeat: () => void;
  isShuffle: boolean; toggleShuffle: () => void;

  analyser: AnalyserNode | null;

  isAdmin: boolean; isOwner: boolean;
  firebaseConnected: boolean;
  pwaPrompt: any; setPwaPrompt: (p: any) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const STORAGE_KEY = "greatness:session";
const SETTINGS_KEY = "greatness:settings";

const loadLS = <T,>(k: string, d: T): T => {
  try { const v = localStorage.getItem(k); return v ? (JSON.parse(v) as T) : d; } catch { return d; }
};
const saveLS = (k: string, v: any) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

const LEGACY_PATCHES: Record<string, { legacyPassword?: string; newPassword?: string; legacyImageUrl?: string; newImageUrl?: string }> = {
  m_abd1: { legacyPassword: "abd1", newPassword: "Abd10", legacyImageUrl: "https://files.catbox.moe/pxmleq.png", newImageUrl: "https://files.catbox.moe/usuuhz.png" },
  m_hassan: { legacyPassword: "hassan", newPassword: "7sn01" },
  m_hamdi: { legacyPassword: "hamdi", newPassword: "7md96" },
  m_touna: { legacyPassword: "touna", newPassword: "Tona9" },
  m_abd2: { legacyPassword: "abd2", newPassword: "Abd02" },
  m_khrya: { legacyPassword: "khrya", newPassword: "Ni69o" },
  m_debbag: { legacyPassword: "debbag", newPassword: "Abojm" },
  m_linso: { legacyPassword: "linso", newPassword: "Lins11" },
};

function migrateLegacy(list: Member[]) {
  const updates: { id: string; patch: Partial<Member> }[] = [];
  const next = list.map((m) => {
    const rule = LEGACY_PATCHES[m.id];
    if (!rule) return m;
    const patch: Partial<Member> = {};
    if (rule.legacyPassword && rule.newPassword && m.password === rule.legacyPassword) patch.password = rule.newPassword;
    if (rule.legacyImageUrl && rule.newImageUrl && m.imageUrl === rule.legacyImageUrl) patch.imageUrl = rule.newImageUrl;
    if (Object.keys(patch).length > 0) { updates.push({ id: m.id, patch }); return { ...m, ...patch }; }
    return m;
  });
  return { next, updates };
}

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Member | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [members, setMembers] = useState<Member[]>(SEED_MEMBERS);
  const [songs, setSongs] = useState<Song[]>(SEED_SONGS.map(s => ({ ...s })));
  const [messages, setMessages] = useState<ChatMessage[]>(SEED_MESSAGES);
  const [settings, setSettings] = useState<SiteSettings>(() => loadLS(SETTINGS_KEY, { primaryColor: "#B1121A", themeMode: "dark" }));
  const [firebaseConnected, setFirebaseConnected] = useState(false);
  const [pwaPrompt, setPwaPrompt] = useState<any>(null);

  const [currentTrack, setCurrentTrack] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  // PWA
  useEffect(() => {
    const handler = (e: any) => { e.preventDefault(); setPwaPrompt(e); };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  // Session
  useEffect(() => {
    const s = loadLS<{ userId: string | null; guest: boolean } | null>(STORAGE_KEY, null);
    if (s?.userId) { const m = members.find((x) => x.id === s.userId); if (m) setCurrentUser(m); }
    else if (s?.guest) setIsGuest(true);
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    const fresh = members.find((x) => x.id === currentUser.id);
    if (fresh) setCurrentUser(fresh);
  }, [members]);

  // Firestore
  useEffect(() => {
    if (!firebaseReady || !db) return;

    const uMembers = onSnapshot(
      collection(db, "members"),
      async (snap) => {
        if (snap.empty) {
          try {
            const batch = writeBatch(db);
            SEED_MEMBERS.forEach((m) => { batch.set(doc(db, "members", m.id), { ...m, createdAt: serverTimestamp() }); });
            await batch.commit();
          } catch {}
          return;
        }
        const list = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Member[];
        const migrated = migrateLegacy(list);
        setMembers(migrated.next);
        if (migrated.updates.length > 0) {
          migrated.updates.forEach(({ id, patch }) => { updateDoc(doc(db, "members", id), patch as any).catch(() => {}); });
        }
        setFirebaseConnected(true);
      },
      () => { setMembers(SEED_MEMBERS); }
    );

    const uSongs = onSnapshot(
      query(collection(db, "songs"), orderBy("createdAt", "desc")),
      async (snap) => {
        if (snap.empty) {
          try { for (const s of SEED_SONGS) { await setDoc(doc(db, "songs", s.id), { ...s, views: 0, createdAt: serverTimestamp() }); } } catch {}
          return;
        }
        const list = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as Song[];
        setSongs(list);
      },
      () => {}
    );

    const uChat = onSnapshot(
      query(collection(db, "chat"), orderBy("timestamp", "asc")),
      async (snap) => {
        if (snap.empty) {
          try { for (const m of SEED_MESSAGES) { await setDoc(doc(db, "chat", m.id), { ...m, timestamp: serverTimestamp() }); } } catch {}
          return;
        }
        const list = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })) as ChatMessage[];
        setMessages(list.filter((m) => m.id !== "init"));
      },
      () => {}
    );

    return () => { uMembers(); uSongs(); uChat(); };
  }, [firebaseReady]);

  // Audio + Analyser
  useEffect(() => {
    const a = new Audio();
    a.crossOrigin = "anonymous";
    a.loop = false;
    audioRef.current = a;

    const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (AudioCtx) {
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.85;
      analyserRef.current = analyser;
      try {
        const source = ctx.createMediaElementSource(a);
        source.connect(analyser);
        analyser.connect(ctx.destination);
        sourceRef.current = source;
      } catch {}
    }

    const onTime = () => { setProgress(a.currentTime); setDuration(a.duration || 0); };
    const onEnded = () => {
      if (isRepeat && currentTrack) { a.currentTime = 0; a.play().catch(() => {}); }
      else { nextTrack(); }
    };
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onTime);
    a.addEventListener("ended", onEnded);

    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onTime);
      a.removeEventListener("ended", onEnded);
      a.pause();
      audioCtxRef.current?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (currentTrack && a.src !== currentTrack.fileUrl) {
      a.src = currentTrack.fileUrl;
      a.load();
      if (audioCtxRef.current?.state === "suspended") audioCtxRef.current.resume().catch(() => {});
    }
    a.volume = isMuted ? 0 : volume;
    if (isPlaying) { a.play().catch(() => setIsPlaying(false)); }
    else { a.pause(); }
  }, [currentTrack, isPlaying, volume, isMuted]);

  // Auth
  const login = (handle: string, password: string) => {
    const m = members.find((x) => x.handle === handle);
    if (!m) return { ok: false, msg: "هذا العضو غير موجود" };
    if (m.isBanned) return { ok: false, msg: "هذا الحساب محظور" };
    if (m.password !== password) return { ok: false, msg: "كلمة المرور خاطئة" };
    setCurrentUser(m); setIsGuest(false);
    saveLS(STORAGE_KEY, { userId: m.id, guest: false });
    return { ok: true, msg: "مرحباً بك في العظمة" };
  };
  const logout = () => { setCurrentUser(null); setIsGuest(false); saveLS(STORAGE_KEY, { userId: null, guest: false }); };
  const enterGuest = () => { setIsGuest(true); setCurrentUser(null); saveLS(STORAGE_KEY, { userId: null, guest: true }); };

  const changePassword = (oldP: string, newP: string) => {
    if (!currentUser) return { ok: false, msg: "لم تسجل الدخول" };
    if (currentUser.password !== oldP) return { ok: false, msg: "كلمة المرور القديمة خاطئة" };
    if (newP.length < 3) return { ok: false, msg: "كلمة المرور قصيرة" };
    updateMember(currentUser.id, { password: newP });
    return { ok: true, msg: "تم تغيير كلمة المرور" };
  };

  // Members
  const updateMember = async (id: string, patch: Partial<Member>) => {
    setMembers((prev) => {
      const next = prev.map((m) => (m.id === id ? { ...m, ...patch } : m));
      if (currentUser?.id === id) setCurrentUser({ ...currentUser, ...patch });
      return next;
    });
    if (firebaseReady && db) { try { await updateDoc(doc(db, "members", id), patch as any); } catch {} }
  };

  const addMember = async (m: Member) => {
    setMembers((prev) => [...prev, m]);
    if (firebaseReady && db) { try { await setDoc(doc(db, "members", m.id), { ...m, createdAt: serverTimestamp() } as any); } catch {} }
  };
  const deleteMember = async (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    if (firebaseReady && db) { try { await deleteDoc(doc(db, "members", id)); } catch {} }
  };
  const banMember = async (id: string, banned: boolean) => { await updateMember(id, { isBanned: banned }); };

  // Songs via URL
  const addSong = async (title: string, artist: string, fileUrl: string) => {
    if (!currentUser) return { ok: false, msg: "يجب تسجيل الدخول" };
    if (!fileUrl.match(/\.(mp3|m4a|ogg|wav)(\?.*)?$/i)) {
      return { ok: false, msg: "الرابط يجب أن ينتهي بـ .mp3 أو .m4a أو .ogg" };
    }
    const newSong: Song = { id: "s_" + Date.now(), title, artist, fileUrl, uploadedBy: currentUser.id, likes: [], dislikes: [], views: 0, createdAt: Date.now() };
    setSongs((prev) => [newSong, ...prev]);
    if (firebaseReady && db) { try { await setDoc(doc(db, "songs", newSong.id), { ...newSong, createdAt: serverTimestamp() }); } catch {} }
    return { ok: true, msg: "تمت الإضافة ✨" };
  };

  const deleteSong = async (id: string) => {
    setSongs((prev) => prev.filter((s) => s.id !== id));
    if (firebaseReady && db) { try { await deleteDoc(doc(db, "songs", id)); } catch {} }
  };

  const reactSong = async (id: string, type: "like" | "dislike") => {
    if (!currentUser) return;
    const patch = (s: Song) => {
      const likeHas = s.likes.includes(currentUser.id);
      const disHas = s.dislikes.includes(currentUser.id);
      if (type === "like") {
        if (likeHas) s.likes = s.likes.filter((x) => x !== currentUser.id);
        else { s.likes = [...s.likes, currentUser.id]; s.dislikes = s.dislikes.filter((x) => x !== currentUser.id); }
      } else {
        if (disHas) s.dislikes = s.dislikes.filter((x) => x !== currentUser.id);
        else { s.dislikes = [...s.dislikes, currentUser.id]; s.likes = s.likes.filter((x) => x !== currentUser.id); }
      }
      return s;
    };
    setSongs((prev) => prev.map((s) => (s.id === id ? patch({ ...s }) : s)));
    if (firebaseReady && db) {
      try {
        const s = songs.find((x) => x.id === id);
        if (s) { const u = patch({ ...s }); await updateDoc(doc(db, "songs", id), { likes: u.likes, dislikes: u.dislikes } as any); }
      } catch {}
    }
  };

  const incrementViews = async (id: string) => {
    setSongs((prev) => prev.map((s) => s.id === id ? { ...s, views: (s.views || 0) + 1 } : s));
    if (firebaseReady && db) {
      try {
        const s = songs.find((x) => x.id === id);
        if (s) await updateDoc(doc(db, "songs", id), { views: (s.views || 0) + 1 } as any);
      } catch {}
    }
  };

  // Chat
  const sendMessage = async (msg: string) => {
    if (!currentUser) return;
    const m: ChatMessage = { id: "c_" + Date.now(), memberId: currentUser.id, memberName: currentUser.name, memberAvatar: currentUser.imageUrl, message: msg.trim(), timestamp: Date.now() };
    setMessages((prev) => [...prev, m]);
    if (firebaseReady && db) { try { await setDoc(doc(db, "chat", m.id), { ...m, timestamp: serverTimestamp() }); } catch {} }
  };

  const deleteMessage = async (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    if (firebaseReady && db) { try { await deleteDoc(doc(db, "chat", id)); } catch {} }
  };

  // Settings
  const setPrimaryColor = (c: string) => { setSettings((s) => { const next = { ...s, primaryColor: c }; saveLS(SETTINGS_KEY, next); return next; }); };
  const setThemeMode = (m: ThemeMode) => { setSettings((s) => { const next = { ...s, themeMode: m }; saveLS(SETTINGS_KEY, next); return next; }); };

  // Audio
  const playTrack = (s: Song) => {
    if (currentTrack?.id !== s.id) incrementViews(s.id);
    setCurrentTrack(s);
    setIsPlaying(true);
  };
  const togglePlay = () => {
    if (!currentTrack && songs.length > 0) { setCurrentTrack(songs[0]); setIsPlaying(true); return; }
    setIsPlaying((p) => !p);
  };
  const nextTrack = useCallback(() => {
    if (songs.length === 0) return;
    if (isShuffle) { playTrack(songs[Math.floor(Math.random() * songs.length)]); return; }
    if (!currentTrack) { playTrack(songs[0]); return; }
    const idx = songs.findIndex((s) => s.id === currentTrack.id);
    playTrack(songs[(idx + 1) % songs.length]);
  }, [songs, currentTrack, isShuffle]);
  const prevTrack = useCallback(() => {
    if (songs.length === 0) return;
    if (!currentTrack) { playTrack(songs[0]); return; }
    const idx = songs.findIndex((s) => s.id === currentTrack.id);
    playTrack(songs[(idx - 1 + songs.length) % songs.length]);
  }, [songs, currentTrack]);
  const seekTo = (pct: number) => {
    const a = audioRef.current;
    if (!a || !duration) return;
    a.currentTime = pct * duration;
  };
  const setVolume = (v: number) => { setVolumeState(v); if (v > 0) setIsMuted(false); };
  const toggleMute = () => setIsMuted((m) => !m);
  const toggleRepeat = () => setIsRepeat((r) => !r);
  const toggleShuffle = () => setIsShuffle((s) => !s);

  const isAdmin = currentUser?.rank === "admin";
  const isOwner = currentUser?.rank === "owner" || currentUser?.id === "m_abd1";

  useEffect(() => {
    document.documentElement.dataset.theme = settings.themeMode;
    document.documentElement.style.setProperty("--brand", settings.primaryColor);
  }, [settings]);

  const value = useMemo<AppContextValue>(
    () => ({
      currentUser, isGuest, login, logout, enterGuest, changePassword,
      members, updateMember, addMember, deleteMember, banMember,
      songs, addSong, deleteSong, reactSong, incrementViews,
      messages, sendMessage, deleteMessage,
      settings, setPrimaryColor, setThemeMode,
      currentTrack, isPlaying, playTrack, togglePlay, nextTrack, prevTrack,
      seekTo, progress, duration, volume, setVolume, isMuted, toggleMute,
      isRepeat, toggleRepeat, isShuffle, toggleShuffle,
      analyser: analyserRef.current,
      isAdmin, isOwner, firebaseConnected, pwaPrompt, setPwaPrompt,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser, isGuest, members, songs, messages, settings, currentTrack, isPlaying, progress, duration, volume, isMuted, isRepeat, isShuffle, isAdmin, isOwner, firebaseConnected, pwaPrompt]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
};
