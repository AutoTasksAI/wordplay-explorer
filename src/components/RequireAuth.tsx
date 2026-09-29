import { useAuth } from "@/hooks/use-auth";
import { useLoadingTimeout } from "@/hooks/use-loading-timeout";
import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { Link, Navigate, useLocation } from "react-router";

export function RequireAuth({ children }: { children: ReactNode }) {
  const { isLoading, isAuthenticated } = useAuth();
  const location = useLocation();
  const authTimedOut = useLoadingTimeout(isLoading ? undefined : false, 10000);

  if (isLoading) {
    return (
      <main className="kid-ui flex min-h-screen flex-col bg-paper">
        <header className="flex items-center justify-between border-b-[3px] border-ink px-4 py-3">
          <span className="text-xl font-bold">Read with Rex</span>
          <Link to="/" className="nb-btn bg-white px-3 py-2 text-sm font-semibold">
            Home
          </Link>
        </header>
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
          <p className="text-sm font-medium text-muted-foreground">
            Getting ready…
          </p>
          {authTimedOut && (
            <div className="flex flex-col items-center gap-2 text-center">
              <p className="text-sm font-semibold">This is taking a while.</p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="nb-btn bg-sun px-4 py-2 text-sm font-bold touch-manipulation"
              >
                Try again
              </button>
              <Link to="/" className="text-sm font-semibold underline">
                Back to home
              </Link>
            </div>
          )}
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    const returnTo = `${location.pathname}${location.search}`;
    return (
      <Navigate
        to={`/auth?returnTo=${encodeURIComponent(returnTo)}`}
        replace
      />
    );
  }

  return children;
}
