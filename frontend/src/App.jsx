import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Home from './pages/Home';
import AllProjects from './pages/AllProjects';
import AllExperience from './pages/AllExperience';
import Preloader from './components/Preloader/Preloader';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './App.css';

gsap.registerPlugin(ScrollTrigger);

// Helper component to handle scrolling to hash on navigation
function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash.replace('#', ''));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

function MainLayout() {
  const [preloaderFinished, setPreloaderFinished] = useState(false);

  useEffect(() => {
    // Only initialize Lenis after the preloader finishes to prevent scrolling during load
    if (!preloaderFinished) return;

    // Initialize Lenis smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // Synchronize Lenis scrolling with GSAP ScrollTrigger updates
    lenis.on('scroll', ScrollTrigger.update);

    // Run Lenis in the GSAP ticker
    const rafCallback = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(rafCallback);

    // Disable lag smoothing in GSAP to prevent scroll desyncs
    gsap.ticker.lagSmoothing(0);

    // Refresh ScrollTrigger after a short delay to account for layout shifts when overflow is restored
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 500);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(rafCallback);
    };
  }, [preloaderFinished]);

  return (
    <>
      {!preloaderFinished && <Preloader onComplete={() => setPreloaderFinished(true)} />}
      
      <div style={{ opacity: preloaderFinished ? 1 : 0, transition: 'opacity 0.5s ease', pointerEvents: preloaderFinished ? 'auto' : 'none' }}>
        <ScrollToHash />
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<AllProjects />} />
          <Route path="/experience" element={<AllExperience />} />
        </Routes>
        <Footer />
        
        {/* Sticky Resume Button */}
        <div className="sticky-resume-btn-container">
          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="glow-btn">
            View Resume
          </a>
        </div>
      </div>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}

