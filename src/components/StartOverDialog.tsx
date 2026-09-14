import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { clearClientAppData } from "@/lib/clearAppData";
import { Loader2, RotateCcw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

/**
 * Parent-facing control to wipe this device's guest progress and start fresh.
 * Keeps the installed PWA on the home screen — no uninstall needed.
 */
export function StartOverDialog() {
  const { signIn, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleStartOver = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await signOut();
      await clearClientAppData();
      await signIn("anonymous");
      setOpen(false);
      toast.success("Fresh start! Have fun exploring. 🦖");
      window.location.assign("/game");
    } catch (err) {
      console.error("Start over error:", err);
      toast.error("Something went wrong. Please try again.");
      setBusy(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(next) => !busy && setOpen(next)}>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          className="border-[3px] border-ink bg-white px-3 py-2 text-sm font-bold shadow-none"
        >
          <RotateCcw className="size-4" />
          <span className="hidden sm:inline">Start over</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="border-[3px] border-ink bg-white shadow-none sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold tracking-tight">
            Start over on this device?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm font-medium text-muted-foreground">
            This clears stars, creature pals, and word progress saved on this
            phone or tablet. You stay signed in as a guest with a clean slate.
            Progress you saved with an email is not deleted — restore it anytime
            with Save progress.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-2">
          <AlertDialogCancel
            disabled={busy}
            className="border-[3px] border-ink bg-white font-bold shadow-none"
          >
            Keep my progress
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={busy}
            onClick={(event) => {
              event.preventDefault();
              void handleStartOver();
            }}
            className="border-[3px] border-ink bg-tomato font-bold text-white shadow-[4px_4px_0_0_#141414] hover:bg-tomato"
          >
            {busy ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Starting fresh...
              </>
            ) : (
              "Yes, start fresh"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
        <p className="text-center text-xs font-semibold text-muted-foreground">
          Grown-ups only, please. You do not need to delete the app from your
          home screen.
        </p>
      </AlertDialogContent>
    </AlertDialog>
  );
}
