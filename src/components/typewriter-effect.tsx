'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * @interface TypewriterEffectProps
 * @property {string} text - The text content to apply the typewriter effect to.
 * @property {number} [delay=0.05] - The delay between each character's animation in seconds.
 * @property {number} [duration=0.5] - The duration of each character's animation in seconds.
 */
interface TypewriterEffectProps {
  text: string;
  delay?: number;
  duration?: number;
}

/**
 * @component TypewriterEffect
 * @description A component that animates text with a typewriter effect, revealing characters sequentially.
 * @param {TypewriterEffectProps} props - The props for the TypewriterEffect component.
 */
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
        ease: "linear" as any, // Explicitly cast to any to bypass type error
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