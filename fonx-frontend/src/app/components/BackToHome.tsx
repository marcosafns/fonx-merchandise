'use client'

import Link from 'next/link';

export default function BackToHome() {
  return (
    <Link href="/" className="back-home-button">
      ←
    </Link>
  );
}
