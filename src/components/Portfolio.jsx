import { useState, useEffect, useRef, useCallback } from "react";
import { Mail, Linkedin, Github, ChevronDown, ExternalLink, ArrowRight, BookOpen, Users, Award, Briefcase, GraduationCap, Code, Layers, Target, TrendingUp, Calendar, MapPin, Download, Menu, X, Sun, Moon } from "lucide-react";

// ─── Intersection Observer Hook ───
function useInView(options = {}) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsInView(true); obs.unobserve(el); } },
      { threshold: 0.15, ...options }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, isInView];
}

// ─── Animated Counter ───
function Counter({ end, suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView();
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end, duration]);
  return <span ref={ref}>{count}{suffix}</span>;
}

// ─── Reveal Wrapper ───
function Reveal({ children, delay = 0, className = "", direction = "up" }) {
  const [ref, inView] = useInView();
  const transforms = { up: "translateY(40px)", down: "translateY(-40px)", left: "translateX(40px)", right: "translateX(-40px)", none: "none" };
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "none" : transforms[direction],
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

// ─── Navigation ───
function Nav({ activeSection, darkMode, setDarkMode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const links = [
    { id: "about", label: "About" },
    { id: "work", label: "Work" },
    { id: "expertise", label: "Expertise" },
    { id: "blog", label: "Insights" },
    { id: "contact", label: "Contact" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <nav
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled ? "var(--nav-bg)" : "transparent",
        backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
        borderBottom: scrolled ? "1px solid var(--border)" : "1px solid transparent",
        transition: "all 0.4s ease",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <button onClick={() => scrollTo("hero")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "var(--accent)", letterSpacing: "-0.02em" }}>JJ</span>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 14, color: "var(--text-secondary)", fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase" }}>León G.</span>
        </button>

        {/* Desktop Nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 32 }} className="desktop-nav">
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontFamily: "var(--font-body)", fontSize: 13, fontWeight: 500,
                color: activeSection === l.id ? "var(--accent)" : "var(--text-secondary)",
                letterSpacing: "0.04em", textTransform: "uppercase",
                transition: "color 0.3s",
                position: "relative",
              }}
            >
              {l.label}
              {activeSection === l.id && (
                <span style={{ position: "absolute", bottom: -4, left: "50%", transform: "translateX(-50%)", width: 4, height: 4, borderRadius: "50%", background: "var(--accent)" }} />
              )}
            </button>
          ))}
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{ background: "none", border: "1px solid var(--border)", borderRadius: 8, padding: "6px 8px", cursor: "pointer", color: "var(--text-secondary)", display: "flex", alignItems: "center" }}
          >
            {darkMode ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="mobile-menu-btn" style={{ background: "none", border: "none", color: "var(--text-primary)", cursor: "pointer", display: "none" }}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Overlay */}
      {menuOpen && (
        <>
          {/* Dark backdrop */}
          <div
            onClick={() => setMenuOpen(false)}
            style={{
              position: "fixed", inset: 0, top: 0,
              background: "rgba(0, 0, 0, 0.7)",
              backdropFilter: "blur(8px)",
              zIndex: 98,
            }}
          />
          {/* Menu content */}
          <div style={{
            position: "fixed", inset: 0, top: 64,
            display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 32,
            zIndex: 99, padding: 32,
          }}>
            {links.map((l) => (
              <button key={l.id} onClick={() => scrollTo(l.id)} style={{
                background: "none", border: "none", fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 600,
                color: activeSection === l.id ? "var(--accent)" : "#ffffff", cursor: "pointer", textAlign: "center",
                transition: "color 0.3s, transform 0.2s",
              }}
                onMouseEnter={(e) => { e.target.style.color = "var(--accent)"; e.target.style.transform = "scale(1.05)"; }}
                onMouseLeave={(e) => { e.target.style.color = activeSection === l.id ? "var(--accent)" : "#ffffff"; e.target.style.transform = "none"; }}
              >
                {l.label}
              </button>
            ))}
          </div>
        </>
      )}
    </nav>
  );
}

// ─── Hero ───
function Hero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  const handleMouse = useCallback((e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    setMousePos({ x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height });
  }, []);

  const roles = ["Certification Program Designer", "Partner Enablement Leader", "Technical Credentialing Expert", "AI-Fluent L&D Strategist"];
  const [roleIdx, setRoleIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    const role = roles[roleIdx];
    if (typing) {
      if (displayed.length < role.length) {
        const t = setTimeout(() => setDisplayed(role.slice(0, displayed.length + 1)), 60);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setTyping(false), 2000);
        return () => clearTimeout(t);
      }
    } else {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 30);
        return () => clearTimeout(t);
      } else {
        setRoleIdx((roleIdx + 1) % roles.length);
        setTyping(true);
      }
    }
  }, [displayed, typing, roleIdx]);

  return (
    <section
      id="hero"
      ref={heroRef}
      onMouseMove={handleMouse}
      style={{
        minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center",
        position: "relative", overflow: "hidden", padding: "120px 24px 80px",
      }}
    >
      {/* Gradient orb that follows mouse */}
      <div style={{
        position: "absolute",
        width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)",
        left: `${mousePos.x * 100}%`, top: `${mousePos.y * 100}%`,
        transform: "translate(-50%, -50%)",
        opacity: 0.15, pointerEvents: "none",
        transition: "left 0.8s ease-out, top 0.8s ease-out",
      }} />

      {/* Grid pattern overlay */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.03,
        backgroundImage: `linear-gradient(var(--text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
        pointerEvents: "none",
      }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", position: "relative", zIndex: 1 }}>
        <Reveal delay={0.1}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <span style={{ width: 40, height: 1, background: "var(--accent)" }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Available for opportunities
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <h1 style={{
            fontFamily: "var(--font-display)", fontSize: "clamp(48px, 8vw, 96px)", fontWeight: 700,
            lineHeight: 1.05, letterSpacing: "-0.03em", color: "var(--text-primary)", margin: 0,
          }}>
            Juan José{" "}
            <span style={{
              background: "linear-gradient(135deg, var(--accent), var(--accent-secondary))",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              León G.
            </span>
          </h1>
        </Reveal>

        <Reveal delay={0.35}>
          <div style={{
            fontFamily: "var(--font-mono)", fontSize: "clamp(16px, 2.5vw, 22px)",
            color: "var(--text-secondary)", marginTop: 20, height: 32, display: "flex", alignItems: "center",
          }}>
            <span>{displayed}</span>
            <span style={{ width: 2, height: "1.2em", background: "var(--accent)", marginLeft: 2, animation: "blink 1s step-end infinite" }} />
          </div>
        </Reveal>

        <Reveal delay={0.5}>
          <p style={{
            fontFamily: "var(--font-body)", fontSize: "clamp(16px, 1.8vw, 19px)", lineHeight: 1.7,
            color: "var(--text-tertiary)", maxWidth: 600, marginTop: 28, marginBottom: 40,
          }}>
            9+ years designing certification programs, competency frameworks, and partner enablement systems for global technology organizations. AI-fluent. Open to remote opportunities.
          </p>
        </Reveal>

        <Reveal delay={0.65}>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a href="#work" onClick={(e) => { e.preventDefault(); document.getElementById("work")?.scrollIntoView({ behavior: "smooth" }); }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 12,
                background: "var(--accent)", color: "var(--bg-primary)", fontFamily: "var(--font-body)",
                fontSize: 15, fontWeight: 600, textDecoration: "none", border: "none", cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 30px var(--accent-glow)"; }}
              onMouseLeave={(e) => { e.target.style.transform = "none"; e.target.style.boxShadow = "none"; }}
            >
              View My Work <ArrowRight size={16} />
            </a>
            <a href="#contact" onClick={(e) => { e.preventDefault(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 28px", borderRadius: 12,
                background: "transparent", color: "var(--text-primary)", fontFamily: "var(--font-body)",
                fontSize: 15, fontWeight: 600, textDecoration: "none", border: "1px solid var(--border)",
                cursor: "pointer", transition: "border-color 0.3s, background 0.3s",
              }}
              onMouseEnter={(e) => { e.target.style.borderColor = "var(--accent)"; e.target.style.background = "var(--card-hover)"; }}
              onMouseLeave={(e) => { e.target.style.borderColor = "var(--border)"; e.target.style.background = "transparent"; }}
            >
              <Download size={16} /> Resume
            </a>
          </div>
        </Reveal>

        {/* Stats bar */}
        <Reveal delay={0.8}>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 32, marginTop: 80, paddingTop: 40, borderTop: "1px solid var(--border)",
          }}>
            {[
              { n: 9, s: "+", label: "Years in L&D" },
              { n: 900, s: "", label: "Person Workforce" },
              { n: 5, s: "+", label: "Partner Platforms" },
              { n: 4, s: "", label: "Countries Covered" },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                  <Counter end={s.n} suffix={s.s} />
                </div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-tertiary)", marginTop: 4, letterSpacing: "0.02em" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* Scroll indicator */}
      <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, animation: "float 3s ease-in-out infinite" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-tertiary)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Scroll</span>
        <ChevronDown size={16} style={{ color: "var(--text-tertiary)" }} />
      </div>
    </section>
  );
}

// ─── About ───
function About() {
  return (
    <section id="about" style={{ padding: "120px 24px", position: "relative" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Reveal>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--accent)", letterSpacing: "0.1em" }}>01</span>
            <span style={{ width: 40, height: 1, background: "var(--border)" }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-tertiary)", letterSpacing: "0.06em", textTransform: "uppercase" }}>About</span>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }} className="about-grid">
          <div>
            <Reveal delay={0.1}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.02em", color: "var(--text-primary)", margin: "0 0 28px" }}>
                Building teams that<br />
                <span style={{ color: "var(--accent)" }}>build great things.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 17, lineHeight: 1.75, color: "var(--text-secondary)", marginBottom: 20 }}>
                I'm an MSc. Computer Science Engineer and L&D Leader with 9+ years designing and scaling certification programs, competency frameworks, and partner enablement systems for global technology organizations. At Verndale, I own end-to-end credentialing for a ~900-person workforce across Sitecore, Optimizely, Shopify, Webflow, and Vercel.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <p style={{ fontFamily: "var(--font-body)", fontSize: 17, lineHeight: 1.75, color: "var(--text-secondary)", marginBottom: 20 }}>
                My deep technical fluency enables direct collaboration with engineering and product SMEs to translate complex platform capabilities into rigorous, tiered certification content. I also teach at UDLA in Quito, embedding responsible AI usage and modern software engineering into academic curriculum. Active Claude user, AI Fluency certified.
              </p>
            </Reveal>
            <Reveal delay={0.4}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 32 }}>
                <MapPin size={16} style={{ color: "var(--accent)" }} />
                <span style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text-tertiary)" }}>Quito, Ecuador · Open to Remote</span>
              </div>
            </Reveal>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { icon: <Briefcase size={20} />, title: "Verndale", sub: "Senior Technical Trainer", period: "Sept 2016 – Present", accent: true },
              { icon: <GraduationCap size={20} />, title: "UDLA", sub: "Lecturer · Web Engineering", period: "2016 – Present" },
              { icon: <Award size={20} />, title: "MSc. Eng. Numeric Media", sub: "ESIEE Paris, France", period: "2006 – 2008" },
              { icon: <Code size={20} />, title: "Mazarine Digital", sub: "Interactive Developer · Paris", period: "2007 – 2008" },
              { icon: <Layers size={20} />, title: "Mindsoft", sub: "CEO / Co-founder", period: "2003 – 2016" },
            ].map((item, i) => (
              <Reveal key={i} delay={0.15 * i}>
                <div style={{
                  padding: 20, borderRadius: 14, border: "1px solid var(--border)", background: "var(--card-bg)",
                  display: "flex", alignItems: "flex-start", gap: 16,
                  transition: "border-color 0.3s, transform 0.2s",
                  cursor: "default",
                }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "none"; }}
                >
                  <div style={{ color: item.accent ? "var(--accent)" : "var(--text-tertiary)", marginTop: 2 }}>{item.icon}</div>
                  <div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 600, color: "var(--text-primary)" }}>{item.title}</div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text-secondary)", marginTop: 2 }}>{item.sub}</div>
                    {item.period && <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-tertiary)", marginTop: 6 }}>{item.period}</div>}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Work / Portfolio (Bento Grid) ───
function Work() {
  const [hoveredCard, setHoveredCard] = useState(null);

  const projects = [
    {
      id: 1, span: "wide",
      tag: "CREDENTIALING", title: "Technical Certification Program",
      desc: "Owned end-to-end design and scaling of credentialing programs across a ~900-person global workforce, defining tiered certification levels, renewal criteria, and budget-aware credential allocation aligned with partner program requirements — contributing to sustained partner tier growth.",
      metrics: [{ v: "~900", l: "Person Workforce" }, { v: "5+", l: "Partner Platforms" }, { v: "Tiered", l: "Certification Levels" }],
      color: "var(--accent)",
      icon: <Award size={24} />,
    },
    {
      id: 2, span: "normal",
      tag: "PARTNER ENABLEMENT", title: "Multi-Platform Vendor Training",
      desc: "Designed and delivered enablement programs across Sitecore, Optimizely, Shopify, Webflow, and Vercel — coordinating with credentialing vendors to align training with certification requirements and enable delivery teams to achieve credentials.",
      metrics: [{ v: "5", l: "Platforms" }, { v: "Global", l: "Delivery Teams" }],
      color: "var(--accent-secondary)",
      icon: <Target size={24} />,
    },
    {
      id: 3, span: "normal",
      tag: "EARLY CAREERS", title: "Verndale Academy",
      desc: "Designed and led a cohort early-careers program (6 and 4 months) for final-semester university students, developing talent into Engineering, Salesforce, and PM roles through structured tracks, real-world projects, SME mentorship, and applied assessments.",
      metrics: [{ v: "3", l: "Career Tracks" }, { v: "Cohort", l: "Model" }],
      color: "#22c55e",
      icon: <Users size={24} />,
    },
    {
      id: 4, span: "wide",
      tag: "M&A INTEGRATION", title: "Acquired Company L&D Integration",
      desc: "Led L&D integration for acquired companies: defined core training requirements, mapped roles to skills and career paths, enrolled employees in certification programs, and operationalized delivery standards — building program infrastructure from the ground up in each case.",
      metrics: [{ v: "0→1", l: "Program Build" }, { v: "Role-to-Skill", l: "Mapping" }, { v: "4", l: "Countries" }],
      color: "#f97316",
      icon: <Layers size={24} />,
    },
    {
      id: 5, span: "normal",
      tag: "AI + LEARNING", title: "AI-Augmented Content Design",
      desc: "Applied Claude, Synthesia, Notebook LM, Gamma, and ChatGPT to accelerate content development, personalize learning journeys, and build scalable reinforcement systems for distributed partner and employee audiences.",
      metrics: [{ v: "6+", l: "AI Tools" }, { v: "Certified", l: "AI Fluency" }],
      color: "#a855f7",
      icon: <Code size={24} />,
    },
    {
      id: 6, span: "normal",
      tag: "COMPLIANCE", title: "Global Certification Lifecycle",
      desc: "Managed yearly compliance tracking across U.S., Canada, LATAM, and contractor populations in partnership with People Ops and hiring managers — establishing operational processes for certification lifecycle management.",
      metrics: [{ v: "4", l: "Regions" }, { v: "Yearly", l: "Cycle" }],
      color: "#06b6d4",
      icon: <TrendingUp size={24} />,
    },
  ];

  return (
    <section id="work" style={{ padding: "120px 24px", position: "relative" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Reveal>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--accent)", letterSpacing: "0.1em" }}>02</span>
            <span style={{ width: 40, height: 1, background: "var(--border)" }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-tertiary)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Selected Work</span>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.02em", color: "var(--text-primary)", margin: "0 0 60px" }}>
            Programs that move<br />the needle.
          </h2>
        </Reveal>

        {/* Bento Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }} className="bento-grid">
          {projects.map((p, i) => (
            <Reveal key={p.id} delay={0.1 * i} className={p.span === "wide" ? "bento-wide" : ""} style={p.span === "wide" ? { gridColumn: "1 / -1" } : {}}>
              <div
                onMouseEnter={() => setHoveredCard(p.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  padding: 32, borderRadius: 18, border: "1px solid var(--border)", background: "var(--card-bg)",
                  position: "relative", overflow: "hidden", cursor: "pointer", minHeight: 220,
                  transition: "border-color 0.4s, transform 0.3s, box-shadow 0.4s",
                  transform: hoveredCard === p.id ? "translateY(-4px)" : "none",
                  borderColor: hoveredCard === p.id ? p.color : "var(--border)",
                  boxShadow: hoveredCard === p.id ? `0 20px 60px ${p.color}15` : "none",
                  display: "flex", flexDirection: "column", justifyContent: "space-between",
                  ...(p.span === "wide" ? { gridColumn: "1 / -1" } : {}),
                }}
              >
                {/* Top glow line */}
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 2,
                  background: `linear-gradient(90deg, transparent, ${p.color}, transparent)`,
                  opacity: hoveredCard === p.id ? 1 : 0, transition: "opacity 0.4s",
                }} />

                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: p.color, letterSpacing: "0.12em", fontWeight: 600 }}>{p.tag}</span>
                    <div style={{ color: p.color, opacity: 0.6 }}>{p.icon}</div>
                  </div>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "var(--text-primary)", margin: "0 0 12px", letterSpacing: "-0.01em" }}>{p.title}</h3>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 15, lineHeight: 1.65, color: "var(--text-secondary)", margin: 0 }}>{p.desc}</p>
                </div>

                <div style={{ display: "flex", gap: 24, marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--border)", flexWrap: "wrap" }}>
                  {p.metrics.map((m, mi) => (
                    <div key={mi}>
                      <div style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, color: p.color }}>{m.v}</div>
                      <div style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "var(--text-tertiary)", marginTop: 2 }}>{m.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Expertise ───
function Expertise() {
  const skills = [
    { category: "AI & GenAI Tools", items: ["Claude (Certified)", "ChatGPT", "Synthesia", "Notebook LM", "Sora", "NapkinAI", "Gamma", "Glean"] },
    { category: "Certification & LMS", items: ["Moodle", "Rippling LMS", "Udemy", "Jira/Confluence Tracking", "Credentialing Lifecycle", "Partner Tier Mgmt"] },
    { category: "Partner Platforms", items: ["Sitecore", "Optimizely (Opal Certified)", "Drupal", "WordPress", "Webflow", "Shopify", "Vercel"] },
    { category: "Programming & Dev", items: ["JavaScript", "CSS / Sass", "PHP", ".NET Core", "Java", "React", "MySQL", "Oracle", "SQL Server"] },
    { category: "Content & Design", items: ["Figma", "Photoshop", "Illustrator", "After Effects", "Premiere", "Audition"] },
    { category: "Methodologies", items: ["Scrum", "Kanban", "RUP", "ADDIE / SAM", "Kirkpatrick Model", "Competency Mapping", "Cross-Cultural Teams"] },
  ];

  return (
    <section id="expertise" style={{ padding: "120px 24px", background: "var(--bg-secondary)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Reveal>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--accent)", letterSpacing: "0.1em" }}>03</span>
            <span style={{ width: 40, height: 1, background: "var(--border)" }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-tertiary)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Expertise</span>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.02em", color: "var(--text-primary)", margin: "0 0 60px" }}>
            Where learning meets<br />engineering.
          </h2>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
          {skills.map((group, gi) => (
            <Reveal key={gi} delay={0.1 * gi}>
              <div style={{ padding: 28, borderRadius: 16, border: "1px solid var(--border)", background: "var(--card-bg)" }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 16, fontWeight: 700, color: "var(--accent)", margin: "0 0 20px", letterSpacing: "0.02em" }}>{group.category}</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {group.items.map((item, ii) => (
                    <span key={ii} style={{
                      fontFamily: "var(--font-mono)", fontSize: 12, padding: "6px 12px", borderRadius: 8,
                      background: "var(--tag-bg)", color: "var(--text-secondary)", letterSpacing: "0.02em",
                      transition: "color 0.2s, background 0.2s", cursor: "default",
                    }}
                      onMouseEnter={(e) => { e.target.style.color = "var(--accent)"; e.target.style.background = "var(--tag-hover)"; }}
                      onMouseLeave={(e) => { e.target.style.color = "var(--text-secondary)"; e.target.style.background = "var(--tag-bg)"; }}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Blog Post Modal ───
function BlogPost({ post, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleEsc = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEsc);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", handleEsc); };
  }, [onClose]);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", justifyContent: "center" }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(12px)" }} />

      {/* Article container */}
      <div style={{
        position: "relative", zIndex: 1, width: "100%", maxWidth: 780, height: "100%",
        overflowY: "auto", background: "var(--bg-primary)", borderLeft: "1px solid var(--border)", borderRight: "1px solid var(--border)",
      }}>
        {/* Close / Back button */}
        <div style={{
          position: "sticky", top: 0, zIndex: 10, padding: "16px 32px",
          background: "var(--nav-bg)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <button onClick={onClose} style={{
            background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
            fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text-secondary)", fontWeight: 500,
          }}>
            <ArrowRight size={14} style={{ transform: "rotate(180deg)" }} /> Back to portfolio
          </button>
          <button onClick={onClose} style={{
            background: "none", border: "1px solid var(--border)", borderRadius: 8, width: 32, height: 32,
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--text-secondary)",
          }}>
            <X size={16} />
          </button>
        </div>

        {/* Article content */}
        <article style={{ padding: "60px 32px 80px", maxWidth: 680, margin: "0 auto" }}>
          {/* Tag + date */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: post.color, letterSpacing: "0.12em", fontWeight: 600, padding: "4px 10px", borderRadius: 6, background: `${post.color}15` }}>{post.tag}</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-tertiary)" }}>{post.date}</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-tertiary)" }}>{post.read} read</span>
          </div>

          {/* Title */}
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 700, lineHeight: 1.2, letterSpacing: "-0.02em", color: "var(--text-primary)", margin: "0 0 16px" }}>
            {post.title}
          </h1>

          {/* Author */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, paddingBottom: 32, marginBottom: 40, borderBottom: "1px solid var(--border)" }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, var(--accent), var(--accent-secondary))", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 700, color: "var(--bg-primary)" }}>JJ</div>
            <div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>Juan José León Guerrero</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-tertiary)" }}>Senior Technical Trainer · Verndale</div>
            </div>
          </div>

          {/* Body */}
          {post.body.map((block, i) => {
            if (block.type === "h2") return (
              <h2 key={i} style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "var(--text-primary)", margin: "40px 0 16px", letterSpacing: "-0.01em" }}>{block.text}</h2>
            );
            if (block.type === "h3") return (
              <h3 key={i} style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 600, color: "var(--accent)", margin: "32px 0 12px" }}>{block.text}</h3>
            );
            if (block.type === "quote") return (
              <blockquote key={i} style={{ borderLeft: `3px solid ${post.color}`, padding: "12px 0 12px 20px", margin: "24px 0", fontFamily: "var(--font-body)", fontSize: 17, fontStyle: "italic", lineHeight: 1.7, color: "var(--text-secondary)" }}>{block.text}</blockquote>
            );
            return (
              <p key={i} style={{ fontFamily: "var(--font-body)", fontSize: 16, lineHeight: 1.8, color: "var(--text-secondary)", margin: "0 0 20px" }}>{block.text}</p>
            );
          })}

          {/* End divider */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 60, paddingTop: 40, borderTop: "1px solid var(--border)" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)" }} />
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", opacity: 0.6 }} />
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", opacity: 0.3 }} />
          </div>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 14, color: "var(--text-tertiary)", textAlign: "center", marginTop: 16 }}>
            Thanks for reading. Let's connect on{" "}
            <a href="https://linkedin.com/in/juanjoleong" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", textDecoration: "none" }}>LinkedIn</a>.
          </p>
        </article>
      </div>
    </div>
  );
}

// ─── Blog / Insights ───
function Blog() {
  const [openPost, setOpenPost] = useState(null);

  const posts = [
    {
      title: "Building Certification Programs from Scratch: A 0-to-1 Playbook",
      tag: "CREDENTIALING", date: "Mar 2026", read: "8 min", color: "var(--accent)",
      body: [
        { type: "p", text: "Most organizations don't realize they need a certification program until they're already losing partner tier status or watching new hires flounder for months without clear competency benchmarks. Having built credentialing systems from zero multiple times, I've learned that the architecture decisions you make in the first two weeks determine whether the program scales or collapses under its own weight." },
        { type: "h2", text: "Start with the Business Case, Not the Content" },
        { type: "p", text: "The instinct is to start writing training material. Resist it. Begin by mapping the certification program to business outcomes: partner tier requirements, client delivery quality, employee retention, and time-to-productivity. If you can't draw a direct line from a credential to revenue or risk mitigation, it's not a certification — it's a nice-to-have." },
        { type: "p", text: "At Verndale, I began by auditing every partner program requirement across Sitecore, Optimizely, Shopify, Webflow, and Vercel. Each vendor has different credentialing expectations, renewal cycles, and tier thresholds. The framework had to accommodate all of them without creating five separate bureaucracies." },
        { type: "h2", text: "Define Tiers Before You Define Content" },
        { type: "p", text: "A flat certification structure — where everyone either has the badge or doesn't — creates no growth incentive. Instead, design tiered levels that map to role progression: foundational (new hires), practitioner (mid-level), and expert (senior/architect). Each tier should have clear criteria for entry, maintenance, and renewal." },
        { type: "quote", text: "The biggest mistake I see in certification programs is treating them as a checkbox exercise. Credentials should mean something — they should predict on-the-job performance." },
        { type: "h2", text: "Budget-Aware Credential Allocation" },
        { type: "p", text: "Vendor certifications cost money — exam fees, training licenses, study time. I introduced certification program economics into the planning process: forecasting annual credential spend, prioritizing certifications that directly impact partner tier status, and building a renewal calendar that prevents last-minute scrambles. This shifted the conversation from 'can we afford to certify people?' to 'can we afford not to?'" },
        { type: "h2", text: "Operationalize with Lifecycle Tracking" },
        { type: "p", text: "A certification without expiration tracking is a ticking time bomb. I built lifecycle management processes using Jira and Confluence that track credential status across the entire ~900-person workforce spanning the U.S., Canada, LATAM, and contractor populations. Automated reminders, renewal windows, and manager dashboards keep the system running without constant manual intervention." },
        { type: "h2", text: "The Payoff" },
        { type: "p", text: "When the program matures, it becomes self-reinforcing: engineers see credentials as career currency, managers use them for staffing decisions, and the business maintains partner tier status without emergency certification drives. The key is treating it as infrastructure, not a project — something that runs continuously, not something you launch and forget." },
      ],
    },
    {
      title: "How AI Tools Are Transforming L&D Content Development",
      tag: "AI + LEARNING", date: "Feb 2026", read: "6 min", color: "var(--accent-secondary)",
      body: [
        { type: "p", text: "The L&D field is experiencing a fundamental shift in how content gets created. Over the past year, I've integrated six AI tools into my daily workflow — not as experiments, but as production systems that have measurably changed how fast and how well training content reaches learners." },
        { type: "h2", text: "The Tools I Actually Use (and Why)" },
        { type: "p", text: "There's a difference between tools you demo at a conference and tools you open every morning. My daily stack: Claude for complex content structuring, curriculum design, and assessment writing; Synthesia for scalable video content that doesn't require booking a studio; Notebook LM for synthesizing SME interviews into structured learning objectives; and Gamma for rapid slide deck prototyping when stakeholders need to see something visual before committing to a full build." },
        { type: "h2", text: "Augmentation, Not Replacement" },
        { type: "quote", text: "AI doesn't replace instructional designers — it replaces the blank page. The hardest part of content development is the first draft, and that's exactly where AI excels." },
        { type: "p", text: "I frame AI adoption carefully within my organization. The goal is never to eliminate roles but to compress the cycle from 'SME brain dump' to 'learner-ready content.' A certification module that took two weeks to develop can now reach first draft in two days — but it still needs human review for technical accuracy, cultural nuance, and pedagogical integrity." },
        { type: "h2", text: "Personalizing Learning Journeys at Scale" },
        { type: "p", text: "The most exciting application isn't content creation — it's content personalization. Using AI to analyze learner assessment data and recommend targeted reinforcement paths means that two engineers preparing for the same Sitecore certification might follow different study paths based on their existing knowledge gaps. This was impossible to do manually for a globally distributed workforce." },
        { type: "h2", text: "Responsible AI in Learning Design" },
        { type: "p", text: "I coordinate thought-leadership sessions that reinforce responsible AI adoption across our teams. This means being transparent about when content is AI-assisted, maintaining human review gates for anything that touches certification assessments, and ensuring AI tools don't inadvertently introduce bias into learning materials. Getting certified in AI Fluency frameworks gave me the vocabulary to have these conversations with leadership and engineering alike." },
        { type: "h2", text: "What's Next" },
        { type: "p", text: "The next frontier is AI-generated scenario-based assessments — dynamically creating practice environments that adapt to the learner's skill level in real-time. We're not there yet, but the foundation we've built with structured content and competency mapping makes it achievable within the next 12–18 months." },
      ],
    },
    {
      title: "Partner Enablement at Scale: Lessons from 5 Platform Ecosystems",
      tag: "ENABLEMENT", date: "Jan 2026", read: "7 min", color: "#22c55e",
      body: [
        { type: "p", text: "When your organization is a partner across five different technology platforms — each with its own certification requirements, training resources, competency frameworks, and tier thresholds — enablement becomes a logistics challenge as much as a learning design challenge. Here's what I've learned managing this complexity at Verndale." },
        { type: "h2", text: "Every Platform Thinks It's the Only Platform" },
        { type: "p", text: "Sitecore, Optimizely, Shopify, Webflow, and Vercel each provide their own partner enablement programs. Each assumes your team is dedicated exclusively to their ecosystem. The reality? Engineers move between platforms based on client needs. A developer might work on a Sitecore project in Q1 and a Shopify build in Q3. Your enablement program has to account for this fluidity." },
        { type: "h2", text: "The Unified Framework Approach" },
        { type: "p", text: "Rather than running five parallel training programs, I designed a unified credentialing framework with a consistent structure: foundational platform knowledge, hands-on implementation skills, and architectural decision-making. The content varies by platform, but the progression model, assessment format, and tracking infrastructure are consistent." },
        { type: "quote", text: "The goal isn't to make every engineer an expert in every platform. It's to make every engineer competent in their assigned platform and literate across the ecosystem." },
        { type: "h2", text: "Coordinating with Credentialing Vendors" },
        { type: "p", text: "Each vendor has a partner team that cares deeply about your certification numbers — because those numbers determine your partner tier, which determines the leads, support, and co-marketing resources they send your way. I maintain direct relationships with each vendor's enablement team, aligning our internal training calendar with their certification exam windows, beta programs, and content updates." },
        { type: "h3", text: "Timing Matters More Than You Think" },
        { type: "p", text: "Platform vendors release major updates on their own schedule. When Optimizely launches a new feature set, the certification exam changes within 60 days. If your team isn't tracking these cycles, they study for an exam that no longer exists. I build a rolling calendar that maps vendor release cycles to internal training sprints." },
        { type: "h2", text: "Measuring What Matters" },
        { type: "p", text: "Partner tier status is the ultimate metric — it's binary and visible. But underneath it, I track certification velocity (time from enrollment to passing), renewal compliance rates, and the correlation between platform credentials and client engagement outcomes. These secondary metrics tell me whether the program is healthy before tier status becomes at risk." },
        { type: "h2", text: "The Human Side" },
        { type: "p", text: "Technical enablement fails when it ignores motivation. Engineers don't study for certifications because you told them to — they study because the credential advances their career, earns them project assignments they want, or gives them recognition among peers. The enablement program has to serve the learner's goals, not just the organization's partner requirements." },
      ],
    },
    {
      title: "L&D Integration After M&A: Building Training Infrastructure for Acquired Teams",
      tag: "M&A STRATEGY", date: "Dec 2025", read: "9 min", color: "#f97316",
      body: [
        { type: "p", text: "Acquiring a company is a business transaction. Integrating that company's people into your learning and development infrastructure is something else entirely — it's a human systems challenge that touches identity, competence, belonging, and career trajectory. I've led L&D integration for acquired companies multiple times, and each one taught me something the last one didn't." },
        { type: "h2", text: "Day Zero: What You Don't Know" },
        { type: "p", text: "The acquisition due diligence covers financials, client contracts, and technology stack. It almost never covers the acquired team's existing training maturity, skill distribution, or learning culture. On day one of integration, I face a workforce I've never met, using tools I may not know, with competency levels I can't yet assess. The first task isn't training — it's discovery." },
        { type: "h2", text: "The Discovery Framework" },
        { type: "p", text: "I run a structured discovery process: map every role in the acquired organization to our existing competency framework, identify gaps between their current skills and our delivery standards, and interview managers to understand how the team has historically learned and developed. This produces a heat map of where the integration effort needs to focus." },
        { type: "quote", text: "Integration isn't about making the acquired team 'like us.' It's about building a shared foundation while preserving the strengths they bring." },
        { type: "h2", text: "Building from the Ground Up" },
        { type: "p", text: "In every acquisition I've supported, the L&D infrastructure had to be built from scratch. This means defining core training requirements that apply to the entire combined organization, creating role-specific learning paths that account for the acquired team's starting point, enrolling people in certification programs with realistic timelines, and establishing delivery standards that both legacy and acquired teams can meet." },
        { type: "h3", text: "The 30/60/90 Day Model" },
        { type: "p", text: "I structure integration around clear milestones. By day 30, the acquired team should understand our tools, processes, and communication norms. By day 60, they should be enrolled in relevant certification tracks and participating in ongoing enablement programs. By day 90, they should be contributing to client work at expected quality standards. Each milestone has defined readiness criteria — not vague aspirations." },
        { type: "h2", text: "The Role-to-Skill Mapping Challenge" },
        { type: "p", text: "Acquired companies use different titles, different role definitions, and different career ladders. A 'Senior Developer' at the acquired company might map to a mid-level role in our framework, or vice versa. The skill mapping process has to be transparent and respectful — people's professional identities are attached to their titles. I present it as an alignment exercise, not a demotion risk." },
        { type: "h2", text: "Cross-Cultural Considerations" },
        { type: "p", text: "When the acquisition spans geographies — which it has in my experience across U.S., Canada, and LATAM teams — the integration has to account for language preferences, time zone constraints on live training, cultural attitudes toward certification (mandatory vs. aspirational), and local labor norms around professional development time. A one-size-fits-all integration plan guarantees failure in at least one region." },
        { type: "h2", text: "What Success Looks Like" },
        { type: "p", text: "The integration is complete when you can no longer tell which team members are 'legacy' and which are 'acquired.' They share the same credentials, follow the same learning paths, and operate at the same delivery standards. The infrastructure you built doesn't just serve the current integration — it becomes the playbook for the next acquisition." },
      ],
    },
  ];

  return (
    <>
      <section id="blog" style={{ padding: "120px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--accent)", letterSpacing: "0.1em" }}>04</span>
              <span style={{ width: 40, height: 1, background: "var(--border)" }} />
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-tertiary)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Insights</span>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 60, flexWrap: "wrap", gap: 20 }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.02em", color: "var(--text-primary)", margin: 0 }}>
                Thinking out loud.
              </h2>
            </div>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: 20 }}>
            {posts.map((post, i) => (
              <Reveal key={i} delay={0.1 * i}>
                <div
                  onClick={() => setOpenPost(post)}
                  style={{
                    padding: 28, borderRadius: 16, border: "1px solid var(--border)", background: "var(--card-bg)",
                    transition: "border-color 0.3s, transform 0.2s",
                    cursor: "pointer", height: "100%", display: "flex", flexDirection: "column",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = post.color; e.currentTarget.style.transform = "translateY(-3px)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "none"; }}
                >
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: post.color, letterSpacing: "0.12em", fontWeight: 600 }}>{post.tag}</span>
                  <h3 style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 700, color: "var(--text-primary)", margin: "16px 0 auto", lineHeight: 1.35, letterSpacing: "-0.01em" }}>
                    {post.title}
                  </h3>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", gap: 16 }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-tertiary)" }}>{post.date}</span>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-tertiary)" }}>{post.read} read</span>
                    </div>
                    <ArrowRight size={14} style={{ color: post.color }} />
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Blog post modal */}
      {openPost && <BlogPost post={openPost} onClose={() => setOpenPost(null)} />}
    </>
  );
}

// ─── Contact ───
function Contact() {
  return (
    <section id="contact" style={{ padding: "120px 24px", background: "var(--bg-secondary)" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
        <Reveal>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--accent)", letterSpacing: "0.1em" }}>05</span>
            <span style={{ width: 40, height: 1, background: "var(--border)" }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-tertiary)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Contact</span>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.03em", color: "var(--text-primary)", margin: "0 0 24px" }}>
            Let's build something<br />
            <span style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-secondary))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>together.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: 18, lineHeight: 1.7, color: "var(--text-secondary)", maxWidth: 500, margin: "0 auto 48px" }}>
            Currently exploring roles in Certification Program Design, Partner Enablement, and Technical Credentialing at US-based organizations.
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
            {[
              { icon: <Mail size={18} />, label: "Email", href: "mailto:juanjoleong@gmail.com", color: "var(--accent)" },
              { icon: <Linkedin size={18} />, label: "LinkedIn", href: "https://linkedin.com/in/juanjoleong", color: "#0a66c2" },
              { icon: <Github size={18} />, label: "GitHub", href: "#", color: "var(--text-primary)" },
            ].map((link, i) => (
              <a
                key={i}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 10, padding: "14px 24px",
                  borderRadius: 12, border: "1px solid var(--border)", background: "var(--card-bg)",
                  color: "var(--text-primary)", fontFamily: "var(--font-body)", fontSize: 15,
                  fontWeight: 500, textDecoration: "none",
                  transition: "border-color 0.3s, transform 0.2s, background 0.3s",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = link.color; e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.background = "var(--card-hover)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "none"; e.currentTarget.style.background = "var(--card-bg)"; }}
              >
                <span style={{ color: link.color }}>{link.icon}</span>
                {link.label}
                <ExternalLink size={12} style={{ color: "var(--text-tertiary)" }} />
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── Footer ───
function Footer() {
  return (
    <footer style={{ padding: "40px 24px", borderTop: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-tertiary)" }}>
          © 2026 Juan José León Guerrero. Built with React & Next.js.
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-tertiary)" }}>
          Designed with purpose.
        </span>
      </div>
    </footer>
  );
}

// ═══════════════════════════════
// ─── MAIN APP ─────────────────
// ═══════════════════════════════
export default function Portfolio() {
  const [darkMode, setDarkMode] = useState(true);
  const [activeSection, setActiveSection] = useState("hero");

  // Track active section on scroll
  useEffect(() => {
    const sections = ["hero", "about", "work", "expertise", "blog", "contact"];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.3 }
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const theme = darkMode
    ? {
        "--bg-primary": "#0a0a0c",
        "--bg-secondary": "#0f0f13",
        "--nav-bg": "rgba(10,10,12,0.85)",
        "--card-bg": "rgba(255,255,255,0.03)",
        "--card-hover": "rgba(255,255,255,0.06)",
        "--tag-bg": "rgba(255,255,255,0.06)",
        "--tag-hover": "rgba(255,255,255,0.1)",
        "--border": "rgba(255,255,255,0.08)",
        "--text-primary": "#f0f0f2",
        "--text-secondary": "#a0a0b0",
        "--text-tertiary": "#606070",
        "--accent": "#e8b931",
        "--accent-secondary": "#f59e0b",
        "--accent-glow": "#e8b931",
      }
    : {
        "--bg-primary": "#fafaf9",
        "--bg-secondary": "#f2f1ef",
        "--nav-bg": "rgba(250,250,249,0.85)",
        "--card-bg": "rgba(0,0,0,0.02)",
        "--card-hover": "rgba(0,0,0,0.04)",
        "--tag-bg": "rgba(0,0,0,0.05)",
        "--tag-hover": "rgba(0,0,0,0.08)",
        "--border": "rgba(0,0,0,0.08)",
        "--text-primary": "#1a1a1f",
        "--text-secondary": "#555560",
        "--text-tertiary": "#8a8a95",
        "--accent": "#b8860b",
        "--accent-secondary": "#d97706",
        "--accent-glow": "#b8860b",
      };

  return (
    <div style={{
      ...theme,
      "--font-display": "'Sora', sans-serif",
      "--font-body": "'DM Sans', sans-serif",
      "--font-mono": "'JetBrains Mono', monospace",
      background: "var(--bg-primary)",
      color: "var(--text-primary)",
      minHeight: "100vh",
      overflowX: "hidden",
      transition: "background 0.4s, color 0.4s",
    }}>
      {/* Font imports */}
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />

      <style>{`
        @keyframes blink { 50% { opacity: 0; } }
        @keyframes float { 0%, 100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(8px); } }

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { overflow-x: hidden; }

        ::selection { background: var(--accent); color: var(--bg-primary); }

        .bento-wide { grid-column: 1 / -1; }

        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
          .about-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .bento-grid { grid-template-columns: 1fr !important; }
          .bento-wide { grid-column: auto !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu-btn { display: none !important; }
        }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: var(--bg-primary); }
        ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: var(--accent); }
      `}</style>

      <Nav activeSection={activeSection} darkMode={darkMode} setDarkMode={setDarkMode} />
      <Hero />
      <About />
      <Work />
      <Expertise />
      <Blog />
      <Contact />
      <Footer />
    </div>
  );
}