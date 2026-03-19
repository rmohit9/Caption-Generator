import React, { useMemo, useState, useEffect, useRef } from "react";

const FloatingHashSymbols = ({ count = 80, opacity = 0.03 }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
      
      // Store original position
      const originalTop = top;
      const originalLeft = left;
      
      return {
        id: i,
        originalTop,
        originalLeft,
        top: `${top}%`,
        left: `${left}%`,
        transform: `rotate(${rotate}deg)`,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
        fontSize: `${fontSize}rem`,
        weight,
      };
    });
  }, [count]);

  // Calculate repellent position for each hashtag
  const getRepellentPosition = (symbol) => {
    const containerWidth = window.innerWidth;
    const containerHeight = window.innerHeight;
    
    // Convert percentage to pixels
    const symbolX = (symbol.originalLeft / 100) * containerWidth;
    const symbolY = (symbol.originalTop / 100) * containerHeight;
    
    // Calculate distance from mouse
    const dx = symbolX - mousePos.x;
    const dy = symbolY - mousePos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Repellent radius (in pixels) - increased for more sensitivity
    const repellentRadius = 250;
    
    if (distance < repellentRadius) {
      // Calculate repellent force (stronger when closer)
      const force = 1 - (distance / repellentRadius);
      const maxOffset = 100; // Maximum offset in pixels - increased for more movement
      
      // Calculate offset direction (away from mouse)
      const offsetX = (dx / distance) * force * maxOffset;
      const offsetY = (dy / distance) * force * maxOffset;
      
      // Convert back to percentage
      const newLeftPercent = ((symbolX + offsetX) / containerWidth) * 100;
      const newTopPercent = ((symbolY + offsetY) / containerHeight) * 100;
      
      // Keep within bounds
      const boundedLeft = Math.max(0, Math.min(100, newLeftPercent));
      const boundedTop = Math.max(0, Math.min(100, newTopPercent));
      
      return {
        top: `${boundedTop}%`,
        left: `${boundedLeft}%`,
      };
    }
    
    // Return original position if outside repellent radius
    return {
      top: `${symbol.originalTop}%`,
      left: `${symbol.originalLeft}%`,
    };
  };

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {symbols.map((symbol) => {
        const position = getRepellentPosition(symbol);
        return (
          <span
            key={symbol.id}
            className={`absolute text-gray-400 select-none animate-float-very-slow ${symbol.weight} transition-all duration-300 ease-out`}
            style={{
              top: position.top,
              left: position.left,
              transform: symbol.transform,
              animationDuration: symbol.animationDuration,
              animationDelay: symbol.animationDelay,
              fontSize: symbol.fontSize,
              opacity: opacity,
            }}
          >
            #
          </span>
        );
      })}
    </div>
  );
};

export default FloatingHashSymbols;