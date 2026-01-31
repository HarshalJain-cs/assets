import { useEffect, useRef, useState } from 'react';
import './App.css';

interface Position {
  x: number;
  y: number;
}

function App() {
  const [displayPos, setDisplayPos] = useState<Position>({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const targetRef = useRef<Position>({ x: 0, y: 0 });
  const currentRef = useRef<Position>({ x: 0, y: 0 });
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  useEffect(() => {
    const animate = () => {
      // Slower, smoother follow with reduced easing
      const easing = 0.08;
      
      currentRef.current.x += (targetRef.current.x - currentRef.current.x) * easing;
      currentRef.current.y += (targetRef.current.y - currentRef.current.y) * easing;
      
      setDisplayPos({
        x: currentRef.current.x,
        y: currentRef.current.y
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="container">
      <div
        className="cursor-ring"
        style={{
          left: displayPos.x,
          top: displayPos.y,
          opacity: isVisible ? 1 : 0,
        }}
      >
        <div className="cursor-dot" />
      </div>
    </div>
  );
}

export default App;
