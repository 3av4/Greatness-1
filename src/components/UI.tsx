import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Settings as SettingsIcon, Palette, Moon, Sun, Download,
  LogOut, Key, Shield, Trash2, Ban, Crown,
  Video, Newspaper, ExternalLink, Smartphone, CheckCircle2
} from "lucide-react";
import { useApp } from "../AppContext";

// ============================================================
// PWA Install Hook
// ============================================================
function usePWAInstall() {
  const [prompt, setPrompt] = useState<any>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const beforeInstall = (e: Event) => {
      e.preventDefault();
      setPrompt(e);
    };
    const onAppInstalled = () => {
      setInstalled(true);
      setPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", beforeInstall);
    window.addEventListener("appinstalled", onAppInstalled);

    // Check if already in standalone mode
    if ((window.matchMedia("(display-mode: standalone)").matches) ||
        ((window.navigator as any).standalone === true)) {
      setInstalled(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", beforeInstall);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  const install = async () => {
    if (!prompt) {
      // Show manual instructions for iOS or unsupported browsers
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIOS) {
        alert("لتثبيت الموقع على iPhone:\n\n1. اضغط زر المشاركة (Share)\n2. اختر 'إضافة إلى الشاشة الرئيسية'\n\n📱 سيتم تثبيته كتطبيق!");
      } else {
        alert("لتثبيت الموقع:\n\n• Chrome: القائمة ⋮ → تثبيت التطبيق\n• Edge: القائمة ⋮ → التطبيقات → تثبيت\n• Firefox: غير مدعوم حالياً");
      }
      return;
    }
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === "accepted") {
      setInstalled(true);
      setPrompt(null);
    }
  };

  return { prompt, installed, install };
}

// ============================================================
// Settings
// ============================================================
export function Settings() {
  const { currentUser, isGuest, logout, changePassword, settings, setPrimaryColor, setThemeMode } = useApp();
  const { installed, install } = usePWAInstall();
  const [oldP, setOldP] = useState("");
  const [newP, setNewP] = useState("");
  const [msg, setMsg] = useState("");

  const presets = [
    { name: "أحمر العظمة", color: "#B1121A" },
    { name: "ذهبي", color: "#F5C542" },
    { name: "بنفسجي", color: "#8A2BE2" },
    { name: "أزرق", color: "#1E90FF" },
    { name: "أخضر", color: "#10B981" },
    { name: "وردي", color: "#FF1493" },
  ];

  return (
    <div className="min-h-screen p-4 md:p-6" style={{ touchAction: "pan-y" }}>
      <div className="max-w-xl mx-auto space-y-4">
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="glass-strong rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-xl btn-brand flex items-center justify-center">
              <SettingsIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black font-display">الإعدادات</h1>
              <p className="text-[11px] text-muted">{isGuest ? "وضع الزائر" : currentUser?.handle}</p>
            </div>
          </div>

          {/* PWA Install Button */}
          <div className="mb-5">
            <h3 className="font-bold mb-2.5 text-sm flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-[var(--brand)]" /> تثبيت الموقع
            </h3>
            <button onClick={install}
              className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition ${
                installed
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 cursor-default"
                  : "btn-brand"
              }`}>
              {installed ? <CheckCircle2 className="w-4 h-4" /> : <Download className="w-4 h-4" />}
              {installed ? "✓ تم التثبيت" : "تثبيت التطبيق"}
            </button>
            <p className="text-[10px] text-muted mt-1.5 text-center">
              {installed
                ? "الموقع مثبت كتطبيق على جهازك"
                : "ثبّت الموقع للوصول السريع بدون متصفح"}
            </p>
          </div>

          {/* Theme */}
          <div className="mb-5">
            <h3 className="font-bold mb-2.5 text-sm flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-[var(--brand)]" /> الوضع
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setThemeMode("dark")}
                className={`p-3 rounded-xl border-2 transition flex items-center gap-2 ${settings.themeMode === "dark" ? "border-[var(--brand)] bg-[var(--brand)]/10" : "border-[var(--border)]"}`}>
                <Moon className="w-5 h-5" />
                <div className="text-right">
                  <div className="font-bold text-sm">داكن</div>
                  <div className="text-[10px] text-muted">Dark</div>
                </div>
              </button>
              <button onClick={() => setThemeMode("night")}
                className={`p-3 rounded-xl border-2 transition flex items-center gap-2 ${settings.themeMode === "night" ? "border-[var(--brand)] bg-[var(--brand)]/10" : "border-[var(--border)]"}`}>
                <Sun className="w-5 h-5" />
                <div className="text-right">
                  <div className="font-bold text-sm">ليلي</div>
                  <div className="text-[10px] text-muted">Night</div>
                </div>
              </button>
            </div>
          </div>

          {/* Color */}
          <div className="mb-5">
            <h3 className="font-bold mb-2.5 text-sm flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-[var(--brand)]" /> اللون
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-2">
              {presets.map((p) => (
                <button key={p.color} onClick={() => setPrimaryColor(p.color)}
                  className={`h-12 rounded-lg flex items-center justify-center transition border-2 ${settings.primaryColor === p.color ? "border-white scale-105" : "border-transparent"}`}
                  style={{ background: `linear-gradient(135deg, ${p.color}, ${p.color}88)` }}>
                  <span className="text-[9px] font-bold text-white drop-shadow">{p.name}</span>
                </button>
              ))}
            </div>
            <input type="color" value={settings.primaryColor} onChange={(e) => setPrimaryColor(e.target.value)}
              className="w-full h-10 rounded-lg cursor-pointer bg-transparent" />
          </div>

          {/* Password */}
          {!isGuest && (
            <div className="mb-5">
              <h3 className="font-bold mb-2.5 text-sm flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-[var(--brand)]" /> تغيير كلمة المرور
              </h3>
              <div className="space-y-2">
                <input type="password" value={oldP} onChange={(e) => setOldP(e.target.value)}
                  placeholder="الحالية" className="input text-sm py-2" />
                <input type="password" value={newP} onChange={(e) => setNewP(e.target.value)}
                  placeholder="الجديدة" className="input text-sm py-2" />
                <button onClick={() => {
                  const r = changePassword(oldP, newP); setMsg(r.msg);
                  if (r.ok) { setOldP(""); setNewP(""); }
                }} className="btn-brand w-full py-2.5 rounded-xl font-bold text-sm">تحديث</button>
                {msg && (
                  <p className={`text-xs text-center p-2 rounded-lg ${msg.includes("تم") ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                    {msg}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Logout */}
          {!isGuest && (
            <button onClick={logout}
              className="w-full py-2.5 rounded-xl font-bold bg-red-500/10 text-red-400 border border-red-500/25 flex items-center justify-center gap-2 hover:bg-red-500/20 transition text-sm">
              <LogOut className="w-4 h-4" /> خروج
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
}

// ============================================================
// Admin Panel
// ============================================================
export function AdminPanel() {
  const { members, currentUser, banMember, deleteMember, isOwner } = useApp();

  if (!isOwner) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-strong rounded-2xl p-8 text-center max-w-sm">
          <Shield className="w-12 h-12 mx-auto text-[var(--text-3)] mb-3" />
          <h2 className="text-xl font-black font-display mb-1">محظور</h2>
          <p className="text-muted text-sm">لـ Super Admin فقط</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6" style={{ touchAction: "pan-y" }}>
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-2xl p-5 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl btn-gold flex items-center justify-center">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black font-display">Super Admin</h1>
              <p className="text-[11px] text-muted">{currentUser?.name}</p>
            </div>
          </div>
        </motion.div>

        <div className="glass rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-black/40">
                <tr>
                  <th className="p-2.5 text-right">العضو</th>
                  <th className="p-2.5 text-right">الرتبة</th>
                  <th className="p-2.5 text-right">البلد</th>
                  <th className="p-2.5 text-right">الحالة</th>
                  <th className="p-2.5 text-right">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {members.map((m) => (
                  <tr key={m.id} className="border-t border-[var(--border)] hover:bg-white/5">
                    <td className="p-2.5">
                      <div className="flex items-center gap-2">
                        <img src={m.imageUrl} alt="" className="w-8 h-8 rounded-lg object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/40"; }} />
                        <div>
                          <div className="font-bold text-xs">{m.handle}</div>
                          <div className="text-[10px] text-muted">{m.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-2.5 text-muted">{m.rank}</td>
                    <td className="p-2.5 text-muted">{m.country}</td>
                    <td className="p-2.5">
                      {m.isBanned ? <span className="text-red-400 text-[10px] font-bold">محظور</span>
                        : <span className="text-emerald-400 text-[10px] font-bold">نشط</span>}
                    </td>
                    <td className="p-2.5">
                      <div className="flex gap-1">
                        <button onClick={() => banMember(m.id, !m.isBanned)}
                          className="w-7 h-7 rounded-md flex items-center justify-center bg-orange-500/20 text-orange-400 hover:bg-orange-500/30"
                          title={m.isBanned ? "إلغاء الحظر" : "حظر"}>
                          <Ban className="w-3 h-3" />
                        </button>
                        {m.id !== currentUser?.id && (
                          <button onClick={() => { if (confirm(`حذف ${m.handle}؟`)) deleteMember(m.id); }}
                            className="w-7 h-7 rounded-md flex items-center justify-center bg-red-500/20 text-red-400 hover:bg-red-500/30"
                            title="حذف">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Links
// ============================================================
export function Links() {
  const links = [
    { icon: Video, title: "ريلز عظمة", desc: "أقوى المقاطع", href: "https://instagram.com/", color: "linear-gradient(135deg, #E1306C, #833AB4)" },
    { icon: Video, title: "يوتيوب عظمة", desc: "القناة الرسمية", href: "https://youtube.com/", color: "linear-gradient(135deg, #FF0000, #CC0000)" },
    { icon: Newspaper, title: "صحيفة العظمة", desc: "آخر الأخبار", href: "#", color: "linear-gradient(135deg, #F5C542, #B1121A)" },
  ];

  return (
    <div className="min-h-screen p-4 md:p-6 flex items-center justify-center" style={{ touchAction: "pan-y" }}>
      <div className="max-w-sm w-full space-y-4">
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-3"
            style={{ background: "linear-gradient(135deg, #B1121A, #6b0710)" }}>
            <Crown className="w-10 h-10 text-[var(--gold)]" />
          </div>
          <h1 className="text-2xl font-black font-display text-shimmer">روابط العظمة</h1>
          <p className="text-xs text-muted mt-1">تواصل مع النخبة</p>
        </motion.div>

        {links.map((l, i) => (
          <motion.a key={l.title} href={l.href} target="_blank" rel="noreferrer"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.01, y: -2 }} whileTap={{ scale: 0.99 }}
            className="block glass rounded-2xl p-4 relative overflow-hidden group"
            style={{ transform: "translateZ(0)", WebkitTransform: "translateZ(0)" }}>
            <div className="absolute inset-0 opacity-15 group-hover:opacity-25 transition" style={{ background: l.color }} />
            <div className="relative flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: l.color }}>
                <l.icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-black">{l.title}</h3>
                <p className="text-[11px] text-muted">{l.desc}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-[var(--text-3)] group-hover:text-[var(--brand)] transition" />
            </div>
          </motion.a>
        ))}

        <p className="text-[10px] text-dim text-center pt-4">العظمة © {new Date().getFullYear()}</p>
      </div>
    </div>
  );
}
