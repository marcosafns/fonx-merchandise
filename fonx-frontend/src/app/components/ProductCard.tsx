'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ProductCardProps {
  id: number;
  frontImg: string;
  backImg: string;
  title: string;
  price: string;
  installments: string;
}

export function ProductCard({ id, frontImg, backImg, title, price, installments }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const handleClick = () => {
    console.log('ID do produto:', id);
    router.push(new URL(`/product/${id}`, window.location.origin).toString());
  };

  return (
    <div
      className={`product-card ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      <h3 className="product-title">{title}</h3>
      <div className="product-image-container">
        <Image
          src={isHovered ? backImg : frontImg}
          alt={title}
          className="product-image"
        />
      </div>
      <div className="product-info">
        <p className="price">{price}</p>
        <p className="installments">{installments}</p>
      </div>
    </div>
  );
}
