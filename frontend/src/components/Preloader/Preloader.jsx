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

    // 3. Fade out the loading bar and percentage first
    tl.to('.preloader-bottom-container', {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.out',
      delay: 0.2
    });

    // 4. Netflix-style massive zoom on the MK. logo
    tl.to(textRef.current, {
      scale: 150, // Massive zoom towards the camera
      opacity: 0,
      duration: 1.6,
      ease: 'power2.in'
    }, "-=0.2");

    // 5. Fade out the background to reveal the website
    tl.to(containerRef.current, {
      opacity: 0,
      duration: 1.2,
      ease: 'power2.inOut'
    }, "-=1.2");

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
