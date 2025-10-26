'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface TypewriterEffectProps {
  text: string;
  delay?: number;
  duration?: number;
}

export function TypewriterEffect({ text, delay = 0.05, duration = 0.5 }: TypewriterEffectProps) {
  const words = text.split(' ');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: delay, delayChildren: 0.01 * i },
    }),
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: duration,
        ease: "easeOut", // Corrected easing value
      },
    },
  };

  return (
    <motion.h1
      className="text-4xl font-bold" // Apply existing styling
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, index) => (
        <motion.span key={word + index} className="inline-block mr-2">
          {Array.from(word).map((char, charIndex) => (
            <motion.span key={char + charIndex} variants={childVariants}>
              {char}
            </motion.span>
          ))}
        </motion.span>
      ))}
    </motion.h1>
  );
}