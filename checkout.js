const yearElement = document.querySelector('#year');
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

const form = document.querySelector('#lead-form');
const emailInput = document.querySelector('#email');
const feedback = document.querySelector('#email-feedback');
const submitButton = form?.querySelector('button[type="submit"]');
const successPanel = document.querySelector('#lead-success');
const submittedEmail = document.querySelector('#submitted-email');
const securityNote = document.querySelector('.checkout-card__security');

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const setFeedback = (message = '', type = 'error') => {
  if (!feedback) return;

  feedback.textContent = message;
  feedback.dataset.type = type;
  feedback.style.color = type === 'success' ? '#d7a84d' : '#ff666b';
};

const setLoading = (isLoading) => {
  if (!submitButton) return;

  submitButton.disabled = isLoading;
  submitButton.innerHTML = isLoading
    ? '<span>Enviando seu acesso...</span>'
    : '<span>Receber material gratuito</span><span aria-hidden="true">↗</span>';
};

const showSuccess = (email) => {
  if (!form || !successPanel || !submittedEmail) return;

  submittedEmail.textContent = email;
  form.hidden = true;

  const cardIntroElements = document.querySelectorAll(
    '.checkout-card__emblem, .checkout-card__kicker, #checkout-title, .checkout-card__description'
  );

  cardIntroElements.forEach((element) => {
    element.hidden = true;
  });

  if (securityNote) {
    securityNote.hidden = true;
  }

  successPanel.hidden = false;
};

emailInput?.addEventListener('input', () => {
  emailInput.classList.remove('is-invalid');
  setFeedback();
});

form?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = emailInput?.value.trim() || '';

  if (!isValidEmail(email)) {
    emailInput?.classList.add('is-invalid');
    emailInput?.focus();
    setFeedback('Insira um e-mail válido para receber o material.');
    return;
  }

  const endpoint = form.dataset.endpoint?.trim();

  if (!endpoint) {
    setFeedback('A integração de envio ainda precisa ser conectada ao Brevo ou Supabase.');
    console.warn(
      'Cevora: adicione a URL da função de captura no atributo data-endpoint do formulário em checkout.html.'
    );
    return;
  }

  setLoading(true);
  setFeedback();

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        source: 'cevora-scripts-checkout',
        pageUrl: window.location.href,
        createdAt: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Falha no envio: ${response.status}`);
    }

    showSuccess(email);
  } catch (error) {
    console.error(error);
    setFeedback('Não foi possível enviar agora. Tente novamente em alguns instantes.');
  } finally {
    setLoading(false);
  }
});
