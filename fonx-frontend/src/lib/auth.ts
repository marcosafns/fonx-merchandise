'use client';

import Cookies from 'js-cookie';

export function isAuthenticated() {
  const token = Cookies.get('fonx_token');
  return !!token; // retorna true se tem token, false se não tem
}
