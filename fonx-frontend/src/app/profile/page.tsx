'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import BackToHome from '../components/BackToHome';
import Toast from '../components/Toast';

export default function ProfilePage() {
  const [user, setUser] = useState<{ name: string; email: string; phone?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const router = useRouter();

  function formatPhone(value: string) {
    if (!value) return '';
    value = value.replace(/\D/g, '');
    value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
    value = value.replace(/(\d{5})(\d)/, '$1-$2');
    return value;
  }

  useEffect(() => {
    const fetchProfile = async () => {
      console.log('🔄 Buscando perfil...');
      try {
        const response = await fetch('/api/users/profile', {
          credentials: 'include',
          cache: 'no-store',
        });

        if (response.ok) {
          try {
            const data = await response.json();
            console.log('✅ Perfil carregado:', data);
            setUser(data);
          } catch (parseError) {
            console.error('⚠️ Erro ao fazer parse do JSON:', parseError);
          }
        } else {
          console.warn('🔐 Não autorizado. Redirecionando...');
          router.push('/login');
        }
      } catch (error) {
        console.error('❌ Erro ao buscar perfil:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/users/logout', {
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

  if (loading) {
    return <p className="loading-profile">carregando perfil...</p>;
  }

  if (!user) {
    return <p className="loading-profile">perfil não encontrado ou inválido.</p>;
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
