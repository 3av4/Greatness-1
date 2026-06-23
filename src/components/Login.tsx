import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, LogIn, User, Sparkles, AlertCircle, ArrowRight } from "lucide-react";
import { useApp } from "../AppContext";
import { RANK_GRADIENTS, RANK_LABELS } from "../seedData";

const GREATNESS_LOGO = "https://files.catbox.moe/73bl04.png";

export default function Login() {
  const { members, login, enterGuest } = useApp();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [notice, setNotice] = useState<{ msg: string; type: "ok" | "err" | "" }>({ msg: "", type: "" });

  const selected = members.find((m) => m.id === selectedId) || null;

  const submit = () => {
    if (!selected) { setNotice({ msg: "اختر عضواً", type: "err" }); return; }
    if (!password) { setNotice({ msg: "أدخل كلمة المرور", type: "err" }); return; }
    const r = login(selected.handle, password);
    if (r.ok) setNotice({ msg: r.msg, type: "ok" });
    else setNotice({ msg: r.msg, type: "err" });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4" style={{ touchAction: "pan-y" }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-strong rounded-2xl p-5 md:p-7 max-w-sm w-full shadow-2xl"
      >
        {/* Logo - direct URL */}
        <div className="text-center mb-5">
          <motion.div
            className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-3 overflow-hidden"
            style={{ background: "linear-gradient(135deg, #B1121A, #6b0710)", border: "1px solid rgba(245,197,66,0.2)" }}
            animate={{ rotate: [0, 1, -1, 0] }}
            transition={{ duration: 6, repeat: Infinity }}
          >
            <img src={GREATNESS_LOGO} alt="شعار العظمة" className="w-full h-full object-cover" />
          </motion.div>
          <h1 className="text-2xl font-black font-display text-shimmer">العظمة</h1>
          <p className="text-[11px] text-muted mt-1 flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-[var(--gold)]" />
            أشخاص اختاروا أن يكونوا عظماء
          </p>
        </div>

        <h2 className="text-sm font-bold mb-2 text-center">اختر عضوك</h2>

        {/* Members list */}
        <div className="max-h-52 overflow-y-auto mb-3 space-y-1 rounded-xl border border-[var(--border)] bg-black/20 p-2">
          {members.map((m) => {
            const active = m.id === selectedId;
            const grad = RANK_GRADIENTS[m.rank] || RANK_GRADIENTS.member;
            return (
              <motion.button
                key={m.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => { setSelectedId(m.id); setNotice({ msg: "", type: "" }); }}
                className={`w-full flex items-center gap-2.5 p-2 rounded-lg transition-all text-right ${
                  active ? "bg-white/10 ring-1 ring-[var(--brand)]" : "hover:bg-white/5"
                }`}
              >
                <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 relative" style={{ background: grad }}>
                  <img src={m.imageUrl} alt={m.handle} className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/80/0a0506/fff?text=" + encodeURIComponent(m.handle); }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm truncate">{m.handle}</div>
                  <div className="text-[10px] text-muted flex items-center gap-1.5">
                    <span>{m.name}</span>
                    <span className="text-[9px] px-1 py-0.5 rounded font-bold" style={{ background: grad, color: "#fff" }}>
                      {RANK_LABELS[m.rank]}
                    </span>
                  </div>
                </div>
                {active && <div className="w-4 h-4 rounded-full bg-[var(--brand)] flex items-center justify-center text-[9px]">✓</div>}
              </motion.button>
            );
          })}
        </div>

        {/* Password */}
        <div className="flex gap-2 mb-2.5">
          <div className="flex-1 relative">
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-3)]" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()} placeholder="كلمة المرور" className="input pr-9 text-sm" />
          </div>
          <button onClick={submit} className="btn-brand px-3.5 rounded-lg font-bold flex items-center gap-1 text-sm">
            <LogIn className="w-3.5 h-3.5" /> دخول
          </button>
        </div>

        {/* Guest */}
        <button onClick={enterGuest}
          className="w-full py-2 rounded-lg btn-ghost font-semibold flex items-center justify-center gap-2 text-sm">
          <User className="w-3.5 h-3.5" /> الدخول كزائر
          <ArrowRight className="w-3 h-3" />
        </button>

        {/* Notice */}
        <AnimatePresence>
          {notice.msg && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className={`mt-2.5 p-2 rounded-lg text-xs text-center flex items-center justify-center gap-1.5 ${
                notice.type === "ok" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/15"
                  : "bg-red-500/10 text-red-400 border border-red-500/15"
              }`}>
              <AlertCircle className="w-3 h-3" /> {notice.msg}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
