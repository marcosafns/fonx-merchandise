'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ProductCard } from './components/ProductCard';
import Image from 'next/image';

console.log('🚨 Estou no page.tsx da raiz');

import { Metadata } from 'next';

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = 4;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startAutoSlide = () => {
    intervalRef.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % totalSlides);
    }, 5000);
  };

  const stopAutoSlide = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, []);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % totalSlides);
    resetAutoSlide();
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + totalSlides) % totalSlides);
    resetAutoSlide();
  };

  const resetAutoSlide = () => {
    stopAutoSlide();
    startAutoSlide();
  };

  return (
    <main className="home-page">
      <section className="banner-carousel">
        <div className="carousel-container">
          <div
            className="carousel-track"
            style={{ transform: `translateX(-${currentSlide * 100}vw)` }}
          >
            <Image src="/imgs/banners/banner1.png" alt="Banner 1" className="carousel-image" />
            <Image src="/imgs/banners/banner2.png" alt="Banner 2" className="carousel-image" />
            <Image src="/imgs/banners/banner3.png" alt="Banner 3" className="carousel-image" />
            <Image src="/imgs/banners/banner4.png" alt="Banner 4" className="carousel-image" />
          </div>
        </div>

        <button className="carousel-button prev" onClick={prevSlide}>‹</button>
        <button className="carousel-button next" onClick={nextSlide}>›</button>
      </section>

      <section className="call-to-action">
        <h1>rico em atitude&apos;.</h1>
        <p>conheça a coleção da fonx&apos;. — streetwear premium pra quem tem atitude.</p>
        <Link href="/products" className="shop-button">
          ver produtos
        </Link>
      </section>

      <section className="highlight-products">
        <h2>produtos destaque</h2>
        <div className="products-grid">
          <ProductCard
            id={5}
            frontImg="/imgs/merch/tshirt-logoBlack.png"
            backImg="/imgs/merch/model-tshirt-logoBlack.png"
            title="t-shirt fonx&apos;. originals black"
            price="R$ 119.90"
            installments="ou 3x de R$ 39.96 sem juros"
          />
          <ProductCard
            id={6}
            frontImg="/imgs/merch/tshirt-logoWhite.png"
            backImg="/imgs/merch/model-tshirt-logoWhite.png"
            title="t-shirt fonx'. originals white"
            price="R$ 119.90"
            installments="ou 3x de R$ 39.96 sem juros"
          />
          <ProductCard
            id={7}
            frontImg="/imgs/merch/tshirt-deceptionBrown.png"
            backImg="/imgs/merch/model-tshirt-deceptionBrown.png"
            title="t-shirt fonx'. déception brown"
            price="R$ 129.90"
            installments="ou 3x de R$ 43.30 sem juros"
          />
        </div>
      </section>
    </main>
  );
}
