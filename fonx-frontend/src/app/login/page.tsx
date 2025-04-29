'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Cookies from 'js-cookie';
import '@/styles/styles.css';
import BackToHome from '../components/BackToHome';
import Toast from '../components/Toast'; // importa o Toast

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [toastMessage, setToastMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('https://api.fonx.com.br/api/users/login', {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setToastMessage('login realizado com sucesso!');
        setToastType('success');
        setShowToast(true);
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } else {
        setError(data.message || 'erro ao fazer login.');
        setToastMessage('erro ao fazer login!');
        setToastType('error');
        setShowToast(true);
      }
    } catch (err) {
      setError('erro de conexão com o servidor.' + err);
      setToastMessage('erro de conexão!');
      setToastType('error');
      setShowToast(true);
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <BackToHome /> 
        <h1 className="login-title">acesse sua conta</h1>

        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            placeholder="e-mail"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="senha"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-button">
            entrar
          </button>
        </form>

        {error && <p className="login-error">{error}</p>}

        <div className="login-divider">ou</div>

        <p className="login-register">
          não tem conta? <Link href="/register">cadastre-se</Link>
        </p>
      </div>

      {showToast && (
        <Toast 
          message={toastMessage}
          onClose={() => setShowToast(false)}
          type={toastType}
        />
      )}
    </div>
  );
}
