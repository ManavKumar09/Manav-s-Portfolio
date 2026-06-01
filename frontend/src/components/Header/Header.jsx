import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    if (!menuOpen) {
      document.body.style.overflow = 'hidden'; // Prevents background scroll when menu is open
    } else {
      document.body.style.overflow = '';
    }
  };

  const closeMenu = () => {
    setMenuOpen(false);
    document.body.style.overflow = '';
  };

  const handleHashClick = (e, hash) => {
    closeMenu();
    // If already on the homepage, manually scroll to bypass React Router's URL cache limitation
    if (window.location.pathname === '/') {
      e.preventDefault();
      setTimeout(() => {
        const element = document.getElementById(hash.replace('#', ''));
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50); // slight delay to let menu start closing
      window.history.pushState(null, '', `/${hash}`);
    }
  };

  return (
    <>
      <header className={`header ${isScrolled ? 'scrolled' : ''} ${menuOpen ? 'menu-active' : ''}`}>
        <div className="header-container">
          <Link to="/#hero" className="logo" onClick={closeMenu}>
            MK<span className="logo-dot">.</span>
          </Link>
          <button
            className={`hamburger ${menuOpen ? 'is-active' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle navigation"
            id="nav-hamburger"
          >
            <span className="hamburger-box">
              <span className="hamburger-inner"></span>
            </span>
          </button>
        </div>
      </header>

      <div className={`nav-overlay ${menuOpen ? 'is-active' : ''}`}>
        <nav className="nav-overlay-menu">
          <Link to="/#hero" className="nav-overlay-link" onClick={(e) => handleHashClick(e, '#hero')}>HOME</Link>
          <Link to="/experience" className="nav-overlay-link" onClick={closeMenu}>EXPERIENCE</Link>
          <Link to="/projects" className="nav-overlay-link" onClick={closeMenu}>PROJECTS</Link>
          <Link to="/#contact" className="nav-overlay-link" onClick={(e) => handleHashClick(e, '#contact')}>CONTACT</Link>
        </nav>
      </div>
    </>
  );
}
