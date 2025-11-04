'use client';

import { usePathname } from 'next/navigation';
import { Header } from './header';
import React from 'react';

export function ConditionalHeader() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return !isHomePage ? <Header /> : null;
}
