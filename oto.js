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
