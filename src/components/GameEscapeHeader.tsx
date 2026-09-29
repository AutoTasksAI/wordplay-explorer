import { useAuth } from "@/hooks/use-auth";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router";

/** Top bar with Bye — shown even while game data is still loading. */
export function GameEscapeHeader() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="flex items-center justify-between border-b-[3px] border-ink px-4 py-3 sm:px-6">
      <div className="flex items-center gap-2">
        <span className="flex size-9 items-center justify-center border-[3px] border-ink bg-sun text-base leading-none shadow-[3px_3px_0_0_#141414]">
          🦖
        </span>
        <span className="text-xl font-bold tracking-tight">Read with Rex</span>
      </div>
      <button
        type="button"
        onClick={() => void handleSignOut()}
        className="nb-btn flex items-center gap-1.5 bg-white px-3 py-2 text-sm font-semibold touch-manipulation"
      >
        <LogOut className="size-4" />
        <span>Bye!</span>
      </button>
    </header>
  );
}
