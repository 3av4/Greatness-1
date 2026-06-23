import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageCircle, Crown, Sparkles, Trash2, Shield, Filter } from "lucide-react";
import { useApp } from "../AppContext";

export default function Chat() {
  const { messages, sendMessage, deleteMessage, currentUser, isGuest, isAdmin } = useApp();
  const [text, setText] = useState("");
  const [filterUser, setFilterUser] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const send = () => {
    if (!text.trim() || isGuest || !currentUser) return;
    sendMessage(text);
    setText("");
  };

  const filteredMessages = filterUser
    ? messages.filter((m) => m.memberId === filterUser)
    : messages;

  const uniqueUsers = Array.from(new Map(messages.map((m) => [m.memberId, m])).values());

  return (
    <div className="min-h-screen p-3 md:p-5 flex flex-col" style={{ touchAction: "pan-y" }}>
      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-t-2xl p-3 md:p-4 flex items-center gap-3">
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center btn-brand">
            <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
          </div>
          <div className="flex-1">
            <h2 className="text-base md:text-lg font-black font-display">شات العظمة</h2>
            <p className="text-[10px] text-muted flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {messages.length} رسالة
            </p>
          </div>
          {isAdmin && (
            <div className="flex items-center gap-1 glass rounded-full px-2 py-1">
              <Shield className="w-3 h-3 text-[var(--gold)]" />
              <span className="text-[9px] font-bold text-[var(--gold)]">Admin</span>
            </div>
          )}
        </motion.div>

        {/* Filter bar for admin */}
        {isAdmin && uniqueUsers.length > 0 && (
          <div className="bg-black/30 border-x border-[var(--border)] px-3 py-2 flex items-center gap-2 overflow-x-auto">
            <Filter className="w-3 h-3 text-[var(--text-3)] flex-shrink-0" />
            <button onClick={() => setFilterUser(null)}
              className={`text-[10px] px-2 py-1 rounded-full transition flex-shrink-0 ${!filterUser ? "bg-[var(--brand)]/20 text-[var(--brand)]" : "text-muted hover:text-white"}`}>
              الكل
            </button>
            {uniqueUsers.map((u) => (
              <button key={u.memberId} onClick={() => setFilterUser(u.memberId)}
                className={`text-[10px] px-2 py-1 rounded-full transition flex-shrink-0 ${filterUser === u.memberId ? "bg-[var(--brand)]/20 text-[var(--brand)]" : "text-muted hover:text-white"}`}>
                {u.memberName}
              </button>
            ))}
          </div>
        )}

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto bg-black/20 border-x border-[var(--border)] p-3 space-y-2.5 min-h-[250px]"
          style={{ maxHeight: "calc(100vh - 200px)" }}>
          {filteredMessages.length === 0 && (
            <div className="text-center py-10">
              <Sparkles className="w-8 h-8 mx-auto text-[var(--text-3)] mb-2" />
              <p className="text-muted text-sm">ابدأ المحادثة ✨</p>
            </div>
          )}
          <AnimatePresence>
            {filteredMessages.map((m, i) => {
              const isMe = currentUser?.id === m.memberId;
              const isAdminMsg = m.memberId === "m_abd1";
              const canDelete = isMe || isAdmin;

              return (
                <motion.div key={m.id} initial={{ opacity: 0, y: 8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: i < 10 ? i * 0.01 : 0 }}
                  className={`flex gap-2 ${isMe ? "flex-row-reverse" : ""}`}>
                  <div className="relative flex-shrink-0">
                    <img src={m.memberAvatar} alt="" className="w-8 h-8 rounded-lg object-cover"
                      style={{ boxShadow: isAdminMsg ? "0 0 10px rgba(245,197,66,0.25)" : "none" }}
                      onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/40/0a0506/fff?text=M"; }} />
                    {isAdminMsg && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[var(--gold)] flex items-center justify-center">
                        <Crown className="w-2 h-2 text-black" />
                      </div>
                    )}
                  </div>
                  <div className={`max-w-[80%] ${isMe ? "items-end" : "items-start"} flex flex-col`}>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className={`text-[10px] font-bold ${isAdminMsg ? "text-[var(--gold)]" : isMe ? "text-[var(--brand)]" : "text-white/60"}`}>
                        {m.memberName}
                      </span>
                      <span className="text-[9px] text-dim">
                        {new Date(m.timestamp).toLocaleTimeString("ar", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      {canDelete && (
                        <button onClick={() => { if (confirm("حذف الرسالة؟")) deleteMessage(m.id); }}
                          className="text-red-400/50 hover:text-red-400 transition">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <div className={`glass rounded-xl px-3 py-2 text-xs ${isMe ? "bg-[var(--brand)]/10 border-[var(--brand)]/20" : ""}`}>
                      {m.message}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Input */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="glass-strong rounded-b-2xl p-2.5 md:p-3 flex gap-2">
          <input type="text" value={text} onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder={isGuest ? "سجل الدخول..." : "اكتب رسالتك..."}
            disabled={isGuest} className="input flex-1 text-sm py-2" />
          <button onClick={send} disabled={isGuest || !text.trim()}
            className="btn-brand px-3.5 rounded-xl font-bold flex items-center gap-1.5">
            <Send className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
