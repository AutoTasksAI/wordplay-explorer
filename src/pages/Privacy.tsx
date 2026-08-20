import { Link } from "react-router";

import { ContentLayout } from "@/components/ContentLayout";

const SECTIONS = [
  {
    title: "Kids play with zero data collection",
    body: "Children are never asked for a name, email, photo, or any personal information. Guest mode means your child starts playing in one tap, with no account, no sign-up, and no email. Nothing is collected from children inside the game.",
  },
  {
    title: "No ads, no tracking, no cookies",
    body: "There are no ads anywhere in the game and no third-party ad trackers. We don't build profiles, we don't sell data, and we don't run advertising cookies. Analytics (if enabled) use a privacy-friendly, cookie-free service that gives us simple visitor counts. We never track individual children.",
  },
  {
    title: "Parent emails are opt-in and parent-only",
    body: "The only time we ever receive an email address is when a grown-up chooses to subscribe on the 'For Parents' section or saves a child's progress with their own email. That email is used only for the newsletter you asked for and to restore saved progress. It is never used for anything else, and it is never connected to a child.",
  },
  {
    title: "Saving progress across devices",
    body: "The optional 'Save progress for grown-ups' feature stores a snapshot of the child's stars and words under the parent's email address, protected by a 4-digit code you choose. It exists so progress can move between devices. It can be removed at any time by contacting us.",
  },
  {
    title: "How to delete data",
    body: "To remove a saved progress snapshot or unsubscribe from the newsletter, contact us at the email below with the email address used. We'll remove it promptly. Unsubscribing from the newsletter is one click from any email we send.",
  },
  {
    title: "Contact",
    body: "Questions about privacy? This app was built by a parent, for parents. Reach out at privacy@readwithrex.com and a human (the parent) will reply.",
  },
];

export default function Privacy() {
  return (
    <ContentLayout
      badge="Legal"
      title={
        <>
          Privacy policy,{" "}
          <span className="relative inline-block bg-sun px-2">
            short, honest, kid-safe
          </span>
        </>
      }
      intro="The short version: children don't share anything, there are no ads, and parent emails are only ever used for what you asked for. Last updated August 2026."
      schema={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Read with Rex Privacy Policy",
        inLanguage: "en",
      }}
    >
      <div className="space-y-5">
        {SECTIONS.map((s) => (
          <div
            key={s.title}
            className="border-[3px] border-ink bg-white p-6 nb-shadow-sm"
          >
            <h2 className="text-2xl font-bold tracking-tight">{s.title}</h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">{s.body}</p>
          </div>
        ))}
        <p className="border-[3px] border-ink bg-paper p-5 text-sm font-semibold leading-relaxed text-muted-foreground">
          This policy follows the spirit of the U.S. Children&apos;s Online
          Privacy Protection Act (COPPA): because Read with Rex is directed at
          children under 13, we collect no personal information from children
          and only ever accept opt-in email addresses from parents. See our{" "}
          <Link to="/terms" className="font-bold text-ink underline">
            Terms of use
          </Link>
          .
        </p>
      </div>
    </ContentLayout>
  );
}