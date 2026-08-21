import { Toaster } from "@/components/ui/sonner";
import { RequireAuth } from "@/components/RequireAuth";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { setSpeechClient } from "@/lib/speech";
import React, { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";

// Lazy load route components for better code splitting
const Landing = lazy(() => import("./pages/Landing.tsx"));
const AuthPage = lazy(() => import("./pages/Auth.tsx"));
const GameHub = lazy(() => import("./pages/GameHub.tsx"));
const ModulePage = lazy(() => import("./pages/ModulePage.tsx"));
const SightWords = lazy(() => import("./pages/SightWords.tsx"));
const ReadingMilestones = lazy(() => import("./pages/ReadingMilestones.tsx"));
const HowToTeach = lazy(() => import("./pages/HowToTeach.tsx"));
const FirstWordsOrder = lazy(() => import("./pages/FirstWordsOrder.tsx"));
const Privacy = lazy(() => import("./pages/Privacy.tsx"));
const Terms = lazy(() => import("./pages/Terms.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

// Simple loading fallback for route transitions
function RouteLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Loading...</div>
    </div>
  );
}

/** Hard guard so runtime errors never leave the app as a blank page. */
class RootErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; message: string; stack: string }
> {
  state = { hasError: false, message: "", stack: "" };
  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      message: error.message || "Unknown runtime error",
      stack: error.stack || "",
    };
  }
  componentDidCatch(err: Error) {
    console.error("App runtime error:", err);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
          <div className="max-w-lg text-center">
            <p className="text-sm font-semibold">Something went wrong</p>
            <p className="mt-2 text-xs text-muted-foreground break-words">
              {this.state.message}
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const convexUrl = (import.meta.env.VITE_CONVEX_URL as string | undefined)?.replace(
  /\/+$/,
  "",
);

/** Friendly screen when the app is opened before the backend is configured. */
function BackendMissing() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="max-w-md text-center">
        <h1 className="font-bold text-2xl">Read with Rex</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          This app isn&apos;t fully set up yet. Please try again later.
        </p>
      </div>
    </div>
  );
}

function App() {
  if (!convexUrl) return <BackendMissing />;
  const convex = new ConvexReactClient(convexUrl);
  // Give the speech helpers the Convex client so they can fetch the cached
  // cartoon TTS audio for words and phrases (with browser speech as fallback).
  setSpeechClient(convex);

  return (
    <ConvexAuthProvider client={convex}>
      <BrowserRouter>
        <Suspense fallback={<RouteLoading />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/sight-words" element={<SightWords />} />
            <Route path="/reading-milestones" element={<ReadingMilestones />} />
            <Route
              path="/how-to-teach-a-5-year-old-to-read"
              element={<HowToTeach />}
            />
            <Route path="/first-words-order" element={<FirstWordsOrder />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route
              path="/auth"
              element={<AuthPage redirectAfterAuth="/game" />}
            />
            <Route
              path="/game"
              element={
                <RequireAuth>
                  <GameHub />
                </RequireAuth>
              }
            />
            <Route
              path="/game/:module"
              element={
                <RequireAuth>
                  <ModulePage />
                </RequireAuth>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <Toaster />
    </ConvexAuthProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  </StrictMode>,
);
