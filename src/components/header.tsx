import React from 'react';
import Link from 'next/link';
import { CircularLogo } from './circular-logo';

export function Header() {
  return (
    <header className="bg-gray-800 text-white p-4 flex items-center justify-between">
      <div className="flex items-center">
        <Link href="/">
          <CircularLogo className="mr-4" width={75} height={75} />
        </Link>
        <span className="text-xl font-bold">NFT Weingarten Penalty Tracker</span>
      </div>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <Link href="/" className="hover:text-gray-300">
              Home
            </Link>
          </li>
          <li>
            <Link href="/scoring-method" className="hover:text-gray-300">
              Scoring Method
            </Link>
          </li>
          <li>
            <Link href="/player-stats" className="hover:text-gray-300">
              Player Stats
            </Link>
          </li>
          <li>
            <Link href="/goalkeeper-stats" className="hover:text-gray-300">
              Goalkeeper Stats
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
