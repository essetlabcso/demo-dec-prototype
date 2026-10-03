import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft, ArrowRight, BookOpen, CheckCircle2, CircleHelp,
  Clock3, FileText, LockKeyhole, MessageCircle, PauseCircle,
  Play, RefreshCw, Scale, Search, Sprout, Target, UsersRound
} from "lucide-react";

type ReflectionState = Record<string, string>;

const reflections = [
  "In my experience, HRBA makes the biggest difference when…",
  "One thing that makes HRBA difficult to use in day-to-day programme work is…",
  "One thing an organization can do in the name of HRBA without necessarily changing much is…",
  "By the end of this course, I would like to be better able to…",
];

const moduleNav = [
  "Getting Started", "Why HRBA", "Principles", "In Practice",
  "Overcoming Challenges", "Moving Forward"
];

function LandscapeArt({ variant = "hero" }: { variant?: "hero" | "observer" | "jiru" | "path" }) {
  const person = variant === "observer" ? (
    <g transform="translate(520 115)">
      <circle cx="70" cy="54" r="34" fill="#8E5D42" />
      <path d="M34 102 Q72 76 110 102 L126 230 L18 230 Z" fill="#176F78" />
      <path d="M42 112 Q72 92 104 112" fill="none" stroke="#E8F4F3" strokeWidth="12" />
      <path d="M52 24 Q74 2 99 26 Q82 50 48 50 Z" fill="#4C2C23" />
    </g>
  ) : variant === "jiru" ? (
    <g transform="translate(458 94)">
      <circle cx="96" cy="78" r="43" fill="#8F5C3E" />
      <path d="M38 138 Q92 99 151 140 L169 280 L18 280 Z" fill="#125660" />
      <path d="M54 142 Q98 116 146 144" fill="none" stroke="#D98A32" strokeWidth="15" />
      <path d="M66 34 Q102 8 132 44 Q109 60 62 63 Z" fill="#3A241F" />
      <path d="M69 122 Q96 135 122 120" fill="none" stroke="#7A442D" strokeWidth="4" strokeLinecap="round" />
    </g>
  ) : variant === "path" ? (
    <g>
      <path d="M440 350 C520 300 560 235 620 164" fill="none" stroke="#E7C684" strokeWidth="28" strokeLinecap="round"/>
      <path d="M440 350 C520 300 560 235 620 164" fill="none" stroke="#FFF3E4" strokeWidth="9" strokeLinecap="round"/>
      <circle cx="587" cy="184" r="12" fill="#D98A32"/>
    </g>
  ) : (
    <g transform="translate(392 148)">
      <circle cx="60" cy="42" r="27" fill="#8B5A3C"/>
      <path d="M26 88 Q60 66 98 88 L112 180 L16 180 Z" fill="#176F78"/>
      <circle cx="160" cy="54" r="30" fill="#6F452F"/>
      <path d="M126 101 Q160 77 195 102 L210 185 L113 185 Z" fill="#334A43"/>
      <circle cx="235" cy="65" r="28" fill="#8F5D42"/>
      <path d="M204 109 Q235 89 267 110 L278 190 L193 190 Z" fill="#5A6F6B"/>
    </g>
  );

  return (
    <svg viewBox="0 0 720 420" className={"art art-" + variant} role="img" aria-label="Stylised fictional Ethiopian highland learning environment">
      <defs>
        <linearGradient id={"sky-" + variant} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#DFF1F5"/>
          <stop offset="58%" stopColor="#F8E4BE"/>
          <stop offset="100%" stopColor="#F5F5E9"/>
        </linearGradient>
        <linearGradient id={"sun-" + variant} x1="0" x2="1">
          <stop offset="0%" stopColor="#FFF3E4"/>
          <stop offset="100%" stopColor="#F3C16D"/>
        </linearGradient>
      </defs>
      <rect width="720" height="420" rx="28" fill={"url(#sky-" + variant + ")"}/>
      <circle cx="585" cy="86" r="52" fill={"url(#sun-" + variant + ")"} opacity=".78"/>
      <path d="M0 226 L105 142 L205 210 L325 112 L438 202 L552 128 L720 224 L720 420 L0 420Z" fill="#86A59C"/>
      <path d="M0 272 L106 214 L228 254 L350 185 L480 256 L605 204 L720 258 L720 420 L0 420Z" fill="#5E857B"/>
      <path d="M0 318 Q132 266 257 320 T520 304 T720 308 L720 420 L0 420Z" fill="#7FA05A"/>
      {[0,1,2,3,4].map(i => <path key={i} d={"M40 " + (338+i*15) + " Q250 " + (302+i*16) + " 684 " + (332+i*14)} fill="none" stroke="#D8B171" strokeWidth="4" opacity=".86"/>)}
      <g opacity=".94">
        <rect x="88" y="270" width="62" height="38" fill="#E9D3AE"/>
        <polygon points="80,270 119,242 158,270" fill="#9A6040"/>
        <rect x="176" y="290" width="55" height="34" fill="#E2CCAA"/>
        <polygon points="168,290 204,264 239,290" fill="#8E5739"/>
      </g>
      {person}
    </svg>
  );
}

function Header({ screen }: { screen: number }) {
  const pct = [0,17,33,50,67,100][screen];
  return (
    <header className="topbar">
      <div className="brand"><span className="brandmark">S</span><strong>CS Learning Hub</strong><span className="course-name">Human Rights-Based Approach (HRBA)</span></div>
      <div className="status"><span>Module 1 of 6</span><span className="status-dot" aria-hidden="true"/><strong>{pct}% complete</strong><button className="menu" aria-label="Open course menu">☰</button></div>
    </header>
  );
}

function BottomNav({ screen, setScreen }: { screen:number; setScreen:(n:number)=>void }) {
  return (
    <nav className="bottomnav" aria-label="Course navigation">
      <strong className="hrba-label">HRBA</strong>
      <button className="circle-button" onClick={() => setScreen(Math.max(0, screen-1))} disabled={screen===0} aria-label="Previous screen"><ArrowLeft size={21}/></button>
      <div className="journey">
        {moduleNav.map((item,i)=>(
          <button key={item} className={i===0 ? "journey-step active" : "journey-step"} onClick={()=> i===0 && setScreen(0)} aria-current={i===0 ? "step" : undefined}>
            <span className={i===0 ? "navdot current" : "navdot"} />{i+1}. {item}
          </button>
        ))}
      </div>
      <button className="circle-button" onClick={() => setScreen(Math.min(5, screen+1))} disabled={screen===5} aria-label="Next screen"><ArrowRight size={21}/></button>
    </nav>
  );
}

function Rail({ screen, label }: { screen:number; label:string }) {
  return (
    <aside className="rail" aria-label={"Section " + screen}>
      <div className="rail-number">0{screen}</div>
      <div className="rail-label">{label}</div>
      <div className="rail-dots" aria-hidden="true">
        {[1,2,3,4].map((d,i)=><span key={d} className={i < Math.max(1,screen) ? "filled" : ""}/>)}
      </div>
    </aside>
  );
}

function Screen0({ next }:{next:()=>void}) {
  return (
    <main className="screen hero-screen">
      <div className="hero-copy">
        <p className="eyebrow">Module 1</p>
        <h1>Getting Started</h1>
        <h2>Start with the work you already know.<br/><strong>You are not starting from zero.</strong></h2>
        <p>HRBA can help you examine familiar development work more carefully—and make better decisions in practice.</p>
        <div className="meta-row">
          <span><Clock3 size={18}/>25–30 minutes</span>
          <span><FileText size={18}/>6 learning experiences</span>
          <span><UsersRound size={18}/>Reflection, stories and practical insights</span>
        </div>
        <button className="primary big" onClick={next}>Begin Module 1 <ArrowRight size={19}/></button>
      </div>
      <div className="hero-art-wrap">
        <LandscapeArt variant="hero"/>
        <blockquote className="quote overlay-quote">
          <em>“Guidelines and checklists will not transform society.”</em>
          <cite>The Danish Institute for Human Rights, 2007</cite>
        </blockquote>
      </div>
    </main>
  );
}

const familiar = [
  ["Consult communities", UsersRound],
  ["Use HRBA language", FileText],
  ["Train staff", BookOpen],
  ["Provide a complaints mechanism", MessageCircle],
  ["Collect participant information", Target],
] as const;

function Screen1({ next }:{next:()=>void}) {
  const [revealed,setRevealed]=useState(false);
  return (
    <main className="screen interior">
      <Rail screen={1} label="Opening"/>
      <section className="content split">
        <div className="copy-col">
          <h1>What makes HRBA real?</h1>
          <div className="familiar-list">
            {familiar.map(([t,I])=><div className="familiar-item" key={t}><span className="round-icon"><I size={18}/></span><span>{t}</span></div>)}
          </div>
          <p className="inquiry">These may all be useful practices. <strong>But what else would you want to know?</strong></p>
          <button className="secondary" onClick={()=>setRevealed(v=>!v)} aria-expanded={revealed}><CircleHelp size={18}/>{revealed ? "Hide practitioner questions" : "Reveal practitioner questions"}</button>
          {revealed && <div className="question-grid reveal">
            {["Did participation influence an actual decision?","What happens when someone raises a concern?","Are some people still facing greater barriers?","Does the programme respond to differences the data reveals?"].map(q=><div className="question-chip" key={q}><span>?</span>{q}</div>)}
          </div>}
          <div className="recurring-question">What does HRBA change about the decisions we make and the way people experience our programmes?</div>
          <button className="primary small" onClick={next}>Continue <ArrowRight size={18}/></button>
        </div>
        <div className="visual-col">
          <LandscapeArt variant="observer"/>
          <blockquote className="quote">
            <em>“Guidelines and checklists will not transform society.”</em>
            <cite>The Danish Institute for Human Rights, 2007</cite>
          </blockquote>
        </div>
      </section>
    </main>
  );
}

function Screen2({ next }:{next:()=>void}) {
  const cards = [
    ["Who is benefiting—and who may be missing?","Who is reaching and benefiting from the programme?",UsersRound,"mint"],
    ["Did participation influence an actual decision?","Are people’s views leading to real changes in design or implementation?",MessageCircle,"green"],
    ["Could reasonable programme rules create greater barriers for some people?","Eligibility, procedures or other rules may affect groups differently.",Target,"amber"],
    ["When someone raises a concern, what happens next?","Are concerns taken seriously and followed by a fair response?",FileText,"blue"],
  ] as const;
  return (
    <main className="screen interior">
      <Rail screen={2} label="Look Again"/>
      <section className="content">
        <div className="title-with-art">
          <div><h1>Look Again</h1><h2>Good programmes can still leave important questions.</h2><p>Even when a programme appears to be working well, it is valuable to pause and look again. A closer look can reveal different experiences, perspectives and possible gaps.</p></div>
          <div className="small-art"><LandscapeArt variant="observer"/></div>
        </div>
        <div className="analysis-cards">
          {cards.map(([title,body,I,tone])=><article className={"analysis-card "+tone} key={title}><div className="card-visual"><I size={22}/></div><h3>{title}</h3><p>{body}</p></article>)}
        </div>
        <div className="constraint-strip">
          <strong>Practical constraints</strong>
          {["Limited time and budgets","Incomplete information","Competing priorities","Unequal influence","Limits to what one organization can change alone"].map(t=><span key={t}>{t}</span>)}
        </div>
        <div className="incomplete">
          <strong>A reasonable first explanation can still be incomplete.</strong>
          <div>{["What do we know?","What are we assuming?","What are we still missing?","What needs to be understood before we decide what to do?"].map(t=><span key={t}>{t}</span>)}</div>
        </div>
        <div className="screen-actions"><button className="primary small" onClick={next}>Continue <ArrowRight size={18}/></button></div>
      </section>
    </main>
  );
}

function Screen3({ next }:{next:()=>void}) {
  const [values,setValues]=useState<ReflectionState>({});
  const [active,setActive]=useState(0);
  useEffect(()=>{
    const saved=localStorage.getItem("hrba-m1-starting-point");
    if(saved) try { setValues(JSON.parse(saved)); } catch {}
  },[]);
  const update=(v:string)=>{
    const nextV={...values,[active]:v};
    setValues(nextV);
    localStorage.setItem("hrba-m1-starting-point",JSON.stringify(nextV));
  };
  return (
    <main className="screen interior">
      <Rail screen={3} label="Your Reflection"/>
      <section className="content">
        <div className="title-with-art reflection-title">
          <div><h1>My Starting Point</h1><h2>A moment to reflect — your lens, your experience, your aspirations.</h2><p>Your responses are private to you. <strong>Keep this for later.</strong><br/>Near the end of the course, you will return to these responses.</p></div>
          <div className="reflection-portrait"><div className="portrait-shape"><PauseCircle size={62}/></div></div>
        </div>
        <div className="reflection-layout">
          <div className="prompt-tabs" role="tablist" aria-label="Reflection prompts">
            {reflections.map((q,i)=><button key={q} role="tab" aria-selected={active===i} className={active===i ? "prompt-tab active" : "prompt-tab"} onClick={()=>setActive(i)}><span>0{i+1}</span>{q}</button>)}
          </div>
          <div className="writing-panel">
            <div className="privacy"><LockKeyhole size={16}/>Private by default</div>
            <p className="prompt-count">{active+1} of 4</p>
            <h3>{reflections[active]}</h3>
            <textarea value={values[active]||""} onChange={e=>update(e.target.value)} placeholder="Write a few words or sentences…" />
            <div className="saved"><CheckCircle2 size={16}/>Saved locally in this prototype</div>
            <div className="reflection-controls">
              <button className="secondary" onClick={()=>setActive(Math.max(0,active-1))} disabled={active===0}><ArrowLeft size={17}/>Previous</button>
              {active<3 ? <button className="primary small" onClick={()=>setActive(active+1)}>Next prompt <ArrowRight size={17}/></button> : <button className="primary small" onClick={next}>Continue <ArrowRight size={17}/></button>}
            </div>
          </div>
        </div>
        <div className="later-strip">
          <strong>Later, you will reflect again:</strong>
          {["What would I still say today?","What would I change?","What do I now see differently?","What do I want to do differently in my work?"].map(t=><span key={t}>{t}</span>)}
        </div>
      </section>
    </main>
  );
}

function Screen4({ next }:{next:()=>void}) {
  const [video,setVideo]=useState(false);
  return (
    <main className="screen interior">
      <Rail screen={4} label="Jiru Amba’s Story"/>
      <section className="content split jiru-split">
        <div className="copy-col">
          <h1>Meet Jiru Amba</h1>
          <h2>A Story to Walk With</h2>
          <p>This case is about the <strong>Jiru Amba Community Action Network — JACAN</strong> — a 30-month programme working in a fictional Ethiopian highland community.</p>
          <div className="facts">
            <span><Clock3 size={21}/><strong>30-month</strong><small>programme</small></span>
            <span><Target size={21}/><strong>1,200</strong><small>households</small></span>
            <span><Sprout size={21}/><strong>Livelihoods</strong><small>and market resilience</small></span>
            <span><UsersRound size={21}/><strong>Multiple actors</strong><small>farmers, women, youth, producer groups, public institutions, traders and extension workers</small></span>
          </div>
          <div className="case-tension"><strong>There are genuine signs of progress.<br/>There are also questions.</strong><span>No one actor controls everything.</span></div>
          <div className="learning-contract"><FileText size={19}/><p><strong>Your learning contract for this case</strong><br/>Work with the information available. Make a professional judgement. Explain your reasoning. Be ready to reconsider when new information appears.</p></div>
          <button className="primary big" onClick={next}>Explore Jiru Amba’s Story <ArrowRight size={19}/></button>
        </div>
        <div className="visual-col jiru-art">
          <LandscapeArt variant="jiru"/>
          <blockquote className="quote small-quote"><em>“No one actor controls everything.”</em></blockquote>
          <button className="video-button" onClick={()=>setVideo(true)}><Play size={20} fill="currentColor"/>Watch Jiru Amba introduction <small>prototype media state</small></button>
          {video && <div className="video-modal" role="dialog" aria-modal="true" aria-label="Jiru Amba introduction prototype">
            <button className="video-close" onClick={()=>setVideo(false)}>×</button>
            <div className="video-frame"><Play size={54}/><strong>Jiru Amba introduction</strong><p>The final narrated/illustrated vignette will sit here. All essential case information remains available on the page.</p></div>
          </div>}
        </div>
      </section>
    </main>
  );
}

function Screen5() {
  const pathway = [
    ["Understand",BookOpen,"Build a shared foundation"],
    ["Examine",Search,"Look deeper at realities"],
    ["Decide",Scale,"Make informed choices"],
    ["Reconsider",RefreshCw,"Reflect and adjust"],
    ["Build",Target,"Apply in practice"],
    ["Connect",UsersRound,"Learn with others"],
  ] as const;
  return (
    <main className="screen interior">
      <Rail screen={5} label="Looking Ahead"/>
      <section className="content split close-split">
        <div className="copy-col close-copy">
          <h1>How this course will work</h1>
          <h2 className="principle">Simple language. Difficult thinking. Useful after the course.</h2>
          <p>You will keep useful module resources, tools, templates and selected outputs in your learning portfolio.</p>
          <div className="pathway">
            {pathway.map(([t,I,b],i)=><div className="path-step" key={t}><span><I size={24}/></span><strong>{t}</strong><small>{b}</small>{i<pathway.length-1 && <ArrowRight className="path-arrow" size={17}/>}</div>)}
          </div>
          <p className="hub-note">Later, you decide what to keep private, download, continue developing or take into optional peer learning through the CSO Learning Hub.</p>
          <div className="module2">
            <BookOpen size={42}/>
            <div><span>Next Module</span><h3>Module 2: Human Rights and HRBA</h3><p>Human Rights and HRBA · Rights-Holders and Duty-Bearers · PANEL Principles · Power and Exclusion</p></div>
          </div>
          <div className="carry"><MessageCircle size={23}/><strong>What changes when HRBA moves from the language we use to the decisions we make?</strong></div>
          <button className="primary big" onClick={()=>alert("Golden Reference endpoint reached. Module 2 is outside this prototype.")}>Continue to Module 2 <ArrowRight size={19}/></button>
        </div>
        <div className="visual-col path-art"><LandscapeArt variant="path"/></div>
      </section>
    </main>
  );
}

export default function App() {
  const [screen,setScreen]=useState(0);
  const screens = useMemo(()=>[
    <Screen0 key="0" next={()=>setScreen(1)}/>,
    <Screen1 key="1" next={()=>setScreen(2)}/>,
    <Screen2 key="2" next={()=>setScreen(3)}/>,
    <Screen3 key="3" next={()=>setScreen(4)}/>,
    <Screen4 key="4" next={()=>setScreen(5)}/>,
    <Screen5 key="5"/>,
  ],[]);
  useEffect(()=>{
    const onKey=(e:KeyboardEvent)=>{
      if((e.target as HTMLElement)?.tagName==="TEXTAREA") return;
      if(e.key==="ArrowRight") setScreen(s=>Math.min(5,s+1));
      if(e.key==="ArrowLeft") setScreen(s=>Math.max(0,s-1));
    };
    window.addEventListener("keydown",onKey);
    return ()=>window.removeEventListener("keydown",onKey);
  },[]);
  useEffect(()=>window.scrollTo({top:0,behavior:"smooth"}),[screen]);
  return (
    <div className="prototype">
      <Header screen={screen}/>
      <div className="stage">{screens[screen]}</div>
      <BottomNav screen={screen} setScreen={setScreen}/>
    </div>
  );
}
