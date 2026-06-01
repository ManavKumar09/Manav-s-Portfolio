import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import './Contact.css';

gsap.registerPlugin(ScrollTrigger);

const VISME_EMBED_SCRIPT =
  'https://static-bundles.visme.co/forms/vismeforms-embed.js';
const VISME_FORM_OPEN_URL =
  'https://forms.visme.co/formsPlayer/j0noxneg-untitled-project';

let vismeScriptPromise = null;

function loadVismeEmbedScript() {
  if (vismeScriptPromise) {
    return vismeScriptPromise;
  }

  vismeScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(
      `script[src="${VISME_EMBED_SCRIPT}"]`
    );

    if (existing) {
      if (existing.dataset.loaded === 'true') {
        resolve();
        return;
      }
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', reject);
      return;
    }

    const script = document.createElement('script');
    script.src = VISME_EMBED_SCRIPT;
    script.async = true;
    script.onload = () => {
      script.dataset.loaded = 'true';
      resolve();
    };
    script.onerror = reject;
    document.body.appendChild(script);
  });

  return vismeScriptPromise;
}

export default function Contact() {
  const containerRef = useRef(null);
  const formContainerRef = useRef(null);
  const [embedReady, setEmbedReady] = useState(false);
  const [scriptError, setScriptError] = useState(false);

  useEffect(() => {
    const node = formContainerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEmbedReady(true);
          observer.disconnect();
        }
      },
      { rootMargin: '120px', threshold: 0.1 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!embedReady) return;

    let cancelled = false;

    loadVismeEmbedScript().catch(() => {
      if (!cancelled) setScriptError(true);
    });

    return () => {
      cancelled = true;
    };
  }, [embedReady]);

  useGSAP(() => {
    gsap.fromTo(
      '.contact-section .section-title',
      { opacity: 0, y: 50 },
      {
        scrollTrigger: {
          trigger: '.contact-section',
          start: 'top 80%',
        },
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
      }
    );

    gsap.fromTo(
      '.contact-info',
      { opacity: 0, x: -60 },
      {
        scrollTrigger: {
          trigger: '.contact-grid',
          start: 'top 85%',
        },
        opacity: 1,
        x: 0,
        duration: 1,
        ease: 'power3.out',
      }
    );
  }, { scope: containerRef });

  return (
    <section id="contact" className="contact-section" ref={containerRef}>
      <div className="container">
        <h2 className="section-title">
          GET IN <span>TOUCH</span>
        </h2>
        <div className="contact-grid">
          <div className="contact-info">
            <h3 className="contact-pitch-title">Let's build something epic!</h3>
            <p className="contact-pitch-desc">
              Have a project in mind, want to collaborate on a full-stack system, or
              just want to chat about web technology? Send me a message and I'll get
              back to you as soon as possible.
            </p>

            <div className="social-links">
              <a
                href="https://github.com/ManavKumar09"
                target="_blank"
                rel="noreferrer"
                className="social-link-item"
                aria-label="GitHub"
              >
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/manav-kumar-cr23"
                target="_blank"
                rel="noreferrer"
                className="social-link-item"
                aria-label="LinkedIn"
              >
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/manavkumar_23/?__pwa=1#"
                target="_blank"
                rel="noreferrer"
                className="social-link-item"
                aria-label="Instagram"
              >
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
            </div>
          </div>

          <div className="contact-form-container" ref={formContainerRef}>
            {embedReady && !scriptError && (
              <div
                className="visme_d contact-visme-embed"
                data-title="Ecommerce Registration Form Template"
                data-url="j0noxneg-untitled-project"
                data-domain="forms"
                data-full-page="false"
                data-min-height="500px"
                data-form-id="182922"
              />
            )}

            {!embedReady && !scriptError && (
              <div className="contact-form-placeholder" aria-hidden="true" />
            )}

            {scriptError && (
              <div className="contact-form-mobile">
                <p className="contact-form-mobile-text">
                  The form could not load. Open it directly below.
                </p>
                <a
                  href={VISME_FORM_OPEN_URL}
                  className="glow-btn contact-form-open-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  OPEN CONTACT FORM
                </a>
              </div>
            )}

            {embedReady && !scriptError && (
              <p className="contact-form-fallback">
                Form not loading?{' '}
                <a
                  href={VISME_FORM_OPEN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open it in a new tab
                </a>
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
