'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  isLoading: boolean;
  onLoadingComplete?: () => void;
}

export default function LoadingScreen({ isLoading, onLoadingComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing');

  const loadingSteps = [
    { text: 'Initializing', progress: 20 },
    { text: 'Loading Assets', progress: 40 },
    { text: 'Connecting Services', progress: 60 },
    { text: 'Setting up Interface', progress: 80 },
    { text: 'Almost Ready', progress: 95 },
    { text: 'Welcome to EvonChat', progress: 100 },
  ];

  useEffect(() => {
    if (!isLoading) return;

    let currentStep = 0;
    const timer = setInterval(() => {
      if (currentStep < loadingSteps.length) {
        setLoadingText(loadingSteps[currentStep].text);
        setProgress(loadingSteps[currentStep].progress);
        currentStep++;
      } else {
        clearInterval(timer);
        setTimeout(() => {
          onLoadingComplete?.();
        }, 500);
      }
    }, 600);

    return () => clearInterval(timer);
  }, [isLoading, onLoadingComplete]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center relative overflow-hidden min-h-screen w-full"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          {/* Animated Background - Same as login screen */}
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
          {/* Particle Trail */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(15)].map((_, i) => {
              // Fixed positions to avoid hydration mismatch
              const positions = [
                { left: 10, top: 20 }, { left: 90, top: 15 }, { left: 30, top: 80 }, { left: 70, top: 30 },
                { left: 20, top: 60 }, { left: 85, top: 70 }, { left: 50, top: 40 }, { left: 15, top: 90 },
                { left: 75, top: 10 }, { left: 40, top: 85 }, { left: 95, top: 50 }, { left: 25, top: 25 },
                { left: 60, top: 75 }, { left: 35, top: 35 }, { left: 80, top: 90 }
              ];
              const position = positions[i] || { left: 50, top: 50 };
              
              return (
                <motion.div
                  key={`particle-${i}`}
                  className="absolute w-2 h-2 bg-white/30 rounded-full"
                  style={{
                    left: `${position.left}%`,
                    top: `${position.top}%`,
                  }}
                  animate={{
                    y: [0, -200, 0],
                    opacity: [0, 1, 0],
                    scale: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: 'easeOut',
                  }}
                />
              );
            })}
          </div>

          {/* Main Loading Content */}
          <div className="relative z-10 text-center">
            {/* Logo Animation */}
            <motion.div
              className="mb-12"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
            >
              <motion.div
                className="relative inline-block"
                animate={{ 
                  rotateY: [0, 360],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                <div className="text-6xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
                  EvonChat
                </div>
                
                {/* Glowing Ring */}
                <motion.div
                  className="absolute inset-0 rounded-full border-4 border-white/20"
                  style={{
                    width: '200px',
                    height: '200px',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                  }}
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />
              </motion.div>
            </motion.div>

            {/* Progress Section */}
            <motion.div
              className="w-80 mx-auto"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {/* Loading Text */}
              <motion.h2
                className="text-2xl font-semibold text-white mb-8"
                key={loadingText}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                {loadingText}
              </motion.h2>

              {/* Progress Bar Container */}
              <div className="relative mb-6">
                <div className="w-full h-2 bg-white/20 rounded-full backdrop-blur-sm">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full relative"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  >
                    {/* Glowing Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full animate-pulse" />
                  </motion.div>
                </div>
                
                {/* Progress Percentage */}
                <motion.div
                  className="absolute -top-8 right-0 text-white/80 text-sm font-medium"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {progress}%
                </motion.div>
              </div>

              {/* Loading Dots */}
              <div className="flex justify-center space-x-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-3 h-3 bg-white/60 rounded-full"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.2,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              className="text-white/70 text-lg mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
            >
              Preparing your chat experience...
            </motion.p>
          </div>

          {/* Corner Decorations */}
          <motion.div
            className="absolute top-10 left-10 w-20 h-20 border-l-4 border-t-4 border-white/20"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.5 }}
          />
          <motion.div
            className="absolute top-10 right-10 w-20 h-20 border-r-4 border-t-4 border-white/20"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.7 }}
          />
          <motion.div
            className="absolute bottom-10 left-10 w-20 h-20 border-l-4 border-b-4 border-white/20"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 0.9 }}
          />
          <motion.div
            className="absolute bottom-10 right-10 w-20 h-20 border-r-4 border-b-4 border-white/20"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 1 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}