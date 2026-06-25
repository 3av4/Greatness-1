import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Crown, Sparkles, Search, MapPin, Hash, Camera, ExternalLink } from "lucide-react";
import { useApp } from "../AppContext";
import { RANK_GRADIENTS, RANK_LABELS, Member } from "../seedData";

const GREATNESS_LOGO = "https://files.catbox.moe/73bl04.png";

export default function Home() {
  const { members, currentUser, isGuest, updateMember } = useApp();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "admins">("all");
  const [editId, setEditId] = useState<string | null>(null);

  const ORDER_MAP: Record<string, number> = {
    m_abd1: 0, m_hassan: 1, m_abd2: 2, m_touna: 3,
    m_khrya: 4, m_hamdi: 5, m_debbag: 6, m_linso: 7,
  };

  const visible = useMemo(() => {
    let list = members.filter((m) => !m.isBanned);
    if (filter === "admins") list = list.filter((m) => m.rank === "admin" || m.rank === "owner");
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((m) => m.handle.toLowerCase().includes(q) || m.name.toLowerCase().includes(q));
    }
    list.sort((a, b) => (ORDER_MAP[a.id] ?? 99) - (ORDER_MAP[b.id] ?? 99));
    return list;
  }, [members, search, filter]);

  return (
    <div className="min-h-screen" style={{ transform: "translateZ(0)", WebkitTransform: "translateZ(0)", touchAction: "pan-y" }}>
      {/* Hero */}
      <section className="relative min-h-[75vh] flex items-center justify-center px-4 py-10">
        <div className="relative z-10 w-full max-w-5xl mx-auto" style={{ transform: "translateZ(0)", WebkitTransform: "translateZ(0)" }}>
          <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-10">
            {/* Text */}
            <div className="text-center lg:text-right flex-1 order-2 lg:order-1">
              <motion.div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-4"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                <Sparkles className="w-3.5 h-3.5 text-[var(--gold)]" />
                <span className="text-xs font-semibold">نخبة العظمة</span>
              </motion.div>

              <motion.h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-display leading-[1.15] mb-4"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.6 }}>
                <span className="text-shimmer">أشخاص اختاروا</span>
                <br />
                <span className="inline-block mt-1"
                  style={{ background: "linear-gradient(135deg, #fff 0%, #f5c542 50%, #B1121A 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  أن يكونوا عظماء
                </span>
              </motion.h1>

              <motion.p className="text-sm md:text-base text-muted mb-5 max-w-md mx-auto lg:mr-0 lg:ml-auto"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                مجموعة استثنائية من الأفراد الذين يرفضون المتوسط ويسعون دائماً للقمة
              </motion.p>

              <motion.div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs"
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                <div className="flex items-center gap-1.5 glass rounded-full px-3 py-1.5 border border-[var(--border)]">
                  <Crown className="w-3.5 h-3.5 text-[var(--gold)]" />
                  <span className="font-black">8</span>
                  <span className="text-muted">أعضاء</span>
                </div>
                <div className="flex items-center gap-1.5 glass rounded-full px-3 py-1.5 border border-[var(--border)]">
                  <span className="text-[var(--gold)] text-base leading-none">∞</span>
                </div>
                <div className="flex items-center gap-1.5 glass rounded-full px-3 py-1.5 border border-[var(--border)]">
                  <MapPin className="w-3.5 h-3.5 text-[var(--brand)]" />
                  <span className="text-muted">مكان واحد</span>
                </div>
              </motion.div>
            </div>

            {/* Logo */}
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.7 }}
              className="relative order-1 lg:order-2 flex justify-center flex-shrink-0"
              style={{ transform: "translateZ(0)", WebkitTransform: "translateZ(0)" }}>
              <div className="relative w-[180px] h-[180px] sm:w-[240px] sm:h-[240px] md:w-[300px] md:h-[300px]">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[var(--brand)]/15 to-transparent" />
                <motion.img
                  src={GREATNESS_LOGO}
                  alt="شعار العظمة"
                  className="relative w-full h-full object-contain select-none"
                  style={{ filter: "drop-shadow(0 16px 32px rgba(0,0,0,0.5))", transform: "translateZ(0)", WebkitTransform: "translateZ(0)" }}
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Members */}
      <section className="py-8 px-3 md:px-5">
        <div className="max-w-6xl mx-auto" style={{ transform: "translateZ(0)", WebkitTransform: "translateZ(0)" }}>
          <div className="flex flex-col sm:flex-row gap-3 mb-6 items-start sm:items-center justify-between">
            <div>
              <h2 className="text-2xl md:text-3xl font-black font-display mb-1">
                <span className="text-shimmer">أعضاء العظمة</span>
              </h2>
              <p className="text-xs text-muted">اختر ملهمك من بين النخبة</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-48">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-3)]" />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="ابحث..." className="input pr-9 text-sm py-2" />
              </div>
              <select value={filter} onChange={(e) => setFilter(e.target.value as any)}
                className="input cursor-pointer text-sm py-2">
                <option value="all">الكل</option>
                <option value="admins">القادة</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {visible.map((m, i) => (
              <MemberCard key={m.id} member={m} index={i}
                canEdit={currentUser?.id === m.id && !isGuest}
                onEdit={() => setEditId(m.id)} editing={editId === m.id}
                onCloseEdit={() => setEditId(null)}
                onUpdate={(patch) => updateMember(m.id, patch)} />
            ))}
          </div>

          {visible.length === 0 && (
            <div className="text-center py-10 text-muted">
              <p>لا توجد نتائج</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

const FRAME_STYLES: Record<string, React.CSSProperties> = {
  neon: {
    boxShadow: "0 0 20px rgba(138,43,226,0.5), 0 0 40px rgba(138,43,226,0.25), inset 0 0 20px rgba(138,43,226,0.1)",
    border: "2px solid rgba(138,43,226,0.6)",
  },
  gold: {
    boxShadow: "0 0 15px rgba(245,197,66,0.35)",
    border: "2px solid transparent",
    background: "linear-gradient(#0a0506, #0a0506) padding-box, linear-gradient(135deg, #FFD700, #FFA500, #FF8C00) border-box",
  },
  corner: {
    border: "none",
    position: "relative" as const,
  },
  double: {
    outline: "3px solid rgba(16,185,129,0.6)",
    outlineOffset: "2px",
    border: "2px solid rgba(16,185,129,0.3)",
    boxShadow: "0 0 15px rgba(16,185,129,0.2)",
  },
  segmented: {
    border: "2px dashed rgba(99,102,241,0.5)",
    position: "relative" as const,
  },
};

function MemberCard({ member, index, canEdit, editing, onEdit, onCloseEdit, onUpdate }: {
  member: Member; index: number; canEdit: boolean; editing: boolean;
  onEdit: () => void; onCloseEdit: () => void;
  onUpdate: (p: Partial<Member>) => void;
}) {
  const rankGrad = RANK_GRADIENTS[member.rank] || RANK_GRADIENTS.member;
  const isSupreme = member.id === "m_abd1";
  const frame = member.frameStyle || "neon";

  // Header background: bannerUrl or cardColor gradient
  const headerBg = member.bannerUrl
    ? {
        backgroundImage: `url(${member.bannerUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }
    : {
        background: isSupreme
          ? "linear-gradient(145deg, rgba(86,6,13,0.96), rgba(8,2,3,1))"
          : `linear-gradient(135deg, ${member.cardColor || "#1a0b0e"}, #0a0506)`,
      };

  // Info section background: always solid, independent
  const infoBg = "linear-gradient(180deg, rgba(15,7,9,0.98), rgba(8,4,5,1))";

  const frameStyle = FRAME_STYLES[frame] || FRAME_STYLES.neon;

  return (
    <div className="relative p-[3px] rounded-xl" style={{ transform: "translateZ(0)", WebkitTransform: "translateZ(0)" }}>
      {/* Corner accent pseudo-elements */}
      {frame === "corner" && (
        <>
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#FF69B4] rounded-tl-lg z-10" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#FF69B4] rounded-tr-lg z-10" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#FF69B4] rounded-bl-lg z-10" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#FF69B4] rounded-br-lg z-10" />
        </>
      )}
      {/* Segmented corner dots */}
      {frame === "segmented" && (
        <>
          <div className="absolute top-1.5 left-1.5 w-2 h-2 rounded-full bg-[#6366f1] z-10" />
          <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#6366f1] z-10" />
          <div className="absolute bottom-1.5 left-1.5 w-2 h-2 rounded-full bg-[#6366f1] z-10" />
          <div className="absolute bottom-1.5 right-1.5 w-2 h-2 rounded-full bg-[#6366f1] z-10" />
        </>
      )}
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      data-glow={member.borderColor ? "1" : undefined}
      className={`member-card rounded-xl overflow-hidden ${isSupreme ? "ring-1 ring-[#f5c542]/25" : ""}`}
      style={{ transform: "translateZ(0)", WebkitTransform: "translateZ(0)", ...frameStyle }}
    >
      {/* ===== HEADER SECTION (Image + Background only) ===== */}
      <div
        className="relative aspect-[3/4] overflow-hidden"
        style={{ ...headerBg, transform: "translateZ(0)", WebkitTransform: "translateZ(0)" }}
      >
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

        {/* Character image - centered */}
        <img
          src={member.imageUrl}
          alt={member.handle}
          className="absolute inset-0 w-full h-full object-contain z-10"
          style={{ padding: "10% 5%", filter: "drop-shadow(0 8px 16px rgba(0,0,0,0.6))" }}
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://via.placeholder.com/400x500/0a0506/fff?text=" + encodeURIComponent(member.handle);
          }}
        />

        {/* Rank badge */}
        <div
          className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-md text-[10px] font-black text-white z-20"
          style={{ background: rankGrad, transform: "translateZ(0)", WebkitTransform: "translateZ(0)" }}
        >
          {RANK_LABELS[member.rank]}
        </div>

        {/* Banned badge */}
        {member.isBanned && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60">
            <div className="px-4 py-2 rounded-xl border-2 border-red-500 bg-red-500/20 backdrop-blur-sm">
              <span className="text-red-400 font-black text-lg tracking-wider">محظور</span>
            </div>
          </div>
        )}

        {/* Emblems */}
        {member.emblems && member.emblems.length > 0 && (
          <div className="absolute top-2.5 left-2.5 flex gap-1 z-20">
            {member.emblems.map((e, i) => (
              <span key={i} className="text-xl drop-shadow-lg">{e}</span>
            ))}
          </div>
        )}

        {/* Name overlay at bottom of header */}
        <div className="absolute bottom-0 left-0 right-0 p-3 z-20">
          <h3 className="text-xl font-black font-display drop-shadow-lg" style={{ color: member.nameColor || "#fff" }}>{member.handle}</h3>
          <p className="text-[11px] text-white/80">{member.name}</p>
        </div>

        {isSupreme && (
          <div className="absolute bottom-14 right-2.5 glass rounded-full px-2.5 py-0.5 text-[9px] font-black text-[var(--gold)] border border-[rgba(245,197,66,0.25)] z-20">
            روح وقلب العظمة
          </div>
        )}
      </div>

      {/* ===== INFO SECTION (Independent background) ===== */}
      <div className="p-3 space-y-2.5" style={{ background: infoBg }}>
        {/* Motto */}
        <p className="text-xs italic text-center text-[var(--gold)] rounded-lg p-2.5 border-r-4 border-[var(--brand)]"
          style={{ background: "rgba(0,0,0,0.3)" }}>
          &ldquo;{member.motto}&rdquo;
        </p>

        {/* Details */}
        <div className="space-y-1.5 text-xs">
          {member.age && (
            <div className="flex items-center gap-1.5 text-muted">
              <Hash className="w-3.5 h-3.5 text-[var(--brand)]" />
              <span>{member.age} سنة</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-muted">
            <MapPin className="w-3.5 h-3.5 text-[var(--brand)]" />
            <span>{member.country}</span>
          </div>
          <a href={`https://instagram.com/${member.instagram}`} target="_blank" rel="noreferrer"
            className="flex items-center gap-1.5 text-muted hover:text-[var(--brand)] transition">
            <Camera className="w-3.5 h-3.5" />
            <span className="truncate">@{member.instagram}</span>
          </a>
        </div>

        {/* Customize button */}
        {canEdit && (
          <button onClick={onEdit}
            className="w-full btn-ghost py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> تخصيص
          </button>
        )}
      </div>

      {/* ===== EDIT PANEL ===== */}
      {editing && canEdit && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="border-t border-[var(--border)] p-3 space-y-2.5"
          style={{ background: "rgba(5,3,4,0.98)", transform: "translateZ(0)", WebkitTransform: "translateZ(0)" }}
        >
          <div>
            <label className="text-[10px] text-muted mb-1 block">لون الاسم</label>
            <input type="color" value={member.nameColor || "#ffffff"}
              onChange={(e) => onUpdate({ nameColor: e.target.value })}
              className="w-full h-9 rounded-lg cursor-pointer bg-transparent" />
          </div>
          <div>
            <label className="text-[10px] text-muted mb-1 block">الشعارات (2 كحد أقصى)</label>
            <div className="flex gap-2">
              <input type="text" value={member.emblems?.[0] || ""}
                onChange={(e) => {
                  const arr = [e.target.value, member.emblems?.[1] || ""].filter(Boolean);
                  onUpdate({ emblems: arr });
                }}
                placeholder="👑"
                maxLength={4}
                className="input text-xs py-1.5 flex-1 text-center" />
              <input type="text" value={member.emblems?.[1] || ""}
                onChange={(e) => {
                  const arr = [member.emblems?.[0] || "", e.target.value].filter(Boolean);
                  onUpdate({ emblems: arr });
                }}
                placeholder="⚡"
                maxLength={4}
                className="input text-xs py-1.5 flex-1 text-center" />
            </div>
          </div>
          <div>
            <label className="text-[10px] text-muted mb-1 block">شكل الإطار</label>
            <div className="grid grid-cols-5 gap-1.5">
              {[
                { key: "neon", label: "نيون", color: "#8A2BE2" },
                { key: "gold", label: "ذهبي", color: "#FFD700" },
                { key: "corner", label: "زوايا", color: "#FF69B4" },
                { key: "double", label: "مزدوج", color: "#10B981" },
                { key: "segmented", label: "مقطع", color: "#6366f1" },
              ].map((f) => (
                <button key={f.key} onClick={() => onUpdate({ frameStyle: f.key })}
                  className={`py-1.5 rounded-lg text-[9px] font-bold transition ${
                    (member.frameStyle || "neon") === f.key ? "ring-1 ring-white" : ""
                  }`}
                  style={{ background: `${f.color}22`, border: `1px solid ${f.color}55`, color: f.color }}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[10px] text-muted mb-1 block">لون الإطار</label>
            <input type="color" value={member.borderColor || "#ff0040"}
              onChange={(e) => onUpdate({ borderColor: e.target.value })}
              className="w-full h-9 rounded-lg cursor-pointer bg-transparent" />
          </div>
          <div>
            <label className="text-[10px] text-muted mb-1 block">لون خلفية الهيدر</label>
            <input type="color" value={member.cardColor || "#1a0b0e"}
              onChange={(e) => onUpdate({ cardColor: e.target.value })}
              className="w-full h-9 rounded-lg cursor-pointer bg-transparent" />
          </div>

          {/* Banner URL */}
          <div className="rounded-lg p-2.5"
            style={{ background: "rgba(177,18,26,0.08)", border: "1px solid rgba(177,18,26,0.15)" }}>
            <label className="text-[10px] text-muted mb-1 block">رابط خلفية الهيدر</label>
            <input type="text" value={member.bannerUrl || ""}
              onChange={(e) => onUpdate({ bannerUrl: e.target.value })}
              placeholder="https://files.catbox.moe/....png"
              className="input text-xs py-1.5 mb-1.5" />
            <p className="text-[9px] text-muted mb-1">ادخل إلى catbox.moe وارفع صورة، ثم انسخ الرابط</p>
            <a href="https://catbox.moe" target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-1 text-[10px] text-[var(--brand)] font-bold hover:underline">
              <ExternalLink className="w-2.5 h-2.5" /> فتح Catbox
            </a>
          </div>

          <button onClick={onCloseEdit} className="w-full btn-brand py-2 rounded-lg text-xs font-bold">حفظ</button>
        </motion.div>
      )}
    </motion.div>
    </div>
  );
}
