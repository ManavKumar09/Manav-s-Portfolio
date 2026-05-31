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

  const [skills, setSkills] = useState([]);
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [skillsRes, profileRes] = await Promise.all([
          axios.get('http://localhost:5000/api/public/skills'),
          axios.get('http://localhost:5000/api/public/profile')
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
    if (cards.length > 0) {
      gsap.set(cards, { opacity: 0 });
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: '+=160%',
        pin: true,
        scrub: 1,
      }
    });

    // Phase 1 (0 → 0.15): Fade out hero text, bio, contact button
    tl.to(['.hero-bottom-container', '.hero-bg-text-container'], {
      opacity: 0,
      y: -70,
      duration: 0.08
    }, 0);

    // Phase 2 (0 → 0.25): Face slides right + head turn
    tl.to('.scroll-image-wrapper', {
      x: '18vw',
      scale: 0.45,
      rotationY: -15,
      z: 50,
      duration: 0.12
    }, 0);

    // Head turn frames
    tl.to('.frame-0', { opacity: 0, duration: 0.08 }, 0);
    tl.to('.frame-30', { opacity: 1, duration: 0.08 }, 0);
    tl.to('.frame-30', { opacity: 0, duration: 0.08 }, 0.08);
    tl.to('.frame-60', { opacity: 1, duration: 0.08 }, 0.08);

    // Phase 3 (0.2 → 0.3): Face fades out completely
    tl.to('.scroll-image-wrapper', {
      opacity: 0,
      scale: 0.25,
      duration: 0.08
    }, 0.08);

    // Phase 4 (0.25 → 0.38): GTA6-style "ABOUT ME" heading animates in
    // Scale from huge to normal, slide from left
    tl.fromTo('.gta-about-heading',
      { scale: 1.38, opacity: 0, x: '-8vw', y: 18, rotationZ: -2 },
      { scale: 1, opacity: 1, x: 0, y: 0, rotationZ: 0, duration: 0.16, ease: 'power4.out' },
      0.02
    );

    // Phase 5: Skill cards bloom into a spiral and orbit while the page scrolls.
    tl.to('.hero-skills-stack', {
      opacity: 1,
      duration: 0.08,
      ease: 'power3.out'
    }, 0.2);

    tl.to('.hero-skills-orbit', {
      scale: 1,
      rotateX: 0,
      duration: 0.14,
      ease: 'power3.out'
    }, 0.2);

    if (cards.length > 0) {
      tl.to(cards, {
        opacity: 1,
        stagger: 0.025,
        duration: 0.12,
        ease: 'power3.out'
      }, 0.22);
    }

    tl.to({}, {
      duration: 0.62,
      ease: 'none',
      onUpdate() {
        renderOrbit(this.progress());
      },
    }, 0.24);

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
      <div id="about" className="gta-about-heading">
        <h2 className="gta-about-text">
          <span>ABOUT</span>
          <span>ME</span>
        </h2>
        <p className="gta-about-dummy" style={{ whiteSpace: 'pre-line' }}>
          {profile?.aboutText || 'Dummy intro text for the about section goes here for now.'}
        </p>
      </div>

      {/* Skill cards — stacking from right to left, positioned on right side */}
      <div className="hero-skills-stack">
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
