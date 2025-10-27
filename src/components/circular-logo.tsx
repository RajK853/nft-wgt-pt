'use client';

import Image from 'next/image';
import { motion, useAnimation } from "framer-motion";
import React from 'react'; // useState is no longer needed

/**
 * @component CircularLogo
 * @description A circular logo component with Framer Motion animations.
 * It features a gentle pulse on hover and a ripple effect on click.
 */
export function CircularLogo({ className }: { className?: string }) {
  const controls = useAnimation();
  // isHovered state is no longer needed

  /**
   * Handles the click event on the logo, triggering a ripple animation.
   */
  const handleLogoClick = () => {
    controls.start({
      boxShadow: [
        "0 0 0px 0px rgba(255, 255, 255, 0)",
        "0 0 0px 15px rgba(255, 255, 255, 0.4)",
        "0 0 0px 30px rgba(255, 255, 255, 0)",
      ],
      transition: { duration: 0.5, ease: "easeOut" },
    });
  };

  return (
    <motion.div
      className={`rounded-full overflow-hidden w-[150px] h-[150px] mb-4 ${className}`}
      onClick={handleLogoClick}
      animate={controls}
      whileTap={{ scale: 0.9 }} // Optional: slight press effect on click
      // onHoverStart and onHoverEnd are no longer needed
      // initial={{ scale: 1 }} is no longer needed
      whileHover={{ scale: [1, 1.05, 1], transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" } }} // Gentle pulse on hover
    >
      <Image
        src="/nft-logo.jpg"
        alt="NFT Logo"
        width={150}
        height={150}
        className="w-full h-full object-cover"
      />
    </motion.div>
  );
}