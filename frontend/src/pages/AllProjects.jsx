import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import axios from 'axios';
import '../components/Projects/Projects.css';

import project1_1 from '../assets/Project1_1.png';
import project1_2 from '../assets/Project1_2.png';
import project1_3 from '../assets/Project1_3.png';

export default function AllProjects() {
  const containerRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [allProjectsData, setAllProjectsData] = useState([]);

  useGSAP(() => {
    // Robust fromTo animation to ensure full opacity (bypasses StrictMode bugs)
    gsap.fromTo('.project-card', 
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.2
      }
    );
  }, { scope: containerRef, dependencies: [allProjectsData] });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get('https://manav-s-portfolio.onrender.com/api/public/projects');
        setAllProjectsData(res.data);
      } catch (err) {
        console.error('Error fetching projects:', err);
      }
    };
    fetchProjects();
  }, []);

  return (
    <main className="projects-section" style={{ paddingTop: '150px', paddingBottom: '100px', minHeight: '100vh' }} ref={containerRef}>
      <div className="container">
        <h2 className="section-title">
          ALL <span>PROJECTS</span>
        </h2>
        
        {/* We reuse the 'featured-projects' class for CSS inheritance if needed, but override layout */}
        <div className="featured-projects" style={{ display: 'flex', flexDirection: 'column', gap: '60px', marginTop: '60px' }}>
          {allProjectsData.map((project, index) => (
            <article 
              key={project._id || index} 
              className="glass-card project-card featured-item"
              style={{ display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden', position: 'relative', top: 'auto', zIndex: 1 }}
            >
              {/* Media Layout */}
              <div className="featured-media" style={{ borderBottom: '1px solid var(--border-light)' }}>
                <div className="featured-media-left">
                  <img src={project.images && project.images[0] ? project.images[0] : project1_1} alt={project.title + ' - 1'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div className="featured-media-right">
                  <img src={project.images && project.images[1] ? project.images[1] : (project.images && project.images[0] ? project.images[0] : project1_2)} alt={project.title + ' - 2'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <img src={project.images && project.images[2] ? project.images[2] : (project.images && project.images[0] ? project.images[0] : project1_3)} alt={project.title + ' - 3'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              </div>

              {/* Detailed Info Layout */}
              <div style={{ padding: '40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
                  <div>
                    <span style={{ color: 'var(--accent-pink)', fontSize: '14px', letterSpacing: '2px', fontWeight: 'bold' }}>PROJECT</span>
                    <h3 style={{ fontSize: '32px', color: 'var(--text-primary)', marginTop: '5px' }}>{project.title}</h3>
                  </div>
                  <div style={{ display: 'flex', gap: '15px' }}>
                    {project.githubLink && (
                      <a 
                        href={project.githubLink} 
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
                    
                    {project.liveLink && (
                      <a 
                        href={project.liveLink} 
                        target="_blank" 
                        rel="noreferrer"
                        style={{
                          background: 'rgba(255,255,255,0.05)', 
                          padding: '10px 24px', 
                          borderRadius: '30px', 
                          color: 'var(--text-primary)', 
                          fontWeight: 'bold', 
                          border: '1px solid var(--border-light)',
                          textDecoration: 'none',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.background = 'var(--accent-gradient)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'transparent'; }}
                        onMouseOut={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--border-light)'; }}
                      >
                        LIVE PROJECT
                      </a>
                    )}

                    {!project.githubLink && !project.liveLink && (
                      <span style={{ padding: '10px 24px', color: 'rgba(255,255,255,0.5)', border: '1px solid var(--border-light)', borderRadius: '30px', fontWeight: 'bold' }}>PRIVATE</span>
                    )}
                  </div>
                </div>

                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '16px', marginBottom: '25px', maxWidth: '900px' }}>
                  {project.description}
                </p>

                {/* Tech Stack Tags */}
                <div>
                  <h4 style={{ color: '#fff', marginBottom: '15px', fontSize: '18px' }}>Technologies</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {project.techStack && project.techStack.map((tech, i) => (
                      <span key={i} style={{ background: 'rgba(255,255,255,0.1)', padding: '6px 14px', borderRadius: '4px', fontSize: '13px', color: 'var(--text-primary)', fontWeight: '600' }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
