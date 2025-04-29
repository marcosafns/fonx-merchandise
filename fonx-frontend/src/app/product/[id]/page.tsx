'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Toast from '@/app/components/Toast';
import router from 'next/router';
import Image from 'next/image';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  size: string;
  image_url: string;
  back_image_url: string;
  high_res_url: string;
  back_high_res_url: string;
}


export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'default'>('default');
  const [mainImage, setMainImage] = useState<string>('');
  const [isFading, setIsFading] = useState(false);
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
          setMainImage(data.high_res_url); // <<< inicia a imagem principal com a high-res
        } else {
          console.error('Erro ao buscar produto.');
        }
      } catch (error) {
        console.error('Erro de conexão:', error);
      }
    };
  
    if (id) {
      fetchProduct();
    }
  }, [id]);
  

  const checkAuth = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/profile', {
        credentials: 'include',
      });
      return response.ok;
    } catch {
      return false;
    }
  };   

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size);
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
        } else {
          console.error('Erro ao buscar produto.');
        }
      } catch (error) {
        console.error('Erro de conexão:', error);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (!product) {
    return <p>carregando...</p>;
  }

  const handleAddToCart = async () => {
    if (!selectedSize) {
      setToastMessage('por favor, selecione um tamanho antes de adicionar.');
      setToastType('error');
      setShowToast(true);
      return;
    }
  
    const isLoggedIn = await checkAuth();
  
    if (!isLoggedIn) {
      setToastMessage('você precisa estar logado para adicionar ao carrinho.');
      setToastType('error');
      setShowToast(true);
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/api/cart/add', {
        method: 'POST',
        credentials: 'include', // MUITO importante
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_name: product?.name,
          product_img: product?.image_url,
          price: product?.price,
          quantity: 1,
          size: selectedSize,
        }),
      });
  
      if (response.ok) {
        setToastMessage('produto adicionado ao carrinho!');
        setToastType('success');
        setShowToast(true);
  
        setTimeout(() => {
          router.push('/cart');
        }, 1000);
      } else {
        throw new Error('Erro ao adicionar no carrinho');
      }
    } catch (error) {
      console.error(error);
      setToastMessage('erro ao adicionar ao carrinho.');
      setToastType('error');
      setShowToast(true);
    }
  };
  return (
    <div className="product-page-container">
      <div className="product-page-left">
      <Image
        src={mainImage}
        alt={product.name}
        className={`product-page-main-image ${isFading ? 'fade' : ''}`}
      />
        <div className="product-page-thumbnails">
          <Image
            src={product.high_res_url}
            alt="Frente"
            className="thumbnail-image"
            onClick={() => {
              setIsFading(true);
              setTimeout(() => {
                setMainImage(product.high_res_url);
                setIsFading(false);
              }, 200); // tempo da animação (200ms)
            }}            
          />
          <Image
            src={product.back_high_res_url}
            alt="Costas"
            className="thumbnail-image"
            onClick={() => {
              setIsFading(true);
              setTimeout(() => {
                setMainImage(product.back_high_res_url);
                setIsFading(false);
              }, 200);
            }}
          />
      </div>
    </div>
      <div className="product-page-right">
        <div>
          <h1 className="product-page-title">{product.name}</h1>

          <div className="product-page-price-frete">
            <div className="product-page-price-parcelas">
              <p className="product-page-price">R$ {Number(product.price).toFixed(2)}</p>
              <p className="product-page-installments">ou 3x de R$ {(Number(product.price) / 3).toFixed(2)} sem juros</p>
            </div>
          </div>

          <div className="product-page-size-color">
            <h3>tamanho</h3>
            <div className="product-page-size-options">
              {['p', 'm', 'g', 'gg'].map((size) => (
                <button
                  key={size}
                  className={`size-option ${selectedSize === size ? 'selected' : ''}`}
                  onClick={() => handleSizeSelect(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="product-page-button-container">
          <button className="product-page-add-to-cart-button" onClick={handleAddToCart}>
            adicionar ao carrinho
          </button>
        </div>
      </div>
      {showToast && (
      <Toast
        message={toastMessage}
        type={toastType}
        onClose={() => setShowToast(false)}
      />)}
    </div>
  );
}
