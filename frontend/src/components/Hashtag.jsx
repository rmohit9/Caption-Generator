import React, { useMemo } from "react";

const FloatingHashSymbols = ({ count = 80, opacity = 0.03 }) => {
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

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {symbols.map((style, index) => (
        <span
          key={index}
          className={`absolute text-gray-400 select-none animate-float-very-slow ${style.weight}`}
          style={{
            top: style.top,
            left: style.left,
            transform: style.transform,
            animationDuration: style.animationDuration,
            animationDelay: style.animationDelay,
            fontSize: style.fontSize,
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