import React, { useMemo, useEffect, useRef } from "react";

const FloatingHashSymbols = ({ count = 80, opacity = 0.03 }) => {
  const containerRef = useRef(null);
  const elementsRef = useRef([]);
  const mouseRef = useRef({ x: -1000, y: -1000 }); // Out of bounds initially

  // Generate random properties once
  const symbols = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const rotate = Math.random() * 360; // full rotation range
      const duration = 20 + Math.random() * 30; // 20-50s
      const delay = Math.random() * -30; // negative for staggered start
      const fontSize = 2 + Math.random() * 4; // 2rem to 6rem
      const weight = Math.random() > 0.5 ? "font-black" : "font-bold";
      
      return {
        id: i,
        originalTop: top,
        originalLeft: left,
        rotate,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
        fontSize: `${fontSize}rem`,
        weight,
      };
    });
  }, [count]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        mouseRef.current = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
      }
    };
    
    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    let animationFrameId;
    const repellentRadius = 250;
    const maxOffset = 100;

    const renderLoop = () => {
      const { innerWidth, innerHeight } = window;
      const mouse = mouseRef.current;

      elementsRef.current.forEach((el, index) => {
        if (!el) return;
        
        const symbol = symbols[index];
        const symbolPxX = (symbol.originalLeft / 100) * innerWidth;
        const symbolPxY = (symbol.originalTop / 100) * innerHeight;

        let targetX = 0;
        let targetY = 0;

        const dx = symbolPxX - mouse.x;
        const dy = symbolPxY - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < repellentRadius) {
          const force = 1 - (distance / repellentRadius);
          targetX = (dx / distance) * force * maxOffset;
          targetY = (dy / distance) * force * maxOffset;
        }

        // Apply smooth transition using top/left to avoid overriding CSS transform animations
        const newLeftPercent = ((symbolPxX + targetX) / innerWidth) * 100;
        const newTopPercent = ((symbolPxY + targetY) / innerHeight) * 100;
        
        const boundedLeft = Math.max(0, Math.min(100, newLeftPercent));
        const boundedTop = Math.max(0, Math.min(100, newTopPercent));

        el.style.left = `${boundedLeft}%`;
        el.style.top = `${boundedTop}%`;
      });

      animationFrameId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [symbols]);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {symbols.map((symbol, i) => (
        <span
          key={symbol.id}
          ref={(el) => (elementsRef.current[i] = el)}
          className={`absolute text-slate-400 select-none animate-float-very-slow ${symbol.weight} transition-all duration-300 ease-out`}
          style={{
            top: `${symbol.originalTop}%`,
            left: `${symbol.originalLeft}%`,
            transform: `rotate(${symbol.rotate}deg)`,
            animationDuration: symbol.animationDuration,
            animationDelay: symbol.animationDelay,
            fontSize: symbol.fontSize,
            opacity: opacity,
          }}
        >
          #
        </span>
      ))}
    </div>
  );
};

export default FloatingHashSymbols;