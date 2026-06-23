import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AppProvider, useApp } from "./AppContext";
import Login from "./components/Login";
import Home from "./components/Home";
import Chat from "./components/Chat";
import MusicHub from "./components/MusicHub";
import { Settings, AdminPanel, Links } from "./components/UI";
import NavBar from "./components/NavBar";
import { Download, X, Smartphone } from "lucide-react";

type Screen = "home" | "chat" | "music" | "settings" | "admin" | "links" | "login";

function Shell() {
  const { currentUser, isGuest } = useApp();
  const [screen, setScreen] = useState<Screen>("home");
  const [showPwaBanner, setShowPwaBanner] = useState(false);
  const [pwaPrompt, setPwaPrompt] = useState<any>(null);
  const [pwaInstalled, setPwaInstalled] = useState(false);

  // PWA install prompt handling
  useEffect(() => {
    const beforeInstall = (e: Event) => {
      e.preventDefault();
      setPwaPrompt(e);
      const dismissed = localStorage.getItem("greatness:pwa-dismissed");
      if (!dismissed) {
        setTimeout(() => setShowPwaBanner(true), 2000);
      }
    };

    const onInstalled = () => {
      setPwaInstalled(true);
      setShowPwaBanner(false);
      setPwaPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", beforeInstall);
    window.addEventListener("appinstalled", onInstalled);

    // Check if already installed
    if ((window.matchMedia("(display-mode: standalone)").matches) ||
        ((window.navigator as any).standalone === true)) {
      setPwaInstalled(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", beforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const showLogin = screen === "login" || (!currentUser && !isGuest);

  const handleNav = (s: Screen) => {
    if (s === "admin" && !currentUser) { setScreen("login"); return; }
    setScreen(s);
  };

  const dismissPwa = () => {
    setShowPwaBanner(false);
    localStorage.setItem("greatness:pwa-dismissed", "1");
  };

  const installPWA = async () => {
    if (pwaPrompt) {
      pwaPrompt.prompt();
      const { outcome } = await pwaPrompt.userChoice;
      if (outcome === "accepted") {
        setPwaInstalled(true);
        setShowPwaBanner(false);
        setPwaPrompt(null);
      }
    } else {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIOS) {
        alert("لتثبيت الموقع على iPhone:\n\n1. اضغط زر المشاركة (Share)\n2. اختر 'إضافة إلى الشاشة الرئيسية'");
      } else {
        alert("لتثبيت الموقع:\n\n• Chrome: القائمة ⋮ → تثبيت التطبيق\n• Edge: القائمة ⋮ → التطبيقات → تثبيت");
      }
    }
  };

  return (
    <div className="min-h-screen pb-20"
      style={{ transform: "translateZ(0)", WebkitTransform: "translateZ(0)" }}>

      {/* PWA Install Banner */}
      <AnimatePresence>
        {showPwaBanner && !pwaInstalled && (
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="fixed top-14 left-2 right-2 z-50 glass-strong rounded-xl p-3 shadow-2xl"
            style={{ border: "1px solid rgba(177,18,26,0.2)", transform: "translateZ(0)", WebkitTransform: "translateZ(0)" }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl btn-brand flex items-center justify-center flex-shrink-0">
                <Smartphone className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold">ثبّت موقع العظمة!</h3>
                <p className="text-[10px] text-muted">وصول سريع بدون متصفح</p>
              </div>
              <button onClick={installPWA} className="btn-brand px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1 flex-shrink-0">
                <Download className="w-3 h-3" /> تثبيت
              </button>
              <button onClick={dismissPwa} className="w-7 h-7 rounded-lg btn-ghost flex items-center justify-center flex-shrink-0">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showLogin ? (
        <Login />
      ) : (
        <>
          <NavBar screen={screen} onNav={handleNav} />
          <main>
            <AnimatePresence mode="wait">
              <motion.div
                key={screen}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                {screen === "home" && <Home />}
                {screen === "chat" && <Chat />}
                {screen === "music" && <MusicHub />}
                {screen === "settings" && <Settings />}
                {screen === "admin" && <AdminPanel />}
                {screen === "links" && <Links />}
              </motion.div>
            </AnimatePresence>
          </main>
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}
