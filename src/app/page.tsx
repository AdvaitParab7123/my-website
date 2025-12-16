'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './page.module.css';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [cursorHover, setCursorHover] = useState(false);

  // Cursor
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    const move = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const animate = () => {
      cursorX += (mouseX - cursorX) * 0.2;
      cursorY += (mouseY - cursorY) * 0.2;
      cursor.style.left = cursorX - 6 + 'px';
      cursor.style.top = cursorY - 6 + 'px';
      requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', move);
    animate();

    const links = document.querySelectorAll('a, button');
    links.forEach(link => {
      link.addEventListener('mouseenter', () => setCursorHover(true));
      link.addEventListener('mouseleave', () => setCursorHover(false));
    });

    return () => window.removeEventListener('mousemove', move);
  }, []);

  // Scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Animations
  useEffect(() => {
    gsap.fromTo('.heroAnim', 
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power3.out', delay: 0.2 }
    );

    gsap.fromTo(`.${styles.blob}`,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.5, stagger: 0.2, ease: 'elastic.out(1, 0.5)', delay: 0.5 }
    );

    gsap.utils.toArray('[data-anim]').forEach((el: any) => {
      gsap.fromTo(el,
        { y: 60, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' }
        }
      );
    });
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  // What I Do - Skills/Services
  const skills = [
    { icon: '🎯', title: 'AI Product Execution', desc: 'Discovery → requirements → MVP → iteration. End-to-end product delivery.' },
    { icon: '⚡', title: 'Workflow Automation', desc: 'No-code/low-code systems with n8n, Make, Zapier. Fast, reliable, scalable.' },
    { icon: '🧠', title: 'LLM & Prompt Architecture', desc: 'Prompt engineering, agent-style systems, and LLM-powered workflows.' },
    { icon: '📈', title: 'Enablement & Adoption', desc: 'Trainings, masterclasses, adoption playbooks. Making AI stick.' },
    { icon: '🤝', title: 'Stakeholder Management', desc: 'Cross-team alignment, change management, executive communication.' },
    { icon: '📊', title: 'Analytics & Iteration', desc: 'Usage analytics, feedback loops, continuous improvement cycles.' },
  ];

  // Featured Projects
  const projects = [
    { 
      title: 'Rizz AI', 
      category: 'Live • Public',
      description: 'AI conversation assistant that generates personalized replies for dating apps, Instagram, and WhatsApp.',
      role: 'Concept • UX • Development • Launch',
      link: 'https://rizz-ai-nine.vercel.app/app',
      image: '/rizz-ai.png'
    },
    { 
      title: 'The Email Guy', 
      category: 'Live • Internal',
      description: 'AI-powered outbound email generator trained on GTM knowledge + top-performing emails.',
      role: 'Product Vision • UX • Dev Coordination • Adoption',
      impact: '3–4× improvement in outbound email quality',
      link: 'https://the-email-guy.vercel.app/chat',
      image: '/email-guy.png'
    },
  ];

  // Other Projects
  const otherProjects = [
    'AI Recruiter — automated screening, JD matching, and talent pool creation',
    'Email Outreach Agent — personalized prospect research and outbound outreach',
    'Meeting Summariser — automated call summaries and action items',
    'Alert Systems — proactive retention/action systems for teams',
    'Contract Vault — contract storage + search for Finance & Legal',
    'Netcore Unpitch — interactive booth-based product for qualified sales conversations',
  ];

  const marqueeItems = ['AI Enablement', 'Product Building', 'Workflow Automation', 'LLM Systems', 'Adoption Programs', 'Outcome-First UX'];

  // Success Story / Key Achievement
  const [achievementExpanded, setAchievementExpanded] = useState(false);
  const successStory = {
    id: 'ai-agents-league',
    collapsedTitle: 'AI Agents League — From company-wide competition to a wildcard win',
    collapsedStats: '80+ applied • 40+ built • ~12 finalists • wildcard win',
    expandedTitle: 'AI Agents League — Drove an AI-first building culture at Netcore',
    subtitle: 'Company-wide AI build league • Platforms explored • Leadership visibility',
    description: 'Co-led Netcore Cloud\'s AI Agents League with the Chief Product Officer to move teams from "AI curiosity" to "AI builders." The initiative created an AI-first culture where teams actively shipped prototypes using no-code automation (n8n, Make.com, Zapier) and developer-built AI agents/platforms—with direct visibility and buy-in from the Founder & Group CEO and senior leadership.',
    bullets: [
      'AI-first culture outcome: teams explored multiple AI building paths—no-code workflows (n8n/Make/Zapier) and coded agents/platforms built by developers',
      'Participation & execution: 80+ teams applied, 40+ teams built and presented working projects in Round 1',
      'Leadership alignment: ~12 finalists demoed solutions to the Founder & Group CEO + senior leadership',
      'Personal contribution: entered as a last-minute wildcard (requested by CPO Kedar), prepped an n8n project overnight, and presented in the finals',
      'Recognition: won in 1 of 5 award categories',
    ],
  };

  return (
    <div className={styles.page}>
      {/* Cursor */}
      <div 
        ref={cursorRef} 
        className={`${styles.cursor} ${cursorHover ? styles.cursorHover : ''}`} 
      />

      {/* Header */}
      <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ''}`}>
        <div className="container">
          <nav className={styles.nav}>
            <div className={styles.logo}>
              Advait<span className={styles.logoAccent}>.</span>
            </div>
            <ul className={styles.navLinks}>
              <li><a href="#about" className={styles.navLink} onClick={(e) => { e.preventDefault(); scrollTo('about'); }}>About</a></li>
              <li><a href="#skills" className={styles.navLink} onClick={(e) => { e.preventDefault(); scrollTo('skills'); }}>What I Do</a></li>
              <li><a href="#work" className={styles.navLink} onClick={(e) => { e.preventDefault(); scrollTo('work'); }}>Projects</a></li>
              <li><a href="#contact" className={styles.navLink} onClick={(e) => { e.preventDefault(); scrollTo('contact'); }}>Contact</a></li>
            </ul>
            <button className={styles.menuBtn}>
              <span></span>
              <span></span>
            </button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.blobs}>
          <div className={`${styles.blob} ${styles.blob1}`} />
          <div className={`${styles.blob} ${styles.blob2}`} />
          <div className={`${styles.blob} ${styles.blob3}`} />
        </div>
        
        <div className={styles.heroContent}>
          <p className={`${styles.heroTag} heroAnim`}>AI Enabler • AI Product Builder</p>
          <h1 className={`${styles.heroTitle} heroAnim`}>
            I build AI products<br/>that teams <span className={styles.heroAccent}>actually adopt</span>
          </h1>
          <p className={`${styles.heroSub} heroAnim`}>
            I help Companies turn messy workflows into simple AI-first systems—fast, outcome-led, and low-click.
          </p>
          <div className={`${styles.heroCtas} heroAnim`}>
            <a href="#work" className={styles.heroCta} onClick={(e) => { e.preventDefault(); scrollTo('work'); }}>
              View Projects <span>→</span>
            </a>
            <a href="#contact" className={styles.heroCtaSecondary} onClick={(e) => { e.preventDefault(); scrollTo('contact'); }}>
              Contact Me
            </a>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className={styles.marquee}>
        <div className={styles.marqueeTrack}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className={styles.marqueeContent}>
              {marqueeItems.map((item, j) => (
                <span key={j}>
                  <span className={styles.marqueeItem}>{item}</span>
                  <span className={styles.marqueeDot} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* About */}
      <section id="about" className={styles.about}>
        <div className="container">
          <div className={styles.aboutGrid}>
            <div data-anim>
              <div className={styles.label}>About Me</div>
              <h2 className={styles.aboutTitle}>
                Making AI feel <em>obvious</em> to use
              </h2>
              <p className={styles.aboutText}>
                I'm Advait—Netcore Cloud's AI Enabler. I work directly with senior leadership to identify high-leverage pain points, define requirements, ship usable AI products, and drive adoption with measurable ROI.
              </p>
              <p className={styles.aboutText}>
                My style is outcome-first UX: remove noise, reduce clicks, shorten time-to-value. Whether it's an internal AI tool or a public app, I care about one thing—making it feel obvious to use.
              </p>
              <div className={styles.stats}>
                <div className={styles.stat}>
                  <h3>10+</h3>
                  <p>Stakeholder Discovery Sessions</p>
                </div>
                <div className={styles.stat}>
                  <h3>85</h3>
                  <p>AI Agents League Teams</p>
                </div>
                <div className={styles.stat}>
                  <h3>3–4×</h3>
                  <p>Email Quality Improvement</p>
                </div>
              </div>
            </div>
            <div className={styles.aboutVisual} data-anim>
              <img 
                src="/advait.png" 
                alt="Advait Parab" 
                className={styles.aboutPhoto}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Skills / What I Do */}
      <section id="skills" className={styles.services}>
        <div className="container">
          <div className={styles.sectionHeader} data-anim>
            <div className={styles.label}>What I Do</div>
            <h2 className={styles.sectionTitle}>Skills & Expertise</h2>
            <p className={styles.sectionSub}>End-to-end AI product execution, from discovery to adoption.</p>
          </div>
          <div className={styles.servicesGrid}>
            {skills.map((s, i) => (
              <div key={i} className={styles.serviceCard} data-anim>
                <div className={styles.serviceIcon}>{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section id="work" className={styles.work}>
        <div className="container">
          <div className={styles.workHeader} data-anim>
            <div>
              <div className={styles.label}>My Work</div>
              <h2 className={styles.sectionTitle}>Featured Projects</h2>
            </div>
          </div>
          <div className={styles.workGrid}>
            {projects.map((p, i) => (
              <a key={i} href={p.link} target="_blank" rel="noopener noreferrer" className={styles.projectCard} data-anim>
                <div 
                  className={styles.projectBg} 
                  style={{ backgroundImage: `url(${p.image})` }}
                />
                <div className={styles.projectInfo}>
                  <div className={styles.projectCategory}>{p.category}</div>
                  <h3 className={styles.projectTitle}>{p.title}</h3>
                  <p className={styles.projectDesc}>{p.description}</p>
                  <p className={styles.projectRole}>{p.role}</p>
                  {p.impact && <p className={styles.projectImpact}>📈 {p.impact}</p>}
                </div>
              </a>
            ))}
          </div>

          {/* Other Projects */}
          <div className={styles.otherProjects} data-anim>
            <h3 className={styles.otherTitle}>Other Projects</h3>
            <div className={styles.otherGrid}>
              {otherProjects.map((project, i) => (
                <div key={i} className={styles.otherCard}>
                  <span className={styles.otherDot}>◆</span>
                  {project}
                </div>
              ))}
            </div>
          </div>

          {/* Creative Work */}
          <div className={styles.creativeWork} data-anim>
            <h3 className={styles.otherTitle}>Creative Work</h3>
            <a href="/comic" className={styles.comicCard}>
              <div className={styles.comicIcon}>📖</div>
              <div className={styles.comicInfo}>
                <h4>My Comic</h4>
                <p>A 24-page comic with animated page-turn experience</p>
              </div>
              <span className={styles.comicArrow}>→</span>
            </a>
          </div>
        </div>
      </section>

      {/* Experience - Using Testimonial section styling */}
      <section className={styles.testimonial}>
        <div className="container">
          <div className={styles.testimonialContent} data-anim>
            <div className={styles.label} style={{ color: '#000' }}>Experience</div>
            <h3 className={styles.expTitle}>Netcore Cloud</h3>
            <p className={styles.expRole}>AI Enabler — Jan 2025 – Present</p>
            <p className={styles.expDesc}>
              Work directly with the Chief Product/AI Officer. Execute AI initiatives across Sales, CSM, Engineering, Product, Finance, Legal, HR, and Onboarding. Run discovery with leadership, translate pain points into requirements, ship adoption-ready tools. Lead internal AI building culture via the AI Agents League.
            </p>
            <p className={styles.expPrev}>Previously: Sales Development Representative (Nov 2024 – Jan 2025)</p>
          </div>

          {/* Key Achievement - Collapsible */}
          <div 
            id={successStory.id} 
            className={`${styles.achievementCard} ${achievementExpanded ? styles.achievementExpanded : ''}`} 
            data-anim
            onClick={() => setAchievementExpanded(!achievementExpanded)}
          >
            <div className={styles.achievementHeader}>
              <span className={styles.achievementBadge}>🏆 Key Achievement</span>
              <h4 className={styles.achievementTitle}>
                {achievementExpanded ? successStory.expandedTitle : successStory.collapsedTitle}
              </h4>
              {!achievementExpanded && (
                <p className={styles.achievementStats}>{successStory.collapsedStats}</p>
              )}
              {achievementExpanded && (
                <p className={styles.achievementSubtitle}>{successStory.subtitle}</p>
              )}
              <span className={styles.achievementToggle}>{achievementExpanded ? '−' : '+'}</span>
            </div>
            {achievementExpanded && (
              <>
                <p className={styles.achievementDesc}>{successStory.description}</p>
                <ul className={styles.achievementBullets}>
                  {successStory.bullets.map((bullet, i) => (
                    <li key={i}>{bullet}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className={styles.contact}>
        <div className="container">
          <div className={styles.contactGrid}>
            <div data-anim>
              <h2 className={styles.contactTitle}>
                Let's build<br/><span>something</span><br/>useful
              </h2>
              <p className={styles.contactText}>
                If you're exploring AI products, workflow automation, or enablement programs, I'm happy to collaborate.
              </p>
              <h4 className={styles.contactLabel} style={{ marginTop: '40px' }}>Connect</h4>
              <a href="mailto:advaitparab7123@gmail.com" className={styles.contactEmail}>
                advaitparab7123@gmail.com <span>→</span>
              </a>
              <p style={{ marginTop: '20px' }}>
                <a href="https://www.linkedin.com/in/advait-parab/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--butter)', fontSize: '20px' }}>
                  LinkedIn →
                </a>
              </p>
            </div>
            <div className={styles.contactInfo} data-anim>
              <h4>Location</h4>
              <p>Mumbai, India</p>
              <div className={styles.socials}>
                <a href="https://www.linkedin.com/in/advait-parab/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a href="mailto:advaitparab7123@gmail.com">Email</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.footerContent}>
            <div className={styles.footerLogo}>Advait Parab</div>
            <div className={styles.footerText}>© 2025 Advait Parab. All rights reserved.</div>
            <div className={styles.footerLinks}>
              <a href="https://www.linkedin.com/in/advait-parab/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href="mailto:advaitparab7123@gmail.com">Email</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
