'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <Link href="/">
            <Image src="/imgs/logo-footer.png" alt="logo" className="logo-footer" />
          </Link>
          <p className="footer-description">
            rico em atitude&apos;.
          </p>
        </div>
        <div className="footer-section">
          <h3>contatos</h3>
          <div className="contact-line">
            <Image src="/imgs/icons/email.png" alt="E-mail" className="contact-icon" />
            <span><Link href="mailto:contato@fonx.com.br">contato@fonx.com.br</Link></span>
          </div>
          <div className="contact-line">
            <Image src="/imgs/icons/instagram.png" alt="Instagram" className="contact-icon" />
            <span><Link href="https://www.instagram.com/official.fonx/" target='_blank'>@official.fonx</Link></span>
          </div>
          <div className="contact-line">
            <Image src="/imgs/icons/wpp.png" alt="WhatsApp" className="contact-icon" />
            <span><Link href="https://chat.whatsapp.com/GINial1AZ8v2tzzzdawN0E" target='_blank'>grupo VIP fonx&apos;.</Link></span>
          </div>
        </div>
        <div className="footer-section">
          <h3>formas de pagamento</h3>
          <div className="payment-line">
            <Image src="/imgs/icons/pix.png" alt="pix" />
            <Image src="/imgs/icons/cartao.png" alt="débito / crédito" />
            <Image src="/imgs/icons/boleto.png" alt="boleto bancário" />
          </div>
          <div className="payment-line">
            <Image src="/imgs/icons/visa.png" alt="visa"/>
            <Image src="/imgs/icons/mastercard.png" alt="visa"/>
            <Image src="/imgs/icons/elo.png" alt="visa"/>
            <Image src="/imgs/icons/american-express.png" alt="visa"/>
          </div>
        </div>
        <div className="footer-section">
          <h3>institucional</h3>
          <Link href="/">início</Link>
          <Link href="/products/">produtos</Link>
          <Link href="/cart/">carrinho</Link>
          <Link href="/about/">sobre nós</Link>
          <Link href="/policies/">políticas de privacidade</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <p>fonx&apos;. merchandise — copyright © 2025 — todos os direitos reservados.</p>
      </div>
    </footer>
  );
}
