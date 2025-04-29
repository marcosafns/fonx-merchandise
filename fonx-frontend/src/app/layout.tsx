'use client';

import '../styles/styles.css';
import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Header from './components/Header';
import Footer from './components/Footer';

export default function RootLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Verifica se está nas páginas especiais
  const hideLayout = pathname.startsWith('/login') || pathname.startsWith('/profile') || pathname.startsWith('/register') || pathname.startsWith('/edit');

  return (
    <html lang="pt-br">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/imgs/icons/nipple.ico" />
      </head>

      <body>
        {/* Só mostra Header e Footer se NÃO tiver em login/profile */}
        {!hideLayout && <Header />}
        
        <main className="main-content">
          {children}
        </main>

        {!hideLayout && <Footer />}
      </body>
    </html>
  )
}
