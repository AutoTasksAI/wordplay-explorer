import { Link } from "react-router";

import { ContentLayout } from "@/components/ContentLayout";

const SECTIONS = [
  {
    title: "Read with Rex is free",
    body: "All current games are free, forever, with no ads, no paywalls, and no subscriptions required. If a premium tier ever launches, the existing free games will stay free.",
  },
  {
    title: "Made for children ages 4–6",
    body: "Read with Rex is designed for children just starting to read. The games are spoken aloud, short, and pressure-free. Parents are welcome to play along, too.",
  },
  {
    title: "A grown-up is responsible for the account",
    body: "Any feature that uses an email (saving progress or the newsletter) is intended for parents and caregivers. By using it you confirm you are an adult. Children should never enter their own email.",
  },
  {
    title: "Progress is saved on the device",
    body: "Guest progress lives on the device you're playing on. To move progress between devices, use the parent 'Save progress' feature with your email and a code you choose.",
  },
  {
    title: "No guarantees",
    body: "Read with Rex is provided as-is. We work hard to keep the game working and kid-safe, but we make no guarantees that every word, sound, or feature is available at all times.",
  },
  {
    title: "Made by a parent",
    body: "This app was built by a dad for his 5-year-old and is offered free to other families. If something isn't right, please tell us. We take feedback seriously.",
  },
];

export default function Terms() {
  return (
    <ContentLayout
      badge="Legal"
      title={
        <>
          Terms of use,{" "}
          <span className="relative inline-block bg-sun px-2">
            the short, friendly version
          </span>
        </>
      }
      intro="Read with Rex is a free reading game for young children. These terms are simple because the product is simple. Last updated August 2026."
      schema={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: "Read with Rex Terms of Use",
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
          Questions? Read our{" "}
          <Link to="/privacy" className="font-bold text-ink underline">
            Privacy policy
          </Link>{" "}
          or email privacy@readwithrex.com.
        </p>
      </div>
    </ContentLayout>
  );
}