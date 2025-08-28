'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function AnimatedBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Floating shapes data
  const shapes = [
    { id: 1, size: 'w-32 h-32', delay: 0, x: '10%', y: '20%' },
    { id: 2, size: 'w-24 h-24', delay: 1, x: '80%', y: '10%' },
    { id: 3, size: 'w-40 h-40', delay: 2, x: '70%', y: '60%' },
    { id: 4, size: 'w-28 h-28', delay: 3, x: '20%', y: '70%' },
    { id: 5, size: 'w-36 h-36', delay: 4, x: '90%', y: '80%' },
    { id: 6, size: 'w-20 h-20', delay: 5, x: '15%', y: '45%' },
    { id: 7, size: 'w-44 h-44', delay: 6, x: '85%', y: '35%' },
    { id: 8, size: 'w-16 h-16', delay: 7, x: '5%', y: '90%' },
  ];

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900" />
      
      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-tr from-blue-600/30 via-transparent to-orange-400/20"
        animate={{
          background: [
            'linear-gradient(45deg, rgba(59, 130, 246, 0.3), transparent, rgba(251, 146, 60, 0.2))',
            'linear-gradient(225deg, rgba(147, 51, 234, 0.3), transparent, rgba(34, 197, 94, 0.2))',
            'linear-gradient(45deg, rgba(59, 130, 246, 0.3), transparent, rgba(251, 146, 60, 0.2))',
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Mouse following gradient */}
      <motion.div
        className="absolute w-96 h-96 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15), rgba(59, 130, 246, 0.1), transparent)',
          left: `${mousePosition.x}%`,
          top: `${mousePosition.y}%`,
          transform: 'translate(-50%, -50%)',
        }}
        transition={{
          type: 'spring',
          stiffness: 50,
          damping: 20,
        }}
      />

      {/* Floating geometric shapes */}
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className={`absolute ${shape.size} rounded-full opacity-10`}
          style={{
            left: shape.x,
            top: shape.y,
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
            backdropFilter: 'blur(1px)',
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 6 + shape.delay,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: shape.delay,
          }}
        />
      ))}

      {/* Floating particles */}
      {isClient && Array.from({ length: 20 }).map((_, i) => {
        // Use fixed seed-based positions to avoid hydration mismatch
        const fixedPositions = [
          { left: 15, top: 25 }, { left: 85, top: 15 }, { left: 45, top: 75 }, { left: 75, top: 35 },
          { left: 25, top: 85 }, { left: 95, top: 55 }, { left: 35, top: 45 }, { left: 65, top: 65 },
          { left: 5, top: 95 }, { left: 55, top: 5 }, { left: 80, top: 90 }, { left: 10, top: 60 },
          { left: 40, top: 30 }, { left: 70, top: 80 }, { left: 90, top: 40 }, { left: 20, top: 70 },
          { left: 60, top: 20 }, { left: 30, top: 90 }, { left: 85, top: 25 }, { left: 15, top: 85 }
        ];
        
        const position = fixedPositions[i] || { left: 50, top: 50 };
        
        return (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            style={{
              left: `${position.left}%`,
              top: `${position.top}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + (i % 3),
              repeat: Infinity,
              delay: (i % 5) * 0.4,
              ease: 'easeOut',
            }}
          />
        );
      })}

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <svg width="100%" height="100%">
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="white"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Bottom blur effect */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent" />
    </div>
  );
}