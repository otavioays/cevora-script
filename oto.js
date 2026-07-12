const yearElement = document.querySelector('#year');
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

const revealElements = document.querySelectorAll('.reveal');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (reducedMotion) {
  revealElements.forEach((element) => element.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -45px',
    }
  );

  revealElements.forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index % 3, 2) * 70}ms`;
    observer.observe(element);
  });
}

const purchaseButtons = document.querySelectorAll('[data-purchase]');
purchaseButtons.forEach((button) => {
  button.addEventListener('click', (event) => {
    const checkoutUrl = button.dataset.checkoutUrl?.trim();

    if (!checkoutUrl) {
      event.preventDefault();

      const originalContent = button.innerHTML;
      button.setAttribute('aria-disabled', 'true');
      button.innerHTML = '<span>Link de pagamento será conectado aqui</span>';

      window.setTimeout(() => {
        button.innerHTML = originalContent;
        button.removeAttribute('aria-disabled');
      }, 2300);

      console.warn(
        'Cevora: adicione o link de pagamento no atributo data-checkout-url do botão em oto.html.'
      );
      return;
    }

    event.preventDefault();
    window.location.href = checkoutUrl;
  });
});

const deliveryNoticeStyles = document.createElement('style');
deliveryNoticeStyles.textContent = `
  .delivery-notice {
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: grid;
    place-items: center;
    padding: 1.25rem;
    background: rgba(0, 0, 0, 0.78);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    opacity: 0;
    visibility: hidden;
    transition: opacity 220ms ease, visibility 220ms ease;
  }

  .delivery-notice.is-open {
    opacity: 1;
    visibility: visible;
  }

  .delivery-notice__panel {
    position: relative;
    width: min(100%, 520px);
    padding: clamp(1.6rem, 5vw, 2.6rem);
    overflow: hidden;
    color: #d8d0c7;
    border: 1px solid rgba(215, 168, 77, 0.46);
    background:
      radial-gradient(circle at 80% 0%, rgba(215, 168, 77, 0.12), transparent 13rem),
      linear-gradient(155deg, #17110c, #070605 64%);
    box-shadow:
      inset 0 0 0 5px #080706,
      inset 0 0 0 6px rgba(215, 168, 77, 0.08),
      0 35px 100px rgba(0, 0, 0, 0.65);
    transform: translateY(16px) scale(0.98);
    transition: transform 220ms ease;
  }

  .delivery-notice.is-open .delivery-notice__panel {
    transform: translateY(0) scale(1);
  }

  .delivery-notice__panel::before {
    content: '';
    position: absolute;
    top: 0;
    left: 10%;
    width: 80%;
    height: 1px;
    background: linear-gradient(90deg, transparent, #d7a84d, transparent);
    box-shadow: 0 0 20px rgba(215, 168, 77, 0.65);
  }

  .delivery-notice__close {
    position: absolute;
    top: 0.85rem;
    right: 0.85rem;
    display: grid;
    width: 38px;
    height: 38px;
    place-items: center;
    color: #a49a90;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.025);
    font-size: 1.25rem;
    cursor: pointer;
  }

  .delivery-notice__icon {
    display: grid;
    width: 58px;
    height: 58px;
    margin-bottom: 1.35rem;
    place-items: center;
    color: #090706;
    border-radius: 50%;
    background: linear-gradient(145deg, #f4d58f, #b77b22);
    box-shadow: 0 0 30px rgba(215, 168, 77, 0.22);
    font-size: 1.5rem;
    font-weight: 800;
  }

  .delivery-notice__eyebrow {
    margin: 0 0 0.65rem;
    color: #d7a84d;
    font-size: 0.67rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }

  .delivery-notice__title {
    margin: 0 0 1rem;
    color: #f6f1eb;
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(2rem, 7vw, 3rem);
    font-weight: 600;
    line-height: 0.98;
  }

  .delivery-notice__text {
    margin: 0 0 0.85rem;
    color: #bdb3a9;
    font-size: 0.95rem;
    line-height: 1.7;
  }

  .delivery-notice__email {
    display: block;
    margin: 1rem 0 1.4rem;
    padding: 0.85rem 1rem;
    overflow-wrap: anywhere;
    color: #f1d69e;
    border: 1px solid rgba(215, 168, 77, 0.18);
    background: rgba(215, 168, 77, 0.04);
    font-size: 0.82rem;
  }

  .delivery-notice__button {
    width: 100%;
    min-height: 54px;
    color: #fff;
    border: 1px solid rgba(255, 74, 80, 0.65);
    background: linear-gradient(180deg, #ed252c, #a1070c);
    box-shadow: 0 16px 35px rgba(227, 31, 37, 0.18);
    font-size: 0.78rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
  }

  @media (prefers-reduced-motion: reduce) {
    .delivery-notice,
    .delivery-notice__panel {
      transition: none;
    }
  }
`;
document.head.appendChild(deliveryNoticeStyles);

const deliveryNotice = document.createElement('div');
deliveryNotice.className = 'delivery-notice';
deliveryNotice.setAttribute('role', 'dialog');
deliveryNotice.setAttribute('aria-modal', 'true');
deliveryNotice.setAttribute('aria-labelledby', 'delivery-notice-title');

let leadEmail = '';
try {
  leadEmail = sessionStorage.getItem('cevoraLeadEmail') || '';
} catch (error) {
  console.warn('Cevora: não foi possível recuperar o e-mail da sessão.', error);
}

const emailMarkup = leadEmail
  ? `<strong class="delivery-notice__email">${leadEmail.replace(/[&<>'"]/g, (character) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;',
    })[character])}</strong>`
  : '';

deliveryNotice.innerHTML = `
  <div class="delivery-notice__panel">
    <button class="delivery-notice__close" type="button" aria-label="Fechar aviso">×</button>
    <div class="delivery-notice__icon" aria-hidden="true">✓</div>
    <p class="delivery-notice__eyebrow">Envio confirmado</p>
    <h2 class="delivery-notice__title" id="delivery-notice-title">Seu acesso já está a caminho.</h2>
    <p class="delivery-notice__text">
      O e-mail contendo o link de acesso aos Scripts da Cevora já foi enviado.
    </p>
    ${emailMarkup}
    <p class="delivery-notice__text">
      Verifique sua caixa de entrada. Caso não encontre em alguns minutos, confira também as pastas <strong>Spam</strong> e <strong>Promoções</strong>.
    </p>
    <button class="delivery-notice__button" type="button">Entendi, continuar</button>
  </div>
`;

document.body.appendChild(deliveryNotice);

const closeDeliveryNotice = () => {
  deliveryNotice.classList.remove('is-open');
  document.body.style.overflow = '';
};

const openDeliveryNotice = () => {
  deliveryNotice.classList.add('is-open');
  document.body.style.overflow = 'hidden';
  deliveryNotice.querySelector('.delivery-notice__close')?.focus();
};

deliveryNotice.querySelectorAll('button').forEach((button) => {
  button.addEventListener('click', closeDeliveryNotice);
});

deliveryNotice.addEventListener('click', (event) => {
  if (event.target === deliveryNotice) {
    closeDeliveryNotice();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && deliveryNotice.classList.contains('is-open')) {
    closeDeliveryNotice();
  }
});

window.setTimeout(openDeliveryNotice, reducedMotion ? 0 : 250);
