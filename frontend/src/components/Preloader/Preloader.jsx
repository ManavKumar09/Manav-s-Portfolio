import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import './Preloader.css';

export default function Preloader({ onComplete }) {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const barRef = useRef(null);
  const percentRef = useRef(null);

  useEffect(() => {
    // Prevent scrolling while preloader is active
    document.body.style.overflow = 'hidden';

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = '';
        if (onComplete) onComplete();
      }
    });

    // 1. Text fades in and moves up slightly
    tl.fromTo(textRef.current, 
      { opacity: 0, y: 30 }, 
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    );

    // 2. Animate the loading bar and percentage counter simultaneously
    const duration = 2.5; // Simulate load time
    
    tl.to(barRef.current, {
      width: '100%',
      duration: duration,
      ease: 'power2.inOut'
    }, "-=0.5");

    tl.to(percentRef.current, {
      innerHTML: 100,
      duration: duration,
      ease: 'power2.inOut',
      snap: { innerHTML: 1 }, // Snap to whole numbers
      onUpdate: function() {
        if (percentRef.current) {
          percentRef.current.innerText = Math.round(this.targets()[0].innerHTML) + '%';
        }
      }
    }, "<"); // Run at the exact same time as the bar

    // 3. Stagger out the text and bar
    tl.to([textRef.current, '.preloader-bottom-container'], {
      opacity: 0,
      y: -30,
      duration: 0.8,
      ease: 'power3.in',
      delay: 0.2
    });

    // 4. Slide the entire preloader background UP to reveal the site
    tl.to(containerRef.current, {
      yPercent: -100,
      duration: 1.2,
      ease: 'power4.inOut'
    });

    return () => {
      document.body.style.overflow = '';
    };
  }, [onComplete]);

  return (
    <div className="preloader-container" ref={containerRef}>
      <div className="preloader-content">
        <div className="preloader-logo" ref={textRef}>
          MK<span className="preloader-dot">.</span>
        </div>
        
        <div className="preloader-bottom-container">
          <div className="preloader-bar-bg">
            <div className="preloader-bar-fill" ref={barRef}></div>
          </div>
          <div className="preloader-percent" ref={percentRef}>0%</div>
        </div>
      </div>
    </div>
  );
}
