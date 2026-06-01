import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import axios from 'axios';
import './Experience.css';

gsap.registerPlugin(ScrollTrigger);

export default function Experience() {
  const containerRef = useRef(null);
  const [experiences, setExperiences] = useState([]);

  useGSAP(() => {
    // Reveal section title (runs ONCE)
    gsap.fromTo('.experience-section .section-title', 
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.experience-section',
          start: 'top 80%',
          toggleActions: 'play reverse play reverse'
        }
      }
    );
  }, { scope: containerRef }); // No dependencies, runs once

  useGSAP(() => {
    // Animate each row individually (waits for data)
    const rows = gsap.utils.toArray('.timeline-row');
    rows.forEach((row) => {
      const line = row.querySelector('.timeline-line');
      const dot = row.querySelector('.timeline-dot');
      const card = row.querySelector('.experience-card');

      // Scrubbed line drawing as you scroll past the row
      gsap.fromTo(line, 
        { clipPath: 'inset(0 0 100% 0)' }, 
        { 
          clipPath: 'inset(0 0 0% 0)', 
          ease: 'none',
          scrollTrigger: {
            trigger: row,
            start: 'top 50%',
            end: 'bottom 50%',
            scrub: 1,
          }
        }
      );

      // Disable CSS transitions so GSAP can smoothly reverse without glitching
      gsap.set(card, { transition: 'none' });
      gsap.set(dot, { transition: 'none', xPercent: -50, yPercent: -50 });

      // Create a timeline for the dot and card
      const rowTl = gsap.timeline({
        scrollTrigger: {
          trigger: row,
          start: 'top 85%',
          toggleActions: 'play reverse play reverse'
        }
      });

      rowTl.fromTo(dot, 
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.5)' }
      )
      .fromTo(card, 
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'back.out(1.2)' },
        "-=0.3" // overlap the animations slightly
      );
    });
  }, { scope: containerRef, dependencies: [experiences] });

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const res = await axios.get(`${import.meta.env.DEV ? 'http://localhost:5000' : 'https://manav-s-portfolio.onrender.com'}/api/public/experience`);
        setExperiences(res.data);
      } catch (err) {
        console.error('Error fetching experience:', err);
      }
    };
    fetchExperience();
  }, []);

  return (
    <section id="experience" className="experience-section" ref={containerRef}>
      <div className="container">
        <h2 className="section-title">
          WORK <span>EXPERIENCE</span>
        </h2>
        <div className="experience-timeline">
          {experiences.slice(0, 3).map((exp, index) => (
            <div key={exp._id || index} className={`timeline-row ${index % 2 === 0 ? 'left' : 'right'}`}>
              <div className="timeline-line"></div>
              <div className="timeline-dot"></div>
              <Link to="/experience" className="glass-card experience-card" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                <div className="exp-header">
                  <div className="exp-meta">
                    <h3 className="exp-company">{exp.company}</h3>
                    <span className="exp-role">{exp.role}</span>
                  </div>
                  <span className="exp-period">{exp.duration}</span>
                </div>
                <p className="exp-desc">
                  {exp.description && exp.description.length > 120 
                    ? exp.description.substring(0, 120) + '...' 
                    : exp.description}
                </p>
              </Link>
            </div>
          ))}
          
          {experiences.length > 3 && (
            <div className="view-more-container" style={{ textAlign: 'center', marginTop: '60px', position: 'relative', zIndex: 10 }}>
              <Link to="/experience" style={{ padding: '16px 40px', borderRadius: '30px', background: 'var(--accent-gradient)', color: '#fff', fontWeight: 'bold', textDecoration: 'none', display: 'inline-block', letterSpacing: '1px' }}>
                VIEW ALL EXPERIENCE
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
