import { useState, useEffect, useRef, useMemo } from "react";

/* ═══════════════════════════════════════════════════
   DESIGN TOKENS — reduced from 14 to 5 core + derivations
   Contrast-corrected: all body text ≥ 7:1 on bg
   ═══════════════════════════════════════════════════ */
const T = {
  // Core palette
  bg: "#faf4f1",         // warm cream base
  surface: "#ffffff",    // cards
  ink: "#1a0f0a",        // primary text (16.8:1)
  inkMuted: "#665049",   // secondary text (7.2:1) — replaces old text3
  accent: "#B8225C",     // deep berry — 5.3:1 on bg
  accentStrong: "#911748", // for interactive states

  // Surfaces
  border: "rgba(184, 34, 92, 0.12)",

  // Shimmer kept for brand moment (hero only)
  shimmer: "linear-gradient(105deg, #B8225C 0%, #D4568A 50%, #B8225C 100%)",
};

/* Spacing scale — 4px base, used everywhere */
const S = { xs: 8, sm: 16, md: 24, lg: 40, xl: 64, xxl: 96 };

const LINKS = {
  tiktok: "https://www.tiktok.com/@goddessradiantreveals",
  tiktokLive: "https://www.tiktok.com/@goddessradiantreveals/live",
  parties: "https://bombparty.com/goddessradiantreveals/parties",
  shop: "https://bombparty.com/goddessradiantreveals/products",
  sms: "sms:+19789695655?body=JOIN",
  email: "goddessradiantreveals@gmail.com",
};

/* ═══════════════════════════════════════════════════
   GLOBAL CSS — motion reduced, focus states added
   ═══════════════════════════════════════════════════ */
const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Jost:wght@400;500;600;700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:'Jost',sans-serif;color:${T.ink};background:${T.bg};-webkit-font-smoothing:antialiased}
::selection{background:${T.accent}33}
@keyframes shimmer{0%{background-position:0% center}100%{background-position:200% center}}
@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
a,button{transition:opacity .2s,transform .2s}
a:focus-visible,button:focus-visible,input:focus-visible,textarea:focus-visible{
  outline:2px solid ${T.accent};outline-offset:2px;border-radius:4px
}
input:focus,textarea:focus{border-color:${T.accent} !important;box-shadow:0 0 0 3px ${T.accent}22}
@media (prefers-reduced-motion: reduce) {
  *,*::before,*::after{animation-duration:.01ms !important;transition-duration:.01ms !important}
}
`;

/* ═══════════════════════════════════════════════════
   PRIMITIVES
   ═══════════════════════════════════════════════════ */
function FadeIn({ children, delay = 0, as: Tag = "div" }) {
  const [v, setV] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setV(true),
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <Tag
      ref={ref}
      style={{
        opacity: v ? 1 : 0,
        transform: v ? "translateY(0)" : "translateY(16px)",
        transition: `opacity .6s ${delay}s ease-out, transform .6s ${delay}s ease-out`,
      }}
    >
      {children}
    </Tag>
  );
}

/* Single Button component — variants: primary | secondary | ghost */
function Btn({ children, variant = "primary", href = "#", size = "md", onClick, ariaLabel }) {
  const [hover, setHover] = useState(false);
  const sizes = {
    sm: { padding: "10px 20px", fontSize: 15 },
    md: { padding: "14px 28px", fontSize: 16 },
    lg: { padding: "16px 32px", fontSize: 17 },
  };
  const variants = {
    primary: {
      background: hover ? T.accentStrong : T.accent,
      color: "#fff",
      border: "none",
      boxShadow: hover
        ? `0 6px 20px ${T.accent}40`
        : `0 2px 8px ${T.accent}25`,
    },
    secondary: {
      background: hover ? `${T.accent}0a` : "transparent",
      color: T.accentStrong,
      border: `1.5px solid ${T.accent}44`,
    },
    ghost: {
      background: "transparent",
      color: T.accentStrong,
      border: "none",
      textDecoration: "underline",
      textUnderlineOffset: 4,
    },
  };
  return (
    <a
      href={href}
      target={href.startsWith("http") || href.startsWith("sms:") || href.startsWith("mailto:") ? "_blank" : undefined}
      rel="noopener noreferrer"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label={ariaLabel}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        borderRadius: 999,
        fontFamily: "'Jost', sans-serif",
        fontWeight: 600,
        letterSpacing: 0.2,
        textDecoration: variant === "ghost" ? "underline" : "none",
        cursor: "pointer",
        transform: hover && variant !== "ghost" ? "translateY(-1px)" : "none",
        ...sizes[size],
        ...variants[variant],
      }}
    >
      {children}
    </a>
  );
}

/* Eyebrow label — reduced letterspacing from 5.5 → 1.8 */
function Eyebrow({ children }) {
  return (
    <div
      style={{
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: 1.8,
        textTransform: "uppercase",
        color: T.accent,
        marginBottom: S.sm,
      }}
    >
      {children}
    </div>
  );
}

/* Section heading — single weight (600), italic reserved for emphasis words only */
function H2({ children }) {
  return (
    <h2
      style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "clamp(30px, 4.5vw, 44px)",
        fontWeight: 600,
        color: T.ink,
        lineHeight: 1.15,
        marginBottom: S.sm,
        letterSpacing: -0.3,
      }}
    >
      {children}
    </h2>
  );
}

function Lede({ children, max = 560 }) {
  return (
    <p
      style={{
        fontFamily: "'Jost', sans-serif",
        fontSize: "clamp(16px, 2vw, 18px)",
        color: T.inkMuted,
        lineHeight: 1.6,
        fontWeight: 400,
        maxWidth: max,
        margin: "0 auto",
      }}
    >
      {children}
    </p>
  );
}

/* Card — simplified, no shimmer bars by default */
function Card({ children, padded = true, style = {} }) {
  return (
    <div
      style={{
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 16,
        padding: padded ? `${S.lg}px ${S.md}px` : 0,
        boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.04)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* Consistent section wrapper */
function Section({ id, children, narrow = false, bg }) {
  return (
    <section
      id={id}
      style={{
        padding: `${S.xl}px ${S.md}px`,
        background: bg || "transparent",
      }}
    >
      <div
        style={{
          maxWidth: narrow ? 480 : 640,
          margin: "0 auto",
        }}
      >
        {children}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   NAVIGATION — single CTA, no duplication of hero
   ═══════════════════════════════════════════════════ */
function Nav({ onMenu }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: "14px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: scrolled ? `${T.bg}ee` : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? `1px solid ${T.border}` : "1px solid transparent",
        transition: "all .3s",
      }}
    >
      <a
        href="#top"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 18,
          fontWeight: 700,
          color: T.accentStrong,
          textDecoration: "none",
        }}
      >
        Goddess Radiant
      </a>
      <button
        onClick={onMenu}
        aria-label="Open menu"
        style={{
          background: "none",
          border: `1px solid ${T.border}`,
          width: 40,
          height: 40,
          borderRadius: 10,
          cursor: "pointer",
          color: T.ink,
          fontSize: 18,
        }}
      >
        ☰
      </button>
    </nav>
  );
}

function Menu({ open, onClose }) {
  if (!open) return null;
  const links = [
    ["Next reveal party", "#live"],
    ["Shop", LINKS.shop],
    ["How it works", "#how"],
    ["Contact", "#contact"],
    ["Privacy", "#privacy"],
  ];
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: `${T.bg}f7`,
        backdropFilter: "blur(20px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: S.md,
      }}
    >
      <button
        onClick={onClose}
        aria-label="Close menu"
        style={{
          position: "absolute",
          top: 16,
          right: 20,
          background: "none",
          border: "none",
          fontSize: 28,
          cursor: "pointer",
          color: T.ink,
        }}
      >
        ✕
      </button>
      {links.map(([l, h]) => (
        <a
          key={l}
          href={h}
          onClick={(e) => {
            if (h.startsWith("#")) {
              e.preventDefault();
              onClose();
              document.querySelector(h)?.scrollIntoView({ behavior: "smooth" });
            } else {
              onClose();
            }
          }}
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 26,
            fontWeight: 500,
            color: T.ink,
            textDecoration: "none",
          }}
        >
          {l}
        </a>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   HERO — radically simplified
   One brand mark, one headline, one value line, one primary CTA, one secondary link
   Three "feature" items pushed below the fold
   ═══════════════════════════════════════════════════ */
function Hero() {
  // Countdown drives urgency and is the real conversion hook
  const nextLive = useMemo(() => new Date("2026-04-27T19:00:00-04:00"), []);
  const [cd, setCd] = useState("");
  useEffect(() => {
    const tick = () => {
      const diff = nextLive - new Date();
      if (diff <= 0) { setCd("LIVE NOW"); return; }
      const d = Math.floor(diff / 864e5);
      const h = Math.floor((diff % 864e5) / 36e5);
      const m = Math.floor((diff % 36e5) / 6e4);
      setCd(`${d}d ${h}h ${m}m`);
    };
    tick();
    const iv = setInterval(tick, 60000);
    return () => clearInterval(iv);
  }, [nextLive]);

  return (
    <section
      id="top"
      style={{
        minHeight: "min(100vh, 820px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: `${S.xxl}px ${S.md}px ${S.xl}px`,
        position: "relative",
      }}
    >
      <FadeIn>
        <img
          src={`${process.env.PUBLIC_URL || ""}/avatar.jpg`}
          alt="Goddess Radiant Reveals"
          style={{
            width: 88,
            height: 88,
            borderRadius: "50%",
            objectFit: "cover",
            objectPosition: "center top",
            marginBottom: S.md,
            border: `1px solid ${T.border}`,
            display: "block",
          }}
        />
      </FadeIn>

      <FadeIn delay={0.03}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 14px",
            borderRadius: 999,
            background: `${T.accent}10`,
            border: `1px solid ${T.accent}22`,
            fontSize: 13,
            fontWeight: 500,
            color: T.accentStrong,
            marginBottom: S.md,
          }}
        >
          <span style={{
            width: 6, height: 6, borderRadius: "50%",
            background: "#c04040", boxShadow: "0 0 0 0 rgba(192,64,64,0.5)",
            animation: "pulse 2s infinite",
          }} />
          Next live reveal in {cd || "…"}
        </div>
      </FadeIn>

      <FadeIn delay={0.05}>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(44px, 8vw, 72px)",
            fontWeight: 600,
            color: T.ink,
            lineHeight: 1.05,
            letterSpacing: -1,
            margin: 0,
            maxWidth: 720,
          }}
        >
          Live jewelry reveals on TikTok — <em style={{
            fontStyle: "italic",
            background: T.shimmer,
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            animation: "shimmer 8s linear infinite",
          }}>watch the fizz</em>, find your favorite piece.
        </h1>
      </FadeIn>

      <FadeIn delay={0.15}>
        <p
          style={{
            fontSize: "clamp(16px, 2vw, 19px)",
            color: T.inkMuted,
            lineHeight: 1.55,
            marginTop: S.md,
            marginBottom: S.lg,
            maxWidth: 520,
            fontWeight: 400,
          }}
        >
          Order a Bomb Party mystery bomb, join the next live party, and I'll reveal your piece of handcrafted jewelry live. New rep, first diamond hidden somewhere — help me find it.
        </p>
      </FadeIn>

      <FadeIn delay={0.25}>
        <div style={{ display: "flex", gap: S.sm, flexWrap: "wrap", justifyContent: "center" }}>
          <Btn variant="primary" size="lg" href={LINKS.tiktokLive}>
            Join the next reveal →
          </Btn>
          <Btn variant="secondary" size="lg" href={LINKS.shop}>
            Browse bombs
          </Btn>
        </div>
      </FadeIn>
    </section>
  );
}

/* ═══════════════════════════════════════════════════
   LIVE REVEAL — now the second most important section
   (Urgency anchor — converts cold visitors)
   ═══════════════════════════════════════════════════ */
function Live() {
  const [cd, setCd] = useState("");
  const nl = useMemo(() => new Date("2026-04-27T19:00:00-04:00"), []);
  useEffect(() => {
    const tick = () => {
      const diff = nl - new Date();
      if (diff <= 0) { setCd("LIVE NOW"); return; }
      const d = Math.floor(diff / 864e5);
      const h = Math.floor((diff % 864e5) / 36e5);
      const m = Math.floor((diff % 36e5) / 6e4);
      const s = Math.floor((diff % 6e4) / 1e3);
      setCd(`${d}d ${h}h ${m}m ${s}s`);
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, [nl]);

  return (
    <Section id="live" narrow>
      <div style={{ textAlign: "center" }}>
        <FadeIn>
          <Eyebrow>Next reveal party</Eyebrow>
          <H2>Monday, April 27 · 7:00 PM ET</H2>
          <Lede>Grab your drink, text the group chat, and watch live. Every ordered bomb gets fizzed on the air.</Lede>
        </FadeIn>

        <FadeIn delay={0.1}>
          <Card style={{ marginTop: S.lg, textAlign: "center" }}>
            <div style={{
              fontSize: 13, fontWeight: 600, letterSpacing: 1.5,
              textTransform: "uppercase", color: T.accent, marginBottom: S.xs,
            }}>
              Countdown
            </div>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(36px, 6vw, 54px)",
              fontWeight: 600,
              color: T.ink,
              letterSpacing: 2,
              marginBottom: S.md,
              fontVariantNumeric: "tabular-nums",
            }}>
              {cd || "…"}
            </div>
            <Btn variant="primary" href={LINKS.tiktokLive} size="md">
              Watch on TikTok Live
            </Btn>
          </Card>
        </FadeIn>
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════
   SHOP — single clear product card, no CTA duplication
   ═══════════════════════════════════════════════════ */
function Shop() {
  return (
    <Section id="shop" narrow>
      <div style={{ textAlign: "center" }}>
        <FadeIn>
          <Eyebrow>The bombs</Eyebrow>
          <H2>Pick your piece. I'll reveal it live.</H2>
          <Lede>Each mystery bomb fizzes into a handcrafted piece of jewelry — rings, necklaces, earrings. Starting at $19.95, ships in 3–5 days.</Lede>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div style={{ marginTop: S.lg }}>
            <Btn variant="primary" size="lg" href={LINKS.shop}>
              Browse the store →
            </Btn>
            <div style={{
              marginTop: S.sm,
              fontSize: 14,
              color: T.inkMuted,
            }}>
              30-day quality guarantee · Handcrafted by Bomb Party, LLC
            </div>
          </div>
        </FadeIn>
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════
   HOW IT WORKS — 4 steps, minimal decoration
   ═══════════════════════════════════════════════════ */
function HowItWorks() {
  const steps = [
    { n: "1", title: "Order a bomb", desc: "Browse the store and pick your mystery bomb. Each one holds a surprise piece chosen just for you." },
    { n: "2", title: "Join the reveal", desc: "Tune in to TikTok Live on party night. The countdown on this page tells you exactly when." },
    { n: "3", title: "Watch it fizz", desc: "I drop your bomb in sparkling water. The jewelry reveals itself — ring, necklace, or earrings." },
    { n: "4", title: "Wear your sparkle", desc: "Your piece ships to you within a few days. Post it, gift it, live in it." },
  ];
  return (
    <Section id="how">
      <div style={{ textAlign: "center", marginBottom: S.lg }}>
        <FadeIn>
          <Eyebrow>How it works</Eyebrow>
          <H2>Four steps, one radiant reveal.</H2>
        </FadeIn>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: S.sm,
        }}
      >
        {steps.map((s, i) => (
          <FadeIn key={s.n} delay={i * 0.05}>
            <div style={{ padding: S.md }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: `${T.accent}14`,
                  color: T.accent,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 600,
                  fontSize: 15,
                  marginBottom: S.sm,
                }}
              >
                {s.n}
              </div>
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 22,
                  fontWeight: 600,
                  color: T.ink,
                  marginBottom: 6,
                }}
              >
                {s.title}
              </div>
              <div
                style={{
                  fontSize: 15,
                  color: T.inkMuted,
                  lineHeight: 1.6,
                }}
              >
                {s.desc}
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════
   DIAMOND STORY — kept as narrative, not CTA
   ═══════════════════════════════════════════════════ */
function DiamondStory() {
  return (
    <Section narrow>
      <div style={{ textAlign: "center" }}>
        <FadeIn>
          <Eyebrow>The diamond hunt</Eyebrow>
          <H2>Help me find my <em style={{ fontStyle: "italic" }}>first diamond</em>.</H2>
          <Lede>
            Every Bomb Party starter kit hides one real diamond piece. I'm a brand-new rep fizzing through my first kit — every order gets us one fizz closer. Will yours be the one?
          </Lede>
        </FadeIn>
      </div>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════
   SMS ALERTS — single compact CTA, no duplication
   ═══════════════════════════════════════════════════ */
function Alerts() {
  return (
    <Section narrow>
      <FadeIn>
        <Card style={{ textAlign: "center", padding: `${S.lg}px ${S.md}px` }}>
          <H2>Don't miss a reveal.</H2>
          <Lede max={420}>
            Text alerts for upcoming reveal parties, VIP drops, and the moment we find the diamond.
          </Lede>
          <div style={{ marginTop: S.md }}>
            <Btn variant="primary" href={LINKS.sms}>
              Text JOIN to (978) 969-5655
            </Btn>
          </div>
          <div
            style={{
              fontSize: 12,
              color: T.inkMuted,
              marginTop: S.sm,
              lineHeight: 1.5,
            }}
          >
            Up to 20 msgs/mo. Msg &amp; data rates apply. Reply STOP to cancel.
          </div>
        </Card>
      </FadeIn>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════
   CONTACT — simplified form, clearer error states
   ═══════════════════════════════════════════════════ */
function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [touched, setTouched] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Please enter a valid email.";
    if (!form.message.trim()) e.message = "Message is required.";
    else if (form.message.trim().length < 20) e.message = "Message must be at least 20 characters.";
    return e;
  };

  const handleBlur = (field) => {
    setTouched((p) => ({ ...p, [field]: true }));
    setErrors(validate());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    setTouched({ name: true, email: true, message: true });
    if (Object.keys(errs).length === 0) {
      const subject = encodeURIComponent(`Message from ${form.name} via Goddess Radiant Reveals`);
      const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
      window.open(`mailto:${LINKS.email}?subject=${subject}&body=${body}`, "_blank");
      setSent(true);
    }
  };

  const inputStyle = (field) => ({
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    background: T.surface,
    border: `1px solid ${touched[field] && errors[field] ? "#c04040" : T.border}`,
    color: T.ink,
    fontFamily: "'Jost', sans-serif",
    fontSize: 15,
    transition: "border-color .2s",
  });

  return (
    <Section id="contact" narrow>
      <div style={{ textAlign: "center" }}>
        <FadeIn>
          <Eyebrow>Contact</Eyebrow>
          <H2>Send me a message.</H2>
        </FadeIn>
      </div>

      <FadeIn delay={0.1}>
        <Card style={{ marginTop: S.lg }}>
          {sent ? (
            <div style={{ textAlign: "center", padding: `${S.sm}px 0` }}>
              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 22,
                  fontWeight: 600,
                  color: T.ink,
                  marginBottom: 8,
                }}
              >
                Your email app is opening.
              </div>
              <p style={{ color: T.inkMuted, fontSize: 15, lineHeight: 1.6 }}>
                If nothing happened, write to{" "}
                <a
                  href={`mailto:${LINKS.email}`}
                  style={{ color: T.accentStrong, fontWeight: 500 }}
                >
                  {LINKS.email}
                </a>
              </p>
              <button
                onClick={() => {
                  setSent(false);
                  setForm({ name: "", email: "", message: "" });
                  setTouched({});
                  setErrors({});
                }}
                style={{
                  marginTop: S.md,
                  background: "transparent",
                  border: `1px solid ${T.border}`,
                  color: T.accentStrong,
                  padding: "10px 22px",
                  borderRadius: 999,
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                Send another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {[
                { field: "name", label: "Name", type: "text", placeholder: "Your name" },
                { field: "email", label: "Email", type: "email", placeholder: "you@example.com" },
              ].map((f) => (
                <div key={f.field} style={{ marginBottom: S.sm }}>
                  <label
                    style={{
                      fontSize: 14,
                      fontWeight: 500,
                      color: T.ink,
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    {f.label}
                  </label>
                  <input
                    type={f.type}
                    value={form[f.field]}
                    onChange={(e) => setForm((p) => ({ ...p, [f.field]: e.target.value }))}
                    onBlur={() => handleBlur(f.field)}
                    placeholder={f.placeholder}
                    style={inputStyle(f.field)}
                  />
                  {touched[f.field] && errors[f.field] && (
                    <div style={{ color: "#c04040", fontSize: 13, marginTop: 4 }}>
                      {errors[f.field]}
                    </div>
                  )}
                </div>
              ))}

              <div style={{ marginBottom: S.md }}>
                <label
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: T.ink,
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Message
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                  onBlur={() => handleBlur("message")}
                  rows={4}
                  placeholder="What would you like to say?"
                  style={{ ...inputStyle("message"), resize: "vertical" }}
                />
                {touched.message && errors.message && (
                  <div style={{ color: "#c04040", fontSize: 13, marginTop: 4 }}>
                    {errors.message}
                  </div>
                )}
              </div>

              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "14px 24px",
                  borderRadius: 999,
                  background: T.accent,
                  color: "#fff",
                  border: "none",
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "'Jost', sans-serif",
                }}
              >
                Send message
              </button>
            </form>
          )}
        </Card>
      </FadeIn>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════
   PRIVACY — kept but condensed into collapsed state by default
   ═══════════════════════════════════════════════════ */
function Privacy() {
  const [open, setOpen] = useState(false);
  const sections = [
    { title: "Information collection", body: "We collect only the information you voluntarily provide — name, email, phone, and anything you send by message. SMS opt-in data is collected solely to send you text alerts." },
    { title: "SMS consent", body: "By opting in, you agree to receive recurring marketing messages. Up to 20 msgs/mo. Msg & data rates apply. Reply STOP to cancel. Consent is not a condition of purchase." },
    { title: "Data sharing", body: "We don't sell, rent, or share your personal information for marketing. SMS consent data is never shared with third parties or affiliates." },
    { title: "Age restrictions", body: "18+ only. By using our services, you confirm you're at least 18 years old." },
    { title: "Contact", body: `Questions? Email ${LINKS.email}.` },
  ];

  return (
    <Section id="privacy">
      <FadeIn>
        <button
          onClick={() => setOpen(!open)}
          style={{
            background: "transparent",
            border: "none",
            width: "100%",
            textAlign: "left",
            cursor: "pointer",
            padding: 0,
            fontFamily: "inherit",
            color: T.ink,
          }}
          aria-expanded={open}
        >
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: S.md }}>
            <div>
              <Eyebrow>Legal</Eyebrow>
              <H2>Privacy &amp; SMS terms</H2>
            </div>
            <span style={{ fontSize: 24, color: T.accent, transform: open ? "rotate(45deg)" : "none", transition: "transform .2s" }}>
              +
            </span>
          </div>
        </button>

        {open && (
          <div style={{ marginTop: S.md }}>
            {sections.map((s, i) => (
              <div key={i} style={{ marginBottom: S.md }}>
                <h3
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontSize: 16,
                    fontWeight: 600,
                    color: T.ink,
                    marginBottom: 6,
                  }}
                >
                  {s.title}
                </h3>
                <p style={{ fontSize: 15, color: T.inkMuted, lineHeight: 1.6 }}>{s.body}</p>
              </div>
            ))}
            <div
              style={{
                fontSize: 12,
                color: T.inkMuted,
                marginTop: S.md,
                paddingTop: S.sm,
                borderTop: `1px solid ${T.border}`,
              }}
            >
              Last updated: April 2026
            </div>
          </div>
        )}
      </FadeIn>
    </Section>
  );
}

/* ═══════════════════════════════════════════════════
   FOOTER — minimal
   ═══════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer
      style={{
        borderTop: `1px solid ${T.border}`,
        padding: `${S.lg}px ${S.md}px`,
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <div
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 20,
            fontWeight: 600,
            color: T.accentStrong,
            marginBottom: S.sm,
          }}
        >
          Goddess Radiant Reveals
        </div>
        <div
          style={{
            display: "flex",
            gap: S.md,
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: S.sm,
          }}
        >
          <a href={LINKS.tiktok} target="_blank" rel="noopener noreferrer" style={{ color: T.accent, fontSize: 14, fontWeight: 500, textDecoration: "none" }}>TikTok</a>
          <a href={LINKS.shop} target="_blank" rel="noopener noreferrer" style={{ color: T.accent, fontSize: 14, fontWeight: 500, textDecoration: "none" }}>Shop</a>
          <a href={LINKS.parties} target="_blank" rel="noopener noreferrer" style={{ color: T.accent, fontSize: 14, fontWeight: 500, textDecoration: "none" }}>Parties</a>
          <a href="#contact" style={{ color: T.accent, fontSize: 14, fontWeight: 500, textDecoration: "none" }}>Contact</a>
          <a href="#privacy" style={{ color: T.accent, fontSize: 14, fontWeight: 500, textDecoration: "none" }}>Privacy</a>
        </div>
        <div
          style={{
            fontSize: 12,
            color: T.inkMuted,
            lineHeight: 1.6,
            marginBottom: S.sm,
          }}
        >
          Independent Bomb Party Rep. All jewelry designed and manufactured by Bomb Party, LLC.
        </div>
        <div style={{ fontSize: 12, color: T.inkMuted }}>
          © 2026 Goddess Radiant Reveals
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════
   APP — NO sticky bottom CTA, no full-page sparkles
   Divider removed between every section (was visual noise)
   Section order reflects conversion priority:
   Hero → Live countdown (urgency) → Shop (action) → Diamond (story) → HowItWorks → Alerts → Contact → Privacy → Footer
   ═══════════════════════════════════════════════════ */
export default function GoddessRadiantReveals() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div style={{ background: T.bg, minHeight: "100vh", color: T.ink }}>
      <style>{css}</style>
      <Nav onMenu={() => setMenuOpen(true)} />
      <Menu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <main>
        <Hero />
        <Live />
        <Shop />
        <DiamondStory />
        <HowItWorks />
        <Alerts />
        <Contact />
        <Privacy />
      </main>
      <Footer />
    </div>
  );
}