import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import axios from 'axios';
import './Projects.css';

import project1_1 from '../../assets/Project1_1.png';
import project1_2 from '../../assets/Project1_2.png';
import project1_3 from '../../assets/Project1_3.png';

gsap.registerPlugin(ScrollTrigger);

export default function Projects() {
  const containerRef = useRef(null);

  useGSAP(() => {
    // Reveal section title
    gsap.from('.projects-section .section-title', {
      scrollTrigger: {
        trigger: '.projects-section',
        start: 'top 80%',
      },
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power3.out'
    });
  }, { scope: containerRef });

  const [projectsData, setProjectsData] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/public/projects');
        setProjectsData(res.data);
      } catch (err) {
        console.error('Error fetching projects:', err);
      }
    };
    fetchProjects();
  }, []);

  return (
    <section id="projects" className="projects-section" ref={containerRef}>
      <div className="container">
        <h2 className="section-title">
          MY FEATURED <span>PROJECTS</span>
        </h2>
        {/* Featured projects list */}
        <div className="featured-projects">
          {projectsData.slice(0, 3).map((fp, index) => (
            <article 
              key={fp._id || index} 
              className="featured-item glass-card"
              style={{
                top: `calc(100px + ${index * 30}px)`,
                zIndex: index + 1
              }}
            >
              <div className="featured-meta">
                <div className="featured-index">{String(index + 1).padStart(2, '0')}</div>
                <div className="featured-client">{fp.title.toUpperCase()}</div>
                <div style={{ display: 'flex', gap: '10px', marginLeft: 'auto' }}>
                  {fp.githubLink && (
                    <a className="featured-live" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)' }} href={fp.githubLink} target="_blank" rel="noreferrer">
                      GITHUB
                    </a>
                  )}
                  {fp.liveLink && (
                    <a className="featured-live" href={fp.liveLink} target="_blank" rel="noreferrer">
                      LIVE PROJECT
                    </a>
                  )}
                  {!fp.githubLink && !fp.liveLink && (
                    <span className="featured-live" style={{ opacity: 0.5 }}>PRIVATE</span>
                  )}
                </div>
              </div>

              <Link to="/projects" style={{ display: 'block' }}>
                <div className="featured-media">
                  <div className="featured-media-left">
                    <img src={fp.images && fp.images[0] ? fp.images[0] : project1_1} alt={fp.title + ' - 1'} />
                  </div>
                  <div className="featured-media-right">
                    <img src={fp.images && fp.images[1] ? fp.images[1] : (fp.images && fp.images[0] ? fp.images[0] : project1_2)} alt={fp.title + ' - 2'} />
                    <img src={fp.images && fp.images[2] ? fp.images[2] : (fp.images && fp.images[0] ? fp.images[0] : project1_3)} alt={fp.title + ' - 3'} />
                  </div>
                </div>
              </Link>
            </article>
          ))}
          
          {projectsData.length > 3 && (
            <div className="view-more-container" style={{ textAlign: 'center', marginTop: '60px', position: 'relative', zIndex: 10 }}>
              <Link to="/projects" style={{ padding: '16px 40px', borderRadius: '30px', background: 'var(--accent-gradient)', color: '#fff', fontWeight: 'bold', textDecoration: 'none', display: 'inline-block', letterSpacing: '1px' }}>
                VIEW MORE PROJECTS
              </Link>
            </div>
          )}
        </div>
        {/* projects-grid removed — featured projects are used instead */}
      </div>
    </section>
  );
}
