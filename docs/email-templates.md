# Read with Rex — Email templates

Email service: EmailOctopus (COPPA-safe, parent-facing only).
List tag used in `src/convex/newsletter.ts`: `lead-magnet-sight-words`.

---

## 1. Lead-magnet delivery email

**When:** Sent immediately after a parent subscribes on the landing page.
**Goal:** Deliver the printable sight-word flashcards and set expectations.

**Subject:** Your free sight-word flashcards are here 🦖

**Preview text:** 50 printable cards + 3 quick games to play this week.

**Body (plain-text friendly):**

Hi there,

Welcome to Read with Rex — a tiny dinosaur-powered reading game I built for my own 5-year-old.

Here are your **50 free printable sight-word flashcards**:  
https://readwithrex.com/sight-words

**Three ways to use them this week**

1. **Go on a word hunt.** Pick 5 cards and hide them around the room. Every time your child finds one, they say the word out loud.
2. **Match race.** Lay out 10 cards face up, say a word, and see how fast they can slap the right one.
3. **Build a sentence.** Use 3–4 cards to make a silly sentence together (“The cat sat on a sun.”).

You’ll also get a short email each week with **3 reading games to play at home** — no worksheets, no pressure, just fun.

If your child is ready to play on a phone, tablet, or computer, the free game is here:  
https://readwithrex.com

Thanks for reading,
Josh (and Rex 🦖)

P.S. No spam, ever. Unsubscribe anytime below.

---

## 2. Welcome email (sent to new subscribers if not using the delivery email above)

**When:** Sent immediately after signup if the lead-magnet email is not configured as the first message.
**Goal:** Introduce the brand, share the lead magnet, and invite play.

**Subject:** Rex says hello 🦖 (and your flashcards are inside)

**Preview text:** Free sight-word cards + a reading game made by a dad for his 5-year-old.

**Body (plain-text friendly):**

Hi there,

I’m Josh. I built **Read with Rex** for my 5-year-old son, and I’m so glad you found it.

Read with Rex is a free voice-first reading game for kids ages 4–6. No ads, no timers, and no account required for kids — they just tap and play while Rex the T-Rex speaks every prompt out loud.

**Start here:**

- **Play the game:** https://readwithrex.com
- **Print the free flashcards:** https://readwithrex.com/sight-words

**What kids learn first**

- First sight words (cat, dog, sun, hat, bus…)
- Counting 1–10
- Simple patterns (AB, AABB, ABC)

Every week I send one short email with **3 reading games you can play at home** — usually with nothing more than a deck of cards, a snack, or a walk around the block.

Thanks for trusting me with your inbox.

Josh (and Rex 🦖)

P.S. This list is for parents and caregivers only. We never collect information from children, and you can unsubscribe anytime below.

---

## 3. Weekly tips email (template outline)

**When:** Sent weekly (start after the welcome/lead-magnet email).
**Goal:** Keep parents engaged, drive return visits, build trust.

**Subject pattern:** 3 reading games for [this week / rainy days / car rides]

**Structure:**

1. **One game from Read with Rex** — link directly to a module.
2. **One offline game** — e.g., “sound scavenger hunt,” “rhyme time,” “letter snack.”
3. **One quick win** — e.g., “read the cereal box together,” “point out STOP signs.”

**Footer in every email:**

- Link to the game: https://readwithrex.com
- Link to flashcards: https://readwithrex.com/sight-words
- Unsubscribe + address

---

## 4. Save-progress reminder email (future, when parent dashboard exists)

**When:** Sent a few days after a parent saves progress with a PIN.
**Goal:** Remind them how to restore progress on another device.

**Subject:** Your child’s progress is saved 🌟

**Body (plain-text friendly):**

Hi,

Just a quick note: your child’s progress on Read with Rex is safely saved.

To pick up where they left off on another device:

1. Go to https://readwithrex.com
2. Tap “Save Progress” in the parent area
3. Enter your email and the 4-digit PIN you created

That’s it. Stars, mastered words, and creature celebrations all come along.

Happy reading,
Josh (and Rex 🦖)

---

## Implementation notes

- These templates assume EmailOctopus supports plain-text + HTML. Keep HTML minimal and readable on mobile.
- All links use `https://readwithrex.com` — update if the final domain changes.
- For Plausible outbound-link tracking, add `data-analytics` attributes if desired once Plausible is active.
- Tag all subscribers with `lead-magnet-sight-words` for segmentation (already done in `newsletter.ts`).
