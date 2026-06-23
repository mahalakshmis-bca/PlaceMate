import { useState, useEffect, useRef, useCallback } from "react";

/* ─── GLOBAL STYLES ───────────────────────────────────────────────────────── */
const G = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html,body,#root{width:100%;min-height:100vh;overflow-x:hidden}
body{font-family:'Inter',-apple-system,sans-serif;background:#05071A;color:#F1F5F9}
::-webkit-scrollbar{width:5px}
::-webkit-scrollbar-track{background:#0A0D2A}
::-webkit-scrollbar-thumb{background:#312E81;border-radius:99px}

/* ── Keyframes ── */
@keyframes meshMove{
  0%{transform:translate(0%,0%) rotate(0deg) scale(1)}
  33%{transform:translate(3%,-4%) rotate(1deg) scale(1.06)}
  66%{transform:translate(-3%,3%) rotate(-1deg) scale(0.97)}
  100%{transform:translate(0%,0%) rotate(0deg) scale(1)}
}
@keyframes meshMove2{
  0%{transform:translate(0%,0%) scale(1)}
  40%{transform:translate(-4%,5%) scale(1.09)}
  80%{transform:translate(4%,-3%) scale(0.94)}
  100%{transform:translate(0%,0%) scale(1)}
}
@keyframes meshMove3{
  0%{transform:translate(0%,0%) scale(1)}
  50%{transform:translate(5%,-2%) scale(1.04)}
  100%{transform:translate(0%,0%) scale(1)}
}
@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
@keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.7;transform:scale(0.93)}}
@keyframes pulseDot{0%{box-shadow:0 0 0 0 rgba(16,185,129,.6)}70%{box-shadow:0 0 0 8px rgba(16,185,129,0)}100%{box-shadow:0 0 0 0 rgba(16,185,129,0)}}
@keyframes borderGlow{0%,100%{border-color:rgba(67,56,202,.3)}50%{border-color:rgba(16,185,129,.5)}}
@keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
@keyframes countUp{from{opacity:0;transform:scale(.7)}to{opacity:1;transform:scale(1)}}
@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes cardReveal{from{opacity:0;transform:translateY(30px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes navSlide{from{transform:translateY(-100%)}to{transform:translateY(0)}}
@keyframes toastIn{from{opacity:0;transform:translateY(24px) scale(.9)}to{opacity:1;transform:translateY(0) scale(1)}}

/* ── Typography ── */
.hero-title{font-size:clamp(28px,5.5vw,60px);font-weight:900;line-height:1.08;letter-spacing:-1.5px}
.hero-sub{font-size:clamp(14px,2vw,18px);line-height:1.8;color:rgba(241,245,249,.65)}
.section-title{font-size:clamp(20px,3vw,28px);font-weight:800;color:#F1F5F9}

/* ── Glass card ── */
.g-card{
  background:rgba(15,18,45,.55);
  backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);
  border:1px solid rgba(99,102,241,.18);
  border-radius:20px;
  transition:transform .25s ease,box-shadow .25s ease,border-color .25s ease;
}
.g-card:hover{
  transform:translateY(-4px);
  box-shadow:0 24px 60px rgba(49,46,129,.35);
  border-color:rgba(99,102,241,.4);
}
.g-card-light{
  background:rgba(255,255,255,.06);
  backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);
  border:1px solid rgba(255,255,255,.1);
  border-radius:18px;
  transition:transform .22s ease,border-color .22s ease,background .22s ease;
}
.g-card-light:hover{
  transform:translateY(-3px);
  background:rgba(255,255,255,.1);
  border-color:rgba(16,185,129,.4);
}

/* ── Buttons ── */
.btn-primary{
  background:linear-gradient(135deg,#312E81,#4338CA);
  color:#fff;border:none;border-radius:12px;font-weight:800;
  cursor:pointer;position:relative;overflow:hidden;
  transition:transform .15s ease,box-shadow .15s ease;
  box-shadow:0 6px 24px rgba(49,46,129,.45);
}
.btn-primary::after{
  content:'';position:absolute;inset:0;
  background:linear-gradient(135deg,transparent 30%,rgba(255,255,255,.12) 50%,transparent 70%);
  background-size:200% 100%;background-position:-200%;
  transition:background-position .5s ease;
}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 12px 36px rgba(49,46,129,.6)}
.btn-primary:hover::after{background-position:200%}
.btn-primary:active{transform:scale(.97)}

.btn-emerald{
  background:linear-gradient(135deg,#059669,#10B981);
  color:#fff;border:none;border-radius:12px;font-weight:800;
  cursor:pointer;transition:transform .15s ease,box-shadow .15s ease;
  box-shadow:0 6px 24px rgba(16,185,129,.4);
}
.btn-emerald:hover{transform:translateY(-2px);box-shadow:0 12px 36px rgba(16,185,129,.55)}
.btn-emerald:active{transform:scale(.97)}

.btn-ghost{
  background:rgba(255,255,255,.08);color:#F1F5F9;
  border:1px solid rgba(255,255,255,.2);border-radius:12px;font-weight:700;
  cursor:pointer;backdrop-filter:blur(8px);
  transition:background .18s,transform .15s,border-color .18s;
}
.btn-ghost:hover{background:rgba(255,255,255,.15);border-color:rgba(255,255,255,.35);transform:translateY(-1px)}

/* ── Input ── */
.pm-input{
  width:100%;padding:14px 16px 14px 46px;
  background:rgba(255,255,255,.07);
  border:1px solid rgba(255,255,255,.12);border-radius:14px;
  font-size:15px;color:#F1F5F9;outline:none;font-family:inherit;
  transition:border-color .2s,box-shadow .2s,background .2s;
  backdrop-filter:blur(8px);
}
.pm-input::placeholder{color:rgba(241,245,249,.4)}
.pm-input:focus{border-color:rgba(99,102,241,.6);box-shadow:0 0 0 3px rgba(67,56,202,.18);background:rgba(255,255,255,.1)}

/* ── Pills ── */
.skill-pill{
  background:rgba(67,56,202,.18);color:#A5B4FC;
  font-size:11.5px;font-weight:600;padding:4px 11px;border-radius:99px;
  border:1px solid rgba(99,102,241,.25);display:inline-block;
  transition:background .15s,color .15s;
}
.skill-pill:hover{background:rgba(67,56,202,.32);color:#C7D2FE}
.elig-pill{
  background:rgba(16,185,129,.12);color:#6EE7B7;
  font-size:12px;font-weight:600;padding:5px 13px;border-radius:99px;
  border:1px solid rgba(16,185,129,.25);
}

/* ── Filter buttons ── */
.filter-btn{
  padding:7px 16px;border-radius:99px;font-size:13px;font-weight:600;cursor:pointer;
  transition:all .18s ease;border:1px solid rgba(255,255,255,.12);
  background:rgba(255,255,255,.06);color:rgba(241,245,249,.65);
}
.filter-btn.active{background:linear-gradient(135deg,#312E81,#4338CA);color:#fff;border-color:transparent;box-shadow:0 4px 16px rgba(49,46,129,.4)}
.filter-btn:hover:not(.active){background:rgba(255,255,255,.12);color:#F1F5F9;border-color:rgba(255,255,255,.2)}

/* ── Mobile nav ── */
.mob-nav{
  position:fixed;bottom:0;left:0;right:0;z-index:200;
  background:rgba(5,7,26,.92);backdrop-filter:blur(24px);
  border-top:1px solid rgba(99,102,241,.2);
  display:flex;justify-content:space-around;
  padding:8px 0 max(10px,env(safe-area-inset-bottom));
}
.mob-nav-btn{
  background:none;border:none;cursor:pointer;
  display:flex;flex-direction:column;align-items:center;gap:3px;
  padding:4px 18px;color:rgba(241,245,249,.5);
  transition:color .18s;
}
.mob-nav-btn.active{color:#818CF8}

/* ── Responsive ── */
.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.opp-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.detail-grid{display:grid;grid-template-columns:1fr 310px;gap:22px;align-items:start}
.nav-label{display:inline}
.hero-btns{flex-direction:row}

@media(max-width:1024px){
  .opp-grid{grid-template-columns:repeat(2,1fr)}
  .stats-grid{grid-template-columns:repeat(2,1fr)}
}
@media(max-width:768px){
  .opp-grid{grid-template-columns:1fr}
  .stats-grid{grid-template-columns:repeat(2,1fr)}
  .detail-grid{grid-template-columns:1fr}
  .nav-label{display:none}
  .hero-btns{flex-direction:column}
}
@media(max-width:480px){
  .stats-grid{grid-template-columns:repeat(2,1fr)}
}
`;

/* ─── CANVAS PARTICLE SYSTEM ─────────────────────────────────────────────── */
function ParticleCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let W, H, particles = [], lines = [], animId;
    const COLORS = ["rgba(99,102,241,", "rgba(16,185,129,", "rgba(167,139,250,"];

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * W;
        this.y = Math.random() * H;
        this.vx = (Math.random() - .5) * .4;
        this.vy = (Math.random() - .5) * .4;
        this.r = Math.random() * 1.8 + .4;
        this.alpha = Math.random() * .55 + .1;
        this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = .008 + Math.random() * .012;
      }
      update() {
        this.x += this.vx; this.y += this.vy;
        this.pulse += this.pulseSpeed;
        if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
      }
      draw() {
        const a = this.alpha + Math.sin(this.pulse) * .15;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.color + Math.max(0, Math.min(1, a)) + ")";
        ctx.fill();
      }
    }

    const COUNT = Math.min(120, Math.floor((W * H) / 12000));
    for (let i = 0; i < COUNT; i++) particles.push(new Particle());

    function drawLines() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 130) {
            const a = (1 - d / 130) * .12;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99,102,241,${a})`;
            ctx.lineWidth = .6;
            ctx.stroke();
          }
        }
      }
    }

    function loop() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => { p.update(); p.draw(); });
      drawLines();
      animId = requestAnimationFrame(loop);
    }
    loop();
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <canvas ref={ref} style={{
      position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
      width: "100vw", height: "100vh",
    }} />
  );
}

/* ─── MESH BG BLOBS ──────────────────────────────────────────────────────── */
function MeshBg() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, overflow: "hidden", pointerEvents: "none" }}>
      <div style={{
        position: "absolute", top: "-25%", left: "-15%",
        width: "70vw", height: "70vw", borderRadius: "50%",
        background: "radial-gradient(circle,rgba(49,46,129,.38) 0%,rgba(67,56,202,.16) 45%,transparent 72%)",
        filter: "blur(72px)",
        animation: "meshMove 20s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", bottom: "-20%", right: "-12%",
        width: "65vw", height: "65vw", borderRadius: "50%",
        background: "radial-gradient(circle,rgba(16,185,129,.28) 0%,rgba(5,150,105,.12) 50%,transparent 75%)",
        filter: "blur(80px)",
        animation: "meshMove2 26s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", top: "35%", right: "15%",
        width: "45vw", height: "45vw", borderRadius: "50%",
        background: "radial-gradient(circle,rgba(124,58,237,.2) 0%,transparent 70%)",
        filter: "blur(60px)",
        animation: "meshMove3 32s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", bottom: "10%", left: "20%",
        width: "35vw", height: "35vw", borderRadius: "50%",
        background: "radial-gradient(circle,rgba(16,185,129,.14) 0%,transparent 70%)",
        filter: "blur(50px)",
        animation: "meshMove 38s ease-in-out infinite reverse",
      }} />
    </div>
  );
}

/* ─── DATA ────────────────────────────────────────────────────────────────── */
const TIPS = [
  "Tailor your resume keywords to match the job description. Takes 10 minutes. Looks premium.",
  "Follow up within 48 hours after submitting. It separates you from 90% of applicants.",
  "Your GitHub profile is your portfolio. Pin your best 3 projects with clean READMEs.",
  "Research the company before every interview — mention one specific thing you genuinely admire.",
  "Deadlines don't wait. Apply 3 days early, never the last hour.",
  "A cover letter under 200 words gets read far more than a long one.",
];

const OPPS = [
  { id: 1, role: "Frontend Developer Intern", company: "Zoho Corporation", location: "Chennai", type: "Internship", deadline: "2026-06-28", skills: ["React", "JavaScript", "CSS", "Git"], eligibility: ["BCA", "BSc CS", "BTech CSE"], about: "Join Zoho's product engineering team building responsive web interfaces for enterprise SaaS tools used by millions. You'll work directly with senior engineers on live product features.", category: "Frontend", icon: "⚡" },
  { id: 2, role: "Data Analyst Intern", company: "Freshworks", location: "Chennai", type: "Internship", deadline: "2026-07-05", skills: ["Python", "SQL", "Excel", "Tableau"], eligibility: ["BSc Statistics", "BTech CSE", "MBA"], about: "Work with Freshworks' growth analytics team to surface insights from customer usage data. You'll own dashboards, run cohort analyses, and present findings to product teams.", category: "Data Analyst", icon: "📊" },
  { id: 3, role: "UI/UX Design Intern", company: "Chargebee", location: "Remote", type: "Internship", deadline: "2026-06-25", skills: ["Figma", "Prototyping", "User Research", "Wireframing"], eligibility: ["BDes", "BSc CS", "BCA"], about: "Chargebee's design team is looking for a UI/UX intern to craft intuitive flows for their subscription billing platform. You'll run usability tests and iterate with real feedback.", category: "UI/UX", icon: "🎨" },
  { id: 4, role: "Backend Engineer Intern", company: "Razorpay", location: "Bangalore", type: "Internship", deadline: "2026-07-12", skills: ["Node.js", "PostgreSQL", "REST APIs", "Docker"], eligibility: ["BTech CSE", "BTech IT", "MCA"], about: "Build and scale payment infrastructure at Razorpay. You'll contribute to microservices powering millions of daily transactions with mentorship from staff engineers.", category: "Backend", icon: "🔧" },
  { id: 5, role: "ML Research Intern", company: "Samsung R&D", location: "Bangalore", type: "Research Internship", deadline: "2026-07-20", skills: ["Python", "PyTorch", "NLP", "Research Methods"], eligibility: ["BTech CSE", "MTech AI/ML", "MSc CS"], about: "Samsung R&D India is seeking ML interns to work on on-device AI for mobile apps. You'll prototype models optimised for edge deployment and publish internal research.", category: "Backend", icon: "🧠" },
  { id: 6, role: "Product Management Intern", company: "Swiggy", location: "Hyderabad", type: "Internship", deadline: "2026-07-08", skills: ["Product Thinking", "Data Analysis", "Roadmapping", "Communication"], eligibility: ["MBA", "BTech CSE", "BBA"], about: "Work with Swiggy's consumer product team defining features for 80M+ users. You'll run experiments, write PRDs, and coordinate across engineering, design, and data teams.", category: "Frontend", icon: "🚀" },
  { id: 7, role: "DevOps Intern", company: "Infosys", location: "Chennai", type: "Internship", deadline: "2026-06-30", skills: ["Linux", "AWS", "Jenkins", "Docker", "Kubernetes"], eligibility: ["BTech CSE", "BTech IT", "MCA"], about: "Join Infosys's cloud infrastructure team to automate CI/CD pipelines and manage containerised deployments for enterprise clients across fintech and healthcare verticals.", category: "Backend", icon: "☁️" },
  { id: 8, role: "Content & SEO Intern", company: "Wiviy", location: "Remote", type: "Internship", deadline: "2026-07-15", skills: ["SEO", "Content Writing", "Keyword Research", "Analytics"], eligibility: ["BA English", "BCA", "BBA", "Any Graduate"], about: "Help Wiviy grow organic traffic by crafting SEO-optimised articles, improving on-page scores, and building a content calendar. Ideal for someone who loves writing and data equally.", category: "UI/UX", icon: "✍️" },
];

/* ─── HELPERS ─────────────────────────────────────────────────────────────── */
function daysLeft(d) { return Math.ceil((new Date(d) - new Date()) / 86400000); }

function DeadlineBadge({ deadline }) {
  const d = daysLeft(deadline);
  let bg, color, label;
  if (d < 0) { bg = "rgba(100,116,139,.15)"; color = "#94A3B8"; label = "Closed"; }
  else if (d <= 3) { bg = "rgba(239,68,68,.15)"; color = "#FCA5A5"; label = `${d}d left`; }
  else if (d <= 7) { bg = "rgba(245,158,11,.15)"; color = "#FCD34D"; label = `${d}d left`; }
  else { bg = "rgba(16,185,129,.15)"; color = "#6EE7B7"; label = `${d}d left`; }
  return (
    <span style={{
      background: bg, color, fontSize: 11, fontWeight: 700, padding: "3px 10px",
      borderRadius: 99, letterSpacing: .4, whiteSpace: "nowrap", flexShrink: 0,
      border: `1px solid ${color.replace(")", ",0.25)")}`
    }}>
      {label}
    </span>
  );
}

function Toast({ message, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 2800); return () => clearTimeout(t); }, [onClose]);
  return (
    <div style={{
      position: "fixed", bottom: 80, right: 24, zIndex: 9999,
      background: "linear-gradient(135deg,#312E81,#4338CA)",
      color: "#fff", padding: "14px 22px", borderRadius: 16, fontSize: 14, fontWeight: 700,
      boxShadow: "0 16px 48px rgba(49,46,129,.55)",
      display: "flex", alignItems: "center", gap: 10,
      animation: "toastIn .35s cubic-bezier(.34,1.56,.64,1)",
      maxWidth: "calc(100vw - 48px)",
      border: "1px solid rgba(255,255,255,.15)",
    }}>
      <span style={{ fontSize: 18, animation: "float 1.4s ease-in-out infinite" }}>🔖</span>
      {message}
    </div>
  );
}

/* ─── ANIMATED COUNTER ───────────────────────────────────────────────────── */
function Counter({ target, duration = 1200 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        const start = Date.now();
        const tick = () => {
          const p = Math.min((Date.now() - start) / duration, 1);
          setVal(Math.floor(p * target));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        observer.disconnect();
      }
    }, { threshold: .3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);
  return <span ref={ref}>{val}</span>;
}

/* ─── OPPORTUNITY CARD ────────────────────────────────────────────────────── */
function OppCard({ opp, saved, onSave, onView, delay = 0 }) {
  return (
    <div className="g-card" style={{
      padding: "22px", display: "flex", flexDirection: "column", gap: 14,
      cursor: "pointer", animation: `cardReveal .5s ease ${delay}ms both`,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start", minWidth: 0 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 11, flexShrink: 0,
            background: "linear-gradient(135deg,rgba(49,46,129,.6),rgba(67,56,202,.4))",
            border: "1px solid rgba(99,102,241,.3)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
          }}>{opp.icon}</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 14.5, fontWeight: 800, color: "#E0E7FF", lineHeight: 1.3, marginBottom: 3 }}>{opp.role}</div>
            <div style={{ fontSize: 12.5, color: "rgba(165,180,252,.7)", fontWeight: 500 }}>{opp.company} · {opp.location}</div>
          </div>
        </div>
        <DeadlineBadge deadline={opp.deadline} />
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {opp.skills.slice(0, 3).map(s => <span key={s} className="skill-pill">{s}</span>)}
        {opp.skills.length > 3 && <span style={{ fontSize: 11.5, color: "rgba(165,180,252,.5)", alignSelf: "center" }}>+{opp.skills.length - 3}</span>}
      </div>

      <div style={{ height: 1, background: "rgba(99,102,241,.15)" }} />

      <div style={{ display: "flex", gap: 8 }}>
        <button className="btn-primary" onClick={() => onView(opp)}
          style={{ flex: 1, padding: "9px", fontSize: 13 }}>
          View Details →
        </button>
        <button onClick={(e) => { e.stopPropagation(); onSave(); }} style={{
          background: saved ? "rgba(16,185,129,.18)" : "rgba(255,255,255,.06)",
          color: saved ? "#6EE7B7" : "rgba(241,245,249,.5)",
          border: `1px solid ${saved ? "rgba(16,185,129,.3)" : "rgba(255,255,255,.1)"}`,
          padding: "9px 14px", borderRadius: 11, fontSize: 13, fontWeight: 700,
          cursor: "pointer", transition: "all .2s", whiteSpace: "nowrap",
        }}>
          {saved ? "✓ Saved" : "☆ Save"}
        </button>
      </div>
    </div>
  );
}

/* ─── HOME DASHBOARD ──────────────────────────────────────────────────────── */
function HomeDashboard({ saved, onSave, onView, onNav }) {
  const [tipIdx, setTipIdx] = useState(0);
  const [tipAnim, setTipAnim] = useState(true);

  const nextTip = () => {
    setTipAnim(false);
    setTimeout(() => { setTipIdx(i => (i + 1) % TIPS.length); setTipAnim(true); }, 200);
  };

  return (
    <div>
      {/* ── Hero ── */}
      <div style={{ padding: "80px 0 60px", position: "relative" }}>
        <div style={{ animation: "fadeUp .7s ease both" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(16,185,129,.12)", border: "1px solid rgba(16,185,129,.25)",
            borderRadius: 99, padding: "6px 16px", marginBottom: 28,
          }}>
            <span style={{
              width: 8, height: 8, borderRadius: "50%", background: "#10B981",
              display: "inline-block", animation: "pulseDot 1.8s ease-out infinite"
            }} />
            <span style={{ fontSize: 11.5, color: "#6EE7B7", fontWeight: 800, letterSpacing: 1.2 }}>
              124 LIVE OPPORTUNITIES
            </span>
          </div>

          <h1 className="hero-title" style={{ marginBottom: 20, color: "#E0E7FF" }}>
            Apply Today.<br />
            <span style={{
              background: "linear-gradient(135deg,#818CF8,#10B981)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>Build Tomorrow.</span>
          </h1>
          <p
            className="hero-sub"
            style={{
              maxWidth: 520,
              marginBottom: 36,
              marginLeft: "auto",
              marginRight: "auto",
              textAlign: "center",
            }}
          >
            Discover internships and placements, save opportunities, and stay ahead of every deadline — all in one place.
          </p>
          <div className="hero-btns" style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <button className="btn-emerald" onClick={() => onNav("discover")}
              style={{ padding: "14px 30px", fontSize: 15 }}>
              Explore Opportunities →
            </button>
            <button className="btn-ghost" onClick={() => onNav("saved")}
              style={{ padding: "14px 26px", fontSize: 15 }}>
              Saved ({saved.length})
            </button>
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="stats-grid" style={{ marginBottom: 28, animation: "fadeUp .7s .15s ease both" }}>
        {[
          { icon: "🎯", val: 124, label: "Active Opportunities", g: "#312E81,#4338CA" },
          { icon: "🏢", val: 32, label: "Companies Hiring", g: "#5B21B6,#7C3AED" },
          { icon: "⏰", val: 8, label: "Closing This Week", g: "#991B1B,#DC2626" },
          { icon: "🔖", val: saved.length, label: "Saved", g: "#065F46,#059669" },
        ].map(s => (
          <div key={s.label} className="g-card" style={{ padding: "22px 20px" }}>
            <div style={{
              width: 42, height: 42, borderRadius: 12, marginBottom: 14,
              background: `linear-gradient(135deg,${s.g})`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
              boxShadow: `0 6px 20px rgba(${s.g.split(",")[0].replace("#", "")},0.3)`,
            }}>{s.icon}</div>
            <div style={{ fontSize: 36, fontWeight: 900, color: "#E0E7FF", lineHeight: 1, marginBottom: 6 }}>
              <Counter target={typeof s.val === "number" ? s.val : 0} />
              {typeof s.val === "number" ? "" : s.val}
            </div>
            <div style={{ fontSize: 12.5, color: "rgba(165,180,252,.65)", fontWeight: 500, lineHeight: 1.4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Tip card ── */}
      <div className="g-card-light" style={{
        padding: "20px 24px", marginBottom: 44,
        borderColor: "rgba(16,185,129,.25)",
        animation: "fadeUp .7s .25s ease both",
        background: "rgba(16,185,129,.06)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 14 }}>
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start", flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: 22, animation: "float 3s ease-in-out infinite", flexShrink: 0 }}>💡</span>
            <div>
              <div style={{ fontSize: 10.5, fontWeight: 800, color: "#34D399", letterSpacing: 1.3, marginBottom: 7 }}>TIP OF THE DAY</div>
              <div style={{
                fontSize: 14, color: "rgba(209,250,229,.85)", lineHeight: 1.75, fontWeight: 500,
                transition: "opacity .2s", opacity: tipAnim ? 1 : 0,
              }}>{TIPS[tipIdx]}</div>
            </div>
          </div>
          <button className="btn-emerald" onClick={nextTip}
            style={{ padding: "9px 18px", fontSize: 13, flexShrink: 0 }}>Next →</button>
        </div>
      </div>

      {/* ── Featured ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, animation: "fadeUp .7s .3s ease both" }}>
        <h2 className="section-title" style={{ fontSize: 20 }}>Featured Opportunities</h2>
        <button onClick={() => onNav("discover")} style={{
          background: "none", border: "none", color: "#818CF8", fontWeight: 700, fontSize: 14,
          cursor: "pointer", transition: "color .18s",
        }}>View all →</button>
      </div>
      <div className="opp-grid">
        {OPPS.slice(0, 4).map((o, i) => (
          <OppCard key={o.id} opp={o} saved={saved.includes(o.id)}
            onSave={() => onSave(o.id)} onView={onView} delay={i * 80} />
        ))}
      </div>
    </div>
  );
}

/* ─── FILTER GROUP ────────────────────────────────────────────────────────── */
function FilterGroup({ label, options, value, onChange }) {
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
      <span style={{ fontSize: 11.5, fontWeight: 700, color: "rgba(165,180,252,.6)", marginRight: 2 }}>{label}:</span>
      {options.map(o => (
        <button key={o} className={`filter-btn${value === o ? " active" : ""}`} onClick={() => onChange(o)}>{o}</button>
      ))}
    </div>
  );
}

/* ─── DISCOVER PAGE ───────────────────────────────────────────────────────── */
function DiscoverPage({ saved, onSave, onView }) {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("All");
  const [loc, setLoc] = useState("All");

  const filtered = OPPS.filter(o => {
    const q = search.toLowerCase();
    return (!q || o.role.toLowerCase().includes(q) || o.company.toLowerCase().includes(q) || o.skills.some(s => s.toLowerCase().includes(q)))
      && (role === "All" || o.category === role)
      && (loc === "All" || o.location === loc);
  });

  return (
    <div style={{ animation: "fadeIn .4s ease" }}>
      <div style={{ marginBottom: 28 }}>
        <h2 className="section-title" style={{ marginBottom: 6 }}>Discover Opportunities</h2>
        <p style={{ color: "rgba(165,180,252,.6)", fontSize: 14 }}>Find your next internship or placement role</p>
      </div>

      <div style={{ position: "relative", marginBottom: 18 }}>
        <span style={{ position: "absolute", left: 15, top: "50%", transform: "translateY(-50%)", fontSize: 17, pointerEvents: "none" }}>🔍</span>
        <input className="pm-input" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search role, company or skill..." />
      </div>

      <div style={{ display: "flex", gap: 18, flexWrap: "wrap", marginBottom: 28 }}>
        <FilterGroup label="Role" options={["All", "Frontend", "Backend", "UI/UX", "Data Analyst"]} value={role} onChange={setRole} />
        <FilterGroup label="Location" options={["All", "Chennai", "Bangalore", "Hyderabad", "Remote"]} value={loc} onChange={setLoc} />
      </div>

      {filtered.length === 0 ? (
        <div className="g-card" style={{ textAlign: "center", padding: "72px 24px" }}>
          <div style={{ fontSize: 52, marginBottom: 16, animation: "float 3s ease-in-out infinite" }}>🔎</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#E0E7FF", marginBottom: 8 }}>No opportunities found</div>
          <div style={{ fontSize: 14, color: "rgba(165,180,252,.6)" }}>Try adjusting your filters or search terms.</div>
        </div>
      ) : (
        <>
          <div style={{ fontSize: 13, color: "rgba(165,180,252,.55)", fontWeight: 600, marginBottom: 18 }}>
            {filtered.length} opportunit{filtered.length !== 1 ? "ies" : "y"} found
          </div>
          <div className="opp-grid">
            {filtered.map((o, i) => (
              <OppCard key={o.id} opp={o} saved={saved.includes(o.id)}
                onSave={() => onSave(o.id)} onView={onView} delay={i * 60} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ─── DETAIL PAGE ─────────────────────────────────────────────────────────── */
function DetailPage({ opp, saved, onSave, onBack }) {
  return (
    <div style={{ animation: "fadeIn .35s ease" }}>
      <button onClick={onBack} style={{
        background: "rgba(99,102,241,.12)", border: "1px solid rgba(99,102,241,.2)",
        color: "#A5B4FC", fontWeight: 700, fontSize: 13.5, cursor: "pointer",
        marginBottom: 24, padding: "8px 16px", borderRadius: 10,
        display: "flex", alignItems: "center", gap: 6, transition: "all .18s",
      }}>← Back to Discover</button>

      {/* Banner */}
      <div style={{
        background: "linear-gradient(135deg,#1e1b4b 0%,#312E81 50%,#3730A3 100%)",
        borderRadius: 22, padding: "clamp(24px,4vw,44px) clamp(20px,4vw,40px)",
        marginBottom: 24, position: "relative", overflow: "hidden",
        boxShadow: "0 24px 80px rgba(49,46,129,.4)",
        border: "1px solid rgba(99,102,241,.25)",
      }}>
        <div style={{
          position: "absolute", top: "-30%", right: "-5%", width: "50%", height: "180%",
          borderRadius: "50%", background: "rgba(16,185,129,.12)", filter: "blur(50px)", pointerEvents: "none"
        }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 18 }}>
            <div style={{
              width: 54, height: 54, borderRadius: 14, flexShrink: 0,
              background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.2)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26,
            }}>{opp.icon}</div>
            <div>
              <div style={{ fontSize: "clamp(20px,3.5vw,28px)", fontWeight: 900, color: "#E0E7FF", marginBottom: 4 }}>{opp.role}</div>
              <div style={{ fontSize: 15, color: "rgba(255,255,255,.65)", fontWeight: 500 }}>{opp.company}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            {[{ i: "📍", v: opp.location }, { i: "💼", v: opp.type }, { i: "📅", v: new Date(opp.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) }].map(m => (
              <div key={m.v} style={{
                background: "rgba(255,255,255,.12)", borderRadius: 9, padding: "7px 14px",
                fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 7, color: "#E0E7FF",
                backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,.12)",
              }}>{m.i} {m.v}</div>
            ))}
            <DeadlineBadge deadline={opp.deadline} />
          </div>
        </div>
      </div>

      <div className="detail-grid">
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {[
            { title: "About the Opportunity", content: <p style={{ fontSize: 14.5, color: "rgba(226,232,240,.8)", lineHeight: 1.85 }}>{opp.about}</p> },
            { title: "Required Skills", content: <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{opp.skills.map(s => <span key={s} className="skill-pill">{s}</span>)}</div> },
            { title: "Eligibility", content: <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{opp.eligibility.map(e => <span key={e} className="elig-pill">{e}</span>)}</div> },
          ].map(sec => (
            <div key={sec.title} className="g-card" style={{ padding: "24px" }}>
              <div style={{ fontSize: 14.5, fontWeight: 800, color: "#C7D2FE", marginBottom: 14, letterSpacing: .2 }}>{sec.title}</div>
              {sec.content}
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="g-card" style={{ padding: "24px", position: "sticky", top: 76 }}>
          <div style={{ fontSize: 14.5, fontWeight: 800, color: "#C7D2FE", marginBottom: 18, letterSpacing: .2 }}>Apply for this role</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 13, marginBottom: 20 }}>
            {[{ l: "Company", v: opp.company }, { l: "Location", v: opp.location }, { l: "Type", v: opp.type },
            { l: "Deadline", v: new Date(opp.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) }].map(r => (
              <div key={r.l} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, gap: 8 }}>
                <span style={{ color: "rgba(165,180,252,.6)", fontWeight: 500 }}>{r.l}</span>
                <span style={{ color: "#E0E7FF", fontWeight: 700, textAlign: "right" }}>{r.v}</span>
              </div>
            ))}
          </div>
          <div style={{ height: 1, background: "rgba(99,102,241,.2)", marginBottom: 18 }} />
          <button className="btn-primary" style={{ width: "100%", padding: "13px", fontSize: 15, marginBottom: 10 }}>
            Apply Now →
          </button>
          <button onClick={() => onSave(opp.id)} style={{
            width: "100%",
            background: saved ? "rgba(16,185,129,.15)" : "rgba(255,255,255,.06)",
            color: saved ? "#6EE7B7" : "rgba(241,245,249,.5)",
            border: `1px solid ${saved ? "rgba(16,185,129,.3)" : "rgba(255,255,255,.1)"}`,
            borderRadius: 11, padding: "11px", fontSize: 14, fontWeight: 700,
            cursor: "pointer", transition: "all .22s",
          }}>{saved ? "✓ Saved" : "☆ Save Opportunity"}</button>
        </div>
      </div>
    </div>
  );
}

/* ─── SAVED PAGE ──────────────────────────────────────────────────────────── */
function SavedPage({ saved, onRemove, onView }) {
  const savedOpps = OPPS.filter(o => saved.includes(o.id));
  return (
    <div style={{ animation: "fadeIn .4s ease" }}>
      <div style={{ marginBottom: 28 }}>
        <h2 className="section-title" style={{ marginBottom: 6 }}>Saved Opportunities</h2>
        <p style={{ fontSize: 14, color: "rgba(165,180,252,.6)" }}>
          You have saved <strong style={{ color: "#6EE7B7" }}>{savedOpps.length}</strong> opportunit{savedOpps.length !== 1 ? "ies" : "y"}
        </p>
      </div>
      {savedOpps.length === 0 ? (
        <div className="g-card" style={{ textAlign: "center", padding: "72px 24px" }}>
          <div style={{ fontSize: 52, marginBottom: 16, animation: "float 3s ease-in-out infinite" }}>🔖</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#E0E7FF", marginBottom: 8 }}>Nothing saved yet</div>
          <div style={{ fontSize: 14, color: "rgba(165,180,252,.6)" }}>Explore opportunities and save ones you're interested in.</div>
        </div>
      ) : (
        <div className="opp-grid">
          {savedOpps.map((o, i) => (
            <OppCard key={o.id} opp={o} saved={true}
              onSave={() => onRemove(o.id)} onView={onView} delay={i * 70} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── MOBILE BOTTOM NAV ───────────────────────────────────────────────────── */
function MobileNav({ page, onNav, savedCount }) {
  const items = [
    { key: "home", icon: "⊞", label: "Home" },
    { key: "discover", icon: "🔍", label: "Discover" },
    { key: "saved", icon: "🔖", label: "Saved", badge: savedCount },
  ];
  return (
    <div className="mob-nav">
      {items.map(n => {
        const active = page === n.key || (page === "detail" && n.key === "discover");
        return (
          <button key={n.key} className={`mob-nav-btn${active ? " active" : ""}`} onClick={() => onNav(n.key)}>
            <span style={{ fontSize: 22, position: "relative" }}>
              {n.icon}
              {n.badge > 0 && (
                <span style={{
                  position: "absolute", top: -4, right: -8,
                  background: "#10B981", color: "#fff",
                  fontSize: 9, fontWeight: 800, width: 15, height: 15,
                  borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                }}>{n.badge}</span>
              )}
            </span>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: .3 }}>{n.label}</span>
            {active && <span style={{ width: 18, height: 3, borderRadius: 99, background: "#818CF8", marginTop: 1 }} />}
          </button>
        );
      })}
    </div>
  );
}

/* ─── APP ROOT ────────────────────────────────────────────────────────────── */
export default function PlaceMate() {
  const [page, setPage] = useState("home");
  const [saved, setSaved] = useState([3, 6]);
  const [detail, setDetail] = useState(null);
  const [toast, setToast] = useState(null);
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" ? window.innerWidth < 768 : false);
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    const onScroll = () => setNavScrolled(window.scrollY > 20);
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("resize", onResize); window.removeEventListener("scroll", onScroll); };
  }, []);

  const handleSave = useCallback((id) => {
    setSaved(prev => {
      if (prev.includes(id)) { setToast("Removed from saved"); return prev.filter(x => x !== id); }
      setToast("Opportunity saved! 🔖"); return [...prev, id];
    });
  }, []);

  const handleView = useCallback((opp) => {
    setDetail(opp); setPage("detail");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleNav = useCallback((p) => {
    setPage(p); setDetail(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const navItems = [
    { key: "home", label: "Dashboard", icon: "⊞" },
    { key: "discover", label: "Discover", icon: "🔍" },
    { key: "saved", label: "Saved", icon: "🔖", badge: saved.length },
  ];

  return (
    <div style={{
      fontFamily: "'Inter',-apple-system,sans-serif", minHeight: "100vh",
      background: "#05071A", position: "relative", color: "#F1F5F9"
    }}>
      <style>{G}</style>

      {/* Live animated backgrounds */}
      <MeshBg />
      <ParticleCanvas />

      {/* ── Topnav ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100, animation: "navSlide .4s ease",
        background: navScrolled ? "rgba(5,7,26,.88)" : "rgba(5,7,26,.5)",
        backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
        borderBottom: `1px solid ${navScrolled ? "rgba(99,102,241,.25)" : "rgba(99,102,241,.12)"}`,
        transition: "background .3s,border-color .3s",
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto", padding: "0 clamp(16px,4vw,32px)",
          height: 66, display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 11, cursor: "pointer", flexShrink: 0 }}
            onClick={() => handleNav("home")}>
            <div style={{
              width: 38, height: 38, borderRadius: 11, flexShrink: 0,
              background: "linear-gradient(135deg,#312E81,#4338CA)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19,
              boxShadow: "0 4px 20px rgba(49,46,129,.5)",
              border: "1px solid rgba(255,255,255,.12)",
            }}>🎓</div>
            <div>
              <span style={{
                fontSize: 17, fontWeight: 900, color: "#C7D2FE", display: "block", lineHeight: 1.2,
                background: "linear-gradient(135deg,#818CF8,#6EE7B7)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>PlaceMate</span>
              <span style={{ fontSize: 9.5, color: "rgba(165,180,252,.55)", display: "block", fontWeight: 600, letterSpacing: .5 }}>Never Miss an Opportunity</span>
            </div>
          </div>

          {/* Desktop nav */}
          {!isMobile && (
            <div style={{ display: "flex", gap: 4 }}>
              {navItems.map(n => {
                const active = page === n.key || (page === "detail" && n.key === "discover");
                return (
                  <button key={n.key} onClick={() => handleNav(n.key)} style={{
                    background: active ? "linear-gradient(135deg,#312E81,#4338CA)" : "rgba(255,255,255,.05)",
                    color: active ? "#fff" : "rgba(165,180,252,.7)",
                    border: `1px solid ${active ? "transparent" : "rgba(99,102,241,.15)"}`,
                    padding: "9px 18px", borderRadius: 10, fontSize: 13.5, fontWeight: 700,
                    cursor: "pointer", display: "flex", alignItems: "center", gap: 7, transition: "all .18s",
                    boxShadow: active ? "0 4px 16px rgba(49,46,129,.4)" : "none",
                  }}>
                    <span>{n.icon}</span>
                    <span className="nav-label">{n.label}</span>
                    {n.badge > 0 && (
                      <span style={{
                        background: "#10B981", color: "#fff", fontSize: 10, fontWeight: 800,
                        width: 18, height: 18, borderRadius: "50%",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>{n.badge}</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </nav>

      {/* ── Main ── */}
      <main style={{
        maxWidth: 1200, margin: "0 auto",
        padding: `clamp(20px,4vw,36px) clamp(16px,4vw,32px) ${isMobile ? "100px" : "80px"}`,
        position: "relative", zIndex: 1,
      }}>
        {page === "home" && <HomeDashboard saved={saved} onSave={handleSave} onView={handleView} onNav={handleNav} />}
        {page === "discover" && <DiscoverPage saved={saved} onSave={handleSave} onView={handleView} />}
        {page === "detail" && detail && <DetailPage opp={detail} saved={saved.includes(detail.id)} onSave={handleSave} onBack={() => handleNav("discover")} />}
        {page === "saved" && <SavedPage saved={saved} onRemove={handleSave} onView={handleView} />}
      </main>

      {/* ── Footer ── */}
      <footer style={{
        borderTop: "1px solid rgba(99,102,241,.15)", textAlign: "center",
        padding: "20px", fontSize: 13, color: "rgba(165,180,252,.45)",
        background: "rgba(5,7,26,.6)", backdropFilter: "blur(12px)",
        position: "relative", zIndex: 1,
        marginBottom: isMobile ? 64 : 0,
      }}>
        <span style={{
          fontWeight: 900,
          background: "linear-gradient(135deg,#818CF8,#6EE7B7)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
        }}>PlaceMate</span>
        {" "}·  SN University Placement Portal · Empowering Student Careers
      </footer>

      {/* Mobile bottom nav */}
      {isMobile && <MobileNav page={page} onNav={handleNav} savedCount={saved.length} />}

      {/* Toast */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}