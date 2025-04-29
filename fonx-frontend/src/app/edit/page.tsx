'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BackToHome from '../components/BackToHome';
import Toast from '../components/Toast'; // importa seu Toast certinho

export default function EditProfilePage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [toastMessage, setToastMessage] = useState('');
  const router = useRouter();

  function formatPhone(value: string) {
    value = value.replace(/\D/g, '');
    value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
    value = value.replace(/(\d{5})(\d)/, '$1-$2');
    return value;
  }  

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('https://api.fonx.com.br/api/profile', {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setName(data.user.name || '');
          setEmail(data.user.email || '');
          setPhone(data.user.phone || '');
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Erro ao buscar perfil:', error);
        router.push('/login');
      }
    };

    fetchProfile();
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('https://api.fonx.com.br/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, phone }),
      });

      if (response.ok) {
        setToastMessage('perfil atualizado com sucesso!');
        setToastType('success');
        setShowToast(true);

        setTimeout(() => {
          router.push('/profile');
        }, 2000); // depois de 2 segundos volta
      } else {
        const data = await response.json();
        setToastMessage(data.message || 'erro ao atualizar perfil.');
        setToastType('error');
        setShowToast(true);
      }
    } catch (err) {
      setToastMessage('Erro de conexão.' + err);
      setToastType('error');
      setShowToast(true);
    }
  };

  return (
    <div className="edit-profile-page">
      <div className="edit-profile-card">
        <BackToHome />
        <h1 className="edit-profile-title">editar perfil</h1>

        <form onSubmit={handleSave} className="edit-profile-form">
          <input
            type="text"
            placeholder="nome"
            className="edit-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="e-mail"
            className="edit-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="telefone"
            className="edit-input"
            value={phone}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
          />


          <button type="submit" className="save-button">salvar</button>

          {error && <p className="edit-error">{error}</p>}
        </form>
      </div>

      {/* Toast aparece se precisar */}
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
