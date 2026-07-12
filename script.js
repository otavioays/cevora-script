const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    });
  },
  {
    threshold: 0.12,
    rootMargin: '0px 0px -40px',
  }
);

revealElements.forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
  revealObserver.observe(element);
});

const yearElement = document.querySelector('#year');
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

const checkoutLinks = document.querySelectorAll('[data-checkout]');
checkoutLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();

    const checkoutUrl = link.dataset.checkoutUrl || 'checkout.html';
    window.location.href = checkoutUrl;
  });
});

const header = document.querySelector('.site-header');
let previousScrollPosition = window.scrollY;

window.addEventListener(
  'scroll',
  () => {
    if (!header) return;

    const currentScrollPosition = window.scrollY;
    header.classList.toggle('is-scrolled', currentScrollPosition > 24);
    previousScrollPosition = currentScrollPosition;
  },
  { passive: true }
);
