'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface CartItem {
  id: number;
  product_name: string;
  product_img: string;
  size: string;
  price: number;
  quantity: number;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const updateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return; // Evitar quantidade 0 ou negativa
  
    try {
      const response = await fetch(`http://localhost:5000/api/cart/update/${itemId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });
  
      if (response.ok) {
        const updatedItems = cartItems.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        );
        setCartItems(updatedItems);
      } else {
        console.error('Erro ao atualizar quantidade');
      }
    } catch (error) {
      console.error('Erro de conexão:', error);
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      const response = await fetch(`http://localhost:5000/api/cart/remove/${itemId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
  
      if (response.ok) {
        const updatedItems = cartItems.filter((item) => item.id !== itemId);
        setCartItems(updatedItems);
      } else {
        console.error('Erro ao remover item');
      }
    } catch (error) {
      console.error('Erro de conexão:', error);
    }
  };
  

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/cart', {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setCartItems(data);
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Erro ao buscar carrinho:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [router]);


  const getTotal = () => {
    return cartItems.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0);
  };

  if (loading) {
    return <p>carregando carrinho...</p>;
  }

  if (cartItems.length === 0) {
    return <p>seu carrinho está vazio.</p>;
  }

  return (
    <div className="cart-page">
      <h1>carrinho de compras</h1>

      <div className="cart-items">
        {cartItems.map(item => (
          <div key={item.id} className="cart-item">
            <Image src={item.product_img} alt={item.product_name} className="cart-item-image" />
            <div className="cart-item-info">
              <h2>{item.product_name}</h2>
              <p>tamanho: {item.size}</p>
              <p>preço: R$ {Number(item.price).toFixed(2)}</p>
              <div className="cart-item-actions">
                <div className="cart-quantity">
                  <button className="quantity-button" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button className="quantity-button" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
                <button className="remove-button" onClick={() => removeItem(item.id)}>remover</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-total">
        <h2>total: R$ {getTotal().toFixed(2)}</h2>
      </div>
    </div>
  );
}
