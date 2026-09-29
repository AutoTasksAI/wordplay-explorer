import { useEffect } from "react";

/** Radix dialogs sometimes leave body scroll-lock / pointer-events on iOS PWA. */
export function useClearStuckOverlays() {
  useEffect(() => {
    const clear = () => {
      document.body.style.pointerEvents = "";
      document.body.style.overflow = "";
      document.body.removeAttribute("data-scroll-locked");
    };
    clear();
    window.addEventListener("focus", clear);
    document.addEventListener("visibilitychange", clear);
    return () => {
      window.removeEventListener("focus", clear);
      document.removeEventListener("visibilitychange", clear);
    };
  }, []);
}
