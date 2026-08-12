import { useState, useEffect, useCallback, useRef } from "react";
import appIcon from "@/imports/icon-.png";
import leadImage from "@/imports/Lead.png";
import googlePlayIcon from "@/imports/image.png";
import calendarImage from "@/imports/calender.png";
import finVideo from "@/imports/watermark-removed-remove_the_additional_fin_on_t.mp4";
import imgQuizScreen from "@/imports/quiz.png";
import imgStreakScreen from "@/imports/streak.png";
import imgLeaderboard from "@/imports/ab.png";
import * as api from "@/lib/api";

const BG = "#84B8F6";
const CARD = "#FAD4D4";
const NAVY = "#1E3A5F";
const PINK_BTN = "#EC4899";
const WHITE_GLASS = "rgba(255,255,255,0.35)";

// ── Toast ─────────────────────────────────────────────────────────────────────
let _setToast: ((msg: string, type?: "error" | "ok") => void) | null = null;
export function toast(msg: string, type: "error" | "ok" = "ok") {
  _setToast?.(msg, type);
}

function ToastHost() {
  const [item, setItem] = useState<{ msg: string; type: "error" | "ok" } | null>(null);
  useEffect(() => {
    _setToast = (msg, type = "ok") => {
      setItem({ msg, type });
      setTimeout(() => setItem(null), 4000);
    };
    return () => { _setToast = null; };
  }, []);
  if (!item) return null;
  return (
    <div
      style={{
        position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)",
        backgroundColor: item.type === "error" ? "#b91c1c" : "#15803d",
        color: "white", borderRadius: "0.875rem", zIndex: 200,
        boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
      }}
      className="px-6 py-3 text-sm font-700 max-w-sm text-center"
    >
      {item.msg}
    </div>
  );
}

// ── Tiny shared primitives ────────────────────────────────────────────────────
function GlassCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      style={{ backgroundColor: CARD, borderRadius: "1.25rem" }}
      className={`shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

function PinkBtn({
  children,
  onClick,
  type = "button",
  disabled = false,
  className = "",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{ backgroundColor: disabled ? "#ccc" : PINK_BTN, color: "white", borderRadius: "0.875rem" }}
      className={`px-5 py-2.5 font-800 text-sm transition-opacity hover:opacity-85 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
}

// ── Navbar ────────────────────────────────────────────────────────────────────
function Navbar() {
  const [open, setOpen] = useState(false);
  const links = [
    { label: "Features", href: "#features" },
    { label: "Events", href: "#events" },
    { label: "Roadmap & Voting", href: "#voting" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact", href: "#contact" },
  ];
  return (
    <nav
      style={{ backgroundColor: BG, borderBottom: "2px solid rgba(30,58,95,0.12)" }}
      className="sticky top-0 z-50"
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <img src={appIcon} alt="WordsWave icon" className="w-9 h-9 rounded-xl" />
          <span style={{ color: NAVY }} className="text-xl font-900 tracking-tight">WordsWave</span>
        </a>
        <div className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <a key={l.label} href={l.href} style={{ color: NAVY }} className="font-700 text-sm hover:opacity-70 transition-opacity">
              {l.label}
            </a>
          ))}
        </div>
        <button onClick={() => setOpen(!open)} className="md:hidden flex flex-col gap-1.5 p-1" aria-label="Toggle menu">
          {[0, 1, 2].map((i) => (
            <span key={i} style={{ backgroundColor: NAVY }} className="block w-6 h-0.5 rounded-full" />
          ))}
        </button>
      </div>
      {open && (
        <div style={{ backgroundColor: BG, borderTop: "1px solid rgba(30,58,95,0.1)" }} className="md:hidden px-4 pb-4">
          {links.map((l) => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)} style={{ color: NAVY }} className="block py-2.5 font-700 text-sm border-b border-white/30 last:border-0">
              {l.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function IosNotifyForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "duplicate" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const result = await api.addIosWaitlist(email);
      setStatus(result === "duplicate" ? "duplicate" : "done");
    } catch {
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <p style={{ color: NAVY }} className="text-sm font-700">
        ✓ You are on the list! We will let you know when iOS launches.
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-2 w-full max-w-sm">
      <p style={{ color: NAVY }} className="text-xs font-700 opacity-60 uppercase tracking-wide">iOS — Coming Soon</p>
      <div className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          style={{ backgroundColor: "rgba(255,255,255,0.55)", color: NAVY, borderRadius: "0.75rem", border: "2px solid rgba(30,58,95,0.18)", flex: 1, minWidth: 0 }}
          className="px-4 py-3 text-sm font-600 outline-none"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          style={{ backgroundColor: NAVY, color: "white", borderRadius: "0.75rem", whiteSpace: "nowrap" }}
          className="px-4 py-3 text-sm font-800 hover:opacity-85 transition-opacity disabled:opacity-50"
        >
          {status === "loading" ? "…" : "Notify me"}
        </button>
      </div>
      {status === "duplicate" && <p style={{ color: NAVY }} className="text-xs font-700 opacity-60">You are already on the list!</p>}
      {status === "error" && <p style={{ color: "#b91c1c" }} className="text-xs font-700">Something went wrong — please try again.</p>}
    </form>
  );
}

function Hero({ sectionRef }: { sectionRef?: React.RefObject<HTMLElement | null> }) {
  const ctaRef = useRef<HTMLDivElement>(null);
  return (
    <section ref={sectionRef} style={{ backgroundColor: BG, minHeight: "calc(100vh - 57px)" }} className="px-4 overflow-hidden flex items-center">
      <div className="max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-8 items-center py-16">
        <div>
          <p style={{ color: NAVY }} className="text-sm font-800 opacity-60 mb-3 uppercase tracking-widest">
            Be among the first to master vocabulary the fun way
          </p>
          <h1 style={{ color: NAVY, lineHeight: 1.15 }} className="text-4xl md:text-5xl font-900 mb-5">
            Master New Words Every Day with WordsWave.
          </h1>
          <p style={{ color: NAVY }} className="text-lg font-600 opacity-80 mb-8 leading-relaxed">
            Expand your vocabulary through daily word exposure, interactive quizzes, and a gamified learning experience alongside Fin, your dolphin guide!
          </p>
          <div ref={ctaRef} className="flex flex-col gap-4">
            <a
              href="https://play.google.com/store/apps/details?id=com.anyahuru.wordwave"
              target="_blank"
              rel="noopener noreferrer"
              style={{ backgroundColor: NAVY, color: "white" }}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-800 text-sm shadow-lg hover:opacity-90 transition-opacity self-start"
            >
              <img src={googlePlayIcon} alt="Google Play" className="w-5 h-5 object-contain" />
              Get it on Google Play
            </a>
            <IosNotifyForm />
          </div>
        </div>
        {/* Phone mockup */}
        <div className="flex justify-center items-center">
          <img
            src={leadImage}
            alt="WordsWave app screens showing daily word, streak tracking, and multi-language support"
            className="w-full max-w-lg object-contain drop-shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}

// ── How WordsWave Helps You ───────────────────────────────────────────────────
const BENEFITS = [
  {
    title: "Grow Your Vocabulary Every Day",
    desc: "A carefully chosen word lands in your app daily — complete with its definition, phonetic pronunciation, and real-world usage examples. Consistent daily exposure is the fastest proven path to a larger vocabulary.",
  },
  {
    title: "Test, Retain, and Never Forget",
    desc: "Multiple quiz formats push words from short-term exposure into long-term memory. Each quiz session reinforces what you have already learned, ensuring new words actually stick rather than fading within days.",
  },
  {
    title: "Turn Learning Into a Non-Negotiable Habit",
    desc: "Streak tracking rewards you for showing up every day. Missing a day resets your count, creating the right amount of healthy pressure to make vocabulary practice as automatic as brushing your teeth.",
  },
  {
    title: "Stay Motivated Through Milestones and Competition",
    desc: "Global leaderboards show how you rank against learners worldwide, while achievement badges — earned for streaks, quiz mastery, and more — give you visible proof of real progress at every stage.",
  },
  {
    title: "Fit Learning Into Any Schedule",
    desc: "Sessions are designed to be completed in just a few focused minutes. Whether you are on a commute, on a lunch break, or winding down at night, WordsWave fits your day rather than competing with it.",
  },
  {
    title: "Speak and Write at a Higher Level",
    desc: "A broader vocabulary directly sharpens how you communicate — in job interviews, professional emails, academic essays, and everyday conversations. WordsWave builds the language skills that open real doors.",
  },
  {
    title: "See Your Growth at a Glance",
    desc: "Your personal profile tracks streaks, badges earned, and ranking history in one place. Watching those numbers grow over weeks and months is one of the most powerful motivators to keep going.",
  },
  {
    title: "Works for Every Type of Learner",
    desc: "A student building foundational vocabulary, a professional refining business language, or a non-native speaker expanding their English — WordsWave adapts to where you are and moves with you as you improve.",
  },
  {
    title: "Always Fresh, Always Engaging",
    desc: "Seasonal events, community challenges, and a gamified learning loop mean there is always a reason to open the app. Your learning never plateaus — and it never feels like a chore.",
  },
];

function HowWeHelp() {
  const rows = [BENEFITS.slice(0, 3), BENEFITS.slice(3, 6), BENEFITS.slice(6, 9)];
  const [visible, setVisible] = useState([false, false, false]);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers = rows.map((_, i) => {
      const el = rowRefs.current[i];
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible((v) => { const n = [...v]; n[i] = true; return n; });
            obs.disconnect();
          }
        },
        { threshold: 0.15 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  return (
    <section style={{ backgroundColor: "rgba(255,255,255,0.15)" }} className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <h2 style={{ color: NAVY }} className="text-3xl md:text-4xl font-900 mb-3">
            How WordsWave Helps You
          </h2>
          <p style={{ color: NAVY }} className="text-lg font-600 opacity-70 max-w-2xl mx-auto leading-relaxed">
            More than an app — a complete vocabulary growth system designed around how people actually learn and retain new words.
          </p>
        </div>
        <div className="flex flex-col gap-5">
          {rows.map((row, rowIdx) => (
            <div
              key={rowIdx}
              ref={(el) => { rowRefs.current[rowIdx] = el; }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {row.map((b, cardIdx) => (
                <div
                  key={b.title}
                  style={{
                    backgroundColor: CARD,
                    borderRadius: "1.5rem",
                    opacity: visible[rowIdx] ? 1 : 0,
                    transform: visible[rowIdx] ? "translateY(0)" : "translateY(36px)",
                    transition: `opacity 0.55s ease-out ${cardIdx * 0.13}s, transform 0.55s ease-out ${cardIdx * 0.13}s`,
                  }}
                  className="p-6 flex flex-col gap-2.5 shadow-sm"
                >
                  <h3 style={{ color: NAVY, fontSize: "1.05rem", fontWeight: 900, lineHeight: 1.3 }}>{b.title}</h3>
                  <div style={{ width: 32, height: 3, backgroundColor: PINK_BTN, borderRadius: 2 }} />
                  <p style={{ color: NAVY }} className="text-sm font-600 opacity-70 leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Features carousel ─────────────────────────────────────────────────────────
const CAROUSEL_SLIDES = [
  { title: "Daily Word", desc: "Receive a new word each day with definitions, examples, and phonetics.", visual: "cards" as const },
  { title: "Quiz System", desc: "Multiple quiz types to test and sharpen your vocabulary knowledge.", visual: "phone" as const },
  { title: "Streak Tracking", desc: "Build consistency with daily streak counters. Keep the flame alive!", visual: "phone" as const },
  { title: "Leaderboards & Profiles", desc: "Competitive rankings, customizable avatars, and achievement badges.", visual: "leaderboard" as const },
  { title: "Meet Fin", desc: "Fin is your personal dolphin guide — he celebrates every milestone, cheers you on to keep your streak alive, and gives friendly tips to boost your vocabulary faster.", visual: "video" as const },
];

function HeartOutline() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2a2a2a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function WordCard({ word, phonetic, definition, bg, style }: { word: string; phonetic: string; definition: string; bg: string; style?: React.CSSProperties }) {
  return (
    <div style={{ backgroundColor: bg, borderRadius: "1.4rem", padding: "20px 22px", width: 290, boxShadow: "0 6px 24px rgba(0,0,0,0.10)", ...style }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
        <span style={{ fontSize: 26, fontWeight: 900, color: "#1a1a1a", fontFamily: "Nunito, sans-serif" }}>{word}</span>
        <HeartOutline />
      </div>
      <p style={{ fontSize: 14, color: "#444", fontWeight: 600, marginBottom: 8, opacity: 0.7 }}>{phonetic}</p>
      <p style={{ fontSize: 15, color: "#1a1a1a", fontWeight: 500, lineHeight: 1.5 }}>{definition}</p>
    </div>
  );
}

function DailyWordStack({ fanned }: { fanned: boolean }) {
  const base: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transition: "transform 0.9s cubic-bezier(0.34, 1.1, 0.64, 1), opacity 0.7s ease-out",
  };
  return (
    <div style={{ position: "relative", width: 380, height: 230, margin: "0 auto" }}>
      {/* Panacea — back, pink */}
      <div style={{
        ...base,
        zIndex: 1,
        opacity: fanned ? 1 : 0,
        transform: fanned
          ? "translate(calc(-50% - 82px), calc(-50% - 48px)) rotate(-21deg)"
          : "translate(-50%, -50%) rotate(0deg)",
      }}>
        <WordCard word="Panacea" phonetic="/ˌpænəˈsiːə/" definition="A solution or remedy for all difficulties." bg="#f2d4da" />
      </div>
      {/* Quell — middle, lavender */}
      <div style={{
        ...base,
        zIndex: 2,
        opacity: fanned ? 1 : 0,
        transform: fanned
          ? "translate(calc(-50% - 32px), calc(-50% - 18px)) rotate(-11deg)"
          : "translate(-50%, -50%) rotate(0deg)",
      }}>
        <WordCard word="Quell" phonetic="/kwel/" definition="Put an end to (a disorder), typically by force." bg="#e2dff2" />
      </div>
      {/* Danse — front, mint blue */}
      <div style={{
        ...base,
        zIndex: 3,
        opacity: 1,
        transform: fanned
          ? "translate(calc(-50% + 28px), calc(-50% + 16px)) rotate(-2deg)"
          : "translate(-50%, -50%) rotate(0deg)",
      }}>
        <WordCard word="Danse" phonetic="/dãs/" definition="Move rhythmically to music." bg="#d4dfe6" />
      </div>
    </div>
  );
}


function SlideVisual({ slide, fanned }: { slide: (typeof CAROUSEL_SLIDES)[number]; fanned: boolean }) {
  if (slide.visual === "cards") {
    return (
      <div className="flex items-center justify-center" style={{ height: 280 }}>
        <DailyWordStack fanned={fanned} />
      </div>
    );
  }
  if (slide.visual === "phone") {
    const src = slide.title === "Streak Tracking" ? imgStreakScreen : imgQuizScreen;
    return (
      <div className="flex items-center justify-center" style={{ height: 280 }}>
        <img src={src} alt={slide.title} style={{ height: 272, width: "auto", objectFit: "contain", filter: "drop-shadow(0 12px 32px rgba(0,0,0,0.22))" }} />
      </div>
    );
  }
  if (slide.visual === "leaderboard") {
    return (
      <div className="flex items-center justify-center" style={{ height: 280 }}>
        <img src={imgLeaderboard} alt="Leaderboards and profiles" style={{ height: 272, width: "auto", objectFit: "contain", filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.18))" }} />
      </div>
    );
  }
  if (slide.visual === "video") {
    return (
      <div className="flex items-center justify-center">
        <div style={{ borderRadius: "2rem", overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.18)" }} className="w-72">
          <video src={finVideo} autoPlay loop muted playsInline preload="none" className="w-full" />
        </div>
      </div>
    );
  }
  return null;
}

const SLIDE_DURATION = 5000;
const FAN_TRIGGER = 3500;

function Features() {
  const [current, setCurrent] = useState(0);
  const [fanned, setFanned] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const fanRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const advRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = (idx: number) => {
    if (fanRef.current) clearTimeout(fanRef.current);
    if (advRef.current) clearTimeout(advRef.current);
    setFanned(false);
    setCurrent(idx);
    setAnimKey((k) => k + 1);
  };

  useEffect(() => {
    if (fanRef.current) clearTimeout(fanRef.current);
    if (advRef.current) clearTimeout(advRef.current);
    setFanned(false);

    if (current === 0) {
      fanRef.current = setTimeout(() => setFanned(true), FAN_TRIGGER);
    }
    advRef.current = setTimeout(() => {
      setCurrent((c) => (c + 1) % CAROUSEL_SLIDES.length);
      setAnimKey((k) => k + 1);
    }, SLIDE_DURATION);

    return () => {
      if (fanRef.current) clearTimeout(fanRef.current);
      if (advRef.current) clearTimeout(advRef.current);
    };
  }, [current, animKey]);

  const slide = CAROUSEL_SLIDES[current];

  return (
    <section id="features" style={{ backgroundColor: BG }} className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <h2 style={{ color: NAVY }} className="text-3xl md:text-4xl font-900 mb-3">Glance at some features</h2>
          <p style={{ color: NAVY }} className="text-lg font-600 opacity-70">Powerful features built for daily vocabulary growth.</p>
        </div>

        {/* Slide */}
        <div style={{ backgroundColor: "rgba(255,255,255,0.28)", borderRadius: "2rem", minHeight: 420, transition: "opacity 0.3s" }} className="px-6 py-10 flex flex-col items-center gap-6">
          <SlideVisual slide={slide} fanned={fanned} key={`${current}-visual`} />
          <div className="text-center mt-2">
            <h3 style={{ color: NAVY }} className="text-2xl font-900 mb-2">{slide.title}</h3>
            <p style={{ color: NAVY }} className="text-base font-600 opacity-75 max-w-md mx-auto leading-relaxed">{slide.desc}</p>
          </div>
        </div>

        {/* Dot navigation */}
        <div className="flex items-center justify-center gap-2.5 mt-7">
          {CAROUSEL_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              style={{
                width: i === current ? 28 : 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: i === current ? NAVY : "rgba(30,58,95,0.28)",
                border: "none",
                cursor: "pointer",
                transition: "width 0.3s, background-color 0.3s",
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// ── FAQ ───────────────────────────────────────────────────────────────────────
function FAQ() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [openIdx, setOpenIdx] = useState<string | null>(null);

  useEffect(() => {
    api.getFaqs().then(setFaqs).catch(() => { });
  }, []);

  return (
    <section id="faq" style={{ backgroundColor: BG }} className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 style={{ color: NAVY }} className="text-3xl md:text-4xl font-900 mb-3">Frequently Asked Questions</h2>
          <p style={{ color: NAVY }} className="text-lg font-600 opacity-70">Everything you want to know about WordsWave.</p>
        </div>
        <div className="flex flex-col gap-3">
          {faqs.map((item) => (
            <GlassCard key={item.id} className="overflow-hidden">
              <button
                onClick={() => setOpenIdx(openIdx === item.id ? null : item.id)}
                className="w-full flex items-center justify-between px-6 py-4 text-left"
              >
                <span style={{ color: NAVY }} className="font-800 text-base pr-4">{item.question}</span>
                <svg
                  style={{ color: NAVY, minWidth: 20, transform: openIdx === item.id ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.25s" }}
                  width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              {openIdx === item.id && (
                <div style={{ color: NAVY }} className="px-6 pb-5 text-sm font-600 opacity-80 leading-relaxed">{item.answer}</div>
              )}
            </GlassCard>
          ))}
          {faqs.length === 0 && (
            <p style={{ color: NAVY }} className="text-center opacity-60 font-600">Loading FAQs…</p>
          )}
        </div>
      </div>
    </section>
  );
}

// ── Events ────────────────────────────────────────────────────────────────────
function EventCard({ event, onView }: { event: any; onView: (e: any) => void }) {
  const datePosted = event.createdAt ? new Date(event.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : null;
  return (
    <div style={{ backgroundColor: "rgba(255,255,255,0.45)", borderRadius: "1.5rem", border: "2px solid rgba(30,58,95,0.08)" }} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
      <div className="h-44 overflow-hidden shrink-0">
        {event.imageUrl ? (
          <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
        ) : (
          <div style={{ background: "linear-gradient(135deg,#c7deff,#fadadd)" }} className="w-full h-full flex items-center justify-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="rgba(30,58,95,0.25)" strokeWidth="1.5"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M8 2v3M16 2v3M3 10h18" /></svg>
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        {datePosted && <p style={{ color: NAVY }} className="text-xs font-700 opacity-40 mb-1">{datePosted}</p>}
        <h3 style={{ color: NAVY }} className="font-800 text-base mb-1">{event.title}</h3>
        <p style={{ color: NAVY }} className="text-sm font-600 opacity-70 leading-relaxed flex-1 line-clamp-3">{event.description}</p>
        {(event.startDate || event.endDate) && (
          <p style={{ color: NAVY }} className="text-xs font-700 opacity-50 mt-2">
            {event.startDate && `From ${event.startDate}`}{event.endDate && ` → ${event.endDate}`}
          </p>
        )}
        <button onClick={() => onView(event)} style={{ color: NAVY, borderTop: "1.5px solid rgba(30,58,95,0.1)" }} className="mt-3 pt-3 text-sm font-800 text-left hover:opacity-60 transition-opacity self-start">View →</button>
      </div>
    </div>
  );
}

function EventModal({ event, onClose }: { event: any; onClose: () => void }) {
  const datePosted = event.createdAt ? new Date(event.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} onClick={onClose}>
      <div style={{ backgroundColor: "#fff", borderRadius: "2rem", maxWidth: "560px", width: "100%", maxHeight: "90vh", overflow: "auto" }} onClick={(e) => e.stopPropagation()}>
        {event.imageUrl && (
          <div className="h-56 overflow-hidden rounded-t-3xl">
            <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="p-8">
          {datePosted && <p style={{ color: NAVY }} className="text-xs font-700 opacity-40 mb-2">Posted {datePosted}</p>}
          <h2 style={{ color: NAVY }} className="text-2xl font-900 mb-3">{event.title}</h2>
          <p style={{ color: NAVY }} className="text-sm font-600 opacity-75 leading-relaxed mb-5">{event.description}</p>
          {(event.startDate || event.endDate) && (
            <div style={{ backgroundColor: "rgba(132,184,246,0.2)", borderRadius: "0.75rem" }} className="px-4 py-3 mb-5">
              <p style={{ color: NAVY }} className="text-sm font-700">
                {event.startDate && `Starts: ${event.startDate}`}
                {event.startDate && event.endDate && <span className="mx-2">·</span>}
                {event.endDate && `Ends: ${event.endDate}`}
              </p>
            </div>
          )}
          <button onClick={onClose} style={{ backgroundColor: NAVY, color: "white", borderRadius: "0.75rem" }} className="px-6 py-2.5 text-sm font-800 hover:opacity-80 transition-opacity">Close</button>
        </div>
      </div>
    </div>
  );
}

function NewsletterStrip() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "duplicate" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const result = await api.subscribeNewsletter(email);
      setStatus(result === "duplicate" ? "duplicate" : "done");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div style={{ backgroundColor: "rgba(30,58,95,0.08)", borderRadius: "1.5rem" }} className="mt-12 px-6 py-8 flex flex-col md:flex-row items-center gap-6">
      <div className="flex-1 text-center md:text-left">
        <p style={{ color: NAVY }} className="font-900 text-lg mb-1">Stay in the loop</p>
        <p style={{ color: NAVY }} className="text-sm font-600 opacity-65">Get notified about new events, challenges, and features — no spam, ever.</p>
      </div>
      {status === "done" ? (
        <p style={{ color: NAVY }} className="font-800 text-sm">✓ Subscribed! We will keep you posted.</p>
      ) : (
        <form onSubmit={submit} className="flex gap-2 w-full md:w-auto">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            style={{ backgroundColor: "rgba(255,255,255,0.7)", color: NAVY, borderRadius: "0.75rem", border: "2px solid rgba(30,58,95,0.15)", minWidth: 0 }}
            className="flex-1 md:w-56 px-4 py-3 text-sm font-600 outline-none"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            style={{ backgroundColor: PINK_BTN, color: "white", borderRadius: "0.75rem", whiteSpace: "nowrap" }}
            className="px-5 py-3 text-sm font-800 hover:opacity-85 transition-opacity disabled:opacity-50"
          >
            {status === "loading" ? "…" : "Notify Me"}
          </button>
        </form>
      )}
      {status === "duplicate" && <p style={{ color: NAVY }} className="text-xs font-700 opacity-60 md:hidden">You are already subscribed!</p>}
      {status === "error" && <p style={{ color: "#b91c1c" }} className="text-xs font-700 md:hidden">Something went wrong — please try again.</p>}
    </div>
  );
}

function Events() {
  const [events, setEvents] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    api.getEvents().then((data) => { setEvents(data); setLoaded(true); }).catch(() => setLoaded(true));
  }, []);

  return (
    <section id="events" style={{ backgroundColor: BG }} className="py-20 px-4">
      {selected && <EventModal event={selected} onClose={() => setSelected(null)} />}
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-1">
          <h2 style={{ color: NAVY }} className="text-3xl md:text-4xl font-900 mb-3">Live Events & Challenges</h2>
          <p style={{ color: NAVY }} className="text-lg font-600 opacity-70">Stay sharp and compete with the WordsWave community.</p>
        </div>
        {!loaded ? (
          <p style={{ color: NAVY }} className="text-center font-700 opacity-50 py-8">Loading events…</p>
        ) : events.length === 0 ? (
          <div className="text-center py-0">
            <img src={calendarImage} alt="Calendar" className="mx-auto mb-1 block w-120 h-120 object-contain" />
            <p style={{ color: NAVY }} className="font-800 text-lg opacity-60">No events right now</p>
            <p style={{ color: NAVY }} className="text-sm font-600 opacity-40 mt-1">Check back soon for upcoming challenges!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {events.map((e) => <EventCard key={e.id} event={e} onView={setSelected} />)}
          </div>
        )}

        {/* Newsletter strip */}
        <NewsletterStrip />
      </div>
    </section>
  );
}

// ── Voting ────────────────────────────────────────────────────────────────────
const FEATURE_CATEGORIES = ["UI / Design", "Gameplay", "Social", "Learning", "Accessibility", "Performance", "Content", "Other"];

function FeatureSubmitForm({ onSubmitted }: { onSubmitted: () => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", category: FEATURE_CATEGORIES[0], description: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.submitFeature(form);
      setDone(true);
      setForm({ title: "", category: FEATURE_CATEGORIES[0], description: "" });
      setTimeout(() => { setDone(false); setOpen(false); onSubmitted(); }, 2500);
    } catch (err: any) {
      toast("Failed to submit: " + (err?.message ?? "Check Supabase RLS policies"), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          style={{ backgroundColor: WHITE_GLASS, color: NAVY, borderRadius: "1rem", border: `2px dashed ${NAVY}` }}
          className="w-full py-3.5 font-800 text-sm hover:opacity-80 transition-opacity"
        >
          + Request a Feature
        </button>
      ) : (
        <GlassCard className="p-6">
          <h3 style={{ color: NAVY }} className="font-900 text-lg mb-4">Submit a Feature Request</h3>
          {done ? (
            <div style={{ color: NAVY }} className="py-4 text-center font-700">
              ✓ Request submitted! It will appear after admin review.
            </div>
          ) : (
            <form onSubmit={submit} className="flex flex-col gap-4">
              <div>
                <label style={{ color: NAVY }} className="block text-sm font-700 mb-1">Feature Title</label>
                <input
                  required
                  placeholder="e.g. Dark Mode"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  style={{ backgroundColor: "rgba(255,255,255,0.7)", color: NAVY, borderRadius: "0.75rem", border: "2px solid rgba(30,58,95,0.15)" }}
                  className="w-full px-4 py-3 text-sm font-600 outline-none"
                />
              </div>
              <div>
                <label style={{ color: NAVY }} className="block text-sm font-700 mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  style={{ backgroundColor: "rgba(255,255,255,0.7)", color: NAVY, borderRadius: "0.75rem", border: "2px solid rgba(30,58,95,0.15)" }}
                  className="w-full px-4 py-3 text-sm font-600 outline-none"
                >
                  {FEATURE_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ color: NAVY }} className="block text-sm font-700 mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe what you'd like and why it would help..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  style={{ backgroundColor: "rgba(255,255,255,0.7)", color: NAVY, borderRadius: "0.75rem", border: "2px solid rgba(30,58,95,0.15)", resize: "none" }}
                  className="w-full px-4 py-3 text-sm font-600 outline-none"
                />
              </div>
              <div className="flex gap-3">
                <PinkBtn type="submit" disabled={loading} className="flex-1">{loading ? "Submitting…" : "Submit Request"}</PinkBtn>
                <button type="button" onClick={() => setOpen(false)} style={{ color: NAVY }} className="px-4 py-2.5 font-700 text-sm hover:opacity-70">Cancel</button>
              </div>
            </form>
          )}
        </GlassCard>
      )}
    </div>
  );
}

function Voting() {
  const [features, setFeatures] = useState<any[]>([]);
  const [userVotes, setUserVotes] = useState<Record<string, number>>({});

  const load = useCallback(() => {
    api.getFeatures().then((data) => setFeatures([...data].sort((a, b) => b.votes - a.votes))).catch(() => { });
  }, []);

  useEffect(() => { load(); }, [load]);

  const vote = async (id: string, dir: 1 | -1) => {
    const prev = userVotes[id] || 0;
    const next = prev === dir ? 0 : dir;
    setUserVotes((v) => ({ ...v, [id]: next }));
    const updated = await api.voteFeature(id, next, prev);
    setFeatures((fs) => [...fs.map((f) => f.id === id ? { ...f, votes: updated.votes } : f)].sort((a, b) => b.votes - a.votes));
  };

  return (
    <section id="voting" style={{ backgroundColor: BG }} className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 style={{ color: NAVY }} className="text-3xl md:text-4xl font-900 mb-3">Shape the Future of WordsWave!</h2>
          <p style={{ color: NAVY }} className="text-lg font-600 opacity-70 max-w-xl mx-auto">
            Request community-driven features, vote on our upcoming roadmap, and leave your feedback to help us build a better app.
          </p>
        </div>
        <div style={{ backgroundColor: "rgba(255,255,255,0.35)", borderRadius: "1rem", borderLeft: `4px solid ${PINK_BTN}` }} className="px-5 py-3.5 mb-6">
          <p style={{ color: NAVY }} className="text-sm font-800">We build what our users ask for. Vote on what comes next.</p>
        </div>
        <FeatureSubmitForm onSubmitted={load} />
        <div className="flex flex-col gap-3">
          {features.map((f, idx) => {
            const uv = userVotes[f.id] || 0;
            return (
              <GlassCard key={f.id} className="flex items-center gap-4 px-5 py-4">
                <span style={{ color: NAVY, minWidth: 28 }} className="text-lg font-900 opacity-40">#{idx + 1}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span style={{ color: NAVY }} className="font-800 text-base">{f.title}</span>
                    <span style={{ backgroundColor: "rgba(30,58,95,0.1)", color: NAVY, borderRadius: "999px" }} className="text-xs font-700 px-2 py-0.5">{f.category}</span>
                  </div>
                  <div style={{ color: NAVY }} className="text-sm font-600 opacity-70 mt-0.5">{f.description}</div>
                </div>
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <button
                    onClick={() => vote(f.id, 1)}
                    style={{ backgroundColor: uv === 1 ? PINK_BTN : "rgba(255,255,255,0.6)", color: uv === 1 ? "white" : NAVY, borderRadius: "0.5rem" }}
                    className="w-9 h-8 flex items-center justify-center text-sm font-800 transition-all hover:scale-105"
                  >▲</button>
                  <span style={{ color: NAVY }} className="text-base font-900">{f.votes}</span>
                  <button
                    onClick={() => vote(f.id, -1)}
                    style={{ backgroundColor: uv === -1 ? "#6366F1" : "rgba(255,255,255,0.6)", color: uv === -1 ? "white" : NAVY, borderRadius: "0.5rem" }}
                    className="w-9 h-8 flex items-center justify-center text-sm font-800 transition-all hover:scale-105"
                  >▼</button>
                </div>
              </GlassCard>
            );
          })}
          {features.length === 0 && (
            <p style={{ color: NAVY }} className="text-center opacity-60 font-600 py-8">No approved features yet — be the first to submit one!</p>
          )}
        </div>
      </div>
    </section>
  );
}

// ── Contact / Footer ──────────────────────────────────────────────────────────
function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await api.sendContactMessage(form.name, form.email, form.message);
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 5000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <footer id="contact" style={{ backgroundColor: "rgba(0,0,0,0.12)" }} className="py-20 px-4 mt-4">
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 style={{ color: NAVY }} className="text-2xl font-900 mb-2">Get in Touch</h2>
            <p style={{ color: NAVY }} className="text-sm font-600 opacity-70 mb-6">Questions, feedback, or just want to say hi?</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {[{ label: "Name", key: "name", type: "text", placeholder: "Your name" }, { label: "Email", key: "email", type: "email", placeholder: "your@email.com" }].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label style={{ color: NAVY }} className="block text-sm font-700 mb-1">{label}</label>
                  <input
                    type={type} required placeholder={placeholder}
                    value={form[key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    style={{ backgroundColor: "rgba(255,255,255,0.6)", color: NAVY, borderRadius: "0.75rem", border: "2px solid rgba(30,58,95,0.15)" }}
                    className="w-full px-4 py-3 text-sm font-600 outline-none"
                  />
                </div>
              ))}
              <div>
                <label style={{ color: NAVY }} className="block text-sm font-700 mb-1">Message</label>
                <textarea
                  required rows={4} placeholder="Tell us what's on your mind..."
                  value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                  style={{ backgroundColor: "rgba(255,255,255,0.6)", color: NAVY, borderRadius: "0.75rem", border: "2px solid rgba(30,58,95,0.15)", resize: "none" }}
                  className="w-full px-4 py-3 text-sm font-600 outline-none"
                />
              </div>
              <PinkBtn type="submit" disabled={status === "sending"} className="w-full py-3.5">
                {status === "sending" ? "Sending…" : status === "sent" ? "✓ Message sent!" : status === "error" ? "Failed — try again" : "Send Message"}
              </PinkBtn>
            </form>
          </div>
          <div className="flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src={appIcon} alt="WordsWave" className="w-12 h-12 rounded-2xl" />
                <div>
                  <div style={{ color: NAVY }} className="text-xl font-900">WordsWave</div>
                  <div style={{ color: NAVY }} className="text-xs font-600 opacity-60">Gamified Vocabulary Learning</div>
                </div>
              </div>
              <p style={{ color: NAVY }} className="text-sm font-600 opacity-70 leading-relaxed mb-6">
                Making vocabulary learning fun, one word at a time. Join thousands of learners building their word power daily with Fin!
              </p>
              <div className="flex items-center gap-3 mb-8">
                <a href="https://www.facebook.com/share/1BLGj52N6q/" target="_blank" rel="noopener noreferrer" style={{ backgroundColor: "#1877F2", color: "white", borderRadius: "0.75rem" }} className="w-11 h-11 flex items-center justify-center hover:opacity-80 transition-opacity" aria-label="Facebook">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                </a>
                <a href="https://www.instagram.com/wordswave_app/" target="_blank" rel="noopener noreferrer" style={{ background: "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)", color: "white", borderRadius: "0.75rem" }} className="w-11 h-11 flex items-center justify-center hover:opacity-80 transition-opacity" aria-label="Instagram">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                </a>
                <a href="https://www.tiktok.com/@words_wave" target="_blank" rel="noopener noreferrer" style={{ backgroundColor: "#010101", color: "white", borderRadius: "0.75rem" }} className="w-11 h-11 flex items-center justify-center hover:opacity-80 transition-opacity" aria-label="TikTok">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" /></svg>
                </a>
              </div>
            </div>
            <div style={{ borderTop: "2px solid rgba(30,58,95,0.12)" }} className="pt-5">
              <div className="flex flex-wrap gap-4 text-xs font-700 mb-3">
                <a href="https://seplat-bingo.web.app/privacy" target="_blank" rel="noopener noreferrer" style={{ color: NAVY }} className="hover:opacity-60 transition-opacity">Privacy Policy</a>
                <a href="https://seplat-bingo.web.app/terms" target="_blank" rel="noopener noreferrer" style={{ color: NAVY }} className="hover:opacity-60 transition-opacity">Terms of Service</a>
              </div>
              <p style={{ color: NAVY }} className="text-xs font-600 opacity-50">© {new Date().getFullYear()} WordsWave. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── Admin Panel ───────────────────────────────────────────────────────────────
function AdminPanel({ onClose }: { onClose: () => void }) {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [isFirstSetup, setIsFirstSetup] = useState(false);
  const [setupPw, setSetupPw] = useState("");
  const [setupConfirm, setSetupConfirm] = useState("");
  const [tab, setTab] = useState<"features" | "faqs" | "events" | "messages" | "subscribers" | "settings">("features");

  // features
  const [features, setFeatures] = useState<any[]>([]);
  // faqs
  const [faqs, setFaqs] = useState<any[]>([]);
  const [faqForm, setFaqForm] = useState({ question: "", answer: "" });
  const [editFaq, setEditFaq] = useState<any>(null);
  // events
  const [events, setEvents] = useState<any[]>([]);
  const [eventForm, setEventForm] = useState({ title: "", description: "", imageUrl: "", startDate: "", endDate: "", visible: true });
  const [editEvent, setEditEvent] = useState<any>(null);
  // messages
  const [messages, setMessages] = useState<any[]>([]);
  const [iosWaitlist, setIosWaitlist] = useState<{ email: string; joinedAt: string }[]>([]);
  const [newsletter, setNewsletter] = useState<{ email: string; joinedAt: string }[]>([]);
  // change password
  const [cpForm, setCpForm] = useState({ current: "", next: "", confirm: "" });
  const [cpLoading, setCpLoading] = useState(false);

  const loadMessages = useCallback(async () => {
    try {
      const msgs = await api.getContactMessages();
      setMessages(msgs);
    } catch { }
  }, []);

  const loadSubscribers = useCallback(async () => {
    try {
      const [ios, nl] = await Promise.all([api.getIosWaitlist(), api.getNewsletterSubscribers()]);
      setIosWaitlist([...ios].reverse());
      setNewsletter([...nl].reverse());
    } catch { }
  }, []);

  const loadAll = useCallback(() => {
    api.getPendingFeatures().then(setFeatures).catch(() => { });
    api.getFaqs().then(setFaqs).catch(() => { });
    api.getAllEvents().then(setEvents).catch(() => { });
    loadMessages();
    loadSubscribers();
  }, [loadSubscribers]);

  useEffect(() => { if (authed) loadAll(); }, [authed, loadAll]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    try {
      const stored = await api.getAdminPassword();
      if (stored === null) {
        setIsFirstSetup(true);
      } else if (pw === stored) {
        setAuthed(true);
      } else {
        alert("Wrong password");
      }
    } catch (err: any) {
      alert("Login error: " + (err?.message ?? String(err)));
    } finally {
      setLoginLoading(false);
    }
  };

  const firstSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (setupPw.length < 8) { toast("Password must be at least 8 characters", "error"); return; }
    if (setupPw !== setupConfirm) { toast("Passwords do not match", "error"); return; }
    setLoginLoading(true);
    try {
      await api.setAdminPassword(setupPw);
      setAuthed(true);
    } catch (err: any) {
      alert("Could not save password: " + (err?.message ?? String(err)));
    } finally {
      setLoginLoading(false);
    }
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cpForm.next !== cpForm.confirm) { toast("New passwords do not match", "error"); return; }
    if (cpForm.next.length < 8) { toast("Password must be at least 8 characters", "error"); return; }
    setCpLoading(true);
    try {
      const stored = await api.getAdminPassword();
      if (cpForm.current !== stored) { toast("Current password is incorrect", "error"); return; }
      await api.setAdminPassword(cpForm.next);
      toast("Password updated ✓", "ok");
      setCpForm({ current: "", next: "", confirm: "" });
    } catch (err: any) {
      toast("Error: " + (err?.message ?? "Failed to update password"), "error");
    } finally {
      setCpLoading(false);
    }
  };

  const withToast = async (fn: () => Promise<void>, successMsg: string) => {
    try { await fn(); toast(successMsg, "ok"); }
    catch (err: any) { toast("Error: " + (err?.message ?? "Check Supabase RLS policies"), "error"); }
  };

  const approveFeature = (id: string) => withToast(async () => { await api.updateFeature(id, { status: "approved" }); loadAll(); }, "Feature approved ✓");
  const rejectFeature = (id: string) => withToast(async () => { await api.updateFeature(id, { status: "rejected" }); loadAll(); }, "Feature rejected");
  const deleteFeature = (id: string) => withToast(async () => { await api.deleteFeature(id); loadAll(); }, "Deleted");

  const saveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    await withToast(async () => {
      if (editFaq) { await api.updateFaq(editFaq.id, faqForm); setEditFaq(null); }
      else { await api.createFaq(faqForm); }
      setFaqForm({ question: "", answer: "" });
      loadAll();
    }, "FAQ saved ✓");
  };
  const deleteFaq = (id: string) => withToast(async () => { await api.deleteFaq(id); loadAll(); }, "FAQ deleted");
  const startEditFaq = (f: any) => { setEditFaq(f); setFaqForm({ question: f.question, answer: f.answer }); };

  const saveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    await withToast(async () => {
      if (editEvent) { await api.updateEvent(editEvent.id, eventForm); setEditEvent(null); }
      else { await api.createEvent(eventForm); }
      setEventForm({ title: "", description: "", imageUrl: "", startDate: "", endDate: "", visible: true });
      loadAll();
    }, "Event saved ✓");
  };
  const deleteEvent = (id: string) => withToast(async () => { await api.deleteEvent(id); loadAll(); }, "Event deleted");
  const startEditEvent = (e: any) => { setEditEvent(e); setEventForm({ title: e.title, description: e.description, imageUrl: e.imageUrl || "", startDate: e.startDate || "", endDate: e.endDate || "", visible: e.visible !== false }); };
  const toggleVisible = (e: any) => withToast(async () => { await api.updateEvent(e.id, { visible: !e.visible }); loadAll(); }, "Visibility updated ✓");

  const inputStyle = { backgroundColor: "rgba(255,255,255,0.7)", color: NAVY, borderRadius: "0.75rem", border: "2px solid rgba(30,58,95,0.15)" };

  if (!authed) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
        <div style={{ backgroundColor: BG, borderRadius: "1.5rem" }} className="w-full max-w-sm p-8">
          {isFirstSetup ? (
            <>
              <h2 style={{ color: NAVY }} className="text-2xl font-900 mb-1 text-center">Create Admin Password</h2>
              <p style={{ color: NAVY }} className="text-xs font-600 opacity-50 mb-6 text-center">No password set yet. Create one to continue.</p>
              <form onSubmit={firstSetup} className="flex flex-col gap-4">
                <input type="password" required placeholder="New password (min 8 chars)" value={setupPw} onChange={(e) => setSetupPw(e.target.value)} style={inputStyle} className="w-full px-4 py-3 text-sm font-600 outline-none" />
                <input type="password" required placeholder="Confirm password" value={setupConfirm} onChange={(e) => setSetupConfirm(e.target.value)} style={inputStyle} className="w-full px-4 py-3 text-sm font-600 outline-none" />
                <PinkBtn type="submit" disabled={loginLoading} className="w-full py-3">{loginLoading ? "Saving…" : "Set Password & Enter"}</PinkBtn>
                <button type="button" onClick={onClose} style={{ color: NAVY }} className="text-sm font-700 text-center hover:opacity-70">Cancel</button>
              </form>
            </>
          ) : (
            <>
              <h2 style={{ color: NAVY }} className="text-2xl font-900 mb-6 text-center">Admin Login</h2>
              <form onSubmit={login} className="flex flex-col gap-4">
                <input type="password" placeholder="Password" value={pw} onChange={(e) => setPw(e.target.value)} style={inputStyle} className="w-full px-4 py-3 text-sm font-600 outline-none" />
                <PinkBtn type="submit" disabled={loginLoading} className="w-full py-3">{loginLoading ? "Verifying…" : "Login"}</PinkBtn>
                <button type="button" onClick={onClose} style={{ color: NAVY }} className="text-sm font-700 text-center hover:opacity-70">Cancel</button>
              </form>
            </>
          )}
        </div>
      </div>
    );
  }

  const subscriberCount = iosWaitlist.length + newsletter.length;
  const tabs: { key: typeof tab; label: string }[] = [{ key: "features", label: "Feature Requests" }, { key: "faqs", label: "FAQs" }, { key: "events", label: "Events" }, { key: "messages", label: `Messages${messages.length ? ` (${messages.length})` : ""}` }, { key: "subscribers", label: `Subscribers${subscriberCount ? ` (${subscriberCount})` : ""}` }, { key: "settings", label: "Settings" }];

  return (
    <div className="fixed inset-0 z-[100] overflow-auto" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
      <div style={{ backgroundColor: BG, minHeight: "100vh" }} className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 style={{ color: NAVY }} className="text-2xl font-900">Admin Panel</h2>
          <button onClick={onClose} style={{ color: NAVY }} className="font-800 text-xl hover:opacity-70">✕</button>
        </div>
        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{ backgroundColor: tab === t.key ? NAVY : "rgba(255,255,255,0.4)", color: tab === t.key ? "white" : NAVY, borderRadius: "0.75rem" }} className="px-4 py-2 font-800 text-sm transition-colors">
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Feature Requests tab ── */}
        {tab === "features" && (
          <div className="flex flex-col gap-3">
            {features.length === 0 && <p style={{ color: NAVY }} className="opacity-60 font-600 text-center py-8">No feature requests yet.</p>}
            {features.map((f) => (
              <GlassCard key={f.id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span style={{ color: NAVY }} className="font-800">{f.title}</span>
                      <span style={{ backgroundColor: "rgba(30,58,95,0.1)", color: NAVY, borderRadius: "999px" }} className="text-xs font-700 px-2 py-0.5">{f.category}</span>
                      <span style={{ borderRadius: "999px", backgroundColor: f.status === "approved" ? "#bbf7d0" : f.status === "rejected" ? "#fecaca" : "#fef3c7", color: "#111" }} className="text-xs font-700 px-2 py-0.5">{f.status}</span>
                    </div>
                    <p style={{ color: NAVY }} className="text-sm font-600 opacity-70">{f.description}</p>
                    <p style={{ color: NAVY }} className="text-xs opacity-40 mt-1">{new Date(f.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {f.status !== "approved" && <button onClick={() => approveFeature(f.id)} style={{ backgroundColor: "#86efac", color: "#15803d", borderRadius: "0.5rem" }} className="text-xs font-800 px-3 py-1.5">Approve</button>}
                    {f.status !== "rejected" && <button onClick={() => rejectFeature(f.id)} style={{ backgroundColor: "#fca5a5", color: "#b91c1c", borderRadius: "0.5rem" }} className="text-xs font-800 px-3 py-1.5">Reject</button>}
                    <button onClick={() => deleteFeature(f.id)} style={{ backgroundColor: "#f1f5f9", color: "#475569", borderRadius: "0.5rem" }} className="text-xs font-800 px-3 py-1.5">Delete</button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {/* ── FAQs tab ── */}
        {tab === "faqs" && (
          <div>
            <GlassCard className="p-5 mb-6">
              <h3 style={{ color: NAVY }} className="font-900 mb-4">{editFaq ? "Edit FAQ" : "Add FAQ"}</h3>
              <form onSubmit={saveFaq} className="flex flex-col gap-3">
                <input required placeholder="Question" value={faqForm.question} onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })} style={inputStyle} className="w-full px-4 py-3 text-sm font-600 outline-none" />
                <textarea required rows={3} placeholder="Answer" value={faqForm.answer} onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })} style={{ ...inputStyle, resize: "none" }} className="w-full px-4 py-3 text-sm font-600 outline-none" />
                <div className="flex gap-3">
                  <PinkBtn type="submit">{editFaq ? "Save Changes" : "Add FAQ"}</PinkBtn>
                  {editFaq && <button type="button" onClick={() => { setEditFaq(null); setFaqForm({ question: "", answer: "" }); }} style={{ color: NAVY }} className="text-sm font-700 hover:opacity-70">Cancel</button>}
                </div>
              </form>
            </GlassCard>
            <div className="flex flex-col gap-3">
              {faqs.map((f) => (
                <GlassCard key={f.id} className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p style={{ color: NAVY }} className="font-800 text-sm mb-1">{f.question}</p>
                      <p style={{ color: NAVY }} className="text-xs font-600 opacity-70 line-clamp-2">{f.answer}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => startEditFaq(f)} style={{ backgroundColor: "#bfdbfe", color: "#1e40af", borderRadius: "0.5rem" }} className="text-xs font-800 px-3 py-1.5">Edit</button>
                      <button onClick={() => deleteFaq(f.id)} style={{ backgroundColor: "#fca5a5", color: "#b91c1c", borderRadius: "0.5rem" }} className="text-xs font-800 px-3 py-1.5">Delete</button>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        )}

        {/* ── Events tab ── */}
        {tab === "events" && (
          <div>
            <GlassCard className="p-5 mb-6">
              <h3 style={{ color: NAVY }} className="font-900 mb-4">{editEvent ? "Edit Event" : "Add Event"}</h3>
              <form onSubmit={saveEvent} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input required placeholder="Event Title" value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} style={inputStyle} className="sm:col-span-2 w-full px-4 py-3 text-sm font-600 outline-none" />
                <textarea required rows={2} placeholder="Description" value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} style={{ ...inputStyle, resize: "none" }} className="sm:col-span-2 w-full px-4 py-3 text-sm font-600 outline-none" />
                <input placeholder="Image URL (optional)" value={eventForm.imageUrl} onChange={(e) => setEventForm({ ...eventForm, imageUrl: e.target.value })} style={inputStyle} className="sm:col-span-2 w-full px-4 py-3 text-sm font-600 outline-none" />
                <div>
                  <label style={{ color: NAVY }} className="block text-xs font-700 mb-1">Start Date</label>
                  <input type="date" value={eventForm.startDate} onChange={(e) => setEventForm({ ...eventForm, startDate: e.target.value })} style={inputStyle} className="w-full px-4 py-3 text-sm font-600 outline-none" />
                </div>
                <div>
                  <label style={{ color: NAVY }} className="block text-xs font-700 mb-1">End Date</label>
                  <input type="date" value={eventForm.endDate} onChange={(e) => setEventForm({ ...eventForm, endDate: e.target.value })} style={inputStyle} className="w-full px-4 py-3 text-sm font-600 outline-none" />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={eventForm.visible} onChange={(e) => setEventForm({ ...eventForm, visible: e.target.checked })} className="w-4 h-4" />
                  <span style={{ color: NAVY }} className="text-sm font-700">Visible on website</span>
                </label>
                <div className="sm:col-span-2 flex gap-3">
                  <PinkBtn type="submit">{editEvent ? "Save Changes" : "Create Event"}</PinkBtn>
                  {editEvent && <button type="button" onClick={() => { setEditEvent(null); setEventForm({ title: "", description: "", imageUrl: "", startDate: "", endDate: "", visible: true }); }} style={{ color: NAVY }} className="text-sm font-700 hover:opacity-70">Cancel</button>}
                </div>
              </form>
            </GlassCard>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {events.map((e) => (
                <GlassCard key={e.id} className="p-4">
                  {e.imageUrl && <img src={e.imageUrl} alt={e.title} className="w-full h-28 object-cover rounded-xl mb-3" />}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p style={{ color: NAVY }} className="font-800 text-sm">{e.title}</p>
                      <p style={{ color: NAVY }} className="text-xs font-600 opacity-70 mt-0.5 line-clamp-2">{e.description}</p>
                      <p style={{ color: NAVY }} className="text-xs opacity-40 mt-1">{e.startDate} {e.endDate && `→ ${e.endDate}`}</p>
                    </div>
                    <div className="flex flex-col gap-1.5 shrink-0">
                      <button onClick={() => toggleVisible(e)} style={{ backgroundColor: e.visible ? "#bbf7d0" : "#e2e8f0", color: e.visible ? "#15803d" : "#475569", borderRadius: "0.5rem" }} className="text-xs font-800 px-2 py-1">{e.visible ? "Visible" : "Hidden"}</button>
                      <button onClick={() => startEditEvent(e)} style={{ backgroundColor: "#bfdbfe", color: "#1e40af", borderRadius: "0.5rem" }} className="text-xs font-800 px-2 py-1">Edit</button>
                      <button onClick={() => deleteEvent(e.id)} style={{ backgroundColor: "#fca5a5", color: "#b91c1c", borderRadius: "0.5rem" }} className="text-xs font-800 px-2 py-1">Delete</button>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        )}

        {/* ── Subscribers tab ── */}
        {tab === "subscribers" && (
          <div className="flex flex-col gap-8">
            {/* iOS Waitlist */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 style={{ color: NAVY }} className="font-900 text-base">iOS Waitlist ({iosWaitlist.length})</h3>
                <button onClick={loadSubscribers} style={{ color: NAVY }} className="text-xs font-700 hover:opacity-70">↻ Refresh</button>
              </div>
              {iosWaitlist.length === 0 ? (
                <p style={{ color: NAVY }} className="opacity-50 font-600 text-sm text-center py-6">No iOS waitlist entries yet.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {iosWaitlist.map((e) => (
                    <GlassCard key={e.email} className="px-4 py-3 flex items-center justify-between gap-4">
                      <div>
                        <p style={{ color: NAVY }} className="font-700 text-sm">{e.email}</p>
                        <p style={{ color: NAVY }} className="text-xs opacity-40">{new Date(e.joinedAt).toLocaleDateString()}</p>
                      </div>
                      <button onClick={async () => { await api.deleteIosWaitlistEntry(e.email); loadSubscribers(); }} style={{ backgroundColor: "#fca5a5", color: "#b91c1c", borderRadius: "0.5rem" }} className="text-xs font-800 px-3 py-1.5 shrink-0">Remove</button>
                    </GlassCard>
                  ))}
                </div>
              )}
            </div>
            {/* Newsletter */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 style={{ color: NAVY }} className="font-900 text-base">Newsletter ({newsletter.length})</h3>
              </div>
              {newsletter.length === 0 ? (
                <p style={{ color: NAVY }} className="opacity-50 font-600 text-sm text-center py-6">No newsletter subscribers yet.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {newsletter.map((e) => (
                    <GlassCard key={e.email} className="px-4 py-3 flex items-center justify-between gap-4">
                      <div>
                        <p style={{ color: NAVY }} className="font-700 text-sm">{e.email}</p>
                        <p style={{ color: NAVY }} className="text-xs opacity-40">{new Date(e.joinedAt).toLocaleDateString()}</p>
                      </div>
                      <button onClick={async () => { await api.deleteNewsletterSubscriber(e.email); loadSubscribers(); }} style={{ backgroundColor: "#fca5a5", color: "#b91c1c", borderRadius: "0.5rem" }} className="text-xs font-800 px-3 py-1.5 shrink-0">Remove</button>
                    </GlassCard>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Settings tab ── */}
        {tab === "settings" && (
          <div className="max-w-md">
            <GlassCard className="p-6">
              <h3 style={{ color: NAVY }} className="font-900 text-lg mb-1">Change Password</h3>
              <p style={{ color: NAVY }} className="text-xs font-600 opacity-50 mb-5">Password is stored securely in Supabase.</p>
              <form onSubmit={changePassword} className="flex flex-col gap-4">
                <div>
                  <label style={{ color: NAVY }} className="block text-sm font-700 mb-1">Current Password</label>
                  <input type="password" required placeholder="Enter current password" value={cpForm.current} onChange={(e) => setCpForm({ ...cpForm, current: e.target.value })} style={inputStyle} className="w-full px-4 py-3 text-sm font-600 outline-none" />
                </div>
                <div>
                  <label style={{ color: NAVY }} className="block text-sm font-700 mb-1">New Password</label>
                  <input type="password" required placeholder="At least 8 characters" value={cpForm.next} onChange={(e) => setCpForm({ ...cpForm, next: e.target.value })} style={inputStyle} className="w-full px-4 py-3 text-sm font-600 outline-none" />
                </div>
                <div>
                  <label style={{ color: NAVY }} className="block text-sm font-700 mb-1">Confirm New Password</label>
                  <input type="password" required placeholder="Repeat new password" value={cpForm.confirm} onChange={(e) => setCpForm({ ...cpForm, confirm: e.target.value })} style={inputStyle} className="w-full px-4 py-3 text-sm font-600 outline-none" />
                </div>
                <PinkBtn type="submit" disabled={cpLoading}>{cpLoading ? "Saving…" : "Update Password"}</PinkBtn>
              </form>
            </GlassCard>
          </div>
        )}

        {/* ── Messages tab ── */}
        {tab === "messages" && (
          <div className="flex flex-col gap-3">
            <button onClick={loadMessages} style={{ color: NAVY }} className="text-xs font-700 self-end hover:opacity-70">↻ Refresh</button>
            {messages.length === 0 && <p style={{ color: NAVY }} className="opacity-60 font-600 text-center py-8">No messages yet.</p>}
            {messages.map((m) => (
              <GlassCard key={m.id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span style={{ color: NAVY }} className="font-800">{m.name}</span>
                      <span style={{ color: NAVY }} className="text-sm opacity-60">{m.email}</span>
                      {!m.read && <span style={{ backgroundColor: PINK_BTN, color: "white", borderRadius: "999px" }} className="text-xs font-700 px-2 py-0.5">New</span>}
                    </div>
                    <p style={{ color: NAVY }} className="text-sm font-600 opacity-80 leading-relaxed">{m.message}</p>
                    <p style={{ color: NAVY }} className="text-xs opacity-40 mt-1">{new Date(m.sentAt).toLocaleString()}</p>
                  </div>
                  <div className="flex flex-col gap-1.5 shrink-0">
                    {!m.read && <button onClick={() => { api.markMessageRead(m.id); loadMessages(); }} style={{ backgroundColor: "#bbf7d0", color: "#15803d", borderRadius: "0.5rem" }} className="text-xs font-800 px-3 py-1.5">Mark read</button>}
                    <button onClick={() => { api.deleteMessage(m.id); loadMessages(); }} style={{ backgroundColor: "#fca5a5", color: "#b91c1c", borderRadius: "0.5rem" }} className="text-xs font-800 px-3 py-1.5">Delete</button>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Sticky mobile CTA ────────────────────────────────────────────────────────
function StickyMobileCTA({ heroRef }: { heroRef: React.RefObject<HTMLElement | null> }) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(() => sessionStorage.getItem("cta_dismissed") === "1");

  useEffect(() => {
    if (dismissed) return;
    const el = heroRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting), { threshold: 0 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [dismissed, heroRef]);

  const dismiss = () => {
    sessionStorage.setItem("cta_dismissed", "1");
    setDismissed(true);
  };

  if (dismissed || !visible) return null;

  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center gap-3 px-4 py-3"
      style={{
        backgroundColor: NAVY,
        boxShadow: "0 -4px 24px rgba(0,0,0,0.22)",
        animation: "slideUpCTA 0.35s cubic-bezier(0.34,1.1,0.64,1) both",
      }}
    >
      <a
        href="https://play.google.com/store/apps/details?id=com.anyahuru.wordwave"
        target="_blank"
        rel="noopener noreferrer"
        style={{ backgroundColor: PINK_BTN, color: "white", borderRadius: "0.75rem" }}
        className="flex-1 flex items-center justify-center gap-2 py-3 font-800 text-sm hover:opacity-90 transition-opacity"
      >
        <img src={googlePlayIcon} alt="" className="w-4 h-4 object-contain" />
        Download on Google Play
      </a>
      <button onClick={dismiss} style={{ color: "rgba(255,255,255,0.6)" }} className="text-xl leading-none px-1 hover:text-white transition-colors" aria-label="Dismiss">×</button>
    </div>
  );
}

// ── App root ──────────────────────────────────────────────────────────────────
export default function App() {
  const [adminOpen, setAdminOpen] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const check = () => {
      if (window.location.hash === "#admin") setAdminOpen(true);
    };
    check();
    window.addEventListener("hashchange", check);
    return () => window.removeEventListener("hashchange", check);
  }, []);

  const closeAdmin = () => {
    setAdminOpen(false);
    history.replaceState(null, "", window.location.pathname + window.location.search);
  };

  // Probe DB connectivity once on mount so RLS issues surface immediately
  useEffect(() => {
    api.getFaqs().catch(() =>
      toast("Cannot reach database. Check Supabase RLS policies for kv_store_5a760fd9.", "error")
    );
  }, []);

  return (
    <div style={{ backgroundColor: BG, minHeight: "100vh", fontFamily: "'Nunito', sans-serif" }}>
      <ToastHost />
      <Navbar />
      <Hero sectionRef={heroRef} />
      <HowWeHelp />
      <Features />
      <Events />
      <Voting />
      <FAQ />
      <Contact />
      <StickyMobileCTA heroRef={heroRef} />
      {adminOpen && <AdminPanel onClose={closeAdmin} />}
    </div>
  );
}
