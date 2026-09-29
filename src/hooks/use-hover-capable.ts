import * as React from "react";

const HOVER_CAPABLE_QUERY = "(hover: hover) and (pointer: fine)";

/** True when the primary input supports hover (typically desktop mouse/trackpad). */
export function useHoverCapable() {
  const [hoverCapable, setHoverCapable] = React.useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(HOVER_CAPABLE_QUERY).matches;
  });

  React.useEffect(() => {
    const mql = window.matchMedia(HOVER_CAPABLE_QUERY);
    const onChange = () => setHoverCapable(mql.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return hoverCapable;
}
