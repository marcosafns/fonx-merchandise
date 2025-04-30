'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();
  const [isScrolled] = useState(false);

  

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    if (!menuOpen) setOverlayVisible(true);
    else setTimeout(() => setOverlayVisible(false), 300);
  };

  const closeMenu = () => {
    setMenuOpen(false);
    setTimeout(() => setOverlayVisible(false), 300);
  };

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/users/profile', {
        credentials: 'include',
      });
      setIsLoggedIn(response.ok);
    } catch {
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkAuth();

    const handleAuthChange = () => checkAuth();
    window.addEventListener('authChange', handleAuthChange);

    return () => {
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, [pathname]);

  const getAccountIcon = () => {
    if (isLoggedIn) {
      return pathname.startsWith('/profile')
        ? '/imgs/icons/profile-select.png'
        : '/imgs/icons/profile-default.png';
    } else {
      return '/imgs/icons/login.png';
    }
  };

  const getAccountLink = () => (isLoggedIn ? '/profile' : '/login');

  return (
    <>
      {overlayVisible && (
        <div className={`overlay ${menuOpen ? 'fade-in' : 'fade-out'}`} onClick={closeMenu}></div>
      )}

      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <div onClick={toggleMenu}>
          <Image src="/imgs/icons/menu-default.png" alt="menu" id="menuIcon" />
        </div>

        <div className="logo">
          <Link href="/">
            <Image src="/imgs/logo.png" alt="logo black" />
          </Link>
        </div>

        <div className="icons">
          <Link href="/cart">
            <Image src="/imgs/icons/cart-default.png" alt="carrinho" id="cartIcon" />
          </Link>

          <Link href={getAccountLink()}>
            <Image src={getAccountIcon()} alt="conta" id="accountIcon" />
          </Link>
        </div>
      </header>

      <div className={`side-menu ${menuOpen ? 'open' : ''}`}>
        <nav className="side-menu-nav">
          <Link href="/">início</Link>
          <Link href="/products">produtos</Link>
          <Link href="/cart">carrinho</Link>
          <Link href="/about">sobre nós</Link>
          <Link href="/policies">políticas</Link>
        </nav>
      </div>
    </>
  );
}
