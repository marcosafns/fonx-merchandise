'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BackToHome from '../components/BackToHome';
import Toast from '../components/Toast';

export default function ProfilePage() {
  const [user, setUser] = useState<{ name: string; email: string; phone?: string } | null>(null);
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);

  function formatPhone(value: string) {
    if (!value) return '';
    value = value.replace(/\D/g, '');
    value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
    value = value.replace(/(\d{5})(\d)/, '$1-$2');
    return value;
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/profile', {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('erro ao buscar perfil:', error);
        router.push('/login');
      }
    };

    fetchProfile();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/api/logout', {
        method: 'POST',
        credentials: 'include',
      });

      window.dispatchEvent(new Event('authChange'));
      setShowToast(true);
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (error) {
      console.error('erro ao deslogar:', error);
    }
  };

  if (!user) {
    return <p className="loading-profile">carregando perfil...</p>;
  }

  return (
    <div className="profile-page">
      <div className="profile-card">
        <BackToHome />
        <h1 className="profile-title">meu perfil</h1>

        <div className="profile-info">
          <p><strong>nome:</strong> {user.name}</p>
          <p><strong>email:</strong> {user.email}</p>
          {user.phone && <p><strong>telefone:</strong> {formatPhone(user.phone)}</p>}
        </div>

        <div className="profile-actions">
          <button className="edit-button" onClick={() => router.push('/profile/edit')}>editar perfil</button>
          <button className="logout-button" onClick={handleLogout}>sair</button>
        </div>
      </div>

      {showToast && (
        <Toast 
          message="logout realizado com sucesso!"
          onClose={() => setShowToast(false)}
          type="success"
        />
      )}
    </div>
  );
}
