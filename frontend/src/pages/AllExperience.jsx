import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import axios from 'axios';
import '../components/Experience/Experience.css'; // Reuse global experience styles

export default function AllExperience() {
  const containerRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [detailedExperiences, setDetailedExperiences] = useState([]);

  useGSAP(() => {
    gsap.fromTo('.detailed-card', 
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.2,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.2
      }
    );
  }, { scope: containerRef, dependencies: [detailedExperiences] });

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const res = await axios.get(`${import.meta.env.DEV ? 'http://localhost:5000' : 'https://manav-s-portfolio-63db.vercel.app'}/api/public/experience`);
        setDetailedExperiences(res.data);
      } catch (err) {
        console.error('Error fetching experience:', err);
      }
    };
    fetchExperience();
  }, []);

  return (
    <main className="experience-section" style={{ paddingTop: '150px', paddingBottom: '100px', minHeight: '100vh' }} ref={containerRef}>
      <div className="container">
        <h2 className="section-title">
          DETAILED <span>EXPERIENCE</span>
        </h2>
        
        <div className="detailed-experience-list" style={{ display: 'flex', flexDirection: 'column', gap: '40px', marginTop: '60px' }}>
          {detailedExperiences.map((exp, index) => (
            <div key={exp._id || index} className="glass-card detailed-card" style={{ padding: '40px', textAlign: 'left' }}>
              
              {/* Header Section */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
                <div>
                  <h3 style={{ fontSize: '32px', color: 'var(--text-primary)', marginBottom: '5px' }}>{exp.company}</h3>
                  <span style={{ color: 'var(--accent-pink)', fontWeight: 'bold', fontSize: '20px', letterSpacing: '1px' }}>{exp.role}</span>
                </div>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                  {exp.githubLink && (
                    <a 
                      href={exp.githubLink} 
                      target="_blank" 
                      rel="noreferrer"
                      style={{
                        background: 'transparent', 
                        padding: '10px 24px', 
                        borderRadius: '30px', 
                        color: 'var(--text-primary)', 
                        fontWeight: 'bold', 
                        border: '1px solid var(--border-light)',
                        textDecoration: 'none',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--text-primary)'; }}
                      onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border-light)'; }}
                    >
                      GITHUB
                    </a>
                  )}
                  <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px 20px', borderRadius: '30px', color: 'var(--text-primary)', fontWeight: 'bold', border: '1px solid var(--border-light)' }}>
                    {exp.duration}
                  </div>
                </div>
              </div>
              
              {/* Overview Section */}
              <div style={{ marginBottom: '30px' }}>
                <h4 style={{ color: '#fff', marginBottom: '10px', fontSize: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px' }}>Description</h4>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '16px', whiteSpace: 'pre-line' }}>{exp.description}</p>
              </div>

              {/* Certificate Section */}
              {exp.certificateUrl && (
                <div style={{ marginTop: '20px' }}>
                  <h4 style={{ color: '#fff', marginBottom: '15px', fontSize: '20px', borderBottom: '1px solid var(--border-light)', paddingBottom: '10px' }}>Certificate</h4>
                  <a href={exp.certificateUrl} target="_blank" rel="noreferrer">
                    <img 
                      src={exp.certificateUrl} 
                      alt={`${exp.role} Certificate`} 
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '400px', 
                        borderRadius: '8px', 
                        border: '1px solid var(--border-light)',
                        transition: 'transform 0.3s ease'
                      }} 
                      onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                      onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  </a>
                </div>
              )}

            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
