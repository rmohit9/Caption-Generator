import React from 'react'

export default function FloatingHashtag() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(40)].map((_, i) => (
          <span
            key={i}
            className="absolute text-gray-400 font-black select-none animate-float-very-slow"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              fontSize: `${2 + Math.random() * 5}rem`,
              opacity: 0.03,
              transform: `rotate(${Math.random() * 360}deg)`,
              animationDuration: `${20 + Math.random() * 30}s`,
              animationDelay: `${Math.random() * -30}s`,
            }}
          >
            #
          </span>
        ))}
      </div>
  )
}
