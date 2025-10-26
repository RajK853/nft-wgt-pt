'use client';

import { motion, useAnimate } from "framer-motion";
import React from "react"; // useState is no longer needed
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface HoverCardProps {
  title: string;
  description: string;
  icon: string; // Add icon prop
  href: string; // Add href prop
}

export function HoverCard({ title, description, icon, href }: HoverCardProps) {
  // isHovered state is no longer needed
  const [scope, animate] = useAnimate();

  function sequence() {
    animate([
      [scope.current, { scale: 1.3 }, { type: "spring", stiffness: 400, damping: 10 }], // Big bounce out
      [scope.current, { scale: 1 }, { type: "spring", stiffness: 400, damping: 10 }], // Bounce back to original size
    ]);
  }

  return (
    <motion.div
      ref={scope}
      // onHoverStart and onHoverEnd are no longer needed
      onTap={sequence}
      style={{
        width: 288, // Equivalent to w-72 (72 * 4 = 288px)
        height: 192, // Equivalent to h-48 (48 * 4 = 192px)
        borderRadius: 10,
        backgroundColor: "#333333", // Fixed darker neutral background color
        cursor: "pointer",
      }}
      initial={{ scale: 1 }} // Initial scale for whileHover
      whileHover={{ scale: 1.05, transition: { type: "spring", stiffness: 400, damping: 10 } }} // Gentle z-axis scale on hover
      // animate and transition props for hover are replaced by whileHover
    >
      <Card className="w-full h-full flex flex-col justify-center items-center text-center bg-transparent border-none shadow-none">
        <CardHeader>
          <p className="text-4xl mb-2">{icon}</p> {/* Render emoji icon */}
          <CardTitle className="text-white">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-white">{description}</CardDescription>
        </CardContent>
      </Card>
    </motion.div>
  );
}
