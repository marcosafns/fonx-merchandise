'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BackToHome from '../components/BackToHome';
import Toast from '../components/Toast';
import '@/styles/styles.css';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [toastMessage, setToastMessage] = useState('');

  function formatPhone(value: string) {
    value = value.replace(/\D/g, ''); // remove tudo que não é número
    value = value.replace(/^(\d{2})(\d)/g, '($1) $2'); // (11) 9
    value = value.replace(/(\d{5})(\d)/, '$1-$2'); // (11) 91234-5678
    return value;
  }
  

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setToastMessage('As senhas não coincidem.');
      setToastType('error');
      setShowToast(true);
      return;
    }

    try {
      const response = await fetch('https://api.fonx.com.br/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password }),
      });

      if (response.ok) {
        setToastMessage('conta criada com sucesso!');
        setToastType('success');
        setShowToast(true);

        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        const data = await response.json();
        setToastMessage(data.message || 'erro ao criar conta.');
        setToastType('error');
        setShowToast(true);
      }
    } catch (error) {
      setToastMessage('Erro de conexão.' + error);
      setToastType('error');
      setShowToast(true);
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <BackToHome />
        <h1 className="login-title">criar conta</h1>

        <form onSubmit={handleRegister} className="login-form">
          <input
            type="text"
            placeholder="nome"
            className="login-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="e-mail"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="telefone"
            className="login-input"
            value={phone}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
          />

          <input
            type="password"
            placeholder="senha"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="confirmar senha"
            className="login-input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit" className="login-button">
            criar conta
          </button>
        </form>

        <div className="login-divider">ou</div>

        <p className="login-link">
          já tem conta? <Link href="/login">entrar</Link>
        </p>
      </div>

      {/* Toast */}
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
