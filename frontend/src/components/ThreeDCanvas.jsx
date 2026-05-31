import { useEffect, useRef } from 'react';
import middleImage from '../assets/middleimage.jpeg';

export default function ThreeDCanvas() {
  const containerRef = useRef(null);
  const requestRef = useRef(null);

  // For smooth physics-like interpolation (lerping)
  const currentRotation = useRef({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentTranslate = useRef({ x: 0, y: 0 });
  const targetTranslate = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;

      // Get dimensions of viewport
      const { innerWidth, innerHeight } = window;
      
      // Calculate normalized mouse positions relative to screen center (-1 to 1)
      const x = (e.clientX - innerWidth / 2) / (innerWidth / 2);
      const y = -(e.clientY - innerHeight / 2) / (innerHeight / 2); // invert Y for standard Cartesian

      // Set target rotation (Max 15 degrees)
      targetRotation.current = {
        x: y * 12, // Tilts up/down
        y: x * 12  // Tilts left/right
      };

      // Set target translation for the inner image parallax (Max 15px)
      targetTranslate.current = {
        x: x * 18,
        y: -y * 18
      };
    };

    const handleMouseLeave = () => {
      // Return to center when mouse leaves
      targetRotation.current = { x: 0, y: 0 };
      targetTranslate.current = { x: 0, y: 0 };
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    
    // Smooth animation loop using lerping
    const animate = () => {
      const lerpFactor = 0.08; // speed of smooth animation

      // Interpolate rotation
      currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * lerpFactor;
      currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * lerpFactor;

      // Interpolate translation
      currentTranslate.current.x += (targetTranslate.current.x - currentTranslate.current.x) * lerpFactor;
      currentTranslate.current.y += (targetTranslate.current.y - currentTranslate.current.y) * lerpFactor;

      // Apply transforms directly to the DOM nodes for optimal performance
      if (containerRef.current) {
        const outer = containerRef.current.querySelector('.avatar-outer-ring');
        const inner = containerRef.current.querySelector('.avatar-inner-image');
        const glow = containerRef.current.querySelector('.avatar-bg-glow');

        if (outer) {
          outer.style.transform = `perspective(1000px) rotateX(${currentRotation.current.x}deg) rotateY(${currentRotation.current.y}deg)`;
        }
        if (inner) {
          inner.style.transform = `translate3d(${currentTranslate.current.x}px, ${currentTranslate.current.y}px, 20px) scale(1.1)`;
        }
        if (glow) {
          // Glow moves in opposite direction slightly to create depth
          glow.style.transform = `translate3d(${-currentTranslate.current.x * 0.5}px, ${-currentTranslate.current.y * 0.5}px, -10px)`;
        }
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <div className="canvas-container" ref={containerRef}>
      {/* Background glow shifting with parallax */}
      <div className="avatar-bg-glow" />

      {/* Outer rotating neon frame */}
      <div 
        className="avatar-outer-ring"
      >
        {/* Inner container to clip and handle image translation */}
        <div className="avatar-image-mask">
          <img 
            src={middleImage} 
            alt="Manav Avatar" 
            className="avatar-inner-image" 
          />
        </div>
      </div>
    </div>
  );
}
