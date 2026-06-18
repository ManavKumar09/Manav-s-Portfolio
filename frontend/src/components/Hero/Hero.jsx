import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import axios from 'axios';
import * as LucideIcons from 'lucide-react';
import './Hero.css';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const heroRef = useRef(null);
  const containerRef = useRef(null);
  const aboutHeadingRef = useRef(null);
  const skillsStackRef = useRef(null);

  const [skills, setSkills] = useState([]);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [skillsRes, profileRes] = await Promise.all([
          axios.get(`${import.meta.env.DEV ? 'http://localhost:5000' : 'https://manav-s-portfolio-63db.vercel.app'}/api/public/skills`),
          axios.get(`${import.meta.env.DEV ? 'http://localhost:5000' : 'https://manav-s-portfolio-63db.vercel.app'}/api/public/profile`)
        ]);
        setSkills(skillsRes.data);
        setProfile(profileRes.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Dynamically position skill cards below the about heading on mobile
  useEffect(() => {
    if (isLoading) return;

    const positionSkillsStack = () => {
      if (window.innerWidth > 768) return; // only on mobile
      const headingEl = aboutHeadingRef.current;
      const stackEl = skillsStackRef.current;
      if (!headingEl || !stackEl) return;

      const headingRect = headingEl.getBoundingClientRect();
      const heroRect = heroRef.current?.getBoundingClientRect();
      if (!heroRect) return;

      // The heading's bottom relative to the hero section + a gap
      const relativeBottom = headingRect.bottom - heroRect.top;
      const gap = 80;
      stackEl.style.top = `${relativeBottom + gap}px`;
    };

    // Run once after paint
    const raf = requestAnimationFrame(positionSkillsStack);

    // Re-run on resize
    window.addEventListener('resize', positionSkillsStack);

    // Re-run if the heading content changes size (e.g., fonts load)
    let observer;
    if (aboutHeadingRef.current && typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(positionSkillsStack);
      observer.observe(aboutHeadingRef.current);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', positionSkillsStack);
      observer?.disconnect();
    };
  }, [isLoading]);

  const getIcon = (iconName) => {
    const IconComponent = LucideIcons[iconName] || LucideIcons.Code;
    return <IconComponent size={28} strokeWidth={1.5} />;
  };

  useGSAP(() => {
    if (isLoading) return;

    const cards = gsap.utils.toArray('.hero-skill-card');

    const renderOrbit = (progress = 0) => {
      const radiusX = Math.min(window.innerWidth * 0.14, 195);
      const radiusY = Math.min(window.innerHeight * 0.24, 190);

      if (cards.length === 0) return;

      cards.forEach((card, i) => {
        const angle = (i / cards.length) * Math.PI * 2 + progress * Math.PI * 2 - Math.PI / 2;
        const depth = (Math.sin(angle) + 1) / 2;

        gsap.set(card, {
          xPercent: -50,
          yPercent: -50,
          x: Math.cos(angle) * radiusX,
          y: Math.sin(angle) * radiusY,
          z: depth * 150, /* True 3D depth to fix overlapping issues with preserve-3d */
          zIndex: Math.round(depth * 100),
          scale: 0.84 + depth * 0.16,
          rotationZ: Math.cos(angle) * 8,
          rotateX: -8 + depth * 16,
          rotateY: Math.cos(angle) * -18,
        });
      });
    };

    renderOrbit(0);
    gsap.set('.hero-skills-stack', { opacity: 0 });
    gsap.set('.hero-skills-orbit', { scale: 0.78, rotateX: 12, transformOrigin: '50% 50%' });
    // Only hide cards on desktop — mobile uses CSS carousel (cards always visible)
    if (window.innerWidth > 768 && cards.length > 0) {
      gsap.set(cards, { opacity: 0 });
    }

    const mm = gsap.matchMedia();

    mm.add("(min-width: 769px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: '+=160%',
          pin: true,
          scrub: 1,
        }
      });

      // Fade out bottom container and bg text so they don't stay sticky
      tl.to(['.hero-bottom-container', '.hero-bg-text-container'], { opacity: 0, y: -70, duration: 0.08 }, 0);
      tl.to('.scroll-image-wrapper', { x: '18vw', scale: 0.45, rotationY: -15, z: 50, duration: 0.12 }, 0);
      tl.to('.frame-0', { opacity: 0, duration: 0.08 }, 0);
      tl.to('.frame-30', { opacity: 1, duration: 0.08 }, 0);
      tl.to('.frame-30', { opacity: 0, duration: 0.08 }, 0.08);
      tl.to('.frame-60', { opacity: 1, duration: 0.08 }, 0.08);
      tl.to('.scroll-image-wrapper', { opacity: 0, scale: 0.25, duration: 0.08 }, 0.08);
      
      tl.fromTo('.gta-about-heading',
        { scale: 1.38, opacity: 0, x: '-8vw', y: 18, rotationZ: -2 },
        { scale: 1, opacity: 1, x: 0, y: 0, rotationZ: 0, duration: 0.16, ease: 'power4.out' },
        0.02
      );

      tl.to('.hero-skills-stack', { opacity: 1, duration: 0.08, ease: 'power3.out' }, 0.2);
      tl.to('.hero-skills-orbit', { scale: 1, rotateX: 0, duration: 0.14, ease: 'power3.out' }, 0.2);
      
      if (cards.length > 0) {
        tl.to(cards, { opacity: 1, stagger: 0.025, duration: 0.12, ease: 'power3.out' }, 0.22);
      }

      tl.to({}, {
        duration: 0.62,
        ease: 'none',
        onUpdate() {
          renderOrbit(this.progress());
        },
      }, 0.24);
    });

    mm.add("(max-width: 768px)", () => {
      const orbitEl = document.querySelector('.hero-skills-orbit');
      const numCards = cards.length;
      
      const totalEnd = `+=${100 + numCards * 50}%`;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: totalEnd,
          pin: true,
          scrub: 1,
        }
      });

      // Fade out bottom container and bg text so they don't stay sticky
      tl.to(['.hero-bottom-container', '.hero-bg-text-container'], { opacity: 0, y: -70, duration: 0.1 }, 0);
      tl.to('.scroll-image-wrapper', { opacity: 0, scale: 0.92, duration: 0.1 }, 0.05);

      // Phase 2: ABOUT ME heading appears
      tl.fromTo('.gta-about-heading',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.1, ease: 'power3.out' },
        0.1
      );
      
      // Mobile 3D Merry-Go-Round (Horizontal Orbit)
      const cardEls = gsap.utils.toArray('.hero-skill-card');
      
      const renderMobileOrbit = (progress = 0) => {
        if (cardEls.length === 0) return;
        const radiusX = window.innerWidth * 0.45; // Width of the circle
        const radiusZ = 120; // Depth of the circle
        
        cardEls.forEach((card, i) => {
          // Subtract progress so they move left to right in the front
          const angle = (i / cardEls.length) * Math.PI * 2 - progress * Math.PI * 2 + Math.PI / 2;
          const depth = (Math.sin(angle) + 1) / 2; // 0 (back) to 1 (front)
          
          gsap.set(card, {
            xPercent: -50,
            yPercent: -50,
            x: Math.cos(angle) * radiusX,
            y: 0, // Stays in the exact same horizontal line! No up and down!
            z: Math.sin(angle) * radiusZ,
            zIndex: Math.round(depth * 100),
            scale: 0.75 + depth * 0.25,
            opacity: depth > 0.2 ? 1 : 0, // Hide cards when they go around the back
            rotateX: 0,
            rotateY: 0,
            rotationZ: 0
          });
        });
      };
      
      // Initial render
      gsap.set('.hero-skills-orbit', { rotateX: 0, scale: 1 });
      renderMobileOrbit(0);

      // Make sure stack container is fully visible
      tl.to('.hero-skills-stack', { opacity: 1, duration: 0.1 }, 0.15);

      // Phase 3: Rotate the 3D horizontal orbit
      tl.to({}, {
        duration: 0.65,
        ease: 'none',
        onUpdate() {
          renderMobileOrbit(this.progress());
        }
      }, 0.25);
    });



    return () => mm.revert();

  }, { scope: heroRef, dependencies: [isLoading] });

  if (isLoading) {
    return (
      <section id="hero" className="hero-section" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'var(--accent-pink)', fontSize: '20px', letterSpacing: '2px' }}>LOADING...</div>
      </section>
    );
  }

  return (
    <section id="hero" className="hero-section" ref={heroRef}>
      {/* Background large text */}
      <div className="hero-bg-text-container">
        <h1 className="hero-bg-text text-gradient">HI, I'M MANAV</h1>
      </div>

      {/* Face images */}
      <div className="scroll-image-wrapper">
        <div className="scroll-image-glow-circle" />
        <img src="/images/head-turn/frame_00.png" alt="Manav Front View" className="scroll-face-image frame-0" />
        <img src="/images/head-turn/frame_30.png" alt="Manav Three-Quarter View" className="scroll-face-image frame-30" style={{ opacity: 0 }} />
        <img src="/images/head-turn/frame_60.png" alt="Manav Deep-Quarter View" className="scroll-face-image frame-60" style={{ opacity: 0 }} />
      </div>

      {/* GTA6-style ABOUT ME heading — left side */}
      <div id="about" className="gta-about-heading" ref={aboutHeadingRef}>
        <h2 className="gta-about-text">
          <span>ABOUT</span>
          <span>ME</span>
        </h2>
        <p className="gta-about-dummy" style={{ whiteSpace: 'pre-line' }}>
          {profile?.aboutText || 'Dummy intro text for the about section goes here for now.'}
        </p>
      </div>

      {/* Skill cards — stacking from right to left, positioned on right side */}
      <div className="hero-skills-stack" ref={skillsStackRef}>
        <div className="hero-skills-orbit">
          {skills.map((skill, index) => (
            <article
              key={index}
              className={`hero-skill-card hero-skill-card-${index}`}
              style={{
                '--card-index': index,
                '--card-count': skills.length,
                '--card-angle': skills.length > 0 ? `${(360 / skills.length) * index}deg` : '0deg',
              }}
            >
              <div className="skill-icon-container">
                {getIcon(skill.icon)}
              </div>
              <h3 className="skill-title">{skill.title}</h3>
              <span className="skill-tool">{skill.techStack}</span>
              <p className="skill-desc">{skill.description}</p>
            </article>
          ))}
        </div>
      </div>

      {/* Bottom bio + contact */}
      <div className="hero-bottom-container" ref={containerRef}>
        <p className="hero-bio">
          A PASSIONATE MERN STACK DEVELOPER CRAFTING BOLD AND MEMORABLE PROJECTS 
        </p>
        <a href="#contact" className="glow-btn hero-btn">
          CONTACT ME
        </a>
      </div>
    </section>
  );
}
