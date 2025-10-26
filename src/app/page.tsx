'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CircularLogo } from '@/components/circular-logo'; // Import CircularLogo
import { HoverCard } from '@/components/hover-card';
import { TypewriterEffect } from '@/components/typewriter-effect'; // Import TypewriterEffect

const navItems = [
  {
    title: 'Dashboard',
    description: 'Overview of your NFT collection.',
    href: '/dashboard',
    icon: '📊', // Suitable emoji for Dashboard
  },
  {
    title: 'Goal Keeper Stats',
    description: 'Analyze goalkeeper performance.',
    href: '/goalkeeper-stats',
    icon: '🥅', // Suitable emoji for Goal Keeper Stats
  },
  {
    title: 'Player Stats',
    description: 'View individual player statistics.',
    href: '/player-stats',
    icon: '🏃', // Suitable emoji for Player Stats
  },
  {
    title: 'Scoring Method',
    description: 'Define and manage scoring rules.',
    href: '/scoring-method',
    icon: '🔢', // Suitable emoji for Scoring Method
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <div className="flex flex-col items-center mb-8">
        <CircularLogo /> {/* Use CircularLogo component */}
        <TypewriterEffect text="NFT Weingarten - Penalty Tracker" /> {/* Use TypewriterEffect component */}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {navItems.map((item) => (
          <Link key={item.title} href={item.href} passHref>
            <HoverCard title={item.title} description={item.description} href={item.href} icon={item.icon} />
          </Link>
        ))}
      </div>
    </div>
  );
}
