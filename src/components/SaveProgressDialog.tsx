import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuery } from "convex/react";
import { useAction } from "convex/react";
import { Loader2, Save, RotateCcw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

/**
 * COPPA-safe cross-device progress save/restore, driven by the PARENT.
 * The parent's email + a 4-digit code lock a snapshot of the child's
 * progress. The child never provides any personal information.
 */
export function SaveProgressDialog() {
  const saveProgress = useAction(api.savedProgress.saveProgress);
  const loadProgress = useAction(api.savedProgress.loadProgress);
  const linkStatus = useQuery(api.savedProgressCore.getLinkStatus);

  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(true);
  const [busy, setBusy] = useState<"save" | "load" | null>(null);

  const reset = () => {
    setPin("");
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (busy) return;
    setBusy("save");
    try {
      await saveProgress({ email, pin, subscribeNewsletter });
      toast.success("Progress saved! Restore it anytime with this email. 🦖");
      reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't save progress.");
    } finally {
      setBusy(null);
    }
  };

  const handleLoad = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (busy) return;
    setBusy("load");
    try {
      await loadProgress({ email, pin });
      toast.success("Progress restored! Welcome back. ⭐");
      reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't restore progress.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-[3px] border-ink bg-white px-3 py-2 text-sm font-bold shadow-none"
        >
          <Save className="size-4" />
          Save progress
        </Button>
      </DialogTrigger>
      <DialogContent className="border-[3px] border-ink bg-white p-0 shadow-none sm:max-w-md">
        <DialogHeader className="border-b-[3px] border-ink bg-paper p-6 pb-4">
          <DialogTitle className="text-2xl font-bold tracking-tight">
            Save progress for grown-ups
          </DialogTitle>
          <DialogDescription className="text-sm font-medium text-muted-foreground">
            Save your child&apos;s stars and words to any email, then restore
            them on another phone or tablet. Free, forever.
          </DialogDescription>
          {linkStatus?.linkedEmail && (
            <p className="mt-2 border-[3px] border-ink bg-sun px-3 py-2 text-sm font-bold">
              This device is linked to {linkStatus.linkedEmail}
            </p>
          )}
        </DialogHeader>

        <div className="p-6">
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <Label htmlFor="save-email" className="text-sm font-bold">
                Your email
              </Label>
              <Input
                id="save-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1.5 h-11 border-[3px] border-ink bg-white text-base font-medium shadow-none focus-visible:ring-ink"
              />
            </div>
            <div>
              <Label htmlFor="save-pin" className="text-sm font-bold">
                4-digit code
              </Label>
              <Input
                id="save-pin"
                type="text"
                inputMode="numeric"
                pattern="\d{4}"
                maxLength={4}
                required
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                placeholder="e.g. 1234"
                className="mt-1.5 h-11 border-[3px] border-ink bg-white text-lg font-bold tracking-widest shadow-none focus-visible:ring-ink"
              />
            </div>
            <label className="flex cursor-pointer items-start gap-3">
              <Checkbox
                checked={subscribeNewsletter}
                onCheckedChange={(v) => setSubscribeNewsletter(v === true)}
                className="mt-0.5 size-5 rounded-none border-[3px] border-ink data-[state=checked]:bg-sun data-[state=checked]:text-ink"
              />
              <span className="text-sm font-medium leading-snug text-muted-foreground">
                Also send me the free sight-word flashcards and a short weekly
                reading game. Unsubscribe anytime.
              </span>
            </label>
            <Button
              type="submit"
              disabled={busy !== null}
              className="h-12 w-full border-[3px] border-ink bg-grass px-6 text-base font-bold text-white shadow-[4px_4px_0_0_#141414] hover:bg-grass hover:-translate-y-[1px] hover:shadow-[6px_6px_0_0_#141414] transition-all"
            >
              {busy === "save" ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <>
                  <Save className="size-5" /> Save progress
                </>
              )}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-[3px] border-ink/15" />
            </div>
            <div className="relative flex justify-center text-xs font-bold uppercase">
              <span className="bg-white px-2 text-muted-foreground">
                On a new device?
              </span>
            </div>
          </div>

          <form onSubmit={handleLoad} className="space-y-4">
            <div>
              <Label htmlFor="load-email" className="text-sm font-bold">
                The email you saved with
              </Label>
              <Input
                id="load-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1.5 h-11 border-[3px] border-ink bg-white text-base font-medium shadow-none focus-visible:ring-ink"
              />
            </div>
            <div>
              <Label htmlFor="load-pin" className="text-sm font-bold">
                4-digit code
              </Label>
              <Input
                id="load-pin"
                type="text"
                inputMode="numeric"
                pattern="\d{4}"
                maxLength={4}
                required
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                placeholder="e.g. 1234"
                className="mt-1.5 h-11 border-[3px] border-ink bg-white text-lg font-bold tracking-widest shadow-none focus-visible:ring-ink"
              />
            </div>
            <Button
              type="submit"
              disabled={busy !== null}
              className="h-12 w-full border-[3px] border-ink bg-sky px-6 text-base font-bold text-white shadow-[4px_4px_0_0_#141414] hover:bg-sky hover:-translate-y-[1px] hover:shadow-[6px_6px_0_0_#141414] transition-all"
            >
              {busy === "load" ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <>
                  <RotateCcw className="size-5" /> Restore on this device
                </>
              )}
            </Button>
          </form>

          <p className="mt-4 text-center text-xs font-semibold text-muted-foreground">
            Grown-ups only, please. We never ask children for information, and
            the game has no ads, ever.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
