'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ToastProps {
  message: string;
  onClose: () => void;
  showCartButton?: boolean;
  type?: 'success' | 'error' | 'default'; // <<< adicionei isso
}

export default function Toast({ message, onClose, showCartButton = false, type = 'default' }: ToastProps) {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const handleViewCart = () => {
    onClose();
    router.push('/cart');
  };

  const getToastClass = () => {
    if (type === 'success') return 'toast-success';
    if (type === 'error') return 'toast-error';
    return 'toast-default';
  };

  return (
    <div className={`toast ${getToastClass()}`}>
      {message}
      {showCartButton && (
        <button className="toast-button" onClick={handleViewCart}>
          Ver Carrinho
        </button>
      )}
    </div>
  );
}
