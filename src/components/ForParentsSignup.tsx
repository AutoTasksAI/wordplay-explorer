import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { useAction } from "convex/react";
import { motion } from "framer-motion";
import { Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

/**
 * Parent-facing email signup (COPPA-safe). This lives ONLY on the landing
 * page's "For Parents" section, never in the game, and never aimed at the
 * child. Parents who join get the free printable sight-word flashcards as a
 * lead magnet plus a monthly "3 reading games to play this week" email.
 */
export function ForParentsSignup() {
  const subscribeEmail = useAction(api.newsletter.subscribeEmail);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsLoading(true);
    try {
      const result = await subscribeEmail({ email });
      if (result.ok) {
        toast.success("You're in! Check your inbox for the flashcards. 🦖");
        setEmail("");
      } else {
        toast.error(result.error ?? "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Newsletter signup error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
      className="border-[3px] border-ink bg-white p-6 nb-shadow sm:p-8"
    >
      <div className="flex items-center gap-3">
        <span className="flex size-11 items-center justify-center border-[3px] border-ink bg-bubblegum text-2xl leading-none">
          🃏
        </span>
        <div>
          <h3 className="text-2xl font-bold tracking-tight">
            Free: your child&apos;s first 50 sight-word flashcards
          </h3>
          <p className="text-sm font-medium text-muted-foreground">
            Printable cards, plus a short email with three reading games to
            play each week. No spam, unsubscribe anytime.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-5 flex flex-col gap-3 sm:flex-row"
      >
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            aria-label="Email address"
            className="h-12 border-[3px] border-ink bg-white pl-10 text-base font-medium shadow-none focus-visible:ring-ink"
          />
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          className="h-12 shrink-0 border-[3px] border-ink bg-tomato px-6 text-base font-bold text-white shadow-[4px_4px_0_0_#141414] hover:bg-tomato hover:-translate-y-[1px] hover:shadow-[6px_6px_0_0_#141414] transition-all"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              Signing up...
            </>
          ) : (
            "Get the flashcards"
          )}
        </Button>
      </form>

      <p className="mt-3 text-xs font-semibold text-muted-foreground">
        For parents and caregivers only. We never ask children for information,
        and there are no ads in the game, ever.
      </p>
    </motion.div>
  );
}
