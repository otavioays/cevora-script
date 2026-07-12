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
    ? '<span>Confirmando seu acesso...</span>'
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

  try {
    sessionStorage.setItem('cevoraLeadEmail', email);
    sessionStorage.setItem('cevoraLeadConfirmed', 'true');
  } catch (error) {
    console.warn('Cevora: não foi possível salvar os dados da sessão.', error);
  }

  successPanel.hidden = false;

  window.setTimeout(() => {
    window.location.href = 'oto.html';
  }, 650);
};

emailInput?.addEventListener('input', () => {
  emailInput.classList.remove('is-invalid');
  setFeedback();
});

form?.addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = emailInput?.value.trim() || '';
  const endpoint = form.dataset.endpoint;

  if (!emailInput?.checkValidity()) {
    emailInput?.classList.add('is-invalid');
    setFeedback('Digite um endereço de e-mail válido.');
    emailInput?.focus();
    return;
  }

  if (!endpoint) {
    setFeedback('A integração ainda não foi configurada.');
    return;
  }

  const query = new URLSearchParams(window.location.search);

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
        utmSource: query.get('utm_source'),
        utmMedium: query.get('utm_medium'),
        utmCampaign: query.get('utm_campaign'),
        utmContent: query.get('utm_content'),
      }),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok || !result.ok) {
      throw new Error(
        result.error || 'Não foi possível confirmar seu acesso.'
      );
    }

    setFeedback(
      'Tudo certo. O material foi enviado para seu e-mail.',
      'success'
    );

    showSuccess(email);
  } catch (error) {
    console.error('Cevora: erro ao cadastrar lead.', error);

    setFeedback(
      error instanceof Error
        ? error.message
        : 'Ocorreu um erro. Tente novamente.'
    );
  } finally {
    setLoading(false);
  }
});
