import { useState, useEffect, useRef, useCallback } from "react";
import {
  Mail,
  Linkedin,
  Github,
  ChevronDown,
  ExternalLink,
  ArrowRight,
  BookOpen,
  Users,
  Award,
  Briefcase,
  GraduationCap,
  Code,
  Layers,
  Target,
  TrendingUp,
  Calendar,
  MapPin,
  Download,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";

// ─── Intersection Observer Hook ───
function useInView(options = {}) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          obs.unobserve(el);
        }
      },
      { threshold: 0.15, ...options },
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
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end, duration]);
  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

// ─── Reveal Wrapper ───
function Reveal({ children, delay = 0, className = "", direction = "up" }) {
  const [ref, inView] = useInView();
  const transforms = {
    up: "translateY(40px)",
    down: "translateY(-40px)",
    left: "translateX(40px)",
    right: "translateX(-40px)",
    none: "none",
  };
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
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: scrolled ? "var(--nav-bg)" : "transparent",
        backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
        borderBottom: scrolled
          ? "1px solid var(--border)"
          : "1px solid transparent",
        transition: "all 0.4s ease",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 64,
        }}
      >
        <button
          onClick={() => scrollTo("hero")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 22,
              fontWeight: 700,
              color: "var(--accent)",
              letterSpacing: "-0.02em",
            }}
          >
            JJ
          </span>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 14,
              color: "var(--text-secondary)",
              fontWeight: 500,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            León
          </span>
        </button>

        {/* Desktop Nav */}
        <div
          style={{ display: "flex", alignItems: "center", gap: 32 }}
          className="desktop-nav"
        >
          {links.map((l) => (
            <button
              key={l.id}
              onClick={() => scrollTo(l.id)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                fontSize: 13,
                fontWeight: 500,
                color:
                  activeSection === l.id
                    ? "var(--accent)"
                    : "var(--text-secondary)",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                transition: "color 0.3s",
                position: "relative",
              }}
            >
              {l.label}
              {activeSection === l.id && (
                <span
                  style={{
                    position: "absolute",
                    bottom: -4,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    background: "var(--accent)",
                  }}
                />
              )}
            </button>
          ))}
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              background: "none",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: "6px 8px",
              cursor: "pointer",
              color: "var(--text-secondary)",
              display: "flex",
              alignItems: "center",
            }}
          >
            {darkMode ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="mobile-menu-btn"
          style={{
            background: "none",
            border: "none",
            color: "var(--text-primary)",
            cursor: "pointer",
            display: "none",
          }}
        >
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
              position: "fixed",
              inset: 0,
              top: 0,
              background: "rgba(0, 0, 0, 0.7)",
              backdropFilter: "blur(8px)",
              zIndex: 98,
            }}
          />
          {/* Menu content */}
          <div
            style={{
              position: "fixed",
              inset: 0,
              top: 64,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 32,
              zIndex: 99,
              padding: 32,
            }}
          >
            {links.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                style={{
                  background: "none",
                  border: "none",
                  fontFamily: "var(--font-display)",
                  fontSize: 32,
                  fontWeight: 600,
                  color: activeSection === l.id ? "var(--accent)" : "#ffffff",
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "color 0.3s, transform 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--accent)";
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color =
                    activeSection === l.id ? "var(--accent)" : "#ffffff";
                  e.currentTarget.style.transform = "none";
                }}
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
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  }, []);

  const roles = [
    "Enterprise L&D & AI Enablement Lead",
    "AI Adoption Strategist",
    "User Onboarding Architect",
    "Knowledge Management Leader",
  ];
  const [roleIdx, setRoleIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [typing, setTyping] = useState(true);

  useEffect(() => {
    const role = roles[roleIdx];
    if (typing) {
      if (displayed.length < role.length) {
        const t = setTimeout(
          () => setDisplayed(role.slice(0, displayed.length + 1)),
          60,
        );
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
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        padding: "120px 24px 80px",
      }}
    >
      {/* Gradient orb that follows mouse */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)",
          left: `${mousePos.x * 100}%`,
          top: `${mousePos.y * 100}%`,
          transform: "translate(-50%, -50%)",
          opacity: 0.15,
          pointerEvents: "none",
          transition: "left 0.8s ease-out, top 0.8s ease-out",
        }}
      />

      {/* Grid pattern overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.03,
          backgroundImage: `linear-gradient(var(--text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          width: "100%",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Reveal delay={0.1}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 24,
            }}
          >
            <span
              style={{ width: 40, height: 1, background: "var(--accent)" }}
            />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                color: "var(--accent)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Available for opportunities
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(48px, 8vw, 96px)",
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "var(--text-primary)",
              margin: 0,
            }}
          >
            Juan José{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, var(--accent), var(--accent-secondary))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              León
            </span>
          </h1>
        </Reveal>

        <Reveal delay={0.35}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "clamp(16px, 2.5vw, 22px)",
              color: "var(--text-secondary)",
              marginTop: 20,
              height: 32,
              display: "flex",
              alignItems: "center",
            }}
          >
            <span>{displayed}</span>
            <span
              style={{
                width: 2,
                height: "1.2em",
                background: "var(--accent)",
                marginLeft: 2,
                animation: "blink 1s step-end infinite",
              }}
            />
          </div>
        </Reveal>

        <Reveal delay={0.5}>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(16px, 1.8vw, 19px)",
              lineHeight: 1.7,
              color: "var(--text-tertiary)",
              maxWidth: 600,
              marginTop: 28,
              marginBottom: 40,
            }}
          >
            MSc. Computer Science Engineer architecting enterprise learning
            programs that accelerate technical readiness across global teams.
            Expert at AI adoption, onboarding design, and knowledge management
            at scale.
          </p>
        </Reveal>

        <Reveal delay={0.65}>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a
              href="#work"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("work")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 28px",
                borderRadius: 12,
                background: "var(--accent)",
                color: "var(--bg-primary)",
                fontFamily: "var(--font-body)",
                fontSize: 15,
                fontWeight: 600,
                textDecoration: "none",
                border: "none",
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 30px var(--accent-glow)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              View My Work <ArrowRight size={16} />
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 28px",
                borderRadius: 12,
                background: "transparent",
                color: "var(--text-primary)",
                fontFamily: "var(--font-body)",
                fontSize: 15,
                fontWeight: 600,
                textDecoration: "none",
                border: "1px solid var(--border)",
                cursor: "pointer",
                transition: "border-color 0.3s, background 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.background = "var(--card-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              <Download size={16} /> Resume
            </a>
          </div>
        </Reveal>

        {/* Stats bar */}
        <Reveal delay={0.8}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: 32,
              marginTop: 80,
              paddingTop: 40,
              borderTop: "1px solid var(--border)",
            }}
          >
            {[
              { n: 9, s: "+", label: "Years in L&D" },
              { n: 2100, s: "+", label: "Students Taught" },
              { n: 900, s: "", label: "Person Workforce" },
              { n: 5, s: "+", label: "Partner Platforms" },
            ].map((s, i) => (
              <div key={i}>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 36,
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  <Counter end={s.n} suffix={s.s} />
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 13,
                    color: "var(--text-tertiary)",
                    marginTop: 4,
                    letterSpacing: "0.02em",
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          position: "absolute",
          bottom: 32,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          animation: "float 3s ease-in-out infinite",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--text-tertiary)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Scroll
        </span>
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                color: "var(--accent)",
                letterSpacing: "0.1em",
              }}
            >
              01
            </span>
            <span
              style={{ width: 40, height: 1, background: "var(--border)" }}
            />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                color: "var(--text-tertiary)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              About
            </span>
          </div>
        </Reveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 80,
            alignItems: "start",
          }}
          className="about-grid"
        >
          <div>
            <Reveal delay={0.1}>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(32px, 4vw, 48px)",
                  fontWeight: 700,
                  lineHeight: 1.15,
                  letterSpacing: "-0.02em",
                  color: "var(--text-primary)",
                  margin: "0 0 28px",
                }}
              >
                People, technology,
                <br />
                <span style={{ color: "var(--accent)" }}>
                  and business outcomes.
                </span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 17,
                  lineHeight: 1.75,
                  color: "var(--text-secondary)",
                  marginBottom: 20,
                }}
              >
                I'm an MSc. Computer Science Engineer expert at architecting
                enterprise learning programs that accelerate technical readiness
                across global software development teams. At Verndale, I lead
                the design and delivery of onboarding, credentialing, and AI
                adoption initiatives for a nearly 900-person global workforce.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 17,
                  lineHeight: 1.75,
                  color: "var(--text-secondary)",
                  marginBottom: 20,
                }}
              >
                I've managed Glean, ChatGPT, Claude, and Microsoft Copilot to
                build AI agents and automations that expanded L&D capacity and
                supported scalable training delivery. As a full professor at
                UDLA, I've designed competency-based curriculum for 2,100+
                students. Strong negotiator with platform partners and
                recognized across the Latin American and U.S. software
                development value chain.
              </p>
            </Reveal>
            <Reveal delay={0.4}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  marginTop: 32,
                }}
              >
                <MapPin size={16} style={{ color: "var(--accent)" }} />
                <span
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: 14,
                    color: "var(--text-tertiary)",
                  }}
                >
                  Quito, Ecuador · Open to Remote
                </span>
              </div>
            </Reveal>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              {
                icon: <Briefcase size={20} />,
                title: "Verndale",
                sub: "Senior Technical Trainer & L&D Program Lead",
                period: "Sep 2016 – Present",
                accent: true,
              },
              {
                icon: <GraduationCap size={20} />,
                title: "UDLA",
                sub: "Professor of Web Engineering",
                period: "2008 – Present",
              },
              {
                icon: <Code size={20} />,
                title: "Oshyn Inc",
                sub: "Front End Developer",
                period: "2008 – 2010",
              },
              {
                icon: <Award size={20} />,
                title: "MSc. Eng. Numeric Media",
                sub: "ESIEE Paris, France",
                period: "2006 – 2008",
              },
              {
                icon: <Code size={20} />,
                title: "Mazarine Digital",
                sub: "Interactive Developer · Paris",
                period: "2007 – 2008",
              },
              {
                icon: <Layers size={20} />,
                title: "Mindsoft",
                sub: "Co-founder",
                period: "2003 – 2016",
              },
            ].map((item, i) => (
              <Reveal key={i} delay={0.15 * i}>
                <div
                  style={{
                    padding: 20,
                    borderRadius: 14,
                    border: "1px solid var(--border)",
                    background: "var(--card-bg)",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 16,
                    transition: "border-color 0.3s, transform 0.2s",
                    cursor: "default",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--accent)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.transform = "none";
                  }}
                >
                  <div
                    style={{
                      color: item.accent
                        ? "var(--accent)"
                        : "var(--text-tertiary)",
                      marginTop: 2,
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 16,
                        fontWeight: 600,
                        color: "var(--text-primary)",
                      }}
                    >
                      {item.title}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: 14,
                        color: "var(--text-secondary)",
                        marginTop: 2,
                      }}
                    >
                      {item.sub}
                    </div>
                    {item.period && (
                      <div
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 12,
                          color: "var(--text-tertiary)",
                          marginTop: 6,
                        }}
                      >
                        {item.period}
                      </div>
                    )}
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
      id: 1,
      span: "wide",
      tag: "AI ENABLEMENT",
      title: "Enterprise AI Adoption Programs",
      desc: "Founded and led four internal AI adoption programs focused on practical GenAI use cases, project-based learning, creative applications, and responsible adoption across technical and business teams. Produced user guides, FAQs, and training materials to support ongoing enablement.",
      metrics: [
        { v: "4", l: "AI Programs" },
        { v: "~900", l: "Team Members" },
        { v: "Glean, Copilot, Claude", l: "AI Stack" },
      ],
      color: "var(--accent)",
      icon: <Award size={24} />,
    },
    {
      id: 2,
      span: "normal",
      tag: "ONBOARDING",
      title: "Global Onboarding Architecture",
      desc: "Designed and launched a global onboarding program with structured pre-boarding, role-specific ramp plans, milestone checkpoints, and 30/60/90-day follow-ups to improve new-hire readiness and time-to-productivity across 4 countries.",
      metrics: [
        { v: "30/60/90", l: "Day Model" },
        { v: "4", l: "Regions" },
      ],
      color: "var(--accent-secondary)",
      icon: <Users size={24} />,
    },
    {
      id: 3,
      span: "normal",
      tag: "CREDENTIALING",
      title: "Certification & Partnership Readiness",
      desc: "Developed certification and credentialing programs that strengthened platform readiness and supported top-tier partner status across Sitecore Diamond, Optimizely Premier Platinum, Shopify Platinum, Webflow Premium and Salesforce Ridge.",
      metrics: [
        { v: "5", l: "Partner Tiers" },
        { v: "Tiered", l: "Certs" },
      ],
      color: "#22c55e",
      icon: <Target size={24} />,
    },
    {
      id: 4,
      span: "wide",
      tag: "M&A INTEGRATION",
      title: "Acquisition L&D Integration",
      desc: "Led L&D integration across multiple acquisitions using capability gap analysis, LMS-based learning paths, and credentialing frameworks to accelerate workforce readiness and operational continuity. Built program infrastructure from the ground up for each acquired company.",
      metrics: [
        { v: "0→1", l: "Program Build" },
        { v: "Role-to-Skill", l: "Mapping" },
        { v: "Multiple", l: "Acquisitions" },
      ],
      color: "#f97316",
      icon: <Layers size={24} />,
    },
    {
      id: 5,
      span: "normal",
      tag: "KNOWLEDGE MGMT",
      title: "Learning Technology Stack",
      desc: "Managed the learning technology and AI enablement stack, including Glean, ChatGPT, Claude, and Microsoft Copilot. Built AI agents and workflow automations that expanded L&D capacity, improved onboarding operations, and supported scalable training delivery.",
      metrics: [
        { v: "6+", l: "AI Tools" },
        { v: "Agents & Automation", l: "Enabled" },
      ],
      color: "#a855f7",
      icon: <Code size={24} />,
    },
    {
      id: 6,
      span: "normal",
      tag: "ACADEMICS",
      title: "UDLA Web Engineering Curriculum",
      desc: "Designed and delivered competency-based curriculum and learning experiences for 2,100+ students, grounding courses in adult learning principles and modern software engineering practices with rigorous scenario-based assessments.",
      metrics: [
        { v: "2,100+", l: "Students" },
        { v: "Competency-Based", l: "Design" },
      ],
      color: "#06b6d4",
      icon: <BookOpen size={24} />,
    },
  ];

  return (
    <section id="work" style={{ padding: "120px 24px", position: "relative" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Reveal>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                color: "var(--accent)",
                letterSpacing: "0.1em",
              }}
            >
              02
            </span>
            <span
              style={{ width: 40, height: 1, background: "var(--border)" }}
            />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                color: "var(--text-tertiary)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Selected Work
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(32px, 4vw, 48px)",
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              color: "var(--text-primary)",
              margin: "0 0 60px",
            }}
          >
            Enterprise learning
            <br />
            at scale.
          </h2>
        </Reveal>

        {/* Bento Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 20,
          }}
          className="bento-grid"
        >
          {projects.map((p, i) => (
            <Reveal
              key={p.id}
              delay={0.1 * i}
              className={p.span === "wide" ? "bento-wide" : ""}
              style={p.span === "wide" ? { gridColumn: "1 / -1" } : {}}
            >
              <div
                onMouseEnter={() => setHoveredCard(p.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  padding: 32,
                  borderRadius: 18,
                  border: "1px solid var(--border)",
                  background: "var(--card-bg)",
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                  minHeight: 220,
                  transition:
                    "border-color 0.4s, transform 0.3s, box-shadow 0.4s",
                  transform: hoveredCard === p.id ? "translateY(-4px)" : "none",
                  borderColor: hoveredCard === p.id ? p.color : "var(--border)",
                  boxShadow:
                    hoveredCard === p.id ? `0 20px 60px ${p.color}15` : "none",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  ...(p.span === "wide" ? { gridColumn: "1 / -1" } : {}),
                }}
              >
                {/* Top glow line */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: `linear-gradient(90deg, transparent, ${p.color}, transparent)`,
                    opacity: hoveredCard === p.id ? 1 : 0,
                    transition: "opacity 0.4s",
                  }}
                />

                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 16,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        color: p.color,
                        letterSpacing: "0.12em",
                        fontWeight: 600,
                      }}
                    >
                      {p.tag}
                    </span>
                    <div style={{ color: p.color, opacity: 0.6 }}>{p.icon}</div>
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 22,
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      margin: "0 0 12px",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {p.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: 15,
                      lineHeight: 1.65,
                      color: "var(--text-secondary)",
                      margin: 0,
                    }}
                  >
                    {p.desc}
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 24,
                    marginTop: 24,
                    paddingTop: 20,
                    borderTop: "1px solid var(--border)",
                    flexWrap: "wrap",
                  }}
                >
                  {p.metrics.map((m, mi) => (
                    <div key={mi}>
                      <div
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: 20,
                          fontWeight: 700,
                          color: p.color,
                        }}
                      >
                        {m.v}
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: 12,
                          color: "var(--text-tertiary)",
                          marginTop: 2,
                        }}
                      >
                        {m.l}
                      </div>
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
    {
      category: "AI & GenAI Tools",
      items: [
        "Claude (Certified)",
        "ChatGPT (Agent Builder)",
        "Glean (Agent Builder)",
        "Microsoft Copilot",
        "Synthesia",
        "Notebook LM",
        "Gamma",
        "Claude Code",
        "Claude Cowork",
      ],
    },
    {
      category: "LMS & Learning Tech",
      items: [
        "Moodle",
        "Rippling LMS",
        "Udemy",
        "Jira/Confluence",
        "Adoption Tracking",
        "Business Impact Reporting",
      ],
    },
    {
      category: "Workflow Automation",
      items: [
        "Microsoft Power Automate",
        "Glean Agents",
        "Claude Agents",
        "ChatGPT Agents",
        "Email/Slack/Teams Integrations",
      ],
    },
    {
      category: "Partner Platforms",
      items: [
        "Sitecore",
        "Optimizely",
        "Shopify",
        "Webflow",
        "Vercel",
        "Salesforce",
      ],
    },
    {
      category: "Content & Design",
      items: [
        "Short-form Video",
        "Adobe After Effects",
        "Adobe Premiere",
        "Adobe Audition",
        "Figma",
        "Photoshop",
        "Vercel",
      ],
    },
    {
      category: "Instructional Design",
      items: [
        "Adult Learning Principles",
        "Onboarding Design",
        "Performance-Based Assessment",
        "Content Lifecycle Management",
        "Rapid Prototyping",
        "Scrum",
        "Kanban",
      ],
    },
  ];

  return (
    <section
      id="expertise"
      style={{ padding: "120px 24px", background: "var(--bg-secondary)" }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Reveal>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                color: "var(--accent)",
                letterSpacing: "0.1em",
              }}
            >
              03
            </span>
            <span
              style={{ width: 40, height: 1, background: "var(--border)" }}
            />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                color: "var(--text-tertiary)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Expertise
            </span>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(32px, 4vw, 48px)",
              fontWeight: 700,
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              color: "var(--text-primary)",
              margin: "0 0 60px",
            }}
          >
            Where learning meets
            <br />
            technology.
          </h2>
        </Reveal>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 24,
          }}
        >
          {skills.map((group, gi) => (
            <Reveal key={gi} delay={0.1 * gi}>
              <div
                style={{
                  padding: 28,
                  borderRadius: 16,
                  border: "1px solid var(--border)",
                  background: "var(--card-bg)",
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 16,
                    fontWeight: 700,
                    color: "var(--accent)",
                    margin: "0 0 20px",
                    letterSpacing: "0.02em",
                  }}
                >
                  {group.category}
                </h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {group.items.map((item, ii) => (
                    <span
                      key={ii}
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 12,
                        padding: "6px 12px",
                        borderRadius: 8,
                        background: "var(--tag-bg)",
                        color: "var(--text-secondary)",
                        letterSpacing: "0.02em",
                        transition: "color 0.2s, background 0.2s",
                        cursor: "default",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "var(--accent)";
                        e.currentTarget.style.background = "var(--tag-hover)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "var(--text-secondary)";
                        e.currentTarget.style.background = "var(--tag-bg)";
                      }}
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
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        justifyContent: "center",
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.8)",
          backdropFilter: "blur(12px)",
        }}
      />

      {/* Article container */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 780,
          height: "100%",
          overflowY: "auto",
          background: "var(--bg-primary)",
          borderLeft: "1px solid var(--border)",
          borderRight: "1px solid var(--border)",
        }}
      >
        {/* Close / Back button */}
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 10,
            padding: "16px 32px",
            background: "var(--nav-bg)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "var(--font-body)",
              fontSize: 14,
              color: "var(--text-secondary)",
              fontWeight: 500,
            }}
          >
            <ArrowRight size={14} style={{ transform: "rotate(180deg)" }} />{" "}
            Back to portfolio
          </button>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "1px solid var(--border)",
              borderRadius: 8,
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "var(--text-secondary)",
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Article content */}
        <article
          style={{ padding: "60px 32px 80px", maxWidth: 680, margin: "0 auto" }}
        >
          {/* Tag + date */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 24,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: post.color,
                letterSpacing: "0.12em",
                fontWeight: 600,
                padding: "4px 10px",
                borderRadius: 6,
                background: `${post.color}15`,
              }}
            >
              {post.tag}
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                color: "var(--text-tertiary)",
              }}
            >
              {post.date}
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                color: "var(--text-tertiary)",
              }}
            >
              {post.read} read
            </span>
          </div>

          {/* Title */}
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(28px, 4vw, 40px)",
              fontWeight: 700,
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              color: "var(--text-primary)",
              margin: "0 0 16px",
            }}
          >
            {post.title}
          </h1>

          {/* Author */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              paddingBottom: 32,
              marginBottom: 40,
              borderBottom: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background:
                  "linear-gradient(135deg, var(--accent), var(--accent-secondary))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-display)",
                fontSize: 14,
                fontWeight: 700,
                color: "var(--bg-primary)",
              }}
            >
              JJ
            </div>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "var(--text-primary)",
                }}
              >
                Juan José León Guerrero
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  color: "var(--text-tertiary)",
                }}
              >
                Enterprise L&D Lead · Verndale
              </div>
            </div>
          </div>

          {/* Body */}
          {post.body.map((block, i) => {
            if (block.type === "h2")
              return (
                <h2
                  key={i}
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 22,
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    margin: "40px 0 16px",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {block.text}
                </h2>
              );
            if (block.type === "h3")
              return (
                <h3
                  key={i}
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 18,
                    fontWeight: 600,
                    color: "var(--accent)",
                    margin: "32px 0 12px",
                  }}
                >
                  {block.text}
                </h3>
              );
            if (block.type === "quote")
              return (
                <blockquote
                  key={i}
                  style={{
                    borderLeft: `3px solid ${post.color}`,
                    padding: "12px 0 12px 20px",
                    margin: "24px 0",
                    fontFamily: "var(--font-body)",
                    fontSize: 17,
                    fontStyle: "italic",
                    lineHeight: 1.7,
                    color: "var(--text-secondary)",
                  }}
                >
                  {block.text}
                </blockquote>
              );
            return (
              <p
                key={i}
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: 16,
                  lineHeight: 1.8,
                  color: "var(--text-secondary)",
                  margin: "0 0 20px",
                }}
              >
                {block.text}
              </p>
            );
          })}

          {/* End divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              marginTop: 60,
              paddingTop: 40,
              borderTop: "1px solid var(--border)",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--accent)",
              }}
            />
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--accent)",
                opacity: 0.6,
              }}
            />
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--accent)",
                opacity: 0.3,
              }}
            />
          </div>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 14,
              color: "var(--text-tertiary)",
              textAlign: "center",
              marginTop: 16,
            }}
          >
            Thanks for reading. Let's connect on{" "}
            <a
              href="https://linkedin.com/in/juanjoleong"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "var(--accent)", textDecoration: "none" }}
            >
              LinkedIn
            </a>
            .
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
      title:
        "Enterprise AI Adoption: From Proof of Concept to Organizational Culture",
      tag: "AI ADOPTION",
      date: "Mar 2026",
      read: "9 min",
      color: "var(--accent)",
      body: [
        {
          type: "p",
          text: "The difference between organizations that successfully embed AI into their operations and those that treat it as a one-off experiment comes down to one thing: culture. I've led four separate AI adoption programs at Verndale, and the key insight isn't about the tools — it's about how you structure the learning around them.",
        },
        { type: "h2", text: "Start with Use Cases, Not Tools" },
        {
          type: "p",
          text: "The instinct is to say 'we're using Claude now, here's a training session.' Resist it. Begin by identifying the actual problems your teams face day-to-day. For an L&D team, it might be accelerating course outline generation. For engineering, it might be faster code review feedback. For design, faster mockup iteration. The tool serves the use case, not the other way around.",
        },
        {
          type: "quote",
          text: "AI adoption fails when you push the tool. It succeeds when you solve the problem and the tool becomes the obvious solution.",
        },
        {
          type: "h2",
          text: "Project-Based Learning Works Better Than Abstract Workshops",
        },
        {
          type: "p",
          text: "A 90-minute workshop on prompt engineering is forgettable. A two-week project where teams apply Claude to their real workflow creates muscle memory. We structured our programs around concrete deliverables — a content outline generated entirely using AI, a design exploration using ChatGPT for ideation, an automation workflow built in Power Automate. The learning happened through doing.",
        },
        { type: "h2", text: "Responsible Adoption Isn't a Separate Track" },
        {
          type: "p",
          text: "I produced user guides and FAQs that embedded responsible AI usage into the everyday workflow. Not as a compliance box to check, but as practical guidance: when does relying on AI output create risk? Where do you need human review? How do you spot hallucinations? These conversations happen naturally when you're working on actual projects.",
        },
        { type: "h2", text: "What Success Looks Like" },
        {
          type: "p",
          text: "When the organization matures past the adoption phase, AI becomes invisible — not because people stop using it, but because it's integrated into how work gets done. You don't hear 'I used Claude to write this' anymore. You hear 'this document took half the time because we had better starting material to work from.' That's when you know the adoption succeeded.",
        },
      ],
    },
    {
      title: "Building Onboarding Programs That Actually Predict Job Success",
      tag: "ONBOARDING",
      date: "Feb 2026",
      read: "8 min",
      color: "var(--accent-secondary)",
      body: [
        {
          type: "p",
          text: "Most onboarding programs are designed backward — they start with the question 'what does the company want to teach' instead of 'what does the new hire need to be productive?' I've built global onboarding infrastructure for a 900-person workforce, and the architecture that works is one that aligns with how adults actually learn.",
        },
        { type: "h2", text: "The 30/60/90 Framework" },
        {
          type: "p",
          text: "I structure every onboarding journey with explicit milestones. By day 30, a new hire should understand the company culture, tools, and communication norms. By day 60, they should be actively contributing to projects at expected quality levels. By day 90, they should be independent — no longer needing check-ins about how to do their job. Each milestone has defined readiness criteria, not vague aspirations.",
        },
        { type: "h2", text: "Pre-Boarding Is Where Outcomes Compound" },
        {
          type: "p",
          text: "The week before someone's first day is the highest-ROI time to invest. We send prep materials, set up their development environment, introduce them to key stakeholders asynchronously, and give them reading so they arrive on day one with context, not blank-slate confusion. This costs almost nothing to do right and eliminates the first-week ramp time that normally just wastes everyone's time.",
        },
        {
          type: "quote",
          text: "A new hire who arrives prepared and oriented gets productive 2-3 weeks faster than one who shows up and starts from scratch.",
        },
        { type: "h2", text: "Role-Specific Learning Paths Matter" },
        {
          type: "p",
          text: "An engineer's first 90 days are not the same as a project manager's. We built role-specific ramp plans that account for technical onboarding, team integration, project handoff, and cultural alignment. The shared foundation is consistent, but the path diverges based on what that role actually needs to do.",
        },
        { type: "h2", text: "Measure What Matters" },
        {
          type: "p",
          text: "I track new-hire readiness using concrete metrics: time-to-first-project-contribution, quality of work at 60 days, manager confidence in independence at 90 days, and retention at the 6-month and 1-year marks. These aren't vanity metrics — they predict whether the onboarding actually worked.",
        },
      ],
    },
    {
      title: "Certification Programs as Career Currency",
      tag: "CREDENTIALING",
      date: "Jan 2026",
      read: "7 min",
      color: "#22c55e",
      body: [
        {
          type: "p",
          text: "Certifications live in an uncomfortable space. They're either the most meaningless credential (checkbox for tier status) or the most valuable career asset (proof of mastery). The difference is how you design them. I've built certification programs that landed in the second category.",
        },
        { type: "h2", text: "Tiered Credentials Drive Engagement" },
        {
          type: "p",
          text: "A binary certification (you have it or you don't) creates no growth incentive beyond the initial achievement. Instead, design tiers: foundational (demonstrates basic competency), practitioner (hands-on application), expert (architectural decisions). Each tier has clear entry criteria, practical assessments, and business value. Engineers pursue the next tier because it opens new project types, not because management said so.",
        },
        { type: "h2", text: "Align with Platform Expectations" },
        {
          type: "p",
          text: "Each technology vendor (Sitecore, Optimizely, Shopify, etc.) has different certification structures and update cycles. I built a unified framework that accommodates all of them without creating five separate bureaucracies. The structure is consistent, the content adapts to each platform's requirements.",
        },
        { type: "h2", text: "Renewal Cycles Are Infrastructure, Not Projects" },
        {
          type: "p",
          text: "The moment a certification ships is day one of the renewal cycle. If you don't track expirations, plan renewal windows, and build time for recertification into your team's capacity, your credentials will silently become outdated. I operationalized this with automated reminders, manager dashboards, and a rolling calendar that prevents last-minute cramming.",
        },
        {
          type: "quote",
          text: "Credentials only mean something if they stay current. That's not a one-time project, it's ongoing infrastructure.",
        },
      ],
    },
    {
      title: "L&D Integration in Acquired Companies: The First 90 Days",
      tag: "M&A INTEGRATION",
      date: "Dec 2025",
      read: "10 min",
      color: "#f97316",
      body: [
        {
          type: "p",
          text: "When your company acquires another organization, the learning and development infrastructure isn't an afterthought — it's the backbone of integration. I've led multiple L&D integration efforts, and the pattern that works is deliberate, structured, and focused on early wins.",
        },
        { type: "h2", text: "Day One: Discovery, Not Onboarding" },
        {
          type: "p",
          text: "The acquired team is full of competent people who know how to do their jobs. They just don't know how you do yours. The first priority isn't to teach them everything — it's to understand where they are so you can align them efficiently. We run structured discovery: map roles to your competency framework, identify the biggest gaps, interview managers about the team's learning culture.",
        },
        { type: "h2", text: "Days 1-30: Foundations and Belonging" },
        {
          type: "p",
          text: "In the first month, focus on three things: shared tools and processes, company culture and values, and creating early wins where the acquired team contributes visibly. Don't try to teach them your entire engineering standard in week one. Give them enough to be productive, then let them learn by doing.",
        },
        { type: "h3", text: "Make the Tools Visible, Not the Jargon" },
        {
          type: "p",
          text: "The acquired team is going to encounter Jira, Confluence, Slack, and a dozen other tools they may not have used before. Don't assume they'll figure it out. Provide structured onboarding to the tools, not lectures about your process philosophy. Let them experience the benefits, then explain the thinking behind it.",
        },
        { type: "h2", text: "Days 30-60: Capability Alignment" },
        {
          type: "p",
          text: "Now you focus on skill gaps. Enroll the team in relevant certification tracks, pair them with internal mentors for hands-on learning, and start assigning them to projects where they can apply new skills immediately. This is where you build credibility — they see that the learning path actually prepares them for the work.",
        },
        { type: "h2", text: "Days 60-90: Independence and Ownership" },
        {
          type: "p",
          text: "By day 90, the acquired team should be operating with minimal L&D support. They understand the standards, they're pursuing their own professional development, and they're contributing at expected quality levels. Your job at this point is to maintain the infrastructure, not to manually support each person.",
        },
        {
          type: "quote",
          text: "The integration is complete when you can no longer tell who was the legacy organization and who was acquired. That's when the infrastructure you built actually worked.",
        },
      ],
    },
  ];

  return (
    <>
      <section id="blog" style={{ padding: "120px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Reveal>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 16,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 13,
                  color: "var(--accent)",
                  letterSpacing: "0.1em",
                }}
              >
                04
              </span>
              <span
                style={{ width: 40, height: 1, background: "var(--border)" }}
              />
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 13,
                  color: "var(--text-tertiary)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                Insights
              </span>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                marginBottom: 60,
                flexWrap: "wrap",
                gap: 20,
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(32px, 4vw, 48px)",
                  fontWeight: 700,
                  lineHeight: 1.15,
                  letterSpacing: "-0.02em",
                  color: "var(--text-primary)",
                  margin: 0,
                }}
              >
                Thinking out loud.
              </h2>
            </div>
          </Reveal>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
              gap: 20,
            }}
          >
            {posts.map((post, i) => (
              <Reveal key={i} delay={0.1 * i}>
                <div
                  onClick={() => setOpenPost(post)}
                  style={{
                    padding: 28,
                    borderRadius: 16,
                    border: "1px solid var(--border)",
                    background: "var(--card-bg)",
                    transition: "border-color 0.3s, transform 0.2s",
                    cursor: "pointer",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = post.color;
                    e.currentTarget.style.transform = "translateY(-3px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.transform = "none";
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      color: post.color,
                      letterSpacing: "0.12em",
                      fontWeight: 600,
                    }}
                  >
                    {post.tag}
                  </span>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 19,
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      margin: "16px 0 auto",
                      lineHeight: 1.35,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {post.title}
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: 24,
                      paddingTop: 16,
                      borderTop: "1px solid var(--border)",
                    }}
                  >
                    <div style={{ display: "flex", gap: 16 }}>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 12,
                          color: "var(--text-tertiary)",
                        }}
                      >
                        {post.date}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 12,
                          color: "var(--text-tertiary)",
                        }}
                      >
                        {post.read} read
                      </span>
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
      {openPost && (
        <BlogPost post={openPost} onClose={() => setOpenPost(null)} />
      )}
    </>
  );
}

// ─── Contact ───
function Contact() {
  return (
    <section
      id="contact"
      style={{ padding: "120px 24px", background: "var(--bg-secondary)" }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
        <Reveal>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                color: "var(--accent)",
                letterSpacing: "0.1em",
              }}
            >
              05
            </span>
            <span
              style={{ width: 40, height: 1, background: "var(--border)" }}
            />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 13,
                color: "var(--text-tertiary)",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Contact
            </span>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(36px, 5vw, 56px)",
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              color: "var(--text-primary)",
              margin: "0 0 24px",
            }}
          >
            Let's build something
            <br />
            <span
              style={{
                background:
                  "linear-gradient(135deg, var(--accent), var(--accent-secondary))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              together.
            </span>
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 18,
              lineHeight: 1.7,
              color: "var(--text-secondary)",
              maxWidth: 500,
              margin: "0 auto 48px",
            }}
          >
            Exploring roles in Enterprise L&D, AI Adoption, and Knowledge
            Management at forward-thinking organizations.
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            {[
              {
                icon: <Mail size={18} />,
                label: "Email",
                href: "mailto:juanjoleong@gmail.com",
                color: "var(--accent)",
              },
              {
                icon: <Linkedin size={18} />,
                label: "LinkedIn",
                href: "https://linkedin.com/in/juanjoleong",
                color: "#0a66c2",
              },
              {
                icon: <Github size={18} />,
                label: "GitHub",
                href: "https://github.com/ingenieriawebudla",
                color: "var(--text-primary)",
              },
            ].map((link, i) => (
              <a
                key={i}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "14px 24px",
                  borderRadius: 12,
                  border: "1px solid var(--border)",
                  background: "var(--card-bg)",
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-body)",
                  fontSize: 15,
                  fontWeight: 500,
                  textDecoration: "none",
                  transition:
                    "border-color 0.3s, transform 0.2s, background 0.3s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = link.color;
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.background = "var(--card-hover)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.background = "var(--card-bg)";
                }}
              >
                <span style={{ color: link.color }}>{link.icon}</span>
                {link.label}
                <ExternalLink
                  size={12}
                  style={{ color: "var(--text-tertiary)" }}
                />
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
    <footer
      style={{ padding: "40px 24px", borderTop: "1px solid var(--border)" }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            color: "var(--text-tertiary)",
          }}
        >
          © 2026 Juan José León Guerrero. Built with React & Vite.
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            color: "var(--text-tertiary)",
          }}
        >
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
      { threshold: 0.3 },
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
    <div
      style={
        {
          ...theme,
          "--font-display": "'Sora', sans-serif",
          "--font-body": "'DM Sans', sans-serif",
          "--font-mono": "'JetBrains Mono', monospace",
          background: "var(--bg-primary)",
          color: "var(--text-primary)",
          minHeight: "100vh",
          overflowX: "hidden",
          transition: "background 0.4s, color 0.4s",
        } as React.CSSProperties
      }
    >
      {/* Font imports */}
      <link
        href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

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

      <Nav
        activeSection={activeSection}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
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
