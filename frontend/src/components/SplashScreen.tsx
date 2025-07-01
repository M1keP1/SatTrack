import { useEffect, useState } from "react";

export default function SplashScreen() {
  const fullText = "Initializing orbital systems...";
  const [text, setText] = useState("");
  const [, setShowCaret] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, index + 1));
      index++;
      if (index === fullText.length) {
        clearInterval(interval);
        setShowCaret(true);
      }
    }, 60);

    // Detect mobile device
    const mobile = /iPhone|Android|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent);
    setIsMobile(mobile);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-xl flex items-center justify-center flex-col text-white font-mono">
      <div className="flex flex-col items-center">
        {/* Logo + Ping */}
        <div className="relative mb-3 flex items-center gap-3 text-4xl select-none">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <span className="absolute w-24 h-24 rounded-full bg-teal-400/10 animate-ping" />
            <span className="relative z-10 text-3xl animate-pulse">🛰️</span>
          </div>
          <span>
            SatTrack<span className="text-base align-super">™</span>
          </span>
        </div>

        {/* Status text */}
        <div className="text-sm tracking-wide flex items-center justify-center text-center">
          <span>{text}</span>
          <span className="ml-1 animate-pulse">|</span>
        </div>

        {/* Mobile disclaimer */}
        {isMobile && (
          <div className="mt-4 text-xs text-yellow-400 italic text-center max-w-xs">
            ⚠️ Mobile support coming soon. For the full experience, please use a desktop.
          </div>
        )}
      </div>
    </div>
  );
}
